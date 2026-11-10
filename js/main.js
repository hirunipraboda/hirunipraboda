/* ==========================================================================
   HIRUNI PRABODA - PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCursorFollower();
  initMobileNav();
  initScrollSpy();
  initProjectFilters();
  initResumeModal();
  initProjectDetailsModal();
  initContactForm();
  initCounterAnimations();
});

/* 1. Cursor Follower Light Effect */
function initCursorFollower() {
  const cursorLight = document.querySelector('.cursor-light');
  if (!cursorLight || window.innerWidth < 1024) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    cursorLight.style.left = `${currentX}px`;
    cursorLight.style.top = `${currentY}px`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* 2. Mobile Nav Toggle */
function initMobileNav() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const isExpanded = navLinks.classList.contains('mobile-open');
    mobileToggle.setAttribute('aria-expanded', isExpanded);
    mobileToggle.innerHTML = isExpanded 
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  });

  // Close mobile nav when clicking any link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });
  });
}

/* 3. Scroll Spy for Active Navigation Highlight */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* 4. Project Filters */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* 5. Resume Viewer Modal */
function initResumeModal() {
  const openBtns = document.querySelectorAll('.js-open-resume');
  const modal = document.getElementById('resumeModal');

  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-btn-close');
  const printBtn = modal.querySelector('.modal-btn-download');

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Download / Print Resume
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* 5b. Project Details Modal */
const projectDetailsData = {
  truthlens: {
    category: 'Intelligent Systems',
    title: 'TruthLens: AI Hallucination Detection & Verification System',
    image: 'assets/project1.jpg',
    description: 'An AI-powered system designed to detect, analyze, and verify hallucinations in AI-generated responses. It helps users identify unreliable or false information by combining claim extraction, fact verification, source credibility analysis, and confidence scoring. Built with a decoupled Node.js/Express backend deployed on Render and a cross-platform React Native client.',
    features: [
      'AI Response Claim Extraction: Extracts key claims (factual, statistical, historical, general) and flags suspicious or hallucinated statements.',
      'Fact Verification Engine: Verifies claims against trusted external sources into Verified, Contradicted, or Unverifiable categories.',
      'Source Credibility Evaluation: Evaluates source authority, recency, and trustworthiness metrics for verifiable evidence.',
      'Confidence & Hallucination Scoring: Computes confidence metrics and hallucination risk indicators for LLM-generated content.',
      'Production Architecture: Node.js/Express backend deployed live on Render, MongoDB Atlas cloud database, and React Native mobile client.'
    ],
    techStack: ['Node.js', 'Express.js', 'React Native', 'MongoDB Atlas', 'REST APIs', 'Render Cloud'],
    repoUrl: 'https://github.com/hirunipraboda/AI-Hallucination-Detection-and-Verification-System'
  },
  smartfold: {
    category: 'Web Application',
    title: 'SmartFold: Laundry Operations & Management System',
    image: 'assets/project4.jpg',
    description: 'SmartFold is a comprehensive, full-stack laundry and dry cleaning operations platform built to optimize administrative workflows and deliver a smooth customer booking experience. It bridges customer self-service order placement with staff management consoles through a decoupled Spring Boot REST architecture.',
    features: [
      'Simplified Customer Order Flow: Intuitive service selection (Laundry, Dry Cleaning, Pressing, Premium Care) with instant price estimation.',
      'Operations & Admin Dashboard: Live metrics tracking daily orders, revenue, processing stages, and task scheduling.',
      'End-to-End Order Status Pipeline: Real-time visual tracking from Pending, In Progress, Ready, to Pickup / Delivery.',
      'Centralized Customer Messaging: Real-time communication channel enabling staff to respond to customer inquiries directly.',
      'Role-Based Access Control (RBAC): Spring Security implementation isolating admin control consoles from customer portals.',
      'Secure Payment Portal: Support for online credit card settlements and cash-on-pickup order verification.'
    ],
    techStack: ['Java 17', 'Spring Boot 3', 'Spring Data JPA', 'Spring Security', 'REST APIs', 'MySQL / H2', 'HTML5', 'CSS3', 'JavaScript (ES6)'],
    repoUrl: 'https://github.com/hirunipraboda/Laundry_Management_System'
  },
  toxicnlp: {
    category: 'Intelligent Systems',
    title: 'Toxic Comment Classification & NLP Pipeline',
    image: 'assets/project5.jpg',
    description: 'An end-to-end natural language processing pipeline engineered to detect and classify toxic online discourse. It features comprehensive text cleaning, TF-IDF vectorization across 16,000 balanced comments, systematic multi-model benchmarking across 6 machine learning algorithms, and an interactive toxicity prediction engine.',
    features: [
      'Automated Text Preprocessing: Cleans raw text via tokenization, punctuation removal, case folding, stopword filtering, and lemmatization.',
      'Feature Extraction: Generates n-gram TF-IDF matrices engineered on a balanced dataset of 16,000 labeled comments.',
      'Multi-Model Benchmarking: Trains and compares 6 ML algorithms (Linear SVM, Logistic Regression, Multinomial Naive Bayes, Random Forest, Decision Tree, KNN).',
      'Hyperparameter Optimization: Implements GridSearchCV with cross-validation to maximize classification accuracy and recall.',
      'Interactive Inference: Provides a predict_toxicity helper for real-time toxicity scoring and confidence classification on arbitrary inputs.'
    ],
    techStack: ['Python', 'NLP & NLTK', 'Scikit-Learn', 'Pandas', 'NumPy', 'TF-IDF', 'Matplotlib & Seaborn'],
    repoUrl: 'https://github.com/hirunipraboda/ToxicCommentClassificationNLP'
  },
  greenweather: {
    category: 'Intelligent Systems',
    title: 'Green Weather Guard: IoT Greenhouse Automation',
    image: 'assets/project6.jpg',
    description: 'An automated, IoT-based environmental control system designed to monitor and regulate greenhouse microclimates in real time. Powered by an ESP32 microcontroller, environmental sensors, and a 4-channel relay module, the system autonomously controls ventilation, heating, humidification, and grow lights while streaming telemetry to the Blynk IoT cloud.',
    features: [
      'Multi-Sensor Microclimate Telemetry: Continuous real-time monitoring of ambient temperature, relative humidity, and CO₂ gas concentrations.',
      'Automated Multi-Actuator Regulation: Threshold-triggered automated activation of ventilation fans, heating elements, ultrasonic misting, and LED grow lights.',
      'Cloud Synchronization & Remote Dashboard: Live data streaming and manual override controls via the Blynk mobile IoT application.',
      'Resilient Wi-Fi Connectivity: Built-in automated Wi-Fi reconnection routines to maintain uninterrupted cloud telemetry.',
      'Hardware & Relay Isolation: Decoupled 4-channel relay control safeguarding low-power microcontroller GPIO pins from high-current actuator loads.'
    ],
    techStack: ['ESP32', 'C / C++ (Arduino)', 'DHT11 / DHT22', 'MQ135 Sensor', 'Blynk IoT', 'Embedded Systems'],
    repoUrl: 'https://github.com/hirunipraboda/Green_Weather_Guard'
  },
  tourlink: {
    category: 'Web Application',
    title: 'TourLink: AI-Powered Smart Tourism Platform',
    image: 'assets/project7.jpg',
    description: 'TourLink is a comprehensive full-stack smart tourism platform that unites tourists with intelligent destination discovery, personalized trip planning, and automated itinerary generation. It integrates an ASP.NET Core REST API backend, React 19 web dashboard, Flutter cross-platform mobile app, and a sophisticated four-agent AI orchestration subsystem deployed live on Render.',
    features: [
      'Four-Agent AI Orchestration: Employs dedicated agents for Destination Research, Route Optimization, Budget Feasibility, and Master Itinerary Orchestration.',
      'Full-Stack Architecture: Powered by C# ASP.NET Core Web API (.NET 8) with Entity Framework Core and Supabase PostgreSQL.',
      'Cross-Platform Clients: React 19 TypeScript web platform and Flutter mobile application for on-the-go tourist navigation.',
      'Intelligent Route & Budget Optimization: Evaluates inter-city travel sequences, geographic distances, transport modes, and financial feasibility.',
      'Production Deployment: Live cloud architecture deployed across Render services including web frontend, REST API, and AI agent worker nodes.'
    ],
    techStack: ['ASP.NET Core (.NET 8)', 'React 19', 'TypeScript', 'Flutter & Dart', 'PostgreSQL', 'Agentic AI', 'Render Cloud'],
    repoUrl: 'https://github.com/hirunipraboda/tourism-planner'
  },
  traintrack: {
    category: 'Web Application',
    title: 'TrainTrack Sri Lanka: Railway Passenger Platform',
    image: 'assets/project8.jpg',
    description: 'TrainTrack Sri Lanka is a dedicated, train-only public transportation web platform engineered for Sri Lanka Railways commuters, regional travelers, and tourists. Developed using the MERN stack with Tailwind CSS, the platform solves core commuter pain points with live schedule lookups, transparent multi-tier fare calculation, trackable incident reporting, and aggregated passenger reviews.',
    features: [
      'Route & Schedule Search: Fast, responsive timetable lookup across Sri Lankan railway lines (Coast, Main, Northern) with intermediate halt timelines and departure sorting.',
      'Multi-Class Fare Calculator: Calculates estimated journey fares across First Class AC, Second Class, and Third Class with adult/child multipliers based on official railway tariffs.',
      'Crowd-Sourced Issue Reporting: Allows commuters to log service delays, overcrowding, or facility issues with automated tracking IDs (TT-XXXX) and resolution workflows.',
      'Passenger Review & Rating Engine: 5-dimension rating submission (Punctuality, Cleanliness, Comfort, Staff Service) with real-time MongoDB aggregation metrics per train.',
      'Live Cloud Deployment: Full-stack production deployment with React 18 on Render/Vercel and Express/MongoDB backend hosted on Render.'
    ],
    techStack: ['React 18', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Tailwind CSS', 'Axios', 'Render Cloud'],
    repoUrl: 'https://github.com/hirunipraboda/traintrack-web'
  }
};

function openProjectModal(projectId) {
  const modal = document.getElementById('projectDetailsModal');
  if (!modal) return;
  const data = projectDetailsData[projectId];
  if (!data) return;

  const modalTitle = document.getElementById('projectModalTitle');
  const modalCategory = document.getElementById('projectModalCategory');
  const modalImage = document.getElementById('projectModalImage');
  const modalDesc = document.getElementById('projectModalDescription');
  const modalFeatures = document.getElementById('projectModalFeatures');
  const modalTech = document.getElementById('projectModalTech');
  const modalRepoBtn = document.getElementById('projectModalRepoBtn');

  if (modalTitle) modalTitle.textContent = data.title;
  if (modalCategory) modalCategory.textContent = data.category;
  if (modalImage) {
    modalImage.src = data.image;
    modalImage.alt = data.title;
  }
  if (modalDesc) modalDesc.textContent = data.description;
  if (modalRepoBtn) modalRepoBtn.href = data.repoUrl;

  if (modalFeatures) {
    modalFeatures.innerHTML = data.features.map(feat => `
      <li class="project-modal-feature-item">
        <span class="project-modal-feature-icon">✔</span>
        <span>${feat}</span>
      </li>
    `).join('');
  }

  if (modalTech) {
    modalTech.innerHTML = data.techStack.map(tech => `
      <span class="tech-tag">${tech}</span>
    `).join('');
  }

  modal.classList.add('active');
  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectDetailsModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }
  document.body.style.overflow = '';
}

window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

function initProjectDetailsModal() {
  const modal = document.getElementById('projectDetailsModal');
  if (!modal) return;

  const closeBtn = document.getElementById('projectModalCloseBtn');

  // Open buttons delegation & listeners
  document.querySelectorAll('.js-open-project-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeProjectModal();
    });
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (modal.classList.contains('active') || modal.style.display === 'flex')) {
      closeProjectModal();
    }
  });
}

/* 6. Interactive Contact Form with Formspree Integration */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Sending message...
    `;

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        contactForm.reset();
        showToast("Thank you, message sent! I'll get back to you shortly.");
      } else {
        const errorData = await response.json();
        const errorMsg = errorData && errorData.errors 
          ? errorData.errors.map(err => err.message).join(', ') 
          : "There was a problem submitting your form.";
        showToast(errorMsg);
      }
    } catch (error) {
      showToast("Oops! Could not send message. Please try again or email me directly.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast) return;

  if (toastMsg) toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* 7. Metric Counter Animation */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.metric-number[data-target]');
  let started = false;

  function countUp() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let current = 0;
      const increment = Math.ceil(target / 40);

      const updateCount = () => {
        current += increment;
        if (current < target) {
          counter.textContent = current + suffix;
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target + suffix;
        }
      };
      updateCount();
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        countUp();
      }
    });
  }, { threshold: 0.4 });

  const metricsSection = document.querySelector('.metrics-row');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}
