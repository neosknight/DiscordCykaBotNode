module.exports = {
    /***** Properties *****/
    VoiceConnection: null,

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
        }
    }
    
    /***** Methods *****/
}