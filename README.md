# Bantoufi Discord Bot
Simply a discord bot that plays audio tracks from facebook, youtube and podcast websites 

# Development
For development on Windows you need the following node modules installed globally:
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
npm install --global --production --vs2015 --add-python-to-path windows-build-tools
```

# Deployment to Heroku
1. Create an app in [Discord Developers Portal](https://discord.com/developers/applications)
1. Fork this repository
1. Create an app on [Heroku](https://www.heroku.com)
1. Connect the app with your forked repository <br></br> ![](/screenshots/heroku-connect-repo.png) <br></br>

1. Add these buildpacks: [Ffmpeg buildpack](https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git) and [Puppeteer buildpack](https://github.com/jontewks/puppeteer-heroku-buildpack.git) <br></br> ![](/screenshots/heroku-add-buildpacks.png) <br></br>
1. Configure the environment variables (YouTube API, Bot Token, Owner Id) <br></br> ![](/screenshots/heroku-environment-variables.png) <br></br>
    1. Owner Id is your Discord account id (get it [here](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-))
    1. Bot Token is the token of the bot in your discord application
    1. YouTube API is the key that enables the bot to get YouTube videos, to get it create a project in [Google Developers Console](http://console.developers.google.com/) then generate the key
1. Deploy
1. Get the bot invite link with its permissions
    1. Get the bot permissions <br></br> ![](/screenshots/discord-bot-permissions.png) <br></br>
    1. Get the invite link to your server <br></br> ![](/screenshots/discord-bot-invite-link.png) <br></br>

Check this [video](https://www.youtube.com/watch?v=f3wsxbMbi5M) for a detailed guide
