// SCREEN FUNCTION: Replicates your Screenshot #1 Layout (CRISP Clean White Notifications Registry Tray)
function generateNotificationsListDOM() {
    const container = document.getElementById('notifications-dynamic-list');
    container.innerHTML = '';

    // True Interactive Mock Database representing notifications matching requested profiles 
    const notificationModels = [
        { name: "mjrevanth", hasStory: false, time: "11 Jul", following: true },
        { name: "suhassh1920", hasStory: false, time: "10 Jul", following: true },
        { name: "likithgowda_7", hasStory: true, time: "10 Jul", following: true },
        { name: "tharun.shettyyy", hasStory: false, time: "10 Jul", following: true },
        { name: "raghu_salahalli", hasStory: false, time: "10 Jul", following: true },
        { name: "shashank.3413", hasStory: true, time: "10 Jul", following: true },
        { name: "harsha_r__07", hasStory: false, time: "10 Jul", following: true },
        { name: "_chetan._sahu_", hasStory: false, time: "09 Jul", following: true },
        { name: "suhas__reddy_06", hasStory: false, time: "09 Jul", following: true },
        { name: "chandan_tgowda", hasStory: false, time: "08 Jul", following: true }
    ];

    notificationModels.forEach((notify, index) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'notify-item-row';

        // Apply dynamic linear story rings exactly if flag is set true
        const ringClass = notify.hasStory ? 'notify-avatar-circle active-ring' : 'notify-avatar-circle';
        
        const rowHTML = `
            <div class="${ringClass}" id="notify-avatar-${index}">
                <i class="fa-solid fa-user"></i>
            </div>
            <div class="notify-text-paragraph">
                <strong>${notify.name}</strong> started following you. <span class="notify-time-stamp">${notify.time}</span>
            </div>
            <button class="notify-action-button-toggle following-mode" id="notify-btn-${index}">Following</button>
        `;

        itemRow.innerHTML = rowHTML;
        container.appendChild(itemRow);

        // FEATURE DEPLOYMENT: Wire direct story review popup toggle triggers on avatar rings click
        if(notify.hasStory) {
            itemRow.querySelector(`.active-ring`).addEventListener('click', () => {
                alert(`Opening temporary placeholder live operational event story for: ${notify.name}`);
            });
        }

        // FEATURE DEPLOYMENT: Action switch toggle buttons dynamically changing style/text rules interactively
        const actionBtn = itemRow.querySelector(`#notify-btn-${index}`);
        actionBtn.addEventListener('click', () => {
            if(actionBtn.classList.contains('following-mode')) {
                actionBtn.className = 'notify-action-button-toggle follow-back-mode';
                actionBtn.innerText = 'Follow Back';
            } else {
                actionBtn.className = 'notify-action-button-toggle following-mode';
                actionBtn.innerText = 'Following';
            }
        });
    });
}

