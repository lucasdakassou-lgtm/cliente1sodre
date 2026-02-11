// js/servicos.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== INICIALIZAR SWIPER ==========
    const videoSwiper = new Swiper('.videoSwiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        
        // Breakpoints
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        },
        
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Autoplay
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        
        // Effect
        effect: 'slide',
        speed: 600
    });
    
    // ========== CONTROLE DE VÍDEOS ==========
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const videoSide = this.closest('.video-side');
            const videoCard = this.closest('.video-card');
            const title = videoCard.querySelector('h4').textContent;
            
            // Simular abertura de vídeo (substituir por vídeos reais)
            alert(`Abrindo vídeo: ${title}\n\nSubstitua este placeholder por:\n1. Vídeo do YouTube/Vimeo\n2. Modal com player\n3. Link para canal`);
            
            // Exemplo de como implementar modal:
            /*
            const modal = document.createElement('div');
            modal.className = 'video-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <iframe src="https://www.youtube.com/embed/VIDEO_ID" 
                            frameborder="0" 
                            allowfullscreen>
                    </iframe>
                </div>
            `;
            document.body.appendChild(modal);
            */
        });
        
        // Efeito hover
        placeholder.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.querySelector('i').style.transform = 'scale(1.2)';
        });
        
        placeholder.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.querySelector('i').style.transform = 'scale(1)';
        });
    });
    
    // ========== BOTÃO "VER TODOS OS VÍDEOS" ==========
    const playAllBtn = document.querySelector('.play-all');
    if (playAllBtn) {
        playAllBtn.addEventListener('click', function() {
            // Implemente aqui a lógica para mostrar todos os vídeos
            alert('Funcionalidade "Ver Todos os Vídeos":\n\n1. Abrir galeria modal\n2. Lista completa de vídeos\n3. Playlist do YouTube');
            
            // Exemplo:
            // openVideoGallery();
        });
    }
    
    // ========== ANIMAÇÃO DOS SERVIÇOS ==========
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
    
    // ========== CALCULADORA RÁPIDA DE ECONOMIA ==========
    const serviceCards = document.querySelectorAll('.service-item');
    
    serviceCards.forEach(card => {
        const benefits = card.querySelector('.service-benefits');
        if (benefits) {
            benefits.addEventListener('click', function() {
                const serviceName = card.querySelector('h4').textContent;
                let economy = 0;
                
                // Valores de economia estimada por serviço
                if (serviceName.includes('Limpeza')) economy = 25;
                if (serviceName.includes('Manutenção')) economy = 30;
                if (serviceName.includes('Reparo')) economy = 40;
                if (serviceName.includes('Instalação')) economy = 50;
                
                if (economy > 0) {
                    // Criar tooltip de economia
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
    
    // ========== BOTÃO DE AGENDAMENTO DIRETO ==========
    // Adicionar botão de agendamento rápido em cada serviço
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
    
    // ========== ANIMAÇÃO DE ENTRADA ==========
    // Adicionar classe para animação
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

// Função para abrir modal de vídeo (implementar se necessário)
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
                <iframe src="https://www.youtube.com/embed/${videoId}" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}