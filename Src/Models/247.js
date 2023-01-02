const { model, Schema } = require('mongoose');

module.exports = model('247-schema', new Schema({
    _id: {
        type: String,
        required: true,
    },
    mode: {
        type: Boolean,
        required: true,
    },
    textChannel: {
        type: String,
        default: null,
    },
    voiceChannel: {
        type: String,
        default: null,
    },
    moderator: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: String,
        default: Math.round(new Date().getDate() / 1000),
    },
}));
