// Image Studio-এর ইনপুট বক্সকে স্মার্ট করার লজিক (Slash Command: /card)
const hookImageStudio = setInterval(() => {
    // Image Studio পেজটি খুঁজছে
    const studioTitle = Array.from(document.querySelectorAll('h1, h2, div')).find(el => 
        el.innerText && (el.innerText.includes('Image Studio') || el.innerText.includes('Image Generator'))
    );
    
    if (studioTitle) {
        const container = studioTitle.parentElement;
        
        // সার্চ বক্স এবং বাটন খুঁজছে
        const inputField = container.querySelector('input[type="text"], textarea');
        const generateBtn = container.querySelector('button');

        // যদি বক্স ও বাটন পাওয়া যায় এবং আগে থেকে হুক করা না থাকে
        if (inputField && generateBtn && !inputField.dataset.cardHooked) {
            inputField.dataset.cardHooked = "true"; // ট্যাগ করে দিলাম যাতে বারবার রান না হয়

            // আমাদের কাস্টম আউটপুট দেখানোর জন্য একটি জায়গা তৈরি করছি
            const customOutput = document.createElement('div');
            customOutput.id = "custom-card-output";
            customOutput.className = "mt-4 text-center w-full flex flex-col items-center";
            // বাটনের ঠিক নিচেই এটি বসিয়ে দিচ্ছি
            generateBtn.parentElement.parentElement.appendChild(customOutput);

            // আগের অরিজিনাল ফাংশনটি সেভ করে রাখছি
            const originalOnClick = generateBtn.onclick;

            // বাটনে নতুন লজিক বসাচ্ছি
            generateBtn.onclick = (e) => {
                const text = inputField.value.trim();
                
                // যদি ইনপুট "/card " দিয়ে শুরু হয়
                if (text.toLowerCase().startsWith('/card ')) {
                    if (e) e.preventDefault(); // আগের কাজ বন্ধ করবে
                    
                    const name = text.substring(6).trim(); // "/card " অংশটুকু বাদ দিয়ে শুধু নামটা নেবে
                    
                    if(!name) {
                        alert("Please type a name! Example: /card Rahul");
                        return;
                    }

                    // লোডিং অ্যানিমেশন
                    customOutput.innerHTML = `<div class="text-pink-400 text-sm font-semibold animate-pulse mt-4">✨ Designing your name card... Please wait...</div>`;
                    
                    // 3D Name Art প্রম্পট
                    const promptText = `Beautiful 3D glowing neon typography of the name "${name}", stunning digital art, vibrant colors, dark background, 8k resolution, highly detailed, masterpiece`;
                    const prompt = encodeURIComponent(promptText);
                    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`;
                    
                    const img = new Image();
                    img.src = imageUrl;
                    img.className = "max-w-full max-h-[300px] rounded-lg shadow-xl border border-pink-500/50 object-contain mt-4";
                    
                    // ইমেজ লোড হলে দেখাবে
                    img.onload = () => {
                        customOutput.innerHTML = '';
                        customOutput.appendChild(img);
                        
                        const actionDiv = document.createElement('div');
                        actionDiv.className = "mt-3";
                        actionDiv.innerHTML = `<a href="${imageUrl}" target="_blank" class="inline-block bg-zinc-800 text-white text-xs px-4 py-2 rounded-lg border border-zinc-700 hover:bg-pink-600 transition">⬇️ Open / Download HD Image</a>`;
                        customOutput.appendChild(actionDiv);
                    };
                    
                    img.onerror = () => {
                        customOutput.innerHTML = '<span class="text-red-400 text-sm">Failed to generate image. Try again.</span>';
                    };

                } else {
                    // যদি /card না থাকে, তবে আগের অরিজিনাল ইমেজ জেনারেটর কাজ করবে
                    customOutput.innerHTML = ''; // আমাদের কাস্টম বক্স ক্লিয়ার করে দেবে
                    if (typeof originalOnClick === 'function') {
                        originalOnClick.apply(generateBtn, arguments);
                    }
                }
            };

            // কীবোর্ডের "Enter" বাটন চাপলেও যেন কাজ করে
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const text = inputField.value.trim();
                    if (text.toLowerCase().startsWith('/card ')) {
                        e.preventDefault();
                        generateBtn.click(); // আমাদের নতুন লজিককে কল করবে
                    }
                }
            });
        }
    }
}, 1000);
              
