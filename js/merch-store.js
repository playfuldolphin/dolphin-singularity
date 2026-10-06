document.addEventListener('DOMContentLoaded', async () => {
    const cards = [...document.querySelectorAll('.merch-card')];
    const filters = document.querySelector('.merch-filters');
    const status = document.getElementById('collectionStatus');
    const dialog = document.getElementById('designDialog');
    let catalog;

    filters.hidden = false;
    filters.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', () => {
            let count = 0;
            cards.forEach(card => {
                const matches = button.dataset.filter === 'all' || card.dataset.collection === button.dataset.filter || card.dataset.kind === button.dataset.filter;
                card.hidden = !matches;
                if (matches) count += 1;
            });
            filters.querySelectorAll('button').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
            status.textContent = `${count} ${count === 1 ? 'design' : 'designs'}`;
        });
    });

    function validProductUrl(value) {
        try {
            const url = new URL(value);
            return url.protocol === 'https:' && url.hostname.endsWith('.printful.me') && !url.username && !url.password;
        } catch (_) {
            return false;
        }
    }

    try {
        const response = await fetch('merch-catalog.json', { cache: 'no-cache' });
        if (!response.ok) return;
        catalog = await response.json();
        if (!Array.isArray(catalog.products)) return;
    } catch (_) {
        // Direct image links and the full collection remain usable without the catalog.
        return;
    }

    let liveProducts = 0;
    catalog.products.forEach(product => {
        const card = cards.find(item => item.dataset.product === product.id);
        if (!card) return;
        const action = card.querySelector('.merch-card__action');
        if (catalog.launchStatus === 'live' && validProductUrl(product.productUrl)) {
            liveProducts += 1;
            action.href = product.productUrl;
            action.textContent = 'Choose size on Printful →';
            action.removeAttribute('data-preview');
            card.querySelector('.merch-card__price').textContent = product.priceLabel || 'See current price';
        }
    });
    if (liveProducts > 0) {
        document.getElementById('shopStatus').textContent = 'Shop on Printful · US delivery';
        document.getElementById('orderingAnswer').textContent = 'Available products have a “Choose size on Printful” link. Open the listing to choose your size and see the current price, availability, delivery estimate, and checkout. Products still labeled “View design” are previews and are not open for orders.';
    }

    document.querySelectorAll('[data-preview]').forEach(link => {
        const product = catalog.products.find(item => item.id === link.dataset.preview);
        if (!product || !dialog.showModal) return;
        link.addEventListener('click', event => {
            event.preventDefault();
            const image = document.getElementById('dialogImage');
            image.src = product.image;
            image.alt = `Design mockup of ${product.name}`;
            document.getElementById('dialogTitle').textContent = product.name;
            document.getElementById('dialogKind').textContent = `${product.kind} / ${product.color}`;
            document.getElementById('dialogDescription').textContent = product.description;
            dialog.querySelector('.merch-caption').textContent = catalog.launchStatus === 'live' && validProductUrl(product.productUrl)
                ? 'Design mockup. See the Printful listing for final garment details, sizing, and pricing.'
                : 'Design mockup. This item is not open for orders yet.';
            dialog.showModal();
        });
    });
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
});
