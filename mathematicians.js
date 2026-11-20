// Search and filters for mathematicians.html. The page works without this script.
(function () {
    var q = document.getElementById('q');
    var result = document.getElementById('result');
    var empty = document.getElementById('empty');
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.person'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('.group'));
    var filter = 'all';

    function norm(s) {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function apply() {
        var terms = norm(q.value.trim()).split(/\s+/).filter(Boolean);
        var shown = 0;
        cards.forEach(function (c) {
            var tags = c.getAttribute('data-tags').split(' ');
            var text = c.getAttribute('data-search');
            var ok = (filter === 'all' || tags.indexOf(filter) !== -1) &&
                terms.every(function (w) { return text.indexOf(w) !== -1; });
            c.classList.toggle('hidden', !ok);
            if (ok) { shown++; }
        });
        groups.forEach(function (g) {
            var n = g.querySelectorAll('.person:not(.hidden)').length;
            g.classList.toggle('hidden', n === 0);
            var count = g.querySelector('.count');
            if (count) { count.textContent = n; }
        });
        var filtering = terms.length > 0 || filter !== 'all';
        result.textContent = filtering ? shown + ' of ' + cards.length + ' shown' : '';
        empty.classList.toggle('hidden', shown !== 0);
    }

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            filter = chip.getAttribute('data-filter');
            chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
            apply();
        });
    });
    var timer;
    q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(apply, 100); });
    if (q.value) { apply(); }
})();
