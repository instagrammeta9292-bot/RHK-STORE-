// LocalStorage Persistence Configuration
const STORAGE_KEY = "rhk_platform_vault";

// Core Database Architecture Setup with reactive LocalStorage hydration pipeline
let appDatabaseState = {
    userProfile: {
        username: "ragha_v0069",
        displayName: "Raghav Hk",
        bio: "",
        website: "",
        avatarUrl: "", 
        followers: 19,
        following: 30,
        showThreadsBadge: true,
        note: "Note..."
    },
    posts: [],
    reels: [],
    savedItemIds: [], 
    activeStories: {},
    archivedStories: []
};

// Auto hydration wrapper checking database persistence fields
function saveAppStateToVault() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appDatabaseState));
}

function loadAppStateFromVault() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if(cached) {
        try {
            appDatabaseState = JSON.parse(cached);
        } catch(e) {
            console.error("Data tracking corrupted. Re-building database structural map...");
        }
    }
}

let appGlobalAudioMuted = true;
let currentActiveViewKey = 'home';

document.addEventListener('DOMContentLoaded', () => {
    // Load historical storage profiles data immediately upon initialization execution pipelines
    loadAppStateFromVault();

    const views = {
        home: document.getElementById('view-home'),
        reels: document.getElementById('view-reels'),
        profile: document.getElementById('view-profile'),
        editProfile: document.getElementById('view-edit-profile'),
        archive: document.getElementById('view-archive')
    };
    
    const navButtons = {
        home: document.getElementById('nav-home'),
        reels: document.getElementById('nav-reels'),
        profile: document.getElementById('nav-profile')
    };

    const topNavbar = document.getElementById('app-top-navbar');
    const bottomNavbar = document.getElementById('app-bottom-navbar');

    window.navigateToScreen = function(screenKey) {
        currentActiveViewKey = screenKey;
        haltAllBackgroundVideos();

        Object.keys(views).forEach(key => views[key].classList.add('hidden'));
        views[screenKey].classList.remove('hidden');

        Object.values(navButtons).forEach(btn => btn.classList.remove('active'));
        if(navButtons[screenKey]) navButtons[screenKey].classList.add('active');

        if (screenKey === 'home') {
            topNavbar.classList.remove('hidden');
            bottomNavbar.classList.remove('hidden');
            evaluateHomeFeedAutoplay();
        } else if (screenKey === 'reels') {
            topNavbar.classList.add('hidden');
            bottomNavbar.classList.remove('hidden');
            evaluateReelsSliderAutoplay();
        } else if (screenKey === 'profile') {
            topNavbar.classList.add('hidden');
            bottomNavbar.classList.remove('hidden');
            syncProfileDashboardDOM();
        } else {
            topNavbar.classList.add('hidden');
            bottomNavbar.classList.add('hidden');
        }
    };

    navButtons.home.addEventListener('click', () => navigateToScreen('home'));
    navButtons.reels.addEventListener('click', () => navigateToScreen('reels'));
    navButtons.profile.addEventListener('click', () => navigateToScreen('profile'));

    document.getElementById('nav-search').addEventListener('click', () => alert('Search Engine tab initialized.'));
    document.getElementById('nav-messages').addEventListener('click', () => alert('Direct Messages pipeline opened.'));
    document.getElementById('btn-edit-profile-view').addEventListener('click', () => navigateToScreen('editProfile'));
    document.getElementById('btn-view-archive-view').addEventListener('click', () => navigateToScreen('archive'));

    document.getElementById('profile-avatar-display').addEventListener('click', () => {
        if(typeof launchAvatarDirectUpload === 'function') launchAvatarDirectUpload();
    });

    document.getElementById('btn-create').addEventListener('click', () => document.getElementById('create-options-overlay').classList.remove('hidden'));
    document.getElementById('btn-close-overlay').addEventListener('click', () => document.getElementById('create-options-overlay').classList.add('hidden'));

    document.getElementById('opt-post').addEventListener('click', () => { document.getElementById('create-options-overlay').classList.add('hidden'); launchPostUpload(); });
    document.getElementById('opt-story').addEventListener('click', () => { document.getElementById('create-options-overlay').classList.add('hidden'); launchStoryUpload(); });
    document.getElementById('opt-reels').addEventListener('click', () => { document.getElementById('create-options-overlay').classList.add('hidden'); launchReelsUpload(); });
    document.getElementById('link-share-first').addEventListener('click', () => launchPostUpload());

    document.getElementById('note-bubble').addEventListener('click', () => {
        const thought = prompt("Share a status thought note:", appDatabaseState.userProfile.note);
        if(thought !== null && thought.trim() !== "") {
            appDatabaseState.userProfile.note = thought;
            document.getElementById('note-text-display').innerText = thought;
            saveAppStateToVault();
        }
    });

    views.home.addEventListener('scroll', evaluateHomeFeedAutoplay);
    document.getElementById('dynamic-reels-slider').addEventListener('scroll', evaluateReelsSliderAutoplay);

    const tabGrid = document.getElementById('tab-trigger-grid');
    const tabSaved = document.getElementById('tab-trigger-saved');

    tabGrid.addEventListener('click', () => {
        tabGrid.classList.add('active'); tabSaved.classList.remove('active');
        document.getElementById('profile-active-grid').classList.remove('hidden');
        document.getElementById('profile-saved-grid').classList.add('hidden');
    });

    tabSaved.addEventListener('click', () => {
        tabGrid.classList.remove('active'); tabSaved.classList.add('active');
        document.getElementById('profile-active-grid').classList.add('hidden');
        document.getElementById('profile-saved-grid').classList.remove('hidden');
        renderProfileSavedTabItems();
    });

    // Populate timeline and active layouts dynamically from saved disk states maps
    rebuildActiveViewsFromPersistedState();
});

function haltAllBackgroundVideos() {
    document.querySelectorAll('video').forEach(video => { video.pause(); });
}

function evaluateHomeFeedAutoplay() {
    if (currentActiveViewKey !== 'home') return;
    const homeView = document.getElementById('view-home');
    const feedVideos = homeView.querySelectorAll('.post-display-file');
    let videoActivated = false;

    feedVideos.forEach(video => {
        if(video.tagName !== 'VIDEO') return;
        const rect = video.getBoundingClientRect();
        const inView = (rect.top >= 0 && rect.bottom <= window.innerHeight);

        if (inView && !videoActivated) {
            video.muted = appGlobalAudioMuted;
            video.play().catch(() => {});
            videoActivated = true;
            syncAudioToggleButtonVisuals(video);
        } else {
            video.pause();
        }
    });
}

function evaluateReelsSliderAutoplay() {
    if (currentActiveViewKey !== 'reels') return;
    const slider = document.getElementById('dynamic-reels-slider');
    const snapCards = slider.querySelectorAll('.reel-snap-card');
    
    snapCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const video = card.querySelector('video');
        
        if (rect.top >= -50 && rect.top <= 50) {
            if (video) {
                video.muted = appGlobalAudioMuted;
                video.play().catch(() => {});
                syncAudioToggleButtonVisuals(video);
            }
        } else {
            if (video) video.pause();
        }
    });
}

window.toggleGlobalFeedAudioState = function(clickedButton, targetVideoId) {
    appGlobalAudioMuted = !appGlobalAudioMuted;
    document.querySelectorAll('video').forEach(video => { video.muted = appGlobalAudioMuted; });
    document.querySelectorAll('.feed-audio-toggle-overlay-btn').forEach(btn => {
        btn.innerHTML = appGlobalAudioMuted ? `<i class="fa-solid fa-volume-xmark"></i>` : `<i class="fa-solid fa-volume-high"></i>`;
    });
};

function syncAudioToggleButtonVisuals(activeVideo) {
    const parentFrame = activeVideo.parentElement;
    const btn = parentFrame.querySelector('.feed-audio-toggle-overlay-btn');
    if(btn) {
        btn.innerHTML = appGlobalAudioMuted ? `<i class="fa-solid fa-volume-xmark"></i>` : `<i class="fa-solid fa-volume-high"></i>`;
    }
}

function applyUserIdentitySystemState() {
    const data = appDatabaseState.userProfile;
    document.querySelectorAll('.dyn-username').forEach(el => el.innerText = data.username);
    document.getElementById('profile-name-display').innerText = data.displayName;
    document.getElementById('profile-followers-count').innerText = data.followers;
    document.getElementById('profile-following-count').innerText = data.following;
    document.getElementById('note-text-display').innerText = data.note || "Note...";
    
    const bioDisplay = document.getElementById('profile-bio-description-display');
    if(data.bio) { bioDisplay.classList.remove('hidden'); bioDisplay.innerText = data.bio; } 
    else bioDisplay.classList.add('hidden');

    const webDisplay = document.getElementById('profile-web-link-display');
    if(data.website) {
        webDisplay.classList.remove('hidden');
        webDisplay.href = data.website.startsWith('http') ? data.website : `https://${data.website}`;
        webDisplay.querySelector('span').innerText = data.website.replace(/(^\w+:|^)\/\//, '');
    } else webDisplay.classList.add('hidden');

    document.getElementById('profile-threads-badge').style.display = data.showThreadsBadge ? 'flex' : 'none';

    const avatarSelectors = [
        document.getElementById('profile-avatar-display'),
        document.getElementById('bottom-nav-avatar-circle'),
        document.getElementById('edit-avatar-circle')
    ];

    avatarSelectors.forEach(parent => {
        if(!parent) return;
        parent.innerHTML = data.avatarUrl ? `<img src="${data.avatarUrl}" alt="User Avatar">` : `<i class="fa-solid fa-user"></i>`;
    });
}

function syncProfileDashboardDOM() {
    applyUserIdentitySystemState();
    const gridCount = appDatabaseState.posts.length + appDatabaseState.reels.length;
    document.getElementById('profile-posts-count').innerText = gridCount;

    const emptyBox = document.getElementById('profile-grid-empty-state');
    const activeGrid = document.getElementById('profile-active-grid');

    if(gridCount === 0) {
        emptyBox.classList.remove('hidden');
        activeGrid.classList.add('hidden');
        return;
    }

    emptyBox.classList.add('hidden');
    activeGrid.classList.remove('hidden');
    activeGrid.innerHTML = '';

    const collection = [...appDatabaseState.reels, ...appDatabaseState.posts];
    collection.forEach(item => {
        const itemFrame = document.createElement('div');
        itemFrame.className = 'grid-item-frame';
        let visualTag = item.mode === 'video' ? `<video src="${item.url}"></video><i class="fa-solid fa-film grid-badge-icon"></i>` : `<img src="${item.url}"><i class="fa-solid fa-image grid-badge-icon"></i>`;
        itemFrame.innerHTML = visualTag;
        activeGrid.appendChild(itemFrame);
    });
}

function renderProfileSavedTabItems() {
    const savedGrid = document.getElementById('profile-saved-grid');
    savedGrid.innerHTML = '';
    
    const allItems = [...appDatabaseState.reels, ...appDatabaseState.posts];
    const savedItemsList = allItems.filter(i => appDatabaseState.savedItemIds.includes(i.id));

    if(savedItemsList.length === 0) {
        savedGrid.innerHTML = `<div style="grid-column: span 3; text-align:center; padding: 40px; color:#737373; font-size:14px;">No Saved Items Yet.</div>`;
        return;
    }

    savedItemsList.forEach(item => {
        const itemFrame = document.createElement('div');
        itemFrame.className = 'grid-item-frame';
        let visualTag = item.mode === 'video' ? `<video src="${item.url}"></video><i class="fa-solid fa-film grid-badge-icon"></i>` : `<img src="${item.url}"><i class="fa-solid fa-image grid-badge-icon"></i>`;
        itemFrame.innerHTML = visualTag;
        savedGrid.appendChild(itemFrame);
    });
}

function appendMediaToTimelineFeed(id, mediaUrl, mode, typeLabel) {
    const feedContainer = document.getElementById('dynamic-feed-list');
    const emptyPlaceholder = document.getElementById('home-empty-state');
    if(emptyPlaceholder) emptyPlaceholder.classList.add('hidden');

    const profile = appDatabaseState.userProfile;
    
    let innerContent = mode === 'video' ? 
        `<video id="${id}" src="${mediaUrl}" class="post-display-file" loop muted playsinline></video>
         <button class="feed-audio-toggle-overlay-btn" onclick="toggleGlobalFeedAudioState(this, '${id}')"><i class="fa-solid fa-volume-xmark"></i></button>` : 
        `<img src="${mediaUrl}" class="post-display-file" alt="RHK Media item">`;
        
    let avatarTag = profile.avatarUrl ? `<img src="${profile.avatarUrl}">` : `<i class="fa-solid fa-user"></i>`;

    const isSaved = appDatabaseState.savedItemIds.includes(id);
    const saveIconClass = isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';

    const htmlCard = `
        <article class="post-card" id="card-${id}">
            <div class="post-header">
                <div class="post-user-info">
                    <div class="post-avatar-placeholder">${avatarTag}</div>
                    <span class="post-username-label">${profile.username}</span>
                    <span class="post-badge-tag">${typeLabel}</span>
                </div>
                <button class="post-options-btn"><i class="fa-solid fa-ellipsis"></i></button>
            </div>
            <div class="post-media-frame" onclick="handleReelGestureTouchTapSequence(null, '${id}')">${innerContent}</div>
            <div class="post-actions-bar">
                <div class="left-actions">
                    <i class="fa-regular fa-heart post-action-icon" id="like-icon-${id}" onclick="handleDynamicItemLikeClick('${id}')"></i>
                    <i class="fa-regular fa-comment post-action-icon" onclick="handleMockCommentAction('${id}')"></i>
                    <i class="fa-regular fa-paper-plane post-action-icon" onclick="handleMockShareAction('${id}')"></i>
                </div>
                <i class="${saveIconClass} post-action-icon" id="save-icon-${id}" onclick="handleDynamicItemSaveToggle('${id}')"></i>
            </div>
        </article>
    `;
    feedContainer.appendChild(document.createRange().createContextualFragment(htmlCard));
}

window.handleDynamicItemLikeClick = function(id) {
    const likeIcon = document.getElementById(`like-icon-${id}`) || document.getElementById(`reel-like-icon-${id}`);
    if(!likeIcon) return;

    if(likeIcon.classList.contains('fa-regular')) {
        likeIcon.className = 'fa-solid fa-heart post-action-icon';
        likeIcon.style.color = '#ff2d55';
    } else {
        likeIcon.className = 'fa-regular fa-heart post-action-icon';
        likeIcon.style.color = '';
    }
};

window.handleDynamicItemSaveToggle = function(id) {
    const index = appDatabaseState.savedItemIds.indexOf(id);
    const saveIcons = [document.getElementById(`save-icon-${id}`), document.getElementById(`reel-save-icon-${id}`)];

    if(index === -1) {
        appDatabaseState.savedItemIds.push(id);
        saveIcons.forEach(icon => { if(icon) icon.className = 'fa-solid fa-bookmark post-action-icon'; });
    } else {
        appDatabaseState.savedItemIds.splice(index, 1);
        saveIcons.forEach(icon => { if(icon) icon.className = 'fa-regular fa-bookmark post-action-icon'; });
    }
    saveAppStateToVault();
    renderProfileSavedTabItems();
};

window.handleMockCommentAction = function(id) {
    const msg = prompt("Write a comment:");
    if(msg) alert(`Comment shared successfully: "${msg}"`);
};

window.handleMockShareAction = function(id) {
    alert("Share sheets interface protocol initialized successfully!");
};

function rebuildActiveViewsFromPersistedState() {
    applyUserIdentitySystemState();
    
    // 1. Re-render Stories Tray
    Object.keys(appDatabaseState.activeStories).forEach(storyId => {
        const item = appDatabaseState.activeStories[storyId];
        // Calculate if it has expired while user was offline
        const timePassed = Date.now() - item.createdAt;
        if(timePassed >= 24 * 60 * 60 * 1000) {
            // Self-clean expire to archive cleanly
            if(typeof archiveExpiredStory === 'function') archiveExpiredStory(storyId, item);
            delete appDatabaseState.activeStories[storyId];
        } else {
            injectStoryNodeToDOM(storyId, item.url, item.mode, timePassed);
        }
    });
    saveAppStateToVault();

    // 2. Re-render Feed Timelines & Reels Combinations ordered chronologically
    const combinedFeeds = [];
    appDatabaseState.posts.forEach(p => combinedFeeds.push({ ...p, type: 'POST' }));
    appDatabaseState.reels.forEach(r => combinedFeeds.push({ ...r, type: 'REEL' }));
    
    // Reverse loop to restore accurate chronology mapping top-to-bottom
    combinedFeeds.reverse().forEach(item => {
        appendMediaToTimelineFeed(item.id, item.url, item.mode, item.type);
        if(item.type === 'REEL') {
            appendMediaToVerticalReelsSlider(item.id, item.url, item.mode);
        }
    });

    // 3. Rehydrate Archived View Lists Portfolio Grids
    if(typeof syncArchiveContainerGridDOM === 'function') syncArchiveContainerGridDOM();
    
    syncProfileDashboardDOM();
}

async function sendToCloudinary(file) {
    const cloudName = "nhy9lfkt";
    const uploadPreset = "rhk_upload";
    const mode = file.type.startsWith('video/') ? 'video' : 'image';
    
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${mode}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const res = await fetch(url, { method: 'POST', body: formData });
        if(res.ok) {
            const data = await res.json();
            return { success: true, url: data.secure_url, mode: mode };
        }
        const err = await res.json();
        alert(`Cloudinary Error: ${err.error.message}`);
        return { success: false };
    } catch (e) {
        alert("Network communication error.");
        return { success: false };
    } finally {
        document.getElementById('global-file-picker').value = "";
    }
}
