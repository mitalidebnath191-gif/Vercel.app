// NEXUS Device & Android Pro Tools Hub (EXIF, Clipboard, APK, Battery)
(function() {
    // EXIF ডাটা পড়ার জন্য লাইব্রেরি লোড করা
    if (!document.getElementById('exif-lib')) {
        const script = document.createElement('script');
        script.id = 'exif-lib';
        script.src = 'https://cdn.jsdelivr.net/npm/exif-js';
        document.head.appendChild(script);
    }

    setInterval(() => {
        // বাটনটি আগে থেকেই আছে কি না চেক করছে
        if (document.getElementById('device-pro-hub-container')) return;

        // Offline Hub বাটনটি খুঁজছে
        const offlineHub = document.getElementById('offline-hub-container');
        
        // যদি Offline Hub থাকে, তবে তার নিচে এটি তৈরি করবে
        if (offlineHub) {
            const container = document.createElement('div');
            container.id = 'device-pro-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            // Show/Hide বাটন (ডিভাইস প্রো থিমের জন্য ডিপ ইন্ডিগো/পার্পেল-ব্লু কালার)
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'device-pro-hub-btn';
            toggleBtn.style.cssText = "background:#4f46e5; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);";
            toggleBtn.innerHTML = "📱 Device & Android Tools";
            
            // লিস্ট কন্টেইনার
            const listDiv = document.createElement('div');
            listDiv.id = 'device-pro-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            // প্রো টুলস লিস্ট
            const tools = [
                { name: "APK Info & Signature Checker", url: "https://www.sisik.eu/apk-tool", icon: "📦", type: "external" },
                { name: "App Permission Analyzer", url: "https://reports.exodus-privacy.eu.org/en/", icon: "🛡️", type: "external" },
                { name: "Battery Health & Status", action: "open_battery_modal", icon: "🔋", type: "internal" },
                { name: "Storage & Cleanup Analysis", action: "open_storage_modal", icon: "🧹", type: "internal" },
                { name: "EXIF Photo Viewer", action: "open_exif_modal", icon: "📸", type: "internal" },
                { name: "Pro Clipboard Manager", action: "open_clipboard_modal", icon: "📋", type: "internal" }
            ];
            
            tools.forEach(tool => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#818cf8; border:1px solid #818cf8; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left; display:flex; gap:8px; align-items:center;";
                btn.innerHTML = `<span>${tool.icon}</span> <span>${tool.name}</span>`;
                
                btn.onclick = () => {
                    const profileModal = document.getElementById('profile-modal');
                    if (tool.type === "external") {
                        if(window.addNexusHistory) window.addNexusHistory(`Opened ${tool.name}`, "📱 Device Tools");
                        window.open(tool.url, "_blank");
                    } else if (tool.type === "internal") {
                        if(profileModal) profileModal.style.display = 'none';
                        openDeviceInternalModal(tool.action, profileModal);
                        if(window.addNexusHistory) window.addNexusHistory(`Opened ${tool.name}`, "📱 Device Tools");
                    }
                };
                
                listDiv.appendChild(btn);
            });
            
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "📱 Hide Device Tools" : "📱 Device & Android Tools";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            
            // Offline Hub এর ঠিক নিচে বসিয়ে দেবে
            offlineHub.parentNode.insertBefore(container, offlineHub.nextSibling);
        }
    }, 1000);

    // ইন্টারনাল টুলগুলোর জন্য ডাইনামিক মোডাল
    function openDeviceInternalModal(action, profileModal) {
        let modal = document.getElementById('device-internal-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'device-internal-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;";
        
        // বেসিক লেআউট তৈরি
        let title = "", icon = "", contentHTML = "";

        if (action === "open_exif_modal") {
            title = "EXIF Photo Data Viewer"; icon = "📸";
            contentHTML = `
                <div style="width:100%; text-align:center;">
                    <label style="color:#a1a1aa; font-size:12px; display:block; margin-bottom:5px;">Select an Image to extract hidden EXIF data:</label>
                    <input type="file" id="exif-upload" accept="image/jpeg, image/png" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:13px; outline:none; cursor:pointer;">
                </div>
                <div id="exif-output" style="width:100%; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:12px; border-radius:8px; font-size:12px; height:200px; overflow-y:auto; margin-top:10px; font-family:monospace; word-break:break-all;">
                    Upload an image to see details (Camera model, Date, Location, etc.)
                </div>
            `;
        } else if (action === "open_clipboard_modal") {
            title = "Pro Clipboard Manager"; icon = "📋";
            contentHTML = `
                <textarea id="clipboard-box" placeholder="Your copied text will appear here..." style="width:100%; height:150px; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:14px; outline:none; resize:none; box-sizing:border-box; margin-bottom:10px;"></textarea>
                <div style="display:flex; gap:10px; width:100%;">
                    <button id="clip-read-btn" style="flex:1; background:#4f46e5; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px;">📥 Paste & Read</button>
                    <button id="clip-write-btn" style="flex:1; background:#10b981; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px;">📤 Copy & Save</button>
                    <button id="clip-clear-btn" style="flex:1; background:#ef4444; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px;">🗑️ Clear</button>
                </div>
            `;
        } else if (action === "open_battery_modal") {
            title = "Battery Info"; icon = "🔋";
            contentHTML = `
                <div id="battery-data" style="width:100%; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:15px; border-radius:8px; font-size:14px; text-align:center; min-height:150px; display:flex; flex-direction:column; justify-content:center; gap:10px;">
                    Loading Battery Data...
                </div>
                <p style="color:#f59e0b; font-size:11px; margin-top:10px; text-align:center;">Note: Deep Cycle Count is restricted by Android OS. Standard health data shown.</p>
            `;
        } else if (action === "open_storage_modal") {
            title = "Storage & Cleanup"; icon = "🧹";
            contentHTML = `
                <div id="storage-data" style="width:100%; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:15px; border-radius:8px; font-size:14px; text-align:center; min-height:100px; display:flex; flex-direction:column; justify-content:center; gap:10px; margin-bottom:10px;">
                    Estimating Browser Storage...
                </div>
                <button id="clear-cache-btn" style="width:100%; background:#ef4444; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px;">🗑️ Clear App Cache</button>
                <p style="color:#a1a1aa; font-size:11px; margin-top:10px; text-align:center;">Browser limits full device storage access. Shows web app quota.</p>
            `;
        }

        modal.innerHTML = `
            <div style="width: 100%; max-width: 420px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #4f46e5; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#818cf8; font-weight:bold; font-size:17px; margin:0;">${icon} ${title}</h2>
                    <button id="close-device-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                ${contentHTML}
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-device-btn');
        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        // ==========================================
        // 1. EXIF Viewer Logic
        // ==========================================
        if (action === "open_exif_modal") {
            const exifUpload = document.getElementById('exif-upload');
            const exifOutput = document.getElementById('exif-output');
            
            exifUpload.onchange = function(e) {
                const file = e.target.files[0];
                if(file && typeof EXIF !== "undefined") {
                    exifOutput.innerHTML = `<span style="color:#38bdf8;">Reading EXIF Data...</span>`;
                    EXIF.getData(file, function() {
                        const tags = EXIF.getAllTags(this);
                        if(Object.keys(tags).length > 0) {
                            let html = `<b style="color:#10b981;">✅ EXIF Data Found:</b><br><br>`;
                            for(let key in tags) {
                                if(key !== "thumbnail" && typeof tags[key] !== "object") {
                                    html += `<b style="color:#94a3b8;">${key}:</b> ${tags[key]}<br>`;
                                }
                            }
                            exifOutput.innerHTML = html;
                        } else {
                            exifOutput.innerHTML = `<span style="color:#ef4444;">❌ No hidden EXIF data found in this image. (Social media apps often remove it).</span>`;
                        }
                    });
                }
            };
        }
        
        // ==========================================
        // 2. Clipboard Manager Logic
        // ==========================================
        else if (action === "open_clipboard_modal") {
            const clipBox = document.getElementById('clipboard-box');
            
            document.getElementById('clip-read-btn').onclick = async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    clipBox.value = text;
                    if(!text) alert("Clipboard is empty or access denied.");
                } catch (err) { alert("Clipboard read blocked by browser. Please paste manually."); }
            };
            
            document.getElementById('clip-write-btn').onclick = async () => {
                try {
                    await navigator.clipboard.writeText(clipBox.value);
                    alert("✅ Text copied to your device clipboard!");
                } catch (err) { alert("Failed to copy."); }
            };
            
            document.getElementById('clip-clear-btn').onclick = () => {
                clipBox.value = "";
            };
        }

        // ==========================================
        // 3. Battery Info Logic
        // ==========================================
        else if (action === "open_battery_modal") {
            const batData = document.getElementById('battery-data');
            if(navigator.getBattery) {
                navigator.getBattery().then(function(battery) {
                    function updateBatteryInfo() {
                        const level = Math.round(battery.level * 100);
                        const charging = battery.charging ? "⚡ Charging" : "🔋 Discharging";
                        const color = level > 20 ? "#10b981" : "#ef4444";
                        batData.innerHTML = `
                            <div style="font-size:40px;">${battery.charging ? "⚡" : "📱"}</div>
                            <div style="font-size:28px; font-weight:bold; color:${color};">${level}%</div>
                            <div style="font-size:16px; color:#cbd5e1;">Status: ${charging}</div>
                            <div style="font-size:12px; color:#94a3b8; margin-top:5px;">Time to Empty/Full: ${battery.chargingTime === Infinity || battery.chargingTime === 0 ? "Calculating..." : battery.chargingTime+"s"}</div>
                        `;
                    }
                    updateBatteryInfo();
                    battery.addEventListener('levelchange', updateBatteryInfo);
                    battery.addEventListener('chargingchange', updateBatteryInfo);
                });
            } else {
                batData.innerHTML = "❌ Battery API not supported by this browser/device.";
            }
        }

        // ==========================================
        // 4. Storage & Cleanup Logic
        // ==========================================
        else if (action === "open_storage_modal") {
            const storeData = document.getElementById('storage-data');
            const clearCache = document.getElementById('clear-cache-btn');
            
            if (navigator.storage && navigator.storage.estimate) {
                navigator.storage.estimate().then(function(estimate) {
                    const usedMB = (estimate.usage / (1024 * 1024)).toFixed(2);
                    const quotaMB = (estimate.quota / (1024 * 1024)).toFixed(2);
                    const percentage = ((estimate.usage / estimate.quota) * 100).toFixed(2);
                    
                    storeData.innerHTML = `
                        <div style="font-size:30px;">💽</div>
                        <div style="font-size:18px; color:#38bdf8; font-weight:bold;">App Data Usage: ${usedMB} MB</div>
                        <div style="font-size:14px; color:#cbd5e1;">Available Quota: ${quotaMB} MB</div>
                        <div style="font-size:12px; color:#10b981; margin-top:5px;">Usage: ${percentage}%</div>
                    `;
                });
            } else {
                storeData.innerHTML = "Storage API not supported.";
            }

            clearCache.onclick = () => {
                if(confirm("Are you sure you want to clear app cache? This may clear local history.")) {
                    localStorage.clear();
                    sessionStorage.clear();
                    alert("✅ App Cache Cleared successfully!");
                    storeData.innerHTML = `<div style="color:#10b981; font-weight:bold; font-size:18px;">🧹 Cleanup Complete!</div>`;
                }
            };
        }
    }
})();
