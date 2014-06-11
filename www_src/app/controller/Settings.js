Ext.define('Huhu.controller.Settings', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			main: 'settingspanel',
			profilepanel: 'profilepanel',
			profileform: 'component[itemId=profileform]',
			settingsVisibilityButton: 'component[itemId=settingsVisibility]',
			settingsProfileButton: 'component[itemId=settingsProfile]',
			settingsLogoutButton: 'component[itemId=settingsLogout]',
            settingsKeyLoadButton: 'component[itemId=settingsKeyLoad]',
            settingsKeySaveButton: 'component[itemId=settingsKeySave]',
			profileAdditionalFields: 'profileAdditionalFields',
			profileImage: 'component[itemId=profileImage]',
			profilepicUploadForm: 'component[itemId=profilepicuploadform]',
			profilepicPploadButton: 'component[itemId=profilepicuploadbutton]',
			visiblelist: 'component[itemId=visiblelist]',
			invisiblelist: 'component[itemId=invisiblelist]',
			globalInvisible: 'component[itemId=globalInvisible]',
            keyloadlist: 'component[itemId=keyloadlist]',
            keysavelist: 'component[itemId=keysavelist]'
		},
		control: {

            keyloadlist: {
                disclose: 'keyLoad'
            },

            keysavelist: {
                disclose: 'keySave'

            },

            settingsKeyLoadButton: {
                tap: function() {
                    Ext.ComponentQuery.query('settingspanel')[0].push({ xtype: 'keyloadpanel' });
                }
            },
            settingsKeySaveButton: {
                tap: function() {
                    Ext.ComponentQuery.query('settingspanel')[0].push({ xtype: 'keysavepanel' });

                    this.checkPrivateKeySaved();

                }
            },

			globalInvisible: {
				change: function(field, newValue) {
					if (newValue!=1) newValue=0;
					
					Ext.Ajax.request({
						url: Huhu.util.Config.getApiUrl() + 'user/set-invisible',
						params: { flag: newValue },
						method: 'POST',
						success: function(response, options) {
							var reader=Ext.create('Ext.data.reader.Json');
				        	var data=reader.getResponseData(response);
						}
					});
					
				},
				
				painted: function(that, opts) {
					Ext.Ajax.request({
						url: Huhu.util.Config.getApiUrl() + 'user/get-invisible',
						method: 'GET',
						success: function(response, options) {
							var reader=Ext.create('Ext.data.reader.Json');
				        	var data=reader.getResponseData(response);
				        	
				        	that.setValue(data.invisible);
						}
					});
					
				}
			},
			visiblelist: {
				disclose: 'addUserToInvisibleList'
			},
			invisiblelist: {
				disclose: 'removeUserFromInvisibleList'
			},
			settingsVisibilityButton: {
				tap: function(btn, e, eopts) {
	             	   this.getMain().push({
	            		   xtype: 'visibilitypanel'
	            	   });
					}
			},
			settingsProfileButton: {
				tap: function(btn, e, eopts) {
             	   this.getMain().push({
            		   xtype: 'profilepanel'
            	   });
				}
			},
			settingsLogoutButton: {
				tap: function(btn, e, eopts) {
             	   this.getMain().push({
            		   xtype: 'logoutpanel'
            	   });
				}
			},
			profileform: {
				initialize: 'loadProfileData',
				ProfileClicked: 'doProfile'
			},
			'component[itemId=profilechangedobutton]': {
				tap: 'doProfileValidate'
			},
			profilepicPploadButton: {
				tap: 'doProfilepicUpload'
			}
		}
	},
	
	addUserToInvisibleList: function(list, record) {
		var controller=this;
		
		Ext.Ajax.request({
			url: Huhu.util.Config.getApiUrl() + 'user/add-user-to-invisible-list',
			params: { userid: record.data.id },
			method: 'POST',
			success: function(response, options) {
				var reader=Ext.create('Ext.data.reader.Json');
	        	var data=reader.getResponseData(response);
	        	
	        	if (data.success) {
	        		controller.getVisiblelist().getStore().load();
	        		controller.getVisiblelist().refresh();
	        		
	        		controller.getInvisiblelist().getStore().load();
	        		controller.getInvisiblelist().refresh();
	        	}
			}
		});
	},
	
	removeUserFromInvisibleList: function(list, record) {
		var controller=this;

		Ext.Ajax.request({
			url: Huhu.util.Config.getApiUrl() + 'user/remove-user-from-invisible-list',
			params: { userid: record.data.id },
			method: 'POST',
			success: function(response, options) {
				var reader=Ext.create('Ext.data.reader.Json');
	        	var data=reader.getResponseData(response);
	        	
	        	if (data.success) {
	        		controller.getVisiblelist().getStore().load();
	        		controller.getVisiblelist().refresh();
	        		
	        		controller.getInvisiblelist().getStore().load();
	        		controller.getInvisiblelist().refresh();
	        	}
			}
		});
	},
	
	/**
	 * Upload the profilepic 
	 */
	doProfilepicUpload: function() {
		
		Ext.Ajax.request({
			url: Huhu.util.Config.getApiUrl() + 'user/upload-profile-pic-file',
			method: 'POST',
			success: function(response, options) {
				var reader=Ext.create('Ext.data.reader.Json');
	        	var data=reader.getResponseData(response);
	        	
	        	if (data.success) {
        	        Huhu.util.User.placeUsernameAndPic();

	        		Ext.ComponentQuery.query('component[itemId=profileUploadDialogOverlay]')[0].destroy();
	        		Ext.ComponentQuery.query('component[itemId=profileImage]')[0].setSrc('data:image/jpg;base64,' + data.src);
	        	}
			},
			form: 'profilepicuploadform',
			isUpload: true
		});
	},
	
	
	/**
	 * Saves the profile
	 */
	doProfile: function() {
		this.getProfileform().submit({
           	success: function(form, result) {
           		if (result.success) {
           			var contactlist=Ext.ComponentQuery.query('contactlist');
           			contactlist[0].getStore().load();
           			contactlist[0].refresh();
           			
           			// refresh chatslist (will trigger login panel)
            		var chatslist=Ext.ComponentQuery.query('chatslist');
            		chatslist[0].getStore().load();
            		chatslist[0].refresh();
            		
            		Ext.Msg.alert('Gespeichert', result.message);
            			
           		} else {
           			Ext.Msg.alert('Fehler', result.message);
           			// @TODO: validation
           		}
            		
           	}
        });
	},
	
	
	/**
	 * Validates the profile form
	 */
	doProfileValidate: function(button, e, eOpts) {
		var me = this.getProfileform();
		
        var formObj = me;
        var formData = formObj.getValues();
        
        validationFields={
        		email: formData.email,
        		passwordold: '........',
        		password: '........',
        		password2: '........'
        };
        if (formData.passwordold != '') {
        	validationFields.passwordold=formData.passwordold;
        }
        if (formData.password != '') {
        	validationFields.password=formData.password;
        }
        if (formData.password2 != '') {
        	validationFields.password2=formData.password2;
        }

        var validation = Ext.create('ProfileValidation', validationFields);

        var errs = validation.validate();
        var msg = '';

        if (!errs.isValid()) {
            errs.each(function(err) {
                msg += err.getMessage() + '<br />';
            });

            Ext.Msg.alert('Ungültige Eingaben', msg);

        } else {
        	if (this.getProfileAdditionalFields().validate(formObj)) {
        		me.fireEvent('ProfileClicked', me);
        	}
        }
	},


    checkPrivateKeySaved: function() {
        Huhu.util.User.privateKeyReadFromFile(function(key) {
            Huhu.app.getController('Settings').getKeysavelist().getStore().removeAt(2);

            if (key) {
                Huhu.app.getController('Settings').getKeysavelist().getStore().add({
                    title: '<span style="color: green;">Ist auf diesem Gerät gespeichert.</span>',
                    description: 'Klicke um den Schlüssel auf diesem Gerät zu löschen.'
                });
            } else {
                Huhu.app.getController('Settings').getKeysavelist().getStore().add({
                    title: 'Auf diesem Gerät speichern',
                    description: 'Diese Methode solltest du nur auf deinem privaten Smartphone, Tablet oder PC nutzen, sprich nur da wo normalerweise nur du rankommst. Alles andere wäre extremst unsicher!!'
                });
            }
            Huhu.app.getController('Settings').getKeysavelist().refresh();

        }, function(error) {
            if (Huhu.util.Config.getDebug()) {
                console.debug('Error on loading private key: ' + error.code);
            }
        });
    },

    /**
     * Loads key from specific target
     * @param list
     * @param record
     * @param index
     */
    keyLoad: function(el, list, record, index) {




        switch (index) {
            case 0:
                // from dropbox
                Huhu.util.DropBox.privateKeyChooser();
                break;

            case 1:
                // from filesystem
                window.loadprivatekeyOverlay=Huhu.util.Overlay.show('privatekeyupload', 'Privaten Schlüssel laden', [
                    { html: '<strong>Wähle den privaten Schlüssel von Deinem Computer aus!</strong><br />' },
                    { html: '<input type="file" id="privatekeyload" />' }
                ], false);

                function handleFileSelect(evt) {
                    var files = evt.target.files; // FileList object

                    var reader = new FileReader();
                    reader.onload = (function(theFile) {
                        Huhu.util.User.privateKeyWriteToFile(function() {

                        }, function() {
                            if (Huhu.util.Config.getDebug()) {
                                console.debug('Error on deleting private key: ' + error.code + ' ' + Huhu.util.User.fileErrorCode2Text(error.code));
                            }
                        }, true);

                        Huhu.util.Config.setPrivateKey(theFile.target.result);
                        Huhu.util.User.testPrivateKey(null, function(correct) {
                            if (correct) {
                                Ext.Msg.alert('Key geladen', 'Der private Schlüssel wurde geladen und funktioniert');
                                if (window.loadprivatekeyOverlay) {
                                    window.loadprivatekeyOverlay.destroy();
                                    window.loadprivatekeyOverlay=null;
                                }
                                Ext.ComponentQuery.query('settingspanel')[0].pop('keyloadpanel');
                                Ext.ComponentQuery.query('settingspanel')[0].push({xtype: 'keysavepanel'});

                                if (typeof(window.afterRecoverPrivatekeyCallback) == 'function') {
                                  window.afterRecoverPrivatekeyCallback();
                                }
                            } else {
                                Ext.Msg.alert('Falscher Key', 'Der private Schlüssel funktioniert leider nicht. Hast du die Korrekte Datei ausgewählt?');
                            }
                        });
                    });
                    reader.readAsText(files[0]);
                }

                document.getElementById('privatekeyload').addEventListener('change', handleFileSelect, false);

                break;

            case 2:
                // generate new keypair
                Ext.Msg.confirm('Bist Du sicher?', 'Wirklich ein neues Schlüsselpaar generieren??', function(buttonId) {
                   if (buttonId=='yes') {
                       Ext.ComponentQuery.query('settingspanel')[0].pop('keyloadpanel');
                       Huhu.util.User.generateKeyPair();
                   }
                });
                break;
        }
    },


    /**
     * Saves key to specific target
     * @param list
     * @param record
     * @param index
     */
    keySave: function(el, list, record, index) {
        switch (index) {
            case 0:
                var options = {
                    files: [
                        {'url': 'data:application/octet-stream;charset=utf-8;base64,' + B64.encode(Huhu.util.Config.getPrivateKey()), 'filename': 'privatekey.huhu'}
                    ],

                    // Success is called once all files have been successfully added to the user's
                    // Dropbox, although they may not have synced to the user's devices yet.
                    success: function () {
                        Ext.Msg.alert('Gespeichert', 'Der Schlüssel wurde in Deiner DropBox gespeichert. Du kannst ihn nun jederzeit daraus wieder abrufen.');
                    },

                    // Progress is called periodically to update the application on the progress
                    // of the user's downloads. The value passed to this callback is a float
                    // between 0 and 1. The progress callback is guaranteed to be called at least
                    // once with the value 1.
                    progress: function (progress) {},

                    // Cancel is called if the user presses the Cancel button or closes the Saver.
                    cancel: function () {},

                    // Error is called in the event of an unexpected response from the server
                    // hosting the files, such as not being able to find a file. This callback is
                    // also called if there is an error on Dropbox or if the user is over quota.
                    error: function (errorMessage) {
                        alert(errorMessage);
                    }
                };

                Dropbox.save(options);

                break;
            case 1:
                Huhu.util.Overlay.show('privatekeydownload', 'Privaten Schlüssel anzeigen/herunterladen', [
                    { html: '<strong>Dies ist dein privater Schlüssel. Kopiere ihn in eine Datei, E-Mail etc. oder lade ihn herunter und bewahre in sorgfältig auf!</strong><br />' },
                    { html: '<textarea cols=100 rows=10>' + Huhu.util.Config.getPrivateKey() + '</textarea>' },
                    { html: '<br /><br />' },
                    { html: '<a href="data:application/octet-stream;charset=utf-8;base64,' + B64.encode(Huhu.util.Config.getPrivateKey()) + '" download="privatekey.huhu">Download</a>' }
                ], false);
                break;
            case 2:
                // 1st check if key already saved (if so, user wants to delete)
                Huhu.util.User.privateKeyReadFromFile(function(key) {
                    // success
                    if (key) {
                        // delete
                        Ext.Msg.confirm('Wirklich löschen?', 'Möchtest Du Deinen Schlüssel von diesem Gerät löschen?', function(buttonId, value, opt) {
                            if (buttonId=='yes') {
                                Huhu.util.User.privateKeyWriteToFile(function() {
                                    // success
                                    Ext.Msg.alert('Gelöscht.', 'Der Schlüssel wurde von diesem Gerät gelöscht.');
                                    Huhu.app.getController('Settings').checkPrivateKeySaved();
                                }, function(error) {
                                    // fail
                                    if (Huhu.util.Config.getDebug()) {
                                        console.debug('Error on deleting private key: ' + error.code + ' ' + Huhu.util.User.fileErrorCode2Text(error.code));
                                    }
                                    Ext.Msg.alert('Fehler', 'Konnte nicht gelöscht werden.');
                                    Huhu.app.getController('Settings').checkPrivateKeySaved();
                                }, true);
                            }
                        });
                    } else {
                        // save
                        Ext.Msg.confirm('Wirklich lokal speichern?', 'Bitte speichere den Schlüssel nur an einem Gerät zu dem nur du und vertraute Personen Zugang haben. Jeder der an dieses Gerät kommt kann sonst deine Nachrichten lesen. Speichern?', function(buttonId, value, opt) {
                            if (buttonId=='yes') {
                                Huhu.util.User.privateKeyWriteToFile(function() {
                                    // success
                                    Ext.Msg.alert('Gespeichert.', 'Der Schlüssel wurde auf diesem Gerät gespeichert.');
                                    Huhu.app.getController('Settings').checkPrivateKeySaved();
                                }, function(error) {
                                    // fail
                                    if (Huhu.util.Config.getDebug()) {
                                        console.debug('Error on saving private key: ' + error.code + ' ' + Huhu.util.User.fileErrorCode2Text(error.code));
                                    }
                                    Ext.Msg.alert('Fehler', 'Konnte nicht gespeichert werden.');
                                    Huhu.app.getController('Settings').checkPrivateKeySaved();
                                }, false);
                            }
                        });
                    }
                }, function(error) {
                    // fail
                    if (Huhu.util.Config.getDebug()) {
                        console.debug('Error on loading private key: ' + error.code + ' ' + Huhu.util.User.fileErrorCode2Text(error.code));
                    }
                });

                break;
        }
    },
	
	
	/**
	 * Loads profile data from api and fills them into fields
	 */
	loadProfileData: function(el, e, eopts) {
		Ext.Ajax.request({
			url: Huhu.util.Config.getApiUrl() + 'user/profile-get',
			scope: this,
			success: function(response, opts) {
				var reader=Ext.create('Ext.data.reader.Json');
	        	var data=reader.getResponseData(response);
	        	
	        	if (data.success) {
	        		var form=this.getProfileform();
	        		
	        		var emailpublic=0;
	        		if (typeof(data.user) != 'undefined' && typeof(data.user.additional) != 'undefined' && typeof(data.user.additional.email) != 'undefined') {
	        			emailpublic=1;
	        		}
	        		
	        		form.setValues({
	        			username: data.user.name,
	        			email: data.user.email,
	        			emailpublic: emailpublic,
	        			emailpublictoggle: emailpublic
	        		});
	        		
	        		this.getProfileImage().setSrc('data:image/jpg;base64,' + data.user.image);
	        		
	        		
	        		if (typeof(data.user) != 'undefined' && typeof(data.user.additional) != 'undefined') {
	        			var profileAdditionalFields=this.getProfileAdditionalFields();
	        			for (var x in data.user.additional) {
	        				var fieldType=null,
	        					text=null;
	        				switch(x) {
	        					case 'company':
	        						fieldType='string';
	        						text='Firma';
	        						break;
	        						
	        					case 'birthday':
	        						fieldType='date';
	        						text='Geburtstag';
	        						break;
	        						
	        					case 'mobile':
	        						fieldType='phone';
	        						text='Handynummer';
	        						break;
	        						
	        					case 'girlsname':
	        						fieldType='string';
	        						text='Mädchenname';
	        						break;
	        				
	        					case 'lastname':
	        						fieldType='string';
	        						text='Nachname';
	        						break;
	        						
	        					case 'lastschool':
	        						fieldType='string';
	        						text='Name der letzten Schule';
	        						break;
	        						
	        					case 'zip':
	        						fieldType='int';
	        						text='Postleitzahl';
	        						break;
	        						
	        					case 'phone':
	        						fieldType='phone';
	        						text='Telefonnummer';
	        						break;
	        						
	        					case 'firstname':
	        						fieldType='string';
	        						text='Vorname';
	        						break;
	        						
	        					case 'url':
	        						fieldType='url';
	        						text='Webseite';
	        						break;
	        					
	        					case 'city':
	        						fieldType='string';
	        						text='Wohnort';
	        						break;
	        				}
	        				profileAdditionalFields.addAdditionalField(this.getProfilepanel(), { text: text, value: x, fieldValue: data.user.additional[x], fieldType: fieldType});
	        			}
	        		}
	        	}
			}
		});
	}
	
});

