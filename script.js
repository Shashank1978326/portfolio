document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Sticky Header Scroll Effect ---
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Hamburger Mobile Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', !isOpen);
      
      // Toggle menu icon
      const icon = hamburger.querySelector('i');
      if (icon && typeof lucide !== 'undefined') {
        if (!isOpen) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons({ attrs: { class: 'lucide-icon' } });
      }
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        const icon = hamburger.querySelector('i');
        if (icon && typeof lucide !== 'undefined') {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // --- Scroll Spy: Update Active Link (Only if hash links are present) ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollSpyOptions = {
    threshold: 0.3,
    rootMargin: '-80px 0px 0px 0px'
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const hasHashLink = Array.from(navLinks).some(link => link.getAttribute('href') === `#${id}`);
        if (hasHashLink) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => scrollSpyObserver.observe(section));

  // --- Hero Section Typing Effect ---
  const typingWords = [
    "Computer Science Student",
    "Software Developer",
    "AI Enthusiast",
    "Problem Solver"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const targetSpan = document.getElementById('hero-tagline');

  function typeEffect() {
    if (!targetSpan) return;

    const currentWord = typingWords[wordIndex];
    
    if (isDeleting) {
      targetSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      targetSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      speed = 400; // Pause before typing next word
    }

    setTimeout(typeEffect, speed);
  }
  
  if (targetSpan) {
    typeEffect();
  }

  // --- Interactive Skills Filter Matrix ---
  const tabButtons = document.querySelectorAll('.skills-tab');
  const panels = document.querySelectorAll('.skills-category-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetCategory = button.getAttribute('data-category');
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      panels.forEach(panel => {
        const panelCategory = panel.getAttribute('data-category');
        if (targetCategory === 'all' || targetCategory === panelCategory) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // --- Custom Project Card Hover Glow/3D-Tilt Effect ---
  const cards = document.querySelectorAll('.project-card, .education-card, .about-text-card, .achievement-card, .contact-card, .contact-form-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate coordinates relative to center (for mild 3D tilts)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 3; // Max 3 deg
      const rotateY = ((x - centerX) / centerX) * 3; // Max 3 deg
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Adding customized dynamic shadow glow matching mouse direction
      card.style.boxShadow = `${rotateY * -2}px ${rotateX * 2}px 25px rgba(129, 140, 248, 0.12)`;
    });

    card.style.transition = 'transform 0.1s ease, box-shadow 0.2s ease';

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.boxShadow = 'none';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    });
  });

  // --- Copy to Clipboard Handler ---
  function setupCopyBtn(btnId, targetId, messageText) {
    const btn = document.getElementById(btnId);
    const target = document.getElementById(targetId);
    
    if (btn && target) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = target.textContent.trim();
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Success Feedback
          const tooltip = document.createElement('span');
          tooltip.className = 'copy-success-tip';
          tooltip.textContent = messageText;
          tooltip.style.left = `${e.clientX}px`;
          tooltip.style.top = `${e.clientY}px`;
          document.body.appendChild(tooltip);
          
          // Remove notification element after animation completes
          setTimeout(() => {
            tooltip.remove();
          }, 1500);

          // Change button icon to success check
          const icon = btn.querySelector('i');
          if (icon && typeof lucide !== 'undefined') {
            icon.setAttribute('data-lucide', 'check');
            lucide.createIcons();
            btn.style.color = 'var(--secondary)';
            
            setTimeout(() => {
              icon.setAttribute('data-lucide', 'copy');
              lucide.createIcons();
              btn.style.color = '';
            }, 2000);
          }
        }).catch(err => {
          console.error('Copy failed: ', err);
        });
      });
    }
  }

  setupCopyBtn('btn-copy-email', 'val-email', 'Email copied!');
  setupCopyBtn('btn-copy-phone', 'val-phone', 'Phone copied!');

  // --- Recruiter Contact Form Mock Submit ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('btn-submit-message');
      const originalContent = submitBtn.innerHTML;
      
      // Trigger visually pleasing button loading animation state
      submitBtn.innerHTML = 'Sending... <i data-lucide="loader" class="animate-spin"></i>';
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      submitBtn.disabled = true;

      // Simulate network request delays
      setTimeout(() => {
        // Reset form & notify recruiter of success message
        contactForm.reset();
        submitBtn.innerHTML = 'Message Sent! <i data-lucide="check-circle-2"></i>';
        submitBtn.style.background = 'var(--gradient-secondary)';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        // Return button back to original state after visual cooldown
        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }, 3000);
      }, 1500);
    });
  }
});
