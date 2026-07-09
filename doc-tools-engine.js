// NEXUS Document & Signature Tools Hub (Markdown & Signature)
(function() {
    // Markdown পার্স করার জন্য লাইব্রেরি লোড করা
    if (!document.getElementById('marked-lib')) {
        const script = document.createElement('script');
        script.id = 'marked-lib';
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        document.head.appendChild(script);
    }

    setInterval(() => {
        // বাটনটি আগে থেকেই আছে কি না চেক করছে
        if (document.getElementById('doc-hub-container')) return;

        // AI Pro Hub বাটনটি খুঁজছে
        const aiProHub = document.getElementById('ai-pro-hub-container');
        
        // যদি AI Pro Hub থাকে, তবে তার নিচে এটি তৈরি করবে
        if (aiProHub) {
            const container = document.createElement('div');
            container.id = 'doc-hub-container';
            container.style.cssText = "width: 100%; margin-top: 10px;";
            
            // Show/Hide বাটন (ডক টুলস থিমের জন্য সুন্দর অ্যাম্বার/কমলা-হলুদ কালার)
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'doc-hub-btn';
            toggleBtn.style.cssText = "background:#f59e0b; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; transition: 0.3s; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);";
            toggleBtn.innerHTML = "📝 Doc & Signature Tools";
            
            // লিস্ট কন্টেইনার
            const listDiv = document.createElement('div');
            listDiv.id = 'doc-hub-list';
            listDiv.style.cssText = "display: none; flex-direction: column; gap: 8px; margin-top: 10px; padding: 10px; background: #27272a; border-radius: 8px; border: 1px solid #52525b;";
            
            // টুলস লিস্ট
            const tools = [
                { name: "Live Markdown Editor", action: "open_markdown_modal", icon: "✍️" },
                { name: "Digital Signature Creator", action: "open_signature_modal", icon: "🖋️" }
            ];
            
            tools.forEach(tool => {
                const btn = document.createElement('button');
                btn.style.cssText = "background:transparent; color:#fbbf24; border:1px solid #fbbf24; padding:8px; border-radius:5px; cursor:pointer; font-size:13px; text-align:left; display:flex; gap:8px; align-items:center;";
                btn.innerHTML = `<span>${tool.icon}</span> <span>${tool.name}</span>`;
                
                btn.onclick = () => {
                    const profileModal = document.getElementById('profile-modal');
                    if(profileModal) profileModal.style.display = 'none';
                    
                    if (tool.action === "open_markdown_modal") {
                        openMarkdownModal(profileModal);
                    } else if (tool.action === "open_signature_modal") {
                        openSignatureModal(profileModal);
                    }
                };
                
                listDiv.appendChild(btn);
            });
            
            toggleBtn.onclick = () => {
                const isHidden = listDiv.style.display === 'none';
                listDiv.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.innerHTML = isHidden ? "📝 Hide Doc Tools" : "📝 Doc & Signature Tools";
            };
            
            container.appendChild(toggleBtn);
            container.appendChild(listDiv);
            
            // AI Pro Hub এর ঠিক নিচে বসিয়ে দেবে
            aiProHub.parentNode.insertBefore(container, aiProHub.nextSibling);
        }
    }, 1000);

    // ==========================================
    // ১. Digital Signature Creator Modal
    // ==========================================
    function openSignatureModal(profileModal) {
        let modal = document.getElementById('signature-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'signature-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 400px; background: #18181b; padding: 20px; border-radius: 16px; border: 1px solid #f59e0b; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #3f3f46; padding-bottom: 10px;">
                    <h2 style="color:#f59e0b; font-weight:bold; font-size:17px; margin:0;">🖋️ Signature Creator</h2>
                    <button id="close-sig-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <p style="color:#a1a1aa; font-size:12px; margin:0;">Draw your signature below (finger or mouse):</p>
                
                <!-- Signature Canvas -->
                <div style="background:white; border-radius:8px; overflow:hidden; border:2px dashed #fbbf24; touch-action:none;">
                    <canvas id="sig-canvas" width="350" height="200" style="display:block; width:100%; cursor:crosshair;"></canvas>
                </div>
                
                <div style="display:flex; gap:10px; width:100%; margin-top:10px;">
                    <button id="clear-sig-btn" style="flex:1; background:#3f3f46; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px;">🗑️ Clear</button>
                    <button id="save-sig-btn" style="flex:2; background:#f59e0b; color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">💾 Save as PNG</button>
                </div>
                <p style="color:#71717a; font-size:10px; margin:0; text-align:center;">Saves with transparent background.</p>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-sig-btn');
        const clearBtn = document.getElementById('clear-sig-btn');
        const saveBtn = document.getElementById('save-sig-btn');
        const canvas = document.getElementById('sig-canvas');
        const ctx = canvas.getContext('2d');

        // Canvas Setup for smooth drawing
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000'; // কালো কালির পেন

        let drawing = false;

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (canvas.width / rect.width),
                y: (clientY - rect.top) * (canvas.height / rect.height)
            };
        }

        const startDraw = (e) => {
            e.preventDefault();
            drawing = true;
            const pos = getMousePos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        };

        const draw = (e) => {
            e.preventDefault();
            if (!drawing) return;
            const pos = getMousePos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };

        const stopDraw = (e) => {
            e.preventDefault();
            drawing = false;
        };

        // Mouse Events
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseout', stopDraw);

        // Touch Events for Mobile
        canvas.addEventListener('touchstart', startDraw, {passive: false});
        canvas.addEventListener('touchmove', draw, {passive: false});
        canvas.addEventListener('touchend', stopDraw, {passive: false});

        clearBtn.onclick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        saveBtn.onclick = () => {
            // Check if canvas is empty (simplified check)
            const blank = document.createElement('canvas');
            blank.width = canvas.width;
            blank.height = canvas.height;
            if (canvas.toDataURL() === blank.toDataURL()) {
                alert("Please draw a signature first!");
                return;
            }

            const dataURL = canvas.toDataURL("image/png");
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = "My_Signature.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            if(window.addNexusHistory) window.addNexusHistory("Saved a Digital Signature", "🖋️ Doc Tools");
        };

        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };
    }

    // ==========================================
    // ২. Live Markdown Editor Modal
    // ==========================================
    function openMarkdownModal(profileModal) {
        let modal = document.getElementById('markdown-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'markdown-modal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;";
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 600px; height: 90vh; background: #18181b; border-radius: 16px; border: 1px solid #f59e0b; display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; background:#27272a; padding: 15px; border-bottom: 1px solid #3f3f46;">
                    <h2 style="color:#f59e0b; font-weight:bold; font-size:17px; margin:0;">✍️ Markdown Editor</h2>
                    <button id="close-md-btn" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:bold; cursor:pointer;">X</button>
                </div>

                <div style="display:flex; flex-direction:column; flex:1; overflow:hidden;">
                    <!-- Editor Box -->
                    <div style="flex:1; display:flex; flex-direction:column; padding:10px; border-bottom:2px solid #3f3f46;">
                        <label style="color:#fbbf24; font-size:12px; font-weight:bold; margin-bottom:5px;">Input (Markdown):</label>
                        <textarea id="md-input" placeholder="# Heading 1\n**Bold Text**\n* Italic\n- List item" style="flex:1; width:100%; background:#27272a; border:none; color:white; padding:10px; border-radius:8px; font-size:14px; outline:none; resize:none; font-family:monospace;"></textarea>
                    </div>
                    
                    <!-- Live Preview Box -->
                    <div style="flex:1; display:flex; flex-direction:column; padding:10px; background:#0f172a; overflow-y:auto;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                            <label style="color:#34d399; font-size:12px; font-weight:bold;">Live Preview:</label>
                        </div>
                        <div id="md-preview" style="color:#cbd5e1; font-size:14px; line-height:1.6; padding:10px; background:white; color:black; border-radius:8px; min-height:100px;">
                            <i>Preview will appear here...</i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-md-btn');
        const mdInput = document.getElementById('md-input');
        const mdPreview = document.getElementById('md-preview');

        // লাইভ কনভার্ট করার ফাংশন
        const updatePreview = () => {
            const rawText = mdInput.value;
            if (rawText.trim() === '') {
                mdPreview.innerHTML = '<i>Preview will appear here...</i>';
                return;
            }
            if (typeof marked !== 'undefined') {
                mdPreview.innerHTML = marked.parse(rawText);
            } else {
                mdPreview.innerHTML = '<span style="color:red;">Loading Markdown Engine...</span>';
            }
        };

        mdInput.addEventListener('input', updatePreview);

        closeBtn.onclick = () => {
            modal.remove();
            if(profileModal) profileModal.style.display = 'flex';
        };
    }
})();
