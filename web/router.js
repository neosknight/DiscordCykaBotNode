const express = require('express');
var expressApp = express();

//Multer
var multer  = require('multer')
var upload = multer({ dest: 'repository/temp' })

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
        
        
        expressApp.post('/playsounds/upload', upload.single('playsound'), (req, res) => {
            
            if(req.file.originalname.indexOf(".mp3") != -1)
                fs.rename(req.file.path, process.env.REPOSITORY_PATH + "playsounds/" + req.file.originalname, function (err) {
                    res.redirect('/playsounds');
                });
            else
                res.redirect('/playsounds');
            
        });

        expressApp.post('/playsounds/:playsound', (req, res) => {
            this.Bot.commands["sound"](null, [req.params.playsound]);
        });


        expressApp.listen(3000);
    }

}

module.exports = new Router();