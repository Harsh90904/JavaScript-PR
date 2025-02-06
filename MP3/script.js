class MusicPlayer {
  constructor() {
   
    this.elements = {
      audio: document.getElementById("audio-player"),
      playBtn: document.getElementById("play-btn"),
      prevBtn: document.getElementById("prev-btn"),
      nextBtn: document.getElementById("next-btn"),
      progress: document.getElementById("progress-bar"),
      currentTime: document.getElementById("current-time"),
      duration: document.getElementById("duration"),
      playlist: document.getElementById("playlist"),
      songInput: document.getElementById("song-input"),
      addSongBtn: document.getElementById("add-song-btn"),
      volume: document.getElementById("volume-slider"),
      volumeIcon: document.getElementById("volume-icon"),
    };

    this.songs = [];
    this.currentSongIndex = 0;
    this.lastVolume = 1;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    const e = this.elements; 

    e.playBtn.onclick = () => this.togglePlay();
    e.prevBtn.onclick = () => this.playPrevious();
    e.nextBtn.onclick = () => this.playNext();
    e.progress.onchange = () => this.seekTo();
    e.audio.ontimeupdate = () => this.updateProgress();
    e.audio.onended = () => this.playNext();
    e.addSongBtn.onclick = () => e.songInput.click();
    e.songInput.onchange = (event) => this.handleFileSelect(event);
    e.volume.oninput = () => this.updateVolume();
    e.volumeIcon.onclick = () => this.toggleMute();
  }

  togglePlay() {
    if (this.elements.audio.paused) {
      this.elements.audio.play();
      this.elements.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      this.elements.audio.pause();
      this.elements.playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  playPrevious() {
    this.currentSongIndex =
      (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    this.loadAndPlaySong();
  }

  playNext() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    this.loadAndPlaySong();
  }

  seekTo() {
    const time =
      (this.elements.progress.value * this.elements.audio.duration) / 100;
    this.elements.audio.currentTime = time;
  }

  updateProgress() {
    const progress =
      (this.elements.audio.currentTime / this.elements.audio.duration) * 100;
    this.elements.progress.value = progress;

    this.elements.currentTime.textContent = this.formatTime(
      this.elements.audio.currentTime
    );
    this.elements.duration.textContent = this.formatTime(
      this.elements.audio.duration
    );
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  handleFileSelect(event) {
    const files = Array.from(event.target.files)
      .filter((file) => file.type.startsWith("audio/"))
      .map((file) => ({
        file,
        name: file.name,
        url: URL.createObjectURL(file),
      }));

    this.songs.push(...files);
    files.forEach((song, index) => {
      this.addToPlaylist(song, this.songs.length - files.length + index);
    });

    if (this.songs.length === files.length) {
      this.loadAndPlaySong();
    }
  }

  addToPlaylist(song, index) {
    const li = document.createElement("li");
    li.className = "playlist-item";
    li.textContent = song.name;

    li.addEventListener("click", () => {
      this.currentSongIndex = index;
      this.loadAndPlaySong();

    });

    this.elements.playlist.appendChild(li);
  }

  loadAndPlaySong() {
    if (this.songs.length === 0) return;

    const song = this.songs[this.currentSongIndex];
    this.elements.audio.src = song.url;
    document.getElementById("current-song-title").textContent = song.name;
    document.querySelectorAll(".playlist-item").forEach((item, index) => {
      item.classList.toggle("active", index === this.currentSongIndex);
    });

    this.elements.audio.play();
    this.elements.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }

  updateVolume() {
    const volume = this.elements.volume.value / 100;
    this.elements.audio.volume = volume;
    this.lastVolume = volume;

    if (volume === 0) {
      this.elements.volumeIcon.className = "fas fa-volume-mute";
    } else if (volume < 0.5) {
      this.elements.volumeIcon.className = "fas fa-volume-down";
    } else {
      this.elements.volumeIcon.className = "fas fa-volume-up";
    }
  }

  toggleMute() {
    if (this.elements.audio.volume > 0) {
      this.elements.audio.volume = 0;
      this.elements.volume.value = 0;
      this.elements.volumeIcon.className = "fas fa-volume-mute";
    } else {
      this.elements.audio.volume = this.lastVolume;
      this.elements.volume.value = this.lastVolume * 100;
      this.updateVolume();
    }
  }
}

const player = new MusicPlayer();
