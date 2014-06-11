<?php
$imageWidth=14;
$imageHeight=16;
$outputFile='smilie_map.png';
$images=Array(
	'smilie_smile.png',
	'smilie_sad.png',
	'smilie_thung.png',
	'smilie_cry.png',
	'smilie_wow.png',
	'smilie_grin.png',
	'smilie_twinker.png',
);

// create output images
out('Creating output image...');
$outputImg=imagecreatetruecolor(count($images) * $imageWidth, $imageHeight);
imagecolorallocatealpha($outputImg, 0, 0, 0, 127);
imagealphablending($outputImg, false);

imagesavealpha($outputImg, TRUE);
out('Created!');

// open the images
out('Openening Images and add them to output image...');

$offset=0;
foreach ($images as $img) {
	$imgObj=imagecreatefrompng($img);
	out('Successfully opened '.$img);
	
	imagecopy($outputImg, $imgObj, $offset, 0, 0, 0, $imageWidth, $imageHeight);
	$offset+=$imageWidth;
	out('Added '.$img.' to output image');
}

// output image
imagepng($outputImg, $outputFile);
out('Outputted Image to '.dirname(__FILE__).'/'.$outputFile);




function out($text) {
	echo "\n".$text;
}
