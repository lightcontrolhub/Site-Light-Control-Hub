document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

let lightStates = {
    1: { on: false, room: 'Sala de Estar', lastActivity: null },
    2: { on: false, room: 'Quarto', lastActivity: null },
    3: { on: false, room: 'Cozinha', lastActivity: null },
    4: { on: false, room: 'Banheiro', lastActivity: null }
};

let activityHistory = [];
let usageStats = {
    totalUsage: 0,
    energyCost: 0,
    co2Saved: 0,
    peakHour: null
};

function initializeDashboard() {
    loadUserData();
    updateAllLightStates();
    updateStatistics();
    loadActivityHistory();
    setupEventListeners();
    startRealTimeUpdates();
}

function loadUserData() {
    const userName = localStorage.getItem('userName') || 'Usuário';
    document.getElementById('userName').textContent = userName;
}

function setupEventListeners() {
    const timerForm = document.getElementById('timerForm');
    if (timerForm) {
        timerForm.addEventListener('submit', handleTimerSubmit);
    }

    const historyFilter = document.getElementById('historyFilter');
    if (historyFilter) {
        historyFilter.addEventListener('change', filterHistory);
    }

    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function toggleLight(lightId, state) {
    const lightElement = document.getElementById(`light${lightId}`);
    const statusElement = document.getElementById(`status${lightId}`);
    const lastActivityElement = document.getElementById(`lastActivity${lightId}`);
    const controlElement = document.querySelector(`[data-light="${lightId}"]`);
    
    controlElement.classList.add('loading');
    
    setTimeout(() => {
        lightStates[lightId].on = state;
        lightStates[lightId].lastActivity = new Date();
        
        if (state) {
            lightElement.classList.add('on');
            statusElement.textContent = 'Ligada';
            statusElement.className = 'light-status on';
            controlElement.classList.add('active');
        } else {
            lightElement.classList.remove('on');
            statusElement.textContent = 'Desligada';
            statusElement.className = 'light-status off';
            controlElement.classList.remove('active');
        }
        
        lastActivityElement.textContent = formatTime(new Date());
        
        controlElement.classList.remove('loading');
        
        addToHistory(lightId, state);
        
        updateStatistics();
        
        showNotification(
            `💡 ${lightStates[lightId].room} ${state ? 'ligada' : 'desligada'}!`,
            'success'
        );
        
        sendToArduino(lightId, state);
        
    }, 500);
}

function sendToArduino(lightId, state) {
    console.log(`Sending to Arduino: Light ${lightId} = ${state ? 'ON' : 'OFF'}`);
    
    const command = {
        light: lightId,
        state: state,
        timestamp: new Date().toISOString(),
        room: lightStates[lightId].room
    };
    
    console.log('Firebase update:', command);
    
    trackEvent('light_control', {
        lightId: lightId,
        state: state,
        room: lightStates[lightId].room
    });
}

function allLightsOn() {
    showNotification('🌟 Ligando todas as luzes...', 'info');
    
    Object.keys(lightStates).forEach((lightId, index) => {
        setTimeout(() => {
            toggleLight(parseInt(lightId), true);
        }, index * 200);
    });
}

function allLightsOff() {
    showNotification('🌙 Desligando todas as luzes...', 'info');
    
    Object.keys(lightStates).forEach((lightId, index) => {
        setTimeout(() => {
            toggleLight(parseInt(lightId), false);
        }, index * 200);
    });
}

function nightMode() {
    showNotification('🌛 Ativando modo noturno...', 'info');
    
    Object.keys(lightStates).forEach((lightId, index) => {
        const id = parseInt(lightId);
        setTimeout(() => {
            if (id === 2) {
                toggleLight(id, true);
            } else {
                toggleLight(id, false);
            }
        }, index * 200);
    });
}

function scheduleTimer() {
    document.getElementById('timerModal').style.display = 'block';
}

function closeTimerModal() {
    document.getElementById('timerModal').style.display = 'none';
}

function handleTimerSubmit(e) {
    e.preventDefault();
    
    const lightId = document.getElementById('timerLight').value;
    const action = document.getElementById('timerAction').value;
    const time = document.getElementById('timerTime').value;
    const repeat = document.getElementById('timerRepeat').value;
    
    if (!lightId || !action || !time) {
        showNotification('❌ Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    const timer = {
        id: Date.now(),
        lightId: parseInt(lightId),
        action: action === 'on',
        time: time,
        repeat: repeat,
        room: lightStates[lightId].room,
        created: new Date()
    };
    
    let timers = JSON.parse(localStorage.getItem('lightTimers') || '[]');
    timers.push(timer);
    localStorage.setItem('lightTimers', JSON.stringify(timers));
    
    showNotification(
        `⏰ Timer programado: ${timer.room} será ${action === 'on' ? 'ligada' : 'desligada'} às ${time}`,
        'success'
    );
    
    closeTimerModal();
    e.target.reset();
}

function updateStatistics() {
    let totalMinutes = 0;
    Object.values(lightStates).forEach(light => {
        if (light.on && light.lastActivity) {
            const minutesOn = Math.floor((new Date() - light.lastActivity) / (1000 * 60));
            totalMinutes += minutesOn;
        }
    });
    
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    document.getElementById('totalUsage').textContent = 
        `${totalHours}h ${remainingMinutes}m`;
    
    const energyCost = (totalMinutes * 60 * 4 * 0.50) / (1000 * 60);
    document.getElementById('energyCost').textContent = 
        `R$ ${energyCost.toFixed(2)}`;
    
    const co2Saved = (totalMinutes * 0.001);
    document.getElementById('co2Saved').textContent = 
        `${co2Saved.toFixed(2)}kg`;
    
    const peakHour = findPeakHour();
    document.getElementById('peakHour').textContent = peakHour || '--:--';
}

function findPeakHour() {
    if (activityHistory.length === 0) return null;
    
    const hourCounts = {};
    activityHistory.forEach(activity => {
        const hour = new Date(activity.timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    let maxHour = null;
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > maxCount) {
            maxCount = count;
            maxHour = hour;
        }
    });
    
    return maxHour ? `${maxHour.padStart(2, '0')}:00` : null;
}

function addToHistory(lightId, state) {
    const activity = {
        id: Date.now(),
        lightId: lightId,
        room: lightStates[lightId].room,
        action: state ? 'Ligada' : 'Desligada',
        timestamp: new Date(),
        icon: state ? '💡' : '🌙'
    };
    
    activityHistory.unshift(activity);
    
    if (activityHistory.length > 100) {
        activityHistory = activityHistory.slice(0, 100);
    }
    
    localStorage.setItem('activityHistory', JSON.stringify(activityHistory));
    
    updateHistoryDisplay();
}

function loadActivityHistory() {
    const saved = localStorage.getItem('activityHistory');
    if (saved) {
        activityHistory = JSON.parse(saved).map(activity => ({
            ...activity,
            timestamp: new Date(activity.timestamp)
        }));
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    const filter = document.getElementById('historyFilter').value;
    
    let filteredHistory = filterHistoryByPeriod(activityHistory, filter);
    
    if (filteredHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Nenhuma atividade encontrada.</p>';
        return;
    }
    
    historyList.innerHTML = filteredHistory.map(activity => `
        <div class="history-item">
            <div class="history-action">
                <span class="history-icon">${activity.icon}</span>
                <div class="history-details">
                    <div class="history-room">${activity.room}</div>
                    <div class="history-action-text">${activity.action}</div>
                </div>
            </div>
            <div class="history-time">${formatDateTime(activity.timestamp)}</div>
        </div>
    `).join('');
}

function filterHistoryByPeriod(history, period) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
        case 'today':
            return history.filter(activity => activity.timestamp >= today);
        case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return history.filter(activity => activity.timestamp >= weekAgo);
        case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return history.filter(activity => activity.timestamp >= monthAgo);
        default:
            return history;
    }
}

function filterHistory() {
    updateHistoryDisplay();
}

function exportHistory() {
    const filter = document.getElementById('historyFilter').value;
    const filteredHistory = filterHistoryByPeriod(activityHistory, filter);
    
    if (filteredHistory.length === 0) {
        showNotification('❌ Nenhum dado para exportar.', 'error');
        return;
    }
    
    const csvContent = [
        'Data/Hora,Cômodo,Ação',
        ...filteredHistory.map(activity => 
            `${formatDateTime(activity.timestamp)},${activity.room},${activity.action}`
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historico_luzes_${filter}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('📥 Histórico exportado com sucesso!', 'success');
}

function showEmergencyContact() {
    document.getElementById('emergencyModal').style.display = 'block';
}

function closeEmergencyModal() {
    document.getElementById('emergencyModal').style.display = 'none';
}

function callFamily() {
    showNotification('📞 Ligando para contato de emergência...', 'info');
    
    setTimeout(() => {
        showNotification('📞 Contato de emergência notificado!', 'success');
    }, 2000);
}

function updateAllLightStates() {
    Object.keys(lightStates).forEach(lightId => {
        const state = lightStates[lightId];
        const lightElement = document.getElementById(`light${lightId}`);
        const statusElement = document.getElementById(`status${lightId}`);
        const controlElement = document.querySelector(`[data-light="${lightId}"]`);
        
        if (state.on) {
            lightElement.classList.add('on');
            statusElement.textContent = 'Ligada';
            statusElement.className = 'light-status on';
            controlElement.classList.add('active');
        } else {
            lightElement.classList.remove('on');
            statusElement.textContent = 'Desligada';
            statusElement.className = 'light-status off';
            controlElement.classList.remove('active');
        }
        
        if (state.lastActivity) {
            document.getElementById(`lastActivity${lightId}`).textContent = 
                formatTime(state.lastActivity);
        }
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function formatDateTime(date) {
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function startRealTimeUpdates() {
    setInterval(updateStatistics, 60000);
    
    setInterval(simulateArduinoUpdates, 30000);
}

function simulateArduinoUpdates() {
    if (Math.random() < 0.1) {
        const lightId = Math.floor(Math.random() * 4) + 1;
        const currentState = lightStates[lightId].on;
        
        console.log(`Simulated Arduino update: Light ${lightId} status confirmed as ${currentState ? 'ON' : 'OFF'}`);
    }
}

function handleKeyboardShortcuts(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
    }
    
    switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
            const lightId = parseInt(e.key);
            const currentState = lightStates[lightId].on;
            toggleLight(lightId, !currentState);
            break;
        case 'a':
        case 'A':
            allLightsOn();
            break;
        case 'd':
        case 'D':
            allLightsOff();
            break;
        case 'n':
        case 'N':
            nightMode();
            break;
        case 't':
        case 'T':
            scheduleTimer();
            break;
        case 'h':
        case 'H':
            showEmergencyContact();
            break;
        case 'Escape':
            closeTimerModal();
            closeEmergencyModal();
            break;
    }
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('userName');
        showNotification('👋 Logout realizado com sucesso!', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        fontSize: '1rem',
        zIndex: '3000',
        maxWidth: '400px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out'
    });
    
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
            break;
        case 'info':
        default:
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            break;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
    
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

function trackEvent(eventName, eventData = {}) {
    console.log('Dashboard Event:', eventName, eventData);
}

function initializeHelp() {
    const helpText = `
    Atalhos do teclado:
    1-4: Alternar luzes
    A: Ligar todas
    D: Desligar todas
    N: Modo noturno
    T: Programar timer
    H: Ajuda/Emergência
    ESC: Fechar modais
    `;
    
    console.log(helpText);
}

initializeHelp();