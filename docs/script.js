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

    // COUNTDOWN (CodePen) usando la función solicitada
    var sec = 10;
    function contar(){
      sec = sec - 1;
      var obj = document.getElementById("numbercnt");
      if (obj) obj.innerHTML = sec;
      if (sec > 0) {
        setTimeout(contar, 1000);
      } else {
        // al terminar, ocultar pantalla de inicio y revelar logos
        $('.cinema-count-screen').fadeOut(600, function() {
          $(this).remove();
          revealLogos();
        });
      }
    }
    // iniciar la cuenta con pequeño retardo
    setTimeout(contar, 300);
});
