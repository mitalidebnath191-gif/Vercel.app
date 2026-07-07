// NEXUS Global AI Chat Engine (Fixed Auto-Placement)
(function() {
    // পিডিএফ এবং এআই-এর জন্য প্রয়োজনীয় লাইব্রেরি লোড করা
    if (!document.getElementById('pdfjs-lib')) {
        const script = document.createElement('script');
        script.id = 'pdfjs-lib';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
        script.onload = () => {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        };
        document.head.appendChild(script);
    }
    if (!document.getElementById('tesseract-lib')) {
        const script2 = document.createElement('script');
        script2.id = 'tesseract-lib';
        script2.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        document.head.appendChild(script2);
    }

    setInterval(() => {
        // বাটনটি আগে থেকেই আছে কি না চেক করছে
        if (document.getElementById('global-ai-chat-btn')) return;

        // Developer Hub অথবা Offline Scanner বাটন খুঁজছে
        const targetNode = document.getElementById('developer-hub-container') || document.getElementById('offline-scanner-btn');
        
        if (targetNode) {
            const chatBtn = document.createElement('button');
            chatBtn.id = 'global-ai-chat-btn';
            
            // বাটনের ডিজাইন (গ্লোবাল চ্যাটের জন্য নিয়ন পিংক/বেগুনি)
            chatBtn.style.cssText = "background:#ec4899; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3); margin-top: 10px; display:flex; align-items:center; justify-content:center; gap:8px;";
            chatBtn.innerHTML = "🌍 Global AI Chat (PDF & Image)";
            
            chatBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                openGlobalChatModal(profileModal);
            };
            
            // কাঙ্ক্ষিত বাটনের ঠিক নিচে বসিয়ে দেবে
            targetNode.parentNode.insertBefore(chatBtn, targetNode.nextSibling);
        }
    }, 1000);

    function openGlobalChatModal(profileModal) {
        let modal = document.getElementById('global-chat-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'global-chat-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 500px; height: 95vh; background: #18181b; border-radius: 16px; border: 1px solid #ec4899; display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; background:#27272a; padding: 15px; border-bottom: 1px solid #3f3f46;">
                    <h2 style="color:#ec4899; font-weight:bold; font-size:17px; margin:0;">🌍 GPT-4o AI Assistant</h2>
                    <button id="close-global-chat" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div id="chat-messages-box" style="flex:1; padding:15px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; background:#0f172a;">
                    <div style="align-self: flex-start; background:#334155; color:#cbd5e1; padding:10px 15px; border-radius:12px; border-bottom-left-radius:2px; font-size:14px; max-width:85%;">
                        Hello! 👋 I am your GPT-4o Assistant. You can chat with me, or use the 📎 button below to upload a <b>PDF</b> or <b>Image</b> for deep analysis!
                    </div>
                </div>
                
                <div style="background:#27272a; padding:10px; display:flex; gap:8px; align-items:center; border-top: 1px solid #3f3f46;">
                    <input type="file" id="chat-file-upload" accept=".pdf, image/*" style="display:none;">
                    <button id="attach-file-btn" style="background:#3f3f46; color:white; border:none; width:40px; height:40px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">📎</button>
                    
                    <input type="text" id="chat-input-msg" placeholder="Type a message..." style="flex:1; background:#18181b; border:1px solid #52525b; color:white; padding:12px; border-radius:20px; font-size:14px; outline:none;">
                    
                    <button id="send-chat-btn" style="background:#ec4899; color:white; border:none; width:40px; height:40px; border-radius:50%; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 10px rgba(236, 72, 153, 0.4);">➤</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-global-chat');
        const fileInput = document.getElementById('chat-file-upload');
        const attachBtn = document.getElementById('attach-file-btn');
        const sendBtn = document.getElementById('send-chat-btn');
        const inputMsg = document.getElementById('chat-input-msg');
        const chatBox = document.getElementById('chat-messages-box');

        let documentContext = "";

        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        function appendMessage(sender, text, isHtml = false) {
            const msgDiv = document.createElement('div');
            msgDiv.style.padding = "10px 15px";
            msgDiv.style.borderRadius = "12px";
            msgDiv.style.fontSize = "14px";
            msgDiv.style.maxWidth = "85%";
            msgDiv.style.lineHeight = "1.4";
            msgDiv.style.wordWrap = "break-word";

            if (sender === 'user') {
                msgDiv.style.alignSelf = "flex-end";
                msgDiv.style.background = "#ec4899";
                msgDiv.style.color = "white";
                msgDiv.style.borderBottomRightRadius = "2px";
                msgDiv.innerText = text;
            } else {
                msgDiv.style.alignSelf = "flex-start";
                msgDiv.style.background = "#334155";
                msgDiv.style.color = "#cbd5e1";
                msgDiv.style.borderBottomLeftRadius = "2px";
                if (isHtml) msgDiv.innerHTML = text;
                else msgDiv.innerText = text;
            }
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        attachBtn.onclick = () => fileInput.click();

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            appendMessage('user', `📎 Uploaded: ${file.name}`);
            appendMessage('ai', `⏳ Processing ${file.name}... Please wait.`);

            try {
                if (file.type === "application/pdf") {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
                    let extractedText = "";
                    
                    const maxPages = Math.min(pdf.numPages, 5); 
                    for (let i = 1; i <= maxPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        extractedText += content.items.map(item => item.str).join(" ") + "\n";
                    }
                    
                    documentContext = extractedText;
                    appendMessage('ai', `✅ PDF processed! I have read the first ${maxPages} pages. Ask me anything about it.`);
                
                } else if (file.type.startsWith("image/")) {
                    if (typeof Tesseract === 'undefined') throw new Error("OCR loading");
                    const result = await Tesseract.recognize(file, 'eng');
                    
                    documentContext = result.data.text;
                    appendMessage('ai', `✅ Image scanned via OCR! I extracted the text. What do you want to know?`);
                } else {
                    appendMessage('ai', `❌ Unsupported file type. Please upload a PDF or Image.`);
                }
            } catch (error) {
                appendMessage('ai', `❌ Failed to read the file. Error: ${error.message}`);
            }
            fileInput.value = ""; 
        };

        sendBtn.onclick = async () => {
            const userText = inputMsg.value.trim();
            if (!userText) return;

            appendMessage('user', userText);
            inputMsg.value = "";
            appendMessage('ai', "⏳ GPT-4o is thinking...");

            let fullPrompt = userText;
            if (documentContext.trim() !== "") {
                fullPrompt = `You are GPT-4o. Document Context: ${documentContext.substring(0, 3000)}\n\nUser Question: ${userText}\n\nAnswer precisely based on the document provided.`;
            }

            try {
                const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai`);
                const aiResponseText = await response.text();

                chatBox.removeChild(chatBox.lastChild);
                
                let formattedText = aiResponseText
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                    .replace(/
