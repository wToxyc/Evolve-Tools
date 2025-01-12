const User = require('../models/User.js');

module.exports = {
    name: 'messageCreate',
    async run(message, client) {
        if (message.author.bot) return;
        if (!message.member) return;

        let user = await User.findOne({ id: message.author.id });
        if (!user) {
            user = new User({ id: message.author.id });
        }

        user.activiy.text += 1;
        await user.save();
    },
};
