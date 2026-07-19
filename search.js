// SCREEN FUNCTION: Replicates your Screenshot #2 (Search Exploration Engine Layout Grid)
function syncSearchDiscoverGridDOM() {
    const grid = document.getElementById('search-dynamic-grid');
    const fallback = document.getElementById('search-empty-fallback-state');
    
    // Aggregate absolute content portfolio references from state vault array layers
    const items = [...appDatabaseState.reels, ...appDatabaseState.posts];

    if(items.length === 0) {
        grid.innerHTML = '';
        fallback.classList.remove('hidden');
        return;
    }

    fallback.classList.add('hidden');
    grid.innerHTML = '';

    items.forEach(item => {
        const cell = document.createElement('div');
        cell.className = 'grid-item-frame';
        
        // Render explore node using crisp modern video markers as screenshotted
        let mediaTag = item.mode === 'video' ? 
            `<video src="${item.url}" muted></video><i class="fa-solid fa-play grid-badge-icon"></i>` : 
            `<img src="${item.url}"><i class="fa-solid fa-image grid-badge-icon"></i>`;
            
        cell.innerHTML = mediaTag;
        
        // Interactive click event to review posts directly
        cell.addEventListener('click', () => {
            navigateToScreen('home');
            const targetElement = document.getElementById(`card-${item.id}`);
            if(targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
        });

        grid.appendChild(cell);
    });
}
