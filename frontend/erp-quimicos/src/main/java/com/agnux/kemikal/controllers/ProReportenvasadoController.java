package com.agnux.kemikal.controllers;
import com.agnux.cfd.v2.Base64Coder;
import com.agnux.common.obj.ResourceProject;
import com.agnux.common.obj.UserSessionData;
import com.agnux.kemikal.interfacedaos.GralInterfaceDao;
import com.agnux.kemikal.interfacedaos.HomeInterfaceDao;
import com.agnux.kemikal.interfacedaos.InvInterfaceDao;
import com.agnux.kemikal.interfacedaos.ProInterfaceDao;
import com.agnux.kemikal.reportes.PdfProReportenvasado;
import com.agnux.kemikal.reportes.PdfReporteMovimientos;
import com.itextpdf.text.DocumentException;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
/**
 *
 * @author vale vale
 * valentin.vale@gmail.com
 * 08/abril/2013
 *
 */
@Controller
@SessionAttributes({"user"})
@RequestMapping("/proreportenvasado/")
public class ProReportenvasadoController {
    private static final Logger log  = Logger.getLogger(ProReportenvasadoController.class.getName());
    ResourceProject resource = new ResourceProject();

    @Autowired
    @Qualifier("daoPro")
    private ProInterfaceDao daoPro;


    public ProInterfaceDao getProDao() {
        return daoPro;
    }

    @Autowired
    @Qualifier("daoInv")
    private InvInterfaceDao invDao;


    @Autowired
    @Qualifier("daoHome")
    private HomeInterfaceDao HomeDao;

    @Autowired
    @Qualifier("daoGral")
    private GralInterfaceDao gralDao;

    public InvInterfaceDao getInvDao() {
        return invDao;
    }


    public HomeInterfaceDao getHomeDao() {
        return HomeDao;
    }


    public GralInterfaceDao getGralDao() {
        return gralDao;
    }



    @RequestMapping(value="/startup.agnux")
    public ModelAndView startUp(HttpServletRequest request, HttpServletResponse response,
            @ModelAttribute("user") UserSessionData user)
            throws ServletException, IOException {

        log.log(Level.INFO, "Ejecutando starUp de {0}", ProReportenvasadoController.class.getName());
        LinkedHashMap<String,String> infoConstruccionTabla = new LinkedHashMap<String,String>();


        ModelAndView x = new ModelAndView("proreportenvasado/startup", "title", "Reporte de Envasado");

        x = x.addObject("layoutheader", resource.getLayoutheader());
        x = x.addObject("layoutmenu", resource.getLayoutmenu());
        x = x.addObject("layoutfooter", resource.getLayoutfooter());
        x = x.addObject("grid", resource.generaGrid(infoConstruccionTabla));
        x = x.addObject("url", resource.getUrl(request));
        x = x.addObject("username", user.getUserName());
        x = x.addObject("empresa", user.getRazonSocialEmpresa());
        x = x.addObject("sucursal", user.getSucursal());

        String userId = String.valueOf(user.getUserId());

        String codificado = Base64Coder.encodeString(userId);

        //id de usuario codificado
        x = x.addObject("iu", codificado);

        return x;
    }




    //obtiene datos para el buscador
    @RequestMapping(method = RequestMethod.POST, value="/getDatosBusqueda.json")
    public @ResponseBody HashMap<String,ArrayList<HashMap<String, String>>> getDatosBusquedaJson(
            @RequestParam(value="iu", required=true) String id_user,
            Model model
        ) {

        log.log(Level.INFO, "Ejecutando getDatosBusquedaJson de {0}", ProReportenvasadoController.class.getName());
        HashMap<String,ArrayList<HashMap<String, String>>> jsonretorno = new HashMap<String,ArrayList<HashMap<String, String>>>();
        //ArrayList<HashMap<String, String>> Almacenes = new ArrayList<HashMap<String, String>>();
        ArrayList<HashMap<String, String>>Datos_Reporte_Envasado = new ArrayList<HashMap<String, String>>();
        HashMap<String, String> userDat = new HashMap<String, String>();

        //decodificar id de usuario
        Integer id_usuario = Integer.parseInt(Base64Coder.decodeString(id_user));
        userDat = this.getHomeDao().getUserById(id_usuario);

        Integer id_empresa = Integer.parseInt(userDat.get("empresa_id"));

        //Almacenes = this.getInvDao().getAlmacenes2(id_empresa);
        Datos_Reporte_Envasado = this.getProDao().getReporteEnvasado_Datos(id_empresa);

        //jsonretorno.put("Agentes", Almacenes);
        jsonretorno.put("R_Envasado", Datos_Reporte_Envasado);

        return jsonretorno;
    }


    //obtiene los tipos de productos para el buscador de productos
//    @RequestMapping(method = RequestMethod.POST, value = "/getProductoTipos.json")
//    public @ResponseBody
//    HashMap<String, ArrayList<HashMap<String, String>>> getProductoTiposJson(
//            @RequestParam(value = "iu", required = true) String id_user_cod,
//            Model model) {
//
//        HashMap<String, ArrayList<HashMap<String, String>>> jsonretorno = new HashMap<String, ArrayList<HashMap<String, String>>>();
//
//        ArrayList<HashMap<String, String>> arrayTiposProducto = new ArrayList<HashMap<String, String>>();
//        arrayTiposProducto = this.getInvDao().getProducto_Tipos();
//        jsonretorno.put("prodTipos", arrayTiposProducto);
//
//        return jsonretorno;
//    }

    //obtiene los productos para el buscador
//    @RequestMapping(method = RequestMethod.POST, value = "/getBuscadorProductos.json")
//    public @ResponseBody
//    HashMap<String, ArrayList<HashMap<String, String>>> getBuscadorProductosJson(
//            @RequestParam(value = "sku", required = true) String sku,
//            @RequestParam(value = "tipo", required = true) String tipo,
//            @RequestParam(value = "descripcion", required = true) String descripcion,
//            @RequestParam(value = "iu", required = true) String id_user,
//            Model model) {
//
//        log.log(Level.INFO, "Ejecutando getBuscadorProductosJson de {0}", InvRepComprasNetasPorProductoController.class.getName());
//        HashMap<String, ArrayList<HashMap<String, String>>> jsonretorno = new HashMap<String, ArrayList<HashMap<String, String>>>();
//        ArrayList<HashMap<String, String>> productos = new ArrayList<HashMap<String, String>>();
//        HashMap<String, String> userDat = new HashMap<String, String>();
//        //decodificar id de usuario
//        Integer id_usuario = Integer.parseInt(Base64Coder.decodeString(id_user));
//        userDat = this.getHomeDao().getUserById(id_usuario);
//
//        Integer id_empresa = Integer.parseInt(userDat.get("empresa_id"));
//
//        productos = this.getInvDao().getBuscadorProductos(sku,tipo ,descripcion, id_empresa);
//
//        jsonretorno.put("Productos", productos);
//
//        return jsonretorno;
//    }
//
//
//
//
    @RequestMapping(method = RequestMethod.POST, value = "/getProReporteEnvasado.json")
    public @ResponseBody
    HashMap<String, ArrayList<HashMap<String, String>>> getMovimientosJson(
            @RequestParam(value = "id_agente", required = true) String id_agente,
            @RequestParam(value = "iu", required = true) String id_user,
            Model model) {

        log.log(Level.INFO, "Ejecutando getMovimientosJson de {0}", ProReportenvasadoController.class.getName());
        HashMap<String, ArrayList<HashMap<String, String>>> jsonretorno = new HashMap<String, ArrayList<HashMap<String, String>>>();
        ArrayList<HashMap<String, String>>Datos_Reporte_Envasado = new ArrayList<HashMap<String, String>>();
        HashMap<String, String> userDat = new HashMap<String, String>();
        //decodificar id de usuario
        Integer id_usuario = Integer.parseInt(Base64Coder.decodeString(id_user));
        userDat = this.getHomeDao().getUserById(id_usuario);

        Integer id_empresa = Integer.parseInt(userDat.get("empresa_id"));

       Datos_Reporte_Envasado = this.getProDao().getReporteEnvasado_Datos(id_empresa);

        jsonretorno.put("Datos_R_Envasado",Datos_Reporte_Envasado);

        return jsonretorno;
    }


    //Genera pdf Reporte de Movimientos
    @RequestMapping(value = "/getReporteEnvasado/{cadena}/{iu}/out.json", method = RequestMethod.GET )
    public ModelAndView getGeneraPdfRemisionJson(
                @PathVariable("cadena") String cadena,
                @PathVariable("iu") String id_user,
                HttpServletRequest request,
                HttpServletResponse response,
                Model model)
        throws ServletException, IOException, URISyntaxException, DocumentException {

        HashMap<String, String> userDat = new HashMap<String, String>();
        ArrayList<HashMap<String, String>>Datos_Reporte_Envasado = new ArrayList<HashMap<String, String>>();

        System.out.println("Generando reporte de Envasado");
        Integer select=0;



        String arrayCad [] = cadena.split("___");

        //ASIGNACION DE VALORES DEL AREGLO A VARIABLES
        //String parametro_1 = Integer.parseInt(arrayCad [0]);
        String fecha_inicial="2012-01-01";
        String fecha_final="2013-12-01";


        //decodificar id de usuario
        Integer id_usuario = Integer.parseInt(Base64Coder.decodeString(id_user));
        userDat = this.getHomeDao().getUserById(id_usuario);
        Integer id_empresa = Integer.parseInt(userDat.get("empresa_id"));
        String rfc=this.getGralDao().getRfcEmpresaEmisora(id_empresa);

        String razon_social_empresa = this.getGralDao().getRazonSocialEmpresaEmisora(id_empresa);

        //obtener el directorio temporal
        String dir_tmp = this.getGralDao().getTmpDir();


        String[] array_company = razon_social_empresa.split(" ");
        String company_name= array_company[0].toLowerCase();
        String ruta_imagen = this.getGralDao().getImagesDir() +"logo_"+ company_name +".png";


        File file_dir_tmp = new File(dir_tmp);
        System.out.println("Directorio temporal: "+file_dir_tmp.getCanonicalPath());

        String file_name = "REPENVASADO_"+rfc+".pdf";

        //ruta de archivo de salida
        String fileout = file_dir_tmp +"/"+  file_name;


        //obtiene los datos Para el reporte de Envasado (Modulo de Produccion)
        Datos_Reporte_Envasado = this.getProDao().getReporteEnvasado_Datos(id_empresa);

        //instancia a la clase que construye el pdf del reporte de envasado
        PdfProReportenvasado x = new PdfProReportenvasado( fileout,ruta_imagen,razon_social_empresa,fecha_inicial,fecha_final,Datos_Reporte_Envasado);

        System.out.println("Recuperando archivo: " + fileout);
        File file = new File(fileout);
        int size = (int) file.length(); // Tamaño del archivo
        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
        response.setBufferSize(size);
        response.setContentLength(size);
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition","attachment; filename=\"" + file.getCanonicalPath() +"\"");
        FileCopyUtils.copy(bis, response.getOutputStream());
        response.flushBuffer();

        return null;
    }










}
