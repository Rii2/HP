// 和風・可愛い忍者道場ゲーム
document.addEventListener('DOMContentLoaded', function() {
    // ニンジャカードのクリックイベント
    const ninjaCards = document.querySelectorAll('.ninja-card');
    ninjaCards.forEach(card => {
        card.addEventListener('click', function() {
            const ninjaName = this.dataset.ninja;
            showNinjaModal(ninjaName);
            createSakuraEffect(this);
        });
    });

    // 桜エフェクト
    function createSakuraEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            const sakura = document.createElement('div');
            sakura.innerHTML = '🌸';
            sakura.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: ${12 + Math.random() * 8}px;
                pointer-events: none;
                z-index: 1000;
                animation: sakura-burst 2s ease-out forwards;
            `;

            const angle = (i / 12) * 2 * Math.PI;
            const velocity = 80 + Math.random() * 80;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            sakura.style.setProperty('--vx', vx + 'px');
            sakura.style.setProperty('--vy', vy + 'px');

            document.body.appendChild(sakura);

            setTimeout(() => sakura.remove(), 2000);
        }
    }

    // モーダル表示
    function showNinjaModal(ninjaName) {
        const existingModal = document.querySelector('.ninja-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'ninja-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-close">&times;</div>
                <h2>🌸 ${ninjaName}の秘密 🌸</h2>
                <div class="ninja-details">
                    <p>${getNinjaDescription(ninjaName)}</p>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center;
            align-items: center; z-index: 2000; animation: modal-fade-in 0.3s ease-out;
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.animation = 'modal-fade-out 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'modal-fade-out 0.3s ease-out';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    function getNinjaDescription(name) {
        const descriptions = {
            'サクヤ': '桜の花びらと共に時を操る美しい忍者。春の訪れと共に現れ、時の流れを自在に操ります。🌸',
            'ジャノメ': '蝶のように優雅に舞い踊る忍者。美しい羽根で敵を惑わし、花の蜜のような甘い術を使います。🦋',
            'ジン': '風と共に駆け抜ける忍者。そよ風のように優しく、嵐のように激しい二面性を持ちます。💨',
            'シオン': '紫の炎を操る神秘的な忍者。美しい紫の炎は見る者を魅了し、心を癒やす力があります。💜',
            'シャオラン': '雷鳴と共に現れる電撃忍者。稲妻の速さで移動し、雷の力で仲間を守ります。⚡',
            'ネム': '夢の世界の案内人。優しい眠りを誘い、美しい夢を見せてくれる癒やし系忍者です。😴',
            'ハヤテ': '疾風のように素早い忍者。風の刃で敵を倒し、仲間のピンチに駆けつけます。🌪️',
            'ユイ': '絆の力を操る忍者。仲間との結びつきを大切にし、愛の力で強力な結界を張ります。🎀',
            'レイ': '霊と心を通わせる神秘的な忍者。優しい霊たちと共に戦い、迷子の魂を導きます。👻',
            'ロトン': '温かな炎を操る忍者。心を温める優しい炎で、みんなを笑顔にしてくれます。🔥'
        };
        return descriptions[name] || 'クリプトニンジャの世界で活躍する可愛い忍者です。';
    }

    // ゲーム初期化
    setTimeout(() => {
        if (document.getElementById('gameCanvas')) {
            game = new Game();
        }
    }, 100);
});

// 和風ゲームクラス
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        
        this.player = new Player(100, 300);
        this.enemies = [];
        this.sakuras = [];
        this.particles = [];
        
        this.backgroundX = 0;
        this.scrollSpeed = 2;
        this.enemySpawnTimer = 0;
        this.sakuraSpawnTimer = 0;
        
        this.playerImage = new Image();
        this.playerImage.src = 'ちびサクヤ（GIF）_02.png';
        
        this.setupEventListeners();
        this.setupUI();
    }
    
    setupEventListeners() {
        this.keys = {};
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.player.jump();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        document.getElementById('startGame').addEventListener('click', () => this.start());
        document.getElementById('pauseGame').addEventListener('click', () => this.togglePause());
    }
    
    setupUI() {
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.startButton = document.getElementById('startGame');
        this.pauseButton = document.getElementById('pauseGame');
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            this.reset();
            this.startButton.style.display = 'none';
            this.pauseButton.style.display = 'block';
            this.gameLoop();
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseButton.textContent = this.isPaused ? '🥷 再開' : '⏸️ 休憩';
        if (!this.isPaused) this.gameLoop();
    }
    
    reset() {
        this.score = 0;
        this.lives = 3;
        this.player.reset();
        this.enemies = [];
        this.sakuras = [];
        this.particles = [];
        this.backgroundX = 0;
        this.enemySpawnTimer = 0;
        this.sakuraSpawnTimer = 0;
        this.updateUI();
    }
    
    gameLoop() {
        if (!this.isRunning || this.isPaused) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.player.update(this.keys);
        
        this.backgroundX -= this.scrollSpeed;
        if (this.backgroundX <= -this.canvas.width) this.backgroundX = 0;
        
        // 敵のスポーン
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer > 150) {
            this.enemies.push(new Enemy(this.canvas.width, 320));
            this.enemySpawnTimer = 0;
        }
        
        // 桜のスポーン
        this.sakuraSpawnTimer++;
        if (this.sakuraSpawnTimer > 120) {
            this.sakuras.push(new Sakura(this.canvas.width, 200 + Math.random() * 150));
            this.sakuraSpawnTimer = 0;
        }
        
        // 敵の更新
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.x < -enemy.width) {
                this.enemies.splice(index, 1);
            }
            if (this.checkCollision(this.player, enemy)) {
                this.playerHit();
                this.enemies.splice(index, 1);
            }
        });
        
        // 桜の更新
        this.sakuras.forEach((sakura, index) => {
            sakura.update();
            if (sakura.x < -sakura.width) {
                this.sakuras.splice(index, 1);
            }
            if (this.checkCollision(this.player, sakura)) {
                this.collectSakura();
                this.sakuras.splice(index, 1);
            }
        });
        
        // パーティクルの更新
        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.sakuras.forEach(sakura => sakura.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
    }
    
    drawBackground() {
        // 和風背景
        this.ctx.fillStyle = 'rgba(255, 192, 203, 0.3)';
        for (let i = 0; i < 3; i++) {
            const x = (this.backgroundX + i * 300) % (this.canvas.width + 100);
            this.drawMountain(x, 200 + i * 20);
        }
        
        // 地面
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, 350, this.canvas.width, 50);
    }
    
    drawMountain(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + 100);
        this.ctx.lineTo(x + 50, y);
        this.ctx.lineTo(x + 100, y + 100);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    playerHit() {
        this.lives--;
        this.createHitEffect();
        if (this.lives <= 0) this.gameOver();
        this.updateUI();
    }
    
    collectSakura() {
        this.score += 100;
        this.createSakuraEffect();
        this.updateUI();
    }
    
    createHitEffect() {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2,
                '#ff6b6b'
            ));
        }
    }
    
    createSakuraEffect() {
        for (let i = 0; i < 6; i++) {
            this.particles.push(new Particle(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2,
                '#FFB6C1'
            ));
        }
    }
    
    gameOver() {
        this.isRunning = false;
        this.startButton.textContent = '🥷 再挑戦';
        this.startButton.style.display = 'block';
        this.pauseButton.style.display = 'none';
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '36px "Noto Sans JP"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🌸 修行完了 🌸', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        this.ctx.font = '20px "Noto Sans JP"';
        this.ctx.fillText(`最終得点: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.velocityY = 0;
        this.isGrounded = false;
        this.groundY = 290;
        this.jumpPower = -15;
        this.gravity = 0.8;
        this.speed = 5;
    }
    
    update(keys) {
        if (keys['ArrowLeft'] && this.x > 0) this.x -= this.speed;
        if (keys['ArrowRight'] && this.x < 740) this.x += this.speed;
        
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }
    }
    
    jump() {
        if (this.isGrounded) {
            this.velocityY = this.jumpPower;
            this.isGrounded = false;
        }
    }
    
    draw(ctx) {
        if (game.playerImage.complete) {
            ctx.drawImage(game.playerImage, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#FFB6C1';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.ellipse(this.x + this.width / 2, 360, this.width / 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    reset() {
        this.x = 100;
        this.y = this.groundY;
        this.velocityY = 0;
        this.isGrounded = true;
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
        this.speed = 3;
    }
    
    update() {
        this.x -= this.speed;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
        ctx.fillRect(this.x + 21, this.y + 8, 6, 6);
    }
}

class Sakura {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.speed = 2;
        this.rotation = 0;
    }
    
    update() {
        this.x -= this.speed;
        this.rotation += 0.1;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🌸', 0, 5);
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * 8;
        this.velocityY = (Math.random() - 0.5) * 8;
        this.life = 25;
        this.maxLife = 25;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += 0.2;
        this.life--;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let game;

// CSS追加
const additionalStyles = `
@keyframes sakura-burst {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(var(--vx), var(--vy)) scale(0); opacity: 0; }
}

@keyframes modal-fade-in {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
}

@keyframes modal-fade-out {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.8); }
}

.ninja-modal .modal-content {
    background: linear-gradient(145deg, #FFF8DC, #F0E68C);
    border: 6px solid #DAA520;
    border-radius: 20px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    position: relative;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 24px;
    cursor: pointer;
    color: #8B4513;
    transition: all 0.3s ease;
}

.modal-close:hover {
    color: #FF1493;
    transform: scale(1.2);
}

.ninja-modal h2 {
    color: #8B4513;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.ninja-details p {
    color: #654321;
    font-size: 1.1rem;
    line-height: 1.6;
    font-weight: 500;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
