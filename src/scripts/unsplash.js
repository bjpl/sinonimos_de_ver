/**
 * Unsplash API Integration
 * Handles image fetching with elegant fallbacks
 */

class UnsplashService {
    constructor() {
        // Public Unsplash API endpoint (demo purposes)
        // For production, use your own API key from https://unsplash.com/developers
        this.accessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with actual key
        this.apiUrl = 'https://api.unsplash.com';

        // Fallback to curated collection for demo without API key
        this.useSource = !this.accessKey || this.accessKey === 'YOUR_UNSPLASH_ACCESS_KEY'
            ? 'source'
            : 'api';
    }

    /**
     * Get a random hero image
     */
    async getHeroImage() {
        const query = 'vision,perspective,view,landscape';
        return this.getImage(query, 'landscape');
    }

    /**
     * Get image for a specific synonym context
     * @param {string} verb - The synonym verb
     * @param {string} context - Additional context for the search
     */
    async getImageForVerb(verb, context = '') {
        const searchQuery = this.buildSearchQuery(verb, context);
        return this.getImage(searchQuery, 'portrait');
    }

    /**
     * Build search query based on verb meaning
     */
    buildSearchQuery(verb, context) {
        const verbImageMap = {
            'observar': 'observation,watching,attention,focus',
            'contemplar': 'contemplation,meditation,peaceful,serene',
            'avistar': 'horizon,distance,discovery,exploration',
            'divisar': 'landscape,vista,panorama,viewpoint',
            'percibir': 'awareness,perception,senses,consciousness',
            'advertir': 'alert,warning,attention,notice',
            'notar': 'detail,close-up,texture,pattern',
            'distinguir': 'contrast,difference,clarity,precision',
            'apreciar': 'appreciation,beauty,art,value',
            'vislumbrar': 'glimpse,light,possibility,hope',
            'atisbar': 'peek,window,curiosity,discovery',
            'ojear': 'glance,quick,browse,scan',
            'examinar': 'inspection,analysis,magnifying,detail',
            'inspeccionar': 'investigation,scrutiny,examination',
            'escudriñar': 'search,investigate,explore,research',
            'mirar': 'eye,gaze,vision,sight',
            'echar un vistazo': 'quick,glance,casual,browse',
            'presenciar': 'witness,event,moment,presence',
            'asistir': 'audience,gathering,event,participation',
            'contemplarse': 'reflection,mirror,self,identity'
        };

        const baseQuery = verbImageMap[verb.toLowerCase()] || 'vision,sight,view,perspective';
        return context ? `${baseQuery},${context}` : baseQuery;
    }

    /**
     * Get image from Unsplash
     */
    async getImage(query, orientation = 'landscape') {
        if (this.useSource === 'source') {
            // Use Unsplash Source (no API key required, but limited control)
            return this.getImageFromSource(query, orientation);
        } else {
            // Use Unsplash API (requires API key, more control)
            return this.getImageFromAPI(query, orientation);
        }
    }

    /**
     * Get image using Unsplash Source (simpler, no API key)
     */
    getImageFromSource(query, orientation) {
        const width = orientation === 'landscape' ? 1600 : 800;
        const height = orientation === 'landscape' ? 900 : 1200;

        // Extract first keyword for source
        const keyword = query.split(',')[0];

        return {
            url: `https://source.unsplash.com/${width}x${height}/?${keyword}`,
            credit: 'Photo from Unsplash',
            creditUrl: 'https://unsplash.com',
            photographer: 'Unsplash Contributors',
            photographerUrl: 'https://unsplash.com'
        };
    }

    /**
     * Get image using Unsplash API (requires API key)
     */
    async getImageFromAPI(query, orientation) {
        try {
            const response = await fetch(
                `${this.apiUrl}/photos/random?query=${encodeURIComponent(query)}&orientation=${orientation}`,
                {
                    headers: {
                        'Authorization': `Client-ID ${this.accessKey}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Unsplash API request failed');
            }

            const data = await response.json();

            return {
                url: data.urls.regular,
                urlSmall: data.urls.small,
                urlThumb: data.urls.thumb,
                credit: `Photo by ${data.user.name}`,
                creditUrl: data.links.html,
                photographer: data.user.name,
                photographerUrl: data.user.links.html,
                description: data.description || data.alt_description
            };

        } catch (error) {
            console.error('Error fetching from Unsplash API:', error);
            // Fallback to source
            return this.getImageFromSource(query, orientation);
        }
    }

    /**
     * Preload image to prevent loading flicker
     */
    preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = reject;
            img.src = url;
        });
    }

    /**
     * Get multiple images for a collection of verbs
     */
    async getImagesForVerbs(verbs) {
        const imagePromises = verbs.map(verb =>
            this.getImageForVerb(verb.verb, verb.context || '')
        );

        return Promise.all(imagePromises);
    }
}

// Export for use in app.js
const unsplashService = new UnsplashService();
