
(function () {
  var STORAGE_KEY = 'lifelist_my_items';

  function loadItems() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  window.LifeList = {
    STORAGE_KEY: STORAGE_KEY,
    loadItems: loadItems,
    saveItems: saveItems
  };

  // --- 내 리스트에 담기 버튼 ---
  var addButtons = document.querySelectorAll('.add-btn');
  if (addButtons.length) {
    var items = loadItems();
    var currentYear = new Date().getFullYear();

    function isAdded(id) {
      return items.some(function (it) { return it.id === id; });
    }

    function refreshButton(btn) {
      var id = btn.getAttribute('data-id');
      if (isAdded(id)) {
        btn.textContent = '✓ 담음 (취소)';
        btn.classList.add('added');
      } else {
        btn.textContent = '+ 내 리스트에 담기';
        btn.classList.remove('added');
      }
    }

    addButtons.forEach(function (btn) {
      refreshButton(btn);
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        items = loadItems();
        if (isAdded(id)) {
          items = items.filter(function (it) { return it.id !== id; });
        } else {
          items.push({
            id: id,
            title: btn.getAttribute('data-title'),
            category: btn.getAttribute('data-cat'),
            categoryName: btn.getAttribute('data-catname'),
            emoji: btn.getAttribute('data-emoji'),
            cost: btn.getAttribute('data-cost'),
            difficulty: btn.getAttribute('data-diff'),
            year: currentYear,
            priority: '중',
            done: false,
            custom: false,
            createdAt: Date.now()
          });
        }
        saveItems(items);
        refreshButton(btn);
      });
    });
  }

  // --- 비용/난이도 필터 ---
  var filterSelects = document.querySelectorAll('.filter-select');
  if (filterSelects.length) {
    var cards = document.querySelectorAll('.item-card');
    function applyFilters() {
      var costVal = document.querySelector('.filter-select[data-filter="cost"]').value;
      var diffVal = document.querySelector('.filter-select[data-filter="diff"]').value;
      cards.forEach(function (card) {
        var matchCost = (costVal === 'all') || (card.getAttribute('data-cost') === costVal);
        var matchDiff = (diffVal === 'all') || (card.getAttribute('data-diff') === diffVal);
        if (matchCost && matchDiff) {
          card.classList.remove('is-filtered-out');
        } else {
          card.classList.add('is-filtered-out');
        }
      });
    }
    filterSelects.forEach(function (sel) {
      sel.addEventListener('change', applyFilters);
    });
  }
})();
