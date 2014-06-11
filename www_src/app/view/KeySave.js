Ext.define('Huhu.view.KeySave', {
	extend: 'Ext.Container',
	xtype: 'keysavepanel',
	config: {
		title: 'Privaten Schlüssel sichern',
        layout: 'vbox',
		styleHtmlContent: true,
		scrollable: 'vertical',
		items: [
                { html: '<h3>Bitte sichere Deinen privaten Schlüssel, da nur Du diesen besitzt.</h3><br />' },
                {
                    xtype: 'list',
                    fullscreen: false,
                    itemId: 'keysavelist',
                    flex: 1,
                    itemTpl: '<strong>{title}</strong><br /><i>{description}</i>',
                    onItemDisclosure: true,
                    data: [
                        {
                            title: 'DropBox',
                            description: 'Das ist die komfortabelste Methode. Wenn du einen DropBox Account hast kannst du den Schlüssel dort speichern.<br /> Wenn Du mal an einem anderen Gerät sitzt, kannst du den privaten Schlüssel einfach aus Deiner DropBox laden.'
                        },
                        {
                            title: 'Download',
                            description: 'Hier kannst du den erstellten Schlüssel herunterladen und selbst entscheiden wo du den Schlüssel speicherst. Allerdings musst du den Schlüssel dann nach jedem Neustart der App zur Hand haben.'
                        },
                        {
                            /* !!!ATTENTION!!! TEXT IS CHANGED DEPENDING IF KEY ACTUALLY SAVED in controller/Settings.js settingsKeySaveButton event */
                            title: 'Auf diesem Gerät speichern',
                            description: 'Diese Methode solltest du nur auf deinem privaten Smartphone, Tablet oder PC nutzen, sprich nur da wo normalerweise nur du rankommst. Alles andere wäre extremst unsicher!!'
                        }
                    ]
                },
                { html: '<br /><span><i>' + Huhu.util.Language.get('keypair_short_info') + '</i></span>' }
		]
	}
});
