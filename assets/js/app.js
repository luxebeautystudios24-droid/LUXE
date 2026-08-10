/**
 * LUXE BEAUTY STUDIO - INTERACTIVE APPLICATION CONTROLLER
 * Full-Screen Intro Video, 2-Step WhatsApp Booking, Instagram Strategy, Service Filters
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntroVideo();
  initNavbarScroll();
  initMobileDrawer();
  initServiceTabs();
  initBookingModal();
  initContactForm();
});

/* --- 1. Full-Screen Intro Video Controller --- */
function initIntroVideo() {
  const introOverlay = document.getElementById('introOverlay');
  const introVideo = document.getElementById('introVideo');
  const skipBtn = document.getElementById('skipIntroBtn');
  const progressBar = document.getElementById('introProgressBar');
  const appMain = document.getElementById('appMain');

  if (!introOverlay || !introVideo) return;

  // Session-based check: Show full intro video once per browser session
  const introSeen = sessionStorage.getItem('luxe_intro_seen');

  if (introSeen === 'true') {
    // Immediately show main page without intro
    introOverlay.style.display = 'none';
    if (appMain) {
      appMain.classList.add('visible');
    }
    document.body.style.overflow = '';
    return;
  }

  // First time in session: Lock scrolling while intro is active
  document.body.style.overflow = 'hidden';

  // Play video
  const playPromise = introVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.warn('Intro video autoplay prevented by browser policy:', error);
    });
  }

  // Update progress bar
  introVideo.addEventListener('timeupdate', () => {
    if (introVideo.duration && progressBar) {
      const percentage = (introVideo.currentTime / introVideo.duration) * 100;
      progressBar.style.width = percentage + '%';
    }
  });

  // Finish function with smooth transition (500-700ms)
  let isFinished = false;
  const finishIntro = () => {
    if (isFinished) return;
    isFinished = true;

    sessionStorage.setItem('luxe_intro_seen', 'true');
    introOverlay.classList.add('fade-out');

    if (appMain) {
      appMain.classList.add('visible');
    }

    setTimeout(() => {
      introOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 650);
  };

  // Skip button click
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      finishIntro();
    });
  }

  // Video end event
  introVideo.addEventListener('ended', finishIntro);
}

/* --- 2. Navbar Scroll Effect --- */
function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- 3. Mobile Navigation Drawer --- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    toggleBtn.classList.add('active');
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    toggleBtn.classList.remove('active');
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  toggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBtn.click();
    }
  });

  overlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --- 4. Service Category Tabs Filter --- */
function initServiceTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!tabButtons.length || !serviceCards.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --- 5. Interactive 2-Step WhatsApp Booking Modal --- */
function initBookingModal() {
  const modalBackdrop = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggerButtons = document.querySelectorAll('[data-open-modal]');
  const whatsappForm = document.getElementById('whatsappBookingForm');

  const step1 = document.getElementById('modalStep1');
  const step2 = document.getElementById('modalStep2');
  const stepIndicator = document.getElementById('modalStepIndicator');
  const modalTitle = document.getElementById('modalTitle');
  const nextBtn = document.getElementById('modalNextBtn');
  const backBtn = document.getElementById('modalBackBtn');

  if (!modalBackdrop) return;

  const setStep = (stepNumber) => {
    if (stepNumber === 1) {
      if (step1) step1.classList.add('active');
      if (step2) step2.classList.remove('active');
      if (stepIndicator) stepIndicator.textContent = 'STEP 1 OF 2 • SELECT SERVICE';
      if (modalTitle) modalTitle.textContent = 'Book Your Appointment';
    } else {
      if (step1) step1.classList.remove('active');
      if (step2) step2.classList.add('active');
      if (stepIndicator) stepIndicator.textContent = 'STEP 2 OF 2 • CLIENT DETAILS';
      if (modalTitle) modalTitle.textContent = 'Your Appointment Details';
    }
  };

  window.openBookingModal = function (serviceName = '') {
    setStep(1);

    // Pre-select service radio if provided (matching category or exact value)
    if (serviceName) {
      // Map service aliases if needed
      let targetValue = serviceName;
      if (serviceName.includes('Hair')) targetValue = 'Hair';
      else if (serviceName.includes('Makeup') || serviceName.includes('Airbrush') || serviceName.includes('Bride')) targetValue = 'Makeup';
      else if (serviceName.includes('Classes')) targetValue = 'Nail Art Classes';
      else if (serviceName.includes('Nail')) targetValue = 'Nail Art';
      else if (serviceName.includes('Waxing')) targetValue = 'Waxing';
      else if (serviceName.includes('Facial')) targetValue = 'Facials';
      else if (serviceName.includes('Pedicure') || serviceName.includes('Manicure')) targetValue = 'Pedicure / Manicure';

      const radios = document.querySelectorAll('input[name="modalSelectedService"]');
      radios.forEach(r => {
        if (r.value === targetValue || r.value.toLowerCase() === serviceName.toLowerCase()) {
          r.checked = true;
        }
      });
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookingModal = function () {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-open-modal') || btn.getAttribute('data-service') || '';
      window.openBookingModal(service);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeBookingModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      window.closeBookingModal();
    }
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const selectedRadio = document.querySelector('input[name="modalSelectedService"]:checked');
      if (!selectedRadio) {
        showToast('Please select a service to proceed.');
        return;
      }
      setStep(2);
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      setStep(1);
    });
  }

  // Handle WhatsApp form submission
  if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const selectedRadio = document.querySelector('input[name="modalSelectedService"]:checked');
      const name = document.getElementById('bookingName')?.value.trim() || 'Valued Client';
      const age = document.getElementById('bookingAge')?.value.trim() || 'N/A';
      const date = document.getElementById('bookingDate')?.value || 'Not specified';
      const time = document.getElementById('bookingTime')?.value || 'Not specified';

      const service = selectedRadio ? selectedRadio.value : 'General Appointment';

      const message = `Hello Luxe Beauty Studio,

I would like to enquire about an appointment.

Service: ${service}
Name: ${name}
Age: ${age}
Preferred Date: ${date}
Preferred Time: ${time}

Please confirm the availability.

Thank you.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/919900657096?text=${encodedMessage}`;

      window.closeBookingModal();
      window.open(whatsappUrl, '_blank');
      showToast('Opening WhatsApp to send your appointment details...');
      whatsappForm.reset();
      setStep(1);
    });
  }
}

/* --- 6. Main Contact Form Submission (WhatsApp Integration) --- */
function initContactForm() {
  const contactForm = document.getElementById('mainContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim() || 'Valued Client';
    const phone = document.getElementById('contactPhone')?.value.trim() || 'N/A';
    const service = document.getElementById('contactService')?.value || 'General Consultation';
    const date = document.getElementById('contactDate')?.value || 'Not specified';
    const time = document.getElementById('contactTime')?.value || 'Not specified';
    const requirements = document.getElementById('contactRequirements')?.value.trim() || 'None';

    const message = `Hello Luxe Beauty Studio,

I would like to enquire about an appointment via your website contact form.

Name: ${name}
Phone: ${phone}
Service: ${service}
Preferred Date: ${date}
Preferred Time: ${time}
Requirements: ${requirements}

Please confirm availability.

Thank you.`;

    const whatsappUrl = `https://wa.me/919900657096?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Redirecting to WhatsApp to send your enquiry...');
    contactForm.reset();
  });
}

/* --- 7. Toast Notification Utility --- */
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <div>
      <h4 style="font-size:0.85rem; font-weight:700; margin-bottom:0.1rem; color:#FFF; text-transform:uppercase; letter-spacing:0.1em;">LUXE CONCIERGE</h4>
      <p style="font-size:0.8rem; color:rgba(255,255,255,0.8);">${message}</p>
    </div>
  `;

  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}

/* --- 6. Video Focus & Text Lightening Controller --- */
function initVideoFocusControls() {
  const heroSection = document.getElementById('heroSection');
  const videoToggleBtn = document.getElementById('videoFocusToggle');

  if (!heroSection || !videoToggleBtn) return;

  videoToggleBtn.addEventListener('click', () => {
    heroSection.classList.toggle('video-focus');
    const isFocus = heroSection.classList.contains('video-focus');
    videoToggleBtn.innerHTML = isFocus
      ? '<span>👁️</span> Show Text'
      : '<span>🎬</span> Focus Video Mode';
  });

  // Smooth opacity lightening when scrolling down through hero
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 100 && scrollY < 600 && !heroSection.classList.contains('video-focus')) {
      const content = heroSection.querySelector('.hero-content-wrapper');
      if (content) {
        content.style.opacity = Math.max(0.25, 1 - (scrollY - 100) / 450);
      }
    } else if (scrollY <= 100 && !heroSection.classList.contains('video-focus')) {
      const content = heroSection.querySelector('.hero-content-wrapper');
      if (content) {
        content.style.opacity = 1;
      }
    }
  }, { passive: true });
}
