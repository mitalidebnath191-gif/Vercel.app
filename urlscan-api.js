// URL Scanner-এর জন্য urlscan.io API ইন্টিগ্রেশন
const API_KEY = "019f2fb8-cb80-763b-a7bd-978c8d456002";

const hookUrlScanApi = setInterval(() => {
    // চেক করছে "URL Scanner" পেজে আছেন কি না
    const isUrlScannerPage = Array.from(document.querySelectorAll('h1, h2, h3, div, span')).some(el =>
        el.innerText && el.innerText.includes('URL Scanner')
    );

    if (isUrlScannerPage) {
        // ইনপুট বক্স (যেখানে www.google.com লেখা থাকে) এবং Scan বাটনটি খুঁজছে
        const inputs = document.querySelectorAll('input[type="text"]');
        let urlInput = null;
        let scanBtn = null;

        // ইনপুট বক্সটি শনাক্ত করা
        inputs.forEach(inp => {
            if(inp.placeholder.includes('google.com') || inp.placeholder.toLowerCase().includes('url')) {
                urlInput = inp;
            }
        });
        if(!urlInput && inputs.length > 0) urlInput = inputs[0]; 

        // Scan বাটনটি শনাক্ত করা
        const btns = document.querySelectorAll('button');
        scanBtn = Array.from(btns).find(b => b.innerText.trim() === 'Scan' || b.innerText.includes('Scan'));

        if (urlInput && scanBtn && !scanBtn.dataset.urlscanHooked) {
            scanBtn.dataset.urlscanHooked = "true"; // একবার রান করার জন্য ট্যাগ

            // আউটপুট দেখানোর জন্য একটি কাস্টম বক্স তৈরি করছি
            const outputDiv = document.createElement('div');
            outputDiv.id = "urlscan-api-output";
            outputDiv.style.cssText = "margin-top: 20px; width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; z-index: 50;";
            
            // ইনপুট এবং বাটনের ঠিক নিচে আউটপুট বসিয়ে দিচ্ছি
            scanBtn.parentElement.parentElement.appendChild(outputDiv);

            // Scan বাটনে ক্লিকের ইভেন্ট (Capture Phase)
            scanBtn.addEventListener('click', async (e) => {
                const urlToScan = urlInput.value.trim();
                
                // যদি বক্সে কিছু না লেখা থাকে
                if(!urlToScan) {
                    alert("Please enter a website URL first! (e.g. google.com)");
                    return;
                }

                e.preventDefault();
                e.stopPropagation(); // আপনার অরিজিনাল অ্যাপের কাজ থামিয়ে আমাদের API কল করবে

                // স্ক্যান শুরু হওয়ার মেসেজ
                outputDiv.innerHTML = `<div style="color:#38bdf8; padding:15px; font-weight:bold; font-size:14px; animation: pulse 2s infinite;">🔍 Sending URL to urlscan.io... Please wait...</div>`;

                try {
                    // API Call
                    const scanRes = await fetch("https://urlscan.io/api/v1/scan/", {
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
                        
                        // ওয়েবসাইটটি স্ক্যান হতে ১০-১৫ সেকেন্ড সময় লাগে
                        outputDiv.innerHTML = `
                            <div style="color:#facc15; padding:10px; font-size:14px;">
                                ⏳ Scan submitted successfully!<br>
                                <span style="font-size:12px; color:#a1a1aa;">Capturing live screenshot and analyzing network data. This takes about 10-15 seconds...</span>
                            </div>
                        `;

                        // 12 সেকেন্ড পর স্ক্রিনশট এবং রিপোর্ট দেখাবে
                        setTimeout(() => {
                            const screenshotUrl = `https://urlscan.io/screenshots/${uuid}.png`;
                            
                            outputDiv.innerHTML = `
                                <h3 style="color:#4ade80; margin-bottom:10px; font-size:16px;">✅ Scan Complete!</h3>
                                <div style="background:black; padding:5px; border-radius:12px; border:2px solid #3f3f46; max-width:100%;">
                                    <img src="${screenshotUrl}" style="max-width:100%; border-radius:8px; object-fit:contain;" alt="Live Screenshot" onerror="this.src=''; this.alt='Screenshot still generating, please click the View Report button.'">
                                </div>
                                <a href="${resultUrl}" target="_blank" style="display:inline-block; margin-top:15px; background:#2563eb; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:bold; box-shadow: 0 4px 10px rgba(37,99,235,0.4);">🔗 View Full Security Report</a>
                            `;
                        }, 12000); // ১২ সেকেন্ড (12000ms) অপেক্ষা করবে

                    } else {
                        outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px;">❌ Error: ${scanData.message || 'Scan failed'}</div>`;
                    }

                } catch(err) {
                    outputDiv.innerHTML = `<div style="color:#ef4444; padding:10px; font-size:14px;">⚠️ API Error! Please try again later.</div>`;
                    console.error(err);
                }
            }, true);
        }
    }
}, 1000);
