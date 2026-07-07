// NEXUS Pincode Info Finder Engine (Free Postal API)
(function() {
    setInterval(() => {
        // urlscan.io বাটনটি খুঁজছে
        const urlscanBtn = document.getElementById('urlscan-cloud-btn');
        
        // যদি urlscan বাটন থাকে কিন্তু Pincode বাটন না থাকে
        if (urlscanBtn && !document.getElementById('pincode-finder-btn')) {
            const pinBtn = document.createElement('button');
            pinBtn.id = 'pincode-finder-btn';
            
            // বাটনের ডিজাইন (লোকেশন থিমের জন্য পার্পেল/বেগুনি কালার)
            pinBtn.style.cssText = "background:#8b5cf6; color:black; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); margin-top: 10px;";
            pinBtn.innerHTML = "📍 Pincode Info Finder";
            
            pinBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                openPincodeModal(profileModal);
            };
            
            // urlscan বাটনের ঠিক নিচে বসিয়ে দেবে
            urlscanBtn.parentNode.insertBefore(pinBtn, urlscanBtn.nextSibling);
        }
    }, 1000);

    function openPincodeModal(profileModal) {
        let modal = document.getElementById('pincode-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'pincode-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 390px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #8b5cf6; display: flex; flex-direction: column; gap: 15px; box-sizing: border-box;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#8b5cf6; font-weight:bold; font-size:17px; margin:0;">📍 Find Area by Pincode</h2>
                    <button id="close-pincode-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="width:100%;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Enter 6-digit Pincode (India Only):</label>
                    <input type="number" id="pincode-input" placeholder="e.g. 713101" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box;">
                </div>
                
                <button id="search-pincode-btn" style="background:#8b5cf6; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px;">Search Pincode</button>

                <!-- রেজাল্ট দেখানোর বক্স -->
                <div id="pincode-result-box" style="display:none; flex-direction:column; gap:8px; background: #27272a; padding: 15px; border-radius: 8px; border: 1px dashed #52525b; font-size:13px; color:white; max-height: 250px; overflow-y: auto;"></div>
                
                <p style="color:#71717a; font-size:10px; margin:0; text-align:center;">Data fetched securely from the Official Indian Postal API network.</p>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-pincode-btn');
        const searchBtn = document.getElementById('search-pincode-btn');
        const pinInput = document.getElementById('pincode-input');
        const resultBox = document.getElementById('pincode-result-box');

        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        searchBtn.onclick = async () => {
            let pinCode = pinInput.value.trim();
            if (pinCode.length !== 6) {
                alert("Please enter a valid 6-digit Pincode!");
                return;
            }

            searchBtn.innerHTML = "⏳ Searching...";
            searchBtn.disabled = true;
            resultBox.style.display = 'flex';
            resultBox.innerHTML = `<span style="color:#38bdf8; text-align:center;">Fetching location data...</span>`;

            try {
                // Free Post Office API কল করা
                const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
                const data = await response.json();

                if (data && data[0].Status === "Success") {
                    const postOffices = data[0].PostOffice;
                    let htmlList = `<div style="text-align:center; margin-bottom:10px;"><span style="color:#22c55e; font-weight:bold; font-size:15px;">✅ Location Found</span></div>`;
                    
                    // যতগুলো পোস্ট অফিস আছে সবগুলোর লিস্ট বানাবে
                    postOffices.forEach((po, index) => {
                        htmlList += `
                            <div style="background:#1f2937; padding:10px; border-radius:6px; border-left: 3px solid #8b5cf6; margin-bottom:8px;">
                                <b style="color:#cbd5e1; font-size:14px;">🏢 ${po.Name} Post Office</b><br>
                                <span style="color:#94a3b8; font-size:12px;">📍 Dist: ${po.District}, ${po.State}</span><br>
                                <span style="color:#94a3b8; font-size:11px;">📌 Division: ${po.Division}</span>
                            </div>
                        `;
                    });

                    resultBox.innerHTML = htmlList;
                    
                    if(window.addNexusHistory) window.addNexusHistory(`Searched Pincode: ${pinCode}`, "📍 Location");
                } else {
                    resultBox.innerHTML = `
                        <span style="color:#ef4444; font-weight:bold; text-align:center;">❌ Pincode Not Found</span>
                        <p style="margin:5px 0 0 0; color:#fca5a5; text-align:center;">Please check the pincode and try again.</p>
                    `;
                }
            } catch (error) {
                resultBox.innerHTML = `
                    <span style="color:#f59e0b; font-weight:bold; text-align:center;">⚠️ Network Error</span>
                    <p style="margin:5px 0 0 0; color:#fcd34d; text-align:center;">Could not connect to the API server.</p>
                `;
            }

            searchBtn.innerHTML = "Search Pincode";
            searchBtn.disabled = false;
        };
    }
})();
          
