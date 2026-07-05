// NEXUS Facebook Secret Engine (Activated via /facebook command)
(function() {
    // ১. লোকাল স্টোরেজ চেক করা (যাতে একবার আনলক হলে পরে আর হাইড না হয়)
    let fbUnlocked = localStorage.getItem('nexus_fb_unlocked') === 'true';

    // ২. চ্যাটে /facebook কমান্ড ট্র্যাক করার লজিক
    function checkSecretCommand(text) {
        if (text && text.trim().toLowerCase() === '/facebook') {
            if (!fbUnlocked) {
                fbUnlocked = true;
                localStorage.setItem('nexus_fb_unlocked', 'true');
                alert("🔓 Secret Unlocked: Facebook Info Generator is now active!");
            }
        }
    }

    // ইউজার এন্টার চাপলে ইনপুট চেক করবে
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName.match(/INPUT|TEXTAREA/i)) {
            checkSecretCommand(e.target.value);
        }
    });

    // ইউজার সেন্ড বাটনে ক্লিক করলে ইনপুট চেক করবে
    window.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const inputs = document.querySelectorAll('input[type="text"], textarea');
            inputs.forEach(input => checkSecretCommand(input.value));
        }
    });

    // ৩. বাটন তৈরি করা (Notes বাটনের ঠিক ওপরে)
    const initFbBtn = setInterval(() => {
        if (fbUnlocked && !document.getElementById('nexus-fb-fab')) {
            const fab = document.createElement('button');
            fab.id = 'nexus-fb-fab';
            fab.innerHTML = '📘 FB Info';
            // Note বাটন bottom 80px এ আছে, তাই এটি 140px এ রাখা হলো (ঠিক ওপরে)
            fab.style.cssText = "position: fixed; bottom: 140px; right: 20px; background: #1877f2; color: white; padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(24, 119, 242, 0.4); z-index: 999998; transition: 0.3s; display: flex; align-items: center; gap: 8px;";
            
            fab.onmouseover = () => { fab.style.transform = "scale(1.05)"; };
            fab.onmouseout = () => { fab.style.transform = "scale(1)"; };
            
            fab.onclick = (e) => { e.preventDefault(); openFbModal(); };
            document.body.appendChild(fab);
        }
    }, 1000);

    // ৪. ফেসবুক পপ-আপ ও API লজিক
    function openFbModal() {
        let modal = document.getElementById('fb-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'fb-modal';
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 400px; background: #18181b; border: 1px solid #1877f2; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                <h2 style="color:#1877f2; font-weight:bold; font-size:18px; margin:0;">📘 FB Info Extractor</h2>
                <button id="close-fb-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
            </div>
            
            <input type="text" id="fb-query-input" placeholder="Enter keyword (e.g. pizza, gaming)..." style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px 15px; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box; margin-bottom:12px;" />
            <button id="fb-search-btn" style="background:#1877f2; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px;">Extract Data</button>
            
            <div id="fb-result" style="margin-top:15px; background:black; padding:15px; border-radius:10px; border:1px solid #3f3f46; display:none; flex-direction:column; gap:8px; max-height:250px; overflow-y:auto;">
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('close-fb-btn').onclick = () => modal.remove();

        document.getElementById('fb-search-btn').onclick = async () => {
            const query = document.getElementById('fb-query-input').value.trim();
            const resDiv = document.getElementById('fb-result');
            
            if (!query) {
                alert("Please enter a search keyword!");
                return;
            }

            resDiv.style.display = 'flex';
            resDiv.innerHTML = `<span style="color:#38bdf8; font-size:13px; text-align:center; animation: pulse 1.5s infinite;">⏳ Fetching Facebook Data...</span>`;

            try {
                // আপনার দেওয়া API 
                const response = await fetch(`https://facebook-scraper3.p.rapidapi.com/ads/search?query=${encodeURIComponent(query)}&country=US&active_status=ALL`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com',
                        'x-rapidapi-key': 'bae47b7f91msh5916b9a175c7aeap1387ddjsncec825a93b2a' // খেয়াল রাখবেন, লিমিট শেষ হলে আগের মতো Key পাল্টাতে হতে পারে
                    }
                });
                
                const data = await response.json();
                
                if (window.addNexusHistory) window.addNexusHistory(`FB Scraped: ${query}`, "📘 FB Info");

                if (data.message && data.message.toLowerCase().includes("exceeded")) {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ API Quota Exceeded. Limit Reached!</span>`;
                    return;
                }

                // API থেকে পাওয়া ডেটা সরাসরি স্ক্রিনে প্রিন্ট করা হচ্ছে
                if (data && Object.keys(data).length > 0) {
                    resDiv.innerHTML = `
                        <h3 style="color:#4ade80; margin:0 0 10px 0; font-size:15px; text-align:center; border-bottom: 1px dashed #3f3f46; padding-bottom: 5px;">✅ Data Extracted Successfully</h3>
                        <div style="font-size:12px; color:#a1a1aa; word-break:break-all; background:#27272a; padding:10px; border-radius:5px; line-height: 1.5;">
                            <span style="color:#38bdf8; font-weight:bold;">Extracted Output:</span><br><br>
                            ${JSON.stringify(data, null, 2).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}
                        </div>
                    `;
                } else {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ No data found for this keyword.</span>`;
                }
            } catch (err) {
                resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">⚠️ API Error or Network Issue!</span>`;
            }
        };
    }
})();
                                  
