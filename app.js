const express = require('express');
const app = express();

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
  });

// calculate the values and return an object with all the data for Residential
app.get('/api/residential', (req, res) => {
    if (req.query.apartment == "" || req.query.floor == "" || req.query.type == "") {
        res.status(400).send('a parameters is empty or not in the good format')
        return;
    }

    let apartment = req.query.apartment;
    let floor = req.query.floor;
    let type = req.query.type;

    let numElevator = numberElevatorResidential(apartment,floor);
    let totalPriceElevator = getTotalElevatorPrice(numElevator,type);
    let fees = 0;
    if (type == "standard") {
        fees = getStandardFees(totalPriceElevator);
    }
    if (type == "premium") {
        fees = getPremiumFees(totalPriceElevator);
    }
    if (type == "excelium") {
        fees = getExceliumFees(totalPriceElevator);
    }
    let fullPrice = getFullPrice(fees,totalPriceElevator)

    res.send({"numElevator": numElevator, 
    "totalPriceElevator": totalPriceElevator,
    "fees": fees,
    "fullPrice": fullPrice},);
});

// calculate the values and return an object with all the data for Commercial
app.get('/api/commercial', (req, res) => {
    if (req.query.numelevator = 0) {
        res.status(400).send('numElevator cant be 0')
        return;
    }

    let elevator = parseInt(req.query.elevator);
    let type = req.query.type;

    let totalPriceElevator = getTotalElevatorPrice(elevator,type);
    let fees = 0;
    if (type == "standard") {
        fees = getStandardFees(totalPriceElevator);
    }
    if (type == "premium") {
        fees = getPremiumFees(totalPriceElevator);
    }
    if (type == "excelium") {
        fees = getExceliumFees(totalPriceElevator);
    }
    let fullPrice = getFullPrice(fees,totalPriceElevator)

    res.send({"numElevator": elevator, 
    "totalPriceElevator": totalPriceElevator,
    "fees": fees,
    "fullPrice": fullPrice});
});

// calculate the values and return an object with all the data for Corporate
app.get('/api/corporate', (req, res) => {
    if (req.query.floor == "" || req.query.basement == "" || req.query.maxOccup == "" || req.query.type == "") {
        res.status(400).send('a parameters is empty or not in the good format')
        return;
    }
    let floor = req.query.floor;
    let basement = req.query.basement;
    let maxOccup = req.query.maxOccup;
    let type = req.query.type;

    let numElevator = numberElevatorCorporate(floor,basement,maxOccup);
    let totalPriceElevator = getTotalElevatorPrice(numElevator,type);
    let fees = 0;
    if (type == "standard") {
        fees = getStandardFees(totalPriceElevator);
    }
    if (type == "premium") {
        fees = getPremiumFees(totalPriceElevator);
    }
    if (type == "excelium") {
        fees = getExceliumFees(totalPriceElevator);
    }
    let fullPrice = getFullPrice(fees,totalPriceElevator)

    res.send({"numElevator": numElevator, 
    "totalPriceElevator": totalPriceElevator,
    "fees": fees,
    "fullPrice": fullPrice});
});

// calculate the values and return an object with all the data for Hybrid
app.get('/api/hybrid', (req, res) => {
    if (req.query.floor == "" || req.query.basement == "" || req.query.maxOccup == "" || req.query.type == "") {
        res.status(400).send('a parameters is empty or not in the good format')
        return;
    }

    let floor = req.query.floor;
    let basement = req.query.basement;
    let maxOccup = req.query.maxOccup;
    let type = req.query.type;

    let numElevator = numberElevatorHybrid(floor,basement,maxOccup);
    let totalPriceElevator = getTotalElevatorPrice(numElevator,type);
    let fees = 0;
    if (type == "standard") {
        fees = getStandardFees(totalPriceElevator);
    }
    if (type == "premium") {
        fees = getPremiumFees(totalPriceElevator);
    }
    if (type == "excelium") {
        fees = getExceliumFees(totalPriceElevator);
    }
    let fullPrice = getFullPrice(fees,totalPriceElevator)

    res.send({"numElevator": numElevator, 
    "totalPriceElevator": totalPriceElevator,
    "fees": fees,
    "fullPrice": fullPrice});
});


//****************************************OPERATION*********************************************************** */

const STANDARD_PRICE = 7565;
const PREMIUM_PRICE = 12345;
const EXCELIUM_PRICE = 15400;

const STANDARD_FEES = 0.10;
const PREMIUM_FEES = 0.13;
const EXCELIUM_FEES = 0.16;

// get number of elevator for residential
function numberElevatorResidential(apartment,floor) {
    var moy = Math.ceil(apartment/floor);
    numElevator = Math.ceil(moy/6);

    if (numElevator == 0) {
        numElevator++;
    }
    if (floor > 20 == true) {
        var column = Math.ceil(floor / 20);
        numElevator *= column;
    }

    return numElevator;
}

/* Caculate the number of recommanded elevators for corporate */
function numberElevatorCorporate(floor,basement,maxOccup) {

    var totalFloors = parseInt(floor) + parseInt(basement);
    var totalOccup = maxOccup*totalFloors;

    numElevator = Math.round(totalOccup/1000);
        if (numElevator == 0) {
            numElevator++;
        }

    elevatorColumns = Math.ceil(totalFloors/20);
    if (elevatorColumns == 0) {
        elevatorColumns++;
    }

    var averageElCol = Math.ceil(numElevator/elevatorColumns);

    return averageElCol*elevatorColumns;
}

/* Caculate the number of recommanded elevators for corporate */
function numberElevatorHybrid(floor,basement,maxOccup) {

    var totalFloors = parseInt(floor) + parseInt(basement);
    var totalOccup = maxOccup*totalFloors;

    numElevator = Math.round(totalOccup/1000);
        if (numElevator == 0) {
            numElevator++;
        }

    elevatorColumns = Math.ceil(totalFloors/20);
    if (elevatorColumns == 0) {
        elevatorColumns++;
    }

    var averageElCol = Math.ceil(numElevator/elevatorColumns);

    return averageElCol*elevatorColumns;
}


// get the total price of elevator
function getTotalElevatorPrice(numElevator,type) {
    var total = 0;
    if (type == "standard") {
        total = numElevator * STANDARD_PRICE;
        return total;
    }else if (type == "premium") {
        total = numElevator * PREMIUM_PRICE;
        return total;
    }else if (type == "excelium") {
        total = numElevator * EXCELIUM_PRICE;
        return total;
    }
    return total;
}

// calculate the fees when Standard is checked
function getStandardFees(total) {
    var totalFees = total * STANDARD_FEES;
    return totalFees;
}

// calculate the fees when Premium is checked
function getPremiumFees(total) {
    var totalFees = total * PREMIUM_FEES;
    return totalFees;
}

// calculate the fees when Excelium is checked
function getExceliumFees(total) {
    var totalFees = total * EXCELIUM_FEES;
    return totalFees;
}

// calculate the full price with fees and total price of elevators
function getFullPrice(fees,total){
    return fees+total;
}

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));