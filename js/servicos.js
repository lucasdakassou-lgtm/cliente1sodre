// js/servicos.js

document.addEventListener('DOMContentLoaded', function() {

    // =====================================================
    // NOVO: SLIDER ANTES/DEPOIS (igual seu modelo)
    // =====================================================

    function initBeforeAfterSlider(wrapper) {
        const scroller = wrapper.querySelector('.scroller');
        const after = wrapper.querySelector('.after');
        let active = false;

        function scrollIt(x) {
            const rect = wrapper.getBoundingClientRect();
            let transform = x - rect.left;
            transform = Math.max(0, Math.min(transform, rect.width));

            after.style.width = transform + "px";
            scroller.style.left = transform + "px";
        }

        // estado inicial
        scrollIt(wrapper.getBoundingClientRect().left + (wrapper.offsetWidth / 2));

        scroller.addEventListener('mousedown', function() {
            active = true;
            scroller.classList.add('scrolling');
        });

        document.body.addEventListener('mouseup', function() {
            active = false;
            scroller.classList.remove('scrolling');
        });

        document.body.addEventListener('mouseleave', function() {
            active = false;
            scroller.classList.remove('scrolling');
        });

        document.body.addEventListener('mousemove', function(e) {
            if (!active) return;
            scrollIt(e.pageX);
        });

        // touch
        scroller.addEventListener('touchstart', function() {
            active = true;
            scroller.classList.add('scrolling');
        });

        document.body.addEventListener('touchend', function() {
            active = false;
            scroller.classList.remove('scrolling');
        });

        document.body.addEventListener('touchcancel', function() {
            active = false;
            scroller.classList.remove('scrolling');
        });

        document.body.addEventListener('touchmove', function(e) {
            if (!active) return;
            scrollIt(e.touches[0].pageX);
        });
    }

    document.querySelectorAll('.ba-wrapper').forEach(initBeforeAfterSlider);

    // =====================================================
    // NOVO: CARROSSEL (track + dots) - reutilizável
    // =====================================================

    function setupTrackCarousel({
        track,
        prevBtn,
        nextBtn,
        dotsWrap,
        slideSelector,
        onSlideChange
    }) {
        const slides = Array.from(track.querySelectorAll(slideSelector));
        let index = 0;

        function renderDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = "";
            slides.forEach((_, i) => {
                const b = document.createElement('button');
                b.className = (dotsWrap.id.includes('ba') ? 'ba-dot' : 'mp4-dot') + (i === index ? ' active' : '');
                b.type = 'button';
                b.setAttribute('aria-label', `Ir para o item ${i + 1}`);
                b.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(b);
            });
        }

        function goTo(i) {
            index = (i + slides.length) % slides.length;
            track.style.transform = `translateX(-${index * 100}%)`;
            renderDots();
            if (typeof onSlideChange === 'function') onSlideChange(index);
        }

        function next() { goTo(index + 1); }
        function prev() { goTo(index - 1); }

        if (nextBtn) nextBtn.addEventListener('click', next);
        if (prevBtn) prevBtn.addEventListener('click', prev);

        // swipe mobile simples
        let startX = 0;
        let dragging = false;

        track.addEventListener('touchstart', (e) => {
            dragging = true;
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!dragging) return;
            dragging = false;
            const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
            const diff = endX - startX;
            if (Math.abs(diff) > 40) {
                if (diff < 0) next();
                else prev();
            }
        }, { passive: true });

        // inicia
        goTo(0);
    }

    // Antes/Depois carousel
    const baTrack = document.getElementById('baTrack');
    const baPrev = document.querySelector('.ba-prev');
    const baNext = document.querySelector('.ba-next');
    const baDots = document.getElementById('baDots');

    if (baTrack && baPrev && baNext) {
        setupTrackCarousel({
            track: baTrack,
            prevBtn: baPrev,
            nextBtn: baNext,
            dotsWrap: baDots,
            slideSelector: '.ba-slide',
            onSlideChange: () => {
                // re-inicializa slider quando muda slide (garante posições corretas)
                document.querySelectorAll('.ba-wrapper').forEach(initBeforeAfterSlider);
            }
        });
    }

    // Vídeos carousel
    const mp4Track = document.getElementById('mp4Track');
    const mp4Prev = document.querySelector('.mp4-prev');
    const mp4Next = document.querySelector('.mp4-next');
    const mp4Dots = document.getElementById('mp4Dots');

    if (mp4Track && mp4Prev && mp4Next) {
        setupTrackCarousel({
            track: mp4Track,
            prevBtn: mp4Prev,
            nextBtn: mp4Next,
            dotsWrap: mp4Dots,
            slideSelector: '.mp4-slide',
            onSlideChange: () => {
                // pausa vídeos ao trocar de slide
                document.querySelectorAll('.mp4-video').forEach(v => {
                    try { v.pause(); } catch (e) {}
                });
            }
        });
    }

    // =====================================================
    // MANTIDO: ANIMAÇÃO DOS SERVIÇOS (IntersectionObserver)
    // =====================================================

    const serviceItems = document.querySelectorAll('.service-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 200);
            }
        });
    }, observerOptions);
    
    serviceItems.forEach(item => {
        serviceObserver.observe(item);
    });

    // =====================================================
    // MANTIDO: CALCULADORA RÁPIDA DE ECONOMIA (tooltip)
    // =====================================================

    const serviceCards = document.querySelectorAll('.service-item');

    serviceCards.forEach(card => {
        const benefits = card.querySelector('.service-benefits');
        if (benefits) {
            benefits.addEventListener('click', function() {
                const serviceName = card.querySelector('h4').textContent;
                let economy = 0;

                if (serviceName.includes('Limpeza')) economy = 25;
                if (serviceName.includes('Manutenção')) economy = 30;
                if (serviceName.includes('Reparo')) economy = 40;
                if (serviceName.includes('Instalação')) economy = 50;

                if (economy > 0) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'economy-tooltip';
                    tooltip.innerHTML = `
                        <i class="fas fa-coins"></i>
                        <strong>Economia estimada: ${economy}%</strong>
                        <p>na conta de energia</p>
                    `;
                    tooltip.style.cssText = `
                        position: absolute;
                        background: var(--secondary);
                        color: white;
                        padding: 1rem;
                        border-radius: var(--radius);
                        z-index: 100;
                        animation: fadeIn 0.3s ease;
                        box-shadow: var(--shadow);
                    `;
                    
                    card.appendChild(tooltip);

                    setTimeout(() => {
                        tooltip.remove();
                    }, 3000);
                }
            });
        }
    });

    // =====================================================
    // MANTIDO: BOTÃO DE AGENDAMENTO DIRETO EM CADA SERVIÇO
    // =====================================================

    serviceItems.forEach(item => {
        const btn = document.createElement('a');
        btn.className = 'btn btn-primary btn-sm';
        btn.innerHTML = '<i class="fas fa-calendar-alt"></i> Agendar';
        btn.href = 'agendamento.html';
        btn.style.marginTop = '1rem';
        btn.style.display = 'inline-block';
        
        const p = item.querySelector('p');
        if (p) {
            p.insertAdjacentElement('afterend', btn);
        }
    });

    // =====================================================
    // MANTIDO: ANIMAÇÃO DE ENTRADA DO PROCESSO
    // =====================================================

    document.querySelectorAll('.process-step').forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
});

// Mantido (caso você use em outras partes no futuro)
function openVideoModal(videoId, title) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; width: 100%;">
            <button class="close-modal" style="
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
            ">&times;</button>
            <h3 style="color: white; margin-bottom: 1rem;">${title}</h3>
            <div style="position: relative; padding-bottom: 56.25%; height: 0;">
                <iframe src="${videoId}" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
