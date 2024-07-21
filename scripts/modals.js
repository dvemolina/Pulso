const successModal = document.getElementById('successModal');
const loadingModal = document.getElementById('loadingModal');
const errorModal = document.getElementById('errorModal');
const successCloseBtn = document.querySelector('#success-close');
const errorCloseBtn = document.querySelector('#error-close');

const modalCloseBtn = document.querySelector('.modal-close');
const backdrops = document.querySelectorAll('.modal-backdrop');


function showSuccessModal(message) {
    showBackdrop()
    successModal.style.display = 'block';
    successModal.querySelector('.server-message').textContent = message;
}

function showLoadingModal(message) {
    showBackdrop()
    loadingModal.style.display = 'block';
    loadingModal.querySelector('.server-message').textContent = message;
}

function showErrorModal(message) {
    showBackdrop()
    errorModal.style.display = 'block';
    errorModal.querySelector('.server-message').textContent = message;
}

function hideSuccessModal() {
    hideBackdrop()
    successModal.style.display = 'none';
}


function hideErrorModal() {
    hideBackdrop()
    errorModal.style.display = 'none';
}

function showBackdrop() {
    backdrops.forEach(backdrop => backdrop.style.display = 'block');
}

function hideBackdrop() {
    backdrops.forEach(backdrop => backdrop.style.display = 'none');
}

if (successCloseBtn) {
    successCloseBtn.onclick = hideSuccessModal;
}

if (errorCloseBtn) {
    errorCloseBtn.onclick = hideErrorModal;
}

