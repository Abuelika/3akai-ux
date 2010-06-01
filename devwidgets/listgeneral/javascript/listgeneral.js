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

/**
 * General Lister widget
 * This is a general widget which aims to display an arbitriary number of
 * spaces, sites or content, loading dynamically if the list is very long.
 */

/*global $, Config, sdata */

// Namespaces
var sakai = sakai || {};
sakai.api.UI.listGeneral = {};

/**
 * Initialize the listgeneralwidget
 * This is the widget loader's default callback, executing when the widget
 * is loaded on a page
 * @param tuid {String} Unique id of the widget
 * @param showSettings {Boolean} Show the settings of the widget or not
 */
sakai.listgeneral = function(tuid, showSettings){

    // Config defaults
    var default_config = {
        "items": 25,
        "selectable": false,
        "sortOn": "lastName",
        "sortOrder": "ascending"
    };

    // Create a config object for this instance
    sakai.config.widgets.listgeneral = sakai.config.widgets.listgeneral || {};
    sakai.config.widgets.listgeneral[tuid] = default_config;

    // Create a data object for this instance
    sakai.data.listgeneral = sakai.data.listgeneral || {};
    sakai.data.listgeneral[tuid] = {};
    sakai.data.listgeneral[tuid].selected = 0;

    // Reset to defaults
    sakai.api.UI.listGeneral.reset(tuid);

    // Send out an event that says the widget is ready to
    // accept a search query to process and display. This event can be picked up
    // in a page JS code
    $(window).trigger("listgeneral_ready", [tuid]);
};


/**
 * Reset
 * Resets the general lister to a default state
 * @param tuid {String} Unique id of the widget
 * @returns void
 */
sakai.api.UI.listGeneral.reset = function(tuid) {

    sakai.data.listgeneral[tuid].selected = {};

};

/**
 * Render
 * Renders the general lister with a specified set of data. The function uses
 * a search query initially, then does the paginating and subsequent requests
 * for data automatically
 * @param tuid {String} Unique id of the widget
 * @param iSearchQuery {Array} A Sakai search queries
 * @param iConfig {Object} Optional config overrides
 * @returns void
 */
sakai.api.UI.listGeneral.render = function(tuid, iSearchQuery, iConfig) {

    // Merge user defined config with defaults
    for (var element in iConfig) {
        if (iConfig.hasOwnProperty(element)) {
            sakai.config.widgets.listgeneral[tuid][element] = iConfig[element];
        }
    }

    // Parse search query
    var searchQuery = [];
    for (var i = 0, il = iSearchQuery.length; i < il; i++) {

        var searchQueryObject = {};
        var main_parts = iSearchQuery[i].split("?");
        searchQueryObject.url = main_parts[0];
        var arguments = main_parts[1].split("&");
        for (var j = 0, jl = arguments.length; j < jl; j++) {
            var kv_pair = arguments[j].split("=");
            searchQueryObject[kv_pair[0]] = kv_pair[1];
        }

        // Alter search query according to config
        searchQueryObject.items = sakai.config.widgets.listgeneral[tuid].items;

        // Add hash to search query in case it's not there to prevent caching
        if (!searchQueryObject["_"]) {
            searchQueryObject["_"] = (Math.random() * 100000000000000000);
        }

        // Push search query into the array of queries
        searchQuery.push(searchQueryObject);

    }
    // Set up sorting according to the type of list
    $(".listgeneral_sortview").prepend($(".listgeneral_sorttemplate_" + sakai.config.widgets.listgeneral[tuid].type).html());

    // Deal with non logged in users - remove favourite select options


    // Render the first page of results
    sakai.api.UI.listGeneral.addPage(tuid, 0, searchQuery);

};

/**
 * addPage
 * Adds another page of search result to the People lister's result list
 * @param tuid {String} The instance ID of a widget
 * @pageNumber {Int} The page we want to load
 * @searchQuery {Array} An array containing objects of the search query elements
 * @returns void
 */
sakai.api.UI.listGeneral.addPage = function(tuid, pageNumber, searchQuery) {

    // Store number of requests we need to process to make sure we process all at the end of the ajax requests
    sakai.data.listgeneral[tuid].numOfQueriesToProcess = searchQuery.length;

    // Create storage for aggregate results
    sakai.data.listgeneral[tuid].aggregateResults = [];

    // Create new container for the bit we load. This is then appended to the
    // main container
    for (var i=0, il = searchQuery.length; i < il; i++) {

        // Add relevant config elements to the search query
        searchQuery[i].page = pageNumber;

        // Get sorting from the sorting dropdown
        if (typeof $(".listgeneral_sortview .listgeneral_sortview_sort:selected").attr("value") !== "undefined") {
            // If the sorting select box is already there
            searchQuery[i].sortOn = $(".listgeneral_sortview .listgeneral_sortview_sort:selected").attr("value");
            searchQuery[i].sortOrder = $(".listgeneral_sortview .listgeneral_sortview_sort:selected").attr("data-sortorder");
        } else {
            // If no sort selection is available, get the default from the template
            searchQuery[i].sortOn = $(".listgeneral_sorttemplate_" + sakai.config.widgets.listgeneral[tuid].type + "[default='true']").attr("value");
            searchQuery[i].sortOrder = $(".listgeneral_sorttemplate_" + sakai.config.widgets.listgeneral[tuid].type + "[default='true']").attr("data-sortorder");
        }


        // Construct search query
        var sq = searchQuery[i].url + "?";
        for (var e in searchQuery[i]) {
            if (searchQuery[i].hasOwnProperty(e) && e !== "url") {
                sq += e + "=" + searchQuery[i][e] + "&";
            }
        }
        sq = sq.substring(0, sq.length-1);


        // Fire search requests
        $.ajax({
            url: sq,
            type: "GET",
            success: function(rawData) {

                // Keep track of queries which needs to be processed
                sakai.data.listgeneral[tuid].numOfQueriesToProcess--;

                for (var j = 0, jl = rawData.results.length; j < jl; j++) {

                    // Add type property to each result
                    rawData.results[j].listgeneralType = sakai.config.widgets.listgeneral[tuid].type;

                    // Add result to the collection of aggregate results
                    sakai.data.listgeneral[tuid].aggregateResults.push(rawData.results[j]);
                }

                // If this is the last search query to process
                if (sakai.data.listgeneral[tuid].numOfQueriesToProcess === 0) {
                    sakai.api.UI.listGeneral.sortAndDsiplay(tuid, pageNumber);
                }

            },
            error: function(xhr, status, thrown) {

                // Keep track of queries which needs to be processed
                sakai.data.listgeneral[tuid].numOfQueriesToProcess--;

                if (sakai.data.listgeneral[tuid].numOfQueriesToProcess === 0) {
                    sakai.api.UI.listGeneral.sortAndDsiplay(tuid, pageNumber);
                }

                // Log error in console
                fluid.log("listgeneral.js: Error in processing a search request!");

            }
        });

        // Display empty new container with loading anim
        //$pl_container.append($pl_pageContainer);

    }

};



sakai.api.UI.listGeneral.sortAndDsiplay = function(tuid, pageNumber) {

    // Sort aggregate results


    // Display aggregate search results via the template
    console.dir(sakai.data.listgeneral[tuid].aggregateResults);

}



sdata.widgets.WidgetLoader.informOnLoad("listgeneral");
