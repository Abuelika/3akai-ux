var sakai = sakai || {};

sakai.myfriendswow = function(tuid,placement,showSettings){

	var rootel = $("#" + tuid);
	var friends = false;
	
	sdata.Ajax.request({
		httpMethod: "GET",
		url: "/rest/friend/status?p=0&n=6&friendStatus=ACCEPTED&s=firstName&s=lastName&o=asc&o=asc&sid=" + Math.random(),
		onSuccess: function(data){
			friends = eval('(' + data + ')');
			doProcessing();
		},
		onFail: function(status){
			$("#list_rendered").html("<b>An error has occurred.</b> Please try again later");
		}
	});
	
	sdata.Ajax.request({
		httpMethod: "GET",
		url: "/rest/friend/status?sid=" + Math.random(),
		onSuccess: function(data){
			var json2 = eval('(' + data + ')');
			
			var total = 0;
			if (json2.status.friends){
				for (var i = 0; i < json2.status.friends.length; i++){
					if (json2.status.friends[i].status == "INVITED"){
						total++;
					}
				}
			}
			
			if (total == 1){
				$("#contact_requests", rootel).html("1 Contact Request");
			} else if (total > 1) {
				$("#contact_requests", rootel).html(json2.total + " Connection Requests");
			}
		},
		onFail: function(status){
			
		}
	});
	
	var doProcessing = function(){
		var pOnline = {};
		pOnline.items = [];
		var total = 0;
		pOnline.showMore = false;
		
		if (friends.status.friends) {
			for (var i = 0; i < friends.status.friends.length; i++) {
				var isOnline = false;
				
				if (!isOnline && total < 6) {
					item.id = item.friendUuid;
					var item = friends.status.friends[i];
					if (item.profile.firstName && item.profile.lastName) {
						item.name = item.profile.firstName + " " + item.profile.lastName;
					}
					else {
						item.name = item.friendUuid;
					}
					if (item.profile.picture) {
						var pict = eval('(' + item.profile.picture + ')');
						item.photo = "/sdata/f/_private" + item.properties.userStoragePrefix + pict.name;
					}
					item.online = false;
					if (item.profile.basic) {
						var basic = eval('(' + item.profile.basic + ')');
						if (basic.status) {
							item.status = basic.status;
						} else {
							item.status = "";
						}
					} else {
						item.status = "";
					}
					pOnline.items[pOnline.items.length] = item;
					total++;
				}
				else 
					if (total >= 3 && !isOnline) {
						pOnline.showMore = true;
					}
			}
		}
		
		$("#my_contacts_list").html(sdata.html.Template.render("my_contacts_list_template", pOnline));
	}

};

sdata.widgets.WidgetLoader.informOnLoad("myfriendswow");