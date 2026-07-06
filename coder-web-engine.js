// NEXUS Coder Web Hub Engine
(function() {
    setInterval(() => {
        // Annapurna বাটনের ঠিক নিচেই নতুন বাটনটি বসবে
        const annaBtn = document.getElementById('annapurna-btn');
        
        if (annaBtn && !document.getElementById('coder-hub-btn')) {
            const container = document.createElement('div');
            container.id = 'coder-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            // Show/Hide বাটন
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'coder-hub-btn';
            toggleBtn.style.cssText = "background:#3f3f46; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(63, 63, 70, 0.3);";
            toggleBtn.innerHTML = "💻 Coder Web";
            
            // লিস্ট কন্টেইনার (লুকানো থাকবে)
            const listDiv = document.createElement('div');
            listDiv.id = 'coder-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            // ওয়েবসাইট লিস্ট
            const sites = [
                { name: "CodePen", url: "https://codepen.io" },
                { name: "JSFiddle", url: "https://jsfiddle.net" },
                { name: "PlayCode", url: "https://playcode.io" },
                { name: "StackBlitz", url: "https://stackblitz.com" },
                { name: "CodeSandbox", url: "https://codesandbox.io" }
            ];
            
            sites.forEach(site => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#38bdf8; border:1px solid #38bdf8; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left;";
                btn.innerHTML = `🌐 ${site.name}`;
                btn.onclick = () => window.open(site.url, "_blank");
                listDiv.appendChild(btn);
            });
            
            // টগল লজিক
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "💻 Hide Coder Web" : "💻 Coder Web";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            annaBtn.parentNode.appendChild(container);
        }
    }, 1000);
})();
              
