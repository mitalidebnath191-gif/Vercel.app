// NEXUS Facebook Secret Engine (Hide/Show Fixed)
(function() {
    let fbUnlocked = localStorage.getItem('nexus_fb_unlocked') === 'true';

    function checkSecretCommand(e, text) {
        const cmd = text.trim().toLowerCase();
        
        if (cmd === '/facebook') {
            e.stopPropagation(); // নরমাল AI-কে ম্যাসেজ পড়া থেকে থামাবে
            e.preventDefault();
            fbUnlocked = true;
            localStorage.setItem('nexus_fb_unlocked', 'true');
            alert("🔓 Facebook Scanner: ENABLED");
            clearInput(e);
        } 
        else if (cmd === '/facebook hide') {
            e.stopPropagation();
            e.preventDefault();
            fbUnlocked = false;
            localStorage.setItem('nexus_fb_unlocked', 'false');
            
            // সাথে সাথে স্ক্রিন থেকে বাটন রিমুভ করা (কোনো রিফ্রেশ ছাড়া)
            const existingFab = document.getElementById('nexus-fb-fab');
            if (existingFab) existingFab.remove();
            
            alert("🔒 Facebook Scanner: HIDDEN");
            clearInput(e);
        }
    }

    function clearInput(e) {
        if (e.target && e.target.value !== undefined) {
            e.target.value = '';
        } else {
            const input = document.querySelector('input[type="text"], textarea');
            if (input) input.value = '';
        }
    }

    // ইভেন্ট লিসেনারে 'true' যুক্ত করা হয়েছে যাতে এটি সবার আগে কমান্ডটি ক্যাচ করে
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName.match(/INPUT|TEXTAREA/i)) {
            if (e.target.value.trim().toLowerCase().startsWith('/facebook')) {
                checkSecretCommand(e, e.target.value);
            }
        }
    }, true); 

    window.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const btn = e.target.closest('button');
            if (btn && (btn.innerText.includes('Send') || btn.innerHTML.includes('Send') || btn.innerHTML.includes('svg'))) {
                const input = document.querySelector('input[type="text"], textarea');
                if (input && input.value.trim().toLowerCase().startsWith('/facebook')) {
                    checkSecretCommand(e, input.value);
                }
            }
        }
    }, true);

    // বাটন তৈরি ও রিমুভ লজিক
    setInterval(() => {
        const existingFab = document.getElementById('nexus-fb-fab');
        
        if (fbUnlocked) {
            if (!existingFab) {
                const fab = document.createElement('button');
                fab.id = 'nexus-fb-fab';
                fab.innerHTML = '📘 FB Scanner';
                fab.style.cssText = "position: fixed; bottom: 140px; right: 20px; background: #1877f2; color: white; padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(24, 119, 242, 0.4); z-index: 999998; transition: 0.3s; display: flex; align-items: center; gap: 8px;";
                
                fab.onmouseover = () => { fab.style.transform = "scale(1.05)"; };
                fab.onmouseout = () => { fab.style.transform = "scale(1)"; };
                
                fab.onclick = (ev) => { ev.preventDefault(); openFbModal(); };
                document.body.appendChild(fab);
            }
        } else {
            if (existingFab) existingFab.remove(); // হাইড করা থাকলে বাটন রিমুভ হবে
        }
    }, 1000);

    // পপ-আপ ও API লজিক
    function openFbModal() {
        let modal = document.getElementById('fb-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'fb-modal';
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 400px; background: #18181b; border: 1px solid #1877f2; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                <h2 style="color:#1877f2; font-weight:bold; font-size:18px; margin:0;">📘 FB ID Scanner</h2>
                <button id="close-fb-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
            </div>
            
            <div style="font-size:12px; color:#a1a1aa; margin-bottom:10px; text-align:center;">Enter Profile ID or Username to extract all data.</div>
            
            <input type="text" id="fb-id-input" placeholder="e.g. zuck or 1000837..." style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px 15px; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box; margin-bottom:12px; font-family:monospace;" />
            
            <button id="fb-scan-btn" style="background:#1877f2; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px;">Scan ID Data</button>
            
            <div id="fb-result" style="margin-top:15px; background:black; padding:15px; border-radius:10px; border:1px solid #3f3f46; display:none; flex-direction:column; gap:8px; max-height:280px; overflow-y:auto;">
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('close-fb-btn').onclick = () => modal.remove();

        document.getElementById('fb-scan-btn').onclick = async () => {
            const fbId = document.getElementById('fb-id-input').value.trim();
            const resDiv = document.getElementById('fb-result');
            
            if (!fbId) {
                alert("Please enter a valid Facebook ID or Username!");
                return;
            }

            resDiv.style.display = 'flex';
            resDiv.innerHTML = `<span style="color:#38bdf8; font-size:13px; text-align:center; animation: pulse 1.5s infinite;">⏳ Scanning Profile Data...</span>`;

            try {
                const url = `https://facebook-scraper3.p.rapidapi.com/user/info?username=${encodeURIComponent(fbId)}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com',
                        'x-rapidapi-key': 'bae47b7f91msh5916b9a175c7aeap1387ddjsncec825a93b2a'
                    }
                });
                
                const data = await response.json();
                
                if (window.addNexusHistory) window.addNexusHistory(`FB Scanned: ${fbId}`, "📘 FB Scanner");

                if (data.message && (data.message.includes("exceeded") || data.message.includes("Invalid"))) {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ API Error: ${data.message}</span>`;
                    return;
                }
                if (response.status === 404) {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ ID Not Found or Private Profile.</span>`;
                    return;
                }

                if (data && Object.keys(data).length > 0) {
                    const displayName = data.name || data.title || fbId; 
                    
                    resDiv.innerHTML = `
                        <h3 style="color:#4ade80; margin:0 0 10px 0; font-size:15px; text-align:center; border-bottom: 1px dashed #3f3f46; padding-bottom: 5px;">✅ Profile Scanned: ${displayName}</h3>
                        
                        <div style="font-size:12px; color:#a1a1aa; background:#27272a; padding:10px; border-radius:5px; line-height: 1.5; overflow-wrap: break-word; font-family:monospace;">
                            <span style="color:#38bdf8; font-weight:bold;">All Extracted Data:</span><br><br>
                            ${JSON.stringify(data, null, 2).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}
                        </div>
                    `;
                } else {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ No public data found for this ID.</span>`;
                }
            } catch (err) {
                resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">⚠️ API URL Error or Network Issue!</span>`;
            }
        };
    }
})();
            
