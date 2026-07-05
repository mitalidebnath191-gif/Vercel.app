// NEXUS Permanent History Button (Local Storage Integration)
const hookHistoryBtn = setInterval(() => {
    const profileElements = Array.from(document.querySelectorAll('div, span, a')).filter(el =>
        el.innerText && el.innerText.includes('Alex Rivera') && el.innerText.includes('Pro')
    );

    let targetProfile = profileElements.find(el => el.children.length > 0) || profileElements[0];

    if (targetProfile && targetProfile.parentElement && !document.getElementById('nexus-history-btn')) {
        const headerContainer = targetProfile.parentElement;
        
        if(window.getComputedStyle(headerContainer).display !== 'flex') {
            headerContainer.style.display = 'flex';
            headerContainer.style.alignItems = 'center';
        }

        const historyBtn = document.createElement('button');
        historyBtn.id = 'nexus-history-btn';
        historyBtn.innerHTML = '🕒 History';
        historyBtn.style.cssText = "background: #27272a; color: #a1a1aa; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: bold; border: 1px solid #3f3f46; cursor: pointer; margin-right: 15px; transition: all 0.3s ease; display: flex; align-items: center; gap: 6px; z-index: 50;";

        historyBtn.onmouseover = () => { historyBtn.style.color = "white"; historyBtn.style.borderColor = "#a78bfa"; historyBtn.style.background = "#3f3f46"; };
        historyBtn.onmouseout = () => { historyBtn.style.color = "#a1a1aa"; historyBtn.style.borderColor = "#3f3f46"; historyBtn.style.background = "#27272a"; };

        headerContainer.insertBefore(historyBtn, targetProfile);

        historyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openHistoryModal();
        });
    }
}, 1000);

// ==========================================
// গ্লোবাল ফাংশন: যেকোনো জায়গা থেকে হিস্ট্রি সেভ করার জন্য
// ==========================================
window.addNexusHistory = function(title, type) {
    // আগের সেভ করা ডেটা আনা
    let savedHistory = JSON.parse(localStorage.getItem('nexus_chat_history')) || [];
    
    // নতুন ডেটা তৈরি করা (টাইম সহ)
    const now = new Date();
    const timeString = now.toLocaleDateString() + " " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const newItem = {
        date: timeString,
        title: title,
        type: type
    };

    // নতুন ডেটা একদম শুরুতে (উপরে) রাখা
    savedHistory.unshift(newItem);

    // সর্বোচ্চ ৫০টি হিস্ট্রি সেভ রাখা (যাতে অ্যাপ স্লো না হয়)
    if(savedHistory.length > 50) {
        savedHistory.pop(); 
    }

    // লোকাল স্টোরেজে পার্মানেন্টভাবে সেভ করা
    localStorage.setItem('nexus_chat_history', JSON.stringify(savedHistory));
};


// হিস্ট্রি পপ-আপ খোলার ফাংশন
function openHistoryModal() {
    let modal = document.getElementById('history-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'history-modal';
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 450px; background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #3f3f46;">
                <h2 style="color:#a78bfa; font-weight:bold; font-size:18px; margin:0;">🕒 Account Chat History</h2>
                <button id="close-history-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
            </div>
            
            <div style="display:flex; justify-content:space-between; margin-bottom: 12px;">
                <span style="color:#a1a1aa; font-size:12px;">Account: <b>Alex Rivera</b></span>
                <span style="color:#a1a1aa; font-size:12px;">Total Chats: <b id="chat-count">0</b></span>
            </div>

            <div id="history-list" style="display:flex; flex-direction:column; gap:10px; max-height:300px; overflow-y:auto; padding-right: 5px;">
                <!-- হিস্ট্রি এখানে লোড হবে -->
            </div>
            
            <button id="clear-history-btn" style="margin-top: 15px; background:#27272a; color:#ef4444; border:1px solid #ef4444; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; transition:0.3s;">🗑️ Clear All History</button>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-history-btn').addEventListener('click', () => {
            document.getElementById('history-modal').style.display = 'none';
        });

        document.getElementById('clear-history-btn').addEventListener('click', () => {
            if(confirm("Are you sure you want to delete all chat history?")) {
                localStorage.removeItem('nexus_chat_history'); // পার্মানেন্টলি ডিলিট
                loadChatHistory(); // সাথে সাথে রিলোড
            }
        });

        document.getElementById('clear-history-btn').onmouseover = function() { this.style.background = '#ef4444'; this.style.color = 'white'; }
        document.getElementById('clear-history-btn').onmouseout = function() { this.style.background = '#27272a'; this.style.color = '#ef4444'; }

    } else {
        modal.style.display = 'flex';
    }

    loadChatHistory();
}

// হিস্ট্রি ডেটা লোড করার লজিক
function loadChatHistory() {
    const historyList = document.getElementById('history-list');
    const chatCount = document.getElementById('chat-count');
    historyList.innerHTML = '';

    // Local Storage থেকে অরিজিনাল ডেটা আনছে (যা অ্যাপ বন্ধ করলেও মুছবে না)
    let savedHistory = JSON.parse(localStorage.getItem('nexus_chat_history')) || [];

    chatCount.innerText = savedHistory.length;

    if (savedHistory.length === 0) {
        historyList.innerHTML = `<div style="text-align:center; color:#a1a1aa; padding:20px; font-size:14px;">No history found. Start chatting or searching!</div>`;
        return;
    }

    // হিস্ট্রি কার্ড তৈরি করা
    savedHistory.forEach(chat => {
        const item = document.createElement('div');
        item.style.cssText = "background: #27272a; padding: 12px; border-radius: 8px; border: 1px solid #3f3f46; display: flex; flex-direction: column; cursor: pointer; transition: 0.2s;";
        
        item.onmouseover = () => { item.style.borderColor = "#8b5cf6"; };
        item.onmouseout = () => { item.style.borderColor = "#3f3f46"; };

        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="color:#a78bfa; font-size:11px; font-weight:bold;">${chat.type}</span>
                <span style="color:#71717a; font-size:11px;">${chat.date}</span>
            </div>
            <div style="color:white; font-size:13px;">${chat.title}</div>
        `;
        historyList.appendChild(item);
    });
      }
                                                                               
