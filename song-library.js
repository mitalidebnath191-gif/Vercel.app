// NEXUS Public Song Library & Player (Free API)
(function() {
    // ১. Floating Music Button তৈরি করা
    const initMusicBtn = setInterval(() => {
        if (!document.getElementById('nexus-music-fab')) {
            const fab = document.createElement('button');
            fab.id = 'nexus-music-fab';
            fab.innerHTML = '🎵 Music';
            fab.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: #ec4899; color: white; padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4); z-index: 999998; transition: 0.3s; display: flex; align-items: center; gap: 8px;";

            // হোভার এফেক্ট
            fab.onmouseover = () => { fab.style.transform = "scale(1.05)"; fab.style.boxShadow = "0 6px 20px rgba(236, 72, 153, 0.6)"; };
            fab.onmouseout = () => { fab.style.transform = "scale(1)"; fab.style.boxShadow = "0 4px 15px rgba(236, 72, 153, 0.4)"; };

            document.body.appendChild(fab);

            fab.onclick = (e) => {
                e.preventDefault();
                openMusicModal();
            };
            clearInterval(initMusicBtn); // একবার তৈরি হয়ে গেলে লুপ বন্ধ করবে
        }
    }, 1000);

    let currentAudio = null; // বর্তমানে চলা গান ট্র্যাক করার জন্য

    // ২. মিউজিক প্লেয়ার পপ-আপ খোলার লজিক
    function openMusicModal() {
        let modal = document.getElementById('music-modal');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'music-modal';
            modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 420px; background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column;";

            modal.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#ec4899; font-weight:bold; font-size:18px; margin:0;">🎧 Song Library (Free)</h2>
                    <button id="close-music-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <input type="text" id="music-search-input" placeholder="Search song or artist..." style="flex:1; background:#27272a; border:1px solid #52525b; color:white; padding:10px 15px; border-radius:8px; font-size:14px; outline:none;" />
                    <button id="music-search-btn" style="background:#ec4899; color:white; border:none; padding:10px 15px; border-radius:8px; font-weight:bold; cursor:pointer;">Search</button>
                </div>

                <!-- গানের রেজাল্ট এখানে আসবে -->
                <div id="music-results" style="display:flex; flex-direction:column; gap:10px; max-height:280px; overflow-y:auto; padding-right:5px;">
                    <div style="text-align:center; color:#a1a1aa; font-size:13px; padding:20px;">Search for any song to play!</div>
                </div>

                <!-- নিচে অডিও প্লেয়ার -->
                <div id="now-playing-container" style="margin-top:15px; background:#27272a; padding:12px; border-radius:10px; border:1px solid #ec4899; display:none; flex-direction:column; align-items:center; gap:10px;">
                    <div id="now-playing-title" style="color:white; font-size:13px; font-weight:bold; text-align:center; width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
                    <audio id="audio-player" controls style="width:100%; height:35px; outline:none; border-radius:5px;"></audio>
                </div>
            `;
            document.body.appendChild(modal);

            // পপ-আপ বন্ধ করার লজিক
            document.getElementById('close-music-btn').onclick = () => {
                modal.style.display = 'none';
                if (currentAudio) currentAudio.pause(); // পপ-আপ কাটলে গান বন্ধ হয়ে যাবে
            };

            // সার্চ বাটনের লজিক (API কল)
            document.getElementById('music-search-btn').onclick = async () => {
                const query = document.getElementById('music-search-input').value.trim();
                const resultsContainer = document.getElementById('music-results');

                if (!query) {
                    alert("Please enter a song name!");
                    return;
                }

                resultsContainer.innerHTML = `<div style="text-align:center; color:#38bdf8; font-size:13px; padding:20px; animation: pulse 1.5s infinite;">Searching for "${query}"...</div>`;

                try {
                    // Apple iTunes Free API (No CORS issue, No API Key needed)
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
                                <button class="play-btn" style="background:#ec4899; color:white; border:none; border-radius:50%; width:35px; height:35px; display:flex; justify-content:center; align-items:center; font-size:14px; cursor:pointer; padding-left: 3px;">▶</button>
                            `;

                            // গানে ক্লিক করলে প্লে হবে
                            songDiv.onclick = () => {
                                playSong(song.previewUrl, song.trackName, song.artistName);
                            };

                            resultsContainer.appendChild(songDiv);
                        });

                        // 🕒 History সিস্টেমে অটো-সেভ করা (যদি থাকে)
                        if (window.addNexusHistory) {
                            window.addNexusHistory(`Searched for: ${query}`, "🎧 Music Library");
                        }

                    } else {
                        resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:13px; padding:20px;">❌ No songs found for "${query}"</div>`;
                    }
                } catch (err) {
                    resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:13px; padding:20px;">⚠️ API Connection Error!</div>`;
                }
            };
        } else {
            modal.style.display = 'flex';
        }
    }

    // ৩. গান প্লে করার ফাংশন
    function playSong(previewUrl, title, artist) {
        const playerContainer = document.getElementById('now-playing-container');
        const titleDiv = document.getElementById('now-playing-title');
        const audioEl = document.getElementById('audio-player');

        if (!previewUrl) {
            alert("Preview not available for this song.");
            return;
        }

        playerContainer.style.display = 'flex';
        titleDiv.innerHTML = `🎵 Playing: <span style="color:#ec4899;">${title}</span> by ${artist}`;
        
        audioEl.src = previewUrl;
        audioEl.play();
        currentAudio = audioEl;
        
        // 🕒 গান প্লে করলে হিস্ট্রিতে সেভ হবে
        if (window.addNexusHistory) {
            window.addNexusHistory(`Played: ${title} - ${artist}`, "🎵 Music Player");
        }
    }
})();
              
