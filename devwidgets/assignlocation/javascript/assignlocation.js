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

/*global $ */

// Namespaces
var sakai = sakai || {};

/**
 * @name sakai.assignlocation
 *
 * @description
 * Public functions for the content share widget
 */
sakai.assignlocation = {};

/**
 * @name sakai.assignlocation
 *
 * @class assignlocation
 *
 * @description
 * Assign location widget<br />
 * This widget is used to assign a location to a piece of content
 * The content can then be found under that location through the directory page
 * or by searching on the tags of the location
 *
 * @version 0.0.1
 * @param {String} tuid Unique id of the widget
 * @param {Boolean} showSettings Show the settings of the widget or not
 */
sakai.assignlocation = function(tuid, showSettings) {

};

sakai.api.Widgets.widgetLoader.informOnLoad("assignlocation");