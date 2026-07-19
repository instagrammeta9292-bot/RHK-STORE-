// Global Application Database State Vault
const appDatabaseState = {
    userProfile: {
        username: "ragha_v0069",
        displayName: "Raghav Hk",
        bio: "",
        website: "",
        avatarUrl: "", 
        followers: 19,
        following: 30,
        showThreadsBadge: true
    },
    posts: [],
    reels: [],
    savedItemIds: [], 
    activeStories: {},
    archivedStories: []
};

let appGlobalAudioMuted = true;
let currentActiveViewKey = 'home';

document.addEventListener('DOMContentLoaded', () => {
    const views = {
        home: document.getElementById('view-home'),
        search: document.getElementById('view-search'),
        reels: document.getElementById('view-reels'),
        messages: document.getElementById('view-messages'),
        notifications: document.getElementById('view-notifications'),
        profile: document.getElementById('view-profile'),
        editProfile: document.getElementById('view-edit-profile'),
        archive: document.getElementById('view-archive')
    };
    
    const navButtons = {
        home: document.getElementById('nav-home'),
        search: document.getElementById('nav-search'),
        reels: document.getElementById('nav-reels'),
        messages: document.getElementById('nav-messages'),
        profile: document.getElementById('nav-profile')
    };

    const topNavbar = document.getElementById('app-top-navbar');
    const bottomNavbar = document.getElementById('app-bottom-navbar');

    window.navigateToScreen = function(screenKey) {
        haltAllBackgroundVideos();
        Object.keys(views).forEach(key => views[key].classList.add('hidden'));
        views[screenKey].classList.remove('hidden');

        Object.values(navButtons).forEach(btn => btn.classList.remove('active'));
        if(navButtons[screenKey]) navButtons[screenKey].classList.add('active');

        // Layout state styling adaptions
        if (screenKey === 'home') {
            topNavbar.classList.remove('hidden');
            bottomNavbar.classList.remove('hidden');
            evaluateHomeFeedAutoplay();
        } else if (screenKey === 'search') {
            topNavbar.classList.add('hidden');
            bottomNavbar.classList.remove('hidden');
            if(typeof syncSearchDiscoverGridDOM === 'function') syncSearchDiscoverGridDOM();
        } else if (screenKey === 'reels') {
            topNavbar.classList.add('hidden');
            bottomNavbar.classList.remove('hidden');
            evaluateReelsSliderAutoplay();
        } else if (screenKey === 'profile') {
            topNavbar.classList.add('hidden');
            bottomNavbar.classList.remove('hidden');
            syncProfileDashboardDOM();
        } else if (screenKey === 'messages' || screenKey === 'notifications') {
            topNavbar.classList.add('hidden');
            bottomNavbar.classList.remove('hidden');
            if(screenKey === 'notifications' && typeof generateNotificationsListDOM === 'function') {
                generateNotificationsListDOM();
            }
        } else {
            topNavbar.classList.add('hidden');
            bottomNavbar.classList.add('hidden');
        }
    };

    // Global click hooks
    navButtons.home.addEventListener('click', () => navigateToScreen('home'));
    navButtons.search.addEventListener('click', () => navigateToScreen('search'));
    navButtons.reels.addEventListener('click', () => navigateToScreen('reels'));
    navButtons.messages.addEventListener('click', () => navigateToScreen('messages'));
    navButtons.profile.addEventListener('click', () => navigateToScreen('profile'));

    // Top Header Actions Routing Hooks
    document.getElementById('btn-notifications').addEventListener('click', () => navigateToScreen('notifications'));
    document.getElementById('btn-messages-back-to-home').addEventListener('click', () => navigateToScreen('home'));
    document.getElementById('btn-notifications-back-to-home').addEventListener('click', () => navigateToScreen('home'));

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
        const thought = prompt("Share a status thought note:", document.getElementById('note-text-display').innerText);
        if(thought !== null && thought.trim() !== "") document.getElementById('note-text-display').innerText = thought;
    });

    views.home.addEventListener('scroll', evaluateHomeFeedAutoplay);
    document.getElementById('dynamic-reels-slider').addEventListener('scroll', evaluateReelsSliderAutoplay);

    // Profile Portfolio Grid Sub-Tab Switcher Logic
    const tabGrid = document.getElementById('tab-trigger-grid');
    const tabSaved = document.getElementById('tab-trigger-saved');
    const tabTagged = document.getElementById('tab-trigger-tagged');

    tabGrid.addEventListener('click', () => {
        tabGrid.classList.add('active'); tabSaved.classList.remove('active'); tabTagged.classList.remove('active');
        document.getElementById('profile-active-grid').classList.remove('hidden');
        document.getElementById('profile-saved-grid').classList.add('hidden');
    });

    tabSaved.addEventListener('click', () => {
        tabGrid.classList.remove('active'); tabSaved.classList.add('active'); tabTagged.classList.remove('active');
        document.getElementById('profile-active-grid').classList.add('hidden');
        document.getElementById('profile-saved-grid').classList.remove('hidden');
        renderProfileSavedTabItems();
    });

    applyUserIdentitySystemState();
});

function haltAllBackgroundVideos() {
    document.querySelectorAll('video').forEach(video => { video.pause(); });
}

function evaluateHomeFeedAutoplay() {
    if (currentActiveViewKey !== 'home') return;
    const feedVideos = document.getElementById('view-home').querySelectorAll('.post-display-file');
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
    const snapCards = document.getElementById('dynamic-reels-slider').querySelectorAll('.reel-snap-card');
    
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
    const btn = activeVideo.parentElement.querySelector('.feed-audio-toggle-overlay-btn');
    if(btn) btn.innerHTML = appGlobalAudioMuted ? `<i class="fa-solid fa-volume-xmark"></i>` : `<i class="fa-solid fa-volume-high"></i>`;
}

function applyUserIdentitySystemState() {
    const data = appDatabaseState.userProfile;
    document.querySelectorAll('.dyn-username').forEach(el => el.innerText = data.username);
    document.getElementById('profile-name-display').innerText = data.displayName;
    document.getElementById('profile-followers-count').innerText = data.followers;
    document.getElementById('profile-following-count').innerText = data.following;
    
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
        parent.innerHTML = data.avatarUrl ? `<img src="${data.avatarUrl}" alt="Avatar">` : `<i class="fa-solid fa-user"></i>`;
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
        `<img src="${mediaUrl}" class="post-display-file" alt="Feed media">`;
        
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
            <div class="post-media-frame">${innerContent}</div>
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
    setTimeout(evaluateHomeFeedAutoplay, 300);
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
    renderProfileSavedTabItems();
};

window.handleMockCommentAction = function(id) {
    const msg = prompt("Write a comment:");
    if(msg) alert(`Comment shared: "${msg}"`);
};

window.handleMockShareAction = function(id) { alert("Share sheets interface protocol initialized."); };

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
        return { success: false };
    } catch (e) {
        return { success: false };
    } finally {
        document.getElementById('global-file-picker').value = "";
    }
}
