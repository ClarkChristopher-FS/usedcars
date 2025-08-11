// Imports your SCSS stylesheet
import "./styles/index.scss";
// Load cars data
import rawData from "../car-dataset.json";

(() => {
  // Car class
  class Car {
    // declare & define yr mk mdl from json
    constructor(raw) {
      // get year
      //   const year = raw.year || "";
      // get make by manufacturer
      //   const make = raw.Manufacturer || "";
      // get model
      //   const model = raw.model || "";
      // Es6 destructuring
      const { year = "", Manufacturer: make = "", model = "" } = raw;
      this.year = String(year);
      this.make = String(make);
      this.model = String(model);
      // save raw data
      this.raw = raw;
    }

    // Match values
    matches = (year, make, model) =>
      this.year === String(year) &&
      this.make.toLowerCase() === String(make).toLowerCase() &&
      this.model.toLowerCase() === String(model).toLowerCase();
  }

  const cars = rawData.map((raw) => new Car(raw));

  //  loop map and organize to show yr mk mdl
  const getUniqueYears = () =>
    Array.from(new Set(cars.map((c) => c.year))).sort(
      (a, b) => Number(b) - Number(a)
    );
  const getUniqueMakes = (selectedYear) =>
    Array.from(
      new Set(
        cars.filter((c) => c.year === String(selectedYear)).map((c) => c.make)
      )
    ).sort();
  const getUniqueModels = (selectedYear, selectedMake) =>
    Array.from(
      new Set(
        cars
          .filter(
            (c) =>
              c.year === String(selectedYear) &&
              c.make.toLowerCase() === String(selectedMake).toLowerCase()
          )
          .map((c) => c.model)
      )
    ).sort();
  const findCars = (year, make, model) =>
    cars.filter((c) => c.matches(year, make, model));

  // Get DOM selections
  const yearSelect = document.getElementById("year");
  const makeSelect = document.getElementById("make");
  const modelSelect = document.getElementById("model");
  const searchButton = document.getElementById("search");

  // Disable & enable dropdowns
  const disableInput = (el) => {
    // css grayed out
    el.classList.add("locked");
    // prevents step
    el.disabled = true;
  };
  const enableInput = (el) => {
    el.classList.remove("locked");
    el.disabled = false;
  };

  // utility to show selected section with options
  const fillDropdown = (dropdownElement, placeholderText, menuOptions) => {
    // reset with placeholder like calculators clear button
    dropdownElement.innerHTML = `<option value="" selected disabled>${placeholderText}</option>`;

    // grabbing each option in list of options
    for (const menuItem of menuOptions) {
      // creating option
      const dropdownItem = document.createElement("option");

      //store value
      dropdownItem.value = menuItem;
      // push option(s)
      dropdownItem.textContent = menuItem;
      dropdownElement.appendChild(dropdownItem);
    }
  };

  // When Year changes update make
  const onYearChange = () => {
    const year = yearSelect.value;
    const makes = getUniqueMakes(year);
    fillDropdown(makeSelect, "Select make", makes);
    enableInput(makeSelect);
    fillDropdown(modelSelect, "Select model", []);
    disableInput(modelSelect);
    disableInput(searchButton);
  };

  // When Make changes update model
  const onMakeChange = () => {
    const year = yearSelect.value;
    const make = makeSelect.value;
    const models = getUniqueModels(year, make);
    fillDropdown(modelSelect, "Select model", models);
    enableInput(modelSelect);
    disableInput(searchButton);
  };

  // When model changes enable search
  const onModelChange = () => {
    if (yearSelect.value && makeSelect.value && modelSelect.value) {
      enableInput(searchButton);
    } else {
      disableInput(searchButton);
    }
  };

  // Build year options on load
  const years = getUniqueYears();
  fillDropdown(yearSelect, "Select year", years);
  fillDropdown(makeSelect, "Select make", []);
  fillDropdown(modelSelect, "Select model", []);
  // Lock until previous choice
  disableInput(makeSelect);
  disableInput(modelSelect);
  disableInput(searchButton);

  // Connecting dropdowns
  // when yr mk mdl changes
  yearSelect.onchange = onYearChange;
  makeSelect.onchange = onMakeChange;
  modelSelect.onchange = onModelChange;

  // On submit, log details
  document.getElementById("car-form").onsubmit = (event) => {
    // stop page refresh
    event.preventDefault();
    // getting user selected values
    const year = yearSelect.value;
    const make = makeSelect.value;
    const model = modelSelect.value;
    try {
      // find matching cars
      const foundCars = findCars(year, make, model);
      // output findings
      console.log(`${foundCars.length} results for a ${year} ${make} ${model}`);
      // array of each
      foundCars.forEach((c) => console.log(c.raw));
    } catch (err) {
      console.error("An error occurred during search:", err);
    }
  };
})();
