// Image Generator-এর ইনপুট বক্সকে স্মার্ট করার লজিক (/card কমান্ড)
const hookImageGenerator = setInterval(() => {
    // "Image Generator" পেজে আছেন কিনা তা নিশ্চিত হওয়া
    const isGeneratorPage = Array.from(document.querySelectorAll('h1, h2, h3, div')).some(el =>
        el.innerText && el.innerText.includes('Image Generator')
    );

    if (isGeneratorPage) {
        // ইনপুট বক্সটি খুঁজছে (যেখানে Futuristic city লেখা থাকে)
        const inputField = document.querySelector('input[type="text"], input[placeholder*="Futuristic"]');
        
        // জেনারেট বাটনটি খুঁজছে
        const generateBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('Gene')); 

        if (inputField && generateBtn && !inputField.dataset.cardHooked) {
            inputField.dataset.cardHooked = "true"; // একবারই রান করার জন্য ট্যাগ

            // আউটপুট দেখানোর জন্য একটি কাস্টম জায়গা (ইনপুটের ঠিক নিচে তৈরি হবে)
            const customOutput = document.createElement('div');
            customOutput.id = "custom-card-output";
            customOutput.style.cssText = "margin-top: 20px; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 50;";

            // ইনপুট এবং বাটনের মেইন কন্টেনারের ঠিক নিচে আমাদের আউটপুট বক্স বসিয়ে দিচ্ছি
            const inputContainer = inputField.parentElement;
            inputContainer.parentElement.insertBefore(customOutput, inputContainer.nextSibling);

            // ১. বাটনে ক্লিকের উপর কড়া নজরদারি (Capture Phase)
            window.addEventListener('click', (e) => {
                const checkPage = Array.from(document.querySelectorAll('h1, h2, h3, div')).some(el => el.innerText && el.innerText.includes('Image Generator'));
                if (!checkPage) return;

                const clickedBtn = e.target.closest('button');
                // যদি ক্লিক করা বাটনটি "Generate" হয়
                if (clickedBtn && clickedBtn.innerText.includes('Gene')) { 
                    const text = inputField.value.trim();

                    if (text.toLowerCase().startsWith('/card ')) {
                        e.preventDefault();
                        e.stopPropagation(); // আসল অ্যাপের কাজ জোর করে থামিয়ে দেবে

                        const name = text.substring(6).trim();
                        generateNameArtCard(name, customOutput);
                    } else {
                        customOutput.innerHTML = ''; // অন্য কিছু লিখলে আমাদের বক্স ক্লিয়ার থাকবে
                    }
                }
            }, true); // true = Capture Phase (সবার আগে কাজ করবে)

            // ২. কীবোর্ডের Enter বাটনের উপর নজরদারি (Capture Phase)
            inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const text = inputField.value.trim();

                    if (text.toLowerCase().startsWith('/card ')) {
                        e.preventDefault();
                        e.stopPropagation(); // আসল অ্যাপের কাজ থামিয়ে দেবে

                        const name = text.substring(6).trim();
                        generateNameArtCard(name, customOutput);
                    } else {
                        customOutput.innerHTML = '';
                    }
                }
            }, true);
        }
    }
}, 1000);

// ইমেজ তৈরি করার ফাংশন
function generateNameArtCard(name, outputDiv) {
    if(!name) {
        alert("Please type a name! Example: /card Rahul");
        return;
    }

    // লোডিং ডিজাইন (আপনার অ্যাপের ডার্ক থিমের সাথে মিলিয়ে)
    outputDiv.innerHTML = `<div style="color:#d946ef; font-size:16px; font-weight:bold; padding:20px; text-align:center; animation: pulse 2s infinite;">✨ Designing 3D Art for "${name}"... Please wait...</div>`;

    // 3D Name Art প্রম্পট
    const promptText = `Beautiful 3D glowing neon typography of the name "${name}", stunning digital art, vibrant colors, dark background, 8k resolution, highly detailed, masterpiece`;
    const prompt = encodeURIComponent(promptText);
    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`;

    const img = new Image();
    img.src = imageUrl;
    img.style.cssText = "max-width: 100%; max-height: 320px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.7); border: 2px solid #d946ef; margin-top: 10px; object-fit: contain; background: #111;";

    // ইমেজ লোড হলে দেখাবে
    img.onload = () => {
        outputDiv.innerHTML = '';
        outputDiv.appendChild(img);

        // সুন্দর একটি ডাউনলোড বাটন
        const actionDiv = document.createElement('div');
        actionDiv.style.marginTop = "15px";
        actionDiv.innerHTML = `<a href="${imageUrl}" target="_blank" style="display:inline-block; background:#d946ef; color:white; font-size:14px; font-weight:bold; padding:10px 20px; border-radius:10px; text-decoration:none; box-shadow: 0 4px 10px rgba(217, 70, 239, 0.4);">⬇️ Download HD Image</a>`;
        outputDiv.appendChild(actionDiv);
    };

    img.onerror = () => {
        outputDiv.innerHTML = '<span style="color:#ef4444; font-size:14px;">Failed to generate image. Try again.</span>';
    };
                            }
            
