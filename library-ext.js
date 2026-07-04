// Gutendex Button এবং Search যোগ করা
function addExtraLibraryButtons() {
    const libContent = document.querySelector('.overflow-x-auto');

    if (libContent && !document.getElementById('gutendexBtn')) {

        const newBtn = document.createElement('button');
        newBtn.id = 'gutendexBtn';
        newBtn.className = 'lib-tab-btn px-4 py-2 bg-zinc-900 border border-white/10 text-zinc-400 rounded-xl font-semibold text-sm';
        newBtn.innerHTML = "📜 Gutendex";

        newBtn.onclick = async () => {
            // প্রম্পট দিয়ে সার্চ করার ব্যবস্থা
            const query = prompt("Enter book title or author to search in Gutendex:");
            if (!query) return;

            try {
                const res = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (data.results.length === 0) {
                    alert("No books found for: " + query);
                    return;
                }

                let html = "<h1>📚 Gutendex Results for: " + query + "</h1>";
                data.results.slice(0, 20).forEach(book => {
                    const author = book.authors.length ? book.authors[0].name : "Unknown";
                    html += `
                        <div style="margin:15px 0; padding:15px; border:1px solid #444; border-radius:10px; background:#222;">
                            <h3>${book.title}</h3>
                            <p>✍️ ${author}</p>
                            <a href="${book.formats["text/html"] || book.formats["application/epub+zip"] || book.formats["text/plain; charset=utf-8"] || "#"}" 
                               target="_top" style="color:#00bfff; font-weight:bold;">📖 Read/Download Book</a>
                        </div>
                    `;
                });

                const win = window.open("", "_top"); // অ্যাপের ভেতরে খোলার জন্য _top
                win.document.write(`<html><body style="background:#111; color:#fff; font-family:sans-serif; padding:20px;">${html}</body></html>`);
            } catch (err) {
                alert("API Error: " + err.message);
            }
        };

        libContent.appendChild(newBtn);
    }
}
setInterval(addExtraLibraryButtons, 1000);
                        
