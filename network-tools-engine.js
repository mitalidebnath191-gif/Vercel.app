// NEXUS Network, DNS & Webmaster Pro Tools Hub (Smart Hide/Show on Manga Page)
(function() {
    
    // UI toiri korar function
    function createNetworkHub() {
        const container = document.createElement('div');
        container.id = 'network-hub-container';
        // 90% width kore dewa hoyeche jate mobile e perfect lage
        container.style.cssText = "width: 90%; max-width: 400px; margin: 20px auto; z-index: 50; display: block;";
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'network-hub-btn';
        toggleBtn.style.cssText = "background:#0ea5e9; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3); display:flex; justify-content:center; align-items:center; gap:8px;";
        toggleBtn.innerHTML = "🌐 Network & Webmaster Tools";
        
        const listDiv = document.createElement('div');
        listDiv.id = 'network-hub-list';
        listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
        
        const tools = [
            { name: "Domain Age & WHOIS", url: "https://lookup.icann.org/", icon: "🌍", type: "external" },
            { name: "Subdomain Finder", url: "https://dnsdumpster.com/", icon: "🔍", type: "external" },
            { name: "DNS & ASN Lookup", action: "open_dns_modal", icon: "📡", type: "internal" },
            { name: "SSL Expiry Checker", url: "https://www.sslshopper.com/ssl-checker.html", icon: "🔒", type: "external" },
            { name: "Blacklist Checker", url: "https://mxtoolbox.com/blacklists.aspx", icon: "🛑", type: "external" },
            { name: "HTTP Header Analyzer", action: "open_headers_modal", icon: "🕵️", type: "internal" },
            { name: "IP Range Calculator", action: "open_ip_modal", icon: "🧮", type: "internal" },
            { name: "Open Graph Preview", action: "open_og_modal", icon: "🖼️", type: "internal" },
            { name: "User-Agent Generator", action: "open_ua_modal", icon: "💻", type: "internal" },
            { name: "Sitemap & robots.txt", action: "open_robots_modal", icon: "🤖", type: "internal" },
            { name: "URL Redirect Checker", url: "https://wheregoes.com/", icon: "🔀", type: "external" },
            { name: "CDN & Tech Detector", url: "https://builtwith.com/", icon: "🏗️", type: "external" }
        ];
        
        tools.forEach(tool => {
            const btn = document.createElement('button');
            btn.style.cssText = "background:transparent; color:#38bdf8; border:1px solid #38bdf8; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left; display:flex; gap:8px; align-items:center;";
            btn.innerHTML = `<span>${tool.icon}</span> <span>${tool.name}</span>`;
            
            btn.onclick = () => {
                const profileModal = document.getElementById('profile-modal');
                if (tool.type === "external") {
                    if(window.addNexusHistory) window.addNexusHistory(`Opened ${tool.name}`, "🌐 Network Tools");
                    window.open(tool.url, "_blank");
                } else if (tool.type === "internal") {
                    if(profileModal) profileModal.style.display = 'none';
                    openNetworkInternalModal(tool.action, profileModal);
                }
            };
            listDiv.appendChild(btn);
        });
        
        toggleBtn.onclick = () => {
            const isHidden = listDiv.style.display === 'none';
            listDiv.style.display = isHidden ? 'flex' : 'none';
            toggleBtn.innerHTML = isHidden ? "🌐 Hide Network Tools" : "🌐 Network & Webmaster Tools";
        };
        
        container.appendChild(toggleBtn);
        container.appendChild(listDiv);
        return container;
    }

    // =======================================================
    // Smart Tracker: Sudhu Manga page e show korbe, baki jaygay Hide
    // =======================================================
    setInterval(() => {
        let isMangaPageOpen = false;
        let targetLocation = null;

        // Screen er sob text check korche (Manga page er specific text khujche)
        const allTextElements = document.querySelectorAll('div, p, span, h1, h2, h3, h4');
        for (let el of allTextElements) {
            // Jodi "Search to see MangaDex results" text ti thake tar mane Manga page open ache
            if (el.innerText && el.innerText.includes('Search to see MangaDex results')) {
                isMangaPageOpen = true;
                targetLocation = el;
                break;
            }
        }

        let hubContainer = document.getElementById('network-hub-container');

        if (isMangaPageOpen && targetLocation) {
            // Manga Page e ache -> Button ti show korate hobe
            if (!hubContainer) {
                // Jodi na thake toiri kore target er theek niche bosabe
                hubContainer = createNetworkHub();
                targetLocation.parentNode.insertBefore(hubContainer, targetLocation.nextSibling);
            } else {
                // Jodi thake tahole display block kore debe (karon age hide kora chilo)
                hubContainer.style.display = 'block';
                
                // Position jodi hariye jay, abar theek jaygay set korbe
                if (hubContainer.previousSibling !== targetLocation) {
                    targetLocation.parentNode.insertBefore(hubContainer, targetLocation.nextSibling);
                }
            }
        } else {
            // Manga Page theke beriye gache (Main Dashboard) -> Button ti hide korbe
            if (hubContainer) {
                hubContainer.style.display = 'none'; // Aka akai hide hoye jabe!
            }
        }

    }, 500); // Proti 0.5 sec e check korbe, tai sathe sathe hide/show hobe


    // ----------------------------------------------------
    // Internal Tools Logic (DNS, HTTP Header, IP Calc, etc.)
    // ----------------------------------------------------
    function openNetworkInternalModal(action, profileModal) {
        let modal = document.getElementById('network-internal-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'network-internal-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;";
        
        let title = "", icon = "", contentHTML = "";

        if (action === "open_dns_modal") {
            title = "DNS & ASN Lookup"; icon = "📡";
            contentHTML = `
                <input type="text" id="dns-input" placeholder="e.g. google.com" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; outline:none; margin-bottom:10px;">
                <button id="dns-btn" style="width:100%; background:#0ea5e9; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Scan DNS Records</button>
                <div id="dns-output" style="width:100%; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:10px; border-radius:8px; margin-top:10px; height:180px; overflow-y:auto; font-family:monospace; font-size:12px;">Records will appear here...</div>
            `;
        } 
        else if (action === "open_headers_modal") {
            title = "HTTP Header Analyzer"; icon = "🕵️";
            contentHTML = `
                <input type="url" id="hdr-input" placeholder="https://example.com" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; outline:none; margin-bottom:10px;">
                <button id="hdr-btn" style="width:100%; background:#0ea5e9; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Analyze Headers</button>
                <div id="hdr-output" style="width:100%; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:10px; border-radius:8px; margin-top:10px; height:200px; overflow-y:auto; font-family:monospace; font-size:12px; white-space:pre-wrap;">Headers will appear here...</div>
            `;
        }
        else if (action === "open_ip_modal") {
            title = "IP Range Calculator"; icon = "🧮";
            contentHTML = `
                <input type="text" id="ip-input" placeholder="e.g. 192.168.1.1/24" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; outline:none; margin-bottom:10px;">
                <button id="ip-btn" style="width:100%; background:#0ea5e9; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Calculate (Offline)</button>
                <div id="ip-output" style="width:100%; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:15px; border-radius:8px; margin-top:10px; line-height:1.6; font-size:13px;">Result will appear here...</div>
            `;
        }
        else if (action === "open_og_modal") {
            title = "Open Graph Preview"; icon = "🖼️";
            contentHTML = `
                <input type="url" id="og-input" placeholder="https://example.com" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:10px; border-radius:8px; outline:none; margin-bottom:10px;">
                <button id="og-btn" style="width:100%; background:#0ea5e9; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Fetch Preview</button>
                <div id="og-output" style="width:100%; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:10px; border-radius:8px; margin-top:10px; min-height:150px; display:flex; flex-direction:column; gap:5px;">Preview card will appear here...</div>
            `;
        }
        else if (action === "open_ua_modal") {
            title = "User-Agent Generator"; icon = "💻";
            contentHTML = `
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <select id="ua-os" style="flex:1; background:#27272a; color:white; border:1px solid #52525b; padding:10px; border-radius:8px;">
                        <option value="win">Windows</option><option value="mac">Mac OS</option>
                        <option value="and">Android</option><option value="ios">iOS</option>
                    </select>
                    <select id="ua-browser" style="flex:1; background:#27272a; color:white; border:1px solid #52525b; padding:10px; border-radius:8px;">
                        <option value="chr">Chrome</option><option value="fir">Firefox</option><option value="saf">Safari</option>
                    </select>
                </div>
                <button id="ua-btn" style="width:100%; background:#0ea5e9; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Generate UA (Offline)</button>
                <textarea id="ua-output" readonly style="width:100%; background:#1e293b; border:1px solid #334155; color:#38bdf8; padding:10px; border-radius:8px; margin-top:10px; height:80px; resize:none; font-family:monospace;"></textarea>
            `;
        }
        else if (action === "open_robots_modal") {
            title = "robots.txt Generator"; icon = "🤖";
            contentHTML = `
                <input type="text" id="rob-agent" placeholder="User-Agent (e.g. *)" value="*" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:8px; border-radius:8px; margin-bottom:8px;">
                <input type="text" id="rob-allow" placeholder="Allow paths (e.g. /)" value="/" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:8px; border-radius:8px; margin-bottom:8px;">
                <input type="text" id="rob-disallow" placeholder="Disallow paths (e.g. /admin/)" style="width:100%; background:#27272a; border:1px solid #52525b; color:white; padding:8px; border-radius:8px; margin-bottom:8px;">
                <button id="rob-btn" style="width:100%; background:#0ea5e9; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Generate (Offline)</button>
                <textarea id="rob-output" readonly style="width:100%; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:10px; border-radius:8px; margin-top:10px; height:120px; resize:none; font-family:monospace;"></textarea>
            `;
        }

        modal.innerHTML = `
            <div style="width: 100%; max-width: 450px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #0ea5e9; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#38bdf8; font-weight:bold; font-size:17px; margin:0;">${icon} ${title}</h2>
                    <button id="close-net-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>
                ${contentHTML}
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-net-btn').onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };

        // --- Logic Event Listeners ---
        if (action === "open_dns_modal") {
            document.getElementById('dns-btn').onclick = async () => {
                const domain = document.getElementById('dns-input').value.trim();
                const out = document.getElementById('dns-output');
                if(!domain) return alert("Enter a domain!");
                out.innerHTML = "⏳ Scanning with Google DNS...";
                try {
                    const resA = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
                    const dataA = await resA.json();
                    let html = `<b style="color:#10b981;">[A Records]</b><br>`;
                    if(dataA.Answer) dataA.Answer.forEach(a => html += `${a.name} -> ${a.data}<br>`); else html += "No A records found.<br>";
                    const resTXT = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`);
                    const dataTXT = await resTXT.json();
                    html += `<br><b style="color:#10b981;">[TXT Records]</b><br>`;
                    if(dataTXT.Answer) dataTXT.Answer.forEach(a => html += `${a.data}<br>`); else html += "No TXT records found.<br>";
                    out.innerHTML = html;
                } catch(e) { out.innerHTML = "❌ Error fetching DNS."; }
            };
        } else if (action === "open_headers_modal") {
            document.getElementById('hdr-btn').onclick = async () => {
                let url = document.getElementById('hdr-input').value.trim();
                if(!url) return alert("Enter a URL!");
                document.getElementById('hdr-output').innerHTML = "⏳ Fetching Headers...";
                try {
                    const res = await fetch(`https://api.hackertarget.com/httpheaders/?q=${url}`);
                    document.getElementById('hdr-output').innerHTML = (await res.text()).replace(/</g, "&lt;").replace(/>/g, "&gt;");
                } catch(e) { document.getElementById('hdr-output').innerHTML = "❌ Error fetching headers."; }
            };
        } else if (action === "open_ip_modal") {
            document.getElementById('ip-btn').onclick = () => {
                const input = document.getElementById('ip-input').value.trim();
                if(!input.includes('/')) return document.getElementById('ip-output').innerHTML = "❌ Format: IP/CIDR (e.g. 192.168.1.0/24)";
                try {
                    const [ip, cidr] = input.split('/');
                    const ipParts = ip.split('.').map(Number);
                    const ipInt = ((ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]) >>> 0;
                    const maskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0;
                    const netInt = (ipInt & maskInt) >>> 0;
                    const intToIP = (int) => `${(int >>> 24) & 255}.${(int >>> 16) & 255}.${(int >>> 8) & 255}.${int & 255}`;
                    document.getElementById('ip-output').innerHTML = `<b>Network:</b> ${intToIP(netInt)}<br><b>Mask:</b> ${intToIP(maskInt)}<br><b>Total IPs:</b> ${Math.pow(2, 32 - cidr)}`;
                } catch(e) { document.getElementById('ip-output').innerHTML = "❌ Invalid IP Format."; }
            };
        } else if (action === "open_og_modal") {
            document.getElementById('og-btn').onclick = async () => {
                let url = document.getElementById('og-input').value.trim();
                if(!url) return alert("Enter a URL!");
                document.getElementById('og-output').innerHTML = "⏳ Generating Preview...";
                try {
                    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    const doc = new DOMParser().parseFromString(data.contents, "text/html");
                    const title = doc.querySelector('meta[property="og:title"]')?.content || "No Title";
                    const img = doc.querySelector('meta[property="og:image"]')?.content;
                    let imgHtml = img ? `<img src="${img}" style="width:100%; border-radius:6px;">` : `No Image`;
                    document.getElementById('og-output').innerHTML = `${imgHtml}<b style="color:white; margin-top:5px;">${title}</b>`;
                } catch(e) { document.getElementById('og-output').innerHTML = "❌ Failed to fetch Open Graph."; }
            };
        } else if (action === "open_ua_modal") {
            document.getElementById('ua-btn').onclick = () => {
                const os = document.getElementById('ua-os').value;
                document.getElementById('ua-output').value = os === "win" ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0" : "Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36";
            };
        } else if (action === "open_robots_modal") {
            document.getElementById('rob-btn').onclick = () => {
                document.getElementById('rob-output').value = `User-agent: ${document.getElementById('rob-agent').value}\nAllow: ${document.getElementById('rob-allow').value}\nDisallow: ${document.getElementById('rob-disallow').value}`;
            };
        }
    }
})();
