import songs from './songs.js';

const listContent = document.querySelector('.list__content');
const audio = document.querySelector('audio');
const currentTime = document.querySelector('.progress__current');
const duration = document.querySelector('.progress__total');

let currentIndex = 0;
let oldIndex = 0;

audio.volume = 0.5;

function handleListAnimation() {
  const mainList = document.querySelector('.list__main');
  const listBtn = document.querySelector('.menu');
  const list = document.querySelector('.list');
  const overlay = document.querySelector('.list__overlay');
  const closeBtn = document.querySelector('.list__header i');

  listBtn.onclick = () => {
    list.style.display = 'flex';
  };

  closeBtn.onclick = () => {
    mainList.style.animation = 'slideOut 0.5s ease forwards';
    overlay.style.animation = 'fadeOut 0.5s ease forwards';

    setTimeout(() => {
      list.style.display = 'none';
      mainList.style.animation = 'slideIn 0.5s ease';
      overlay.style.animation = 'fadeIn 0.5s ease';
    }, 500);
  };
}

function formatDuration(sec) {
  sec = Math.round(sec);
  let min = Math.floor(sec / 60);
  sec -= min * 60;
  sec = sec.toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function renderSongs() {
  songs.forEach((song, index) => {
    const songElement = document.createElement('div');
    songElement.className = `song song${index}`;
    songElement.innerHTML = `
      <div class="song__img">
        <div class="song__play">
          <i class="fa-solid fa-circle-play"></i>
        </div>
        <img src="${song.image}" alt="">
      </div>
      <div class="song__detail">
        <p class="song__author">${song.author}</p>
        <p class="song__title">${song.name}</p>
      </div>
      <div class="song__duration"></div>
    `;
    listContent.appendChild(songElement);

    let audio = document.createElement('audio');
    audio.src = song.path;
    audio.addEventListener('loadeddata', () => {
      songElement.querySelector('.song__duration').innerHTML = formatDuration(audio.duration);
    });
  });
}

function handlePlayButton() {
  const playBtn = document.querySelector('.play');
  playBtn.onclick = () => {
    if (audio.paused) {
      playBtn.innerHTML = '<i class="fa-fw fa-solid fa-circle-pause"></i>';
      audio.play();
    } else {
      playBtn.innerHTML = '<i class="fa-fw fa-solid fa-circle-play"></i>';
      audio.pause();
    }
  };
}

function loadAudio() {
  document.querySelector(`.song${oldIndex}`).classList.remove('song--playing');
  const currentSong = document.querySelector(`.song${currentIndex}`);
  currentSong.classList.add('song--playing');
  currentTime.innerHTML = '0:00';
  audio.src = songs[currentIndex].path;
  audio.addEventListener('loadeddata', () => {
    duration.innerHTML = formatDuration(audio.duration);
  });
}

function handleVolumeButton() {
  const volumePanel = document.querySelector('.volume__panel');
  const volumeFill = document.querySelector('.volume__fill');
  
  volumePanel.addEventListener('mouseup', (e) => {
    volumePanel.onmousedown = () => {
      volumePanel.onmousemove = (e) => {
        console.log(e);
      }
    }
  });
}

function start() {
  renderSongs();
  handleListAnimation();
  loadAudio();
  handlePlayButton();
  handleVolumeButton();
}

start();