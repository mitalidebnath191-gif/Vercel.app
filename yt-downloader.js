// NEXUS YT Downloader (Floating Button Version - Only on Web Browser)
(function() {
    // ১. ফ্লোটিং বাটন তৈরি করা
    const createFloatingBtn = () => {
        if (!document.getElementById('nexus-yt-fab')) {
            const fab = document.createElement('button');
            fab.id = 'nexus-yt-fab';
            fab.innerHTML = '⬇️';
            fab.style.cssText = "position: fixed; bottom: 150px; right: 20px; background: #ef4444; color: white; width: 50px; height: 50px; border-radius: 50%; font-size: 20px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); z-index: 999998; transition: 0.3s;";
            
            fab.onclick = () => openYtModal();
            document.body.appendChild(fab);
        }
    };

    // ২. শুধু Web Browser পেজ চেক করা
    setInterval(() => {
        const isWebBrowserPage = Array.from(document.querySelectorAll('div, h1, h2')).some(el => 
            el.innerText && el.innerText.trim() === 'Web Browser'
        );

        const fab = document.getElementById('nexus-yt-fab');
        if (isWebBrowserPage) {
            if (!fab) createFloatingBtn();
        } else {
            if (fab) fab.remove(); // ব্রাউজার পেজ থেকে বের হলে বাটন মুছে যাবে
        }
    }, 1000);

    // ৩. পপ-আপ ডিজাইন
    function openYtModal() {
        let modal = document.getElementById('yt-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'yt-modal';
            modal.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:90%; max-width:400px; background:#18181b; border:1px solid #ef4444; border-radius:16px; padding:20px; z-index:999999; box-shadow:0 10px 40px rgba(0,0,0,0.9); display:flex; flex-direction:column;";
            
            modal.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h2 style="color:#ef4444; font-size:18px; margin:0;">📺 YT Downloader</h2>
                    <button id="close-yt" style="background:#3f3f46; color:white; border:none; padding:5px 12px; border-radius:8px; cursor:pointer;">X</button>
                </div>
                <input type="text" id="yt-link" placeholder="Paste YouTube link here..." style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:15px; border-radius:8px; outline:none; box-sizing:border-box; margin-bottom:15px;">
                <button id="direct-download-btn" style="background:#ef4444; color:white; padding:15px; border-radius:8px; border:none; font-weight:bold; cursor:pointer; width:100%;">⬇️ DOWNLOAD</button>
            `;
            document.body.appendChild(modal);

            document.getElementById('close-yt').onclick = () => modal.style.display = 'none';

            document.getElementById('direct-download-btn').onclick = () => {
                const url = document.getElementById('yt-link').value.trim();
                if(!url.includes('youtu')) { alert("Invalid URL!"); return; }
                
                if(window.addNexusHistory) window.addNexusHistory("Downloaded: " + url, "📺 YT Downloader");
                
                window.open(`https://loader.to/api/v1/video?url=${encodeURIComponent(url)}&format=mp4`, '_blank');
                modal.style.display = 'none';
            };
        }
        modal.style.display = 'flex';
    }
})();
                    
