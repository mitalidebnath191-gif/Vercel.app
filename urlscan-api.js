// URL Scanner-এর জন্য urlscan.io API (CORS Bypass & Clone Method)
const API_KEY = "019f2fb8-cb80-763b-a7bd-978c8d456002";

const hookUrlScanApi = setInterval(() => {
    const isUrlScannerPage = Array.from(document.querySelectorAll('h1, h2, h3, div, span')).some(el =>
        el.innerText && el.innerText.includes('URL Scanner')
    );

    if (isUrlScannerPage) {
        const inputs = document.querySelectorAll('input[type="text"]');
        let urlInput = null;
        let originalScanBtn = null;

        inputs.forEach(inp => {
            if(inp.placeholder.includes('google.com') || inp.placeholder.toLowerCase().includes('url')) {
                urlInput = inp;
            }
        });
        if(!urlInput && inputs.length > 0) urlInput = inputs[0]; 

        const btns = document.querySelectorAll('button');
        originalScanBtn = Array.from(btns).find(b => b.innerText.trim() === 'Scan' || b.innerText.includes('Scan'));

        // যদি বাটন পাওয়া যায় এবং আগে থেকে হুক না করা থাকে
        if (urlInput && originalScanBtn && !originalScanBtn.dataset.urlscanHooked) {
            
            // মাস্টার ট্রিক: বাটনটিকে ক্লোন করে রিপ্লেস করে দিচ্ছি, যাতে অরিজিনাল অ্যাপের ইভেন্ট ডিলিট হয়ে যায়!
            const scanBtn = originalScanBtn.cloneNode(true);
            scanBtn.dataset.urlscanHooked = "true";
            originalScanBtn.parentNode.replaceChild(scanBtn, originalScanBtn);

            const outputDiv = document.createElement('div');
            outputDiv.id = "urlscan-api-output";
            outputDiv.style.cssText = "margin-top: 20px; width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; z-index: 50;";
            
            scanBtn.parentElement.parentElement.appendChild(outputDiv);

            // নতুন বাটনে আমাদের ইভেন্ট
            scanBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const urlToScan = urlInput.value.trim();
                if(!urlToScan) {
                    alert("Please enter a website URL first! (e.g. google.com)");
                    return;
                }

                outputDiv.innerHTML = `<div style="color:#38bdf8; padding:15px; font-weight:bold; font-size:14px; animation: pulse 2s infinite;">🔍 Sending URL to urlscan.io... Please wait...</div>`;

                try {
                    // CORS Proxy ব্যবহার করে API রিকোয়েস্ট পাঠানো হচ্ছে
                    const scanRes = await fetch("https://corsproxy.io/?https://urlscan.io/api/v1/scan/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "API-Key": API_KEY
                        },
                        body: JSON.stringify({
                            url: urlToScan.startsWith('http') ? urlToScan : 'http://' + urlToScan,
                            visibility: "public"
                        })
                    });

                    const scanData = await scanRes.json();

                    if(scanData.message === "Submission successful" || scanData.uuid) {
                        const uuid = scanData.uuid;
                        const resultUrl = scanData.result;
                        
                        outputDiv.innerHTML = `
                            <div style="color:#facc15; padding:10px; font-size:14px;">
                                ⏳ Scan submitted successfully!<br>
                                <span style="font-size:12px; color:#a1a1aa;">Capturing live screenshot and analyzing network data. This takes about 10-15 seconds...</span>
                            </div>
                        `;

                        setTimeout(() => {
                            const screenshotUrl = `https://urlscan.io/screenshots/${uuid}.png`;
                            
                            outputDiv.innerHTML = `
                                <h3 style="color:#4ade80; margin-bottom:10px; font-size:16px;">✅ Scan Complete!</h3>
                                <div style="background:black; padding:5px; border-radius:12px; border:2px solid #3f3f46; max-width:100%;">
                                    <img src="${screenshotUrl}" style="max-width:100%; border-radius:8px; object-fit:contain;" alt="Live Screenshot Generating...">
                                </div>
                                <a href="${resultUrl}" target="_blank" style="display:inline-block; margin-top:15px; background:#2563eb; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:bold; box-shadow: 0 4px 10px rgba(37,99,235,0.4);">🔗 View Full Security Report</a>
                            `;
                        }, 12000); 

                    } else {
                        outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px;">❌ Error: ${scanData.message || 'Scan failed'}</div>`;
                    }

                } catch(err) {
                    outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px;">⚠️ Network/CORS Error! API blocked by browser security.</div>`;
                    console.error(err);
                }
            });
        }
    }
}, 1000);
            
