document.addEventListener('DOMContentLoaded', function () {
    // 1. Inicialización de Variables y Elementos Clave
    // Buscamos el contenedor principal de la pantalla de inicio
    const countdownScreen = document.querySelector('.cinema-count-screen');
    // Buscamos el elemento que muestra el número (clase .number)
    const countdownNumberElement = document.querySelector('.cinema-count-screen .number'); 
    
    // Si la pantalla de cuenta regresiva no existe, salimos
    if (!countdownScreen) {
        // Igualmente intentamos revelar el logo si no hay cuenta regresiva
        if (typeof revealLogos === 'function') revealLogos();
        return; 
    }

    // 2. Control de Reproducción de Videos (Intersection Observer)
    // El $ funciona ahora porque incluimos jQuery en el HTML
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
    window.revealLogos = revealLogos; // Hacemos la función disponible globalmente

    // 4. Hover handlers (usa jQuery)
    $("#links_rrss a, #smooth a").hover(
        function() { $(this).animate({ color: "#f0781d" }, 300); }, 
        function() { $(this).animate({ color: "#fff" }, 300); }
    );

    // 5. Scroll reveal (usa jQuery)
    $(window).scroll(function() {
        $(".imagen, .flourish-embed").each(function() {
            if ($(this).offset().top < $(window).scrollTop() + $(window).height()) {
                $(this).animate({ opacity: 1, top: "0" }, 1000);
            }
        });
    });

    // 6. Lógica de la Cuenta Regresiva
    
    function hideCinemaScreen(intervalId) {
        if (intervalId) clearInterval(intervalId); // Detiene el contador
        
        countdownScreen.style.transition = 'opacity 0.5s ease';
        countdownScreen.style.opacity = '0';
        
        setTimeout(() => {
            countdownScreen.remove(); // Quita el elemento del DOM
            revealLogos(); // Muestra el logo animado
        }, 600);
    }

    function initCountdown() {
        if (!countdownNumberElement) {
             hideCinemaScreen();
             return;
        }

        // Obtiene el número inicial (10, según tu HTML)
        let seconds = parseInt(countdownNumberElement.textContent.trim(), 10);
        if (isNaN(seconds) || seconds <= 0) seconds = 5; 
        
        countdownNumberElement.textContent = seconds; 

        // Inicia el temporizador
        const timerId = setInterval(() => {
            seconds -= 1;
            countdownNumberElement.textContent = seconds;

            if (seconds <= 0) {
                hideCinemaScreen(timerId);
            }
        }, 1000);

        // Permite saltar la cuenta al hacer clic
        countdownScreen.addEventListener('click', () => {
            hideCinemaScreen(timerId);
        }, { once: true });
    }

    // Ejecutar el contador si no se ha ejecutado ya
    if (!window._cinemaCountdownRunning) {
        window._cinemaCountdownRunning = true;
        initCountdown();
    }
    
    // Asegurar estilos de pantalla (por si acaso)
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
    // Asegurar que es el primer elemento del body
    if (countdownScreen.parentNode !== document.body) document.body.insertBefore(countdownScreen, document.body.firstChild);
});