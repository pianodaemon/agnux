package com.agnux.cfd.v2;


import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.*;
import org.apache.commons.ssl.PKCS8Key;


public class CryptoEngine {

    public static String sign(String filename, String password , String cadenaoriginal) {

        String valor_retorno = null;
        InputStream archivoClavePrivada = null;
        byte[] clavePrivada = null;
        Signature firma = null;
        PKCS8Key pkcs8 = null;
        PrivateKey pk = null;

        try {
            archivoClavePrivada =  new FileInputStream(filename);
            clavePrivada = getBytesFromInputStream(archivoClavePrivada);
        }
        catch( Exception e){
            System.out.println(e.toString());
        }
	
        
        try {
            pkcs8 = new PKCS8Key(clavePrivada, password.toCharArray());
            pk = pkcs8.getPrivateKey();
            firma = Signature.getInstance("SHA1withRSA", "SunRsaSign");
            firma.initSign(pk);
        }
        catch(GeneralSecurityException e){
            e.printStackTrace();
        }
	
	try {
		firma.update(cadenaoriginal.getBytes("UTF-8"));
		byte[] firmaDigital = firma.sign();
		valor_retorno = new String(Base64Coder.encode(firmaDigital));
		//valor_retorno = base64(new String(firma.sign()));
	} catch (Exception e) {
		e.printStackTrace();
	}
        
        return valor_retorno;
    }

    private static byte[] getBytesFromInputStream(InputStream is) {
        int totalBytes = 714;
        byte[] buffer = null;
        try {
            buffer = new byte[totalBytes];
            is.read(buffer, 0, totalBytes);
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return buffer;
    }

}
