// --- MESSAGE CONSOLE (ASCII ART) ---
const asciiLines = [
    "                               ..::::..                               ",
    "                          ..::::::::::::..                            ",
    "                     ..::::::::::::::::::::::..                       ",
    "                ..::::::::::::::''''::::::::::::::..                  ",
    "           ..::::::::::::::''          ''::::::::::::::..             ",
    "        .::::::::::::::''                  ''::::::::::::::.          ",
    "       :::::.......                              .......:::::         ",
    "       :::::''''::::::::......            ......:::::::::::::         ",
    "       :::::        ''''::::::::..    ..::::::::''''    :::::         ",
    "       :::::                ''''::::::::''''            :::::         ",
    "       :::::                       ::                   :::::         ",
    "       :::::                       ::                   :::::         ",
    "       :::::                       ::                   :::::         ",
    "       :::::                       ::                   :::::         ",
    "       '':::                       ::                   :::''         ",
    "            ''...                  ::                  ...''          ",
    "                 ''...             ::             ...''               ",
    "                      ''...        ::        ...''                    ",
    "                           ''...   ::   ...''                         ",
    "                                ''...''                               ",
    "                                                                      ",
    "  █████╗ ███╗   ██╗████████╗██████╗ ██╗███╗   ██╗███████╗ ",
    " ██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗██║████╗  ██║██╔════╝ ",
    " ███████║██╔██╗ ██║   ██║   ██║   ██║██║██╔██╗ ██║█████╗   ",
    " ██╔══██║██║╚██╗██║   ██║   ██║   ██║██║██║╚██╗██║██╔══╝   ",
    " ██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║██║ ╚████║███████╗ ",
    " ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝ ",
    "                                                                      ",
    " [ STATUS ]    > SYSTÈME OPÉRATIONNEL. INITIALISATION TERMINÉE.       ",
    " [ INTERFACE ] > BIENVENUE DANS LA CONSOLE.                           ",
    " [ CONTACT ]   > gagnepainantoine@yahoo.com                           ",
    " [ NETWORK ]   > PROJET CONNECTÉ AU RÉSEAU GLOBAL.                    "
];

const consoleText = asciiLines.map(line => `%c${line}`).join('\n');
const consoleStyles = asciiLines.map((line, index) => {
    if (index < 20) {
        const ratio = index / 19;
        const r = 0;
        const g = Math.round(100 + (155 * ratio));
        const b = Math.round(150 + (105 * ratio));
        return `color: rgb(${r}, ${g}, ${b}); font-weight: bold; text-shadow: 0 0 5px rgba(${r}, ${g}, ${b}, 0.5);`;
    } else if (index >= 21 && index <= 26) {
        const ratio = (index - 21) / 5;
        const r = 0;
        const g = Math.round(255 - (155 * ratio));
        const b = 255;
        return `color: rgb(${r}, ${g}, ${b}); font-weight: bold; text-shadow: 0 0 8px rgba(${r}, ${g}, ${b}, 0.8);`;
    } else if (index > 27) {
        const ratio = (index - 28) / 3;
        const lightness = Math.round(60 + (40 * ratio));
        return `color: hsl(160, 100%, ${lightness}%); font-family: monospace; font-size: 12px;`;
    }
    return "";
});

console.log(consoleText, ...consoleStyles);

// --- 1. AMÉLIORATION : SCRAMBLE TEXT EFFECT ---
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end, char: '' });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="text-white/50">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// --- 2. AMÉLIORATION : REVEAL ON SCROLL ---
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Joue une seule fois
        }
    });
}, observerOptions);

// --- 3. TRADUCTIONS & SWITCH DE LANGUE ---
const translations = {
    fr: {
        heroTag: "SYS.INIT // INGENIEUR LOGICIEL",
        heroSub1: "Développeur Full-Stack",
        heroSub2: "Spécialisé dans la conception de solutions innovantes et fiables pour des écosystèmes à haute valeur ajoutée.",
        scrollText: "SCROLL / GLISSER",
        stackTitle: "MA STACK.",
        langCore: "01 // LANGAGES & CORE",
        frontendUI: "02 // FRONTEND & UI",
        backendData: "03 // BACKEND & DATA",
        devopsQuality: "04 // DEVOPS & QUALITÉ",
        contactTitle: "CONTACT DIRECT",
        location: "Bordeaux, France",
        formName: "NOM OU ENTREPRISE",
        formMessage: "MESSAGE...",
        btnText: "ENVOYER LE MESSAGE"
    },
    en: {
        heroTag: "SYS.INIT // SOFTWARE ENGINEER",
        heroSub1: "Full-Stack Developer",
        heroSub2: "Specialized in building innovative and reliable solutions for high value-added ecosystems.",
        scrollText: "SCROLL / SWIPE",
        stackTitle: "MY STACK.",
        langCore: "01 // LANGUAGES & CORE",
        frontendUI: "02 // FRONTEND & UI",
        backendData: "03 // BACKEND & DATA",
        devopsQuality: "04 // DEVOPS & QUALITY",
        contactTitle: "DIRECT CONTACT",
        location: "Bordeaux, France",
        formName: "NAME OR COMPANY",
        formMessage: "MESSAGE...",
        btnText: "SEND MESSAGE"
    }
};

let currentLang = 'fr';

window.switchLanguage = function (lang) {
    if (lang === currentLang) return;
    currentLang = lang;

    document.getElementById('lang-fr').className = lang === 'fr' ? 'text-[#00ffcc] font-bold transition-colors cursor-hover-target' : 'text-white/50 hover:text-white transition-colors cursor-hover-target';
    document.getElementById('lang-en').className = lang === 'en' ? 'text-[#00ffcc] font-bold transition-colors cursor-hover-target' : 'text-white/50 hover:text-white transition-colors cursor-hover-target';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const newText = translations[lang][key];

        if (!newText) return;

        if (el.hasAttribute('data-scramble')) {
            el.setAttribute('data-scramble', newText);
            const fx = new TextScramble(el);
            fx.setText(newText);
        } else {
            el.style.transition = 'opacity 0.3s ease';
            el.style.opacity = 0;
            setTimeout(() => {
                el.innerHTML = newText;
                el.style.opacity = 1;
            }, 300);
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });

    document.querySelectorAll('[data-i18n-scramble]').forEach(el => {
        const key = el.getAttribute('data-i18n-scramble');
        if (translations[lang][key]) {
            el.setAttribute('data-scramble', translations[lang][key]);
        }
    });
};

window.onload = function () {

    // --- NOUVEAU : LOGIQUE DU PRELOADER ---
    let progress = 0;
    const percentEl = document.getElementById('loader-percent');
    const barEl = document.getElementById('loader-bar');
    const preloaderEl = document.getElementById('preloader');

    const loadingInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5; // Simule un chargement dynamique
        if (progress > 100) progress = 100;

        percentEl.innerText = progress + '%';
        barEl.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                preloaderEl.classList.add('loaded');
                document.body.classList.remove('no-scroll');
                initExperience(); // Lance les animations de la page
            }, 400);
        }
    }, 100);

    function initExperience() {
        // Initialisation Scroll Reveal
        document.querySelectorAll('.reveal').forEach((el) => {
            observer.observe(el);
        });

        // Initialisation Scramble sur les éléments
        document.querySelectorAll('[data-scramble]').forEach((el) => {
            const fx = new TextScramble(el);
            const originalText = el.getAttribute('data-scramble');

            setTimeout(() => fx.setText(originalText), 200);

            if (el.tagName === 'BUTTON') {
                el.addEventListener('mouseenter', () => fx.setText(originalText));
            }
        });
    }

    // --- 3. AMÉLIORATION : CUSTOM MAGNETIC CURSOR ---
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let followerX = mouseX, followerY = mouseY;

    const isDesktop = window.matchMedia("(pointer: fine)").matches;

    if (isDesktop) {
        // Suivi basique de la souris
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        // Lissage (Lerp) pour le follower
        function renderCursor() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        // Interactions (Hover effects)
        const hoverTargets = document.querySelectorAll('a, button, input, textarea, .cursor-hover-target');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            target.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });

        // Effet Magnetique sur le bouton
        const magneticBtn = document.querySelector('.magnetic-btn');
        if (magneticBtn) {
            magneticBtn.addEventListener('mousemove', (e) => {
                const rect = magneticBtn.getBoundingClientRect();
                const h = rect.width / 2;
                const v = rect.height / 2;
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - v;

                // Déplace le bouton vers la souris
                magneticBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            magneticBtn.addEventListener('mouseleave', () => {
                // Reset
                magneticBtn.style.transform = `translate(0px, 0px)`;
                magneticBtn.style.transition = `transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)`;
            });

            magneticBtn.addEventListener('mouseenter', () => {
                magneticBtn.style.transition = `none`;
            });
        }
    }


    // --- CONFIGURATION THREE.JS ---
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 15000 : 50000;
    const CAMERA_START_Z = isMobile ? 18 : 14;

    const container = document.getElementById('webgl-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, isMobile ? 0.03 : 0.04);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3, CAMERA_START_Z);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });

    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const parameters = {
        radius: isMobile ? 12 : 18,
        branches: 5,
        spin: 1.5,
        randomness: 0.6,
        randomnessPower: 3,
        insideColor: '#ffffff',
        outsideColor: '#00ffcc'
    };

    let geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT * 1);
    const randomness = new Float32Array(PARTICLE_COUNT * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

        randomness[i3] = randomX;
        randomness[i3 + 1] = randomY;
        randomness[i3 + 2] = randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);
        if (Math.random() > 0.8) mixedColor.setHex(0xff00ff);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
        scales[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

    const material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: (isMobile ? 20.0 : 30.0) * renderer.getPixelRatio() }
        },
        vertexShader: `
                    precision mediump float;
                    uniform float uTime;
                    uniform float uSize;
                    attribute float aScale;
                    attribute vec3 aRandomness;
                    attribute vec3 aColor;
                    varying vec3 vColor;
                    
                    void main() {
                        vColor = aColor;
                        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                        float distanceToCenter = length(modelPosition.xz);
                        
                        modelPosition.x += aRandomness.x;
                        modelPosition.y += aRandomness.y + sin(distanceToCenter * 2.0 - uTime * 2.0) * 0.5;
                        modelPosition.z += aRandomness.z;

                        vec4 viewPosition = viewMatrix * modelPosition;
                        gl_Position = projectionMatrix * viewPosition;
                        gl_PointSize = uSize * aScale;
                        gl_PointSize *= (1.0 / - viewPosition.z);
                    }
                `,
        fragmentShader: `
                    precision mediump float;
                    varying vec3 vColor;
                    
                    void main() {
                        float dist = distance(gl_PointCoord, vec2(0.5));
                        float halo = pow(1.0 - (dist * 2.0), 3.0);
                        float core = 1.0 - smoothstep(0.1, 0.15, dist);
                        float strength = max(core, halo);
                        
                        vec3 color = mix(vec3(0.0), vColor, max(0.0, strength));
                        gl_FragColor = vec4(color, 1.0);
                    }
                `
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.x = 0.2;
    points.rotation.z = -0.1;
    scene.add(points);

    // --- NOUVEAU : POST-PROCESSING (BLOOM & ABERRATION CHROMATIQUE) ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);

    // Effet Bloom (Éclat lumineux "Néon")
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.15;
    bloomPass.strength = isMobile ? 1.8 : 2.5; // Puissance de la brillance
    bloomPass.radius = 0.8;
    composer.addPass(bloomPass);

    // Effet Aberration Chromatique (RGB Shift)
    const rgbShiftPass = new THREE.ShaderPass(THREE.RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.0015;
    composer.addPass(rgbShiftPass);

    // --- INTERACTIONS 3D ---
    let envMouseX = 0, envMouseY = 0, targetX = 0, targetY = 0;
    let currentLookAtX = 0, currentLookAtY = 0; // Pour lier l'interpolation
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        envMouseX = (event.clientX - windowHalfX) * 0.0005;
        envMouseY = (event.clientY - windowHalfY) * 0.0005;
    });

    // Éviter le saut immédiat si l'utilisateur tap au lieu de glisser
    document.addEventListener('touchstart', (event) => {
        if (event.touches.length > 0) {
            envMouseX = (event.touches[0].clientX - windowHalfX) * 0.002;
            envMouseY = (event.touches[0].clientY - windowHalfY) * 0.002;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            envMouseX = (event.touches[0].clientX - windowHalfX) * 0.002;
            envMouseY = (event.touches[0].clientY - windowHalfY) * 0.002;
        }
    }, { passive: true });

    let scrollPercent = 0;
    window.addEventListener('scroll', () => {
        let maxScroll = document.body.scrollHeight - window.innerHeight;
        if (maxScroll > 0) scrollPercent = window.scrollY / maxScroll;
    }, { passive: true });

    window.addEventListener('resize', () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        const currentIsMobile = window.innerWidth < 768;
        material.uniforms.uSize.value = (currentIsMobile ? 20.0 : 30.0) * renderer.getPixelRatio();
    });

    document.getElementById('year').textContent = new Date().getFullYear();

    // --- ANIMATION THREE.JS ---
    const clock = new THREE.Clock();
    let lastScrollY = window.scrollY;

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        material.uniforms.uTime.value = elapsedTime;
        points.rotation.y = elapsedTime * (isMobile ? 0.05 : 0.03);

        targetX = envMouseX * (isMobile ? 2.5 : 2);
        targetY = envMouseY * (isMobile ? 2.5 : 2);

        const floatAnim = isMobile ? Math.sin(elapsedTime * 0.8) * 0.5 : 0;

        // --- NOUVELLE ANIMATION : Élévation (Effet Drone) au lieu du plongeon ---
        camera.position.x += (targetX - camera.position.x) * 0.005;
        camera.position.y += floatAnim * 0.01;

        // La caméra monte doucement sur l'axe Y au lieu de rester fixe
        const elevation = scrollPercent * (isMobile ? 12 : 18);
        camera.position.y += (targetY - camera.position.y + 3 + elevation) * 0.02;

        // L'axe Z recule très légèrement pour ouvrir le champ de vision (au lieu de foncer dedans)
        const targetZ = CAMERA_START_Z + (scrollPercent * 4);
        camera.position.z += (targetZ - camera.position.z) * 0.02;

        // Inclinaison très subtile (suppression de l'effet "tonneau" qui donne la nausée)
        camera.rotation.z = scrollPercent * -0.15;

        // Interpolation de la direction du regard pour un effet smooth même après un "tap"
        currentLookAtX += (envMouseX * 5 - currentLookAtX) * 0.05;
        currentLookAtY += (envMouseY * 5 - currentLookAtY) * 0.05;

        // La caméra regarde vers ses coordonnées interpolées
        camera.lookAt(new THREE.Vector3(currentLookAtX, currentLookAtY, 0));

        // --- NOUVEAU : DYNAMIQUE D'ABERRATION CHROMATIQUE AU SCROLL ---
        const currentScrollY = window.scrollY;
        const scrollSpeed = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        // Si on scrolle vite, les couleurs se séparent (effet de vitesse)
        const targetShift = isMobile ? 0.0015 : Math.min(scrollSpeed * 0.0003, 0.01) + 0.0015;
        rgbShiftPass.uniforms['amount'].value += (targetShift - rgbShiftPass.uniforms['amount'].value) * 0.1;

        // Rendu via le Composer au lieu du Renderer classique
        composer.render();
    }

    animate();
};
