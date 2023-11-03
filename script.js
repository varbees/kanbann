const modalOverlay = document.querySelector('.modal-overlay');
const modalContainer = document.querySelector('.modal-container');
const textAreaContainer = document.querySelector('.textarea-container');
const mainContainer = document.querySelector('.main-container');
const colorBtns = document.querySelectorAll('.color');
const addBtn = document.querySelector('.add-btn');
const removeBtn = document.querySelector('.remove-btn');
const saveIcon = document.querySelector('.save-mark');
const toaster = document.querySelector('.toaster');
const filterBasedOnColors = document.querySelectorAll(
  '.toolbox-primary-container > .color'
);

let currrentActiveColor = '#fff475';
let textAreaValue = null;
const tasksArr = [];
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
    modalContainer.style.boxShadow = `0 0 80px 12px ${colorMap[currrentActiveColor]}`;
    textAreaContainer.style.backgroundColor = currrentActiveColor;
    isModalTaskOpen && textAreaContainer.focus();
  });
});

//handle add btn
let isModalTaskOpen = false;
addBtn.addEventListener('click', () => {
  !isModalTaskOpen ? displayModal() : hideModal();
  colorBtns.forEach(colorBtn => colorBtn.classList.remove('active-color'));
  textAreaContainer.style.backgroundColor = currrentActiveColor;
});

//handle remove btn
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

//remove tasks when delete mode active
mainContainer.addEventListener('click', e => {
  if (deleteMode) {
    const cardContainer = e.target.closest('.ticket-container');
    if (cardContainer) mainContainer.removeChild(cardContainer);
  }
});

modalOverlay.addEventListener('click', () => hideModal());

//save on Shift + s or tick mark
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

//handle before, during and after creating a card
const handleCreateCard = () => {
  textAreaValue = textAreaContainer.value;
  const cardId = shuffle(getRandomId());
  if (textAreaValue.trim().length > 0) {
    createCard(cardId, currrentActiveColor, textAreaValue.trim());
    cleanupOnSave();
  } else {
    showToaster('Add some notes before saving...', 'orange', 3000);
    return;
  }
};

//create card and save it in state
function createCard(cardId, cardType, cardValue) {
  const ticketContainer = document.createElement('div');
  ticketContainer.classList.add('ticket-container');
  ticketContainer.style.backgroundColor = colorMap[cardType] || 'darkgoldenrod';
  ticketContainer.style.color = 'white';

  ticketContainer.innerHTML = `
    <div class="card-container ">
      <div class="card-id">${cardId}</div>
      <div class="card-body">${cardValue}</div>
      <div class="card-color" title="Click again to change card color"></div>
      <div class="card-lock"><i id="lock-icon" class="fa-solid fa-lock"></i></div>
    </div>
  `;

  const newTask = {
    cardId,
    cardType,
    cardValue,
  };
  const taskExists = tasksArr.findIndex(task => task.cardId === newTask.cardId);
  taskExists === -1 && tasksArr.push(newTask);
  handleLock(ticketContainer);
  changeCardColor(ticketContainer);
  mainContainer.appendChild(ticketContainer);
}

//edit the saved cards TODO: Update state
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
  });
}

//change saved cards colors TODO: Update State
const colors = Object.values(colorMap);
function changeCardColor(divForColorChange) {
  const cardId = divForColorChange.querySelector('.card-id');
  const cardColor = divForColorChange.querySelector('.card-color');

  let currentColorIndex = colors.findIndex(
    color => color === divForColorChange.style.backgroundColor
  );
  let nextColorIndex =
    currentColorIndex === -1 ? 0 : (currentColorIndex + 1) % colors.length;
  cardColor.addEventListener('click', () => {
    const currentColor = colors[currentColorIndex];
    const nextColor = colors[nextColorIndex];

    setTimeout(() => (cardColor.style.backgroundColor = nextColor), 100);

    divForColorChange.style.backgroundColor = currentColor;

    //updating array state with updated color
    const colorKey = Object.keys(colorMap).find(
      key => colorMap[key] === currentColor
    );
    const indexOfExsitingTask = tasksArr.findIndex(
      task => task.cardId == cardId.innerText
    );
    if (indexOfExsitingTask !== -1) {
      tasksArr[indexOfExsitingTask].cardType = colorKey;
    }

    currentColorIndex = nextColorIndex;
    nextColorIndex = (nextColorIndex + 1) % colors.length;
  });
}

//Filter saved tasks based on color and reset filter on doubleclick
filterBasedOnColors.forEach(filteredColor => {
  filteredColor.addEventListener('click', () => {
    const selectedColor = filteredColor.classList[0];
    const filteredTasks = tasksArr.filter(
      task => selectedColor === task.cardType
    );
    removeAllTickets();
    filteredTasks.length > 0 &&
      filteredTasks.forEach(task =>
        createCard(task.cardId, task.cardType, task.cardValue)
      );
  });

  filteredColor.addEventListener('dblclick', () => {
    removeAllTickets();
    tasksArr.forEach(task =>
      createCard(task.cardId, task.cardType, task.cardValue)
    );
    filteredColor.classList.remove('active-color');
  });
});

function cleanupOnSave() {
  hideModal();
  isModalTaskOpen = false;
  textAreaContainer.value = '';
  currrentActiveColor = '#fff475';
}

//genereate Random Ids for tasks
const getRandomId = () => Math.floor(10000 + Math.random() * 9000);
const shuffle = id =>
  id
    .toString()
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');

//remove tasks from dom
function removeAllTickets() {
  const ticketContainers = document.querySelectorAll('.ticket-container');
  ticketContainers.forEach(ticket => ticket.remove());
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

//custom toaster to use whereever required
function showToaster(message, color, duration) {
  toaster.textContent = message;
  toaster.style.backgroundColor = color;
  toaster.style.display = 'block';
  setTimeout(() => {
    toaster.style.display = 'none';
  }, duration);
}
