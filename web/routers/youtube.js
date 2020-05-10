class YoutubeRouter{
    
    Bot = null;
    expressApp = null;

    initialize(Bot, expressApp) {
        this.Bot = Bot;
        this.expressApp = expressApp;

        expressApp.get('/youtube', (req, res) => {
            var volume = Bot.currentDispatcher == null ? 0 : Bot.currentDispatcher.streams.volume.volume;
            var active = Bot.isYoutubeActive;
            res.render('youtube', { queue: Bot.youtubeQueue, volume :  volume, active: active });
        });
        expressApp.post('/youtube/play/:mode', (req, res) => {
            if(Bot.currentDispatcher != null)
                if(req.params.mode == 1)
                    Bot.currentDispatcher.resume();
                else
                    Bot.currentDispatcher.pause();
        });
        expressApp.post('/youtube/volume/:volume', (req, res) => {
            var volume = req.params.volume;

            if(Bot.currentDispatcher != null)
                Bot.currentDispatcher.setVolume(volume);
            
            res.end();
        });

        expressApp.post('/youtube/add', (req, res) => {
            Bot.youtubeQueue.push(req.body.link);
            res.redirect('/youtube');
        });

        expressApp.post('/youtube/delete/:index', (req, res) => {
            Bot.youtubeQueue.splice(req.params.index, 1);
            res.redirect('/youtube');
        });

        expressApp.post('/youtube/power/:power', (req, res) => {
            var power = req.params.power == "1" ? "on" : "off";
            this.Bot.commands["youtube"](null, [power]);
            this.Bot.isYoutubeActive = req.params.power == "1";
            res.redirect('/youtube');
        });
    }

}

module.exports = new YoutubeRouter();