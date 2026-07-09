// NEXUS AI Career & Media Tools Hub (Placed under Student Tools)
(function() {
    setInterval(() => {
        // বাটনটি আগে থেকেই আছে কি না চেক করছে
        if (document.getElementById('ai-pro-hub-container')) return;

        // Student Hub বাটনটি খুঁজছে
        const studentHub = document.getElementById('student-hub-container');
        
        // যদি Student Hub থাকে, তবে তার নিচে এটি তৈরি করবে
        if (studentHub) {
            const container = document.createElement('div');
            container.id = 'ai-pro-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            // Show/Hide বাটন (প্রো/ক্যারিয়ার থিমের জন্য সুন্দর রোজ-রেড/লালচে-গোলাপি কালার)
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'ai-pro-hub-btn';
            toggleBtn.style.cssText = "background:#f43f5e; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);";
            toggleBtn.innerHTML = "💼 AI Career & Media Tools";
            
            // লিস্ট কন্টেইনার
            const listDiv = document.createElement('div');
            listDiv.id = 'ai-pro-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            // প্রো টুলস লিস্ট
            const tools = [
                { name: "AI Resume Builder (FlowCV)", url: "https://flowcv.com/", icon: "📄", type: "external" },
                { name: "AI Voice Clone (ElevenLabs)", url: "https://elevenlabs.io/", icon: "🎙️", type: "external" },
                { name: "In-App AI Summarizer", action: "open_summarizer_modal", icon: "✂️", type: "internal" }
            ];
            
            tools.forEach(tool => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#fb7185; border:1px solid #fb7185; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left; display:flex; gap:8px; align-items:center;";
                btn.innerHTML = `<span>${tool.icon}</span> <span>${tool.name}</span>`;
                
                btn.onclick = () => {
                    if (tool.type === "external") {
                        if(window.addNexusHistory) window.addNexusHistory(`Opened ${tool.name}`, "💼 Career Tools");
                        window.open(tool.url, "_blank");
                    } else if (tool.type === "internal") {
                        const profileModal = document.getElementById('profile-modal');
                        if(profileModal) profileModal.style.display = 'none';
                        openSummarizerModal(profileModal);
                    }
                };
                
                listDiv.appendChild(btn);
            });
            
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "💼 Hide Career Tools" : "💼 AI Career & Media Tools";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            
            // Student Hub এর ঠিক নিচে বসিয়ে দেবে
            studentHub.parentNode.insertBefore(container, studentHub.nextSibling);
        }
    }, 1000);

    // In-App AI Summarizer উইন্ডো
    function openSummarizerModal(profileModal) {
        let modal = document.getElementById('ai-summarizer-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'ai-summarizer-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 480px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #f43f5e; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box; max-height: 95vh;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#f43f5e; font-weight:bold; font-size:17px; margin:0;">✂️ AI Text Summarizer</h2>
                    <button id="close-summarizer-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="width:100%;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Paste long text or article here:</label>
                    <textarea id="summarizer-input" placeholder="e.g. Paste a long history chapter or science article..." style="width:100%; height:120px; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:14px; outline:none; resize:none; box-sizing:border-box;"></textarea>
                </div>
                
                <div style="display:flex; gap:10px; width:100%;">
                    <button id="summarize-short-btn" style="flex:1; background:#f43f5e; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);">📝 Short Summary</button>
                    <button id="summarize-bullet-btn" style="flex:1; background:#e11d48; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);">📋 Bullet Points</button>
                </div>

                <div style="width:100%; display:flex; flex-direction:column; flex:1; min-height: 200px; max-height: 300px; margin-top: 5px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <label style="color:#fb7185; font-size:12px; font-weight:bold;">AI Output:</label>
                        <button id="copy-summary-btn" style="background:#10b981; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; cursor:pointer; display:none;">📋 Copy</button>
                    </div>
                    <div id="summarizer-output-box" style="width:100%; flex:1; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:12px; border-radius:8px; font-size:14px; outline:none; overflow-y:auto; box-sizing:border-box;">Paste text above and click a button to summarize!</div>
                </div>
                
                <p style="color:#71717a; font-size:10px; margin:0; text-align:center;">Powered by GPT-4o. Best for reading long essays and notes quickly.</p>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-summarizer-btn');
        const shortBtn = document.getElementById('summarize-short-btn');
        const bulletBtn = document.getElementById('summarize-bullet-btn');
        const textInput = document.getElementById('summarizer-input');
        const outputBox = document.getElementById('summarizer-output-box');
        const copyBtn = document.getElementById('copy-summary-btn');

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

        async function processSummary(mode) {
            const rawText = textInput.value.trim();
            if (!rawText) {
                alert("Please paste some text to summarize!");
                return;
            }

            shortBtn.disabled = true;
            bulletBtn.disabled = true;
            outputBox.style.color = "#94a3b8";
            outputBox.innerHTML = "⏳ AI is reading and summarizing... Please wait.";
            copyBtn.style.display = 'none';

            let systemPrompt = "";
            if (mode === 'short') {
                systemPrompt = "You are an expert summarizer. Summarize the following text into a short, concise paragraph. Keep the core meaning intact.";
            } else {
                systemPrompt = "You are an expert summarizer. Extract the key points from the following text and present them as a clean list of bullet points.";
            }

            const fullPrompt = `${systemPrompt}\n\nText to summarize:\n${rawText}`;

            try {
                const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai`);
                if (!response.ok) throw new Error("Failed to connect to AI server.");
                
                generatedText = await response.text();
                
                let formattedText = generatedText
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<b style="color:#fb7185;">$1</b>');

                outputBox.style.color = "#cbd5e1";
                outputBox.innerHTML = formattedText;
                copyBtn.style.display = 'block';

                if(window.addNexusHistory) window.addNexusHistory(`Used AI Summarizer (${mode})`, "✂️ Media Tools");

            } catch (error) {
                outputBox.style.color = "#ef4444";
                outputBox.innerHTML = `❌ Error: Could not connect to AI. Check your internet connection.`;
            }

            shortBtn.disabled = false;
            bulletBtn.disabled = false;
        }

        shortBtn.onclick = () => processSummary('short');
        bulletBtn.onclick = () => processSummary('bullet');
    }
})();
