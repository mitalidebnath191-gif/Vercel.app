// NEXUS Finance & Money Tools Hub
(function() {
    setInterval(() => {
        // বাটনটি আগে থেকেই আছে কি না চেক করছে
        if (document.getElementById('finance-hub-container')) return;

        // Doc & Signature Hub বাটনটি খুঁজছে
        const docHub = document.getElementById('doc-hub-container');
        
        // যদি Doc Hub থাকে, তবে তার নিচে এটি তৈরি করবে
        if (docHub) {
            const container = document.createElement('div');
            container.id = 'finance-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            // Show/Hide বাটন (ফাইন্যান্স থিমের জন্য সুন্দর এমারেল্ড/সবুজ কালার)
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'finance-hub-btn';
            toggleBtn.style.cssText = "background:#10b981; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);";
            toggleBtn.innerHTML = "💰 Finance (100+)";
            
            // লিস্ট কন্টেইনার
            const listDiv = document.createElement('div');
            listDiv.id = 'finance-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            // ফাইন্যান্স টুলস লিস্ট (সেরা ফ্রি ওয়েবসাইটগুলোর লিংক)
            const tools = [
                { name: "Expense Tracker", url: "https://www.goodbudget.com/", icon: "📉" },
                { name: "EMI Calculator", url: "https://emicalculator.net/", icon: "🏦" },
                { name: "GST Calculator", url: "https://cleartax.in/s/gst-calculator", icon: "🧾" },
                { name: "SIP Calculator", url: "https://scripbox.com/plan/sip-calculator", icon: "📈" },
                { name: "Currency Converter", url: "https://www.xe.com/currencyconverter/", icon: "💱" },
                { name: "Crypto Prices", url: "https://coinmarketcap.com/", icon: "₿" },
                { name: "Live Gold Price", url: "https://goldprice.org/", icon: "🪙" },
                { name: "Stock Watchlist", url: "https://in.tradingview.com/", icon: "📊" },
                { name: "Bill Splitter", url: "https://www.splitwise.com/", icon: "🍕" },
                { name: "Budget Planner", url: "https://www.nerdwallet.com/article/finance/nerdwallet-budget-calculator", icon: "🗓️" }
            ];
            
            tools.forEach(tool => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#34d399; border:1px solid #34d399; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left; display:flex; gap:8px; align-items:center;";
                btn.innerHTML = `<span>${tool.icon}</span> <span>${tool.name}</span>`;
                
                btn.onclick = () => {
                    if(window.addNexusHistory) window.addNexusHistory(`Opened ${tool.name}`, "💰 Finance");
                    window.open(tool.url, "_blank");
                };
                
                listDiv.appendChild(btn);
            });
            
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "💰 Hide Finance Tools" : "💰 Finance (100+)";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            
            // Doc & Signature Hub এর ঠিক নিচে বসিয়ে দেবে
            docHub.parentNode.insertBefore(container, docHub.nextSibling);
        }
    }, 1000);
})();
