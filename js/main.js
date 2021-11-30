let allArtworksList = document.getElementById("filter-art-works"),
    searchInput = document.getElementById('search-input'),
    searchBtn = document.getElementById('search-btn'),
    btnPrevPage = document.createElement('button'),
    btnNextPage = document.createElement('button'),
    paginationBtnsContainer = document.createElement('div'),
    searchMessage = document.getElementById('search-result-messages'),
    searchQty = document.getElementById('search-result-qty'),
    numberOfKeyups = 0,
    pageNumber = 1,
    searchResultsContainer = document.getElementById("search-result-container");


searchInput.addEventListener('keyup', () => {
    if (!isInputLongEnough()) return;
    numberOfKeyups++;
    searchBtn.click();
})


searchBtn.addEventListener('click', async () => {
    if (!isInputLongEnough()) return;
    pageNumber = 1;
    let checkInputChange = numberOfKeyups;
    searchMessage.innerText = 'Söker.';
    let artWorks = await fetchSearchResult(pageNumber);
    await addSearchResultToPage(artWorks, checkInputChange);
    checkPaginationBtns(artWorks);
})


btnNextPage.addEventListener('click', async () => {
    let artWorks = await fetchSearchResult(++pageNumber);
    await addSearchResultToPage(artWorks, numberOfKeyups);
    checkPaginationBtns(artWorks);
})


btnPrevPage.addEventListener('click', async () => {
    let artWorks = await fetchSearchResult(--pageNumber);
    await addSearchResultToPage(artWorks, numberOfKeyups);
    checkPaginationBtns(artWorks);
})


function checkPaginationBtns(artWorks) {
    if (!isInputLongEnough()) return;
    if (artWorks.pagination.total_pages > 1) {
        paginationBtnsContainer.id = 'pagination-btn-container';
        if (pageNumber == 1) {
            document.body.append(paginationBtnsContainer);
            btnNextPage.innerText = 'Next page';
            paginationBtnsContainer.append(btnNextPage);
            if (paginationBtnsContainer.children.length == 2) btnPrevPage.remove();
        } else {
            btnPrevPage.innerText = 'Previous page';
            paginationBtnsContainer.prepend(btnPrevPage);
        }
        if (pageNumber == artWorks.pagination.total_pages) btnNextPage.remove();  
    }
}


async function addSearchResultToPage(artWorks, checkInputChange) {
    searchResultsContainer.innerHTML = '';
    searchQty.innerText = `Visar resultat ${artWorks.pagination.offset + 1} - ${artWorks.pagination.offset + artWorks.pagination.limit} av totalt ${artWorks.pagination.total} (sida ${artWorks.pagination.current_page} av ${artWorks.pagination.total_pages})`;

    for (let artWork of artWorks.data) {
        let matchedArtwork = await fetchArtwork(artWork.id);
        if (matchedArtwork.image_id == null) continue;
        if (!isInputLongEnough()) return;   
        if (checkInputChange != numberOfKeyups) {
            searchResultsContainer.innerHTML = '';
            return;
        }
        let matchedResultContainer = document.createElement('div');
        searchResultsContainer.append(matchedResultContainer);
        matchedResultContainer.innerHTML += `
            <h4 class="crop">${matchedArtwork.title}</h4>
            <p class="crop"><span class="artist">${matchedArtwork.artist_title}</span><i> ${matchedArtwork.place_of_origin}, ${matchedArtwork.date_display}</i></p>
            <div class="search-result-img-container">
                <img src="https://www.artic.edu/iiif/2/${matchedArtwork.image_id}/full/843,/0/default.jpg" class="search-result-img">
            </div>
        `;
    }
    if (searchResultsContainer.innerHTML == '') searchMessage.innerText = 'Sökningen gav inga resultat.';
    else searchMessage.innerText = 'Sökning klar.';
    let classes = document.querySelectorAll('.crop');
    classes.forEach((element) => {
        element.addEventListener('mouseover', (e) => {
            e.target.classList.remove('crop');
            e.target.addEventListener('mouseout', (e) => {
                e.target.classList.add('crop');
            })
        })
    })

    console.log(classes);
}


async function fetchSearchResult(page) {
    let response = await fetch(`https://api.artic.edu/api/v1/artworks/search?page=${page}&limit=16&q=${searchInput.value}`);
    let artWorks = await response.json();
    return artWorks;
}


async function fetchArtwork(id) {
    let response = await fetch(`https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,artist_title,image_id,place_of_origin,date_display`);
    let matchedArtworkObject = await response.json();
    return matchedArtworkObject.data;
}


function isInputLongEnough() {
    if (searchInput.value.length <= 3) {
        searchResultsContainer.innerHTML = '';
        searchMessage.innerText = 'Ange minst 3 tecken i sökfältet.';
        searchQty.innerText = '';
        paginationBtnsContainer.remove();
        if (searchInput.value == '') searchMessage.innerText = '';
        return false;
    } else return true;
}