/*
 This file is generated and updated by Sencha Cmd. You can edit this file as
 needed for your application, but these edits will have to be merged by
 Sencha Cmd when it performs code generation tasks such as generating new
 models, controllers or views and when running "sencha app upgrade".

 Ideally changes to this file would be limited and most work would be done
 in other places (such as Controllers). If Sencha Cmd cannot merge your
 changes and its generated code, it will produce a "merge conflict" that you
 will need to resolve manually.
 */

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

/*

 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function () {



    // init sencha
    Ext.application({
      /* Sencha specific vars */
      name: 'Huhu',

      models: ['Contact', 'Chat', 'ContactSearchResult'],

      stores: ['Contacts', 'Chats', 'ContactSearchResults', 'PhoneContactResults', 'ChatInvite', 'ContactsVisible', 'ContactsInvisible'],

      controllers: ['Main', 'Settings', 'Logout', 'Login', 'Signup', 'Contacts', 'ContactSearch'],

      views: ['Main', 'Login', 'Signup'],

      requires: [
        'Ext.MessageBox',
        'Huhu.util.Chat',
        'Huhu.util.Config',
        'Huhu.util.DropBox',
        'Huhu.util.Image',
        'Huhu.util.Language',
        'Huhu.util.Overlay',
        'Huhu.util.User',
        'Ext.field.DatePicker',
        'Huhu.push.Main'
      ],

      icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
      },

      isIconPrecomposed: true,

      startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
      },

      /* Huhu specific vars */
      openchatpanels: null,
      activeNavigationView: null,

      launch: function () {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add({
            xclass: 'Huhu.view.Main'
        });


        // init ajax helper
        Ext.create('Huhu.util.Ajax');


        // are we logged in?
        Ext.Ajax.setAsync(false);
        Ext.Ajax.request({
          url: Huhu.util.Config.getApiUrl() + 'user/check-loggedin',
          success: function (response, opts) {
            var reader = Ext.create('Ext.data.reader.Json');
            var data = reader.getResponseData(response);

            if (data.success && !data.isLoggedIn) {
              Huhu.util.User.relogin();
            } else {
              Huhu.util.User.afterLogin(data.userid);
            }

          }
        });
        Ext.Ajax.setAsync(true);


        this.openchatpanels = new Ext.util.MixedCollection();


        // bind global events
        document.addEventListener("menubutton", function () {
          Ext.ComponentQuery.query('mainpanel')[0].setActiveItem(2);

        }, false);
        document.addEventListener("backbutton", function () {
          // get the current window in foreground, check if it's navigation view and trigger back button
          var active = Huhu.util.Config.getActiveNavigationView();

          if (active) active.pop();
        }, false);
        document.addEventListener('pause', function () {
          Huhu.app.setAppInBackground(1);
        }, false);
        document.addEventListener('resume', function () {
          Huhu.app.setAppInBackground(0);
        }, false);







      },


      /*
       * Sends the app status on pause/resume event to the api
       */
      setAppInBackground: function (background) {
        Huhu.util.Config.setAppInBackground(background);

        Ext.Ajax.request({
          url: Huhu.util.Config.getApiUrl() + 'user/set-app-in-background',
          params: { flag: background },
          success: function (response, opts) {
            var log = '';
            for (var x in response) {
              log += x + ': ' + response[x] + ', ';
            }
          }
        });
        if (!background) {
          // immediately refresh heartbeat ts
          Ext.Ajax.request({
            url: Huhu.util.Config.getApiUrl() + 'user/heartbeat'
          });
        }
      },

      /* shows new message notification in tab toolbar */
      indicateNewMessage: function () {

        var tabPanel = Ext.ComponentQuery.query('mainpanel');
        tabPanel = tabPanel[0];

        Huhu.app.indicateNewMessageCounter = tabPanel.getTabBar().getComponent(1).getBadgeText();


        if (typeof(Huhu.app.indicateNewMessageCounter) != 'number') Huhu.app.indicateNewMessageCounter = 0;

        Huhu.app.indicateNewMessageCounter++;

        tabPanel.getTabBar().getComponent(1).setBadgeText(Huhu.app.indicateNewMessageCounter);
      },
      indicateNewMessageCounter: 0,

      onUpdated: function () {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function (buttonId) {
              if (buttonId === 'yes') {
                window.location.reload();
              }
            }
        );
      }
    });
  }
};


Ext.Loader.setPath({
  'Ext': 'touch/src'
});





