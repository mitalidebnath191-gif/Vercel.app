// NEXUS Password Breach Checker Engine (Standalone File)
(function() {
    setInterval(() => {
        // Game Centre বাটনটি খুঁজছে
        const gameBtn = document.getElementById('game-centre-btn');
        
        // যদি Game Centre বাটন থাকে কিন্তু Password Breach বাটন না থাকে
        if (gameBtn && !document.getElementById('password-breach-btn')) {
            const breachBtn = document.createElement('button');
            breachBtn.id = 'password-breach-btn';
            
            // বাটনের ডিজাইন (সিকিউরিটি থিমের জন্য সুন্দর লালচে-কমলা/ক্রিমসন কালার দেওয়া হয়েছে)
            breachBtn.style.cssText = "background:#dc2626; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); margin-top: 10px;";
            breachBtn.innerHTML = "🔒 Password Breach Checker";
            
            // বাটনে ক্লিক করলে মূল প্রোফাইল পপ-আপ লুকিয়ে নতুন সিকিউরিটি উইন্ডো খুলবে
            breachBtn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if(profileModal) profileModal.style.display = 'none';
                openBreachModal(profileModal);
            };
            
            gameBtn.parentNode.appendChild(breachBtn);
        }
    }, 1000);

    // সিকিউরিটি পপ-আপ উইন্ডো
    function openBreachModal(profileModal) {
        let modal = document.getElementById('breach-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'breach-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 380px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #dc2626; display: flex; flex-direction: column; gap: 15px;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#dc2626; font-weight:bold; font-size:17px; margin:0;">🔒 Security Checker</h2>
                    <button id="close-breach-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="width:100%;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Check if your password is leaked:</label>
                    <div style="position:relative; width:100%;">
                        <input type="password" id="breach-password-input" placeholder="Enter password to scan..." style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box; padding-right:40px;">
                        <span id="toggle-pwd-view" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); cursor:pointer; color:#a1a1aa; font-size:14px;">👁️</span>
                    </div>
                </div>
                
                <button id="check-breach-btn" style="background:#dc2626; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px;">Scan Password</button>

                <div id="breach-result-box" style="display:none; flex-direction:column; gap:8px; text-align: center; background: #27272a; padding: 15px; border-radius: 8px; border: 1px dashed #52525b; font-size:13px; color:white; word-break:break-all;"></div>
                
                <p style="color:#71717a; font-size:10px; margin:0; text-align:center;">🛡️ Privacy Note: We convert your password to an encrypted SHA-1 hash code before checking. Your actual text password is never sent anywhere.</p>
            </div>
        `;
        document.body.appendChild(modal);

        const pwdInput = document.getElementById('breach-password-input');
        const viewToggle = document.getElementById('toggle-pwd-view');
        const resultBox = document.getElementById('breach-result-box');
        const checkBtn = document.getElementById('check-breach-btn');

        // পাসওয়ার্ড দেখানো/লুকানোর লজিক
        viewToggle.onclick = () => {
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                viewToggle.innerHTML = '🔒';
            } else {
                pwdInput.type = 'password';
                viewToggle.innerHTML = '👁️';
            }
        };

        // বন্ধ করার বাটন
        document.getElementById('close-breach-btn').onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        // মেইন ব্রিচ চেকার ফাংশন (Secure HIBP API integration)
        checkBtn.onclick = async () => {
            const password = pwdInput.value;
            if (!password) {
                alert("Please enter a password first!");
                return;
            }

            resultBox.style.display = 'flex';
            resultBox.innerHTML = `<span style="color:#38bdf8;">⏳ Cryptographic scanning in progress...</span>`;
            
            try {
                // ১. পাসওয়ার্ডকে SHA-1 হ্যাশ কোডে রূপান্তর করা (নিরাপত্তার জন্য)
                const msgBuffer = new TextEncoder().encode(password);
                const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
                
                // ২. হ্যাশের প্রথম ৫টি ক্যারেক্টার এবং বাকি অংশ আলাদা করা (k-Anonymity Security Rule)
                const prefix = hashHex.slice(0, 5);
                const suffix = hashHex.slice(5);

                // ৩. HaveIBeenPwned API থেকে ডেটা আনা
                const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
                if (!response.ok) throw new Error("API Network error");
                
                const responseText = await response.text();
                const lines = responseText.split('\n');
                
                let count = 0;
                for (let line of lines) {
                    const [hashSuffix, matchCount] = line.split(':');
                    if (hashSuffix.trim() === suffix) {
                        count = parseInt(matchCount);
                        break;
                    }
                }

                // ৪. স্ক্রিনে রেজাল্ট দেখানো
                if (count > 0) {
                    resultBox.innerHTML = `
                        <span style="color:#ef4444; font-weight:bold; font-size:15px;">⚠️ DANGER: Breach Detected!</span>
                        <p style="margin:5px 0 0 0; color:#fca5a5;">This password has been exposed in data breaches <b style="color:white; background:#ef4444; padding:2px 6px; border-radius:4px;">${count.toLocaleString()} times</b> on the internet! Hackers can easily guess this. Change it immediately!</p>
                    `;
                } else {
                    resultBox.innerHTML = `
                        <span style="color:#22c55e; font-weight:bold; font-size:15px;">✅ SECURE: No Breach Found</span>
                        <p style="margin:5px 0 0 0; color:#86efac;">Great! This password was not found in any known public data leaks. It appears to be safe.</p>
                    `;
                }
                
                if(window.addNexusHistory) window.addNexusHistory("Checked Password Security", "🔒 Security Hub");

            } catch (error) {
                resultBox.innerHTML = `<span style="color:#f59e0b;">⚠️ Error connecting to secure database. Please try again later.</span>`;
            }
        };
    }
})();
          
