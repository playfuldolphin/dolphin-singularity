// One responsive navigation controller for the homepage and inner pages.
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav, .navbar');
    const toggle = document.querySelector('#hamburger, #mobileMenuToggle');
    const links = document.getElementById('navLinks');
    if (!nav || !toggle || !links) return;

    const mobile = window.matchMedia('(max-width: 768px)');
    const openClass = toggle.id === 'hamburger' ? 'open' : 'active';
    let previousOverflow = '';
    let isOpen = false;

    function setOpen(open, restoreFocus = false) {
        if (open === isOpen) return;
        isOpen = open;
        toggle.classList.toggle(openClass, open);
        links.classList.toggle(openClass, open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (open) {
            previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = previousOverflow;
            if (restoreFocus) toggle.focus();
        }
    }

    toggle.type = 'button';
    toggle.setAttribute('aria-controls', 'navLinks');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    nav.classList.add('js-navigation');

    toggle.addEventListener('click', () => setOpen(!isOpen));
    links.addEventListener('click', event => {
        if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', event => {
        if (!nav.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', event => {
        if (!isOpen) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false, true);
        }
        if (event.key === 'Tab') {
            const controls = [...nav.querySelectorAll('a, button')]
                .filter(element => element.getClientRects().length > 0);
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
    mobile.addEventListener('change', () => setOpen(false));
    window.addEventListener('resize', () => {
        if (!mobile.matches) setOpen(false);
    });
});
