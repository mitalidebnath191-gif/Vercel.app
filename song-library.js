// NEXUS Full Song Library & Player (JioSaavn Free API)
(function() {
    const initMusicBtn = setInterval(() => {
        if (!document.getElementById('nexus-music-fab')) {
            const fab = document.createElement('button');
            fab.id = 'nexus-music-fab';
            fab.innerHTML = '🎵 Music';
            fab.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: #ec4899; color: white; padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4); z-index: 999998; transition: 0.3s; display: flex; align-items: center; gap: 8px;";

            fab.onmouseover = () => { fab.style.transform = "scale(1.05)"; fab.style.boxShadow = "0 6px 20px rgba(236, 72, 153, 0.6)"; };
            fab.onmouseout = () => { fab.style.transform = "scale(1)"; fab.style.boxShadow = "0 4px 15px rgba(236, 72, 153, 0.4)"; };

            document.body.appendChild(fab);
            fab.onclick = (e) => { e.preventDefault(); openMusicModal(); };
            clearInterval(initMusicBtn);
        }
    }, 1000);

    let currentAudio = null;

    function openMusicModal() {
        let modal = document.getElementById('music-modal');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'music-modal';
            modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 420px; background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column;";

            modal.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#ec4899; font-weight:bold; font-size:18px; margin:0;">🎧 Nexus Music (Full)</h2>
                    <button id="close-music-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <input type="text" id="music-search-input" placeholder="Search any song (e.g. Arijit Singh)..." style="flex:1; background:#27272a; border:1px solid #52525b; color:white; padding:10px 15px; border-radius:8px; font-size:14px; outline:none;" />
                    <button id="music-search-btn" style="background:#ec4899; color:white; border:none; padding:10px 15px; border-radius:8px; font-weight:bold; cursor:pointer;">Search</button>
                </div>

                <div id="music-results" style="display:flex; flex-direction:column; gap:10px; max-height:280px; overflow-y:auto; padding-right:5px;">
                    <div style="text-align:center; color:#a1a1aa; font-size:13px; padding:20px;">Search for a song to play the full track!</div>
                </div>

                <div id="now-playing-container" style="margin-top:15px; background:#27272a; padding:12px; border-radius:10px; border:1px solid #ec4899; display:none; flex-direction:column; align-items:center; gap:10px;">
                    <div id="now-playing-title" style="color:white; font-size:13px; font-weight:bold; text-align:center; width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
                    <audio id="audio-player" controls style="width:100%; height:35px; outline:none; border-radius:5px;"></audio>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('close-music-btn').onclick = () => {
                modal.style.display = 'none';
                if (currentAudio) currentAudio.pause();
            };

            document.getElementById('music-search-btn').onclick = async () => {
                const query = document.getElementById('music-search-input').value.trim();
                const resultsContainer = document.getElementById('music-results');

                if (!query) { alert("Please enter a song name!"); return; }

                resultsContainer.innerHTML = `<div style="text-align:center; color:#38bdf8; font-size:13px; padding:20px; animation: pulse 1.5s infinite;">Searching for full songs...</div>`;

                try {
                    // JioSaavn Free API ব্যবহার করা হচ্ছে সম্পূর্ণ গানের জন্য
                    const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
                    const json = await res.json();

                    if (json.success && json.data.results.length > 0) {
                        resultsContainer.innerHTML = '';
                        
                        json.data.results.forEach(song => {
                            // গানের ডেটা বের করা
                            const title = song.name || "Unknown Song";
                            const artist = song.artists && song.artists.primary && song.artists.primary.length > 0 ? song.artists.primary[0].name : "Unknown Artist";
                            const img = song.image && song.image.length > 1 ? song.image[1].link : (song.image[0] ? song.image[0].link : "");
                            
                            // অডিও লিংক বের করা (যাতে ফুল গান প্লে হয়)
                            let audioUrl = "";
                            if (song.downloadUrl && song.downloadUrl.length > 0) {
                                // চেষ্টা করবে 160kbps বা 320kbps কোয়ালিটির লিংক নিতে
                                const bestAudio = song.downloadUrl.find(q => q.quality === '320kbps') || song.downloadUrl.find(q => q.quality === '160kbps') || song.downloadUrl[song.downloadUrl.length - 1];
                                audioUrl = bestAudio.link;
                            }

                            if (!audioUrl) return; // অডিও লিংক না থাকলে স্কিপ করবে

                            const songDiv = document.createElement('div');
                            songDiv.style.cssText = "display:flex; align-items:center; gap:12px; background:#27272a; padding:10px; border-radius:8px; border:1px solid #3f3f46; cursor:pointer; transition:0.2s;";
                            
                            songDiv.onmouseover = () => songDiv.style.borderColor = "#ec4899";
                            songDiv.onmouseout = () => songDiv.style.borderColor = "#3f3f46";

                            songDiv.innerHTML = `
                                <img src="${img}" style="width:50px; height:50px; border-radius:6px; object-fit:cover; box-shadow: 0 2px 5px rgba(0,0,0,0.5);" onerror="this.src='https://via.placeholder.com/50?text=🎵'" />
                                <div style="flex:1; overflow:hidden;">
                                    <div style="color:white; font-size:14px; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${title}</div>
                                    <div style="color:#a1a1aa; font-size:12px;">${artist}</div>
                                </div>
                                <button class="play-btn" style="background:#ec4899; color:white; border:none; border-radius:50%; width:35px; height:35px; display:flex; justify-content:center; align-items:center; font-size:14px; cursor:pointer; padding-left: 3px;">▶</button>
                            `;

                            songDiv.onclick = () => playSong(audioUrl, title, artist);
                            resultsContainer.appendChild(songDiv);
                        });

                        if (window.addNexusHistory) {
                            window.addNexusHistory(`Searched for: ${query}`, "🎧 Music Library");
                        }

                    } else {
                        resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:13px; padding:20px;">❌ No songs found for "${query}"</div>`;
                    }
                } catch (err) {
                    resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:13px; padding:20px;">⚠️ Connection Error! Please try again.</div>`;
                }
            };
        } else {
            modal.style.display = 'flex';
        }
    }

    function playSong(audioUrl, title, artist) {
        const playerContainer = document.getElementById('now-playing-container');
        const titleDiv = document.getElementById('now-playing-title');
        const audioEl = document.getElementById('audio-player');

        playerContainer.style.display = 'flex';
        titleDiv.innerHTML = `🎵 Playing Full Song: <span style="color:#ec4899;">${title}</span> by ${artist}`;
        
        audioEl.src = audioUrl;
        audioEl.play();
        currentAudio = audioEl;
        
        if (window.addNexusHistory) {
            window.addNexusHistory(`Listened: ${title} - ${artist}`, "🎵 Music Player");
        }
    }
})();
                                
