// NEXUS Accurate Internet Speed Test Engine (Standalone File)
(function() {
    setInterval(() => {
        // Language Translator বাটনটি খুঁজছে
        const transBtn = document.getElementById('nexus-translator-btn');
        
        // যদি Translator বাটন থাকে কিন্তু Speed Test বাটন না থাকে
        if (transBtn && !document.getElementById('speed-test-btn')) {
            const speedBtn = document.createElement('button');
            speedBtn.id = 'speed-test-btn';
            
            // বাটনের ডিজাইন (ইন্টারনেট/স্পিড থিমের জন্য সুন্দর রয়্যাল ব্লু কালার দেওয়া হয়েছে)
            speedBtn.style.cssText = "background:#2563eb; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); margin-top: 10px;";
            speedBtn.innerHTML = "🚀 Internet Speed Test";
            
            // বাটনে ক্লিক করলে মূল প্রোফাইল পপ-আপ লুকিয়ে স্পিড টেস্ট উইন্ডো খুলবে
            speedBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                openSpeedTestModal(profileModal);
            };
            
            transBtn.parentNode.appendChild(speedBtn);
        }
    }, 1000);

    // স্পিড টেস্ট পপ-আপ উইন্ডো
    function openSpeedTestModal(profileModal) {
        let modal = document.getElementById('speed-test-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'speed-test-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 420px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #2563eb; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#3b82f6; font-weight:bold; font-size:17px; margin:0;">🚀 Speed Test</h2>
                    <button id="close-speed-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="width:100%; height: 380px; background: #27272a; border-radius: 8px; overflow: hidden; position: relative;">
                    <iframe src="https://openspeedtest.com/speedtest" style="width: 100%; height: 100%; border: none;"></iframe>
                </div>
                
                <p style="color:#71717a; font-size:11px; margin:0; text-align:center; padding-top:5px;">Powered by OpenSpeedTest for precise real-time latency and bandwidth metrics.</p>
            </div>
        `;
        document.body.appendChild(modal);

        // বন্ধ করার বাটন
        document.getElementById('close-speed-btn').onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
            if(window.addNexusHistory) window.addNexusHistory("Checked Internet Speed", "🚀 Speed Test");
        };
    }
})();
  
