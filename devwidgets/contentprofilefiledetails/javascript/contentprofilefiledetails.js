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

/*global $, Config, fluid, window */

var sakai = sakai || {};

sakai.contentprofilefiledetails = function(tuid, showSettings){


    ///////////////
    // Variables //
    ///////////////

    // path variables
    var contentPath = "";

    // Containers
    var contentProfileFileDetailsContainer = "#content_profile_file_details_container";

    // Buttons
    var contentProfileFileDetailsActionDownload= "#content_profile_file_details_action_download";

    var convertToHumanReadableFileSize = function(filesize){
        // Divide the length into its largest unit
        var units = [[1024 * 1024 * 1024, 'GB'], [1024 * 1024, 'MB'], [1024, 'KB'], [1, 'bytes']];
        var lengthunits;
        for (var i = 0, j=units.length; i < j; i++) {

            var unitsize = units[i][0];
            var unittext = units[i][1];

            if (filesize >= unitsize) {
                filesize = filesize / unitsize;
                // 1 decimal place
                filesize = Math.ceil(filesize * 10) / 10;
                lengthunits = unittext;
                break;
            }
        }
        // Return the human readable filesize
        return filesize + " " + lengthunits;
    };

    /**
     * Add binding to the downlaod button
     */
    var addBindingDownload = function(){

        // Reinitialise the jQuery selector
        $entity_action_download = $($entity_action_download.selector);

        // Open the content in a new window
        $entity_action_download.bind("click", function(){
            window.open(entityconfig.data.profile.path);
        });

    };

    var addBinding = function(){
        // Bind the download button
        $(contentProfileFileDetailsActionDownload).bind("click", function(){
            window.open(contentPath);
        });
    };

    var loadContentProfile = function(){
        // Check whether there is actually a content path in the URL
        if (contentPath) {
            $.ajax({
                url: contentPath + ".2.json",
                success: function(data){
                    // Construct the JSON object
                    var json = {
                        data: data,
                        mode: "content",
                        url: contentPath,
                        filesize: convertToHumanReadableFileSize(data["jcr:content"][":jcr:data"])
                    };

                    // Set the global JSON object (we also need this in other functions + don't want to modify this)
                    globalJSON = $.extend(true, {}, json);

                    // And render the basic information
                    var renderedTemplate = $.TemplateRenderer("content_profile_file_details_template", json);
                    var renderedDiv = $(document.createElement("div"));
                    renderedDiv.html(renderedTemplate)
                    $("#content_profile_file_details_container").html(renderedDiv);
                    // Show the file details container
                    $("#content_profile_file_details_container").show();

                    // Add binding
                    addBinding();
                },
                error: function(xhr, textStatus, thrownError){
                    
                }
            });
        }
    };

    var doInit = function(){
        // Bind an event to window.onhashchange that, when the history state changes,
        // loads all the information for the current resource
        $(window).bind('hashchange', function(e){
            contentPath = e.getState("content_path") || "";

            loadContentProfile();
        });

        // Since the event is only triggered when the hash changes, we need to trigger
        // the event now, to handle the hash the page may have loaded with.
        $(window).trigger('hashchange');
    };

    doInit();
};
sakai.api.Widgets.widgetLoader.informOnLoad("contentprofilefiledetails");