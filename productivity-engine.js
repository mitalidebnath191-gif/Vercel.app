// NEXUS Productivity Tools Hub Engine (With Show/Hide)
(function() {
    setInterval(() => {
        // Pincode বাটনটি খুঁজছে
        const pinBtn = document.getElementById('pincode-finder-btn');
        
        // যদি Pincode বাটন থাকে কিন্তু Productivity Hub না থাকে
        if (pinBtn && !document.getElementById('productivity-hub-container')) {
            const container = document.createElement('div');
            container.id = 'productivity-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            // Show/Hide বাটন (প্রোডাক্টিভিটি থিমের জন্য সুন্দর এমারেল্ড/সবুজ কালার)
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'productivity-hub-btn';
            toggleBtn.style.cssText = "background:#10b981; color:yellow; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);";
            toggleBtn.innerHTML = "⚡ Productivity Tools";
            
            // লিস্ট কন্টেইনার (লুকানো থাকবে)
            const listDiv = document.createElement('div');
            listDiv.id = 'productivity-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            // প্রোডাক্টিভিটি টুলের লিস্ট এবং লিংক
            const tools = [
                { name: "To-Do List", url: "https://todo.microsoft.com/", icon: "📝" },
                { name: "Calendar", url: "https://calendar.google.com/", icon: "📅" },
                { name: "Reminder", url: "https://keep.google.com/", icon: "⏰" },
                { name: "Stopwatch", url: "https://vclock.com/stopwatch/", icon: "⏱️" },
                { name: "Timer", url: "https://vclock.com/timer/", icon: "⏳" },
                { name: "Unit Converter", url: "https://www.unitconverters.net/", icon: "⚖️" },
                { name: "Currency Converter", url: "https://www.xe.com/currencyconverter/", icon: "💱" },
                { name: "Calculator", url: "https://www.desmos.com/scientific", icon: "🧮" },
                { name: "Expense Tracker", url: "https://www.goodbudget.com/", icon: "💰" }
            ];
            
            // প্রতিটি টুলের জন্য বাটন তৈরি করা
            tools.forEach(tool => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#34d399; border:1px solid #34d399; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left; display:flex; gap:8px; align-items:center;";
                btn.innerHTML = `<span>${tool.icon}</span> <span>${tool.name}</span>`;
                
                btn.onclick = () => {
                    if(window.addNexusHistory) window.addNexusHistory(`Opened ${tool.name}`, "⚡ Productivity");
                    window.open(tool.url, "_blank");
                };
                
                listDiv.appendChild(btn);
            });
            
            // টগল লজিক (Show / Hide)
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "⚡ Hide Productivity Tools" : "⚡ Productivity Tools";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            
            // Pincode বাটনের ঠিক নিচে বসিয়ে দেবে
            pinBtn.parentNode.insertBefore(container, pinBtn.nextSibling);
        }
    }, 1000);
})();
                 
