document.addEventListener('DOMContentLoaded', function () {
    // 1. Inicialización de Variables y Elementos Clave
    const countdownScreen = document.querySelector('.cinema-count-screen');
    // ⭐ CORRECCIÓN CLAVE: Buscamos directamente el ID 'numbercnt' que está en tu HTML ⭐
    const countdownNumberElement = document.getElementById('numbercnt'); 
    
    if (!countdownScreen) {
        if (typeof revealLogos === 'function') revealLogos();
        return; 
    }

    // 2. Control de Reproducción de Videos (Intersection Observer - Usa jQuery $)
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
                    // console.error('Autoplay failed:', error);
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

    // 3. Animación de Logos
    function revealLogos() {
        const logo = document.getElementById('logo1');
        if (!logo) return;
        
        const src = logo.getAttribute('data-gif-src') || 'elementos-web/logo-animado.gif';
        logo.setAttribute('data-gif-src', src);

        logo.src = '';
        setTimeout(() => {
            logo.src = src;
            logo.classList.add('show');
        }, 60);
    }
    window.revealLogos = revealLogos; 

    // 4. Hover handlers (Usa jQuery $)
    $("#links_rrss a, #smooth a").hover(
        function() { $(this).animate({ color: "#f0781d" }, 300); }, 
        function() { $(this).animate({ color: "#fff" }, 300); }
    );

    // 5. Scroll reveal (Usa jQuery $)
    $(window).scroll(function() {
        $(".imagen, .flourish-embed").each(function() {
            if ($(this).offset().top < $(window).scrollTop() + $(window).height()) {
                $(this).animate({ opacity: 1, top: "0" }, 1000);
            }
        });
    });

    // 6. Lógica de la Cuenta Regresiva
    
    function hideCinemaScreen(intervalId) {
        if (intervalId) clearInterval(intervalId);
        
        countdownScreen.style.transition = 'opacity 0.5s ease';
        countdownScreen.style.opacity = '0';
        
        setTimeout(() => {
            countdownScreen.remove(); 
            revealLogos(); 
        }, 600);
    }

    function initCountdown() {
        if (!countdownNumberElement) {
             console.error("Elemento de cuenta regresiva 'numbercnt' no encontrado.");
             hideCinemaScreen();
             return;
        }

        let seconds = parseInt(countdownNumberElement.textContent.trim(), 10);
        if (isNaN(seconds) || seconds <= 0) seconds = 5; 
        
        countdownNumberElement.textContent = seconds; 

        const timerId = setInterval(() => {
            seconds -= 1;
            countdownNumberElement.textContent = seconds;

            if (seconds <= 0) {
                hideCinemaScreen(timerId);
            }
        }, 1000);

        countdownScreen.addEventListener('click', () => {
            hideCinemaScreen(timerId);
        }, { once: true });
    }

    if (!window._cinemaCountdownRunning) {
        window._cinemaCountdownRunning = true;
        initCountdown();
    }
    
    // Asegurar estilos de pantalla
    Object.assign(countdownScreen.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '999999'
    });
    if (countdownScreen.parentNode !== document.body) document.body.insertBefore(countdownScreen, document.body.firstChild);
});