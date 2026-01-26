document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.glass-nav');
    
    // Function to handle scroll and toggle navbar background
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Navbar scroll effect
        if (scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Parallax updates - using CSS variables for performance
        document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
    };

    // Initial check on load
    handleScroll();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Reveal animations
    const reveals = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
});
