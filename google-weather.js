// Live Weather ফিক্সড লজিক (সঠিক বাটন ডিটেকশন)
window.addEventListener('click', (e) => {
    let target = e.target;
    let isWeatherClicked = false;

    // ইউজার যেখানে ক্লিক করেছে, সেখান থেকে শুরু করে উপরের দিকে খুঁজবে
    while (target && target !== document.body) {
        let text = target.innerText ? target.innerText.trim() : "";
        
        // চেক করবে যে লেখাটির মধ্যে "Live Weather" আছে কিনা 
        // এবং লেখাটি যেন খুব বড় না হয় (Limit 30 characters), যাতে পুরো স্ক্রিন সিলেক্ট না হয়!
        if (text.includes('Live Weather') && text.length < 30) {
            isWeatherClicked = true;
            break;
        }
        target = target.parentElement;
    }

    // যদি সঠিকভাবে Live Weather কার্ডেই ক্লিক পড়ে
    if (isWeatherClicked) {
        e.preventDefault();
        e.stopPropagation(); // অরিজিনাল ওয়েদার অ্যাপকে ব্লক করবে
        
        openGoogleWeatherModal();
    }
}, true); // Capture Phase

// স্পেশাল Google Weather পপ-আপ খোলার ফাংশন
function openGoogleWeatherModal() {
    let modal = document.getElementById('google-weather-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'google-weather-modal';
        modal.style.cssText = "position: fixed; top: 5%; left: 5%; width: 90%; height: 90%; background: #202124; border: 1px solid #3c4043; border-radius: 16px; z-index: 100005; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: flex; flex-direction: column; overflow: hidden;";

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; padding: 12px 16px; background: #303134; border-bottom: 1px solid #3c4043;">
                <h2 style="color:#e8eaed; font-weight:bold; font-size:16px; margin:0; display:flex; align-items:center; gap:8px;">
                    ⛅ Google Live Weather
                </h2>
                <button onclick="document.getElementById('google-weather-modal').style.display='none'" style="background:#ea4335; color:white; border:none; padding:6px 14px; border-radius:8px; font-weight:bold; cursor:pointer;">Close ✕</button>
            </div>
            
            <div style="flex: 1; width: 100%; background: white;">
                <iframe src="https://www.google.com/search?q=weather&igu=1" style="width:100%; height:100%; border:none;" allow="geolocation"></iframe>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.style.display = 'flex';
    }
    }
