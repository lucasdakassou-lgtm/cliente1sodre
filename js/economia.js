// js/economia.js - ARQUIVO COMPLETO

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== CONSTANTES E DADOS TÉCNICOS ==========
    const CONSUMO_POR_BTU = {
        '9000': 0.8,   // kW por hora
        '12000': 1.1,
        '18000': 1.6,
        '24000': 2.2,
        '30000': 2.8
    };
    
    // ========== DADOS DO CÁLCULO ==========
    let calculationData = {
        aparelhos: 2,
        horasUso: 8,
        diasUso: 25,
        tipoEquipamento: '12000',
        tarifaEnergia: '0.95',
        eficienciaAtual: 60,
        manutencao: '6'
    };
    
    let economyData = {
        mensal: 0,
        anual: 0,
        porcentagem: 0,
        consumoAtual: 0,
        consumoIdeal: 0,
        economiaKwh: 0
    };
    
    // ========== INICIALIZAR CALCULADORA ==========
    initCalculator();
    initCharts();
    initFAQ();
    
    // ========== FUNÇÕES DA CALCULADORA ==========
    function initCalculator() {
        console.log('Inicializando calculadora...');
        
        // Botões de incremento/decremento
        document.querySelectorAll('.btn-counter').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const target = this.getAttribute('data-target');
                const input = document.getElementById(target);
                
                if (!input) {
                    console.error('Input não encontrado:', target);
                    return;
                }
                
                let value = parseInt(input.value) || parseInt(input.min);
                
                if (action === 'increase' && value < parseInt(input.max)) {
                    value++;
                } else if (action === 'decrease' && value > parseInt(input.min)) {
                    value--;
                }
                
                input.value = value;
                calculationData[target] = value;
                updatePreview();
            });
        });
        
        // Inputs numéricos
        document.querySelectorAll('#aparelhos').forEach(input => {
            input.addEventListener('input', function() {
                let value = parseInt(this.value) || parseInt(this.min);
                value = Math.min(value, parseInt(this.max));
                value = Math.max(value, parseInt(this.min));
                
                this.value = value;
                calculationData[this.id] = value;
                updatePreview();
            });
        });
        
        // Slider de horas
        const horasSlider = document.getElementById('horasUso');
        const horasValue = document.getElementById('horasValue');
        
        if (horasSlider && horasValue) {
            horasSlider.addEventListener('input', function() {
                horasValue.textContent = this.value;
                calculationData.horasUso = parseInt(this.value);
                updatePreview();
            });
        }
        
        // Slider de dias
        const diasSlider = document.getElementById('diasUso');
        const diasValue = document.getElementById('diasValue');
        
        if (diasSlider && diasValue) {
            diasSlider.addEventListener('input', function() {
                diasValue.textContent = this.value;
                calculationData.diasUso = parseInt(this.value);
                updatePreview();
            });
        }
        
        // Slider de eficiência
        const eficienciaSlider = document.getElementById('eficienciaAtual');
        const eficienciaValue = document.getElementById('eficienciaValue');
        
        if (eficienciaSlider && eficienciaValue) {
            eficienciaSlider.addEventListener('input', function() {
                eficienciaValue.textContent = this.value;
                calculationData.eficienciaAtual = parseInt(this.value);
                updatePreview();
            });
        }
        
        // Select de tipo de equipamento
        const tipoEquipamento = document.getElementById('tipoEquipamento');
        if (tipoEquipamento) {
            tipoEquipamento.addEventListener('change', function() {
                calculationData.tipoEquipamento = this.value;
                updatePreview();
            });
        }
        
        // Select de tarifa
        const tarifaSelect = document.getElementById('tarifaEnergia');
        const customTarifaContainer = document.getElementById('customTarifaContainer');
        const customTarifa = document.getElementById('customTarifa');
        
        if (tarifaSelect) {
            tarifaSelect.addEventListener('change', function() {
                if (this.value === 'custom') {
                    if (customTarifaContainer) {
                        customTarifaContainer.style.display = 'block';
                    }
                    if (customTarifa) {
                        calculationData.tarifaEnergia = customTarifa.value;
                    }
                } else {
                    if (customTarifaContainer) {
                        customTarifaContainer.style.display = 'none';
                    }
                    calculationData.tarifaEnergia = this.value;
                }
                updatePreview();
            });
        }
        
        if (customTarifa) {
            customTarifa.addEventListener('input', function() {
                calculationData.tarifaEnergia = this.value;
                updatePreview();
            });
        }
        
        // Radio buttons de manutenção
        document.querySelectorAll('input[name="manutencao"]').forEach(radio => {
            radio.addEventListener('change', function() {
                calculationData.manutencao = this.value;
                updatePreview();
            });
        });
        
        // Navegação entre steps
        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', function() {
                const nextStep = this.getAttribute('data-next');
                if (nextStep) {
                    goToStep(nextStep);
                } else {
                    console.error('Botão next sem data-next attribute');
                }
            });
        });
        
        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', function() {
                const prevStep = this.getAttribute('data-prev');
                if (prevStep) {
                    goToStep(prevStep);
                } else {
                    console.error('Botão prev sem data-prev attribute');
                }
            });
        });
        
        // Botão de recalcular
        const btnRecalcular = document.getElementById('btnRecalcular');
        if (btnRecalcular) {
            btnRecalcular.addEventListener('click', function() {
                goToStep('step1');
            });
        }
        
        // Botão de agendar
        const btnAgendar = document.getElementById('btnAgendar');
        if (btnAgendar) {
            btnAgendar.addEventListener('click', function() {
                // Salvar dados no localStorage
                localStorage.setItem('artechEconomyData', JSON.stringify({
                    ...calculationData,
                    ...economyData
                }));
                
                // Redirecionar para agendamento
                window.location.href = 'agendamento.html?from=calculator';
            });
        }
        
        // Botão de compartilhar
        const btnCompartilhar = document.getElementById('btnCompartilhar');
        if (btnCompartilhar) {
            btnCompartilhar.addEventListener('click', function() {
                compartilharResultado();
            });
        }
        
        // Atualizar preview inicial
        updatePreview();
        
        console.log('Calculadora inicializada com sucesso!');
    }
    
    function goToStep(stepId) {
        console.log('Indo para step:', stepId);
        
        // Esconder todos os steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });
        
        // Mostrar step solicitado
        const targetStep = document.getElementById(stepId);
        if (targetStep) {
            targetStep.classList.add('active');
            targetStep.style.display = 'block';
            
            // Se for o step 4 (resultado), calcular
            if (stepId === 'step4') {
                calculateEconomy();
                updateResults();
                updateCharts();
                saveToHistory();
            }
            
            // Scroll suave
            targetStep.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.error('Step não encontrado:', stepId);
        }
    }
    
    function updatePreview() {
        // Atualizar valores na sidebar
        const quickHistory = document.getElementById('quickHistory');
        if (quickHistory) {
            const previewEconomy = calculateQuickPreview();
            const firstItem = quickHistory.querySelector('.history-item');
            if (firstItem) {
                firstItem.innerHTML = `
                    <span>${calculationData.aparelhos} ${calculationData.aparelhos > 1 ? 'splits' : 'split'} ${calculationData.tipoEquipamento}, ${calculationData.horasUso}h/dia</span>
                    <strong>R$ ${previewEconomy}/mês</strong>
                `;
            }
        }
    }
    
    function calculateQuickPreview() {
        // Cálculo simplificado para preview
        const consumoPorHora = CONSUMO_POR_BTU[calculationData.tipoEquipamento] || 1.1;
        const eficiencia = calculationData.eficienciaAtual / 100;
        const consumoHoraAtual = consumoPorHora / eficiencia;
        const consumoHoraIdeal = consumoPorHora;
        
        const horasMes = calculationData.horasUso * calculationData.diasUso;
        const diferencaKwh = (consumoHoraAtual - consumoHoraIdeal) * horasMes * calculationData.aparelhos;
        const tarifa = parseFloat(calculationData.tarifaEnergia) || 0.95;
        
        return Math.round(diferencaKwh * tarifa);
    }
    
    // ========== CÁLCULOS PRECISOS ==========
    function calcularConsumoAtual() {
        const consumoPorHora = CONSUMO_POR_BTU[calculationData.tipoEquipamento] || 1.1;
        const eficiencia = Math.max(0.3, calculationData.eficienciaAtual / 100);
        const consumoHoraAtual = consumoPorHora / eficiencia;
        const horasMes = calculationData.horasUso * calculationData.diasUso;
        
        return consumoHoraAtual * horasMes * calculationData.aparelhos;
    }
    
    function calcularConsumoIdeal() {
        const consumoPorHora = CONSUMO_POR_BTU[calculationData.tipoEquipamento] || 1.1;
        const horasMes = calculationData.horasUso * calculationData.diasUso;
        
        return consumoPorHora * horasMes * calculationData.aparelhos;
    }
    
    function calculateEconomy() {
        // Consumos
        const consumoAtual = calcularConsumoAtual();
        const consumoIdeal = calcularConsumoIdeal();
        
        // Tarifa
        const tarifa = parseFloat(calculationData.tarifaEnergia) || 0.95;
        
        // Custo atual vs ideal
        const custoAtual = consumoAtual * tarifa;
        const custoIdeal = consumoIdeal * tarifa;
        
        // Economia em reais
        const economiaReais = custoAtual - custoIdeal;
        
        // Porcentagem de economia
        const porcentagem = custoAtual > 0 ? ((economiaReais / custoAtual) * 100) : 0;
        
        // Ajustar baseado no tempo sem manutenção
        const fatorManutencao = getMaintenanceFactor(calculationData.manutencao);
        const economiaAjustada = economiaReais * fatorManutencao;
        
        // Armazenar resultados
        economyData.consumoAtual = Math.round(consumoAtual);
        economyData.consumoIdeal = Math.round(consumoIdeal);
        economyData.economiaKwh = Math.round(consumoAtual - consumoIdeal);
        economyData.mensal = Math.max(0, Math.round(economiaAjustada));
        economyData.anual = Math.round(economyData.mensal * 12);
        economyData.porcentagem = Math.min(40, Math.max(15, Math.round(porcentagem * fatorManutencao)));
        
        // Garantir economia mínima
        if (economyData.porcentagem < 15 && economyData.mensal > 0) {
            economyData.porcentagem = 15;
        }
        
        console.log('Economia calculada:', economyData);
    }
    
    function getMaintenanceFactor(months) {
        const factors = {
            '6': 0.8,   // Menos de 6 meses
            '12': 1.0,  // 6 meses a 1 ano
            '24': 1.3,  // Mais de 1 ano
            '36': 1.5   // Nunca fez
        };
        return factors[months] || 1.0;
    }
    
    // ========== ATUALIZAR RESULTADOS ==========
    function updateResults() {
        // Atualizar valores principais
        const economiaMensal = document.getElementById('economiaMensal');
        const economiaAnual = document.getElementById('economiaAnual');
        const percentageValue = document.getElementById('percentageValue');
        const percentageFill = document.getElementById('percentageFill');
        
        if (economiaMensal) economiaMensal.textContent = formatCurrency(economyData.mensal);
        if (economiaAnual) economiaAnual.textContent = formatCurrency(economyData.anual);
        if (percentageValue) percentageValue.textContent = economyData.porcentagem + '%';
        if (percentageFill) percentageFill.style.width = economyData.porcentagem + '%';
        
        // Atualizar detalhes técnicos
        const consumoAtualElem = document.getElementById('consumoAtual');
        const consumoIdealElem = document.getElementById('consumoIdeal');
        const economiaKwhElem = document.getElementById('economiaKwh');
        const retornoInvestimentoElem = document.getElementById('retornoInvestimento');
        
        if (consumoAtualElem) consumoAtualElem.textContent = economyData.consumoAtual + ' kWh/mês';
        if (consumoIdealElem) consumoIdealElem.textContent = economyData.consumoIdeal + ' kWh/mês';
        if (economiaKwhElem) economiaKwhElem.textContent = economyData.economiaKwh + ' kWh/mês';
        if (retornoInvestimentoElem) {
            const custoManutencao = calcularCustoManutencao();
            const mesesRetorno = custoManutencao > 0 && economyData.mensal > 0 ? 
                Math.ceil(custoManutencao / economyData.mensal) : 1;
            retornoInvestimentoElem.textContent = mesesRetorno + ' meses';
        }
        
        updateEquivalences();
    }
    
    function calcularCustoManutencao() {
        const custosBase = {
            '9000': 150,
            '12000': 180,
            '18000': 220,
            '24000': 280,
            '30000': 350
        };
        
        const custoBase = custosBase[calculationData.tipoEquipamento] || 180;
        const fatorManutencao = getMaintenanceFactor(calculationData.manutencao);
        
        return Math.round(custoBase * fatorManutencao);
    }
    
    function formatCurrency(value) {
        return 'R$ ' + value.toLocaleString('pt-BR');
    }
    
    function updateEquivalences() {
        const equivalences = document.getElementById('equivalences');
        if (!equivalences) return;
        
        // Equivalências realistas
        const netflix = Math.round(economyData.mensal / 30);
        const gasolina = Math.round(economyData.mensal / 5.5);
        const refeicoes = Math.round(economyData.mensal / 40);
        const livros = Math.round(economyData.mensal / 50);
        
        equivalences.innerHTML = `
            <span class="equivalence">
                <i class="fas fa-tv"></i> ${netflix} Netflix
            </span>
            <span class="equivalence">
                <i class="fas fa-gas-pump"></i> ${gasolina}L gasolina
            </span>
            <span class="equivalence">
                <i class="fas fa-utensils"></i> ${refeicoes} refeições
            </span>
            ${livros > 0 ? `<span class="equivalence">
                <i class="fas fa-book"></i> ${livros} livros
            </span>` : ''}
        `;
    }
    
    // ========== GRÁFICOS ==========
    let economyChart, comparisonChart;
    
    function initCharts() {
        // Configurar Chart.js
        Chart.defaults.color = '#6C757D';
        Chart.defaults.font.family = "'Inter', sans-serif";
        
        createEconomyChart();
        createComparisonChart();
    }
    
   // js/economia.js - PARTE DOS GRÁFICOS ATUALIZADA

// ========== GRÁFICOS COM CORES DA LOGO ==========
function createEconomyChart() {
    const ctx = document.getElementById('economyChart')?.getContext('2d');
    if (!ctx) return;
    
    economyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Consumo Atual', 'Consumo Ideal'],
            datasets: [{
                data: [100, 70],
                backgroundColor: [
                    '#0066CC',  // Azul da logo
                    '#00CC99'   // Verde da logo
                ],
                borderColor: [
                    '#0052A3',  // Azul escuro
                    '#009977'   // Verde escuro
                ],
                borderWidth: 2,
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}% do consumo`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { 
                        callback: value => value + '%',
                        color: '#6C757D'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: '#6C757D'
                    }
                }
            }
        }
    });
}

function createComparisonChart() {
    const ctx = document.getElementById('comparisonChart')?.getContext('2d');
    if (!ctx) return;
    
    comparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
                {
                    label: 'Sem Manutenção',
                    data: [400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620],
                    borderColor: '#0066CC',  // Azul da logo
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Com Manutenção',
                    data: [400, 420, 380, 350, 320, 300, 280, 270, 260, 250, 240, 230],
                    borderColor: '#00CC99',  // Verde da logo
                    backgroundColor: 'rgba(0, 204, 153, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        color: '#6C757D'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { 
                        callback: value => 'R$ ' + value,
                        color: '#6C757D'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: '#6C757D'
                    }
                }
            }
        }
    });
}

// ========== ATUALIZAR GRÁFICOS COM AS CORES ==========
function updateCharts() {
    if (economyChart) {
        // Manter as cores da logo
        economyChart.data.datasets[0].backgroundColor = ['#0066CC', '#00CC99'];
        economyChart.data.datasets[0].borderColor = ['#0052A3', '#009977'];
        
        // Atualizar dados
        const consumoIdealPercent = Math.round((economyData.consumoIdeal / economyData.consumoAtual) * 100);
        economyChart.data.datasets[0].data = [100, consumoIdealPercent];
        economyChart.update();
    }
    
    if (comparisonChart) {
        // Manter cores da logo
        comparisonChart.data.datasets[0].borderColor = '#0066CC';
        comparisonChart.data.datasets[0].backgroundColor = 'rgba(0, 102, 204, 0.1)';
        comparisonChart.data.datasets[1].borderColor = '#00CC99';
        comparisonChart.data.datasets[1].backgroundColor = 'rgba(0, 204, 153, 0.1)';
        
        // Atualizar dados
        const baseValue = calcularCustoAtualBase();
        const reducaoPercentual = economyData.porcentagem / 100;
        
        const dadosAntes = Array(12).fill(0).map((_, i) => 
            Math.round(baseValue * (1 + (i * 0.02)))
        );
        
        const dadosDepois = dadosAntes.map((v, i) => 
            i < 2 ? v : Math.round(v * (1 - reducaoPercentual))
        );
        
        comparisonChart.data.datasets[0].data = dadosAntes;
        comparisonChart.data.datasets[1].data = dadosDepois;
        comparisonChart.update();
    }
}
    
    function calcularCustoAtualBase() {
        const tarifa = parseFloat(calculationData.tarifaEnergia) || 0.95;
        const consumoAtual = calcularConsumoAtual();
        return consumoAtual * tarifa;
    }
    
    // ========== FAQ ==========
    function initFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Fechar todos
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Abrir atual se não estava aberto
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
        
        // Abrir primeiro item
        const firstFaq = document.querySelector('.faq-item');
        if (firstFaq) firstFaq.classList.add('active');
    }
    
    // ========== HISTÓRICO ==========
    function saveToHistory() {
        const history = JSON.parse(localStorage.getItem('artechHistory') || '[]');
        
        const newEntry = {
            ...calculationData,
            ...economyData,
            timestamp: new Date().toISOString()
        };
        
        history.unshift(newEntry);
        if (history.length > 5) history.pop();
        
        localStorage.setItem('artechHistory', JSON.stringify(history));
        updateHistorySidebar(history);
    }
    
    function updateHistorySidebar(history) {
        const quickHistory = document.getElementById('quickHistory');
        if (!quickHistory) return;
        
        if (history.length === 0) {
            quickHistory.innerHTML = '<p class="text-muted">Nenhum cálculo recente</p>';
            return;
        }
        
        quickHistory.innerHTML = history.slice(0, 3).map(entry => `
            <div class="history-item">
                <span>${entry.aparelhos} ${entry.aparelhos > 1 ? 'splits' : 'split'}, ${entry.horasUso}h/dia</span>
                <strong>R$ ${entry.mensal}/mês</strong>
            </div>
        `).join('');
    }
    
    // Carregar histórico
    const savedHistory = JSON.parse(localStorage.getItem('artechHistory') || '[]');
    updateHistorySidebar(savedHistory);
    
    // ========== COMPARTILHAR ==========
    function compartilharResultado() {
        const mensagem = `💰 Economizei R$ ${economyData.mensal}/mês com a calculadora da ARTECH! 
        
Calcule sua economia também: ${window.location.href}`;
        
        // WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    // ========== DEBUG ==========
    console.log('Economia.js carregado com sucesso!');
});
console.log('=== DEBUG ECONOMIA ===');
console.log('Window loaded:', window.location.href);
console.log('Document ready:', document.readyState);

// Testar clique manual
setTimeout(() => {
    const testBtn = document.querySelector('.btn-next');
    if (testBtn) {
        console.log('Botão encontrado:', testBtn);
        testBtn.addEventListener('click', () => {
            console.log('CLIQUE FUNCIONOU!');
        });
    } else {
        console.error('Botão não encontrado!');
    }
}, 1000);
