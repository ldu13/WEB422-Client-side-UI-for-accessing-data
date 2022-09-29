/********************************************************************************* 
* WEB422 – Assignment 2 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
* 
* Name: _____Lei Du______ Student ID: ___047587134____ Date: ___Sept. 30, 2022____ 
* 
********************************************************************************/

let page = 1;
const perPage = 10;

function loadMovieData(title = null) {
    
    var pagination = document.querySelector('.pagination');   
    title ? pagination.classList.add("d-none") : pagination.classList.remove("d-none");
    
    // loading the data
    
    let url = title 
    ? `https://lively-pea-coat-frog.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}` 
    : `https://lively-pea-coat-frog.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            
            // creating the <tr> elements
            let movieRows = `
                ${data.map(movie => (
                    `<tr data-id=${movie._id}>
                        <td>${movie.year}</td>
                        <td>${movie.title}</td>
                        <td>${movie.plot ? movie.plot : 'N/A'}</td>
                        <td>${movie.rated ? movie.rated : 'N/A'}</td>
                        <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2,'0')}</td>
                    </tr>`
                )).join('')}
            `;

            // adding <tr> elements to the table
            document.querySelector('#moviesTable tbody').innerHTML = movieRows;

            // updating the "current page"
            document.querySelector('#current-page').innerHTML = page;

            // adding click events & loading/displaying movie data
            document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
                row.addEventListener('click', (e) => {
                    let clickedId = row.getAttribute('data-id');
                    fetch(`https://lively-pea-coat-frog.cyclic.app/api/movies/${clickedId}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        // generating the list                                              
                        let detailsList = `
                            ${data.poster ? `<img class="img-fluid w-100" src=${data.poster}><br><br>` : ``}
                            <strong>Directed By: </strong>${(data.directors).join(', ')}<br><br>
                            <p>${data.fullplot ? data.fullplot : 'N/A'}</p>
                            <strong>Cast: </strong>${data.cast ? (data.cast).join(', ') : 'N/A'}<br><br>
                            <strong>Awards: </strong>${data.awards.text}<br>
                            <strong>IMDB Rating: </strong>${data.imdb.rating} (${data.imdb.votes} votes)                                                                                      
                        `;

                        // Populating the Modal
                        document.querySelector('#detailsModal .modal-title').innerHTML = data.title;
                        document.querySelector('#detailsModal .modal-body').innerHTML = detailsList;

                        // showing the modal
                        let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                            backdrop: 'static', // default true - "static" indicates that clicking on the backdrop will not close the modal window
                            keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
                            focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
                        })
                        myModal.show();
                    })
                })
            })
        });
}

// execute when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    //loadMovieData();

    // click event for the "previous page" pagination button
    document.querySelector('#previous-page').addEventListener('click', () => {
        if (page > 1) {
            page--;           
        }
        loadMovieData();
    });

    // click event for the "next page" pagination button
    document.querySelector('#next-page').addEventListener('click', () => {
        page++;
        loadMovieData();        
    });

    // submit event for the "searchForm" form
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        // prevent the default submit
        event.preventDefault();
        page = 1;
        // load movie data with the title value
        loadMovieData(document.querySelector('#title').value);
    });

    // Click event for the "clearForm" button
    document.querySelector('#clearForm').addEventListener('click', () => {
        // resets the title value to an empty string ("")
        document.querySelector('#title').value = "";
        // invokes the loadMovieData function without any parameters
        loadMovieData();
    });
});