import songs from './songs.js';

const listContent = document.querySelector('.list__content');
const audio = document.querySelector('audio');
const currentAudioTime = document.querySelector('.progress__current');
const playBtn = document.querySelector('.play');

let currentIndex = 0;
let oldIndex = 0;

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

function handlePlayButton() {
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
  currentAudioTime.innerHTML = '0:00';
  audio.src = songs[currentIndex].path;
  
  document.querySelector(`.song${oldIndex}`).classList.remove('song--playing');
  document.querySelector(`.song${currentIndex}`).classList.add('song--playing');

  audio.addEventListener('loadeddata', () => {
    document.querySelector('.progress__total').innerHTML = formatDuration(audio.duration);
    handleProgressBar(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    let cur = audio.currentTime;
    document.querySelector('.progress__fill').style.width = cur / audio.duration * 100 + '%';
    currentAudioTime.innerHTML = formatDuration(cur);
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
    shrinkCover();
  });
}

function handleVolumeButton() {
  const volumeBtn = document.querySelector('.volume');
  const icon = volumeBtn.querySelector('i');
  const panel = document.querySelector('.volume__panel');
  const fill = document.querySelector('.volume__fill');
  const cover = document.querySelector('.volume__cover');
  const bar = document.querySelector('.volume__bar');
  const clip = document.querySelector('.volume__clip');

  let isMouseDown = false;
  let oldVolume;
  audio.volume = .5;
  audio.onvolumechange = () => { fill.style.height = audio.volume * 100 + '%' };

  cover.addEventListener('click', (e) => e.stopPropagation());

  volumeBtn.onclick = () => {
    if (audio.volume === 0) {
      icon.className = 'fa-fw fa-solid fa-volume-high';
      audio.volume = oldVolume;
    } else {
      oldVolume = audio.volume;
      audio.volume = 0;
      icon.className = 'fa-fw fa-solid fa-volume-xmark';
    }
  };
  
  volumeBtn.onmouseover = () => {
    panel.style.display = 'flex';
    panel.style.animation = 'slideIn .3s ease';
  };

  volumeBtn.onmouseleave = () => {
    panel.style.animation = 'slideOut .3s ease';
    setTimeout(() => {
      panel.style.display = 'none';
    }, 300);
  };

  let updateVolume = (e) => {
    let total = bar.clientHeight;
    let cur = total - (e.clientY - bar.getBoundingClientRect().y);
    if (cur < 0) cur = 0;
    else if (cur > 100) cur = 100;

    if (cur === 0)
      icon.className = 'fa-fw fa-solid fa-volume-xmark';
    else icon.className = 'fa-fw fa-solid fa-volume-high';
    
    fill.style.height = cur + '%';
    audio.volume = cur / 100;
  };

  cover.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    clip.style.overflow = 'visible';
    cover.style.position = 'fixed';
    updateVolume(e);
  });

  cover.addEventListener('mousemove', (e) => {
    if (isMouseDown)
      updateVolume(e);
  });

  cover.addEventListener('mouseup', (e) => {
    isMouseDown = false;
    clip.style.overflow = 'hidden';
    cover.style.position = 'absolute';
  });
}

function start() {
  renderSongs();
  loadAudio();
  // handleProgressBar() is called inside loadAudio() function because i need to get the audio duration
  handleVolumeButton();
  handleListAnimation();
  handlePlayButton();
}

start();