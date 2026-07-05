// NEXUS YT Downloader (Auto-Paste & Download Engine)
(function() {
    // ১. বাটনের জায়গা ঠিক রাখা
    const hookYtBtn = setInterval(() => {
        const isWebBrowserPage = Array.from(document.querySelectorAll('div')).some(el => el.innerText && el.innerText.trim() === 'Web Browser');
        const btns = document.querySelectorAll('button');
        const searchBtn = Array.from(btns).find(b => b.innerText.trim() === 'Search' || b.innerText.includes('Search'));

        if (isWebBrowserPage && searchBtn && !document.getElementById('yt-big-btn-container')) {
            const container = document.createElement('div');
            container.id = 'yt-big-btn-container';
            container.style.cssText = "width: 100%; display: flex; justify-content: center; margin-top: 60px;"; 

            const ytBtn = document.createElement('button');
            ytBtn.id = 'nexus-yt-big-btn';
            ytBtn.innerHTML = '📺 YT Downloader';
            ytBtn.style.cssText = "background: transparent; color: #ef4444; border: 2px dashed #ef4444; padding: 25px 40px; border-radius: 16px; font-size: 22px; font-weight: bold; cursor: pointer; width: 80%; max-width: 350px;";
            
            container.appendChild(ytBtn);
            searchBtn.parentElement.insertAdjacentElement('afterend', container);
        }
    }, 1000);

    // ২. বাটন ক্লিক করলে পপ-আপ ওপেন ও অটো-লিংক পেস্ট
    window.addEventListener('click', async (e) => {
        if (e.target.closest('#nexus-yt-big-btn')) {
            openYtModal();
            // অটো-পেস্ট করার চেষ্টা
            try {
                const clipboardText = await navigator.clipboard.readText();
                if(clipboardText.includes('youtu')) {
                    document.getElementById('yt-link').value = clipboardText;
                }
            } catch(err) { console.log("Clipboard access denied"); }
        }
    }, true);

    // ৩. পপ-আপ ডিজাইন ও ডাউনলোডের সহজ বাটন
    function openYtModal() {
        let modal = document.getElementById('yt-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'yt-modal';
            modal.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:90%; max-width:400px; background:#18181b; border:1px solid #ef4444; border-radius:16px; padding:20px; z-index:999999; box-shadow:0 10px 40px rgba(0,0,0,0.9); display:flex; flex-direction:column;";
            
            modal.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h2 style="color:#ef4444; font-size:18px; margin:0;">📺 Download Video</h2>
                    <button id="close-yt" style="background:#3f3f46; color:white; border:none; padding:5px 12px; border-radius:8px; cursor:pointer;">X</button>
                </div>
                <input type="text" id="yt-link" placeholder="Paste YouTube link here..." style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:15px; border-radius:8px; outline:none; box-sizing:border-box; margin-bottom:15px; font-size:14px;">
                
                <button id="direct-download-btn" style="background:#ef4444; color:white; padding:15px; border-radius:8px; border:none; font-weight:bold; cursor:pointer; font-size:16px; width:100%;">
                    ⬇️ DOWNLOAD NOW
                </button>
            `;
            document.body.appendChild(modal);

            document.getElementById('close-yt').onclick = () => modal.style.display = 'none';

            document.getElementById('direct-download-btn').onclick = () => {
                const url = document.getElementById('yt-link').value.trim();
                if(!url.includes('youtu')) { alert("Please paste a valid YouTube link!"); return; }

                if(window.addNexusHistory) window.addNexusHistory("Downloaded YT Video: " + url, "📺 YT Downloader");

                // ডাউনলোডের জন্য সরাসরি লিংকে রিডাইরেক্ট করা
                window.open(`https://loader.to/api/v1/video?url=${encodeURIComponent(url)}&format=mp4`, '_blank');
                modal.style.display = 'none';
            };
        } else {
            modal.style.display = 'flex';
        }
    }
})();
                                                          
