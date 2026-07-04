window.loadSecurityTools = () => {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="max-w-2xl mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">🛡️ Security & Network Tools</h1>
            <input id="ipInput" type="text" placeholder="Enter IP or Domain (e.g. 8.8.8.8)" class="w-full bg-zinc-800 rounded-xl px-4 py-3 mb-4">
            <div class="grid grid-cols-2 gap-2 mb-6">
                <button onclick="runSecurityScan('ipwho')" class="bg-indigo-600 p-3 rounded-xl text-sm font-semibold">IP Info (IPWho.is)</button>
                <button onclick="runSecurityScan('ipapi')" class="bg-indigo-600 p-3 rounded-xl text-sm font-semibold">Location (ipapi.co)</button>
                <button onclick="runSecurityScan('dns-google')" class="bg-emerald-600 p-3 rounded-xl text-sm font-semibold">Google DNS</button>
                <button onclick="runSecurityScan('dns-cloudflare')" class="bg-emerald-600 p-3 rounded-xl text-sm font-semibold">Cloudflare DNS</button>
            </div>
            <div id="securityResults" class="bg-zinc-900 p-4 rounded-xl border border-white/10 min-h-[200px] text-xs overflow-auto text-zinc-300">Results will appear here...</div>
        </div>
    `;
};

window.runSecurityScan = async (type) => {
    const input = document.getElementById('ipInput').value || '8.8.8.8';
    const resDiv = document.getElementById('securityResults');
    resDiv.innerHTML = "Fetching data, please wait...";
    
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
        resDiv.innerHTML = `<span class="text-red-400">Error: Could not fetch data. Make sure your input is correct.</span>`; 
    }
};

// মেনুতে বাটন ইনজেক্ট করা
const injectSecurityButton = setInterval(() => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !document.getElementById('sec-btn')) {
        const btn = document.createElement('div');
        btn.id = 'sec-btn';
        btn.className = "px-3 py-2 text-sm cursor-pointer hover:bg-zinc-800 rounded-lg flex items-center gap-2";
        btn.innerHTML = "🛡️ Security Tools";
        btn.onclick = () => window.loadSecurityTools();
        sidebar.appendChild(btn);
        clearInterval(injectSecurityButton);
    }
}, 1000);
          
