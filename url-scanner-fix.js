// URL Scanner পেজ ফিক্স এবং Hide/Show লজিক (Updated for Emojis)
const guardianUrlScanner = setInterval(() => {
    const isUrlScannerPage = Array.from(document.querySelectorAll('h1, h2, h3, div')).some(el =>
        el.innerText && el.innerText.includes('URL Scanner')
    );

    if (isUrlScannerPage) {
        const funBtn = document.getElementById('fun-float-btn');
        if (funBtn) funBtn.style.display = 'none';

        // strictly চেক করার বদলে includes ব্যবহার করা হলো (যাতে 🛡️ ইমোজি থাকলেও কাজ করে)
        const secHeaders = Array.from(document.querySelectorAll('div, h2, h3, p, span')).filter(el =>
            el.innerText && (el.innerText.includes('Security Tools') || el.innerText.includes('Security Toolbox'))
        );

        for (let el of secHeaders) {
            if (el.children.length === 0 && !el.dataset.toggleHooked) {
                el.dataset.toggleHooked = "true"; 

                const mainCard = el.parentElement;

                el.style.display = "flex";
                el.style.justifyContent = "space-between";
                el.style.alignItems = "center";
                el.style.width = "100%";
                el.style.cursor = "pointer"; 

                const toggleBtn = document.createElement('span');
                toggleBtn.innerHTML = "🔽 Show";
                toggleBtn.style.cssText = "background: #27272a; border: 1px solid #3f3f46; padding: 4px 10px; border-radius: 8px; font-size: 12px; color: #a1a1aa; font-weight: bold;";
                el.appendChild(toggleBtn);

                const contentWrapper = document.createElement('div');
                contentWrapper.style.display = "none"; 
                contentWrapper.style.width = "100%";
                contentWrapper.style.marginTop = "15px";

                while (el.nextSibling) {
                    contentWrapper.appendChild(el.nextSibling);
                }
                mainCard.appendChild(contentWrapper);

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
