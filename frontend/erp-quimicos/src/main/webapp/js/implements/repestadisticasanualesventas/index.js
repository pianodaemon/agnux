$(function() {
     
        var config =  {
                empresa: $('#lienzo_recalculable').find('input[name=emp]').val(),
                sucursal: $('#lienzo_recalculable').find('input[name=suc]').val(),
                tituloApp: 'Reporte Estad&iacute;stico de Ventas Anuales por Cliente' ,                 
                contextpath : $('#lienzo_recalculable').find('input[name=contextpath]').val(),

                userName : $('#lienzo_recalculable').find('input[name=user]').val(),
                ui : $('#lienzo_recalculable').find('input[name=iu]').val(),

                getUrlForGetAndPost : function(){
                        var url = document.location.protocol + '//' + document.location.host + this.getController();
                        return url;
                },

                getEmp: function(){
                        return this.empresa;
                },

                getSuc: function(){
                        return this.sucursal;
                },

                getUserName: function(){
                        return this.userName;
                },

                getUi: function(){
                        return this.ui;
                },
                getTituloApp: function(){
                        return this.tituloApp;
                },

                getController: function(){
                        return this.contextpath + "/controllers/repestadisticasanualesventas";
                        //  return this.controller;
                }
        };
	
		var array_meses = {
					0:"- Seleccionar -",  
					1:"Enero",  
					2:"Febrero", 
					3:"Marzo", 
					4:"Abirl", 
					5:"Mayo", 
					6:"Junio", 
					7:"Julio", 
					8:"Agosto", 
					9:"Septiembre", 
					10:"Octubre", 
					11:"Noviembre", 
					12:"Diciembre"
				};
				
	
        $('#header').find('#header1').find('span.emp').text(config.getEmp());
        $('#header').find('#header1').find('span.suc').text(config.getSuc());
        $('#header').find('#header1').find('span.username').text(config.getUserName());
        //aqui va el titulo del catalogo
        $('#barra_titulo').find('#td_titulo').append(config.getTituloApp());

        $('#barra_acciones').hide();
        //barra para el buscador 
        $('#barra_buscador').hide();
		
		var $select_ano = $('#lienzo_recalculable').find('table#busqueda tr td').find('select[name=select_ano]');
        var $mes_inicial = $('#lienzo_recalculable').find('select[name=mes_inicial]');
        var $mes_final = $('#lienzo_recalculable').find('select[name=mes_final]');
        var $genera_reporte_estadistico = $('#lienzo_recalculable').find('table#busqueda tr td').find('input[value$=Generar_PDF]');
        var $busqueda_reporte_estadistico= $('#lienzo_recalculable').find('table#busqueda tr td').find('input[value$=Buscar]');
        var $div_reporte_estadisticasventas= $('#lienzo_recalculable').find('#divreportefacturacion');

		
		
		//cargar select del Mes inicial
		$mes_inicial.children().remove();
		var select_html = '';
		for(var i in array_meses){
			if(parseInt(i) == 1 ){
				select_html += '<option value="' + i + '" selected="yes">' + array_meses[i] + '</option>';	
			}else{
				select_html += '<option value="' + i + '"  >' + array_meses[i] + '</option>';	
			}
		}
		$mes_inicial.append(select_html);
		





		var arreglo_parametros = { 
			iu:config.getUi()
		};

		var restful_json_service = config.getUrlForGetAndPost() + '/getDatos.json';
		$.post(restful_json_service,arreglo_parametros,function(entry){
			//carga select de años
			$select_ano.children().remove();
			var html_anio = '';
			$.each(entry['Anios'],function(entryIndex,anio){
				if(parseInt(anio['valor']) == parseInt(entry['Dato'][0]['anioActual']) ){
					html_anio += '<option value="' + anio['valor'] + '" selected="yes">' + anio['valor'] + '</option>';
				}else{
					html_anio += '<option value="' + anio['valor'] + '"  >' + anio['valor'] + '</option>';
				}
			});
			$select_ano.append(html_anio);
			
			//cargar select del Mes Final
			$mes_final.children().remove();
			var select_html = '';
			for(var i in array_meses){
				if(parseInt(i) == parseInt(entry['Dato'][0]['mesActual']) ){
					select_html += '<option value="' + i + '" selected="yes">' + array_meses[i] + '</option>';	
				}else{
					select_html += '<option value="' + i + '"  >' + array_meses[i] + '</option>';	
				}
			}
			$mes_final.append(select_html);
		});





/*
         var arreglo_parametros = { 
            iu:config.getUi()
         };
			
        var restful_json_service = config.getUrlForGetAndPost() + '/getMesActual.json';
        $.post(restful_json_service,arreglo_parametros,function(entry){
			var i=parseInt($mes_inicial.val());
			var select_html='';
			$mes_final.children().remove();
			while (i<=12){
				if(parseInt(entry['mesActual']) == parseInt(i) ){
					select_html += '<option value="' + i + '" selected="yes">' + array_meses[i] + '</option>';
				}else{
					select_html += '<option value="' + i + '" >' + array_meses[i] + '</option>';
				}
				i=i+1;
			}
			$mes_final.append(select_html);
        });

*/




		//carga select de Mes  final al Cambiar Mes Inicial
		$mes_inicial.change(function(){
			var valor_mes = $(this).val();
			
			//cargar select del Mes Final
			var i=parseInt(valor_mes);
			var select_html='';
			$mes_final.children().remove();
			while (i<=12){
				select_html += '<option value="' + i + '"  >' + array_meses[i] + '</option>';
				i=i+1;
			}
			$mes_final.append(select_html);
			
			$div_reporte_estadisticasventas.children().remove();
		});
        



        //click generar reporte Estadistico de Ventas por Cliente
        $genera_reporte_estadistico.click(function(event){
			event.preventDefault();
			if(parseInt($mes_inicial.val())!=0 && parseInt($mes_final.val())!=0 ){
				var busqueda = $mes_inicial.val()+"___"+$mes_final.val()+"___"+$select_ano.val();
				var input_json = config.getUrlForGetAndPost() + '/get_genera_reporte_estadistica/'+busqueda+'/'+config.getUi()+'/out.json';
				window.location.href=input_json;
			}else{
				jAlert("Es Necesario seleccionar Mes Inicial y Mes Final.",'Atencion!');
			}
        });
		
        
        //Accion del Boton Buscar
        $busqueda_reporte_estadistico.click(function(event){
            event.preventDefault();
            $div_reporte_estadisticasventas.children().remove();
                    var arreglo_parametros = {	
                        mes_in:$mes_inicial.val(),
                        mes_fin:$mes_final.val(),
                        anio:$select_ano.val(),
                        iu:config.getUi()
                    };

                    var restful_json_service = config.getUrlForGetAndPost() + '/getEstadisticas.json'
                    var cliente="";
                    if(parseInt($mes_inicial.val())!=0 && parseInt($mes_final.val())!=0 ){
                        $.post(restful_json_service,arreglo_parametros,function(entry){
                                var body_tabla = entry['Estadisticas'];
                                var footer_tabla = entry['Totales'];
                                var header_tabla = {
                                        cliente	:'Cliente',
                                        enero   :'Enero',
                                        febrero :'Febrero',
                                        marzo   :'Marzo',
                                        abril   :'Abril',
                                        mayo    :'Mayo',
                                        junio   :'Junio',
                                        julio   :'Julio',
                                        agosto  :'Agosto',
                                        septiem :'Septiembre',
                                        octubre :'Octubre',
                                        noviembr:'Noviembre',
                                        diciem  :'Diciembre',
                                        total   :'Total&nbsp;Anual'
                                };


                                var TPventa_neta=0.0;
                                var Sumatoriaventa_neta = 0.0;
                                var sumatotoriaporciento = 0.0;
                                var html_reporte = '<table id="ventas" width="1120">';
                                var porcentaje = 0.0;

                                var numero_control=0.0; 
                                var cliente=0.0; 
                                var moneda="$"; 
                                var venta_neta=0.0; 
                                var porciento=0.0;
                                var tmp= 0;
                                var html_footer="";
                                html_reporte +='<thead> <tr>';
                                for(var key in header_tabla){
                                        var attrValue = header_tabla[key];

                                        if(attrValue == "Cliente"){
                                                html_reporte +='<td width="120px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Enero"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }

                                        if(attrValue == "Febrero"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Marzo"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Abril"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Mayo"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Junio"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Julio"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Agosto"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Septiembre"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Octubre"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Noviembre"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Diciembre"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                        if(attrValue == "Total&nbsp;Anual"){
                                                html_reporte +='<td width="50px" align="left">'+attrValue+'</td>'; 
                                        }
                                }
                                html_reporte +='</tr> </thead>';

                                var totalmes=0.0;
                                var totalano=0.0;
                                var totalmes2=0.0;
                                var totalmes3=0.0;
                                var totalmes4=0.0;
                                var totalmes5=0.0;
                                var totalmes6=0.0;
                                var totalmes7=0.0;
                                var totalmes8=0.0;
                                var totalmes9=0.0;
                                var totalmes10=0.0;
                                var totalmes11=0.0;
                                var totalmes12=0.0;

                                for(var i=0; i<body_tabla.length; i++){

                                        totalano=parseFloat(totalano)+parseFloat(body_tabla[i]["suma_total"]);
                                        html_reporte +='<tr>';
                                        html_reporte +='<td width="120px" align="left">'+body_tabla[i]["razon_social"]+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["enero"]).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["febrero"]).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["marzo"]).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["abril"]).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["mayo"]).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["junio"]).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["julio"]).toFixed(2))+'</td>';
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["agosto"]).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["septiembre"]).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["octubre"]).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["noviembre"]).toFixed(2))+'</td>';
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["diciembre"]).toFixed(2))+'</td>';
                                        html_reporte +='<td width="50px" align="right">'+$(this).agregar_comas(parseFloat(body_tabla[i]["suma_total"]).toFixed(2))+'</td>'; 
                                        html_reporte +='</tr>';

                                totalmes=parseFloat(totalmes)+parseFloat(body_tabla[i]["enero"]);
                                totalmes2=parseFloat(totalmes2)+parseFloat(body_tabla[i]["febrero"]);
                                totalmes3=parseFloat(totalmes3)+parseFloat(body_tabla[i]["marzo"]);
                                totalmes4=parseFloat(totalmes4)+parseFloat(body_tabla[i]["abril"]);
                                totalmes5=parseFloat(totalmes5)+parseFloat(body_tabla[i]["mayo"]);
                                totalmes6=parseFloat(totalmes6)+parseFloat(body_tabla[i]["junio"]);
                                totalmes7=parseFloat(totalmes7)+parseFloat(body_tabla[i]["julio"]);
                                totalmes8=parseFloat(totalmes8)+parseFloat(body_tabla[i]["agosto"]);
                                totalmes9=parseFloat(totalmes9)+parseFloat(body_tabla[i]["septiembre"]);
                                totalmes10=parseFloat(totalmes10)+parseFloat(body_tabla[i]["octubre"]);
                                totalmes11=parseFloat(totalmes11)+parseFloat(body_tabla[i]["noviembre"]);
                                totalmes12=parseFloat(totalmes12)+parseFloat(body_tabla[i]["diciembre"]);

                                }

                                html_reporte +='<tfoot>';
                                /*sumando los meses**/
                                    html_reporte +='<tr>';
                                        html_reporte +='<td width="120px" align="right" id="sin_borde">Total Mensual</td>'
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes2).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes3).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes4).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes5).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes6).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes7).toFixed(2))+'</td>';
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes8).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes9).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes10).toFixed(2))+'</td>'; 
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes11).toFixed(2))+'</td>';
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">$'+$(this).agregar_comas(parseFloat(totalmes12).toFixed(2))+'</td>';
                                        html_reporte +='<td width="50px" align="right" id="sin_borde">'+$(this).agregar_comas(parseFloat(totalano).toFixed(2))+'</td>';

                                    html_reporte +='</tr>';
                                html_footer +='</tfoot>';


                                html_reporte += '</table>';


                                $div_reporte_estadisticasventas.append(html_reporte); 
                                var height2 = $('#cuerpo').css('height');
                                var alto = parseInt(height2)-300;
                                var pix_alto=alto+'px';
                                $('#ventas').tableScroll({height:parseInt(pix_alto)});
                        });
                    }else{
						jAlert("Es Necesario seleccionar Mes Inicial y Mes Final.",'Atencion!');
					}
                });	
});       
