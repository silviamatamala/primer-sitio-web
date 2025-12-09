document.addEventListener('DOMContentLoaded', function () {

    // --- 1. REFERENCIAS Y VARIABLES CLAVE ---
    const countdownScreen = document.querySelector('.cinema-count-screen');
    const countdownNumberElement = document.getElementById('numbercnt'); 
    
    // Si no encontramos la pantalla inicial, no podemos ejecutar el conteo.
    if (!countdownScreen) {
        if (typeof revealLogos === 'function') revealLogos();
        return; 
    }
    
    // --- 2. LÓGICA DE LA CUENTA REGRESIVA Y OCULTAMIENTO ---

    function hideCinemaScreen(intervalId) {
        if (intervalId) clearInterval(intervalId);
        
        countdownScreen.style.transition = 'opacity 0.5s ease';
        countdownScreen.style.opacity = '0';
        
        setTimeout(() => {
            countdownScreen.remove(); 
            // Llamamos a revealLogos (la definimos más abajo)
            if (typeof revealLogos === 'function') revealLogos(); 
        }, 600);
    }

    function initCountdown() {
        if (!countdownNumberElement) {
             // Si el número no existe, simplemente ocultamos la pantalla
             hideCinemaScreen();
             return;
        }

        let seconds = parseInt(countdownNumberElement.textContent.trim(), 10);
        // Usar 10 si el valor inicial de HTML no es un número válido
        if (isNaN(seconds) || seconds <= 0) seconds = 10; 
        
        countdownNumberElement.textContent = seconds; 

        // El corazón del conteo: usa setInterval
        const timerId = setInterval(() => {
            seconds -= 1;
            countdownNumberElement.textContent = seconds;

            if (seconds <= 0) {
                hideCinemaScreen(timerId); // Detiene y oculta al llegar a 0
            }
        }, 1000);

        // Permite saltar al hacer clic en cualquier parte de la pantalla
        countdownScreen.addEventListener('click', () => {
            hideCinemaScreen(timerId);
        }, { once: true });
    }
    
    // Ejecutar el contador inmediatamente
    initCountdown();

    // --- 3. FUNCIONES COMPLEMENTARIAS (Animación y jQuery) ---
    
    // Definición de revealLogos (Usado por hideCinemaScreen)
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
    window.revealLogos = revealLogos; // Se hace global para asegurar el acceso

    // Aseguramos que jQuery exista antes de usarlo (solo para depuración)
    if (typeof $ === 'undefined') {
        console.error("jQuery no está definido. Los efectos de hover y scroll no funcionarán.");
        return;
    }

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

    // 6. Control de Reproducción de Videos (Intersection Observer - usa jQuery)
    const videos = $('video'); 
    const options = { root: null, rootMargin: '0px', threshold: 0.5 };
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            const video = entry.target; 
            if (entry.isIntersecting) {
                video.play().catch(error => { /* Autoplay failed */ });
            } else {
                video.pause(); 
                video.currentTime = 0; 
            }
        });
    };
    const observer = new IntersectionObserver(callback, options);
    videos.each(function() { observer.observe(this); });


    // --- 7. ESTILOS DE PANTALLA FINALES (Para asegurar posición) ---
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