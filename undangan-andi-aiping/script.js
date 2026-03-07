/**
 * Script for Wedding Invitation interactiveness
 * - Intersection Observer for smooth scroll revealing
 * - Form submission handler
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ======== SCROLL ANIMATION (Reveal specific elements when they become visible) ======== */
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before it hits the bottom
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once element is styled
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Select all elements that need to be animated
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => scrollObserver.observe(el));

    /* ======== RSVP FORM HANDLER ======== */
    const rsvpForm = document.getElementById('rsvpForm');
    const alertMessage = document.getElementById('alertMessage');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect form data if needed here
            const name = document.getElementById('name').value;
            const attendance = document.getElementById('attendance').value;
            const pax = document.getElementById('pax').value;
            const message = document.getElementById('message').value;

            // Simulated logic: Show success alert
            alertMessage.classList.remove('hidden');

            // Optionally clear the form
            this.reset();

            // Hide the alert after 5 seconds
            setTimeout(() => {
                alertMessage.classList.add('hidden');
            }, 5000);

            console.log(`RSVP Submitted: ${name}, Attending: ${attendance}, Pax: ${pax}, Message: ${message}`);
        });
    }

    /* ======== SMOOTH SCROLLING FOR INTERNAL LINKS ======== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ======== AUDIO & COVER LOGIC ======== */
    const welcomeCover = document.getElementById('welcomeCover');
    const openInvitationBtn = document.getElementById('openInvitation');
    const bgMusic = document.getElementById('bgMusic');
    const audioBtn = document.getElementById('audioBtn');
    const audioIcon = audioBtn ? audioBtn.querySelector('i') : null;
    let isPlaying = false;

    // Open Invitation Button Click
    if (openInvitationBtn && welcomeCover) {
        openInvitationBtn.addEventListener('click', () => {
            // Hide cover
            welcomeCover.classList.add('slide-up');

            // Allow scrolling again
            document.body.classList.remove('locked-scroll');

            // Play music (this requires user interaction which we just got)
            if (bgMusic) {
                // Must call load() in Safari iOS before play() inside user interaction callback
                bgMusic.load();
                bgMusic.play().then(() => {
                    isPlaying = true;
                }).catch(err => {
                    console.log("Auto-play prevented by browser:", err);
                });
            }
        });
    }

    // Audio Play/Pause Toggle
    if (audioBtn && bgMusic) {
        audioBtn.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                audioBtn.classList.add('paused');
                if (audioIcon) {
                    audioIcon.classList.remove('fa-compact-disc');
                    audioIcon.classList.add('fa-play');
                }
            } else {
                bgMusic.play();
                audioBtn.classList.remove('paused');
                if (audioIcon) {
                    audioIcon.classList.remove('fa-play');
                    audioIcon.classList.add('fa-compact-disc');
                }
            }
            isPlaying = !isPlaying;
        });
    }

    /* ======== COPY TO CLIPBOARD ======== */
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const numberToCopy = this.getAttribute('data-number');

            // Use Clipboard API if available
            if (navigator.clipboard) {
                navigator.clipboard.writeText(numberToCopy).then(() => {
                    showToast();
                }).catch(err => {
                    console.error('Failed to copy!', err);
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = numberToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast();
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }
                document.body.removeChild(textArea);
            }
        });
    });

    function showToast() {
        if (!toast) return;
        toast.classList.remove('hidden');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

});
