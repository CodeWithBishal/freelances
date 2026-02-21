// supabase.js - Supabase Client Setup & Helpers

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// We need the script tag to load the client in popup.html before this runs.
// That is: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

let supabaseClient = null;

/**
 * Initialize the Supabase Client
 * Must be called after the Supabase CDN script is loaded
 */
export function initSupabase() {
    if (supabaseClient) return supabaseClient;

    // Supabase is loaded globally via the CDN script in popup.html
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded! Ensure the script tag is in popup.html');
        return null;
    }

    // Use Chrome Storage Local to persist the user session in a MV3 compliant way
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            storage: {
                getItem: async (key) => {
                    const data = await chrome.storage.local.get([key]);
                    return data[key];
                },
                setItem: async (key, value) => {
                    await chrome.storage.local.set({ [key]: value });
                },
                removeItem: async (key) => {
                    await chrome.storage.local.remove([key]);
                }
            }
        }
    });

    return supabaseClient;
}

// Ensure it's initialized
initSupabase();

// =========================================================================
// Authentication Methods
// =========================================================================

export async function signUp(email, password) {
    return await supabaseClient.auth.signUp({ email, password });
}

export async function signIn(email, password) {
    return await supabaseClient.auth.signInWithPassword({ email, password });
}

export async function signOut() {
    return await supabaseClient.auth.signOut();
}

export async function getSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    return { session: data?.session, error };
}

export async function getUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    return { user, error };
}

// =========================================================================
// Watchlists CRUD
// =========================================================================

export async function getWatchlists() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    return await supabaseClient
        .from('watchlists')
        .select('*')
        .order('created_at', { ascending: false });
}

export async function createWatchlist(name, emoji, color) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    return await supabaseClient
        .from('watchlists')
        .insert([{
            user_id: user.id,
            name,
            emoji: emoji || '🍿',
            color: color || '#8b5cf6'
        }])
        .select()
        .single();
}

export async function deleteWatchlist(watchlistId) {
    return await supabaseClient
        .from('watchlists')
        .delete()
        .eq('id', watchlistId);
}

// =========================================================================
// Movies CRUD
// =========================================================================

export async function getMoviesForList(watchlistId) {
    return await supabaseClient
        .from('watchlist_movies')
        .select('*')
        .eq('watchlist_id', watchlistId)
        .order('added_at', { ascending: false });
}

export async function addMovieToList(watchlistId, tmdbMovie, customStatus = 'to_watch') {
    // We're converting a TMDB item to our DB schema
    const mediaType = tmdbMovie.media_type || (tmdbMovie.name ? 'tv' : 'movie');
    const title = mediaType === 'movie' ? tmdbMovie.title : tmdbMovie.name;
    const releaseDate = mediaType === 'movie' ? tmdbMovie.release_date : tmdbMovie.first_air_date;

    return await supabaseClient
        .from('watchlist_movies')
        .insert([{
            watchlist_id: watchlistId,
            tmdb_id: tmdbMovie.id,
            media_type: mediaType,
            title: title,
            poster_path: tmdbMovie.poster_path,
            rating: tmdbMovie.vote_average,
            overview: tmdbMovie.overview,
            release_date: releaseDate,
            status: customStatus
        }])
        .select()
        .single();
}

export async function updateMovieStatus(movieId, status) {
    return await supabaseClient
        .from('watchlist_movies')
        .update({ status })
        .eq('id', movieId);
}

export async function removeMovie(movieId) {
    return await supabaseClient
        .from('watchlist_movies')
        .delete()
        .eq('id', movieId);
}
