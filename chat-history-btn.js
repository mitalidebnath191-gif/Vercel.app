// NEXUS History Engine - সবকিছু অটোমেটিক সেভ হবে
(function() {
    // ১. হিস্ট্রি সেভ করার মেইন ফাংশন
    window.addNexusHistory = (title, type) => {
        let history = JSON.parse(localStorage.getItem('nexus_chat_history')) || [];
        const newItem = {
            date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            title: title,
            type: type
        };
        history.unshift(newItem);
        localStorage.setItem('nexus_chat_history', JSON.stringify(history.slice(0, 50)));
        console.log("NEXUS History Saved:", title);
    };

    // ২. অটো-ক্যাপচার লজিক (সব বাটনে ক্লিক ট্র্যাক করবে)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const btnText = btn.innerText.trim();
        const inputField = btn.parentElement.querySelector('input');
        const inputValue = inputField ? inputField.value : "";

        // URL Scanner, IMEI, বা সার্চ বাটন চিনিয়ে দেওয়া
        if (btnText.includes('Scan') || btnText.includes('Search')) {
            const toolName = btnText.includes('Scan') ? "📸 URL Scanner" : "📱 IMEI/Search Tool";
            const task = inputValue ? inputValue : "Performed an action";
            window.addNexusHistory(task, toolName);
        }
    }, true);

    // ৩. History বাটন এবং Modal ইনজেকশন
    setInterval(() => {
        const profile = Array.from(document.querySelectorAll('div, span')).find(el => el.innerText.includes('Alex Rivera'));
        if (profile && !document.getElementById('nexus-history-btn')) {
            const btn = document.createElement('button');
            btn.id = 'nexus-history-btn';
            btn.innerHTML = '🕒 History';
            btn.style.cssText = "background: #27272a; color: #a1a1aa; padding: 5px 12px; border-radius: 6px; font-size: 12px; border: 1px solid #3f3f46; margin-right: 10px; cursor: pointer;";
            profile.parentElement.prepend(btn);
            
            btn.onclick = () => {
                let modal = document.getElementById('history-modal');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'history-modal';
                    modal.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:90%; max-width:400px; background:#18181b; padding:20px; border-radius:15px; z-index:999999; color:white; border:1px solid #3f3f46;";
                    modal.innerHTML = `<h3>🕒 Chat History</h3><div id="h-list" style="max-height:300px; overflow-y:auto;"></div><button id="h-close" style="width:100%; margin-top:10px;">Close</button>`;
                    document.body.appendChild(modal);
                    document.getElementById('h-close').onclick = () => modal.style.display = 'none';
                }
                
                const list = document.getElementById('h-list');
                const history = JSON.parse(localStorage.getItem('nexus_chat_history')) || [];
                list.innerHTML = history.map(h => `<div style="padding:8px; border-bottom:1px solid #333;"><small>${h.date}</small><div><b>${h.type}</b>: ${h.title}</div></div>`).join('');
                modal.style.display = 'block';
            };
        }
    }, 1000);
})();
            
