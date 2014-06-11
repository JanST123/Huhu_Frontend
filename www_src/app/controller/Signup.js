Ext.define('Huhu.controller.Signup', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			signuppanel: 'signuppanel',
			signupform: 'component[itemId=signupform]',
			profileAdditionalFields: 'profileAdditionalFields'
		},
		control: {
			'component[itemId=signupdobutton]': {
				tap: 'doSignUpValidate'
			},
			signupform: {
				SignupClicked: 'doSignUp'
			}
		}
	},
	
	doSignUpValidate: function(button, e, eOpts) {
		var me = this.getSignupform();
		
        var formObj = me;
        var formData = formObj.getValues();

        var validation = Ext.create('SignupValidation', {
            username: formData.username,
            password: formData.password,
            password2: formData.password2,
            email: formData.email
        });

        var errs = validation.validate();
        var msg = '';

        if (!errs.isValid()) {
            errs.each(function(err) {
                msg += err.getMessage() + '<br />';
            });

            Ext.Msg.alert('Ungültige Eingaben', msg);

        } else {
        	if (this.getProfileAdditionalFields().validate(formObj)) {
        		me.fireEvent('SignupClicked', me);
        	}
        }
	},
	
	doSignUp: function() {
		this.getSignupform().submit({
           	success: function(form, result) {
           		if (result.valid) {
           			if (result.hash) {
           				if (typeof(window.localStorage) != 'undefined') {
           					window.localStorage.setItem('huhuloginhash', result.hash);
           				} 
           			}

                Ext.Viewport.remove('signuppanel');
                Ext.Viewport.remove('loginpanel');
                Ext.Viewport.setActiveItem(0);

                Huhu.util.User.afterLogin(result.userid);

                Huhu.util.User.generateKeyPair();
           			

           			
           			var contactlist=Ext.ComponentQuery.query('contactlist');
           			contactlist[0].getStore().load();
           			contactlist[0].refresh();
           			
           			// refresh chatslist (will trigger login panel)
            		var chatslist=Ext.ComponentQuery.query('chatslist');
            		chatslist[0].getStore().load();
            		chatslist[0].refresh();
            			
           		} else {
           			Ext.Msg.alert('Fehler', result.message);
           			// @TODO: validation
           		}
            		
           	}
        });
	}
	
	
});

