// NEXUS urlscan.io Cloud Deep Scanner Engine (Fixed CORS Issue)
(function() {
    setInterval(() => {
        const speedBtn = document.getElementById('speed-test-btn');
        
        if (speedBtn && !document.getElementById('urlscan-cloud-btn')) {
            const cloudBtn = document.createElement('button');
            cloudBtn.id = 'urlscan-cloud-btn';
            
            cloudBtn.style.cssText = "background:#ff4500; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3); margin-top: 10px;";
            cloudBtn.innerHTML = "🔍 urlscan.io Deep Scan";
            
            cloudBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                openUrlScanModal(profileModal);
            };
            
            speedBtn.parentNode.insertBefore(cloudBtn, speedBtn.nextSibling);
        }
    }, 1000);

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
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-urlscan-btn');
        const scanBtn = document.getElementById('submit-urlscan-btn');
        const urlInput = document.getElementById('urlscan-input');
        const resultBox = document.getElementById('urlscan-result-box');

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

            scanBtn.innerHTML = "⏳ Scanning Server...";
            scanBtn.disabled = true;
            resultBox.style.display = 'flex';
            resultBox.innerHTML = `<span style="color:#38bdf8; text-align:center; font-weight:bold;">Bypassing security & connecting...</span>`;

            try {
                // CORS Proxy ব্যবহার করা হলো যাতে ব্রাউজার ব্লক না করে
                const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://urlscan.io/api/v1/scan/');
                
                const response = await fetch(proxyUrl, {
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
                        <p style="margin:5px 0 10px 0; color:#a1a1aa; text-align:center;">urlscan.io is deep scanning the servers globally.</p>
                        <a href="${reportUrl}" target="_blank" style="background:#22c55e; color:white; padding:10px; border-radius:8px; text-decoration:none; text-align:center; font-weight:bold; display:block;">📊 View Live Scan Report</a>
                    `;
                    
                    if(window.addNexusHistory) window.addNexusHistory("Launched Cloud URL Scan", "🛡️ urlscan.io");
                } else {
                    resultBox.innerHTML = `
                        <span style="color:#ef4444; font-weight:bold; text-align:center;">❌ API Request Failed</span>
                        <p style="margin:5px 0 0 0; color:#fca5a5; text-align:center;">${data.message || data.description || "Unknown Error"}</p>
                    `;
                }
            } catch (error) {
                // যদি প্রক্সিও কাজ না করে তখন আসল এরর মেসেজ দেখাবে
                resultBox.innerHTML = `
                    <span style="color:#f59e0b; font-weight:bold; text-align:center;">⚠️ Proxy/Network Error</span>
                    <p style="margin:5px 0 0 0; color:#fcd34d; text-align:center;">${error.message}</p>
                `;
            }

            scanBtn.innerHTML = "Launch Cloud Scan";
            scanBtn.disabled = false;
        };
    }
})();
            
