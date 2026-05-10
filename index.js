const TITLE_ANIMATION = {
    DELAY: 300,
    PAUSE: 1000
};

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
            return;
        }

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

class MusicPlayer {
    constructor() {
        this.audio = new Audio('audio/ichika Nito - I Miss You(extended) (Spotify Version).mp3');
        this.audio.volume = 0.55;
        this.audio.loop = true;
        this.isPlaying = false;

        this.playButton = document.getElementById('toggleAudio');
        this.playIcon = this.playButton.querySelector('i');
        this.progressSlider = document.getElementById('progressSlider');
        this.currentTime = document.getElementById('currentTime');
        this.durationTime = document.getElementById('durationTime');
        this.skipBack = document.getElementById('skipBack');
        this.skipForward = document.getElementById('skipForward');

        this.setupControls();
        this.updateProgressFill(0);
    }

    setupControls() {
        this.playButton.setAttribute('aria-pressed', 'false');
        this.playButton.addEventListener('click', () => this.togglePlayback());
        this.progressSlider.addEventListener('input', (event) => this.seek(event));
        this.skipBack.addEventListener('click', () => this.skip(-10));
        this.skipForward.addEventListener('click', () => this.skip(10));

        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('play', () => this.setPlaying(true));
        this.audio.addEventListener('pause', () => this.setPlaying(false));
    }

    async togglePlayback() {
        if (this.audio.paused) {
            await this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    setPlaying(isPlaying) {
        this.isPlaying = isPlaying;
        this.playButton.setAttribute('aria-pressed', String(isPlaying));
        this.playButton.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
        this.playIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }

    seek(event) {
        if (!Number.isFinite(this.audio.duration)) {
            return;
        }

        const percentage = Number(event.target.value);
        this.audio.currentTime = (percentage / 100) * this.audio.duration;
        this.updateProgressFill(percentage);
    }

    skip(seconds) {
        const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
        const nextTime = Math.min(Math.max(this.audio.currentTime + seconds, 0), duration);
        this.audio.currentTime = nextTime;
    }

    updateDuration() {
        this.durationTime.textContent = this.formatTime(this.audio.duration);
    }

    updateProgress() {
        if (!Number.isFinite(this.audio.duration) || this.audio.duration === 0) {
            return;
        }

        const percentage = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressSlider.value = String(percentage);
        this.currentTime.textContent = this.formatTime(this.audio.currentTime);
        this.updateProgressFill(percentage);
    }

    updateProgressFill(value) {
        this.progressSlider.style.background = `linear-gradient(to right, #73f7ff ${value}%, rgba(255, 255, 255, 0.22) ${value}%)`;
    }

    formatTime(time) {
        if (!Number.isFinite(time)) {
            return '0:00';
        }

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const titleTyper = new TitleTyper('ShainiDG', TITLE_ANIMATION.DELAY, TITLE_ANIMATION.PAUSE);
    titleTyper.start();

    new MusicPlayer();
});
