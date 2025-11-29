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

    // COUNTDOWN robusto (no se queda pegado en 10)
    if (!window._cinemaCountdownRunning) {
        window._cinemaCountdownRunning = true;

        // Obtener elemento y valor inicial
        const el = document.getElementById('numbercnt');
        let sec = 10;
        if (el) {
            const parsed = parseInt(el.textContent.trim(), 10);
            if (Number.isInteger(parsed) && !isNaN(parsed)) sec = parsed;
            el.textContent = sec; // mostrar valor inicial
        }

        // Intervalo que decrementa UNA vez por segundo
        const id = setInterval(() => {
            sec -= 1;
            if (el) el.textContent = sec;
            if (sec <= 0) {
                clearInterval(id);
                // ocultar pantalla e invocar revealLogos si existe
                const $screen = document.querySelector('.cinema-count-screen');
                if ($screen) {
                    // si jQuery está presente usa fadeOut, si no, remueve directamente
                    if (window.jQuery) {
                        window.jQuery($screen).fadeOut(600, function () { this.remove(); if (typeof revealLogos === 'function') revealLogos(); });
                    } else {
                        $screen.remove();
                        if (typeof revealLogos === 'function') revealLogos();
                    }
                } else if (typeof revealLogos === 'function') {
                    revealLogos();
                }
            }
        }, 1000);

        // click para saltar (limpia interval)
        const screen = document.querySelector('.cinema-count-screen');
        if (screen) {
            screen.addEventListener('click', () => {
                clearInterval(id);
                if (window.jQuery) {
                    window.jQuery(screen).stop(true,true).fadeOut(200, function() { this.remove(); if (typeof revealLogos === 'function') revealLogos(); });
                } else {
                    screen.remove();
                    if (typeof revealLogos === 'function') revealLogos();
                }
            }, { once: true });
        }
    }
});
