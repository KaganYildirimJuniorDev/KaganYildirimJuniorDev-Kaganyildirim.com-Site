// ============================================
// BIZIM HIKAYEMIZ - ROMANTIC APOLOGY WEBSITE
// Interactive Features & Animations
// ============================================

// ============================================
// 1️⃣ SMOOTH SCROLL - Hero Button
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const continueBtn = document.getElementById('continueBtn');
    const ourStorySection = document.getElementById('our-story');

    continueBtn.addEventListener('click', function () {
        ourStorySection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ============================================
// 2️⃣ DYNAMIC DAY COUNTER
// Calculates years, months, days, hours, minutes, and seconds since relationship started
// ============================================
function calculateDaysTogether() {
    // Relationship start date: 3 Kasım 2025, 00:12
    const startDate = new Date('2025-11-03T00:12:00');
    const today = new Date();

    // Calculate difference in milliseconds
    const diffTime = Math.abs(today - startDate);

    // Calculate time units
    const msPerMinute = 1000 * 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30.44; // Average month length
    const msPerYear = msPerDay * 365.25; // Account for leap years

    // Calculate each unit
    const years = Math.floor(diffTime / msPerYear);
    const remainingAfterYears = diffTime - (years * msPerYear);

    const months = Math.floor(remainingAfterYears / msPerMonth);
    const remainingAfterMonths = remainingAfterYears - (months * msPerMonth);

    const days = Math.floor(remainingAfterMonths / msPerDay);
    const remainingAfterDays = remainingAfterMonths - (days * msPerDay);

    const hours = Math.floor(remainingAfterDays / msPerHour);
    const remainingAfterHours = remainingAfterDays - (hours * msPerHour);

    const minutes = Math.floor(remainingAfterHours / msPerMinute);
    const remainingAfterMinutes = remainingAfterHours - (minutes * msPerMinute);

    const seconds = Math.floor(remainingAfterMinutes / 1000);

    // Build the display text
    let timeText = '';

    if (years > 0) {
        timeText += `${years} yıl `;
    }
    if (months > 0) {
        timeText += `${months} ay `;
    }
    if (days > 0) {
        timeText += `${days} gün `;
    }
    if (hours > 0) {
        timeText += `${hours} saat `;
    }
    if (minutes > 0) {
        timeText += `${minutes} dakika `;
    }
    if (seconds > 0) {
        timeText += `${seconds} saniye `;
    }

    // If no time has passed yet (future date)
    if (timeText === '') {
        timeText = 'Henüz başlamadı ';
    }

    timeText += 'birlikte geçirdik. ❤️';

    // Update the counter text
    const counterElement = document.getElementById('dayCounter');
    counterElement.textContent = timeText;
}

// Run the counter when page loads and update every second for live counting
document.addEventListener('DOMContentLoaded', function () {
    calculateDaysTogether();
    // Update every second to show live seconds
    setInterval(calculateDaysTogether, 1000);
});

// ============================================
// 3️⃣ SCROLL ANIMATIONS
// Fade-in effect using IntersectionObserver
// ============================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    // IntersectionObserver options
    const observerOptions = {
        threshold: 0.2, // Trigger when 20% of element is visible
        rootMargin: '0px 0px -50px 0px'
    };

    // Callback function when element enters viewport
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    };

    // Create observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all fade-in elements
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ============================================
// 4️⃣ YES BUTTON - Heart Animation & Message
// ============================================
function handleYesClick() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const heartParticlesContainer = document.getElementById('heartParticles');

    // Hide both buttons
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';

    // Show thank you message
    thankYouMessage.classList.remove('hidden');

    // Create floating hearts
    createFloatingHearts(heartParticlesContainer);
}

// Create multiple floating heart particles
function createFloatingHearts(container) {
    const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💞', '❤️', '💘'];
    const numberOfHearts = 30;

    for (let i = 0; i < numberOfHearts; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

            // Random horizontal position
            heart.style.left = Math.random() * 100 + '%';

            // Random animation delay
            heart.style.animationDelay = Math.random() * 0.5 + 's';

            // Random size variation
            const size = 1.5 + Math.random() * 1.5;
            heart.style.fontSize = size + 'rem';

            container.appendChild(heart);

            // Remove heart after animation completes
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 100); // Stagger the heart creation
    }
}

// Attach YES button click event
document.addEventListener('DOMContentLoaded', function () {
    const yesBtn = document.getElementById('yesBtn');
    yesBtn.addEventListener('click', handleYesClick);
});

// ============================================
// 5️⃣ NO BUTTON - Random Movement on Hover
// Fun evasion effect
// ============================================
function handleNoButtonHover() {
    const noBtn = document.getElementById('noBtn');

    noBtn.addEventListener('mouseenter', function () {
        moveButtonRandomly(noBtn);
    });

    // For mobile touch devices
    noBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        moveButtonRandomly(noBtn);
    });
}

// Move button to random position on screen
function moveButtonRandomly(button) {
    // Get viewport dimensions
    const maxX = window.innerWidth - button.offsetWidth - 40;
    const maxY = window.innerHeight - button.offsetHeight - 40;

    // Generate random position
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    // Apply position
    button.style.position = 'fixed';
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
    button.style.transition = 'all 0.3s ease';
}

// Initialize NO button behavior
document.addEventListener('DOMContentLoaded', handleNoButtonHover);

// ============================================
// 6️⃣ ADDITIONAL POLISH
// ============================================

// Add subtle parallax effect to hero section
window.addEventListener('scroll', function () {
    const heroSection = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;

    if (heroSection) {
        heroSection.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Prevent right-click context menu on images (optional protection)
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    });
});

// ============================================
// CONSOLE MESSAGE (Easter Egg)
// ============================================
console.log('%c💕 Bu site senin için özel olarak yapıldı 💕',
    'font-size: 20px; color: #FFB6C1; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%cSeni seviyorum ❤️',
    'font-size: 16px; color: #FF69B4; font-weight: bold;');
