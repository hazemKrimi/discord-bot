# Bantoufi Discord Bot
Simply a discord bot that plays audio tracks from facebook, youtube and podcast websites 

# Development
For development you need the following node modules installed globally:
* node-gyp
```
npm install -g node-gyp
```
* node-pre-gyp
```
npm install -g node-pre-gyp
```
* patch-package
```
npm install -g patch-package
```
* windows-build-tools
```
npm install --g --production --vs2015 --add-python-to-path windows-build-tools
```

# Deployment to Heroku
1. Fork this repository
1. Create an app on Heroku
1. Connect the app with your forked repository
1. Add these buildpacks: [Ffmpeg buildpack](https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git) and [Puppeteer buildpack](https://github.com/jontewks/puppeteer-heroku-buildpack.git)
1. Deploy

Check this [video](https://www.youtube.com/watch?v=f3wsxbMbi5M) for a detailed guide
