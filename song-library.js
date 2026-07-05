// NEXUS Hybrid Music Engine (100% Reliable Search + Full YT Audio)
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
        if (modal) modal.remove(); // আগের পপ-আপ সরাবে

        modal = document.createElement('div');
        modal.id = 'music-modal';
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 420px; background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                <h2 style="color:#ec4899; font-weight:bold; font-size:18px; margin:0;">🎧 Nexus Music</h2>
                <button id="close-music-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
            </div>

            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <input type="text" id="music-search-input" placeholder="Search song or artist..." style="flex:1; background:#27272a; border:1px solid #52525b; color:white; padding:10px 15px; border-radius:8px; font-size:14px; outline:none;" />
                <button id="music-search-btn" style="background:#ec4899; color:white; border:none; padding:10px 15px; border-radius:8px; font-weight:bold; cursor:pointer;">Search</button>
            </div>

            <div id="music-results" style="display:flex; flex-direction:column; gap:10px; max-height:280px; overflow-y:auto; padding-right:5px;">
                <div style="text-align:center; color:#a1a1aa; font-size:13px; padding:20px;">Search ANY song for Full Playback!</div>
            </div>

            <div id="now-playing-container" style="margin-top:15px; display:none; flex-direction:column; align-items:center; border:1px solid #ec4899; border-radius:10px; overflow:hidden; background:black;">
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-music-btn').onclick = () => modal.remove();

        document.getElementById('music-search-btn').onclick = async () => {
            const query = document.getElementById('music-search-input').value.trim();
            const resultsContainer = document.getElementById('music-results');

            if (!query) { alert("Please enter a song name!"); return; }

            resultsContainer.innerHTML = `<div style="text-align:center; color:#38bdf8; font-size:13px; padding:20px; animation: pulse 1.5s infinite;">⏳ Searching Securely...</div>`;

            try {
                // ১. Apple iTunes API - দ্রুত এবং 100% রিলায়েবল সার্চ (No Network Error)
                const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`);
                const data = await res.json();

                if (data.results && data.results.length > 0) {
                    resultsContainer.innerHTML = '';

                    data.results.forEach(song => {
                        const songDiv = document.createElement('div');
                        songDiv.style.cssText = "display:flex; align-items:center; gap:12px; background:#27272a; padding:10px; border-radius:8px; border:1px solid #3f3f46; cursor:pointer; transition:0.2s;";

                        songDiv.onmouseover = () => songDiv.style.borderColor = "#ec4899";
                        songDiv.onmouseout = () => songDiv.style.borderColor = "#3f3f46";

                        songDiv.innerHTML = `
                            <img src="${song.artworkUrl100}" style="width:50px; height:50px; border-radius:6px; object-fit:cover; box-shadow: 0 2px 5px rgba(0,0,0,0.5);" />
                            <div style="flex:1; overflow:hidden;">
                                <div style="color:white; font-size:14px; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${song.trackName}</div>
                                <div style="color:#a1a1aa; font-size:12px;">${song.artistName}</div>
                            </div>
                            <button style="background:#ec4899; color:white; border:none; border-radius:50%; width:35px; height:35px; display:flex; justify-content:center; align-items:center; font-size:14px; cursor:pointer; padding-left: 3px;">▶</button>
                        `;

                        // গানে ক্লিক করলে প্লে ফাংশন কল হবে
                        songDiv.onclick = () => playFullSong(song.trackName, song.artistName);
                        resultsContainer.appendChild(songDiv);
                    });

                    if (window.addNexusHistory) window.addNexusHistory(`Searched: ${query}`, "🎧 Music Library");
                } else {
                    resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:13px; padding:20px;">❌ No songs found</div>`;
                }
            } catch (err) {
                resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:13px; padding:20px;">⚠️ Connection Error! Try again.</div>`;
            }
        };

        function playFullSong(title, artist) {
            const playerContainer = document.getElementById('now-playing-container');
            playerContainer.style.display = 'flex';

            // ২. YouTube Embed API - সরাসরি ফুল সং প্লেয়ার (No 30s Limit, No API Crash)
            const searchQuery = encodeURIComponent(title + " " + artist + " official audio");
            
            playerContainer.innerHTML = `
                <div style="background:#18181b; width:100%; padding:8px 0; text-align:center; border-bottom:1px solid #ec4899;">
                    <marquee scrollamount="4" style="color:white; font-size:12px; font-weight:bold;">🎵 Now Playing: ${title} by ${artist}</marquee>
                </div>
                <!-- YouTube Search Playlist (Auto loads the first best match) -->
                <iframe width="100%" height="110" src="https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="border-radius:0 0 10px 10px;"></iframe>
            `;

            if (window.addNexusHistory) window.addNexusHistory(`Listened: ${title} - ${artist}`, "🎵 Music Player");
        }
    }
})();
