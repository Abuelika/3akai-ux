var sakai = sakai || {};
sakai.preferences = function(){
    var default_firstname;
    var default_lastname;
    var default_email;
    var default_zone;
    var default_language;
    var default_zone_list;
    var default_language_list;
    var selected_zone;
    var selected_language;
    var error_input = [];
    
	var init = function(){
        $("#back_dashboard").attr("href","/dev/dashboard.html");
        /*
sdata.Ajax.request({
            httpMethod: "GET",
            url: "/sdata/prfc",
            responseType: 'json',
            onSuccess: function(data)
            {
                var pref_json_feed = data;
                document.getElementById("preferences_choose_timezone").innerHTML = "";
                timezone_array = [];
                timezone_array.items = [];
                var list = pref_json_feed.timezonelist;
                default_zone_list = list;
                for(key in list)
                {
                    var index = timezone_array.items.length;
                    timezone_array.items[index] = [];
                    timezone_array.items[index].title = list[key];
                    if(pref_json_feed.timezone == list[key])
                    {
                        timezone_array.items[index].show = true;
                        selected_zone = list[key];
                        default_zone = selected_zone;
                    }
                    else
                        timezone_array.items[index].show = false;
                }
                document.getElementById("preferences_choose_timezone").innerHTML = sdata.html.Template.render("preferences_timezones", timezone_array);
                
                var languages = pref_json_feed.languages;
                default_language_list = languages;
                var language_show = pref_json_feed.locale;
                var html = [];
                html.push('<select onchange="sakai.preferences.valuechanged();">');
                for (var i = 0; i < languages.length; ++i)
                {
                    var item = languages[i];
                    if (item.id == language_show)
                    {
                        selected_language = item.id;
                        default_language = selected_language;
                        html.push('<option selected="selected" onclick="sakai.preferences.selectLanguage(\'' + item.id + '\')">' + item.displayName + '</option>');
                    }
                    else
                        html.push('<option onclick="sakai.preferences.selectLanguage(\'' + item.id + '\')">' + item.displayName + '</option>');
                }
                html.push('</select>');
                document.getElementById("preferences_choose_language").innerHTML = html.join("");
                
                $("#preferences_undo_id1").hide();
                $("#preferences_undo_id2").show();
            }
        });
*/
    }

    init();
	
	showError = function(msg){
		 $("#current_pw_id1").css("color","rgb(250,0,0)");
         error_input.push('current_pw_id1');
         $("#new_pw_id1").css("color","rgb(250,0,0)");
         error_input.push('new_pw_id1');
         $("#retype_pw_id1").css("color","rgb(250,0,0)");
         error_input.push('retype_pw_id1');
		 if (msg) {
		 	$("#alert_id1").html(msg);
		 }
		 else {
		 	$("#alert_id1").html("<b>Oops!</b> Please try again.");
		 }
         $("#spacer").show();
         $("#warning1").show();	
	}
	
    sakai.preferences.saveDetail = function(){
		
		// clear out any previous success/error info
        $("#warning1").hide();
		$("#spacer").hide();
        $("#saveinfo1").hide();
        
        $("#current_pw_id1").css("color","");
        $("#new_pw_id1").css("color","");
        $("#retype_pw_id1").css("color","");
		
        var current_pw = $("#preferences_pw_current").val();
        var new_pw = $("#preferences_pw_new").val();
        var new_pw_retype = $("#preferences_pw_new_retype").val();
		
		if (current_pw || new_pw || new_pw_retype){
			if (current_pw && new_pw && new_pw_retype){
				if (new_pw == new_pw_retype){
					if (new_pw.length < 5){
						showError("Please make sure your password is at least 5 characters long");
						return false;
					} 
				} else {
					showError("Please make sure the passwords match");
					return false;
				}
			} else {
				showError("Please fill out everything");
				return false;
			}
		} else {
			showError("Please fill out everything");
			return false;
		}
		
        //var data = {"currentpw":current_pw,"newpw":new_pw,"retypepw":new_pw_retype,"selected_zone":selected_zone, "seleted_language":selected_language};
        
		var data = {"oldPassword":current_pw,"password":new_pw};
        
            sdata.Ajax.request({
                url :"/rest/user/changepassword",
                httpMethod : "POST",
                postData : data,
                contentType : "application/x-www-form-urlencoded",
                onSuccess : function(data) {
                    /*
					default_zone = selected_zone;
					if(default_language != selected_language)
			        {
						default_language = selected_language;
						window.location.reload();
					}
					*/
                    error_input = [];
                    $("#saveinfo1").show();
					$("#spacer").show();
                    $("#preferences_undo_id1").hide();
                    $("#preferences_undo_id2").show();
                },
                onFail : function(status) {
                    //if (status == 400)
                    //{
                        $("#current_pw_id1").css("color","rgb(250,0,0)");
                        error_input.push('current_pw_id1');
                        $("#new_pw_id1").css("color","rgb(250,0,0)");
                        error_input.push('new_pw_id1');
                        $("#retype_pw_id1").css("color","rgb(250,0,0)");
                        error_input.push('retype_pw_id1');
                        $("#alert_id1").html("<b>Oops!</b> Please try again.");
						$("#spacer").show();
                        $("#warning1").show();
                    //}
                }
            });
        
    }
    
    sakai.preferences.undo = function(){
		$("#warning1").hide();
		$("#spacer").hide();
        $("#saveinfo1").hide();
        document.getElementById("preferences_choose_timezone").innerHTML = "";
        timezone_array = [];
        timezone_array.items = [];
        var list = default_zone_list;
        for(key in list)
        {
            var index = timezone_array.items.length;
            timezone_array.items[index] = [];
            timezone_array.items[index].title = list[key];
            if(default_zone == list[key])
            {
                timezone_array.items[index].show = true;
                selected_zone = list[key];
            }
            else
                timezone_array.items[index].show = false;
        }
        document.getElementById("preferences_choose_timezone").innerHTML = sdata.html.Template.render("preferences_timezones", timezone_array);
                
        var languages = default_language_list;
        var language_show = default_language;
        var html = [];
        html.push('<select onchange="sakai.preferences.valuechanged();">');
        for (var i = 0; i < languages.length; ++i)
        {
            var item = languages[i];
            if (item.id == language_show)
            {
                selected_language = item.id;
                html.push('<option selected="selected" onclick="sakai.preferences.selectLanguage(\'' + item.id + '\')">' + item.displayName + '</option>');
            }
            else
                html.push('<option onclick="sakai.preferences.selectLanguage(\'' + item.id + '\')">' + item.displayName + '</option>');
        }
        html.push('</select>');
        document.getElementById("preferences_choose_language").innerHTML = html.join("");

        $("#preferences_undo_id1").hide();
        $("#preferences_undo_id2").show();
        
        $("#preferences_pw_current").attr("value", "");
        $("#preferences_pw_new").attr("value", "");
        $("#preferences_pw_new_retype").attr("value", "");
    }
    
    sakai.preferences.selectTimezone = function(title){
        selected_zone = title;
    }

    sakai.preferences.selectLanguage = function(title){
        selected_language = title;
    }
    
    sakai.preferences.valuechanged = function(){
        $("#preferences_undo_id1").show();
        $("#preferences_undo_id2").hide();
    }

    sakai.preferences.removealert = function(){
        $("#warning1").hide();
		$("#spacer").hide();
        for(var i=0; i<error_input.length; i++)
        {
//            document.getElementById("email_id1").style.color='#FF0000';
//            $("#email_id1").toggleClass("pref-td1-error");
            $("#" + error_input[i] ).css("color","rgb(51,51,51)");
        }
        error_input = [];
    }
    
    sakai.preferences.remove_save_info = function(){
        $("#saveinfo1").hide();
		$("#spacer").hide();
    }
};

sdata.registerForLoad("sakai.preferences");
