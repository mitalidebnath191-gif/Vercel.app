window.searchAdditionalLibraries = async (query) => {
    if (!query) return;

    // নতুন রেজাল্ট এরিয়া যোগ করার জন্য কিছু HTML এলিমেন্ট তৈরি করা
    const container = document.getElementById('main-content');
    const extraArea = document.createElement('div');
    extraArea.className = "mt-6 p-4 bg-zinc-900 rounded-2xl";
    extraArea.innerHTML = `<h2 class="text-xl font-bold mb-4">Extended Library Results</h2><div id="extResults" class="grid grid-cols-2 gap-4"></div>`;
    container.appendChild(extraArea);
    const extResults = document.getElementById('extResults');

    // ১. Gutendex API (পাবলিক ডোমেইন বই)
    fetch(`https://gutendex.com/books?search=${encodeURIComponent(query)}`)
        .then(r => r.json()).then(d => {
            extResults.innerHTML += `<div class="p-2"><h3 class="text-green-400">Gutendex (Books)</h3>${d.results.slice(0,3).map(b => `<p class="text-sm truncate">${b.title}</p>`).join('')}</div>`;
        });

    // ২. Internet Archive API (ডকুমেন্ট সার্চ)
    fetch(`https://archive.org/advancedsearch.php?q=title:${encodeURIComponent(query)}&output=json&rows=3`)
        .then(r => r.json()).then(d => {
            extResults.innerHTML += `<div class="p-2"><h3 class="text-blue-400">Internet Archive</h3>${d.response.docs.map(b => `<p class="text-sm truncate">${b.title}</p>`).join('')}</div>`;
        });

    // ৩. WorldCat Search (লাইব্রেরি লোকেশন)
    // দ্রষ্টব্য: WorldCat-এর জন্য API Key প্রয়োজন। আপনি আপনার Key এখানে বসাতে পারেন।
    const worldCatKey = "YOUR_API_KEY_HERE";
    fetch(`https://www.worldcat.org/webservices/catalog/search/opensearch?q=${encodeURIComponent(query)}&wskey=${worldCatKey}`)
        .then(r => r.text()).then(xml => {
            extResults.innerHTML += `<div class="p-2"><h3 class="text-purple-400">WorldCat</h3><p class="text-sm">Check console for XML results.</p></div>`;
            console.log("WorldCat Results:", xml);
        });
};
      
