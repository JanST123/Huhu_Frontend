/**
 * Created by jst on 22.01.14.
 */

Ext.define('Huhu.util.Ajax', {
   constructor: function(config) {
       // global check if login needed on each ajax request, and global error handler
       Ext.Ajax.addListener('requestexception', function( conn, response, options, eOpts ) {
           var log='';
           for (var x in response) {
               log+=x+': ' + response[x]+", ";
           }
           if (Huhu.util.Config.getDebug()) {
               console.debug('AJAX-DEBUG: ' + log);
           }

           if (typeof(response.code) == 'undefined' || response.code < 500) {
               if (typeof(window.huhuServerFailures)=='undefined') {
                   window.huhuServerFailures=0;
               }
               window.huhuServerFailures++;

               if (window.huhuServerFailures > 4) {
                   alert(Huhu.util.Language.get('ajax_api_error'));
                   if (typeof(navigator) != 'undefined' && typeof(navigator.app) != 'undefined') {
                       navigator.app.exitApp();
                   } else {
                       document.location.href=Huhu.util.Config.getPageUrl();
                   }
               }
           }
       });

//
//       Ext.Ajax.addBeforeListener('beforerequest', function( conn, options, eOpts) {
//           if (typeof(options.params) != 'object') {
//               options.params={};
//           }
//           options.params.sessid=Huhu.util.Config.getSessionId();
//
//       });

       Ext.Ajax.addBeforeListener('requestcomplete', function( e, response, options, eOpts) {
           if (response.responseText.indexOf('{')===0) {
               var reader=Ext.create('Ext.data.reader.Json');
               var data=reader.getResponseData(response);
               if (typeof(data) == 'object' && typeof(data.needsLogin) != 'undefined' && data.needsLogin==true) {
                   var ret=false;
                   if (typeof(window.reloginRunning)=='undefined' || !window.reloginRunning) {
                       window.reloginRunning=true;
                       ret=Huhu.util.User.relogin();



                       window.reloginRunning=false;
                   }
                   return ret;
               } else if (typeof(data) == 'object' && typeof(data.success) != 'undefined' && data.success==false) {
                   var msg=Huhu.util.Language.get('unknown_system_error');
                   if (typeof(data.message)!='undefined') {
                       msg=data.message;
                   }
                   Ext.Msg.alert('ERROR', msg);
                   return false;
               }
           }
       });

       // global ajax error handler on http_code >= 400
       Ext.Ajax.addBeforeListener('requestexception', function( e, response, options, eOpts) {
           var reader=Ext.create('Ext.data.reader.Json');
           var data=reader.getResponseData(response);
           if (typeof(data.success) != 'undefined' && data.success==false) {
               var msg=Huhu.util.Language.get('unknown_system_error');
               if (typeof(data.message)!='undefined') {
                   msg=data.message;
               }
               Ext.Msg.alert('ERROR', msg);
           }
       });
   }


});