Ext.define('Huhu.controller.Login', {
  extend: 'Ext.app.Controller',

  config: {
    refs: {
      loginpanel: 'loginpanel',
      loginform: 'component[itemId=loginform]'
    },
    control: {
      'component[itemId=signupbutton]': {
        tap: 'openSignUp'
      },
      'component[itemId=loginbutton]': {
        tap: 'doLoginValidation'
      },
      loginform: {
        LoginClicked: 'doLogin'
      }
    }
  },


  openSignUp: function () {
    this.getLoginpanel().push({
      xtype: 'signuppanel'
    });
  },

  doLoginValidation: function (button, e, eOpts) {
    var me = this.getLoginform();

    var formObj = me;
    var formData = formObj.getValues();

    var validation = Ext.create('LoginValidation', {
      username: formData.username,
      password: formData.password
    });

    var errs = validation.validate();
    var msg = '';

    if (!errs.isValid()) {
      errs.each(function (err) {
        msg += err.getMessage() + '<br />';
      });

      Ext.Msg.alert('Ungültige Eingaben', msg);

    } else {
      me.fireEvent('LoginClicked', me);
    }
  },

  doLogin: function () {
    this.getLoginform().submit({
      success: function (form, result) {
        if (result.loggedin) {

          if (result.hash) {
            if (typeof(window.localStorage) != 'undefined') {
              window.localStorage.setItem('huhuloginhash', result.hash);
            }
          }


          Ext.Viewport.remove('loginpanel');
          Ext.Viewport.setActiveItem(0);


          Huhu.util.User.afterLogin(result.userid);


        } else {
          Ext.Msg.alert('Fehler', result.message);
        }

      }
    });
  }

});

