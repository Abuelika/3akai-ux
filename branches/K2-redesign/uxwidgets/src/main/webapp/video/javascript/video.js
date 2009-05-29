/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/*global $, Config, sdata, Querystring, SWFID, swfobject */


var sakai = sakai || {};

/**
 * Initialize the video widget
 * @param {String} tuid Unique id of the widget
 * @param {String} placement Widget place
 * @param {Boolean} showSettings Show the settings of the widget or not
 */
sakai.video = function(tuid, placement, showSettings) {


    /////////////////////////////
    // Configuration variables //
    /////////////////////////////
	
    var json = false; // Variable used to recieve information by json
    var me = sdata.me; // Contains information about the current user
    var rootel = $("#" + tuid); // Get the main div used by the widget
   
    // Main-ids
    var videoID = "#video";
    var videoName = "video";

    // Containers
    var videoSettings = videoID + "_settings";
    var videoOutput = videoID + "_maincontainer";
    var videoShowMain = videoID + "_ShowMain";
    var videoTempShowMain = videoID + "_tempYoutubeVideoMain";
    var choosePlayerContainer = videoID + "_choosePlayerContainer";
    var videoPreviewContainer = videoID + "_previewContainer";
    var videoShowPreview = videoID + "_ShowPreview";
    var videoFillInfo = videoID + "_fillInfo";

    // Textboxes
    var videoUrl = videoID + "_txtURL";
    var videoTitle = videoID + "_txtTitle";
    var videoSource = videoID + "_txtSource";

    // Radiobuttons
    var videoSourceRbt = videoName + "_source";
    var videoSourceRbtTxt = videoName + "_txt";
    var videoSourceRbtGuess = videoName + "_guess";

    var videoChoosePlayer = videoName + "_choosePlayer";
    var videoChoosePlayerYoutube = videoName + "_YoutubePlayer";
    var videoChoosePlayerSakai = videoName + "_SakaiPlayer";

    // Checkboxes
    var videoTrackViews = videoID + "_chktrackViews";

    // Template
    var videoTemplate = videoName + "_MainTemplate";

    // Files
    var videoPlayer = "/devwidgets/video/videoplayer.swf";
    var expressInstall = "/devwidgets/video/swf/expressInstall.swf";

    // Buttons
    var videoPlaceholder = videoID + "_insertPlaceHolder";
    var videoSubmit = videoID + "_btnInsertWidget";
    var videoPreview = videoID + "_btnPreview";
    var videoBack = videoID + "_btnBack";


    ////////////////////////
    // Utility  functions //
    ////////////////////////
	
    /**
	 * This function will clone any JSON-object
	 * @param {Object} the cloned JSON-object
	 */
    var cloneObject = function(object) {
        var clonedObject = {};
        $.extend(true,clonedObject, object);
        return clonedObject;
    };

    //////////////////////
    // Shared functions //
    //////////////////////
	
    /**
	 * Shows the video in the sakaiplayer
	 * @param {String} video: the url to the video
	 * @param {String} container: the container where the video should be placed (settings or output)
	 */
    var ShowVideoSakaiPlayer = function(video, container) {
        try {
			// Checks if the video is a youtube-video 
			// This is needed as a parameter for the sakai-player
            var isTouTube = (video.URL.search("www.youtube.com") !== -1);
			// Renders the video-template (title, source and conatiner to place flash-player in)
            $(container, rootel).html($.Template.render(videoTemplate, video));
            // some more parameters needed for the sakai-videoplayer
			var flashvars = {
                videoURL: video.URL,
                isYoutubeUrl: isTouTube
            };
            var params = {
                menu: "false",
                allowScriptAccess: "always",
                scale: "noscale",
                allowFullScreen: "true"
            };
            var attributes = {};
            swfobject.embedSWF(videoPlayer, videoTempShowMain.replace("#", ""), 320, 305, "9.0.0", expressInstall, flashvars, params, attributes);

            //init the youTubeLoader javascript methods
            if (isTouTube) {
				// By putting this variable to the container of the videoPlayer, the streamingprocess for the youtube-video is started
				// This uses the youtubeloader.js file and is the main problem for showing multiple youtubevideos in the sakaiplayer on 1 page
                SWFID = videoTempShowMain.replace("#", "");
            }
        } catch(err) {
            $(videoTempShowMain, rootel).text("No valid video found.");
        }
    };
	
	/**
	 * Shows the video (YouTube) in the YouTubePlayer
	 * @param {String} video: the url to the video
	 * @param {String} container: the container where the video should be placed (settings or output)
	 */
    var ShowVideoYoutubePlayer = function(video, container) {
        try {
			// Clone the video-object to make some changes for the template
           	var videoTemp = cloneObject(video);
            // a youtube url should look like this:
            // http://www.youtube.com/watch?v=AOWbGfPU5uQ&feature=fvst, you need to get the id (v=)
            // make an object of a the queryString
            var qs = new Querystring(video.URL.split("?")[1]);
            // get the id (default false)
            var id = qs.get("v", false);
            // if the id is false, give a warning the the user
            if (!id) {
                videoTemp.html = ("No valid video found");
            } else {
                videoTemp.html = ('<object width="320" height="305"><param name="movie" value="http://www.youtube.com/v/' + id + '&hl=en&fs=1"></param><param name="allowFullScreen" value="true"></param><embed src="http://www.youtube.com/v/' + id + '&hl=en&fs=1" type="application/x-shockwave-flash" allowfullscreen="true" width="320" height="305"></embed></object>');
            }
			// render the video
		 	$(container, rootel).html($.Template.render(videoTemplate, videoTemp));
        } catch(err) {
            $(videoTempShowMain, rootel).text("No valid video found.");
        }
    };

	/**
	 * Shows a video
	 * @param {String} video: url to the video
	 * @param {String} container: the container where the video should be placed (settings or output)
	 * @param {Boolean} isSakaiPlayer: should the video be displayed in a sakai-player or not
	 */
    var showVideo = function(video, container, isSakaiPlayer) {
        if (isSakaiPlayer) {
            ShowVideoSakaiPlayer(video, container);
        }
        else {
            ShowVideoYoutubePlayer(video, container);
        }
    };


    ////////////////////////
    // Settings functions //
    ////////////////////////
    
	/**
	 * Shows the settings screen
	 * @param {String} response
	 * @param {Boolean} exists
	 */
    var showSettingsScreen = function(response, exists) {
        if (exists) {
			// Fill in the info 
            json = $.evalJSON(response);
            $(videoTitle, rootel).val(json.title);
            $(videoUrl, rootel).val(json.URL);
            $("input[name=" + videoSourceRbt + "][value=" + json.selectedvalue + "]", rootel).attr("checked", true);
            $(videoTrackViews, rootel).attr("checked", json.checkviews);
            if (json.selectedvalue === videoSourceRbtTxt) {
                $(videoSource, rootel).val(json.source);
            }
        }
        $(videoOutput, rootel).hide();
        $(videoSettings, rootel).show();
    };

    /**
	 * returns a Json-object of the video-settings
	 */
    var getVideoJson = function() {
        var title = $(videoTitle, rootel).val();
        var selectedValue = $("input[name=" + videoSourceRbt + "]:checked", rootel).val();
        var URL = $(videoUrl, rootel).val();
        var source = "";

		// If the source is checked on guess, then we need to show a proper source
        if (selectedValue === videoSourceRbtGuess) {
            source = URL.replace("http://www.", "");
            source = source.substring(0, source.indexOf("/"));
        }
		// If the source is put to txt, then the user filled in a source himself
        else if (selectedValue === videoSourceRbtTxt) {
            source = $(videoSource, rootel).val();
        }

        var video = {
            "uid": me.preferences.uuid,
            "title": title,
            "source": source,
            "URL": URL,
            "selectedvalue": selectedValue,
            "checkviews": $(videoTrackViews, rootel).attr('checked')
        }; 
		// Fill in the JSON post object	
        video.isYoutube = (video.URL.search("www.youtube.com") !== -1);
        video.isSakaiVideoPlayer = ($("input[name=" + videoChoosePlayer + "]:checked", rootel).val() === videoChoosePlayerSakai);

		// Show the choose-player on the preview screen
		// Because we can't show muliple youtube-videos in the sakai-player on the same page
		// we give the user the possibility to choose between the YouTube-player or the Sakai-player 
		// if the url is a youtube url
        if (video.isYoutube) {
            $(choosePlayerContainer, rootel).show();
        }
        else {
            $(choosePlayerContainer, rootel).hide();
        }
        return video;
    };

    /**
	 * add a video
	 * @param {Object} video
	 */
    var addVideo = function(video) {
        var tostring = $.toJSON(video);
	 	var saveUrl = Config.URL.SDATA_FETCH_BASIC_URL.replace(/__PLACEMENT__/, placement).replace(/__TUID__/, tuid);
        sdata.widgets.WidgetPreference.save(saveUrl, "video", tostring, sdata.container.informFinish(tuid));
    };


    ////////////////////
    // Main functions //
    ////////////////////
   
    /**
	 * Shows the video
	 * @param {string} response
	 * @param {Boolean} exists
	 */
    var showVideos = function(response, exists) {
        if (exists) {
            try {
                var video = $.evalJSON(response);
				// Show the video in the right player
                showVideo(video, videoShowMain, video.isSakaiVideoPlayer);
            }
            catch(err) {
                alert("failed to retrieve video.");
            }
        }

    };


    ////////////////////
    // Event Handlers //
    ////////////////////
	
    /** Bind the insert placeholder button */
    $(videoPlaceholder, rootel).bind("click",
    function(e, ui) {
		// When adding a placeholder we just add an empty video-object
        var video = {
            "uid": me.preferences.uuid,
            "title": "",
            "source": "",
            "URL": "",
            "sourceChose": "",
            "checkviews": "",
            "isSakaiVideoPlayer": true
        }; // Fill in the JSON post object	
        addVideo(video);
    });
    /** Bind the inset widget button */
    $(videoSubmit, rootel).bind("click",
    function(e, ui) {
        addVideo(getVideoJson());
    });
    /** Bind the Preview button */
    $(videoPreview, rootel).bind("click",
    function(e, ui) {
        if ($(videoUrl, rootel).val() !== "") {
			// Show and hide screens and buttons
            $(videoPreview, rootel).hide();
            $(videoSubmit, rootel).show();
            $(videoBack, rootel).show();
            $(videoShowPreview, rootel).show();
            $(videoFillInfo, rootel).hide();
            $("input[name=" + videoChoosePlayer + "][value=" + videoChoosePlayerSakai + "]", rootel).attr("checked", true);
            var isYouTube = ($(videoUrl, rootel).val().search("www.youtube.com") !== -1);
            // If the url is a YouTube-video the player should be the YouTubePlayer by default
			if (isYouTube) {
                $("input[name=" + videoChoosePlayer + "][value=" + videoChoosePlayerYoutube + "]", rootel).attr("checked", true);
            }
            showVideo(getVideoJson(), videoPreviewContainer, !isYouTube);
        }
        else {
            alert("Please fill in a URL.");
        }

    });
    /** Bind the back button */
    $(videoBack, rootel).bind("click",
    function(e, ui) {
		// Show and hide screens and buttons
        $(videoPreview, rootel).show();
        $(videoSubmit, rootel).hide();
        $(videoBack, rootel).hide();
        $(videoShowPreview, rootel).hide();
        $(videoFillInfo, rootel).show();
    });
    /** Bind the source radiobuttons */
    $("input[name=" + videoSourceRbt + "][value=" + videoSourceRbtTxt + "]", rootel).bind("click",
    function(e, ui) {
		// If the txt-radiobutton is selected you should give focus to the textbox
        $(videoSource, rootel).focus();
    });
    /** Bind the choose videoplayer radiobuttons */
    $("input[name=" + videoChoosePlayer + "]", rootel).bind("change",
    function(e, ui) {
        var selectedValue = $("input[name=" + videoChoosePlayer + "]:checked", rootel).val();
        if (selectedValue === videoChoosePlayerSakai) {
            showVideo(getVideoJson(), videoPreviewContainer, true);
        }
        else {
            showVideo(getVideoJson(), videoPreviewContainer, false);
        }

    });


    /////////////////////////////
    // Initialisation function //
    /////////////////////////////
	
    /**
	 * Switch between main and settings page
	 * @param {Boolean} showSettings Show the settings of the widget or not
	 */
	var url = Config.URL.SDATA_FETCH_URL.replace(/__PLACEMENT__/, placement).replace(/__TUID__/, tuid).replace(/__NAME__/, "video");
    if (showSettings) {
        /** Check if it is an edit or a new video */
        $.ajax({
            url: url,
            cache: false,
            success: function(data) {
                showSettingsScreen(data, true);
            },
            error: function(status) {
                showSettingsScreen(status, false);
            }
        });

    } else {
        $(videoSettings, rootel).hide();
        $(videoOutput, rootel).show();

        $.ajax({
            url: url,
			cache: false,
            success: function(data) {
                showVideos(data, true);
            },
            error: function(status) {
                showVideos(status, false);
            }
        });
    }

};
sdata.widgets.WidgetLoader.informOnLoad("video");