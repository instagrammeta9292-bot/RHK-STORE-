// FIXED: The complete operational logic code for Story Tray triggers and immediate viewing popup mounting
function launchStoryUpload() {
    const picker = document.getElementById('global-file-picker');
    picker.removeAttribute('multiple');
    picker.accept = "image/*,video/*";
    picker.onchange = null;
    picker.click();

    picker.onchange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const result = await sendToCloudinary(file);
        if(result.success) {
            renderStoryToTray(result.url, result.mode);
        }
    };
}

// FIXED: story-ring click handler mapped precisely to show the viewing window overlay dynamically
function renderStoryToTray(url, mode) {
    const tray = document.getElementById('dynamic-stories-list');
    const storyId = 'story_' + Math.floor(Math.random() * 89999 + 10000);
    
    appDatabaseState.activeStories[storyId] = { url: url, mode: mode, createdAt: Date.now() };
    let thumbTag = mode === 'video' ? `<video src="${url}" muted playsinline></video>` : `<img src="${url}">`;

    const htmlNode = `
        <div class="story-wrapper" id="node-${storyId}">
            <button class="story-expiry-shortcut-btn" onclick="event.stopPropagation(); triggerStoryExpirationPipeline('${storyId}')">Expire</button>
            <div class="story-ring" onclick="openStoryViewer('${storyId}')">
                <div class="story-thumb-placeholder">${thumbTag}</div>
            </div>
            <span class="story-name">${appDatabaseState.userProfile.username}</span>
        </div>
    `;
    
    tray.insertAdjacentHTML('afterbegin', htmlNode);
    setTimeout(() => { triggerStoryExpirationPipeline(storyId); }, 24 * 60 * 60 * 1000);
}

window.triggerStoryExpirationPipeline = function(storyId) {
    const targetStory = appDatabaseState.activeStories[storyId];
    if(!targetStory) return;

    if(typeof archiveExpiredStory === 'function') archiveExpiredStory(storyId, targetStory);
    const domElement = document.getElementById(`node-${storyId}`);
    if(domElement) domElement.remove();
    delete appDatabaseState.activeStories[storyId];
};

// FIXED: Comprehensive dynamic injection logic mapping for layout story viewer popup window
function openStoryViewer(storyId) {
    haltAllBackgroundVideos();
    const target = appDatabaseState.activeStories[storyId];
    if(!target) return;

    const viewer = document.getElementById('story-viewer-modal');
    const container = document.getElementById('story-viewer-media-container');
    const progressBar = document.getElementById('story-progress-fill');
    const profile = appDatabaseState.userProfile;
    
    document.getElementById('story-viewer-user-name').innerText = profile.username;
    document.getElementById('story-viewer-user-avatar').innerHTML = profile.avatarUrl ? `<img src="${profile.avatarUrl}">` : `<i class="fa-solid fa-user"></i>`;
    
    container.innerHTML = '';
    progressBar.style.width = '0%';
    viewer.classList.remove('hidden');

    if(target.mode === 'video') {
        container.innerHTML = `<video src="${target.url}" autoplay playsinline id="active-story-video"></video>`;
    } else {
        container.innerHTML = `<img src="${target.url}">`;
    }

    let progress = 0;
    clearInterval(window.storyTimerInterval);
    
    window.storyTimerInterval = setInterval(() => {
        progress += 1;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        if(progress >= 100) {
            clearInterval(window.storyTimerInterval);
            closeStoryViewer();
        }
    }, 50); // Standardized 5-second viewing lifespan metrics
}

function closeStoryViewer() {
    clearInterval(window.storyTimerInterval);
    document.getElementById('story-viewer-modal').classList.add('hidden');
    document.getElementById('story-viewer-media-container').innerHTML = '';
    evaluateHomeFeedAutoplay();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-close-story-viewer').addEventListener('click', closeStoryViewer);
});

