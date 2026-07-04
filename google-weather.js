// Live Weather বাটনকে স্মার্ট করে Google Weather-এ রিডাইরেক্ট করার লজিক
const hookLiveWeather = setInterval(() => {
    // স্ক্রিনে "Live Weather" লেখা আছে এমন সব অপশন খুঁজছে
    const weatherCards = Array.from(document.querySelectorAll('div, button, h2, h3, span, p')).filter(el =>
        el.innerText && el.innerText.trim() === 'Live Weather'
    );

    for (let card of weatherCards) {
        // সবচেয়ে কাছের ক্লিকেবল মেইন কার্ডটি (Parent Container) বের করা
        const clickableCard = card.closest('div[class*="bg-"]') || card.parentElement;

        // যদি কার্ডটি পাওয়া যায় এবং আগে থেকে হুক করা না থাকে
        if (clickableCard && !clickableCard.dataset.weatherHooked) {
            clickableCard.dataset.weatherHooked = "true"; // একবারই রান করার জন্য ট্যাগ

            // বাটনে ক্লিকের উপর নজরদারি (Capture Phase)
            clickableCard.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // আপনার অরিজিনাল অ্যাপের ওয়েদার ফাংশন জোর করে থামিয়ে দেবে

                openGoogleWeatherModal();
            }, true);
        }
    }
}, 1000);

// স্পেশাল Google Weather পপ-আপ খোলার ফাংশন
function openGoogleWeatherModal() {
    let modal = document.getElementById('google-weather-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'google-weather-modal';
        // স্ক্রিনের উপর একটি বড় উইন্ডো তৈরি করা হলো
        modal.style.cssText = "position: fixed; top: 5%; left: 5%; width: 90%; height: 90%; background: #202124; border: 1px solid #3c4043; border-radius: 16px; z-index: 100005; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column; overflow: hidden;";

        modal.innerHTML = `
            <!-- উপরের টাইটেল বার -->
            <div style="display:flex; justify-content:space-between; align-items:center; padding: 12px 16px; background: #303134; border-bottom: 1px solid #3c4043;">
                <h2 style="color:#e8eaed; font-weight:bold; font-size:16px; margin:0; display:flex; align-items:center; gap:8px;">
                    ⛅ Google Live Weather
                </h2>
                <button onclick="document.getElementById('google-weather-modal').style.display='none'" style="background:#ea4335; color:white; border:none; padding:6px 14px; border-radius:8px; font-weight:bold; cursor:pointer;">Close ✕</button>
            </div>
            
            <!-- মেইন Google Weather (iframe bypass) -->
            <div style="flex: 1; width: 100%; background: white;">
                <!-- igu=1 প্যারামিটারটি Google-কে iframe-এর ভেতরে রান করতে বাধ্য করে -->
                <iframe src="https://www.google.com/search?q=weather&igu=1" style="width:100%; height:100%; border:none;" allow="geolocation"></iframe>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        // আগে থেকে থাকলে শুধু শো করবে
        modal.style.display = 'flex';
    }
}
