const fs = require('fs')

module.exports = {
    /***** Properties *****/
    VoiceConnection: null,
    AudioStreamList: null,

    /***** Commands *****/
    commands: {
        // cyka - BLYAT
        cyka: (msg) => {
            msg.reply('BLYAT');
        },
        
        // Join voice channel
        join: async (msg) => {
            if(!msg.guild) return;
    
            if(msg.member.voice.channel) {
                this.VoiceConnection = await msg.member.voice.channel.join();
            }
            else {
                msg.reply('You need to be in a voice channel first!');
            }
        },

        // Play sound to voice channel
        sound: (msg) => {
            if(this.VoiceConnection == null) return;

            const dispatcher = this.VoiceConnection.play(process.env.REPOSITORY_PATH + 'kekw.mp3', { volume: 0.5 });
        },

        listen: (msg) => {
            if(!msg.guild) return;
            if(this.VoiceConnection == null) return;

            const user = msg.member.user;

            const audioStream = this.VoiceConnection.receiver.createStream(user.id, { end: 'manual' });
            const outputStream = fs.createWriteStream(process.env.REPOSITORY_PATH + user.username + "_" + new Date().getTime());
            audioStream.pipe(outputStream);
            
            audioStream.on('data', (chunk) => {
                console.log(`Received ${chunk.length} bytes of data.`);
            });
            audioStream.on('end', () => { console.log("Stopped listening"); })
            outputStream.on('data', (data) => { console.log(data); });

            this.AudioStreamList.push({ user: user, audioStream: audioStream });
        }
    },
    
    /***** Methods *****/
    initialize: () => {
        this.AudioStreamList = new Array();
    }
}