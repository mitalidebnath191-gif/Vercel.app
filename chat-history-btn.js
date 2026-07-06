// NEXUS History Engine (With Delete Feature)
(function() {
    // ১. হিস্ট্রি সেভ করার গ্লোবাল ফাংশন (অন্যান্য ফাইল থেকে কল করার জন্য)
    window.addNexusHistory = function(action, moduleName) {
        let history = JSON.parse(localStorage.getItem('nexus_history') || '[]');
        const time = new Date().toLocaleTimeString();
        history.unshift({ action, moduleName, time }); // নতুন হিস্ট্রি সবার উপরে থাকবে
        if (history.length > 50) history.pop(); // শুধু শেষের ৫০টি সেভ রাখবে
        localStorage.setItem('nexus_history', JSON.stringify(history));
    };

    // ২. মেইন স্ক্রিনে হিস্ট্রি বাটন তৈরি
    const initHistoryBtn = setInterval(() => {
        if (!document.getElementById('nexus-history-fab')) {
            const fab = document.createElement('button');
            fab.id = 'nexus-history-fab';
            fab.innerHTML = '🕒 History';
            fab.style.cssText = "position: absolute; top: 15px; left: 15px; background: #3f3f46; color: white; padding: 8px 15px; border-radius: 8px; font-size: 13px; font-weight: bold; border: 1px solid #52525b; cursor: pointer; z-index: 9999; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: 0.3s;";
            
            fab.onmouseover = () => { fab.style.background = "#52525b"; };
            fab.onmouseout = () => { fab.style.background = "#3f3f46"; };
            
            fab.onclick = (e) => { e.preventDefault(); openHistoryModal(); };
            document.body.appendChild(fab);
        }
    }, 1000);

    // ৩. হিস্ট্রি পপ-আপ ডিজাইন এবং ডিলিট লজিক
    function openHistoryModal() {
        let modal = document.getElementById('history-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'history-modal';
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 400px; background: #18181b; border: 1px solid #a855f7; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column; max-height: 75vh;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                <h2 style="color:#a855f7; font-weight:bold; font-size:18px; margin:0;">🕒 Activity History</h2>
                <div style="display:flex; gap:10px;">
                    <!-- নতুন ডিলিট বাটন -->
                    <button id="clear-history-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:12px; transition: 0.2s;">🗑️ Clear</button>
                    <button id="close-history-btn" style="background:#3f3f46; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>
            </div>
            
            <div id="history-list" style="display:flex; flex-direction:column; gap:8px; overflow-y:auto; padding-right:5px; flex:1;">
                <!-- History items will load here -->
            </div>
        `;
        document.body.appendChild(modal);
        
        const historyList = document.getElementById('history-list');
        const closeBtn = document.getElementById('close-history-btn');
        const clearBtn = document.getElementById('clear-history-btn');

        closeBtn.onclick = () => modal.remove();

        // ৪. ডিলিট বাটনের ফাংশন
        clearBtn.onclick = () => {
            const confirmDelete = confirm("Are you sure you want to delete all history?");
            if (confirmDelete) {
                localStorage.removeItem('nexus_history'); // লোকাল স্টোরেজ থেকে সব ডেটা মুছে ফেলবে
                loadHistory(); // লিস্ট সাথে সাথে আপডেট করে ফাঁকা দেখাবে
            }
        };

        // ৫. হিস্ট্রি লোড করে স্ক্রিনে দেখানোর লজিক
        function loadHistory() {
            let history = JSON.parse(localStorage.getItem('nexus_history') || '[]');
            historyList.innerHTML = '';

            if (history.length === 0) {
                historyList.innerHTML = `<div style="text-align:center; color:#a1a1aa; font-size:13px; padding:20px;">No activity history found.</div>`;
                return;
            }

            history.forEach(item => {
                const div = document.createElement('div');
                div.style.cssText = "background:#27272a; padding:10px; border-radius:8px; border-left: 3px solid #a855f7; display:flex; justify-content:space-between; align-items:center;";
                
                div.innerHTML = `
                    <div style="display:flex; flex-direction:column; overflow:hidden; padding-right:10px;">
                        <span style="color:white; font-size:13px; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.action}</span>
                        <span style="color:#a1a1aa; font-size:11px;">${item.moduleName}</span>
                    </div>
                    <span style="color:#38bdf8; font-size:11px; white-space:nowrap;">${item.time}</span>
                `;
                historyList.appendChild(div);
            });
        }

        loadHistory();
    }
})();
    
