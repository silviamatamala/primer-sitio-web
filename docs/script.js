$(document).ready(function() {
    const videos = $('video'); 
    
    const options = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.5 
    };

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            const video = entry.target; 
            if (entry.isIntersecting) {
                video.play().catch(error => {
                    console.error('Autoplay failed:', error);
                });
            } else {
                video.pause(); 
                video.currentTime = 0; 
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);

    videos.each(function() {
        observer.observe(this);
    });

    // Animar logos
    function revealLogos() {
        $("#logo1").animate({ opacity: 1, top: "50px" }, 1000);
        $("#logo2").animate({ opacity: 1, top: "50px" }, 1000);
    }

    // Hover handlers
    $("#links_rrss a, #smooth a").hover(
        function() { $(this).animate({ color: "#f0781d" }, 300); }, 
        function() { $(this).animate({ color: "#fff" }, 300); }
    );

    // Scroll reveal
    $(window).scroll(function() {
        $(".imagen, .flourish-embed").each(function() {
            if ($(this).offset().top < $(window).scrollTop() + $(window).height()) {
                $(this).animate({ opacity: 1, top: "0" }, 1000);
            }
        });
    });

    // --- replace countdown block with this plain JS fallback ---
    (function() {
        if (window._cinemaCountdownRunning) return;
        window._cinemaCountdownRunning = true;

        const el = document.getElementById('numbercnt');
        let sec = el ? parseInt(el.textContent.trim(), 10) : NaN;
        if (!Number.isInteger(sec) || isNaN(sec)) sec = 10;
        if (el) el.textContent = sec;

        const tick = () => {
            sec -= 1;
            if (el) el.textContent = sec;
            if (sec <= 0) {
                clearInterval(id);
                const screen = document.querySelector('.cinema-count-screen');
                if (screen) screen.remove();
                if (typeof revealLogos === 'function') revealLogos();
            }
        };

        const id = setInterval(tick, 1000);

        // permitir salto con click
        const screen = document.querySelector('.cinema-count-screen');
        if (screen) {
            screen.addEventListener('click', () => {
                clearInterval(id);
                screen.remove();
                if (typeof revealLogos === 'function') revealLogos();
            }, { once: true });
        }
    })();
});
