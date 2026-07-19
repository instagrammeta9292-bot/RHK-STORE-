function launchReelsUpload() {
    const picker = document.getElementById('global-file-picker');
    picker.removeAttribute('multiple');
    picker.accept = "video/*,image/*"; 
    picker.onchange = null;
    picker.click();

    picker.onchange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const result = await sendToCloudinary(file);
        if(result.success) {
            const generatedItemId = 'item-' + Math.floor(Math.random() * 888888 + 111111);
            
            appDatabaseState.reels.unshift({ id: generatedItemId, url: result.url, mode: result.mode });
            saveAppStateToVault(); // Commit to persistent memory immediately
            
            appendMediaToTimelineFeed(generatedItemId, result.url, result.mode, 'REEL');
            appendMediaToVerticalReelsSlider(generatedItemId, result.url, result.mode);
            syncProfileDashboardDOM();
        }
    };
}

function appendMediaToVerticalReelsSlider(id, mediaUrl, mode) {
    const slider = document.getElementById('dynamic-reels-slider');
    const emptyState = document.getElementById('reels-empty-state');
    if(emptyState) emptyState.classList.add('hidden');

    const profile = appDatabaseState.userProfile;
    let avatarContent = profile.avatarUrl ? `<img src="${profile.avatarUrl}">` : `<i class="fa-solid fa-user"></i>`;
    
    let elementNodeTag = mode === 'video' ? 
        `<video id="${id}" src="${mediaUrl}" class="reel-video-element" loop playsinline></video>` : 
        `<img src="${mediaUrl}" class="reel-video-element" alt="Reel element">`;

    const isSaved = appDatabaseState.savedItemIds.includes(id);
    const saveIconClass = isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';

    const reelItemHTML = `
        <div class="reel-snap-card" id="reel-card-${id}" data-reel-id="${id}">
            ${elementNodeTag}
            
            <div class="reel-gesture-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:2;" 
                 onclick="handleReelGestureTouchTapSequence(event, '${id}')"></div>
            
            <div class="reel-overlay-details" style="z-index:3;">
                <div class="reel-user-row">
                    <div class="reel-user-avatar">${avatarContent}</div>
                    <span class="reel-username">${profile.username}</span>
                    <button class="reel-follow-tag-btn">Follow</button>
                </div>
                <p class="reel-caption">Immersive dynamic fullscreen cover reel element.</p>
            </div>
            
            <div class="reel-sidebar-actions-column" style="z-index:4;">
                <div class="reel-sidebar-btn" onclick="handleDynamicItemLikeClick('${id}')">
                    <i class="fa-regular fa-heart" id="reel-like-icon-${id}"></i><span>Likes</span>
                </div>
                <div class="reel-sidebar-btn" onclick="handleMockCommentAction('${id}')">
                    <i class="fa-regular fa-comment"></i><span>Comments</span>
                </div>
                <div class="reel-sidebar-btn" onclick="handleMockShareAction('${id}')">
                    <i class="fa-regular fa-paper-plane"></i><span>Share</span>
                </div>
                <div class="reel-sidebar-btn" onclick="handleDynamicItemSaveToggle('${id}')">
                    <i class="${saveIconClass}" id="reel-save-icon-${id}"></i><span>Save</span>
                </div>
            </div>
        </div>
    `;

    slider.insertAdjacentHTML('afterbegin', reelItemHTML);
}

let lastReelTapTimeTracker = 0;
window.handleReelGestureTouchTapSequence = function(event, id) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastReelTapTimeTracker;
    const video = document.getElementById(id);

    if (tapLength < 250 && tapLength > 0) {
        handleDynamicItemLikeClick(id);
        if(event && event.currentTarget) triggerBigHeartPopupBurstAnimation(event.currentTarget);
    } else {
        if(video && video.tagName === 'VIDEO') {
            if (video.paused) { video.play().catch(() => {}); } 
            else { video.pause(); }
        }
    }
    lastReelTapTimeTracker = currentTime;
};

function triggerBigHeartPopupBurstAnimation(containerCard) {
    const heart = document.createElement('i');
    heart.className = 'fa-solid fa-heart reel-heart-pop-animation';
    containerCard.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 700);
}
