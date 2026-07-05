// Code Lab page-e IMEI Checker jukto korar logic
const hookImeiChecker = setInterval(() => {
    // Check korche page ti "Code Lab" kina
    const isCodeLab = Array.from(document.querySelectorAll('h1, h2, h3, div, span')).some(el =>
        el.innerText && el.innerText.includes('Code Lab')
    );

    if (isCodeLab) {
        // "Run HTML" button ti khunje ber kora
        const btns = Array.from(document.querySelectorAll('button'));
        const runBtn = btns.find(b => b.innerText.trim() === 'Run HTML' || b.innerText.includes('Run HTML'));

        // Jodi Run HTML button paoya jay abong IMEI button age theke na thake
        if (runBtn && !document.getElementById('imei-check-btn')) {
            
            // Notun IMEI button toiri kora
            const imeiBtn = document.createElement('button');
            imeiBtn.id = 'imei-check-btn';
            imeiBtn.innerHTML = '🔍 Check Device IMEI';
            imeiBtn.style.cssText = "display: block; margin-top: 15px; background: #8b5cf6; color: white; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: bold; width: 100%; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); transition: 0.3s;";
            
            // Run HTML button er thik niche bosiye dewa
            runBtn.parentElement.appendChild(imeiBtn);

            // Buttne click korle Modal/Pop-up open hobe
            imeiBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openImeiModal();
            });
        }
    } else {
        // Onno page e gele popup automatic close hoye jabe
        let modal = document.getElementById('imei-modal');
        if (modal) modal.style.display = 'none';
    }
}, 1000);

// IMEI Pop-up UI Open korar function
function openImeiModal() {
    let modal = document.getElementById('imei-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imei-modal';
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 400px; background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 20px; z-index: 100005; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                <h2 style="color:#a78bfa; font-weight:bold; font-size:18px; margin:0;">📱 IMEI Info Tracker</h2>
                <button id="close-imei-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
            </div>
            
            <input type="number" id="imei-input" placeholder="Enter 15-digit IMEI number..." style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px 15px; border-radius:8px; font-size:14px; margin-bottom:12px; outline:none; font-family:monospace;" />
            
            <button id="search-imei-btn" style="width:100%; background:#8b5cf6; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px;">Search Device</button>
            
            <div id="imei-result" style="margin-top:15px; background:black; padding:15px; border-radius:10px; border:1px solid #3f3f46; display:none; flex-direction:column; gap:8px; max-height:250px; overflow-y:auto;">
                </div>
        `;
        document.body.appendChild(modal);

        // Close Button Logic
        document.getElementById('close-imei-btn').onclick = () => {
            modal.style.display = 'none';
        };

        // Search Button Logic
        document.getElementById('search-imei-btn').onclick = async () => {
            const imeiVal = document.getElementById('imei-input').value.trim();
            const resDiv = document.getElementById('imei-result');
            
            if(!imeiVal || imeiVal.length < 14) {
                alert("Please enter a valid IMEI number!");
                return;
            }

            // Loading Animation
            resDiv.style.display = 'flex';
            resDiv.innerHTML = `<span style="color:#38bdf8; font-size:14px; text-align:center; animation: pulse 1.5s infinite;">⏳ Fetching device info...</span>`;

            try {
                // CORS Proxy diye API ke block howa theke bachano hoyeche
                const apiUrl = \`https://corsproxy.io/?https://alpha.imeicheck.com/api/modelBrandName?imei=\${imeiVal}&format=json\`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                // Jodi data paoya jay
                if (data && Object.keys(data).length > 0 && !data.error) {
                    let html = '<h3 style="color:#4ade80; margin:0 0 10px 0; font-size:15px; text-align:center;">✅ Device Details</h3>';
                    
                    // JSON er modhye joto data ache sob automatic print korbe
                    for (const [key, value] of Object.entries(data)) {
                        if(value && typeof value !== 'object') {
                            // Key name guloke sundor format kora (e.g. modelName -> MODEL NAME)
                            const formattedKey = key.replace(/([A-Z])/g, ' $1').toUpperCase();
                            
                            html += \`<div style="display:flex; justify-content:space-between; border-bottom:1px dashed #3f3f46; padding-bottom:6px; margin-bottom:6px;">
                                <span style="color:#a1a1aa; font-size:12px;">\${formattedKey}:</span>
                                <span style="color:white; font-size:12px; font-weight:bold; text-align:right; max-width:60%; word-break:break-word;">\${value}</span>
                            </div>\`;
                        }
                    }
                    resDiv.innerHTML = html;
                } else {
                    resDiv.innerHTML = \`<span style="color:#ef4444; font-size:13px; text-align:center;">❌ Device not found. Check IMEI.</span>\`;
                }

            } catch (error) {
                resDiv.innerHTML = \`<span style="color:#ef4444; font-size:13px; text-align:center;">⚠️ API Error! Please try again later.</span>\`;
                console.error(error);
            }
        };
    } else {
        modal.style.display = 'flex';
    }
}
  
