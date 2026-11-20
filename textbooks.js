// Search and filters for textbooks.html. The page works without this script.
(function () {
    var q = document.getElementById('q');
    var result = document.getElementById('result');
    var empty = document.getElementById('empty');
    var books = Array.prototype.slice.call(document.querySelectorAll('.book'));
    var subjects = Array.prototype.slice.call(document.querySelectorAll('.subject'));
    var areas = Array.prototype.slice.call(document.querySelectorAll('.area'));
    var areaChips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-area]'));
    var flagChips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-flag]'));
    var area = 'all';
    var flags = {};

    function norm(s) {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function apply() {
        var terms = norm(q.value.trim()).split(/\s+/).filter(Boolean);
        var wanted = Object.keys(flags).filter(function (k) { return flags[k]; });
        // Undergraduate and Graduate are alternatives; the others must all hold
        var levels = wanted.filter(function (k) { return k === 'U' || k === 'G'; });
        var others = wanted.filter(function (k) { return k !== 'U' && k !== 'G'; });
        var shown = 0;
        books.forEach(function (b) {
            var bf = b.getAttribute('data-flags').split(' ');
            var bArea = b.closest('.subject').getAttribute('data-area');
            var ok = (area === 'all' || bArea === area) &&
                (levels.length === 0 || levels.some(function (k) { return bf.indexOf(k) !== -1; })) &&
                others.every(function (k) { return bf.indexOf(k) !== -1; }) &&
                terms.every(function (w) { return b.getAttribute('data-search').indexOf(w) !== -1; });
            b.classList.toggle('hidden', !ok);
            if (ok) { shown++; }
        });
        subjects.forEach(function (s) {
            var n = s.querySelectorAll('.book:not(.hidden)').length;
            s.classList.toggle('hidden', n === 0);
            s.querySelector('.count').textContent = n;
        });
        areas.forEach(function (a) { a.classList.toggle('hidden', !a.querySelector('.subject:not(.hidden)')); });
        var filtering = terms.length > 0 || area !== 'all' || wanted.length > 0;
        result.textContent = filtering ? shown + ' of ' + books.length + ' books' : '';
        empty.classList.toggle('hidden', shown !== 0);
    }

    areaChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            area = chip.getAttribute('data-area');
            areaChips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
            apply();
        });
    });
    flagChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var k = chip.getAttribute('data-flag');
            flags[k] = !flags[k];
            chip.setAttribute('aria-pressed', String(flags[k]));
            apply();
        });
    });
    var timer;
    q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(apply, 100); });
    if (q.value) { apply(); }
})();
