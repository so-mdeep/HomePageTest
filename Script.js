
    document.addEventListener('DOMContentLoaded', function () {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // ---------- Sun Position Scroll Animation ----------
        function updateSunPosition() {
            const sun = document.getElementById("sun");
            const overlay = document.getElementById("overlay");
            const triggerElement = document.getElementById("yourTriggerElementId");

            const sunMinY = 0, sunMaxY = 100;
            const sunStart = triggerElement ? triggerElement.offsetTop : 0;
            const sunEnd = document.body.scrollHeight - window.innerHeight;
            const scrollY = window.scrollY;

            const sunProgress = Math.min(Math.max((scrollY - sunStart) / (sunEnd - sunStart), 0), 1);
            const sunTranslateY = sunMinY + (sunMaxY - sunMinY) * sunProgress;
            if (sun) sun.style.transform = `translate(-50%, ${sunTranslateY}px)`;

            const minOpacity = 0.1, maxOpacity = 0.5;
            const overlayOpacity = minOpacity + (maxOpacity - minOpacity) * sunProgress;
            if (overlay) overlay.style.opacity = overlayOpacity;
        }

        updateSunPosition();
        window.addEventListener("scroll", updateSunPosition);
        window.addEventListener("resize", updateSunPosition);

        // ---------- Fade-in Elements on Scroll ----------
        const fadeDivs = document.querySelectorAll('.fade-div');
        function checkVisibility() {
            fadeDivs.forEach(div => {
                const rect = div.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const isVisible = rect.top <= windowHeight * 0.75 && rect.bottom >= windowHeight * 0.75;
                div.style.opacity = isVisible ? '1' : '0.1';
            });
        }
        checkVisibility();
        let isScrolling;
        window.addEventListener('scroll', () => {
            clearTimeout(isScrolling);
            isScrolling = setTimeout(checkVisibility, 50);
        });

        // ---------- Anchor Visibility Observer ----------
        const anchor = document.querySelector('.Anchor');
        const footer = document.querySelector('.Footer');
        if (anchor) anchor.classList.add('anchor-opacity-transition');
        if (footer) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    document.body.classList.toggle('footer-in-view', entry.isIntersecting);
                });
            }, { threshold: 0.1 });
            observer.observe(footer);
        }

        // ---------- Sea Phase 3-Way Sinusoidal Transition ----------
        const sea1 = document.getElementById('SeaPhase1');
        const sea2 = document.getElementById('SeaPhase2');
        const sea3 = document.getElementById('SeaPhase3');
        const isWideScreen = window.innerWidth >= 768;
        const isNotMobileGPU = (() => {
            const gl = document.createElement('canvas').getContext('webgl');
            if (!gl) return false;
            const info = gl.getExtension('WEBGL_debug_renderer_info');
            const renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "";
            return !/mali|adreno|powervr|apple|mobile/i.test(renderer);
        })();

        if (sea1 && sea2 && sea3 && isWideScreen && isNotMobileGPU) {
            let t = 0;
            function animateSea() {
                const sin = [Math.sin(t), Math.sin(t + 2 * Math.PI / 3), Math.sin(t + 4 * Math.PI / 3)];
                const opacities = sin.map(s => 0 + 1 * ((s + 1) / 2));
                sea1.style.opacity = opacities[0];
                sea2.style.opacity = opacities[1];
                sea3.style.opacity = opacities[2];
                t += 0.07;
                requestAnimationFrame(animateSea);
            }
            animateSea();
        }

        // ---------- Click Animation (Always Works) ----------
const clickAnim = lottie.loadAnimation({
    container: document.getElementById("lottie-container3"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "Clicked.json"
});

document.querySelector(".HeroIMG").addEventListener("click", () => {
    // Reset animation
    clickAnim.stop();

    // Show container via opacity
    const lottie3 = document.getElementById("lottie-container3");
    lottie3.style.opacity = "1";

    // Allow clicks if needed
    lottie3.style.pointerEvents = "auto";

    // Play animation
    clickAnim.play();
});

clickAnim.addEventListener("complete", () => {
    const lottie3 = document.getElementById("lottie-container3");

    // Hide again with opacity
    lottie3.style.opacity = "0";

    // Disable pointer events after hiding
    lottie3.style.pointerEvents = "none";
});

        // ---------- DESKTOP ONLY ----------
        if (!isTouchDevice) {
            // Blink animation (base)
            lottie.loadAnimation({
                container: document.getElementById("lottie-container"),
                renderer: "svg",
                loop: true,
                autoplay: true,
                path: "BlinkMask.json"
            });

            // Hover animation
            const hoverAnim = lottie.loadAnimation({
                container: document.getElementById("lottie-container2"),
                renderer: "svg",
                loop: false,
                autoplay: false,
                path: "Shocked.json"
            });

            const hero = document.querySelector(".HeroIMG");
            hero.addEventListener("mouseenter", () => hoverAnim.play());
            hero.addEventListener("mouseleave", () => hoverAnim.stop());

            // Eye Tracking
            const rotators = document.querySelectorAll('.Rotator');
            if (rotators.length > 0) {
                let lastAngle = 0;
                document.addEventListener('mousemove', (e) => {
                    const rect = rotators[0].getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                    let newAngle = (angleRad * 180 / Math.PI) % 360;
                    let angleDiff = ((newAngle - lastAngle % 360) + 540) % 360 - 180;
                    lastAngle += angleDiff * 0.2;
                    rotators.forEach(rotator => {
                        rotator.style.transform = `rotate(${lastAngle}deg)`;
                    });
                });
            }
        } else {
            // ---------- MOBILE ----------
            const lottieContainer = document.getElementById("lottie-container");
            const lottieContainer2 = document.getElementById("lottie-container2");
            if (lottieContainer) lottieContainer.remove();
            if (lottieContainer2) lottieContainer2.remove();

            const mobileFace = document.getElementById("lottie-mobile-face");
            if (mobileFace) {
                lottie.loadAnimation({
                    container: mobileFace,
                    renderer: "svg",
                    loop: true,
                    autoplay: true,
                    path: "MobileLoopingFace.json"
                });
                mobileFace.style.opacity = "1";
            }

            // Hide eyes
            const eyeR = document.getElementById("EyeR");
            const eyeL = document.getElementById("EyeL");
            if (eyeR) eyeR.style.display = "none";
            if (eyeL) eyeL.style.display = "none";
        }
    });
    // ---------- Always-visible Bird Animation ----------
lottie.loadAnimation({
    container: document.getElementById("lottie-containerBird"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "BirdsLeftToRight.json" // ✅ Replace with your actual file name
});

    // ---------- Always-visible Bird Animation ----------
lottie.loadAnimation({
    container: document.getElementById("lottie-containerBird2"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "Birds Project Inverted Story.json" // ✅ Replace with your actual file name
});