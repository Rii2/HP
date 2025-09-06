// DOM要素の取得
document.addEventListener('DOMContentLoaded', function() {
    const ninjaCards = document.querySelectorAll('.ninja-card');
    const floatingNinjas = document.querySelectorAll('.floating-ninja');
    const titleChars = document.querySelectorAll('.title-char');

    // ニンジャカードのクリックイベント
    ninjaCards.forEach(card => {
        card.addEventListener('click', function() {
            const ninjaName = this.dataset.ninja;
            showNinjaModal(ninjaName);
            createParticleEffect(this);
        });

        // ホバーエフェクト強化
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.08) rotateY(5deg)';
            createSparkles(this);
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
        });
    });

    // パーティクルエフェクト
    function createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 6px;
                height: 6px;
                background: ${getRandomColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: particle-burst 1s ease-out forwards;
            `;

            const angle = (i / 15) * 2 * Math.PI;
            const velocity = 100 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            particle.style.setProperty('--vx', vx + 'px');
            particle.style.setProperty('--vy', vy + 'px');

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    // スパークルエフェクト
    function createSparkles(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                font-size: ${12 + Math.random() * 8}px;
                pointer-events: none;
                z-index: 999;
                animation: sparkle-fade 1.5s ease-out forwards;
            `;

            document.body.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 1500);
        }
    }

    // ニンジャモーダル表示
    function showNinjaModal(ninjaName) {
        // 既存のモーダルを削除
        const existingModal = document.querySelector('.ninja-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'ninja-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-close">&times;</div>
                <h2>${ninjaName}の詳細</h2>
                <div class="ninja-stats">
                    <div class="stat">
                        <span class="stat-label">レベル:</span>
                        <span class="stat-value">${Math.floor(Math.random() * 50) + 50}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">スキル:</span>
                        <span class="stat-value">${getRandomSkill()}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">属性:</span>
                        <span class="stat-value">${getRandomElement()}</span>
                    </div>
                </div>
                <div class="ninja-description-full">
                    ${getNinjaDescription(ninjaName)}
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: modal-fade-in 0.3s ease-out;
        `;

        document.body.appendChild(modal);

        // モーダルを閉じる
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
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

    // ランダムカラー生成
    function getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // ランダムスキル生成
    function getRandomSkill() {
        const skills = ['忍術', '体術', '幻術', '封印術', '医療忍術', '感知術', '結界術', '召喚術'];
        return skills[Math.floor(Math.random() * skills.length)];
    }

    // ランダム属性生成
    function getRandomElement() {
        const elements = ['火', '水', '風', '土', '雷', '光', '闇', '氷'];
        return elements[Math.floor(Math.random() * elements.length)];
    }

    // ニンジャ説明文
    function getNinjaDescription(name) {
        const descriptions = {
            'サクヤ': '時空を操る神秘的な忍者。過去と未来を自在に行き来し、戦場では予知能力を駆使して敵を翻弄する。',
            'ジャノメ': '蝶のように美しく舞い踊る忍者。華麗な動きで敵を惑わし、毒の粉で相手を眠りに誘う。',
            'ジン': '風の精霊と契約を結んだ忍者。嵐を呼び起こし、竜巻で敵を巻き込む強力な術を使う。',
            'シオン': '紫の炎を操る神秘的な忍者。美しい紫の炎は見る者を魅了し、強力な破壊力を持つ。',
            'シャオラン': '雷を自在に操る電撃忍者。稲妻の速さで移動し、雷撃で敵を麻痺させる。',
            'ネム': '夢の世界を支配する忍者。敵を深い眠りに誘い、悪夢で精神を攻撃する恐ろしい術を使う。',
            'ハヤテ': '疾風のように素早い忍者。その速さは目にも止まらず、風の刃で敵を切り裂く。',
            'ユイ': '絆と結びの力を操る忍者。仲間との絆を力に変え、強力な結界術で味方を守る。',
            'レイ': '霊と交信できる神秘的な忍者。死者の魂を呼び起こし、霊の力を借りて戦う。',
            'ロトン': '炎の炉を操る鍛冶忍者。灼熱の炎で武器を鍛え、炎の術で敵を焼き尽くす。'
        };
        return descriptions[name] || 'クリプトニンジャの世界で活躍する謎多き忍者。';
    }

    // タイトル文字のランダムアニメーション
    function randomTitleAnimation() {
        titleChars.forEach((char, index) => {
            setTimeout(() => {
                char.style.animation = 'none';
                char.offsetHeight; // リフロー強制
                char.style.animation = `bounce 0.6s ease-out, rainbow 3s ease-in-out infinite`;
            }, index * 100);
        });
    }

    // 定期的にタイトルアニメーション実行
    setInterval(randomTitleAnimation, 8000);

    // フローティング要素のクリックイベント
    floatingNinjas.forEach(ninja => {
        ninja.style.cursor = 'pointer';
        ninja.addEventListener('click', function() {
            this.style.animation = 'none';
            this.offsetHeight; // リフロー強制
            this.style.animation = 'spin 1s ease-out, float-around 10s linear infinite';
            createParticleEffect(this);
        });
    });

    // スクロールエフェクト
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        document.querySelector('.stars').style.transform = `translateY(${parallax}px)`;
        document.querySelector('.twinkling').style.transform = `translateY(${parallax * 0.8}px)`;
    });

    // マウス追従エフェクト
    document.addEventListener('mousemove', function(e) {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) {
            const newCursor = document.createElement('div');
            newCursor.className = 'custom-cursor';
            newCursor.innerHTML = '🌟';
            newCursor.style.cssText = `
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                font-size: 20px;
                transition: all 0.1s ease;
            `;
            document.body.appendChild(newCursor);
        }
        
        const cursorElement = document.querySelector('.custom-cursor');
        cursorElement.style.left = e.clientX - 10 + 'px';
        cursorElement.style.top = e.clientY - 10 + 'px';
    });
});

// CSS アニメーション追加
const additionalStyles = `
@keyframes particle-burst {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(var(--vx), var(--vy)) scale(0);
        opacity: 0;
    }
}

@keyframes sparkle-fade {
    0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
    }
    50% {
        transform: scale(1) rotate(180deg);
        opacity: 1;
    }
    100% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
    }
}

@keyframes modal-fade-in {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes modal-fade-out {
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.8);
    }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(720deg); }
}

.ninja-modal .modal-content {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: white;
    text-align: center;
    position: relative;
    animation: modal-content-slide 0.5s ease-out;
}

@keyframes modal-content-slide {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.3s ease;
}

.modal-close:hover {
    color: white;
    transform: scale(1.2);
}

.ninja-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin: 30px 0;
}

.stat {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-label {
    display: block;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 5px;
}

.stat-value {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
    color: #4ecdc4;
}

.ninja-description-full {
    font-size: 1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    text-align: left;
    background: rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid #4ecdc4;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
