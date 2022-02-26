//URLs
const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

//Funciones
let createEventsRow = (log, index) => {
  let contents = document.getElementById("event-table-content");
  if (index == 0) {
    contents.innerHTML = null;
  }

  let row = document.createElement("tr");

  let id = document.createElement("th");
  let event = document.createElement("td");
  let squirrel = document.createElement("td");

  id.innerText = index + 1;
  event.innerText = log.events.join(",");
  squirrel.innerText = log.squirrel;

  if (log.squirrel) {
    row.className = "table-danger";
  }

  row.appendChild(id);
  row.appendChild(event);
  row.appendChild(squirrel);

  contents.appendChild(row);

  processEvents(log.events);
};

let processEvents = (events) => {
  events.forEach((event) => {
    if (!eventList.includes(event)) {
      eventList.push(event);
    }
  });
};

let processEventCorrelations = (eventsList, logs) => {
  eventsList.forEach((event) => {
    let FP = 0;
    let TN = 0;
    let TP = 0;
    let FN = 0;
    logs.forEach((log) => {
      let events = log.events;
      let squirrel = log.squirrel;

      if (!events.includes(event)) {
        if (squirrel) {
          FP += 1;
        } else {
          TN += 1;
        }
      } else {
        if (squirrel) {
          TP += 1;
        } else {
          FN += 1;
        }
      }
    });
    calculateEventCorrelation(event, FP, TN, TP, FN);
  });
};

let calculateEventCorrelation = (event, FP, TN, TP, FN) => {
  correlations[event] =
    (TP * TN - FP * FN) /
    Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
};

let displayError = () => {
  let contents = document.getElementById("contents");

  let p = document.createElement("p");
  p.innerText =
    "Sorry, there was an error loading the data. Please try again later :(";
  contents.innerHTML = null;
  contents.appendChild(p);
};

let createCorrelationRow = (eventTuple, index) => {
  let contents = document.getElementById("correlation-table-content");
  if (index == 0) {
    contents.innerHTML = null;
  }

  let row = document.createElement("tr");

  let id = document.createElement("th");
  let event = document.createElement("td");
  let correlation = document.createElement("td");

  id.innerText = index + 1;
  event.innerText = eventTuple[0];
  correlation.innerText = eventTuple[1];

  row.appendChild(id);
  row.appendChild(event);
  row.appendChild(correlation);

  contents.appendChild(row);
};

//Conteo casos
let eventList = [];
// Correlaciones
let correlations = {};

//Carga de datos
fetch(url)
  .then((response) => response.json())
  .then((logs) => {
    logs.forEach(createEventsRow);
    processEventCorrelations(eventList, logs);
    Object.entries(correlations)
      .sort((a, b) => b[1] - a[1])
      .forEach(createCorrelationRow);
  })
  .catch(displayError);
