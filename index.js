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
    return document.getElementById("car-travel").value
}

function getVehicleCreation() {
    return document.getElementById("car-creation").value
}

function getVehiclePassengers() {
    return document.getElementById("car-passengers").value
}

function createNewSimulation() {

}

async function result() {
    const error = document.getElementById("error")

    if (await getVehicleWeight() == null) {
        error.style.display = "block";
        return
    } else {
        error.style.display = "none";
    }
}
