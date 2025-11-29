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

    // COUNTDOWN (función CodePen)
    let sec = parseInt($('#numbercnt').text(), 10);
    if (!Number.isInteger(sec) || isNaN(sec)) sec = 10;
    function contar() {
        $('#numbercnt').text(sec);
        if (sec > 0) {
            sec = sec - 1;
            setTimeout(contar, 1000);
        } else {
            $('.cinema-count-screen').fadeOut(600, function() {
                $(this).remove();
                revealLogos();
            });
        }
    }

    // click para saltar animación
    $('.cinema-count-screen').on('click', function() {
        $('.cinema-count-screen').stop(true,true).fadeOut(200, function() {
            $(this).remove();
            revealLogos();
        });
    });

    // iniciar cuenta con pequeño retardo
    setTimeout(contar, 300);
});