// NEXUS Songs Lyrics Hub Engine (With Show/Hide)
(function() {
    setInterval(() => {
        // Ayushman Bharat বাটনের ঠিক নিচেই নতুন বাটনটি বসবে
        const ayushBtn = document.getElementById('ayushman-btn');
        
        if (ayushBtn && !document.getElementById('lyrics-hub-btn')) {
            const container = document.createElement('div');
            container.id = 'lyrics-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            // Show/Hide বাটন
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'lyrics-hub-btn';
            toggleBtn.style.cssText = "background:#ec4899; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);";
            toggleBtn.innerHTML = "🎵 Songs Lyrics";
            
            // লিস্ট কন্টেইনার (লুকানো থাকবে)
            const listDiv = document.createElement('div');
            listDiv.id = 'lyrics-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            // ওয়েবসাইট লিস্ট
            const sites = [
                { name: "Genius", url: "https://genius.com" },
                { name: "Musixmatch", url: "https://www.musixmatch.com" },
                { name: "AZLyrics", url: "https://www.azlyrics.com" },
                { name: "Lyrics.com", url: "https://www.lyrics.com" },
                { name: "LyricsTranslate", url: "https://lyricstranslate.com" }
            ];
            
            sites.forEach(site => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#f472b6; border:1px solid #f472b6; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left;";
                btn.innerHTML = `🎤 ${site.name}`;
                btn.onclick = () => window.open(site.url, "_blank");
                listDiv.appendChild(btn);
            });
            
            // টগল লজিক
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "🎵 Hide Songs Lyrics" : "🎵 Songs Lyrics";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            ayushBtn.parentNode.appendChild(container);
        }
    }, 1000);
})();
                 
