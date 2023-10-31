const modalOverlay = document.querySelector('.modal-overlay');
const modalContainer = document.querySelector('.modal-container');
const textAreaContainer = document.querySelector('.textarea-container');
const mainContainer = document.querySelector('.main-container');
const colorBtns = document.querySelectorAll('.color');
const addBtn = document.querySelector('.add-btn');
const lockIcon = document.getElementById('lock-icon');
const saveIcon = document.querySelector('.save-mark');

// console.log(refId);
let currrentActiveColor = '#fff475';
let textAreaValue = null;
const colorMap = {
  royalblue: 'rgba(65, 105, 255, 0.9)',
  lightpink: 'rgba(240, 128, 128, 0.9)',
  lightgreen: 'rgba(144, 238, 144, 0.9)',
  lightblue: 'rgba(173, 216, 230, 0.9)',
  black: 'rgba(0, 0, 0, 0.9)',
};

colorBtns.forEach(colorBtn => {
  colorBtn.addEventListener('click', () => {
    colorBtns.forEach(colorBtn => colorBtn.classList.remove('active-color'));
    colorBtn.classList.add('active-color');

    currrentActiveColor = colorBtn.classList[0];

    textAreaContainer.style.backgroundColor = currrentActiveColor;
    modalContainer.style.boxShadow = `0 0 80px 12px ${colorMap[currrentActiveColor]}`;
  });
});

let isModalTaskOpen = false;
addBtn.addEventListener('click', () =>
  !isModalTaskOpen ? displayModal() : hideModal()
);

modalOverlay.addEventListener('click', () => hideModal());

modalContainer.addEventListener('keydown', evt => {
  if (evt.shiftKey) {
    if (evt.key === 'S' || evt.key === 'S') {
      handleCreateCard();
      cleanupOnSave();
    }
  }
});

saveIcon.addEventListener('click', evt => {
  handleCreateCard();
  cleanupOnSave();
});

// let isLocked = true;
// lockIcon &&
//   lockIcon.addEventListener('click', () => {
//     if (isLocked) {
//       lockIcon.classList.remove('fa-lock');
//       lockIcon.classList.add('fa-unlock');
//       isLocked = false;
//     } else {
//       lockIcon.classList.add('fa-lock');
//       lockIcon.classList.remove('fa-unlock');
//       isLocked = true;
//     }
//   });

const handleCreateCard = () => {
  textAreaValue = textAreaContainer.value;
  const cardId = shuffle(getRandomId());
  createCard(cardId, currrentActiveColor, textAreaValue.trim());
  cleanupOnSave();
};

function createCard(cardId, cardType, cardValue) {
  console.log(cardId, cardType, cardValue.trim());
  const ticketContainer = document.createElement('div');
  ticketContainer.classList.add('ticket-container');
  ticketContainer.style.backgroundColor = colorMap[cardType] || '#fff475';

  ticketContainer.innerHTML = `
    <div class="card-container ${cardType}">
      <div class="card-id">#${cardId}</div>
      <div class="card-body">${cardValue}</div>
      <div class="card-lock"><i id="lock-icon" class="fa-solid fa-lock"></i></div>
    </div>
  `;
  mainContainer.appendChild(ticketContainer);
  if (cardType === 'black' || cardType === 'royalblue') {
    ticketContainer.style.color = 'white';
  }
}

function cleanupOnSave() {
  hideModal();
  isModalTaskOpen = false;
  textAreaContainer.value = '';
  currrentActiveColor = '#fff475';
}

const getRandomId = () => Math.floor(10000 + Math.random() * 9000);
const shuffle = id =>
  id
    .toString()
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');

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
