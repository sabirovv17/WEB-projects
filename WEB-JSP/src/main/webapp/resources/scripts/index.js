const ROWS_PER_PAGE = 10;
let currentPage = 1;
let totalRows = 0;

function paginateTable() {
    const tableBody = document.querySelector('#result-table tbody');
    const rows = Array.from(tableBody.rows);

    totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);

    // Hide all rows
    rows.forEach((row, index) => {
        row.style.display = 'none';
        if (index >= (currentPage - 1) * ROWS_PER_PAGE && index < currentPage * ROWS_PER_PAGE) {
            row.style.display = '';
        }
    });

    // Update pagination controls
    document.getElementById('current-page').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Event listeners for pagination buttons
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        paginateTable();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        paginateTable();
    }
});
function clearTable() {
    const tableBody = document.querySelector('#result-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
    }
}
document.getElementById('input-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const xValue = document.querySelector('input[name="x"]:checked');
    if (!xValue) {
        document.getElementById('error-message').textContent = 'Please select a value for X.';
        return;
    }
    const yValue = document.getElementById('y').value;
    const rValue = document.getElementById('r').value;

    if (!(validateX(xValue.value) && validateY(yValue) && validateR(rValue))) return;

    const formattedY = formatYValue(yValue);

    fetch(`/web2/controller?x=${xValue.value}&y=${formattedY}&r=${rValue}`, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) throw new Error('Network or server error');
            return response.json();
        })
        .then(response => {
            console.log(response);
            updateTable(response);
            getValuesFromTable();
        })
        .catch(error => {
            console.error('Error: ', error);
            document.getElementById('error-message').textContent = 'An error occurred during the request.';
        });
});

function updateTable(points) {
    const tableBody = document.querySelector('#result-table tbody');

    if (!tableBody) {
        console.error("Table body not found");
        return;
    }

    // Clear existing table rows
    clearTable();

    points.forEach(point => {
        const newRow = document.createElement("tr");

        const xCell = document.createElement("td");
        xCell.textContent = formatFloat(point.x);
        newRow.appendChild(xCell);

        const yCell = document.createElement("td");
        yCell.textContent = formatFloat(point.y);
        newRow.appendChild(yCell);

        const rCell = document.createElement("td");
        rCell.textContent = formatFloat(point.r);
        newRow.appendChild(rCell);

        const execTimeCell = document.createElement("td");
        execTimeCell.textContent = point.executionTime;
        newRow.appendChild(execTimeCell);

        const resultCell = document.createElement("td");
        resultCell.textContent = point.isHit ? 'hit' : 'miss';
        newRow.appendChild(resultCell);

        tableBody.insertBefore(newRow, tableBody.firstChild);
    });

    paginateTable();
}
// function updateTable(points) {
//     const tableBody = document.querySelector('#result-table tbody');
    
//     if (!tableBody) {
//         console.error("Table body not found");
//         return;
//     }
//     tableBody.innerHTML = '';
//     points.forEach(point => {
//         const newRow = document.createElement("tr");

//         const xCell = document.createElement("td");
//         xCell.textContent = formatFloat(point.x);
//         newRow.appendChild(xCell);

//         const yCell = document.createElement("td");
//         yCell.textContent = formatFloat(point.y);
//         newRow.appendChild(yCell);

//         const rCell = document.createElement("td");
//         rCell.textContent = formatFloat(point.r);
//         newRow.appendChild(rCell);

//         const execTimeCell = document.createElement("td");
//         execTimeCell.textContent = point.executionTime;
//         newRow.appendChild(execTimeCell);

//         const resultCell = document.createElement("td");
//         resultCell.textContent = point.isHit ? 'hit' : 'miss';
//         newRow.appendChild(resultCell);
//         const firstRow = tableBody.firstChild;
//         if (firstRow) {
//             tableBody.insertBefore(newRow, firstRow);
//         } else {
//             tableBody.appendChild(newRow);
//         }
//     });
// }

function formatFloat(value) {
    const number = parseFloat(value);
    if (Number.isInteger(number)) {
        return number.toFixed(1); 
    }
    return value.toString(); 
}

function formatYValue(y) {
    let number = parseFloat(y);
    if (isNaN(number)) return y;  
    
    let str = number.toString();
    
    if (str.indexOf('.') !== -1) {
        str = str.substring(0, str.indexOf('.') + 5); 
    }
    return parseFloat(str).toString();
}
function validateX(x) {
    document.getElementById("error-message").innerHTML = "";
    if (!x) {
        displayErrorMessage("Choose X parameter");
        return false;
    } else if (x < -2 || x > 2) {
        displayErrorMessage("X value should be between -2 and 2");
        return false;
    }
    return true;
}
function validateY(y) {
    document.getElementById("error-message").innerHTML = "";
    const regex = /^-?([1-9]\d*|0)(\.\d+)?$/;

    const yValue = parseFloat(y);

    if (!regex.test(y)) {
        displayErrorMessage("Y must be a valid number without leading zeros");
        return false;
    } else if (yValue < -5 || yValue > 5) {
        displayErrorMessage("Y value should be between -5 and 5");
        return false;
    }
    return true;
}
function validateR(r) {
    document.getElementById("error-message").innerHTML = "";
    if (!r) {
        displayErrorMessage("Choose R parameter");
        return false;
    } else if (r < 1 || r > 3) {
        displayErrorMessage("R value should be between 1 and 5");
        return false;
    }
    return true;
}
function displayErrorMessage(message) {
    document.getElementById("error-message").innerHTML = message;
}

function clearPoints() {
    const svg = document.querySelector("svg"); 
    const circles = document.querySelectorAll("circle"); 
    circles.forEach(circle => circle.remove());
}

function drawPoint(x, y, r, isHit) {
    const svg = document.querySelector("svg"); 
    const scaleFactor = 150 / r; 
    const scaledX = x * scaleFactor; 
    const scaledY = -y * scaleFactor;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute("cx", scaledX); 
    circle.setAttribute("cy", scaledY);
    circle.setAttribute("r", 5); 
    circle.setAttribute("fill", isHit ? "green" : "red");

    svg.appendChild(circle);
}

function getValuesFromTable() {
    clearPoints(); 
    const table = document.getElementById("result-table"); 
    if (table.rows.length <= 1) return;
    const r = parseFloat(table.rows[1].cells[2].innerText); 
    if (!isNaN(r)) {
        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const x = parseFloat(row.cells[0].innerText);
            const y = parseFloat(row.cells[1].innerText);
            const result = row.cells[4].innerText === "hit";
            
            drawPoint(x, y, r, result);
        }
    }
}
document.getElementById("graph-svg").addEventListener("click", function(event) {
    let r = parseFloat(document.getElementById("r").value);
    if (!r || isNaN(r)) return;

    const svg = event.currentTarget; 
    const rect = svg.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const scaleFactor = 150 / r;
    const x = ((clickX - 200) / scaleFactor);
    const y = -((clickY - 200) / scaleFactor);

    document.getElementById("hidden-x").value = x;
    document.getElementById("hidden-y").value = y;
    document.getElementById("hidden-r").value = r;
    document.getElementById("hidden-submit").click();
});
document.getElementById("hidden-form").addEventListener('submit', function(event) {
    event.preventDefault();

    const xValue = document.getElementById("hidden-x").value;
    const yValue = document.getElementById("hidden-y").value; 
    const rValue = document.getElementById("hidden-r").value;
    console.log(xValue, yValue, rValue);
    if (!(validateX(xValue) && validateY(yValue) && validateR(rValue))) {
        return; 
    }

    fetch(`/web2/controller?x=${xValue}&y=${yValue}&r=${rValue}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`);
        return response.text(); 
    })
    .then(text => {
        console.log('Server response:', text);
        if (!text) throw new Error('Empty response from server');
        return JSON.parse(text); 
    })
    .then(response => {
        console.log(response);
        updateTable(response);
        getValuesFromTable();
    });
});

window.onload = () => {
    getValuesFromTable();
    paginateTable();
};
