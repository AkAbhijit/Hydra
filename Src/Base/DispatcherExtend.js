const { KazagumoPlayer } = require('kazagumo');

module.exports = class PlayerExtends extends KazagumoPlayer {
    /**
     *
     * @param {import("kazagumo").Kazagumo} kazagumo
     * @param {import("shoukaku").Player} dispatcher
     * @param {String} options
     * @param {String} data
     */
    constructor(kazagumo, dispatcher, options) {
        super(kazagumo, dispatcher, options);
        this.filter = false;
        this.speedAmount = 1;
        this.rateAmount = 1;
        this.pitchAmount = 1;
        this.nightcore = false;
        this.vaporwave = false;
        this.bassboostLevel = '';
        this._8d = false;
        this.pop = false;
        this.party = false;
        this.bass = false;
        this.radio = false;
        this.treblebass = false;
        this.soft = false;
        this.electrocic = false;
        this.rock = false;
        this.earrape = false;
        this.message;
        this.autoplay = false;
    }
    async setNowplayingMessage(message) {
        if (this.message) await this.message.delete().catch(() => { });
        return this.message = message;
    }
    /**
     * @returns
     */
    setShuffle() {
        this.shuffle = true;
        this.unshuffle = false;
        const queue = this.queue.map(x => x);
        if (this.shuffle) {
            this.queue.shuffle();
            this.data.set('queue', queue);
        }
        return this;
    }
    /**
     * @returns
     */
    setUnshuffle() {
        this.shuffle = false;
        this.unshuffle = true;
        const queue = this.data.get('queue');
        this.queue.clear();
        this.queue.add(queue);
        this.data.set('queue', null);
        return this;
    }

    async autoplay() {
        if (this.autoplay) return this.autoplay = false;
        return this.autoplay = true;
    }
    changeVoiceChannel(channel) {
        this.voiceId = channel;
        return this;
    }
    setSpeed(amount) {
        if (!amount) return console.error('[Function Error]: Please provide a valid number.');
        if (!this.filter) this.filter = true;
        this.speedAmount = Math.max(Math.min(amount, 5), 0.05);

        this.shoukaku.setFilters({
            op: 'filters',
            guildId: this.guildId,
            timescale: {
                speed: this.speedAmount,
                rate: this.rateAmount,
            },
        });

        return this;
    }

    /**
     *
     * @param {Boolean} value
     */

    setEarrape(value) {
        if (typeof value !== 'boolean') return console.error('eeeeeee');
        this.earrape = value;

        if (this.earrape) {
            if (!this.filter) this.filter = value;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                equalizer: [
                    { band: 0, gain: 0.25 },
                    { band: 1, gain: 0.5 },
                    { band: 2, gain: -0.5 },
                    { band: 3, gain: -0.25 },
                    { band: 4, gain: 0 },
                    { band: 5, gain: -0.0125 },
                    { band: 6, gain: -0.025 },
                    { band: 7, gain: -0.0175 },
                    { band: 8, gain: 0 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0.0125 },
                    { band: 11, gain: 0.025 },
                    { band: 12, gain: 0.375 },
                    { band: 13, gain: 0.125 },
                    { band: 14, gain: 0.125 },
                ],
            });
        } else {
            this.clearfilter();
        }

        return this;
    }

    /**
     *
     * @param {Number} amount
     * @returns {void}

     */

    setPitch(amount) {
        if (typeof amount !== 'number') return console.error('[Function Error]: Please provide a valid number.');
        if (!this.filter) this.filter = true;
        this.pitchAmount = Math.max(Math.min(amount, 5), 0.05);
        this.shoukaku.setFilters({
            op: 'filters',
            guildId: this.guildId,
            timescale: {
                pitch: this.pitchAmount,
                rate: this.rateAmount,
            },
        });

        return this;
    }

    /**
     *
     * @param {Boolean} value
     * @param {"none" | "low" | "medium" | "high"} level
     *
     */

    setBassboost(level) {
        if (typeof level !== 'string') return console.error('eeeeeeeee');

        this.filter = true;
        this.bassboostLevel = level;
        let gain = 0.0;
        if (level === 'none') gain = 0.0;
        else if (level === 'low') gain = 0.10;
        else if (level === 'medium') gain = 0.15;
        else if (level === 'high') gain = 0.25;

        const bands = new Array(3).fill(null).map((_, i) => ({ band: i, gain: gain }));
        this.shoukaku.setFilters({
            op: 'filters',
            guildId: this.guildId,
            equalizer: [bands],
        });
        return this;
    }

    /**
     *
     * @param {Boolean} value
     * @returns {void | this}

     */

    setPop(value) {
        if (typeof value !== 'boolean') return console.error('Type Must be boolean');
        this.pop = value;
        if (this.pop) {
            if (!this.filter) this.filter = value;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                equalizer: [
                    { band: 0, gain: -0.25 },
                    { band: 1, gain: 0.48 },
                    { band: 2, gain: 0.59 },
                    { band: 3, gain: 0.72 },
                    { band: 4, gain: 0.56 },
                    { band: 5, gain: 0.15 },
                    { band: 6, gain: -0.24 },
                    { band: 7, gain: -0.24 },
                    { band: 8, gain: -0.16 },
                    { band: 9, gain: -0.16 },
                    { band: 10, gain: 0 },
                    { band: 11, gain: 0 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                    { band: 14, gain: 0 },
                ],
            });
        } else {
            this.clearfilter();
        }
        return this;
    }

    /**
     *
     * @param {Boolean} value
     * @returns {void | this}

     */

    setParty(value) {
        if (typeof value !== 'boolean') return console.error('Type Must be boolean');
        this.party = value;

        if (this.party) {
            if (!this.filter) this.filter = true;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                equalizer: [
                    { band: 0, gain: -1.16 },
                    { band: 1, gain: 0.28 },
                    { band: 2, gain: 0.42 },
                    { band: 3, gain: 0.5 },
                    { band: 4, gain: 0.36 },
                    { band: 5, gain: 0 },
                    { band: 6, gain: -0.3 },
                    { band: 7, gain: -0.21 },
                    { band: 8, gain: -0.21 },
                ],
            });
        } else {
            this.clearfilter();
        }

        return this;
    }

    /**
     *
     * @param {Boolean} value
     * @returns {void | this}

     */

    setBass(value) {
        if (typeof value !== 'boolean') return;
        this.bass = value;
        if (this.bass) {
            if (!this.filter) this.filter = true;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                equalizer: [
                    { band: 0, gain: 0.6 },
                    { band: 1, gain: 0.7 },
                    { band: 2, gain: 0.8 },
                    { band: 3, gain: 0.55 },
                    { band: 4, gain: 0.25 },
                    { band: 5, gain: 0 },
                    { band: 6, gain: -0.25 },
                    { band: 7, gain: -0.45 },
                    { band: 8, gain: -0.55 },
                    { band: 9, gain: -0.7 },
                    { band: 10, gain: -0.3 },
                    { band: 11, gain: -0.25 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                    { band: 14, gain: 0 },
                ],
            });
        } else {
            this.clearfilter();
        }
        return this;
    }

    /**
     *
     * @param {Boolean} value
     * @returns {void | this}

     */

    setRadio(value) {
        if (typeof value !== 'boolean') return console.error('eeeeee');
        this.radio = value;

        if (this.radio) {
            if (!this.filter) this.filter = true;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                equalizer: [
                    { band: 0, gain: 0.65 },
                    { band: 1, gain: 0.45 },
                    { band: 2, gain: -0.45 },
                    { band: 3, gain: -0.65 },
                    { band: 4, gain: -0.35 },
                    { band: 5, gain: 0.45 },
                    { band: 6, gain: 0.55 },
                    { band: 7, gain: 0.6 },
                    { band: 8, gain: 0.6 },
                    { band: 9, gain: 0.6 },
                    { band: 10, gain: 0 },
                    { band: 11, gain: 0 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                    { band: 14, gain: 0 },
                ],
            });
        } else {
            this.clearfilter();
        }

        return this;
    }

    /**
     *
     * @param {Boolean} value
     * @returns {void | this}

     */

    setTreblebass(value) {
        if (typeof value !== 'boolean') return console.error('Type Must be boolean');
        this.treblebass = value;

        if (this.treblebass) {
            if (!this.filter) this.filter = true;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                equalizer: [
                    { band: 0, gain: 0.6 },
                    { band: 1, gain: 0.67 },
                    { band: 2, gain: 0.67 },
                    { band: 3, gain: 0 },
                    { band: 4, gain: -0.5 },
                    { band: 5, gain: 0.15 },
                    { band: 6, gain: -0.45 },
                    { band: 7, gain: 0.23 },
                    { band: 8, gain: 0.35 },
                    { band: 9, gain: 0.45 },
                    { band: 10, gain: 0.55 },
                    { band: 11, gain: 0.6 },
                    { band: 12, gain: 0.55 },
                    { band: 13, gain: 0 },
                    { band: 14, gain: 0 },
                ],
            });
        } else {
            this.clearfilter();
        }

        return this;
    }

    /**
     *
     * @param {Boolean} value
     * @returns {void | this}

     */

    setSoft(value) {
        if (typeof value !== 'boolean') return console.error('Type Must be boolean');
        this.soft = value;

        if (this.soft) {
            if (!this.filter) this.filter = true;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                equalizer: [
                    { band: 0, gain: 0 },
                    { band: 1, gain: 0 },
                    { band: 2, gain: 0 },
                    { band: 3, gain: 0 },
                    { band: 4, gain: 0 },
                    { band: 5, gain: 0 },
                    { band: 6, gain: 0 },
                    { band: 7, gain: 0 },
                    { band: 8, gain: -0.25 },
                    { band: 9, gain: -0.25 },
                    { band: 10, gain: -0.25 },
                    { band: 11, gain: -0.25 },
                    { band: 12, gain: -0.25 },
                    { band: 13, gain: -0.25 },
                    { band: 14, gain: -0.25 },
                ],
            });
        } else {
            this.clearfilter();
        }
        return this;
    }

    /**
     * @param {Boolean} value
     */

    setElectronic(value) {
        if (typeof value !== 'boolean') return console.error('Type Must be boolean');
        this.electronic = value;
        if (this.electronic) {
            if (!this.filter) this.filter = true;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildIdId,
                equalizer: [
                    { band: 0, gain: 0.375 },
                    { band: 1, gain: 0.350 },
                    { band: 2, gain: 0.125 },
                    { band: 3, gain: 0 },
                    { band: 4, gain: 0 },
                    { band: 5, gain: -0.125 },
                    { band: 6, gain: -0.125 },
                    { band: 7, gain: 0 },
                    { band: 8, gain: 0.25 },
                    { band: 9, gain: 0.125 },
                    { band: 10, gain: 0.15 },
                    { band: 11, gain: 0.2 },
                    { band: 12, gain: 0.250 },
                    { band: 13, gain: 0.350 },
                    { band: 14, gain: 0.400 },
                ],
            });
        } else {
            this.clearfilter();
        }
        return this;
    }

    /**
     *
     * @param {Boolean} value
     */

    setRock(value) {
        if (typeof value !== 'boolean') return console.error('eeeeee');
        this.rock = value;

        if (this.rock) {
            if (!this.filter) this.filter = true;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                equalizer: [
                    { band: 0, gain: 0.300 },
                    { band: 1, gain: 0.250 },
                    { band: 2, gain: 0.200 },
                    { band: 3, gain: 0.100 },
                    { band: 4, gain: 0.050 },
                    { band: 5, gain: -0.050 },
                    { band: 6, gain: -0.150 },
                    { band: 7, gain: -0.200 },
                    { band: 8, gain: -0.100 },
                    { band: 9, gain: -0.050 },
                    { band: 10, gain: 0.050 },
                    { band: 11, gain: 0.100 },
                    { band: 12, gain: 0.200 },
                    { band: 13, gain: 0.250 },
                    { band: 14, gain: 0.300 },
                ],
            });
        } else {
            this.clearfilter();
        }

        return this;
    }

    /**
     *
     * @param {Boolean} value
     */

    setNightCore(value) {
        if (typeof value !== 'boolean') return console.error('[ setNightCore Function Error ]: Please provide a valid value (true/false).');

        if (!this.filter) this.filter = true;
        this.nightcore = value;
        if (this.vaporwave) this.vaporwave = false;

        if (this.nightcore) {
            this.speedAmount = 1.2999999523162842;
            this.pitchAmount = 1.2999999523162842;

            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                timescale: {
                    speed: this.speedAmount,
                    pitch: this.pitchAmount,
                    rate: this.rateAmount,
                },
            });
        } else {
            this.speedAmount = 1;
            this.pitchAmount = 1;
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                timescale: {
                    speed: this.speedAmount,
                    pitch: this.pitchAmount,
                    rate: this.rateAmount,
                },
            });
        }

        return this;
    }

    /**
     *
     * @param {Boolean} value
     */

    setVaporwave(value) {
        if (typeof value !== 'boolean') return console.error('[ setVaporwave Function Error ]: Please provide a valid value (ture/false).');

        if (!this.filter) this.filter = true;
        if (this.nightcore) this.nightcore = false;
        this.vaporwave = value;

        if (this.vaporwave) {
            this.speedAmount = 0.8500000238418579;
            this.pitchAmount = 0.800000011920929;

            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                timescale: {
                    speed: this.speedAmount,
                    pitch: this.pitchAmount,
                    rate: this.rateAmount,
                },
            });
        } else {
            this.speedAmount = 1;
            this.pitchAmount = 1;

            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                timescale: {
                    speed: this.speedAmount,
                    pitch: this.pitchAmount,
                    rate: this.rateAmount,
                },
            });
        }

        return this;
    }

    /**
     *
     * @param {Boolean} value
     */

    set8D(value) {
        if (typeof value !== 'boolean') return console.error('[ set8D Function Error ]: Please provide a valid value (ture/false).');

        if (!this.filter) this.filter = true;
        this._8d = value;

        if (this._8d) {
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                rotation: { rotationHz: 0.2 },
            });
        } else {
            this.shoukaku.setFilters({
                op: 'filters',
                guildId: this.guildId,
                rotation: { rotationHz: 0.0 },
            });
        }

        return this;
    }

    playerMessage(msg) {
        if (this.message) this.message = msg;
    }

    /**
     *
     * @returns {void}
     * Clears all the filter
     */

    clearfilter() {
        this.shoukaku.clearFilters();
        this.speedAmount = 1;
        this.pitchAmount = 1;
        this.rateAmount = 1;
        this.bassboostLevel = '';
        if (this.nightcore) this.nightcore = false;
        if (this.vaporwave) this.vaporwave = false;
        if (this.pop) this.pop = false;
        if (this._8d) this._8d = false;
        if (this.filter) this.filter = false;
        if (this.bass) this.bass = false;
        if (this.party) this.party = false;
        if (this.radio) this.radio = false;
        if (this.soft) this.soft = false;
        if (this.electrocic) this.electrocic = false;
        if (this.rock) this.rock = false;
        if (this.earrape) this.earrape = false;

        this.shoukaku.setFilters({
            op: 'filters',
            guildId: this.guildId,
        });
        return this;
    }
};