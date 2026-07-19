document.addEventListener('DOMContentLoaded', () => {
    const viewTriggerBtn = document.getElementById('btn-edit-profile-view');
    const backBtn = document.getElementById('btn-back-from-edit');
    const saveBtn = document.getElementById('btn-save-profile-data');
    const changeAvatarBtn = document.getElementById('btn-change-profile-photo');
    const bioTextArea = document.getElementById('input-edit-bio');

    const inputName = document.getElementById('input-edit-name');
    const inputUsername = document.getElementById('input-edit-username');
    const inputWebsite = document.getElementById('input-edit-website');
    const toggleThreads = document.getElementById('toggle-threads-badge');

    viewTriggerBtn.addEventListener('click', () => {
        const profile = appDatabaseState.userProfile;
        inputName.value = profile.displayName;
        inputUsername.value = profile.username;
        inputWebsite.value = profile.website;
        bioTextArea.value = profile.bio;
        toggleThreads.checked = profile.showThreadsBadge;
        
        document.getElementById('bio-char-counter').innerText = `${profile.bio.length} / 150`;
        navigateToScreen('editProfile');
    });

    backBtn.addEventListener('click', () => navigateToScreen('profile'));

    bioTextArea.addEventListener('input', (e) => {
        document.getElementById('bio-char-counter').innerText = `${e.target.value.length} / 150`;
    });

    saveBtn.addEventListener('click', () => {
        if(!inputUsername.value.trim()) {
            alert("Username cannot be empty.");
            return;
        }

        const profile = appDatabaseState.userProfile;
        profile.displayName = inputName.value.trim();
        profile.username = inputUsername.value.trim().toLowerCase().replace(/\s+/g, '');
        profile.website = inputWebsite.value.trim();
        profile.bio = bioTextArea.value.trim();
        profile.showThreadsBadge = toggleThreads.checked;

        // Commit profile metadata updates to persistence memory
        saveAppStateToVault();
        alert("Profile operational modifications successfully synchronized!");
        navigateToScreen('profile');
    });

    changeAvatarBtn.addEventListener('click', () => { launchAvatarDirectUpload(); });
});

window.launchAvatarDirectUpload = function() {
    const picker = document.getElementById('global-file-picker');
    picker.removeAttribute('multiple');
    picker.accept = "image/*";
    picker.onchange = null;
    picker.click();

    picker.onchange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const result = await sendToCloudinary(file);
        if(result.success && result.mode === 'image') {
            appDatabaseState.userProfile.avatarUrl = result.url;
            saveAppStateToVault();
            applyUserIdentitySystemState();
            alert("Avatar picture uploaded and synchronized successfully!");
        }
    };
};
