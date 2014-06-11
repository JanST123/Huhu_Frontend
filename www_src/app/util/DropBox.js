/**
 * Created by janST123 on 22.01.14.
 */
Ext.define('Huhu.util.DropBox', {
    singleton : true,
    alias : 'dropbox',
    requires: [

    ],
    config : {},


    constructor: function(config) {
    },

    privateKeyChooser: function() {
        if (typeof(window.plugins) != 'undefined' && typeof(window.plugins.DropboxChooser) != 'undefined') {
            // use the phonegap plugin

            var DropboxChooser = window.plugins.DropboxChooser;

            // If this plugin is running on an Android device, the Dropbox app key needs feeding into the class; for iOS, this is not necessary
            DropboxChooser.init('ng0gfy77hmz5y78');

            // Call the method 'launchDropboxChooser', which has three arguments (the success callback, failure callback and an additional mandatory flag to specify if you want a 'Preview' link returned ( "true" for a 'Preview' link; "false" for a 'Direct' link).
            DropboxChooser.launchDropboxChooser(Huhu.util.DropBox.privateKeyChooserSuccess, function() {
                // error
            },"false");


        } else {
            // use the js chooser
            options = {
                // Required. Called when a user selects an item in the Chooser.
                success: Huhu.util.DropBox.privateKeyChooserSuccess,

                // Optional. Called when the user closes the dialog without selecting a file
                // and does not include any parameters.
                cancel: function() {},

                // Optional. "preview" (default) is a preview link to the document for sharing,
                // "direct" is an expiring link to download the contents of the file. For more
                // information about link types, see Link types below.
                linkType: "direct", // or "direct"

                // Optional. A value of false (default) limits selection to a single file, while
                // true enables multiple file selection.
                multiselect: false, // or true

                // Optional. This is a list of file extensions. If specified, the user will
                // only be able to select files with these extensions. You may also specify
                // file types, such as "video" or "images" in the list. For more information,
                // see File types below. By default, all extensions are allowed.
                extensions: ['.huhu']
            };

            Dropbox.choose(options);
        }
    },

    privateKeyChooserSuccess: function(files) {
        Ext.Ajax.request({
            url: files[0].link,
            success: function(response) {
                // first delete current key from filesystem
                Huhu.util.User.privateKeyWriteToFile(function() {
                }, function() {
                    if (Huhu.util.Config.getDebug()) {
                        console.debug('Error on deleting private key: ' + error.code + ' ' + Huhu.util.User.fileErrorCode2Text(error.code));
                    }
                }, true);

                Huhu.util.Config.setPrivateKey(response.responseText);
                Huhu.util.User.testPrivateKey(null, function(correct) {
                    if (correct) {
                        Ext.Msg.alert('Key geladen', 'Der private Schlüssel wurde geladen und funktioniert');
                        Ext.ComponentQuery.query('settingspanel')[0].pop('keyloadpanel');
                        Ext.ComponentQuery.query('settingspanel')[0].push({xtype: 'keysavepanel'});

                        console.log(typeof(window.afterRecoverPrivatekeyCallback));
                      console.log(window.afterRecoverPrivatekeyCallback);

                        if (typeof(window.afterRecoverPrivatekeyCallback) == 'function') {
                          window.afterRecoverPrivatekeyCallback();
                        }
                    } else {
                        Ext.Msg.alert('Falscher Key', 'Der private Schlüssel funktioniert leider nicht. Hast du die Korrekte Datei ausgewählt?');
                    }

                });
            }
        });
    }


});