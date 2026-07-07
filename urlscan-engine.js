// NEXUS urlscan.io Quick Redirect Engine
(function() {
    setInterval(() => {
        // স্পিড টেস্ট বাটনটি খুঁজছে
        const speedBtn = document.getElementById('speed-test-btn');
        
        // যদি স্পিড টেস্ট বাটন থাকে কিন্তু urlscan বাটন না থাকে
        if (speedBtn && !document.getElementById('urlscan-cloud-btn')) {
            const cloudBtn = document.createElement('button');
            cloudBtn.id = 'urlscan-cloud-btn';
            
            // বাটনের ডিজাইন
            cloudBtn.style.cssText = "background:#000000; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3); margin-top: 10px;";
            cloudBtn.innerHTML = "🔍 Open urlscan.io";
            
            // সরাসরি ওয়েবসাইটে রিডাইরেক্ট করবে
            cloudBtn.onclick = () => {
                if(window.addNexusHistory) {
                    window.addNexusHistory("Opened urlscan.io", "🔍 Security");
                }
                window.open("https://urlscan.io/", "_blank");
            };
            
            // স্পিড টেস্ট বাটনের ঠিক নিচে বসিয়ে দেবে
            speedBtn.parentNode.insertBefore(cloudBtn, speedBtn.nextSibling);
        }
    }, 1000);
})();
