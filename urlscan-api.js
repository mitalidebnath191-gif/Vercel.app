// ==UserScript==
// @name         URL Scanner API Fixer
// @namespace    http://tampermonkey.net
// @version      1.1
// @description  Fixes CORS issue using GM_xmlhttpRequest
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==UserScript==

// URL Scanner-এর জন্য urlscan.io API
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
            
            // মাস্টার ট্রিক: বাটনটিকে ক্লোন করে রিপ্লেস করে দিচ্ছি
            const scanBtn = originalScanBtn.cloneNode(true);
            scanBtn.dataset.urlscanHooked = "true";
            originalScanBtn.parentNode.replaceChild(scanBtn, originalScanBtn);

            const outputDiv = document.createElement('div');
            outputDiv.id = "urlscan-api-output";
            outputDiv.style.cssText = "margin-top: 20px; width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; z-index: 50;";
            
            scanBtn.parentElement.parentElement.appendChild(outputDiv);

            // নতুন বাটনে আমাদের ইভেন্ট
            scanBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const urlToScan = urlInput.value.trim();
                if(!urlToScan) {
                    alert("Please enter a website URL first! (e.g. google.com)");
                    return;
                }

                outputDiv.innerHTML = `<div style="color:#38bdf8; padding:15px; font-weight:bold; font-size:14px; animation: pulse 2s infinite;">🔍 Sending URL to urlscan.io... Please wait...</div>`;

                const targetUrl = urlToScan.startsWith('http') ? urlToScan : 'http://' + urlToScan;

                // ফিক্স: fetch-এর বদলে GM_xmlhttpRequest ব্যবহার করা হয়েছে (কোনো CORS Proxy লাগবে না)
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://urlscan.io",
                    headers: {
                        "Content-Type": "application/json",
                        "API-Key": API_KEY
                    },
                    data: JSON.stringify({
                        url: targetUrl,
                        visibility: "public"
                    }),
                    onload: function(response) {
                        try {
                            const scanData = JSON.parse(response.responseText);

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
                        } catch(e) {
                            outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px;">❌ JSON Parsing Error!</div>`;
                        }
                    },
                    onerror: function(err) {
                        outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px;">⚠️ Network Error! Connection blocked or invalid API key.</div>`;
                        console.error(err);
                    }
                });
            });
        }
    }
}, 1000);
                    
