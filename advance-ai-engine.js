// NEXUS Advance AI External Link Engine (Standalone File)
(function() {
    // প্রতি সেকেন্ডে চেক করবে প্রোফাইল পপ-আপ ওপেন হলো কি না
    setInterval(() => {
        // QR Scanner বাটনটি খুঁজবে
        const qrBtn = document.getElementById('start-qr-btn');
        
        // যদি QR বাটন স্ক্রিনে থাকে কিন্তু Advance AI বাটন না থাকে, তবে নতুন বাটনটি তৈরি করবে
        if (qrBtn && !document.getElementById('advance-ai-btn')) {
            const aiBtn = document.createElement('button');
            aiBtn.id = 'advance-ai-btn';
            
            // বাটনের ডিজাইন (QR বাটনের ঠিক নিচে সুন্দরভাবে বসার জন্য margin-top দেওয়া হয়েছে)
            aiBtn.style.cssText = "background:#8b5cf6; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); margin-top: 10px;";
            aiBtn.innerHTML = "🤖 Advance AI";
            
            // বাটনে ক্লিক করলে কী হবে
            aiBtn.onclick = () => {
                if(window.addNexusHistory) {
                    window.addNexusHistory("Opened Advance AI", "🤖 AI Tools");
                }
                // আপনার দেওয়া লিংকটি সরাসরি ডিফল্ট ব্রাউজারে ওপেন করবে
                window.open("https://aiiiiiiiiiiiiiii.vercel.app/", "_blank");
            };
            
            // QR বাটনের কন্টেইনারে (ঠিক নিচে) বাটনটি বসিয়ে দেবে
            qrBtn.parentNode.appendChild(aiBtn);
        }
    }, 1000); 
})();
