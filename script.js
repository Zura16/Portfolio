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

// ================== TILTED CARD EFFECT FOR MAIN CARD ==================
(function initTiltedCard() {
    const mainCard = document.querySelector('.sidebar-card');
    if (!mainCard) return;

    const innerCard = mainCard.querySelector('.border-glow-inner');
    const profileWrapper = mainCard.querySelector('.profile-image-wrapper');
    const sidebarName = mainCard.querySelector('.sidebar-name');
    const sidebarTitle = mainCard.querySelector('.sidebar-title');

    if (profileWrapper) profileWrapper.classList.add('tilted-card-overlay-element');
    if (sidebarName) sidebarName.classList.add('tilted-card-overlay-element');
    if (sidebarTitle) sidebarTitle.classList.add('tilted-card-overlay-element');

    // Floating caption tooltip
    const caption = document.createElement('div');
    caption.className = 'tilted-card-caption';
    caption.textContent = 'Aalind Kale — Software Engineer';
    document.body.appendChild(caption);

    const rotateAmplitude = 12;
    const scaleOnHover = 1.03;
    let currRotateX = 0, currRotateY = 0, currScale = 1;
    let targetRotateX = 0, targetRotateY = 0, targetScale = 1;
    let lastY = 0;

    function renderTilt() {
        currRotateX += (targetRotateX - currRotateX) * 0.1;
        currRotateY += (targetRotateY - currRotateY) * 0.1;
        currScale += (targetScale - currScale) * 0.1;

        if (innerCard) {
            innerCard.style.transform = `rotateX(${currRotateX.toFixed(2)}deg) rotateY(${currRotateY.toFixed(2)}deg) scale(${currScale.toFixed(3)})`;
        }
        requestAnimationFrame(renderTilt);
    }
    requestAnimationFrame(renderTilt);

    mainCard.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 640) return;

        const rect = mainCard.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        targetRotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        targetRotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        // Position caption tooltip
        caption.style.left = `${e.clientX}px`;
        caption.style.top = `${e.clientY}px`;
        caption.style.opacity = '1';

        const velocityY = offsetY - lastY;
        caption.style.transform = `translate(-50%, -140%) rotate(${-velocityY * 0.4}deg)`;
        lastY = offsetY;
    });

    mainCard.addEventListener('mouseenter', () => {
        if (window.innerWidth > 640) {
            targetScale = scaleOnHover;
        }
    });

    mainCard.addEventListener('mouseleave', () => {
        targetRotateX = 0;
        targetRotateY = 0;
        targetScale = 1;
        caption.style.opacity = '0';
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
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 3.5L24 12C25.5 12.6 25.5 14.8 23.9 15.3L15.6 18.2C15.1 18.4 14.7 18.8 14.5 19.3L11.6 27.6C11.1 29.2 8.9 29.2 8.3 27.7L2.2 6.8C1.6 5 3 3 4.5 3.5Z" 
                      fill="#FFFFFF" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
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

// ================== FULL WEBGL SPLASH CURSOR FLUID SOLVER ==================
(function initWebGLSplashCursor() {
    let canvas = document.getElementById('splash-cursor-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'splash-cursor-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:45;display:block;';
        document.body.appendChild(canvas);
    }

    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    let gl = canvas.getContext('webgl2', params);
    const isWebGL2 = !!gl;
    if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
    if (!gl) return;

    let halfFloat = isWebGL2 ? null : gl.getExtension('OES_texture_half_float');
    let supportLinearFiltering = isWebGL2 ? gl.getExtension('OES_texture_float_linear') : gl.getExtension('OES_texture_half_float_linear');
    if (isWebGL2) gl.getExtension('EXT_color_buffer_float');

    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE);
    
    function supportRenderTextureFormat(gl, internalFormat, format, type) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
        if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
            switch (internalFormat) {
                case gl.R16F: return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                default: return null;
            }
        }
        return { internalFormat, format };
    }

    const formatRGBA = isWebGL2 ? getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType) : { internalFormat: gl.RGBA, format: gl.RGBA };
    const formatRG = isWebGL2 ? getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType) : { internalFormat: gl.RGBA, format: gl.RGBA };
    const formatR = isWebGL2 ? getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType) : { internalFormat: gl.RGBA, format: gl.RGBA };

    let config = {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 3.5,
        VELOCITY_DISSIPATION: 2.0,
        PRESSURE: 0.1,
        PRESSURE_ITERATIONS: 20,
        CURL: 3.0,
        SPLAT_RADIUS: 0.22,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10
    };

    function compileShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    function createProgram(vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        return program;
    }

    function getUniforms(program) {
        let uniforms = {};
        let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let name = gl.getActiveUniform(program, i).name;
            uniforms[name] = gl.getUniformLocation(program, name);
        }
        return uniforms;
    }

    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `);

    const displayShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform vec2 texelSize;

        void main () {
            vec3 c = texture2D(uTexture, vUv).rgb;
            vec3 lc = texture2D(uTexture, vL).rgb;
            vec3 rc = texture2D(uTexture, vR).rgb;
            vec3 tc = texture2D(uTexture, vT).rgb;
            vec3 bc = texture2D(uTexture, vB).rgb;

            float dx = length(rc) - length(lc);
            float dy = length(tc) - length(bc);

            vec3 n = normalize(vec3(dx, dy, length(texelSize)));
            vec3 l = vec3(0.0, 0.0, 1.0);

            float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
            c *= diffuse;

            float a = max(c.r, max(c.g, c.b));
            gl_FragColor = vec4(c, a);
        }
    `);

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;

        void main () {
            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
            vec4 result = texture2D(uSource, coord);
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
    `);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
    `);

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
    `);

    const gradienSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `);

    const displayProg = createProgram(baseVertexShader, displayShader);
    const splatProg = createProgram(baseVertexShader, splatShader);
    const advectionProg = createProgram(baseVertexShader, advectionShader);
    const divergenceProg = createProgram(baseVertexShader, divergenceShader);
    const curlProg = createProgram(baseVertexShader, curlShader);
    const vorticityProg = createProgram(baseVertexShader, vorticityShader);
    const pressureProg = createProgram(baseVertexShader, pressureShader);
    const gradSubtractProg = createProgram(baseVertexShader, gradienSubtractShader);

    const displayUniforms = getUniforms(displayProg);
    const splatUniforms = getUniforms(splatProg);
    const advectionUniforms = getUniforms(advectionProg);
    const divergenceUniforms = getUniforms(divergenceProg);
    const curlUniforms = getUniforms(curlProg);
    const vorticityUniforms = getUniforms(vorticityProg);
    const pressureUniforms = getUniforms(pressureProg);
    const gradSubtractUniforms = getUniforms(gradSubtractProg);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    function blit(target) {
        if (target == null) {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
            gl.viewport(0, 0, target.width, target.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    function createFBO(w, h, internalFormat, format, type) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);

        return {
            texture,
            fbo,
            width: w,
            height: h,
            texelSizeX: 1.0 / w,
            texelSizeY: 1.0 / h,
            attach(id) {
                gl.activeTexture(gl.TEXTURE0 + id);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                return id;
            }
        };
    }

    function createDoubleFBO(w, h, internalFormat, format, type) {
        let f1 = createFBO(w, h, internalFormat, format, type);
        let f2 = createFBO(w, h, internalFormat, format, type);
        return {
            width: w,
            height: h,
            texelSizeX: f1.texelSizeX,
            texelSizeY: f1.texelSizeY,
            get read() { return f1; },
            set read(val) { f1 = val; },
            get write() { return f2; },
            set write(val) { f2 = val; },
            swap() { let t = f1; f1 = f2; f2 = t; }
        };
    }

    let width = canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    let height = canvas.height = window.innerHeight * (window.devicePixelRatio || 1);

    let dye = createDoubleFBO(width, height, formatRGBA.internalFormat, formatRGBA.format, halfFloatTexType);
    let velocity = createDoubleFBO(128, 128, formatRG.internalFormat, formatRG.format, halfFloatTexType);
    let divergence = createFBO(128, 128, formatR.internalFormat, formatR.format, halfFloatTexType);
    let curl = createFBO(128, 128, formatR.internalFormat, formatR.format, halfFloatTexType);
    let pressure = createDoubleFBO(128, 128, formatR.internalFormat, formatR.format, halfFloatTexType);

    function splat(x, y, dx, dy, color) {
        gl.useProgram(splatProg);
        gl.uniform1i(splatUniforms.uTarget, velocity.read.attach(0));
        gl.uniform1f(splatUniforms.aspectRatio, canvas.width / canvas.height);
        gl.uniform2f(splatUniforms.point, x, y);
        gl.uniform3f(splatUniforms.color, dx, dy, 0.0);
        gl.uniform1f(splatUniforms.radius, config.SPLAT_RADIUS / 100.0);
        blit(velocity.write);
        velocity.swap();

        gl.uniform1i(splatUniforms.uTarget, dye.read.attach(0));
        gl.uniform3f(splatUniforms.color, color.r, color.g, color.b);
        blit(dye.write);
        dye.swap();
    }

    function generateColor() {
        const themeColors = [
            { r: 0.299, g: 0.219, b: 0.149 }, // Sandalwood Amber (#DAA06D)
            { r: 0.320, g: 0.242, b: 0.171 }, // Warm Golden Ochre (#E6AE7B)
            { r: 0.280, g: 0.201, b: 0.129 }, // Rich Sandalwood (#CC925E)
            { r: 0.332, g: 0.264, b: 0.202 }  // Soft Terracotta Amber Glow (#F0BF92)
        ];
        return themeColors[Math.floor(Math.random() * themeColors.length)];
    }

    let lastX = 0, lastY = 0;
    function handlePointerMove(x, y) {
        let px = x / window.innerWidth;
        let py = 1.0 - y / window.innerHeight;
        let dx = (x - lastX) * config.SPLAT_FORCE * 0.001;
        let dy = (lastY - y) * config.SPLAT_FORCE * 0.001;

        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
            splat(px, py, dx, dy, generateColor());
        }
        lastX = x;
        lastY = y;
    }

    window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
    window.addEventListener('click', (e) => {
        let px = e.clientX / window.innerWidth;
        let py = 1.0 - e.clientY / window.innerHeight;
        for (let i = 0; i < 5; i++) {
            let angle = Math.random() * Math.PI * 2;
            let force = (Math.random() * 8 + 4);
            splat(px, py, Math.cos(angle) * force, Math.sin(angle) * force, generateColor());
        }
    });

    let lastTime = Date.now();
    function update() {
        let now = Date.now();
        let dt = Math.min((now - lastTime) / 1000, 0.016);
        lastTime = now;

        gl.disable(gl.BLEND);

        // Curl
        gl.useProgram(curlProg);
        gl.uniform2f(curlUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(curlUniforms.uVelocity, velocity.read.attach(0));
        blit(curl);

        // Vorticity
        gl.useProgram(vorticityProg);
        gl.uniform2f(vorticityUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(vorticityUniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(vorticityUniforms.uCurl, curl.attach(1));
        gl.uniform1f(vorticityUniforms.curl, config.CURL);
        gl.uniform1f(vorticityUniforms.dt, dt);
        blit(velocity.write);
        velocity.swap();

        // Divergence
        gl.useProgram(divergenceProg);
        gl.uniform2f(divergenceUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(divergenceUniforms.uVelocity, velocity.read.attach(0));
        blit(divergence);

        // Pressure Jacobi solver
        gl.useProgram(pressureProg);
        gl.uniform2f(pressureUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(pressureUniforms.uDivergence, divergence.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(pressureUniforms.uPressure, pressure.read.attach(1));
            blit(pressure.write);
            pressure.swap();
        }

        // Gradient Subtract
        gl.useProgram(gradSubtractProg);
        gl.uniform2f(gradSubtractUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(gradSubtractUniforms.uPressure, pressure.read.attach(0));
        gl.uniform1i(gradSubtractUniforms.uVelocity, velocity.read.attach(1));
        blit(velocity.write);
        velocity.swap();

        // Advection Velocity & Dye
        gl.useProgram(advectionProg);
        gl.uniform2f(advectionUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(advectionUniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(advectionUniforms.uSource, velocity.read.attach(0));
        gl.uniform1f(advectionUniforms.dt, dt);
        gl.uniform1f(advectionUniforms.dissipation, config.VELOCITY_DISSIPATION);
        blit(velocity.write);
        velocity.swap();

        gl.uniform1i(advectionUniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(advectionUniforms.uSource, dye.read.attach(1));
        gl.uniform1f(advectionUniforms.dissipation, config.DENSITY_DISSIPATION);
        blit(dye.write);
        dye.swap();

        // Display Render
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.useProgram(displayProg);
        gl.uniform2f(displayUniforms.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
        gl.uniform1i(displayUniforms.uTexture, dye.read.attach(0));
        blit(null);

        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
})();
