// NEXUS Truecaller OS Engine (Smart Parsing & Error Handling)
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
                <h2 style="color:#3b82f6; font-weight:bold; font-size:18px; margin:0;">📞 Truecaller Search</h2>
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
            
            if (!numInput || numInput.length < 10) {
                alert("Please enter a valid 10-digit mobile number!");
                return;
            }

            const formattedNumber = numInput.length === 10 ? "91" + numInput : numInput;
            resDiv.style.display = 'flex';
            resDiv.innerHTML = `<span style="color:#38bdf8; font-size:13px; text-align:center; animation: pulse 1.5s infinite;">⏳ Searching Database...</span>`;

            try {
                const response = await fetch(`https://truecaller-data2.p.rapidapi.com/search/${formattedNumber}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-host': 'truecaller-data2.p.rapidapi.com',
                        'x-rapidapi-key': 'bae47b7f91msh5916b9a175c7aeap1387ddjsncec825a93b2a'
                    }
                });
                
                const data = await response.json();
                
                // ১. যদি API থেকে Error মেসেজ আসে (যেমন: Quota Exceeded)
                if (data.message) {
                    resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">❌ API Error: ${data.message}</span>`;
                    return;
                }

                // ২. বিভিন্ন ধরনের Data Structure ধরার লজিক
                let person = null;
                if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                    person = data.data[0];
                } else if (Array.isArray(data) && data.length > 0) {
                    person = data[0];
                } else if (data && data.name) {
                    person = data;
                }

                if (person && person.name) {
                    const name = person.name || "Unknown Name";
                    const carrier = (person.phones && person.phones[0] && person.phones[0].carrier) ? person.phones[0].carrier : "N/A";
                    const email = (person.internetAddresses && person.internetAddresses[0]) ? person.internetAddresses[0].id : "No Email Found";
                    const city = (person.addresses && person.addresses[0]) ? person.addresses[0].city : "Unknown Location";

                    resDiv.innerHTML = `
                        <h3 style="color:#4ade80; margin:0 0 10px 0; font-size:15px; text-align:center; border-bottom: 1px dashed #3f3f46; padding-bottom: 5px;">✅ Verified Identity</h3>
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <span style="color:#a1a1aa; font-size:13px;">Name:</span>
                            <span style="color:white; font-size:13px; font-weight:bold;">${name}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <span style="color:#a1a1aa; font-size:13px;">Carrier:</span>
                            <span style="color:white; font-size:13px; font-weight:bold;">${carrier}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <span style="color:#a1a1aa; font-size:13px;">Location:</span>
                            <span style="color:white; font-size:13px; font-weight:bold;">${city}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:#a1a1aa; font-size:13px;">Email:</span>
                            <span style="color:#38bdf8; font-size:12px; max-width:60%; word-break:break-all; text-align:right;">${email}</span>
                        </div>
                    `;
                } else {
                    resDiv.innerHTML = `
                        <span style="color:#ef4444; font-size:13px; text-align:center; margin-bottom:10px;">❌ No details found.</span>
                        <div style="font-size:10px; color:#a1a1aa; word-break:break-all; background:#27272a; padding:5px; border-radius:5px;">Raw Response: ${JSON.stringify(data).substring(0, 100)}...</div>
                    `;
                }
            } catch (err) {
                resDiv.innerHTML = `<span style="color:#ef4444; font-size:13px; text-align:center;">⚠️ Network Issue or API Blocked!</span>`;
            }
        };
    }
})();
                    
