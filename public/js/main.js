// Add mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    nav.insertBefore(menuToggle, navLinks);
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '☰';
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '☰';
        });
    });
});
