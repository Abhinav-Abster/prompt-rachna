document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript Linked Successfully!");
    
    const statusElement = document.getElementById('js-status');
    if (statusElement) {
        statusElement.textContent = "✅ JavaScript is successfully linked!";
        statusElement.style.color = "#4ade80";
        
        // Add a simple animation effect
        const card = document.getElementById('status-card');
        card.style.transform = "scale(1.05)";
        card.style.transition = "transform 0.3s ease";
        
        setTimeout(() => {
            card.style.transform = "scale(1)";
        }, 300);
    }
});
