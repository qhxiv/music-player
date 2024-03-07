import songs from './songs.js';

const listContent = document.querySelector('.list__content');
const audio = document.querySelector('audio');
const currentAudioTime = document.querySelector('.progress__current');
const playBtn = document.querySelector('.play');

let interval;
let currentIndex = 0;
let oldIndex = 0;

audio.volume = 0.5;

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

function syncAudioTimeWithProgressBar() {
  return setInterval(() => {
    let cur = audio.currentTime;
    document.querySelector('.progress__fill').style.width = cur / audio.duration * 100 + '%';
    currentAudioTime.innerHTML = formatDuration(cur);
  }, 100);
}

function handlePlayButton() {
  playBtn.onclick = () => {
    if (audio.paused) {
      playBtn.innerHTML = '<i class="fa-fw fa-solid fa-circle-pause"></i>';
      audio.play();
      interval = syncAudioTimeWithProgressBar();
    } else {
      playBtn.innerHTML = '<i class="fa-fw fa-solid fa-circle-play"></i>';
      audio.pause();
    }
  };
}

function loadAudio() {
  document.querySelector(`.song${oldIndex}`).classList.remove('song--playing');
  document.querySelector(`.song${currentIndex}`).classList.add('song--playing');
  currentAudioTime.innerHTML = '0:00';
  audio.src = songs[currentIndex].path;
  audio.addEventListener('loadeddata', () => {
    document.querySelector('.progress__total').innerHTML = formatDuration(audio.duration);
    handleProgressBar(audio.duration);
  });
}

// handleProgressBar() function get the duration of the current song from the loadAudio() function above
function handleProgressBar(duration) {
  const cover = document.querySelector('.progress__cover');
  const bar = document.querySelector('.progress__bar');
  const fill = document.querySelector('.progress__fill');

  let isMouseDown = false;

  let updateBar = (e) => {
    let cur = e.clientX - bar.getBoundingClientRect().x;
    let percentage = cur / bar.clientWidth * 100;

    if (percentage < 0) percentage = 0;
    else if (percentage > 100) percentage = 100;
    
    fill.style.width = percentage + '%';
    
    audio.currentTime = duration * percentage / 100;
  };

  let expandCover = () => {
    cover.style.position = 'fixed';
    cover.style.height = '100vh';
  };

  let shrinkCover = () => {
    cover.style.position = 'absolute';
    cover.style.height = '20px';
  };

  cover.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    expandCover();
    audio.pause();
    updateBar(e);
  });

  cover.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
      updateBar(e);
    }
  });

  cover.addEventListener('mouseup', (e) => {
    isMouseDown = false;
    if (playBtn.querySelector('i').classList.contains('fa-circle-pause'))
      audio.play();
    else {
      
    }
    shrinkCover();
  });
}

function start() {
  renderSongs();
  loadAudio();
  // handleProgressBar() is called inside loadAudio() function because i need to get the audio duration
  handleListAnimation();
  handlePlayButton();
}

start();