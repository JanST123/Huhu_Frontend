Ext.define('Huhu.view.Visibility', {
    extend: 'Ext.form.Panel',
    xtype: 'visibilitypanel',
    requires: [
	           ],
    
	config: {
		styleHtmlContent: true,
		scrollable: 'vertical',
		title: 'Unsichtbar sein',
		layout: 'vbox',
                    items: [
                        {
                        	xtype: 'container',
                        	layout: 'hbox',
                        	flex: 1,
                        	items: [
                        	    {
                        	    	html: '<h3>Verfügbare Kontakte</h3>',
                        	    	flex: 1
                        	    },
                        	    {
                        	    	html: '<h3>Kontakte für die du unsichtbar bist</h3>',
                        	    	flex: 1
                        	    }  
                        	]
                        },
                        {
                        	xtype: 'container',
                        	layout: 'hbox',
                        	flex: 10,
                        	items: [
								{
									xtype: 'list',
									itemId: 'visiblelist',
									emptyText: 'Keine Kontakte verfügbar',
									title: 'Verfügbare Kontakte',
									itemTpl: '{name}',
									store: 'ContactsVisible',
									scrollable: 'vertical',
									onItemDisclosure: true,
									flex: 1
								},
								{
									xtype: 'list',
									cls: 'invisiblelist',
									itemId: 'invisiblelist',
									emptyText: 'Liste ist leer',
									title: 'Kontakte für die du unsichtbar bist',
									itemTpl: '{name}',
									store: 'ContactsInvisible',
									scrollable: 'vertical',
									onItemDisclosure: true,
									flex: 1
								}    
                        	]
                        }
						
                    ]
	}
});
