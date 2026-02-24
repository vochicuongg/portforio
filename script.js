/**
 * Portfolio - Võ Chí Cường
 * script.js - All interactive features
 */

// ===================== 1. DARK / LIGHT MODE =====================
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Load saved preference; default = dark
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // Swap icon: moon for dark, sun for light
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

// ===================== 2. HEADER SCROLL EFFECT =====================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNavLink();
  toggleBackToTop();
});

// ===================== 3. ACTIVE NAV LINK ON SCROLL =====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// ===================== 4. HAMBURGER MENU =====================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
});

// Close mobile menu when a link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  }
});

// ===================== 5. TYPING EFFECT (Hero) =====================
const typingEl = document.getElementById('typingText');

// Words to cycle through
const words = [
  'Lập trình viên Flutter',
  'Web Developer',
  'Mobile Developer',
  'Wear OS Enthusiast',
  'UI/UX Coder',
  'Network Engineer',
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 90;

function typeWriter() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    // Remove a character
    typingEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    // Add a character
    typingEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 90;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    // Pause at end of word
    isDeleting = true;
    typeSpeed = 1500;
  } else if (isDeleting && charIndex === 0) {
    // Move to next word
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 300;
  }

  setTimeout(typeWriter, typeSpeed);
}

// Start typing after a small delay
setTimeout(typeWriter, 800);

// ===================== 6. SCROLL REVEAL ANIMATION =====================
/**
 * Uses IntersectionObserver to reveal elements with the .reveal class
 * as they enter the viewport. Also triggers skill bar animations.
 */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars inside this element
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animated');
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===================== 7. SKILL BAR ANIMATION (section-level) =====================
// Also observe the skills section as a whole to trigger bars
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.skill-fill').forEach(bar => {
          bar.classList.add('animated');
        });
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });
  skillObserver.observe(skillsSection);
}

// ===================== 8. 3D TILT EFFECT ON HERO CARD =====================
const heroCard = document.getElementById('heroCard');

if (heroCard && window.innerWidth > 768) {
  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Calculate angle based on mouse distance from center
    const rotX = ((e.clientY - cy) / (rect.height / 2)) * -8;
    const rotY = ((e.clientX - cx) / (rect.width / 2)) * 8;
    heroCard.querySelector('.hero-card-inner').style.transform =
      `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.querySelector('.hero-card-inner').style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

// ===================== 9. BACK TO TOP BUTTON =====================
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== 10. CONTACT FORM =====================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic validation
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    showFormStatus('Vui lòng điền đầy đủ thông tin!', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFormStatus('Email không hợp lệ. Vui lòng kiểm tra lại!', 'error');
    return;
  }

  // Simulate sending (replace with real fetch/API call)
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
  submitBtn.disabled = true;

  await delay(1500); // Simulate API latency

  // SUCCESS (mock)
  showFormStatus('✅ Tin nhắn đã được gửi! Tôi sẽ phản hồi sớm nhất có thể.', 'success');
  contactForm.reset();
  submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gửi tin nhắn';
  submitBtn.disabled = false;
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = `form-status ${type}`;
  setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 5000);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================== 11. SMOOTH SCROLL FOR ANCHOR LINKS =====================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ===================== 12. NAV LINKS (smooth scroll) =====================
// Also handled above, but double-check mobile links
mobileLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ===================== 13. STAGGER REVEAL FOR GRID CARDS =====================
/**
 * Adds incremental transition-delay to cards inside grids
 * so they animate in sequence rather than all at once.
 */
const staggerContainers = [
  '.projects-grid',
  '.skills-grid',
  '.contact-info',
];

staggerContainers.forEach(selector => {
  const container = document.querySelector(selector);
  if (!container) return;
  container.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });
});

// ===================== INIT =====================
// Run once on page load
updateActiveNavLink();
toggleBackToTop();
