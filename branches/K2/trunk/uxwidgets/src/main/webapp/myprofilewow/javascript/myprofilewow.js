var sakai = sakai || {};

sakai.myprofilewow = function(tuid,placement,showSettings){

	var rootel = $("#" + tuid);

	me = sdata.me;
	json = me.profile;
	if (json.firstName && json.lastName){
		$("#profile_name",rootel).text(json.firstName + " " + json.lastName);
	} else {
		$("#profile_name",rootel).text(me.preferences.uuid);
	}
	if (json.picture){
		var pict = eval('(' + json.picture + ')');
		$("#profile_picture",rootel).css("text-indent","0px");
		$("#profile_picture",rootel).html("<img src='/sdata/f/_private" + me.userStoragePrefix + pict.name + "' width='60px' height='60px' />");
	}
	var extra = "&nbsp;";
	if (json.basic) {
		var basic = eval('(' + json.basic + ')');
		if (json.unirole) {
			extra = json.unirole;
		}
		else if (json.unicollege) {
			extra = json.unicollege;
		}
		else if (json.unidepartment) {
			extra = json.unidepartment;
		}
	}
	if (extra){
		$("#profile_dept",rootel).html(extra);
	}

};

sdata.widgets.WidgetLoader.informOnLoad("myprofilewow");