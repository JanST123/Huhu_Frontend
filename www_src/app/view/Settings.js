Ext.define('Huhu.view.Settings', {
	extend: 'Ext.navigation.View',
	xtype: 'settingspanel',
	requires: [
	           'Huhu.view.Profile',
	           'Huhu.view.Visibility',
	           'Huhu.view.Logout',
               'Huhu.view.KeyGenerate',
               'Huhu.view.KeyLoad',
               'Huhu.view.KeySave'
	],
	
	config: {
		title: 'Einstellungen',
		defaultBackButtonText: 'Zurück',
		styleHtmlContent: true,
		scrollable: 'vertical',
		items: [
		       {
		    	   xtype: 'container',
		    	   title: 'Einstellungen',
		    	   layout: 'vbox',
		    	   items: [
		    	           { 
		    	        	   html: '<br />'
		    	           },
		    	           {
		    	        	   xtype: 'togglefield',
		    	        	   itemId: 'globalInvisible',
		    	        	   label: 'Komplett unsichtbar sein?'
		    	           },
		    	           {
		                       xtype: 'button',
		                       text: 'Sichtbarkeit für bestimmte User',
		                       iconCls: 'locate',
		                       itemId: 'settingsVisibility'
		                   },
		                   { 
		    	        	   html: '<br />'
		    	           },
		    	           {
		                       xtype: 'button',
		                       text: 'Profil ändern',
		                       iconCls: 'user',
		                       itemId: 'settingsProfile'
		                   },
                           {
                               html: '<br />'
                           },
                           {
                               xtype: 'button',
                               text: 'Privaten Schlüssel sichern',
                               iconCls: 'key',
                               itemId: 'settingsKeySave'
                           },
                           {
                               html: '<br />'
                           },
                           {
                               xtype: 'button',
                               text: 'Privaten Schlüssel laden',
                               iconCls: 'key',
                               itemId: 'settingsKeyLoad'
                           },
		                   { 
		    	        	   html: '<br />'
		    	           },
		    	           {
		                       xtype: 'button',
		                       text: 'Ausloggen',
		                       iconCls: 'delete',
		                       ui: 'decline',
		                       itemId: 'settingsLogout'
		                   }
		    	   ]
		       }
		],
		listeners: {
	        show: function() {
	        	Huhu.util.Config.setActiveNavigationView(Ext.ComponentQuery.query('settingspanel')[0]);
	        }
		}
	}
});
