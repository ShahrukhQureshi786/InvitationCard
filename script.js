document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ENVELOPE OPENING, AUDIO PLAY & CARD ANIMATION SYNC ---
    const waxSeal = document.getElementById('waxSeal');
    const openingScreen = document.getElementById('openingScreen');
    const invitationSection = document.getElementById('invitationSection');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    // CONFIGURATION: Audio Timings (in seconds) & Volume
    const startTime = 14;  // 1:00 minute se start hoga
    const duration = 15;   // 15 seconds tak chalega
    const endTime = startTime + duration; // 75 seconds par loop back hoga
    const softVolume = 0.3; // 30% volume (Meetha aur low volume background score ke liye)

    waxSeal.addEventListener('click', () => {
        openingScreen.classList.add('slide-out');
        
        // Music Trigger: Seal break hote hi targeted soft play shuru ho
        playAudio();

        // Smooth entry sync delay for invitation card animation
        setTimeout(() => {
            openingScreen.style.display = 'none';
            invitationSection.classList.add('active-view');
            
            // Music button floating smooth entry
            musicToggle.classList.add('visible');
            
            initScratchCard();
        }, 800); 
    });

    // Audio Play Control Helper with exact custom timing and soft volume setup
    function playAudio() {
        // Song ka volume halka aur meetha set karna
        bgMusic.volume = softVolume;
        // Song ko 1:00 mint par set karna
        bgMusic.currentTime = startTime;

        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<span class="music-icon">⏸️</span>';
        }).catch((err) => {
            console.log("Browser blocked automatic autoplay until further interaction:", err);
        });
    }

    // 10-20 sec ke loop ko control karne wala function (Continuous Monitoring)
    bgMusic.addEventListener('timeupdate', () => {
        // Volume check to ensure it stays soft (just in case browser resets it)
        if (bgMusic.volume !== softVolume) {
            bgMusic.volume = softVolume;
        }
        
        // Agar gaana chaltay huay hamare set kiye huay endTime (75s) par pahuche
        if (bgMusic.currentTime >= endTime) {
            bgMusic.currentTime = startTime; // Dobara 1:00 minute par bhej do
            bgMusic.play(); 
        }
    });

    // Manual Play/Stop Button Action
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.volume = softVolume;
            if (bgMusic.currentTime < startTime || bgMusic.currentTime > endTime) {
                bgMusic.currentTime = startTime;
            }
            bgMusic.play();
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<span class="music-icon">⏸️</span>';
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<span class="music-icon">🎵</span>';
        }
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

        function scratchMove(e) {
            if (!isDrawing) return;
            e.preventDefault();
            
            const currentPos = getMousePos(e);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 70; 

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

        // Desktop Interface
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

        // Mobile Interface
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
        countdownSection.classList.remove('hidden-initially');
        finalSection.classList.remove('hidden-initially');
        
        setTimeout(() => {
            countdownSection.style.opacity = '1';
            countdownSection.style.transform = 'translateY(0)';
            finalSection.style.opacity = '1';
            finalSection.style.transform = 'translateY(0)';
            
            countdownSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });

    // Countdown Clock Logic
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
