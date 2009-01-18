var sakai = sakai || {};

sakai._findpeople = {
	
	list : false,
	totalpages : 0,
	isbusy : false,
	
	resetScreen : function(){
		$("#list_rendered").html("");
		var input = $("#search_people");
		input.css("color","#AAAAAA"); 
		input.css("font-style", "italic");
		input.val($("#search_people_standard").val());
		$("#initText").show();
		$("#paging").hide();
	},
	
	doSearch : function(tosearchfor, page){
		History.addBEvent(tosearchfor + "|" + page);
	},
	
	doSearchH : function(tosearchfor, page){
		
		$("#search_people").val(sdata.util.URL.decode(tosearchfor));
		
		$("#list_rendered").html("<img scr='/devwidgets/Resources/images/ajax-loader.gif'/><br/>");
		sakai._findpeople.page = page;
		
		sdata.Ajax.request({
			httpMethod: "GET",
			url: "/sdata/profile?search=" + tosearchfor + "&page=" + page + "&items=5&sid=" + Math.random(),
			onSuccess: function(data){
				sakai._findpeople.list = eval('(' + data + ')');
				sakai._findpeople.printList();
			},
			onFail: function(status){
				$("#list_rendered").html("<b>An error has occurred.</b> Please try again later");
			}
		});
	},
	
	printList : function(){
		$("#initText").hide();
		$("#paging").show();
		
		var select = document.getElementById("pages");
		
		if (sakai._findpeople.page == 1 || select.options.length == 0) {
			sakai._findpeople.doPaging(sakai._findpeople.page);
		}
		if (sakai._findpeople.totalpages == 0){
			$("#un_prev").show();
			$("#prev").hide();
			$("#un_next").show();
			$("#next").hide();
		} else if (sakai._findpeople.totalpages == 1){
			$("#un_prev").show();
			$("#prev").hide();
			$("#un_next").show();
			$("#next").hide();
		} else if (sakai._findpeople.page == 1){
			$("#un_prev").show();
			$("#prev").hide();
			$("#un_next").hide();
			$("#next").show();
		} else if (sakai._findpeople.page == sakai._findpeople.totalpages){
			$("#un_prev").hide();
			$("#prev").show();
			$("#un_next").show();
			$("#next").hide();
		} else {
			$("#un_prev").hide();
			$("#prev").show();
			$("#un_next").hide();
			$("#next").show();
		}
		sakai._findpeople.doList();
	},
	
	doPaging : function(page){
		
		sakai._findpeople.isbusy = true;
		
		$("#numberofresults").text(sakai._findpeople.list.total);
		
		sakai._findpeople.totalpages = Math.ceil(sakai._findpeople.list.total / 5);
		
		var select = document.getElementById("pages");
		select.options.length = 0;
		
		for (var i = 0; i < sakai._findpeople.totalpages; i++) {
			var ii = new Option("Page " + (i + 1) + " of " + sakai._findpeople.totalpages, (i + 1));
			select.options[select.options.length] = ii;
		}
		
		$("#pages").val("Page " + page + " of " + sakai._findpeople.totalpages);
		
		sakai._findpeople.isbusy = false;
				
	},
	
	initFunctions : function(){
		
		$("#pages").bind("change", function(ev){
			if (!sakai._findpeople.isbusy) {
				var select = document.getElementById("pages");
				var index = select.selectedIndex;
				var val = select.options[index].value;
				var npage = parseInt(val);
				sakai._findpeople.page = npage;
				sakai._findpeople.doSearch($("#search_people").val(),sakai._findpeople.page);
			}
		});
		
		$("#next").bind("click", function(ev){
			sakai._findpeople.page++;
			
			var select = document.getElementById("pages");
			
			select.selectedIndex = sakai._findpeople.page - 1;
			
			sakai._findpeople.doSearch($("#search_people").val(),sakai._findpeople.page);
		});
		
		$("#prev").bind("click", function(ev){
			sakai._findpeople.page = sakai._findpeople.page - 1;
			var select = document.getElementById("pages");
			
			select.selectedIndex = sakai._findpeople.page - 1;
			sakai._findpeople.doSearch($("#search_people").val(),sakai._findpeople.page);
		});
	
	},
	
	doList : function(){
		var finaljson = {};
		finaljson.items = [];
		for (var i = 0; i < 10; i++){
			try {
				var person = sakai._findpeople.list.items[i];
				if (person) {
					var index = finaljson.items.length;
					finaljson.items[index] = {};
					finaljson.items[index].userid = person.userid;
					var person = sakai._findpeople.list.items[i];
					if (person.picture) {
						var picture = eval('(' + person.picture + ')');
						finaljson.items[index].picture = "/sdata/f/public/" + person.userid + "/" + picture.name;
					}
					if (person.firstName || person.lastName) {
						var str = person.firstName;
						str += " " + person.lastName;
						finaljson.items[index].name = str;
					} else {
						finaljson.items[index].name = person.userid;
					}
					if (person.basic){
						var basic = eval('(' + person.basic + ')');
						if (basic.unirole){
							finaljson.items[index].role = basic.unirole;
						}
						if (basic.unicollege){
							finaljson.items[index].college = basic.unicollege;
						}
						if (basic.unidepartment){
							finaljson.items[index].department = basic.unidepartment;
						}
					}
				}
			} catch (err){
				alert(err);
			};
		}
		
		$("#list_rendered").html(sdata.html.Template.render("list_rendered_template", finaljson));
		
	}
	
}

sakai.findpeople = function(){
  
  	var page = false;
	var totalpages = false;
	var list = false;
  	var tosearchfor = false;
	var empty = true;
	var isbusy = false;
	
	sakai._findpeople.initFunctions();
	
	sdata.Ajax.request({
		httpMethod: "GET",
		url: "/sdata/me?sid=" + Math.random(),
		onSuccess: function(data){
			var me = eval('(' + data + ')');
			$("#user_id").text(me.items.firstname + " " + me.items.lastname);
		},
		onFail: function(status){
				
		}
	});	
	
	$("#search_people").bind("focus", function(ev){
		if (empty) {
			if ($("#search_people").val() == $("#search_people_standard").val()) {
				$("#search_people").attr("value", "");
			}
			$("#search_people").css("color", "#000000");
			$("#search_people").css("font-style", "normal");
			empty = false;
		}
	});
	
	$("#dosearch").bind("click", function(ev){
		startSearch();
	});
	
	$("#search_people").bind("keypress", function(ev){
		if (ev.which == 13) {
			startSearch();
		}
	});
	
	var startSearch = function(){
		tosearchfor = $("#search_people").attr("value");
		if (tosearchfor){
			page = 1;
			sakai._findpeople.doSearch(tosearchfor, page);
		}
	}
	
	History.history_change();
   
};

sdata.registerForLoad("sakai.findpeople");