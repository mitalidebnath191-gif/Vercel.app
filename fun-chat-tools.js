// AI Chat-এর জন্য সম্পূর্ণ স্বাধীন Floating Modal সিস্টেম
const injectToAiChat = setInterval(() => {
    // AI Chat পেজটি খুঁজছে
    const chatTitle = Array.from(document.querySelectorAll('h1, h2, div')).find(el => el.innerText && el.innerText.includes('AI Chat'));
    
    let floatBtn = document.getElementById('fun-float-btn');
    let funModal = document.getElementById('fun-modal');

    if (chatTitle) {
        // AI Chat-এ থাকলে বাটন দেখাবে
        if (!floatBtn) {
            floatBtn = document.createElement('div');
            floatBtn.id = 'fun-float-btn';
            // বাটনটি স্ক্রিনের ওপরের ডান কোণায় থাকবে
            floatBtn.style.cssText = "position: fixed; top: 80px; right: 20px; background: #fbbf24; color: black; width: 45px; height: 45px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); cursor: pointer; z-index: 100000;";
            floatBtn.innerHTML = "🎉";
            floatBtn.onclick = toggleFunModal;
            document.body.appendChild(floatBtn);
        } else {
            floatBtn.style.display = 'flex';
        }
    } else {
        // AI Chat থেকে বের হয়ে গেলে বাটন ও পপ-আপ লুকিয়ে ফেলবে
        if (floatBtn) floatBtn.style.display = 'none';
        if (funModal) funModal.style.display = 'none';
    }
}, 500);

// পপ-আপ (Modal) খোলার ফাংশন
function toggleFunModal() {
    let modal = document.getElementById('fun-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'fun-modal';
        // পপ-আপটি স্ক্রিনের ঠিক মাঝখানে থাকবে
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 400px; background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 16px; z-index: 100001; box-shadow: 0 10px 30px rgba(0,0,0,0.8); display: flex; flex-direction: column;";
        
        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                <h2 style="color:#fbbf24; font-weight:bold; font-size:16px; margin:0;">🎉 Fun API Tools</h2>
                <button onclick="document.getElementById('fun-modal').style.display='none'" style="background:red; color:white; border:none; padding:4px 10px; border-radius:8px; font-weight:bold;">X</button>
            </div>
            
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; max-height:220px; overflow-y:auto; padding-right:4px;">
                <button onclick="runFunAPI('jokeapi')" style="background:#2563eb; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">😂 JokeAPI</button>
                <button onclick="runFunAPI('dadjoke')" style="background:#3b82f6; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">👨 Dad Joke</button>
                <button onclick="runFunAPI('chuck')" style="background:#ea580c; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">💪 Chuck</button>
                <button onclick="runFunAPI('bored')" style="background:#14b8a6; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">🎲 Random</button>
                <button onclick="runFunAPI('cat')" style="background:#ec4899; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">🐱 Cat Fact</button>
                <button onclick="runFunAPI('dog')" style="background:#d97706; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">🐶 Dog Pic</button>
                <button onclick="runFunAPI('duck')" style="background:#eab308; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">🦆 Duck</button>
                <button onclick="runFunAPI('fox')" style="background:#f97316; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">🦊 Fox</button>
                <button onclick="runFunAPI('fact')" style="background:#6366f1; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">🤯 Fact</button>
                <button onclick="runFunAPI('yesno')" style="background:#16a34a; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">👍 Yes/No</button>
                <button onclick="runFunAPI('advice')" style="background:#0891b2; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">💡 Advice</button>
                <button onclick="runFunAPI('excuse')" style="background:#a855f7; padding:8px; border-radius:8px; font-size:10px; color:white; border:none;">🙈 Excuse</button>
            </div>
            
            <div style="margin-top:12px; background:black; padding:12px; border-radius:8px; text-align:center; border:1px solid #333;">
                <div id="funOutput" style="font-size:12px; color:white;">Click a button to get started!</div>
                <div id="funImgOutput" style="margin-top:8px; display:none; justify-content:center;"></div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        // যদি পপ-আপ আগে থেকেই থাকে, তবে ক্লিক করলে হাইড/শো হবে
        modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
    }
}

// API কল করার ফাংশন
window.runFunAPI = async (type) => {
    const out = document.getElementById('funOutput');
    const imgOut = document.getElementById('funImgOutput');
    
    out.innerText = "Loading...";
    imgOut.innerHTML = ""; 
    imgOut.style.display = "none";

    try {
        let responseText = "";

        if (type === 'jokeapi') {
            const res = await fetch("https://v2.jokeapi.dev/joke/Any");
            const data = await res.json();
            responseText = data.type === 'twopart' ? `${data.setup}\n\n${data.delivery}` : data.joke;
        } else if (type === 'dadjoke') {
            const res = await fetch("https://icanhazdadjoke.com/", { headers: { 'Accept': 'application/json' }});
            const data = await res.json();
            responseText = data.joke;
        } else if (type === 'chuck') {
            const res = await fetch("https://api.chucknorris.io/jokes/random");
            const data = await res.json();
            responseText = data.value;
        } else if (type === 'bored') {
            const res = await fetch("https://bored-api.appbrewery.com/random");
            const data = await res.json();
            responseText = `Activity: ${data.activity}\nType: ${data.type}`;
        } else if (type === 'cat') {
            const res = await fetch("https://catfact.ninja/fact");
            const data = await res.json();
            responseText = data.fact;
        } else if (type === 'dog') {
            const res = await fetch("https://dog.ceo/api/breeds/image/random");
            const data = await res.json();
            imgOut.innerHTML = `<img src="${data.message}" style="max-height:120px; border-radius:10px;">`;
            imgOut.style.display = "flex";
            responseText = "Here is a good boy! 🐶";
        } else if (type === 'duck') {
            const res = await fetch("https://random-d.uk/api/random");
            const data = await res.json();
            imgOut.innerHTML = `<img src="${data.url}" style="max-height:120px; border-radius:10px;">`;
            imgOut.style.display = "flex";
            responseText = "Quack Quack! 🦆";
        } else if (type === 'fox') {
            const res = await fetch("https://randomfox.ca/floof/");
            const data = await res.json();
            imgOut.innerHTML = `<img src="${data.image}" style="max-height:120px; border-radius:10px;">`;
            imgOut.style.display = "flex";
            responseText = "Floof! 🦊";
        } else if (type === 'fact') {
            const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
            const data = await res.json();
            responseText = data.text;
        } else if (type === 'yesno') {
            const res = await fetch("https://yesno.wtf/api");
            const data = await res.json();
            imgOut.innerHTML = `<img src="${data.image}" style="max-height:120px; border-radius:10px;">`;
            imgOut.style.display = "flex";
            responseText = `Answer: ${data.answer.toUpperCase()}`;
        } else if (type === 'advice') {
            const res = await fetch("https://api.adviceslip.com/advice");
            const data = await res.json();
            responseText = data.slip.advice;
        } else if (type === 'excuse') {
            const res = await fetch("https://excuser.herokuapp.com/v1/excuse");
            const data = await res.json();
            responseText = data[0].excuse;
        }
        
        out.innerText = responseText;
    } catch(e) { 
        out.innerText = "Oops! The API might be sleeping. 😴"; 
    }
};
            
