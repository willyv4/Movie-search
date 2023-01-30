"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodes-list");
const noImageURL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdJeQwuDELXhuvnC9W_LB6wTaTgjxVOPLQtg&usqp=CAU";

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              type=""
              src="${show.image}" 
              alt="${show.name} IMG" 
              class="card-img-top">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-dark btn-sm Show-getEpisodes" id="${show.id}">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($show);
  }
}

// enable API to search for movies
async function searchShows(inputVal) {
  const response = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${inputVal}`
  );

  let shows = [];

  //iterate through api data and assign each value to a variable
  for (let data of response.data) {
    const id = data.show.id;
    const name = data.show.name;
    const summary = data.show.summary;
    let image = data.show.image.original;

    // if theres no image show broken tv img
    if (!data.show.image.original) {
      image = noImageURL;
    }

    // push specified api data to the empty arr shows
    shows.push({ id, name, summary, image });
    // pass shows arr to populate shows function
    populateShows(shows);
    // pass id to get episodes of shows function
    getEpisodesOfShow(id);
  }
}

// enable search button to submit user form input
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  let $inputVal = $("#search-query").val();
  await searchShows($inputVal);
});

// grab episode data from API
async function getEpisodesOfShow(id) {
  const response = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );

  // iterate through api data to get data needed
  for (let data of response.data) {
    const name = data.name;
    const season = data.season;
    const number = data.number;

    // push specified data to episodes Arr
    let episodes = [];
    episodes.push({ id, name, season, number });
    // pass episodes data to populate function
    populateEpisodes(episodes);
  }
}

// append episode data to the dom with event listener
function populateEpisodes(episodes) {
  $episodesList.empty();
  // loop through data passed from get episode function
  for (let episode of episodes) {
    // put each data point into an li element
    const $episodes = $(
      `<li>Name: ${episode.name}
      (Season: ${episode.season}, Episode: ${episode.number})
      </li>`
    );
    // listen for the button clicked
    $(`#${episode.id}`).click(function () {
      $episodesArea.show();
      // append episode li data to parent element
      $("#episodes-list").append($episodes);
    });
  }
}
