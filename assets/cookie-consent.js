
(function () {
  var KEY = 'lifelist_cookie_consent';
  var banner = document.getElementById('cookie-consent');
  var btn = document.getElementById('cookie-accept');
  if (!banner || !btn) return;
  try {
    if (!localStorage.getItem(KEY)) {
      banner.hidden = false;
    }
  } catch (e) {
    banner.hidden = false;
  }
  btn.addEventListener('click', function () {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    banner.hidden = true;
  });
})();
