document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resourceSearch');
    if (!form) return;

    const input = document.getElementById('searchInput');
    const status = document.getElementById('searchStatus');
    const empty = document.getElementById('searchEmpty');
    const normalize = value => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    const resources = [...document.querySelectorAll('.resource-result')].map(element => ({
        element,
        words: normalize(`${element.textContent} ${element.dataset.keywords}`).match(/[\p{L}\p{N}]+/gu) || []
    }));
    const stopWords = new Set(['a', 'an', 'the', 'how', 'do', 'does', 'what', 'is', 'are', 'can', 'about', 'of', 'to', 'in', 'and']);

    function search(updateUrl = true) {
        const query = input.value.trim().slice(0, 200);
        const words = normalize(query).match(/[\p{L}\p{N}]+/gu) || [];
        const keywords = words.filter(word => !stopWords.has(word));
        let count = 0;

        resources.forEach(({ element, words: resourceWords }) => {
            const matches = !query || (keywords.length > 0 && keywords.every(word =>
                resourceWords.some(candidate => candidate === word || (word.length >= 4 && candidate.startsWith(word)))
            ));
            element.hidden = !matches;
            if (matches) count += 1;
        });

        empty.hidden = count > 0;
        status.textContent = query
            ? `${count} ${count === 1 ? 'resource' : 'resources'} found for “${query}”.`
            : `${count} resources to explore.`;

        form.querySelectorAll('[data-query]').forEach(button => {
            button.setAttribute('aria-pressed', String(normalize(button.dataset.query) === normalize(query)));
        });

        if (updateUrl) {
            const url = new URL(window.location.href);
            if (query) url.searchParams.set('q', query);
            else url.searchParams.delete('q');
            window.history.replaceState(null, '', url);
        }
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        search();
    });
    form.addEventListener('reset', event => {
        event.preventDefault();
        input.value = '';
        search();
        input.focus();
    });
    input.addEventListener('input', () => search());
    form.querySelectorAll('[data-query]').forEach(button => {
        button.addEventListener('click', () => {
            input.value = button.dataset.query;
            search();
        });
    });
    input.value = (new URLSearchParams(window.location.search).get('q') || '').slice(0, 200);
    form.hidden = false;
    search(false);
});
