Ext.define('Huhu.view.KeyLoad', {
	extend: 'Ext.Container',
	xtype: 'keyloadpanel',
	config: {
		title: 'Privaten Schlüssel laden',
        layout: 'vbox',
		styleHtmlContent: true,
		scrollable: 'vertical',
		items: [
                { html: '<h3>Lade Deinen privaten Schlüssel um Deine Nachrichten entschlüsseln zu können.</h3><br />' },
                {
                    xtype: 'list',
                    fullscreen: false,
                    itemId: 'keyloadlist',
                    flex: 1,
                    itemTpl: '<strong>{title}</strong><br /><i>{description}</i>',
                    onItemDisclosure: true,
                    data: [
                        {
                            title: 'DropBox',
                            description: 'Du hast deinen Schlüssel in Deiner DropBox gespeichert? Super - dann kannst Du ihn hier laden.'
                        },
                        {
                            title: 'Anderer Speicherort',
                            description: 'Du hast Deinen Schlüssel manuell woanders gespeichert? Dann kannst Du ihn hier wieder hochladen.'
                        },
                        {
                            title: 'Neues Schlüsselpaar generieren',
                            description: 'Du hast Deinen Schlüssel verloren, er ist jemand anderem in die Hände gefallen oder möchtest einfach einen neuen generieren?<br />Kein Problem, jedoch kannst du alle Nachrichten, die bisher für deinen bisherigen Schlüssel verschlüsselt wurden nicht mehr lesen.'
                        }
                    ]
                },
                { html: '<br /><span><i>' + Huhu.util.Language.get('keypair_short_info_load') + '</i></span>' }


		       
		]
	}
});
