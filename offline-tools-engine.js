// NEXUS 100% Offline Utilities Hub (Calendar, Alarm, Timer, Stopwatch, Clock, Compass)
(function() {
    setInterval(() => {
        // Finance Hub বাটনটি খুঁজছে
        const financeHub = document.getElementById('finance-hub-container');
        
        // যদি Finance Hub থাকে কিন্তু Offline Hub না থাকে
        if (financeHub && !document.getElementById('offline-hub-container')) {
            const container = document.createElement('div');
            container.id = 'offline-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            // Show/Hide বাটন (অফলাইন থিমের জন্য সুন্দর স্লেট/গ্রে-ব্লু কালার)
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'offline-hub-btn';
            toggleBtn.style.cssText = "background:#64748b; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);";
            toggleBtn.innerHTML = "📴 Offline Utilities";
            
            // লিস্ট কন্টেইনার
            const listDiv = document.createElement('div');
            listDiv.id = 'offline-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            // অফলাইন টুলস লিস্ট
            const tools = [
                { name: "Calendar", action: "openCalendar", icon: "📅" },
                { name: "Alarm Clock", action: "openAlarm", icon: "⏰" },
                { name: "Timer", action: "openTimer", icon: "⏳" },
                { name: "Stopwatch", action: "openStopwatch", icon: "⏱️" },
                { name: "World Clock", action: "openWorldClock", icon: "🌍" },
                { name: "Compass", action: "openCompass", icon: "🧭" }
            ];
            
            tools.forEach(tool => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#94a3b8; border:1px solid #94a3b8; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left; display:flex; gap:8px; align-items:center;";
                btn.innerHTML = `<span>${tool.icon}</span> <span>${tool.name}</span>`;
                
                btn.onclick = () => {
                    const profileModal = document.getElementById('profile-modal');
                    if(profileModal) profileModal.style.display = 'none';
                    openOfflineToolModal(tool.name, tool.action, profileModal);
                    if(window.addNexusHistory) window.addNexusHistory(`Opened Offline ${tool.name}`, "📴 Tools");
                };
                
                listDiv.appendChild(btn);
            });
            
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "📴 Hide Offline Utilities" : "📴 Offline Utilities";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            
            // Finance Hub এর ঠিক নিচে বসিয়ে দেবে
            financeHub.parentNode.insertBefore(container, financeHub.nextSibling);
        }
    }, 1000);

    // সাউন্ড বাজানোর জন্য Web Audio API (Offline Beep)
    function playBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5); // 0.5 second beep
        } catch(e) { console.log("Audio not supported"); }
    }

    // ডাইনামিক অফলাইন মোডাল
    function openOfflineToolModal(title, action, profileModal) {
        let modal = document.getElementById('offline-tool-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'offline-tool-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 400px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #64748b; display: flex; flex-direction: column; gap: 15px; box-sizing: border-box;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#94a3b8; font-weight:bold; font-size:17px; margin:0;">${title}</h2>
                    <button id="close-offline-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <!-- Tool Content Container -->
                <div id="offline-tool-content" style="width:100%; text-align:center; min-height:150px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    Loading...
                </div>
                
                <p style="color:#71717a; font-size:10px; margin:0; text-align:center;">100% Offline. Works without internet.</p>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-offline-btn');
        const contentBox = document.getElementById('offline-tool-content');

        // Close logic (and clear intervals)
        closeBtn.onclick = () => {
            if(window.activeOfflineInterval) clearInterval(window.activeOfflineInterval);
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        // ==========================================
        // 1. Calendar Logic
        // ==========================================
        if (action === "openCalendar") {
            const date = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            contentBox.innerHTML = `
                <div style="font-size:40px; margin-bottom:10px;">📅</div>
                <div style="font-size:24px; color:white; font-weight:bold;">${date.getDate()}</div>
                <div style="font-size:16px; color:#cbd5e1;">${date.toLocaleDateString('en-US', options)}</div>
                <div style="margin-top:20px; padding:10px; background:#27272a; border-radius:8px; font-size:13px; color:#94a3b8;">
                    Current Date loaded from device system.
                </div>
            `;
        }
        
        // ==========================================
        // 2. Alarm Clock Logic
        // ==========================================
        else if (action === "openAlarm") {
            contentBox.innerHTML = `
                <input type="time" id="alarm-time" style="background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:20px; outline:none; margin-bottom:15px;">
                <button id="set-alarm-btn" style="background:#3b82f6; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">Set Alarm</button>
                <div id="alarm-status" style="margin-top:15px; color:#cbd5e1; font-size:14px;">No alarm set</div>
            `;
            const setBtn = document.getElementById('set-alarm-btn');
            const timeInput = document.getElementById('alarm-time');
            const status = document.getElementById('alarm-status');
            
            setBtn.onclick = () => {
                if(!timeInput.value) return alert("Select a time!");
                status.innerHTML = `Alarm set for <b style="color:#38bdf8;">${timeInput.value}</b>`;
                
                if(window.activeOfflineInterval) clearInterval(window.activeOfflineInterval);
                window.activeOfflineInterval = setInterval(() => {
                    const now = new Date();
                    const currentStr = String(now.getHours()).padStart(2,'0') + ":" + String(now.getMinutes()).padStart(2,'0');
                    if (currentStr === timeInput.value) {
                        status.innerHTML = `<b style="color:#ef4444; font-size:20px;">⏰ WAKE UP!</b>`;
                        playBeep(); // Beep 1
                        setTimeout(playBeep, 1000); // Beep 2
                        clearInterval(window.activeOfflineInterval);
                    }
                }, 1000);
            };
        }

        // ==========================================
        // 3. Timer Logic
        // ==========================================
        else if (action === "openTimer") {
            contentBox.innerHTML = `
                <div style="display:flex; gap:10px; margin-bottom:15px; align-items:center;">
                    <input type="number" id="timer-min" placeholder="Min" min="0" value="5" style="width:60px; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:16px; text-align:center;">
                    <span style="color:white; font-size:20px;">:</span>
                    <input type="number" id="timer-sec" placeholder="Sec" min="0" max="59" value="0" style="width:60px; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; font-size:16px; text-align:center;">
                </div>
                <div style="display:flex; gap:10px;">
                    <button id="timer-start" style="background:#10b981; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">Start</button>
                    <button id="timer-stop" style="background:#ef4444; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">Stop</button>
                </div>
                <div id="timer-display" style="margin-top:20px; font-size:35px; color:#38bdf8; font-family:monospace; font-weight:bold;">05:00</div>
            `;
            let totalSeconds = 300;
            const startBtn = document.getElementById('timer-start');
            const stopBtn = document.getElementById('timer-stop');
            const minIn = document.getElementById('timer-min');
            const secIn = document.getElementById('timer-sec');
            const disp = document.getElementById('timer-display');
            
            function updateDisp() {
                const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
                const s = String(totalSeconds % 60).padStart(2, '0');
                disp.innerText = `${m}:${s}`;
            }

            startBtn.onclick = () => {
                totalSeconds = (parseInt(minIn.value) || 0) * 60 + (parseInt(secIn.value) || 0);
                updateDisp();
                if(window.activeOfflineInterval) clearInterval(window.activeOfflineInterval);
                window.activeOfflineInterval = setInterval(() => {
                    if (totalSeconds <= 0) {
                        clearInterval(window.activeOfflineInterval);
                        disp.innerText = "TIME UP!";
                        disp.style.color = "#ef4444";
                        playBeep(); setTimeout(playBeep, 500); setTimeout(playBeep, 1000);
                        return;
                    }
                    totalSeconds--;
                    updateDisp();
                }, 1000);
            };
            stopBtn.onclick = () => {
                if(window.activeOfflineInterval) clearInterval(window.activeOfflineInterval);
            };
        }

        // ==========================================
        // 4. Stopwatch Logic
        // ==========================================
        else if (action === "openStopwatch") {
            contentBox.innerHTML = `
                <div id="sw-display" style="font-size:40px; color:#eab308; font-family:monospace; font-weight:bold; margin-bottom:20px;">00:00:00</div>
                <div style="display:flex; gap:10px;">
                    <button id="sw-start" style="background:#10b981; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">Start</button>
                    <button id="sw-stop" style="background:#ef4444; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">Stop</button>
                    <button id="sw-reset" style="background:#64748b; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">Reset</button>
                </div>
            `;
            let swTime = 0;
            const disp = document.getElementById('sw-display');
            
            function formatTime(ms) {
                const d = new Date(ms);
                const m = String(d.getUTCMinutes()).padStart(2, '0');
                const s = String(d.getUTCSeconds()).padStart(2, '0');
                const msPart = String(Math.floor(d.getUTCMilliseconds() / 10)).padStart(2, '0');
                return `${m}:${s}:${msPart}`;
            }

            document.getElementById('sw-start').onclick = () => {
                if(window.activeOfflineInterval) clearInterval(window.activeOfflineInterval);
                const startTime = Date.now() - swTime;
                window.activeOfflineInterval = setInterval(() => {
                    swTime = Date.now() - startTime;
                    disp.innerText = formatTime(swTime);
                }, 10);
            };
            document.getElementById('sw-stop').onclick = () => {
                if(window.activeOfflineInterval) clearInterval(window.activeOfflineInterval);
            };
            document.getElementById('sw-reset').onclick = () => {
                if(window.activeOfflineInterval) clearInterval(window.activeOfflineInterval);
                swTime = 0;
                disp.innerText = "00:00:00";
            };
        }

        // ==========================================
        // 5. World Clock Logic
        // ==========================================
        else if (action === "openWorldClock") {
            contentBox.innerHTML = `
                <div id="world-clock-list" style="width:100%; display:flex; flex-direction:column; gap:10px;"></div>
            `;
            const list = document.getElementById('world-clock-list');
            const cities = [
                { name: "New York", tz: "America/New_York", flag: "🇺🇸" },
                { name: "London", tz: "Europe/London", flag: "🇬🇧" },
                { name: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
                { name: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
                { name: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺" }
            ];

            function updateClocks() {
                let html = "";
                cities.forEach(city => {
                    const timeStr = new Date().toLocaleTimeString("en-US", { timeZone: city.tz });
                    html += `
                        <div style="display:flex; justify-content:space-between; background:#27272a; padding:10px 15px; border-radius:8px;">
                            <span style="color:#cbd5e1; font-weight:bold;">${city.flag} ${city.name}</span>
                            <span style="color:#38bdf8; font-family:monospace; font-weight:bold;">${timeStr}</span>
                        </div>
                    `;
                });
                list.innerHTML = html;
            }
            updateClocks();
            if(window.activeOfflineInterval) clearInterval(window.activeOfflineInterval);
            window.activeOfflineInterval = setInterval(updateClocks, 1000);
        }

        // ==========================================
        // 6. Compass Logic (Device Sensors)
        // ==========================================
        else if (action === "openCompass") {
            contentBox.innerHTML = `
                <div style="position:relative; width:150px; height:150px; border-radius:50%; border:4px solid #64748b; display:flex; align-items:center; justify-content:center; background:#1e293b; margin-bottom:20px;">
                    <div style="position:absolute; top:5px; color:#ef4444; font-weight:bold;">N</div>
                    <div style="position:absolute; bottom:5px; color:#cbd5e1; font-weight:bold;">S</div>
                    <div style="position:absolute; right:5px; color:#cbd5e1; font-weight:bold;">E</div>
                    <div style="position:absolute; left:5px; color:#cbd5e1; font-weight:bold;">W</div>
                    <!-- Compass Needle -->
                    <div id="compass-needle" style="width:4px; height:100px; background:linear-gradient(to bottom, #ef4444 50%, #cbd5e1 50%); border-radius:4px; transition: transform 0.1s ease-out;"></div>
                </div>
                <div id="compass-deg" style="font-size:24px; color:white; font-weight:bold; font-family:monospace;">0°</div>
                <p style="color:#f59e0b; font-size:10px; margin-top:10px;">Note: Needs device rotation sensors. May not work on PC.</p>
            `;
            
            const needle = document.getElementById('compass-needle');
            const degText = document.getElementById('compass-deg');
            
            function handleOrientation(event) {
                let alpha = event.alpha; 
                let webkitAlpha = event.webkitCompassHeading;
                let heading = webkitAlpha || (360 - alpha);
                
                if (heading !== null) {
                    needle.style.transform = `rotate(${heading}deg)`;
                    degText.innerText = Math.round(heading) + "°";
                }
            }
            window.addEventListener('deviceorientationabsolute', handleOrientation);
            window.addEventListener('deviceorientation', handleOrientation);
            
            // Cleanup on close
            const origClose = closeBtn.onclick;
            closeBtn.onclick = () => {
                window.removeEventListener('deviceorientationabsolute', handleOrientation);
                window.removeEventListener('deviceorientation', handleOrientation);
                origClose();
            };
        }
    }
})();
