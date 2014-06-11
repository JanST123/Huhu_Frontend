Ext.define('Huhu.util.Image', {
    static: true,
    config: {},

    /**
     * Captures a picture from the camera or gallery and posts it to the given url
     * @param postUrl
     * @param additionalPostData
     * @param targetWidth
     * @param targetHeight
     */
    uploadImage: function(postUrl, additionalPostData, targetWidth, targetHeight, successCallback, errorCallback) {
        var options={
            destinationType: Camera.DestinationType.FILE_URI,
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: targetWidth,
            targetHeight: targetHeight,
            saveToPhotoAlbum: false,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation:false,
            cameraDirection: Camera.Direction.BACK
        };


        Ext.Msg.show({
            title: Huhu.util.Language.get('img_choose'),
            message: Huhu.util.Language.get('img_wherefrom'),
            buttons: [
                { text: Huhu.util.Language.get('camera'), itemId: 'camera' },
                { text: Huhu.util.Language.get('photoalbum'), itemId: 'library' }
            ],
            fn: function(buttonId, value, opt) {

                var source=Camera.PictureSourceType.PHOTOLIBRARY;
                if (buttonId=='camera') {
                    options.sourceType=Camera.PictureSourceType.CAMERA;
                } else {
                    options.sourceType=Camera.PictureSourceType.PHOTOLIBRARY;
                }


                navigator.camera.getPicture(
                    function(imageFile) {
                        var uploadOptions = new FileUploadOptions();
                        uploadOptions.fileKey="file";
                        uploadOptions.fileName=imageFile.substr(imageFile.lastIndexOf('/')+1);
                        uploadOptions.mimeType="text/plain";

                        if (typeof(additionalPostData) != 'object') additionalPostData=new Object();

                        uploadOptions.params = additionalPostData;

                        var ft = new FileTransfer();



                        ft.upload(imageFile, encodeURI(postUrl),
                            successCallback,
                            errorCallback,
                            uploadOptions,
                            true
                        );
                    },
                    errorCallback,
                    options);
            }
        });
    }


});