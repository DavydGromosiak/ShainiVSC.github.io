
let player;
let isPlayerReady = false;

// Функция инициализации YouTube плеера
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '4sJKlDAeUgM', // ID вашего видео
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': '4sJKlDAeUgM' // Тот же ID для зацикливания
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    player.setVolume(50); // Начальная громкость
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo(); // Перезапуск видео после окончания
    }
}

// Анимация заголовка
class TitleTyper {
    constructor(fullTitle, delay = 200, pauseBeforeRestart = 2000) {
        this.fullTitle = fullTitle;
        this.currentText = '';
        this.currentIndex = 0;
        this.delay = delay;
        this.pauseBeforeRestart = pauseBeforeRestart;
        this.isErasing = false;
    }

    start() {
        this.animate();
    }

    animate() {
        if (!this.isErasing) {
            if (this.currentIndex < this.fullTitle.length) {
                this.currentText += this.fullTitle[this.currentIndex];
                document.title = this.currentText;
                this.currentIndex++;
                setTimeout(() => this.animate(), this.delay);
            } else {
                setTimeout(() => {
                    this.isErasing = true;
                    this.animate();
                }, this.pauseBeforeRestart);
            }
        } else {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.currentText = this.fullTitle.substring(0, this.currentIndex);
                document.title = this.currentText;
                setTimeout(() => this.animate(), this.delay);
            } else {
                this.isErasing = false;
                this.currentText = '';
                setTimeout(() => this.animate(), this.delay);
            }
        }
    }
}

// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация заголовка
    const titleTyper = new TitleTyper('ShainiDG', 300, 1000);
    titleTyper.start();

    // Инициализация аудио контроля
    const toggleButton = document.getElementById('toggleAudio');
    const volumeSlider = document.getElementById('volumeSlider');
    const icon = toggleButton.querySelector('i');

    // Переменная для хранения предыдущего значения громкости
    let lastVolume = volumeSlider.value;
    let isMuted = true;

    // Функция для обновления иконки
    const updateIcon = (volume) => {
        if (volume === 0 || isMuted) {
            icon.className = 'fa-solid fa-volume-xmark';
        } else if (volume < 50) {
            icon.className = 'fa-solid fa-volume-low';
        } else {
            icon.className = 'fa-solid fa-volume-high';
        }
    };

    // Обработчик клика по кнопке
    toggleButton.addEventListener('click', () => {
        if (!isPlayerReady) return;

        if (isMuted) {
            volumeSlider.value = lastVolume;
            player.playVideo();
            player.setVolume(lastVolume);
            isMuted = false;
        } else {
            lastVolume = volumeSlider.value;
            volumeSlider.value = 0;
            player.setVolume(0);
            player.pauseVideo();
            isMuted = true;
        }

        // Обновляем градиент после изменения значения
        volumeSlider.style.background = `linear-gradient(to right, white ${volumeSlider.value}%, rgba(255, 255, 255, 0.3) ${volumeSlider.value}%)`;
        updateIcon(parseInt(volumeSlider.value));
    });

    // Обработчик изменения громкости
    volumeSlider.addEventListener('input', (e) => {
        if (!isPlayerReady) return;

        const volume = parseInt(e.target.value);
        player.setVolume(volume);

        if (volume > 0 && isMuted) {
            player.playVideo();
            isMuted = false;
        } else if (volume === 0) {
            player.pauseVideo();
            isMuted = true;
        }

        if (volume > 0) {
            lastVolume = volume;
        }

        // Обновляем градиент
        volumeSlider.style.background = `linear-gradient(to right, white ${volume}%, rgba(255, 255, 255, 0.3) ${volume}%)`;
        updateIcon(volume);
    });

    // Начальная настройка
    volumeSlider.style.background = `linear-gradient(to right, white ${volumeSlider.value}%, rgba(255, 255, 255, 0.3) ${volumeSlider.value}%)`;
    updateIcon(parseInt(volumeSlider.value));
});