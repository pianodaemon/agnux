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

        def cover_xml_lacks(pag_id):
            SQL = """
                WHERE ="""
            for row in self.pg_query(conn, "{0}'{1}'".format(SQL, pag_id)):
                # Just taking first row of query result
                return {
                    'TEL': row['tel'],
                    'WWW': row['www'],
                    'CFDI_ORIGIN_PLACE': row['lugar_exp'],
                    'INCEPTOR_REGIMEN': row['regimen'],
                    'INCEPTOR_TOWN': row['colonia'],
                    'INCEPTOR_SETTLEMENT': row['municipio'],
                    'INCEPTOR_STATE': row['estado'],
                    'INCEPTOR_STREET': row['calle'],
                    'INCEPTOR_STREET_NUMBER': row['no'],
                    'RECEPTOR_STREET': row['rcalle'],
                    'RECEPTOR_STREET_NUMBER': row['rno'],
                    'RECEPTOR_SETTLEMENT': row['rmunicipio'],
                    'RECEPTOR_COUNTRY': row['rpais'],
                    'RECEPTOR_STATE': row['restado'],
                    'RECEPTOR_TOWN': row['rcolonia'],
                    'RECEPTOR_CP': row['rcp']
                }

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
        return


    def data_rel(self, dat):
        os.remove(dat['QRCODE'])
