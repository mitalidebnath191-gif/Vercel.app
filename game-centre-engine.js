// NEXUS Game Centre Engine (Standalone File)
(function() {
    setInterval(() => {
        // Barcode Generator বাটনটি খুঁজছে
        const barBtn = document.getElementById('barcode-gen-btn');
        
        // যদি Barcode বাটন থাকে কিন্তু Game Centre বাটন না থাকে
        if (barBtn && !document.getElementById('game-centre-btn')) {
            const gameBtn = document.createElement('button');
            gameBtn.id = 'game-centre-btn';
            
            // বাটনের ডিজাইন (গেমিং ফিল দেওয়ার জন্য ইন্ডিগো/নীল-বেগুনি রঙ ব্যবহার করা হয়েছে)
            gameBtn.style.cssText = "background:#6366f1; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); margin-top: 10px;";
            gameBtn.innerHTML = "🎮 Game Centre";
            
            // বাটনে ক্লিক করলে Poki.com খুলবে
            gameBtn.onclick = () => {
                if(window.addNexusHistory) {
                    window.addNexusHistory("Opened Game Centre", "🎮 Games");
                }
                window.open("https://poki.com/", "_blank");
            };
            
            // Barcode বাটনের ঠিক নিচেই এটি বসিয়ে দেবে
            barBtn.parentNode.appendChild(gameBtn);
        }
    }, 1000);
})();
                
