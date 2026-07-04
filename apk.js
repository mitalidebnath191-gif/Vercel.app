// এই কোডটি অ্যাপের সব লিংককে নতুন ট্যাবের বদলে অ্যাপের ভেতরেই খুলতে বাধ্য করবে
document.addEventListener('click', function(event) {
    let targetLink = event.target.closest('a');
    
    // যদি লিংকে ক্লিক করা হয় এবং সেটি নতুন ট্যাবে খোলার কথা থাকে
    if (targetLink && targetLink.getAttribute('target') === '_blank') {
        event.preventDefault(); // নতুন ট্যাবে খোলার কমান্ড বাতিল করা হলো
        window.location.href = targetLink.href; // লিংকটি অ্যাপের ভেতরেই খোলা হবে
    }
});
