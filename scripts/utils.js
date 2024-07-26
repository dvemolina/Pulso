const resortsList = [
  { value: '', text: ' ---- CENTROS ESPAÑA ----' },
  { value: 'altocampoo-3', text: 'Alto Campoo' },
  { value: 'aramoncerler-3', text: 'Aramon-Cerler' },
  { value: 'aramonformigal-3', text: 'Aramon-Formigal' },
  { value: 'aramonjavalambre-3', text: 'Aramon-Javalambre' },
  { value: 'aramonpanticosa-3', text: 'Aramon-Panticosa' },
  { value: 'aramonvaldelinares-3', text: 'Aramon-Valdelinares' },
  { value: 'astun-3', text: 'Astún' },
  { value: 'baqueiraberet-3', text: 'Baqueira-Beret' },
  { value: 'boitaull-3', text: 'Boi-Taüll' },
  { value: 'candanchu-3', text: 'Candanchú' },
  { value: 'espotesqui-3', text: 'Espot-Esquí' },
  { value: 'fuentesdeinvierno-3', text: 'Fuentes de Invierno' },
  { value: 'lamolina-3', text: 'La Molina' },
  { value: 'lapinilla-3', text: 'La Pinilla' },
  { value: 'larrabelagua-3', text: 'Larra-Belagua(Fondo)' },
  { value: 'leitariegos-3', text: 'Leitariegos' },
  { value: 'llanosdelhospital-3', text: 'Llanos del Hospital(Fondo)' },
  { value: 'lles-3', text: 'Lles(Fondo)' },
  { value: 'masella-3', text: 'Masella' },
  { value: 'ocanovamanzanilla-3', text: 'Oca Nova Manzanilla' },
  { value: 'portaine-3', text: 'Port-Ainé' },
  { value: 'puertodelaragua-3', text: 'Puerto de la Ragua(Fondo)' },
  { value: 'puertodenavacerrada-3', text: 'Puerto de Navacerrada' },
  { value: 'sanisidro-3', text: 'San Isidro' },
  { value: 'sierradebejarlacovatilla-3', text: 'Sierra de Béjar-La Covatilla' },
  { value: 'sierranevada-3', text: 'Sierra Nevada' },
  { value: 'tavascan-3', text: 'Tavascán' },
  { value: 'valdesqui-3', text: 'Valdesquí' },
  { value: 'valdezcaray-3', text: 'Valdezcaray' },
  { value: 'valgrandepajares-3', text: 'Valgrande-Pajares' },
  { value: 'valldenuria-3', text: 'Vall de Núria' },
  { value: 'vallter2000-3', text: 'Vallter 2000' },
  { value: 'madridsnowzone-3', text: 'Indoor Madrid SnowZone' },
  { value: '', text: ' ---- CENTROS ARGENTINA ----' },
  { value: 'calafate-1', text: 'Calafate Mountain Park' },
  { value: 'catedral-1', text: 'Cerro Catedral-Alta Patagonia' },
  { value: 'caviahue-1', text: 'Caviahue' },
  { value: 'bateamahuida-1', text: 'Cerro Batea Mahuida' },
  { value: 'cerrobayo-1', text: 'Cerro Bayo' },
  { value: 'cerrocastor-1', text: 'Cerro Castor' },
  { value: 'cerrowayle-1', text: 'Cerro Wayle' },
  { value: 'chapelco-1', text: 'Chapelco' },
  { value: 'glaciarmartial-1', text: 'Glaciar Martial' },
  { value: 'lahoya-1', text: 'La Hoya' },
  { value: 'lagohermoso-1', text: 'Lago Hermoso' },
  { value: 'laslenas-1', text: 'Las Leñas' },
  { value: 'laspendientes-1', text: 'Las Pendientes' },
  { value: 'lospenitentes-1', text: 'Los Penitentes' },
  { value: 'lospuquios-1', text: 'Los Puquios' },
  { value: 'peritomoreno-1', text: 'Perito Moreno' },
  { value: 'primerospinos-1', text: 'Primeros Pinos' },
  { value: 'valdelen-1', text: 'Valdelen' },
  { value: 'vallecitos-1', text: 'Vallecitos' },
  { value: '', text: ' ---- CENTROS CHILE ----' },
  { value: 'antillanca-2', text: 'Antillanca' },
  { value: 'antuco-2', text: 'Antuco' },
  { value: 'elfraile-2', text: 'Cerro El Fraile' },
  { value: 'cerromirador-2', text: 'Cerro Mirador' },
  { value: 'chapaverde-2', text: 'Chapa Verde' },
  { value: 'corralco-2', text: 'Corralco' },
  { value: 'elarpa-2', text: 'El Arpa' },
  { value: 'elcolorado-2', text: 'El Colorado' },
  { value: 'farellones-2', text: 'Farellones' },
  { value: 'laparva-2', text: 'La Parva' },
  { value: 'lagunillas-2', text: 'Lagunillas' },
  { value: 'lasaraucarias-2', text: 'Las Araucarias' },
  { value: 'lonquimay-2', text: 'Lonquimay' },
  { value: 'nevadosdechillan-2', text: 'Nevados de Chillán' },
  { value: 'portillo-2', text: 'Portillo' },
  { value: 'pucón-2', text: 'Pucón' },
  { value: 'skinolimit-2', text: 'SkiNoLimit' },
  { value: 'vallehermoso-2', text: 'Valle Hermoso' },
  { value: 'vallenevado-2', text: 'Valle Nevado' },
  { value: 'osorno-2', text: 'Volcán Osorno' },
  { value: 'granvalira-4', text: 'Granvalira' },
  { value: 'ordinoarcalis-4', text: 'Ordino Arcalís' },
  { value: 'palarinsal-4', text: 'Pal Arinsal' },
  { value: 'skicanaro-4', text: 'Ski Canaro' },
];

function createResortOptions(dropdownSelector) {
  const select = document.querySelector(dropdownSelector);
  resortsList.forEach(resort => {
    const option = document.createElement('option');
    option.value = resort.value;
    option.text = resort.text;
    select.appendChild(option);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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