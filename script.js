const modalOverlay = document.querySelector('.modal-overlay');
const modalContainer = document.querySelector('.modal-container');
const colorBtns = document.querySelectorAll('.color');
const addBtn = document.querySelector('.add-btn');
const lockIcon = document.getElementById('lock-icon');

colorBtns.forEach(colorBtn => {
  colorBtn.addEventListener('click', () => {
    console.log(colorBtn.classList[0]);
    removeAllTickets();
  });
});

let isModalTaskOpen = false;
addBtn.addEventListener('click', () =>
  !isModalTaskOpen ? displayModal() : hideModal()
);

modalOverlay.addEventListener('click', () => {
  hideModal();
});

let isLocked = true;
lockIcon.addEventListener('click', () => {
  if (isLocked) {
    lockIcon.classList.remove('fa-lock');
    lockIcon.classList.add('fa-unlock');
    isLocked = false;
  } else {
    lockIcon.classList.add('fa-lock');
    lockIcon.classList.remove('fa-unlock');
    isLocked = true;
  }
});

function removeAllTickets() {
  const mainContainer = document.querySelector('.main-container');
  while (mainContainer.firstChild) {
    mainContainer.removeChild(mainContainer.firstChild);
  }
}

function displayModal() {
  modalOverlay.style.display = 'block';
  modalContainer.classList.add('active');
  isModalTaskOpen = true;
}

function hideModal() {
  modalContainer.classList.remove('active');
  modalOverlay.style.display = 'none';
  isModalTaskOpen = false;
}
