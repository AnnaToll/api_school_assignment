let allArtworksList = document.getElementById("filter-art-works"),
    searchInput = document.getElementById('search-input'),
    searchBtn = document.getElementById('search-btn');
    searchMessage = document.getElementById('search-result-messages'),
    numberOfKeyups = 0,
    searchResultContainer = document.getElementById("search-result-container");

searchInput.addEventListener('keyup', (e) => {
    if (e.target.value.length < 3) {
        searchResultContainer.innerHTML = '';
        searchMessage.innerText = 'Ange minst 3 tecken i sökfältet.';
        if (e.target.value == '') {
            searchMessage.innerText = '';
        }
        return;
    }
    numberOfKeyups++;
    searchBtn.click();
})

searchBtn.addEventListener('click', async () => {
    if (searchInput.value == '') return;
    let checkInputChange = numberOfKeyups;
    // let checkInputChange = searchInput.value;
    searchResultContainer.innerHTML = '';
    searchMessage.innerText = 'Söker.';
    let response = await fetch(`https://api.artic.edu/api/v1/artworks/search?limit=15&q=${searchInput.value}`);
    let artWorks = await response.json();
    console.log(artWorks);
    for (let artWork of artWorks.data) {
        let matchedArtwork = await fetchArtwork(artWork.id);
        if (matchedArtwork.image_id == null) continue;
        if (searchInput.value.length < 3) {
            searchResultContainer.innerHTML = '';
            searchMessage.innerText = 'Ange minst 3 tecken i sökfältet.';
            return;
        }
        if (checkInputChange != numberOfKeyups) {
            searchResultContainer.innerHTML = '';
            return;
        }
        searchResultContainer.innerHTML += `
            <div>
                <h4>${matchedArtwork.title}</h4>
                <p><span class="artist">${matchedArtwork.artist_title}</span><i> ${matchedArtwork.place_of_origin}, ${matchedArtwork.date_display}</i></p>
                <img src="https://www.artic.edu/iiif/2/${matchedArtwork.image_id}/full/843,/0/default.jpg" class="search-result-img">
            </div>
        `;
    }
    if (searchResultContainer.innerHTML == '') {
        searchMessage.innerText = 'Sökningen gav inga resultat.';
    } else {
        searchMessage.innerText = 'Sökning klar.';
    }
})


async function fetchArtwork(id) {
    let response = await fetch(`https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,artist_title,image_id,place_of_origin,date_display`);
    let matchedArtworkObject = await response.json();
    return matchedArtworkObject.data;
}

// let response = await fetch('https://api.artic.edu/api/v1/artworks/?fields=image_id,title,artist_titles,place_of_origin,date_display,medium_display,credit_line');

