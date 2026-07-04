// URL Scanner-এর ভেতরে টুল ইনজেক্ট করার লজিক
const injectToUrlScanner = setInterval(() => {
    // URL Scanner সেকশনটি খুঁজছে
    const scannerTitle = Array.from(document.querySelectorAll('h1')).find(el => el.innerText.includes('URL Scanner'));
    
    // যদি Scanner পাওয়া যায় এবং টুলগুলো আগে থেকে না থাকে
    if (scannerTitle && !document.getElementById('security-standalone-container')) {
        const scannerContainer = scannerTitle.parentElement;
        const toolsDiv = document.createElement('div');
        toolsDiv.id = 'security-standalone-container';
        toolsDiv.className = "mt-6 p-4 bg-zinc-900 rounded-2xl border border-white/5";
        
        toolsDiv.innerHTML = `
            <h2 class="text-lg font-bold mb-3 text-white">🛡️ Security Toolbox</h2>
            <div class="grid grid-cols-2 gap-2 mb-4">
                <button onclick="runStandalone('rdap')" class="bg-indigo-600 p-2 rounded-lg text-xs font-semibold">RDAP Lookup</button>
                <button onclick="runStandalone('ssl')" class="bg-purple-600 p-2 rounded-lg text-xs font-semibold">SSL Info</button>
                <button onclick="runStandalone('nmap')" class="bg-red-600 p-2 rounded-lg text-xs font-semibold">Port Scan</button>
                <button onclick="runStandalone('ipwho')" class="bg-emerald-600 p-2 rounded-lg text-xs font-semibold">IP Info</button>
            </div>
            <div id="secOutput" class="bg-black p-3 rounded-lg text-[10px] overflow-auto max-h-48 text-zinc-400 border border-zinc-800">Results will appear here...</div>
        `;
        scannerContainer.appendChild(toolsDiv);
    }
}, 1000);

// সার্চ ফাংশন
window.runStandalone = async (type) => {
    // Scanner-এর ইনপুট বক্স থেকে ডোমেইন নেওয়ার চেষ্টা
    const inputField = document.querySelector('input[type="text"]');
    const input = (inputField ? inputField.value : '') || 'google.com';
    const out = document.getElementById('secOutput');
    
    out.innerText = "Loading data...";
    
    let url = "";
    if (type === 'rdap') url = `https://rdap.org/domain/${input}`;
    else if (type === 'ssl') url = `https://api.hackertarget.com/ssl/?q=${input}`;
    else if (type === 'nmap') url = `https://api.hackertarget.com/nmap/?q=${input}`;
    else url = `https://ipwho.is/${input}`;
    
    try {
        const res = await fetch(url);
        const data = await res.text();
        out.innerText = data;
    } catch(e) { 
        out.innerText = "Error: Failed to fetch."; 
    }
};
      
