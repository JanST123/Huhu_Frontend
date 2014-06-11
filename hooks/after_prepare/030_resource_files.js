#!/usr/bin/env node

//
// This hook copies various resource files from our version control system directories into the appropriate platform specific location
//


// configure all the files to copy.  Key of object is the source file, value is the destination location.  It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
var filestocopy = [{
    "../../../icons/icon.png": "platforms/android/res/drawable/icon.png"
}, {
    "../../../icons/android/icon-72-hdpi.png": "platforms/android/res/drawable-hdpi/icon.png"
}, {
    "../../../icons/android/icon-36-ldpi.png": "platforms/android/res/drawable-ldpi/icon.png"
}, {
    "../../../icons/android/icon-48-mdpi.png": "platforms/android/res/drawable-mdpi/icon.png"
}, {
    "../../../icons/android/icon-96-xhdpi.png": "platforms/android/res/drawable-xhdpi/icon.png"
},
//{
//    "config/android/res/drawable/splash.png": "platforms/android/res/drawable/splash.png"
//}, {
//    "config/android/res/drawable-hdpi/splash.png": "platforms/android/res/drawable-hdpi/splash.png"
//}, {
//    "config/android/res/drawable-ldpi/splash.png": "platforms/android/res/drawable-ldpi/splash.png"
//}, {
//    "config/android/res/drawable-mdpi/splash.png": "platforms/android/res/drawable-mdpi/splash.png"
//}, {
//    "config/android/res/drawable-xhdpi/splash.png": "platforms/android/res/drawable-xhdpi/splash.png"
//},
 {
    "../../../icons/ios/icon-40.png": "platforms/ios/Huhu/Resources/icons/icon-40.png"
},{
    "../../../icons/ios/icon-50-2x.png": "platforms/ios/Huhu/Resources/icons/icon-50@2x.png"
},{
    "../../../icons/ios/icon-60.png": "platforms/ios/Huhu/Resources/icons/icon-60.png"
},{
    "../../../icons/ios/icon-50.png": "platforms/ios/Huhu/Resources/icons/icon-50.png"
},{
    "../../../icons/ios/icon-60-2x.png": "platforms/ios/Huhu/Resources/icons/icon-60@2x.png"
},{
    "../../../icons/ios/icon-small.png": "platforms/ios/Huhu/Resources/icons/icon-small.png"
},{
    "../../../icons/ios/icon-small-2x.png": "platforms/ios/Huhu/Resources/icons/icon-small@2x.png"
}, {
    "../../../icons/icon.png": "platforms/ios/Huhu/Resources/icons/icon.png"
}, {
    "../../../icons/icon-2x.png": "platforms/ios/Huhu/Resources/icons/icon@2x.png"
}, {
    "../../../icons/ios/icon-72-2x.png": "platforms/ios/Huhu/Resources/icons/icon-72@2x.png"
}, {
    "../../../icons/ios/icon-40-2x.png": "platforms/ios/Huhu/Resources/icons/icon-40@2x.png"
}, {
    "../../../icons/ios/icon-76.png": "platforms/ios/Huhu/Resources/icons/icon-76.png"
}, {
     "../../../icons/ios/icon-76-2x.png": "platforms/ios/Huhu/Resources/icons/icon-76@2x.png"
}, {
    "../../../icons/ios/splash-ios-default-2x.png": "platforms/ios/Huhu/Resources/splash/Default@2x~iphone.png"
}, {
    "../../../icons/ios/splash-ios-568h-2x.png": "platforms/ios/Huhu/Resources/splash/Default-568h@2x~iphone.png"
}, {
    "../../../icons/ios/splash-default-iphone.png": "platforms/ios/Huhu/Resources/splash/Default~iphone.png"
}, {
    "../../../icons/ios/splash-ios-ipad-portrait.png": "platforms/ios/Huhu/Resources/splash/Default-Portrait~ipad.png"
}, {
    "../../../icons/ios/splash-ios-retinaipad-portrait.png": "platforms/ios/Huhu/Resources/splash/Default-Portrait@2x~ipad.png"
}, {
    "../../../icons/ios/splash-ios-ipad-landscape.png": "platforms/ios/Huhu/Resources/splash/Default-Landscape~ipad.png"
}, {
    "../../../icons/ios/splash-ios-retinaipad-landscape.png": "platforms/ios/Huhu/Resources/splash/Default-Landscape@2x~ipad.png"
}
];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
        }
    });
});
