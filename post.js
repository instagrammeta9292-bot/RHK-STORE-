function launchPostUpload() {
    const picker = document.getElementById('global-file-picker');
    picker.removeAttribute('multiple');
    picker.accept = "image/*"; 
    picker.onchange = null;
    picker.click();

    picker.onchange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const result = await sendToCloudinary(file);
        if(result.success) {
            const generatedItemId = 'item-' + Math.floor(Math.random() * 888888 + 111111);
            
            appDatabaseState.posts.unshift({ id: generatedItemId, url: result.url, mode: result.mode });
            saveAppStateToVault(); // Save instantly to local storage
            
            appendMediaToTimelineFeed(generatedItemId, result.url, result.mode, 'POST');
            syncProfileDashboardDOM();
        }
    };
}
