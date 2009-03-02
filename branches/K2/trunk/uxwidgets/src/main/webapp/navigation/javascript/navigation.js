var sakai = sakai || {};

sakai._navigation = {};
sakai.navigation = function(tuid, placement, showSettings){

	var rootEl = $("#tuid");
	
	if (showSettings){
		$("#navigation_output").hide();
		$("#navigation_settings").show();
	} else {
		$("#navigation_settings").hide();
		$("#navigation_output").show();
	}
	
	var startsWith = function(nid,str){
		return (nid.match("^"+str)==str)
	}
	
	sakai._navigation.renderNavigation = function(selectedpage,pages){
		
		var cselectedpage = selectedpage;
		var finaljson = {};
		finaljson.pages = [];
		
		// Get current level
		var level = 0;
		while (cselectedpage.indexOf("/") != -1){
			level++;
			cselectedpage = cselectedpage.substring(cselectedpage.indexOf("/") + 1);
		}
		
		if (level == 0){
			finaljson.top = true;
		}
		
		// Get all pages on current level
		
		for (var i = 0; i < pages.items.length; i++){
			var id = pages.items[i].id;
			var clevel = 0;
			while (id.indexOf("/") != -1){
				clevel++;
				id = id.substring(id.indexOf("/") + 1);
			}
			if (clevel == level){
				var index = finaljson.pages.length;
				if (pages.items[i].id == selectedpage){
					finaljson.pages[index] = {};
					finaljson.pages[index].id = pages.items[i].id;
					finaljson.pages[index].title = pages.items[i].title;
					finaljson.pages[index].selected = true;
					
					finaljson.pages[index].pages = [];
					finaljson.pages[index].multiple = false;
					
					// Get all child pages of the selected page
					
					for (var ii = 0; ii < pages.items.length; ii++) {
						var nid = pages.items[ii].id;
						if (startsWith(nid,selectedpage + "/")){
							var nlevel = 0;
							while (nid.indexOf("/") != -1){
								nlevel++;
								nid = nid.substring(nid.indexOf("/") + 1);
							}
							if (nlevel == level + 1){
								var nindex = finaljson.pages[index].pages.length;
								finaljson.pages[index].pages[nindex] = {};
								finaljson.pages[index].pages[nindex].id = pages.items[ii].id;
								finaljson.pages[index].pages[nindex].title = pages.items[ii].title;
								finaljson.pages[index].multiple = true;
							}
						}
					}
					
				} else {
					finaljson.pages[index] = {};
					finaljson.pages[index].id = pages.items[i].id;
					finaljson.pages[index].title = pages.items[i].title;
					finaljson.pages[index].selected = false;
				}
			}
			
		}
		
		// Print
		
		$("#navigation_output").html(sdata.html.Template.render('navigation_output_template',finaljson));
		
	} 
	
	sakai._site.navigationLoaded();

};

sdata.widgets.WidgetLoader.informOnLoad("navigation");