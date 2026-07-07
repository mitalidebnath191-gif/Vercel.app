// NEXUS Barcode Generator Engine
(function() {
    setInterval(() => {
        // QR Generator বাটনটি খুঁজছে
        const qrGenBtn = document.getElementById('qr-generator-btn');
        
        // যদি QR বাটন থাকে কিন্তু Barcode বাটন না থাকে
        if (qrGenBtn && !document.getElementById('barcode-gen-btn')) {
            const barBtn = document.createElement('button');
            barBtn.id = 'barcode-gen-btn';
            barBtn.style.cssText = "background:#f59e0b; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); margin-top: 10px;";
            barBtn.innerHTML = "📊 Generate Barcode";
            
            barBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                
                let modal = document.createElement('div');
                modal.id = 'bar-gen-modal';
                modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;";
                
                modal.innerHTML = `
                    <div style="width: 100%; max-width: 380px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #f59e0b;">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 15px;">
                            <h2 style="color:#f59e0b; margin:0;">📊 Barcode Creator</h2>
                            <button id="close-bar-gen" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; cursor:pointer;">X</button>
                        </div>
                        <input type="text" id="bar-input" placeholder="Enter numbers/text..." style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px; border-radius:8px; box-sizing:border-box; margin-bottom:10px;">
                        <button id="bar-gen-btn" style="background:#f59e0b; color:white; border:none; padding:12px; border-radius:8px; width:100%; font-weight:bold; cursor:pointer;">Generate Barcode</button>
                        <div id="bar-res-box" style="display:none; text-align:center; margin-top:15px;">
                            <img id="bar-img" style="width:100%; height:auto; background:white; padding:10px; border-radius:8px;">
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                document.getElementById('close-bar-gen').onclick = () => {
                    modal.remove();
                    if(profileModal) profileModal.style.display = 'flex';
                };

                document.getElementById('bar-gen-btn').onclick = () => {
                    const text = document.getElementById('bar-input').value;
                    if(!text) return alert("Enter content!");
                    // Barcode API ব্যবহার করা হয়েছে
                    document.getElementById('bar-img').src = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(text)}&code=Code128`;
                    document.getElementById('bar-res-box').style.display = 'block';
                };
            };
            qrGenBtn.parentNode.appendChild(barBtn);
        }
    }, 1000);
})();

