// NEXUS QR Code Generator Engine (Standalone File)
(function() {
    setInterval(() => {
        // গানের লিরিক্স বাটনটির কন্টেইনার খুঁজছে
        const lyricsContainer = document.getElementById('lyrics-hub-container') || document.getElementById('lyrics-hub-btn');
        
        // যদি লিরিক্স বাটন থাকে কিন্তু QR জেনারেটর না থাকে, তবে এটি বসিয়ে দেবে
        if (lyricsContainer && !document.getElementById('qr-generator-btn')) {
            const qrGenBtn = document.createElement('button');
            qrGenBtn.id = 'qr-generator-btn';
            
            // বাটনের ডিজাইন (টিয়াল/সবুজ-নীল কালার দেওয়া হয়েছে)
            qrGenBtn.style.cssText = "background:#14b8a6; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3); margin-top: 10px;";
            qrGenBtn.innerHTML = "🔲 Generate QR Code";
            
            // বাটনে ক্লিক করলে মূল প্রোফাইল পপ-আপ লুকিয়ে নতুন QR মেকার উইন্ডো খুলবে
            qrGenBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                openQrGenModal(profileModal);
            };
            
            lyricsContainer.parentNode.appendChild(qrGenBtn);
        }
    }, 1000);

    // কিউআর মেকার পপ-আপ লজিক
    function openQrGenModal(profileModal) {
        let modal = document.getElementById('qr-gen-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'qr-gen-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center;";
        
        modal.innerHTML = `
            <div style="width: 90%; max-width: 380px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #14b8a6; display: flex; flex-direction: column; gap: 15px;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#14b8a6; font-weight:bold; font-size:18px; margin:0;">🔲 QR Creator</h2>
                    <button id="close-qr-gen-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="width:100%;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Enter Text or URL:</label>
                    <input type="text" id="qr-input-text" placeholder="e.g. Hello or google.com" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box;">
                </div>
                
                <div style="width:100%;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Select Template:</label>
                    <select id="qr-template-select" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px; border-radius:8px; font-size:14px; outline:none; cursor:pointer;">
                        <option value="000000-ffffff">Classic (Black on White)</option>
                        <option value="00ffff-000000">Neon Blue (Blue on Black)</option>
                        <option value="00ff00-000000">Matrix (Green on Black)</option>
                        <option value="ff4500-ffffff">Sunset (Orange on White)</option>
                        <option value="d4af37-18181b">Luxury (Gold on Dark)</option>
                    </select>
                </div>

                <button id="create-qr-btn" style="background:#14b8a6; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);">Create QR Code</button>

                <div id="qr-result-box" style="display:none; flex-direction:column; align-items:center; gap:10px; margin-top:10px; padding:15px; background:#27272a; border-radius:8px; border: 1px dashed #52525b;">
                    <img id="qr-result-img" src="" style="width:200px; height:200px; border-radius:8px; background:white; padding:10px;">
                    
                    <a id="qr-download-link" href="#" target="_blank" style="background:#3b82f6; color:white; padding:10px 15px; border-radius:8px; font-weight:bold; text-decoration:none; width:100%; text-align:center; box-sizing:border-box; margin-top:5px;">📥 Open Full Image</a>
                    
                    <p style="color:#a1a1aa; font-size:11px; margin:0; text-align:center;">(Long press the QR code to Save/Share)</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // ক্লোজ করার ফাংশন
        document.getElementById('close-qr-gen-btn').onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex'; // মূল প্রোফাইল পপ-আপ আবার দেখিয়ে দেবে
        };

        // QR বানানোর ফাংশন
        document.getElementById('create-qr-btn').onclick = () => {
            const text = document.getElementById('qr-input-text').value.trim();
            if(!text) {
                alert("Please enter some text or URL first!");
                return;
            }

            // বাটন টেক্সট চেঞ্জ করে লোডিং দেখানো
            const btn = document.getElementById('create-qr-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = "⏳ Generating...";

            // টেমপ্লেট থেকে কালার বের করা (প্রথমটি Foreground, দ্বিতীয়টি Background)
            const template = document.getElementById('qr-template-select').value;
            const [color, bgcolor] = template.split('-');
            const encodedText = encodeURIComponent(text);

            // API কল করে লাইভ QR Code বানানো
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}&color=${color}&bgcolor=${bgcolor}`;
            
            const resultBox = document.getElementById('qr-result-box');
            const resultImg = document.getElementById('qr-result-img');
            const downloadLink = document.getElementById('qr-download-link');

            // ইমেজ লোড হলে রেজাল্ট দেখাবে
            resultImg.onload = () => {
                btn.innerHTML = originalText;
                resultBox.style.display = 'flex';
                if(window.addNexusHistory) window.addNexusHistory("Generated a QR Code", "🔲 QR Creator");
            };
            
            resultImg.src = qrUrl;
            downloadLink.href = qrUrl; // ফুল ইমেজ ডাউনলোড করার জন্য লিংক
        };
    }
})();
          
