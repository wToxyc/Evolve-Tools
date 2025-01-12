require('dotenv').config();
const { ActivityType } = require('discord.js');
const User = require('../models/User.js');

module.exports = {
    name: 'ready',
    once: true,
    async run(client) {
        console.log('Développé par zed\nRoad to VCT 🔥');

        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const channel = guild.channels.cache.get('1327956364055543828');

        const statuses = [
            'Road to VCT 🏆',
            '/help',
            `${guild.memberCount} membres`
        ];

        let i = 0;

        setInterval(() => {
            client.user.setActivity(statuses[i], { type: ActivityType.Watching });
            i = ++i % statuses.length;

            channel.setName(`🔥・Membres : ${guild.memberCount}`);

            guild.members.cache.filter((member) => member.voice.channel).forEach(async (member) => {
                let user = await User.findOne({ id: member.id });
                if (!user) {
                    user = new User({ id: member.id });
                }
                user.activiy.voice += 60;
                await user.save();
            });
        }, 60 * 10**3);
    }
}