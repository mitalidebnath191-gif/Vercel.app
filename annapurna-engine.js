// NEXUS Annapurna Verification Link Engine (Standalone File)
(function() {
    // প্রোফাইল পপ-আপ চেক করার লুপ
    setInterval(() => {
        // আমরা এখন "Advance AI" বাটনটিকে খুঁজছি, যাতে তার নিচেই Annapurna বাটনটি বসাতে পারি
        const aiBtn = document.getElementById('advance-ai-btn');
        
        // যদি AI বাটন থাকে কিন্তু Annapurna বাটন না থাকে, তবে তৈরি করবে
        if (aiBtn && !document.getElementById('annapurna-btn')) {
            const annaBtn = document.createElement('button');
            annaBtn.id = 'annapurna-btn';
            
            // বাটনের ডিজাইন (সুন্দর হলুদ বা গোল্ডেন কালার দেওয়া হয়েছে যাতে সহজে আলাদা করা যায়)
            annaBtn.style.cssText = "background:#eab308; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3); margin-top: 10px;";
            annaBtn.innerHTML = "🌾 Annapurna Verification";
            
            // বাটনে ক্লিক করলে কী হবে
            annaBtn.onclick = () => {
                if(window.addNexusHistory) {
                    window.addNexusHistory("Opened Annapurna Verification", "📜 Gov Portal");
                }
                // আপনার দেওয়া সরকারি পোর্টালের লিংকটি ওপেন করবে
                window.open("https://socialregistry.wb.gov.in/", "_blank");
            };
            
            // AI বাটনের ঠিক নিচেই বসিয়ে দেবে
            aiBtn.parentNode.appendChild(annaBtn);
        }
    }, 1000);
})();
