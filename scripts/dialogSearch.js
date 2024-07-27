const dialogSearchBtn = document.getElementById('dialog-btn-open');
const helpBtn = document.getElementById('help-unit');
const optionsBtn = document.getElementById('options-unit');
const closeSearchDialogBtn = document.getElementById('dia-bub-cancel');
const searchBtn = document.getElementById('dia-bub-btn')

const dialogBubble = document.getElementById('dialog-bubble');
const searchDialog = document.getElementById('dialog-search-div')
const optionsDialog = document.getElementById('options-dialog');
const diaBubErrorMsg = document.getElementById('dia-bub-error')

searchBtn.addEventListener('click', async () => {
    if (searchDialog.style.display === 'flex') {

        const instructorLoader = document.querySelector('#instructor-loader-wrapper');
        const loaderCircle = document.querySelector('#instructor-loader');
        const msgNoInstructors = document.querySelector('#instructor-searching-msg');

        const location = document.getElementById('dia-bub-location').value;
        const startDate = document.getElementById('dia-bub-start_date').value;
        const endDate = document.getElementById('dia-bub-end_date').value;

        const sports = Array.from(document.querySelectorAll('.dia-bub-sport input:checked'))
            .map(input => input.name);

        const params = new URLSearchParams();
        if (location) params.append('resort', location);
        sports.forEach(sport => params.append('sports', sport));

        if (!location) {
            diaBubErrorMsg.textContent = 'Selecciona un Centro para realizar una nueva búsqueda';
            return
        }

        if (!sports.length) {
            diaBubErrorMsg.textContent = 'Selecciona al menos un Deporte para realizar una nueva búsqueda';
            return
        }

        let dateRange;
        if (!startDate) {
            diaBubErrorMsg.textContent = 'Introduce una Fecha de Inicio';
            return;
        } else if (endDate) {
            if (startDate > endDate) {
                diaBubErrorMsg.textContent = 'Selecciona una Fecha de Inicio anterior a la Fecha Final';
                return;
            }
            dateRange = getDatesInRange(startDate, endDate);
        } else if (startDate === endDate) {
            dateRange = [startDate];
        } else if (new Date(startDate) < todayDate) {
            diaBubErrorMsg.textContent = 'Introduce una Fecha que no sea anterior a Hoy';
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
            dialogBubble.close();

            // Sync values to Big Bubble section
            document.querySelector('#big-bub-ski').checked = sports.includes('Ski');
            document.querySelector('#big-bub-snowboard').checked = sports.includes('Snowboard');
            document.querySelector('#big-bub-location').value = location;
            document.querySelector('#big-bub-start_date').value = startDate;
            document.querySelector('#big-bub-end_date').value = endDate;

            const response = await fetch(`${pulso}instructors?${params.toString()}`);
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
                instructorLoader.style.display = 'none';
            } else {
                loaderCircle.style.display = 'none';
                msgNoInstructors.innerText = 'Ningún instructor disponible para tu búsqueda. Prueba otras fechas.';
            }
        } catch (error) {
            console.error('Error with the API', error);
        }
    } else if (optionsDialog.style.display === 'flex') {
        const filters =  getSelectedFilters();
        filterInstructorCards(filters)
    }
    
})

closeSearchDialogBtn.addEventListener('click', () => {
    dialogBubble.close();
})
dialogSearchBtn.addEventListener('click', () => {
    dialogBubble.showModal();
    searchDialog.style.display = 'flex'
    optionsDialog.style.display = 'none';
})
optionsBtn.addEventListener('click', () => {
    dialogBubble.showModal();
    searchDialog.style.display = 'none'
    optionsDialog.style.display = 'flex';
})

//Filter System

function getSelectedFilters() {
    const filters = {
        disciplines: [],
        persons: document.getElementById('persons').value,
        languages: document.getElementById('languages').value,
        level: document.getElementById('level').value,
        ageGroup: document.querySelector('select[name="age_group"]').value,
        currency: document.getElementById('currency').value,
        maxPriceHour: document.getElementById('precio_max_hora').value,
        maxPriceDay: document.getElementById('precio_max_dia').value,
    };

    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        filters.disciplines.push(checkbox.name);
    });

    return filters;
}

function filterInstructorCards(filters) {
    const cards = document.querySelectorAll('.card__gp');

    cards.forEach(card => {
        const instructorId = card.querySelector('.id-number').textContent;
        const instructor = getInstructorData(`instructor_${instructorId}`);

        let showCard = true;

        // Check disciplines
        if (filters.disciplines.length && !filters.disciplines.some(discipline => instructor.sports.includes(discipline))) {
            showCard = false;
        }

        // Check persons
        if (filters.persons && instructor.persons !== filters.persons) {
            showCard = false;
        }

        // Check languages
        if (filters.languages && !instructor.languages.includes(filters.languages)) {
            showCard = false;
        }

        // Check level
        if (filters.level && instructor.client_level !== filters.level) {
            showCard = false;
        }

        // Check age group
        if (filters.ageGroup && instructor.age_group !== filters.ageGroup) {
            showCard = false;
        }

        // Check currency
        if (filters.currency && instructor.currency_main !== filters.currency) {
            showCard = false;
        }

        // Check max price per hour
        if (filters.maxPriceHour && instructor.price_hour > filters.maxPriceHour) {
            showCard = false;
        }

        // Check max price per day
        if (filters.maxPriceDay && instructor.price_full > filters.maxPriceDay) {
            showCard = false;
        }

        // Show or hide the card based on the filters
        card.style.display = showCard ? 'block' : 'none';
    });
}



