// Use GreenSock GSAP & ScrollTrigger for high performance animations
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Link Lenis scroll to GSAP
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// 2. Custom Cursor
const cursor = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    // using gsap for smoother custom cursor
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

// Add hover interactions via event delegation to support dynamically injected elements
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .planet, .content-logo-inner, .clickable-brand')) {
        gsap.to(cursor, { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.1)', duration: 0.3 });
    }
});
document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .planet, .content-logo-inner, .clickable-brand')) {
        gsap.to(cursor, { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.05)', duration: 0.3 });
    }
});

// Page Transition Loader Engine
const pageLoader = document.getElementById('page-transition-loader');
const loaderCanvas = document.getElementById('loader-canvas');
const loaderCtx = loaderCanvas ? loaderCanvas.getContext('2d') : null;

if (loaderCanvas) {
    loaderCanvas.width = 800; // High-res retina
    loaderCanvas.height = 800;
}

let isPageLoading = false;
let currentLoaderFrame = 0;

function drawLoaderLoop() {
    if (!isPageLoading) return;
    
    // We reuse sunImagesSeq which is preloaded in Phase 1.5!
    if (typeof sunImagesSeq !== 'undefined' && sunImagesSeq.length > 0) {
        const img = sunImagesSeq[Math.floor(currentLoaderFrame) % sunImagesSeq.length];
        if (img && img.complete && img.width > 0) {
            loaderCtx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
            const hRatio = loaderCanvas.width / img.width;
            const vRatio = loaderCanvas.height / img.height;
            const ratio = Math.min(hRatio, vRatio);
            const centerShift_x = (loaderCanvas.width - img.width * ratio) / 2;
            const centerShift_y = (loaderCanvas.height - img.height * ratio) / 2;
            loaderCtx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }
        currentLoaderFrame += 0.15; // Slowed down from 0.4 for a relaxed cinematic spin
    }
    requestAnimationFrame(drawLoaderLoop);
}

// Smooth Page Transition for Brand Clicks
document.addEventListener('click', (e) => {
    const clickable = e.target.closest('.clickable-brand');
    if (clickable) {
        const url = clickable.getAttribute('href');
        if (url && url !== '#') {
            e.preventDefault();
            
            // Activate Fullscreen Sequence Loader
            if (pageLoader) {
                isPageLoading = true;
                pageLoader.classList.add('active');
                drawLoaderLoop();
            }

            // Smoothly navigate after the animation has had time to visibly play
            gsap.to('#smooth-wrapper', { opacity: 0, duration: 0.5, ease: "power2.inOut", onComplete: () => {
                setTimeout(() => {
                    window.location.href = url;
                }, 800); // 800ms additional delay to relish the loading animation
            }});
        } else if (url === '#') {
            e.preventDefault(); // Do nothing if there's no link defined yet
        }
    }
});

// Recover state when returning via back button or bfcache
window.addEventListener('pageshow', (e) => {
    gsap.set('#smooth-wrapper', { opacity: 1 });
    if (pageLoader) {
        pageLoader.classList.remove('active');
        isPageLoading = false;
    }
});

// 3. Canvas Starfield/Particles Engine
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
for (let i = 0; i < 300; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.4 + 0.1,
        brightness: Math.random()
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();

        star.y -= star.speed;
        // Subtle twinkle effect
        star.brightness += (Math.random() - 0.5) * 0.05;
        star.brightness = Math.max(0.1, Math.min(1, star.brightness));

        if (star.y < 0) {
            star.y = canvas.height;
            star.x = Math.random() * canvas.width;
        }
    });
    requestAnimationFrame(drawStars);
}
drawStars();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 4. Global Brand Data
const brandsData = [
    { title: "Biyas Media Services", logo: "BIYAS MEDIA.svg", desc: "Pioneering spatial sound design.", url: "#" },
    { title: "Biyas Events", logo: "BIYAS EVENTS.svg", desc: "Elevating digital standards across the universe.", url: "#" },
    { title: "Boon Interior decor & carpentary", logo: "BOON.svg", desc: "Curating cinematic experiences for modern platforms.", url: "#" },
    { title: "Touch Gravity Contracting", logo: "TOUCH GRAVITY.svg", desc: "Enterprise solutions driven by futuristic design.", url: "#" },
    { title: "New era International Trading Est. Saudi", logo: "NEW ERA SAUDI.svg", desc: "Innovative leaps in artificial intelligence.", url: "#" },
    { title: "New era International Trading. Bahrain", logo: "NEW ERA BAHRAIN.svg", desc: "High-octane visual storytelling.", url: "#" },
    { title: "Muse art house", logo: "MUSE.svg", desc: "Pushing the boundaries of user engagement.", url: "#" },
    { title: "Fursa Online", logo: "FURSA.svg", desc: "Robust data architectures and spatial mapping.", url: "#" },
    { title: "My Jinan", logo: "MY JINAN.svg", desc: "Next-generation video streaming platforms.", url: "#" },
    { title: "Ceramic Pro", logo: "CERAMIC PRO.svg", desc: "Premium ceramic coatings and automotive protection.", url: "https://ceramicpro-bahrain.com/" }
];

// Generate Content Sections dynamically
const contentWrapper = document.getElementById('content-sections');
let sectionsHTML = '';
const dummyFeatures = ["Immersion", "Performance", "Aesthetics", "Durability", "Innovation", "Precision", "Dynamics", "Vision"];

brandsData.forEach((brand, i) => {
    const layoutType = i % 2 === 0 ? 'layout-a' : 'layout-b';
    
    let galleryCardsHTML = '';
    for (let j = 0; j < 4; j++) {
        galleryCardsHTML += `
            <div class="hover-rect">
                <div class="card-content">
                    <h4 class="card-label">Feature 0${j+1}</h4>
                    <h3 class="card-title">${dummyFeatures[j]}</h3>
                </div>
            </div>
        `;
    }

    let line1 = "";
    let line2 = "";
    let spread = false;

    if (brand.title === "My Jinan" || brand.title === "Ceramic Pro") {
        line1 = brand.title;
        line2 = "";
    } else if (brand.title.toLowerCase().startsWith("new era")) {
        line1 = "New era";
        line2 = brand.title.substring(8);
    } else if (brand.title === "Touch Gravity Contracting") {
        line1 = "Touch";
        line2 = "Gravity Contracting";
        spread = true;
    } else if (brand.title === "Muse art house") {
        line1 = "Muse";
        line2 = "art house";
        spread = true;
    } else if (brand.title === "Biyas Events") {
        line1 = "Biyas";
        line2 = "Events";
        spread = true;
    } else if (brand.title === "Biyas Media Services") {
        line1 = "Biyas";
        line2 = "Media Services";
        spread = true;
    } else {
        const titleWords = brand.title.split(' ');
        line1 = titleWords[0];
        line2 = titleWords.slice(1).join(' ');
    }

    let headingHTML = `<span class="heading-line-1 brand-text-gradient">${line1}</span>`;
    
    if (line2) {
        if (spread) {
            const charsHTML = line2.split('').map(c => c === ' ' ? '<span class="space-char">&nbsp;&nbsp;</span>' : `<span>${c}</span>`).join('');
            headingHTML += `<span class="heading-line-2 spread-letters brand-text-gradient">${charsHTML}</span>`;
        } else {
            headingHTML += `<span class="heading-line-2 brand-text-gradient">${line2}</span>`;
        }
    }

    sectionsHTML += `
        <div class="content-row ${layoutType}">
            <div class="content-logo">
                <a href="${brand.url || '#'}" class="content-logo-inner clickable-brand" style="text-align: center; display: block; cursor: pointer;"><img src="PUBLIC/images/all logos/${brand.logo}" alt="${brand.title}" class="content-logo-img" style="max-width: 100%; height: auto;"></a>
            </div>
            <div class="content-text">
                <h2 class="content-heading">${headingHTML}</h2>
                <div class="content-desc">
                    <p style="margin-bottom: 2rem;">${brand.desc}</p>
                </div>
                <div class="hover-gallery-wrapper">
                    ${galleryCardsHTML}
                </div>
            </div>
        </div>
    `;
});
contentWrapper.innerHTML += sectionsHTML;

// Note: Interactive Grid Galleries are now driven 100% by Performant CSS mechanics!

// 5. GSAP Animations & Triggers

// Phase 1: Hero Image Sequence
const heroCanvas = document.getElementById('hero-image-sequence');
const heroCtx = heroCanvas.getContext('2d');

const frameCount = 237;
const imagesSeq = [];
const imageObj = { frame: 0 };

const currentFrame = index => `PUBLIC/images/biyas media hero section/freepik_${(index + 1).toString().padStart(4, '0')}.png`;

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    imagesSeq.push(img);
}

function resizeHeroCanvas() {
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
    renderHeroFrame();
}

function renderHeroFrame() {
    const frameIndex = Math.round(imageObj.frame);
    if (!imagesSeq[frameIndex]) return;
    const img = imagesSeq[frameIndex];
    if (!img.complete) {
        img.onload = renderHeroFrame;
        return;
    }

    const hRatio = heroCanvas.width / img.width;
    const vRatio = heroCanvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (heroCanvas.width - img.width * ratio) / 2;
    const centerShift_y = (heroCanvas.height - img.height * ratio) / 2;

    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    heroCtx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

window.addEventListener('resize', resizeHeroCanvas);
imagesSeq[0].onload = resizeHeroCanvas;

const tlHero = gsap.timeline({
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true
    }
});

tlHero.to('.scroll-indicator', { opacity: 0, duration: 0.1 }, 0)
    .to(imageObj, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: renderHeroFrame,
        duration: 4
    }, 0)
    .to('#feature-1', { opacity: 1, scale: 1.05, duration: 0.5 }, 0.2)
    .to('#feature-1', { opacity: 0, scale: 0.95, duration: 0.5 }, 1.2)
    .to('#feature-2', { opacity: 1, scale: 1.05, duration: 0.5 }, 1.5)
    .to('#feature-2', { opacity: 0, scale: 0.95, duration: 0.5 }, 2.5)
    .to('#feature-3', { opacity: 1, scale: 1.05, duration: 0.5 }, 2.8)
    .to('#feature-3', { opacity: 0, scale: 0.95, duration: 0.5 }, 3.8);

// Globally preload Biyas Media Logo Sequence for both the Galaxy Sun and the Page Loader
const sunImagesSeq = []; // Shared sequence

// The new sequence consists of frames labeled from 1 to 74
for (let i = 1; i <= 74; i++) {
    const img = new Image();
    img.src = `PUBLIC/images/biyas media logo/GEAR WHITE-${i}.png`;
    sunImagesSeq.push(img);
}

// Global image sequence array remains for use heavily by the Page Transition Loader overlay.

// Phase 2: 3D Horizontal Carousel
// Use the global brandsData defined at the top

const track = document.getElementById('carousel-track');
let trackHTML = '';
brandsData.forEach((brand, i) => {
    let innerItem = `<a href="${brand.url || '#'}" class="clickable-brand" style="display:flex; justify-content:center; align-items:center; width:100%; height:100%; cursor:pointer;"><img src="PUBLIC/images/all logos/${brand.logo}" alt="${brand.title}" class="brand-logo-img" style="max-height: 160px; max-width: 350px;"></a>`;
    trackHTML += `<div class="carousel-item" id="carousel-item-${i}">${innerItem}</div>`;
});
track.innerHTML = trackHTML;

const items = gsap.utils.toArray('.carousel-item');
const radius = 650; // Expansive Layout Depth
const angleStep = 360 / items.length;

// Position items initially so they aren't stacked at 0,0 before scroll
items.forEach((item, i) => {
    const rawAngle = (i * angleStep);
    const rad = rawAngle * (Math.PI / 180);
    // Sin(rad) for X, Cos(rad) for Z
    gsap.set(item, {
        x: Math.sin(rad) * radius,
        z: Math.cos(rad) * radius,
        rotationX: 15, // Counter-rotate the 15deg track perspective tilt so logos face the camera flat!
        rotationY: 0 // Strict 2.5D un-rotated planes
    });
});

const tlCarousel = gsap.timeline({
    scrollTrigger: {
        trigger: ".carousel-section",
        start: "top top",
        end: "+=500%", // Restored previous speed
        scrub: 1, // Smooth inertia physics
        pin: true
    }
});

const totalRotation = -(360 - angleStep);
const proxy = { rotation: 0 };
let activeIndex = -1;

// Data structure to track focus animation state for each item independent of scroll timeline
const itemsFocus = items.map(() => ({ progress: 0 }));

function renderCarousel() {
    // 1. Determine which item, if any, is currently fully at the center gap zone
    let newActiveIndex = -1;
    
    // First pass loosely to just find active zone
    items.forEach((item, i) => {
        let rawAngle = (i * angleStep) + proxy.rotation;
        let worldAngle = rawAngle % 360;
        if (worldAngle > 180) worldAngle -= 360;
        if (worldAngle < -180) worldAngle += 360;
        
        // Decreased active zone to introduce gaps where NO item is popped up
        if (Math.abs(worldAngle) <= 10) {
            newActiveIndex = i;
        }
    });

    // Handle state handoffs cleanly
    if (newActiveIndex !== activeIndex) {
        let isInitial = (activeIndex === -1 && tlCarousel.progress() < 0.01);

        if (activeIndex !== -1) {
            gsap.to(itemsFocus[activeIndex], {
                progress: 0,
                duration: 0.6,
                ease: "power2.out",
                overwrite: true,
                onUpdate: renderCarousel
            });
        }
        
        if (newActiveIndex !== -1) {
            if (isInitial) {
                itemsFocus[newActiveIndex].progress = 1;
            } else {
                gsap.to(itemsFocus[newActiveIndex], {
                    progress: 1,
                    duration: 0.8,
                    ease: "back.out(1.5)",
                    overwrite: true,
                    onUpdate: renderCarousel
                });
            }
        }
        activeIndex = newActiveIndex;
    }



    // 3. Render Positions
    items.forEach((item, i) => {
        // Adding negative proxy moves the angle backwards mapping a true right-to-left anti-clockwise scrub
        let rawAngle = (i * angleStep) + proxy.rotation;

        // Normalize for active check
        let worldAngle = rawAngle % 360;
        if (worldAngle > 180) worldAngle -= 360;
        if (worldAngle < -180) worldAngle += 360;

        const rad = rawAngle * (Math.PI / 180);

        // Core continuous orbit math
        const rawX = Math.sin(rad) * radius;
        const rawY = 0;
        const rawZ = Math.cos(rad) * radius;

        // Target for focused item (snap to center, bring forward on Z)
        const targetX = 0;
        const targetY = -200; // Move UP to replace the title position
        const targetZ = radius + 150; 

        // Current focus animation linearly from 0 to 1 (with elastic overshoot out bound)
        let fp = itemsFocus[i].progress;

        // Mix continuous scroll positions with final popup target positions
        const finalX = rawX + (targetX - rawX) * fp;
        const finalY = rawY + (targetY - rawY) * fp;
        const finalZ = rawZ + (targetZ - rawZ) * fp;

        // Scale maps from 1.0 to 2.0 based on focus progression.
        // Because fp overshoots naturally due to ease: "back.out", the scale will smoothly bounce up to ~2.3 then settle to 2.0.
        const scale = 1 + 1.0 * fp;

        // Z-Index priority logic for focused elements popping out
        const normalizedZ = (rawZ + radius) / (2 * radius);
        const clampedZ = Math.max(0, Math.min(1, normalizedZ));
        const zIndexFloat = Math.round(clampedZ * 100) + (fp > 0.01 ? 1000 : 0);

        const opacity = gsap.utils.mapRange(0, 1, 0.4, 1, clampedZ);
        const blur = gsap.utils.mapRange(0, 1, 5, 0, clampedZ);
        const brightness = gsap.utils.mapRange(0.6, 1, 0.6, 1.6, Math.max(0.6, clampedZ));

        gsap.set(item, {
            x: finalX,
            y: finalY,
            z: finalZ,
            zIndex: zIndexFloat,
            rotationX: 15,
            scale: scale,
            opacity: opacity,
            filter: `blur(${blur}px) brightness(${brightness})`
        });
    });
}

tlCarousel.to(proxy, {
    rotation: totalRotation,
    ease: "power2.inOut", // Physics-based natural easing for start/stop loops
    duration: 1,
    onUpdate: renderCarousel
}, 0.1);

// Force update once to set initial transforms correctly based on depth
tlCarousel.progress(0.001);

// Phase 3: Content Sections Reveal (Autonomous Staggered Timeline)
gsap.utils.toArray('.content-row').forEach((row, i) => {
    const isLayoutA = row.classList.contains('layout-a');
    
    // Core Elements
    const logo = row.querySelector('.content-logo-inner');
    const heading = row.querySelector('.content-heading');
    const desc = row.querySelector('.content-desc');
    const gallery = row.querySelector('.hover-gallery-wrapper');

    gsap.set(row, { opacity: 1 });

    // Create a beautifully choreographed autonomous timeline
    const animTl = gsap.timeline({
        scrollTrigger: {
            trigger: row,
            start: "top 75%", // Triggers when the top of the element hits 75% down the viewport
            end: "bottom 25%", // Triggers when the bottom leaves the top of the 25% viewport
            toggleActions: "play reverse play reverse" // Play on enter, reverse on leave. Triggers on both up and down scrolling!
        }
    });

    // 2. Set Up Initial States Unseen
    gsap.set(logo, { x: isLayoutA ? -80 : 80, opacity: 0, scale: 0.95 });
    gsap.set(heading, { y: 50, opacity: 0 });
    gsap.set(desc, { y: 80, opacity: 0, filter: "blur(15px)" });
    gsap.set(gallery, { opacity: 0, x: isLayoutA ? 50 : -50 });

    // 3. Build Staggered Timeline Architecture
    animTl.to(logo, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.8,
        ease: "power3.out"
    })
    .to(heading, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
    }, 0.3)
    .to(desc, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power2.out"
    }, 0.5)
    .to(gallery, {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "power3.out"
    }, 0.7);

    // Unconditional subtle float
    gsap.to(logo, { y: "-=15", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
});

// 6. Ensure Background Music Autoplays on Interaction
const bgMusic = document.getElementById('bg-music');
if (bgMusic) {
    // Some browsers block autoplay. This guarantees it starts upon first engagement.
    bgMusic.volume = 0.5; // Optional: soft default volume for bg music

    // Trim first 10 seconds of background music
    bgMusic.addEventListener('loadedmetadata', () => {
        if (bgMusic.currentTime < 10) {
            bgMusic.currentTime = 10;
        }
    });

    // Custom loop ensuring we skip the first 10 seconds
    bgMusic.addEventListener('ended', () => {
        bgMusic.currentTime = 10;
        bgMusic.play();
    });

    const interactionEvents = ['click', 'keydown', 'touchstart', 'pointerdown', 'scroll', 'wheel'];
    
    const startMusic = () => {
        if (bgMusic.paused) {
            if (bgMusic.currentTime < 10) bgMusic.currentTime = 10;
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    interactionEvents.forEach(evt => document.removeEventListener(evt, startMusic));
                }).catch(error => {
                    console.log("Waiting for valid user interaction to play audio.", error);
                });
            }
        } else {
            interactionEvents.forEach(evt => document.removeEventListener(evt, startMusic));
        }
    };

    const attachAudioListeners = () => {
        interactionEvents.forEach(evt => document.addEventListener(evt, startMusic, { passive: true }));
    };

    attachAudioListeners();

    // Re-engage audio if user returns via the back button (bfcache restoration)
    window.addEventListener('pageshow', (e) => {
        if (bgMusic.paused) {
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    interactionEvents.forEach(evt => document.removeEventListener(evt, startMusic));
                }).catch(() => attachAudioListeners());
            } else {
                attachAudioListeners();
            }
        }
    });

    // Volume Control Toggle
    const soundToggleBtn = document.getElementById('sound-toggle');
    const iconUnmuted = document.getElementById('icon-unmuted');
    const iconMuted = document.getElementById('icon-muted');
    
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (bgMusic.muted || bgMusic.volume === 0) {
                bgMusic.muted = false;
                bgMusic.volume = 0.5; // restore default soft volume
                iconUnmuted.style.display = 'block';
                iconMuted.style.display = 'none';
                // Check if user turned it on before the first normal interaction
                if (bgMusic.paused) {
                    if (bgMusic.currentTime < 10) bgMusic.currentTime = 10;
                    const p = bgMusic.play();
                    if (p !== undefined) {
                        p.then(() => {
                            interactionEvents.forEach(evt => document.removeEventListener(evt, startMusic));
                        }).catch(() => {});
                    }
                }
            } else {
                bgMusic.muted = true;
                iconUnmuted.style.display = 'none';
                iconMuted.style.display = 'block';
            }
        });
    }
}

// 7. Responsive Side-by-Side Preview Engine
const isIframe = window.self !== window.top || window.location.search.includes('preview=true');
const launchPreviewBtn = document.getElementById('launch-preview-btn');
const exitPreviewBtn = document.getElementById('exit-preview-btn');
const previewWorkspace = document.getElementById('preview-workspace');

if (isIframe) {
    // We are inside an iframe snippet
    // 1. Hide the launch preview button to prevent infinite recursion
    if (launchPreviewBtn) launchPreviewBtn.style.display = 'none';
    
    // 2. Force Mute background music if it exists so audio doesn't overlap
    if (bgMusic) {
        bgMusic.muted = true;
        bgMusic.volume = 0;
        // Don't auto-play inside iframes
        bgMusic.pause();
    }
} else {
    // We are in the main host window
    if (launchPreviewBtn && previewWorkspace && exitPreviewBtn) {
        launchPreviewBtn.addEventListener('click', () => {
            // Show workspace securely over everything
            previewWorkspace.style.display = 'flex';
            
            // Build absolute URL for the iframe to ensure it behaves consistently
            const iframeUrl = window.location.pathname + window.location.hash + "?preview=true";

            // Set sources to initiate parsing of the desktop and mobile versions
            document.getElementById('iframe-desktop').src = iframeUrl;
            document.getElementById('iframe-mobile').src = iframeUrl;

            // Pause host audio while previewing if currently playing
            if (bgMusic && !bgMusic.paused) {
                bgMusic.pause();
                // We'll set a custom flag so we know we paused it
                window._wasAudioPlayingBeforePreview = true;
            }
        });

        exitPreviewBtn.addEventListener('click', () => {
            // Hide the workspace
            previewWorkspace.style.display = 'none';
            
            // Re-mount iframe sources to 'about:blank' memory release
            document.getElementById('iframe-desktop').src = '';
            document.getElementById('iframe-mobile').src = '';

            // Resume audio safely if it was playing
            if (bgMusic && window._wasAudioPlayingBeforePreview) {
                bgMusic.play().catch(() => {});
                window._wasAudioPlayingBeforePreview = false;
            }
        });
    }
}
