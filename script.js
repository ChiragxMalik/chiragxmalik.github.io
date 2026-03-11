// Neural Network Background Animation
class NeuralNetwork {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationFrame = null;
        this.resizeTimeout = null;

        this.initCanvas();
        this.createNodes(50); // Number of nodes
        this.animate();

        window.addEventListener('resize', () => this.handleResize());
    }

    initCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleResize() {
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);

        this.resizeTimeout = setTimeout(() => {
            this.initCanvas();
            this.createNodes(50);
        }, 250);
    }

    createNodes(count) {
        this.nodes = [];
        for (let i = 0; i < count; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    drawConnections() {
        this.ctx.strokeStyle = '#4A9EFF';
        this.ctx.lineWidth = 0.2;

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) { // Connection distance threshold
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.globalAlpha = 1 - (distance / 150);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }

    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
        });
    }

    drawNodes() {
        this.ctx.fillStyle = '#4A9EFF';
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateNodes();
        this.drawConnections();
        this.drawNodes();

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Neural Network Background
    const network = new NeuralNetwork();

    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navContainer = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links li');
    const mobileBlurOverlay = document.querySelector('.mobile-blur-overlay');

    const closeMenu = () => {
        if (nav.classList.contains('active')) {
            navContainer.classList.remove('nav-open');
            nav.classList.remove('active');
            burger.classList.remove('active');
            mobileBlurOverlay.classList.remove('active');

        }
    };

    const toggleMenu = () => {
        const isActive = nav.classList.contains('active');
        navContainer.classList.toggle('nav-open');
        if (isActive) {
            closeMenu();
        } else {
            nav.classList.add('active');
            burger.classList.add('active');
            mobileBlurOverlay.classList.add('active');

        }
    };

    if (burger) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && nav.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close mobile menu when clicking on a link or scrolling to a section
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Experience Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(e) {
        const clickedTab = e.target;
        const tabId = clickedTab.dataset.tab;

        // Remove active class from all buttons and contents
        tabButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        clickedTab.classList.add('active');
        document.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', switchTab);
    });

    // Nav Scroll Effect (Desktop)
    const dtNav = document.querySelector('nav:not(.mobile-nav-pill)');
    if (dtNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                dtNav.classList.add('scrolled');
            } else {
                dtNav.classList.remove('scrolled');
            }
        });
    }

    // Smooth Scrolling
    // Smooth Scrolling with precise offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                // Check if mobile menu is open
                const isMobileMenuOpen = nav.classList.contains('active');

                if (isMobileMenuOpen) {
                    closeMenu();
                }

                // Small delay only if menu was open, to allow closing animation
                const delay = isMobileMenuOpen ? 300 : 0;

                setTimeout(() => {
                    const headerOffset = 100; // Matches scroll-padding-top
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, delay);
            }
        });
    });

    // Typing Animation for Subtitle
    const subtitle = document.querySelector('.tagline');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let index = 0;

        function typeWriter() {
            if (index < text.length) {
                subtitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        }

        // Start typing animation after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Execute Liquid Glass processing
    initLiquidGlass();
});

function initLiquidGlass() {
    let svgContainer = document.getElementById('liquid-glass-svg-container');
    if (!svgContainer) {
        svgContainer = document.createElement('div');
        svgContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position: absolute; overflow: hidden" color-interpolation-filters="sRGB"><defs id="liquid-glass-defs"></defs></svg>';
        document.body.appendChild(svgContainer);
    }
    const defs = document.getElementById('liquid-glass-defs');

    const heightFn = (x) => Math.pow(1 - Math.pow(1 - x, 4), 0.25);

    function calculateRefractionProfile(glassThickness, bezelWidth, heightFn, ior, samples) {
        samples = samples || 128;
        const eta = 1 / ior;
        function refract(nx, ny) {
            const dot = ny;
            const k = 1 - eta * eta * (1 - dot * dot);
            if (k < 0) return null;
            const sq = Math.sqrt(k);
            return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
        }
        const profile = new Float64Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = i / samples;
            const y = heightFn(x);
            const dx = x < 1 ? 0.0001 : -0.0001;
            const y2 = heightFn(x + dx);
            const deriv = (y2 - y) / dx;
            const mag = Math.sqrt(deriv * deriv + 1);
            const ref = refract(-deriv / mag, -1 / mag);
            if (!ref) {
                profile[i] = 0;
                continue;
            }
            profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
        }
        return profile;
    }

    function generateDisplacementMap(w, h, radius, bezelWidth, profile, maxDisp) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        const img = ctx.createImageData(w, h);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) { d[i] = 128; d[i + 1] = 128; d[i + 2] = 0; d[i + 3] = 255; }
        const r = radius, rSq = r * r, r1Sq = (r + 1) ** 2;
        const rBSq = Math.max(r - bezelWidth, 0) ** 2;
        const wB = w - r * 2, hB = h - r * 2, S = profile.length;
        for (let y1 = 0; y1 < h; y1++) {
            for (let x1 = 0; x1 < w; x1++) {
                const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
                const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
                const dSq = x * x + y * y;
                if (dSq > r1Sq || dSq < rBSq) continue;
                const dist = Math.sqrt(dSq);
                const fromSide = r - dist;
                const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
                if (op <= 0 || dist === 0) continue;
                const cos = x / dist, sin = y / dist;
                const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
                const disp = profile[bi] || 0;
                const dX = (-cos * disp) / maxDisp, dY = (-sin * disp) / maxDisp;
                const idx = (y1 * w + x1) * 4;
                d[idx] = (128 + dX * 127 * op + 0.5) | 0;
                d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
            }
        }
        ctx.putImageData(img, 0, 0);
        return c.toDataURL();
    }

    function generateSpecularMap(w, h, radius, bezelWidth, angle) {
        angle = angle != null ? angle : Math.PI / 3;
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        const img = ctx.createImageData(w, h);
        const d = img.data;
        d.fill(0);
        const r = radius, rSq = r * r, r1Sq = (r + 1) ** 2;
        const rBSq = Math.max(r - bezelWidth, 0) ** 2;
        const wB = w - r * 2, hB = h - r * 2;
        const sv = [Math.cos(angle), Math.sin(angle)];
        for (let y1 = 0; y1 < h; y1++) {
            for (let x1 = 0; x1 < w; x1++) {
                const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
                const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
                const dSq = x * x + y * y;
                if (dSq > r1Sq || dSq < rBSq) continue;
                const dist = Math.sqrt(dSq);
                const fromSide = r - dist;
                const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
                if (op <= 0 || dist === 0) continue;
                const cos = x / dist, sin = -y / dist;
                const dot = Math.abs(cos * sv[0] + sin * sv[1]);
                const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
                const coeff = dot * edge;
                const col = (255 * coeff) | 0;
                const alpha = (col * coeff * op) | 0;
                const idx = (y1 * w + x1) * 4;
                d[idx] = col; d[idx + 1] = col; d[idx + 2] = col; d[idx + 3] = alpha;
            }
        }
        ctx.putImageData(img, 0, 0);
        return c.toDataURL();
    }

    // Liquid Glass settings as provided
    const glassThick = 26;
    const bezelWidthOrigin = 60;
    const ior = 3.0;
    const scaleRatio = 1.00;
    const blurAmt = 0.3;
    const specOpacity = 0.50;
    const specSat = 4;

    function buildFilters() {
        requestAnimationFrame(() => {
            let defsHtml = '';
            document.querySelectorAll('.global-glass').forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                const w = Math.round(rect.width);
                const h = Math.round(rect.height);
                if (w < 2 || h < 2) return;
                
                const brStyle = window.getComputedStyle(el).getPropertyValue('--glass-radius');
                let radius = parseInt(brStyle) || 60;
                radius = Math.min(radius, w / 2, h / 2);

                const clampedBezel = Math.min(bezelWidthOrigin, radius, Math.min(w, h) / 2);
                
                const profile = calculateRefractionProfile(glassThick, clampedBezel, heightFn, ior, 64);
                const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
                const dispUrl = generateDisplacementMap(w, h, radius, clampedBezel, profile, maxDisp);
                const specUrl = generateSpecularMap(w, h, radius, clampedBezel * 2.5);
                const scale = maxDisp * scaleRatio;
                
                const filterId = 'lg-filter-' + index;
                el.style.setProperty('--filter-url', `url(#${filterId})`);
                
                defsHtml += `
                    <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="${blurAmt}" result="blurred_source" />
                        <feImage href="${dispUrl}" x="0" y="0" width="${w}" height="${h}" result="disp_map" />
                        <feDisplacementMap in="blurred_source" in2="disp_map" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                        <feColorMatrix in="displaced" type="saturate" values="${specSat}" result="displaced_sat" />
                        <feImage href="${specUrl}" x="0" y="0" width="${w}" height="${h}" result="spec_layer" />
                        <feComposite in="displaced_sat" in2="spec_layer" operator="in" result="spec_masked" />
                        <feComponentTransfer in="spec_layer" result="spec_faded">
                            <feFuncA type="linear" slope="${specOpacity}" />
                        </feComponentTransfer>
                        <feBlend in="spec_masked" in2="displaced" mode="normal" result="with_sat" />
                        <feBlend in="spec_faded" in2="with_sat" mode="normal" />
                    </filter>
                `;
            });
            defs.innerHTML = defsHtml;
        });
    }

    let rebuildTimer;
    window.addEventListener('resize', () => {
        clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(buildFilters, 200);
    });
    
    // Slight delay to ensure layout is done
    setTimeout(buildFilters, 100);
}