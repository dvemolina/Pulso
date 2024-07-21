const modsList = {
    "Alpino": "../assets/disciplines/Alpine.png",
    "Freeride": "../assets/disciplines/Freeride.png",
    "Freestyle": "../assets/disciplines/Freestyle.png",
    "Touring": "../assets/disciplines/Touring.png",
    "Adaptado": "../assets/disciplines/Adaptive.png"
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const instructorId = urlParams.get('id');
    const instructorData = JSON.parse(sessionStorage.getItem(`instructor_${instructorId}`));
    if (instructorId) {

        if (instructorData) {
            const profileImg = document.querySelector('#avatar-img');
            const name = document.querySelector('#avatar-name');
            const location = document.querySelector('#avatar-location');
            const priceHour = document.querySelector('#avatar-price-hour');
            const priceHalf = document.querySelector('#avatar-price-half');
            const priceFull = document.querySelector('#avatar-price-full');
            const sportDivSki = document.querySelector('#ski-div');
            const sportDivSnow = document.querySelector('#snowboard-div');
            const skiModsDiv = document.querySelector('#ski-mods');
            const snowModsDiv = document.querySelector('#snowboard-mods')
            const services = document.querySelector('#services-txt');
            const languages = document.querySelector('#languages');
            const seasons = document.querySelector('#seasons');
            const qualification = document.querySelector('#qualification');
            const association = document.querySelector('#association');
            const resort = document.querySelector('#resort');
            const ageGroup = document.querySelector('#age-group');
            const clientLevel = document.querySelector('#client-level');
            const bio = document.querySelector('#tagline');
            const reviewsDiv = document.querySelector('#reviews-contenido')

            sportDivSki.style.display = 'none';
            sportDivSnow.style.display = 'none';

            if (instructorData.img_avatar) {
                profileImg.src = instructorData.img_avatar
            } else {
                profileImg.src = "../assets/favicon-logo.png";
            }

            name.innerText = instructorData.name;

            if (instructorData.currency_alt) {
                priceHour.innerText = `${instructorData.price_hour} ${instructorData.currency_main} / ${instructorData.price_hour_alt} ${instructorData.currency_alt}`;
                priceHalf.innerText = `${instructorData.price_half} ${instructorData.currency_main} / ${instructorData.price_half_alt} ${instructorData.currency_alt}`;
                priceFull.innerText = `${instructorData.price_full} ${instructorData.currency_main} / ${instructorData.price_full_alt} ${instructorData.currency_alt}`;
            } else {
                priceHour.innerText = `${instructorData.price_hour} ${instructorData.currency_main}`;
                priceHalf.innerText = `${instructorData.price_half} ${instructorData.currency_main}`;
                priceFull.innerText = `${instructorData.price_full} ${instructorData.currency_main}`;
            }

            instructorData.sports.forEach(sport => {
                if (sport.sport === 'Ski') {
                    sportDivSki.style.display = 'flex';
                    if (sport.mods && sport.mods.length !== 0) {
                        sport.mods.forEach(mod => {
                            const modName = mod;
                            const modImg = modsList[mod];
                            const modElement = document.createElement('div');
                            modElement.classList.add('mod-unit');

                            modElement.innerHTML = `
                            <img class="mod-img" src="${modImg}" alt="">
                            <p>${modName}</p> 
                            `
                            skiModsDiv.appendChild(modElement)
                        })
                    }
                }

                if (sport.sport === 'Snowboard') {
                    sportDivSnow.style.display = 'flex';
                    if (sport.mods && sport.mods.length !== 0) {
                        sport.mods.forEach(mod => {
                            const modName = mod;
                            const modImg = modsList[mod];
                            const modElement = document.createElement('div');
                            modElement.classList.add('mod-unit');

                            modElement.innerHTML = `
                            <img class="mod-img" src="${modImg}" alt="">
                            <p>${modName}</p> 
                            `
                            snowModsDiv.appendChild(modElement)
                        })
                    }
                }
            })

            if (instructorData.reviews && instructorData.reviews.length > 0) {
                reviewsDiv.innerHTML = ''
                instructorData.reviews.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.classList.add('review-card');
                    reviewElement.innerHTML = `
                    <div class="review-header">
                        <div class="client-name">${review.cientName}</div>
                        <div class="booked-sport"><span class="label-review">Deporte: </span>${review.bookedSport}</div>
                        <div class="review-rating"><span class="label-review">Valoración: </span>${review.rating}5</div>
                    </div>
                    <div class="review-content">
                        <div class="review-text">
                            ${review.text}
                        </div>
                    </div>
                    `
                    reviewsDiv.appendChild(reviewElement)
                })
            } else {
                reviewsDiv.innerHTML = `<p id="no-reviews">Yo te cuido en la Montaña, tu me apoyas con tu Valoración! Reserva conmigo y ayúdame a crecer! </p>`
            }

            location.innerText = instructorData.resort || ' - ';
            services.innerText = instructorData.services_txt || 'Aún estoy organizando mis servicios pero no dudes en Reservar para contactar conmigo y obtener más información!';
            languages.innerText = instructorData.languages;
            seasons.innerText = `${instructorData.season_num}+` || ' - ';
            qualification.innerText = `Nivel ${instructorData.qualification}`;
            association.innerText = instructorData.association || ' - ';
            resort.innerText = instructorData.resort || ' - ';
            clientLevel.innerText = instructorData.client_level || 'Sin preferencias';
            ageGroup.innerText = instructorData.age_group || 'Sin preferencias';
            bio.innerText = `"${instructorData.txt_bio_profile || 'Aquí te debería explicar un poco más sobre mí, pero prefiero explicártelo en persona ¡Reserva conmigo para conocernos y explorar la montaña juntos!'}"`;


        }
    }

    const reserveBtn = document.querySelector('#book-btn');

    reserveBtn.addEventListener('click', () => {
        startBookingProcess(instructorId, instructorData)
    })
})

