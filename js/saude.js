// js/saude.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== CHECKLIST INTERATIVO ==========
    initChecklist();
    initAnimations();
    
    function initChecklist() {
        const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        const calculateBtn = document.getElementById('calculateRisk');
        const resultText = document.getElementById('resultText');
        
        // Atualizar resultado quando marcar/desmarcar
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateChecklistResult);
        });
        
        // Botão de calcular risco
        if (calculateBtn) {
            calculateBtn.addEventListener('click', function() {
                const checkedCount = document.querySelectorAll('.checklist-item input:checked').length;
                showRiskResult(checkedCount);
            });
        }
        
        // Resultado inicial
        updateChecklistResult();
    }
    
    function updateChecklistResult() {
        const checkedCount = document.querySelectorAll('.checklist-item input:checked').length;
        const resultText = document.getElementById('resultText');
        
        if (!resultText) return;
        
        let message = '';
        let color = '';
        
        switch (checkedCount) {
            case 0:
                message = '✅ Seu ar parece estar saudável! Mantenha a manutenção em dia.';
                color = '#4CAF50';
                break;
            case 1:
                message = '⚠️ Atenção leve. Recomendamos uma verificação preventiva.';
                color = '#FF9800';
                break;
            case 2:
                message = '⚠️ Risco moderado. Sua família pode estar exposta a contaminantes.';
                color = '#FF9800';
                break;
            case 3:
                message = '🔴 Risco alto. É importante avaliar seu ar condicionado.';
                color = '#F44336';
                break;
            case 4:
                message = '🔴🔴 Risco muito alto! Procure um especialista imediatamente.';
                color = '#D32F2F';
                break;
            case 5:
                message = '🚨 EMERGÊNCIA! Seu ar está contaminado e colocando a saúde em risco.';
                color = '#B71C1C';
                break;
        }
        
        resultText.innerHTML = message;
        resultText.style.color = color;
        resultText.style.fontWeight = '600';
    }
    
    function showRiskResult(count) {
        const messages = [
            {
                title: '✅ Baixo Risco',
                text: 'Seu ambiente parece saudável. Continue com manutenção regular.',
                recommendations: [
                    'Manutenção preventiva a cada 6 meses',
                    'Troca de filtros conforme recomendação',
                    'Manter boa ventilação do ambiente'
                ]
            },
            {
                title: '⚠️ Risco Leve',
                text: 'Alguns sinais de alerta. Recomendamos avaliação preventiva.',
                recommendations: [
                    'Avaliação técnica nos próximos 30 dias',
                    'Limpeza básica dos filtros',
                    'Observar sintomas da família'
                ]
            },
            {
                title: '⚠️ Risco Moderado',
                text: 'Sua família pode estar exposta a contaminantes. Ação recomendada.',
                recommendations: [
                    'Agendar limpeza profissional em 15 dias',
                    'Avaliação médica se houver sintomas',
                    'Evitar uso contínuo até limpeza'
                ]
            },
            {
                title: '🔴 Risco Alto',
                text: 'Risco significativo à saúde. Necessidade de intervenção.',
                recommendations: [
                    'Limpeza profissional URGENTE (7 dias)',
                    'Consulta médica para avaliação',
                    'Suspender uso até reparo'
                ]
            },
            {
                title: '🔴🔴 Risco Muito Alto',
                text: 'Condições perigosas detectadas. Ação imediata necessária.',
                recommendations: [
                    'SERVİÇO DE EMERGÊNCIA (48h)',
                    'Avaliação médica imediata',
                    'Não utilizar o equipamento'
                ]
            },
            {
                title: '🚨 EMERGÊNCIA',
                text: 'Risco grave à saúde. Procure ajuda profissional IMEDIATAMENTE.',
                recommendations: [
                    'CHAMAR URGENTE: (11) 99999-9999',
                    'Consultar médico HOJE',
                    'Isolar o ambiente contaminado'
                ]
            }
        ];
        
        const result = messages[count];
        const resultText = document.getElementById('resultText');
        
        if (!resultText || !result) return;
        
        let html = `
            <div class="risk-result">
                <h4 style="color: inherit; margin-bottom: 10px;">${result.title}</h4>
                <p style="margin-bottom: 15px;">${result.text}</p>
                <div class="recommendations">
                    <strong>Recomendações:</strong>
                    <ul style="margin-top: 10px; padding-left: 20px;">
        `;
        
        result.recommendations.forEach(rec => {
            html += `<li>${rec}</li>`;
        });
        
        html += `
                    </ul>
                </div>
            </div>
        `;
        
        resultText.innerHTML = html;
        
        // Destacar se for risco alto
        if (count >= 3) {
            const btnAgendar = document.querySelector('.result-actions .btn-secondary');
            if (btnAgendar) {
                btnAgendar.className = 'btn btn-primary';
                btnAgendar.innerHTML = '<i class="fas fa-exclamation-triangle"></i> AGENDAR URGENTE';
            }
        }
    }
    
    // ========== ANIMAÇÕES ==========
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Efeito especial para cards de risco
                    if (entry.target.classList.contains('risk-card')) {
                        setTimeout(() => {
                            entry.target.style.transform = 'translateY(0)';
                            entry.target.style.opacity = '1';
                        }, 100);
                    }
                }
            });
        }, observerOptions);
        
        // Observar elementos
        document.querySelectorAll('.risk-card, .group-card, .symptom-item, .benefit-stat').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Timeline animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 300 + (index * 200));
        });
    }
    
    // ========== TOOLTIPS INFORMATIVOS ==========
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('.risk-tag, .symptom-icon, .group-icon');
        
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'health-tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip') || 'Informação de saúde';
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
    }
    
    // Inicializar tooltips
    setTimeout(initTooltips, 1000);
    
    // ========== COMPARTILHAR CONSCIENTIZAÇÃO ==========
    const shareBtn = document.createElement('button');
    shareBtn.className = 'share-health';
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Compartilhar';
    shareBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: var(--secondary);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 30px;
        cursor: pointer;
        box-shadow: var(--shadow);
        z-index: 999;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
    `;
    
    shareBtn.addEventListener('click', function() {
        const mensagem = `💚 Cuide da saúde da sua família! Ar condicionado limpo previne alergias e doenças respiratórias. 
        
Saiba mais: ${window.location.href}`;
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');
    });
    
    document.body.appendChild(shareBtn);
    
    // ========== CONTADOR DE IMPACTO ==========
    function initImpactCounter() {
        const counters = document.querySelectorAll('.benefit-stat .stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace('%', ''));
            let current = 0;
            const increment = target / 50;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + '%';
                    setTimeout(updateCounter, 30);
                } else {
                    counter.textContent = target + '%';
                }
            };
            
            // Iniciar quando visível
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    // Iniciar contador
    setTimeout(initImpactCounter, 1500);
});