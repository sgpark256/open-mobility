/* =============================================
   Open Mobility - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------
     HEADER: scroll effect + mobile menu
  ------------------------------------------- */
  const header = document.getElementById('header');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (header) {
    const isSubPage = header.classList.contains('page-header');

    if (document.body.classList.contains('page-home')) {
      function syncSiteHeaderOffset() {
        document.documentElement.style.setProperty('--site-header-offset', `${header.offsetHeight}px`);
      }
      syncSiteHeaderOffset();
      window.addEventListener('resize', syncSiteHeaderOffset);
      window.addEventListener('load', syncSiteHeaderOffset);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => syncSiteHeaderOffset());
      }
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(syncSiteHeaderOffset);
        ro.observe(header);
      }
      /* Windows 125% 배율·창 크기 변경 시 layout 뷰포트가 달라짐 */
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', syncSiteHeaderOffset);
        window.visualViewport.addEventListener('scroll', syncSiteHeaderOffset);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(syncSiteHeaderOffset);
      });
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        if (!isSubPage) header.classList.remove('scrolled');
      }
    });

    if (window.scrollY > 50) header.classList.add('scrolled');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* -------------------------------------------
     HERO SLIDER
  ------------------------------------------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroCounter = document.querySelector('.hero-counter');
  const heroPrev = document.querySelector('.hero-prev');
  const heroNext = document.querySelector('.hero-next');

  if (heroSlides.length > 0) {
    let current = 0;
    let heroTimer;
    const len = heroSlides.length;
    let skipHeroVisualAnim = true;

    const HERO_VISUAL_FX = [
      'hero-visual--fx-fade',
      'hero-visual--fx-topright',
      'hero-visual--fx-from-bottom',
      'hero-visual--fx-zoomin'
    ];

    function playHeroVisualMotion() {
      if (skipHeroVisualAnim) {
        skipHeroVisualAnim = false;
        return;
      }
      document.querySelectorAll('.hero-slide .hero-slide-visual').forEach((el) => {
        el.classList.remove('hero-visual--enter', ...HERO_VISUAL_FX);
      });
      const vis = heroSlides[current].querySelector('.hero-slide-visual');
      if (!vis) return;
      const fx = HERO_VISUAL_FX[current % HERO_VISUAL_FX.length];
      vis.classList.add(fx);
      void vis.offsetWidth;
      vis.classList.add('hero-visual--enter');
    }

    function showSlide(idx) {
      heroSlides.forEach(s => s.classList.remove('active'));
      heroDots.forEach(d => d.classList.remove('active'));
      current = (idx + len) % len;
      heroSlides[current].classList.add('active');
      if (heroDots[current]) heroDots[current].classList.add('active');
      if (heroCounter) {
        heroCounter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(len).padStart(2, '0');
      }
      playHeroVisualMotion();
    }

    function startTimer() {
      clearInterval(heroTimer);
      heroTimer = setInterval(() => showSlide(current + 1), 13000);
    }

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        startTimer();
      });
    });

    if (heroPrev) heroPrev.addEventListener('click', () => { showSlide(current - 1); startTimer(); });
    if (heroNext) heroNext.addEventListener('click', () => { showSlide(current + 1); startTimer(); });

    showSlide(0);
    startTimer();
  }

  /* -------------------------------------------
     FEATURE CARDS SLIDER (mobile)
  ------------------------------------------- */
  const featureSlides = document.querySelector('.feature-slides');
  if (featureSlides) {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    featureSlides.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - featureSlides.offsetLeft;
      scrollLeft = featureSlides.scrollLeft;
    });

    featureSlides.addEventListener('mouseleave', () => { isDown = false; });
    featureSlides.addEventListener('mouseup', () => { isDown = false; });
    featureSlides.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - featureSlides.offsetLeft;
      featureSlides.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    featureSlides.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      scrollLeft = featureSlides.scrollLeft;
    });
    featureSlides.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX;
      featureSlides.scrollLeft = scrollLeft - (x - startX);
    });
  }

  /* -------------------------------------------
     SCROLL ANIMATION (Intersection Observer)
  ------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* -------------------------------------------
     COUNTER ANIMATION
  ------------------------------------------- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* -------------------------------------------
     NEWS FILTER (Notice/Press/Video)
  ------------------------------------------- */
  const filterBtns = document.querySelectorAll('.news-filter button');
  const newsItems = document.querySelectorAll('.news-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      newsItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-cat') === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------------------------
     MAIN: 사명 변경 모달 (세션당 1회)
  ------------------------------------------- */
  const rebrandModal = document.getElementById('rebrandModal');
  if (rebrandModal && document.body.classList.contains('page-home')) {
    const SESSION_KEY = 'om-rebrand-modal-dismissed';
    const openModal = () => {
      rebrandModal.classList.add('rebrand-modal--open');
      rebrandModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      rebrandModal.classList.remove('rebrand-modal--open');
      rebrandModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch (e) {}
    };

    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (e) {}

    if (!dismissed) {
      requestAnimationFrame(() => openModal());
    }

    rebrandModal.querySelector('.rebrand-modal__backdrop')?.addEventListener('click', closeModal);
    rebrandModal.querySelector('.rebrand-modal__close')?.addEventListener('click', closeModal);
    rebrandModal.querySelector('.rebrand-modal__confirm')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && rebrandModal.classList.contains('rebrand-modal--open')) {
        closeModal();
      }
    });
  }

  /* -------------------------------------------
     CONTACT FORM
  ------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const privacy = contactForm.querySelector('#privacyCheck');
      if (!privacy.checked) {
        alert('개인정보 수집 및 이용에 동의해 주세요.');
        return;
      }
      alert('문의가 접수되었습니다.\n빠른 시일 내에 답변 드리겠습니다.');
      contactForm.reset();
    });
  }

  /* -------------------------------------------
     PATENT MODAL (image zoom)
  ------------------------------------------- */
  const patentItems = document.querySelectorAll('.patent-item');
  if (patentItems.length > 0) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85);
      z-index:9999; align-items:center; justify-content:center; cursor:zoom-out;
    `;
    const modalImg = document.createElement('img');
    modalImg.style.cssText = 'max-width:90vw; max-height:90vh; border-radius:8px;';
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    patentItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          modalImg.src = img.src;
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
      });
    });

    modal.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  /* -------------------------------------------
     ACTIVE NAV LINK
  ------------------------------------------- */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.dropdown a').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href').replace('../', '').replace('.html', ''))) {
      link.style.color = '#66aaff';
    }
  });
});
