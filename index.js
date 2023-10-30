// Import data from the data.json file
const data = fetch("./data.json").then((response) => response.json());

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

function adjustNote(note) {
	if (note - parseInt(note) < 0.51) {
		return Math.floor(note);
	} else {
		return Math.ceil(note);
	}
}

function createNewSimulation(note, taux) {
	const previousDiv = document.getElementById("previous");
	const previousText = document.getElementById("previous-text");
	
	if (previousText.innerText == "Vois n'avez aucune simulations !") {
		previousText.innerText = ""
	} else {
		
	}
}

function createResult(note, taux) {
	const resultSection = document.getElementById("result-section");
	resultSection.innerHTML = `<h2>Résultat :</h2><div id=\"result\" class=\"result\"><p>Note : <span class=\"green\">${note}/40</span></p><p>Taux d'emprunt : <span class=\"green\">${taux}%</span></p></div>`;
}

async function result() {
	const error = document.getElementById("error");
	let note = 0;
	let taux = 0;

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
			const dates_btw = elem.split("-");
			const date = parseInt(getVehicleCreation());
			if (
				parseInt(dates_btw[0]) <= date &&
				date < parseInt(dates_btw[1])
			) {
				note += parseInt(
					await data.then((response) => {
						return parseInt(response.annee[elem]);
					})
				);
			}
		}

		note = adjustNote(note);

		const notes = await data.then((response) => {
			return response.taux;
		});
		console.log(notes);
		for (elem in notes) {
			const notes_btw = elem.split("-");
			console.log(notes_btw);
			if (
				parseInt(notes_btw[0]) <= note &&
				note < parseInt(notes_btw[1])
			) {
				taux += parseFloat(
					await data.then((response) => {
						return (
							parseFloat(response.taux[elem]) +
							parseFloat(
								response.passagers[getVehiclePassengers()]
							)
						);
					})
				);
			}
		}

		createResult(note, taux);
	}
}
