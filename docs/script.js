document.addEventListener('DOMContentLoaded', function () {
    const screen = document.querySelector('.cinema-count-screen');
    
    // --- 1. FUNCIÓN PARA REVELAR Y ANIMAR LOGO ---
    function revealLogos() {
        const logo = document.getElementById('logo1');
        if (!logo) return;
        
        const src = logo.getAttribute('data-gif-src') || 'elementos-web/logo-animado.gif';
        logo.setAttribute('data-gif-src', src);
        
        // Forzar reinicio del GIF
        logo.src = '';
        setTimeout(() => {
            logo.src = src;
            logo.classList.add('show');
        }, 60);
    }

    // --- 2. LÓGICA DEL CONTADOR (COUNTDOWN) ---
    (function() {
        if (window._cinemaCountdownRunning) return;
        window._cinemaCountdownRunning = true;

        function hideCinemaScreen() {
            const s = document.querySelector('.cinema-count-screen');
            if (!s) return;
            s.style.opacity = '0';
            setTimeout(() => {
                s.remove();
                if (typeof revealLogos === 'function') revealLogos();
            }, 600);
        }

        function initCountdown() {
            const el = document.getElementById('numbercnt');
            let sec = el ? parseInt(el.textContent.trim(), 10) : 10;
            if (el) el.textContent = sec;

            const id = setInterval(() => {
                sec -= 1;
                if (el) el.textContent = sec;
                if (sec <= 0) {
                    clearInterval(id);
                    hideCinemaScreen();
                }
            }, 1000);

            if (screen) {
                screen.addEventListener('click', () => {
                    clearInterval(id);
                    hideCinemaScreen();
                }, { once: true });
            }
        }
        initCountdown();
    })();
    
    // --- 3. LÓGICA DE BUTACAS (Asientos Aleatorios) ---
    (function() {
        const seats = Array.from(document.querySelectorAll(".seat"));
        const totalToMark = 52;

        if (seats.length === 0) return;

        const shuffled = seats.sort(() => Math.random() - 0.5);

        shuffled.slice(0, totalToMark).forEach(seat => {
            seat.classList.add("active");
        });
    })();
    
    // --- 4. CÓDIGO DEPENDIENTE DE JQUERY (Aseguramos que $ exista) ---
    if (typeof jQuery !== 'undefined') {
        
        // HANDLERS DE HOVER
        $("#links_rrss a, #smooth a").hover(
            function() { $(this).animate({ color: "#f0781d" }, 300); },
            function() { $(this).animate({ color: "#5A0F05" }, 300); }
        );

        // SCROLL REVEAL
        $(window).scroll(function() {
            $(".imagen, .flourish-embed").each(function() {
                if ($(this).offset().top < $(window).scrollTop() + $(window).height() - 150) {
                    $(this).animate({ opacity: 1, top: "0" }, 1000);
                }
            });
        });
        
        // LÓGICA DE INTERSECTION OBSERVER PARA VIDEOS
        const videos = $('video'); 
        const options = { root: null, rootMargin: '0px', threshold: 0.5 };

        const callback = (entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(error => { console.error('Autoplay failed:', error); });
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        };
        const observer = new IntersectionObserver(callback, options);
        videos.each(function() { observer.observe(this); });
    }

});

// --- Código de posicionamiento de la pantalla de conteo (Robusto) ---
(function() {
    const screen = document.querySelector('.cinema-count-screen');
    if (screen) {
        Object.assign(screen.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '999999'
        });
    }
})();