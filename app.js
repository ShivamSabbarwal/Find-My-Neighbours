// Get input field from DOM
const searchField = document.getElementById("search");

// Get country options list element from DOM and setting initial options
const countryList = document.getElementById("countryList");

// Get capital cities results DOM element and setting initial value
const capCities = document.getElementById("capCitiesResults");

// Attach event listener to input field to search based on user input
searchField.addEventListener("input", () => searchCountry(searchField.value));

// Function to retrive capital cities based on selected country
const getCapitalCities = async code => {
  // Fetching selected country using iso code
  const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${code}?fields=name;capital;borders`);
  const country = await res.json();

  // Setting search input to be selected country
  searchField.value = country.name;

  let borderStr = "";

  capCities.innerHTML = `<h3>Capital Cities</h3>`;
  if (country.borders.length > 0) {
    country.borders.forEach((border, index) => {
      borderStr += `${border}${country.borders.length - 1 !== index ? ";" : ""}`;
    });

    fetch(`https://restcountries.eu/rest/v2/alpha?codes=${borderStr}&fields=capital`)
      .then(res => res.json())
      .then(cities => {
        capCities.innerHTML += [country, ...cities]
          .map(city => `<span class="badge bg-secondary mx-1">${city.capital}</span>`)
          .join("");
      })
      .catch(e => console.error(e));
  } else {
    capCities.innerHTML += `<span class="badge bg-secondary mx-1">${country.capital}</span> `;
  }
  countryList.innerHTML = "";
};

// Function to filter down list of countries based on user input
const searchCountry = async searchTerm => {
  const res = await fetch("https://restcountries.eu/rest/v2/all?fields=name;alpha3Code;capital;borders");
  const countries = await res.json();
  countryList.innerHTML = "";
  capCities.innerHTML = "";

  // Setup Regex for search
  const regex = new RegExp(`^${searchTerm}`, "gi");
  // Filter down country option based on country name or iso code
  const countryOptions =
    searchTerm.length > 0 ? countries.filter(country => country.name.match(regex) || country.alpha3Code.match(regex)) : [];

  if (countryOptions.length > 0) {
    countryList.innerHTML = countryOptions
      .map(
        country =>
          `<button class="list-group-item list-group-item-action d-flex justify-content-between" onclick="getCapitalCities('${country.alpha3Code}')">
            <span class="text-light fw-bold">${country.name}</span>
            <span class="badge">${country.alpha3Code}</span>
          </button>`
      )
      .join("");
  }
};

const reset = () => {
  searchField.value = ""
  countryList.innerHTML = ""
  capCities.innerHTML = ""
}
