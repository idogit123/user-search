
async function executeQuery() {
    const PAGE = 0, SORT = "firstName", IS_DESCENDING = false;

    const query = document.getElementById("queryInput").value
    const response = await fetch(
        `http://localhost:8080/users/${PAGE}?query=${query}&sort=${SORT}&isDescending=${IS_DESCENDING}`
    )
    
    const result = await response.json()
    console.log(result.durationInMs)
}