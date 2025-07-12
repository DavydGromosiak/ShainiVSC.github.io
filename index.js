// Константы для управления анимацией
const TITLE_ANIMATION = {
    DELAY: 300,
    PAUSE: 1000
};

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

// Класс для управления аудио
class AudioController {
    constructor() {
        this.audio = new Audio('audio/ichika Nito - I Miss You(extended) (Spotify Version).mp3');
        this.audio.loop = true;
        this.audio.volume = 0.5;
        this.isMuted = true;
        this.lastVolume = 50;

        this.setupControls();
    }

    setupControls() {
        this.toggleButton = document.getElementById('toggleAudio');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.icon = this.toggleButton.querySelector('i');

        this.toggleButton.addEventListener('click', () => this.toggleAudio());
        this.volumeSlider.addEventListener('input', (e) => this.handleVolumeChange(e));

        // Начальная настройка
        this.updateSliderBackground();
        this.updateIcon();
    }

    toggleAudio() {
        if (this.isMuted) {
            this.volumeSlider.value = this.lastVolume;
            this.audio.play();
            this.audio.volume = this.lastVolume / 100;
        } else {
            this.lastVolume = this.volumeSlider.value;
            this.volumeSlider.value = 0;
            this.audio.volume = 0;
            this.audio.pause();
        }
        this.isMuted = !this.isMuted;
        this.updateSliderBackground();
        this.updateIcon();
    }

    handleVolumeChange(event) {
        const volume = parseInt(event.target.value);
        this.audio.volume = volume / 100;

        if (volume > 0 && this.isMuted) {
            this.audio.play();
            this.isMuted = false;
        } else if (volume === 0) {
            this.audio.pause();
            this.isMuted = true;
        }

        if (volume > 0) {
            this.lastVolume = volume;
        }

        this.updateSliderBackground();
        this.updateIcon();
    }

    updateSliderBackground() {
        const value = this.volumeSlider.value;
        this.volumeSlider.style.background = `linear-gradient(to right, white ${value}%, rgba(255, 255, 255, 0.3) ${value}%)`;
    }

    updateIcon() {
        const volume = parseInt(this.volumeSlider.value);
        if (volume === 0 || this.isMuted) {
            this.icon.className = 'fa-solid fa-volume-xmark';
        } else if (volume < 50) {
            this.icon.className = 'fa-solid fa-volume-low';
        } else {
            this.icon.className = 'fa-solid fa-volume-high';
        }
    }
}

// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', () => {
    const titleTyper = new TitleTyper('ShainiDG', TITLE_ANIMATION.DELAY, TITLE_ANIMATION.PAUSE);
    titleTyper.start();

    new AudioController();
});