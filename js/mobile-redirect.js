/**
 * index.html 전용: 좁은 화면이면 모바일 홈(m/index.html)으로 이동.
 * PC 고정: ?desktop=1 또는 sessionStorage omPreferDesktop=1
 */
(function () {
  try {
    if (sessionStorage.getItem('omPreferDesktop') === '1') return;
    if (/[?&]desktop=1(?:&|$)/.test(window.location.search)) {
      sessionStorage.setItem('omPreferDesktop', '1');
      return;
    }
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    var target = 'm/index.html' + window.location.search;
    if (window.location.hash) target += window.location.hash;
    window.location.replace(target);
  } catch (e) {}
})();
