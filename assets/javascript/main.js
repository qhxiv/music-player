function handleListAnimation() {
  const listBtn = document.querySelector('.menu');
  const list = document.querySelector('.list');
  const mainList = document.querySelector('.list__main');
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

function handleVolumeButton() {
  const volBtn = document.querySelector('.volume');
  console.log(volBtn);
  const volWrapper = document.querySelector('.volume__wrapper');
  const volPanel = document.querySelector('.volume__panel');

  volBtn.addEventListener('mouseover', (e) => {
    volWrapper.style.display = 'flex';
    volPanel.style.animation = 'slideIn 0.2s ease';
  });

  volBtn.addEventListener('mouseout', (e) => {
    volPanel.style.animation = 'slideOut 0.2s ease forwards';
    setTimeout(() => {
      volWrapper.style.display = 'none';
    }, 200);
  });
}

function start() {
  handleListAnimation();
  handleVolumeButton();
}

start();