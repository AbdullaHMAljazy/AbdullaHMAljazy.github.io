// Search, "new only" filter and expand/collapse for roadmap.html. The page works without this script.
(function () {
    var q = document.getElementById('q');
    var onlyNew = document.getElementById('only-new');
    var status = document.getElementById('status');
    var topics = Array.prototype.slice.call(document.querySelectorAll('.topic'));
    var areas = Array.prototype.slice.call(document.querySelectorAll('.area'));

    function norm(s) {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    // remember each item's searchable text once
    topics.forEach(function (t) {
        t._name = norm(t.querySelector('.t-name').textContent);
        t._items = Array.prototype.slice.call(t.querySelectorAll('.books li, .courses li')).map(function (li) {
            return { el: li, text: norm(li.textContent), isNew: li.classList.contains('new') };
        });
    });

    function apply() {
        var terms = norm(q.value.trim()).split(/\s+/).filter(Boolean);
        var newOnly = onlyNew.checked;
        var filtering = terms.length > 0 || newOnly;
        var shownTopics = 0, shownItems = 0;

        topics.forEach(function (t) {
            var nameHit = terms.length > 0 && terms.every(function (w) { return t._name.indexOf(w) !== -1; });
            var any = false;
            t._items.forEach(function (it) {
                var ok = (!newOnly || it.isNew) &&
                    (nameHit || terms.every(function (w) { return it.text.indexOf(w) !== -1; }));
                it.el.classList.toggle('hidden', filtering && !ok);
                if (ok) { any = true; shownItems++; }
            });
            // hide a list (and its heading) whose items are all filtered out, then empty columns
            Array.prototype.forEach.call(t.querySelectorAll('.books, .courses'), function (list) {
                var empty = filtering && !list.querySelector('li:not(.hidden)');
                list.classList.toggle('hidden', empty);
                var h = list.previousElementSibling;
                if (h && h.tagName === 'H3') { h.classList.toggle('hidden', empty); }
            });
            Array.prototype.forEach.call(t.querySelectorAll('.col'), function (col) {
                col.classList.toggle('hidden', filtering && !col.querySelector('li:not(.hidden)'));
            });
            var visible = !filtering || any || (nameHit && !newOnly);
            t.classList.toggle('hidden', !visible);
            if (filtering) { t.open = visible; }
            if (visible) { shownTopics++; }
        });
        areas.forEach(function (a) {
            a.classList.toggle('hidden', !a.querySelector('.topic:not(.hidden)'));
        });
        if (!filtering) {
            status.textContent = '';
            topics.forEach(function (t) { t.open = false; });
        } else {
            status.textContent = shownItems + ' matching resource' + (shownItems === 1 ? '' : 's') +
                ' in ' + shownTopics + ' topic' + (shownTopics === 1 ? '' : 's') + '.';
        }
    }

    var timer;
    q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(apply, 120); });
    onlyNew.addEventListener('change', apply);
    document.getElementById('expand').addEventListener('click', function () {
        topics.forEach(function (t) { if (!t.classList.contains('hidden')) { t.open = true; } });
    });
    document.getElementById('collapse').addEventListener('click', function () {
        topics.forEach(function (t) { t.open = false; });
    });

    // open a topic when its link in the contents is followed
    function openHash() {
        var id = decodeURIComponent(location.hash.slice(1));
        var el = id && document.getElementById(id);
        if (el && el.tagName === 'DETAILS') { el.open = true; }
    }
    window.addEventListener('hashchange', openHash);
    // the browser may restore the search text or checkbox after a reload
    if (q.value || onlyNew.checked) { apply(); }
    openHash();
})();
