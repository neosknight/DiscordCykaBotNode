const fs = require('fs')
const ffmpegPath = require('ffmpeg-static')
const shell = require('shelljs')
const axios = require('axios')

class VoiceStream {
    user = null;
    audioStream = null;
    buffer = null;
    
    bufferSize = 1024 * 280;
    bufferLength = 0;

    onVoiceReceived = null;

    constructor(user, audioStream, onVoiceReceived = null) {
        this.user = user;
        this.audioStream = audioStream;
        this.onVoiceReceived = onVoiceReceived;
        this.buffer = new Array(this.bufferSize);
    
        this.initializeBuffer();
        this.wireEvents();
    }

    initializeBuffer() {
        this.bufferLength = 0;
        this.buffer.forEach((e, i) => { this.buffer[i] = 0; });
    }

    wireEvents() {
        this.audioStream.on('data', async (chunk) => {
            this.buffer = this.buffer.slice(chunk.length).concat(chunk);
            this.bufferLength += chunk.length;

            if(this.bufferLength >= this.bufferSize) {
                await this.onVoiceReceived(this.buffer);

                this.initializeBuffer();
            }
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

            this.VoiceStreamList.push(new VoiceStream(user, audioStream, this.onVoiceReceived));
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

    async onVoiceReceived(buffer) {
        // Send data to API
        console.log(buffer);
    }
}

module.exports = new Bot();