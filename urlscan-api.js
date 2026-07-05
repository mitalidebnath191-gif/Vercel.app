// URL Scanner-এর জন্য urlscan.io API (In-App Result Method)
const API_KEY = "019f2fb8-cb80-763b-a7bd-978c8d456002";

const hookUrlScanApi = setInterval(() => {
    // Nexus AI OS পেজে 'URL Scanner' লেখা খুঁজছে
    const isUrlScannerPage = Array.from(document.querySelectorAll('h1, h2, h3, div, span, p')).some(el =>
        el.innerText && el.innerText.includes('URL Scanner')
    );

    if (isUrlScannerPage) {
        // ইনপুট বক্স এবং স্ক্যান বাটন সিলেক্ট করা হচ্ছে
        const urlInput = document.querySelector('input[placeholder*="google.com"]');
        const originalScanBtn = Array.from(document.querySelectorAll('button')).find(b => 
            b.innerText.trim() === 'Scan' || b.innerText.includes('Scan')
        );

        // বাটন ও ইনপুট পাওয়া গেলে এবং আগে হুক না হয়ে থাকলে
        if (urlInput && originalScanBtn && !originalScanBtn.dataset.urlscanHooked) {
            
            // অরিজিনাল বাটনটিকে ক্লোন করে রিপ্লেস করছি যাতে আগের ফাংশন ডিলিট হয়
            const scanBtn = originalScanBtn.cloneNode(true);
            scanBtn.dataset.urlscanHooked = "true";
            originalScanBtn.parentNode.replaceChild(scanBtn, originalScanBtn);

            // রেজাল্ট দেখানোর জন্য মেইন আউটপুট কন্টেইনার
            const outputDiv = document.createElement('div');
            outputDiv.id = "urlscan-api-output";
            outputDiv.style.cssText = "margin-top: 20px; width: 100%; display: flex; flex-direction: column; align-items: center; z-index: 50; padding: 10px;";
            
            // বাটনটির ঠিক নিচে আউটপুট বক্স যুক্ত করা হচ্ছে
            scanBtn.parentElement.parentElement.appendChild(outputDiv);

            // বাটনে ক্লিক ইভেন্ট
            scanBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const urlToScan = urlInput.value.trim();
                if(!urlToScan) {
                    alert("Please enter a website URL first! (e.g. google.com)");
                    return;
                }

                // লোডিং মেসেজ
                outputDiv.innerHTML = `<div style="color:#38bdf8; padding:15px; font-weight:bold; font-size:14px; text-align:center;">🔍 Sending URL to urlscan.io... Please wait...</div>`;

                const targetUrl = urlToScan.startsWith('http') ? urlToScan : 'http://' + urlToScan;

                // Tampermonkey-এর GM_xmlhttpRequest ব্যবহার করে CORS বাইপাস
                if (typeof GM_xmlhttpRequest !== 'undefined') {
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
                                    const resultUrl = scanData.result; // এটিই urlscan.io এর রেজাল্ট পেজ লিংক
                                    
                                    outputDiv.innerHTML = `
                                        <div style="color:#facc15; padding:10px; font-size:14px; text-align:center; margin-bottom: 10px;">
                                            ⏳ Scan submitted successfully!<br>
                                            <span style="font-size:12px; color:#a1a1aa;">Loading full interactive web report directly inside the app...</span>
                                        </div>
                                        <!-- আইফ্রেম মেথড: অ্যাপের ভেতরেই অন্য ব্রাউজার ছাড়া ওয়েবসাইট ওপেন করবে -->
                                        <iframe src="${resultUrl}" style="width: 100%; height: 500px; border: 2px solid #3f3f46; border-radius: 12px; background: #fff;"></iframe>
                                    `;
                                } else {
                                    outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px; text-align:center;">❌ Error: ${scanData.message || 'Scan failed'}</div>`;
                                }
                            } catch(e) {
                                outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px; text-align:center;">❌ JSON Parsing Error!</div>`;
                            }
                        },
                        onerror: function(err) {
                            outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px; text-align:center;">⚠️ Network Error! Connection blocked or invalid API key.</div>`;
                        }
                    });
                } else {
                    outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px; text-align:center;">⚠️ Extension/Environment Error! GM_xmlhttpRequest not found.</div>`;
                }
            });
        }
    }
}, 1000);
                            
