// Import data from the data.json file
const data = fetch("./data.json").then((response) => response.json());

function getVehicleType() {
	return document.getElementById("car-type").value;
}

function getVehicleEnergy() {
	return document.getElementById("car-energy").value;
}

async function getVehicleWeight() {
	const input = parseInt(document.getElementById("car-weight").value);
	const carData = await data.then((response) => {
		return response.type_vehicule[getVehicleType()].poid_moyen.split("-");
	});

	if (carData[0] < input && input < carData[1]) {
		return input;
	} else {
		return Promise.resolve();
	}
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

function createNewSimulation() {}

async function result() {
	const error = document.getElementById("error");
	let note = 0;

	if (
		(await getVehicleWeight()) == null ||
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
            console.log(dates_btw)
			const date = parseInt(getVehicleCreation());
			if (parseInt(dates_btw[0]) < date && date < parseInt(dates_btw[1])) {
                console.log(true)
				note += parseInt(await data.then((response) => {
					return parseInt(response.annee[elem]);
				}));
                console.log(true)
			}
		}

		console.log(note);
	}
}
