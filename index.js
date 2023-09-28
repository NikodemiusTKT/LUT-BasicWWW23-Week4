'use strict';

window.onload = () => {
  document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitFormData();
  });
};

async function fetchJsonData(url) {
  // let queryUrl = encodeURI(url + '?q=' + search);
  // console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Fetched dataset isn't JSON!");
    }
    return await response.json();
  } catch (err) {
    console.error(
      `Error occurred in fetch function | ${err.name}: ${err.message}`
    );
  }
}

function fillDomWithTvShows(showData) {
  let fragment = document.createDocumentFragment();
  Object.values(showData).forEach((obj) => {
    const title = obj.show?.name;
    const summary = obj.show?.summary;
    const img = obj.show?.image?.medium;
    const showElem = createShowElem(img, title, summary);
    fragment.append(showElem);
  });
  document.querySelector('.show-container').replaceChildren(fragment);
}

function createShowElem(imgSrc, showTitle, showSummary) {
  /*   
  <div class="show-data"> 
    <img src="[show image medium]"> 
    <div class="show-info"> 
        <h1>[Show title]</h1> 
        <p>[Show summary]</p> 
    </div> 
  </div>  
  */
  let divData = document.createElement('div');
  divData.className = 'show-data';

  let divInfo = document.createElement('div');
  divInfo.className = 'show-info';

  let imgElem = document.createElement('img');
  imgElem.src = imgSrc ?? '';

  let header = document.createElement('h1');
  header.textContent = showTitle;

  divInfo.append(header);
  divInfo.insertAdjacentHTML('beforeend', showSummary);

  divData.prepend(imgElem);
  divData.append(divInfo);

  return divData;
}

async function submitFormData() {
  let url = 'https://api.tvmaze.com/search/shows';
  const input = document.querySelector('#input-show').value;
  const queryUrl = `${url}?q=${input}`;
  if (input === '') return;
  const tvShowData = await fetchJsonData(queryUrl);
  fillDomWithTvShows(tvShowData);
}
