$(function(){
	activeSidebarItem();
});
function activeSidebarItem(){//Set active sidebar
	var pagetitle = $("#pagetitle").attr("name");
	$(".model").removeClass("active");
	$(".model[name='"+pagetitle+"']").addClass("active");
}