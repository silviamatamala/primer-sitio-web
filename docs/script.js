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

    // COUNTDOWN (versión robusta)
    if (!window._cinemaCountdownRunning) {
        window._cinemaCountdownRunning = true;

        // lee el valor inicial desde el DOM si existe, si no usa 10
        let sec = parseInt($('#numbercnt').text(), 10);
        if (!Number.isInteger(sec) || isNaN(sec)) sec = 10;
        $('#numbercnt').text(sec);

        // interval seguro
        const countdownInterval = setInterval(() => {
            sec -= 1;
            $('#numbercnt').text(sec);
            if (sec <= 0) {
                clearInterval(countdownInterval);
                $('.cinema-count-screen').fadeOut(600, function() {
                    $(this).remove();
                    if (typeof revealLogos === 'function') revealLogos();
                });
            }
        }, 1000);

        // permitir saltar con click (limpia interval)
        $('.cinema-count-screen').on('click', function() {
            clearInterval(countdownInterval);
            $('.cinema-count-screen').stop(true, true).fadeOut(200, function() {
                $(this).remove();
                if (typeof revealLogos === 'function') revealLogos();
            });
        });
    }
});
