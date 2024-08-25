
async function executeQuery() {
    const PAGE = 0, SORT = "firstName", IS_DESCENDING = false;

    const query = document.getElementById("queryInput").value
    const ravendbResponse = await fetch(
        `http://localhost:8080/users/${PAGE}?query=${query}&sort=${SORT}&isDescending=${IS_DESCENDING}`
    )
    const mongodbResponse = await fetch(
        `http://localhost:8081/users/${PAGE}?query=${query}&sort=${SORT}&isDescending=${IS_DESCENDING}`
    )
    
    const ravendbResult = await ravendbResponse.json()
    console.log("raven: ", ravendbResult.durationInMs)
    document.getElementById("raven-timer").innerText = ravendbResult.durationInMs

    const mongodbResult = await mongodbResponse.json()
    console.log("mongo: ", mongodbResult.durationInMs)
    document.getElementById("mongo-timer").innerText = mongodbResult.durationInMs
}