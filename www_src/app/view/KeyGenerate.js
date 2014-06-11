Ext.define('Huhu.view.KeyGenerate', {
	extend: 'Ext.Container',
	xtype: 'keygeneratepanel',
	config: {
		title: 'Neues Schlüsselpaar erstellen',
        layout: 'vbox',
		styleHtmlContent: true,
		scrollable: 'vertical',
		items: [
                { html: '<h3>Da du noch kein Schlüsselpaar besitzt, erzeugen wir dir jetzt eines.</h3>' },
		        { html: '<div id="createKeyStatus"></div>' },
                { html: '<br /><span><i>' + Huhu.util.Language.get('keypair_short_info') + '</i></span>' }


		       
		]
	}
});
