'use strict';

window.onload = async () => {
  let url = new URL('https://api.tvmaze.com/search/shows?');
  const params = { q: 'friends' };
  const tvShowData = await fetchJsonData(url, params);
  fillTableWithData(tvShowData);
};

async function fetchJsonData(url, params) {
  url.search = new URLSearchParams(params).toString();
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

function fillTableWithData(showData) {
  let tRowArray = new Array();
  // console.log(key);
  Object.values(showData).forEach((obj, index) => {
    console.log(obj.show.name);
    console.log(obj.show.summary);
    const title = obj.show.name;
    const summary = obj.show.summary;
    const img = obj.show?.image;
    let tRow = createShowElem(img, title, summary);
    tRowArray.push(tRow);
  });
  document.querySelector('#show-container').append(...tRowArray);
}

function createShowElem(img, showTitle, showSummary) {
  const imgElem =
    img !== null || img !== '' ? `<img src=${img.medium}/>` : null;
  let html = `
  <div class="show-data"> 
  ${imgElem}
    <div class="show-info"> 
        <h1>${showTitle}</h1> 
        ${showSummary} 
    </div> 
  </div> `;
  let temp = document.createElement('template');
  html = html.trim(); // Never return a space text node as a result
  temp.innerHTML = html;
  return temp.content.firstChild;
}
