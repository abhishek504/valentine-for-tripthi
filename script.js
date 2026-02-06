// Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionCard = document.getElementById('questionCard');
const celebration = document.getElementById('celebration');
const heartsContainer = document.getElementById('heartsContainer');

// Create floating hearts background
function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '❤️', '💘'];
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 6 + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heartsContainer.appendChild(heart);
    }
}

// Make the "No" button run away!
let noClickCount = 0;
const funnyTexts = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Pretty please?",
    "With a cherry on top?",
    "I'll be sad 😢",
    "You're breaking my heart!",
    "Just say yes!",
    "Come on!",
    "Fine... wait, no!",
    "❤️ Please? ❤️"
];

noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('click', handleNoClick);

function moveButton() {
    const card = questionCard.getBoundingClientRect();
    const btn = noBtn.getBoundingClientRect();
    
    // Calculate new random position within the card
    const maxX = card.width - btn.width - 40;
    const maxY = 100;
    
    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;
    
    noBtn.style.position = 'relative';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Update text
    noClickCount = Math.min(noClickCount + 1, funnyTexts.length - 1);
    noBtn.textContent = funnyTexts[noClickCount];
    
    // Make yes button bigger each time
    const scale = 1 + (noClickCount * 0.1);
    yesBtn.style.transform = `scale(${scale})`;
}

function handleNoClick() {
    moveButton();
}

// Handle Yes click
yesBtn.addEventListener('click', () => {
    // Hide question card
    questionCard.classList.add('hidden');
    
    // Show celebration
    celebration.classList.remove('hidden');
    
    // Start fireworks
    startFireworks();
    
    // Create confetti
    createConfetti();
    
    // Add more floating hearts
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createConfetti(), i * 100);
    }
});

function createConfetti() {
    const confettiEmojis = ['🎉', '💖', '💕', '🎊', '✨', '💝', '🌹', '💗', '❤️'];
    
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Fireworks Animation
function startFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fireworks = [];
    const particles = [];
    const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ffb6c1', '#ffd700', '#ff6347', '#ffffff'];
    
    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.5;
            this.speed = 8 + Math.random() * 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.trail = [];
        }
        
        update() {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 5) this.trail.shift();
            
            this.y -= this.speed;
            
            if (this.y <= this.targetY) {
                this.explode();
                return false;
            }
            return true;
        }
        
        explode() {
            const particleCount = 80 + Math.floor(Math.random() * 40);
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 / particleCount) * i;
                const speed = 2 + Math.random() * 4;
                particles.push(new Particle(this.x, this.y, angle, speed, this.color));
            }
        }
        
        draw() {
            // Draw trail
            this.trail.forEach((pos, i) => {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${i / this.trail.length * 0.5})`;
                ctx.fill();
            });
            
            // Draw firework
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    class Particle {
        constructor(x, y, angle, speed, color) {
            this.x = x;
            this.y = y;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.color = color;
            this.alpha = 1;
            this.decay = 0.015 + Math.random() * 0.01;
            this.size = 2 + Math.random() * 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.05; // gravity
            this.alpha -= this.decay;
            return this.alpha > 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Random new fireworks
        if (Math.random() < 0.08) {
            fireworks.push(new Firework());
        }
        
        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].draw();
            if (!fireworks[i].update()) {
                fireworks.splice(i, 1);
            }
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].draw();
            if (!particles[i].update()) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Launch initial fireworks
    for (let i = 0; i < 5; i++) {
        setTimeout(() => fireworks.push(new Firework()), i * 300);
    }
    
    animate();
}

// Initialize
createFloatingHearts();
