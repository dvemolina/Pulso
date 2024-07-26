const logoBubble = document.querySelector('#logo-bubble')

logoBubble.addEventListener('click', () => {
    window.location = 'https://pulsodenieve.com'
})

const selectorResortFS = '#resort_fs'
const selectorResortBB = '#big-bub-location'
const selectorResortDia = '#dia-bub-location'

document.addEventListener('DOMContentLoaded', () => {
    createResortOptions(selectorResortFS);
    createResortOptions(selectorResortBB);
    createResortOptions(selectorResortDia);
})

//------- FIRST SEARCH -------
const btnFs = document.querySelector('#first-search-btn');
const errorFs = document.getElementById('error_fs')
const preFinderDiv = document.getElementById('pre__finder__container');
const finderDiv = document.getElementById('finder__container');
let todayDate = new Date();
todayDate.setDate(todayDate.getDate() - 1);

btnFs.addEventListener('click', async () => {
    const sportsFs = Array.from(document.querySelectorAll('.fs__sports input:checked')).map(input => input.name);
    const resortFs = document.querySelector('#resort_fs').value;
    const startDateFs = document.querySelector('#start_date_fs').value;
    const endDateFs = document.querySelector('#end_date_fs').value;
    const loaderWrapper = document.getElementById('loader-wrapper');
    const firstSearchDiv = document.getElementById('first__search__container');

    if (!sportsFs.length) {
        errorFs.innerText = 'Selecciona al menos un Deporte';
        return;
    }

    if (!resortFs) {
        errorFs.innerText = 'Selecciona Centro de Esquí';
        return;
    }

    let dateRange;
    if (!startDateFs) {
        errorFs.innerText = 'Introduce una Fecha de Inicio';
        return;
    } else if (endDateFs) {
        if (startDateFs > endDateFs) {
            errorFs.innerText = 'Selecciona una Fecha de Inicio anterior a la Fecha Final';
            return;
        }
        dateRange = getDatesInRange(startDateFs, endDateFs);
    } else if (startDateFs === endDateFs) {
        dateRange = [startDateFs];
    } else if (new Date(startDateFs) < todayDate) {
        errorFs.innerText = 'Introduce una Fecha que no sea anterior a Hoy';
        return;
    } else {
        dateRange = [startDateFs];
    }

    try {
        // Sync values to Big Bubble section
        document.querySelector('#big-bub-ski').checked = sportsFs.includes('Ski');
        document.querySelector('#big-bub-snowboard').checked = sportsFs.includes('Snowboard');
        document.querySelector('#big-bub-location').value = resortFs;
        document.querySelector('#big-bub-start_date').value = startDateFs;
        document.querySelector('#big-bub-end_date').value = endDateFs;

        // Sync values to Dialog section
        document.querySelector('#dia-bub-ski').checked = sportsFs.includes('Ski');
        document.querySelector('#dia-bub-snowboard').checked = sportsFs.includes('Snowboard');
        document.querySelector('#dia-bub-location').value = resortFs;
        document.querySelector('#dia-bub-start_date').value = startDateFs;
        document.querySelector('#dia-bub-end_date').value = endDateFs;

        firstSearchDiv.style.display = 'none';
        loaderWrapper.style.display = 'flex';
        const urlParams = new URLSearchParams();
        sportsFs.forEach(sport => urlParams.append('sports', encodeURIComponent(sport)));
        dateRange.forEach(date => urlParams.append('dates', encodeURIComponent(new Date(date).toISOString().split('T')[0])));
        urlParams.append('resort', encodeURIComponent(resortFs));

        const urlString = `${pulso}instructors?${urlParams.toString()}`;
        
        const response = await fetch(urlString);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        const instructors = data.data;

        if (instructors.length) {
            shuffleArray(instructors)
            instructors.forEach(instructor => {
                const instructorCard = createInstructorCard(instructor);
                instructorWrapper.appendChild(instructorCard);
            });

            preFinderDiv.style.display = 'none';
            loaderWrapper.style.display = 'none';
            finderDiv.style.display = 'flex';

        } else {
            firstSearchDiv.style.display = 'flex';
            loaderWrapper.style.display = 'none';
            errorFs.innerText = 'No hay Instructores disponibles. Prueba con otras fechas!';
        }
    } catch (error) {
        console.error('Algo no funcionó correctamente', error);
        firstSearchDiv.style.display = 'flex';
        loaderWrapper.style.display = 'none';
        errorFs.innerText = `Algo no funcionó correctamente. Comprueba tu conexión a internet y vuelve a intentarlo en unos instantes. Si el problema persiste, ponte en contacto indicando el siguiente mensaje: ${error}`;
    }
});

//------- FINDER -------
const instructorList = document.querySelector('#instructor__section');

const fetchBtn = document.querySelector('#fetch-btn-mainfinder');
const instructorWrapper = document.querySelector('#instructor-wrapper');
const pulso = 'https://pulso-finder.netlify.app/.netlify/functions/api/finder/';

fetchBtn.addEventListener('click', async () => {
    const instructorLoader = document.querySelector('#instructor-loader-wrapper');
    const loaderCircle = document.querySelector('#instructor-loader');
    const msgNoInstructors = document.querySelector('#instructor-searching-msg');

    const location = document.getElementById('big-bub-location').value;
    const startDate = document.getElementById('big-bub-start_date').value;
    const endDate = document.getElementById('big-bub-end_date').value;

    const sports = Array.from(document.querySelectorAll('.sports-bubble input:checked'))
        .map(input => input.name);

    const params = new URLSearchParams();
    if (location) params.append('resort', location);
    sports.forEach(sport => params.append('sports', sport));

    if (!location) {
        alert('Selecciona un Centro para realizar una nueva búsqueda');
        return
    }

    if (!sports.length) {
        alert('Selecciona al menos un Deporte para realizar una nueva búsqueda');
        return
    }

    let dateRange;
    if (!startDate) {
        alert('Introduce una Fecha de Inicio');
        return;
    } else if (endDate) {
        if (startDate > endDate) {
            alert('Selecciona una Fecha de Inicio anterior a la Fecha Final');
            return;
        }
        dateRange = getDatesInRange(startDate, endDate);
    } else if (startDate === endDate) {
        dateRange = [startDate];
    } else if (new Date(startDate) < todayDate) {
        alert('Introduce una Fecha que no sea anterior a Hoy');
        return;
    } else {
        dateRange = [startDate];
    }

    dateRange.forEach(date => params.append('dates', date));

    try {
        instructorWrapper.innerHTML = '';
        loaderCircle.style.display = 'block';
        instructorLoader.style.display = 'flex';
        msgNoInstructors.innerText = 'Buscando Instructores disponibles...';

        // Sync values to Dialog section
        document.querySelector('#dia-bub-ski').checked = sports.includes('Ski');
        document.querySelector('#dia-bub-snowboard').checked = sports.includes('Snowboard');
        document.querySelector('#dia-bub-location').value = location;
        document.querySelector('#dia-bub-start_date').value = startDate;
        document.querySelector('#dia-bub-end_date').value = endDate;

        const response = await fetch(`${pulso}instructors?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        const instructors = data.data;

        if (instructors.length) {
            instructors.forEach(instructor => {
                const instructorCard = createInstructorCard(instructor);
                instructorWrapper.appendChild(instructorCard);
            });
            instructorLoader.style.display = 'none';
        } else {
            loaderCircle.style.display = 'none';
            msgNoInstructors.innerText = 'Ningún instructor disponible para tu búsqueda. Prueba otras fechas.';
        }
    } catch (error) {
        console.error('Error with the API', error);
    }
});



function createInstructorCard(instructor) {
    try {
        const card = document.createElement('div');
        card.classList.add('card__gp')

        const sports = []
        instructor.sports.forEach(sport => {
            sports.push(sport.sport)
        })


        card.innerHTML = `
        <div class="card__gp" style="background-image: url(${instructor.img_avatar})">
            <div class="card__avatar__avatar" >
                <div class="card__avatar--left">
                    <div id="card__avatar__sports">
                            ${addSportCardIcon(sports, 'Ski')}
                            ${addSportCardIcon(sports, 'Snowboard')}
                    </div>
                </div>
                <div class="card__avatar--right">
                    <div class="avatar__id__container">
                        <img class="id-logo" src="../assets/logo-slim.png" alt="">
                        <p class="id-number">${instructor.id_profesional}</p>
                    </div>
                </div>
            </div>
            <div class="card__avatar__info__box">
                <div class="card__avatar__info">
                    <div class="card__info--left">
                        <div class="info__name">${instructor.name}</div>
                        <div class="info__prices">
                            <div class="price--hour">1h - <span>${instructor.price_hour} ${instructor.currency_main}</span> </div>
                            <div class="price--hour">3h - <span>${instructor.price_half} ${instructor.currency_main}</span> </div>
                            <div class="price--day">6h - <span>${instructor.price_full} ${instructor.currency_main}</span></div>
                        </div>
                    </div>
                    <div class="card__info--right">
                        <div class="info--right--age_group">
                            <ion-icon class="card-filters-icon" name="finger-print-outline"></ion-icon> ${instructor.age_group || 'Sin especificar'}
                        </div>
                        <div class="info--right--languages">
                            <ion-icon class="card-filters-icon" name="chatbubbles-outline"></ion-icon>
                        </div>
                        <div class="info--right--client_level">
                            <ion-icon class="card-filters-icon" name="stats-chart-outline"></ion-icon> ${instructor.client_level || 'Sin especificar'}
                        </div>
                        <div class="info--right--currencies">
                            <ion-icon class="card-filters-icon" name="cash-outline"></ion-icon> ${instructor.currency_main}  ${instructor.currency_alt || ''}
                        </div>
                        <div class="info--right--qualification">
                            <ion-icon name="ribbon-outline"></ion-icon> Nivel ${instructor.qualification || '-'}
                        </div>
                    </div>
                    <div class="card__avatar__bio">
                        <div id="pull__bio">
                            <ion-icon id="pull__bio__icon"  name="chevron-up"></ion-icon>
                        </div>
                        <p id="bio__text">${instructor.txt_bio_card || 'Entra al Perfil para conocer más sobre mi'}</p>
                    </div>  
                </div>
                <div class="card__avatar__btns">
                    <div class="card__btns--left">
                        <button class="card__btn btn--profile">
                            <ion-icon class="btn-icon" name="person-circle-outline"></ion-icon>
                            <p>Perfil</p>
                        </button>
                    </div>
                    <div class="card__btns--right">
                        <button class="card__btn btn--booking">
                            <ion-icon class="btn-icon" name="calendar-outline"></ion-icon>
                            <p>Reservar</p>   
                        </button>
                    </div> 
                </div>
            </div>
        </div>`

        const instructorId = instructor.id_profesional;

        const cardContainer = card.querySelector('.card__gp');
        cardContainer.addEventListener('click', (event) => {
            event.currentTarget.classList.toggle('card__gp--expanded');
        });

        const profileBtn = card.querySelector('.btn--profile')
        profileBtn.addEventListener('click', () => {

            setInstructorData(`instructor_${instructorId}`, instructor);
            window.open(`https://pulsodenieve.com/pulso/core/profile_instructor.html?id=${instructorId}`, '_blank');
        })

        const bookingBtn = card.querySelector('.btn--booking')
        bookingBtn.addEventListener('click', () => {
            setInstructorData(`instructor_${instructorId}`, instructor);
            cleanSlotsDiv();
            dialogDiv.removeAttribute('instructorId');
            dialogDiv.style.display = 'flex';
            dialogDiv.setAttribute('instructorId', `${instructorId}`);
            const availability = instructor.availability;
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

        })

        return card
    } catch (error) {
        console.error('Error creating the card', error.message)
        throw error
    }

}


function addSportCardIcon(sportsArray, sportName) {
    if (sportsArray.includes(sportName) && sportName === 'Ski') {
        const skiIcon = `
        <div class="card-sport-icon">
            <img src="../assets/skier-icon-pixel.png" alt="Ski Icon">
        </div> 
        `;
        return skiIcon;
    }

    if (sportsArray.includes(sportName) && sportName === 'Snowboard') {
        const snowboardIcon = `
        <div class="card-sport-icon">
            <img src="../assets/snowboarder-icon-pixel.png" alt="Snowboard Icon">
        </div> 
        `;
        return snowboardIcon;
    }

    return ''
}



