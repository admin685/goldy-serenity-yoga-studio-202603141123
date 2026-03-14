// Serenity Yoga Studio - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // ===== Mobile Navigation Toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;

  function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    // Update ARIA attributes
    const isExpanded = navToggle.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isExpanded);
  }

  function closeMobileMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navMenu && navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ===== Smooth Scrolling =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Active Navigation Highlighting =====
  const sections = document.querySelectorAll('section[id]');
  const header = document.querySelector('.header');

  function highlightNavigation() {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      
      if (correspondingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);
  highlightNavigation(); // Initial call

  // ===== Header Scroll Effect =====
  let lastScrollY = window.scrollY;

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll (optional)
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll);

  // ===== Schedule Tab Filtering =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const scheduleItems = document.querySelectorAll('.schedule-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filterDay = this.getAttribute('data-day');
      
      scheduleItems.forEach(item => {
        const itemDay = item.getAttribute('data-day');
        
        if (filterDay === 'all' || itemDay === filterDay) {
          item.style.display = 'grid';
          item.classList.add('fade-in');
        } else {
          item.style.display = 'none';
          item.classList.remove('fade-in');
        }
      });
    });
  });

  // ===== Contact Form Handling =====
  const contactForm = document.getElementById('contact-form');
  const formInputs = contactForm ? contactForm.querySelectorAll('input, textarea, select') : [];

  // Form validation patterns
  const patterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[\d\s\-\+\(\)]{10,20}$/,
    message: /^.{10,1000}$/
  };

  // Validation messages
  const errorMessages = {
    name: 'Please enter a valid name (2-50 letters)',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    message: 'Message must be at least 10 characters',
    interest: 'Please select your interest'
  };

  function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message') || createErrorElement(formGroup);
    
    let isValid = true;
    
    // Check if required and empty
    if (field.hasAttribute('required') && !fieldValue) {
      showError(formGroup, errorElement, 'This field is required');
      isValid = false;
    }
    // Check pattern if exists
    else if (patterns[fieldName] && fieldValue && !patterns[fieldName].test(fieldValue)) {
      showError(formGroup, errorElement, errorMessages[fieldName]);
      isValid = false;
    }
    // Special check for select
    else if (field.tagName === 'SELECT' && field.hasAttribute('required') && !fieldValue) {
      showError(formGroup, errorElement, errorMessages[fieldName] || 'Please select an option');
      isValid = false;
    }
    else {
      hideError(formGroup, errorElement);
    }
    
    return isValid;
  }

  function createErrorElement(formGroup) {
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
    return errorElement;
  }

  function showError(formGroup, errorElement, message) {
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function hideError(formGroup, errorElement) {
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    errorElement.style.display = 'none';
  }

  // Real-time validation
  formInputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      if (this.closest('.form-group').classList.contains('error')) {
        validateField(this);
      }
    });
  });

  // Form submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isFormValid = true;
      
      // Validate all fields
      formInputs.forEach(input => {
        if (!validateField(input)) {
          isFormValid = false;
        }
      });
      
      if (isFormValid) {
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
          // Show success message
          showFormMessage('success', 'Thank you! Your message has been sent. We\'ll get back to you within 24 hours.');
          
          // Reset form
          contactForm.reset();
          formInputs.forEach(input => {
            input.closest('.form-group').classList.remove('success', 'error');
          });
          
          // Reset button
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1500);
      } else {
        // Scroll to first error
        const firstError = contactForm.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  function showFormMessage(type, message) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.innerHTML = `
      <span class="form-message-icon">${type === 'success' ? '✓' : '!'}</span>
      <span class="form-message-text">${message}</span>
      <button class="form-message-close" aria-label="Close message">&times;</button>
    `;
    
    // Insert message
    contactForm.insertBefore(messageElement, contactForm.firstChild);
    
    // Close button functionality
    messageElement.querySelector('.form-message-close').addEventListener('click', () => {
      messageElement.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.classList.add('fade-out');
        setTimeout(() => messageElement.remove(), 300);
      }
    }, 5000);
  }

  // ===== Scroll Animations =====
  const animatedElements = document.querySelectorAll('.schedule-item, .instructor-card, .section-header, .hero-content, .contact-content');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    element.classList.add('animate-on-scroll');
    observer.observe(element);
  });

  // ===== Instructor Cards Hover Effect =====
  const instructorCards = document.querySelectorAll('.instructor-card');

  instructorCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('hovered');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('hovered');
    });
  });

  // ===== Parallax Effect for Hero Section =====
  const hero = document.querySelector('.hero');
  
  if (hero) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      
      if (scrolled < heroHeight) {
        const parallaxSpeed = 0.5;
        hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
      }
    });
  }

  // ===== Counter Animation for Stats (if present) =====
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    
    updateCounter();
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'));
          animateCounter(entry.target, target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
  }

  // ===== Back to Top Button =====
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTopBtn);

  function toggleBackToTop() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleBackToTop);

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ===== Lazy Loading Images =====
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }

  // ===== Accessibility: Focus Management =====
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  // ===== Initialize Tooltips (if present) =====
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  
  tooltipTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', function() {
      const tooltipText = this.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;
      this.appendChild(tooltip);
      
      // Position tooltip
      const rect = this.getBoundingClientRect();
      tooltip.style.top = '-' + (tooltip.offsetHeight + 10) + 'px';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
    });
    
    trigger.addEventListener('mouseleave', function() {
      const tooltip = this.querySelector('.tooltip');
      if (tooltip) tooltip.remove();
    });
  });

  // ===== Console Easter Egg =====
  console.log('%c🧘 Serenity Yoga Studio', 'font-size: 24px; font-weight: bold; color: #7C9A92;');
  console.log('%cFind your inner peace with us.', 'font-size: 14px; color: #6B7B82;');
});