document.addEventListener('DOMContentLoaded', () => {
    // Render Content from Data
    renderHero();
    renderExperience();
    renderEducation();
    renderSkills();
    renderProjects();
    renderContact();

    // Re-initialize Icons
    lucide.createIcons();

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Check if elements exist before adding event listeners to avoid errors
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });

            // Create Trail
            createCursorTrail(posX, posY);
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe elements after rendering
    setTimeout(() => {
        document.querySelectorAll('.timeline-item, .skill-category, .project-card').forEach(el => {
            observer.observe(el);
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        // Initialize Tilt Effect for Project Cards
        initTiltEffect();

        // Initialize Contact Hover Effect
        initContactHoverEffect();
    }, 100);

    // Add visible class styles dynamically if not in CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking a link
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
});

// Rendering Functions
function renderHero() {
    const heroContainer = document.getElementById('hero-content');
    if (!heroContainer) return;

    const { name, lastName, subtitle, description, social } = portfolioData.profile;

    heroContainer.innerHTML = `
        <h1 class="hero-title">${name} <span class="highlight">${lastName}</span></h1>
        <p class="hero-subtitle">${subtitle}</p>
        <p class="hero-description">${description}</p>
        <div class="hero-cta">
            <a href="#projects" class="btn primary">View Work</a>
            <a href="#contact" class="btn secondary contact-trigger">Contact Me</a>
        </div>
        <div class="social-links">
            <a href="${social.github}" target="_blank" aria-label="GitHub"><i data-lucide="github"></i></a>
            <a href="${social.linkedin}" target="_blank" aria-label="LinkedIn"><i data-lucide="linkedin"></i></a>
            <a href="mailto:${portfolioData.profile.email}" aria-label="Email"><i data-lucide="mail"></i></a>
        </div>
    `;
}

function renderExperience() {
    const container = document.getElementById('experience-container');
    if (!container) return;

    container.innerHTML = portfolioData.experience.map(item => `
        <div class="timeline-item">
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-content">
                <h3>${item.role}</h3>
                <h4>${item.company}</h4>
                <ul>
                    ${item.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function renderEducation() {
    const container = document.getElementById('education-container');
    if (!container) return;

    container.innerHTML = portfolioData.education.map(item => `
        <div class="timeline-item">
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-content">
                <h3>${item.degree}</h3>
                <h4>${item.school}</h4>
                <p class="grade">${item.grade}</p>
            </div>
        </div>
    `).join('');
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    const categories = [
        { title: 'Languages', key: 'languages' },
        { title: 'Web Development', key: 'web' },
        { title: 'Frameworks & Tools', key: 'tools' }
    ];

    container.innerHTML = categories.map(cat => `
        <div class="skill-category">
            <h3>${cat.title}</h3>
            <div class="skill-tags">
                ${portfolioData.skills[cat.key].map(skill => `<span>${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = portfolioData.projects.map(project => `
        <div class="project-card" data-tilt>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <div class="project-details">
                    <p>${project.details}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderContact() {
    const container = document.getElementById('contact-container');
    if (!container) return;

    const { email, phone } = portfolioData.profile;

    container.innerHTML = `
        <p>I'm currently available for freelance work or full-time opportunities. If you have a project that needs some creative touch, feel free to contact me.</p>
        <a href="mailto:${email}" class="email-link">${email}</a>
        <p class="phone">${phone}</p>
    `;
}

function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouch) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
}

function initContactHoverEffect() {
    // We need to wait for the button to be rendered
    setTimeout(() => {
        const contactBtn = document.querySelector('.contact-trigger');
        if (!contactBtn) return;

        contactBtn.addEventListener('mouseenter', () => {
            // Create a burst of beams
            for (let i = 0; i < 8; i++) {
                createBeam(contactBtn);
            }

            // Continue creating beams while hovering
            const interval = setInterval(() => {
                if (!contactBtn.matches(':hover')) {
                    clearInterval(interval);
                    return;
                }
                createBeam(contactBtn);
            }, 100);
        });
    }, 500); // Wait for render
}

function createBeam(element) {
    const rect = element.getBoundingClientRect();
    const beam = document.createElement('div');
    beam.classList.add('energy-beam');

    // Randomize start position along the bottom of the button
    const startX = rect.left + Math.random() * rect.width;
    const startY = rect.bottom;

    beam.style.left = `${startX}px`;
    beam.style.top = `${startY}px`;

    // Randomize speed and size
    const duration = 0.8 + Math.random() * 0.5;
    const height = 20 + Math.random() * 30;
    beam.style.height = `${height}px`;
    beam.style.animation = `beamDrop ${duration}s linear forwards`;

    document.body.appendChild(beam);

    // Cleanup
    setTimeout(() => {
        beam.remove();
    }, duration * 1000);
}

let lastTrailTime = 0;
function createCursorTrail(x, y) {
    const now = Date.now();
    // Throttle: only create a particle every 20ms to keep it minimalist
    if (now - lastTrailTime < 20) return;
    lastTrailTime = now;

    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');

    // Add slight random offset for natural feel
    const offsetX = (Math.random() - 0.5) * 4;
    const offsetY = (Math.random() - 0.5) * 4;

    trail.style.left = `${x + offsetX}px`;
    trail.style.top = `${y + offsetY}px`;

    // Randomize animation duration slightly
    const duration = 0.5 + Math.random() * 0.3;
    trail.style.animation = `trailFade ${duration}s linear forwards`;

    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, duration * 1000);
}
