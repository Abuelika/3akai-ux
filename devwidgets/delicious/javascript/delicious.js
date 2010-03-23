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

/*global $, sdata, Config*/

var sakai = sakai || {};

/**
 * Initialize the Delicious widget
 * @param {String} tuid Unique id of the widget
 * @param {String} placement The place of the widget
 * @param {Boolean} showSettings Show the settings of the widget or not
 */
sakai.delicious = function(tuid, placement, showSettings){


    /////////////////////////////
    // Configuration variables //
    /////////////////////////////

    var rootel = $("#" + tuid);

    // ERRORS
    var $deliciousErrorNotConnected = $("#delicious_error_notconnected", rootel);

    // CONTENT
    var $deliciousContainer = $("#delicious_container", rootel);
    var $deliciousContainerMain = $("#delicious_container_main", rootel);
    var $deliciousContainerSettings = $("#delicious_container_settings", rootel);

    // TEMPLATES
    var $deliciousTemplateMain = "delicious_template_main";
    var $deliciousTemplateSettings = "delicious_template_settings";

    // BUTTONS / HYPERLINKS
    var $deliciousErrorSettings = $("#delicious_error_settings", rootel);
    var $deliciousSettingsButtonSave = $("#delicious_settings_button_save", rootel);


    ////////////////////////
    // Settings functions //
    ////////////////////////

    /**
     * Get the stored widget settings
     */
    var getDeliciousSettings = function(){
    };

    /**
     * Save the widget settings
     */
    var saveDeliciousSettings = function(){
        // Concatinate the URL where the settings should be saved
        //var saveUrl = Config.URL.SDATA_FETCH_BASIC_URL.replace(/__PLACEMENT__/, placement).replace(/__TUID__/, tuid);
        var saveUrl = "/delicious/" + sdata.me.user.userid + "/delicious";

        // Object to be saved at JCR
        var delicious = {
            "username": document.getElementById('delicious_settings_input_username').value,
            "password": document.getElementById('delicious_settings_input_password').value
        };

        // Create JSON data to send
        var jsonDeliciousSettings = $.toJSON(delicious);

        // Sava the JSON data to the widgets JCR
        sdata.widgets.WidgetPreference.save(saveUrl, "delicious_settings", jsonDeliciousSettings, savedDeliciousSettings);
    };

    /**
     * Callback function. Once the settings have been saved, hide the settings page and show the main view
     */
    var savedDeliciousSettings = function(success){
        if (success) {
            // Preference saved
            sdata.container.informFinish(tuid);
        } else {
            // Error saving preference
        }
    };


    ////////////////////
    // Initialisation //
    ////////////////////

    /**
     * Switch between main view and settings
     */
    var doInit = function(){
        if (showSettings) {
            // Get settings
            getDeliciousSettings();

            // Show settings
            $deliciousContainerMain.hide();
            $deliciousContainerSettings.show();
        } else {
            // Show main view
            $deliciousContainerMain.show();
            $deliciousContainerSettings.hide();
        }

        // Buttons
        //$deliciousErrorSettings.live('click', showContainerSettings);
        $deliciousSettingsButtonSave.live('click', saveDeliciousSettings);
        $deliciousContainerMain.html($.Template.render($deliciousTemplateMain));
        $deliciousContainerSettings.html($.Template.render($deliciousTemplateSettings));
    };

    doInit();
};

sdata.widgets.WidgetLoader.informOnLoad("delicious");