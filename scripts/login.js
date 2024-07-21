window.onload = checkLoginStatus;

function checkLoginStatus() {
    const authToken = getCookie('pulso_token');
    const loginId = getCookie('id');
    const authTokenExpiry = getCookieExpiry('pulso_token');
    
    console.log('Auth Token:', authToken);
    console.log('Login ID:', loginId);
    console.log('Auth Token Expiry:', authTokenExpiry);

    if (authToken && loginId && authTokenExpiry) {
        const now = new Date();
        const expiryDate = new Date(authTokenExpiry);

        if (now < expiryDate && (expiryDate - now) > 30 * 60 * 1000) {
            window.location.href = '/dashboard';
            return;
        }
    }

    document.getElementById('login-form').style.display = 'block';
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function getCookieExpiry(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieString = parts.pop().split(';').shift();
        const expiryPart = parts.pop().split('Expires=');
        if (expiryPart.length === 2) {
            return expiryPart[1].trim();
        }
    }
    return null;
}

const idInput = document.querySelector('.login-id');
const pwdInput = document.querySelector('.login-pwd');
const loginBtn = document.querySelector('.login-btn');
const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg')

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    errorMsg.style.display = "none";
    console.log(loginForm.action)

    const id = idInput.value;
    const pwd = pwdInput.value;

    if (!id) {
        displayError('¡Introduce tu Id Profesional de Pulso!')
        return
    } else if (!pwd) {
        displayError('Introduce tu contraseña')
        return
    } else if (!validateInput(id)) {
        displayError("Introduce un Id Profesional correcto")
        return
    } else {
        showLoadingModal('Comprobando tus datos de Acceso')
        const loginData = {
            id: id.toUpperCase(),
            pwd: pwd,
        
        }
        try {
            const response = await fetch(loginForm.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData),
                credentials: 'include',
            })

            if (!response.ok) {
                const failure = await response.json()
                const error = failure.message
                hideLoadingModal()
                showErrorModal(error)
            }

            if (response.ok) {
                const data = await response.json()
                const outcome = data.outcome
                if (outcome === "error") {
                    hideLoadingModal()
                    showErrorModal(data.message)
                } else if (outcome === "success"){
                    hideLoadingModal()
                    showSuccessModal(data.message)
                    const url = data.url
                    setTimeout(() => {
                        window.location = url
                    }, 1600)
                    
                }
            }
        } catch (error) {
            const errorMessage = `Algo fallo en el Servidor. Comprueba tu conexión. Si el problema persiste, envíanos un correo con la siguiente información:<br> ${error}`
            hideLoadingModal()
            showErrorModal(errorMessage)
            throw error
        }
    }
})

function displayError(message) {
    if (errorMsg.style.display === "none") {
        errorMsg.style.display = "block";
        errorMsg.innerText = message;
    } else {
        errorMsg.innerText = message;
    }
}
function validateInput(input) {
    const trimmedInput = input.trim();
    const regex = /^p\d{3}$/i;

    const result = regex.test(trimmedInput)
    return result
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkAuth(url) {
    const token = getCookie('pulso_token');
    const instructorId = getCookie('id');

    if (token && instructorId) {
        window.location.href = url;
    } else {
        console.log('No token or ID found. Please log in.');
    }
}

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
function hideLoadingModal() {
    hideBackdrop()
    loadingModal.style.display = 'none'
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


