/**
 * 모바일(뷰포트 768px 이하)에서 사이트 홈에 접속하면 모바일 전용 홈(…/m/index.html)으로 이동.
 * 이미 /m/ 경로이거나 PC 고정(?desktop=1 · sessionStorage omPreferDesktop)이면 실행하지 않음.
 */
(function () {
  try {
    if (sessionStorage.getItem('omPreferDesktop') === '1') return;
    if (/[?&]desktop=1(?:&|$)/.test(window.location.search)) {
      sessionStorage.setItem('omPreferDesktop', '1');
      return;
    }
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    var path = window.location.pathname;
    if (path.indexOf('/m/') !== -1) return;
    if (!isSiteHome(path)) return;

    var u = new URL(window.location.href);
    u.pathname = joinPaths(siteRootPath(path), 'm/index.html');
    u.hash = window.location.hash;

    var sp = new URLSearchParams(window.location.search);
    sp.delete('desktop');
    var q = sp.toString();
    u.search = q ? '?' + q : '';

    window.location.replace(u.href);
  } catch (e) {}

  function isSiteHome(p) {
    if (p === '/' || p === '') return true;
    var parts = p.split('/').filter(Boolean);
    if (parts.length === 0) return true;
    if (parts.length === 1 && !parts[0].includes('.')) return true;
    if (parts.length === 2 && parts[1] === 'index.html') return true;
    if (parts.length === 1 && parts[0] === 'index.html') return true;
    return false;
  }

  function siteRootPath(p) {
    if (p === '/' || p === '') return '/';
    if (p === '/index.html') return '/';
    if (p.endsWith('/index.html')) {
      var base = p.slice(0, -'/index.html'.length);
      return base === '' ? '/' : base + '/';
    }
    if (p.endsWith('/')) return p;
    var parts = p.split('/').filter(Boolean);
    if (parts.length === 1 && !parts[0].includes('.')) {
      return '/' + parts[0] + '/';
    }
    return '/';
  }

  function joinPaths(root, file) {
    if (root === '/') return '/' + file;
    return root.replace(/\/?$/, '/') + file;
  }
})();
