// NEXUS Student Tools & Education Hub (Placed under Developer Tools)
(function() {
    // OCR লাইব্রেরি লোড করা (যদি আগে থেকে লোড না থাকে)
    if (!document.getElementById('tesseract-lib')) {
        const script = document.createElement('script');
        script.id = 'tesseract-lib';
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        document.head.appendChild(script);
    }

    setInterval(() => {
        // বাটনটি আগে থেকেই আছে কি না চেক করছে
        if (document.getElementById('student-hub-container')) return;

        // Developer Hub বাটনটি খুঁজছে
        const devHub = document.getElementById('developer-hub-container');
        
        // যদি Developer Hub থাকে, তবে তার নিচে এটি তৈরি করবে
        if (devHub) {
            const container = document.createElement('div');
            container.id = 'student-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            // Show/Hide বাটন (স্টুডেন্ট থিমের জন্য সুন্দর টিল/সায়ান কালার)
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'student-hub-btn';
            toggleBtn.style.cssText = "background:#0d9488; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);";
            toggleBtn.innerHTML = "🎓 Student & Study Tools";
            
            // লিস্ট কন্টেইনার
            const listDiv = document.createElement('div');
            listDiv.id = 'student-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            // স্টুডেন্ট টুলস লিস্ট
            const tools = [
                { name: "Formula Book (Math & Sci)", url: "https://www.cuemath.com/math-formulas/", icon: "📐", type: "external" },
                { name: "Interactive Periodic Table", url: "https://ptable.com/", icon: "🧪", type: "external" },
                { name: "Microsoft Math Solver", url: "https://mathsolver.microsoft.com/en", icon: "➗", type: "external" },
                { name: "AI Photo to MCQ Generator", action: "open_mcq_modal", icon: "📝", type: "internal" }
            ];
            
            tools.forEach(tool => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#2dd4bf; border:1px solid #2dd4bf; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left; display:flex; gap:8px; align-items:center;";
                btn.innerHTML = `<span>${tool.icon}</span> <span>${tool.name}</span>`;
                
                btn.onclick = () => {
                    if (tool.type === "external") {
                        if(window.addNexusHistory) window.addNexusHistory(`Opened ${tool.name}`, "🎓 Education");
                        window.open(tool.url, "_blank");
                    } else if (tool.type === "internal") {
                        const profileModal = document.getElementById('profile-modal');
                        if(profileModal) profileModal.style.display = 'none';
                        openPhotoToMcqModal(profileModal);
                    }
                };
                
                listDiv.appendChild(btn);
            });
            
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "🎓 Hide Study Tools" : "🎓 Student & Study Tools";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            
            // Developer Hub এর ঠিক নিচে বসিয়ে দেবে
            devHub.parentNode.insertBefore(container, devHub.nextSibling);
        }
    }, 1000);

    // AI Photo to MCQ Generator উইন্ডো
    function openPhotoToMcqModal(profileModal) {
        let modal = document.getElementById('mcq-generator-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'mcq-generator-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 450px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #0d9488; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box; max-height: 95vh;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#2dd4bf; font-weight:bold; font-size:17px; margin:0;">📝 AI Photo to MCQ</h2>
                    <button id="close-mcq-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="width:100%;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Take a photo of your book/notes:</label>
                    <input type="file" id="mcq-image-upload" accept="image/*" capture="environment" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:13px; outline:none; cursor:pointer;">
                </div>
                
                <button id="generate-mcq-btn" style="background:#0d9488; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);">🚀 Scan & Generate MCQs</button>

                <div style="width:100%; display:flex; flex-direction:column; flex:1; min-height: 250px; max-height: 400px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <label style="color:#2dd4bf; font-size:12px; font-weight:bold;">Generated MCQs:</label>
                        <button id="copy-mcq-btn" style="background:#10b981; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; cursor:pointer; display:none;">📋 Copy</button>
                    </div>
                    <div id="mcq-output-box" style="width:100%; flex:1; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:12px; border-radius:8px; font-size:14px; outline:none; overflow-y:auto; box-sizing:border-box;">Upload an image to start generating MCQs!</div>
                </div>
                
                <p style="color:#71717a; font-size:10px; margin:0; text-align:center;">Powered by Tesseract OCR & GPT-4o. Best for creating practice tests.</p>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-mcq-btn');
        const generateBtn = document.getElementById('generate-mcq-btn');
        const fileInput = document.getElementById('mcq-image-upload');
        const outputBox = document.getElementById('mcq-output-box');
        const copyBtn = document.getElementById('copy-mcq-btn');

        let generatedText = "";

        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        copyBtn.onclick = () => {
            if (generatedText) {
                navigator.clipboard.writeText(generatedText);
                copyBtn.innerHTML = "✅ Copied!";
                setTimeout(() => copyBtn.innerHTML = "📋 Copy", 2000);
            }
        };

        generateBtn.onclick = async () => {
            const file = fileInput.files[0];
            if (!file) {
                alert("Please take a photo or upload an image first!");
                return;
            }

            if (typeof Tesseract === 'undefined') {
                alert("AI Scanner Engine is still loading in background. Please wait a few seconds.");
                return;
            }

            generateBtn.innerHTML = "📷 Scanning Image (OCR)...";
            generateBtn.disabled = true;
            outputBox.style.color = "#94a3b8";
            outputBox.innerHTML = "Extracting text from the image... This may take a few seconds.";
            copyBtn.style.display = 'none';

            try {
                // ১. ছবি থেকে টেক্সট বের করা (OCR)
                const result = await Tesseract.recognize(file, 'eng');
                const extractedText = result.data.text.trim();
                
                if (extractedText.length < 10) {
                    throw new Error("No clear text found in the image. Please take a clearer photo.");
                }

                generateBtn.innerHTML = "🧠 Generating MCQs (GPT-4o)...";
                outputBox.innerHTML = "Text extracted successfully! Now AI is creating MCQs...";

                // ২. GPT-4o কে দিয়ে টেক্সট থেকে MCQ বানানো
                const systemPrompt = "You are an expert teacher. Based on the provided text, create 5 highly relevant Multiple Choice Questions (MCQs). Format each question clearly with Options A, B, C, D and provide the correct answer below each question. Keep the formatting clean.";
                const fullPrompt = `${systemPrompt}\n\nExtracted Text: ${extractedText}`;

                const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai`);
                if (!response.ok) throw new Error("Failed to connect to AI server.");
                
                generatedText = await response.text();
                
                // সুন্দর ডিজাইনে আউটপুট দেখানো
                let formattedText = generatedText
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<b style="color:#2dd4bf;">$1</b>');

                outputBox.style.color = "#cbd5e1";
                outputBox.innerHTML = formattedText;
                copyBtn.style.display = 'block';

                if(window.addNexusHistory) window.addNexusHistory("Generated MCQs from Photo", "📝 Study Tools");

            } catch (error) {
                outputBox.style.color = "#ef4444";
                outputBox.innerHTML = `❌ Error: ${error.message}`;
            }

            generateBtn.innerHTML = "🚀 Scan & Generate MCQs";
            generateBtn.disabled = false;
        };
    }
})();
