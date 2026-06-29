const planetData = {
    moon: {
        name: "Moon",
        image: "assets/moon.png",
        description: "See our planet as you’ve never seen it before. A perfect relaxing trip away to help regain perspective and come back refreshed. While you’re there, take in some history by visiting the Luna 2 and Apollo 11 landing sites.",
        distanceNum: 384400,
        distanceSuffix: " KM",
        travelNum: 3,
        travelSuffix: " DAYS"
    },
    mars: {
        name: "Mars",
        image: "assets/mars.png",
        description: "Don’t forget your walking boots. You’ll need them to tackle Olympus Mons, the tallest planetary mountain in our solar system. It’s two and a half times the size of Everest!",
        distanceNum: 225,
        distanceSuffix: " MIL. KM",
        travelNum: 9,
        travelSuffix: " MONTHS"
    },
    earth: {
        name: "Earth",
        image: "assets/earth.png",
        description: "Our beautiful vibrant home. Packed with rich oceans, diverse landscapes, and bustling cities, it remains the ultimate gold standard destination for any traveler looking for a slice of paradise.",
        distanceNum: 0,
        distanceSuffix: " KM",
        travelNum: 0,
        travelSuffix: " DAYS"
    },
    jupiter: {
        name: "Jupiter",
        image: "assets/jupiter.png",
        description: "The king of planets. Jupiter is a magnificent gas giant famed for its iconic Great Red Spot—a storm larger than Earth itself—offering a truly breathtaking sights from orbit.",
        distanceNum: 628,
        distanceSuffix: " MIL. KM",
        travelNum: 3,
        travelSuffix: " YEARS"
    }
};

const buttons = document.querySelectorAll('.planet-btn');
const planetWrapper = document.getElementById('planet-wrapper');
const planetImg = document.getElementById('planet-img');
const planetName = document.getElementById('planet-name');
const planetDesc = document.getElementById('planet-description');
const planetDist = document.getElementById('planet-distance');
const planetTravel = document.getElementById('planet-travel');
const textNodes = document.querySelectorAll('.text-animate-node');

// Modal Elements
const planetModal = document.getElementById('planet-modal');
const modalTitle = document.getElementById('modal-title');
const modalTargetImg = document.getElementById('modal-target-img');
const modalClose = document.getElementById('modal-close');

function animateCounter(element, targetValue, suffix) {
    const duration = 1000; 
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime >= duration) {
            element.innerText = targetValue.toLocaleString() + suffix;
        } else {
            const progress = elapsedTime / duration;
            const currentValue = Math.floor(progress * targetValue);
            element.innerText = currentValue.toLocaleString() + suffix;
            requestAnimationFrame(updateNumber);
        }
    }
    requestAnimationFrame(updateNumber);
}

// OPEN MODAL
planetImg.addEventListener('click', () => {
    modalTargetImg.src = planetImg.src;
    modalTargetImg.alt = planetImg.alt;
    modalTitle.innerText = planetName.innerText;
    planetModal.classList.add('modal-open');
});

// CLOSE MODAL
modalClose.addEventListener('click', () => {
    planetModal.classList.remove('modal-open');
});

planetModal.addEventListener('click', (e) => {
    if(e.target === planetModal) {
        planetModal.classList.remove('modal-open');
    }
});

// NAVIGATION CORE
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if(button.classList.contains('active')) return;

        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const targetPlanet = button.getAttribute('data-planet');
        const data = planetData[targetPlanet];
        const isMobile = window.innerWidth <= 900;

        if (isMobile) {
            planetWrapper.classList.add('leave-left');
        } else {
            planetWrapper.classList.add('leave-up');
        }
        textNodes.forEach(node => node.classList.add('leaving'));

        setTimeout(() => {
            planetImg.src = data.image;
            planetImg.alt = data.name;
            planetName.innerText = data.name;
            planetDesc.innerText = data.description;

            animateCounter(planetDist, data.distanceNum, data.distanceSuffix);
            animateCounter(planetTravel, data.travelNum, data.travelSuffix);

            planetWrapper.classList.remove('leave-left', 'leave-up');
            
            if (isMobile) {
                planetWrapper.classList.add('enter-right');
            } else {
                planetWrapper.classList.add('enter-bottom');
            }

            setTimeout(() => {
                planetWrapper.classList.remove('enter-right', 'enter-bottom');
                textNodes.forEach(node => node.classList.remove('leaving'));
            }, 50);

        }, 800); 
    });
});

// ==========================================
// --- INTERACTIVE SPACE STARFIELD ENGINE ---
// ==========================================
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let starsArray = [];
const numberOfStars = 350; // Perfect visual density balance
const mouseCoordinate = { x: null, y: null, radius: 30 }; // Radius threshold for star avoidance tracking

// Re-adjust window bounds dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}
window.addEventListener('resize', resizeCanvas);

// Watch cursor positioning
window.addEventListener('mousemove', (event) => {
    mouseCoordinate.x = event.x;
    mouseCoordinate.y = event.y;
});

// Reset positioning if cursor exits window frame entirely
window.addEventListener('mouseout', () => {
    mouseCoordinate.x = null;
    mouseCoordinate.y = null;
});

// Star blueprint structure
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2.2 + 0.4; // Star variation thicknesses
        this.density = (Math.random() * 30) + 10; // Physics vector speed weights
        this.driftSpeedX = (Math.random() * 0.12) - 0.06; // Slow directional cosmic drift speeds
        this.driftSpeedY = (Math.random() * 0.12) - 0.06;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.6})`; // Organic live twinkling effect
        ctx.fill();
    }

    update() {
        // Continuous slow spatial drift
        this.baseX += this.driftSpeedX;
        this.baseY += this.driftSpeedY;

        // Wrap around boundaries if drifting out of the screen layout window
        if (this.baseX < 0) this.baseX = canvas.width;
        if (this.baseX > canvas.width) this.baseX = 0;
        if (this.baseY < 0) this.baseY = canvas.height;
        if (this.baseY > canvas.height) this.baseY = 0;

        // Interactive mouse pointer repulsion math tracking
        if (mouseCoordinate.x != null && mouseCoordinate.y != null) {
            let dx = mouseCoordinate.x - this.x;
            let dy = mouseCoordinate.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseCoordinate.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouseCoordinate.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                this.x -= directionX;
                this.y -= directionY;
                return; // Skips default tracking loops while interactive force overrides it
            }
        }

        // Return smoothly to baseline orbits if pointer leaves neighborhood parameters
        if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 15;
        }
        if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 15;
        }
    }
}

function initStars() {
    starsArray = [];
    for (let i = 0; i < numberOfStars; i++) {
        starsArray.push(new Star());
    }
}

// Global Animation Execution loop
function animateStarfield() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < starsArray.length; i++) {
        starsArray[i].update();
        starsArray[i].draw();
    }
    requestAnimationFrame(animateStarfield);
}

// Initialize on runtime
resizeCanvas();
animateStarfield();