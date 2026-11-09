🎃 Spook Booth

A Halloween photobooth that runs entirely in your browser. Allow your webcam, strike a pose, and the booth takes 3 or 6 photos with a countdown and flash. It then builds a classic photo strip that you can customize and download.

LIVE DEMO:https://amazing-liger-a56521.netlify.app

Table of contents
Features
How it works
Getting started
How to use it
Customization options
Project structure
Tech stack
Browser support
Privacy
Deployment
Troubleshooting
Future ideas
Author

Features

1.Webcam capture with a friendly permission screen on entry
2.Countdown and flash: a 3-2-1 countdown, then each photo is taken automatically
3.3-photo or 6-photo strips: a single column of three, or two columns of three
4.Live customization: change the strip colour, photo filter, stickers, caption, date and mirroring, and the strip redraws instantly without retaking photos
5.Upload option: no webcam? Upload photos instead, in as many rounds as you like
6.Remove and retake: click a thumbnail to remove one photo, or retake the whole strip
7.Download as PNG with one click

How it works

The page asks for camera access using the browser's getUserMedia API.
When you start a session, a countdown runs before each photo.
Each frame from the video is copied onto a hidden canvas and stored as a raw photo.
A second canvas draws the finished strip: background colour, framed photos, filter, stickers, caption and date.
Because the raw photos are kept, every customization simply redraws the strip.
Save strip exports the canvas as a PNG file.

How to use it

Click Enter the booth, then Allow camera. Or choose Not now to upload photos instead.
Pick 3 photos or 6 photos.
Click Start photo session and pose for each countdown.
Customize the strip using the options on the right.
Click Save strip to download your PNG.


PROJECT STRUCTURE

spook-booth/
├── index.html   page markup and the SVG haunted-house scene
├── style.css    theme, layout and animations
├── script.js    camera, countdown, strip renderer and saving
└── README.md    this file

Tech stack

HTML5 (including inline SVG)
CSS3 (variables, grid, keyframe animations)
Vanilla JavaScript (no frameworks, no build step)
Browser APIs: getUserMedia, Canvas, File input, Blob downloads
Google Fonts: Creepster and Rubik
Browser support
Works in current versions of Chrome, Edge and Firefox. Photo filters on the saved strip rely on the canvas filter property, which older versions of Safari may not support. In that case the strip is still created, but without the filter.

Privacy
Everything 
runs in your browser. Photos are never sent to a server or stored anywhere. Closing the page clears them.

Future ideas
Custom frames and more sticker packs
Drag-to-position stickers
Share a strip directly from the page
A GIF mode
Halloween theme: animated candle flames, flying ghosts, bats and a haunted-house scene
Reduced motion support: animations switch off for visitors who prefer less motion
