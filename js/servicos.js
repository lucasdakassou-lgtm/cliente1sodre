document.addEventListener("DOMContentLoaded", () => {
    // menu mobile
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });
    }

    // sombra no header
    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {
        if (!header) return;
        header.style.boxShadow =
            window.scrollY > 10 ? "0 10px 30px rgba(0,0,0,.10)" : "none";
    });

    // scroll suave
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

            if (nav) nav.classList.remove("active");
            if (menuToggle) menuToggle.classList.remove("active");
        });
    });

    // animação
    const fadeEls = document.querySelectorAll(".fade-in");
    if (fadeEls.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            { threshold: 0.12 }
        );

        fadeEls.forEach((el) => observer.observe(el));
    }

    // carrossel genérico
    function setupCarousel({ trackId, slideClass, prevClass, nextClass, dotsId, dotClass }) {
        const track = document.getElementById(trackId);
        const prevBtn = document.querySelector(prevClass);
        const nextBtn = document.querySelector(nextClass);
        const dotsWrap = document.getElementById(dotsId);

        if (!track) return;

        const slides = Array.from(track.querySelectorAll(slideClass));
        if (!slides.length) return;

        let index = 0;

        function renderDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = "";

            slides.forEach((_, i) => {
                const dot = document.createElement("button");
                dot.className = `${dotClass}${i === index ? " active" : ""}`;
                dot.type = "button";
                dot.addEventListener("click", () => goTo(i));
                dotsWrap.appendChild(dot);
            });
        }

        function goTo(i) {
            index = (i + slides.length) % slides.length;
            track.style.transform = `translateX(-${index * 100}%)`;
            renderDots();

            document.querySelectorAll(".mp4-video").forEach((video) => {
                try {
                    video.pause();
                } catch (_) {}
            });
        }

        if (prevBtn) prevBtn.addEventListener("click", () => goTo(index - 1));
        if (nextBtn) nextBtn.addEventListener("click", () => goTo(index + 1));

        let startX = 0;

        track.addEventListener(
            "touchstart",
            (e) => {
                startX = e.touches[0].clientX;
            },
            { passive: true }
        );

        track.addEventListener(
            "touchend",
            (e) => {
                const endX = e.changedTouches[0].clientX;
                const diff = endX - startX;

                if (Math.abs(diff) > 40) {
                    if (diff < 0) goTo(index + 1);
                    else goTo(index - 1);
                }
            },
            { passive: true }
        );

        goTo(0);
    }

    // imagens
    setupCarousel({
        trackId: "baTrack",
        slideClass: ".ba-slide",
        prevClass: ".ba-prev",
        nextClass: ".ba-next",
        dotsId: "baDots",
        dotClass: "ba-dot",
    });

    // vídeos
    setupCarousel({
        trackId: "mp4Track",
        slideClass: ".mp4-slide",
        prevClass: ".mp4-prev",
        nextClass: ".mp4-next",
        dotsId: "mp4Dots",
        dotClass: "mp4-dot",
    });
});
