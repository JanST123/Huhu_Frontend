/**
 * Created by jst on 22.01.14.
 */
Ext.define('Huhu.util.Language', {
    singleton : true,
    alias : 'lang',
    requires: [
        'Huhu.util.Config'
    ],
    config : {},
    phrases: {
        ajax_api_error: {
            de: 'Leider können wir den Huhu Server gerade nicht erreichen... bist du online? Bitte stelle zunächst eine Internetverbindung her oder probiere es in einigen Minuten nochmal. Die App wird nun geschlossen.',
            en: 'Can\'t connect to the Huhu server... are you online? Please check if you are connected to the internet or try again in a few minutes. The app will be closed now.'
        },
        camera: {
            de: 'Kamera',
            en: 'Camera'
        },
        img_choose: {
            de: 'Bild aussuchen',
            en: 'Choose image'
        },
        img_wherefrom: {
            de: 'Woher soll das Bild kommen?',
            en: 'Where to select image from?'
        },
        keypair_short_info: {
            de: 'Dein privater und dein öffentlicher Schlüssel werden auf diesem Gerät erstellt. Der öffentliche Schlüssel wird an unseren Server gesendet, den privaten behälst nur du allein. Somit können deine Chatpartner und wir Nachrichten für dich <b>ver</b>schlüsseln. <b>Ent</b>schlüsseln kann nur der Besitzer des privaten Schlüssels - also Du!',
            en: 'Your private and public key will be created on this device. The public key is sent to out server, the private key is only for you. Because of this we and your chat partners are able to <b>en</b>crypt messages for you. Only the owner of the private key (you!) will be able to <b>de</b>crypt the messages.'
        },
        keypair_short_info_load: {
            de: 'Du hast Deinen privaten Schlüssel hoffentlich in Deiner Dropbox oder manuell woanders gespeichert. Wenn Du Deinen Schlüssel nicht mehr hast, kannst Du zwar jederzeit einen neuen erstellen, jedoch kannst Du keine Nachrichten mehr lesen, welche mit Deinem bisherigen Schlüssel erstellt wurden.',
            en: 'Hopefully you saved your private key to your DropBox or somewhere else manually. If you lost your key you may generate a new one everytime, but you won\'t be able to decode all messages encoded with the old one anymore.'
        },
        photoalbum: {
            de: 'Fotoalbum',
            en: 'Photo library'
        },
        unknown_system_error: {
            de: 'Unbekannter Systemfehler',
            en: 'Unknown system error'
        }

    },

    constructor: function(config) {
    },

    get: function(phrase) {
        if (typeof(this.phrases[phrase][Huhu.util.Config.getLanguage()]) == 'string') {
            return this.phrases[phrase][Huhu.util.Config.getLanguage()];
        } else if (typeof(this.phrases[phrase][Huhu.util.Config.getLanguageDefault()]) == 'string') {
            return this.phrases[phrase][Huhu.util.Config.getLanguageDefault()];
        }

        this.debug('Missing phrase ' + phrase + ', Language: ' + Huhu.util.Config.getLanguage());
        return phrase;
    },

    debug: function(text) {
        if (Huhu.util.Config.getDebug()) {
            console.debug('LANGUAGE-DEBUG: ' + text);
        }
    }


});