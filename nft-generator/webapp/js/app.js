// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Состояние приложения
const state = {
    balance: 1000,
    currentStyle: 'realistic',
    currentQuality: 'normal',
    currentSize: 512,
    generatedImages: [],
    nfts: [],
    marketplace: []
};

// Демо NFT для маркета
const demoNames = [
    'Cosmic Dragon', 'Neon Samurai', 'Digital Phoenix',
    'Crystal Unicorn', 'Shadow Wolf', 'Golden Eagle',
    'Mystic Fox', 'Thunder Tiger', 'Ice Phoenix',
    'Fire Demon', 'Star Warrior', 'Moon Princess'
];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initStyleSelection();
    initParamButtons();
    initGenerateButton();
    initPromptInput();
    createParticles();
    loadDemoNFTs();
    updateBalance();
});

// Создание частиц
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 20) + 's';
        container.appendChild(particle);
    }
}

// Навигация
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.tab-content');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tabName = btn.dataset.tab;
            tabs.forEach(tab => tab.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Выбор стиля
function initStyleSelection() {
    const styleCards = document.querySelectorAll('.style-card');
    
    styleCards.forEach(card => {
        card.addEventListener('click', () => {
            styleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.currentStyle = card.dataset.style;
            
            // Визуальная обратная связь
            card.style.transform = 'scale(0.95)';
            setTimeout(() => card.style.transform = '', 150);
        });
    });
}

// Параметры
function initParamButtons() {
    // Качество
    document.querySelectorAll('[data-quality]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-quality]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentQuality = btn.dataset.quality;
        });
    });
    
    // Размер
    document.querySelectorAll('[data-size]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentSize = parseInt(btn.dataset.size);
        });
    });
}

// Поле ввода
function initPromptInput() {
    const input = document.getElementById('promptInput');
    const charCount = document.getElementById('charCount');
    const magicBtn = document.getElementById('magicBtn');
    
    input.addEventListener('input', () => {
        charCount.textContent = input.value.length;
    });
    
    magicBtn.addEventListener('click', () => {
        const prompts = [
            'Величественный дракон с светящейся чешуей в неоновом городе',
            'Киберпанк самурай с катаной в дождливом переулке',
            'Магический лес с летающими кристаллами и феями',
            'Космический кит плывущий сквозь галактику',
            'Замок на облаках с радужными водопадами',
            'Феникс возрождающийся из цифрового пламени'
        ];
        input.value = prompts[Math.floor(Math.random() * prompts.length)];
        charCount.textContent = input.value.length;
        
        // Анимация
        magicBtn.style.transform = 'scale(1.1)';
        setTimeout(() => magicBtn.style.transform = '', 200);
    });
}

// Генерация изображения
function initGenerateButton() {
    const btn = document.getElementById('generateBtn');
    
    btn.addEventListener('click', async () => {
        const prompt = document.getElementById('promptInput').value.trim();
        
        if (!prompt) {
            tg.showAlert('Пожалуйста, введите описание изображения!');
            return;
        }
        
        // Показываем загрузку
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span> ГЕНЕРИРУЮ...';
        
        // Показываем результат
        const placeholder = document.getElementById('resultPlaceholder');
        placeholder.innerHTML = '<span class="loading"></span><p>Создаю шедевр...</p>';
        
        // Имитация генерации
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Демо изображение (в реальности здесь API)
        const demoImage = generateDemoImage(prompt);
        
        // Показываем результат
        const resultImage = document.getElementById('resultImage');
        const overlay = document.getElementById('resultOverlay');
        
        placeholder.style.display = 'none';
        resultImage.style.display = 'block';
        resultImage.src = demoImage;
        overlay.style.display = 'flex';
        
        // Сохраняем в историю
        state.generatedImages.unshift({
            prompt,
            image: demoImage,
            style: state.currentStyle,
            date: new Date()
        });
        
        updateGallery();
        
        // Восстанавливаем кнопку
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-icon">🎨</span><span>СОЗДАТЬ ШЕДЕВР</span><span class="btn-sparkle">✨</span>';
        
        // Анимация результата
        resultImage.style.transform = 'scale(0.8)';
        resultImage.style.opacity = '0';
        setTimeout(() => {
            resultImage.style.transition = 'all 0.5s';
            resultImage.style.transform = 'scale(1)';
            resultImage.style.opacity = '1';
        }, 100);
    });
}

// Генерация демо изображения (замените на реальное API)
function generateDemoImage(prompt) {
    // Используем picsum для демо
    const seed = prompt.length * 100;
    return `https://picsum.photos/seed/${seed}/512/512`;
}

// Обновление галереи
function updateGallery() {
    const grid = document.getElementById('galleryGrid');
    
    grid.innerHTML = state.generatedImages.map((img, index) => `
        <div class="gallery-card" onclick="viewImage(${index})">
            <img src="${img.image}" alt="${img.prompt}">
            <div class="gallery-card-info">
                <h4>${img.prompt.substring(0, 30)}...</h4>
                <span class="rarity rarity-${getRandomRarity()}">${getRandomRarity()}</span>
            </div>
        </div>
    `).join('');
}

// Просмотр изображения
function viewImage(index) {
    const img = state.generatedImages[index];
    const modal = document.getElementById('viewModal');
    
    document.getElementById('modalImage').src = img.image;
    document.getElementById('modalTitle').textContent = img.prompt;
    document.getElementById('modalDesc').textContent = `Стиль: ${img.style} | Создано: ${img.date.toLocaleString()}`;
    
    modal.classList.add('active');
}

// Закрытие модального окна
document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('viewModal').classList.remove('active');
});

// Загрузка демо NFT
function loadDemoNFTs() {
    // Для маркета
    const marketGrid = document.getElementById('marketGrid');
    const marketNFTs = Array.from({length: 8}, (_, i) => ({
        name: demoNames[i],
        rarity: getRandomRarity(),
        price: Math.floor(Math.random() * 1000) + 50,
        image: `https://picsum.photos/seed/${i + 100}/300/300`
    }));
    
    marketGrid.innerHTML = marketNFTs.map(nft => `
        <div class="nft-card ${nft.rarity}">
            <img class="nft-card-image" src="${nft.image}" alt="${nft.name}">
            <div class="nft-card-info">
                <div class="nft-card-name">${nft.name}</div>
                <span class="rarity rarity-${nft.rarity}">${nft.rarity.toUpperCase()}</span>
                <div class="nft-card-price">
                    <span class="price-amount">💎 ${nft.price} TON</span>
                    <button class="action-btn" onclick="buyNFT('${nft.name}', ${nft.price})">
                        Купить
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Для коллекции
    const nftCollection = document.getElementById('nftCollection');
    nftCollection.innerHTML = '<p style="text-align:center;padding:40px;">Купите NFT в маркете!</p>';
}

// Покупка NFT
function buyNFT(name, price) {
    if (state.balance >= price) {
        state.balance -= price;
        updateBalance();
        tg.showAlert(`✅ Куплен NFT: ${name}!`);
    } else {
        tg.showAlert('❌ Недостаточно средств!');
    }
}

// Вспомогательные функции
function getRandomRarity() {
    const rarities = ['common', 'common', 'common', 'rare', 'rare', 'epic', 'legendary'];
    return rarities[Math.floor(Math.random() * rarities.length)];
}

function updateBalance() {
    document.getElementById('balance').textContent = state.balance.toLocaleString();
}

// Закрытие модального окна по клику вне
document.getElementById('viewModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('active');
    }
});
