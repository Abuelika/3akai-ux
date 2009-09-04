var Widgets = {
	connections : [
		{
			id : 1,
			dir1 : "is my classmate",
			dir2 : "is my classmate"
		},
		{
			id: 2,
			dir1 : "is my supervisor",
			dir2 : "is being supervised by me"
		},
		{
			id: 3,
			dir1 : "is being supervised by me",
			dir2 : "is my supervisor"
		},
		{
			id: 4,
			dir1 : "is my lecturer",
			dir2 : "is my student"
		},
		{
			id: 5,
			dir1 : "is my student",
			dir2 : "is my lecturer"
		},
		{
			id: 6,
			dir1 : "is my colleague",
			dir2 : "is my colleague"
		},
		{
			id: 7,
			dir1 : "is my college mate",
			dir2 : "is my college mate"
		},
		{
			id: 8,
			dir1 : "shares an interest with me",
			dir2 : "shares an interest with me"
		},
		{
			id: 9,
			dir1 : "is something else",
			dir2 : "is something else"
		}
	],
	groups:[
		"Administrators",
		"Lecturers & Supervisors",
		"Researchers",
		"Students"],
	layouts : {
		onecolumn :
		{
			name:"One column",
			widths:[100]
		},
		dev : 
		{
			name:"Dev Layout",
			widths:[50,50]
		},
		threecolumn :
		{
			name:"Three equal columns",
			widths:[33,33,33]
		},
		fourcolumn :
		{
			name:"Four equal columns",
			widths:[25,25,25,25]
		},
		fivecolumn :
		{
			name:"Five equal columns",
			widths:[20,20,20,20,20]
		}
	},
	widgets: {
		changepic :
		{
			description:"",
			iframe:0,
			url:"/devwidgets/changepic/changepic.html",
			name:"changepic",
			id:"changepic",
			personalportal:0,
			siteportal:0,
			img:"/dev/img/sites.png"
		},
		sites :
		{
			description:"Listing of the sites I'm a member of\r\n",
			iframe:0,
			url:"/devwidgets/sites/sites.html",
			name:"My Courses & Sites",
			id:"sites",
			personalportal:1,
			siteportal:0,
			img:"/dev/img/sites.png"
		},
		myprofile :
		{
			description:"My Personal Profile\r\n",
			iframe:0,
			url:"/devwidgets/myprofile/myprofile.html",
			name:"My Profile",
			id:"myprofile",
			personalportal:1,
			siteportal:0,
			img:"/dev/img/myprofile.png"
		},
		addtocontacts :
		{
			description:"Add a contact\r\n",
			iframe:0,
			url:"/devwidgets/addtocontacts/addtocontacts.html",
			name:"Add a contact",
			id:"addtocontacts",
			personalportal:0,
			siteportal:0,
			img:"/dev/img/sites.png"
		},
		sendmessage :
		{
			description:"Send a message\r\n",
			iframe:0,
			url:"/devwidgets/sendmessage/sendmessage.html",
			name:"Send a message",
			id:"sendmessage",
			personalportal:0,
			siteportal:0,
			img:"/dev/img/sites.png"
		},
		discussion :
		{
			description:"Discussion widget\r\n",
			iframe:0,
			url:"/devwidgets/discussion/discussion.html",
			name:"Discussion",
			id:"discussion",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:1,
			img:"/devwidgets/discussion/images/discussion.png"
		},
		poll :
		{
			description:"Poll widget\r\n",
			iframe:0,
			url:"/devwidgets/poll/poll.html",
			name:"Poll",
			id:"poll",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:1,
			img:"/devwidgets/poll/images/poll.png"
		},
		quiz :
		{
			description:"Quiz widget\r\n",
			iframe:0,
			url:"/devwidgets/quiz/quiz.html",
			name:"Quiz",
			id:"quiz",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:1,
			img:"/devwidgets/quiz/images/quiz.png"
		},
		wookiechat :
		{
			description:"wookiechat\r\n",
			iframe:0,
			url:"/devwidgets/wookiechat/wookiechat.html",
			name:"Chat",
			id:"wookiechat",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:0,
			img:"/devwidgets/wookiechat/images/wookiechat.png"
		},
		wookieforum :
		{
			description:"wookieforum\r\n",
			iframe:0,
			url:"/devwidgets/wookieforum/wookieforum.html",
			name:"Wookie Forum",
			id:"wookieforum",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:0,
			img:"/devwidgets/wookieforum/images/wookieforum.png"
		},
		helloworld :
		{
			description:"Sakai Hackathon Example\r\n",
			iframe:0,
			url:"/devwidgets/helloworld/helloworld.html",
			name:"Hello World",
			id:"helloworld",
			personalportal:0,
			siteportal:0,
			hasSettings: 1,
			img:"/dev/img/myprofile.png"
		},
		twitter :
		{
			description:"Twitter Widget\r\n",
			iframe:0,
			url:"/devwidgets/twitter/twitter.html",
			name:"Twitter",
			id:"twitter",
			personalportal:1,
			siteportal:0,
			hasSettings: 1,
			img:"/dev/img/myprofile.png"
		},
		helloworldwow :
		{
			description:"GWT Widget Example\r\n",
			iframe:0,
			url:"/devwidgets/helloworldwow/war/Helloworldwow.html",
			name:"Hello World GWT",
			id:"helloworldwow",
			personalportal:0,
			siteportal:0,
			hasSettings: 1,
			img:"/dev/img/myprofile.png",
			gwt: 1
		},
		createsite :
		{
			description:"Create site\r\n",
			iframe:0,
			url:"/devwidgets/createsite/createsite.html",
			name:"Create Site",
			id:"createsite",
			personalportal:0,
			siteportal:0,
			img:"/dev/img/sites.png"
		},
		sendmessage :
		{
			description:"Send a message\r\n",
			iframe:0,
			url:"/devwidgets/sendmessage/sendmessage.html",
			name:"Send a message",
			id:"sendmessage",
			personalportal:0,
			siteportal:0,
			img:"/dev/img/sites.png"
		},
		myfriends :
		{
			description:"A list of my connections\r\n",
			iframe:0,
			url:"/devwidgets/myfriends/myfriends.html",
			name:"My Contacts",
			id:"myfriends",
			personalportal:1,
			siteportal:0,
			img:"/dev/img/myprofile.png",
			multipleinstance: false
		},
		pagemanagement :
		{
			description:"pagemanagement",
			iframe:0,
			url:"/devwidgets/pagemanagement/pagemanagement.html",
			name:"pagemanagement",
			id:"pagemanagement",
			personalportal:0,
			siteportal:0
		},
		mypreferences :
		{
			description:"mypreferences",
			iframe:0,
			url:"/devwidgets/mypreferences/mypreferences.html",
			name:"mypreferences",
			id:"mypreferences",
			personalportal:0,
			siteportal:0
		},
		myinbox :
		{
			description:"myinbox",
			iframe:0,
			url:"/devwidgets/myinbox/myinbox.html",
			name:"myinbox",
			id:"myinbox",
			personalportal:0,
			siteportal:0
		},
		sitemembers :
		{
			description:"Shows a list of all of the members of this site",
			iframe:0,
			url:"/devwidgets/sitemembers/sitemembers.html",
			name:"Site Members",
			id:"sitemembers",
			personalportal:0,
			siteportal:1,
			img:"/devwidgets/sitemembers/images/icon.png"
		},
		chat :
		{
			description:"chat",
			iframe:0,
			url:"/devwidgets/chat/chat.html",
			name:"chat",
			id:"chat",
			personalportal:0,
			siteportal:0
		},
		chat2 :
		{
			description:"chat2",
			iframe:0,
			url:"/devwidgets/chat2/chat.html",
			name:"chat2",
			id:"chat2",
			personalportal:0,
			siteportal:0
		},
		chat3 :
		{
			description:"chat3",
			iframe:0,
			url:"/devwidgets/chat3/chat.html",
			name:"chat3",
			id:"chat3",
			personalportal:0,
			siteportal:0
		},
		filemanager :
		{
			description:"filemanager",
			iframe:0,
			url:"/devwidgets/filemanager/filemanager.html",
			name:"filemanager",
			id:"filemanager",
			personalportal:0,
			siteportal:0
		},
		siterecentactivity :
		{
			description:"Site Recent Activity",
			iframe:0,
			url:"/devwidgets/siterecentactivity/siterecentactivity.html",
			name:"Recent Activity",
			id:"siterecentactivity",
			personalportal:0,
			siteportal:0,
			ca:1,
			img:"/devwidgets/siterecentactivity/images/icon.png"
		},
		navigation :
		{
			description:"Navigation Widgets",
			iframe:0,
			url:"/devwidgets/navigation/navigation.html",
			name:"Navigation",
			id:"navigation",
			personalportal:0,
			siteportal:0,
			ca:1,
			img:"/devwidgets/navigation/images/icon.png"
		},
		youtubevideo :
		{
			description:"YouTube Video",
			iframe:0,
			url:"/devwidgets/youtubevideo/youtubevideo.html",
			name:"YouTube Video",
			id:"youtubevideo",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:0,
			img:"/devwidgets/youtubevideo/images/video.png"
		},
		tlrp :
		{
			description:"TLRP BERA Widget",
			iframe:0,
			url:"/devwidgets/tlrp/tlrp.html",
			name:"TLRP BERA",
			id:"tlrp",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:1,
			img:"/devwidgets/tlrp/images/tlrp.png"
		},
		rss :
		{
			description:"RSS Feed Reader",
			iframe:0,
			url:"/devwidgets/rss/rss.html",
			name:"RSS Feed",
			id:"rss",
			personalportal:1,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:1,
			img:"/devwidgets/rss/images/rss.png",
			hasSettings: 1
		},
		sitemembers :
		{
			description:"List of site members",
			iframe:0,
			url:"/devwidgets/sitemembers/sitemembers.html",
			name:"Site members",
			id:"sitemembers",
			personalportal:1,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:1,
			img:"/devwidgets/sitemembers/images/sitemembers.png",
			hasSettings: 1
		},
		video :
		{
			description:"Video",
			iframe:0,
			url:"/devwidgets/video/video.html",
			name:"Video",
			id:"video",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:1,
			showinsakaigoodies:0,
			img:"/devwidgets/video/images/video.png"
		},
		comments :
		{
			description:"Comments",
			iframe:0,
			url:"/devwidgets/comments/comments.html",
			name:"Comments",
			id:"comments",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:1,
			img:"/devwidgets/comments/images/comments.png"
		},
		remotecontent :
		{
			description:"Remote Content",
			iframe:0,
			url:"/devwidgets/remotecontent/remotecontent.html",
			name:"Remote Content",
			id:"remotecontent",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:1,
			img:"/devwidgets/remotecontent/images/remotecontent.png"
		},
		linktool :
		{
			description:"Link Tool",
			iframe:0,
			url:"/devwidgets/linktool/linktool.html",
			name:"Link Tool",
			id:"linktool",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:0,
			img:"/devwidgets/linktool/images/linktool.png"
		},
		tangler :
		{
			description:"Tangler Forum",
			iframe:0,
			url:"/devwidgets/tangler/tangler.html",
			name:"Tangler Forum",
			id:"tangler",
			personalportal:0,
			siteportal:0,
			ca:1,
			showinmedia:0,
			showinsakaigoodies:1,
			img:"/devwidgets/tangler/images/tangler.png"
		},
		Resources :
		{
			description:"Resources tool",
			iframe:"0",
			url:"/devwidgets/Resources/Resources.html",
			name:"Resources",
			id:"resources",
			personalportal:0,
			siteportal:0,
			history : {"init":"Resources.initHistory","nav":"Resources.browser.printResources",tag:"Resources.tagging.showTagViewReal"}
		}
	},
	orders:[
		{
			grouptype:"General",
			widgets: ["mycoursesandprojects","messageoftheday","recentactivity"],
			id:1,
			layout: "twocolumnspecial"
		},
		{
			grouptype:"Administrators",
			widgets: ["mycoursesandprojects","messageoftheday","quickannouncement"],
			id:1,
			layout: "twocolumn"
		},
		{
			grouptype:"Lecturers & Supervisors",
			widgets:["mycoursesandprojects","recentactivity"],
			id:2,
			layout: "twocolumnspecial"
		},
		{
			grouptype:"Researchers",
			widgets:["recentactivity","mycoursesandprojects","messageoftheday"],
			id:3,
			layout: "threecolumn"
		},
		{
			grouptype:"Students",
			widgets:["recentactivity","mycoursesandprojects","quickannouncement","messageoftheday","myrssfeed"],
			id:4,
			layout: "fourcolumn"
		}
	]
};