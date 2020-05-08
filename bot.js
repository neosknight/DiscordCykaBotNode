const fs = require('fs')
const ffmpegPath = require('ffmpeg-static')
const shell = require('shelljs')
const axios = require('axios')

class VoiceStream {
    user = null;
    audioStream = null;
    buffer = null;
    isConverting = false;
    
    bufferSize = 1024 * 500;
    bufferLength = 0;

    bot = null;

    constructor(user, audioStream, bot) {
        this.user = user;
        this.audioStream = audioStream;
        this.bot = bot;
        this.buffer = new Buffer(this.bufferSize);
    
        this.initializeBuffer();
        this.wireEvents();
    }

    initializeBuffer() {
        this.bufferLength = 0;
    }

    wireEvents() {
        this.audioStream.on('data', async (chunk) => {
            this.buffer = this.buffer.slice(chunk.length);
            this.buffer = Buffer.concat([this.buffer, chunk], this.bufferSize);
            this.bufferLength += chunk.length;

            if(this.bufferLength >= this.bufferSize && !this.isConverting) {
                this.isConverting = true;
                console.log(this.bufferLength, this.bufferSize);
                const wavData = await this.convertToWav();
            }
        });
    }

    convertToWav() {
        return new Promise(resolve => {
            const fileName = 'recording_' + new Date().getTime() + '_' + Math.floor(Math.random() * 101);
            
            fs.writeFile(process.env.RECORDINGS_PATH + fileName, this.buffer, () => {
                shell.exec(ffmpegPath + ' -f s32le -ar 44100 -ac 1 -i ' + process.env.RECORDINGS_PATH + fileName + ' ' + process.env.CONVERTED_RECORDINGS_PATH + fileName +'.wav',
                async (error, stdout, stderr) => {
                    await this.bot.onVoiceReceived(process.env.CONVERTED_RECORDINGS_PATH + fileName +'.wav');
                    this.initializeBuffer();

                    this.isConverting = false;
                    resolve(process.env.CONVERTED_RECORDINGS_PATH + fileName +'.wav');
                });
            });
        });
    }
}

class Bot {
    /***** Properties *****/
    VoiceConnection = null;
    VoiceStreamList = null;

    /***** Commands *****/
    commands = {
        // cyka - BLYAT
        cyka: (msg) => {
            msg.reply('BLYAT');
        },
        
        // Join voice channel
        join: async (msg) => {
            if(!msg.guild) return;
    
            if(msg.member.voice.channel) {
                this.VoiceConnection = await msg.member.voice.channel.join();

                await this.playSound('lakad');
            }
            else {
                msg.reply('You need to be in a voice channel first!');
            }
        },

        // Play sound to voice channel
        sound: (msg, args) => {
            if(this.VoiceConnection == null) return;
            this.playSound(args[0]);
        },

        convertLast: (msg) => {
            fs.readdir(process.env.RECORDINGS_PATH, (err, files) => {
                var latestFile = null;
                var latestNumber = 0;

                files.forEach(file => {
                    var fileSeconds = file.substring(file.lastIndexOf("_") + 1);
                    if(fileSeconds > latestNumber)
                    {
                        latestFile = file;
                        latestNumber = fileSeconds;
                    }
                });
                shell.exec(ffmpegPath + ' -f s32le -ar 44100 -ac 1 -i ' + 
                //Input
                process.env.RECORDINGS_PATH + latestFile + ' ' + 
                //Output
                process.env.CONVERTED_RECORDINGS_PATH + latestFile +'.wav')
              });
        },

        listen: (msg) => {
            if(!msg.guild) return;
            if(this.VoiceConnection == null) return;

            const user = msg.member.user;

            const audioStream = this.VoiceConnection.receiver.createStream(user.id, { end: 'manual', mode: 'pcm' });
            const outputStream = fs.createWriteStream(process.env.RECORDINGS_PATH + user.username + "_" + new Date().getTime());
            audioStream.pipe(outputStream);

            this.VoiceStreamList.push(new VoiceStream(user, audioStream, this));
        }
    };

    /***** Methods *****/
    initialize() {
        this.VoiceConnection = null;
        this.VoiceStreamList = new Array();
    }

    async playSound(fileName) {
        if(this.VoiceConnection == null) return;

        const dispatcher = await this.VoiceConnection.play(process.env.REPOSITORY_PATH + "playsounds/" + fileName + '.mp3', { volume: 0.5 });
    }

    async onVoiceReceived(filePath) {
        // Send data to API
        fs.readFile(filePath, async (err, wavData) => {
            console.log(wavData);
            const response = await axios.post('https://api.wit.ai/speech?v=20170307', wavData.buffer, {
                headers: {
                    'Authorization': 'Bearer L4K5QXNUPCM7HP6RYVGDBPUZYS6TRS3X',
                    'Content-Type': 'audio/wav'
                }
            }).catch((e) => { console.log(e); });
    
            const data = response.data;
            console.log(data);

            // Process recognized entities
            if(data.entities.laugh != undefined) {
                this.playSound('kekw');
            }

            try {
                fs.unlink(filePath, () => {});
            }
            catch(e) { console.log(e); }
        });

    }
}

module.exports = new Bot();