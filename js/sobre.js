// js/sobre.js - VERSÃO PARA EMPRESA INDIVIDUAL

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ANIMAÇÕES DA TIMELINE ==========
    initTimelineAnimation();
    initCounters();
    initSpecialtiesHover();
    
    function initTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                        
                        // Adicionar efeito de destaque
                        const year = entry.target.querySelector('.timeline-year');
                        if (year) {
                            year.style.color = '#00CC99';
                            year.style.transform = 'scale(1.1)';
                            year.style.transition = 'color 0.3s ease, transform 0.3s ease';
                        }
                    }, index * 300);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }
    
    // ========== CONTADORES ANIMADOS ==========
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    
                    animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
                
                // Adicionar símbolo de "+" se for mais que 100
                if (target >= 100) {
                    element.textContent = target + '+';
                }
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }
    
    // ========== EFEITOS NAS ESPECIALIDADES ==========
    function initSpecialtiesHover() {
        const specialtyItems = document.querySelectorAll('.specialty-item');
        
        specialtyItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.specialty-icon');
                const certs = this.querySelectorAll('.cert-badge');
                
                if (icon) {
                    icon.style.transform = 'rotate(15deg) scale(1.1)';
                    icon.style.transition = 'transform 0.3s ease';
                }
                
                certs.forEach(badge => {
                    badge.style.transform = 'translateY(-3px)';
                    badge.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                    badge.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                });
            });
            
            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.specialty-icon');
                const certs = this.querySelectorAll('.cert-badge');
                
                if (icon) {
                    icon.style.transform = 'rotate(0) scale(1)';
                }
                
                certs.forEach(badge => {
                    badge.style.transform = 'translateY(0)';
                    badge.style.boxShadow = 'none';
                });
            });
        });
    }
    
    // ========== ANIMAÇÃO DAS FERRAMENTAS ==========
    function initToolsAnimation() {
        const toolItems = document.querySelectorAll('.tool-item');
        
        toolItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100 + (index * 100));
        });
    }
    
    // ========== EFEITO DE DIGITAÇÃO NO TÍTULO ==========
    function initTypewriter() {
        const heroTitle = document.querySelector('.hero-content h1');
        if (!heroTitle) return;
        
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        
        // Iniciar quando a seção for visível
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                observer.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });
        
        observer.observe(heroTitle);
    }
    
    // ========== INTERATIVIDADE NA FILOSOFIA ==========
    function initPhilosophyInteraction() {
        const philosophyCards = document.querySelectorAll('.philosophy-card');
        
        philosophyCards.forEach(card => {
            card.addEventListener('click', function() {
                // Destacar card clicado
                philosophyCards.forEach(c => {
                    c.style.borderTopColor = 'var(--primary)';
                    c.style.boxShadow = 'var(--shadow)';
                });
                
                this.style.borderTopColor = 'var(--secondary)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                
                // Mostrar mensagem
                const title = this.querySelector('h3').textContent;
                console.log(`Filosofia: ${title} - Um dos pilares do meu trabalho.`);
            });
        });
    }
    
    // ========== ANIMAÇÃO DE ENTRADA DAS VANTAGENS ==========
    function initAdvantagesAnimation() {
        const advantageCards = document.querySelectorAll('.advantage-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        
                        // Animação do ícone
                        const icon = entry.target.querySelector('.advantage-icon');
                        if (icon) {
                            icon.style.transform = 'rotateY(360deg)';
                            icon.style.transition = 'transform 0.8s ease';
                        }
                    }, index * 200);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        advantageCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    // ========== BOTÃO DE CONTATO DINÂMICO ==========
    function initContactButtons() {
        const contactButtons = document.querySelectorAll('.method-content .btn');
        
        contactButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
            
            button.addEventListener('click', function(e) {
                // Feedback visual
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                // Rastreamento (simulado)
                const method = this.closest('.method-card').querySelector('h4').textContent;
                console.log(`Contato via ${method} iniciado - Felipe Sodré`);
            });
        });
    }
    
    // ========== INICIALIZAR TUDO ==========
    setTimeout(() => {
        initTypewriter();
        initToolsAnimation();
        initPhilosophyInteraction();
        initAdvantagesAnimation();
        initContactButtons();
    }, 500);
    
    // ========== EFEITO DE SCROLL SUAVE PARA LINKS INTERNOS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Feedback visual
                this.style.color = 'var(--secondary)';
                setTimeout(() => {
                    this.style.color = '';
                }, 1000);
            }
        });
    });
    
    console.log('Sobre.js - Felipe Sodré carregado com sucesso!');
});