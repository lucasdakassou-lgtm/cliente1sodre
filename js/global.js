// js/global.js

document.addEventListener('DOMContentLoaded', function() {
  
  // ========== MENU MOBILE ==========
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Troca ícone
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('active') 
          ? 'fas fa-times'
          : 'fas fa-bars';
      }
    });
    
    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        if (menuToggle.querySelector('i')) {
          menuToggle.querySelector('i').className = 'fas fa-bars';
        }
      });
    });
  }
  
  // ========== ATIVAR LINK ATUAL ==========
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-links a').forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  setActiveNavLink();
  
  // ========== HEADER SCROLL EFFECT ==========
  let lastScroll = 0;
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        return;
      }
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scroll down
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scroll up
        header.style.transform = 'translateY(0)';
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // ========== ANIMAÇÃO AO ROLAR ==========
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observar elementos para animação
  document.querySelectorAll('.service-card, .stat-card, .team-card').forEach(el => {
    observer.observe(el);
  });
  
  // ========== ANIMAÇÃO DE CONTAGEM ==========
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start) + (element.textContent.includes('%') ? '%' : '+');
      }
    }, 16);
  }
  
  // Ativar contadores quando visíveis
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'));
          if (!isNaN(target)) {
            animateCounter(counter, target);
          }
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  // Observar seção de estatísticas
  const statsSection = document.querySelector('.economy-section, .stats-section');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }
  
  // ========== VALIDAÇÃO DE FORMULÁRIO BASE ==========
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const inputs = this.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        const errorMsg = input.nextElementSibling?.classList.contains('error-message') 
          ? input.nextElementSibling 
          : null;
          
        if (!input.value.trim()) {
          input.classList.add('error');
          if (errorMsg) {
            errorMsg.textContent = 'Este campo é obrigatório';
            errorMsg.classList.add('show');
          }
          isValid = false;
        } else {
          input.classList.remove('error');
          if (errorMsg) {
            errorMsg.classList.remove('show');
          }
        }
      });
      
      if (isValid) {
        // Aqui você pode adicionar o envio do formulário
        console.log('Formulário válido, enviando...');
        // Exibir mensagem de sucesso
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success';
        successMsg.textContent = 'Mensagem enviada com sucesso!';
        successMsg.style.cssText = `
          background: var(--secondary);
          color: white;
          padding: 1rem;
          border-radius: var(--radius);
          margin-top: 1rem;
          text-align: center;
        `;
        form.appendChild(successMsg);
        form.reset();
        
        setTimeout(() => successMsg.remove(), 5000);
      }
    });
  });
  
  // ========== TOOLTIPS ==========
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(el => {
    el.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('data-tooltip');
      tooltip.style.cssText = `
        position: absolute;
        background: var(--dark);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        transform: translateY(-100%);
        margin-top: -10px;
      `;
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
      tooltip.style.top = rect.top + 'px';
      
      this._tooltip = tooltip;
    });
    
    el.addEventListener('mouseleave', function() {
      if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
      }
    });
  });
});