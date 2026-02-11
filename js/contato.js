// js/contato.js - VERSÃO SIMPLES (SÓ WHATSAPP)

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== MÁSCARA DE TELEFONE ==========
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d{0,2})/, '($1');
            }
            
            e.target.value = value;
        });
    }
    
    // ========== DATA MÍNIMA (HOJE) ==========
    const dataInput = document.getElementById('data');
    if (dataInput) {
        const today = new Date().toISOString().split('T')[0];
        dataInput.min = today;
    }
    
    // ========== ENVIO DO FORMULÁRIO - SÓ WHATSAPP ==========
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const successNome = document.getElementById('successNome');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const nome = document.getElementById('nome');
            const email = document.getElementById('email');
            const telefone = document.getElementById('telefone');
            const mensagem = document.getElementById('mensagem');
            
            // Limpar mensagens de erro
            document.querySelectorAll('.error-message').forEach(el => {
                el.classList.remove('show');
                el.textContent = '';
            });
            
            // Validar nome
            if (!nome.value.trim()) {
                showError(nome, 'Digite seu nome completo');
                isValid = false;
            }
            
            // Validar email
            if (!email.value.trim()) {
                showError(email, 'Digite seu e-mail');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Digite um e-mail válido');
                isValid = false;
            }
            
            // Validar telefone
            if (!telefone.value.trim()) {
                showError(telefone, 'Digite seu telefone');
                isValid = false;
            } else if (telefone.value.replace(/\D/g, '').length < 10) {
                showError(telefone, 'Digite um telefone válido com DDD');
                isValid = false;
            }
            
            // Validar mensagem (mínimo 10 caracteres)
            if (mensagem.value.trim().length < 10) {
                showError(mensagem, 'Descreva melhor o que você precisa (mínimo 10 caracteres)');
                isValid = false;
            }
            
            if (isValid) {
                // 🔵 MOSTRAR LOADING NO BOTÃO
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
                
                // 🔵 COLETAR TODOS OS DADOS DO FORMULÁRIO
                const formData = {
                    nome: nome.value.trim(),
                    telefone: telefone.value.trim(),
                    email: email.value.trim(),
                    servico: document.getElementById('servico')?.value || 'Não especificado',
                    data: document.getElementById('data')?.value || 'Não informada',
                    horario: document.getElementById('horario')?.value || 'Não informado',
                    endereco: document.getElementById('endereco')?.value || 'Não informado',
                    mensagem: mensagem.value.trim(),
                    timestamp: new Date().toLocaleString('pt-BR')
                };
                
                // 🔵 GERAR TEXTO PARA O WHATSAPP
                const textoWhatsApp = gerarTextoWhatsApp(formData);
                
                // 🔵 ABRIR WHATSAPP DO FELIPE
                setTimeout(() => {
                    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(textoWhatsApp)}`, '_blank');
                }, 500);
                
                // 🔵 SALVAR NO HISTÓRICO LOCAL (BACKUP)
                salvarHistoricoLocal(formData);
                
                // 🔵 MOSTRAR MENSAGEM DE SUCESSO
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formSuccess.classList.remove('hidden');
                    
                    if (successNome) {
                        successNome.textContent = formData.nome.split(' ')[0];
                    }
                    
                    // Limpar formulário
                    contactForm.reset();
                    localStorage.removeItem('artechContactForm');
                    
                    // Restaurar botão (pro caso de voltar)
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 800);
            }
        });
    }
    
    // ========== FUNÇÃO PARA GERAR TEXTO DO WHATSAPP ==========
    function gerarTextoWhatsApp(dados) {
        return `🆕 *NOVO AGENDAMENTO - ARTECH*
    
*👤 Cliente:* ${dados.nome}
*📱 Telefone:* ${dados.telefone}
*📧 E-mail:* ${dados.email}
*🔧 Serviço:* ${dados.servico}
*📅 Data preferida:* ${dados.data}
*⏰ Horário preferido:* ${dados.horario}
*📍 Endereço:* ${dados.endereco}

*💬 Mensagem do cliente:*
${dados.mensagem}

---
⏱️ Enviado em: ${dados.timestamp}
🌐 Via Site ARTECH - Contato direto com Felipe`;
    }
    
    // ========== FUNÇÃO PARA SALVAR HISTÓRICO LOCAL ==========
    function salvarHistoricoLocal(dados) {
        try {
            const historico = JSON.parse(localStorage.getItem('artechAgendamentos') || '[]');
            historico.unshift(dados);
            
            // Manter últimos 5 agendamentos apenas
            if (historico.length > 5) historico.pop();
            
            localStorage.setItem('artechAgendamentos', JSON.stringify(historico));
            console.log('✅ Agendamento salvo no histórico local');
        } catch (e) {
            console.log('⚠️ Erro ao salvar histórico:', e);
        }
    }
    
    // ========== FUNÇÃO PARA MOSTRAR ERRO ==========
    function showError(input, message) {
        input.classList.add('error');
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorEl = this.nextElementSibling;
            if (errorEl && errorEl.classList.contains('error-message')) {
                errorEl.classList.remove('show');
            }
        }, { once: true });
    }
    
    // ========== FUNÇÃO PARA VALIDAR E-MAIL ==========
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // ========== FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });
    
    // Abrir primeiro FAQ por padrão
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
    
    // ========== ANIMAÇÕES SIMPLES ==========
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.channel-card, .quick-contact-item, .area-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
    
    initAnimations();
    
    // ========== STATUS ONLINE SIMULADO ==========
    function updateOnlineStatus() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        const statusElements = document.querySelectorAll('.status-online, .availability-badge i');
        
        let isOnline = false;
        
        // Segunda a sexta: 8h-18h
        if (day >= 1 && day <= 5 && hour >= 8 && hour < 18) {
            isOnline = true;
        }
        // Sábado: 8h-12h
        else if (day === 6 && hour >= 8 && hour < 12) {
            isOnline = true;
        }
        
        statusElements.forEach(el => {
            if (el.classList.contains('status-online')) {
                if (isOnline) {
                    el.innerHTML = '<i class="fas fa-circle"></i> Online agora';
                    el.style.color = '#25D366';
                } else {
                    el.innerHTML = '<i class="fas fa-circle"></i> Respondo em até 1h';
                    el.style.color = '#6C757D';
                }
            }
        });
    }
    
    updateOnlineStatus();
    setInterval(updateOnlineStatus, 60000);
    
    // ========== CARREGAR DADOS SALVOS ==========
    function loadFormData() {
        const savedData = localStorage.getItem('artechContactForm');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.value = data[id];
                }
            });
        }
    }
    
    loadFormData();
    
    // ========== SALVAR RASCUNHO AUTOMÁTICO ==========
    if (contactForm) {
        contactForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', debounce(function() {
                const formData = {};
                contactForm.querySelectorAll('input, select, textarea').forEach(field => {
                    if (field.id && field.type !== 'checkbox' && field.type !== 'submit') {
                        formData[field.id] = field.value;
                    }
                });
                localStorage.setItem('artechContactForm', JSON.stringify(formData));
            }, 1000));
        });
    }
    
    // ========== DEBOUNCE ==========
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    console.log('📱 Contato.js carregado! Felipe Sodré - WhatsApp configurado.');
});