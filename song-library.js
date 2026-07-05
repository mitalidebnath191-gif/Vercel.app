// NEXUS Full Music Player (Powered by YouTube Engine - 100% Full Songs)
(function() {
    const initMusicBtn = setInterval(() => {
        if (!document.getElementById('nexus-music-fab')) {
            const fab = document.createElement('button');
            fab.id = 'nexus-music-fab';
            fab.innerHTML = '🎵 Music';
            fab.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: #ec4899; color: white; padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4); z-index: 999998; transition: 0.3s; display: flex; align-items: center; gap: 8px;";
            
            fab.onmouseover = () => { fab.style.transform = "scale(1.05)"; fab.style.boxShadow = "0 6px 20px rgba(236, 72, 153, 0.6)"; };
            fab.onmouseout = () => { fab.style.transform = "scale(1)"; fab.style.boxShadow = "0 4px 15px rgba(236, 72, 153, 0.4)"; };
            
            fab.onclick = (e) => { e.preventDefault(); openMusicModal(); };
            document.body.appendChild(fab);
            clearInterval(initMusicBtn);
        }
    }, 1000);

    function openMusicModal() {
        let modal = document.getElementById('music-modal');
        if (modal) modal.remove(); // আগের পপ-আপ থাকলে ডিলিট করে দেবে, যাতে ব্যাকগ্রাউন্ডে গান না বাজে

        modal = document.createElement('div');
        modal.id = 'music-modal';
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 420px; background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                <h2 style="color:#ec4899; font-weight:bold; font-size:18px; margin:0;">🎧 Nexus YT Music</h2>
                <button id="close-music-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
            </div>

            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <input type="text" id="music-search-input" placeholder="Search full songs..." style="flex:1; background:#27272a; border:1px solid #52525b; color:white; padding:10px 15px; border-radius:8px; font-size:14px; outline:none;" />
                <button id="music-search-btn" style="background:#ec4899; color:white; border:none; padding:10px 15px; border-radius:8px; font-weight:bold; cursor:pointer;">Search</button>
            </div>

            <div id="music-results" style="display:flex; flex-direction:column; gap:10px; max-height:280px; overflow-y:auto; padding-right:5px;">
                <div style="text-align:center; color:#a1a1aa; font-size:13px; padding:20px;">Search ANY song. Guaranteed 100% Full Playback!</div>
            </div>

            <div id="now-playing-container" style="margin-top:15px; display:none; flex-direction:column; align-items:center; border:1px solid #ec4899; border-radius:10px; overflow:hidden; background:black;">
                <!-- YouTube Music Player এখানে আসবে -->
            </div>
        `;
        document.body.appendChild(modal);

        // Close বাটনে ক্লিক করলে পপ-আপ রিমুভ হবে এবং গানও পুরোপুরি বন্ধ হয়ে যাবে
        document.getElementById('close-music-btn').onclick = () => modal.remove();

        document.getElementById('music-search-btn').onclick = async () => {
            const query = document.getElementById('music-search-input').value.trim();
            const resultsContainer = document.getElementById('music-results');

            if (!query) { alert("Please enter a song name!"); return; }

            resultsContainer.innerHTML = `<div style="text-align:center; color:#38bdf8; font-size:13px; padding:20px; animation: pulse 1.5s infinite;">⏳ Searching YouTube Music Servers...</div>`;

            try {
                // ওপেন-সোর্স Piped API ব্যবহার করে ইউটিউব থেকে সরাসরি রেজাল্ট আনা হচ্ছে
                const res = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query + ' official audio')}`);
                const json = await res.json();

                if (json.items && json.items.length > 0) {
                    resultsContainer.innerHTML = '';
                    
                    // শুধুমাত্র ভিডিও বা অডিও স্ট্রিমগুলো ফিল্টার করা হচ্ছে
                    const tracks = json.items.filter(item => item.type === 'stream').slice(0, 15);

                    if(tracks.length === 0) {
                        resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:13px; padding:20px;">❌ No audio tracks found. Try another name.</div>`;
                        return;
                    }

                    tracks.forEach(song => {
                        const title = song.title || "Unknown Song";
                        const uploader = song.uploaderName || "YouTube Artist";
                        const img = song.thumbnail || "https://via.placeholder.com/50?text=🎵";
                        const videoId = song.url.replace('/watch?v=', '');

                        const songDiv = document.createElement('div');
                        songDiv.style.cssText = "display:flex; align-items:center; gap:12px; background:#27272a; padding:10px; border-radius:8px; border:1px solid #3f3f46; cursor:pointer; transition:0.2s;";
                        
                        songDiv.onmouseover = () => songDiv.style.borderColor = "#ec4899";
                        songDiv.onmouseout = () => songDiv.style.borderColor = "#3f3f46";

                        songDiv.innerHTML = `
                            <img src="${img}" style="width:50px; height:50px; border-radius:6px; object-fit:cover; box-shadow: 0 2px 5px rgba(0,0,0,0.5);" />
                            <div style="flex:1; overflow:hidden;">
                                <div style="color:white; font-size:13px; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${title}</div>
                                <div style="color:#a1a1aa; font-size:11px;">${uploader}</div>
                            </div>
                            <button style="background:#ec4899; color:white; border:none; border-radius:50%; width:35px; height:35px; display:flex; justify-content:center; align-items:center; font-size:14px; cursor:pointer; padding-left: 3px;">▶</button>
                        `;

                        // গানে ক্লিক করলে প্লেয়ার ওপেন হবে
                        songDiv.onclick = () => playYtSong(videoId, title);
                        resultsContainer.appendChild(songDiv);
                    });

                    // হিস্ট্রিতে সেভ করা
                    if (window.addNexusHistory) window.addNexusHistory(`Searched: ${query}`, "🎧 Music Library");

                } else {
                    resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:13px; padding:20px;">❌ No songs found</div>`;
                }
            } catch (err) {
                resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:13px; padding:20px;">⚠️ Network Error! Please try again.</div>`;
            }
        };

        function playYtSong(videoId, title) {
            const playerContainer = document.getElementById('now-playing-container');
            playerContainer.style.display = 'flex';
            
            // ইউটিউবের লাইভ iFrame প্লেয়ার ব্যবহার করা হচ্ছে (কখনোই ৩০ সেকেন্ড হবে না)
            playerContainer.innerHTML = `
                <div style="background:#18181b; width:100%; padding:8px 0; text-align:center; border-bottom:1px solid #ec4899;">
                    <marquee scrollamount="4" style="color:white; font-size:12px; font-weight:bold;">🎵 Now Playing: ${title}</marquee>
                </div>
                <iframe width="100%" height="100" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="border-radius:0 0 10px 10px;"></iframe>
            `;
            
            if (window.addNexusHistory) window.addNexusHistory(`Listened: ${title}`, "🎵 Music Player");
        }
    }
})();
                            
