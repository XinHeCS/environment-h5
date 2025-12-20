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
});
