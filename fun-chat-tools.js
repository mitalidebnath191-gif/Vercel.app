// AI Chat-এর ভেতরে Fun Tools ইনজেক্ট করার লজিক
const injectToAiChat = setInterval(() => {
    // AI Chat পেজটি খুঁজে বের করা
    const chatTitle = Array.from(document.querySelectorAll('h1, h2, div')).find(el => el.innerText && el.innerText.includes('AI Chat'));
    
    if (chatTitle && !document.getElementById('fun-tools-container')) {
        const chatContainer = chatTitle.parentElement;
        const toolsDiv = document.createElement('div');
        toolsDiv.id = 'fun-tools-container';
        toolsDiv.className = "mt-4 p-4 bg-zinc-900 rounded-2xl border border-white/10 shadow-lg";
        
        toolsDiv.innerHTML = `
            <h2 class="text-lg font-bold mb-3 text-amber-400">🎉 Fun & Entertainment API</h2>
            <div class="grid grid-cols-3 gap-2 mb-4 max-h-32 overflow-y-auto pr-1">
                <button onclick="runFunAPI('jokeapi')" class="bg-blue-600 p-2 rounded-lg text-xs text-white">😂 JokeAPI</button>
                <button onclick="runFunAPI('dadjoke')" class="bg-blue-500 p-2 rounded-lg text-xs text-white">👨 Dad Joke</button>
                <button onclick="runFunAPI('chuck')" class="bg-orange-600 p-2 rounded-lg text-xs text-white">💪 Chuck Norris</button>
                <button onclick="runFunAPI('bored')" class="bg-teal-500 p-2 rounded-lg text-xs text-white">🎲 Random Activity</button>
                <button onclick="runFunAPI('cat')" class="bg-pink-500 p-2 rounded-lg text-xs text-white">🐱 Cat Fact</button>
                <button onclick="runFunAPI('dog')" class="bg-amber-600 p-2 rounded-lg text-xs text-white">🐶 Dog Pic</button>
                <button onclick="runFunAPI('duck')" class="bg-yellow-500 p-2 rounded-lg text-xs text-white">🦆 Duck Pic</button>
                <button onclick="runFunAPI('fox')" class="bg-orange-500 p-2 rounded-lg text-xs text-white">🦊 Fox Pic</button>
                <button onclick="runFunAPI('fact')" class="bg-indigo-500 p-2 rounded-lg text-xs text-white">🤯 Useless Fact</button>
                <button onclick="runFunAPI('yesno')" class="bg-green-600 p-2 rounded-lg text-xs text-white">👍 Yes/No</button>
                <button onclick="runFunAPI('advice')" class="bg-cyan-600 p-2 rounded-lg text-xs text-white">💡 Advice</button>
                <button onclick="runFunAPI('excuse')" class="bg-purple-500 p-2 rounded-lg text-xs text-white">🙈 Excuse</button>
                <button onclick="runFunAPI('insult')" class="bg-red-600 p-2 rounded-lg text-xs text-white">😅 Insult</button>
                <button onclick="runFunAPI('swanson')" class="bg-stone-600 p-2 rounded-lg text-xs text-white">📺 Ron Swanson</button>
            </div>
            <div class="bg-black p-3 rounded-lg border border-zinc-800 text-center">
                <div id="funOutput" class="text-sm text-white whitespace-pre-wrap">Click a button to get started!</div>
                <div id="funImgOutput" class="mt-2 hidden flex justify-center"></div>
            </div>
        `;
        // AI Chat-এর কন্টেনারের শুরুতে বসিয়ে দেওয়া হচ্ছে
        chatContainer.insertBefore(toolsDiv, chatContainer.children[1]); 
    }
}, 1000);

// API কল করার ফাংশন
window.runFunAPI = async (type) => {
    const out = document.getElementById('funOutput');
    const imgOut = document.getElementById('funImgOutput');
    
    out.innerText = "Loading...";
    imgOut.innerHTML = ""; 
    imgOut.classList.add("hidden");

    try {
        let responseText = "";

        if (type === 'jokeapi') {
            const res = await fetch("https://v2.jokeapi.dev/joke/Any");
            const data = await res.json();
            responseText = data.type === 'twopart' ? `${data.setup}\n\n${data.delivery}` : data.joke;
        } 
        else if (type === 'dadjoke') {
            const res = await fetch("https://icanhazdadjoke.com/", { headers: { 'Accept': 'application/json' }});
            const data = await res.json();
            responseText = data.joke;
        } 
        else if (type === 'chuck') {
            const res = await fetch("https://api.chucknorris.io/jokes/random");
            const data = await res.json();
            responseText = data.value;
        } 
        else if (type === 'bored') {
            const res = await fetch("https://bored-api.appbrewery.com/random");
            const data = await res.json();
            responseText = `Activity: ${data.activity}\nType: ${data.type}`;
        } 
        else if (type === 'cat') {
            const res = await fetch("https://catfact.ninja/fact");
            const data = await res.json();
            responseText = data.fact;
        } 
        else if (type === 'dog') {
            const res = await fetch("https://dog.ceo/api/breeds/image/random");
            const data = await res.json();
            imgOut.innerHTML = `<img src="${data.message}" class="max-h-40 rounded-xl border border-white/20">`;
            imgOut.classList.remove("hidden");
            responseText = "Here is a good boy! 🐶";
        } 
        else if (type === 'duck') {
            const res = await fetch("https://random-d.uk/api/random");
            const data = await res.json();
            imgOut.innerHTML = `<img src="${data.url}" class="max-h-40 rounded-xl border border-white/20">`;
            imgOut.classList.remove("hidden");
            responseText = "Quack Quack! 🦆";
        } 
        else if (type === 'fox') {
            const res = await fetch("https://randomfox.ca/floof/");
            const data = await res.json();
            imgOut.innerHTML = `<img src="${data.image}" class="max-h-40 rounded-xl border border-white/20">`;
            imgOut.classList.remove("hidden");
            responseText = "Floof! 🦊";
        } 
        else if (type === 'fact') {
            const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
            const data = await res.json();
            responseText = data.text;
        } 
        else if (type === 'yesno') {
            const res = await fetch("https://yesno.wtf/api");
            const data = await res.json();
            imgOut.innerHTML = `<img src="${data.image}" class="max-h-40 rounded-xl border border-white/20">`;
            imgOut.classList.remove("hidden");
            responseText = `Answer: ${data.answer.toUpperCase()}`;
        } 
        else if (type === 'advice') {
            const res = await fetch("https://api.adviceslip.com/advice");
            const data = await res.json();
            responseText = data.slip.advice;
        } 
        else if (type === 'excuse') {
            const res = await fetch("https://excuser.herokuapp.com/v1/excuse");
            const data = await res.json();
            responseText = data[0].excuse;
        } 
        else if (type === 'insult') {
            const res = await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json");
            const data = await res.json();
            responseText = data.insult;
        } 
        else if (type === 'swanson') {
            const res = await fetch("https://ron-swanson-quotes.herokuapp.com/v2/quotes");
            const data = await res.json();
            responseText = `"${data[0]}"\n- Ron Swanson`;
        }
        
        out.innerText = responseText;
    } catch(e) { 
        out.innerText = "Oops! The API might be sleeping right now. Try again! 😴"; 
    }
};
                 
