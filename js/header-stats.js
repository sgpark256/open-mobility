/**
 * 메인 헤더 통계 숫자 — 전용 API JSON에서만 갱신 (문구는 HTML 고정)
 * body[data-stats-api-url] 에 GET URL 설정. 비우면 요청하지 않음.
 *
 * 응답 예시 (필드명 하나만 맞으면 됨):
 * {
 *   "callCenters": 1,
 *   "calls30d": 12500,
 *   "calls24h": 320
 * }
 */
(function () {
  const url = (document.body && document.body.dataset.statsApiUrl) || '';
  const elsCc = document.querySelectorAll('.js-stat-callcenters');
  const els30 = document.querySelectorAll('.js-stat-calls-30d');
  const els24 = document.querySelectorAll('.js-stat-calls-24h');
  if (!elsCc.length && !els30.length && !els24.length) return;

  function formatInt(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    return Math.floor(n).toLocaleString('ko-KR');
  }

  function setAll(nodeList, text) {
    nodeList.forEach((el) => {
      el.textContent = text;
    });
  }

  function apply(data) {
    if (!data || typeof data !== 'object') return;
    const cc =
      data.callCenters ??
      data.call_centers ??
      data.participatingCallCenters ??
      data.participating_call_centers ??
      data.callcenter_count ??
      data.callcenterCount;
    const c30 =
      data.calls30d ??
      data.calls_30d ??
      data.callsLast30Days ??
      data.calls_last_30_days ??
      data.calls_last_30d;
    const c24 =
      data.calls24h ??
      data.calls_24h ??
      data.callsLast24Hours ??
      data.calls_last_24_hours ??
      data.calls_last_24h;

    if (cc != null && elsCc.length) setAll(elsCc, formatInt(Number(cc)));
    if (c30 != null && els30.length) setAll(els30, formatInt(Number(c30)));
    if (c24 != null && els24.length) setAll(els24, formatInt(Number(c24)));
  }

  if (!url || typeof url !== 'string') return;

  fetch(url, { credentials: 'omit', mode: 'cors', cache: 'no-store' })
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .then(apply)
    .catch(function () {
      /* 실패 시 기존 placeholder(—) 유지 */
    });
})();
