document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;
    const totalPages = pages.length;
    let isAnimating = false;

    // Initialize
    showPage(currentPage);

    // Function to switch pages
    function showPage(index) {
        if (index < 0 || index >= totalPages) return;
        
        isAnimating = true;
        
        // Remove active class from all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Add active class to current page
        pages[index].classList.add('active');
        
        currentPage = index;

        // Reset animation lock after a short delay
        setTimeout(() => {
            isAnimating = false;
        }, 1000); // Match this with CSS transition/animation time if needed
    }

    function nextPage() {
        if (currentPage < totalPages - 1 && !isAnimating) {
            showPage(currentPage + 1);
        }
    }

    function prevPage() {
        if (currentPage > 0 && !isAnimating) {
            showPage(currentPage - 1);
        }
    }

    // Mouse Wheel Event
    document.addEventListener('wheel', (e) => {
        if (e.deltaY > 0) {
            nextPage();
        } else {
            prevPage();
        }
    });

    // Touch Events for Mobile
    let startY = 0;
    let endY = 0;

    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent default scrolling
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50; // Minimum distance for swipe
        if (startY - endY > threshold) {
            nextPage(); // Swipe Up
        } else if (endY - startY > threshold) {
            prevPage(); // Swipe Down
        }
    }
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            nextPage();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            prevPage();
        }
    });

    // Music Control Logic
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    
    // Set default volume (Low)
    bgMusic.volume = 0.1;

    function toggleMusic() {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
            }).catch(error => {
                console.log("Playback failed:", error);
            });
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        }
    }

    musicToggle.addEventListener('click', toggleMusic);

    // Attempt to play automatically
    bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
    }).catch(() => {
        console.log("Autoplay blocked. Waiting for user interaction.");
        
        const startMusic = () => {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                // Only remove listeners if playback actually started
                document.removeEventListener('click', startMusic);
                document.removeEventListener('touchstart', startMusic);
                document.removeEventListener('keydown', startMusic);
            }).catch(error => {
                console.log("Interaction failed to start music:", error);
            });
        };

        // Only listen for "trusted" events that allow audio playback
        document.addEventListener('click', startMusic);
        document.addEventListener('touchstart', startMusic);
        document.addEventListener('keydown', startMusic);
    });
});
