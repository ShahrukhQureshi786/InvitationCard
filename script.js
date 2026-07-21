document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const openingScreen = document.getElementById('openingScreen');
    const waxSeal = document.getElementById('waxSeal');
    const invitationSection = document.getElementById('invitationSection');
    const continueBtn = document.getElementById('continueBtn');
    const countdownSection = document.getElementById('countdownSection');
    const finalSection = document.getElementById('finalSection');
    const particlesContainer = document.getElementById('particles');

    let isMusicPlaying = false;

    // 1. Generate Increased Floating Golden Dust Particles (80 Particles)
    function createParticles() {
        const particleCount = 80; // High particle count
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 6 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 7 + 4}s`;
            particle.style.animationDelay = `${Math.random() * 6}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // 2. Music Toggle Logic
    function toggleAudio() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.querySelector('.music-icon').textContent = '🔇';
        } else {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                musicToggle.querySelector('.music-icon').textContent = '🎵';
            }).catch(err => console.log("Audio play prevented:", err));
        }
        isMusicPlaying = !isMusicPlaying;
    }

    musicToggle.addEventListener('click', toggleAudio);

    // 3. 3D Door Flip Effect & Fixed Top Scroll
    waxSeal.addEventListener('click', () => {
        if (!isMusicPlaying) {
            toggleAudio();
        }

        // Add 'open' class to trigger 3D door swing animation
        openingScreen.classList.add('open');

        // Hide opening screen after animation and lock view right at the TOP
        setTimeout(() => {
            openingScreen.style.display = 'none';
            // Page ko bilkul top par scroll kar dega
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 1200);
    });

    // 4. Countdown & Final Display
    continueBtn.addEventListener('click', () => {
        countdownSection.classList.remove('hidden-initially');
        finalSection.classList.remove('hidden-initially');

        countdownSection.scrollIntoView({ behavior: 'smooth' });
    });

    // 5. Countdown Timer
    const targetDate = new Date('November 6, 2026 19:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days < 10 ? `0${days}` : days;
            document.getElementById('hours').textContent = hours < 10 ? `0${hours}` : hours;
            document.getElementById('minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
            document.getElementById('seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
});
