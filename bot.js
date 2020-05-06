const fs = require('fs')

class Bot {
    /***** Properties *****/
    VoiceConnection = null;
    AudioStreamList = null;

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
        sound: (msg) => {
            if(this.VoiceConnection == null) return;

            this.playSound('kekw');
        },

        listen: (msg) => {
            if(!msg.guild) return;
            if(this.VoiceConnection == null) return;

            const user = msg.member.user;

            const audioStream = this.VoiceConnection.receiver.createStream(user.id, { end: 'manual' });
            const outputStream = fs.createWriteStream(process.env.REPOSITORY_PATH + user.username + "_" + new Date().getTime());
            audioStream.pipe(outputStream);

            this.AudioStreamList.push({ user: user, audioStream: audioStream });
        }
    };

    /***** Methods *****/
    initialize() {
        this.VoiceConnection = null;
        this.AudioStreamList = new Array();
    }

    async playSound(fileName) {
        if(this.VoiceConnection == null) return;

        const dispatcher = await this.VoiceConnection.play(process.env.REPOSITORY_PATH + fileName + '.mp3', { volume: 0.5 });
    }
}

module.exports = new Bot();