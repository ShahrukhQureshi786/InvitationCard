document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ENVELOPE OPENING LOGIC & CARD ANIMATION SYNC ---
    const waxSeal = document.getElementById('waxSeal');
    const openingScreen = document.getElementById('openingScreen');
    const invitationSection = document.getElementById('invitationSection');

    waxSeal.addEventListener('click', () => {
        openingScreen.classList.add('slide-out');
        
        // Timeout ko balance kia hai takay ribbon open honay k sath smooth fade-in entry ho
        setTimeout(() => {
            openingScreen.style.display = 'none';
            invitationSection.classList.add('active-view');
            initScratchCard();
        }, 800); 
    });

    // --- 2. SMOOTH LINE DRAWING SCRATCH ENGINE ---
    function initScratchCard() {
        const canvas = document.getElementById('scratchCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const wrapper = canvas.parentElement;
        
        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;

        // Warm Matte Purple-Bronze Texture Background
        ctx.fillStyle = '#26222e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Premium Gold Sparkles Over Overlay
        ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
        for (let i = 0; i < 350; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            ctx.fillRect(x, y, 1.8, 1.8);
        }

        // Texture Helper Instruction Text
        ctx.font = "italic 16px 'Cormorant Garamond'";
        ctx.fillStyle = "#d4af37";
        ctx.textAlign = "center";
        ctx.fillText("Scratch Card to Reveal Royal Details", canvas.width / 2, canvas.height / 2);

        let isDrawing = false;
        let lastPos = { x: 0, y: 0 }; 

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        // Continuous path calculation (Smooth vector scratch lines)
        function scratchMove(e) {
            if (!isDrawing) return;
            e.preventDefault();
            
            const currentPos = getMousePos(e);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 70; // High thickness stroke for faster reveal

            ctx.beginPath();
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(currentPos.x, currentPos.y);
            ctx.stroke();

            lastPos = currentPos;
            checkScratchPercentage();
        }

        function checkScratchPercentage() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let cleared = 0;

            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) cleared++;
            }

            let percentage = (cleared / (pixels.length / 4)) * 100;
            if (percentage > 45) {
                canvas.style.opacity = '0';
                setTimeout(() => {
                    canvas.remove();
                }, 600);
            }
        }

        // Desktop Pointer Interface Hooks
        canvas.addEventListener('mousedown', (e) => { 
            isDrawing = true; 
            lastPos = getMousePos(e); 
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(lastPos.x, lastPos.y, 35, 0, Math.PI * 2);
            ctx.fill();
        });
        canvas.addEventListener('mousemove', scratchMove);
        window.addEventListener('mouseup', () => isDrawing = false);

        // Mobile Touch Interface Hooks
        canvas.addEventListener('touchstart', (e) => { 
            isDrawing = true; 
            lastPos = getMousePos(e); 
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(lastPos.x, lastPos.y, 35, 0, Math.PI * 2);
            ctx.fill();
        });
        canvas.addEventListener('touchmove', scratchMove);
        window.addEventListener('touchend', () => isDrawing = false);
    }

    // --- 3. COUNTDOWN AND AUTOMATIC VIEW SYNC SCROLL ENGINE ---
    const continueBtn = document.getElementById('continueBtn');
    const countdownSection = document.getElementById('countdownSection');
    const finalSection = document.getElementById('finalSection');

    continueBtn.addEventListener('click', () => {
        // Dono layers ko rendering active flex stack karein
        countdownSection.classList.remove('hidden-initially');
        finalSection.classList.remove('hidden-initially');
        
        // Dynamic layout calculation delay adjustment
        setTimeout(() => {
            countdownSection.style.opacity = '1';
            countdownSection.style.transform = 'translateY(0)';
            finalSection.style.opacity = '1';
            finalSection.style.transform = 'translateY(0)';
            
            // Seamless smooth automatic scrolling synchronization
            countdownSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });

    // Countdown Clock Math Logic
    function updateClock() {
        const weddingDate = new Date('October 24, 2026 17:00:00').getTime();
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff <= 0) return;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = d < 10 ? '0' + d : d;
        document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
        document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
        document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
    }
    setInterval(updateClock, 1000);

    // --- 4. LIGHTWEIGHT LUXURY PARTICLES ENGINE ---
    const pContainer = document.getElementById('particles');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle p-gold';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.setProperty('--dx', (Math.random() * 150 - 75) + 'px');
        p.style.setProperty('--dy', (Math.random() * 150 - 75) + 'px');
        p.style.setProperty('--dur', (Math.random() * 4 + 3) + 's');
        pContainer.appendChild(p);
    }
});