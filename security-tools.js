// URL Scanner-এর ভেতরে টুলগুলো লোড করার জন্য লজিক
const integrateSecurityIntoScanner = setInterval(() => {
    // URL Scanner সেকশনটি খুঁজছে
    const scannerTitle = Array.from(document.querySelectorAll('h1')).find(el => el.innerText.includes('URL Scanner'));
    
    if (scannerTitle && !document.getElementById('security-tools-container')) {
        const scannerContainer = scannerTitle.parentElement;
        const toolsDiv = document.createElement('div');
        toolsDiv.id = 'security-tools-container';
        toolsDiv.className = "mt-6 p-4 bg-zinc-900 rounded-2xl border border-white/5";
        
        toolsDiv.innerHTML = `
            <h2 class="text-lg font-bold mb-3">🛡️ Security Tools</h2>
            <input id="ipInput" type="text" placeholder="Enter IP or Domain..." class="w-full bg-zinc-800 rounded-xl px-4 py-3 mb-3 text-sm">
            <div class="grid grid-cols-2 gap-2 mb-4">
                <button onclick="runSecurityScan('ipwho')" class="bg-indigo-600 p-2 rounded-lg text-xs">IP Info</button>
                <button onclick="runSecurityScan('ipapi')" class="bg-indigo-600 p-2 rounded-lg text-xs">Location</button>
                <button onclick="runSecurityScan('dns-google')" class="bg-emerald-600 p-2 rounded-lg text-xs">Google DNS</button>
                <button onclick="runSecurityScan('dns-cloudflare')" class="bg-emerald-600 p-2 rounded-lg text-xs">Cloudflare DNS</button>
            </div>
            <div id="securityResults" class="bg-black p-3 rounded-lg text-[10px] overflow-auto max-h-40 text-zinc-400">Results...</div>
        `;
        scannerContainer.appendChild(toolsDiv);
    }
}, 1000);

// স্ক্যান ফাংশন (আগের মতোই)
window.runSecurityScan = async (type) => {
    const input = document.getElementById('ipInput').value || '8.8.8.8';
    const resDiv = document.getElementById('securityResults');
    resDiv.innerHTML = "Fetching...";
    
    let url = "";
    if (type === 'ipwho') url = `https://ipwho.is/${input}`;
    else if (type === 'ipapi') url = `https://ipapi.co/${input}/json/`;
    else if (type === 'dns-google') url = `https://dns.google/resolve?name=${input}`;
    else if (type === 'dns-cloudflare') url = `https://cloudflare-dns.com/dns-query?name=${input}&type=A`;

    try {
        const res = await fetch(url, { headers: { 'Accept': 'application/dns-json' } });
        const data = await res.json();
        resDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch(e) { 
        resDiv.innerHTML = `<span class="text-red-400">Error!</span>`; 
    }
};
