Ext.define('Huhu.util.Chat', {
    singleton : true,
    config: {
        chatRecipients: {}
    },

    /**
     * sends a message to a chat
     * @param chatId
     * @param message
     */
    sendMessage: function(chatId, message) {
        // do we have all users with their keys in the chat?
        var recipients=this.getChatRecipients();

        if (typeof(recipients) != 'object' || typeof(recipients[chatId]) != 'object') {
            // fetch chatusers incl. their public keys

            Ext.Ajax.request({
                url: Huhu.util.Config.getApiUrl() + 'chat/get-chat-recipients',
                params: { chatid: chatId },
                scope: this,
                success: function(response) {
                    var reader=Ext.create('Ext.data.reader.Json');
                    var data=reader.getResponseData(response);

                    if (data.success) {
                        var recipients=this.getChatRecipients();
                        if (typeof(recipients) != 'object') recipients={};

                        recipients[chatId]=data.recipients;
                        this.setChatRecipients(recipients);
                        this.sendMessageDo(chatId, recipients[chatId], message);
                    }
                }
            });
        } else {
            this.sendMessageDo(chatId, recipients[chatId], message);
        }
    },
    sendMessageDo: function(chatId, recipients, message) {
        var messages={};


        // for each user in the chat, encode the message with the correct public key
        for (var userid in recipients) {
            messages[userid]=this.messageEncode(message, recipients[userid]);
        }

        Ext.Ajax.request({
            url: Huhu.util.Config.getApiUrl() + 'chat/push',
            params: {
                chatid: chatId,
                messages: Ext.encode(messages)
            }
        });
    },

    /**
     * Decrypts a message with private key
     * @param encryptedMessage
     * @returns {*}
     */
    messageDecode: function(encryptedMessage) {
        var encrypt=new JSEncrypt();
        var privkey=Huhu.util.Config.getPrivateKey();

        if (Ext.isEmpty(privkey)) {
            Huhu.util.User.recoverPrivateKey();
        } else {
            encrypt.setPrivateKey(privkey);
            var d=encrypt.decrypt(encryptedMessage);
            if (!d) {
                d='** Kann nicht entschlüsselt werden **';
            }
            return d;
        }

        return false;
    },

    /**
     * Encrypts a message with the given public key of the recipient
     * @param message
     * @param publicKey
     * @returns {string}
     */
    messageEncode: function(message, publicKey) {
        var encrypt=new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        return encrypt.encrypt(message);
    }





});