const TITLE_ANIMATION = {
    DELAY: 300,
    PAUSE: 1000
};

const PLAYLIST = [
    {
        title: 'i miss you',
        audio: 'audio/ichika Nito - I Miss You(extended) (Spotify Version).mp3',
        cover: 'img/track-cover.jpg',
        link: 'https://open.spotify.com/track/021sNzTndU8LVmDJDqvwXp?si=5535235871bc4bc9'
    }
];

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
        this.currentTrackIndex = 0;
        this.audio = new Audio();
        this.audio.volume = 0.55;
        this.isPlaying = false;

        this.playButton = document.getElementById('toggleAudio');
        this.playIcon = this.playButton.querySelector('i');
        this.trackCover = document.getElementById('trackCover');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackExternalLink = document.getElementById('trackExternalLink');
        this.progressSlider = document.getElementById('progressSlider');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.currentTime = document.getElementById('currentTime');
        this.durationTime = document.getElementById('durationTime');
        this.previousTrackButton = document.getElementById('previousTrack');
        this.nextTrackButton = document.getElementById('nextTrack');

        this.setupControls();
        this.loadTrack(0);
        this.updateProgressFill(0);
    }

    setupControls() {
        this.playButton.setAttribute('aria-pressed', 'false');
        this.playButton.addEventListener('click', () => this.togglePlayback());
        this.progressSlider.addEventListener('input', (event) => this.seek(event));
        this.volumeSlider.addEventListener('input', (event) => this.changeVolume(event));
        this.previousTrackButton.addEventListener('click', () => this.changeTrack(-1));
        this.nextTrackButton.addEventListener('click', () => this.changeTrack(1));

        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('play', () => this.setPlaying(true));
        this.audio.addEventListener('pause', () => this.setPlaying(false));
        this.audio.addEventListener('ended', () => this.changeTrack(1, true));
        this.updateVolumeUI();
    }

    loadTrack(index) {
        const track = PLAYLIST[index];
        this.currentTrackIndex = index;
        this.audio.src = track.audio;
        this.audio.load();

        this.trackCover.src = track.cover;
        this.trackCover.alt = `${track.title} cover`;
        this.trackTitle.textContent = track.title;
        this.trackTitle.href = track.link;
        this.trackExternalLink.href = track.link;
        this.currentTime.textContent = '0:00';
        this.durationTime.textContent = '0:00';
        this.progressSlider.value = '0';
        this.updateProgressFill(0);
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

    async changeTrack(direction, autoplay = this.isPlaying) {
        const nextIndex = (this.currentTrackIndex + direction + PLAYLIST.length) % PLAYLIST.length;
        this.loadTrack(nextIndex);

        if (autoplay) {
            await this.audio.play();
        }
    }

    changeVolume(event) {
        const volume = Number(event.target.value);
        this.audio.volume = volume / 100;
        this.updateVolumeUI();
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

    updateVolumeUI() {
        const volume = Number(this.volumeSlider.value);
        this.volumeSlider.style.background = `linear-gradient(to right, #ffffff ${volume}%, rgba(255, 255, 255, 0.24) ${volume}%)`;

        if (volume === 0) {
            this.volumeIcon.className = 'fa-solid fa-volume-xmark';
        } else if (volume < 50) {
            this.volumeIcon.className = 'fa-solid fa-volume-low';
        } else {
            this.volumeIcon.className = 'fa-solid fa-volume-high';
        }
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
    const titleTyper = new TitleTyper('Shaini', TITLE_ANIMATION.DELAY, TITLE_ANIMATION.PAUSE);
    titleTyper.start();

    new MusicPlayer();
});
