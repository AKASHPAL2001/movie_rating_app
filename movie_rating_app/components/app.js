const apiKey = '4835dd86';
let currentPage = 1;
let reviewList = JSON.parse(localStorage.getItem('reviewList')) || [];
let map = new Map();

document.getElementById('search-input')
.addEventListener("keypress", function(event){
  if(event.key == "Enter"){
    event.preventDefault();
    document.getElementById("search-btn").click();
  }
})
function searchMovie() {
    currentSearchQuery = document.getElementById('search-input').value.trim();
    searchMovies(currentSearchQuery);
};

function searchMovies(searchQuery) {
    fetchMovies(searchQuery, currentPage)
        .then((movies) => {
            displayMovies(movies);
        });
}


function fetchMovies(searchQuery, page) {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}&page=${page}`;

    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.Response === 'True') {
                console.log(data);
                return data.Search;
            } else {
                return [];
            }
        })
        .catch((error) => {
            console.error('Error fetching movies:', error);
            return [];
        });
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = '';
    if(movies.length == 0){
        moviesContainer.innerHTML = "No Results Found";
        return;
    }
    const pagebox = document.createElement("div");
    pagebox.classList.add('pagebox');
    const pageno = document.createElement('span');
    pageno.innerHTML = `${currentPage}`
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = "< Prev";
    prevBtn.onclick = () =>{
        handlePaginationClick(false);
    }
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = "Next >";
    nextBtn.onclick = () =>{
        handlePaginationClick(true);
    }
    movies.forEach((movie) => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const posterImg = document.createElement('img');
        posterImg.src = movie.Poster;
        movieElement.appendChild(posterImg);

        const title = document.createElement('h3');
        title.innerHTML = `<span>${movie.Title}  ( ${movie.Year}) </span>`;
        movieElement.appendChild(title);

        title.addEventListener('click', () => {
            displayMovieDetails(movie.imdbID);
        });
        
        posterImg.addEventListener('click', () => {
            displayMovieDetails(movie.imdbID);
        });

        moviesContainer.appendChild(movieElement);

    });
            
    if(currentPage > 1){
        pagebox.appendChild(prevBtn);
    }
    pagebox.appendChild(pageno);
    // if(movies.length > (currentPage)*10){
        pagebox.appendChild(nextBtn);
    // }
    moviesContainer.appendChild(pagebox);
}

function handlePaginationClick(isNext) {
    if (isNext) {
        currentPage++;
    } else {
        currentPage--;
    }

    searchMovies(currentSearchQuery);
}

function displayMovieDetails(movieID) {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const movieDetailsElement = document.getElementById('movie-details');
            movieDetailsElement.innerHTML = '';
            console.log(data);
            const desc = document.createElement('div');
            desc.classList.add("modal-content");
            desc.innerHTML = `Name: ${data.Title} <br> Release Year: ${data.Year} <br> Duration: ${data.Runtime} <br>`
            const closebtn = document.createElement('span');
            closebtn.classList.add("close");
            closebtn.innerHTML = "&times;";
            const rating = document.createElement('span');
            rating.innerHTML = `Rating: ${data.Ratings[0].Value} <br>`
            const plot = document.createElement('p');
            plot.innerHTML = `Plot:- <br> ${data.Plot} `;
            desc.appendChild(closebtn);
            desc.appendChild(rating);
            desc.appendChild(plot);
            movieDetailsElement.appendChild(desc);
            

            movieDetailsElement.style.display = "block";
            closebtn.onclick = function(){
                movieDetailsElement.style.display = "none";
            }
            window.onclick = function(e){
                if(e.target == movieDetailsElement){
                    movieDetailsElement.style.display = "none";
                }
            }
        })
        .catch((error) => {
            console.error('Error fetching movie details:', error);
        });
}


function addReview(movieId){
    console.log("review clicked");
    const modalContainer = document.getElementById('movie-review');
    const modalContent = document.createElement('div');
    modalContent.classList.add("modal-content");

    const closebtn = document.createElement('span');
    closebtn.classList.add("close");
    closebtn.innerHTML = "&times;";

    const rate = document.createElement('input');
    rate.type = "number";
    rate.placeholder = "Give a rating to this movie";
    rate.name = "rating";
    rate.setAttribute('id','rating');
    
    const comment = document.createElement('input');
    comment.type = "text";
    comment.placeholder = "Add a comment";
    comment.name = "comment";
    comment.setAttribute('id','comment');

    const submit = document.createElement('button');
    submit.type = "submit";
    submit.innerText = "Submit";
    modalContent.appendChild(closebtn);
    modalContent.appendChild(rate);
    modalContent.appendChild(comment);
    modalContent.appendChild(submit);

    modalContainer.appendChild(modalContent);
    modalContainer.style.display = "block";
    closebtn.onclick = function(){
        modalContainer.style.display = "none";
    }
    submit.onclick = function(){
        console.log(document.getElementById('rating').value);
        modalContainer.style.display = "none";
    }
    window.onclick = function(e){
        if(e.target == modalContainer){
            modalContainer.style.display = "none";
        }
    }

    const review = {
        id: movieId,
        rating: document.getElementById('rating').value,
        comment: document.getElementById('comment').value,
    };
    console.log(review);
    reviewList.push(review);

}

