        <script>
        let typingSpeed = 100;
        let delayBetweenLines = 500;
        let animationCompleted = false;

        const messages = [
            { element: 'mainGreeting', text: "Hello, I'm Manel Colominas" },
            { element: 'welcomeText', text: "Welcome to My Web Page" }
        ];

        function typeWriter(elementId, text, callback) {
            const element = document.getElementById(elementId);
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            
            element.appendChild(cursor);
            
            let i = 0;
            function type() {
                if (i < text.length) {
                    const char = text.charAt(i);
                    const textNode = document.createTextNode(char);
                    
                    if (elementId === 'mainGreeting' && i >= 10) {
                        if (i === 10) {
                            const nameSpan = document.createElement('span');
                            nameSpan.className = 'name-part';
                            element.insertBefore(nameSpan, cursor);
                        }
                        const nameSpan = element.querySelector('.name-part');
                        nameSpan.appendChild(textNode);
                    } else {
                        element.insertBefore(textNode, cursor);
                    }
                    
                    i++;
                    setTimeout(type, typingSpeed);
                } else {
                    setTimeout(() => {
                        cursor.remove();
                        if (callback) callback();
                    }, 800);
                }
            }
            type();
        }

        function startTypingSequence() {
            typeWriter(messages[0].element, messages[0].text, () => {
                setTimeout(() => {
                    typeWriter(messages[1].element, messages[1].text, () => {
                        // Mark animation as completed
                        animationCompleted = true;
                        // Auto-transition after 3 seconds
                        setTimeout(transitionToMain, 3000);
                    });
                }, delayBetweenLines);
            });
        }

        function transitionToMain() {
            const welcomeOverlay = document.getElementById('welcomeOverlay');
            const mainContent = document.getElementById('mainContent');
            const header = document.getElementById('header');
            
            // Start fade out of welcome
            welcomeOverlay.classList.add('fade-out');
            
            // Show header and main content with staggered timing
            setTimeout(() => {
                header.classList.add('show');
                mainContent.classList.add('show');
            }, 25);
            
            // Remove welcome overlay from DOM after transition
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
            }, 1200);
        }
        
        // Start the sequence when page loads
        window.addEventListener('load', () => {
            setTimeout(startTypingSequence, 1000);
        });

    // Navigation and section handling
    document.addEventListener('DOMContentLoaded', function() {
        // Get all navigation links and sections
        const navLinks = document.querySelectorAll('.nav a');
        const sections = document.querySelectorAll('.section');
        const menuToggle = document.getElementById('menu-toggle');
        
        // Set home section as active by default
        showSection('home');
        
        // Initialize: Reset all skill bars
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.style.width = '0%';
        });

        // Add click event listeners to navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                
                // Reset skill bars when leaving skills section
                if (sectionId !== 'skills') {
                    skillBars.forEach(bar => {
                        bar.style.width = '0%';
                    });
                }
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    menuToggle.checked = false;
                }
                
                // Show the selected section
                showSection(sectionId);
                
                // Update active link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Function to show selected section and hide others
        function showSection(sectionId) {
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.classList.add('active');
                
                // Animate skill bars when skills section is shown
                if (sectionId === 'skills') {
                    setTimeout(() => {
                        animateSkillBars();
                    }, 300);
                }
                
                // Scroll to top of the page
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        // Function to animate skill bars
        function animateSkillBars() {
            skillBars.forEach((bar, index) => {
                const targetWidth = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, index * 100); // Stagger the animations
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('header') && menuToggle.checked) {
                menuToggle.checked = false;
            }
        });

        // Update footer year
        const currentYear = new Date().getFullYear();
        document.getElementById('footer-text').textContent = `© ${currentYear} Manel Colominas. All rights reserved.`;
    });

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        const senderEmail = emailInput.value.trim().toLowerCase();
        
        if (senderEmail === 'marccolominas@gmail.com') {
            showStatus('Please use a different email address to contact me.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';
        
        try {
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: senderEmail,
                message: document.getElementById('message').value.trim()
            };
            
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            showStatus(`Oops! There was a problem: ${error.message}`, 'error');
            console.error('Error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span>';
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

function showStatus(message, type) {
    formStatus.style.display = 'block';
    formStatus.className = 'form-status ' + type;
    formStatus.textContent = message;
}


const nodemailer = require('nodemailer');
require('dotenv').config(); // For environment variables

// Email sending function
async function sendEmail(formData) {
    // Create transporter (use environment variables for credentials)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Email content
    const subject = `New message from ${formData.name}`;
    const htmlBody = `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong> ${formData.message}</p>
    `;

    // Email options
    const mailOptions = {
        from: formData.email, // Sender address
        to: process.env.EMAIL_USER, // Your email
        subject: subject,
        html: htmlBody,
        replyTo: formData.email // So you can reply directly
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

module.exports = { sendEmail };
</script>