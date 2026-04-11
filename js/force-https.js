/* open-mobility.co.kr 에서 http 로 들어온 경우 즉시 https 로 전환 (head에서 최우선 로드) */
(function () {
  try {
    if (location.protocol !== 'http:') return;
    var h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') return;
    if (!/\.?open-mobility\.co\.kr$/i.test(h)) return;
    location.replace(
      'https://' + location.host + location.pathname + location.search + location.hash
    );
  } catch (e) {}
})();
