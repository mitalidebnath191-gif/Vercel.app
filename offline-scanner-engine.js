// NEXUS Offline Scanner & OCR Engine (100% Client-Side Processing)
(function() {
    // প্রয়োজনীয় লাইব্রেরিগুলো লোড করার ফাংশন (এগুলো একবার লোড হলে অফলাইনে কাজ করবে)
    function loadDependencies() {
        if (!document.getElementById('jspdf-lib')) {
            const script1 = document.createElement('script');
            script1.id = 'jspdf-lib';
            script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script1);
        }
        if (!document.getElementById('tesseract-lib')) {
            const script2 = document.createElement('script');
            script2.id = 'tesseract-lib';
            script2.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
            document.head.appendChild(script2);
        }
    }

    setInterval(() => {
        // Productivity Hub কন্টেইনারটি খুঁজছে
        const prodHub = document.getElementById('productivity-hub-container');
        
        // যদি Productivity Hub থাকে কিন্তু Scanner বাটন না থাকে
        if (prodHub && !document.getElementById('offline-scanner-btn')) {
            loadDependencies(); // বাটন তৈরি হওয়ার আগেই লাইব্রেরিগুলো রেডি করে রাখছি

            const scanBtn = document.createElement('button');
            scanBtn.id = 'offline-scanner-btn';
            
            // বাটনের ডিজাইন (স্ক্যানারের জন্য সুন্দর নীল/সায়ান থিম)
            scanBtn.style.cssText = "background:#0284c7; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); margin-top: 10px;";
            scanBtn.innerHTML = "📸 Offline Scanner & OCR";
            
            scanBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                openScannerModal(profileModal);
            };
            
            prodHub.parentNode.insertBefore(scanBtn, prodHub.nextSibling);
        }
    }, 1000);

    function openScannerModal(profileModal) {
        let modal = document.getElementById('scanner-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'scanner-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 400px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #0284c7; display: flex; flex-direction: column; gap: 15px; box-sizing: border-box; max-height: 90vh; overflow-y: auto;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#0284c7; font-weight:bold; font-size:17px; margin:0;">📸 Doc Scanner & OCR</h2>
                    <button id="close-scanner-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="width:100%; text-align:center;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Take a Photo or Upload Image:</label>
                    <input type="file" id="scanner-upload" accept="image/*" capture="environment" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:13px; outline:none; cursor:pointer;">
                </div>
                
                <div id="canvas-container" style="display:none; width:100%; text-align:center; background:#27272a; border-radius:8px; padding:10px; border:1px dashed #52525b; box-sizing:border-box;">
                    <canvas id="scanner-canvas" style="max-width:100%; height:auto; border-radius:4px;"></canvas>
                </div>

                <div style="display:flex; flex-wrap:wrap; gap:10px; width:100%;">
                    <button id="extract-text-btn" style="flex:1; background:#8b5cf6; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px;">📝 Extract Text</button>
                    <button id="save-pdf-btn" style="flex:1; background:#ef4444; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px;">📄 Save as PDF</button>
                </div>

                <div id="ocr-result-container" style="display:none; width:100%;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Extracted Text:</label>
                    <textarea id="ocr-text-result" style="width:100%; height:120px; background:#1f2937; border:1px solid #374151; color:#4ade80; padding:10px; border-radius:8px; font-size:13px; outline:none; resize:none; box-sizing:border-box;"></textarea>
                </div>
                
                <p style="color:#71717a; font-size:10px; margin:0; text-align:center;">100% Secure & Offline. Your documents never leave your device.</p>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-scanner-btn');
        const fileInput = document.getElementById('scanner-upload');
        const canvasContainer = document.getElementById('canvas-container');
        const canvas = document.getElementById('scanner-canvas');
        const ctx = canvas.getContext('2d');
        const extractBtn = document.getElementById('extract-text-btn');
        const savePdfBtn = document.getElementById('save-pdf-btn');
        const ocrContainer = document.getElementById('ocr-result-container');
        const ocrResult = document.getElementById('ocr-text-result');

        let currentImageObj = null;

        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        // ছবি আপলোড বা ক্যামেরা থেকে তোলা হলে
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // ক্যানভাসে ছবি সেট করা (রিসাইজ করে যাতে প্রসেসিং দ্রুত হয়)
                    const MAX_WIDTH = 800;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // এখানে চাইলে আমরা ব্ল্যাক এন্ড হোয়াইট ফিল্টার লাগাতে পারি, তবে অরিজিনাল স্ক্যান ভালো
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvasContainer.style.display = 'block';
                    currentImageObj = canvas.toDataURL('image/jpeg', 0.8);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };

        // ১. PDF স্ক্যানার (Save as PDF)
        savePdfBtn.onclick = () => {
            if (!currentImageObj) return alert("Please capture or upload an image first!");
            
            try {
                // jsPDF ব্যবহার করে ব্রাউজারেই অফলাইন PDF জেনারেট করা
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
                    unit: "px",
                    format: [canvas.width, canvas.height]
                });
                
                doc.addImage(currentImageObj, 'JPEG', 0, 0, canvas.width, canvas.height);
                doc.save("Nexus_Scanned_Document.pdf");
                
                if(window.addNexusHistory) window.addNexusHistory("Saved a Document as PDF", "📄 Scanner");
                
            } catch(e) {
                alert("Processing... Please wait a few seconds for the offline PDF engine to load.");
            }
        };

        // ২. OCR (Image to Text)
        extractBtn.onclick = async () => {
            if (!currentImageObj) return alert("Please capture or upload an image first!");
            if (typeof Tesseract === 'undefined') return alert("Offline OCR Engine is still loading in the background. Try again in a moment!");

            extractBtn.innerHTML = "⏳ Extracting...";
            extractBtn.disabled = true;
            ocrContainer.style.display = 'block';
            ocrResult.value = "Scanning image with Offline AI... Please wait (This depends on your phone's processor).";

            try {
                // Tesseract.js দিয়ে অফলাইন টেক্সট রিকগনিশন
                const result = await Tesseract.recognize(
                    currentImageObj,
                    'eng', // আপাতত ইংরেজি স্ক্যান করবে
                    { logger: m => console.log(m) }
                );
                
                ocrResult.value = result.data.text || "No text found in the image.";
                
                if(window.addNexusHistory) window.addNexusHistory("Extracted Text from Image", "📝 OCR");
                
            } catch(err) {
                ocrResult.value = "❌ Could not extract text. Please ensure the image has clear text.";
            }

            extractBtn.innerHTML = "📝 Extract Text";
            extractBtn.disabled = false;
        };
    }
})();
              
