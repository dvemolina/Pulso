

$(document).ready(function () {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(signupForm);
            const data = {};

            formData.forEach((value, key) => {
                data[key] = value;
            });

            const emailData = {
                instructorName: data.name,
                instructorSurname: data.surname,
                instructorEmail: data.email,
                instructorPhone: data.phone,
                instructorResort: data.resort
            }

            await submitData(formData, emailData);

        });
    } else {
        console.error('Signup form not found');
    }



    var currentStep = 0;
    var stepCount = $('.form-step').length;
    var progressBar = $('.progress-bar');

    showStep(currentStep);

    $('.prev-step-btn').on('click', function () {
        prevStep();
    });

    $(document).on('click', '.next-step-btn', function () {
        var isValid = validateStep(currentStep);
        if (isValid) {
            nextStep();
        }
    });

    // Bind change event for checkboxes in the fourth step
    $('#confirm-requirements, #agree-terms, #agree-privacy').on('change', function () {
        validateStep(currentStep);
    });

    $('#submit-btn').prop('disabled', true); // Disable submit button initially

    function showStep(step) {
        $('.form-step').addClass('d-none');
        $('.form-step').eq(step).removeClass('d-none');
        updateProgressBar((step + 1) / stepCount * 100);
        updateProgressText(step);
    }

    function updateProgressText(step) {
        $('.progress-bar').each(function (index) {
            // Update text based on step number
            $(this).text('Paso ' + (step + 1));
        });
    }

    function validateStep(step) {
        var isValid = true;
        var $inputs = $('.form-step').eq(step).find(':input[required]');

        $inputs.each(function () {
            if ($(this).val() === '') {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        if (step === 0) {
            var emailInput = $('#email').val();
            if (!isValidEmail(emailInput)) {
                isValid = false;
                $('#email').addClass('is-invalid');
                $('#email-invalid-feedback').text('Introduce un Email válido');
            } else {
                $('#email').removeClass('is-invalid');
                $('#email-invalid-feedback').text('');
            }

            var phoneInput = $('#phone').val();
            if (!isValidPhone(phoneInput)) {
                isValid = false;
                $('#phone').addClass('is-invalid');
                $('#phone-invalid-feedback').text('Introduce un teléfono válido. Incluye el código del país');
            } else {
                $('#phone').removeClass('is-invalid');
                $('#phone-invalid-feedback').text('');
            }
        }

        if (step === 1) {
            // Additional validation for second step
            var disciplinaEsquiChecked = false;
            var disciplinaSnowboardChecked = false;
            var documentoTitulacionSelected = $('#documentoTitulacion').get(0).files.length > 0;

            $('.form-step').eq(step).find('input[type="checkbox"]').each(function () {
                if ($(this).is(':checked')) {
                    if ($(this).attr('id').includes('disciplina-esqui')) {
                        disciplinaEsquiChecked = true;
                    } else if ($(this).attr('id').includes('disciplina-snowboard')) {
                        disciplinaSnowboardChecked = true;
                    }
                }
            });

            if (!disciplinaEsquiChecked && !disciplinaSnowboardChecked) {
                isValid = false;
                $('.form-step').eq(step).find('.form-check').addClass('is-invalid');
            } else {
                $('.form-step').eq(step).find('.form-check').removeClass('is-invalid');
            }

            if (!documentoTitulacionSelected || ($('#documentoTitulacion').get(0).files.length === 0 || $('#documentoTitulacion').get(0).files[0].type !== 'application/pdf')) {

                isValid = false;
                $('#documentoTitulacion').addClass('is-invalid');
                $('#documentoTitulacion-invalid-feedback').text('Introduce un archivo .pd');
            } else {
                $('#documentoTitulacion').removeClass('is-invalid');
                $('#documentoTitulacion-invalid-feedback').text('');
            }

        }
        else if (step === 2) {
            // Validation for third step (Disponibilidad General)
            var fechaInicioTemporada = new Date($('#fecha-inicio-temporada').val());
            var fechaFinalTemporada = new Date($('#fecha-final-temporada').val());
            var diasSemanaChecked = false;

            if (fechaFinalTemporada < fechaInicioTemporada) {
                isValid = false;
                $('#fecha-inicio-temporada, #fecha-final-temporada').addClass('is-invalid');
            } else {
                $('#fecha-inicio-temporada, #fecha-final-temporada').removeClass('is-invalid');
            }

            $('.form-step').eq(step).find('input[type="checkbox"]').each(function () {
                if ($(this).is(':checked')) {
                    diasSemanaChecked = true;
                }
            });

            if (!diasSemanaChecked) {
                isValid = false;
                $('.form-step').eq(step).find('.form-check').addClass('is-invalid');
            } else {
                $('.form-step').eq(step).find('.form-check').removeClass('is-invalid');
            }
        }

        else if (step === 3) {
            // Validation for fourth step (Terms and Conditions)
            var requirementsChecked = $('#confirm-requirements').is(':checked');
            var termsChecked = $('#agree-terms').is(':checked');
            var privacyChecked = $('#agree-privacy').is(':checked');

            if (!requirementsChecked || !termsChecked || !privacyChecked) {
                isValid = false;
                $('#confirm-requirements, #agree-terms, #agree-privacy').addClass('is-invalid');
                $('#submit-btn').prop('disabled', true); // Disable the button if any checkbox is unchecked
            } else {
                $('#confirm-requirements, #agree-terms, #agree-privacy').removeClass('is-invalid');
                $('#submit-btn').prop('disabled', false); // Enable the button if all checkboxes are checked
            }
        }

        return isValid;
    }

    function isValidEmail(email) {
        // Regular expression for email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Regular expression for phone number validation with country code format
        var phoneRegex = /^\(\+\d{2}\)\d+$/;
        return phoneRegex.test(phone);
    }

    $('#toggle-pwd').click(function () {
        var pwdField = $('#pwd');
        var icon = $(this).find('i');
        if (pwdField.attr('type') === 'pwd') {
            pwdField.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            pwdField.attr('type', 'pwd');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    $('#toggle-confirm-pwd').click(function () {
        var confirmpwdField = $('#confirm-pwd');
        var icon = $(this).find('i');
        if (confirmpwdField.attr('type') === 'pwd') {
            confirmpwdField.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            confirmpwdField.attr('type', 'pwd');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    const cardBody = document.querySelector('.card')
    function prevStep() {
        currentStep--;
        if (currentStep >= 0) {
            showStep(currentStep);
            cardBody.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function nextStep() {
        console.log('Moving to next step...');
        currentStep++;
        console.log('Current step:', currentStep);
        if (currentStep < stepCount) {
            showStep(currentStep);
            cardBody.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function updateProgressBar(value) {
        progressBar.width(value + '%').attr('aria-valuenow', value);
    }
});
async function submitData(formData, emailData) {
    const modalDialog = document.querySelector('.modal-dialog');
    const modalMsg = modalDialog.querySelector('.dialog-message');

    console.log('DATA INSIDE FUNCTION: ', emailData)

    modalDialog.showModal();
    modalMsg.textContent = 'Enviando tu Solicitud de Registro...'
    try {
        const response = await fetch("https://pulso-proxy.netlify.app/.netlify/functions/proxy/signup", {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const sendMail = await fetch("https://pulso-mailer.netlify.app/.netlify/functions/api/mailer/new-signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            })

            if (sendMail.ok) {
                const res = await sendMail.json()
                const resMsg = res.message
                modalMsg.textContent = resMsg
                window.location.href = 'https://pulsodenieve.com';
            }

        } else {
            modalDialog.close()
            alert('Failed to submit form');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form');
    }
}

$('#pwd, #confirm-pwd').on('keyup', function () {
    var pwd = $('#pwd').val();
    var confirmPwd = $('#confirm-pwd').val();

    if (pwd !== confirmPwd) {
        $('#pwd-mismatch').show();
    } else {
        $('#pwd-mismatch').hide();
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const startSelect = document.getElementById('hora-inicio-jornada');
    const endSelect = document.getElementById('hora-final-jornada');

    //Populate start times
    function populateStartTimes() {
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2);
                const option = document.createElement('option');
                option.value = timeString;
                option.textContent = timeString;
                startSelect.appendChild(option);
            }
        }
    }

    // Populate end times based on selected start time
    function populateEndTimes() {
        const startTime = startSelect.value;
        const [startHour, startMinute] = startTime.split(':').map(Number);
        endSelect.innerHTML = ''; // Clear previous options
        let currentHour = startHour;
        let currentMinute = startMinute;

        // Increment by 60 minutes for each option
        while (currentHour < 24) {
            currentMinute += 60;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
            if (currentHour < 24) {
                const timeString = ('0' + currentHour).slice(-2) + ':' + ('0' + currentMinute).slice(-2);
                const option = document.createElement('option');
                option.value = timeString;
                option.textContent = timeString;
                endSelect.appendChild(option);
            }
        }
    }

    populateStartTimes();

    // Update end times when start time changes
    startSelect.addEventListener('change', populateEndTimes);

    //Create the Resort Dropdowns
    const resortDropdown = '#localizacion'
    createResortOptions(resortDropdown)

});









