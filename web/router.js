const express = require('express');
var expressApp = express();

const fs = require('fs');

class Router{
    
    Bot = null;

    initialize(Bot) {
        this.Bot = Bot;
        expressApp.set('view engine', 'pug');
        expressApp.set('views', process.cwd() + '/web/pages/');
        expressApp.use(express.static('web/public'))

        expressApp.get('/playsounds', (req, res) => {
            fs.readdir(process.env.REPOSITORY_PATH + "playsounds/", (err, files) => {
                res.render('playsounds', { files: files });
              });
        });
        expressApp.post('/playsounds/:playsound', (req, res) => {
            this.Bot.commands["sound"](null, [req.params.playsound]);
        });

        expressApp.listen(3000);
    }

}

module.exports = new Router();