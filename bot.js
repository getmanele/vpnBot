const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Импортируем логгер действий пользователей
const UserActionLogger = require('./users vote/logger');
const logger = new UserActionLogger();

// Система переводов
const translations = {
    'en': {
        // Приветствие
        welcome: "🦅🌍 Welcome to vpnRossBot, {userName}!",
        welcomeDescription: "I'll help you find the world's best VPN for ultimate freedom and security.",
        whatICanDo: "What I can do:",
        recommendVPN: "Recommend the world's best VPN services",
        provideLinks: "Provide exclusive referral links", 
        giveInstructions: "Give detailed installation instructions",
        helpChoose: "Help you choose the perfect plan",
        clickToStart: "Spread your wings and start flying free!",
        
        // Главное меню
        vpnRecommendations: "🦅🌍 VPN FREEDOM RECOMMENDATIONS",
        chooseProvider: "Choose the world's best VPN provider to get:",
        referralLink: "Exclusive referral link",
        installationGuide: "Detailed installation guide",
        featuresDescription: "Premium features description",
        allTested: "All recommended VPNs are tested and guarantee ultimate freedom!",
        
        // Кнопки
        startVPNSelection: "🦅 FLY FREE - START VPN SELECTION",
        backToMenu: "⬅️ Back to freedom selection",
        
        // VPN информация
        description: "Description:",
        referralLinkText: "Referral link:",
        openWebsite: "Open website",
        mainFeatures: "Main features:",
        tip: "Tip:",
        useReferral: "Use referral link for best offers!",
        
        // Помощь
        help: "HELP",
        availableCommands: "Available commands:",
        startCommand: "/start - Show main menu",
        helpCommand: "/help - Show this help",
        howToUse: "How to use the bot:",
        step1: "1. Press /start",
        step2: "2. Press \"🚀 START VPN SELECTION\" button",
        step3: "3. Choose VPN provider",
        step4: "4. Get referral link and instructions",
        step5: "5. Use \"Back\" button to return",
        support: "Support: If you have questions, contact administrator."
    },
    
    'uk': {
        // Привітання
        welcome: "Ласкаво просимо до VPN Bot, {userName}!",
        welcomeDescription: "Я допоможу вам обрати найкращого VPN провайдера для безпечного інтернету.",
        whatICanDo: "Що я вмію:",
        recommendVPN: "Рекомендую перевірені VPN сервіси",
        provideLinks: "Надаю реферальні посилання",
        giveInstructions: "Даю детальні інструкції з встановлення",
        helpChoose: "Допомагаю обрати підходящий тариф",
        clickToStart: "Натисніть кнопку нижче, щоб почати!",
        
        // Головне меню
        vpnRecommendations: "VPN РЕКОМЕНДАЦІЇ",
        chooseProvider: "Оберіть VPN провайдера для отримання:",
        referralLink: "Реферального посилання",
        installationGuide: "Інструкції з встановлення",
        featuresDescription: "Опису можливостей",
        allTested: "Всі рекомендовані VPN перевірені та надійні!",
        
        // Кнопки
        startVPNSelection: "🚀 ПОЧАТИ ВИБІР VPN",
        backToMenu: "⬅️ Назад до вибору",
        
        // VPN інформація
        description: "Опис:",
        referralLinkText: "Реферальне посилання:",
        openWebsite: "Відкрити сайт",
        mainFeatures: "Основні можливості:",
        tip: "Порада:",
        useReferral: "Використовуйте реферальне посилання для отримання найкращих пропозицій!",
        
        // Допомога
        help: "ДОПОМОГА",
        availableCommands: "Доступні команди:",
        startCommand: "/start - Показати головне меню",
        helpCommand: "/help - Показати цю довідку",
        howToUse: "Як використовувати бота:",
        step1: "1. Натисніть /start",
        step2: "2. Натисніть кнопку \"🚀 ПОЧАТИ ВИБІР VPN\"",
        step3: "3. Оберіть VPN провайдера",
        step4: "4. Отримайте реферальне посилання та інструкції",
        step5: "5. Використовуйте кнопку \"Назад\" для повернення",
        support: "Підтримка: Якщо у вас є питання, зверніться до адміністратора."
    },
    
    'pl': {
        // Powitanie
        welcome: "Witamy w VPN Bot, {userName}!",
        welcomeDescription: "Pomogę Ci wybrać najlepszego dostawcę VPN dla bezpiecznego internetu.",
        whatICanDo: "Co potrafię:",
        recommendVPN: "Polecam sprawdzone usługi VPN",
        provideLinks: "Udostępniam linki referencyjne",
        giveInstructions: "Daję szczegółowe instrukcje instalacji",
        helpChoose: "Pomagam wybrać odpowiedni plan",
        clickToStart: "Kliknij przycisk poniżej, aby rozpocząć!",
        
        // Główne menu
        vpnRecommendations: "REKOMENDACJE VPN",
        chooseProvider: "Wybierz dostawcę VPN, aby otrzymać:",
        referralLink: "Link referencyjny",
        installationGuide: "Instrukcja instalacji",
        featuresDescription: "Opis funkcji",
        allTested: "Wszystkie polecane VPN są przetestowane i niezawodne!",
        
        // Przyciski
        startVPNSelection: "🚀 ROZPOCZNIJ WYBÓR VPN",
        backToMenu: "⬅️ Powrót do wyboru",
        
        // Informacje VPN
        description: "Opis:",
        referralLinkText: "Link referencyjny:",
        openWebsite: "Otwórz stronę",
        mainFeatures: "Główne funkcje:",
        tip: "Wskazówka:",
        useReferral: "Użyj linku referencyjnego, aby otrzymać najlepsze oferty!",
        
        // Pomoc
        help: "POMOC",
        availableCommands: "Dostępne polecenia:",
        startCommand: "/start - Pokaż główne menu",
        helpCommand: "/help - Pokaż tę pomoc",
        howToUse: "Jak używać bota:",
        step1: "1. Naciśnij /start",
        step2: "2. Naciśnij przycisk \"🚀 ROZPOCZNIJ WYBÓR VPN\"",
        step3: "3. Wybierz dostawcę VPN",
        step4: "4. Otrzymaj link referencyjny i instrukcje",
        step5: "5. Użyj przycisku \"Wstecz\" do powrotu",
        support: "Wsparcie: Jeśli masz pytania, skontaktuj się z administratorem."
    },
    
    'ru': {
        // Приветствие
        welcome: "🦅🌍 Добро пожаловать в vpnRossBot, {userName}!",
        welcomeDescription: "Я помогу вам найти самый лучший VPN в мире для абсолютной свободы и безопасности.",
        whatICanDo: "Что я умею:",
        recommendVPN: "Рекомендую лучшие VPN сервисы мира",
        provideLinks: "Предоставляю эксклюзивные реферальные ссылки",
        giveInstructions: "Даю подробные инструкции по установке",
        helpChoose: "Помогаю выбрать идеальный план",
        clickToStart: "Расправьте крылья и начните летать свободно!",
        
        // Главное меню
        vpnRecommendations: "🦅🌍 VPN РЕКОМЕНДАЦИИ СВОБОДЫ",
        chooseProvider: "Выберите лучший VPN провайдер мира для получения:",
        referralLink: "Эксклюзивной реферальной ссылки",
        installationGuide: "Подробной инструкции по установке",
        featuresDescription: "Описания премиум возможностей",
        allTested: "Все рекомендуемые VPN проверены и гарантируют абсолютную свободу!",
        
        // Кнопки
        startVPNSelection: "🦅 ЛЕТИ СВОБОДНО - НАЧАТЬ ВЫБОР VPN",
        backToMenu: "⬅️ Назад к выбору свободы",
        
        // VPN информация
        description: "Описание:",
        referralLinkText: "Реферальная ссылка:",
        openWebsite: "Открыть сайт",
        mainFeatures: "Основные возможности:",
        tip: "Совет:",
        useReferral: "Используйте реферальную ссылку для получения лучших предложений!",
        
        // Помощь
        help: "ПОМОЩЬ",
        availableCommands: "Доступные команды:",
        startCommand: "/start - Показать главное меню",
        helpCommand: "/help - Показать эту справку",
        howToUse: "Как использовать бота:",
        step1: "1. Нажмите /start",
        step2: "2. Нажмите кнопку \"🚀 НАЧАТЬ ВЫБОР VPN\"",
        step3: "3. Выберите VPN провайдера",
        step4: "4. Получите реферальную ссылку и инструкцию",
        step5: "5. Используйте кнопку \"Назад\" для возврата",
        support: "Поддержка: Если у вас есть вопросы, обратитесь к администратору."
    }
};

// Функция для получения перевода
function getTranslation(language, key, params = {}) {
    const lang = translations[language] || translations['ru'];
    let text = lang[key] || translations['ru'][key] || key;
    
    // Заменяем параметры в тексте
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

// Токен бота
const BOT_TOKEN = process.env.BOT_TOKEN || "8047108140:AAGAHc0bm1r2hdRwgXJZp367CartrRzIMGM";

// Создаем экземпляр бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// VPN провайдеры с реферальными ссылками
const VPN_PROVIDERS = {
    "icegate": {
        "name": "Icegate VPN",
        "description": "Продвинутая VPN с обфускацией трафика и AI-маршрутизацией",
        "ref_link": "https://www.icegatevpn.com/",
        "features": [
            "✓ Обход любых блокировок",
            "✓ Неограниченный трафик", 
            "✓ AI-маршрутизация",
            "✓ Политика no-logs",
            "✓ Поддержка 10 устройств"
        ],
        "install_guide": `
📱 УСТАНОВКА ICEGATE VPN:

1️⃣ Перейдите по ссылке: https://www.icegatevpn.com/
2️⃣ Выберите подходящий план (от $3.99/неделя)
3️⃣ Скачайте приложение для вашего устройства
4️⃣ Запустите приложение и подключитесь одним нажатием

💡 Особенности:
• Работает в самых строгих цензурных условиях
• Маскировка трафика под HTTPS
• Умная маршрутизация для максимальной скорости
        `
    },
    "expressvpn": {
        "name": "ExpressVPN",
        "description": "Быстрая и надежная VPN с серверами в 94 странах",
        "ref_link": "https://www.expressvpn.com/",
        "features": [
            "✓ 3000+ серверов в 94 странах",
            "✓ Высокая скорость подключения",
            "✓ Защита от утечек DNS",
            "✓ 24/7 поддержка",
            "✓ 30 дней гарантии возврата"
        ],
        "install_guide": `
📱 УСТАНОВКА EXPRESSVPN:

1️⃣ Перейдите по ссылке: https://www.expressvpn.com/
2️⃣ Выберите план подписки
3️⃣ Скачайте приложение ExpressVPN
4️⃣ Войдите с вашими учетными данными
5️⃣ Выберите сервер и подключитесь

💡 Особенности:
• Один из самых быстрых VPN
• Отлично работает с Netflix и другими стримингами
• Простое и интуитивное приложение
        `
    },
    "nordvpn": {
        "name": "NordVPN",
        "description": "Безопасная VPN с двойным шифрованием и CyberSec",
        "ref_link": "https://nordvpn.com/",
        "features": [
            "✓ Двойное шифрование",
            "✓ CyberSec защита",
            "✓ 5400+ серверов",
            "✓ Kill Switch",
            "✓ 6 одновременных подключений"
        ],
        "install_guide": `
📱 УСТАНОВКА NORDVPN:

1️⃣ Перейдите по ссылке: https://nordvpn.com/
2️⃣ Выберите подходящий тарифный план
3️⃣ Скачайте NordVPN для вашего устройства
4️⃣ Запустите приложение и войдите
5️⃣ Выберите сервер и активируйте защиту

💡 Особенности:
• Двойное шифрование для максимальной безопасности
• Встроенная защита от рекламы и вредоносных сайтов
• Специальные серверы для P2P и стриминга
        `
    },
    "surfshark": {
        "name": "Surfshark VPN",
        "description": "Бюджетная VPN с неограниченными устройствами",
        "ref_link": "https://surfshark.com/",
        "features": [
            "✓ Неограниченные устройства",
            "✓ CleanWeb защита",
            "✓ MultiHop маршрутизация",
            "✓ 3200+ серверов",
            "✓ Очень доступные цены"
        ],
        "install_guide": `
📱 УСТАНОВКА SURFSHARK VPN:

1️⃣ Перейдите по ссылке: https://surfshark.com/
2️⃣ Выберите план подписки (от $2.49/месяц)
3️⃣ Скачайте приложение Surfshark
4️⃣ Войдите в аккаунт
5️⃣ Подключитесь к любому серверу

💡 Особенности:
• Один из самых дешевых VPN на рынке
• Подключение неограниченного количества устройств
• Встроенная блокировка рекламы и трекеров
        `
    }
};

// Вспомогательная функция: убрать любые reply-клавиатуры (кнопка "+48" и т.п.)
function clearReplyKeyboard(chatId) {
    try {
        return bot.sendMessage(chatId, '\u200B', { // нулевой пробел, чтобы не засорять чат
            reply_markup: { remove_keyboard: true }
        }).then(msg => {
            // удаляем служебное сообщение через мгновение
            setTimeout(() => {
                bot.deleteMessage(chatId, msg.message_id).catch(() => {});
            }, 150);
        }).catch(() => {});
    } catch (_) {
        return Promise.resolve();
    }
}

// Жесткий сброс placeholder (убрать "+48...")
async function resetInputPlaceholder(chatId) {
    try {
        const msg1 = await bot.sendMessage(chatId, '\u200B', {
            reply_markup: {
                keyboard: [[{ text: ' ' }]],
                resize_keyboard: true,
                one_time_keyboard: true,
                input_field_placeholder: ' '
            }
        }).catch(() => null);
        if (msg1) {
            setTimeout(() => bot.deleteMessage(chatId, msg1.message_id).catch(() => {}), 120);
        }
        const msg2 = await bot.sendMessage(chatId, '\u200B', {
            reply_markup: { remove_keyboard: true }
        }).catch(() => null);
        if (msg2) {
            setTimeout(() => bot.deleteMessage(chatId, msg2.message_id).catch(() => {}), 120);
        }
    } catch (_) {
        // ignore
    }
}

// Функция для создания главного меню
function createMainMenu() {
    const keyboard = [];
    
    // Логотипы VPN брендов (уникальные для каждого)
    const logos = {
        'icegate': '🧊',      // Ice - лед
        'expressvpn': '⚡',   // Express - молния
        'nordvpn': '❄️',     // Nord - север, снежинка
        'surfshark': '🦈'     // Surfshark - акула
    };
    
    // Фиксированная длина префикса (эмодзи + пробел) для выравнивания текста
    const emojiPrefixLength = 3; // эмодзи + пробел + дополнительный пробел для выравнивания
    
    Object.keys(VPN_PROVIDERS).forEach(vpnId => {
        const vpnData = VPN_PROVIDERS[vpnId];
        const logo = logos[vpnId] || '🔒';
        
        // Создаем префикс с фиксированной длиной для выравнивания текста
        const emojiPrefix = `${logo} `;
        const paddedPrefix = emojiPrefix.padEnd(emojiPrefixLength, ' ');
        
        const buttonText = `${paddedPrefix}${vpnData.name}`;
        
        keyboard.push([{
            text: buttonText,
            callback_data: `vpn_${vpnId}`
        }]);
    });
    
    return {
        reply_markup: {
            inline_keyboard: keyboard
        }
    };
}

// Функция для создания кнопки "Назад"
function createBackButton(language = 'ru') {
    return {
        reply_markup: {
            inline_keyboard: [[{
                text: getTranslation(language, 'backToMenu'),
                callback_data: "back_to_menu"
            }]]
        }
    };
}

// Функция для показа информации о VPN
function showVpnInfo(chatId, messageId, vpnId, language = 'ru') {
    if (!VPN_PROVIDERS[vpnId]) {
        console.error(`VPN провайдер ${vpnId} не найден`);
        return;
    }
    
    const vpnData = VPN_PROVIDERS[vpnId];
    
    const infoText = `🔒 *${vpnData.name}*

📝 *${getTranslation(language, 'description')}*
${vpnData.description}

🔗 *${getTranslation(language, 'referralLinkText')}*
[${getTranslation(language, 'openWebsite')}](${vpnData.ref_link})

✨ *${getTranslation(language, 'mainFeatures')}*
${vpnData.features.join('\n')}

${vpnData.install_guide}

💡 *${getTranslation(language, 'tip')}* ${getTranslation(language, 'useReferral')}`;
    
    const options = {
        parse_mode: 'Markdown',
        ...createBackButton(language)
    };
    
    resetInputPlaceholder(chatId)
        .then(() => clearReplyKeyboard(chatId))
        .finally(() => {
            bot.editMessageText(infoText, {
                chat_id: chatId,
                message_id: messageId,
                ...options
            }).catch(error => {
                console.error('Ошибка при редактировании сообщения:', error);
                // Если не удалось отредактировать, отправляем новое сообщение
                bot.sendMessage(chatId, infoText, options);
            });
        });
}

// Функция для показа приветствия на выбранном языке
function showWelcomeMessage(chatId, messageId, language, userName) {
    const welcomeText = `🎉 *${getTranslation(language, 'welcome', { userName })}*

🛡️ ${getTranslation(language, 'welcomeDescription')}

✨ *${getTranslation(language, 'whatICanDo')}*
• ${getTranslation(language, 'recommendVPN')}
• ${getTranslation(language, 'provideLinks')}
• ${getTranslation(language, 'giveInstructions')}
• ${getTranslation(language, 'helpChoose')}

🚀 *${getTranslation(language, 'clickToStart')}*`;
    
    const startButton = {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: getTranslation(language, 'startVPNSelection'),
                    callback_data: "start_vpn_selection"
                }
            ]]
        },
        parse_mode: 'Markdown'
    };

    resetInputPlaceholder(chatId)
        .then(() => clearReplyKeyboard(chatId))
        .finally(() => {
            if (messageId) {
                bot.editMessageText(welcomeText, {
                    chat_id: chatId,
                    message_id: messageId,
                    ...startButton
                }).catch(error => {
                    console.error('Ошибка при редактировании приветствия:', error);
                    // Если не удалось отредактировать, отправляем новое сообщение
                    bot.sendMessage(chatId, welcomeText, startButton);
                });
            } else {
                bot.sendMessage(chatId, welcomeText, startButton).catch(error => {
                    console.error('Ошибка при отправке приветствия:', error);
                });
            }
        });
}

// Функция для показа главного меню
function showMainMenu(chatId, messageId = null, language = 'ru') {
    const welcomeText = `🛡️ *${getTranslation(language, 'vpnRecommendations')}*

${getTranslation(language, 'chooseProvider')}:
• ${getTranslation(language, 'referralLink')}
• ${getTranslation(language, 'installationGuide')}
• ${getTranslation(language, 'featuresDescription')}

${getTranslation(language, 'allTested')}`;
    
    const options = {
        parse_mode: 'Markdown',
        ...createMainMenu()
    };
    
    resetInputPlaceholder(chatId)
        .then(() => clearReplyKeyboard(chatId))
        .finally(() => {
            if (messageId) {
                bot.editMessageText(welcomeText, {
                    chat_id: chatId,
                    message_id: messageId,
                    ...options
                }).catch(error => {
                    console.error('Ошибка при редактировании главного меню:', error);
                    // Если не удалось отредактировать, отправляем новое сообщение
                    bot.sendMessage(chatId, welcomeText, options);
                });
            } else {
                bot.sendMessage(chatId, welcomeText, options).catch(error => {
                    console.error('Ошибка при отправке главного меню:', error);
                });
            }
        });
}

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.first_name || 'Пользователь';
        
        console.log(`Команда /start от пользователя ${chatId} (${userName})`);
        
        // Логируем действие пользователя
        logger.logAction(userId, 'ЗАПУСК_БОТА', `Пользователь ${userName} запустил бота`);
        
        // Сообщение выбора языка
        const languageText = `🦅🌍 *vpnRossBot - Свободный VPN по всему миру*

🌍 *Выберите язык / Choose language / Wybierz język / Оберіть мову*

Please select your preferred language:
Пожалуйста, выберите предпочитаемый язык:
Proszę wybrać preferowany język:
Будь ласка, оберіть бажану мову:`;

        const languageButtons = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🇺🇸 English", callback_data: "lang_en" },
                        { text: "🇺🇦 Українська", callback_data: "lang_uk" }
                    ],
                    [
                        { text: "🇵🇱 Polski", callback_data: "lang_pl" },
                        { text: "🇷🇺 Русский", callback_data: "lang_ru" }
                    ]
                ]
            },
            parse_mode: 'Markdown'
        };

        resetInputPlaceholder(chatId).finally(() => {
            bot.sendMessage(chatId, languageText, languageButtons).catch(error => {
                console.error('Ошибка при отправке выбора языка:', error);
            });
        });
    } catch (error) {
        console.error('Ошибка в обработчике /start:', error);
    }
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.first_name || 'Пользователь';
        
        console.log(`Команда /help от пользователя ${chatId} (${userName})`);
        
        // Логируем действие пользователя
        logger.logAction(userId, 'ЗАПРОС_ПОМОЩИ', `Пользователь ${userName} запросил справку`);
        
        // Показываем выбор языка для помощи
        const languageText = `🌍 *Выберите язык для справки / Choose language for help / Wybierz język pomocy / Оберіть мову довідки*

Please select your preferred language:
Пожалуйста, выберите предпочитаемый язык:
Proszę wybrać preferowany język:
Будь ласка, оберіть бажану мову:`;

        const languageButtons = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🇺🇸 English", callback_data: "help_lang_en" },
                        { text: "🇺🇦 Українська", callback_data: "help_lang_uk" }
                    ],
                    [
                        { text: "🇵🇱 Polski", callback_data: "help_lang_pl" },
                        { text: "🇷🇺 Русский", callback_data: "help_lang_ru" }
                    ]
                ]
            },
            parse_mode: 'Markdown'
        };

        bot.sendMessage(chatId, languageText, languageButtons).catch(error => {
            console.error('Ошибка при отправке выбора языка для помощи:', error);
        });
    } catch (error) {
        console.error('Ошибка в обработчике /help:', error);
    }
});

// Обработчик callback запросов (нажатия на кнопки)
bot.on('callback_query', (callbackQuery) => {
    try {
        const message = callbackQuery.message;
        const chatId = message.chat.id;
        const messageId = message.message_id;
        const data = callbackQuery.data;
        
        console.log(`Получен callback: ${data} от пользователя ${chatId}`);
        
        // Отвечаем на callback запрос
        bot.answerCallbackQuery(callbackQuery.id).catch(error => {
            console.error('Ошибка при ответе на callback:', error);
        });
        
        if (data.startsWith('lang_')) {
            const language = data.replace('lang_', '');
            const userId = callbackQuery.from.id;
            const userName = callbackQuery.from.first_name || 'Пользователь';
            
            console.log(`Пользователь выбрал язык: ${language}`);
            
            // Логируем выбор языка
            logger.logAction(userId, 'ВЫБОР_ЯЗЫКА', `Выбран язык: ${language}`);
            
            // Показываем приветствие на выбранном языке
            showWelcomeMessage(chatId, messageId, language, userName);
            
        } else if (data.startsWith('help_lang_')) {
            const language = data.replace('help_lang_', '');
            const userId = callbackQuery.from.id;
            
            console.log(`Пользователь выбрал язык для помощи: ${language}`);
            
            // Логируем выбор языка для помощи
            logger.logAction(userId, 'ВЫБОР_ЯЗЫКА_ПОМОЩИ', `Выбран язык для помощи: ${language}`);
            
            // Показываем справку на выбранном языке
            const helpText = `🆘 *${getTranslation(language, 'help')}*

*${getTranslation(language, 'availableCommands')}:*
${getTranslation(language, 'startCommand')}
${getTranslation(language, 'helpCommand')}

*${getTranslation(language, 'howToUse')}:*
${getTranslation(language, 'step1')}
${getTranslation(language, 'step2')}
${getTranslation(language, 'step3')}
${getTranslation(language, 'step4')}
${getTranslation(language, 'step5')}

*${getTranslation(language, 'support')}*`;
            
            bot.editMessageText(helpText, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'Markdown'
            }).catch(error => {
                console.error('Ошибка при редактировании справки:', error);
                bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
            });
            
        } else if (data.startsWith('vpn_')) {
            const vpnId = data.replace('vpn_', '');
            const userId = callbackQuery.from.id;
            console.log(`Показываем информацию о VPN: ${vpnId}`);
            
            // Логируем выбор VPN
            logger.logAction(userId, 'ВЫБОР_VPN', `Выбран VPN: ${VPN_PROVIDERS[vpnId]?.name || vpnId}`);
            
            // Показываем информацию о VPN (по умолчанию на русском, можно добавить сохранение языка пользователя)
            showVpnInfo(chatId, messageId, vpnId, 'ru');
        } else if (data === 'back_to_menu') {
            const userId = callbackQuery.from.id;
            console.log('Возвращаемся к главному меню');
            
            // Логируем возврат в меню
            logger.logAction(userId, 'ВОЗВРАТ_В_МЕНЮ', 'Пользователь вернулся в главное меню');
            
            // Показываем главное меню (по умолчанию на русском)
            showMainMenu(chatId, messageId, 'ru');
        } else if (data === 'start_vpn_selection') {
            const userId = callbackQuery.from.id;
            console.log('Пользователь начал выбор VPN');
            
            // Логируем начало выбора VPN
            logger.logAction(userId, 'НАЧАЛО_ВЫБОРА_VPN', 'Пользователь нажал кнопку начала выбора');
            
            // Показываем главное меню (по умолчанию на русском)
            showMainMenu(chatId, messageId, 'ru');
        } else {
            console.log(`Неизвестный callback: ${data}`);
        }
    } catch (error) {
        console.error('Ошибка в обработчике callback:', error);
    }
});

// Обработчик ошибок
bot.on('error', (error) => {
    console.error('Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error);
});

// Обработчик сигналов для корректного завершения
process.on('SIGINT', () => {
    console.log('\n🛑 Получен сигнал SIGINT. Остановка бота...');
    bot.stopPolling();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Получен сигнал SIGTERM. Остановка бота...');
    bot.stopPolling();
    process.exit(0);
});

// Запуск бота
console.log('🤖 VPN Telegram Bot запущен!');
console.log('📱 Для остановки нажмите Ctrl+C');
console.log('🔗 Бот готов к работе...');
console.log(`📊 Доступно VPN провайдеров: ${Object.keys(VPN_PROVIDERS).length}`);
console.log('🔧 Токен бота:', BOT_TOKEN ? 'Установлен' : 'НЕ УСТАНОВЛЕН!');

// Экспорт для тестирования
module.exports = { bot, VPN_PROVIDERS };
