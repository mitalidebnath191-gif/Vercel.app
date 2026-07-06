// NEXUS Persistent Login Engine (Auto-Login)
(function() {
    // ১. পেজ লোড হওয়ার সাথে সাথে চেক করবে ইউজার আগে লগইন করেছে কি না
    window.addEventListener('load', () => {
        const isLoggedIn = localStorage.getItem('nexus_logged_in');

        if (isLoggedIn === 'true') {
            // যদি আগে থেকেই লগইন করা থাকে, তবে লগইন স্ক্রিন হাইড করে মেইন স্ক্রিন দেখাবে
            
            // ⚠️ নোট: আপনার HTML ফাইলের লগইন পেজ এবং মেইন পেজের ID অনুযায়ী নিচের নামগুলো মিলিয়ে নেবেন
            const loginScreen = document.getElementById('login-screen'); // লগইন পেজের ID
            const mainScreen = document.getElementById('main-screen');   // মেইন অ্যাপের ID

            if (loginScreen) loginScreen.style.display = 'none';
            if (mainScreen) mainScreen.style.display = 'block'; // বা 'flex' (আপনার ডিজাইন অনুযায়ী)
        }
    });

    // ২. যেকোনো জায়গা থেকে লগইন সাকসেসফুল করার গ্লোবাল ফাংশন
    window.nexusLoginSuccess = function() {
        // লগইন সফল হলে এটি স্টোরেজে সেভ করে রাখবে
        localStorage.setItem('nexus_logged_in', 'true');
        
        const loginScreen = document.getElementById('login-screen');
        const mainScreen = document.getElementById('main-screen');

        if (loginScreen) loginScreen.style.display = 'none';
        if (mainScreen) mainScreen.style.display = 'block';
        
        if (window.addNexusHistory) window.addNexusHistory("Logged into the system", "🔐 Security");
    };

    // ৩. লগআউট করার গ্লোবাল ফাংশন (যাতে চাইলে অন্য অ্যাকাউন্ট দিয়েও ঢোকা যায়)
    window.nexusLogout = function() {
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem('nexus_logged_in'); // লগইন ডেটা মুছে দেবে
            location.reload(); // পেজ রিলোড হয়ে আবার লগইন স্ক্রিনে চলে যাবে
        }
    };
})();
 
