
(function () {
  if (!window.LifeList) return;
  var loadItems = window.LifeList.loadItems;
  var saveItems = window.LifeList.saveItems;

  var currentYear = new Date().getFullYear();
  var years = [];
  for (var y = currentYear - 1; y <= 2130; y++) years.push(y);
  var nearYears = years.slice(0, 7); // 탭에는 최근 연도만 표시 (빠른 선택용)
  var selectedYear = currentYear;

  var yearTabsEl = document.getElementById('year-tabs');
  var yearJumpEl = document.getElementById('year-jump');
  var listEl = document.getElementById('mypage-list');
  var yearSelectEl = document.getElementById('custom-year');
  var form = document.getElementById('custom-add-form');
  var titleInput = document.getElementById('custom-title');
  var prioritySelect = document.getElementById('custom-priority');

  function renderYearTabs() {
    yearTabsEl.innerHTML = '';
    nearYears.forEach(function (y) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'year-tab' + (y === selectedYear ? ' active' : '');
      btn.textContent = y + '년';
      btn.addEventListener('click', function () {
        selectedYear = y;
        renderYearTabs();
        yearJumpEl.value = selectedYear;
        renderList();
      });
      yearTabsEl.appendChild(btn);
    });
  }

  function renderYearJump() {
    yearJumpEl.innerHTML = '';
    years.forEach(function (y) {
      var opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y + '년';
      if (y === selectedYear) opt.selected = true;
      yearJumpEl.appendChild(opt);
    });
    yearJumpEl.addEventListener('change', function () {
      selectedYear = parseInt(yearJumpEl.value, 10);
      renderYearTabs();
      renderList();
    });
  }

  function renderYearSelectOptions() {
    yearSelectEl.innerHTML = '';
    years.forEach(function (y) {
      var opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y + '년';
      if (y === currentYear) opt.selected = true;
      yearSelectEl.appendChild(opt);
    });
  }

  function priorityLabel(p) {
    return p === '상' ? '🔴 상' : (p === '하' ? '🟢 하' : '🟡 중');
  }

  function renderList() {
    var items = loadItems().filter(function (it) { return it.year === selectedYear; });
    listEl.innerHTML = '';

    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = selectedYear + '년에 담긴 라이프리스트가 아직 없어요.<br>' +
        '<a href="index.html">카테고리 둘러보기</a> 에서 항목을 담거나, 위에서 직접 추가해보세요.';
      listEl.appendChild(empty);
      return;
    }

    items.sort(function (a, b) { return (a.done === b.done) ? 0 : (a.done ? 1 : -1); });

    items.forEach(function (it) {
      var row = document.createElement('div');
      row.className = 'list-row' + (it.done ? ' is-done' : '');

      var check = document.createElement('input');
      check.type = 'checkbox';
      check.className = 'list-row-check';
      check.checked = !!it.done;
      check.addEventListener('change', function () {
        updateItem(it.id, { done: check.checked });
      });

      var main = document.createElement('div');
      main.className = 'list-row-main';
      var titleEl = document.createElement('div');
      titleEl.className = 'list-row-title';
      titleEl.textContent = (it.emoji ? it.emoji + ' ' : '📌 ') + it.title;
      var metaEl = document.createElement('div');
      metaEl.className = 'list-row-meta';
      var metaParts = [];
      if (it.categoryName) metaParts.push(it.categoryName);
      if (it.cost) metaParts.push('💰 ' + it.cost);
      if (it.difficulty) metaParts.push('⚡ ' + it.difficulty);
      if (it.custom) metaParts.push('직접 추가');
      metaEl.textContent = metaParts.join(' · ');
      main.appendChild(titleEl);
      main.appendChild(metaEl);

      var controls = document.createElement('div');
      controls.className = 'list-row-controls';

      var prioritySel = document.createElement('select');
      ['상', '중', '하'].forEach(function (p) {
        var opt = document.createElement('option');
        opt.value = p;
        opt.textContent = priorityLabel(p);
        if (it.priority === p) opt.selected = true;
        prioritySel.appendChild(opt);
      });
      prioritySel.addEventListener('change', function () {
        updateItem(it.id, { priority: prioritySel.value });
      });

      var yearSel = document.createElement('select');
      years.forEach(function (y) {
        var opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y + '년';
        if (it.year === y) opt.selected = true;
        yearSel.appendChild(opt);
      });
      yearSel.addEventListener('change', function () {
        updateItem(it.id, { year: parseInt(yearSel.value, 10) });
        renderList();
      });

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'list-row-delete';
      delBtn.textContent = '삭제';
      delBtn.addEventListener('click', function () {
        var items2 = loadItems().filter(function (x) { return x.id !== it.id; });
        saveItems(items2);
        renderList();
      });

      controls.appendChild(prioritySel);
      controls.appendChild(yearSel);
      controls.appendChild(delBtn);

      row.appendChild(check);
      row.appendChild(main);
      row.appendChild(controls);
      listEl.appendChild(row);
    });
  }

  function updateItem(id, patch) {
    var items = loadItems();
    items = items.map(function (it) {
      if (it.id === id) return Object.assign({}, it, patch);
      return it;
    });
    saveItems(items);
    renderList();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = titleInput.value.trim();
    if (!title) return;
    var items = loadItems();
    items.push({
      id: 'custom-' + Date.now(),
      title: title,
      category: '',
      categoryName: '',
      emoji: '📌',
      cost: '',
      difficulty: '',
      year: parseInt(yearSelectEl.value, 10),
      priority: prioritySelect.value,
      done: false,
      custom: true,
      createdAt: Date.now()
    });
    saveItems(items);
    titleInput.value = '';
    selectedYear = parseInt(yearSelectEl.value, 10);
    renderYearTabs();
    renderList();
  });

  renderYearTabs();
  renderYearJump();
  renderYearSelectOptions();
  renderList();
})();
