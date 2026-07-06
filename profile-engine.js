// NEXUS Profile & UI Customizer Engine (With Compression & Layer Fix)
(function() {
    // ১. ব্যাকগ্রাউন্ড সেট করার অ্যাডভান্সড লজিক
    function applyAppBackground() {
        const savedBg = localStorage.getItem('nexus_app_bg');
        let bgLayer = document.getElementById('nexus-custom-bg');

        if (savedBg) {
            // যদি ব্যাকগ্রাউন্ড লেয়ার না থাকে, তবে তৈরি করবে
            if (!bgLayer) {
                bgLayer = document.createElement('div');
                bgLayer.id = 'nexus-custom-bg';
                bgLayer.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -9999; background-size: cover; background-position: center; pointer-events: none;";
                document.body.appendChild(bgLayer);
            }
            bgLayer.style.backgroundImage = `url('${savedBg}')`;
            
            // অ্যাপের সলিড কালারগুলোকে ট্রান্সপারেন্ট করে দেওয়া
            document.body.style.backgroundColor = "transparent";
            const mainScreen = document.getElementById('main-screen');
            if(mainScreen) mainScreen.style.backgroundColor = "transparent";
        } else {
            // যদি রিমুভ করা হয়, তবে আগের ডার্ক মোডে ফিরে যাবে
            if (bgLayer) bgLayer.remove();
            document.body.style.backgroundColor = "#18181b"; 
            const mainScreen = document.getElementById('main-screen');
            if(mainScreen) mainScreen.style.backgroundColor = "";
        }
    }
    applyAppBackground(); 

    function getInitials(name) {
        if (!name) return "NX";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    setInterval(() => {
        const currentName = localStorage.getItem('nexus_profile_name') || 'Alex Rivera';
        const currentImg = localStorage.getItem('nexus_profile_img') || '';

        let nameEl = null;
        let avatarEl = null;

        const allElements = document.querySelectorAll('div, span, p, h1, h2, h3');
        
        allElements.forEach(el => {
            if (el.innerText && (el.innerText.trim() === 'Alex Rivera' || el.innerText.trim() === currentName) && el.children.length === 0) {
                nameEl = el;
            }
            if (el.innerText && el.innerText.trim() === getInitials(currentName) && el.children.length === 0) {
                avatarEl = el;
            }
            if (el.querySelector('#nexus-avatar-img')) {
                avatarEl = el;
            }
        });

        if (avatarEl && !avatarEl.hasAttribute('data-profile-click')) {
            avatarEl.setAttribute('data-profile-click', 'true');
            avatarEl.style.cursor = 'pointer';
            avatarEl.onclick = (e) => { e.preventDefault(); openProfileModal(); };
            
            if (currentImg) {
                avatarEl.innerHTML = `<img src="${currentImg}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" id="nexus-avatar-img">`;
                avatarEl.style.overflow = 'hidden';
                avatarEl.style.padding = '0';
            }
        }

        if (nameEl && !nameEl.hasAttribute('data-profile-click')) {
            nameEl.setAttribute('data-profile-click', 'true');
            nameEl.style.cursor = 'pointer';
            nameEl.onclick = (e) => { e.preventDefault(); openProfileModal(); };
            nameEl.innerText = currentName;
        }
    }, 1000);

    function openProfileModal() {
        let modal = document.getElementById('profile-modal');
        if (modal) modal.remove();

        const currentName = localStorage.getItem('nexus_profile_name') || 'Alex Rivera';
        const currentImg = localStorage.getItem('nexus_profile_img') || '';
        const hasCustomBg = !!localStorage.getItem('nexus_app_bg');

        modal = document.createElement('div');
        modal.id = 'profile-modal';
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 380px; background: #18181b; border: 1px solid #a855f7; border-radius: 16px; padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column; align-items: center; gap: 15px;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                <h2 style="color:#a855f7; font-weight:bold; font-size:18px; margin:0;">👤 Edit Profile</h2>
                <button id="close-profile-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
            </div>
            
            <div id="profile-preview-circle" style="width: 80px; height: 80px; border-radius: 50%; background: #a855f7; color: white; font-size: 28px; font-weight: bold; display: flex; justify-content: center; align-items: center; overflow: hidden; border: 2px solid #a855f7; box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3);">
                ${currentImg ? `<img src="${currentImg}" style="width:100%; height:100%; object-fit:cover;">` : getInitials(currentName)}
            </div>

            <div style="width:100%;">
                <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Change Profile Picture:</label>
                <input type="file" id="profile-image-input" accept="image/*" style="width:100%; color:#a1a1aa; font-size:13px; background:#27272a; padding:8px; border-radius:8px; border:1px solid #52525b; cursor:pointer;" />
            </div>

            <div style="width:100%;">
                <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Your Name:</label>
                <input type="text" id="profile-name-input" value="${currentName}" placeholder="Enter name..." style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:12px; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box;" />
            </div>
            
            <button id="save-profile-btn" style="background:#a855f7; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; margin-top:5px; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);">Save Changes</button>
            
            <div style="width:100%; border-top: 1px solid #3f3f46; margin-top: 10px; padding-top: 15px; text-align: center;">
                <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:8px;">App Background (Full Screen):</label>
                
                <input type="file" id="ui-bg-input" accept="image/*" style="display:none;" />
                
                <button id="trigger-bg-btn" style="background:#27272a; color:#38bdf8; border:1px solid #38bdf8; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:14px; transition: 0.3s; display:flex; align-items:center; justify-content:center; gap:8px;">
                    🖼️ Change UI Background
                </button>
                
                <button id="reset-bg-btn" style="background:transparent; color:#ef4444; border:none; padding:8px; font-size:12px; cursor:pointer; width:100%; margin-top:5px; text-decoration:underline; display: ${hasCustomBg ? 'block' : 'none'};">
                    Remove Custom Background
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        const fileInput = document.getElementById('profile-image-input');
        const nameInput = document.getElementById('profile-name-input');
        const previewCircle = document.getElementById('profile-preview-circle');
        
        const triggerBgBtn = document.getElementById('trigger-bg-btn');
        const bgInput = document.getElementById('ui-bg-input');
        const resetBgBtn = document.getElementById('reset-bg-btn');

        let finalBase64Image = currentImg;

        // Profile Image Logic (with compression to save space)
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                compressImage(file, 400, (base64Str) => {
                    finalBase64Image = base64Str;
                    previewCircle.innerHTML = `<img src="${finalBase64Image}" style="width:100%; height:100%; object-fit:cover;">`;
                });
            }
        };

        // App Background Selection Logic (With compression)
        triggerBgBtn.onclick = () => bgInput.click();

        bgInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const triggerOriginalText = triggerBgBtn.innerHTML;
                triggerBgBtn.innerHTML = "⏳ Processing Image...";
                
                // স্ক্রিনের সাইজ অনুযায়ী কম্প্রেস করবে (max 1080px) যাতে LocalStorage ক্র্যাশ না করে
                compressImage(file, 1080, (base64Bg) => {
                    try {
                        localStorage.setItem('nexus_app_bg', base64Bg);
                        applyAppBackground(); 
                        resetBgBtn.style.display = 'block';
                        triggerBgBtn.innerHTML = triggerOriginalText;
                        alert("✅ UI Background successfully applied!");
                    } catch(err) {
                        alert("⚠️ Error: Image is still too large. Try a different picture.");
                        triggerBgBtn.innerHTML = triggerOriginalText;
                    }
                });
            }
        };

        resetBgBtn.onclick = () => {
            localStorage.removeItem('nexus_app_bg');
            applyAppBackground();
            resetBgBtn.style.display = 'none';
        };

        document.getElementById('close-profile-btn').onclick = () => modal.remove();

        document.getElementById('save-profile-btn').onclick = () => {
            const newName = nameInput.value.trim();
            if (!newName) {
                alert("Name cannot be empty!");
                return;
            }

            localStorage.setItem('nexus_profile_name', newName);
            localStorage.setItem('nexus_profile_img', finalBase64Image);

            modal.remove();
        };

        // ইমেজ কম্প্রেস করার ফাংশন (Canvas API ব্যবহার করে)
        function compressImage(file, maxSize, callback) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = Math.round((height *= maxSize / width));
                            width = maxSize;
                        } else {
                            width = Math.round((width *= maxSize / height));
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // JPEG ফরম্যাটে 0.6 কোয়ালিটি সেট করা হয়েছে সাইজ কমানোর জন্য
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    callback(compressedBase64);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
})();
                                                   
