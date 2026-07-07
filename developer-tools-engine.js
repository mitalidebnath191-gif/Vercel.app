// NEXUS Developer Only AI Tools Hub (With Advanced GPT-4o Code Generator)
(function() {
    setInterval(() => {
        const scannerBtn = document.getElementById('offline-scanner-btn');
        
        if (scannerBtn && !document.getElementById('developer-hub-container')) {
            const container = document.createElement('div');
            container.id = 'developer-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'developer-hub-btn';
            toggleBtn.style.cssText = "background:#1d4ed8; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);";
            toggleBtn.innerHTML = "👨‍💻 Developer Only";
            
            const listDiv = document.createElement('div');
            listDiv.id = 'developer-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            const tools = [
                { name: "AI Grammar Checker", url: "https://quillbot.com/grammar-check", icon: "✅", type: "external" },
                { name: "Advanced AI Coder (GPT-4o)", action: "open_code_modal", icon: "💻", type: "internal" },
                { name: "AI Story Writer", url: "https://rytr.me/", icon: "📖", type: "external" },
                { name: "AI Email Writer", url: "https://hyperwriteai.com/tools/email-writer", icon: "📧", type: "external" }
            ];
            
            tools.forEach(tool => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#60a5fa; border:1px solid #60a5fa; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left; display:flex; gap:8px; align-items:center;";
                btn.innerHTML = `<span>${tool.icon}</span> <span>${tool.name}</span>`;
                
                btn.onclick = () => {
                    if (tool.type === "external") {
                        if(window.addNexusHistory) window.addNexusHistory(`Opened ${tool.name}`, "👨‍💻 Dev Tools");
                        window.open(tool.url, "_blank");
                    } else if (tool.type === "internal") {
                        const profileModal = document.getElementById('profile-modal');
                        if(profileModal) profileModal.style.display = 'none';
                        openAiCodeGeneratorModal(profileModal);
                    }
                };
                
                listDiv.appendChild(btn);
            });
            
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "👨‍💻 Hide Developer Tools" : "👨‍💻 Developer Only";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            
            scannerBtn.parentNode.insertBefore(container, scannerBtn.nextSibling);
        }
    }, 1000);

    // প্রো-লেভেল AI Code Generator উইন্ডো
    function openAiCodeGeneratorModal(profileModal) {
        let modal = document.getElementById('ai-code-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'ai-code-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 480px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #3b82f6; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box; max-height: 95vh;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#3b82f6; font-weight:bold; font-size:17px; margin:0;">💻 GPT-4o Code Generator</h2>
                    <button id="close-aicode-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="width:100%;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">What do you want to build?</label>
                    <textarea id="ai-prompt-input" placeholder="e.g. Write a React component for a login page..." style="width:100%; height:70px; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:14px; outline:none; resize:none; box-sizing:border-box;"></textarea>
                </div>
                
                <button id="generate-code-btn" style="background:#3b82f6; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">🚀 Generate Code</button>

                <div style="width:100%; display:flex; flex-direction:column; flex:1; min-height: 250px; max-height: 400px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <label style="color:#34d399; font-size:12px; font-weight:bold;">AI Output:</label>
                        <button id="copy-code-btn" style="background:#10b981; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; cursor:pointer; display:none; font-weight:bold;">📋 Copy All</button>
                    </div>
                    <div id="ai-code-output" style="width:100%; flex:1; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:12px; border-radius:8px; font-size:13.5px; font-family: monospace; outline:none; overflow-y:auto; box-sizing:border-box;">Ready to code. Just ask!</div>
                </div>
                
                <p style="color:#71717a; font-size:10px; margin:0; text-align:center;">Powered by Advanced GPT-4o Model (Optimized for Software Engineering).</p>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-aicode-btn');
        const genBtn = document.getElementById('generate-code-btn');
        const promptInput = document.getElementById('ai-prompt-input');
        const codeOutput = document.getElementById('ai-code-output');
        const copyBtn = document.getElementById('copy-code-btn');

        let rawAiResponse = ""; // কপি করার জন্য অরিজিনাল টেক্সট সেভ রাখার ভেরিয়েবল

        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        // ফুল কোড কপি করার লজিক
        copyBtn.onclick = () => {
            if (rawAiResponse) {
                navigator.clipboard.writeText(rawAiResponse);
                copyBtn.innerHTML = "✅ Copied!";
                setTimeout(() => copyBtn.innerHTML = "📋 Copy All", 2000);
            }
        };

        // মার্কডাউন কোডকে সুন্দর বক্সে কনভার্ট করার ফাংশন (VS Code স্টাইল)
        function formatCodeOutput(text) {
            // HTML ট্যাগ ব্লক করা যাতে কোড ভেঙে না যায়
            let escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            // ব্যাকটিক (```) দিয়ে ঘেরা কোডগুলোকে প্রফেশনাল বক্সে রূপান্তর করা
            escapedText = escapedText.replace(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g, (match, lang, code) => {
                return `<div style="background:#0f172a; border: 1px solid #475569; border-radius:6px; margin: 12px 0; overflow:hidden;">
                            <div style="background:#334155; color:#cbd5e1; font-size:11px; padding:4px 10px; font-weight:bold; text-transform:uppercase;">${lang || 'CODE'}</div>
                            <div style="padding:10px; overflow-x:auto;">
                                <pre style="margin:0;"><code style="color:#38bdf8; font-family:monospace;">${code}</code></pre>
                            </div>
                        </div>`;
            });
            // সাধারণ নিউলাইনগুলোকে <br> তে রূপান্তর করা
            return escapedText.replace(/\n/g, '<br>');
        }

        // AI কল করার মেইন লজিক
        genBtn.onclick = async () => {
            const promptText = promptInput.value.trim();
            if (!promptText) {
                alert("Please describe the code you want to generate!");
                return;
            }

            genBtn.innerHTML = "⏳ AI is Coding...";
            genBtn.disabled = true;
            codeOutput.style.color = "#94a3b8";
            codeOutput.innerHTML = "Connecting to GPT-4o Server... Please wait.";
            copyBtn.style.display = 'none';

            // AI-কে কড়া নির্দেশ দেওয়া যাতে সে একদম পারফেক্ট কোড দেয়
            const systemPrompt = "You are a Senior Software Engineer. Provide strictly accurate, clean, and optimized code. Always use markdown formatting (```language ... ```) for code blocks. Do not talk too much, just give the code and short explanations.";
            const fullPrompt = `${systemPrompt} User Request: ${promptText}`;

            try {
                // Pollinations API এর মাধ্যমে স্পেশাল GPT-4o / OpenAI মডেল ব্যবহার করা হচ্ছে (?model=openai)
                const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai`);
                
                if (!response.ok) throw new Error("API Network Error");
                
                rawAiResponse = await response.text(); // অরিজিনাল টেক্সট সেভ করা হলো
                
                codeOutput.style.color = "#cbd5e1"; // সাধারণ লেখার কালার
                codeOutput.innerHTML = formatCodeOutput(rawAiResponse); // কোডটিকে সুন্দর ডিজাইনে কনভার্ট করে দেখানো
                copyBtn.style.display = 'block';

                if(window.addNexusHistory) window.addNexusHistory("Used Advanced AI Coder", "💻 Developer Tools");
                
            } catch (error) {
                codeOutput.style.color = "#ef4444";
                codeOutput.innerHTML = "❌ Failed to generate code. Please check your internet connection.";
            }

            genBtn.innerHTML = "🚀 Generate Code";
            genBtn.disabled = false;
        };
    }
})();
                  
