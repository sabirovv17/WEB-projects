const results = []; 
const rowsPerPage = 10; 
let currentPage = 1; 

function formatYValue(y) {
    let number = parseFloat(y);
    if (isNaN(number)) return y;  
    
    let str = number.toString();
    
    if (str.indexOf('.') !== -1) {
        str = str.substring(0, str.indexOf('.') + 5); // 4 знака после точки
    }
    return parseFloat(str).toString();
}
document.getElementById('input-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const xValue = document.getElementById('hidden-x-value').value;
    let yValue = document.getElementById('y').value;
    const rValue = document.getElementById('r').value;
    const currentTime = new Date().toLocaleString();
    
    if (!(validateX(xValue) && validateY(yValue) && validateR(rValue))) return;
    yValue = formatYValue(yValue);  
    console.log(yValue);
    fetch(`./fcgi-bin/labwork1.jar?x=${xValue}&y=${yValue}&r=${rValue}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) throw new Error('Network or server error');
        return response.json();
    })
    .then(response => {
        const hitResult = response.result ? 'hit' : 'miss';
        const executionTime = response.executionTime;

        addResult(xValue, yValue, rValue, currentTime, executionTime, hitResult);
        saveTableData();
    })
    .catch(error => {
        console.error('Error: ', error);
        document.getElementById('error-message').textContent = 'An error occurred during the request.';
    });
});


function highlightXButton() {
    const checkboxes = document.querySelectorAll('.single-checkbox');
    const hiddenXValue = document.getElementById('hidden-x-value');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                checkboxes.forEach((cb) => {
                    if (cb !== checkbox) cb.checked = false;
                });
                hiddenXValue.value = checkbox.value;
            } else {
                hiddenXValue.value = "";
            }
        });
    });
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
    } else if (yValue < -3 || yValue > 5) {
        displayErrorMessage("Y value should be between -3 and 5");
        return false;
    }
    return true;
}

function validateR(r) {
    document.getElementById("error-message").innerHTML = "";
    if (!r) {
        displayErrorMessage("Choose R parameter");
        return false;
    } else if (r < 1 || r > 5) {
        displayErrorMessage("R value should be between 1 and 5");
        return false;
    }
    return true;
}

function displayErrorMessage(message) {
    document.getElementById("error-message").innerHTML = message;
}

function addResult(x, y, r, currentTime, execTime, hitResult) {
    results.unshift({ x, y, r, currentTime, execTime, hitResult });
    updateTable();
}

function updateTable() {
    const table = document.getElementById("result-table");
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedResults = results.slice(startIndex, endIndex);

    table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

    paginatedResults.forEach(result => {
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = result.x;
        newRow.insertCell(1).textContent = result.y;
        newRow.insertCell(2).textContent = result.r;
        newRow.insertCell(3).textContent = result.currentTime;
        newRow.insertCell(4).textContent = result.execTime;
        newRow.insertCell(5).textContent = result.hitResult;
    });

    renderPaginationControls();
}

function renderPaginationControls() {
    const paginationControls = document.getElementById("pagination-controls");
    paginationControls.innerHTML = ""; 

    const totalPages = Math.ceil(results.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = i === currentPage ? "active" : "";
        button.addEventListener("click", () => {
            currentPage = i;
            updateTable();
        });
        paginationControls.appendChild(button);
    }
}

function saveTableData() {
    localStorage.setItem('tableData', JSON.stringify(results));
}

function loadTableData() {
    const savedResults = JSON.parse(localStorage.getItem('tableData') || '[]');
    results.push(...savedResults); 
    updateTable();
}

window.onload = () => {
    highlightXButton();
    loadTableData();
};

const paginationControlsDiv = document.createElement('div');
paginationControlsDiv.id = "pagination-controls";
document.body.appendChild(paginationControlsDiv);
