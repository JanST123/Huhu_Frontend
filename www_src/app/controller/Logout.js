Ext.define('Huhu.controller.Logout', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			logoutpanel: 'logoutpanel'
		},
		control: {
			'component[itemId=logoutbutton]': {
				tap: 'doLogout'
			}
		}
	},
	
	doLogout: function() {
		Ext.Ajax.request({
   		 url: Huhu.util.Config.getApiUrl() + 'user/logout',
   		 success: function(response, opt) {
   			 var reader=Ext.create('Ext.data.reader.Json');
   	         var responseObj=reader.getResponseData(response);
   			 if (responseObj.success) {


   				 
   				
   				if (typeof(window.localStorage) != 'undefined') {
   					window.localStorage.removeItem('huhuloginhash');
   				}
   				 
   				Ext.Msg.alert('Ausgeloggt');
   				
   				// destroy all open chat panels

           Huhu.util.User.afterLogout();
   				
   				var chatcontainer=Ext.ComponentQuery.query('chatcontainer');
   				Huhu.app.openchatpanels.each(function(item, index, length) {
   					if (typeof(chatcontainer[0]) != 'undefined') {
   						chatcontainer[0].remove(item);
   					}
   					item.destroy();
   				});
   				
   				// refresh contactlist (will trigger login panel)
        		var contactlist=Ext.ComponentQuery.query('contactlist');
       			contactlist[0].getStore().load();
       			contactlist[0].refresh();
       			
       			// refresh chatslist (will trigger login panel)
        		var chatslist=Ext.ComponentQuery.query('chatslist');
        		chatslist[0].getStore().load();
        		chatslist[0].refresh();
   			 }
   		 }
   	   });
	}

});

