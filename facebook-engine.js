// NEXUS Facebook Secret Engine (ID Scanner)
(function() {
    let fbUnlocked = localStorage.getItem('nexus_fb_unlocked') === 'true';

    function checkSecretCommand(text) {
        if (text && text.trim().toLowerCase() === '/facebook') {
            if (!fbUnlocked) {
                fbUnlocked = true;
                localStorage.setItem('nexus_fb_unlocked', 'true');
                alert("🔓 Secret Unlocked: Facebook ID Scanner is now active!");
            }
        }
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName.match(/INPUT|TEXTAREA/i)) {
            checkSecretCommand(e.target.value);
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const inputs = document.querySelectorAll('input[type="text"], textarea');
            inputs.forEach(input => checkSecretCommand(input.value));
        }
    });

    // বাটন তৈরি
    const initFbBtn = setInterval(() => {
        if (fbUnlocked && !document.getElementById('nexus-fb-fab')) {
            const fab = document.createElement('button');
            fab.id = 'nexus-fb-fab';
            fab.innerHTML = '📘 FB Scanner';
            fab.style.cssText = "position: fixed; bottom: 140px; right: 20px; background: #1877f2; color: white; padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(24, 119, 242, 0.4); z-index: 999998; transition: 0.3s; display: flex; align-items: center; gap: 8px;";
            
            fab.onmouseover = () => { fab.style.transform = "scale(1.05)"; };
            fab.onmouseout = () => { fab.style.transform = "scale(1)"; };
            
            fab.onclick = (e) => { e.preventDefault(); openFbModal(); };
            document.body.appendChild(fab);
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
                // ID থেকে সমস্ত ডেটা বের করার জন্য API URL (username বা user_id প্যারামিটার দিয়ে)
                const url = `https://facebook-scraper3.p.rapidapi.com/user/info?username=${encodeURIComponent(fbId)}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com',
                        'x-rapidapi-key': 'bae47b7f91msh5916b9a175c7aeap1387ddjsncec825a93b2a' // আপনার API Key
                    }
                });
                
                const data = await response.json();
                
                if (window.addNexusHistory) window.addNexusHistory(`FB Scanned: ${fbId}`, "📘 FB Scanner");

                // API Error Handling
                if (data.message && (data.message.includes("exceeded") || data.message.includes("Invalid"))) {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ API Error: ${data.message}</span>`;
                    return;
                }
                if (response.status === 404) {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ ID Not Found or Private Profile.</span>`;
                    return;
                }

                // ID এর সমস্ত ডেটা স্ক্রিনে সুন্দর করে প্রিন্ট করা
                if (data && Object.keys(data).length > 0) {
                    // যদি নামের ডেটা আলাদা করে পাওয়া যায়, তবে সেটা হাইলাইট করা হবে
                    const displayName = data.name || data.title || fbId; 
                    
                    resDiv.innerHTML = `
                        <h3 style="color:#4ade80; margin:0 0 10px 0; font-size:15px; text-align:center; border-bottom: 1px dashed #3f3f46; padding-bottom: 5px;">✅ Profile Scanned: ${displayName}</h3>
                        
                        <div style="font-size:12px; color:#a1a1aa; background:#27272a; padding:10px; border-radius:5px; line-height: 1.5; overflow-wrap: break-word;">
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
                                                   
