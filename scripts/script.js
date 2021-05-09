let today = new Date();
let focusDate = new Date();
focusDate.setDate(today.getDate() - 2);
let date = focusDate.toLocaleDateString('FR');
focusDate = focusDate.toISOString();
$('.dateToday').append(date);

let calcCases = ['Covid data'];
const pays = [];
let selectedCountry = 'france';

$.ajax({
    url: 'https://api.covid19api.com',
    dataType: 'json'
}).done((data) => {
    console.log('Résumé de toutes les données accessibles:', data);
    for (let property in data) {
        if (data[property]['Name'].indexOf('Premium')) {
            console.log('Property ' + property + '.');
            console.log(data[property]['Description'] + '.');
            console.log('Corresponding path: https://api.covid19api.com' + data[property]['Path']);
            console.log('');
        }
    }
});

$.ajax({
    url: 'https://api.covid19api.com/countries',
    dataType: 'json'
}).done((data) => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        pays.push({
            Country: data[i].Country,
            Slug: data[i].Slug
        });
    }

    pays.sort((a, b) => (a.Country > b.Country ? 1 : b.Country > a.Country ? -1 : 0));

    pays.forEach((paysNom) => {
        $('datalist#countries').append(`<option id="${paysNom['Slug']}" value="${paysNom['Country']}"></option>`);
    });
});

function changeSelectedCountry() {
    console.log('Selected country has changed.');

    selectedCountry = $("#countries option[value='" + $('#country-choice').val() + "']").attr('id');

    if (selectedCountry === undefined) {
        $('#country-choice').val('France');
        selectedCountry = 'france';
    }

    calcCases = ['Covid data'];

    $.ajax({
        url: `https://api.covid19api.com/total/country/${selectedCountry}`,
        dataType: 'json'
    }).done((countryData) => {
        dataToObjArray(calcCases, countryData);
        for (let i = 0; i < $('.number-data').length; i++) {
            $('.number-data')[i].textContent = '';
        }
        insertDataIntoHtml(calcCases);
    });
}

function dataToObjArray(array, dataFromApi) {
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
        Total: [dataFromApi[dataFromApi.length - 2].Active, dataFromApi[dataFromApi.length - 30].Active]
    });
}

function insertDataIntoHtml(array) {
    document.getElementById('num-pos-cases').innerText = (array[1].Confirmed[0] - array[1].Confirmed[1]).toLocaleString();
    if (!valuesComparison('Confirmed', array)) {
        document.getElementById('pos-cases-arrow').src = document.getElementById('pos-cases-arrow').src.replace('red', 'green');
        document.getElementById('pos-cases-arrow').classList += ' neg';
    }

    document.getElementById('num-death-cases').innerText = (array[1].Deaths[0] - array[1].Deaths[1]).toLocaleString();
    if (!valuesComparison('Deaths', array)) {
        document.getElementById('num-deaths-arrow').src = document.getElementById('num-deaths-arrow').src.replace('red', 'green');
        document.getElementById('num-deaths-arrow').classList += ' neg';
    }

    document.getElementById('num-recovered-cases').innerText = (array[1].Recovered[0] - array[1].Recovered[1]).toLocaleString();
    if (!valuesComparison('Recovered', array)) {
        document.getElementById('num-recovered-arrow').src = document.getElementById('num-recovered-arrow').src.replace('green', 'red');
        document.getElementById('num-recovered-arrow').classList += ' neg';
    }

    document.getElementById('num-total-cases').innerText = array[1].Total[0].toLocaleString();

    document.getElementById('num-total-cases-minus-30').innerText = array[1].Total[1].toLocaleString();
}

function valuesComparison(str, array) {
    return array[1][str][0] - array[1][str][1] > array[1][str][1] - array[1][str][2];
}

changeSelectedCountry();
