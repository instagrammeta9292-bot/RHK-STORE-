document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-back-from-archive').addEventListener('click', () => navigateToScreen('profile'));
});

function archiveExpiredStory(storyId, storyObject) {
    // Avoid double logging archived objects safely
    if(appDatabaseState.archivedStories.some(s => s.id === storyId)) return;

    appDatabaseState.archivedStories.push({
        id: storyId,
        url: storyObject.url,
        mode: storyObject.mode,
        archivedAt: Date.now()
    });
    
    saveAppStateToVault(); // Sync down onto disk database
    syncArchiveContainerGridDOM();
}

function syncArchiveContainerGridDOM() {
    const emptyBox = document.getElementById('archive-empty-state');
    const populatedGrid = document.getElementById('archive-populated-grid');
    const list = appDatabaseState.archivedStories;

    if(list.length === 0) {
        emptyBox.classList.remove('hidden');
        populatedGrid.classList.add('hidden');
        return;
    }

    emptyBox.classList.add('hidden');
    populatedGrid.classList.remove('hidden');
    populatedGrid.innerHTML = '';

    list.forEach(item => {
        const frame = document.createElement('div');
        frame.className = 'grid-item-frame';
        let layoutTag = item.mode === 'video' ? `<video src="${item.url}"></video><i class="fa-solid fa-film grid-badge-icon"></i>` : `<img src="${item.url}"><i class="fa-solid fa-image grid-badge-icon"></i>`;
        frame.innerHTML = layoutTag;
        
        frame.addEventListener('click', () => {
            haltAllBackgroundVideos();
            const viewer = document.getElementById('story-viewer-modal');
            const container = document.getElementById('story-viewer-media-container');
            document.getElementById('story-viewer-user-name').innerText = "Archived Story";
            document.getElementById('story-progress-fill').style.width = '100%';
            container.innerHTML = item.mode === 'video' ? `<video src="${item.url}" autoplay controls></video>` : `<img src="${item.url}">`;
            viewer.classList.remove('hidden');
        });

        populatedGrid.appendChild(frame);
    });
}
