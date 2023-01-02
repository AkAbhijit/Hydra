const { model, Schema } = require('mongoose');

module.exports = model('announce_schema', new Schema({
    _id: {
        type: String,
        required: true,
    },

    mode: {
        type: Boolean,
        required: true,
    },

    lastUpdated: {
        type: String,
        default: Math.round(new Date().getDate() / 1000),
    },

    prunning: {
        type: Boolean,
        default: false,
    },

    channel: {
        type: String,
        default: null,
    },

    moderator: {
        type: String,
        required: true,
    },
}));