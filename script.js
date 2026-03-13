document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript Linked Successfully!");

    const statusElement = document.getElementById('js-status');
    if (statusElement) {
        statusElement.textContent = "✅ JavaScript & GSAP are successfully linked!";
        statusElement.style.color = "#4ade80";

        // GSAP Entrance Animations
        gsap.from("h1", {
            duration: 1.2,
            y: -50,
            opacity: 0,
            ease: "power3.out"
        });

        gsap.from(".container p", {
            duration: 1,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 0.3
        });

        gsap.from("#status-card", {
            duration: 0.8,
            scale: 0.8,
            opacity: 0,
            ease: "back.out(1.7)",
            delay: 0.6
        });
    }
});
