Ext.define('Huhu.view.ChatInvite', {
	extend: 'Ext.Container',
	xtype: 'chatinvite',
	requires: [
	           'Huhu.view.ChatInviteList'
	       ],
	config: {
		itemId: 'chatinvite',
		layout: 'vbox',
		cls: 'chatcontainer',
		scrollable: 'vertical',
		listeners: {
   			deactivate: function(that, newEl, old) {
				window.chatPanelToDestroyAfterClose=that;
				window.setTimeout(function() {
					window.chatPanelToDestroyAfterClose.destroy();
				}, 500);
				
				// switch back to the tab we came from...
				if(window.switchToTabItemAfterChatInviteClose) {
					Ext.ComponentQuery.query('mainpanel')[0].setActiveItem(window.switchToTabItemAfterChatInviteClose);
					window.switchToTabItemAfterChatInviteClose=null;
				} 
				
   			}
   		},
		items: [
			{
				xtype: 'button',
				text: 'Gruppenchat starten',
			    ui: 'confirm',
			    iconCls: 'team',
			    itemId: 'groupchatstart',
			    margin: '0 10px 0 0'
			},
			{ html: '<br />' },
			{ xtype: 'chatinvitelist' },
			{ html: '<br />' },
			{
				xtype: 'button',
				text: 'Gruppenchat starten',
			    ui: 'confirm',
			    iconCls: 'team',
			    itemId: 'groupchatstart',
			    margin: '0 10px 0 0'
			}
		]
	}
});
