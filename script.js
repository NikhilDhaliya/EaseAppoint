document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');

    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Handle submenu on mobile
    hasSubmenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav && !nav.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
            nav.classList.remove('active');
        }
    });

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Handle navigation based on login state
    function handleNavigation(e, targetPage) {
        e.preventDefault();
        if (!isLoggedIn) {
            window.location.href = 'Loginpage.html';
        } else {
            window.location.href = targetPage;
        }
    }

    // Add event listeners to buttons and links
    const signupButton = document.querySelector('.signup');
    const bookButton = document.querySelector('.book-button');
    const appointmentLinks = document.querySelectorAll('.has-submenu > a');

    if (signupButton) {
        signupButton.addEventListener('click', function(e) {
            handleNavigation(e, 'dashboard.html');
        });
    }

    if (bookButton) {
        bookButton.addEventListener('click', function(e) {
            handleNavigation(e, 'dashboard.html');
        });
    }

    appointmentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            handleNavigation(e, 'dashboard.html');
        });
    });

    // Handle submenu links
    const submenuLinks = document.querySelectorAll('.submenu a');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            handleNavigation(e, 'dashboard.html');
        });
    });

    // Protect appointment page
    if (window.location.pathname.includes('Appointment.html')) {
        if (!isLoggedIn) {
            window.location.href = 'Loginpage.html';
        }
    }
});
