/*-----------------------------*/
/*        HTML Templates       */
/*-----------------------------*/
$.template("dialog-form", "<form class='form-horizontal'><h2 style='text-align:center;'>${modelname}</h2><br/><div class='forminputs' style='margin:0 auto;width:70%;'></div></form>");
$.template("dialog-controlgroup", "<div class='control-group'><label for='${inputname}' class='control-label'>${inputname}</label><div class='controls'></div>");
$.template("input","<input type='${type}' id='input_${inputname}' value='${inputvalue}' class='${classs}'>");

/*-----------------------------*/
/*           Onload            */
/*-----------------------------*/
$(function(){
	//Load table for each h2.pagetitle
	$('h2.pagetitle').each(function(){ loadTable($(this).attr('name'),$(this).text()); });

	//Click event for buttons.
	$('.leftaddons label a').click(function(){
		type = $(this).attr('name');
		name = $(this).parent().parent().parent().parent().children('h2.pagetitle').attr('name');
		plural = $(this).parent().parent().attr('name');
		//Get columns of this model.
		var columns = []
		$(".datatable[name='"+plural+"'] th").each(function(){ columns.push($(this).text()); });
		//Switch type
		switch(type){
			case 'add':
				//Add row
				cayo_add(name,plural);
			break;
			case 'edit':
				multi = $("input[name='multiselectrows']").is(":checked");
				if(multi){
					noty({'text':"You can't edit more than one row at a time. (for now)",'type':'information'});
				}else{
					//Get values of active row.
					rowvalues = {};
					$(".datatable[name='"+plural+"'] .activerow").each(function(i){ rowvalues[columns[i]] = $(this).text(); });
					//Edit row
					cayo_edit(name,plural,rowvalues);
				}
			break;
			case 'delete':
				multi = $("input[name='multiselectrows']").is(":checked");
				//Get values of active row.
				rowvalues = {};
				$(".datatable[name='"+plural+"'] .activerow").parent().each(function(i){ 
					if(multi){ rowvalues[i] = {} }
					$(this).children().each(function(j){
						if(multi){ 
							rowvalues[i][columns[j]] = $(this).text(); 
						}else{
							rowvalues[columns[j]] = $(this).text();	
						}
					});
				});
				//Delete row
				cayo_del(name,plural,rowvalues);
			break;
		}
	});
});
/*-----------------------------*/
/*          Load Table         */
/*    Creates table from data  */
/* @name=model name(singular)  */
/* @plural=model name(plural)  */
/*-----------------------------*/
function loadTable(name,plural){
	//Make ajax request to server, get table values.
	$.ajax({
		url: "../"+plural+'/index',
		dataType: "json",
		success: function(data){
			//Got the data, let's make a table.
			$datatable = $(".datatable[name='"+plural+"']");
			$thead = $("<thead></thead>");
			$tbody = $("<tbody></tbody>");
			//Foreach row;
			for(var i=0; i<data.length; i++){
				$tr = $('<tr></tr>');//Create row.
				//Foreach value;
				for(var key in data[i][name]){
					if(i==0){//First row becomes Table Header.
						$td = $("<th></th>").text(key);
					}else{//Other rows become normal values.
						$td = $("<td></td>").text(data[i][name][key]);
					}
					$tr.append($td);
				}
				//If first row, append to table head, else to table body.
				if(i==0){ $thead.append($tr); }else{ $tbody.append($tr); }
			}
			//Append table head and body to datatable;
			$datatable.append($thead,$tbody);
			
			//Load plugin which adds sort and filter functionality.
			loadDataTable(name,plural);

			$('tr:not(:first)',$datatable).live('click', function(){
				multi = $("input[name='multiselectrows']").is(":checked");
				if(multi == true){
					if($(this).children().hasClass('activerow')){
						$(this).children().removeClass('activerow');
					}else{
						$(this).children().addClass('activerow');
					}
				}else{
					$('.activerow').removeClass('activerow');
					$(this).children().addClass('activerow');
				}
			});
		}
	});
}
/*-----------------------------*/
/* Load DataTable jQuery Plugin*/
/*     Sort & Filter table     */
/* @name=model name(singular)  */
/* @plural=model name(plural)  */
/*-----------------------------*/
function loadDataTable(name,plural){
	$(".datatable[name='"+plural+"']").dataTable( {
		"bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bSort": true,
        "bInfo": true,
        "bAutoWidth": true
	});
	//Add the addons divs to the table interface.
	$(".rightaddons[name='"+plural+"']").prependTo($(".datatable[name='"+plural+"']").parent());
	$(".leftaddons[name='"+plural+"']").prependTo($(".datatable[name='"+plural+"']").parent());
}
/*-----------------------------*/
/*          Delete row         */
/* @name=model name(singular)  */
/* @plural=model name(plural)  */
/* @rowvalues=values from row  */
/*-----------------------------*/
function cayo_del(name,plural,rowvalues){
	//Show the modal
	bootbox.dialog("Are you sure you want to delete this "+name+'?', 
		[{"label" : "Cancel"},
		{
			"label" : "Delete",
			"class" : "btn-danger",
			"callback": function() {
				//Delete multi
				if(rowvalues[1] != undefined){
					for(var i in rowvalues){
						//post row information to model; delete model.
						$.post('../'+plural+'/delete/',rowvalues[i], function(message) {
							if(message.code == 1){
								removeRow(name,plural,rowvalues);//Remove row from table.
								noty({"text":"Row succesfully deleted!",'type':'success'});
							}else{
								noty({"text":"ERROR: "+message.message,'type':'danger'});
							}
						});
					}
				}else{//Delete single
					//post row information to model; delete model.
					$.post('../'+plural+'/delete/',rowvalues, function(message) {
						if(message.code == 1){
							removeRow(name,plural,rowvalues);//Remove row from table.
							noty({"text":"Row succesfully deleted!",'type':'success'});
						}else{
							noty({"text":"ERROR: "+message.message,'type':'danger'});
						}
					});
				}
			}
		}]
	); 
}
	/*-----------------------------*/
	/*          Remove row         */
	/* @name=model name(singular)  */
	/* @plural=model name(plural)  */
	/* @values=values from row     */
	/*-----------------------------*/
	function removeRow(name,plural,values){
		//Remove row from datatable
		$(".datatable[name='"+plural+"'] .activerow").remove();
	}
/*-----------------------------*/
/*          Edit row           */
/* @name=model name(singular)  */
/* @plural=model name(plural)  */
/* @rowvalues=values from row  */
/*-----------------------------*/
function cayo_edit(name, plural, rowvalues){
	//Create the dialog
	$dialog = $.tmpl('dialog-form', {'modelname': name});

	//Create input for each column.
	var fields = [];//array of the form elements for future reference.
	for(var columnname in rowvalues){
		$controlgroup = $.tmpl('dialog-controlgroup', {'inputname': columnname });
		$input = $.tmpl('input', { 'type': 'text', 'inputname': columnname, 'inputvalue':rowvalues[columnname], 'classs':'input-large modalinput' });
		fields.push($input);
		$input.appendTo($('.controls',$controlgroup));
		$('.forminputs',$dialog).append($controlgroup);
	}

	//Show the modal
	bootbox.dialog($dialog,
		[{"label" : "Cancel"},
		{
			"label" : "Save",
			"class" : "btn-success",
			"callback": function() {		
				//Get columns of this model.
				var columns = []
				$(".datatable[name='"+plural+"'] th").each(function(){ columns.push($(this).text()); });		
				//get current formvalues.
				var newvalues = { };
				for(var i=0;i<fields.length;i++){
					newvalues[columns[i]] = fields[i].val();
				}
				//post current formvalues to model; update row.
				$.post("../"+plural+'/edit/', {old:rowvalues, new:newvalues}, function(message) {
					if(message.code == 1){
						updateActiveRow(name,plural,newvalues);//Update tablerow
						noty({"text":"Row succesfully updated!",'type':'success'});
					}else{
						noty({"text":"ERROR: "+message.message,'type':'danger'});
					}
				});
			}
		}]
	); 
}
	/*-----------------------------*/
	/*          Update row         */
	/* @name=model name(singular)  */
	/* @plural=model name(plural)  */
	/* @values=values from row     */
	/*-----------------------------*/
	function updateActiveRow(name,plural,values){
		//Update td's to new values.
		$tds = $(".datatable[name='"+plural+"'] .activerow");//Active row td's
		//Create array without key's.
		newvalues = [];
		for(var key in values){ newvalues.push(values[key]); }
		$tds.each(function(i){
			$(this).text(newvalues[i]); 
		});
	}
/*-----------------------------*/
/*          Add row            */
/* @name=model name(singular)  */
/* @plural=model name(plural)  */
/*-----------------------------*/
function cayo_add(name, plural){
	//Get columns of this model.
	var columns = []
	$(".datatable[name='"+plural+"'] th").each(function(){ columns.push($(this).text()); });

	//Create the dialog.
	$dialog = $.tmpl('dialog-form', {'modelname': name});

	//Create input for each column.
	var inputs = [];//array of the form elements for future reference.
	for(var i=0;i<columns.length;i++){
		$controlgroup = $.tmpl('dialog-controlgroup', {'inputname': columns[i] });
			$input = $.tmpl('input', { 'type': 'text', 'inputname': columns[i], 'classs':'input-large modalinput' });
			inputs.push($input);
			$input.appendTo($('.controls',$controlgroup));
		$('.forminputs',$dialog).append($controlgroup);
	}

	//Show the modal
	bootbox.dialog($dialog,
		[{"label" : "Cancel"},
		{
			"label" : "Save",
			"class" : "btn-success",
			"callback": function() {
				//get current formvalues.
				var values = { };
				for(var i=0;i<inputs.length;i++){
					values[columns[i]] = inputs[i].val();
				}
				//post current formvalues to model; create new row.
				$.post("../"+plural+'/add/', values, function(message) {
					if(message.code == 1){
						addRow(name,plural,values);//Add new row to table
						noty({"text":"Row succesfully added!",'type':'success'});
					}else{
						noty({"text":"ERROR: "+message.message,'type':'danger'});
					}
				});
			}
		}]
	); 
}
	/*-----------------------------*/
	/*       Add row to table      */
	/* @name=model name(singular)  */
	/* @plural=model name(plural)  */
	/* @values=values from row     */
	/*-----------------------------*/
	function addRow(name,plural,values){
		//Push new values to array
		newvalues = [];
		for(key in values){ newvalues.push(values[key]); }
		//Add values to new table
		$(".datatable[name='"+plural+"']").dataTable().fnAddData(newvalues,true);
	}