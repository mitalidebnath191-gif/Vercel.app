// NEXUS Global Language Translator Engine (Standalone File)
(function() {
    setInterval(() => {
        // Password Breach Checker baটনটি খুঁজছে
        const breachBtn = document.getElementById('password-breach-btn');
        
        // it breach button thake kintu translator button na thake
        if (breachBtn && !document.getElementById('nexus-translator-btn')) {
            const transBtn = document.createElement('button');
            transBtn.id = 'nexus-translator-btn';
            
            // Button design (Translator theme er jonno shundor Cyan/Teal color)
            transBtn.style.cssText = "background:#06b6d4; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3); margin-top: 10px;";
            transBtn.innerHTML = "🌐 Language Translator";
            
            // Click korle main profile pop-up lukeiye translator modal khulbe
            transBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                openTranslatorModal(profileModal);
            };
            
            breachBtn.parentNode.appendChild(transBtn);
        }
    }, 1000);

    // Translator Modal Window
    function openTranslatorModal(profileModal) {
        let modal = document.getElementById('translator-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'translator-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 390px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #06b6d4; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#06b6d4; font-weight:bold; font-size:17px; margin:0;">🌐 Nexus Translator</h2>
                    <button id="close-translator-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="display:flex; gap:10px; width:100%;">
                    <div style="flex:1;">
                        <label style="color:#a1a1aa; font-size:11px; display:block; margin-bottom:4px;">From:</label>
                        <select id="source-lang" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:8px; border-radius:6px; font-size:13px; outline:none; cursor:pointer;">
                            <option value="auto">🔍 Auto Detect</option>
                            <option value="en">English</option>
                            <option value="bn">Bengali (বাংলা)</option>
                            <option value="hi">Hindi (हिन्दी)</option>
                            <option value="ar">Arabic (العربية)</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="ur">Urdu</option>
                            <option value="zh">Chinese</option>
                        </select>
                    </div>
                    <div style="flex:1;">
                        <label style="color:#a1a1aa; font-size:11px; display:block; margin-bottom:4px;">To:</label>
                        <select id="target-lang" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:8px; border-radius:6px; font-size:13px; outline:none; cursor:pointer;">
                            <option value="bn" selected>Bengali (বাংলা)</option>
                            <option value="en">English</option>
                            <option value="hi">Hindi (हिन्दी)</option>
                            <option value="ar">Arabic (العربية)</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="ur">Urdu</option>
                            <option value="ja">Japanese</option>
                        </select>
                    </div>
                </div>

                <div style="width:100%;">
                    <textarea id="trans-input-text" placeholder="Type or paste text here to translate..." style="width:100%; height:80px; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:14px; outline:none; resize:none; box-sizing:border-box;"></textarea>
                </div>
                
                <button id="trigger-translate-btn" style="background:#06b6d4; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px;">Translate Text</button>

                <div style="width:100%;">
                    <label style="color:#a1a1aa; font-size:11px; display:block; margin-bottom:4px;">Translation Result:</label>
                    <textarea id="trans-output-text" readonly placeholder="Translation will appear here..." style="width:100%; height:90px; background:#1f2937; border:1px solid #374151; color:#4ade80; padding:10px; border-radius:8px; font-size:14px; outline:none; resize:none; box-sizing:border-box; font-weight:500;"></textarea>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-translator-btn');
        const transBtn = document.getElementById('trigger-translate-btn');
        const inputText = document.getElementById('trans-input-text');
        const outputText = document.getElementById('trans-output-text');
        const sourceLang = document.getElementById('source-lang');
        const targetLang = document.getElementById('target-lang');

        // Modal close korle main pop-up firye anbe
        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        // Main Translation Fetch Logic
        transBtn.onclick = async () => {
            const text = inputText.value.trim();
            if (!text) {
                alert("Please enter some text to translate!");
                return;
            }

            transBtn.innerHTML = "⏳ Translating...";
            transBtn.disabled = true;

            const sl = sourceLang.value;
            const tl = targetLang.value;

            // Google free translation endpoints API trick
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Translation failed");
                
                const data = await response.json();
                
                // Sob line eksathe meshano (handles multi-sentence translations)
                let translatedText = data[0].map(item => item[0]).join('');
                
                outputText.value = translatedText;
                
                if(window.addNexusHistory) window.addNexusHistory("Translated Text", "🌐 Translator");

            } catch (error) {
                outputText.value = "⚠️ Error: Could not complete translation. Check internet connection.";
            } finally {
                transBtn.innerHTML = "Translate Text";
                transBtn.disabled = false;
            }
        };
    }
})();
          
