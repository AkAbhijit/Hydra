const { model, Schema } = require('mongoose');

module.exports = model('setup-schema', new Schema({
    _id: {
        type: String,
        required: true,
    },

    channel: {
        type: String,
        required: true,
    },

    setuped: {
        type: Boolean,
        default: false,
    },

    message: {
        type: String,
        required: true,
    },

    moderator: {
        type: String,
        required: true,
    },

    lastUpdated: {
        type: String,
        default: new Date().getDate(),
    },

    logs: {
        type: Array,
        default: null,
    },
}));