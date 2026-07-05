// NEXUS GPT-4 Injection Engine (Hidden Command Mode)
(function() {
    let isGpt4Active = false;

    // ১. মেইন স্ক্রিন থেকে বেরিয়ে গেলে GPT-4 অটোমেটিক বন্ধ করার লজিক
    setInterval(() => {
        // চেক করছে আমরা 'AI Chat' পেজে আছি কি না
        const isChatPage = Array.from(document.querySelectorAll('div, h2, h1, span')).some(el => 
            el.innerText && el.innerText.trim() === 'AI Chat' && el.offsetParent !== null
        );
        
        // যদি চ্যাট পেজে না থাকি এবং GPT-4 অন থাকে, তবে তা বন্ধ করে দেবে (Normal Mode)
        if (!isChatPage && isGpt4Active) {
            isGpt4Active = false;
            console.log("Left chat screen. GPT-4 mode deactivated auto.");
        }
    }, 1000);

    // ২. গ্লোবালি ইউজারের ইনপুট ট্র্যাক করা (যাতে নরমাল AI-কে থামানো যায়)
    window.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' && e.target.tagName.match(/INPUT|TEXTAREA/i)) {
            await checkGptCommand(e, e.target);
        }
    }, true); // 'true' দেওয়ার কারণে এটি সবার আগে ইভেন্ট ক্যাচ করবে

    window.addEventListener('click', async (e) => {
        // সেন্ড বাটনে ক্লিক করলে
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const btn = e.target.closest('button');
            if (btn && (btn.innerText.includes('Send') || btn.innerHTML.includes('Send') || btn.innerHTML.includes('svg'))) {
                const input = document.querySelector('input[type="text"], textarea');
                if (input) await checkGptCommand(e, input);
            }
        }
    }, true);

    // ৩. কমান্ড চেকিং এবং API কলিং
    async function checkGptCommand(e, inputEl) {
        const text = inputEl.value.trim();
        if (!text) return;

        // অ্যাক্টিভেশন কমান্ড
        if (text.toLowerCase() === '/chat gpt') {
            e.stopPropagation(); // নরমাল AI-কে থামিয়ে দেওয়া হলো
            e.preventDefault();
            isGpt4Active = true;
            inputEl.value = '';
            showCustomMessage('🟢 <b>GPT-4 Mode Activated!</b><br>You are now chatting with advanced AI. (It will auto-reset if you leave this page).', 'system');
            return;
        }

        // ম্যানুয়াল ডিঅ্যাক্টিভেশন কমান্ড
        if (text.toLowerCase() === '/normal') {
            e.stopPropagation();
            e.preventDefault();
            isGpt4Active = false;
            inputEl.value = '';
            showCustomMessage('🔴 <b>GPT-4 Mode Deactivated.</b><br>Back to Normal Nexus AI.', 'system');
            return;
        }

        // যদি GPT-4 মোড অন থাকে, তবে ম্যাসেজটি হাইজ্যাক করে RapidAPI তে পাঠানো
        if (isGpt4Active) {
            e.stopPropagation(); 
            e.preventDefault();
            
            const userMsg = text;
            inputEl.value = '';
            
            // ইউজারের মেসেজ স্ক্রিনে দেখানো
            showCustomMessage(userMsg, 'user');
            
            // লোডিং বাবল দেখানো
            const loadingId = 'gpt-loading-' + Date.now();
            showCustomMessage('<span style="color:#10b981; animation: pulse 1s infinite;">⏳ GPT-4 is generating response...</span>', 'bot', loadingId);

            try {
                // আপনার দেওয়া RapidAPI 
                const response = await fetch('https://chatgpt-42.p.rapidapi.com/conversationgpt4-2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
                        'x-rapidapi-key': 'bae47b7f91msh5916b9a175c7aeap1387ddjsncec825a93b2a'
                    },
                    body: JSON.stringify({
                        messages: [{ role: "user", content: userMsg }],
                        web_access: false
                    })
                });

                const data = await response.json();
                
                // API-এর উত্তর বের করার লজিক (Error Handle সহ)
                let botReply = "⚠️ Failed to get answer.";
                
                if (data.message && data.message.includes("exceeded")) botReply = "❌ API Limit Exceeded. Update your key.";
                else if (data.result) botReply = data.result;
                else if (data.response) botReply = data.response;
                else if (data.choices && data.choices.length > 0) botReply = data.choices[0].message.content;
                else if (data.answer) botReply = data.answer;
                else if (typeof data === 'string') botReply = data;

                // লোডিং মেসেজটি সরিয়ে আসল উত্তর বসিয়ে দেওয়া
                updateCustomMessage(loadingId, botReply);

                // হিস্ট্রি সেভ করা
                if(window.addNexusHistory) window.addNexusHistory(`Asked GPT-4: ${userMsg.substring(0,20)}...`, "🧠 AI Chat");

            } catch (err) {
                updateCustomMessage(loadingId, '⚠️ <b>Network Error:</b> ' + err.message);
            }
        }
    }

    // ৪. ডাইনামিক UI ইনজেকশন (চ্যাটের ভেতরে মেসেজ বসানো)
    function getChatContainer() {
        // চ্যাট বক্স খুঁজে বের করা (যেখানে মেসেজগুলো স্ক্রল হয়)
        const divs = Array.from(document.querySelectorAll('div'));
        let chatBox = divs.find(d => window.getComputedStyle(d).overflowY !== 'visible' && d.clientHeight > 200 && d.scrollHeight > d.clientHeight);
        if (!chatBox) chatBox = divs.find(d => d.clientHeight > 300);
        return chatBox || document.body; 
    }

    function showCustomMessage(html, type, id = null) {
        const chatContainer = getChatContainer();
        const wrapper = document.createElement('div');
        wrapper.style.cssText = "display: flex; flex-direction: column; width: 100%; margin-bottom: 10px;";
        
        const bubble = document.createElement('div');
        if (id) bubble.id = id;
        
        // ডিজাইনের স্টাইল
        bubble.style.cssText = "padding: 12px 16px; border-radius: 12px; max-width: 85%; font-size: 14.5px; line-height: 1.5; font-family: sans-serif; animation: fadeIn 0.3s ease; word-break: break-word;";
        
        if (type === 'user') {
            bubble.style.background = "#3b82f6"; // নীল 
            bubble.style.color = "white";
            bubble.style.alignSelf = "flex-end";
            bubble.style.borderBottomRightRadius = "2px";
            bubble.style.boxShadow = "0 4px 10px rgba(59, 130, 246, 0.2)";
        } else if (type === 'bot') {
            bubble.style.background = "#27272a"; // ডার্ক
            bubble.style.color = "white";
            bubble.style.border = "1px solid #10b981"; // সবুজ বর্ডার (GPT-4 বোঝাতে)
            bubble.style.alignSelf = "flex-start";
            bubble.style.borderBottomLeftRadius = "2px";
            bubble.style.boxShadow = "0 4px 10px rgba(16, 185, 129, 0.1)";
        } else {
            // সিস্টেম অ্যালার্ট
            bubble.style.background = "rgba(16, 185, 129, 0.2)";
            bubble.style.color = "#10b981";
            bubble.style.border = "1px solid #10b981";
            bubble.style.textAlign = "center";
            bubble.style.alignSelf = "center";
            bubble.style.fontWeight = "bold";
            bubble.style.fontSize = "12px";
        }
        
        bubble.innerHTML = html;
        wrapper.appendChild(bubble);
        chatContainer.appendChild(wrapper);
        
        // অটো স্ক্রল ডাউন
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function updateCustomMessage(id, text) {
        const el = document.getElementById(id);
        if (el) {
            // Markdown ফরম্যাট (যেমন: **বোল্ড** বা \n) ঠিক করে HTML এ রূপান্তর করা
            const formattedHtml = text
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                .replace(/\*(.*?)\*/g, '<i>$1</i>')
                .replace(/`(.*?)`/g, '<span style="background:#3f3f46; padding:2px 5px; border-radius:4px; font-family:monospace;">$1</span>');
            
            el.innerHTML = formattedHtml;
            getChatContainer().scrollTop = getChatContainer().scrollHeight;
        }
    }
})();
            
