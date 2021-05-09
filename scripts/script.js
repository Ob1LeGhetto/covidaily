let today = new Date();
let focusDate = new Date();
focusDate.setDate(today.getDate() - 2);
let date = focusDate.toLocaleDateString('FR');
focusDate = focusDate.toISOString();
$('.dateToday').append(date);

$('.countries').click(() => {
    $('.countries-tab').css('right', '0vw');
    $('.country-choice-bg').fadeIn(0, () => {
        $('.country-choice-bg').css('opacity', '1');
    });
});

$('.country-choice-bg').click(() => {
    closeCountriesTab();
});

let calcCases = [];
const pays = [];
let selectedCountry = 'france';

$.ajax({
    url: 'https://api.covid19api.com/countries',
    dataType: 'json'
}).done((data) => {
    for (let i = 0; i < data.length; i++) {
        pays.push({
            Country: data[i].Country,
            Slug: data[i].Slug
        });
    }

    pays.sort((a, b) => (a.Country > b.Country ? 1 : b.Country > a.Country ? -1 : 0));

    pays.forEach((paysNom) => {
        $('#countries').append(`<option id="${paysNom['Slug']}" value="${paysNom['Country']}">${paysNom['Country']}</option>`);
        $('#countries-displayed').append(`<small class="tab-countries" id="${paysNom['Slug']}">${paysNom['Country']}</small>`);
    });
});

function changeSelectedCountry() {
    selectedCountry = $('#countries option[value="' + $('#country-choice').val() + '"]').attr('id');

    reloadCountryData();
}

$(window).on('load', function () {
    $('.tab-countries').on('click', function () {
        selectedCountry = $(this).attr('id');
        $('#countries').val($(this).text());
        $('#selected-country-value').text($(this).text());

        closeCountriesTab();
        reloadCountryData();
    });
});

function reloadCountryData() {
    calcCases = [];

    $.ajax({
        url: `https://api.covid19api.com/total/country/${selectedCountry}`,
        dataType: 'json'
    }).done((countryData) => {
        dataToObjArray(calcCases, countryData);
        for (let i = 0; i < $('.number-data').length; i++) {
            $('.number-data')[i].textContent = '';
        }
        insertDataIntoHtml(calcCases);
        retrieveSpecificData();
    });
}

function dataToObjArray(array, dataFromApi) {
    let checkData = dataFromApi[dataFromApi.length - 2];
    if (checkData === undefined) {
        array.push({
            Deaths: ['NaN*', 'NaN*', 'NaN*'],
            Recovered: ['NaN*', 'NaN*', 'NaN*'],
            Confirmed: ['NaN*', 'NaN*', 'NaN*'],
            Total: ['NaN*', 'NaN*'],
            TotalDeaths: 'NaN*'
        });
    } else {
        array.push({
            Deaths: [dataFromApi[dataFromApi.length - 2].Deaths, dataFromApi[dataFromApi.length - 3].Deaths, dataFromApi[dataFromApi.length - 4].Deaths],
            Recovered: [
                dataFromApi[dataFromApi.length - 2].Recovered,
                dataFromApi[dataFromApi.length - 3].Recovered,
                dataFromApi[dataFromApi.length - 4].Recovered
            ],
            Confirmed: [
                dataFromApi[dataFromApi.length - 2].Confirmed,
                dataFromApi[dataFromApi.length - 3].Confirmed,
                dataFromApi[dataFromApi.length - 4].Confirmed
            ],
            Total: [dataFromApi[dataFromApi.length - 2].Active, dataFromApi[dataFromApi.length - 30].Active],
            TotalDeaths: dataFromApi[dataFromApi.length - 1].Deaths
        });
    }
}

function insertDataIntoHtml(array) {
    if (typeof array[0].Confirmed[0] === 'string') {
        for (let i = 0; i < $('.number-data').length; i++) {
            $('.number-data')[i].textContent = 'NaN*';
        }
        $('.svg-arrow').css('visibility', 'hidden');
        $('#nan-alert').css('visibility', 'visible');
    } else {
        $('.svg-arrow').css('visibility', 'visible');
        $('#nan-alert').css('visibility', 'hidden');
        document.getElementById('num-pos-cases').innerText = (array[0].Confirmed[0] - array[0].Confirmed[1]).toLocaleString();
        if (valuesComparison('Confirmed', array)) {
            document.getElementById('pos-cases-arrow').src = document.getElementById('pos-cases-arrow').src.replace('red', 'green');
            $('#pos-cases-arrow').addClass('neg');
        } else {
            document.getElementById('pos-cases-arrow').src = document.getElementById('pos-cases-arrow').src.replace('green', 'red');
            $('#pos-cases-arrow').removeClass('neg');
        }

        document.getElementById('num-deaths-cases').innerText = (array[0].Deaths[0] - array[0].Deaths[1]).toLocaleString();
        if (valuesComparison('Deaths', array)) {
            document.getElementById('num-deaths-arrow').src = document.getElementById('num-deaths-arrow').src.replace('red', 'green');
            $('#num-deaths-arrow').addClass('neg');
        } else {
            document.getElementById('num-deaths-arrow').src = document.getElementById('num-deaths-arrow').src.replace('green', 'red');
            $('#num-deaths-arrow').removeClass('neg');
        }

        document.getElementById('num-recovered-cases').innerText = (array[0].Recovered[0] - array[0].Recovered[1]).toLocaleString();
        if (valuesComparison('Recovered', array)) {
            document.getElementById('num-recovered-arrow').src = document.getElementById('num-recovered-arrow').src.replace('green', 'red');
            $('#num-recovered-arrow').addClass('neg');
        } else {
            document.getElementById('num-recovered-arrow').src = document.getElementById('num-recovered-arrow').src.replace('red', 'green');
            $('#num-recovered-arrow').removeClass('neg');
        }
    }

    document.getElementById('num-total-cases').innerText = array[0].Total[0].toLocaleString();

    document.getElementById('num-total-deaths').innerText = array[0].TotalDeaths.toLocaleString();

    document.getElementById('num-total-cases-minus-30').innerText = array[0].Total[1].toLocaleString();
}

function valuesComparison(str, array) {
    const dayMinusTwo = array[0][str][0];
    const dayMinusThree = array[0][str][1];
    const dayMinusFour = array[0][str][2];
    return dayMinusTwo - dayMinusThree < dayMinusThree - dayMinusFour;
}

function retrieveSpecificData() {
    $.ajax({
        url: `https://api.covid19api.com/total/country/${selectedCountry}`,
        dataType: 'json'
    }).done((countryData) => {
        const specificDate = document.getElementById('date-choice').value + 'T00:00:00Z';
        const foundDate = countryData.find((day) => day.Date === specificDate);
        insertSpecificDataIntoHtml(foundDate);
    });
}

function insertSpecificDataIntoHtml(covidData) {
    document.getElementById('specific-num-pos-cases').innerText = covidData.Active.toLocaleString();
    document.getElementById('specific-num-deaths-cases').innerText = covidData.Deaths.toLocaleString();
    document.getElementById('specific-num-recovered-cases').innerText = covidData.Recovered.toLocaleString();
    document.getElementById('specific-num-total-cases').innerText = covidData.Confirmed.toLocaleString();
}

function changeSection() {
    $('#homepage').toggleClass('selected-section').toggleClass('not-selected-section');
    $('#before').toggleClass('selected-section').toggleClass('not-selected-section');
    if ($('#homepage').hasClass('not-selected-section')) {
        $('#container1').css('transform', 'translateX(-100vw)');
        $('#container2').css('transform', 'translateX(0vw)');
    } else {
        $('#container1').css('transform', 'translateX(0vw)');
        $('#container2').css('transform', 'translateX(100vw)');
    }
}

function closeCountriesTab() {
    $('.countries-tab').css('right', '-50vw');
    $('.country-choice-bg').css('opacity', '0');
    setTimeout(() => {
        $('.country-choice-bg').fadeOut(0);
    }, 500);
}

$.ajax({
    url: `https://api.covid19api.com/total/country/france`,
    dataType: 'json'
}).done((countryData) => {
    dataToObjArray(calcCases, countryData);
    for (let i = 0; i < $('.number-data').length; i++) {
        $('.number-data')[i].textContent = '';
    }
    insertDataIntoHtml(calcCases);
    retrieveSpecificData();
});

window.onload = () => {
    setTimeout(() => {
        $('#loading').fadeOut('slow');
    }, 400);
};

document.getElementById('date-choice').value = focusDate.split('T')[0];
document.getElementById('date-choice').setAttribute('max', focusDate.split('T')[0]);
