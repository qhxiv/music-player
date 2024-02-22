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

}

function start() {
  handleListAnimation();
  handleVolumeButton();
}

start();