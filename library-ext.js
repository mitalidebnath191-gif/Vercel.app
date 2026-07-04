// Gutendex Button যোগ করা
function addExtraLibraryButtons() {
    const libContent = document.querySelector('.overflow-x-auto');

    if (libContent && !document.getElementById('gutendexBtn')) {

        const newBtn = document.createElement('button');
        newBtn.id = 'gutendexBtn';
        newBtn.className =
            'lib-tab-btn px-4 py-2 bg-zinc-900 border border-white/10 text-zinc-400 rounded-xl font-semibold text-sm';

        newBtn.innerHTML = "📜 Gutendex";

        newBtn.onclick = async () => {

            try {

                const res = await fetch("https://gutendex.com/books/");
                const data = await res.json();

                let html = "<h2>📚 Gutendex Books</h2>";

                data.results.slice(0,20).forEach(book => {

                    const author = book.authors.length
                        ? book.authors[0].name
                        : "Unknown";

                    html += `
                        <div style="
                            margin:10px 0;
                            padding:10px;
                            border:1px solid #444;
                            border-radius:10px;">
                            
                            <h3>${book.title}</h3>

                            <p>✍️ ${author}</p>

                            <a href="${book.formats["text/html"] ||
                                       book.formats["application/epub+zip"] ||
                                       book.formats["text/plain; charset=utf-8"] ||
                                       "#"}"
                               target="_blank">
                               📖 Read Book
                            </a>

                        </div>
                    `;
                });

                const win = window.open("", "_blank");
                win.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Gutendex Library</title>
                        <style>
                            body{
                                background:#111;
                                color:#fff;
                                font-family:sans-serif;
                                padding:20px;
                            }
                            a{
                                color:#00bfff;
                            }
                        </style>
                    </head>
                    <body>
                        ${html}
                    </body>
                    </html>
                `);

            } catch (err) {
                alert("API Error: " + err.message);
            }

        };

        libContent.appendChild(newBtn);
    }
}

setInterval(addExtraLibraryButtons, 1000);
