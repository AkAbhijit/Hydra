const { fetch } = require('undici');
const BASE_URL = 'https://api.spotify.com/v1';

module.exports = class Spotify {
    /**
     * 
     * @param {import('./Client').Savaan} client 
     */
    constructor(client) {
        this.client_id = client.config.spotify.ID;
        this.client_secret = client.config.spotify.Secret;
        this.token = '';
        this.authorizations = `Basic ${Buffer.from(`${this.client_id}:${this.client_secret}`).toString('base64')}`;
        this.nextRefresh = '';
    }
    async makeRequest(endpoint) {
        const res = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: { Authorization: `Bearer ${this.token}`, },
        });
        const data = await res.json();
        return data;
    }

    async refresh() {
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: this.authorizations,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });
        const data = await res.json();
        this.token = data.access_token;
        this.nextRefresh = Date.now() + data.expires_in;
        if (!data.access_token) await this.checker()
    }
    /**
     *
     * @param {String} id
     * @returns
     */
    async getTrack(id) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        return await this.makeRequest(`tracks/${id}`);
    }
    
    async getRecommendations(seed_artists, seed_tracks, limit) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        return await this.makeRequest(`recommendations?seed_artists=${seed_artists}&seed_tracks=${seed_tracks}&limit=${limit}`);
    }
  
    async search(query) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        const data = await this.makeRequest(`search?q=${decodeURIComponent(query)}&limit=1&type=track`);
        return data.tracks.items[0].external_urls.spotify;
    }
}