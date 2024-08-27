const dbColors = {
    "raven": ["rgba(0, 120, 212,", "rgba(50, 100, 160,", "rgba(, 40, 100,"],
    "mongo": ["rgba(0, 237, 100,", "rgba(50, 237, 150,", "rgba(0, 200, 50,"]
}

async function executeQuery() {
    clearTimer("raven")
    clearTimer("mongo")

    const query = document.getElementById("queryInput").value
    queryDatabase(8080, "raven", query)
    queryDatabase(8081, "mongo", query)
}

async function queryDatabase(api_port, database_name, query) {
    const PAGE = 0, SORT = "firstName", IS_DESCENDING = false;

    const response = await fetch(
        `http://localhost:${api_port}/users/${PAGE}?query=${query}&sort=${SORT}&isDescending=${IS_DESCENDING}`
    )
    
    const result = await response.json()
    const container = document.querySelector(`.timer-container[data-db=${database_name}]`)
    container.style = "border: 1px solid var(--accent-color);"
    
    container.querySelector(".timer").innerText = result.durationInMs.toLocaleString()
    container.querySelector(".user").innerText = result.users[0].firstName

    confetti.start(0, 0, 150, dbColors[database_name])
    setTimeout(() => confetti.stop(), 2000)
}

function clearTimer(database_name) {
    const container = document.querySelector(`.timer-container[data-db=${database_name}]`)
    container.style = "border: none;"
    
    container.querySelector(".timer").innerText = ""
    container.querySelector(".user").innerText = ""
}