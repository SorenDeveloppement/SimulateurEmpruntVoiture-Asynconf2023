// Import data from the data.json file
const data = fetch("./data.json").then((response) => response.json());

// Getters of values
function getVehicleType() {
	return document.getElementById("car-type").value;
}

function getVehicleEnergy() {
	return document.getElementById("car-energy").value;
}

function getVehicleTravel() {
	return document.getElementById("car-travel").value;
}

function getVehicleCreation() {
	return document.getElementById("car-creation").value;
}

function getVehiclePassengers() {
	return document.getElementById("car-passengers").value;
}

// Round the note
function adjustNote(note) {
	if (note - parseInt(note) < 0.51) {
		return Math.floor(note);
	} else {
		return Math.ceil(note);
	}
}

// Append the section Mes simulation with the new simulation created
async function createNewSimulation(note, taux, creation) {
	const previousDiv = document.getElementById("previous");
	const previousText = document.getElementById("previous-text");

	const newContent =
		"<article>" +
		`<div class="type"><img src="./car.png"><p>${getVehicleType()}</p><h3>${await data.then(
			(response) => {
				return response.type_vehicule[getVehicleType()].note;
			}
		)}/10</h3></div>` +
		`<div class="energy"><img src="./energy.png"><p>${getVehicleEnergy()}</p><h3>${await data.then(
			(response) => {
				return response.energie[getVehicleEnergy()];
			}
		)}/10</h3></div>` +
		`<div class="travel"><img src="./wheel.png"><p>${getVehicleTravel()}K</p><h3>${await data.then(
			(response) => {
				return response.kilometrage[getVehicleTravel()];
			}
		)}/10</h3></div>` +
		`<div class="creation"><img src="./calendar.png"><p>${getVehicleCreation()}</p><h3>${await data.then(
			(response) => {
				return response.annee[creation];
			}
		)}/10</h3></div>` +
		`<div class="passengers"><img src="./passengers.png"><p>${getVehiclePassengers()}</p><h3>${await data.then(
			(response) => {
				return response.passagers[getVehiclePassengers()];
			}
		)}%</h3></div>` +
		`<div class="previous_result"><p>Note : <span class="green">${note}/40</span></p><p>Taux d\emprunt : <span class="green">${taux}%</span></p></div>` +
		"</article>";

	if (previousText.innerText == "Vous n'avez aucune simulation !") {
		previousText.innerText = "";
		previousDiv.innerHTML += newContent;
	} else {
		previousDiv.innerHTML += newContent;
	}
}

// Create the content of the result section
function createResult(note, taux) {
	const resultSection = document.getElementById("result-section");
	resultSection.innerHTML = `<h2>Résultat :</h2><div id=\"result\" class=\"result\"><p>Note : <span class=\"green\">${note}/40</span></p><p>Taux d'emprunt : <span class=\"green\">${taux}%</span></p></div>`;
}

// Calculation of the rating and the rate of the vehicle
async function result() {
	const error = document.getElementById("error");
	let note = 0;
	let taux = 0;
	let creation = null;

	// Check if an input is empty
	if (
		getVehicleCreation() == "" ||
		getVehicleCreation() < 1960 ||
		getVehiclePassengers() == "" ||
		getVehiclePassengers() < 1 ||
		getVehiclePassengers() > 4
	) {
		error.style.display = "block";
		return;
	} else {
		// Calculations
		error.style.display = "none";
		note += await data.then((response) => {
			return (
				response.type_vehicule[getVehicleType()].note +
				response.energie[getVehicleEnergy()] +
				response.kilometrage[getVehicleTravel()]
			);
		});

		const dates = await data.then((response) => {
			return response.annee;
		});

		for (elem in dates) {
			const datesBtw = elem.split("-");
			const date = parseInt(getVehicleCreation());
			if (parseInt(datesBtw[0]) <= date && date < parseInt(datesBtw[1])) {
				creation = elem;
				note += parseInt(
					await data.then((response) => {
						return parseInt(response.annee[creation]);
					})
				);
			}
		}

		note = adjustNote(note);

		const notes = await data.then((response) => {
			return response.taux;
		});

		for (elem in notes) {
			const notesBtw = elem.split("-");
			if (
				parseInt(notesBtw[0]) <= note &&
				note <= parseInt(notesBtw[1])
			) {
				console.log(true);
				taux += parseFloat(
					Number(
						await data.then((response) => {
							return (
								parseFloat(response.taux[elem]) +
								parseFloat(
									response.passagers[getVehiclePassengers()]
								)
							);
						})
					).toFixed(2)
				);
			}
		}

		// Modifying the html content
		createResult(note, taux);
		createNewSimulation(note, taux, creation);
	}
}

/* Load Selector Values */
async function loadSelectorValues(id, json) {
	const travelSelector = document.getElementById(id);
	const travelValues = await data.then((response) => {
		return response[json];
	});
	let content = "";

	for (elem in travelValues) {
		content += `<option value="${elem}">${elem}</option>`;
	}

	travelSelector.innerHTML = content;
}

/* Call the loadSelectorsValues when window is loaded */
window.onload = () => {
	loadSelectorValues("car-type", "type_vehicule");
	loadSelectorValues("car-energy", "energie");
	loadSelectorValues("car-travel", "kilometrage");
};
