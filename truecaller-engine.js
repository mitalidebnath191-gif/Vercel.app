// NEXUS Viewcaller OS Engine (New API Integrated)
(function() {
    const initTruecallerBtn = setInterval(() => {
        if (!document.getElementById('nexus-truecaller-fab')) {
            const fab = document.createElement('button');
            fab.id = 'nexus-truecaller-fab';
            fab.innerHTML = '📞 Caller ID';
            fab.style.cssText = "position: fixed; bottom: 80px; left: 20px; background: #3b82f6; color: white; padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); z-index: 999998; transition: 0.3s; display: flex; align-items: center; gap: 8px;";
            
            fab.onmouseover = () => { fab.style.transform = "scale(1.05)"; };
            fab.onmouseout = () => { fab.style.transform = "scale(1)"; };
            
            fab.onclick = (e) => { e.preventDefault(); openTruecallerModal(); };
            document.body.appendChild(fab);
        }
    }, 1000);

    // মেইন স্ক্রিন চেক লজিক
    setInterval(() => {
        const fab = document.getElementById('nexus-truecaller-fab');
        if (fab) {
            const isMainScreen = Array.from(document.querySelectorAll('div, span, h2, h3, p')).some(el => 
                el.innerText && (el.innerText.trim() === 'AI Chat' || el.innerText.trim() === 'Global Chat') && el.offsetParent !== null
            );
            if (isMainScreen) fab.style.display = 'flex';
            else fab.style.display = 'none';
        }
    }, 500);

    function openTruecallerModal() {
        let modal = document.getElementById('truecaller-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'truecaller-modal';
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 400px; background: #18181b; border: 1px solid #3b82f6; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                <h2 style="color:#3b82f6; font-weight:bold; font-size:18px; margin:0;">📞 Caller ID Search</h2>
                <button id="close-tc-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
            </div>
            
            <input type="number" id="tc-number-input" placeholder="Enter 10 digit number..." style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px 15px; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box; margin-bottom:12px; font-family:monospace;" />
            <button id="tc-search-btn" style="background:#3b82f6; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px;">Search Number</button>
            
            <div id="tc-result" style="margin-top:15px; background:black; padding:15px; border-radius:10px; border:1px solid #3f3f46; display:none; flex-direction:column; gap:8px;">
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('close-tc-btn').onclick = () => modal.remove();

        document.getElementById('tc-search-btn').onclick = async () => {
            const numInput = document.getElementById('tc-number-input').value.trim();
            const resDiv = document.getElementById('tc-result');
            
            // নম্বর অবশ্যই ১০ ডিজিটের হতে হবে
            if (!numInput || numInput.length !== 10) {
                alert("Please enter a valid 10-digit mobile number!");
                return;
            }

            resDiv.style.display = 'flex';
            resDiv.innerHTML = `<span style="color:#38bdf8; font-size:13px; text-align:center; animation: pulse 1.5s infinite;">⏳ Searching Viewcaller Database...</span>`;

            try {
                // আপনার দেওয়া Viewcaller API ব্যবহার করা হচ্ছে
                const response = await fetch(`https://viewcaller.p.rapidapi.com/api/v1/search?code=91&number=${numInput}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-host': 'viewcaller.p.rapidapi.com',
                        'x-rapidapi-key': 'bae47b7f91msh5916b9a175c7aeap1387ddjsncec825a93b2a'
                    }
                });
                
                const data = await response.json();
                if(window.addNexusHistory) window.addNexusHistory(`Searched: +91${numInput}`, "📞 Caller ID");
                
                // যদি এই API-তেও লিমিট এরর আসে
                if (data.message && data.message.toLowerCase().includes("exceeded")) {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ API Quota Exceeded. Please use a new API Key.</span>`;
                    return;
                }

                // Viewcaller-এর ডেটা বের করার ডাইনামিক লজিক
                let name = "Unknown Name";
                
                // API-এর ডেটা যেখানেই থাকুক, খুঁজে বের করার চেষ্টা করবে
                if (data.name) name = data.name;
                else if (data.data && data.data.name) name = data.data.name;
                else if (data.result && data.result.name) name = data.result.name;

                if (name !== "Unknown Name" || Object.keys(data).length > 0) {
                    resDiv.innerHTML = `
                        <h3 style="color:#4ade80; margin:0 0 10px 0; font-size:15px; text-align:center; border-bottom: 1px dashed #3f3f46; padding-bottom: 5px;">✅ Verified Identity</h3>
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <span style="color:#a1a1aa; font-size:13px;">Name:</span>
                            <span style="color:white; font-size:13px; font-weight:bold;">${name}</span>
                        </div>
                        <div style="margin-top:10px; font-size:11px; color:#a1a1aa; word-break:break-all; background:#27272a; padding:8px; border-radius:5px; max-height:80px; overflow-y:auto;">
                            <span style="color:#38bdf8;">Raw Data:</span> ${JSON.stringify(data)}
                        </div>
                    `;
                } else {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ No details found for this number.</span>`;
                }
            } catch (err) {
                resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">⚠️ Network Issue or API Blocked!</span>`;
            }
        };
    }
})();
            
