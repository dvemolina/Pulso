const dialogDiv = document.getElementById('booking-dialog');
const bookingDatesDiv = document.getElementById('booking-dates');
const closeDialogBtn = document.querySelector('.close-btn-dialog');
const nextDialogBtn = document.querySelector('.next-btn-dialog')
const firstStepDialog = dialogDiv.querySelector('#first-step-booking');
const secondStepDialog = dialogDiv.querySelector('#second-step-booking');
const thirdStepDialog = dialogDiv.querySelector('#third-step-booking');
const goBackStepBtn = dialogDiv.querySelector('#step-back-dialog')
const submitBookingBtn = dialogDiv.querySelector('#submit-booking');
const addStudentDetails = dialogDiv.querySelector('#add-student-details');
let errorBookingMsg = document.querySelector('#error-booking-msg')


function startBookingProcess(instructorId, instructorData) {
    setInstructorData(`instructor_${instructorId}`, instructorData);
    cleanSlotsDiv();
    dialogDiv.removeAttribute('instructorId');
    dialogDiv.style.display = 'flex';
    dialogDiv.setAttribute('instructorId', `${instructorId}`);
    const availability = instructorData.availability;
    const bookableDates = createBookingSlots(availability);
    bookableDates.forEach(date => {
        dialogDiv.showModal();
        const dateElement = document.createElement('div');
        dateElement.innerHTML = `
                <div class="date-booking">
                    <div class="week-day-booking">
                        <div class="slot-date" style="display: none;"></div>
                        <div class="wd-number">${date.dayNum}</div>
                        <div class="wd-name">${date.dayName}</div>
                    </div>
                    <div class="slots-booking">
                        ${date.daySlots}
                    </div>
                </div>
                `;
        bookingDatesDiv.appendChild(dateElement);
    })

}
closeDialogBtn.addEventListener('click', () => {
    errorBookingMsg.innerText = '';
    dialogDiv.close();
    dialogDiv.style.display = 'none';
})

goBackStepBtn.addEventListener('click', (e) => {
    e.preventDefault();
    errorBookingMsg.style.display = 'none';
    errorBookingMsg.innerText = '';
    secondStepDialog.style.display = 'none';
    firstStepDialog.style.display = 'flex';
})

addStudentDetails.addEventListener('click', (e) => {
    e.preventDefault();
    const studentsWrapper = dialogDiv.querySelector('#students-wrapper');
    let newStudent = document.createElement('fieldset')
    newStudent.classList.add('student-details')
    const studentFieldset = `
            <div class="detail-group">
                <label for="student_name">Nombre Alumno</label>
                <input type="text" name="student_name" class="student_name" placeholder="Nombre">
            </div>
            <div class="detail-group">
                <label for="student_surname">Apellidos Alumno</label>
                <input type="text" name="student_surname" class="student_surname"
                    placeholder="Apellidos">
            </div>
            <div class="detail-group">
                <label for="student_age">Edad Alumno</label>
                <input class="student_age" type="number" name="student_age" min="1">
            </div>
            <div class="detail-group">
                <label for="student_level">Nivel Alumno</label>
                <select class="student_level">
                    <option value="">Selecciona Nivel</option>
                    <option value="Sin nivel indicado">No estoy seguro/a de mi nivel</option>
                    <option value="Primera Vez">Primera Vez</option>
                    <option value="Iniciado">Iniciado</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Experto">Experto</option>
                    <option value="Tecnificación">Tecnificación</option>
                </select>
            </div>
            <button class="delete-student">Borrar Alumno</button>
        `
    newStudent.innerHTML = studentFieldset;
    studentsWrapper.appendChild(newStudent)

    const deleteStudentBtn = newStudent.querySelectorAll('.delete-student');
    deleteStudentBtn.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (e.target.classList.contains('delete-student')) {
                // Find the closest fieldset and remove it
                const fieldset = e.target.closest('fieldset');
                if (fieldset) {
                    fieldset.remove();
                }
            };
        });
    })

});

let bookingData;
nextDialogBtn.addEventListener('click', () => {
    const bookingDates = bookingDatesDiv.querySelectorAll('.date-booking');
    const bookingArray = [];

    bookingDates.forEach(bookingDate => {
        const bookingSlots = bookingDate.querySelectorAll('.slot-hidden-checkbox');
        const selectedSlots = [];
        let date;

        bookingSlots.forEach(slot => {
            if (slot.checked) {
                date = slot.getAttribute('date');
                const slotTime = slot.value
                selectedSlots.push(slotTime)
            }
        })

        const bookingUnit = {
            date: date,
            slots: selectedSlots
        }

        if (!bookingUnit.date) {
            console.log('NO DATES IN THE BOOKING')
            return
        } else {
            bookingArray.push(bookingUnit)
        }
    })

    if (bookingArray.length) {
        bookingData = bookingArray

        secondStepDialog.style.display = 'flex';
        firstStepDialog.style.display = 'none';
        errorBookingMsg.style.display = 'none';
        errorBookingMsg.innerText = ''
    } else {
        errorBookingMsg.style.display = 'flex';
        errorBookingMsg.innerText = "Selecciona al menos un Bloque de Reserva Disponible"
    }
})

const bookingDetailsReview = thirdStepDialog.querySelector('#booking-details-review');
let bookingToSend;

submitBookingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    errorBookingMsg.style.display = 'none';
    const studentsDetails = secondStepDialog.querySelectorAll('.student-details');
    const studentsArray = [];

    studentsDetails.forEach(student => {
        const studentName = student.querySelector('.student_name');
        const studentSurname = student.querySelector('.student_surname');
        const studentAge = student.querySelector('.student_age');
        const studentLevel = student.querySelector('.student_level');

        const studentObject = {
            name: studentName.value,
            surname: studentSurname.value,
            age: studentAge.value,
            level: studentLevel.value
        }

        studentsArray.push(studentObject)
    })

    const studentsAmountStr = secondStepDialog.querySelector('#students_amount');
    const clientName = secondStepDialog.querySelector('#client_name');
    const clientSurname = secondStepDialog.querySelector('#client_surname');
    const clientEmail = secondStepDialog.querySelector('#client_email');
    const clientGoals = secondStepDialog.querySelector('#client_goals');
    const clientOther = secondStepDialog.querySelector('#client_other');

    const studentsAmount = parseInt(studentsAmountStr.value)

    const studentFieldsArray = [
        studentsAmount,
        studentsArray
    ]
    const clientFieldsArray = [
        clientName,
        clientSurname,
        clientEmail
    ]
    const allFieldsArray = [
        clientFieldsArray,
        studentFieldsArray
    ]

    let formIsReady = true;
    allFieldsArray.forEach(array => {
        array.forEach(element => {
            if (element === studentsArray) {
                element.forEach(student => {
                    for (const key in student) {
                        if (!student[key]) {
                            errorBookingMsg.style.display = 'flex';
                            errorBookingMsg.innerText = "Completa todos los datos del Alumno antes de continuar";
                            formIsReady = false;
                            return;
                        }
                    }
                });
            }

            if (element !== studentsArray && !element.value && array === clientFieldsArray) {
                errorBookingMsg.style.display = 'flex';
                errorBookingMsg.innerText = "Completa todos los datos del Contacto antes de continuar";
                formIsReady = false;
                return;
            }
        });
    });

    if (studentsArray.length !== studentsAmount) {
        errorBookingMsg.style.display = 'flex';
        errorBookingMsg.innerText = "El número de alumnos indicado no coincide con los alumnos añadidos";
        formIsReady = false;
        return;
    }

    if (!clientEmail.validity.valid) {
        errorBookingMsg.style.display = 'flex';
        errorBookingMsg.innerText = "Introduce un Email válido";
        formIsReady = false;
        return
    }

    if (formIsReady) {
        const formDataObject = {
            studentsAmount: studentsAmount,
            students: studentsArray,
            clientName: clientName.value,
            clientSurname: clientSurname.value,
            clientEmail: clientEmail.value,
            clientGoals: clientGoals.value,
            clientOther: clientOther.value
        }
        const instructorId = dialogDiv.getAttribute('instructorId');
        const instructorData = getInstructorData(instructorId);

        const bookingPrice = calculateBookingPrice(instructorData.price_hour, bookingData, studentsAmount, instructorData.currency_main, instructorData.price_half, instructorData.price_full)
        const bookingObject = {
            instructorId: instructorId,
            clientData: formDataObject,
            bookingData: bookingData,
            price: bookingPrice
        }

        secondStepDialog.style.display = 'none'
        thirdStepDialog.style.display = 'flex'

        const bookingDetailsReview = thirdStepDialog.querySelector('#booking-details-review');
        const detailsFieldset = document.createElement('fieldset');
        const detailsInnerHTML = createBookingDetailsDiv(instructorId, instructorData.name, bookingObject)
        detailsFieldset.innerHTML = detailsInnerHTML;
        bookingDetailsReview.appendChild(detailsFieldset)

        bookingToSend = JSON.stringify(bookingObject)


    }
})

const confirmBooking = document.querySelector('#confirm-booking')
const lastStepBack = document.querySelector('#last-step-back-dialog');
const bookingLoader = document.querySelector('#booking-loader-wrapper');
const logoDialog = document.querySelector('#logo-dialog');
const bookingLoaderWheel = document.querySelector('#booking-loader');
const bookingLoaderMsg = document.querySelector('#booking-loader-msg');
const mailer = 'https://pulso-mailer.netlify.app/.netlify/functions/api/mailer/new-booking';

lastStepBack.addEventListener('click', () => {
    thirdStepDialog.style.display = 'none';
    secondStepDialog.style.display = 'flex';
    errorBookingMsg.style.display = 'none';
    bookingDetailsReview.innerHTML = '';
    errorBookingMsg.innerText = '';
})
confirmBooking.addEventListener('click', async () => {
    thirdStepDialog.style.display = 'none';
    bookingLoaderWheel.style.display = 'flex';
    bookingLoader.style.display = 'flex';
    logoDialog.style.display = 'none';

    try {
        const response = await fetch(mailer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bookingToSend
        })
        const data = await response.json();
        console.log(JSON.stringify(data))

        if (!response.ok) {
            bookingLoaderWheel.style.display = 'none';
            bookingLoaderMsg.textContent = `Oops! No se pudo enviar la Solicitud. Vuelve a intentarlo en unos instantes. Si el problema persiste, ponte en contacto indicando el siguiente mensaje: ${data.error}`
            return
        }

        bookingLoaderWheel.style.display = 'none';
        bookingLoaderMsg.textContent = '¡Reserva solicitada con éxito! Un segundo por favor...'
        window.location.href = 'https://pulsodenieve.com/'
    } catch (error) {
        bookingLoaderWheel.style.display = 'none';
        bookingLoaderMsg.textContent = `¡Error al enviar tu Reserva! Comprueba tu conexión a Internet e inténtalo de nuevo. Si el problema persiste ponte en contacto con nosotros indicando el siguiente mensaje:
        ${error.message}`
    }

})



function createBookingSlots(availability) {
    const bookableDates = [];
    availability.forEach(date => {
        const fullDate = new Date(date.date);
        const dayNumber = fullDate.getDate();
        const dayName = date.week_day;
        const slots = date.slots;

        const slotsArray = [];
        const slotDate = formatDate(fullDate);

        slots.forEach(slot => {
            const slotTime = slot.time;
            const slotStatus = slot.status;
            let slotClass;
            let disabledAttr = ''

            if (slotStatus !== "Free") {
                slotClass = "slot-label-else";
                disabledAttr = 'disabled';
            } else {
                slotClass = "slot-label-free"
            }

            slotBox = `
                <input type="checkbox" class="slot-hidden-checkbox" id="slot-${slotTime}-${dayNumber}" date="${slotDate}" name="booking-slots" value="${slotTime}" ${disabledAttr}>
                <label for="slot-${slotTime}-${dayNumber}"  class="${slotClass}">${slotTime}</label>
            `
            slotsArray.push(slotBox)
        })

        const dateObject = {
            dayNum: dayNumber,
            dayName: dayName,
            daySlots: slotsArray.join('')
        }

        bookableDates.push(dateObject)
    })

    return bookableDates;

}

function cleanSlotsDiv() {
    bookingDatesDiv.innerHTML = ''
}


const MAX_PROFILES = 50; // Set a limit for how many profiles you want to store

function setInstructorData(key, data) {
    let keys = JSON.parse(sessionStorage.getItem('instructor_keys')) || [];
    if (keys.includes(key)) {
        keys = keys.filter(k => k !== key);
        sessionStorage.removeItem(key);
    }

    keys.push(key);

    if (keys.length > MAX_PROFILES) {
        const oldestKey = keys.shift();
        sessionStorage.removeItem(oldestKey);
    }

    sessionStorage.setItem('instructor_keys', JSON.stringify(keys));
    sessionStorage.setItem(key, JSON.stringify(data));
}

function getInstructorData(key) {
    return JSON.parse(sessionStorage.getItem(`instructor_${key}`));
}


function calculateBookingPrice(priceHour, dates, numStudents, mainCurrency, priceHalf, priceFull) {
    const datesCostArray = []
    console.log('priceHour : ', priceHour);
    console.log('dates : ', dates);
    console.log('numStudents : ', numStudents);
    console.log('mainCurrency : ', mainCurrency);
    console.log('priceHalf : ', priceHalf);
    console.log('priceFull : ', priceFull);

    dates.forEach(date => {
        const dateSlotsLength = date.slots.length

        if (dateSlotsLength >= 3 && dateSlotsLength < 6) {
            const hoursToAdd = dateSlotsLength - 3;
            const costToAdd = hoursToAdd * priceHour;
            const totalCostDate = parseInt(priceHalf) + costToAdd;
            datesCostArray.push(totalCostDate);
        } else if (dateSlotsLength >= 6) {
            const hoursToAdd = dateSlotsLength - 6;
            const costToAdd = hoursToAdd * priceHour;
            const totalCostDate = parseInt(priceFull) + costToAdd
            datesCostArray.push(totalCostDate);
        } else {
            const totalCostDate = dateSlotsLength * parseInt(priceHour)
            datesCostArray.push(totalCostDate)
        }
    })

    const totalDatesCost = datesCostArray.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0)

    const datesCostTimesStuds = totalDatesCost * numStudents
    const totalCostObject = {
        totalCost: datesCostTimesStuds,
        currency: mainCurrency
    }

    return totalCostObject
}

function createBookingDetailsDiv(instructorId, instructorName, bookingObject) {
    const datesData = bookingObject.bookingData;
    const datesDataHtmlArray = []
    datesData.forEach(date => {
        const slots = date.slots;
        const slotsOfDateArray = [];

        slots.forEach(slot => {
            const slotStartTime = slot;
            const slotEndTime = addOneHour(slotStartTime);
            const slotTimesString = `${slotStartTime} a ${slotEndTime}`;
            slotsOfDateArray.push(slotTimesString);
        })

        const dateHTML = `<li><span class="details-semibold">Fecha: </span>${date.date} - <span class="details-semibold">Bloques: </span>${slotsOfDateArray.join(', ')}</li>`
        datesDataHtmlArray.push(dateHTML)
    })

    const detailsHtml = `
        <p><span class="details-bold">Instructor ID: </span>${instructorId}</p>
        <p><span class="details-bold">Instructor: </span>${instructorName}</p>
        <p><span class="details-bold">Fecha - Bloques de Reserva:</span></p>
            <ul id="details-date-list">
                ${datesDataHtmlArray.join('')}
            </ul>
        
        <p><span class="details-bold">Número de Alumnos: </span>${bookingObject.clientData.studentsAmount}</p>
        <p><span class="details-bold">Titular Reserva: </span>${bookingObject.clientData.clientName} ${bookingObject.clientData.clientSurname}</p>
        <p><span class="details-bold">Email Reserva: </span>${bookingObject.clientData.clientEmail}</p>
        <p><span class="details-bold">Precio Estimado: </span>${bookingObject.price.totalCost} ${bookingObject.price.currency}</p>
        `

    return detailsHtml
}

function addOneHour(timeString) {
    let [hours, minutes] = timeString.split(':').map(Number);

    let date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    date.setHours(date.getHours() + 1);

    let newHours = String(date.getHours()).padStart(2, '0');
    let newMinutes = String(date.getMinutes()).padStart(2, '0');

    return `${newHours}:${newMinutes}`;
}


function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    endDate = new Date(endDate);

    while (currentDate <= endDate) {
        dates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

