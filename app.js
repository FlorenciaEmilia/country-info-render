//const axios = require("axios");
const form = document.querySelector("#searchForm");
const img = document.querySelector("#page-img");
const title = document.querySelector("#page-title");
const countryInfo = document.querySelector("#page-info");
const sideTitle = document.querySelectorAll(".side-titles");
const countryMain = document.querySelector("#country-main");

// const flagDisplay = document.createElement("img");
const flagDisplay = document.querySelector("#flag-display");
const countryName = document.querySelector("#country-name");
// const countryName = document.createElement("h2");
const mapDisplay = document.getElementById("map");
// mapDisplay.setAttribute("id", "map");

const countrySide = document.querySelector("#country-side");
countrySide.style.display = "none";

let gMaps = document.querySelector("#map");
gMaps.style.display = "none";

let ul;
let li;
let elementToAppnd;

const sideTitleContent = [
  "Capital",
  "Currency",
  "Language",
  "Region",
  "Borders With",
];

const errorSvg = document.createElement("img");
errorSvg.src = "error-404.svg";
errorSvg.setAttribute("id", "error-svg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const searchTerm = form.elements.query.value;
  try {
    const res = await axios.get(
      `https://restcountries.eu/rest/v2/name/${searchTerm}`
    );
    const data = res.data[0];
    console.log("data is", data);

    //Make sure that everything is displaying
    countrySide.style.display = "flex";
    countryName.style.display = "block";
    flagDisplay.style.display = "block";
    mapDisplay.style.display = "block";
    errorSvg.style.display = "none";

    sidePageDisplay(data);
    mainPageDisplay(data);
  } catch (e) {
    handleError();
    console.log("the error is:", e);
  }
});

const sidePageDisplay = async (data) => {
  countrySide.style.display = "block";
  const infoObject = {
    Capital: data.capital,
    Currency: data.currencies,
    Language: data.languages,
    Region: data.region,
    "Borders With": data.borders,
  };
  console.log(infoObject);

  //Create Ul
  sideTitle.forEach((x, i) => (x.textContent = Object.keys(infoObject)[i]));

  for (let elem of sideTitle) {
    elementToAppnd = elem;
    ul = document.createElement("ul");
    let keyToAccess = infoObject[elem.textContent];
    console.log(keyToAccess, typeof keyToAccess == "object");

    if (typeof keyToAccess == "object" && elem.textContent !== "Borders With") {
      console.log(keyToAccess);
      for (let key in keyToAccess) {
        li = document.createElement("li");
        li.textContent = keyToAccess[key].name;
        ul.appendChild(li);
      }
    } else if (typeof keyToAccess !== "object") {
      li = document.createElement("li");
      li.textContent = keyToAccess;
      ul.appendChild(li);
    } else {
      if (keyToAccess.length > 1) {
        try {
          keyToAccess.forEach(async (x) => {
            let countryInitials = await axios.get(
              `
              https://restcountries.eu/rest/v2/alpha/${x}`
            );
            // console.log(countryInitials.data.name);
            let countryName = countryInitials.data.name;
            li = document.createElement("li");
            li.textContent = countryName;
            ul.appendChild(li);
          });
        } catch (e) {
          console.log("error: ", e);
        }
      } else if (keyToAccess.length == 1) {
        li = document.createElement("li");
        li.textContent = keyToAccess;
        ul.appendChild(li);
      } else {
        li = document.createElement("li");
        li.textContent = "--";
        ul.appendChild(li);
      }
    }
    elementToAppnd.appendChild(ul);
  }
};

let map;
function initMap(lati, long) {
  let coordinates = { lat: lati, lng: long },
    map = new google.maps.Map(document.getElementById("map"), {
      center: coordinates,
      zoom: 4,
    });
  let marker = new google.maps.Marker({
    position: coordinates,
    map: map,
  });
}

const mainPageDisplay = (data) => {
  flagDisplay.src = data.flag;
  // countryMain.appendChild(flagDisplay);

  countryName.textContent = data.name;
  // countryMain.appendChild(countryName);

  //Display google maps
  // countryMain.appendChild(mapDisplay);
  initMap(data.latlng[0], data.latlng[1]);
  gMaps.style.display = "block";
  // initMap();
};

const handleError = () => {
  //Make all elements in the page hide
  countrySide.style.display = "none";
  countryName.style.display = "none";
  flagDisplay.style.display = "none";
  mapDisplay.style.display = "none";
  countryMain.appendChild(errorSvg);
  errorSvg.style.display = "block";
};
