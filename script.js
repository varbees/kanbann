const modalOverlay = document.querySelector('.modal-overlay');
const modalContainer = document.querySelector('.modal-container');
const textAreaContainer = document.querySelector('.textarea-container');
const mainContainer = document.querySelector('.main-container');
const colorBtns = document.querySelectorAll('.color');
const addBtn = document.querySelector('.add-btn');
const removeBtn = document.querySelector('.remove-btn');
const saveIcon = document.querySelector('.save-mark');
const toaster = document.querySelector('.toaster');

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

let deleteMode = false;
removeBtn.addEventListener('click', () => {
  deleteMode = !deleteMode;

  if (deleteMode) {
    showToaster('DELETE MODE ACTIVATED', 'red', 3000);
    removeBtn.classList.add('active-remove');
  } else {
    showToaster('DELETE MODE DEACTIVATED', 'green', 3000);
    removeBtn.classList.remove('active-remove');
  }
});

mainContainer.addEventListener('click', e => {
  if (deleteMode) {
    const cardContainer = e.target.closest('.ticket-container');
    if (cardContainer) mainContainer.removeChild(cardContainer);
  }
});

modalOverlay.addEventListener('click', () => hideModal());

modalContainer.addEventListener('keydown', evt => {
  if (evt.shiftKey) {
    if (evt.key === 'S' || evt.key === 'S') {
      handleCreateCard();
    }
  }

  if (evt.key === 'Escape') {
    hideModal();
  }
});

saveIcon.addEventListener('click', evt => {
  handleCreateCard();
});

const handleCreateCard = () => {
  textAreaValue = textAreaContainer.value;
  const cardId = shuffle(getRandomId());
  console.log(currrentActiveColor);
  if (textAreaValue.trim().length > 0) {
    createCard(cardId, currrentActiveColor, textAreaValue.trim());
    cleanupOnSave();
  } else {
    showToaster('Add some notes before saving...', 'orange', 3000);
    return;
  }
};

function createCard(cardId, cardType, cardValue) {
  const ticketContainer = document.createElement('div');
  ticketContainer.classList.add('ticket-container');
  ticketContainer.style.backgroundColor = colorMap[cardType] || 'darkgoldenrod';
  ticketContainer.style.color = 'white';

  ticketContainer.innerHTML = `
    <div class="card-container ">
      <div class="card-id">#${cardId}</div>
      <div class="card-body">${cardValue}</div>
      <div class="card-color" title="Change card color"></div>
      <div class="card-lock"><i id="lock-icon" class="fa-solid fa-lock"></i></div>
    </div>
  `;

  handleLock(ticketContainer);
  changeCardColor(ticketContainer);
  showToaster(`#${cardId} created successfully`, 'green', 2500);

  mainContainer.appendChild(ticketContainer);
}

const colors = Object.values(colorMap);
function changeCardColor(divForColorChange) {
  const cardColor = divForColorChange.querySelector('.card-color');

  let currentColorIndex = colors.findIndex(
    color => color === divForColorChange.style.backgroundColor
  );
  let nextColorIndex = currentColorIndex === -1 ? 0 : currentColorIndex + 1;

  cardColor.addEventListener('click', () => {
    const currentColor = colors[currentColorIndex];
    const nextColor = colors[nextColorIndex];
    cardColor.style.backgroundColor = nextColor;
    divForColorChange.style.backgroundColor = currentColor;
    currentColorIndex = nextColorIndex;
    nextColorIndex = (nextColorIndex + 1) % colors.length;
  });
}

function cleanupOnSave() {
  hideModal();
  isModalTaskOpen = false;
  textAreaContainer.value = '';
  currrentActiveColor = '#fff475';
}

let isEditable = false;
function handleLock(divToBeLocked) {
  const lockIcon = divToBeLocked.querySelector('.card-lock > i');
  const cardBody = divToBeLocked.querySelector('.card-body');

  lockIcon.addEventListener('click', () => {
    if (!isEditable) {
      lockIcon.classList.remove('fa-lock');
      lockIcon.classList.add('fa-unlock');
      cardBody.setAttribute('contenteditable', 'true');
      cardBody.focus();
      isEditable = true;
    } else {
      lockIcon.classList.add('fa-lock');
      lockIcon.classList.remove('fa-unlock');
      cardBody.setAttribute('contenteditable', 'false');
      isEditable = false;
    }
    console.log('isEditable' + isEditable);
  });
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
  textAreaContainer.focus();
  isModalTaskOpen = true;
}

function hideModal() {
  modalContainer.classList.remove('active');
  modalOverlay.style.display = 'none';
  isModalTaskOpen = false;
}

function showToaster(message, color, duration) {
  toaster.textContent = message;
  toaster.style.backgroundColor = color;
  toaster.style.display = 'block';
  setTimeout(() => {
    toaster.style.display = 'none';
  }, duration);
}
