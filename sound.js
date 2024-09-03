document.addEventListener('DOMContentLoaded', () => {
    const image = document.querySelector('.background');
    const audio = document.getElementById('feinn');

    console.log(image, audio);

    image.addEventListener('mouseenter', () => {
        audio.play();
    });
    image.addEventListener('mouseleave', () => {
        audio.pause();
        audio.currentTime = 0;
    });
});

const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
const img = document.getElementById('partyImage');

let confetti = [];
const colors = ['#ff0a54', '#ff477e', '#ff85a1', '#fbb1bd', '#fbb1bd', '#ffccd5'];
let fireworks = [];
let flames = [];
let animationId;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function ConfettiPiece() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.r = Math.random() * 6 + 4;
    this.d = Math.random() * 20 + 10;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.tilt = Math.random() * 10 - 10;

    this.draw = function () {
        ctx.beginPath();
        ctx.lineWidth = this.r / 2;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt, this.y);
        ctx.lineTo(this.x + this.tilt + this.r / 2, this.y + this.r / 2);
        ctx.stroke();
    };

    this.update = function () {
        this.y += Math.cos(this.d) + 1 + this.r / 2;
        this.x += Math.sin(0);
        this.tilt += Math.sin(this.d) * 0.5;

        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
            this.tilt = Math.random() * 10 - 10;
        }
    };
}

function Firework(x, y) {
    this.x = x;
    this.y = y;
    this.sparks = [];

    for (let i = 0; i < 100; i++) {
        this.sparks.push(new Spark(this.x, this.y));
    }

    this.draw = function () {
        this.sparks.forEach(spark => spark.draw());
    };
}

function Spark(x, y) {
    this.x = x;
    this.y = y;
    this.angle = Math.random() * 40 * Math.PI;
    this.speed = Math.random() * 1 + 1;
    this.radius = Math.random() * 1 + 1;
    this.opacity = 1;
    this.decay = Math.random() * 0.000001 + 0.000001;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();

        this.update();
    };

    this.update = function () {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= this.decay;
        if (this.opacity < 0) {
            this.opacity = 0;
        }
    };
}

function Flame(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 1 + 1;
    this.alpha = 2;
    this.vx = (Math.random() - 1) * 1;
    this.vy = Math.random() * -2 - 2;
    this.color = `rgba(255, ${Math.random() * 150 + 100}, 0, ${this.alpha})`;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        this.update();
    };

    this.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01;
        if (this.alpha <= 0) {
            this.alpha = 0;
        }
        this.color = `rgba(255, ${Math.random() * 150 + 100}, 0, ${this.alpha})`;
    };
}

function drawEffects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < confetti.length; i++) {
        confetti[i].update();
        confetti[i].draw();
    }

    fireworks.forEach((firework, index) => {
        firework.draw();
        if (firework.sparks.every(spark => spark.opacity === 0)) {
            fireworks.splice(index, 1);
        }
    });

    flames.forEach((flame, index) => {
        flame.draw();
        if (flame.alpha <= 0) {
            flames.splice(index, 1);
        }
    });

    animationId = requestAnimationFrame(drawEffects);
}

for (let i = 0; i < 150; i++) {
    confetti.push(new ConfettiPiece());
}

img.addEventListener('mouseover', () => {
    canvas.style.display = 'block';

    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height / 2;
        fireworks.push(new Firework(x, y));
    }

    for (let i = 0; i < 30; i++) {
        const x = canvas.width / 2;
        const y = canvas.height - 50;
        flames.push(new Flame(x, y));
    }

    drawEffects();
});

img.addEventListener('mouseout', () => {
    cancelAnimationFrame(animationId);
    canvas.style.display = 'none';
});
