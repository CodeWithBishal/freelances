// popup.js - Main Application Logic

import {
    initSupabase, signUp, signIn, signOut, getSession,
    getWatchlists, createWatchlist, deleteWatchlist,
    getMoviesForList, addMovieToList, updateMovieStatus, removeMovie
} from './supabase.js';

import { searchMulti, getTrending, getDetails, extractTrailerKey, getImageUrl } from './tmdb.js';

// =========================================================================
// State Management
// =========================================================================
const state = {
    user: null,
    watchlists: [],
    currentListId: null,
    currentListMovies: [],
    searchResults: [],
    activeFilter: 'all', // all, to_watch, watching, watched
    isLoginMode: true, // Auth toggle
};

// =========================================================================
// DOM Elements
// =========================================================================
const els = {
    views: document.querySelectorAll('.view'),
    loader: document.getElementById('globalLoader'),
    toast: document.getElementById('errorToast'),
    userMenu: document.getElementById('userMenu'),
    logoutBtn: document.getElementById('logoutBtn'),

    // Auth
    authForm: document.getElementById('authForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    toggleAuthBtn: document.getElementById('toggleAuthModeBtn'),
    authToggleText: document.getElementById('authToggleText'),
    authSubmitBtn: document.querySelector('#authForm button[type="submit"]'),

    // Dashboard
    watchlistsContainer: document.getElementById('watchlistsContainer'),
    showCreateListBtn: document.getElementById('showCreateListBtn'),
    emptyDashboardState: document.getElementById('emptyDashboardState'),
    emptyCreateListBtn: document.getElementById('emptyCreateListBtn'),

    // List View
    backToDashboardBtn: document.getElementById('backToDashboardBtn'),
    currentListName: document.getElementById('currentListName'),
    showSearchBtn: document.getElementById('showSearchBtn'),
    filterTabs: document.querySelectorAll('.filter-tab'),
    moviesGrid: document.getElementById('moviesGrid'),
    emptyListState: document.getElementById('emptyListState'),
    emptySearchBtn: document.getElementById('emptySearchBtn'),

    // Search
    backFromSearchBtn: document.getElementById('backFromSearchBtn'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    searchResults: document.getElementById('searchResults'),
    searchTrending: document.getElementById('searchTrending'),
    trendingGrid: document.getElementById('trendingGrid'),

    // Create List Modal
    listModal: document.getElementById('listModal'),
    listForm: document.getElementById('listForm'),
    listNameInput: document.getElementById('listNameInput'),
    listEmojiInput: document.getElementById('listEmojiInput'),
    listColorInput: document.getElementById('listColorInput'),
    emojiOptions: document.querySelectorAll('.emoji-option'),
    colorOptions: document.querySelectorAll('.color-option'),
    deleteListBtn: document.getElementById('deleteListBtn'),

    // Movie Detail Modal
    movieDetailModal: document.getElementById('movieDetailModal'),
    movieDetailContent: document.getElementById('movieDetailContent'),

    closeModalBtns: document.querySelectorAll('.close-modal-btn'),
};

// =========================================================================
// Initialization
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    showLoader();

    // Wait a tiny bit for the CDN script to be available just in case
    setTimeout(async () => {
        try {
            const supabase = initSupabase();
            if (!supabase) throw new Error("Supabase couldn't initialize");

            // Check active session
            const { session } = await getSession();
            if (session) {
                state.user = session.user;
                await loadDashboard();
            } else {
                switchView('authView');
            }

            // Setup realtime auth listener
            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN') {
                    state.user = session.user;
                    await loadDashboard();
                } else if (event === 'SIGNED_OUT') {
                    state.user = null;
                    switchView('authView');
                    els.userMenu.classList.add('hidden');
                }
            });

        } catch (err) {
            showError(err.message);
            switchView('authView');
        } finally {
            hideLoader();
        }
    }, 100);
});

// =========================================================================
// View Navigation
// =========================================================================
function switchView(viewId) {
    els.views.forEach(v => {
        if (v.id === viewId) {
            v.classList.remove('hidden');
            v.classList.add('active');
        } else {
            v.classList.add('hidden');
            v.classList.remove('active');
        }
    });

    if (viewId !== 'authView') {
        els.userMenu.classList.remove('hidden');
    } else {
        els.userMenu.classList.add('hidden');
    }
}

// =========================================================================
// Authentication
// =========================================================================
els.toggleAuthBtn.addEventListener('click', () => {
    state.isLoginMode = !state.isLoginMode;
    if (state.isLoginMode) {
        els.authToggleText.textContent = "Don't have an account?";
        els.toggleAuthBtn.textContent = "Sign Up";
        els.authSubmitBtn.textContent = "Sign In";
        document.querySelector('.auth-card h2').textContent = "Welcome Back! 🍿";
        document.querySelector('.auth-card p').textContent = "Sign in to sync your watchlists.";
    } else {
        els.authToggleText.textContent = "Already have an account?";
        els.toggleAuthBtn.textContent = "Sign In";
        els.authSubmitBtn.textContent = "Sign Up";
        document.querySelector('.auth-card h2').textContent = "Create Account 🎬";
        document.querySelector('.auth-card p').textContent = "Start building your ultimate watchlist.";
    }
});

els.authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = els.emailInput.value;
    const password = els.passwordInput.value;

    showLoader();
    try {
        const { error } = state.isLoginMode
            ? await signIn(email, password)
            : await signUp(email, password);

        if (error) throw error;
        // The onAuthStateChange listener will handle the redirect
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoader();
    }
});

els.logoutBtn.addEventListener('click', async () => {
    showLoader();
    await signOut();
    hideLoader();
});

// =========================================================================
// Dashboard (Watchlists)
// =========================================================================
async function loadDashboard() {
    switchView('dashboardView');
    showLoader();

    try {
        const { data, error } = await getWatchlists();
        if (error) throw error;

        state.watchlists = data;
        renderWatchlists();

    } catch (err) {
        showError('Failed to load watchlists: ' + err.message);
    } finally {
        hideLoader();
    }
}

function renderWatchlists() {
    els.watchlistsContainer.innerHTML = '';

    if (state.watchlists.length === 0) {
        els.watchlistsContainer.classList.add('hidden');
        els.emptyDashboardState.classList.remove('hidden');
        return;
    }

    els.watchlistsContainer.classList.remove('hidden');
    els.emptyDashboardState.classList.add('hidden');

    state.watchlists.forEach(list => {
        const el = document.createElement('div');
        el.className = 'watchlist-card';
        el.style.setProperty('--list-color', list.color);

        el.innerHTML = `
      <span class="list-emoji">${list.emoji}</span>
      <div class="list-name">${list.name}</div>
    `;

        el.addEventListener('click', () => loadList(list));
        els.watchlistsContainer.appendChild(el);
    });
}

// =========================================================================
// List Management (Create/Edit)
// =========================================================================
[els.showCreateListBtn, els.emptyCreateListBtn].forEach(btn => {
    btn.addEventListener('click', () => openListModal());
});

function openListModal() {
    els.listForm.reset();
    els.listNameInput.value = '';
    els.listEmojiInput.value = '🍿';
    els.listColorInput.value = '#8b5cf6';
    els.deleteListBtn.classList.add('hidden');

    // Reset pickers
    selectOption('emoji-option', '🍿', els.emojiOptions);
    selectOption('color-option', '#8b5cf6', els.colorOptions, 'data-color');

    els.listModal.classList.remove('hidden');
}

// Picker logic
els.emojiOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
        els.emojiOptions.forEach(o => o.classList.remove('selected'));
        e.target.classList.add('selected');
        els.listEmojiInput.value = e.target.textContent;
    });
});

els.colorOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
        els.colorOptions.forEach(o => o.classList.remove('selected'));
        e.target.classList.add('selected');
        els.listColorInput.value = e.target.dataset.color;
    });
});

function selectOption(className, value, elements, dataAttr = null) {
    elements.forEach(el => {
        el.classList.remove('selected');
        const elValue = dataAttr ? el.getAttribute(dataAttr) : el.textContent;
        if (elValue === value) el.classList.add('selected');
    });
}

els.listForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = els.listNameInput.value;
    const emoji = els.listEmojiInput.value;
    const color = els.listColorInput.value;

    showLoader();
    try {
        const { data, error } = await createWatchlist(name, emoji, color);
        if (error) throw error;

        state.watchlists.unshift(data);
        renderWatchlists();
        els.listModal.classList.add('hidden');
        showError('List created!', true); // true = success Toast style if we add it, but red works as generic alert for now
    } catch (err) {
        showError('Failed to create list: ' + err.message);
    } finally {
        hideLoader();
    }
});

// =========================================================================
// Specific List View
// =========================================================================
async function loadList(list) {
    state.currentListId = list.id;
    els.currentListName.textContent = `${list.emoji} ${list.name}`;
    switchView('listView');
    showLoader();

    try {
        const { data, error } = await getMoviesForList(list.id);
        if (error) throw error;

        state.currentListMovies = data;
        renderMovies();

        // Setup list delete config
        els.currentListName.onclick = () => {
            // Small trick: click title to edit/delete list
            openListModal();
            document.getElementById('listModalTitle').textContent = 'Edit List';
            els.listNameInput.value = list.name;
            els.listEmojiInput.value = list.emoji;
            els.listColorInput.value = list.color;
            selectOption('emoji-option', list.emoji, els.emojiOptions);
            selectOption('color-option', list.color, els.colorOptions, 'data-color');
            els.deleteListBtn.classList.remove('hidden');

            els.deleteListBtn.onclick = async () => {
                if (confirm('Delete this entire list and all its movies?')) {
                    showLoader();
                    await deleteWatchlist(list.id);
                    els.listModal.classList.add('hidden');
                    await loadDashboard();
                }
            };
        };

    } catch (err) {
        showError('Failed to load movies: ' + err.message);
    } finally {
        hideLoader();
    }
}

els.backToDashboardBtn.addEventListener('click', () => {
    state.currentListId = null;
    loadDashboard();
});

// Filters
els.filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        els.filterTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        state.activeFilter = e.target.dataset.filter;
        renderMovies();
    });
});

function renderMovies() {
    els.moviesGrid.innerHTML = '';

    const filtered = state.activeFilter === 'all'
        ? state.currentListMovies
        : state.currentListMovies.filter(m => m.status === state.activeFilter);

    if (filtered.length === 0) {
        els.moviesGrid.classList.add('hidden');
        els.emptyListState.classList.remove('hidden');
        return;
    }

    els.moviesGrid.classList.remove('hidden');
    els.emptyListState.classList.add('hidden');

    filtered.forEach(movie => {
        const el = document.createElement('div');
        el.className = 'movie-card';
        const posterUrl = getImageUrl(movie.poster_path, 'w342');

        el.innerHTML = `
      ${posterUrl
                ? `<img src="${posterUrl}" class="movie-poster" alt="${movie.title}" loading="lazy">`
                : `<div class="movie-fallback">${movie.title}</div>`
            }
      <div class="status-indicator" data-status="${movie.status}"></div>
      <div class="movie-meta-overlay">
        <div class="movie-rating">★ ${movie.rating ? movie.rating.toFixed(1) : 'NR'}</div>
      </div>
    `;

        el.addEventListener('click', () => openMovieDetail(movie, true));
        els.moviesGrid.appendChild(el);
    });
}

// =========================================================================
// Search Hub
// =========================================================================
[els.showSearchBtn, els.emptySearchBtn].forEach(btn => {
    btn.addEventListener('click', async () => {
        switchView('searchhubView');
        els.searchInput.value = '';
        els.searchResults.innerHTML = '';
        els.clearSearchBtn.classList.add('hidden');
        els.searchTrending.classList.remove('hidden');

        // Load trending
        try {
            const data = await getTrending();
            renderTrending(data.results.slice(0, 8)); // Top 8
        } catch (err) {
            console.error(err);
        }
    });
});

els.backFromSearchBtn.addEventListener('click', () => {
    switchView('listView');
    renderMovies();
});

function renderTrending(items) {
    els.trendingGrid.innerHTML = '';
    items.filter(i => i.media_type === 'movie' || i.media_type === 'tv').forEach(item => {
        const el = document.createElement('div');
        el.className = 'movie-card';
        const title = item.media_type === 'movie' ? item.title : item.name;
        const posterUrl = getImageUrl(item.poster_path, 'w185');

        el.innerHTML = `
      ${posterUrl ? `<img src="${posterUrl}" class="movie-poster" loading="lazy">` : `<div class="movie-fallback">${title}</div>`}
    `;
        el.addEventListener('click', async () => {
            showLoader();
            try {
                const details = await getDetails(item.id, item.media_type);
                hideLoader();
                openMovieDetail(details, false, item.media_type);
            } catch (e) { hideLoader(); showError(e.message); }
        });
        els.trendingGrid.appendChild(el);
    });
}

// Debounce search
let searchTimeout;
els.searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 0) {
        els.clearSearchBtn.classList.remove('hidden');
        els.searchTrending.classList.add('hidden');
    } else {
        els.clearSearchBtn.classList.add('hidden');
        els.searchResults.innerHTML = '';
        els.searchTrending.classList.remove('hidden');
        return;
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        els.searchResults.innerHTML = '<div class="text-center"><div class="spinner" style="margin:20px auto"></div></div>';
        try {
            const results = await searchMulti(query);
            renderSearchResults(results);
        } catch (err) {
            els.searchResults.innerHTML = `<p class="text-center text-muted">Error: ${err.message}</p>`;
        }
    }, 500);
});

els.clearSearchBtn.addEventListener('click', () => {
    els.searchInput.value = '';
    els.searchInput.dispatchEvent(new Event('input'));
});

function renderSearchResults(results) {
    els.searchResults.innerHTML = '';
    if (results.length === 0) {
        els.searchResults.innerHTML = '<p class="text-center text-muted mt-2">No results found.</p>';
        return;
    }

    results.forEach(item => {
        const el = document.createElement('div');
        el.className = 'search-result-item';
        const title = item.media_type === 'movie' ? item.title : item.name;
        const date = item.media_type === 'movie' ? item.release_date : item.first_air_date;
        const year = date ? date.split('-')[0] : 'N/A';
        const posterUrl = getImageUrl(item.poster_path, 'w92');

        el.innerHTML = `
      ${posterUrl ? `<img src="${posterUrl}" class="result-poster">` : `<div class="result-poster fallback"></div>`}
      <div class="result-info">
        <div class="result-title">${title}</div>
        <div class="result-meta">
          <span>${item.media_type === 'movie' ? '🎬 Movie' : '📺 TV Show'} • ${year}</span>
          <span>★ ${item.vote_average ? item.vote_average.toFixed(1) : 'NR'}</span>
        </div>
      </div>
    `;

        el.addEventListener('click', async () => {
            showLoader();
            try {
                const details = await getDetails(item.id, item.media_type);
                hideLoader();
                openMovieDetail(details, false, item.media_type);
            } catch (e) { hideLoader(); showError(e.message); }
        });

        els.searchResults.appendChild(el);
    });
}

// =========================================================================
// Movie Detail Modal
// =========================================================================
function openMovieDetail(data, isFromList = false, mediaType = 'movie') {
    // data is either from TMDB API (when searching) OR from our Supabase DB (when in list)
    const isDbRecord = isFromList;

    const title = isDbRecord ? data.title : (mediaType === 'movie' ? data.title : data.name);
    const releaseDate = isDbRecord ? data.release_date : (mediaType === 'movie' ? data.release_date : data.first_air_date);
    const year = releaseDate ? releaseDate.split('-')[0] : '';
    const rating = isDbRecord ? data.rating : data.vote_average;
    const overview = data.overview || 'No overview available.';
    const posterUrl = getImageUrl(data.poster_path, 'w154');

    let html = `
    <div class="detail-header">
      ${posterUrl ? `<img src="${posterUrl}" class="detail-poster">` : ''}
      <div class="detail-info">
        <h3 class="detail-title">${title}</h3>
        <div class="detail-meta">${year}</div>
        <div class="detail-rating">
          <span>★ ${rating ? (typeof rating === 'number' ? rating.toFixed(1) : rating) : 'NR'}</span>
        </div>
        ${isDbRecord ? `<div class="status-badge ${data.status}">${formatStatus(data.status)}</div>` : ''}
      </div>
    </div>
    <div class="detail-overview">${overview}</div>
  `;

    if (!isDbRecord) {
        // Add to List UI
        html += `
      <div class="detail-actions">
        <select id="addToListStatus" class="select-input">
          <option value="to_watch">🎬 Want to Watch</option>
          <option value="watching">👀 Currently Watching</option>
          <option value="watched">✅ Watched</option>
        </select>
        <button id="addMovieBtn" class="btn primary-btn w-full">Add to ${document.getElementById('currentListName').textContent}</button>
      </div>
    `;
    } else {
        // Update/Remove UI in List
        html += `
      <div class="detail-actions">
        <select id="updateStatusInput" class="select-input">
          <option value="to_watch" ${data.status === 'to_watch' ? 'selected' : ''}>🎬 Want to Watch</option>
          <option value="watching" ${data.status === 'watching' ? 'selected' : ''}>👀 Currently Watching</option>
          <option value="watched" ${data.status === 'watched' ? 'selected' : ''}>✅ Watched</option>
        </select>
        <button id="removeMovieBtn" class="btn danger-btn w-full">Remove from List</button>
      </div>
    `;
    }

    // Trailer logic
    if (!isDbRecord && data.videos) { // Only when fetching from TMDB details
        const trailerKey = extractTrailerKey(data);
        if (trailerKey) {
            html += `
        <div class="trailer-container mt-2">
          <iframe class="trailer-iframe" src="https://www.youtube.com/embed/${trailerKey}" allowfullscreen></iframe>
        </div>
      `;
        }
    }

    els.movieDetailContent.innerHTML = html;

    // Attach event listeners for dynamic buttons inside modal
    if (!isDbRecord) {
        document.getElementById('addMovieBtn').addEventListener('click', async () => {
            const status = document.getElementById('addToListStatus').value;
            showLoader();
            try {
                const { error } = await addMovieToList(state.currentListId, { ...data, media_type: mediaType }, status);
                if (error) throw error;

                showError('Added to list!', true); // Success Toast
                els.movieDetailModal.classList.add('hidden');
                // Refresh local data
                const { data: updatedList } = await getMoviesForList(state.currentListId);
                state.currentListMovies = updatedList;

            } catch (err) {
                showError('Error adding movie: ' + err.message);
            } finally {
                hideLoader();
            }
        });
    } else {
        document.getElementById('updateStatusInput').addEventListener('change', async (e) => {
            const newStatus = e.target.value;
            try {
                await updateMovieStatus(data.id, newStatus);
                // Optimistic update
                const idx = state.currentListMovies.findIndex(m => m.id === data.id);
                if (idx > -1) {
                    state.currentListMovies[idx].status = newStatus;
                    renderMovies();
                }
                showError('Status updated', true);
                /* Don't close modal to let them continue viewing if they want */
            } catch (err) {
                showError(err.message);
            }
        });

        document.getElementById('removeMovieBtn').addEventListener('click', async () => {
            if (confirm('Remove this title from the watchlist?')) {
                showLoader();
                try {
                    await removeMovie(data.id);
                    state.currentListMovies = state.currentListMovies.filter(m => m.id !== data.id);
                    renderMovies();
                    els.movieDetailModal.classList.add('hidden');
                } catch (err) {
                    showError(err.message);
                } finally {
                    hideLoader();
                }
            }
        });
    }

    els.movieDetailModal.classList.remove('hidden');
}

function formatStatus(status) {
    if (status === 'to_watch') return 'Want to Watch';
    if (status === 'watching') return 'Watching';
    return 'Watched';
}

// =========================================================================
// General Utilities
// =========================================================================
els.closeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.add('hidden');
        // Stop trailer iframe playback if it exists
        const iframe = document.querySelector('.trailer-iframe');
        if (iframe) iframe.src = iframe.src;
    });
});

// Click outside modal backdrop to close
document.querySelectorAll('.modal-backdrop').forEach(bd => {
    bd.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.add('hidden');
        const iframe = document.querySelector('.trailer-iframe');
        if (iframe) iframe.src = iframe.src;
    });
});

function showLoader() {
    els.loader.classList.remove('hidden');
}

function hideLoader() {
    els.loader.classList.add('hidden');
}

let toastTimeout;
function showError(msg, isSuccess = false) {
    els.toast.textContent = msg;
    els.toast.style.background = isSuccess ? 'var(--status-watched)' : 'var(--danger)';
    els.toast.classList.remove('hidden');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        els.toast.classList.add('hidden');
    }, 3000);
}
