// NEXUS Ayushman Bharat Link Engine (Standalone File)
(function() {
    // প্রতি সেকেন্ডে চেক করবে প্রোফাইল পপ-আপ ওপেন হলো কি না
    setInterval(() => {
        // আমরা এখন "Coder Web" কন্টেইনারটিকে খুঁজছি, যাতে তার নিচেই এই বাটনটি বসাতে পারি
        const coderHub = document.getElementById('coder-hub-container');
        
        // যদি Coder Web থাকে কিন্তু Ayushman Bharat বাটন না থাকে, তবে তৈরি করবে
        if (coderHub && !document.getElementById('ayushman-btn')) {
            const ayushBtn = document.createElement('button');
            ayushBtn.id = 'ayushman-btn';
            
            // বাটনের ডিজাইন (হেলথ কেয়ার থিমের জন্য সুন্দর নীল রঙ দেওয়া হয়েছে)
            ayushBtn.style.cssText = "background:#0ea5e9; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3); margin-top: 10px;";
            ayushBtn.innerHTML = "🏥 Ayushman Bharat";
            
            // বাটনে ক্লিক করলে কী হবে
            ayushBtn.onclick = () => {
                if(window.addNexusHistory) {
                    window.addNexusHistory("Opened Ayushman Bharat", "🏥 Gov Health");
                }
                // আপনার দেওয়া সরকারি পোর্টালে সরাসরি চলে যাবে
                window.open("https://abha.abdm.gov.in/abha/v3", "_blank");
            };
            
            // Coder Web-এর কন্টেইনারের ঠিক নিচেই বাটনটি বসিয়ে দেবে
            coderHub.parentNode.appendChild(ayushBtn);
        }
    }, 1000);
})();
