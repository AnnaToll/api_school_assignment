let allArtworksList = document.getElementById("filter-art-works"),
    searchInput = document.getElementById('search-input'),
    searchBtn = document.getElementById('search-btn');
    searchMessage = document.getElementById('search-result-messages'),
    fixBug = 'end',
    searchResultContainer = document.getElementById("search-result-container");

searchInput.addEventListener('keyup', (e) => {
    if (e.target.value.length < 3) {
        searchResultContainer.innerHTML = '';
        searchMessage.innerText = 'Ange minst 3 tecken i sökfältet.';
        return;
    } 

    searchBtn.click();
})

searchBtn.addEventListener('click', async () => {
    if (searchInput.value == '' || fixBug == 'beginning') return;
    fixBug = 'beginning';
    searchResultContainer.innerHTML = '';
    searchMessage.innerText = 'Söker.';
    let pagesAndResultsArr = apiFetchResultSetup();
    for (let i = 1; i < pagesAndResultsArr[0]; i++) {
        let response = await fetch(`https://api.artic.edu/api/v1/artworks?limit=${pagesAndResultsArr[1]}&page=${i}&fields=id%2Ctitle%2Cartist_title`);
        let artWorks = await response.json();
        for (let artWork of artWorks.data) {
            if (artWork.artist_title != null && artWork.title != null) {
                if (
                    artWork.title.toLowerCase().includes(searchInput.value.toLowerCase())
                    || artWork.artist_title.toLowerCase().includes(searchInput.value.toLowerCase())
                ){
                    let matchedArtwork = await fetchArtwork(artWork.id);
                    searchResultContainer.innerHTML += `
                        <div>
                            <h4>${matchedArtwork.title}</h4>
                            <p><span class="artist">${matchedArtwork.artist_title}</span><i> ${matchedArtwork.place_of_origin}, ${matchedArtwork.date_display}</i></p>
                            <img src="https://www.artic.edu/iiif/2/${matchedArtwork.image_id}/full/843,/0/default.jpg" class="search-result-img">
                        </div>
                    `;
                }
            }
        }
    }
    if (searchResultContainer.innerHTML == '') {
        searchMessage.innerText = 'Sökningen gav inga resultat.';
    } else {
        searchMessage.innerText = ' Sökning klar.';
    }
    fixBug = 'end';
})

function apiFetchResultSetup() {
    // You can fetch max 100 result per page from the api, and max 100 pages, but they ask that you don't push the limits if you don't have to (there are 115 000 artwork objects in total).
    let pagesAndResultsArr = [],
        resultsPerPage = 100;
        pagesFromApi = 5;

    pagesAndResultsArr.push(pagesFromApi, resultsPerPage);
    return pagesAndResultsArr;

}


async function fetchArtwork(id) {
    let response = await fetch(`https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,artist_title,image_id,place_of_origin,date_display`);
    let matchedArtworkObject = await response.json();
    return matchedArtworkObject.data;
}

// let response = await fetch('https://api.artic.edu/api/v1/artworks/?fields=image_id,title,artist_titles,place_of_origin,date_display,medium_display,credit_line');

