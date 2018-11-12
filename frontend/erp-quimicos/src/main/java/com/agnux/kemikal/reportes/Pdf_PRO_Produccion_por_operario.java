package com.agnux.kemikal.reportes;

import com.agnux.common.helpers.StringHelper;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Pdf_PRO_Produccion_por_operario {
    public Pdf_PRO_Produccion_por_operario(HashMap<String, String> datosEncabezadoPie, String fileout, ArrayList<HashMap<String, String>> datos_produccion, HashMap<String, String> datos) throws DocumentException {
    try {
                    Font smallFont = new Font(Font.FontFamily.HELVETICA,8,Font.NORMAL,BaseColor.BLACK);
                    Font smallBoldFont = new Font(Font.getFamily("ARIAL"),8,Font.BOLD,BaseColor.WHITE);

                    String[] fi = datos.get("fecha_inicial").split("-");
                    String[] ff = datos.get("fecha_final").split("-");
                    String fecha_reporte = "Periodo  del  "+fi[2]+"/"+fi[1]+"/"+fi[0]+"  al  "+ff[2]+"/"+ff[1]+"/"+ff[0];

                    //datos para el encabezado
                    datos.put("empresa", datosEncabezadoPie.get("nombre_empresa_emisora"));
                    datos.put("titulo_reporte", datosEncabezadoPie.get("titulo_reporte"));
                    datos.put("periodo", fecha_reporte);

                    //datos para el pie de pagina
                    datos.put("codigo1", "");
                    datos.put("codigo2", "");

                    Pdf_PRO_Produccion_por_operario.HeaderFooter event = new Pdf_PRO_Produccion_por_operario.HeaderFooter(datos);

                    Document doc = new Document(PageSize.LETTER.rotate(),-50,-50,60,30);
                    doc.addCreator("vale8490@hotmail.com");
                    PdfWriter writer = PdfWriter.getInstance(doc, new FileOutputStream(fileout));
                    writer.setPageEvent(event);

                    doc.open();
                    float [] widths = {1,1,1.5f,0.7f,3.5f,1,2.5f,1};//Tamaño de las Columnas.
                    PdfPTable tabla = new PdfPTable(widths);
                    PdfPCell cell;
                    tabla.setKeepTogether(false);
                    tabla.setHeaderRows(1);
                        String titulos[ ] ={"Folio orden","Numero lote","Elaboracion","Codigo","Descripcion","Subproceso","Operador","Cantidad"};
                    java.util.List<String>  lista_columnas = (java.util.List<String>) Arrays.asList(titulos);
                    //añadiendo e arreglo a la lista

            for ( String columna_titulo : lista_columnas){
                PdfPCell celda = null;
               celda = new PdfPCell(new Paragraph(columna_titulo,smallBoldFont));
               celda.setUseAscender(true);

               celda.setUseDescender(true);
               celda.setVerticalAlignment(Element.ALIGN_MIDDLE);
               celda.setBackgroundColor(BaseColor.BLACK);

                if (columna_titulo.equals("Folio orden")){
                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                }
                if (columna_titulo.equals("Numero Lote")){
                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                }
                if (columna_titulo.equals("Elaboracion")){
                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                }

                if (columna_titulo.equals("Codigo")){
                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                }
                if (columna_titulo.equals("Descripcion")){
                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                }
                if (columna_titulo.equals("Subproceso")){
                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                }
//                 if (columna_titulo.equals("Equipo")){
//                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//                }
                if (columna_titulo.equals("Operador")){
                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                }

                if (columna_titulo.equals("Cantidad")){
                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                }

               tabla.addCell(celda);
            }

           if(datos_produccion.size()>0){
            String folio_orden=datos_produccion.get(0).get("folio_orden").toString();
            Double  suma_cantidad=0.0;
            Integer tmp= 0;

            for (int x=0; x<=(datos_produccion.size())-1; x++){
                 HashMap<String, String> registro= datos_produccion.get(x);
                 if(folio_orden.equals(registro.get("folio_orden").toString())){
                    if( tmp == 0 ){
                        //1
                        cell = new PdfPCell(new Paragraph(registro.get("folio_orden").toString(),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //2
                        cell = new PdfPCell(new Paragraph(registro.get("numero_lote").toString(),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);

                        cell = new PdfPCell(new Paragraph(registro.get("fecha_elaboracion"),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //6
                        cell = new PdfPCell(new Paragraph(registro.get("codigo"),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //7
                        cell = new PdfPCell(new Paragraph(registro.get("descripcion").toString(),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //3
                        cell = new PdfPCell(new Paragraph(registro.get("subproceso").toString(),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //4
//                        cell = new PdfPCell(new Paragraph(registro.get("nombre_equipo").toString(),smallFont));
//                        cell.setUseAscender(true);
//                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
//                        cell.setUseDescender(true);
//                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
//                        cell.setBorder(0);
//                        tabla.addCell(cell);
                        //5
                        cell = new PdfPCell(new Paragraph(registro.get("nombre_operador"),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);

                        //8
                        cell = new PdfPCell(new Paragraph(StringHelper.AgregaComas(StringHelper.roundDouble(registro.get("cantidad"),2)),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);


                        suma_cantidad=suma_cantidad +Double.parseDouble(registro.get("cantidad").toString());

                    }
                    if(tmp != 0){
                        //1
                        cell = new PdfPCell(new Paragraph("",smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //2
                        cell = new PdfPCell(new Paragraph("",smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);

                        cell = new PdfPCell(new Paragraph("",smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);

                        //6
                        cell = new PdfPCell(new Paragraph("",smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //7
                        cell = new PdfPCell(new Paragraph("",smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //3
                        cell = new PdfPCell(new Paragraph(registro.get("subproceso").toString(),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //4
//                        cell = new PdfPCell(new Paragraph(registro.get("nombre_equipo").toString(),smallFont));
//                        cell.setUseAscender(true);
//                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
//                        cell.setUseDescender(true);
//                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
//                        cell.setBorder(0);
//                        tabla.addCell(cell);
                        //5
                        cell = new PdfPCell(new Paragraph(registro.get("nombre_operador"),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);

                        //8
                        cell = new PdfPCell(new Paragraph(StringHelper.AgregaComas(StringHelper.roundDouble(registro.get("cantidad"),2)),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                    }
                 tmp=1;
                 }else{
                         //1
                        cell = new PdfPCell(new Paragraph(registro.get("folio_orden").toString(),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //2
                        cell = new PdfPCell(new Paragraph(registro.get("numero_lote").toString(),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);


                        cell = new PdfPCell(new Paragraph(registro.get("fecha_elaboracion"),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //6
                        cell = new PdfPCell(new Paragraph(registro.get("codigo"),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //7
                        cell = new PdfPCell(new Paragraph(registro.get("descripcion").toString(),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //3
                        cell = new PdfPCell(new Paragraph(registro.get("subproceso").toString(),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);
                        //4
//                        cell = new PdfPCell(new Paragraph(registro.get("nombre_equipo").toString(),smallFont));
//                        cell.setUseAscender(true);
//                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
//                        cell.setUseDescender(true);
//                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
//                        cell.setBorder(0);
//                        tabla.addCell(cell);
                        //5
                        cell = new PdfPCell(new Paragraph(registro.get("nombre_operador"),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);

                        //8
                        cell = new PdfPCell(new Paragraph(StringHelper.AgregaComas(StringHelper.roundDouble(registro.get("cantidad"),2)),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(0);
                        tabla.addCell(cell);

                        suma_cantidad=suma_cantidad +Double.parseDouble(registro.get("cantidad").toString());
                        folio_orden=registro.get("folio_orden").toString();

                 }

            }//fin delfor
            cell = new PdfPCell(new Paragraph("TOTAL CANTIDAD EN KILOS:",smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setColspan(7);
                        cell.setBorder(1);
                        tabla.addCell(cell);
            cell = new PdfPCell(new Paragraph(StringHelper.AgregaComas(StringHelper.roundDouble(suma_cantidad,2)),smallFont));
                        cell.setUseAscender(true);
                        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                        cell.setUseDescender(true);
                        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        cell.setBorder(1);

                        tabla.addCell(cell);

    }

            doc.add(tabla);
            doc.close();
	} catch (FileNotFoundException ex) {
            Logger.getLogger(Pdf_CRM_registroVisitas.class.getName()).log(Level.SEVERE, null, ex);
	}

   }

    static class HeaderFooter extends PdfPageEventHelper {
        protected PdfTemplate total;
        protected BaseFont helv;
        protected PdfContentByte cb;
        Font largeBoldFont = new Font(Font.FontFamily.HELVETICA,10,Font.BOLD,BaseColor.BLACK);
        Font largeFont = new Font(Font.FontFamily.HELVETICA,10,Font.NORMAL,BaseColor.BLACK);
        Font smallFont = new Font(Font.FontFamily.HELVETICA,7,Font.NORMAL,BaseColor.BLACK);

        //ESTAS SON VARIABLES PRIVADAS DE LA CLASE, SE LE ASIGNA VALOR EN EL CONSTRUCTOR SON SETER
        private String empresa;
        private String periodo;
        private String titulo_reporte;
        private String codigo1;
        private String codigo2;


        //ESTOS  SON LOS GETER Y SETTER DE LAS VARIABLES PRIVADAS DE LA CLASE
        public String getCodigo1() {
            return codigo1;
        }

        public void setCodigo1(String codigo1) {
            this.codigo1 = codigo1;
        }

        public String getCodigo2() {
            return codigo2;
        }

        public void setCodigo2(String codigo2) {
            this.codigo2 = codigo2;
        }

        public String getTitulo_reporte() {
            return titulo_reporte;
        }

        public void setTitulo_reporte(String titulo_reporte) {
            this.titulo_reporte = titulo_reporte;
        }

        public String getEmpresa() {
            return empresa;
        }

        public void setEmpresa(String empresa) {
            this.empresa = empresa;
        }

        public String getPeriodo() {
            return periodo;
        }

        public void setPeriodo(String periodo) {
            this.periodo = periodo;
        }

        //ESTE ES EL CONSTRUCTOR DE LA CLASE  QUE RECIBE LOS PARAMETROS
        HeaderFooter( HashMap<String, String> datos ){
            this.setEmpresa(datos.get("empresa"));
            this.setTitulo_reporte(datos.get("titulo_reporte"));
            this.setPeriodo(datos.get("periodo"));
            this.setCodigo1(datos.get("codigo1"));
            this.setCodigo2(datos.get("codigo2"));
        }


        /*Añadimos una tabla con  una imagen del logo de megestiono y creamos la fuente para el documento,
         * la imagen esta escalada para que no se muestre pixelada*/
        @Override
        public void onOpenDocument(PdfWriter writer, Document document) {
            try {
                total = writer.getDirectContent().createTemplate(100, 100);
                //public Rectangle(int x, int y, int width, int height)
                total.setBoundingBox(new Rectangle(-20, -20, 100, 100));
                total.fill();
                helv = BaseFont.createFont("Helvetica", BaseFont.WINANSI, false);
            }
            catch(Exception e) {
                throw new ExceptionConverter(e);
            }
        }

        /*añadimos pie de página, borde y más propiedades*/
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            ColumnText.showTextAligned(writer.getDirectContent(),Element.ALIGN_CENTER, new Phrase(this.getEmpresa(),largeBoldFont),document.getPageSize().getWidth()/2, document.getPageSize().getTop() -25, 0);
            ColumnText.showTextAligned(writer.getDirectContent(),Element.ALIGN_CENTER, new Phrase(this.getTitulo_reporte(),largeBoldFont),document.getPageSize().getWidth()/2, document.getPageSize().getTop()-38, 0);
            ColumnText.showTextAligned(writer.getDirectContent(),Element.ALIGN_CENTER, new Phrase(this.getPeriodo(),largeFont),document.getPageSize().getWidth()/2, document.getPageSize().getTop()-50, 0);

            cb = writer.getDirectContent();
            float textBase = document.bottom() - 20;

            //texto inferior izquieda pie de pagina
            String text_left = this.getCodigo1();
            float text_left_Size = helv.getWidthPoint(text_left, 7);
            cb.beginText();
            cb.setFontAndSize(helv, 7);
            cb.setTextMatrix(document.left()+85, textBase );  //definir la posicion de text
            cb.showText(text_left);
            cb.endText();


            //texto centro pie de pagina
            String text_center ="Página " + writer.getPageNumber() + " de ";
            float text_center_Size = helv.getWidthPoint(text_center, 7);
            float pos_text_center = (document.getPageSize().getWidth()/2)-(text_center_Size/2);
            float adjust = text_center_Size + 3;
            cb.beginText();
            cb.setFontAndSize(helv, 7);
            cb.setTextMatrix(pos_text_center, textBase );  //definir la posicion de text
            cb.showText(text_center);
            cb.endText();
            cb.addTemplate(total, pos_text_center + adjust, textBase);


            //texto inferior derecha pie de pagina
            String text_right = this.getCodigo2();
            float textRightSize = helv.getWidthPoint(text_right, 7);
            float pos_text_right = document.getPageSize().getWidth()-textRightSize - 40;
            cb.beginText();
            cb.setFontAndSize(helv, 7);
            cb.setTextMatrix(pos_text_right, textBase);
            cb.showText(text_right);
            cb.endText();
            //cb.restoreState();
        }

        /*aqui escrimos ls paginas totales, para que nos salga de pie de pagina Pagina x de y*/
        @Override
        public void onCloseDocument(PdfWriter writer, Document document) {
          total.beginText();
          total.setFontAndSize(helv, 7);
          total.setTextMatrix(0,0);
          total.showText(String.valueOf(writer.getPageNumber() -1));
          total.endText();
        }
   };//termina clase HeaderFooter



}
