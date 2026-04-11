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

    function showSlide(idx) {
      heroSlides.forEach(s => s.classList.remove('active'));
      heroDots.forEach(d => d.classList.remove('active'));
      current = (idx + heroSlides.length) % heroSlides.length;
      heroSlides[current].classList.add('active');
      if (heroDots[current]) heroDots[current].classList.add('active');
      if (heroCounter) {
        heroCounter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(heroSlides.length).padStart(2, '0');
      }
    }

    function startTimer() {
      clearInterval(heroTimer);
      heroTimer = setInterval(() => showSlide(current + 1), 5000);
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
