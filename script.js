// ================== SMOOTH SCROLLING ==================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ================== ACTIVE NAV HIGHLIGHTING ==================
const sections = document.querySelectorAll('.section, #hero');
const navPills = document.querySelectorAll('.pill, .mobile-menu-link');

const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navPills.forEach(pill => {
                pill.classList.remove('is-active');
                if (pill.getAttribute('href') === `#${id}`) {
                    pill.classList.add('is-active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// ================== PILLNAV GSAP ANIMATIONS ==================
(function initPillNav() {
    if (typeof gsap === 'undefined') return;

    const circles = document.querySelectorAll('.pill .hover-circle');
    const tlRefs = [];
    const activeTweenRefs = [];
    const ease = 'power3.easeOut';

    function layout() {
        circles.forEach((circle, index) => {
            const pill = circle.parentElement;
            if (!pill) return;

            const rect = pill.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            if (w === 0 || h === 0) return;

            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;

            circle.style.width = `${D}px`;
            circle.style.height = `${D}px`;
            circle.style.bottom = `-${delta}px`;

            gsap.set(circle, {
                xPercent: -50,
                scale: 0,
                transformOrigin: `50% ${originY}px`
            });

            const label = pill.querySelector('.pill-label');
            const white = pill.querySelector('.pill-label-hover');

            if (label) gsap.set(label, { y: 0 });
            if (white) gsap.set(white, { y: h + 12, opacity: 0 });

            if (tlRefs[index]) tlRefs[index].kill();
            const tl = gsap.timeline({ paused: true });

            tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

            if (label) {
                tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
            }

            if (white) {
                gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
            }

            tlRefs[index] = tl;
        });
    }

    layout();
    window.addEventListener('resize', layout);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(layout).catch(() => {});
    }

    // Attach mouseenter and mouseleave to each .pill
    const pills = document.querySelectorAll('.pill-list .pill');
    pills.forEach((pill, i) => {
        pill.addEventListener('mouseenter', () => {
            const tl = tlRefs[i];
            if (!tl) return;
            if (activeTweenRefs[i]) activeTweenRefs[i].kill();
            activeTweenRefs[i] = tl.tweenTo(tl.duration(), {
                duration: 0.3,
                ease: ease,
                overwrite: 'auto'
            });
        });

        pill.addEventListener('mouseleave', () => {
            const tl = tlRefs[i];
            if (!tl) return;
            if (activeTweenRefs[i]) activeTweenRefs[i].kill();
            activeTweenRefs[i] = tl.tweenTo(0, {
                duration: 0.2,
                ease: ease,
                overwrite: 'auto'
            });
        });
    });

    // Logo hover spin
    const logoLink = document.getElementById('pill-logo-link');
    const logoImg = document.getElementById('pill-logo-img');
    let logoTween = null;
    if (logoLink && logoImg) {
        logoLink.addEventListener('mouseenter', () => {
            if (logoTween) logoTween.kill();
            gsap.set(logoImg, { rotate: 0 });
            logoTween = gsap.to(logoImg, {
                rotate: 360,
                duration: 0.4,
                ease: ease,
                overwrite: 'auto'
            });
        });
    }

    // Mobile menu toggle
    const hamburger = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu-popover');
    let isMobileMenuOpen = false;

    if (hamburger && mobileMenu) {
        gsap.set(mobileMenu, { visibility: 'hidden', opacity: 0, scaleY: 1 });

        hamburger.addEventListener('click', () => {
            isMobileMenuOpen = !isMobileMenuOpen;
            const lines = hamburger.querySelectorAll('.hamburger-line');

            if (isMobileMenuOpen) {
                gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
                gsap.set(mobileMenu, { visibility: 'visible' });
                gsap.fromTo(
                    mobileMenu,
                    { opacity: 0, y: 10, scaleY: 1 },
                    { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: 'top center' }
                );
            } else {
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(mobileMenu, {
                    opacity: 0,
                    y: 10,
                    scaleY: 1,
                    duration: 0.2,
                    ease,
                    transformOrigin: 'top center',
                    onComplete: () => {
                        gsap.set(mobileMenu, { visibility: 'hidden' });
                    }
                });
            }
        });

        // Close menu on mobile menu item click
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMobileMenuOpen = false;
                const lines = hamburger.querySelectorAll('.hamburger-line');
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(mobileMenu, {
                    opacity: 0,
                    y: 10,
                    duration: 0.2,
                    ease,
                    onComplete: () => {
                        gsap.set(mobileMenu, { visibility: 'hidden' });
                    }
                });
            });
        });
    }

    // Initial load animation
    const logoEl = document.getElementById('pill-logo-link');
    const navItemsEl = document.getElementById('pill-nav-items');

    if (logoEl) {
        gsap.set(logoEl, { scale: 0 });
        gsap.to(logoEl, { scale: 1, duration: 0.6, ease });
    }
    if (navItemsEl) {
        gsap.set(navItemsEl, { width: 0, overflow: 'hidden' });
        gsap.to(navItemsEl, { width: 'auto', duration: 0.6, ease });
    }
})();

// ================== FADE-IN ANIMATIONS ==================
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => fadeObserver.observe(el));

// ================== TYPEWRITER EFFECT ==================
(function () {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    if (!typewriterElements.length) return;

    typewriterElements.forEach(el => {
        const fullText = el.getAttribute('data-typewriter');
        const delay = parseInt(el.getAttribute('data-typewriter-delay') || '0', 10);
        el.textContent = '';
        el.style.minHeight = '1.6em'; // prevent layout shift

        // Create blinking cursor
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '|';
        el.appendChild(cursor);

        let charIndex = 0;
        const speed = 28; // ms per character

        function type() {
            if (charIndex < fullText.length) {
                // Insert text before cursor
                el.insertBefore(document.createTextNode(fullText.charAt(charIndex)), cursor);
                charIndex++;
                setTimeout(type, speed);
            } else {
                // Typing complete — blink cursor a few more times then remove
                setTimeout(() => {
                    cursor.classList.add('fade-out');
                    setTimeout(() => cursor.remove(), 600);
                }, 1200);
            }
        }

        setTimeout(type, delay);
    });
})();

// ================== CONTACT FORM ==================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('.submit-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent! ✓</span>';
        btn.style.background = '#22c55e';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            this.reset();
        }, 2000);
    });
}

// ================== BORDER GLOW EFFECT ==================
(function () {
    const glowCards = document.querySelectorAll('.border-glow-card');
    if (!glowCards.length) return;

    let mouseX = 0, mouseY = 0;
    let rafId = null;

    function updateAllCards() {
        glowCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const padding = 40; // glow-padding

            // Check if card is in viewport
            if (rect.bottom < -padding || rect.top > window.innerHeight + padding ||
                rect.right < -padding || rect.left > window.innerWidth + padding) {
                return;
            }

            // Calculate proximity (0 = far, 100 = touching)
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            // Distance from cursor to card edge
            const closestX = Math.max(rect.left, Math.min(mouseX, rect.right));
            const closestY = Math.max(rect.top, Math.min(mouseY, rect.bottom));
            const distX = mouseX - closestX;
            const distY = mouseY - closestY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            // Convert distance to proximity (0 to 100)
            const maxDist = 300;
            const proximity = Math.max(0, Math.min(100, ((maxDist - distance) / maxDist) * 100));

            // Calculate angle from card center to cursor
            const angle = Math.atan2(mouseY - cardCenterY, mouseX - cardCenterX);
            const angleDeg = ((angle * 180 / Math.PI) + 360) % 360;

            card.style.setProperty('--edge-proximity', proximity.toFixed(1));
            card.style.setProperty('--cursor-angle', angleDeg.toFixed(1) + 'deg');
        });
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafId) {
            rafId = requestAnimationFrame(() => {
                updateAllCards();
                rafId = null;
            });
        }
    });

    // Sweep animation on load
    function playSweepAnimation() {
        glowCards.forEach(card => card.classList.add('sweep-active'));

        const duration = 1200;
        const start = performance.now();

        function animate(now) {
            const progress = Math.min((now - start) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic

            glowCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) return;

                const sweepAngle = easedProgress * 360;
                card.style.setProperty('--cursor-angle', sweepAngle + 'deg');
                card.style.setProperty('--edge-proximity', (80 * (1 - progress * 0.7)).toFixed(1));
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                glowCards.forEach(card => {
                    card.classList.remove('sweep-active');
                    card.style.setProperty('--edge-proximity', '0');
                });
            }
        }
        requestAnimationFrame(animate);
    }

    setTimeout(playSweepAnimation, 500);
})();

// ================== LIQUID ETHER WEBGL BACKGROUND ==================
(function () {
    const container = document.getElementById('liquid-ether-bg');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        precision highp float;
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec2 iMouse;
        varying vec2 vUv;

        vec4 permute(vec4 x) {
            return mod(((x * 34.0) + 1.0) * x, 289.0);
        }

        vec4 taylorInvSqrt(vec4 r) {
            return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec3 fade(vec3 t) {
            return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        }

        float cnoise(vec3 P) {
            vec3 Pi0 = floor(P);
            vec3 Pi1 = Pi0 + vec3(1.0);
            Pi0 = mod(Pi0, 289.0);
            Pi1 = mod(Pi1, 289.0);
            vec3 Pf0 = fract(P);
            vec3 Pf1 = Pf0 - vec3(1.0);
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;
            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);
            vec4 gx0 = ixy0 / 7.0;
            vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);
            vec4 gx1 = ixy1 / 7.0;
            vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);
            vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
            vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
            vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
            vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
            vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
            vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
            vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
            vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);
            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
            return 2.2 * n_xyz;
        }

        void main() {
            vec2 uv = vUv;
            vec2 aspect = vec2(iResolution.x / iResolution.y, 1.0);
            float t = iTime * 0.15;

            // Multiple layers of noise at different scales
            float n1 = cnoise(vec3(uv * aspect * 2.0, t));
            float n2 = cnoise(vec3(uv * aspect * 3.5 + 5.0, t * 1.3 + 10.0));
            float n3 = cnoise(vec3(uv * aspect * 1.2 - 3.0, t * 0.7 - 5.0));
            float n4 = cnoise(vec3(uv * aspect * 5.0 + 8.0, t * 0.5 + 3.0));

            // Blend noise layers
            float noise = n1 * 0.4 + n2 * 0.3 + n3 * 0.2 + n4 * 0.1;

            // Color palette — light warm neutrals
            vec3 color1 = vec3(0.957, 0.953, 0.937);
            vec3 color2 = vec3(0.950, 0.945, 0.925);
            vec3 color3 = vec3(0.940, 0.932, 0.910);
            vec3 color4 = vec3(0.935, 0.925, 0.895);
            vec3 color5 = vec3(0.948, 0.940, 0.920);

            float blend = noise * 0.5 + 0.5;
            vec3 col;
            if (blend < 0.25) {
                col = mix(color1, color2, blend / 0.25);
            } else if (blend < 0.50) {
                col = mix(color2, color3, (blend - 0.25) / 0.25);
            } else if (blend < 0.75) {
                col = mix(color3, color4, (blend - 0.50) / 0.25);
            } else {
                col = mix(color4, color5, (blend - 0.75) / 0.25);
            }

            // Add subtle warm highlights
            float highlight = smoothstep(0.4, 0.8, noise + n4 * 0.5);
            col += vec3(0.03, 0.02, -0.01) * highlight * 0.4;

            // Soft vignette
            vec2 vigUv = vUv * 2.0 - 1.0;
            float vig = clamp(1.0 - dot(vigUv * 0.5, vigUv * 0.5), 0.0, 1.0);
            col = mix(col * 0.92, col, vig);

            gl_FragColor = vec4(col, 1.0);
        }
    `;

    const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iMouse: { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) }
    };

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        depthTest: false,
        depthWrite: false
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(plane, material);
    scene.add(mesh);

    let targetMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let currentMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Track mouse movement for FluidGlass lens refraction
    window.addEventListener('mousemove', (e) => {
        targetMouse.x = e.clientX;
        targetMouse.y = window.innerHeight - e.clientY;
    });

    let animFrame;
    function animate() {
        animFrame = requestAnimationFrame(animate);

        // maath damp3 0.15 easing for fluid glass pointer movement
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.15;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.15;
        uniforms.iMouse.value.set(currentMouse.x, currentMouse.y);

        uniforms.iTime.value += 0.016;
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    });

    // Reduce animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animFrame);
        } else {
            animate();
        }
    });
})();



// ================== CUSTOM POINTER CURSOR ==================
(function initCustomCursor() {
    if (window.innerWidth <= 768) return;

    let cursor = document.getElementById('custom-cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.className = 'custom-cursor';
        cursor.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
                <path d="M3.5 2.5L20.5 10.8C21.8 11.5 21.7 13.4 20.3 13.9L13.2 16.3C12.7 16.5 12.3 16.9 12.1 17.4L9.7 24.5C9.2 25.9 7.3 26 6.6 24.7L2.1 4.8C1.5 3.3 2.8 1.6 4.3 2.1Z" 
                      fill="#FFFFFF" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        document.body.appendChild(cursor);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currX = mouseX;
    let currY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderCursor() {
        currX += (mouseX - currX) * 0.25;
        currY += (mouseY - currY) * 0.25;

        if (cursor) {
            cursor.style.transform = `translate3d(${currX}px, ${currY}px, 0)`;
        }
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const interactiveSelectors = 'a, button, .project-card, .border-glow-card, .pill, .contact-link-item';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursor.classList.add('hovering');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursor.classList.remove('hovering');
        }
    });
})();

// ================== REACT BITS LOGOLOOP ==================
function initLogoLoop() {
    function setupMarquee(containerId, trackId, speedPx) {
        const container = document.getElementById(containerId);
        const track = document.getElementById(trackId);
        if (!container || !track) return;

        const firstList = track.querySelector('.logoloop__list');
        if (!firstList) return;

        // Duplicate list items for seamless infinite marquee loop
        const copiesNeeded = 4;
        for (let i = 1; i < copiesNeeded; i++) {
            const clone = firstList.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        }

        let offset = 0;
        const speed = speedPx;
        let currentVelocity = speed;
        let targetVelocity = speed;
        let lastTime = null;

        track.addEventListener('mouseenter', () => {
            targetVelocity = 0; // Pause on hover
        });

        track.addEventListener('mouseleave', () => {
            targetVelocity = speed;
        });

        function animate(timestamp) {
            if (lastTime === null) lastTime = timestamp;
            const deltaTime = Math.max(0, timestamp - lastTime) / 1000;
            lastTime = timestamp;

            const easingFactor = 1 - Math.exp(-deltaTime / 0.25);
            currentVelocity += (targetVelocity - currentVelocity) * easingFactor;

            const listWidth = firstList.getBoundingClientRect().width;
            if (listWidth > 0) {
                offset += currentVelocity * deltaTime;
                offset = ((offset % listWidth) + listWidth) % listWidth;
                track.style.transform = `translate3d(${-offset}px, 0, 0)`;
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    setupMarquee('skills-logoloop-1', 'skills-logoloop-track-1', 65);
    setupMarquee('skills-logoloop-2', 'skills-logoloop-track-2', -65);
}
initLogoLoop();
