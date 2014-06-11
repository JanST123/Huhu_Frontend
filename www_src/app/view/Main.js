Ext.define('Huhu.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'mainpanel',
    
    requires: [
        'Huhu.view.Contacts',
        'Huhu.view.ContactList',
        'Huhu.view.Chat',
        'Huhu.view.ChatInvite',
        'Huhu.view.Chats',
        'Huhu.view.Settings'
    ],
	config: {
        fullscreen: true,
        tabBarPosition: 'bottom',
        tabBar: {
        	control: {
        		'button[text=Chats]': {
        			tap: function() {
        				// pop all panels from chatscontainer except for the first
        				var chatcontainer=Ext.ComponentQuery.query('chatscontainer');
        				chatcontainer=chatcontainer[0];
        				
        				// there should be 2 items left (list and back button)
        				var itemsToRemove=chatcontainer.getItems().length - 2;
        				chatcontainer.pop(itemsToRemove);
       		    	}
        	    }
        	}
        },
        items: [
                // contact panel
                {
                	xtype: 'contactscontainer',
                	iconCls: 'star'
                }, // end contact panel
                {
                	xtype: 'chatscontainer',
                    iconCls: 'chat'
                },
                {
                	xtype: 'settingspanel',
                    iconCls: 'settings'
                }
                
        ]
	}
});
