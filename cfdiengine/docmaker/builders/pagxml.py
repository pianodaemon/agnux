import unidecode
import math
import os
import base64
import datetime
import tempfile
import pyxb
from decimal import Decimal
from misc.helperstr import HelperStr
from docmaker.error import DocBuilderStepError
from misc.tricks import truncate
from docmaker.gen import BuilderGen
from sat.v33 import Comprobante
from sat.requirement import writedom_cfdi, sign_cfdi
from sat.artifacts import CfdiType


impt_class='PagXml'


class PagXml(BuilderGen):

    __NDECIMALS = 2
    __MAKEUP_PROPOS = CfdiType.PAG
    __XSLT_PAG = 'cadenaoriginal_3_3.xslt'

    def __init__(self, logger):
        super().__init__(logger)

    def __narf(self, v):
        return  Decimal(truncate(float(v), self.__NDECIMALS, True))

    def __q_cert_file(self, conn, usr_id):
        """
        Consulta el certificado que usa el usuario en dbms
        """
        q = """select fac_cfds_conf.archivo_certificado as cert_file
            FROM gral_suc AS SUC
            LEFT JOIN gral_usr_suc ON gral_usr_suc.gral_suc_id = SUC.id
            LEFT JOIN fac_cfds_conf ON fac_cfds_conf.gral_suc_id = SUC.id
            WHERE gral_usr_suc.gral_usr_id = """
        for row in self.pg_query(conn, "{0}{1}".format(q, usr_id)):
            # Just taking first row of query result
            return row['cert_file']

    def __q_serie_folio(self, conn, usr_id):
        """
        Consulta la serie y folio a usar en dbms
        """
        q = """select fac_cfds_conf_folios.serie as serie,
            fac_cfds_conf_folios.folio_actual::character varying as folio
            FROM gral_suc AS SUC
            LEFT JOIN fac_cfds_conf ON fac_cfds_conf.gral_suc_id = SUC.id
            LEFT JOIN fac_cfds_conf_folios ON fac_cfds_conf_folios.fac_cfds_conf_id = fac_cfds_conf.id
            LEFT JOIN gral_usr_suc AS USR_SUC ON USR_SUC.gral_suc_id = SUC.id
            WHERE fac_cfds_conf_folios.proposito = 'PAG'
            AND USR_SUC.gral_usr_id = """
        for row in self.pg_query(conn, "{0}{1}".format(q, usr_id)):
            # Just taking first row of query result
            return { 'SERIE': row['serie'], 'FOLIO': row['folio'] }

    def __q_emisor(self, conn, usr_id):
        """
        Consulta el emisor en dbms
        """
        q = """select upper(EMP.rfc) as rfc, upper(EMP.titulo) as titulo,
            upper(REG.numero_control) as numero_control
            FROM gral_suc AS SUC
            LEFT JOIN gral_usr_suc AS USR_SUC ON USR_SUC.gral_suc_id = SUC.id
            LEFT JOIN gral_emp AS EMP ON EMP.id = SUC.empresa_id
            LEFT JOIN cfdi_regimenes AS REG ON REG.numero_control = EMP.regimen_fiscal
            WHERE USR_SUC.gral_usr_id = """
        for row in self.pg_query(conn, "{0}{1}".format(q, usr_id)):
            # Just taking first row of query result
            return {
                'RFC': row['rfc'],
                'RAZON_SOCIAL': unidecode.unidecode(row['titulo']),
                'REGIMEN_FISCAL': row['numero_control']
            }

    def __q_receptor(self, conn, pag_id):
        """
        Consulta el cliente de el pago en dbms
        """
        SQL = """SELECT
            upper(cxc_clie.razon_social) as razon_social,
            upper(cxc_clie.rfc) as rfc
            FROM erp_pagos
            LEFT JOIN cxc_clie ON cxc_clie.id = erp_pagos.cliente_id
            WHERE erp_pagos.numero_transaccion = """
        for row in self.pg_query(conn, "{0}{1}".format(SQL, pag_id)):
            # Just taking first row of query result
            return {
                'RFC': row['rfc'],
                'RAZON_SOCIAL': unidecode.unidecode(row['razon_social']),
                'USO_CFDI': 'P01'
            }

    def __q_no_certificado(self, conn, usr_id):
        """
        Consulta el numero de certificado en dbms
        """
        q = """select CFDI_CONF.numero_certificado
            FROM gral_suc AS SUC
            LEFT JOIN gral_usr_suc AS USR_SUC ON USR_SUC.gral_suc_id = SUC.id
            LEFT JOIN fac_cfds_conf AS CFDI_CONF ON CFDI_CONF.gral_suc_id = SUC.id
            WHERE USR_SUC.gral_usr_id = """
        for row in self.pg_query(conn, "{0}{1}".format(q, usr_id)):
            # Just taking first row of query result
            return row['numero_certificado']

    def __q_sign_params(self, conn, usr_id):
        """
        Consulta parametros requeridos para firmado cfdi
        """
        q = """SELECT fac_cfds_conf.archivo_llave as pk
            FROM gral_suc AS SUC
            LEFT JOIN gral_usr_suc AS USR_SUC ON USR_SUC.gral_suc_id = SUC.id
            LEFT JOIN fac_cfds_conf ON fac_cfds_conf.gral_suc_id = SUC.id
            WHERE USR_SUC.gral_usr_id="""
        for row in self.pg_query(conn, "{0}{1}".format(q, usr_id)):
            # Just taking first row of query result
            return {
                'PKNAME': row['pk']
            }

    def __q_moneda(self, conn, pag_id):
        """
        Consulta la moneda de el pago en dbms
        """
        q = """SELECT
            upper(iso_4217),
            upper(simbolo_moneda_fac) as moneda_simbolo,
            tipo_cambio
            FROM pagos
            WHERE numero_transaccion = """
        for row in self.pg_query(conn, "{0}{1}".format(q, pag_id)):
            # Just taking first row of query result
            return {
                'ISO_4217': row['iso_4217'],
                'SIMBOLO': row['moneda_simbolo'],
                'TIPO_DE_CAMBIO': row['tipo_cambio']
            }

    def __q_conceptos(self, conn):
        """
        Hack que consulta los conceptos de el pago en dbms
        """
        q = """SELECT '84111506'::character varying AS clave_prod,
            'ACT'::character varying AS clave_unidad,
            'ACT'::character varying AS unidad,
            '1'::double precision AS cantidad,
            '0'::character varying AS no_identificacion,
            'Pago'::character varying AS descripcion,
            '0'::double precision as valor_unitario,
            '0'::double precision as importe """
        rowset = []
        for row in self.pg_query(conn, "{0}{1}".format(q)):
            rowset.append({
                'PRODSERV': row['clave_prod'],
                'SKU': row['no_identificacion'],
                'UNIDAD': row['clave_unidad'],
                'CANTIDAD': row['cantidad'],
                'DESCRIPCION': row['descripcion'],
                'PRECIO_UNITARIO': self.__narf(row['valor_unitario']),
                'IMPORTE': self.__narf(row['importe']),
            })
        return rowset


    def data_acq(self, conn, d_rdirs, **kwargs):

        usr_id = kwargs.get('usr_id', None)

        if usr_id is None:
            raise DocBuilderStepError("user id not fed")

        ed = self.__q_emisor(conn, usr_id)
        sp = self.__q_sign_params(conn, usr_id)

        # dirs with full emisor rfc path
        sslrfc_dir = os.path.join(d_rdirs['ssl'], ed['RFC'])
        cert_file = os.path.join(
                sslrfc_dir, self.__q_cert_file(conn, usr_id))

        certb64 = None
        with open(cert_file, 'rb') as f:
            content = f.read()
            certb64 = base64.b64encode(content).decode('ascii')

        pag_id = kwargs.get('pag_id', None)

        if pag_id is None:
            raise DocBuilderStepError("pag id not fed")

        conceptos = self.__q_conceptos(conn)

        return {
            'MONEDA': self.__q_moneda(conn, pag_id),
            'TIME_STAMP': '{0:%Y-%m-%dT%H:%M:%S}'.format(datetime.datetime.now()),
            'CONTROL': self.__q_serie_folio(conn, usr_id),
            'CERT_B64': certb64,
            'KEY_PRIVATE': os.path.join(sslrfc_dir, sp['PKNAME']),
            'XSLT_SCRIPT': os.path.join(d_rdirs['cfdi_xslt'], self.__XSLT_PAG),
            'EMISOR': ed,
            'NUMERO_CERTIFICADO': self.__q_no_certificado(conn, usr_id),
            'RECEPTOR': self.__q_receptor(conn, pag_id),
            'LUGAR_EXPEDICION': self.__q_lugar_expedicion(conn, usr_id),
            'CONCEPTOS': conceptos,
        }


    def format_wrt(self, output_file, dat):

        self.logger.debug('dumping contents of dat: {}'.format(repr(dat)))

        c = Comprobante()
        c.Version = '3.3'
        c.Fecha = dat['TIME_STAMP']
        c.Sello = '__DIGITAL_SIGN_HERE__'

        c.Receptor = pyxb.BIND()
        c.Receptor.Nombre = dat['RECEPTOR']['RAZON_SOCIAL']  # optional
        c.Receptor.Rfc = dat['RECEPTOR']['RFC']
        c.Receptor.UsoCFDI = dat['RECEPTOR']['USO_CFDI']

        c.Emisor = pyxb.BIND()
        c.Emisor.Nombre = dat['EMISOR']['RAZON_SOCIAL']  # optional
        c.Emisor.Rfc = dat['EMISOR']['RFC']
        c.Emisor.RegimenFiscal = dat['EMISOR']['REGIMEN_FISCAL']

        c.LugarExpedicion = dat['LUGAR_EXPEDICION']

        c.Serie = dat['CONTROL']['SERIE']  # optional
        c.Folio = dat['CONTROL']['FOLIO']  # optional
        c.NoCertificado = dat['NUMERO_CERTIFICADO']
        c.Certificado = dat['CERT_B64']

        c.TipoDeComprobante = 'P'

        if dat['MONEDA']['ISO_4217'] == 'MXN':
            c.TipoCambio = 1
        else:
            # optional (requerido en ciertos casos)
            c.TipoCambio = truncate(dat['MONEDA']['TIPO_DE_CAMBIO'], self.__NDECIMALS)
        c.Moneda = dat['MONEDA']['ISO_4217']

        c.Conceptos = pyxb.BIND()
        for i in dat['CONCEPTOS']:
            c.Conceptos.append(pyxb.BIND(
                Cantidad=i['CANTIDAD'],
                ClaveUnidad=i['UNIDAD'],
                ClaveProdServ=i['PRODSERV'],
                Descripcion=i['DESCRIPCION'],
                ValorUnitario=i['PRECIO_UNITARIO'],
                NoIdentificacion=i['SKU'],  # optional
                Importe=i['IMPORTE']
        ))

    def data_rel(self, dat):
        pass
