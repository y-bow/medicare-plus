document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle menu icon animation if desired
            menuToggle.classList.toggle('open');
        });
    }

    // 2. Header Scroll Effect (Glassmorphism transition)
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight / 5 * 4;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Run once on load to catch elements already in view
    revealOnScroll();

    // 4. Form Validation (for Contact/Booking Page)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;

            // Reset error messages
            document.querySelectorAll('.error-msg').forEach(msg => msg.style.display = 'none');

            if (!name) {
                document.getElementById('nameError').style.display = 'block';
                isValid = false;
            }

            if (!email || !validateEmail(email)) {
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }

            if (!message) {
                document.getElementById('messageError').style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                // Using a more "premium" alert style would be better, but alert is fine for this task
                alert('Thank you for your inquiry. Our concierge will contact you shortly.');
                contactForm.reset();
            }
        });
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
