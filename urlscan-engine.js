// NEXUS urlscan.io Cloud Deep Scanner Engine (Standalone File)
(function() {
    setInterval(() => {
        // লোকাল URL Safety Checker বাটনটি খুঁজছে
        const safetyBtn = document.getElementById('url-safety-btn');
        
        // যদি লোকাল বাটন থাকে কিন্তু ক্লাউড স্ক্যান বাটন না থাকে, তবে এটি তৈরি করবে
        if (safetyBtn && !document.getElementById('urlscan-cloud-btn')) {
            const cloudBtn = document.createElement('button');
            cloudBtn.id = 'urlscan-cloud-btn';
            
            // বাটনের ডিজাইন (ইউনিক লুক দেওয়ার জন্য সুন্দর লাল-কমলা থিম)
            cloudBtn.style.cssText = "background:#ff4500; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3); margin-top: 10px;";
            cloudBtn.innerHTML = "🔍 urlscan.io Deep Scan";
            
            // বাটনে ক্লিক করলে মূল প্রোফাইল পপ-আপ লুকিয়ে নতুন উইন্ডো খুলবে
            cloudBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                openUrlScanModal(profileModal);
            };
            
            safetyBtn.parentNode.appendChild(cloudBtn);
        }
    }, 1000);

    // ক্লাউড স্ক্যানার পপ-আপ উইন্ডো
    function openUrlScanModal(profileModal) {
        let modal = document.getElementById('urlscan-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'urlscan-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 390px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #ff4500; display: flex; flex-direction: column; gap: 15px; box-sizing: border-box;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#ff4500; font-weight:bold; font-size:17px; margin:0;">🔍 Cloud Deep Scan</h2>
                    <button id="close-urlscan-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="width:100%;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Paste URL for urlscan.io Cloud Scan:</label>
                    <input type="url" id="urlscan-input" placeholder="e.g. google.com" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box;">
                </div>
                
                <button id="submit-urlscan-btn" style="background:#ff4500; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px;">Launch Cloud Scan</button>

                <div id="urlscan-result-box" style="display:none; flex-direction:column; gap:8px; background: #27272a; padding: 15px; border-radius: 8px; border: 1px dashed #52525b; font-size:13px; color:white; word-break:break-all;"></div>
                
                <p style="color:#71717a; font-size:10px; margin:0; text-align:center;">Powered by urlscan.io API. It will capture a live screenshot and analyze server behavior globally.</p>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-urlscan-btn');
        const scanBtn = document.getElementById('submit-urlscan-btn');
        const urlInput = document.getElementById('urlscan-input');
        const resultBox = document.getElementById('urlscan-result-box');

        // আপনার দেওয়া urlscan.io API Key
        const API_KEY = "019f2fb8-cb80-763b-a7bd-978c8d456002";

        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        scanBtn.onclick = async () => {
            let urlText = urlInput.value.trim();
            if (!urlText) {
                alert("Please enter a URL to scan!");
                return;
            }

            if (!/^https?:\/\//i.test(urlText)) {
                urlText = 'http://' + urlText; 
            }

            scanBtn.innerHTML = "⏳ Connecting to urlscan.io...";
            scanBtn.disabled = true;
            resultBox.style.display = 'flex';
            resultBox.innerHTML = `<span style="color:#38bdf8; text-align:center; font-weight:bold;">Initiating Deep Scan... Please wait.</span>`;

            try {
                const response = await fetch('https://urlscan.io/api/v1/scan/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'API-Key': API_KEY
                    },
                    body: JSON.stringify({
                        url: urlText,
                        visibility: 'public'
                    })
                });

                const data = await response.json();

                if (response.ok && data.message === "Submission successful") {
                    const reportUrl = `https://urlscan.io/result/${data.uuid}/`;
                    
                    resultBox.innerHTML = `
                        <div style="text-align:center;">
                            <span style="color:#22c55e; font-weight:bold; font-size:16px;">✅ Scan Successfully Launched!</span>
                        </div>
                        <p style="margin:5px 0 10px 0; color:#a1a1aa; text-align:center;">urlscan.io is deeply analyzing the website's components.</p>
                        <a href="${reportUrl}" target="_blank" style="background:#22c55e; color:white; padding:10px; border-radius:8px; text-decoration:none; text-align:center; font-weight:bold; display:block;">📊 View Live Scan Report</a>
                        <p style="color:#ef4444; font-size:10px; margin:10px 0 0 0; text-align:center;">(Note: It takes about 10-15 seconds for urlscan.io to prepare the final dashboard on their site)</p>
                    `;
                    
                    if(window.addNexusHistory) window.addNexusHistory("Launched Cloud URL Scan", "🛡️ urlscan.io");
                } else {
                    resultBox.innerHTML = `
                        <span style="color:#ef4444; font-weight:bold; text-align:center;">❌ API Error</span>
                        <p style="margin:5px 0 0 0; color:#fca5a5; text-align:center;">${data.message || "Failed to initiate scan."}</p>
                    `;
                }
            } catch (error) {
                resultBox.innerHTML = `
                    <span style="color:#f59e0b; font-weight:bold; text-align:center;">⚠️ Connection Error</span>
                    <p style="margin:5px 0 0 0; color:#fcd34d; text-align:center;">Failed to connect to cloud database.</p>
                `;
            }

            scanBtn.innerHTML = "Launch Cloud Scan";
            scanBtn.disabled = false;
        };
    }
})();
          
