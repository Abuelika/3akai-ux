var sakai = sakai || {};

var profileinfo_userId = false;

sakai.profile = function(){

	var qs = new Querystring();
	var user = qs.get("user", false);
	var showEdit = true;
	var json = false;
	var myprofile = true;
	var me = false;
	
	var totalprofile = false;
	
	var fileUrl = "";
	
	// Fields for papers
	
	var paperfield = "paper";
	var papersavefield = "academic";
	var papersavestring = "academic";
	var paperfields = ["title", "ovtitle", "auth", "coauth", "year", "vol", "voltitle", "edition", "place", "publisher", "number", "url"];
	var paperrequired = ["title", "ovtitle", "auth", "year", "vol", "voltitle", "place", "publisher", "number"];
	
	// Fields for websites
	
	var websitefield = "website";
	var websitesavefield = "websites";
	var websitesavestring = "websites";
	var websitefields = ["title", "url"];
	var websiterequired = ["title", "url"];
	
	// Fields for degree
	
	var educationfield = "degree";
	var educationsavefield = "education";
	var educationsavestring = "education";
	var educationfields = ["country", "school", "field", "degree", "from", "until", "notes"];
	var educationrequired = ["country", "school", "field", "degree", "from", "until"];
	
	// Fields for jobs
	
	var jobfield = "job";
	var jobsavefield = "job";
	var jobsavestring = "job";
	var jobfields = ["role", "country", "company", "from", "until", "description"];
	var jobrequired = ["role", "country", "company", "from", "until"];
	
	// Fields for talks
	
	var talkfield = "talk";
	var talksavefield = "talks";
	var talksavestring = "talks";
	var talkfields = ["title", "place", "date", "url", "coauth"];
	var talkrequired = ["title", "place", "date"];
	
	$(".url_field").bind("change", function(ev){
		var value = $(this).val();
		if (value) {
			if (value.indexOf("//") == -1) {
				value = "http://" + value;
				$(this).val(value);
			}
		}
	});
	
	
	
	var doInit = function(){
	
		me = sdata.me;
		
		
		if (!me.preferences.uuid && !me.preferences.eid) {
			var redirect =  Config.URL.GATEWAY_URL + "?url=/dev/profile_edit.html";
			if (user){
				redirect += sdata.util.URL.encode("?user=" + user);
			}
			document.location = redirect;
		}
		
		totalprofile = me;
		fillInvitePopup();
		
		if (user && user != me.preferences.uuid) {
			myprofile = false;
			fileUrl = "/rest/me/" + user + "?sid=" + Math.random();
			sdata.Ajax.request({
				httpMethod: "GET",
				url: fileUrl,
				onSuccess: function(data){
					totalprofile = eval('(' + data + ')');
					totalprofile.profile = totalprofile.users[0].profile;
					totalprofile.userStoragePrefix = totalprofile.users[0].userStoragePrefix;
					if (totalprofile.profile.status === "online" && totalprofile.profile.chatstatus) {
						totalprofile._status = totalprofile.profile.chatstatus;
					} 
					else {
						totalprofile._status = totalprofile.profile.status;
					}
					json = totalprofile.profile;
					
					if (user && user != me.preferences.uuid) {
						doAddButton();
					}
					
					fillInFields();
					
				},
				onFail: function(status){
				
				}
			});
		}
		else 
			if (!showEdit) {
				//myprofile = false;
				$("#link_edit_profile").show();
				fileUrl = "/f/_private" + me.userStoragePrefix + "profile.json?sid=" + Math.random();
				sdata.Ajax.request({
					httpMethod: "GET",
					url: "/sdata" + fileUrl,
					onSuccess: function(data){
						json = eval('(' + data + ')');
						fillInFields();
					},
					onFail: function(status){
					
					}
				});
			}
			else {
				if (user == me.preferences.uuid) {
					user = false;
				}
				$("#link_view_profile").show();
				fileUrl = "/f/_private" + me.userStoragePrefix + "profile.json?sid=" + Math.random();
				sdata.Ajax.request({
					httpMethod: "GET",
					url: "/sdata" + fileUrl,
					onSuccess: function(data){
						json = eval('(' + data + ')');
						
						setFunctions(paperfield, papersavefield, papersavestring, paperfields, paperrequired);
						setFunctions(talkfield, talksavefield, talksavestring, talkfields, talkrequired);
						setFunctions(jobfield, jobsavefield, jobsavestring, jobfields, jobrequired);
						setFunctions(educationfield, educationsavefield, educationsavestring, educationfields, educationrequired);
						setFunctions(websitefield, websitesavefield, websitesavestring, websitefields, websiterequired);
						
						fillInFields();
					},
					onFail: function(status){
					
					}
				});
			}
		
		if (myprofile) {
		
			$("#myprofile_placeholder").hide();
			$("#myprofile_tabs").show();
			$("#add_to_contacts_button").hide();
			$("#send_message_button").hide();
			
			
			fluid.inlineEdits(".profile_preview", {
				useTooltip: true,
				tooltipDelay : 500,
				listeners : {
					onFinishEdit: doHomeContact
				},
				defaultViewText: " ",
				paddings: {
				    minimumView: 0
				}
			});

			sakai.inlineEdits(".profile_preview", {
				useTooltip: true,
				finishedEditing: doHomeContact,
				defaultViewText: " "
			});
			
			$(".inlineEditable").css("height","16px");
			$(".text").css("height","16px");
			$(".dropdown").css("height","16px");
			
		}
		
	}
			
   var inedit_basic = true;
   
   var fillInBasic = function(){
		
		var inbasic = 0;
		var basic = false;
		
		fillInMessagePopUp();
		
		$("#profile_user_name").text(json.firstName + " " + json.lastName);
		if (json.basic){
			var basic = json.basic;
			if (basic.status){
				inbasic++;
				$("#txt_status").html(basic.status);
				$("#status").show();
			} else if (!inedit_basic) {
				$("#status").hide();
			}
		} else if (!inedit_basic) {
			$("#status").hide();
		}
		
		var chatstatus = "offline";
		if (json.chatstatus){
			chatstatus = json.chatstatus;
		}
		$("#profile_user_status_" + chatstatus).show();
		
		// Basic Information
		
		if (json.firstName){
			inbasic++;
			$("#firstname").show();
			var str = json.firstName;
			$("#txt_firstname").text("" + str);
		} else if (!inedit_basic) {
			$("#firstname").hide();
		}
		
		if (json.lastName){
			inbasic++;
			$("#lastname").show();
			var str = json.lastName;
			$("#txt_lastname").text("" + str);
		} else if (!inedit_basic) {
			$("#lastname").hide();
		}
		
		if (myprofile || (user == false || user == me.preferences.uuid)){
			$("#sitetitle").text("My Profile");
		} else {
			if (json.firstName || json.lastName){
				$("#sitetitle").text(json.firstName + " " + json.lastName);
			} else {
				$("#sitetitle").text(json.displayName);
			}
		}
		
		$("#basic").show();
		
		if (json.basic){
			
			basic = json.basic;
			
			if (basic.middlename){
				inbasic++;
				$("#middlename").show();
				var str = basic.middlename;
				$("#txt_middlename").text("" + str);
			} else if (!inedit_basic) {
				$("#middlename").hide();
			}
			
			if (basic.birthday){
				inbasic++;
				$("#birthday").show();
				$("#txt_birthday").text(basic.birthday);
			} else if (!inedit_basic) {
				$("#birthday").hide();
			}
			
			if (basic.unirole){
				inbasic++;
				$("#unirole").show();
				var str = basic.unirole;
				$("#txt_unirole").text("" + str);
			} else if (!inedit_basic) {
				$("#unirole").hide();
			}
			
			if (basic.unidepartment){
				inbasic++;
				$("#unidepartment").show();
				var str = basic.unidepartment;
				$("#txt_unidepartment").text("" + str);
			} else if (!inedit_basic) {
				$("#unidepartment").hide();
			}
			
			if (basic.unicollege){
				inbasic++;
				$("#unicollege").show();
				var str = basic.unicollege;
				$("#txt_unicollege").text("" + str);
			} else if (!inedit_basic) {
				$("#unicollege").hide();
			}
			
			
		} else if (!inedit_basic){
			$("#middlename").hide();
			$("#birthday").hide();
			$("#unicollege").hide();
			$("#unidepartment").hide();
			$("#unirole").hide();
		}
		
		if (inbasic > 0){
			$("#basic").show();
			$("#no_basic").hide();
		} else if (myprofile) {
			$("#basic").show();
			if (!inedit_basic) {
				$("#no_basic").show();
			} else {
				$("#no_basic").hide();
			}
		} else {
			$("#basic").hide();
		}
		
		fillGeneralPopupField(paperfield, papersavefield, papersavestring, paperfields);
		fillGeneralPopupField(talkfield, talksavefield, talksavestring, talkfields);
		fillGeneralPopupField(jobfield, jobsavefield, jobsavestring, jobfields);
		fillGeneralPopupField(educationfield, educationsavefield, educationsavestring, educationfields);
		fillGeneralPopupField(websitefield, websitesavefield, websitesavestring, websitefields);
		
		// ! Set dropdown for paper year		

		if (myprofile && showEdit){
			// filling the years into the dropdowns
			var fields = [];
			fields[0] = document.getElementById("new_degree_from");
			fields[1] = document.getElementById("new_degree_until");
			fields[2] = document.getElementById("edit_degree_from");
			fields[3] = document.getElementById("edit_degree_until");
			fields[4] = document.getElementById("new_job_from");
			fields[5] = document.getElementById("new_job_until");
			fields[6] = document.getElementById("edit_job_from");
			fields[7] = document.getElementById("edit_job_until");
			fields[8] = document.getElementById("new_paper_year");
			fields[9] = document.getElementById("edit_paper_year");
			
			/*
for (var i = 2015; i >= 1900; i--){
				for (var ii = 0; ii < fields.length; ii++){
					var option = new Option("" + i,"" + i);
					fields[ii].options[fields[ii].options.length] = option;
				}
			}
*/
		}
   }
   
   //////////////////////////
   // General Popup Fields //
   //////////////////////////
   
    var fillGeneralPopupField = function(field, savefield, savestring, fields){
   
   		if (myprofile && showEdit){
			$("#" + field + "s").show();
			$("#" + field + "sadd").show();
		} else {
			if (json[savefield]){
				var obj = {};
				obj.items = [];
				if (json[savefield]){
					obj.items = eval('(' + json[savefield] + ')');
				}
				if (obj.items.length > 0){
					$("#" + field + "s").show();
				}
			}
		}
   
	   	var obj = {};
		obj.items = [];
		if (json[savefield]){
			obj.items = eval('(' + json[savefield] + ')');
		}
		$("#" + field + "s_list").html(sdata.html.Template.render(field + "s_list_template",obj));
   	
    }
	
	var setFunctions = function(field, savefield, savestring, fields, required){
	
		$("." + field + "sadd").bind("click", function(ev){
			for (var index = 0; index < fields.length; index++){
				$("#new_" + field + "_" + fields[index]).val("");
			}
			
			$("#add_fields_overlay_lightbox").show();
			$("#add_" + field + "s_lightbox").show();
		});
		
		$(".sakai-close-add-" + field + "s").bind("click", function(ev){
			$("#add_" + field + "s_lightbox").hide();
			$("#add_fields_overlay_lightbox").hide();
		});
		$(".sakai-close-edit-" + field + "s").bind("click", function(ev){
			$("#edit_" + field + "s_lightbox").hide();
			$("#add_fields_overlay_lightbox").hide();
		});
		
		$("#edit_" + field + "_button").bind("click", function(ev){
		
			var id = parseInt($("#edit_" + field + "_id").val());
			var arrayToSave = {};
			for (var index = 0; index < fields.length; index++){
				arrayToSave[fields[index]] = $("#edit_" + field + "_" + fields[index]).val();
			}
			
			var valid = true;
			for (var index = 0; index < required.length; index++){
				if (!arrayToSave[required[index]]){
					valid = false;
				}
			}
			
			if (valid) {
			
				var obj = {};
				obj.items = [];
				if (json[savefield]) {
					obj.items = eval('(' + json[savefield] + ')');
				}
				
				var index = 0;
				for (var i = 0; i < obj.items.length; i++) {
					if (obj.items[i].id == id) {
						for (var index = 0; index < fields.length; index++){
							obj.items[i][fields[index]] = arrayToSave[fields[index]];
						}
					}
				}
				
				var data = {};
				data[savestring] = sdata.JSON.stringify(obj.items);
				json[savefield] = data[savestring];
				
				var a = ["u"];
				var k = ["" + savefield];
				var v = ["" + data[savestring]];
				var tosend = {"v":v,"k":k,"a":a};
				
				sdata.Ajax.request({
					url: "/rest/patch" + fileUrl,
					httpMethod: "POST",
					postData: tosend,
					contentType: "application/x-www-form-urlencoded",
					onSuccess: function(data){
					
					},
					onFail: function(data){
						alert("An error has occured");
					}
				});
				
				fillGeneralPopupField(field, savefield, savestring, fields);
				
				$("#edit_" + field + "s_lightbox").hide();
				$("#add_fields_overlay_lightbox").hide();
				
			}
			else {
				alert("Please fill out all of the fields");
			}
		});
		
		$("#new_" + field + "_button").bind("click", function(ev){
			var arrayToSave = {};
			for (var index = 0; index < fields.length; index++){
				arrayToSave[fields[index]] = $("#new_" + field + "_" + fields[index]).val();
			}
			
			var valid = true;
			for (var index = 0; index < required.length; index++){
				if (!arrayToSave[required[index]]){
					valid = false;
				}
			}
			
			if (!valid) {
				alert("Please fill out all the necessairy fields");
			}
			else {
				var obj = {};
				obj.items = [];
				if (json[savefield]) {
					obj.items = eval('(' + json[savefield] + ')');
				}
				var index = obj.items.length;
				obj.items[index] = {};
				
				for (var index2 = 0; index2 < fields.length; index2++){
					obj.items[index][fields[index2]] = arrayToSave[fields[index2]];
				}
			
				obj.items[index].id = Math.round(Math.random() * 100000);
				var data = {};
				data[savestring] = sdata.JSON.stringify(obj.items);
				json[savefield] = data[savestring];
				
				var a = ["u"];
				var k = ["" + savefield];
				var v = ["" + data[savestring]];
				var tosend = {"v":v,"k":k,"a":a};
				
				sdata.Ajax.request({
					url: "/rest/patch" + fileUrl,
					httpMethod: "POST",
					postData: tosend,
					contentType: "application/x-www-form-urlencoded",
					onSuccess: function(data){
					
					},
					onFail: function(data){
						alert("An error has occured");
					}
				});
				
				$("#add_" + field + "s_lightbox").hide();
				$("#add_fields_overlay_lightbox").hide();
				
				fillGeneralPopupField(field, savefield, savestring, fields);
				
			}
		});
		
	}
	
	
	
	/**
	 * Update a certain element
	 * @param {Object} element Element that needs to be updated
	 */
	var updateChatStatusElement = function(element, status){
		element.removeClass("profile_available_status_online");
		element.removeClass("profile_available_status_busy");
		element.removeClass("profile_available_status_offline");
		element.addClass("profile_available_status_"+status);
	}
   
   //////////////////////////
   // General Popup Fields //
   //////////////////////////
   
   var fillInFields = function(){
   		//	status
		$("#profile_user_status").text(totalprofile._status);
		//	status picture
		updateChatStatusElement($("#profile_user_status"), totalprofile._status);
		
		
		//Picture
		
		if (json.picture && json.picture.name){
			var picture = json.picture;
			$("#picture_holder img").attr("src",'/sdata/f/_private' + totalprofile.userStoragePrefix + picture.name);
		}
		
		fillInBasic();
		
		// About Me
		
		var about = false;
		var inabout = 0;
		if (json.aboutme) {
		
			about = json.aboutme;
			
			if (about.aboutme){
				inabout++;
				$("#aboutme").show();
				$("#txt_aboutme").html("" + about.aboutme.replace(/\n/g, "<br/>"));
			} else if (!inedit_basic) {
				$("#aboutme").hide();
			}
			
			if (about.personalinterests) {
				inabout++;
				$("#personalinterests").show();
				$("#txt_personalinterests").html("" + about.personalinterests.replace(/\n/g, "<br/>"));
			} else if (!inedit_basic) {
				$("#personalinterests").hide();
			}
			
			if (about.academicinterests) {
				inabout++;
				$("#academicinterests").show();
				$("#txt_academicinterests").html("" + about.academicinterests.replace(/\n/g, "<br/>"));
			} else if (!inedit_basic) {
				$("#academicinterests").hide();
			}
			
			if (about.hobbies) {
				inabout++;
				$("#hobbies").show();
				$("#txt_hobbies").html("" + about.hobbies.replace(/\n/g, "<br/>"));
			} else if (!inedit_basic) {
				$("#hobbies").hide();
			}
			
			
		} else if (!inedit_basic){
			$("#aboutme").hide();
			$("#academicinterests").hide();
			$("#hobbies").hide();
			$("#personalinterests").hide();
		}
		
		if (inabout > 0){
			$("#about").show();
			$("#no_about").hide();
		} else if (myprofile && showEdit) {
			$("#about").show();
			if (!inedit_basic) {
				$("#no_about").show();
			} else {
				$("#no_about").hide();
			}
		} else {
			$("#about").hide();
		}
		
		// Uni Contact Info
		
		var unicontactinfo = false;
		var inunicontactinfo = 0;
		
		if (json.email){
			inunicontactinfo++;
			$("#uniemail").show();
			$("#txt_uniemail").text(json.email);
		} else if (!inedit_basic) {
			$("#uniemail").hide();
		}
		
		if (json.contactinfo) {
		
			unicontactinfo = json.contactinfo;
			
			if (unicontactinfo.uniphone) {
				inunicontactinfo++;
				$("#uniphone").show();
				$("#txt_uniphone").text("" + unicontactinfo.uniphone);
			} else if (!inedit_basic) {
				$("#uniphone").hide();
			}
			
			if (unicontactinfo.unimobile) {
				inunicontactinfo++;
				$("#unimobile").show();
				$("#txt_unimobile").text("" + unicontactinfo.unimobile);
			} else if (!inedit_basic) {
				$("#unimobile").hide();
			}
			
			if (unicontactinfo.uniaddress) {
				inunicontactinfo++;
				$("#uniaddress").show();
				$("#txt_uniaddress").html("" + unicontactinfo.uniaddress.replace(/\n/g, "<br/>"));
			} else if (!inedit_basic) {
				$("#uniaddress").hide();
			}
			
		} else if (!inedit_basic) {
			$("#uniphone").hide();
			$("#unimobile").hide();
			$("#uniaddress").hide();
		}
		
		if (inunicontactinfo > 0){
			$("#unicontactinfo").show();
			$("#no_unicontactinfo").hide();
		} else if (myprofile && showEdit) {
			$("#unicontactinfo").show();
			if (!inedit_basic) {
				$("#no_unicontactinfo").show();
			} else {
				$("#no_unicontactinfo").hide();
			}
		} else {
			$("#unicontactinfo").hide();
		}
		
		// Home Contact Info
		
		var homecontactinfo = false;
		var inhomecontactinfo = 0;
		if (json.contactinfo) {
		
			homecontactinfo = json.contactinfo;
			
			if (homecontactinfo.homeemail) {
				inhomecontactinfo++;
				$("#homeemail").show();
				$("#txt_homeemail").text("" + homecontactinfo.homeemail);
			} else if (!inedit_basic) {
				$("#homeemail").hide();
			}
			
			if (homecontactinfo.homephone) {
				inhomecontactinfo++;
				$("#homephone").show();
				$("#txt_homephone").text("" + homecontactinfo.homephone);
			} else if (!inedit_basic) {
				$("#homephone").hide();
			}
			
			if (homecontactinfo.homemobile) {
				inhomecontactinfo++;
				$("#homemobile").show();
				$("#txt_homemobile").text("" + homecontactinfo.homemobile);
			} else if (!inedit_basic) {
				$("#homemobile").hide();
			}
			
			if (homecontactinfo.homeaddress) {
				inhomecontactinfo++;
				$("#homeaddress").show();
				$("#txt_homeaddress").html("" + homecontactinfo.homeaddress.replace(/\n/g, "<br/>"));
			} else if (!inedit_basic) {
				$("#homeaddress").hide();
			}
			
		} else if (!inedit_basic) {
			$("#homeemail").hide();
			$("#homephone").hide();
			$("#homeaddress").hide();
			$("#homemobile").hide();
		}
		
		if (inhomecontactinfo > 0){
			$("#homecontactinfo").show();
			$("#no_homecontactinfo").hide();
		} else if (myprofile && showEdit) {
			$("#homecontactinfo").show();
			if (!inedit_basic) {
				$("#no_homecontactinfo").show();
			} else {
				$("#no_homecontactinfo").hide();
			}
		} else {
			$("#homecontactinfo").hide();
		}
		
		// Additional
		
		var additional = false;
		var inadditional = 0;
		if (json.basic) {
		
			additional = json.basic;
			
			if (additional.awards){
				inadditional++;
				$("#awards").show();
				$("#txt_awards").html("" + additional.awards.replace(/\n/g, "<br/>"));
			} else if (!inedit_basic) {
				$("#awards").hide();
			}
			
			if (additional.clubs){
				inadditional++;
				$("#clubs").show();
				$("#txt_clubs").html("" + additional.clubs.replace(/\n/g, "<br/>"));
			} else if (!inedit_basic) {
				$("#clubs").hide();
			}
			
			if (additional.societies){
				inadditional++;
				$("#societies").show();
				$("#txt_societies").html("" + additional.societies.replace(/\n/g, "<br/>"));
			} else if (!inedit_basic) {
				$("#societies").hide();
			}
			
			
		} else if (!inedit_basic){
			$("#awards").hide();
			$("#societies").hide();
			$("#clubs").hide();
		}
		
		if (inadditional > 0){
			$("#additional").show();
			$("#no_additional").hide();
		} else if (myprofile && showEdit) {
			$("#additional").show();
			if (!inedit_basic) {
				$("#no_additional").show();
			} else {
				$("#no_additional").hide();
			}
		} else {
			$("#additional").hide();
		}
		
		/*$(document.body).hide();
		setTimeout((function(){
			$(document.body).show();
		}),10);*/
   }
   
   /*
    * Sending a message
    */
	
	$('#message_dialog').jqm({
		modal: true,
		trigger: $('#send_message_button'),
		overlay: 20,
		toTop: true
	});
	
	var fillInMessagePopUp = function(){
		$("#message_from").text(me.profile.firstName + " " + me.profile.lastName);
		$("#message_to").text(totalprofile.profile.firstName + " " + totalprofile.profile.lastName);
	}
	
	$("#save_as_page_template_button").bind("click", function(ev){
		
		var subjectEl = $("#comp-subject");
		var bodyEl = $("#comp-body");
		
		var valid = true;
		var	subject = subjectEl.val();
		var body = bodyEl.val();
		
		subjectEl.removeClass("invalid");
		bodyEl.removeClass("invalid");
		
		if (!subject){
			valid = false;
			subjectEl.addClass("invalid");
		}
		if (!body){
			valid = false;
			bodyEl.addClass("invalid");
		}
		
		if (!valid){
			return false;
		} else {
			
			var openSocialMessage = new opensocial.Message(body,{"TITLE":subject,"TYPE":"MESSAGE"});
			var toSend = {"to": user,"message":sdata.JSON.stringify(openSocialMessage)};
			
			sdata.Ajax.request({
				url: "/_rest/message/send",
				httpMethod: "POST",
			    onSuccess: function(data){
					
				},
				onFail: function(status){
					alert("Sending messages isn't possible yet");
				},
				postData: toSend,
				contentType: "application/x-www-form-urlencoded"
			});
			
			subjectEl.val("");
			bodyEl.val("");
			
			$('#message_dialog').jqmHide();
		}
		
	});
	
	
	/*
	 * Add to contacts
	 */
	
	$('#add_to_contacts_dialog').jqm({
		modal: true,
		trigger: $('#add_to_contacts_button'),
		overlay: 20,
		toTop: true
	});
	
	var fillInvitePopup = function(){
		if (me.profile) {
			if (me.profile.firstName) {
				$("#add_friend_personal_note").text("I would like to invite you to become a member of my network on Sakai \n\n " + me.profile.firstName);
			}
			else 
				if (me.profile.lastName) {
					$("#add_friend_personal_note").text("I would like to invite you to become a member of my network on Sakai \n\n " + me.profile.lastName);
				}
				else {
					$("#add_friend_personal_note").text("I would like to invite you to become a member of my network on Sakai \n\n " + me.preferences.uuid);
				}
		}
	}
	
	var doAddButton = function(){
   		sdata.Ajax.request({
			httpMethod: "GET",
			url: "/rest/friend/status?sid=" + Math.random(),
			onSuccess: function(data){
				var resp = eval('(' + data + ')');
				
				var status = false;
				if (resp.status.friends){
					for (var i = 0; i < resp.status.friends.length; i++){
						if (resp.status.friends[i].friendUuid == user){
							status = resp.status.friends[i].status;
						}
					}
				}
				
				if (! status){
					
					$("#add_to_contacts_button").show();
					
					if (totalprofile.profile.firstName){
						$("#add_friend_displayname").text(totalprofile.profile.firstName);
						$("#add_friend_displayname2").text(totalprofile.profile.firstName);
					} else if (totalprofile.profile.lastName) {
						$("#add_friend_displayname").text(totalprofile.profile.lastName);
						$("#add_friend_displayname2").text(totalprofile.profile.lastName);
					} else {
						$("#add_friend_displayname").text(totalprofile.preferences.uuid);
						$("#add_friend_displayname2").text(totalprofile.preferences.uuid);
					}
					
					if (totalprofile.profile.picture && eval('(' + totalprofile.profile.picture + ')').name){
						$("#add_friend_profilepicture").html("<img src='/sdata/f/_private/" + totalprofile.userStoragePrefix + "/" + eval('(' + totalprofile.profile.picture + ')').name + "' width='40px' height='40px'/>");
					} else {
						$("#add_friend_profilepicture").html("<img src='images/person_icon.png' width='40px' height='40px'/>");
					}
					
					$("#add_friend_types").html(sdata.html.Template.render("add_friend_types_template",Widgets));
					
				} else if (status == "INVITED"){
					$("#accept_invitation_button").show();
				}
			},
			onFail: function(status){
				//alert("An error has occured");	
			}
		});
   }
   
   $("#add_friends_do_invite").bind("click", function(ev){
   		var toSend = sdata.FormBinder.serialize($("#add_friends_form"));
		if (toSend["add_friends_list_type"]){
			
			var type = toSend["add_friends_list_type"];
			var comment = toSend["add_friend_personal_note"];
			
			// send message to other person
			var userstring = "";
			if (me.profile.firstName && me.profile.lastName){
				userstring = me.profile.firstName + " " + me.profile.lastName;
			} else {
				userstring = me.preferences.uuid;
			}
			
			var title = Config.Connections.Invitation.title.replace(/[$][{][u][s][e][r][}]/g,userstring);
			var message = Config.Connections.Invitation.body.replace(/[$][{][u][s][e][r][}]/g,userstring).replace(/[$][{][c][o][m][m][e][n][t][}]/g,comment);
			
			// construct openSocial message
			var openSocialMessage = new opensocial.Message(message,{"TITLE":title,"TYPE":"INVITATION"});
					
			var data = { "friendUuid" : user , "friendType" : type, "message" :  sdata.JSON.stringify({"title":title,"body":openSocialMessage})};
			
			sdata.Ajax.request({
				url: "/rest/friend/connect/request",
				httpMethod: "POST",
			    onSuccess: function(data){
					
					$('#add_to_contacts_dialog').jqmHide();
					$("#add_to_contacts_button").hide();
					
				},
				onFail: function(status){
					alert("An error has occured");
				},
				postData: data,
				contentType: "application/x-www-form-urlencoded"
			});
			
		}
   });
   
   $("#accept_invitation_button").bind("click", function(ev){
   	
		var inviter = user;
		var data = {"friendUuid" : inviter};
		
		sdata.Ajax.request({
			url: "/rest/friend/connect/accept",
			httpMethod: "POST",
			onSuccess: function(data){
				$("#accept_invitation_button").hide();
			},
			onFail : function(data){
				alert("An error has occured");
			},
			postData: data,
			contentType: "application/x-www-form-urlencoded"
		});
	
   });
   
   var doHomeContact = function(newvalue, oldvalue, ev, ui){
		
		var basicfields = {"txt_status":"status","txt_middlename":"middlename","txt_gender":"gender","txt_unidepartment":"unidepartment","txt_unicollege":"unicollege","txt_unirole":"unirole","txt_birthday":"birthday","txt_awards":"awards","txt_clubs":"clubs","txt_societies":"societies"};
		var aboutmefields = {"txt_aboutme":"aboutme","txt_relationstatus":"relationstatus","txt_personalinterests":"personalinterests", "txt_academicinterests":"academicinterests","txt_hobbies":"hobbies"};
		var unicontactinfo = {"txt_uniphone":"uniphone","txt_unimobile":"unimobile","txt_uniaddress":"uniaddress"};
		var homecontactinfo = {"txt_homeemail":"homeemail","txt_homephone":"homephone","txt_homemobile":"homemobile","txt_homeaddress":"homeaddress"};
		
		var tosend = {};
		var key = false;
		var val = false;
		
		var disappear = false;
		ui.style.height = "16px";
		if (newvalue.replace(/ /g,"") == ""){
			if (!inedit_basic) {
				disappear = true;
			}
		}
		
		var value = newvalue;
		if (ui.id == "txt_firstname"){
			
			key = "firstName";
			val = value;
			json.firstName = value;
			if (disappear){
				$("#firstname").hide();
			}
			
		} else if (ui.id == "txt_lastname"){
			
			key = "lastName";
			val = value;
			json.lastName = value;
			if (disappear){
				$("#lastname").hide();
			}
			
		} else if (ui.id == "txt_uniemail"){
			
			key = "email";
			val = value;
			json.email = value;
			if (disappear){
				$("#uniemail").hide();
			}
			
		} else if (basicfields[ui.id]) {
			
			var basic = {};
			if (json.basic) {
				basic = json.basic;
			}
			basic[basicfields[ui.id]] = value;
			key = "basic";
			val = sdata.JSON.stringify(basic);
			json.basic = basic;
				
			if (disappear){
				$("#" + basicfields[ui.id]).hide();
			}
				
		} else if (aboutmefields[ui.id]) {
			
			var aboutme = {};
			if (json.aboutme) {
				aboutme = json.aboutme;
			}
			aboutme[aboutmefields[ui.id]] = value;
			key = "aboutme";
			val = sdata.JSON.stringify(aboutme);
			json.aboutme = aboutme;
				
			if (disappear){
				$("#" + aboutmefields[ui.id]).hide();
			}
				
		} else if (unicontactinfo[ui.id]) {
			
			var contactinfo = {};
			if (json.contactinfo) {
				contactinfo = json.contactinfo;
			}
			contactinfo[unicontactinfo[ui.id]] = value;
			key = "contactinfo";
			val = sdata.JSON.stringify(contactinfo);
			json.contactinfo = contactinfo;
				
			if (disappear){
				$("#" + unicontactinfo[ui.id]).hide();
			}
				
		} else if (homecontactinfo[ui.id]) {
			
			var contactinfo = {};
			if (json.contactinfo) {
				contactinfo = json.contactinfo;
			}
			contactinfo[homecontactinfo[ui.id]] = value;
			key = "contactinfo";
			val = sdata.JSON.stringify(contactinfo);
			json.contactinfo = contactinfo;
				
			if (disappear){
				$("#" + homecontactinfo[ui.id]).hide();
			}
				
		}
		
		var a = ["u"];
		var k = [key];
		var v = [val];
		
		var tosend = {"k":k,"a":a,"v":v};
		
		sdata.Ajax.request({
        	url : "/rest/patch" + fileUrl,
        	httpMethod : "POST",
            postData : tosend,
            contentType : "application/x-www-form-urlencoded",
		    onSuccess : function(data) {
				
			},
			onFail : function(data){
				alert("An error has occured");
			}
		});
		
		fillInFields();
		
	}
	
	
	
	doInit();
   
};

var sakai = sakai || {};
sakai._inlineedits = [];
sakai.inlineEdits = function(container, options){
	var defaultViewText = "Click here to edit";
	if (options.defaultViewText){
		defaultViewText = options.defaultViewText;
	}
	var rootel = $(container);
	var els = $(".inlineEditableAlt", rootel);
	for (var i = 0; i < els.length; i++){
		var el = $(els[i]);
		var dropdown = $(".dropdown", el);
		if (dropdown.length > 0){
			
			if (dropdown.html() == ""){
				dropdown.html(defaultViewText);
			}
			
			var tochangeTo = $(".editContainer",el);
			var changedel = $(".options", tochangeTo);
			
			dropdown.bind("mouseenter", function(ev){
				$(ev.currentTarget).addClass("inlineEdit-invitation");
			});
			dropdown.bind("mouseleave", function(ev){
				$(ev.currentTarget).removeClass("inlineEdit-invitation");
			});
			dropdown.bind("click", function(ev){
				var parent = $(ev.currentTarget).parent();
				var dropdown = $(".dropdown",parent);
				var tochangeTo = $(".editContainer", parent);
				var changedel = $(".options", tochangeTo);
				
				var value = dropdown.text();
				changedel.attr("value",value);
				
				if (dropdown.css("display") != "none"){
					dropdown.hide();
					tochangeTo.show();
					changedel.focus();
					changedel.click();
				}		
			});
			changedel.bind("blur", function(ev){
				var parent = $(ev.currentTarget).parent().parent();
				var dropdown = $(".dropdown",parent);
				var tochangeTo = $(".editContainer", parent);
				var changedel = $(".options", tochangeTo);
				
				var index = changedel[0].selectedIndex;
				var newvalue = changedel[0].options[index].text;
				var orig = newvalue;
				if (newvalue == ""){
					newvalue = defaultViewText;
				}
				dropdown.html(newvalue);
				
				if (dropdown.css("display") == "none"){
					tochangeTo.hide();
					dropdown.show();
				}
				
				var ev = {};
				ev.value = orig;
				
				if (options.finishedEditing){
					options.finishedEditing(ev , dropdown[0]);
				}
				
			});
			
		}
	}
}

sdata.widgets.WidgetLoader.informOnLoad("profile");