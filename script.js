// انتخاب المان‌های مورد نیاز از صفحه
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalOverlay = document.getElementById('register-modal');
const registerForm = document.getElementById('register-form');
const successMessage = document.getElementById('success-message');
const welcomeTitle = document.getElementById('welcome-title');

// ۱. باز کردن پنجره پاپ‌آپ با کلیک روی دکمه اصلی
openModalBtn.addEventListener('click', function () {
    modalOverlay.classList.add('active');
});

// ۲. بستن پنجره با کلیک روی دکمه ضربدر
closeModalBtn.addEventListener('click', function () {
    modalOverlay.classList.remove('active');
});

// ۳. بستن پنجره در صورت لمس فضای تاریک بیرون از کادر
modalOverlay.addEventListener('click', function (event) {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

// ۴. مدیریت ارسال فرم ثبت‌نام
registerForm.addEventListener('submit', function (event) {
    // جلوگیری از رفرش شدن صفحه
    event.preventDefault();

    const userName = document.getElementById('user-name').value.trim();

    if (userName !== "") {
        // مخفی کردن فرم و نمایش پیام موفقیت
        registerForm.style.display = 'none';
        welcomeTitle.textContent = `درود بر شما، ${userName} عزیز!`;
        successMessage.style.display = 'block';

        // تغییر وضعیت دکمه اصلی در صفحه
        openModalBtn.textContent = "ثبت‌نام شما با موفقیت انجام شد ✓";
        openModalBtn.style.background = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";

        // بستن خودکار پاپ‌آپ بعد از ۳ ثانیه
        setTimeout(function () {
            modalOverlay.classList.remove('active');
        }, 3000);
    }
});
// ۵. مدیریت بخش نظرات با ماندگاری در LocalStorage
const commentInput = document.getElementById('comment-input');
const sendCommentBtn = document.getElementById('send-comment-btn');
const commentsList = document.getElementById('comments-list');

// الف) خواندن نظرات ذخیره‌شده قبلی از حافظه
let savedComments = JSON.parse(localStorage.getItem('bookComments')) || [];

// ب) تابعی برای نمایش نظرات در صفحه
function displayComments() {
    commentsList.innerHTML = ''; // پاکسازی لیست برای رسم دوباره

    if (savedComments.length === 0) {
        commentsList.innerHTML = '<p class="empty-notice">هنوز دیدگاهی ثبت نشده است. اولین نظر را شما بنویسید!</p>';
        return;
    }

    savedComments.forEach(function (text) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'user-comment-item';
        commentDiv.textContent = text;
        commentsList.appendChild(commentDiv);
    });
}

// اجرای تابع برای بار اول هنگام باز شدن صفحه
displayComments();

// ج) ثبت نظر جدید
sendCommentBtn.addEventListener('click', function () {
    const commentText = commentInput.value.trim();

    if (commentText === "") {
        alert("لطفاً ابتدا متنی برای نظر خود بنویسید.");
        return;
    }

    // اضافه کردن نظر جدید به ابتدای آرایه
    savedComments.unshift(commentText);

    // ذخیره آرایه جدید در حافظه گوشی
    localStorage.setItem('bookComments', JSON.stringify(savedComments));

    // نمایش دوباره لیست به‌روز شده
    displayComments();

    // خالی کردن کادر ورودی
    commentInput.value = "";
});
// ۶. اتصال به API و ترجمه خودکار به فارسی
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const getQuoteBtn = document.getElementById('get-quote-btn');

function fetchRandomQuote() {
    quoteText.textContent = "در حال دریافت و ترجمه نقل‌قول...";
    quoteAuthor.textContent = "---";
    quoteText.style.direction = "rtl";

    // قدم اول: دریافت نقل‌قول انگلیسی از سرور
    fetch('https://dummyjson.com/quotes/random')
        .then(response => response.json())
        .then(data => {
            const englishQuote = data.quote;
            const author = data.author;

            // قدم دوم: ارسال متن انگلیسی به API رایگان ترجمه
            const translateUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishQuote)}&langpair=en|fa`;

            return fetch(translateUrl)
                .then(res => res.json())
                .then(transData => {
                    // متن ترجمه شده فارسی
                    const farsiQuote = transData.responseData.translatedText;
                    
                    // نمایش نقل‌قول فارسی در صفحه
                    quoteText.textContent = `«${farsiQuote}»`;
                    quoteAuthor.textContent = `— ${author}`;
                });
        })
        .catch(err => {
            quoteText.textContent = "«زندگی شاید یک خیابان دراز است که هر روز زنی با زنبیل از آن می‌گذرد...»";
            quoteAuthor.textContent = "— فروغ فرخزاد (نمایش آفلاین)";
            console.error("خطا:", err);
        });
}

fetchRandomQuote();
getQuoteBtn.addEventListener('click', fetchRandomQuote);
// ۷. مدیریت چت‌بات هوشمند ادبی
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

// بانک دانش دستیار هوشمند درباره کتاب
const bookKnowledge = [
    {
        keywords: ['آیدین', 'ایدین'],
        reply: '«آیدین» نماد تفکر، هنر، شعر و نوگرایی است. او قربانی تحجر محیط سنتی، حسادت برادرش اورهان و خشونت استبدادی پدرش (جابر اورخانی) می‌شود.'
    },
    {
        keywords: ['اورهان', 'برادر'],
        reply: '«اورهان» برادر آیدین و نماد طمع، کسب مال و تفکر خشک سنتی است که در نهایت از حسادت سر به نابودی می‌گذارد.'
    },
    {
        keywords: ['پیام', 'مفهوم', 'معنی', 'هدف'],
        reply: 'پیام محوری رمان، مرگ آگاهی، تقابل دردناک روشنفکری با تعصب کورکورانه و فروپاشی انسان‌ها در بستری از جهل اجتماعی است.'
    },
    {
        keywords: ['برف', 'سرما', 'اردبیل'],
        reply: 'برف و سرمای اردبیل در رمان تنها شرایط جوی نیستند؛ نماد انجماد جامعه، خفقان فکری و سکون مرگ‌بار حاکم بر شخصیت‌ها هستند.'
    },
    {
        keywords: ['سورهان', 'آیدا', 'خواهر'],
        reply: '«آیدا» خواهر دوقلوی آیدین، نماد نسل سرکوب‌شده زنان است که قربانی ازدواجی از سر درماندگی و تحقیر خانوادگی می‌شود.'
    }
];

function handleUserChat() {
    const text = chatInput.value.trim();
    if (text === "") return;

    // ۱. نمایش پیام کاربر در چت
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-msg user-msg';
    userBubble.textContent = text;
    chatWindow.appendChild(userBubble);

    chatInput.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight; // اسکرول خودکار به پایین

    // ۲. پردازش پاسخ دستیار
    setTimeout(() => {
        let matchedReply = "پرسش جالبی است! اما تمرکز تحلیلی من روی رمان «سمفونی مردگان»، شخصیت‌های آیدین، اورهان، آیدا و نمادهای داستان است.";

        for (const item of bookKnowledge) {
            const hasKeyword = item.keywords.some(kw => text.includes(kw));
            if (hasKeyword) {
                matchedReply = item.reply;
                break;
            }
        }

        const botBubble = document.createElement('div');
        botBubble.className = 'chat-msg bot-msg';
        botBubble.textContent = matchedReply;
        chatWindow.appendChild(botBubble);

        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 450);
}

sendChatBtn.addEventListener('click', handleUserChat);

// امکان ارسال با زدن دکمه اینتر روی کیبورد گوشی
chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleUserChat();
    }
});

