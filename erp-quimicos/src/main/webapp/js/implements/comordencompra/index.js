$(function() {
	String.prototype.toCharCode = function(){
	    var str = this.split(''), len = str.length, work = new Array(len);
	    for (var i = 0; i < len; ++i){
			work[i] = this.charCodeAt(i);
	    }
	    return work.join(',');
	};
	
	$('#header').find('#header1').find('span.emp').text($('#lienzo_recalculable').find('input[name=emp]').val());
	$('#header').find('#header1').find('span.suc').text($('#lienzo_recalculable').find('input[name=suc]').val());
        var $username = $('#header').find('#header1').find('span.username');
	$username.text($('#lienzo_recalculable').find('input[name=user]').val());
	
	var $contextpath = $('#lienzo_recalculable').find('input[name=contextpath]');
	var controller = $contextpath.val()+"/controllers/comordencompra";
    
        //Barra para las acciones
        $('#barra_acciones').append($('#lienzo_recalculable').find('.table_acciones'));
        $('#barra_acciones').find('.table_acciones').css({'display':'block'});
        var $new_orden_compra = $('#barra_acciones').find('.table_acciones').find('a[href*=new_item]');
	var $visualiza_buscador = $('#barra_acciones').find('.table_acciones').find('a[href*=visualiza_buscador]');
	
	$('#barra_acciones').find('.table_acciones').find('#nItem').mouseover(function(){
		$(this).removeClass("onmouseOutNewItem").addClass("onmouseOverNewItem");
	});
	$('#barra_acciones').find('.table_acciones').find('#nItem').mouseout(function(){
		$(this).removeClass("onmouseOverNewItem").addClass("onmouseOutNewItem");
	});
	
	
	$('#barra_acciones').find('.table_acciones').find('#vbuscador').mouseover(function(){
		$(this).removeClass("onmouseOutVisualizaBuscador").addClass("onmouseOverVisualizaBuscador");
	});
	$('#barra_acciones').find('.table_acciones').find('#vbuscador').mouseout(function(){
		$(this).removeClass("onmouseOverVisualizaBuscador").addClass("onmouseOutVisualizaBuscador");
	});
	
	//aqui va el titulo del catalogo
	$('#barra_titulo').find('#td_titulo').append('Orden de Compra');
	
	//barra para el buscador 
	//$('#barra_buscador').css({'height':'0px'});
	$('#barra_buscador').append($('#lienzo_recalculable').find('.tabla_buscador'));
	//$('#barra_buscador').find('.tabla_buscador').css({'display':'none'});
	//$('#barra_buscador').hide();
	
	
	var $cadena_busqueda = "";
	var $busqueda_folio = $('#barra_buscador').find('.tabla_buscador').find('input[name=busqueda_folio]');
	var $busqueda_proveedor = $('#barra_buscador').find('.tabla_buscador').find('input[name=busqueda_proveedor]');
	var $busqueda_fecha_inicial = $('#barra_buscador').find('.tabla_buscador').find('input[name=busqueda_fecha_inicial]');
	var $busqueda_fecha_final = $('#barra_buscador').find('.tabla_buscador').find('input[name=busqueda_fecha_final]');
	var $buscar = $('#barra_buscador').find('.tabla_buscador').find('#boton_buscador');
	var $limpiar = $('#barra_buscador').find('.tabla_buscador').find('#boton_limpiar');
	
	
	$buscar.mouseover(function(){
		$(this).removeClass("onmouseOutBuscar").addClass("onmouseOverBuscar");
	});
	$buscar.mouseout(function(){
		$(this).removeClass("onmouseOverBuscar").addClass("onmouseOutBuscar");
	});
	   
	$limpiar.mouseover(function(){
		$(this).removeClass("onmouseOutLimpiar").addClass("onmouseOverLimpiar");
	});
	$limpiar.mouseout(function(){
		$(this).removeClass("onmouseOverLimpiar").addClass("onmouseOutLimpiar");
	});
	
	
	var to_make_one_search_string = function(){
		var valor_retorno = "";
		var signo_separador = "=";
		valor_retorno += "folio" + signo_separador + $busqueda_folio.val() + "|";
		valor_retorno += "proveedor" + signo_separador + $busqueda_proveedor.val() + "|";
		valor_retorno += "fecha_inicial" + signo_separador + $busqueda_fecha_inicial.val() + "|";
		valor_retorno += "fecha_final" + signo_separador + $busqueda_fecha_final.val();
		return valor_retorno;
	};
    
	cadena = to_make_one_search_string();
	$cadena_busqueda = cadena.toCharCode();
	
	$buscar.click(function(event){
		//event.preventDefault();
		cadena = to_make_one_search_string();
		$cadena_busqueda = cadena.toCharCode();
		$get_datos_grid();
	});
	
	$limpiar.click(function(event){
		$busqueda_folio.val('');
		$busqueda_proveedor.val('');
		$busqueda_fecha_inicial.val('');
		$busqueda_fecha_final.val('');
	});
	
	
	
	
	TriggerClickVisializaBuscador = 0;
	//visualizar  la barra del buscador
	$visualiza_buscador.click(function(event){
		event.preventDefault();
		var alto=0;
		if(TriggerClickVisializaBuscador==0){
			 TriggerClickVisializaBuscador=1;
			 var height2 = $('#cuerpo').css('height');
			 //alert('height2: '+height2);
			 
			 alto = parseInt(height2)-220;
			 var pix_alto=alto+'px';
			 //alert('pix_alto: '+pix_alto);
			 
			 $('#barra_buscador').find('.tabla_buscador').css({'display':'block'});
			 $('#barra_buscador').animate({height: '80px'}, 500);
			 $('#cuerpo').css({'height': pix_alto});
			 
			 //alert($('#cuerpo').css('height'));
		}else{
			 TriggerClickVisializaBuscador=0;
			 var height2 = $('#cuerpo').css('height');
			 alto = parseInt(height2)+220;
			 var pix_alto=alto+'px';
			 
			 $('#barra_buscador').animate({height:'0px'}, 500);
			 $('#cuerpo').css({'height': pix_alto});
		};
	});
	
	
	//----------------------------------------------------------------
	//valida la fecha seleccionada
	function mayor(fecha, fecha2){
		var xMes=fecha.substring(5, 7);
		var xDia=fecha.substring(8, 10);
		var xAnio=fecha.substring(0,4);
		var yMes=fecha2.substring(5, 7);
		var yDia=fecha2.substring(8, 10);
		var yAnio=fecha2.substring(0,4);
		
		if (xAnio > yAnio){
			return(true);
		}else{
			if (xAnio == yAnio){
				if (xMes > yMes){
					return(true);
				}
				if (xMes == yMes){
					if (xDia > yDia){
						return(true);
					}else{
						return(false);
					}
				}else{
					return(false);
				}
			}else{
				return(false);
			}
		}
	}
	//muestra la fecha actual
	var mostrarFecha = function mostrarFecha(){
		var ahora = new Date();
		var anoActual = ahora.getFullYear();
		var mesActual = ahora.getMonth();
		mesActual = mesActual+1;
		mesActual = (mesActual <= 9)?"0" + mesActual : mesActual;
		var diaActual = ahora.getDate();
		diaActual = (diaActual <= 9)?"0" + diaActual : diaActual;
		var Fecha = anoActual + "-" + mesActual + "-" + diaActual;		
		return Fecha;
	}
	
	
	$busqueda_fecha_inicial.click(function (s){
		var a=$('div.datepicker');
		a.css({'z-index':100});
	});
        
	$busqueda_fecha_inicial.DatePicker({
		format:'Y-m-d',
		date: $(this).val(),
		current: $(this).val(),
		starts: 1,
		position: 'bottom',
		locale: {
			days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'],
			daysShort: ['Dom', 'Lun', 'Mar', 'Mir', 'Jue', 'Vir', 'Sab','Dom'],
			daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa','Do'],
			months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo','Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'],
			monthsShort: ['Ene', 'Feb', 'Mar', 'Abr','May', 'Jun', 'Jul', 'Ago','Sep', 'Oct', 'Nov', 'Dic'],
			weekMin: 'se'
		},
		onChange: function(formated, dates){
			var patron = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$");
			$busqueda_fecha_inicial.val(formated);
			if (formated.match(patron) ){
				var valida_fecha=mayor($busqueda_fecha_inicial.val(),mostrarFecha());
				
				if (valida_fecha==true){
					jAlert("Fecha no valida",'! Atencion');
					$busqueda_fecha_inicial.val(mostrarFecha());
				}else{
					$busqueda_fecha_inicial.DatePickerHide();	
				}
			}
		}
	});
        
	$busqueda_fecha_final.click(function (s){
		var a=$('div.datepicker');
		a.css({'z-index':100});
	});
        
	$busqueda_fecha_final.DatePicker({
		format:'Y-m-d',
		date: $(this).val(),
		current: $(this).val(),
		starts: 1,
		position: 'bottom',
		locale: {
			days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'],
			daysShort: ['Dom', 'Lun', 'Mar', 'Mir', 'Jue', 'Vir', 'Sab','Dom'],
			daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa','Do'],
			months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo','Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'],
			monthsShort: ['Ene', 'Feb', 'Mar', 'Abr','May', 'Jun', 'Jul', 'Ago','Sep', 'Oct', 'Nov', 'Dic'],
			weekMin: 'se'
		},
		onChange: function(formated, dates){
			var patron = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$");
			$busqueda_fecha_final.val(formated);
			if (formated.match(patron) ){
				var valida_fecha=mayor($busqueda_fecha_final.val(),mostrarFecha());
				
				if (valida_fecha==true){
					jAlert("Fecha no valida",'! Atencion');
					$busqueda_fecha_final.val(mostrarFecha());
				}else{
					$busqueda_fecha_final.DatePickerHide();	
				}
			}
		}
	});
	
    
	
	$tabs_li_funxionalidad = function(){
            var $select_prod_tipo = $('#forma-comordencompra-window').find('select[name=prodtipo]');
            $('#forma-comordencompra-window').find('#submit').mouseover(function(){
                $('#forma-comordencompra-window').find('#submit').removeAttr("src").attr("src","../../img/modalbox/bt1.png");
                //$('#forma-comordencompra-window').find('#submit').css({backgroundImage:"url(../../img/modalbox/bt1.png)"});
            })
            $('#forma-comordencompra-window').find('#submit').mouseout(function(){
                $('#forma-comordencompra-window').find('#submit').removeAttr("src").attr("src","../../img/modalbox/btn1.png");
                //$('#forma-comordencompra-window').find('#submit').css({backgroundImage:"url(../../img/modalbox/btn1.png)"});
            })
            $('#forma-comordencompra-window').find('#boton_cancelar').mouseover(function(){
                $('#forma-comordencompra-window').find('#boton_cancelar').css({backgroundImage:"url(../../img/modalbox/bt2.png)"});
            })
            $('#forma-comordencompra-window').find('#boton_cancelar').mouseout(function(){
                $('#forma-comordencompra-window').find('#boton_cancelar').css({backgroundImage:"url(../../img/modalbox/btn2.png)"});
            })
            
            $('#forma-comordencompra-window').find('#close').mouseover(function(){
                $('#forma-comordencompra-window').find('#close').css({backgroundImage:"url(../../img/modalbox/close_over.png)"});
            })
            $('#forma-comordencompra-window').find('#close').mouseout(function(){
                $('#forma-comordencompra-window').find('#close').css({backgroundImage:"url(../../img/modalbox/close.png)"});
            })
            
            $('#forma-comordencompra-window').find(".contenidoPes").hide(); //Hide all content
            $('#forma-comordencompra-window').find("ul.pestanas li:first").addClass("active").show(); //Activate first tab
            $('#forma-comordencompra-window').find(".contenidoPes:first").show(); //Show first tab content
            
            //On Click Event
            $('#forma-comordencompra-window').find("ul.pestanas li").click(function() {
                $('#forma-comordencompra-window').find(".contenidoPes").hide();
                $('#forma-comordencompra-window').find("ul.pestanas li").removeClass("active");
                var activeTab = $(this).find("a").attr("href");
                $('#forma-comordencompra-window').find( activeTab , "ul.pestanas li" ).fadeIn().show();
                $(this).addClass("active");
                return false;
            });
	}
	
	
	
	var quitar_comas= function($valor){
		$valor = $valor+'';
		return $valor.split(',').join('');
	}
	
	//funcion para hacer que un campo solo acepte numeros
	$permitir_solo_numeros = function($campo){
		//validar campo costo, solo acepte numeros y punto
		$campo.keypress(function(e){
			// Permitir  numeros, borrar, suprimir, TAB, puntos, comas
			if (e.which == 8 || e.which == 46 || e.which==13 || e.which == 0 || (e.which >= 48 && e.which <= 57 )) {
				return true;
			}else {
				return false;
			}
		});
	}
	
	
	
        
        
        
        
        
        
        
        
        
        
        
        
        


	$busca_proveedores = function($select_via_embarque,$select_moneda,$select_condiciones, array_monedas, array_condiciones, array_via_embarque){
		$(this).modalPanel_Buscaproveedor();
                
		var $dialogoc =  $('#forma-buscaproveedor-window');
		$dialogoc.append($('div.buscador_proveedores').find('table.formaBusqueda_proveedores').clone());
		$('#forma-buscaproveedor-window').css({ "margin-left": -200, 	"margin-top": -200  });
		
                var $rfc_proveedor = $('#forma-comordencompra-window').find('input[name=rfc_proveedor]');
		var $razon_proveedor = $('#forma-comordencompra-window').find('input[name=razonproveedor]');
                var $dir_proveedor = $('#forma-comordencompra-window').find('input[name=dirproveedor]');
                var $id_proveedor = $('#forma-comordencompra-window').find('input[name=id_proveedor]');
                
                
                var $tabla_resultados = $('#forma-buscaproveedor-window').find('#tabla_resultado');
		var $campo_rfc = $('#forma-buscaproveedor-window').find('input[name=campo_rfc]');
		var $campo_email = $('#forma-buscaproveedor-window').find('input[name=campo_email]');
		var $campo_nombre = $('#forma-buscaproveedor-window').find('input[name=campo_nombre]');
		
		var $buscar_plugin_proveedor = $('#forma-buscaproveedor-window').find('#busca_proveedor_modalbox');
		var $cancelar_plugin_busca_proveedor = $('#forma-buscaproveedor-window').find('#cencela');
			
		$('#forma-entradamercancias-window').find('input[name=tipo_proveedor]').val('');
			
		//funcionalidad botones
		$buscar_plugin_proveedor.mouseover(function(){
			$(this).removeClass("onmouseOutBuscar").addClass("onmouseOverBuscar");
		});
		$buscar_plugin_proveedor.mouseout(function(){
			$(this).removeClass("onmouseOverBuscar").addClass("onmouseOutBuscar");
		});
		   
		$cancelar_plugin_busca_proveedor.mouseover(function(){
			$(this).removeClass("onmouseOutCancelar").addClass("onmouseOverCancelar");
		});
		$cancelar_plugin_busca_proveedor.mouseout(function(){
			$(this).removeClass("onmouseOverCancelar").addClass("onmouseOutCancelar");
		});
					
		//click buscar proveedor
		$buscar_plugin_proveedor.click(function(event){
                    
			//event.preventDefault();                                  getBuscaProveedores
			//var restful_json_service = config.getUrlForGetAndPost() + '/getBuscaProveedores.json'
                        var restful_json_service = document.location.protocol + '//' + document.location.host + '/'+controller+'/getBuscaProveedores.json'
			$arreglo = {    rfc:$campo_rfc.val(),
							email:$campo_email.val(),
							nombre:$campo_nombre.val(),
							iu:$('#lienzo_recalculable').find('input[name=iu]').val()
						}
			
			var trr = '';
			$tabla_resultados.children().remove();
			$.post(restful_json_service,$arreglo,function(entry){
				$.each(entry['Proveedores'],function(entryIndex,proveedor){
					
					trr = '<tr>';
						trr += '<td width="120">';
							trr += '<input type="hidden" id="id_prov" value="'+proveedor['id']+'">';
                                                        
                                                        trr += '<input type="hidden" id="id_moneda" value="'+proveedor['moneda_id']+'">';
                                                        trr += '<input type="hidden" id="descuento" value="'+proveedor['descuento']+'">';
                                                        trr += '<input type="hidden" id="limite_de_credito" value="'+proveedor['limite_de_credito']+'">';
                                                        trr += '<input type="hidden" id="id_dias_credito" value="'+proveedor['id_dias_credito']+'">';
                                                        trr += '<input type="hidden" id="id_tipo_embarque" value="'+proveedor['id_tipo_embarque']+'">';
                                                        trr += '<input type="hidden" id="comienzo_de_credito" value="'+proveedor['comienzo_de_credito']+'">';
                                                        
							trr += '<input type="hidden" id="tipo_prov" value="'+proveedor['proveedortipo_id']+'">';
							trr += '<span class="rfc">'+proveedor['rfc']+'</span>';
						trr += '</td>';
						trr += '<td width="250"><span id="razon_social">'+proveedor['razon_social']+'</span></td>';
						trr += '<td width="250"><span class="direccion">'+proveedor['direccion']+'</span></td>';
					trr += '</tr>';
                                        /*row.put("descuento",StringHelper.roundDouble(String.valueOf(rs.getDouble("descuento")),2));
                                        row.put("limite_de_credito",StringHelper.roundDouble(String.valueOf(rs.getDouble("limite_credito")),2));
                                        row.put("id_dias_credito",String.valueOf(rs.getInt("id_dias_credito")));
                                        row.put("id_tipo_envarque",String.valueOf(rs.getInt("id_tipo_envarque")));
                                        row.put("comienzo_de_credito",String.valueOf(rs.getInt("comienzo_de_credito")));*/
					
					$tabla_resultados.append(trr);
				});
				$tabla_resultados.find('tr:odd').find('td').css({ 'background-color' : '#e7e8ea'});
				$tabla_resultados.find('tr:even').find('td').css({ 'background-color' : '#FFFFFF'});

				$('tr:odd' , $tabla_resultados).hover(function () {
					$(this).find('td').css({ background : '#FBD850'});
				}, function() {
					$(this).find('td').css({'background-color':'#e7e8ea'});
				});
				$('tr:even' , $tabla_resultados).hover(function () {
					$(this).find('td').css({'background-color':'#FBD850'});
				}, function() {
					$(this).find('td').css({'background-color':'#FFFFFF'});
				});
				
				//seleccionar un producto del grid de resultados
				$tabla_resultados.find('tr').click(function(){
					
                                        $rfc_proveedor.val($(this).find('.rfc').html());
                                        $razon_proveedor.val($(this).find('#razon_social').html());
                                        $dir_proveedor.val($(this).find('.direccion').html());
                                        $id_proveedor.val($(this).find('#id_prov').val());
                                        
                                        var id_moneda=$(this).find('#id_moneda').val();
                                        var id_dias_credito=$(this).find('#id_dias_credito').val();
                                        var id_tipo_embarque=$(this).find('#id_tipo_embarque').val();
                                        //carga el select de monedas  con la moneda del cliente seleccionada por default
					$select_moneda.children().remove();
					var moneda_hmtl = '';
					$.each(array_monedas ,function(entryIndex,moneda){
						if( parseInt(moneda['id']) == parseInt(id_moneda) ){
							moneda_hmtl += '<option value="' + moneda['id'] + '" selected="yes">' + moneda['descripcion'] + '</option>';
						}else{
							moneda_hmtl += '<option value="' + moneda['id'] + '"  >' + moneda['descripcion'] + '</option>';
						}
					});
					$select_moneda.append(moneda_hmtl);
                                        
                                        //carga select de condiciones con los dias de Credito default del Cliente
					$select_condiciones.children().remove();
					var hmtl_condiciones;
					$.each(array_condiciones, function(entryIndex,condicion){
						if( parseInt(condicion['id']) == parseInt(id_dias_credito) ){
							hmtl_condiciones += '<option value="' + condicion['id'] + '" selected="yes">' + condicion['descripcion'] + '</option>';
						}else{
							hmtl_condiciones += '<option value="' + condicion['id'] + '" >' + condicion['descripcion'] + '</option>';
						}
					});
					$select_condiciones.append(hmtl_condiciones);					
					
                                        
                                        
                                        //carga select de condiciones con los dias de Credito default del Cliente
					$select_via_embarque.children().remove();
					var hmtl_via_embarque;
					$.each(array_via_embarque, function(entryIndex,embarque){
						if( parseInt(embarque['id']) == parseInt(id_tipo_embarque) ){
							hmtl_via_embarque += '<option value="' + embarque['id'] + '" selected="yes">' + embarque['tipo_embarque'] + '</option>';
						}else{
							hmtl_via_embarque += '<option value="' + embarque['id'] + '" >' + embarque['tipo_embarque'] + '</option>';
						}
					});
					$select_via_embarque.append(hmtl_via_embarque);
                                        
                                        
                                        //elimina la ventana de busqueda
					var remove = function() { $(this).remove(); };
					$('#forma-buscaproveedor-overlay').fadeOut(remove);
				});
			});
		});
		
		$cancelar_plugin_busca_proveedor.click(function(event){
			//event.preventDefault();
			var remove = function() { $(this).remove(); };
			$('#forma-buscaproveedor-overlay').fadeOut(remove);
		});
	}//termina buscador de proveedores
        
        
        
        	
	//buscador de productos
	$busca_productos = function(sku_buscar){
           
		//limpiar_campos_grids();
		$(this).modalPanel_Buscaproducto();
		var $dialogoc =  $('#forma-buscaproducto-window');
		//var $dialogoc.prependTo('#forma-buscaproduct-window');
		$dialogoc.append($('div.buscador_productos').find('table.formaBusqueda_productos').clone());
		
		$('#forma-buscaproducto-window').css({"margin-left": -200, 	"margin-top": -180});
		
		var $tabla_resultados = $('#forma-buscaproducto-window').find('#tabla_resultado');
		
		var $campo_sku = $('#forma-buscaproducto-window').find('input[name=campo_sku]');
		var $select_tipo_producto = $('#forma-buscaproducto-window').find('select[name=tipo_producto]');
		var $campo_descripcion = $('#forma-buscaproducto-window').find('input[name=campo_descripcion]');
		
		//var $buscar_plugin_producto = $('#forma-buscaproducto-window').find('a[href*=busca_producto_modalbox]');
		//var $cancelar_plugin_busca_producto = $('#forma-buscaproducto-window').find('a[href*=cencela]');
		var $buscar_plugin_producto = $('#forma-buscaproducto-window').find('#busca_producto_modalbox');
		var $cancelar_plugin_busca_producto = $('#forma-buscaproducto-window').find('#cencela');
		
		//funcionalidad botones
		$buscar_plugin_producto.mouseover(function(){
			$(this).removeClass("onmouseOutBuscar").addClass("onmouseOverBuscar");
		});
		$buscar_plugin_producto.mouseout(function(){
			$(this).removeClass("onmouseOverBuscar").addClass("onmouseOutBuscar");
		});
		   
		$cancelar_plugin_busca_producto.mouseover(function(){
			$(this).removeClass("onmouseOutCancelar").addClass("onmouseOverCancelar");
		});
		$cancelar_plugin_busca_producto.mouseout(function(){
			$(this).removeClass("onmouseOverCancelar").addClass("onmouseOutCancelar");
		});

		//buscar todos los tipos de productos
		var input_json_tipos = document.location.protocol + '//' + document.location.host + '/'+controller+'/getProductoTipos.json';
		$arreglo = {'iu':$('#lienzo_recalculable').find('input[name=iu]').val()}
		$.post(input_json_tipos,$arreglo,function(data){
			//Llena el select tipos de productos en el buscador
			$select_tipo_producto.children().remove();
			var prod_tipos_html = '<option value="0" selected="yes">[--Seleccionar Tipo--]</option>';
			$.each(data['prodTipos'],function(entryIndex,pt){
				prod_tipos_html += '<option value="' + pt['id'] + '"  >' + pt['titulo'] + '</option>';
			});
			$select_tipo_producto.append(prod_tipos_html);
		});
		
		//Aqui asigno al campo sku del buscador si el usuario ingresó un sku antes de hacer clic en buscar en la ventana principal
		$campo_sku.val(sku_buscar);
		
		//click buscar productos
		$buscar_plugin_producto.click(function(event){
			//event.preventDefault();
			var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getBuscadorProductos.json';
			$arreglo = {	'sku':$campo_sku.val(),
							'tipo':$select_tipo_producto.val(),
							'descripcion':$campo_descripcion.val(),
							'iu':$('#lienzo_recalculable').find('input[name=iu]').val()
						}
			
			var trr = '';
			$tabla_resultados.children().remove();
			$.post(input_json,$arreglo,function(entry){
				$.each(entry['productos'],function(entryIndex,producto){
					trr = '<tr>';
						trr += '<td width="120">';
							trr += '<input type="hidden" id="id_prod_buscador" value="'+producto['id']+'">';
							trr += '<span class="sku_prod_buscador">'+producto['sku']+'</span>';
						trr += '</td>';
						trr += '<td width="280"><span class="titulo_prod_buscador">'+producto['descripcion']+'</span></td>';
						trr += '<td width="90">';
							trr += '<span class="unidad_id" style="display:none;">'+producto['unidad_id']+'</span>';
							trr += '<span class="utitulo">'+producto['unidad']+'</span>';
						trr += '</td>';
						trr += '<td width="90"><span class="tipo_prod_buscador">'+producto['tipo']+'</span></td>';
					trr += '</tr>';
					$tabla_resultados.append(trr);
				});
				$tabla_resultados.find('tr:odd').find('td').css({'background-color' : '#e7e8ea'});
				$tabla_resultados.find('tr:even').find('td').css({'background-color' : '#FFFFFF'});
				
				$('tr:odd' , $tabla_resultados).hover(function () {
					$(this).find('td').css({background : '#FBD850'});
				}, function() {
					//$(this).find('td').css({'background-color':'#DDECFF'});
					$(this).find('td').css({'background-color':'#e7e8ea'});
				});
				$('tr:even' , $tabla_resultados).hover(function () {
					$(this).find('td').css({'background-color':'#FBD850'});
				}, function() {
					$(this).find('td').css({'background-color':'#FFFFFF'});
				});
				
				//seleccionar un producto del grid de resultados
				$tabla_resultados.find('tr').click(function(){
					//asignar a los campos correspondientes el sku y y descripcion
					$('#forma-comordencompra-window').find('input[name=sku_producto]').val($(this).find('span.sku_prod_buscador').html());
					$('#forma-comordencompra-window').find('input[name=nombre_producto]').val($(this).find('span.titulo_prod_buscador').html());
					//elimina la ventana de busqueda
					var remove = function() {$(this).remove();};
					$('#forma-buscaproducto-overlay').fadeOut(remove);
					//asignar el enfoque al campo sku del producto
					$('#forma-comordencompra-window').find('input[name=sku_producto]').focus();
				});
				
			});//termina llamada json
		});
		
		//si hay algo en el campo sku al cargar el buscador, ejecuta la busqueda
		if($campo_sku.val() != ''){
			$buscar_plugin_producto.trigger('click');
		}
		
		$cancelar_plugin_busca_producto.click(function(event){
			//event.preventDefault();
			var remove = function() {$(this).remove();};
			$('#forma-buscaproducto-overlay').fadeOut(remove);
		});
	}//termina buscador de productos
	
	
	
	
	
	//buscador de presentaciones disponibles para un producto
                   
	$buscador_presentaciones_producto = function($id_proveedor,$clave_proveedor, sku_producto,$nombre_producto,$grid_productos,$select_moneda,$tipo_cambio){
            
		//verifica si el campo rfc proveedor no esta vacio
		if($clave_proveedor != ''){
			//verifica si el campo sku no esta vacio para realizar busqueda
			if(sku_producto != ''){
				var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getPresentacionesProducto.json';
				$arreglo = {'sku':sku_producto,
				            'iu':$('#lienzo_recalculable').find('input[name=iu]').val()
					   };

				var trr = '';
				
				$.post(input_json,$arreglo,function(entry){

					//verifica si el arreglo  retorno datos
					if (entry['Presentaciones'].length > 0){
                                            $(this).modalPanel_Buscapresentacion();
                                            
						var $dialogoc =  $('#forma-buscapresentacion-window');
						$dialogoc.append($('div.buscador_presentaciones').find('table.formaBusqueda_presentaciones').clone());
						$('#forma-buscapresentacion-window').css({"margin-left": -200, "margin-top": -180});
						
						var $tabla_resultados = $('#forma-buscapresentacion-window').find('#tabla_resultado');
						//var $cancelar_plugin_busca_lotes_producto = $('#forma-buscapresentacion-window').find('a[href*=cencela]');
						var $cancelar_plugin_busca_lotes_producto = $('#forma-buscapresentacion-window').find('#cencela');
						$tabla_resultados.children().remove();
						
						
						$cancelar_plugin_busca_lotes_producto.mouseover(function(){
							$(this).removeClass("onmouseOutCancelar").addClass("onmouseOverCancelar");
						});
						$cancelar_plugin_busca_lotes_producto.mouseout(function(){
							$(this).removeClass("onmouseOverCancelar").addClass("onmouseOutCancelar");
						});
						
						//crea el tr con los datos del producto seleccionado
						$.each(entry['Presentaciones'],function(entryIndex,pres){
							trr = '<tr>';
								trr += '<td width="100">';
									trr += '<span class="id_prod" style="display:none">'+pres['id']+'</span>';
									trr += '<span class="sku">'+pres['sku']+'</span>';
								trr += '</td>';
								trr += '<td width="250"><span class="titulo">'+pres['titulo']+'</span></td>';
								trr += '<td width="80">';
									trr += '<span class="unidad" style="display:none">'+pres['unidad']+'</span>';
									trr += '<span class="id_pres" style="display:none">'+pres['id_presentacion']+'</span>';
									trr += '<span class="pres">'+pres['presentacion']+'</span>';
									trr += '<span class="dec" style="display:none">'+pres['decimales']+'</span>';
								trr += '</td>';
							trr += '</tr>';
							$tabla_resultados.append(trr);
						});//termina llamada json
						
						$tabla_resultados.find('tr:odd').find('td').css({'background-color' : '#e7e8ea'});
						$tabla_resultados.find('tr:even').find('td').css({'background-color' : '#FFFFFF'});
						
						$('tr:odd' , $tabla_resultados).hover(function () {
							$(this).find('td').css({background : '#FBD850'});
						}, function() {
								//$(this).find('td').css({'background-color':'#DDECFF'});
							$(this).find('td').css({'background-color':'#e7e8ea'});
						});
						$('tr:even' , $tabla_resultados).hover(function () {
							$(this).find('td').css({'background-color':'#FBD850'});
						}, function() {
							$(this).find('td').css({'background-color':'#FFFFFF'});
						});
						
						//seleccionar un producto del grid de resultados
						$tabla_resultados.find('tr').click(function(){
							//llamada a la funcion que busca y agrega producto al grid, se le pasa como parametro el lote y el almacen
							var id_prod = $(this).find('span.id_prod').html();
							var sku = $(this).find('span.sku').html();
							var titulo = $(this).find('span.titulo').html();
							var unidad = $(this).find('span.unidad').html();
							var id_pres = $(this).find('span.id_pres').html();
							var pres = $(this).find('span.pres').html();
							var num_dec = $(this).find('span.dec').html();
							
							var prec_unitario=" ";
							var id_moneda=0;
							
							//llamada a la funcion que agrega el producto al grid
							$agrega_producto_grid($grid_productos,id_prod,sku,titulo,unidad,id_pres,pres,prec_unitario,$select_moneda,id_moneda,$tipo_cambio,num_dec);
							
							$nombre_producto.val(titulo);//muestra el titulo del producto en el campo nombre del producto de la ventana de cotizaciones
							
							//elimina la ventana de busqueda
							var remove = function() {$(this).remove();};
							$('#forma-buscapresentacion-overlay').fadeOut(remove);
						});
						
						$cancelar_plugin_busca_lotes_producto.click(function(event){
							//event.preventDefault();
							var remove = function() {$(this).remove();};
							$('#forma-buscapresentacion-overlay').fadeOut(remove);
						});
						
					}else{
						jAlert("El producto que intenta agregar no existe, pruebe ingresando otro.\nHaga clic en Buscar.",'! Atencion');
						$('#forma-comordencompra-window').find('input[name=titulo_producto]').val('');
					}
				});
				
			}else{
					jAlert("Es necesario ingresar un Sku de producto valido", 'Atencion!');
			}
		}else{
			jAlert("Es necesario seleccionar un Proveedor", 'Atencion!');
		}
		
	}//termina buscador dpresentaciones disponibles de un producto
	
    
    
    
	
	//calcula totales(subtotal, impuesto, total)
	$calcula_totales = function(){
           
		var $campo_subtotal = $('#forma-comordencompra-window').find('input[name=subtotal]');
		var $campo_impuesto = $('#forma-comordencompra-window').find('input[name=impuesto]');
		//var $campo_impuesto_retenido = $('#forma-comordencompra-window').find('input[name=impuesto_retenido]');
		var $campo_total = $('#forma-comordencompra-window').find('input[name=total]');
		//var $campo_tc = $('#forma-comordencompra-window').find('input[name=tc]');
		var $valor_impuesto = $('#forma-comordencompra-window').find('input[name=valorimpuesto]');
		var $grid_productos = $('#forma-comordencompra-window').find('#grid_productos');
		var $empresa_immex = $('#forma-comordencompra-window').find('input[name=empresa_immex]');
		var $tasa_ret_immex = $('#forma-comordencompra-window').find('input[name=tasa_ret_immex]');
		
		var sumaSubTotal = 0; //es la suma de todos los importes
		var sumaImpuesto = 0; //valor del iva
		var impuestoRetenido = 0; //monto del iva retenido de acuerdo a la tasa de retencion immex
		var sumaTotal = 0; //suma del subtotal + totalImpuesto
		
		//si valor del impuesto es null o vacio, se le asigna un 0
		if( $valor_impuesto.val()== null || $valor_impuesto.val()== ''){
			$valor_impuesto.val(0);
		}
		
		$grid_productos.find('tr').each(function (index){
			if(( $(this).find('#cost').val() != ' ') && ( $(this).find('#cant').val() != ' ' )){
				//acumula los importes en la variable subtotal
				sumaSubTotal = parseFloat(sumaSubTotal) + parseFloat(quitar_comas($(this).find('#import').val()));
				//alert($(this).find('#import').val());
				if($(this).find('#totimp').val() != ''){
					//alert($(this).find('#totimp').val());
					sumaImpuesto =  parseFloat(sumaImpuesto) + parseFloat($(this).find('#totimp').val());
				}
			}
		});
		
		//calcular  la tasa de retencion IMMEX
	        //impuestoRetenido = parseFloat(sumaSubTotal)  * parseFloat(parseFloat($tasa_ret_immex.val()));
		
		//calcula el total sumando el subtotal y el impuesto menos la retencion
		sumaTotal = parseFloat(sumaSubTotal) + parseFloat(sumaImpuesto);// - parseFloat(impuestoRetenido);
		
		//redondea a dos digitos el  subtotal y lo asigna  al campo subtotal
		$campo_subtotal.val($(this).agregar_comas(  parseFloat(sumaSubTotal).toFixed(2)  ));
		//redondea a dos digitos el impuesto y lo asigna al campo impuesto
		$campo_impuesto.val($(this).agregar_comas(  parseFloat(sumaImpuesto).toFixed(2)  ));
		//redondea a dos digitos el impuesto y lo asigna al campo retencion
		//$campo_impuesto_retenido.val($(this).agregar_comas(  parseFloat(impuestoRetenido).toFixed(2)  ));
		//redondea a dos digitos la suma  total y se asigna al campo total
		$campo_total.val($(this).agregar_comas(  parseFloat(sumaTotal).toFixed(2)  ));
		
	}//termina calcular totales
	
	
	
	
	
	
	//agregar producto al grid
	$agrega_producto_grid = function($grid_productos,id_prod,sku,titulo,unidad,id_pres,pres,prec_unitario,$select_moneda, id_moneda, $tipo_cambio,num_dec){
            
		var $id_impuesto = $('#forma-comordencompra-window').find('input[name=id_impuesto]');
		var $valor_impuesto = $('#forma-comordencompra-window').find('input[name=valorimpuesto]');
		//si  el campo tipo de cambio es null o vacio, se le asigna un 0
		if( $valor_impuesto.val()== null || $valor_impuesto.val()== ''){
			$valor_impuesto.val(0);
		}
		
		var encontrado = 0;
		//busca el sku y la presentacion en el grid
		$grid_productos.find('tr').each(function (index){
			if(( $(this).find('#skuprod').val() == sku.toUpperCase() )  && (parseInt($(this).find('#idpres').val())== parseInt(id_pres) ) && (parseInt($(this).find('#elim').val())!=0)){
				encontrado=1;//el producto ya esta en el grid
			}
		});
		
		
		if(parseInt(encontrado)!=1){//si el producto no esta en el grid entra aqui
			//ocultamos el boton facturar para permitir Guardar los cambios  antes de facturar
			$('#forma-comordencompra-window').find('#facturar').hide();
			//obtiene numero de trs
			var tr = $("tr", $grid_productos).size();
			tr++;
			
			var trr = '';
			trr = '<tr>';
				trr += '<td class="grid" style="font-size: 11px;  border:1px solid #C1DAD7;" width="60">';
					trr += '<a href="elimina_producto" id="delete'+ tr +'">Eliminar</a>';
					trr += '<input type="hidden" 	name="eliminado" id="elim" value="1">';//el 1 significa que el registro no ha sido eliminado
					trr += '<input type="hidden" 	name="iddetalle" id="idd" value="0">';//este es el id del registro que ocupa el producto en la tabla pocpedidos_detalles
				trr += '</td>';
				trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="114">';
					trr += '<input type="hidden" 	name="idproducto" id="idprod" value="'+ id_prod +'">';
					trr += '<INPUT TYPE="text" 		name="sku'+ tr +'" value="'+ sku +'" id="skuprod" class="borde_oculto" readOnly="true" style="width:110px;">';
				trr += '</td>';
				trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="202">';
					trr += '<INPUT TYPE="text" 		name="nombre'+ tr +'" 	value="'+ titulo +'" id="nom" class="borde_oculto" readOnly="true" style="width:198px;">';
				trr += '</td>';
				trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="90">';
					trr += '<INPUT TYPE="text" 	name="unidad'+ tr +'" 	value="'+ unidad +'" id="uni" class="borde_oculto" readOnly="true" style="width:86px;">';
				trr += '</td>';
				trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="100">';
					trr += '<INPUT type="hidden"    name="id_presentacion"      value="'+  id_pres +'" id="idpres">';
					trr += '<INPUT type="hidden"    name="numero_decimales"     value="'+  num_dec +'" id="numdec">';
					trr += '<INPUT TYPE="text" 	name="presentacion'+ tr +'" value="'+  pres +'" id="pres" class="borde_oculto" readOnly="true" style="width:96px;">';
				trr += '</td>';
				trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="80">';
					trr += '<INPUT TYPE="text" 	name="cantidad" value=" " id="cant" style="width:76px;">';
				trr += '</td>';
				trr += '<td class="grid2" style="font-size: 11px;  border:1px solid #C1DAD7;" width="90">';
					trr += '<INPUT TYPE="text" 	name="costo" 	value="'+ prec_unitario +'" id="cost" style="width:86px; text-align:right;">';
				trr += '</td>';
				trr += '<td class="grid2" style="font-size: 11px;  border:1px solid #C1DAD7;" width="90">';
					trr += '<INPUT TYPE="text"      name="importe'+ tr +'" 	 value="" id="import" readOnly="true" style="width:86px; text-align:right;">';
					trr += '<INPUT type="hidden"    name="id_imp_prod"    	 value="'+  $id_impuesto.val()    +'" id="idimppord">';
					trr += '<INPUT type="hidden"    name="valor_imp"     	 value="'+  $valor_impuesto.val() +'" id="ivalorimp">';
					trr += '<input type="hidden" 	name="totimpuesto'+ tr +'"        id="totimp" value="0">';
				trr += '</td>';
			trr += '</tr>';
            
			$grid_productos.append(trr);
			
			//al iniciar el campo tiene un  caracter en blanco, al obtener el foco se cambia el  espacio por comillas
			$grid_productos.find('#cant').focus(function(e){
				if($(this).val() == ' '){
						$(this).val('');
				}
			});
			
			//recalcula importe al perder enfoque el campo cantidad
			$grid_productos.find('#cant').blur(function(){
                            
				if ($(this).val() == ''){
					$(this).val(' ');
				}
                                
				if( ($(this).val() != ' ') && ($(this).parent().parent().find('#cost').val() != ' ') )
				{	//calcula el importe
					$(this).parent().parent().find('#import').val(parseFloat($(this).val()) * parseFloat($(this).parent().parent().find('#cost').val()));
					//redondea el importe en dos decimales
					//$(this).parent().parent().find('#import').val( Math.round(parseFloat($(this).parent().parent().find('#import').val())*100)/100 );
					$(this).parent().parent().find('#import').val( parseFloat($(this).parent().parent().find('#import').val()).toFixed(2) );
					
					//calcula el impuesto para este producto multiplicando el importe por el valor del iva
                                        
					$(this).parent().parent().find('#totimp').val( parseFloat( $(this).parent().parent().find('#import').val() ) * parseFloat(  $(this).parent().parent().find('#ivalorimp').val()  ));
				}else{
					$(this).parent().parent().find('#import').val('');
					$(this).parent().parent().find('#totimp').val('');
				}
				
				
				
				var numero_decimales = $(this).parent().parent().find('#numdec').val();
				var patron = /^-?[0-9]+([,\.][0-9]{0,0})?$/;
				if(parseInt(numero_decimales)==1){
					patron = /^-?[0-9]+([,\.][0-9]{0,1})?$/;
				}
				if(parseInt(numero_decimales)==2){
					patron = /^-?[0-9]+([,\.][0-9]{0,2})?$/;
				}
				if(parseInt(numero_decimales)==3){
					patron = /^-?[0-9]+([,\.][0-9]{0,3})?$/;
				}
				if(parseInt(numero_decimales)==4){
					patron = /^-?[0-9]+([,\.][0-9]{0,4})?$/;
				}
				
				/*
				if(patron.test($(this).val())){
					alert("Si valido"+$(this).val());
				}else{
					alert("El numero de decimales es incorrecto: "+$(this).val());
					$(this).val('')
				}
				*/
				
				if(!patron.test($(this).val())){
					//alert("Si valido"+$(this).val());
				}else{
					
				}
				
				$calcula_totales();//llamada a la funcion que calcula totales
			});
			
			//al iniciar el campo tiene un  caracter en blanco, al obtener el foco se elimina el  espacio por comillas
			$grid_productos.find('#cost').focus(function(e){
                        
				if($(this).val() == ' '){
					$(this).val('');
				}
			});
                        
			//recalcula importe al perder enfoque el campo costo
			$grid_productos.find('#cost').blur(function(){
                        
                            
				if ($(this).val() == ''){
					$(this).val(' ');
				}
				
				if( ($(this).val() != ' ') && ($(this).parent().parent().find('#cant').val() != ' ') )
				{	//calcula el importe
                                        
					$(this).parent().parent().find('#import').val( parseFloat($(this).val()) * parseFloat( $(this).parent().parent().find('#cant').val()) );
					//redondea el importe en dos decimales
					//$(this).parent().parent().find('#import').val(Math.round(parseFloat($(this).parent().parent().find('#import').val())*100)/100);
					$(this).parent().parent().find('#import').val( parseFloat($(this).parent().parent().find('#import').val()).toFixed(2));
					
					//calcula el impuesto para este producto multiplicando el importe por el valor del iva
                                        
					$(this).parent().parent().find('#totimp').val( parseFloat($(this).parent().parent().find('#import').val()) * parseFloat(  $(this).parent().parent().find('#ivalorimp').val()  ));
                                        
				}else{
					$(this).parent().parent().find('#import').val('');
					$(this).parent().parent().find('#totimp').val('');
				}
                                
				$calcula_totales();//llamada a la funcion que calcula totales
			});
			
			
			
			/*
			//validar campo costo, solo acepte numeros y punto
			$grid_productos.find('#cost').keypress(function(e){
				// Permitir  numeros, borrar, suprimir, TAB, puntos, comas
				if (e.which == 8 || e.which == 46 || e.which==13 || e.which == 0 || (e.which >= 48 && e.which <= 57 )) {
					return true;
				}else {
					return false;
				}
			});
			
			//validar campo cantidad, solo acepte numeros y punto
			$grid_productos.find('#cant').keypress(function(e){
				// Permitir  numeros, borrar, suprimir, TAB, puntos, comas
				if (e.which == 8 || e.which == 46 || e.which==13 || e.which == 0 || (e.which >= 48 && e.which <= 57 )) {
					return true;
				}else {
					return false;
				}
			});
			
			
			//elimina un producto del grid
			$grid_productos.find('#delete'+ tr).bind('click',function(event){
				event.preventDefault();
				if(parseInt($(this).parent().find('#elim').val()) != 0){
					//asigna espacios en blanco a todos los input de la fila eliminada
					$(this).parent().parent().find('input').val(' ');
					
					//asigna un 0 al input eliminado como bandera para saber que esta eliminado
					$(this).parent().find('#elim').val(0);//cambiar valor del campo a 0 para indicar que se ha elimnado
					
					//oculta la fila eliminada
					$(this).parent().parent().hide();
					$calcula_totales();//llamada a la funcion que calcula totales
				}
			});
			*/
		}else{
			jAlert("El producto: "+sku+" con presentacion: "+pres+" ya se encuentra en el listado, seleccione otro diferente.", 'Atencion!');
		}
		
	}//termina agregar producto al grid
	
	
	
	
	
	
	
	
	
	
	
	
	
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
	//nueva Orden de Compra
	$new_orden_compra.click(function(event){
		event.preventDefault();
		var id_to_show = 0;
		
		$(this).modalPanel_orden_compra();
		
		var form_to_show = 'formaordencompra00';
		$('#' + form_to_show).each (function(){this.reset();});
		var $forma_selected = $('#' + form_to_show).clone();
		$forma_selected.attr({id : form_to_show + id_to_show});
		//var accion = "getCotizacion";
		
		$('#forma-comordencompra-window').css({"margin-left": -340, 	"margin-top": -235});
		
		$forma_selected.prependTo('#forma-comordencompra-window');
		$forma_selected.find('.panelcito_modal').attr({id : 'panelcito_modal' + id_to_show , style:'display:table'});
		
		$tabs_li_funxionalidad();
		
		//var json_string = document.location.protocol + '//' + document.location.host + '/' + controller + '/' + accion + '/' + id_to_show + '/out.json';
		var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getOrden_Compra.json';
		$arreglo = {'id_orden_compra':id_to_show,
			    'iu':$('#lienzo_recalculable').find('input[name=iu]').val()
			   };
        
		var $id_orden_compra = $('#forma-comordencompra-window').find('input[name=id_orden_compra]');
		var $total_tr = $('#forma-comordencompra-window').find('input[name=total_tr]');
		var $busca_proveedor = $('#forma-comordencompra-window').find('a[href*=busca_proveedor]');
		var $id_proveedor = $('#forma-comordencompra-window').find('input[name=id_proveedor]');
		var $rfc_proveedor = $('#forma-comordencompra-window').find('input[name=rfc_proveedor]');
		var $razon_proveedor = $('#forma-comordencompra-window').find('input[name=razonproveedor]');
		var $dir_proveedor = $('#forma-comordencompra-window').find('input[name=dirproveedor]');
		var $observaciones = $('#forma-comordencompra-window').find('textarea[name=observaciones]');
		
		var $select_moneda = $('#forma-comordencompra-window').find('select[name=select_moneda]');
		var $tipo_cambio = $('#forma-comordencompra-window').find('input[name=tipo_cambio]');
		var $grupo = $('#forma-comordencompra-window').find('input[name=grupo]');
		var $select_condiciones = $('#forma-comordencompra-window').find('select[name=select_condiciones]');
		var consigandoA= $('#forma-comordencompra-window').find('input[name=consigandoA]');
		var $select_via_embarque = $('#forma-comordencompra-window').find('select[name=via_envarque]');
                
		var $sku_producto = $('#forma-comordencompra-window').find('input[name=sku_producto]');
		var $nombre_producto = $('#forma-comordencompra-window').find('input[name=nombre_producto]');
		//buscar producto
		var $busca_sku = $('#forma-comordencompra-window').find('a[href*=busca_sku]');
		//href para agregar producto al grid
		var $agregar_producto = $('#forma-comordencompra-window').find('a[href*=agregar_producto]');
		
                
                /*var $empresa_immex = $('#forma-comordencompra-window').find('input[name=empresa_immex]');
		var $tasa_ret_immex = $('#forma-comordencompra-window').find('input[name=tasa_ret_immex]');
		
		
		var $cta_mn = $('#forma-comordencompra-window').find('input[name=cta_mn]');
		var $cta_usd = $('#forma-comordencompra-window').find('input[name=cta_usd]');
                
		var $orden_compra = $('#forma-comordencompra-window').find('input[name=orden_compra]');
		*/
		var $id_impuesto = $('#forma-comordencompra-window').find('input[name=id_impuesto]');
		var $valor_impuesto = $('#forma-comordencompra-window').find('input[name=valorimpuesto]');
                
		
		
		var $cancelar_orden_compra = $('#forma-comordencompra-window').find('#cancelar_orden_compra');
		var $descargarpdf = $('#forma-comordencompra-window').find('#descargarpdf');
		var $cancelado = $('#forma-comordencompra-window').find('input[name=cancelado]');
		
		//grid de productos
		var $grid_productos = $('#forma-comordencompra-window').find('#grid_productos');
		//grid de errores
		var $grid_warning = $('#forma-comordencompra-window').find('#div_warning_grid').find('#grid_warning');
		
		//var $flete = $('#forma-comordencompra-window').find('input[name=flete]');
		var $subtotal = $('#forma-comordencompra-window').find('input[name=subtotal]');
		var $impuesto = $('#forma-comordencompra-window').find('input[name=impuesto]');
		var $total = $('#forma-comordencompra-window').find('input[name=total]');
		
		var $cerrar_plugin = $('#forma-comordencompra-window').find('#close');
		var $cancelar_plugin = $('#forma-comordencompra-window').find('#boton_cancelar');
		var $submit_actualizar = $('#forma-comordencompra-window').find('#submit');
		
		//$campo_factura.css({'background' : '#ffffff'});
		
		//ocultar boton de facturar y descargar pdf. Solo debe estar activo en editar
		//$boton_descargarpdf.hide();
		
		//$empresa_immex.val('false');
		//$tasa_ret_immex.val('0');
                
                $id_orden_compra.val(0);//para nueva Orden de Compra el id es 0
		$cancelar_orden_compra.hide();
		$descargarpdf.hide();
		$cancelado .hide();
		
                /*
		$permitir_solo_numeros($no_cuenta);
		$no_cuenta.attr('disabled','-1');
		$etiqueta_digit.attr('disabled','-1');
		*/
		
		var respuestaProcesada = function(data){
			if ( data['success'] == "true" ){
				jAlert("La Orden de Compra se guard&oacute; con &eacute;xito", 'Atencion!');
				var remove = function() {$(this).remove();};
				$('#forma-comordencompra-overlay').fadeOut(remove);
				$get_datos_grid();
			}else{
				// Desaparece todas las interrogaciones si es que existen
				//$('#forma-comordencompra-window').find('.div_one').css({'height':'545px'});//sin errores
				$('#forma-comordencompra-window').find('.pocpedidos_div_one').css({'height':'568px'});//con errores
				$('#forma-comordencompra-window').find('div.interrogacion').css({'display':'none'});

				$grid_productos.find('#cant').css({'background' : '#ffffff'});
				$grid_productos.find('#cost').css({'background' : '#ffffff'});

				$('#forma-comordencompra-window').find('#div_warning_grid').css({'display':'none'});
				$('#forma-comordencompra-window').find('#div_warning_grid').find('#grid_warning').children().remove();

				var valor = data['success'].split('___');
				//muestra las interrogaciones
				for (var element in valor){
					tmp = data['success'].split('___')[element];
					longitud = tmp.split(':');
					
					if( longitud.length > 1 ){
						$('#forma-comordencompra-window').find('img[rel=warning_' + tmp.split(':')[0] + ']')
						.parent()
						.css({'display':'block'})
						.easyTooltip({tooltipId: "easyTooltip2",content: tmp.split(':')[1]});
						
						//alert(tmp.split(':')[0]);
						
						if(parseInt($("tr", $grid_productos).size())>0){
							for (var i=1;i<=parseInt($("tr", $grid_productos).size());i++){
								if((tmp.split(':')[0]=='cantidad'+i) || (tmp.split(':')[0]=='costo'+i)){
									//alert(tmp.split(':')[0]);
									$('#forma-comordencompra-window').find('.comordencompra_div_one').css({'height':'568px'});
									//$('#forma-comordencompra-window').find('.div_three').css({'height':'910px'});
									
									$('#forma-comordencompra-window').find('#div_warning_grid').css({'display':'block'});
									if(tmp.split(':')[0].substring(0, 8) == 'cantidad'){
										$grid_productos.find('input[name=cantidad]').eq(parseInt(i) - 1) .css({'background' : '#d41000'});
										//alert();
									}else{
										if(tmp.split(':')[0].substring(0, 5) == 'costo'){
											$grid_productos.find('input[name=costo]').eq(parseInt(i) - 1) .css({'background' : '#d41000'});
										}
									}
									
									//$grid_productos.find('input[name=' + tmp.split(':')[0] + ']').css({'background' : '#d41000'});
									//$grid_productos.find('select[name=' + tmp.split(':')[0] + ']').css({'background' : '#d41000'});
									
									var tr_warning = '<tr>';
										tr_warning += '<td width="20"><div><IMG SRC="../img/icono_advertencia.png" ALIGN="top" rel="warning_sku"></td>';
										tr_warning += '<td width="120">';
										tr_warning += '<INPUT TYPE="text" value="'+$grid_productos.find('input[name=sku' + i + ']').val()+'" class="borde_oculto" readOnly="true" style="width:116px; color:red">';
										tr_warning += '</td>';
										tr_warning += '<td width="200">';
										tr_warning += '<INPUT TYPE="text" value="'+$grid_productos.find('input[name=nombre' + i + ']').val()+'" class="borde_oculto" readOnly="true" style="width:196px; color:red">';
										tr_warning += '</td>';
										tr_warning += '<td width="235">';
										tr_warning += '<INPUT TYPE="text" value="'+ tmp.split(':')[1] +'" class="borde_oculto" readOnly="true" style="width:230px; color:red">';
										tr_warning += '</td>';
									tr_warning += '</tr>';
									$grid_warning.append(tr_warning);
								}
							}
						}
					}
				}

				$grid_warning.find('tr:odd').find('td').css({'background-color' : '#FFFFFF'});
				$grid_warning.find('tr:even').find('td').css({'background-color' : '#e7e8ea'});
			}
		}
		
		var options = {dataType :  'json', success : respuestaProcesada};
		$forma_selected.ajaxForm(options);
		
		//$.getJSON(json_string,function(entry){
		$.post(input_json,$arreglo,function(entry){
			//buscador de provedores
			$busca_proveedor.click(function(event){
				event.preventDefault();
				$busca_proveedores($select_via_embarque,$select_moneda,$select_condiciones, entry['Monedas'], entry['Condiciones'],entry['via_embarque']);
			});
                    
                    
			//$campo_tc.val(entry['tc']['tipo_cambio']);
			$id_impuesto.val(entry['iva']['0']['id_impuesto']);
			$valor_impuesto.val(entry['iva']['0']['valor_impuesto']);
			$tipo_cambio.val(entry['Tc']['0']['tipo_cambio']);
			
			//carga select denominacion con todas las monedas
			$select_moneda.children().remove();
			var moneda_hmtl = '';
			$.each(entry['Monedas'],function(entryIndex,moneda){
				moneda_hmtl += '<option value="' + moneda['id'] + '"  >' + moneda['descripcion'] + '</option>';
			});
			$select_moneda.append(moneda_hmtl);
                        
                        
			//carga select de terminos
			$select_condiciones.children().remove();
			var hmtl_condiciones;
			$.each(entry['Condiciones'],function(entryIndex,condicion){
				hmtl_condiciones += '<option value="' + condicion['id'] + '"  >' + condicion['descripcion'] + '</option>';
			});
			$select_condiciones.append(hmtl_condiciones);
			
			//carga select via de envarque
			$select_via_embarque.children().remove();
			var via_embarque_hmtl = '';
			$.each(entry['via_embarque'],function(entryIndex,via_envarque){
				via_embarque_hmtl += '<option value="' + via_envarque['id'] + '"  >' + via_envarque['tipo_embarque'] + '</option>';
			});
			$select_via_embarque.append(via_embarque_hmtl);
		},"json");//termina llamada json
		
		
		$tipo_cambio.keypress(function(e){
			// Permitir  numeros, borrar, suprimir, TAB, puntos, comas
			if (e.which == 8 || e.which == 46 || e.which==13 || e.which == 0 || (e.which >= 48 && e.which <= 57 )) {
				return true;
			}else {
				return false;
			}
		});
		
		
		
		//buscador de productos
		$busca_sku.click(function(event){
			event.preventDefault();
			$busca_productos($sku_producto.val());
		});
		
		//agregar producto al grid
		$agregar_producto.click(function(event){
			event.preventDefault();
			$buscador_presentaciones_producto($id_proveedor,$rfc_proveedor.val(), $sku_producto.val(),$nombre_producto,$grid_productos,$select_moneda,$tipo_cambio);
		});
		
		//desencadena clic del href Agregar producto al pulsar enter en el campo sku del producto
		$sku_producto.keypress(function(e){
			if(e.which == 13){
				$agregar_producto.trigger('click');
				return false;
			}
		});
		
		
		$submit_actualizar.bind('click',function(){
			var trCount = $("tr", $grid_productos).size();
			$total_tr.val(trCount);
			if(parseInt(trCount) > 0){
				$subtotal.val(quitar_comas($subtotal.val()));
				$impuesto.val(quitar_comas($impuesto.val()));
				$total.val(quitar_comas($total.val()));
				return true;
			}else{
				jAlert("No hay datos para actualizar", 'Atencion!');
				return false;
			}
		});
		
		//cerrar plugin
		$cerrar_plugin.bind('click',function(){
			var remove = function() {$(this).remove();};
			$('#forma-comordencompra-overlay').fadeOut(remove);
		});
		
		//boton cancelar y cerrar plugin
		$cancelar_plugin.click(function(event){
			var remove = function() {$(this).remove();};
			$('#forma-comordencompra-overlay').fadeOut(remove);
		});
		
	});
	
	
        
	var carga_formaordencompra00_for_datagrid00 = function(id_to_show, accion_mode){
		//aqui entra para eliminar una prefactura
		if(accion_mode == 'cancel'){
			
			var input_json = document.location.protocol + '//' + document.location.host + '/' + controller + '/' + 'logicDelete.json';
			$arreglo = {'id_orden_compra':id_to_show,
						'iu':$('#lienzo_recalculable').find('input[name=iu]').val()};
			jConfirm('Realmente desea eliminar  la Orden de Compra?', 'Dialogo de confirmacion', function(r) {
				if (r){
					$.post(input_json,$arreglo,function(entry){
						if ( entry['success'] == '1' ){
							jAlert("La Orden fue fue eliminada exitosamente", 'Atencion!');
							$get_datos_grid();
						}
						else{
							jAlert("La Orden de Compra no pudo ser eliminada", 'Atencion!');
						}
					},"json");
				}
			});
			
		}else{
			//aqui  entra para editar un registro
			$('#forma-comordencompra-window').remove();
			$('#forma-comordencompra-overlay').remove();
            
			var form_to_show = 'formaordencompra00';
			$('#' + form_to_show).each (function(){this.reset();});
			var $forma_selected = $('#' + form_to_show).clone();
			$forma_selected.attr({id : form_to_show + id_to_show});
			
			$(this).modalPanel_orden_compra();
			
			$('#forma-comordencompra-window').css({"margin-left": -340, 	"margin-top": -235});
			
			$forma_selected.prependTo('#forma-comordencompra-window');
			$forma_selected.find('.panelcito_modal').attr({id : 'panelcito_modal' + id_to_show , style:'display:table'});
			
			$tabs_li_funxionalidad();
			
			var $total_tr = $('#forma-comordencompra-window').find('input[name=total_tr]');
			var $id_orden_compra = $('#forma-comordencompra-window').find('input[name=id_orden_compra]');
			var $accion_proceso = $('#forma-comordencompra-window').find('input[name=accion_proceso]');
			var $folio = $('#forma-comordencompra-window').find('input[name=folio]');
			
			var $busca_proveedor = $('#forma-comordencompra-window').find('a[href*=busca_proveedor]');
			var $id_proveedor = $('#forma-comordencompra-window').find('input[name=id_proveedor]');
			var $rfc_proveedor = $('#forma-comordencompra-window').find('input[name=rfc_proveedor]');
			var $razon_proveedor = $('#forma-comordencompra-window').find('input[name=razonproveedor]');
			var $dir_proveedor = $('#forma-comordencompra-window').find('input[name=dirproveedor]');
			var $empresa_immex = $('#forma-comordencompra-window').find('input[name=empresa_immex]');
			var $tasa_ret_immex = $('#forma-comordencompra-window').find('input[name=tasa_ret_immex]');
			
			var $select_moneda = $('#forma-comordencompra-window').find('select[name=select_moneda]');
			var $tipo_cambio = $('#forma-comordencompra-window').find('input[name=tipo_cambio]');
			var $orden_compra = $('#forma-comordencompra-window').find('input[name=orden_compra]');
                        
                        
                        var $grupo = $('#forma-comordencompra-window').find('input[name=grupo]');
                        var $select_condiciones = $('#forma-comordencompra-window').find('select[name=select_condiciones]');
                        var consigandoA= $('#forma-comordencompra-window').find('input[name=consigandoA]');
                        var $select_via_embarque = $('#forma-comordencompra-window').find('select[name=via_envarque]');
			
			var $observaciones = $('#forma-comordencompra-window').find('textarea[name=observaciones]');
			
			var $select_condiciones = $('#forma-comordencompra-window').find('select[name=select_condiciones]');
			var $sku_producto = $('#forma-comordencompra-window').find('input[name=sku_producto]');
			var $nombre_producto = $('#forma-comordencompra-window').find('input[name=nombre_producto]');
			
                        
                        var $id_impuesto = $('#forma-comordencompra-window').find('input[name=id_impuesto]');
                        var $valor_impuesto = $('#forma-comordencompra-window').find('input[name=valorimpuesto]');

			//buscar producto
			var $busca_sku = $('#forma-comordencompra-window').find('a[href*=busca_sku]');
			//href para agregar producto al grid
			var $agregar_producto = $('#forma-comordencompra-window').find('a[href*=agregar_producto]');
			
			
			var $descargarpdf = $('#forma-comordencompra-window').find('#descargarpdf');
			var $cancelar_orden_compra = $('#forma-comordencompra-window').find('#cancelar_orden_compra');
			var $cancelado = $('#forma-comordencompra-window').find('input[name=cancelado]');
			
			//grid de productos
			var $grid_productos = $('#forma-comordencompra-window').find('#grid_productos');
			//grid de errores
			var $grid_warning = $('#forma-comordencompra-window').find('#div_warning_grid').find('#grid_warning');
			
		        //var $flete = $('#forma-comordencompra-window').find('input[name=flete]');
			var $subtotal = $('#forma-comordencompra-window').find('input[name=subtotal]');
			var $impuesto = $('#forma-comordencompra-window').find('input[name=impuesto]');
			//var $campo_impuesto_retenido = $('#forma-comordencompra-window').find('input[name=impuesto_retenido]');
			var $total = $('#forma-comordencompra-window').find('input[name=total]');
			
			var $cerrar_plugin = $('#forma-comordencompra-window').find('#close');
			var $cancelar_plugin = $('#forma-comordencompra-window').find('#boton_cancelar');
			var $submit_actualizar = $('#forma-comordencompra-window').find('#submit');
			
			//ocultar boton descargar y facturar. Despues de facturar debe mostrarse
			//$boton_descargarpdf.hide();
			//$boton_cancelarfactura.hide();
			
			$empresa_immex.val('false');
			$tasa_ret_immex.val('0');
			$busca_proveedor.hide();
			$cancelado.hide();
			
			
			//$etiqueta_digit.attr('disabled','-1');
			
			if(accion_mode == 'edit'){
				$accion_proceso.attr({'value' : "edit"});
				var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getOrden_Compra.json';
				$arreglo = {'id_orden_compra':id_to_show,
                                            'iu':$('#lienzo_recalculable').find('input[name=iu]').val()
                                           };
				
				var respuestaProcesada = function(data){
					if ( data['success'] == "true" ){
						$('#forma-comordencompra-window').find('div.interrogacion').css({'display':'none'});
						
						if($accion_proceso.val() == 'cancelar'){
							if ( data['actualizo'] == "1" ){
								jAlert("La Orden Compra se Cancel&oacute; con &eacute;xito", 'Atencion!');
							}else{
								jAlert(data['actualizo'], 'Atencion!');
							}
						}else{
							jAlert("La Orden  se guard&oacute; con &eacute;xito", 'Atencion!');
						}
						
						var remove = function() {$(this).remove();};
						$('#forma-comordencompra-overlay').fadeOut(remove);
						
						//ocultar boton actualizar porque ya se actualizo, ya no se puede guardar cambios, hay que cerrar y volver a abrir
						$submit_actualizar.hide();
						$get_datos_grid();
					}else{
						// Desaparece todas las interrogaciones si es que existen
						//$('#forma-comordencompra-window').find('.div_one').css({'height':'545px'});//sin errores
						$('#forma-comordencompra-window').find('.pocpedidos_div_one').css({'height':'568px'});//con errores
						$('#forma-comordencompra-window').find('div.interrogacion').css({'display':'none'});
						
						$grid_productos.find('#cant').css({'background' : '#ffffff'});
						$grid_productos.find('#cost').css({'background' : '#ffffff'});
						
						$('#forma-comordencompra-window').find('#div_warning_grid').css({'display':'none'});
						$('#forma-comordencompra-window').find('#div_warning_grid').find('#grid_warning').children().remove();
						
						var valor = data['success'].split('___');
						//muestra las interrogaciones
						for (var element in valor){
							tmp = data['success'].split('___')[element];
							longitud = tmp.split(':');

							if( longitud.length > 1 ){
								$('#forma-comordencompra-window').find('img[rel=warning_' + tmp.split(':')[0] + ']')
								.parent()
								.css({'display':'block'})
								.easyTooltip({tooltipId: "easyTooltip2",content: tmp.split(':')[1]});
								
								//alert(tmp.split(':')[0]);
								
								if(parseInt($("tr", $grid_productos).size())>0){
									for (var i=1;i<=parseInt($("tr", $grid_productos).size());i++){
										if((tmp.split(':')[0]=='cantidad'+i) || (tmp.split(':')[0]=='costo'+i)){
											$('#forma-comordencompra-window').find('.pocpedidos_div_one').css({'height':'568px'});
											$('#forma-comordencompra-window').find('#div_warning_grid').css({'display':'block'});
											
											if(tmp.split(':')[0].substring(0, 8) == 'cantidad'){
												$grid_productos.find('input[name=cantidad]').eq(parseInt(i) - 1) .css({'background' : '#d41000'});
											}else{
												if(tmp.split(':')[0].substring(0, 5) == 'costo'){
														$grid_productos.find('input[name=costo]').eq(parseInt(i) - 1) .css({'background' : '#d41000'});
												}
											}
											
											var tr_warning = '<tr>';
												tr_warning += '<td width="20"><div><IMG SRC="../../img/icono_advertencia.png" ALIGN="top" rel="warning_sku"></td>';
												tr_warning += '<td width="120">';
												tr_warning += '<INPUT TYPE="text" value="'+$grid_productos.find('input[name=sku' + i + ']').val()+'" class="borde_oculto" readOnly="true" style="width:116px; color:red">';
												tr_warning += '</td>';
												tr_warning += '<td width="200">';
												tr_warning += '<INPUT TYPE="text" value="'+$grid_productos.find('input[name=nombre' + i + ']').val()+'" class="borde_oculto" readOnly="true" style="width:196px; color:red">';
												tr_warning += '</td>';
												tr_warning += '<td width="235">';
												tr_warning += '<INPUT TYPE="text" value="'+ tmp.split(':')[1] +'" class="borde_oculto" readOnly="true" style="width:230px; color:red">';
												tr_warning += '</td>';
											tr_warning += '</tr>';
											$grid_warning.append(tr_warning);
										}
									}
								}
							}
						}
						
						$grid_warning.find('tr:odd').find('td').css({'background-color' : '#FFFFFF'});
						$grid_warning.find('tr:even').find('td').css({'background-color' : '#e7e8ea'});
					}
				}
				
				var options = {dataType :  'json', success : respuestaProcesada};
				$forma_selected.ajaxForm(options);
				
				//aqui se cargan los campos al editar
				$.post(input_json,$arreglo,function(entry){
                                        $id_impuesto.val(entry['iva']['0']['id_impuesto']);
                                        $valor_impuesto.val(entry['iva']['0']['valor_impuesto']);
					//$tasa_ret_immex.val(entry['datosOrdenCompra']['0']['tasa_retencion_immex']);
					$id_orden_compra.val(entry['datosOrdenCompra']['0']['id']);
					$folio.val(entry['datosOrdenCompra']['0']['folio']);
					$id_proveedor.val(entry['datosOrdenCompra']['0']['proveedor_id']);
					$rfc_proveedor.val(entry['datosOrdenCompra']['0']['rfc']);
					$razon_proveedor.val(entry['datosOrdenCompra']['0']['razon_social']);
					$dir_proveedor.val(entry['datosOrdenCompra']['0']['direccion']);
					
					$observaciones.text(entry['datosOrdenCompra']['0']['observaciones']);
                                        
                                        $grupo.val(entry['datosOrdenCompra']['0']['grupo']);
                                        consigandoA.val(entry['datosOrdenCompra']['0']['consignado_a']);
                                        
                                       
                                        $orden_compra.val(entry['datosOrdenCompra']['0']['orden_compra']);
                                       
					$tipo_cambio.val(entry['datosOrdenCompra']['0']['tipo_cambio']);
					
                                        
					
					
					//carga select denominacion con todas las monedas
					$select_moneda.children().remove();
					var moneda_hmtl = '';
					$.each(entry['Monedas'],function(entryIndex,moneda){
						if(moneda['id'] == entry['datosOrdenCompra']['0']['moneda_id']){
							moneda_hmtl += '<option value="' + moneda['id'] + '"  selected="yes">' + moneda['descripcion'] + '</option>';
							//$select_moneda_original.val(moneda['id']);
						}else{
							if(parseInt(entry['datosOrdenCompra']['0']['status'])==0){
								moneda_hmtl += '<option value="' + moneda['id'] + '"  >' + moneda['descripcion'] + '</option>';
							}
						}
					});
					$select_moneda.append(moneda_hmtl);
					//$select_moneda.find('option').clone().appendTo($select_moneda_original);
                                        
                                        //carga select condiciones con los terminos
					$select_condiciones.children().remove();
					var terminos_html = '';
					$.each(entry['Condiciones'],function(entryIndex,Condiciones){
						if(Condiciones['id'] == entry['datosOrdenCompra']['0']['cxp_prov_credias_id']){
							terminos_html += '<option value="' + Condiciones['id'] + '"  selected="yes">' + Condiciones['descripcion'] + '</option>';
							//$select_moneda_original.val(moneda['id']);
						}else{
							if(parseInt(entry['datosOrdenCompra']['0']['status'])==0){
								terminos_html += '<option value="' + Condiciones['id'] + '"  >' + Condiciones['descripcion'] + '</option>';
							}
						}
					});
					$select_condiciones.append(terminos_html);
                                        
                                        
                                        $select_via_embarque.children().remove();
					var via_embarque_html = '';
					$.each(entry['via_embarque'],function(entryIndex,via_embarque){
						if(via_embarque['id'] == entry['datosOrdenCompra']['0']['tipo_embarque_id']){
							via_embarque_html += '<option value="' + via_embarque['id'] + '"  selected="yes">' + via_embarque['tipo_embarque'] + '</option>';
							//$select_moneda_original.val(moneda['id']);
						}else{
							if(parseInt(entry['datosOrdenCompra']['0']['status'])==0){
								via_embarque_html += '<option value="' + via_embarque['id'] + '"  >' + via_embarque['tipo_embarque'] + '</option>';
							}
						}
					});
					$select_via_embarque.append(via_embarque_html);
                                        
					if(entry['datosGrid'] != null){
						$.each(entry['datosGrid'],function(entryIndex,prod){
							
							//obtiene numero de trs
							var tr = $("tr", $grid_productos).size();
							tr++;
							
							var trr = '';
							trr = '<tr>';
							trr += '<td class="grid" style="font-size: 11px;  border:1px solid #C1DAD7;" width="60">';
									trr += '<a href="elimina_producto" id="delete'+ tr +'">Eliminar</a>';
									trr += '<input type="hidden" name="eliminado" id="elim" value="1">';//el 1 significa que el registro no ha sido eliminado
									trr += '<input type="hidden" name="iddetalle" id="idd" value="'+ prod['id_detalle'] +'">'; //este es el id del registro que ocupa el producto en la tabla pocpedidos_detalles
									//trr += '<span id="elimina">1</span>';
							trr += '</td>';
							trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="114">';
									trr += '<input type="hidden" name="idproducto" id="idprod" value="'+ prod['inv_prod_id'] +'">';
									trr += '<INPUT TYPE="text" name="sku'+ tr +'" value="'+ prod['codigo'] +'" id="skuprod" class="borde_oculto" readOnly="true" style="width:110px;">';
							trr += '</td>';
							trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="202">';
								trr += '<INPUT TYPE="text" 	name="nombre'+ tr +'" 	value="'+ prod['titulo'] +'" 	id="nom" class="borde_oculto" readOnly="true" style="width:198px;">';
							trr += '</td>';
							trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="90">';
								trr += '<INPUT TYPE="text" 	name="unidad'+ tr +'" 	value="'+ prod['unidad'] +'" 	id="uni" class="borde_oculto" readOnly="true" style="width:86px;">';
							trr += '</td>';
							trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="100">';
									trr += '<INPUT type="hidden" 	name="id_presentacion"  value="'+  prod['id_presentacion'] +'" 	id="idpres">';
									trr += '<INPUT TYPE="text" 		name="presentacion'+ tr +'" 	value="'+  prod['presentacion'] +'" 	id="pres" class="borde_oculto" readOnly="true" style="width:96px;">';
							trr += '</td>';
							trr += '<td class="grid1" style="font-size: 11px;  border:1px solid #C1DAD7;" width="80">';
								trr += '<INPUT TYPE="text" 	name="cantidad" value="'+  prod['cantidad'] +'" 		id="cant" style="width:76px;">';
							trr += '</td>';
							trr += '<td class="grid2" style="font-size: 11px;  border:1px solid #C1DAD7;" width="90">';
								trr += '<INPUT TYPE="text" 	name="costo" 	value="'+  prod['precio_unitario'] +'" 	id="cost" style="width:86px; text-align:right;">';
								trr += '<INPUT type="hidden" value="'+  prod['precio_unitario'] +'" id="costor">';
							trr += '</td>';
							trr += '<td class="grid2" style="font-size: 11px;  border:1px solid #C1DAD7;" width="90">';
								trr += '<INPUT TYPE="text" 	name="importe'+ tr +'" 	value="'+  prod['importe'] +'" 	id="import" readOnly="true" style="width:86px; text-align:right;">';
								
								trr += '<INPUT type="hidden"    name="id_imp_prod"  value="'+  prod['gral_imp_id'] +'" 		id="idimppord">';
								trr += '<INPUT type="hidden"    name="valor_imp" 	value="'+  prod['valor_imp'] +'" 	id="ivalorimp">';
								
								trr += '<input type="hidden" name="totimpuesto'+ tr +'" id="totimp" value="'+parseFloat(prod['importe']) * parseFloat( prod['valor_imp'] )+'">';
							trr += '</td>';
							trr += '</tr>';
							$grid_productos.append(trr);
                            
							//al iniciar el campo tiene un  caracter en blanco, al obtener el foco se elimina el  espacio por comillas
							$grid_productos.find('#cant').focus(function(e){
								if($(this).val() == ' '){
									$(this).val('');
								}
							});

							//recalcula importe al perder enfoque el campo cantidad
							$grid_productos.find('#cant').blur(function(){
								if ($(this).val() == ''){
									$(this).val(' ');
								}
								if( ($(this).val() != ' ') && ($(this).parent().parent().find('#cost').val() != ' ') )
								{   //calcula el importe
									$(this).parent().parent().find('#import').val(parseFloat($(this).val()) * parseFloat($(this).parent().parent().find('#cost').val()));
									//redondea el importe en dos decimales
									//$(this).parent().parent().find('#import').val( Math.round(parseFloat($(this).parent().parent().find('#import').val())*100)/100 );
									$(this).parent().parent().find('#import').val( parseFloat($(this).parent().parent().find('#import').val()).toFixed(2) );

									//calcula el impuesto para este producto multiplicando el importe por el valor del iva
									$(this).parent().parent().find('#totimp').val(parseFloat($(this).parent().parent().find('#import').val()) * parseFloat(  $(this).parent().parent().find('#ivalorimp').val()  ));

								}else{
									$(this).parent().parent().find('#import').val('');
									$(this).parent().parent().find('#totimp').val('');
								}
                                                                alert("Llamando a la funcion que me calcula los totales cuando se modifica la cantidad");
								$calcula_totales();//llamada a la funcion que calcula totales
							});
							
							//al iniciar el campo tiene un  caracter en blanco, al obtener el foco se elimina el  espacio por comillas
							$grid_productos.find('#cost').focus(function(e){
								if($(this).val() == ' '){
									$(this).val('');
								}
							});
							
							//recalcula importe al perder enfoque el campo costo
							$grid_productos.find('#cost').blur(function(){
								if ($(this).val() == ''){
									$(this).val(' ');
								}
								if( ($(this).val() != ' ') && ($(this).parent().parent().find('#cant').val() != ' ') )
								{	//calcula el importe
									$(this).parent().parent().find('#import').val(parseFloat($(this).val()) * parseFloat($(this).parent().parent().find('#cant').val()));
									//redondea el importe en dos decimales
									//$(this).parent().parent().find('#import').val(Math.round(parseFloat($(this).parent().parent().find('#import').val())*100)/100);
									$(this).parent().parent().find('#import').val( parseFloat($(this).parent().parent().find('#import').val()).toFixed(2));
									
									//calcula el impuesto para este producto multiplicando el importe por el valor del iva
									$(this).parent().parent().find('#totimp').val(parseFloat($(this).parent().parent().find('#import').val()) * parseFloat( $(this).parent().parent().find('#ivalorimp').val()  ));
								}else{
									$(this).parent().parent().find('#import').val('');
									$(this).parent().parent().find('#totimp').val('');
								}
                                                                alert("Llamando a la funcion que me calcula los totales cuando se modifica el costo");
								$calcula_totales();//llamada a la funcion que calcula totales
							});
							
							//validar campo costo, solo acepte numeros y punto
							$permitir_solo_numeros( $grid_productos.find('#cost') );
							$permitir_solo_numeros( $grid_productos.find('#cant') );
							
							//elimina un producto del grid
							$grid_productos.find('#delete'+ tr).bind('click',function(event){
								event.preventDefault();
                                                                if(parseInt($(this).parent().find('#elim').val()) != 0){
									var iddetalle = $(this).parent().find('#idd').val();
									
									//asigna espacios en blanco a todos los input de la fila eliminada
									$(this).parent().parent().find('input').val(' ');
									
									//asigna un 0 al input eliminado como bandera para saber que esta eliminado
									$(this).parent().find('#elim').val(0);//cambiar valor del campo a 0 para indicar que se ha elimnado
									$(this).parent().find('#idd').val(iddetalle);
									//oculta la fila eliminada
									$(this).parent().parent().hide();
									$calcula_totales();//llamada a la funcion que calcula totales
								}
							});
						});
					}
					
                                        
                                        if(entry['datosOrdenCompra']['0']['cancelado']=='t' || entry['datosOrdenCompra']['0']['status']==1 || entry['datosOrdenCompra']['0']['status']==2){
                                            
                                                $('#forma-comordencompra-window').find('a[href*=busca_sku]').hide();
                                                $('#forma-comordencompra-window').find('a[href*=agregar_producto]').hide();
                                                $('#forma-comordencompra-window').find('#submit').hide();
                                                $('#forma-comordencompra-window').find('#cancelar_orden_compra').hide();
                                                $folio.attr('disabled','-1'); //deshabilitar
                                                $rfc_proveedor.attr('disabled','-1'); //deshabilitar
                                                $sku_producto.attr('disabled','-1'); //deshabilitar
						$grupo.attr('disabled','-1'); //deshabilitar
						$nombre_producto.attr('disabled','-1'); //deshabilitar
                                                $dir_proveedor.attr('disabled','-1'); //deshabilitar
						$razon_proveedor.attr('disabled','-1'); //deshabilitar
						$observaciones.attr('disabled','-1'); //deshabilitar
						$tipo_cambio.attr('disabled','-1'); //deshabilitar
						$orden_compra.attr('disabled','-1'); //deshabilitar
						//$descargarpdf.attr('disabled','-1'); //deshabilitar
						
						consigandoA.attr('disabled','-1'); //deshabilitar
						$select_moneda.attr('disabled','-1'); //deshabilitar
						$select_via_embarque.attr('disabled','-1'); //deshabilitar
						$select_condiciones.attr('disabled','-1');
						
						//$grid_productos.find('a[href*=elimina_producto]').hide();
                                                
						$grid_productos.find('#cant').attr('disabled','-1'); //deshabilitar campos cantidad del grid
						$grid_productos.find('#cost').attr('disabled','-1'); //deshabilitar campos costo del grid
						$grid_productos.find('#import').attr('disabled','-1'); //deshabilitar campos importe del grid
						
						$subtotal.attr('disabled','-1'); //deshabilitar
						$impuesto.attr('disabled','-1'); //deshabilitar
						$total.attr('disabled','-1'); //deshabilitar
			
                                        }else{ 
                                                $('#forma-comordencompra-window').find('a[href*=busca_sku]').show();
                                                $('#forma-comordencompra-window').find('a[href*=agregar_producto]').show();
                                                $('#forma-comordencompra-window').find('#submit').show();
                                        }
					$calcula_totales();//llamada a la funcion que calcula totales 
				});//termina llamada json
                
                
                
				
				
				$tipo_cambio.keypress(function(e){
					// Permitir  numeros, borrar, suprimir, TAB, puntos, comas
					if (e.which == 8 || e.which == 46 || e.which==13 || e.which == 0 || (e.which >= 48 && e.which <= 57 )) {
						return true;
					}else {
						return false;
					}		
				});

				
				//buscador de clientes
				/*$busca_proveedor.click(function(event){
					event.preventDefault();
					$busca_proveedores();
				});*/
				
				
				//buscador de productos
				$busca_sku.click(function(event){
					event.preventDefault();
					$busca_productos($sku_producto.val());
				});
				
				//agregar producto al grid
				$agregar_producto.click(function(event){
					event.preventDefault();
					$buscador_presentaciones_producto($id_proveedor, $rfc_proveedor.val(), $sku_producto.val(),$nombre_producto,$grid_productos,$select_moneda,$tipo_cambio);
				});
				
				
				//ejecutar clic del href Agregar producto al pulsar enter en el campo sku del producto
				$sku_producto.keypress(function(e){
					if(e.which == 13){
						$agregar_producto.trigger('click');
						return false;
					}
				});
				
				
				
				
				$cancelar_orden_compra.click(function(e){
					$accion_proceso.attr({'value' : "cancelar"});
					jConfirm('Desea Cancelar la Orden de Compra?', 'Dialogo de Confirmacion', function(r) {
						// If they confirmed, manually trigger a form submission
						if (r) {
                                                       $submit_actualizar.parents("FORM").submit();
						}else{
							$accion_proceso.attr({'value' : "edit"});
						}
					});
					// Always return     false here since we don't know what jConfirm is going to do
					return false;
				});
				
				

				//click generar reporte de pedidos 
				$descargarpdf.click(function(event){
						event.preventDefault();
						
						var id_orden_compra = $id_orden_compra.val();
						if($id_orden_compra.val() != 0 ){
								var iu = $('#lienzo_recalculable').find('input[name=iu]').val();
								var input_json = document.location.protocol + '//' + document.location.host + '/' + controller + '/get_genera_pdf_orden_compra/'+id_orden_compra+'/'+iu+'/out.json';
								window.location.href=input_json;

						}else{
								jAlert("Nose esta enviando el identificador  de la Orden de Compra","Atencion!!!")
						}
				 });
			

                
                
                
                
                
                
                
                
                
				$submit_actualizar.bind('click',function(){
					var trCount = $("tr", $grid_productos).size();
					$total_tr.val(trCount);
					if(parseInt(trCount) > 0){
						$grid_productos.find('tr').each(function (index){
							$(this).find('#cost').val(quitar_comas( $(this).find('#cost').val() ));
						});
                                                
                                                return true;
					}else{
						jAlert("No hay datos para actualizar", 'Atencion!');
						return false;
					}
				});
                
				//Ligamos el boton cancelar al evento click para eliminar la forma
				$cancelar_plugin.bind('click',function(){
					var remove = function() {$(this).remove();};
					$('#forma-comordencompra-overlay').fadeOut(remove);
				});
				
				$cerrar_plugin.bind('click',function(){
					var remove = function() {$(this).remove();};
					$('#forma-comordencompra-overlay').fadeOut(remove);
				});
				
			}
		}
	}
	
	
	
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
	
    $get_datos_grid = function(){
        var input_json = document.location.protocol + '//' + document.location.host + '/'+controller+'/getAllOrdenCompra.json';
        
        var iu = $('#lienzo_recalculable').find('input[name=iu]').val();
        
        $arreglo = {'orderby':'id','desc':'DESC','items_por_pag':15,'pag_start':1,'display_pag':20,'input_json':'/'+controller+'/getAllOrdenCompra.json', 'cadena_busqueda':$cadena_busqueda, 'iu':iu}
		
        $.post(input_json,$arreglo,function(data){
			
            //pinta_grid
            $.fn.tablaOrdenablePrefacturas(data,$('#lienzo_recalculable').find('.tablesorter'),carga_formaordencompra00_for_datagrid00);

            //resetea elastic, despues de pintar el grid y el slider
            Elastic.reset(document.getElementById('lienzo_recalculable'));
        },"json");
    }
    
    $get_datos_grid();
    
    
});
