let allArtworksList = document.getElementById("filter-art-works"),
    searchInput = document.getElementById('search-input'),
    searchBtn = document.getElementById('search-btn');
    searchMessage = document.getElementById('search-result-message'),
    searchResultContainer = document.getElementById("search-result-container");

searchInput.addEventListener('keyup', (e) => {
    if (e.target.value.length < 3) {
        searchMessage.innerText = 'Ange minst 3 tecken i sökfältet.';
        return;
    } 
    searchMessage.innerText = 'Sökresultat.';
    searchBtn.click();
})

searchBtn.addEventListener('click', async () => {
    if (searchInput.value == '') return;
    searchResultContainer.innerHTML = '';
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
                    console.log(searchResultContainer);
                    // searchResultContainer.innerHTML = 'Hej hej';
                    searchResultContainer.innerHTML += `
                        <div>
                            <h3>${matchedArtwork.title}</h3>
                            <p><strong>${matchedArtwork.artist_title}</strong> ${matchedArtwork.place_of_origin}, ${matchedArtwork.date_display}</p>
                            <img src="https://www.artic.edu/iiif/2/${matchedArtwork.image_id}/full/843,/0/default.jpg" class="search-result-img">
                        </div>
                    `;
                    console.log(matchedArtwork);
                    console.log(artWork.id);
                    console.log(artWork.title);
                    console.log(artWork.artist_title);
                }
            }
        }
    }
    if (searchResultContainer.innerHTML == '') {
        searchMessage.innerText = 'Sökningen gav inga resultat.';
    }
    searchMessage.innerText += ' Sökning klar.';
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

/* 
async function checkPages() {
    let response = await fetch('https://api.artic.edu/api/v1/artworks/?fields=image_id,title,artist_titles,place_of_origin,date_display,medium_display,credit_line');
    let artWorks = await response.json();
    return artWorks.pagination.total_pages;
} */


// let response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${i}&fields=image_id%2Ctitle%2Cartist_titles%2Cplace_of_origin%2Cdate_display%2Cmedium_display%2Ccredit_line`);


/* 
    for (let artWork of artWorks.data) {
        let option = document.createElement('a');
        allArtworksList.append(option);
        option.innerText = artWork.title;
        option.id = artWork.id;
        option.addEventListener('click', () => {
            console.log('hejhejehjejhej');
            searchResultContainer.innerHTML = `
            <img src="https://www.artic.edu/iiif/2/${artWork.image_id}/full/843,/0/default.jpg">
            <section>
                <h2>${artWork.title}</h2>
                <i><strong>Artist:</strong> ${artWork.artist_titles.join(', ')}
                <br>${artWork.place_of_origin}, ${artWork.date_display}</i>
                <p>${artWork.medium_display}</p>
                <p>${artWork.credit_line}</p>
            </section>
            `;
            })
            
        }
        if (allArtworksList.value == 'Woman mending') {
            console.log('success');
        }  */



/* async function fetchAllArtworks() {
    let response = await fetch('https://api.artic.edu/api/v1/artworks/?fields=image_id,title,artist_titles,place_of_origin,date_display,medium_display,credit_line');
    console.log(response);
    let artWorks = await response.json();
    console.log(artWorks);
    for (let artWork of artWorks.data) {
        let option = document.createElement('a');
        allArtworksList.append(option);
        option.innerText = artWork.title;
        option.id = artWork.id;
        option.addEventListener('click', () => {
            console.log('hejhejehjejhej');
            searchResultContainer.innerHTML = `
            <img src="https://www.artic.edu/iiif/2/${artWork.image_id}/full/843,/0/default.jpg">
            <section>
                <h2>${artWork.title}</h2>
                <i><strong>Artist:</strong> ${artWork.artist_titles.join(', ')}
                <br>${artWork.place_of_origin}, ${artWork.date_display}</i>
                <p>${artWork.medium_display}</p>
                <p>${artWork.credit_line}</p>
            </section>
            `;
            })
            
        }
        if (allArtworksList.value == 'Woman mending') {
            console.log('success');
        } 
    }
    fetchAllArtworks(); */




    
    // <i><strong>Artist:</strong> ${artWork.artist_titles.join(', ')}</i>

/* async function fetchData2() {
    // let response = await fetch('https://api.artic.edu/api/v1/artworks/27992?fields=id,title,image_id');
    let response = await fetch('https://api.artic.edu/api/v1/artworks/129884');
    // let response = await fetch('https://api.artic.edu/api/v1');
    console.log(response);
    let data = await response.json();
    console.log(data);
}

fetchData2(); */




