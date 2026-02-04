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
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                entry.target.classList.add('opacity-100', 'translate-y-0');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe elements after rendering
    setTimeout(() => {
        document.querySelectorAll('.timeline-item, .skill-category, .project-card').forEach(el => {
            observer.observe(el);
            el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
        });

        // Initialize Tilt Effect for Project Cards
        initTiltEffect();

        // Initialize Contact Hover Effect
        initContactHoverEffect();
    }, 100);


    // Hamburger Menu Logic Removed (Navbar Redesigned)
});

// Rendering Functions
function renderHero() {
    const heroContainer = document.getElementById('hero-content');
    if (!heroContainer) return;

    const { name, lastName, subtitle, description, social } = portfolioData.profile;

    heroContainer.innerHTML = `
        <div id="name-container" class="relative inline-block cursor-none mb-6">
            <!-- Original Layer -->
            <h1 class="text-5xl md:text-7xl font-bold font-mono tracking-tighter select-none">${name} <span class="text-gradient">${lastName}</span></h1>
            
            <!-- Magnified Layer (Fixed: Added bg-bg to hide original text underneath) -->
            <div id="magnifier-layer" class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 bg-bg" aria-hidden="true">
                <h1 class="text-5xl md:text-7xl font-bold font-mono tracking-tighter">${name} <span class="text-gradient">${lastName}</span></h1>
            </div>

            <!-- Glass Rim (Refined: Less frosty, more glossy, smooth scale entrance) -->
            <div id="magnifier-rim" class="absolute w-32 h-32 border border-white/20 rounded-full pointer-events-none opacity-0 scale-75 shadow-2xl transition-all duration-300 ease-out z-10 backdrop-blur-[1px] bg-gradient-to-br from-white/20 to-transparent" 
                 style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.4), 0 0 15px rgba(59, 130, 246, 0.4);"></div>
        </div>

        <p class="text-xl md:text-2xl text-secondary-text mb-8 font-light">${subtitle}</p>
        <p class="text-lg text-secondary-text mb-10 max-w-lg mx-auto leading-relaxed">${description}</p>
        <div class="flex gap-4 justify-center mb-12">
            <a href="#projects" class="px-8 py-3 rounded-full bg-text text-bg font-semibold hover:bg-accent hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-accent/25">View Work</a>
            <a href="#contact" class="px-8 py-3 rounded-full border border-secondary-text text-text font-semibold hover:border-text hover:bg-white/5 transition-all duration-300 contact-trigger">Contact Me</a>
        </div>
        <div class="flex gap-6 justify-center">
            <a href="${social.github}" target="_blank" aria-label="GitHub" class="text-secondary-text hover:text-accent transition-all duration-300 hover:-translate-y-1"><i data-lucide="github" width="24" height="24"></i></a>
            <a href="${social.linkedin}" target="_blank" aria-label="LinkedIn" class="text-secondary-text hover:text-accent transition-all duration-300 hover:-translate-y-1"><i data-lucide="linkedin" width="24" height="24"></i></a>
            <a href="mailto:${portfolioData.profile.email}" aria-label="Email" class="text-secondary-text hover:text-accent transition-all duration-300 hover:-translate-y-1"><i data-lucide="mail" width="24" height="24"></i></a>
        </div>
    `;

    // Initialize the magnifier effect *after* rendering
    setTimeout(initNameMagnifier, 0);
}

function initNameMagnifier() {
    const container = document.getElementById('name-container');
    const magnifierLayer = document.getElementById('magnifier-layer');
    const rim = document.getElementById('magnifier-rim');

    // Select custom cursor elements to hide them
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!container || !magnifierLayer || !rim) return;

    container.addEventListener('mouseenter', () => {
        magnifierLayer.classList.remove('opacity-0');
        rim.classList.remove('opacity-0', 'scale-75'); // Scale up

        // Hide global custom cursor
        if (cursorDot) cursorDot.classList.add('opacity-0');
        if (cursorOutline) cursorOutline.classList.add('opacity-0');
    });

    container.addEventListener('mouseleave', () => {
        magnifierLayer.classList.add('opacity-0');
        rim.classList.add('opacity-0', 'scale-75'); // Scale down

        // Show global custom cursor
        if (cursorDot) cursorDot.classList.remove('opacity-0');
        if (cursorOutline) cursorOutline.classList.remove('opacity-0');
    });

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Size of the lens (Matches w-32 = 8rem = 128px)
        const size = 128;
        const radius = size / 2;

        // Update Clip Path for the magnified text
        // We clip the magnified layer to a circle at the mouse position
        magnifierLayer.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`;

        // Move the visible rim to follow the mouse (centered)
        rim.style.left = `${x - radius}px`;
        rim.style.top = `${y - radius}px`;

        // The Magic: Scale the text layer from the mouse position
        magnifierLayer.style.transformOrigin = `${x}px ${y}px`;
        magnifierLayer.style.transform = 'scale(1.35)'; // Slightly increased magnification
    });
}

function renderExperience() {
    const container = document.getElementById('experience-container');
    if (!container) return;

    container.innerHTML += portfolioData.experience.map(item => `
        <div class="timeline-item relative pl-8 md:pl-12 mb-12 group">
            <!-- Dot -->
            <div class="absolute left-4 md:left-0 top-1.5 w-3 h-3 -translate-x-[5px] rounded-full bg-accent ring-4 ring-bg group-hover:ring-accent/20 transition-all duration-300"></div>
            
            <div class="text-sm font-mono text-accent mb-2">${item.date}</div>
            <div class="bg-card-bg p-6 rounded-xl border border-white/5 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
                <h3 class="text-2xl font-bold mb-1 text-text">${item.role}</h3>
                <h4 class="text-lg text-secondary-text mb-4 font-normal">${item.company}</h4>
                <ul class="list-disc list-inside text-secondary-text space-y-2 marker:text-accent">
                    ${item.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function renderEducation() {
    const container = document.getElementById('education-container');
    if (!container) return;

    container.innerHTML += portfolioData.education.map(item => `
        <div class="timeline-item relative pl-8 md:pl-12 mb-12 group">
            <div class="absolute left-4 md:left-0 top-1.5 w-3 h-3 -translate-x-[5px] rounded-full bg-accent ring-4 ring-bg group-hover:ring-accent/20 transition-all duration-300"></div>
            
            <div class="text-sm font-mono text-accent mb-2">${item.date}</div>
            <div class="bg-card-bg p-6 rounded-xl border border-white/5 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
                <h3 class="text-2xl font-bold mb-1 text-text">${item.degree}</h3>
                <h4 class="text-lg text-secondary-text mb-2 font-normal">${item.school}</h4>
                <p class="text-accent font-mono text-sm">${item.grade}</p>
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
        <div class="skill-category bg-card-bg p-8 rounded-2xl border border-white/5 hover:border-accent hover:-translate-y-2 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
            <h3 class="text-xl font-bold mb-6 text-text">${cat.title}</h3>
            <div class="flex flex-wrap gap-3">
                ${portfolioData.skills[cat.key].map(skill => `
                    <span class="px-4 py-2 bg-white/5 rounded-full text-sm text-secondary-text hover:bg-accent hover:text-white transition-all duration-300 cursor-default border border-white/5 hover:border-accent">${skill}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = portfolioData.projects.map(project => `
        <div class="project-card bg-card-bg rounded-2xl p-8 border border-white/5 hover:border-accent hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden hover:shadow-2xl hover:shadow-accent/10" data-tilt>
            <div class="relative z-10">
                <h3 class="text-2xl font-bold mb-3 text-text group-hover:text-accent transition-colors">${project.title}</h3>
                <p class="text-secondary-text mb-6 text-sm leading-relaxed">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-6">
                    ${project.tags.map(tag => `<span class="text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded-md border border-accent/20">${tag}</span>`).join('')}
                </div>
                <div class="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out border-t border-white/10">
                    <p class="pt-4 text-sm text-secondary-text">${project.details}</p>
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
        <p class="text-secondary-text mb-8 text-lg leading-relaxed">I'm currently available for freelance work or full-time opportunities. If you have a project that needs some creative touch, feel free to contact me.</p>
        <a href="mailto:${email}" class="text-3xl md:text-5xl font-bold text-text hover:text-accent transition-colors duration-300 block mb-6 tracking-tight">${email}</a>
        <p class="font-mono text-secondary-text">${phone}</p>
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
