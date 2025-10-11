const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { detectPreferredLanguageFromMessage, detectCountryFromMessage } = require('./services/geo');
const { incrementCountry, getPercentages } = require('./services/stats');
const { buildWelcomeText } = require('./services/greeting');

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
        startVPNSelection: "🚀 ПОЧАТИ ВИБІР МОВИ",
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
    
    'fa': {
        // خوش‌آمد
        welcome: "به VPN Bot خوش آمدید، {userName} عزیز!",
        welcomeDescription: "من به شما کمک می‌کنم بهترین ارائه‌دهنده VPN را برای اینترنت امن انتخاب کنید.",
        whatICanDo: "من چه کارهایی می‌کنم:",
        recommendVPN: "معرفی بهترین سرویس‌های VPN",
        provideLinks: "ارائه لینک‌های اختصاصی ارجاع",
        giveInstructions: "ارائه راهنمای نصب دقیق",
        helpChoose: "کمک به انتخاب طرح مناسب",
        clickToStart: "روی دکمه زیر بزنید تا شروع کنیم!",
        
        // منوی اصلی
        vpnRecommendations: "پیشنهادهای VPN",
        chooseProvider: "ارائه‌دهنده VPN را برای دریافت موارد زیر انتخاب کنید:",
        referralLink: "لینک ارجاع اختصاصی",
        installationGuide: "راهنمای نصب",
        featuresDescription: "توضیح امکانات",
        allTested: "همه VPNهای پیشنهادی تست‌شده و قابل اعتماد هستند!",
        
        // دکمه‌ها
        startVPNSelection: "🚀 شروع انتخاب VPN",
        backToMenu: "⬅️ بازگشت به منو",
        
        // اطلاعات VPN
        description: "توضیحات:",
        referralLinkText: "لینک ارجاع:",
        openWebsite: "باز کردن وب‌سایت",
        mainFeatures: "امکانات اصلی:",
        tip: "نکته:",
        useReferral: "برای بهترین پیشنهادها از لینک ارجاع استفاده کنید!",
        
        // کمک
        help: "کمک",
        availableCommands: "دستورات موجود:",
        startCommand: "/start - نمایش منوی اصلی",
        helpCommand: "/help - نمایش این راهنما",
        howToUse: "نحوه استفاده از ربات:",
        step1: "1. /start را بزنید",
        step2: "2. دکمه \"🚀 شروع انتخاب VPN\" را بزنید",
        step3: "3. ارائه‌دهنده VPN را انتخاب کنید",
        step4: "4. لینک ارجاع و راهنما را دریافت کنید",
        step5: "5. برای بازگشت از دکمه \"بازگشت\" استفاده کنید",
        support: "پشتیبانی: اگر سوالی داشتید با مدیر تماس بگیرید."
    },
    
    'hi': {
        // स्वागत
        welcome: "VPN Bot में आपका स्वागत है, {userName}!",
        welcomeDescription: "मैं आपको सुरक्षित इंटरनेट के लिए सबसे अच्छा VPN चुनने में मदद करूंगा।",
        whatICanDo: "मैं क्या कर सकता हूँ:",
        recommendVPN: "सर्वश्रेष्ठ VPN सेवाओं की सिफारिश",
        provideLinks: "विशेष रेफरल लिंक प्रदान करना",
        giveInstructions: "विस्तृत इंस्टॉलेशन निर्देश देना",
        helpChoose: "उचित प्लान चुनने में मदद",
        clickToStart: "शुरू करने के लिए नीचे बटन दबाएँ!",
        
        // मुख्य मेनू
        vpnRecommendations: "VPN सिफारिशें",
        chooseProvider: "इन चीजों के लिए VPN प्रदाता चुनें:",
        referralLink: "रेफरल लिंक",
        installationGuide: "इंस्टॉलेशन गाइड",
        featuresDescription: "फ़ीचर्स का विवरण",
        allTested: "सभी सुझाए गए VPN परीक्षणित और विश्वसनीय हैं!",
        
        // बटन
        startVPNSelection: "🚀 VPN चयन शुरू करें",
        backToMenu: "⬅️ मेनू पर वापस जाएँ",
        
        // VPN जानकारी
        description: "विवरण:",
        referralLinkText: "रेफरल लिंक:",
        openWebsite: "वेबसाइट खोलें",
        mainFeatures: "मुख्य विशेषताएँ:",
        tip: "टिप:",
        useReferral: "सर्वश्रेष्ठ ऑफ़र्स के लिए रेफरल लिंक का उपयोग करें!",
        
        // सहायता
        help: "मदद",
        availableCommands: "उपलब्ध कमांड्स:",
        startCommand: "/start - मुख्य मेनू दिखाएँ",
        helpCommand: "/help - यह सहायता दिखाएँ",
        howToUse: "बॉट का उपयोग कैसे करें:",
        step1: "1. /start दबाएँ",
        step2: "2. \"🚀 VPN चयन शुरू करें\" बटन दबाएँ",
        step3: "3. VPN प्रदाता चुनें",
        step4: "4. रेफरल लिंक और निर्देश प्राप्त करें",
        step5: "5. वापस जाने के लिए \"वापस\" बटन का उपयोग करें",
        support: "सपोर्ट: यदि प्रश्न हो तो एडमिन से संपर्क करें."
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

// Хранилище выбранного языка пользователя (в памяти процесса)
const userLanguage = new Map();

// VPN провайдеры с реферальными ссылками
const VPN_PROVIDERS = {
    "shiva": {
        "name": "Shiva VPN",
        "description": "Безопасный VPN с абсолютной приватностью и свободой выбора",
        "ref_link": "https://t.me/shivaru_bot?start=265815885",
        "features": [
            "✓ Абсолютная приватность",
            "✓ Свобода выбора серверов",
            "✓ Безопасное подключение",
            "✓ Простота использования",
            "✓ Надежная защита данных"
        ],
        "install_guide": `
📱 УСТАНОВКА SHIVA VPN:

1️⃣ Нажмите кнопку "🛡️ Получить безопасный доступ" ниже
2️⃣ Запустите бота Shiva VPN в Telegram
3️⃣ Следуйте инструкциям в боте
4️⃣ Наслаждайтесь абсолютной приватностью

💡 Особенности:
• Работает прямо в Telegram
• Простая настройка за минуты
• Максимальная безопасность
• Поддержка всех устройств
        `,
        "translations": {
            "en": {
                "name": "Shiva VPN",
                "description": "Secure VPN with absolute privacy and freedom of choice",
                "features": [
                    "✓ Absolute privacy",
                    "✓ Freedom to choose servers",
                    "✓ Secure connection",
                    "✓ Easy to use",
                    "✓ Reliable data protection"
                ],
                "install_guide": `
📱 INSTALL SHIVA VPN:

1️⃣ Click "🛡️ Get secure access" below
2️⃣ Launch Shiva VPN bot in Telegram
3️⃣ Follow the instructions in the bot
4️⃣ Enjoy absolute privacy
                `
            },
            "uk": {
                "name": "Shiva VPN",
                "description": "Безпечний VPN з абсолютною приватністю та свободою вибору",
                "features": [
                    "✓ Абсолютна приватність",
                    "✓ Свобода вибору серверів",
                    "✓ Безпечне підключення",
                    "✓ Простота використання",
                    "✓ Надійний захист даних"
                ],
                "install_guide": `
📱 ВСТАНОВЛЕННЯ SHIVA VPN:

1️⃣ Натисніть «Отримати безпечний доступ» нижче
2️⃣ Запустіть бота Shiva VPN у Telegram
3️⃣ Дотримуйтесь інструкцій у боті
4️⃣ Насолоджуйтесь приватністю
                `
            },
            "pl": {
                "name": "Shiva VPN",
                "description": "Bezpieczny VPN z pełną prywatnością i wolnością wyboru",
                "features": [
                    "✓ Pełna prywatność",
                    "✓ Wolność wyboru serwerów",
                    "✓ Bezpieczne połączenie",
                    "✓ Łatwość użycia",
                    "✓ Niezawodna ochrona danych"
                ],
                "install_guide": `
📱 INSTALACJA SHIVA VPN:

1️⃣ Kliknij „🛡️ Uzyskaj bezpieczny dostęp” poniżej
2️⃣ Uruchom bota Shiva VPN w Telegramie
3️⃣ Postępuj zgodnie z instrukcjami w bocie
4️⃣ Ciesz się prywatnością
                `
            },
            "fa": {
                "name": "Shiva VPN",
                "description": "VPN امن با حریم خصوصی کامل و آزادی انتخاب",
                "features": [
                    "✓ حریم خصوصی کامل",
                    "✓ آزادی انتخاب سرور",
                    "✓ اتصال امن",
                    "✓ استفاده آسان",
                    "✓ محافظت مطمئن از داده‌ها"
                ],
                "install_guide": `
📱 نصب SHIVA VPN:

1️⃣ روی «🛡️ دسترسی امن» در پایین بزنید
2️⃣ ربات Shiva VPN را در تلگرام اجرا کنید
3️⃣ دستورالعمل‌ها را دنبال کنید
4️⃣ از حریم خصوصی کامل لذت ببرید
                `
            },
            "hi": {
                "name": "Shiva VPN",
                "description": "पूर्ण गोपनीयता और चयन की स्वतंत्रता वाला सुरक्षित VPN",
                "features": [
                    "✓ पूर्ण गोपनीयता",
                    "✓ सर्वर चुनने की स्वतंत्रता",
                    "✓ सुरक्षित कनेक्शन",
                    "✓ उपयोग में आसान",
                    "✓ विश्वसनीय डेटा सुरक्षा"
                ],
                "install_guide": `
📱 SHIVA VPN इंस्टॉल करें:

1️⃣ नीचे "🛡️ सुरक्षित एक्सेस प्राप्त करें" दबाएँ
2️⃣ Telegram में Shiva VPN बॉट शुरू करें
3️⃣ निर्देशों का पालन करें
4️⃣ पूर्ण गोपनीयता का आनंद लें
                `
            }
        }
    },
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

1️⃣ Нажмите кнопку "🧊 Получить продвинутый VPN" ниже
2️⃣ Выберите подходящий план (от $3.99/неделя)
3️⃣ Скачайте приложение для вашего устройства
4️⃣ Запустите приложение и подключитесь одним нажатием

💡 Особенности:
• Работает в самых строгих цензурных условиях
• Маскировка трафика под HTTPS
• Умная маршрутизация для максимальной скорости
        `,
        "translations": {
            "en": {
                "name": "Icegate VPN",
                "description": "Advanced VPN with traffic obfuscation and AI routing",
                "features": [
                    "✓ Bypass any blocks",
                    "✓ Unlimited bandwidth",
                    "✓ AI routing",
                    "✓ No-logs policy",
                    "✓ 10 devices supported"
                ],
                "install_guide": `
📱 INSTALL ICEGATE VPN:

1️⃣ Click "🧊 Get advanced VPN" below
2️⃣ Choose a plan (from $3.99/week)
3️⃣ Download the app
4️⃣ Connect with one tap
                `
            },
            "uk": {
                "name": "Icegate VPN",
                "description": "Просунута VPN з обфускацією трафіку та AI-маршрутизацією",
        "features": [
                    "✓ Обхід будь-яких блокувань",
                    "✓ Необмежений трафік",
                    "✓ AI-маршрутизація",
                    "✓ Політика no-logs",
                    "✓ Підтримка 10 пристроїв"
                ],
                "install_guide": `
📱 ВСТАНОВЛЕННЯ ICEGATE VPN:

1️⃣ «🧊 Отримати просунутий VPN»
2️⃣ Оберіть план (від $3.99/тиждень)
3️⃣ Завантажте додаток
4️⃣ Підключіться в один дотик
                `
            },
            "pl": {
                "name": "Icegate VPN",
                "description": "Zaawansowany VPN z zaciemnianiem ruchu i trasowaniem AI",
                "features": [
                    "✓ Omijanie blokad",
                    "✓ Nielimitowany transfer",
                    "✓ Trasowanie AI",
                    "✓ Polityka no-logs",
                    "✓ 10 urządzeń"
                ],
                "install_guide": `
📱 INSTALACJA ICEGATE VPN:

1️⃣ "🧊 Uzyskaj zaawansowany VPN"
2️⃣ Wybierz plan (od $3.99/tydz.)
3️⃣ Pobierz aplikację
4️⃣ Połącz jednym kliknięciem
                `
            },
            "fa": {
                "name": "Icegate VPN",
                "description": "VPN پیشرفته با مبهم‌سازی ترافیک و مسیریابی هوش مصنوعی",
                "features": [
                    "✓ دور زدن همه محدودیت‌ها",
                    "✓ ترافیک نامحدود",
                    "✓ مسیریابی هوشمند",
                    "✓ بدون لاگ",
                    "✓ پشتیبانی 10 دستگاه"
                ],
                "install_guide": `
📱 نصب ICEGATE VPN:

1️⃣ «🧊 دریافت VPN پیشرفته»
2️⃣ طرح را انتخاب کنید
3️⃣ اپ را دانلود کنید
4️⃣ با یک لمس متصل شوید
                `
            },
            "hi": {
                "name": "Icegate VPN",
                "description": "ट्रैफिक ऑबफुस्केशन और AI रूटिंग वाला उन्नत VPN",
                "features": [
                    "✓ किसी भी ब्लॉक को बायपास करें",
                    "✓ अनलिमिटेड बैंडविड्थ",
                    "✓ AI रूटिंग",
                    "✓ नो-लॉग्स नीति",
                    "✓ 10 डिवाइस सपोर्ट"
                ],
                "install_guide": `
📱 ICEGATE VPN इंस्टॉल:

1️⃣ "🧊 एडवांस्ड VPN पाएं"
2️⃣ प्लान चुनें
3️⃣ ऐप डाउनलोड करें
4️⃣ एक टैप में कनेक्ट करें
                `
            }
        }
    },
    "bebra": {
        "name": "Bebra VPN",
        "description": "Попробуйте за 0.5$ - быстрый и надежный VPN с отличным соотношением цена/качество",
        "ref_link": "https://bebra.cm/rmgdhvkcl",
        "features": [
            "✓ Попробовать за 0.5$",
            "✓ Высокая скорость подключения",
            "✓ Простая настройка",
            "✓ Надежная защита",
            "✓ Отличное соотношение цена/качество"
        ],
        "install_guide": `
📱 УСТАНОВКА BEBRA VPN:

1️⃣ Нажмите кнопку "🚀 Попробовать за 0.5$" ниже
2️⃣ Зарегистрируйтесь на сайте Bebra
3️⃣ Выберите план подписки
4️⃣ Скачайте приложение и наслаждайтесь

💡 Особенности:
• Один из самых доступных VPN
• Быстрая настройка за минуты
• Отличная скорость соединения
• Надежная защита ваших данных
        `,
        "translations": {
            "en": {
                "name": "Bebra VPN",
                "description": "Try for $0.5 – fast and reliable VPN with great value",
                "features": [
                    "✓ Try for $0.5",
                    "✓ High-speed connection",
                    "✓ Easy setup",
                    "✓ Reliable protection",
                    "✓ Great value for money"
                ],
                "install_guide": `
📱 INSTALL BEBRA VPN:

1️⃣ Click "🚀 Try for $0.5"
2️⃣ Sign up on Bebra
3️⃣ Choose a plan
4️⃣ Download the app and enjoy
                `
            },
            "uk": {
                "name": "Bebra VPN",
                "description": "Спробуйте за $0.5 – швидкий і надійний VPN з чудовою ціною",
                "features": [
                    "✓ Спробувати за $0.5",
                    "✓ Висока швидкість",
                    "✓ Проста настройка",
                    "✓ Надійний захист",
                    "✓ Відмінне співвідношення ціна/якість"
                ],
                "install_guide": `
📱 ВСТАНОВЛЕННЯ BEBRA VPN:

1️⃣ "🚀 Спробувати за $0.5"
2️⃣ Зареєструйтеся на Bebra
3️⃣ Оберіть план
4️⃣ Завантажте додаток
                `
            },
            "pl": {
                "name": "Bebra VPN",
                "description": "Wypróbuj za $0.5 – szybki i niezawodny VPN w świetnej cenie",
                "features": [
                    "✓ Wypróbuj za $0.5",
                    "✓ Wysoka prędkość",
                    "✓ Prosta konfiguracja",
                    "✓ Niezawodna ochrona",
                    "✓ Świetny stosunek jakości do ceny"
                ],
                "install_guide": `
📱 INSTALACJA BEBRA VPN:

1️⃣ „🚀 Wypróbuj za $0.5”
2️⃣ Zarejestruj się w Bebra
3️⃣ Wybierz plan
4️⃣ Pobierz aplikację
                `
            },
            "fa": {
                "name": "Bebra VPN",
                "description": "با 0.5$ امتحان کنید – VPN سریع و قابل اعتماد با قیمت عالی",
                "features": [
                    "✓ امتحان با 0.5$",
                    "✓ سرعت بالا",
                    "✓ راه‌اندازی آسان",
                    "✓ محافظت قابل اعتماد",
                    "✓ ارزش خرید عالی"
                ],
                "install_guide": `
📱 نصب BEBRA VPN:

1️⃣ «🚀 امتحان با 0.5$»
2️⃣ در Bebra ثبت‌نام کنید
3️⃣ طرح را انتخاب کنید
4️⃣ اپ را دانلود کنید
                `
            },
            "hi": {
                "name": "Bebra VPN",
                "description": "$0.5 में आज़माएँ – तेज़ और भरोसेमंद VPN बेहतरीन कीमत पर",
                "features": [
                    "✓ $0.5 में ट्राय",
                    "✓ हाई-स्पीड कनेक्शन",
                    "✓ आसान सेटअप",
                    "✓ भरोसेमंद सुरक्षा",
                    "✓ पैसों की पूरी वसूल"
                ],
                "install_guide": `
📱 BEBRA VPN इंस्टॉल:

1️⃣ "🚀 $0.5 में ट्राय" दबाएँ
2️⃣ Bebra पर साइन अप करें
3️⃣ प्लान चुनें
4️⃣ ऐप डाउनलोड करें
                `
            }
        }
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

1️⃣ Нажмите кнопку "❄️ Получить премиум защиту" ниже
2️⃣ Выберите подходящий тарифный план
3️⃣ Скачайте NordVPN для вашего устройства
4️⃣ Запустите приложение и войдите
5️⃣ Выберите сервер и активируйте защиту

💡 Особенности:
• Двойное шифрование для максимальной безопасности
• Встроенная защита от рекламы и вредоносных сайтов
• Специальные серверы для P2P и стриминга
        `,
        "translations": {
            "en": {
                "name": "NordVPN",
                "description": "Secure VPN with double encryption and CyberSec",
                "features": [
                    "✓ Double encryption",
                    "✓ CyberSec protection",
                    "✓ 5400+ servers",
                    "✓ Kill Switch",
                    "✓ 6 simultaneous connections"
                ],
                "install_guide": `
📱 INSTALL NORDVPN:

1️⃣ "❄️ Get premium protection"
2️⃣ Choose a plan
3️⃣ Download the app
4️⃣ Sign in
5️⃣ Connect to a server
                `
            },
            "uk": {
                "name": "NordVPN",
                "description": "Безпечний VPN з подвійним шифруванням та CyberSec",
        "features": [
                    "✓ Подвійне шифрування",
                    "✓ Захист CyberSec",
                    "✓ 5400+ серверів",
                    "✓ Kill Switch",
                    "✓ 6 одночасних підключень"
        ],
        "install_guide": `
📱 ВСТАНОВЛЕННЯ NORDVPN:

1️⃣ «❄️ Отримати преміум-захист»
2️⃣ Оберіть план
3️⃣ Завантажте застосунок
4️⃣ Увійдіть
5️⃣ Підключіться до сервера
                `
            },
            "pl": {
                "name": "NordVPN",
                "description": "Bezpieczny VPN z podwójnym szyfrowaniem i CyberSec",
                "features": [
                    "✓ Podwójne szyfrowanie",
                    "✓ Ochrona CyberSec",
                    "✓ 5400+ serwerów",
                    "✓ Kill Switch",
                    "✓ 6 jednoczesnych połączeń"
                ],
                "install_guide": `
📱 INSTALACJA NORDVPN:

1️⃣ „❄️ Uzyskaj ochronę premium”
2️⃣ Wybierz plan
3️⃣ Pobierz aplikację
4️⃣ Zaloguj się
5️⃣ Połącz z serwerem
                `
            },
            "fa": {
                "name": "NordVPN",
                "description": "VPN امن با رمزگذاری دوگانه و CyberSec",
                "features": [
                    "✓ رمزگذاری دوگانه",
                    "✓ محافظت CyberSec",
                    "✓ بیش از 5400 سرور",
                    "✓ Kill Switch",
                    "✓ 6 اتصال همزمان"
                ],
                "install_guide": `
📱 نصب NORDVPN:

1️⃣ «❄️ دریافت محافظت پریمیوم»
2️⃣ طرح را انتخاب کنید
3️⃣ اپ را دانلود کنید
4️⃣ وارد شوید
5️⃣ به سرور متصل شوید
                `
            },
            "hi": {
                "name": "NordVPN",
                "description": "डबल एन्क्रिप्शन और CyberSec वाला सुरक्षित VPN",
                "features": [
                    "✓ डबल एन्क्रिप्शन",
                    "✓ CyberSec सुरक्षा",
                    "✓ 5400+ सर्वर",
                    "✓ Kill Switch",
                    "✓ 6 एक साथ कनेक्शन"
                ],
                "install_guide": `
📱 NORDVPN इंस्टॉल:

1️⃣ "❄️ प्रीमियम सुरक्षा पाएं"
2️⃣ प्लान चुनें
3️⃣ ऐप डाउनलोड करें
4️⃣ साइन इन करें
5️⃣ सर्वर से कनेक्ट करें
                `
            }
        }
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

// Лучшее возможное "очистить чат": удаляем последние сообщения по ID (бот может удалять свои, а в группах — при наличии прав)
async function purgeChatHistory(chatId, lastMessageId, depth = 120, keepMessageId = null) {
    try {
        const maxDepth = Math.max(1, Math.min(depth, 300));
        const tasks = [];
        for (let i = 0; i < maxDepth; i++) {
            const targetId = lastMessageId - i;
            if (targetId <= 0) break;
            if (keepMessageId && targetId === keepMessageId) {
                continue;
            }
            tasks.push(bot.deleteMessage(chatId, targetId).catch(() => {}));
        }
        // Выполняем пачками, чтобы не словить лимиты Telegram
        const chunkSize = 30;
        for (let i = 0; i < tasks.length; i += chunkSize) {
            const chunk = tasks.slice(i, i + chunkSize);
            // eslint-disable-next-line no-await-in-loop
            await Promise.all(chunk);
        }
    } catch (_) {
        // ignore
    }
}

// Функция для создания главного меню
function createMainMenu(language = 'ru') {
    const keyboard = [];
    
    // Логотипы VPN брендов (уникальные для каждого)
    const logos = {
        'shiva': '🛡️',       // Shiva - щит (защита)
        'icegate': '🧊',      // Ice - лед
        'bebra': '🚀',        // Bebra - ракета (быстрота)
        'nordvpn': '❄️'       // Nord - север, снежинка
    };
    
    // Фиксированная длина префикса (эмодзи + пробел) для выравнивания текста
    const emojiPrefixLength = 3; // эмодзи + пробел + дополнительный пробел для выравнивания
    
    Object.keys(VPN_PROVIDERS).forEach(vpnId => {
        const vpnData = VPN_PROVIDERS[vpnId];
        const logo = logos[vpnId] || '🔒';
        
        // Создаем префикс с фиксированной длиной для выравнивания текста
        const emojiPrefix = `${logo} `;
        const paddedPrefix = emojiPrefix.padEnd(emojiPrefixLength, ' ');
        
        const translatedName = vpnData.translations?.[language]?.name || vpnData.name;
        const buttonText = `${paddedPrefix}${translatedName}`;
        
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
    const t = vpnData.translations?.[language] || {};
    const name = t.name || vpnData.name;
    const description = t.description || vpnData.description;
    const features = (t.features || vpnData.features || []).join('\n');
    const installGuide = t.install_guide || vpnData.install_guide || '';
    
    const infoText = `🔒 *${name}*

📝 *${getTranslation(language, 'description')}*
${description}

🔗 *${getTranslation(language, 'referralLinkText')}*
[${getTranslation(language, 'openWebsite')}](${vpnData.ref_link})

✨ *${getTranslation(language, 'mainFeatures')}*
${features}

${installGuide}

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
        ...createMainMenu(language)
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
bot.onText(/\/start/, async (msg) => {
    try {
        // Проверяем корректность сообщения
        if (!msg || !msg.chat || !msg.from) {
            console.error('Некорректное сообщение /start:', msg);
            return;
        }

        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.first_name || 'Пользователь';
        const chatType = msg.chat.type;
        
        // Пытаемся очистить чат (насколько позволяет Telegram)
        try {
            await purgeChatHistory(chatId, msg.message_id, 150, msg.message_id);
        } catch (error) {
            console.warn('Ошибка очистки чата:', error);
        }

        // Определяем предпочтительный язык и страну пользователя
        const preferredLang = detectPreferredLanguageFromMessage(msg) || 'ru';
        const country = detectCountryFromMessage(msg);
        userLanguage.set(userId, preferredLang);
        
        // Обновим статистику по странам
        try {
            incrementCountry(country);
        } catch (error) {
            console.warn('Ошибка обновления статистики:', error);
        }
        
        console.log(`Команда /start от пользователя ${chatId} (${userName})`);
        
        // Логируем действие пользователя
        try {
        logger.logAction(userId, 'ЗАПУСК_БОТА', `Пользователь ${userName} запустил бота`);
        } catch (error) {
            console.warn('Ошибка логирования:', error);
        }
        
        // Сообщение выбора языка
        const languageText = `🦅🌍 *vpnRossBot - Свободный VPN по всему миру*

🌍 *Выберите язык / Choose language / Wybierz język / Оберіть мову / زبان را انتخاب کنید / भाषा चुनें*

Please select your preferred language:
Proszę wybrać preferowany język:
Будь ласка, оберіть бажану мову:
Пожалуйста, выберите предпочитаемый язык:
لطفاً زبان خود را انتخاب کنید:
कृपया अपनी भाषा चुनें:
`;

        const languageButtons = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🇮🇷 فارسی", callback_data: "lang_fa" },
                        { text: "🇮🇳 हिन्दी", callback_data: "lang_hi" }
                    ],
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

        const welcomeText = buildWelcomeText(translations, preferredLang, userName);

        resetInputPlaceholder(chatId).finally(() => {
            // Сначала только приветствие на языке пользователя
            bot.sendMessage(chatId, welcomeText, {
                reply_markup: {
                    inline_keyboard: [[
                        { text: getTranslation(preferredLang, 'startVPNSelection'), callback_data: 'start_vpn_selection' }
                    ]]
                },
                parse_mode: 'Markdown'
            }).catch(error => {
                console.error('Ошибка при отправке приветствия:', error);
            });
        });
    } catch (error) {
        console.error('Ошибка в обработчике /start:', error);
    }
});

// Команда /stats — показать распределение пользователей по странам
bot.onText(/\/stats/, (msg) => {
    try {
        // Проверяем корректность сообщения
        if (!msg || !msg.chat) {
            console.error('Некорректное сообщение /stats:', msg);
            return;
        }

        const chatId = msg.chat.id;
        const { total, entries } = getPercentages();
        const lines = entries.map(e => `${e.country}: ${e.count} (${e.percent}%)`);
        const text = `📊 Country distribution (total ${total}):\n${lines.join('\n') || 'No data yet'}`;
        bot.sendMessage(chatId, text).catch(error => {
            console.error('Ошибка отправки статистики:', error);
        });
    } catch (error) {
        console.error('Ошибка /stats:', error);
    }
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
    try {
        // Проверяем корректность сообщения
        if (!msg || !msg.chat || !msg.from) {
            console.error('Некорректное сообщение /help:', msg);
            return;
        }

        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.first_name || 'Пользователь';
        
        console.log(`Команда /help от пользователя ${chatId} (${userName})`);
        
        // Логируем действие пользователя
        try {
        logger.logAction(userId, 'ЗАПРОС_ПОМОЩИ', `Пользователь ${userName} запросил справку`);
        } catch (error) {
            console.warn('Ошибка логирования запроса помощи:', error);
        }
        
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
                        { text: "🇮🇷 فارسی", callback_data: "help_lang_fa" },
                        { text: "🇮🇳 हिन्दी", callback_data: "help_lang_hi" }
                    ],
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
        // Проверяем корректность callback
        if (!callbackQuery || !callbackQuery.message || !callbackQuery.data) {
            console.error('Некорректный callback:', callbackQuery);
            return;
        }

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
            try {
            logger.logAction(userId, 'ВЫБОР_ЯЗЫКА', `Выбран язык: ${language}`);
            } catch (error) {
                console.warn('Ошибка логирования выбора языка:', error);
            }
            
            // Сохраняем язык пользователя
            userLanguage.set(callbackQuery.from.id, language);
            // Сразу показываем главное меню с кнопками выбора VPN на выбранном языке
            showMainMenu(chatId, messageId, language);
            
        } else if (data.startsWith('help_lang_')) {
            const language = data.replace('help_lang_', '');
            const userId = callbackQuery.from.id;
            
            console.log(`Пользователь выбрал язык для помощи: ${language}`);
            
            // Логируем выбор языка для помощи
            try {
            logger.logAction(userId, 'ВЫБОР_ЯЗЫКА_ПОМОЩИ', `Выбран язык для помощи: ${language}`);
            } catch (error) {
                console.warn('Ошибка логирования выбора языка помощи:', error);
            }
            
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
            try {
            logger.logAction(userId, 'ВЫБОР_VPN', `Выбран VPN: ${VPN_PROVIDERS[vpnId]?.name || vpnId}`);
            } catch (error) {
                console.warn('Ошибка логирования выбора VPN:', error);
            }
            
            // Показываем информацию о VPN c учетом выбранного языка пользователя
            const language = userLanguage.get(userId) || 'ru';
            showVpnInfo(chatId, messageId, vpnId, language);
        } else if (data === 'back_to_menu') {
            const userId = callbackQuery.from.id;
            console.log('Возвращаемся к главному меню');
            
            // Логируем возврат в меню
            try {
            logger.logAction(userId, 'ВОЗВРАТ_В_МЕНЮ', 'Пользователь вернулся в главное меню');
            } catch (error) {
                console.warn('Ошибка логирования возврата в меню:', error);
            }
            
            // Показываем главное меню c учетом выбранного языка пользователя
            const language = userLanguage.get(userId) || 'ru';
            showMainMenu(chatId, messageId, language);
        } else if (data === 'start_vpn_selection') {
            const userId = callbackQuery.from.id;
            console.log('Пользователь начал выбор VPN');
            
            // Логируем начало выбора VPN
            try {
            logger.logAction(userId, 'НАЧАЛО_ВЫБОРА_VPN', 'Пользователь нажал кнопку начала выбора');
            } catch (error) {
                console.warn('Ошибка логирования начала выбора VPN:', error);
            }
            
            // После приветствия начинаем выбор языка
            const languageText = `🌍 *Выберите язык / Choose language / Wybierz język / Оберіть мову / زبان را انتخاب کنید / भाषा चुनें*

Please select your preferred language:
Proszę wybrać preferowany język:
Будь ласка, оберіть бажану мову:
Пожалуйста, выберите предпочитаемый язык:
لطفاً زبان خود را انتخاب کنید:
कृपया अपनी भाषा चुनें:`;

            const languageButtons = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "🇮🇷 فارسی", callback_data: "lang_fa" },
                            { text: "🇮🇳 हिन्दी", callback_data: "lang_hi" }
                        ],
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

            bot.editMessageText(languageText, {
                chat_id: chatId,
                message_id: messageId,
                ...languageButtons
            }).catch(() => {
                bot.sendMessage(chatId, languageText, languageButtons).catch(() => {});
            });
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
