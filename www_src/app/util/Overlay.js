/**
 * Created by jst on 22.01.14.
 */
Ext.define('Huhu.util.Overlay', {
    singleton : true,
    alias : 'overlay',
    requires: [

    ],
    config : {},


    constructor: function(config) {
    },

    /**
     * Shows an overlay
     * @param string itemId
     * @param string title
     * @param array items
     * @param boolean hidden (initially hidden)
     */
    show: function(itemId, title, items, hidden) {
        overlay = Ext.Viewport.add({
            xtype: 'panel',

            itemId: itemId,

            // We give it a left and top property to make it floating by default
            left: 10,
            top: 10,

            // Make it modal so you can click the mask to hide the overlay
            modal: true,
            hideOnMaskTap: true,

            // Make it hidden by default
            hidden: hidden,

            // Set the width and height of the panel
            width: '80%',
            height: '70%',

            // Here we specify the #id of the element we created in `index.html`
            contentEl: 'content',

            // Style the content and make it scrollable
            styleHtmlContent: true,
            scrollable: true,

            // Insert a title docked at the top with a title
            items: [
                {
                    docked: 'top',
                    xtype: 'toolbar',
                    title: title
                },
                {
                    xtype: 'container',
                    items: items
                }
            ]
        });

        return overlay;
    }




});