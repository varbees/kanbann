const modalOverlay = document.querySelector('.modal-overlay');
const modalContainer = document.querySelector('.modal-container');
const addBtn = document.querySelector('.add-btn');

let isModalTaskOpen = false;

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

addBtn.addEventListener('click', () =>
  !isModalTaskOpen ? displayModal() : hideModal()
);

modalOverlay.addEventListener('click', () => {
  hideModal();
});
