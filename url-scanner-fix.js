// URL Scanner পেজ ফিক্স এবং Hide/Show লজিক
const guardianUrlScanner = setInterval(() => {
    // চেক করছে URL Scanner পেজ খোলা আছে কি না
    const isUrlScannerPage = Array.from(document.querySelectorAll('h1, h2, h3, div')).some(el =>
        el.innerText && el.innerText.includes('URL Scanner')
    );

    if (isUrlScannerPage) {
        // ১. Fun API বাটন এই পেজে থাকলে জোর করে লুকিয়ে ফেলা (যাতে কোনোভাবেই না আসে)
        const funBtn = document.getElementById('fun-float-btn');
        if (funBtn) funBtn.style.display = 'none';

        // ২. Security Tools অংশটিকে খুঁজে বের করা এবং Hide/Show যুক্ত করা
        const secHeaders = Array.from(document.querySelectorAll('div, h2, h3, p, span')).filter(el =>
            el.innerText && el.innerText.includes('Security Tools')
        );

        // সবচেয়ে ভেতরের (inner) লেখাটি টার্গেট করা
        for (let el of secHeaders) {
            // নিশ্চিত করা যে এটি আসল হেডার এবং আগে থেকে Hide/Show বসানো হয়নি
            if (el.children.length === 0 && !el.dataset.toggleHooked) {
                el.dataset.toggleHooked = "true"; // ট্যাগ করে দেওয়া হলো

                const mainCard = el.parentElement;

                // হেডারের স্টাইল পরিবর্তন করে একটি সুন্দর 'Show/Hide' বাটন যুক্ত করা
                el.style.display = "flex";
                el.style.justifyContent = "space-between";
                el.style.alignItems = "center";
                el.style.width = "100%";
                el.style.cursor = "pointer"; 

                const toggleBtn = document.createElement('span');
                toggleBtn.innerHTML = "🔽 Show";
                toggleBtn.style.cssText = "background: #27272a; border: 1px solid #3f3f46; padding: 4px 10px; border-radius: 8px; font-size: 12px; color: #a1a1aa; font-weight: bold;";
                el.appendChild(toggleBtn);

                // হেডারের নিচের সব কিছু (ইনপুট, বাটনগুলো) একটি নতুন বক্সে ঢুকিয়ে দেওয়া
                const contentWrapper = document.createElement('div');
                contentWrapper.style.display = "none"; // শুরুতে লুকানো (Hide) থাকবে
                contentWrapper.style.width = "100%";
                contentWrapper.style.marginTop = "15px";

                // হেডারের পর যা যা আছে সব contentWrapper-এ নিয়ে যাওয়া
                while (el.nextSibling) {
                    contentWrapper.appendChild(el.nextSibling);
                }
                mainCard.appendChild(contentWrapper);

                // হেডারে বা বাটনে ক্লিক করলে Hide/Show হবে
                el.onclick = () => {
                    if (contentWrapper.style.display === "none") {
                        contentWrapper.style.display = "block";
                        toggleBtn.innerHTML = "🔼 Hide";
                        toggleBtn.style.color = "#fbbf24";
                        toggleBtn.style.borderColor = "#fbbf24";
                    } else {
                        contentWrapper.style.display = "none";
                        toggleBtn.innerHTML = "🔽 Show";
                        toggleBtn.style.color = "#a1a1aa";
                        toggleBtn.style.borderColor = "#3f3f46";
                    }
                };
            }
        }
    }
}, 500);
