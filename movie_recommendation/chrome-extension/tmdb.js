// tmdb.js - TMDB API Helper

import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE } from './config.js';

/**
 * Perform a fetch to the TMDB API
 */
async function tmdbFetch(endpoint, params = {}) {
    // Add API Key to all requests
    const urlParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        ...params
    });

    const url = `${TMDB_BASE_URL}${endpoint}?${urlParams}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB logic failed: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (err) {
        console.error('TMDB Fetch Error:', err);
        throw err;
    }
}

/**
 * Generates an image URL
 * Sizes: 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'
 */
export function getImageUrl(path, size = 'w500') {
    if (!path) return null; // Or return a placeholder image here
    return `${TMDB_IMAGE_BASE}${size}${path}`;
}

/**
 * Searches for movies and TV shows
 */
export async function searchMulti(query) {
    if (!query || query.trim() === '') return [];
    const res = await tmdbFetch('/search/multi', {
        query: encodeURIComponent(query),
        include_adult: false
    });

    // Filter out 'person' results
    return res.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
}

/**
 * Gets full details for a Movie or TV Show
 */
export async function getDetails(id, mediaType = 'movie') {
    // Append videos to get the trailer in the same request
    return await tmdbFetch(`/${mediaType}/${id}`, {
        append_to_response: 'videos'
    });
}

/**
 * Helper to extract the best YouTube trailer code from a details object
 */
export function extractTrailerKey(details) {
    if (!details.videos || !details.videos.results) return null;

    // Prefer official trailers
    const videos = details.videos.results;
    const officialTrailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official);
    if (officialTrailer) return officialTrailer.key;

    // Fallback to any trailer
    const anyTrailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer');
    if (anyTrailer) return anyTrailer.key;

    // Fallback to any tease/clip
    const anyVideo = videos.find(v => v.site === 'YouTube');
    return anyVideo ? anyVideo.key : null;
}

/**
 * Get popular/trending content for the empty state of search
 */
export async function getTrending() {
    return await tmdbFetch('/trending/all/day');
}
