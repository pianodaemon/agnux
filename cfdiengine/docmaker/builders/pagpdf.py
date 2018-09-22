from docmaker.gen import BuilderGen
from docmaker.error import DocBuilderStepError
from misc.numspatrans import numspatrans
from sat.requirement import qrcode_cfdi

from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER

import misc.helperstr as strtricks
import sat.reader as xmlreader
import os


impt_class='PagPdf'


class PagPdf(BuilderGen):

    __VERIFICATION_URL = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx'

    def __init__(self, logger):
        super().__init__(logger)

    def data_acq(self, conn, d_rdirs, **kwargs):

        def fetch_info(f):
            parser = xmlreader.SaxReader()
            try:
                return parser(f)
            except xml.sax.SAXParseException as e:
                raise DocBuilderStepError("cfdi xml could not be parsed : {}".format(e))
            except Exception as e:
                raise DocBuilderStepError("xsl could not be applied : {}".format(e))

        rfc = kwargs.get('rfc', None)
        if rfc is None:
            raise DocBuilderStepError("rfc not found")

        xml = kwargs.get('xml', None)
        if xml is None:
            raise DocBuilderStepError("xml not found")
        f_xml = os.path.join(d_rdirs['cfdi_output'], rfc, xml)
        if not os.path.isfile(f_xml):
            raise DocBuilderStepError("cfdi xml not found")

        xml_parsed, original = fetch_info(f_xml)

        f_qr = qrcode_cfdi(self.__VERIFICATION_URL,
                           xml_parsed['UUID'],
                           xml_parsed['INCEPTOR_RFC'],
                           xml_parsed['RECEPTOR_RFC'],
                           xml_parsed['CFDI_TOTAL'],
                           xml_parsed['CFD_SEAL'][-8:])

        logo_filename = os.path.join(d_rdirs['images'],
                                     "{}_logo.png".format(rfc))
        if not os.path.isfile(logo_filename):
            raise DocBuilderStepError("logo image {0} not found".format(logo_filename))

        return {
            'STAMP_ORIGINAL_STR': original,
            'XML_PARSED': xml_parsed,
            'QRCODE': f_qr,
            'LOGO': logo_filename,
            'FOOTER_ABOUT': "ESTE DOCUMENTO ES UNA REPRESENTACIÓN IMPRESA DE UN CFDI",
        }

    def format_wrt(self, output_file, dat):
        self.logger.debug('dumping contents of dat: {}'.format(repr(dat)))

        # outline story for document's sake
        story = self.__outline_story(dat)

        # setup document template
        doc = BaseDocTemplate(output_file, pagesize=letter,
        rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=18,)

        def fp_foot(c, d):
            c.saveState()
            width, height = letter
            c.setFont('Helvetica', 7)
            c.drawCentredString(width / 2.0, (1.00 * cm), dat['FOOTER_ABOUT'])
            c.restoreState()

        bill_frame = Frame(
            doc.leftMargin, doc.bottomMargin, doc.width, doc.height,
            id='bill_frame'
        )

        doc.addPageTemplates(
            [
                PageTemplate(id='biil_page', frames=[bill_frame], onPage=fp_foot),
            ]
        )

        # apply story to document
        doc.build(story, canvasmaker=NumberedCanvas)
        return


    def data_rel(self, dat):
        os.remove(dat['QRCODE'])


    def __outline_story(self, dat):
        """In this handler should be conform the story"""
        story = []

        # load on memory image instances
        logo = Image(dat['LOGO'])
        logo.drawHeight = 3.8*cm
        logo.drawWidth = 5.2*cm

        # Gerardo should start off from here




        # Items story segment
        story.append(self.__items_section(dat))
        story.append(Spacer(1, 0.4 * cm))



        # QR and stamping story segment
        qrcode = Image(dat['QRCODE'])
        qrcode.drawHeight = 3.2*cm
        qrcode.drawWidth = 3.2*cm

        story.append(Spacer(1, 0.6 * cm))
        story.append(self.__info_cert_section(dat))
        story.append(self.__info_stamp_section(qrcode, dat))
        story.append(self.__info_cert_extra(dat))
        story.append(Spacer(1, 0.6 * cm))

        return story


    def __items_section(self, dat):
        add_currency_simbol = lambda c: '${0:>40}'.format(c)

        st = ParagraphStyle(
            name='info',
            fontName='Helvetica',
            fontSize=7,
            leading=8
        )
        header_concepts = (
            'CLAVE', 'DESCRIPCIÓN',
            'UNIDAD', 'CANTIDAD',
            'P. UNITARIO', 'IMPORTE'
        )

        cont_concepts = []
        for i in dat['XML_PARSED']['ARTIFACTS']:
            row = [
                i['CLAVEPRODSERV'],
                Paragraph(i['DESCRIPCION'], st),
                i['CLAVEUNIDAD'].upper(),
                strtricks.HelperStr.format_currency(i['CANTIDAD']),
                add_currency_simbol(strtricks.HelperStr.format_currency(i['VALORUNITARIO'])),
                add_currency_simbol(strtricks.HelperStr.format_currency(i['IMPORTE']))
            ]
            cont_concepts.append(row)

        cont = [header_concepts] + cont_concepts

        table = Table(cont,
            [
                2.2 * cm,
                5.6 * cm,
                2.3 * cm,
                2.3 * cm,
                3.8 * cm,
                3.8 * cm
            ]
        )

        table.setStyle( TableStyle([
            #Body and header look and feel (common)
            ('ALIGN', (0,0),(-1,0), 'CENTER'),
            ('VALIGN', (0,0),(-1,-1), 'TOP'),
            ('BOX', (0, 0), (-1, 0), 0.25, colors.black),
            ('BACKGROUND', (0,0),(-1,0), colors.black),
            ('TEXTCOLOR', (0,0),(-1,0), colors.white),
            ('FONT', (0, 0), (-1, -1), 'Helvetica', 7),
            ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 7),
            ('ROWBACKGROUNDS', (0, 1),(-1, -1), [colors.white, colors.aliceblue]),
            ('ALIGN', (0, 1),(1, -1), 'LEFT'),
            ('ALIGN', (2, 0),(2, -1), 'CENTER'),
            ('ALIGN', (3, 1),(-1, -1), 'RIGHT'),

            #Clave column look and feel (specific)
            ('BOX', (0, 1), (0, -1), 0.25, colors.black),

            #Description column look and feel (specific)
            ('BOX', (1, 1), (1, -1), 0.25, colors.black),

            #Unit column look and feel (specific)
            ('BOX', (2, 1), (2, -1), 0.25, colors.black),

            #Amount column look and feel (specific)
            ('BOX', (3, 1),(3, -1), 0.25, colors.black),

            #Amount column look and feel (specific)
            ('BOX', (4, 1),(4, -1), 0.25, colors.black),

            #Amount column look and feel (specific)
            ('BOX', (5, 1),(5, -1), 0.25, colors.black),

            #Amount column look and feel (specific)
            ('BOX', (6, 1),(6, -1), 0.25, colors.black),

            #Amount column look and feel (specific)
            ('BOX', (7, 1),(7, -1), 0.25, colors.black),
        ]))

        return table


    def __info_cert_section(self, dat):
        cont = [['INFORMACIÓN DEL TIMBRE FISCAL DIGITAL']]
        st = ParagraphStyle(name='info', fontName='Helvetica', fontSize=6.5, leading = 8)
        table = Table(cont,
            [
                20.0 * cm
            ],
            [
                0.50 * cm,
            ]
        )
        table.setStyle( TableStyle([
            ('BOX', (0, 0), (0, 0), 0.25, colors.black),
            ('VALIGN', (0, 0),(0, 0), 'MIDDLE'),
            ('ALIGN', (0, 0),(0, 0), 'LEFT'),
            ('FONT', (0, 0), (0, 0), 'Helvetica-Bold', 7),
            ('BACKGROUND', (0, 0),(0, 0), colors.black),
            ('TEXTCOLOR', (0, 0),(0, 0), colors.white)
        ]))

        return table


    def __info_cert_extra(self, dat):

        cont = []
        st = ParagraphStyle(name='info', fontName='Helvetica', fontSize=6.7, leading = 8)

        time_cert_info = {
            'label': "FECHA Y HORA DE CERTIFICACIÓN:",
            'scn': dat['XML_PARSED']['STAMP_DATE'],
        }

        no_cert_info = {
            'label': "NO. CERTIFICADO DEL SAT:",
            'scn': dat['XML_PARSED']['SAT_CERT_NUMBER'],
        }

        p_ti = '''<para align=center><b>%(label)s</b> %(scn)s</para>''' % time_cert_info
        p_no = '''<para align=center><b>%(label)s</b> %(scn)s</para>''' % no_cert_info

        cont.append([Paragraph(p_no, st), '', Paragraph(p_ti, st)])

        table = Table(cont,
            [
                8.0 * cm,
                1.0 * cm,
                9.0 * cm,
            ],
            [
                0.50*cm,
            ]
        )
        table.setStyle( TableStyle([
            ('BOX', (0, 0), (0, 0), 0.25, colors.black),

            ('VALIGN', (0, 0),(-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0),(-1, -1), 'CENTER'),

            ('BOX', (2, 0), (2, 0), 0.25, colors.black)
        ]))

        return table


    def __info_stamp_section(self, cedula, dat):

        def seals():
            c = []
            st = ParagraphStyle(name='seal', fontName='Helvetica', fontSize=6.5, leading=8)
            c.append(["CADENA ORIGINAL DEL TIMBRE:"])
            c.append([Paragraph(dat['STAMP_ORIGINAL_STR'], st)])

            c.append(["SELLO DIGITAL DEL EMISOR:"])
            c.append([Paragraph(dat['XML_PARSED']['CFD_SEAL'], st)])

            c.append(["SELLO DIGITAL DEL SAT:"])
            c.append([Paragraph(dat['XML_PARSED']['SAT_SEAL'], st)])

            t = Table(
                c,
                [
                    15.5 * cm
                ],
                [
                    0.45 * cm,
                    1.2 * cm,
                    0.4 * cm,
                    0.92 * cm,
                    0.4 * cm,
                    1.15 * cm
                ]
            )
            t.setStyle( TableStyle([
                ('FONT', (0, 0), (0, 0), 'Helvetica-Bold', 6.5),
                ('FONT', (0, 2), (0, 2), 'Helvetica-Bold', 6.5),
                ('FONT', (0, 4), (0, 4), 'Helvetica-Bold', 6.5),
            ]))
            return t

        cont = [[cedula, seals()]]

        table = Table(cont,
            [
                4.0 * cm,
                16.0 * cm
            ],
            [
                4.5 * cm
            ]
        )

        table.setStyle( TableStyle([
            ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
            ('VALIGN', (0, 0),(-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0),(0, 0), 'CENTER'),

            ('ALIGN', (1, 0),(1, 0), 'LEFT'),
            ('BACKGROUND', (1, 0),(1, 0), colors.aliceblue),
            ('LINEBEFORE',(1,0),(1,0), 0.25, colors.black)
        ]))

        return table


class NumberedCanvas(canvas.Canvas):

    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        """add page info to each page (page x of y)"""
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        width, height = letter
        self.setFont("Helvetica", 7)
        self.drawCentredString(width / 2.0, 0.65*cm,
            "Pagina %d de %d" % (self._pageNumber, page_count))
