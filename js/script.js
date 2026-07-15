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
                fetch('https://v-ideapad.taile0023f.ts.net/webhook-test/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message }),
                })
                .then(response => {
                    if (response.ok) {
                        alert('Thank you for your inquiry. Our concierge will contact you shortly.');
                        contactForm.reset();
                    } else {
                        alert('Something went wrong. Please try again later.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again later.');
                });
            }
        });
    }

    // 5. Chat Widget Functionality
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');

    if (chatToggleBtn && chatWindow) {
        const toggleChat = () => {
            chatWindow.classList.toggle('hidden');
        };

        chatToggleBtn.addEventListener('click', toggleChat);
        chatCloseBtn.addEventListener('click', toggleChat);

        const appendMessage = (text, sender) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', `${sender}-message`);
            messageDiv.innerText = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const sendMessage = async () => {
            const message = chatInput.value.trim();
            if (!message) return;

            appendMessage(message, 'user');
            chatInput.value = '';

            try {
                const response = await fetch('https://v-ideapad.taile0023f.ts.net/webhook-test/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });

                if (response.ok) {
                    const data = await response.json();
                    // Assuming the chatbot returns { response: "..." } or just the text
                    const botResponse = data.response || data.message || (typeof data === 'string' ? data : 'I am here to help!');
                    appendMessage(botResponse, 'bot');
                } else {
                    appendMessage('Sorry, I am having trouble connecting right now.', 'bot');
                }
            } catch (error) {
                console.error('Chat error:', error);
                appendMessage('Sorry, something went wrong. Please try again later.', 'bot');
            }
        };

        chatSendBtn.addEventListener('click', sendMessage);

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
