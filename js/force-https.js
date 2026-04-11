/* 프로덕션: https 사용 + 호스트는 apex(open-mobility.co.kr)로 통일 (www는 대부분 입력하지 않음) */
(function () {
  try {
    var h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') return;
    if (!/^(?:www\.)?open-mobility\.co\.kr$/i.test(h)) return;

    var path = location.pathname + location.search + location.hash;
    var apex = 'open-mobility.co.kr';

    if (location.protocol === 'http:') {
      location.replace('https://' + apex + path);
      return;
    }

    if (location.protocol === 'https:' && h === 'www.open-mobility.co.kr') {
      location.replace('https://' + apex + path);
    }
  } catch (e) {}
})();
