Ext.define('Huhu.util.User', {
  singleton: true,


  /**
   * Do things we need to do after successfull login
   *  - set loggedin flag
   *  - personalize toolbar
   *  - set application state
   *  - load/recover private key
   *  - check private key
   *  - send apn/gcm token
   *  - init pusher
   *  - reload lists
   */
  afterLogin: function (userid) {

    Huhu.util.Config.setLoggedin(true);
    Huhu.util.Config.setUserid(userid);


    // check if we have a private key

    window.afterRecoverPrivatekeyCallback=function() {
      // called if we have a correctly working private key

      // init the push receiver!
      Ext.create('Huhu.push.Main');

      var pusher=Huhu.util.Config.getPusher();
      if (pusher) {
        var transport=pusher.getTransport();
        if (typeof(transport.afterLogin) != 'undefined') {
          transport.afterLogin();
        }
      }


    };


    var privateKey=Huhu.util.Config.getPrivateKey();
    if (Ext.isEmpty(privateKey)) {
      Huhu.util.User.recoverPrivateKey();
    } else {
      Huhu.util.User.testPrivateKey(null, function(correct) {
        if (correct) {
          window.afterRecoverPrivatekeyCallback();
        }
      });
    }

    // load userid and personalize toolbar
    Huhu.util.User.placeUsernameAndPic();

    // init the app background state
    Huhu.app.setAppInBackground(0);

    // trigger load on stores
    var contactslist=Ext.ComponentQuery.query('contactlist');
    contactslist[0].getStore().load();
    contactslist[0].refresh();

    var chatslist=Ext.ComponentQuery.query('chatslist');
    chatslist[0].getStore().load();
    chatslist[0].refresh();

    var visiblelist=Ext.ComponentQuery.query('[itemId=visiblelist]');
    if (typeof(visiblelist[0]) != 'undefined') {
        visiblelist[0].getStore().load();
        visiblelist[0].refresh();
    }

    var invisiblelist=Ext.ComponentQuery.query('[itemId=invisiblelist]');
    if (typeof(invisiblelist[0]) != 'undefined') {
        invisiblelist[0].getStore().load();
        invisiblelist[0].refresh();
    }

    var chatinvitelist=Ext.ComponentQuery.query('chatinvitelist');
    if (typeof(chatinvitelist[0]) != 'undefined') {
        chatinvitelist[0].getStore().load();
        chatinvitelist[0].refresh();
    }




  },






  /**
   * Do things we need to do after logout
   */
  afterLogout: function () {
    Huhu.util.Config.setLoggedin(false);
    Huhu.util.Config.setUserid(null);

    var pusher=Huhu.util.Config.getPusher();
    if (typeof(pusher) != 'undefined' && typeof(pusher.destroy)!='undefined') {
      pusher.destroy();
    }

  },


  /**
   * Is called when api says that we are not logged in (session expired etc.)
   * tries automatically login via hash, or redirects to login page
   * @returns {boolean}
   */
  relogin: function () {
    // if we have loginhash try to login with that
    var hash = null;
    var loggedIn = false;


    if ((typeof(window.hashLoginTried) == 'undefined' || window.hashLoginTried==false) && typeof(window.localStorage) != 'undefined') {
      hash = window.localStorage.getItem('huhuloginhash');
      if (hash) {
        Ext.Ajax.setAsync(false);

        window.hashLoginTried = true;

        Ext.Ajax.request({
          url: Huhu.util.Config.getApiUrl() + 'user/login',
          params: { hash: hash, regid: Huhu.util.Config.getRegid() },
          success: function (response, opts) {
            var reader = Ext.create('Ext.data.reader.Json');
            var data = reader.getResponseData(response);

            if (data.success && data.loggedin) {


              loggedIn = true;

//              Huhu.util.Config.setSessionId(data.session_id);

              Huhu.util.User.afterLogin(data.userid);
              window.hashLoginTried = false;


            }
          }
        });

        Ext.Ajax.setAsync(true);
      }
    }


    if (loggedIn) {

      return true;
    } else {
      Huhu.app.isLoggedIn = false;
      Ext.Viewport.setActiveItem('loginpanel');
      return false;
    }

  },


  /**
   * Personalizes the toolbar and place in user pic and username
   * also sets the user id
   * synchronous ajax call
   */
  placeUsernameAndPic: function () {
    // replace icon and text of settings tab with user pic and name
    Ext.Ajax.setAsync(false);
    Ext.Ajax.request({
      url: Huhu.util.Config.getApiUrl() + 'user/profile-get',
      success: function (response, opts) {
        var reader = Ext.create('Ext.data.reader.Json');
        var data = reader.getResponseData(response);

        if (typeof(data) == 'object' && data.success) {
          window.userData = data;

          window.personalizeToolbarInterval = window.setInterval(function () {
            var el = Ext.DomQuery.select('.x-tab .x-button-icon.settings')[0];
            if (el && window.personalizeToolbarInterval) {
              window.clearInterval(window.personalizeToolbarInterval);
              window.personalizeToolbarInterval = null;
            }


            //Ext.DomQuery.select('.x-tab .x-button-icon.settings')[0].innerHTML=data.user.name;
            el.style.content = '""!important';
            el.style.backgroundImage = 'url("data:image/jpg;base64,' + window.userData.user.image + '")';
            el.nextSibling.innerHTML = window.userData.user.name;
          }, 100);

        }
      }
    });
    Ext.Ajax.setAsync(true);
  },


  /**
   * Tests if we can decode the testvalue with our private key... if not we have to recover private key
   * @param testValue
   */
  testPrivateKey: function (testValue, callbackFunction) {
    var encrypted = null;
    if (testValue) {
      Huhu.util.User.testPrivateKeyDo(testValue, callbackFunction);
    } else {
      // request a testvalue from server...
      Ext.Ajax.request({
        url: Huhu.util.Config.getApiUrl() + 'user/request-test-private-key-value',
        success: function (response, opts) {
          var reader = Ext.create('Ext.data.reader.Json');
          var data = reader.getResponseData(response);

          if (data.success) {
            if (data.needPublicKey) {
              Huhu.util.User.generateKeyPair();
            } else {
              Huhu.util.User.testPrivateKeyDo(data.privateKeyTestValue, callbackFunction);
            }
          }
        }
      });
    }
  },
  testPrivateKeyDo: function (testValue, callbackFunction) {
    var crypt = new JSEncrypt();
    crypt.setPrivateKey(Huhu.util.Config.getPrivateKey());
    var decrypted = crypt.decrypt(testValue);

    Ext.Ajax.request({
      url: Huhu.util.Config.getApiUrl() + 'user/test-private-key-value',
      params: { value: decrypted },
      success: function (response, opts) {
        var reader = Ext.create('Ext.data.reader.Json');
        var data = reader.getResponseData(response);

        if (typeof(callbackFunction) == 'function') {
          callbackFunction(data.correct);
        } else {
          if (data.success && !data.correct) {
            Huhu.util.User.recoverPrivateKey(true);
          }
        }
      }
    });
  },


  /**
   * Is called if server says we have no keypair yet
   */
  generateKeyPair: function () {
    // bring settingstab to front..
    Ext.ComponentQuery.query('mainpanel')[0].setActiveItem(2);
    // ... and push createkey panel
    Ext.ComponentQuery.query('settingspanel')[0].push({ xtype: 'keygeneratepanel' });

    // update status container
    var statuscontainer = Ext.DomQuery.select('#createKeyStatus');
    Ext.DomHelper.overwrite(statuscontainer[0], 'Schlüsselpaar wird erstellt.');

    // start visual feedback
    window.genKeyInterval = window.setInterval(function () {
      var statuscontainer = Ext.DomQuery.select('#createKeyStatus');
      Ext.DomHelper.insertHtml('beforeEnd', statuscontainer[0], '.');
    }, 200);

    // asyncchronous start generating
    window.setTimeout(function () {
      // generate key pair
      var crypt = new JSEncrypt({ default_key_size: 1024 });
      crypt.getKey();
      var privKey = crypt.getPrivateKey(),
          pubKey = crypt.getPublicKey();

      window.clearInterval(window.genKeyInterval);
      var interval = null;

      // send public key to server
      Ext.DomHelper.overwrite(statuscontainer[0], 'Sende öffentlichen Schlüssel an den Server.');

      Huhu.util.Config.setPrivateKey(privKey);

      Ext.Ajax.request({
        url: Huhu.util.Config.getApiUrl() + 'user/send-public-key',
        params: { key: pubKey },
        success: function (response, opts) {
          var reader = Ext.create('Ext.data.reader.Json');
          var data = reader.getResponseData(response);

          // delete old key from fileystem
          Huhu.util.User.privateKeyWriteToFile(function () {

          }, function () {
            if (Huhu.util.Config.getDebug()) {
              console.debug('Error on deleting private key: ' + error.code);
            }
          }, true);


          // test the new created key...
          Huhu.util.User.testPrivateKey(data.privateKeyTestValue, function(correct) {
            if (correct) {
              if (typeof(window.afterRecoverPrivatekeyCallback) == 'function') {
                window.afterRecoverPrivatekeyCallback();
              }
            }
          });


          Ext.ComponentQuery.query('settingspanel')[0].pop('keygeneratepanel');

          if (typeof(window.requestFileSystem) != 'undefined') {
            // if we are an app, we have routines to save the key and will use them. do not bother user

            Huhu.util.User.privateKeyWriteToFile(function () {
              Ext.Msg.alert('Privater Key gespeichert.', 'Der öffentliche Schlüssel wurde auf unserem Server, und der private Schlüssel auf diesem Gerät gespeichert! Wir empfehlen den privaten Schlüssel zusätzlich zu sichern, gehe dafür in die Einstellungen.');
            }, function (error) {
              // fail - ask user...
              if (Huhu.util.Config.getDebug()) {
                console.debug('Error on writing private key: ' + error.code);
              }

              Ext.ComponentQuery.query('settingspanel')[0].push({ xtype: 'keysavepanel' });
            });

          } else {
            // we are not the app and ask user where to save the key!
            Ext.ComponentQuery.query('settingspanel')[0].push({ xtype: 'keysavepanel' });
          }
        }
      });
    }, 1000);
  },


  /**
   * Read private key from filesystem if we are the app, or from localstorage if we are the browser
   * sets the privateKey property in global config
   * @param function successCallback
   * @param function errorCallback
   */
  privateKeyReadFromFile: function (successCallback, errorCallback) {
    if (typeof(window.requestFileSystem) != 'undefined') {
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        // got fs handle!
        fileSystem.root.getFile("privatekey_" + Huhu.util.Config.getUserid() + ".huhu", null, function (fileEntry) {
          // got file entry!
          fileEntry.file(function (file) {
            // got file,read it!

            var reader = new FileReader();
            reader.onloadend = function (evt) {
              if (!Ext.isEmpty(evt.target.result)) {
                Huhu.util.Config.setPrivateKey(evt.target.result);
              }
              if (typeof(successCallback) == 'function') {
                successCallback(evt.target.result);
              }
            };
            reader.readAsText(file);

          }, errorCallback);
        }, errorCallback);
      }, errorCallback);
    } else if (typeof(window.localStorage) != 'undefined') {
      // we are not the app, or plugin not found, use localstorage
      var key = window.localStorage.getItem('huhuprivatekey_' + Huhu.util.Config.getUserid());
      if (!Ext.isEmpty(key)) {
        Huhu.util.Config.setPrivateKey(key);
      }
      if (typeof(successCallback) == 'function') {
        successCallback(key);
      }

    } else if (typeof(errorCallback) == 'function') {
      if (Huhu.util.Config.getDebug()) {
        console.debug('Fileplugin nor localstorage available!!');
      }

      errorCallback();
    }
  },


  /**
   * Writes privatekey (from global config object) to filesystem if we are the app, or localstorage if we are the browser
   * @param function successCallback
   * @param function errorCallback
   * @param bool deleteKey
   */
  privateKeyWriteToFile: function (successCallback, errorCallback, deleteKey) {
    if (typeof(window.requestFileSystem) != 'undefined') {
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        // got fs handle!
        fileSystem.root.getFile("privatekey_" + Huhu.util.Config.getUserid() + ".huhu", {create: true, exclusive: false}, function (fileEntry) {
          // got file entry!
          fileEntry.createWriter(function (writer) {
            // got file writer

            writer.onwrite = function () {
              // private key written to file!
              if (typeof(successCallback) == 'function') {
                successCallback();
              }


            };

            if (typeof(errorCallback) == 'function') {
              writer.onerror = errorCallback;
            }

            if (deleteKey) {
              writer.truncate(0);
            } else {
              writer.write(Huhu.util.Config.getPrivateKey());
            }
          }, errorCallback);
        }, errorCallback);
      }, errorCallback);
    } else if (typeof(window.localStorage) != 'undefined') {
      // we are not the app, or plugin not found, use localstorage
      if (deleteKey) {
        window.localStorage.removeItem('huhuprivatekey_' + Huhu.util.Config.getUserid());
      } else {
        window.localStorage.setItem('huhuprivatekey_' + Huhu.util.Config.getUserid(), Huhu.util.Config.getPrivateKey());
      }
      if (typeof(successCallback) == 'function') {
        successCallback();
      }

    } else if (typeof(errorCallback) == 'function') {
      if (Huhu.util.Config.getDebug()) {
        console.debug('Fileplugin nor localstorage available!!');
      }

      errorCallback();
    }

  },

  /**
   * Is called if server detects that we can't decode his messages (e.g. wrong private key or no private key)
   */
  recoverPrivateKey: function (notFromFile) {

    if (Ext.isEmpty(Huhu.util.Config.getUserid())) {
      return;
    }

    if (!notFromFile) {
      Huhu.util.User.privateKeyReadFromFile(function (key) {
        // success
        if (!key) {
          // no... nothing in the localstorage... ask user where to find the key

          if (!window.waitForMainpanelInterval) {
            window.waitForMainpanelInterval = window.setInterval(function () {
              // bring settingstab to front..
              var mainpanel = Ext.ComponentQuery.query('mainpanel');
              if (typeof(mainpanel[0]) != 'undefined') {
                if (window.waitForMainpanelInterval) {
                  window.clearInterval(window.waitForMainpanelInterval);
                  window.waitForMainpanelInterval = null;
                }

                mainpanel[0].setActiveItem(2);
                // ... and push createkey panel
                Ext.ComponentQuery.query('settingspanel')[0].push({ xtype: 'keyloadpanel' });
              }
            }, 500);
          }


        } else {
          Huhu.util.User.testPrivateKey(null, function(correct) {
            if (correct && typeof(window.afterRecoverPrivatekeyCallback) == 'function') {
              window.afterRecoverPrivatekeyCallback();
            } else if (!correct) {
                // bring settingstab to front..
                Ext.ComponentQuery.query('mainpanel')[0].setActiveItem(2);
                // ... and push createkey panel
                Ext.ComponentQuery.query('settingspanel')[0].push({ xtype: 'keyloadpanel' });
            }
          });
        }
      }, function (error) {
        if (Huhu.util.Config.getDebug()) {
          console.debug('Error on loading private key: ' + error.code + ' ' + Huhu.util.User.fileErrorCode2Text(error.code));
        }


        // bring settingstab to front..
        Ext.ComponentQuery.query('mainpanel')[0].setActiveItem(2);
        // ... and push createkey panel
        Ext.ComponentQuery.query('settingspanel')[0].push({ xtype: 'keyloadpanel' });
      });
    } else {
      // bring settingstab to front..
      Ext.ComponentQuery.query('mainpanel')[0].setActiveItem(2);
      // ... and push createkey panel
      Ext.ComponentQuery.query('settingspanel')[0].push({ xtype: 'keyloadpanel' });
    }

  },

  fileErrorCode2Text: function (code) {
    if (typeof(FileError.NOT_FOUND_ERR) != 'undefined') {
      switch (code) {
        case FileError.NOT_FOUND_ERR:
          return 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          return 'SECURITY_ERR';
          break;
        case FileError.ABORT_ERR:
          return 'ABORT_ERR';
          break;
        case FileError.NOT_READABLE_ERR:
          return 'NOT_READABLE_ERR';
          break;
        case FileError.ENCODING_ERR:
          return 'ENCODING_ERR';
          break;
        case FileError.NO_MODIFICATION_ALLOWED_ERR:
          return 'NO_MODIFICATION_ALLOWED_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          return 'INVALID_STATE_ERR';
          break;
        case FileError.SYNTAX_ERR:
          return 'SYNTAX_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          return 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.QUOTA_EXCEEDED_ERR:
          return 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.TYPE_MISMATCH_ERR:
          return 'TYPE_MISMATCH_ERR';
          break;
        case FileError.PATH_EXISTS_ERR:
          return 'PATH_EXISTS_ERR';
          break;
      }
    } else {
      return 'Plugin not loaded';
    }

  }

});