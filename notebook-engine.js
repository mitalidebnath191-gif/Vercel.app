// NEXUS Permanent Notebook Engine
(function() {
    // ১. নোটবুক বাটন তৈরি করা
    const initNotebookBtn = setInterval(() => {
        if (!document.getElementById('nexus-notebook-btn')) {
            const btn = document.createElement('button');
            btn.id = 'nexus-notebook-btn';
            btn.innerHTML = '📝 Note';
            btn.style.cssText = "position: fixed; bottom: 80px; right: 20px; background: #fbbf24; color: black; padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4); z-index: 999998;";
            
            btn.onclick = () => openNotebookModal();
            document.body.appendChild(btn);
            clearInterval(initNotebookBtn);
        }
    }, 1000);

    // ২. নোটবুক পপ-আপ ডিজাইন
    function openNotebookModal() {
        let modal = document.getElementById('notebook-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'notebook-modal';
            modal.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:90%; max-width:400px; background:#18181b; border:1px solid #fbbf24; border-radius:16px; padding:20px; z-index:999999; box-shadow:0 10px 40px rgba(0,0,0,0.9); display:flex; flex-direction:column;";
            
            modal.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h2 style="color:#fbbf24; font-size:18px; margin:0;">📒 My Notebook</h2>
                    <button id="close-note" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; cursor:pointer;">X</button>
                </div>
                <textarea id="note-area" placeholder="Write your notes here..." style="width:100%; height:200px; background:#27272a; border:1px solid #52525b; color:white; padding:15px; border-radius:8px; outline:none; resize:none; box-sizing:border-box;"></textarea>
            `;
            document.body.appendChild(modal);

            // Close Button
            document.getElementById('close-note').onclick = () => modal.style.display = 'none';

            // অটো-সেভ লজিক (প্রতিবার টাইপ করার সাথে সাথে সেভ হবে)
            const area = document.getElementById('note-area');
            area.value = localStorage.getItem('nexus_notes') || '';
            
            area.addEventListener('input', () => {
                localStorage.setItem('nexus_notes', area.value);
            });
        }
        modal.style.display = 'flex';
    }
})();
              
