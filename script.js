
let taskList = [];
let currentTaskType = "";
let currentTaskId = null;
let editingTask = false;

// Tank data configuration
const tankData = {
    "T-101": {
        processName: "Process A",
        chemicals: {
            "Sulfuric Acid": {
                specLimit: "10-20",
                controlLimit: "5-15",
                optimumLimit: "N.a"
            },
            "Naoh": {
                specLimit: "8-18",
                controlLimit: "4-12",
                optimumLimit: "N.a"
            }
        },
        operatingVolume: "1000L",
        parameters: {
            "Sulfuric Acid": {controlLimit: "5-15", specLimit: "10-20", optimumLimit: "N.a"},
            "Naoh": {controlLimit: "4-12", specLimit: "8-18", optimumLimit: "N.a"}
        }
    },
    "T-102": {
        processName: "Process B",
        chemicals: {
            "Hydrochloric Acid": {
                specLimit: "15-25",
                controlLimit: "10-20",
                optimumLimit: "N.a"
            },
            "Potassium Hydroxide": {
                specLimit: "12-22",
                controlLimit: "8-18",
                optimumLimit: "N.a"
            }
        },
        operatingVolume: "1500L",
        parameters: {
            "Hydrochloric Acid": {controlLimit: "10-20", specLimit: "15-25", optimumLimit: "N.a"},
            "Potassium Hydroxide": {controlLimit: "8-18", specLimit: "12-22", optimumLimit: "N.a"}
        }
    },
    "T-103": {
        processName: "Process C",
        chemicals: {
            "Nitric Acid": {
                specLimit: "5-15",
                controlLimit: "3-12",
                optimumLimit: "N.a"
            }
        },
        operatingVolume: "800L",
        parameters: {
            "Nitric Acid": {controlLimit: "3-12", specLimit: "5-15", optimumLimit: "N.a"}
        }
    }
};

function openTaskForm(type) {
    currentTaskType = type;
    editingTask = false;
    currentTaskId = null;
    
    document.getElementById("modal-title").innerText = `Add ${type} Task`;
    clearTaskForm();
    showFieldsForTaskType(type);
    document.getElementById("task-modal").style.display = "block";
}

function editTask(id) {
    const task = taskList.find(t => t.id === id);
    if (!task) return;
    
    currentTaskType = task.type;
    currentTaskId = id;
    editingTask = true;
    
    document.getElementById("modal-title").innerText = `Edit ${task.type} Task`;
    populateTaskForm(task);
    showFieldsForTaskType(task.type);
    document.getElementById("task-modal").style.display = "block";
}

function showFieldsForTaskType(type) {
    const replenishFields = document.getElementById("replenish-fields");
    const makeupDumpoffFields = document.getElementById("makeup-dumpoff-fields");
    
    if (type === "Replenish") {
        replenishFields.style.display = "block";
        makeupDumpoffFields.style.display = "none";
    } else {
        replenishFields.style.display = "none";
        makeupDumpoffFields.style.display = "block";
    }
}

function populateFields() {
    const tankNo = document.getElementById("tankNo").value;
    if (!tankNo || !tankData[tankNo]) return;
    
    const data = tankData[tankNo];
    
    if (currentTaskType === "Replenish") {
        document.getElementById("processName").value = data.processName;
        const chemicalSelect = document.getElementById("chemicalUsed");
        chemicalSelect.innerHTML = '<option value="">Select Chemical</option>';
        Object.keys(data.chemicals).forEach(chem => {
            chemicalSelect.innerHTML += `<option value="${chem}">${chem}</option>`;
        });
    } else {
        document.getElementById("tankDescription").value = data.processName;
        document.getElementById("operatingVolume").value = data.operatingVolume;
        const parameterSelect = document.getElementById("parameter");
        parameterSelect.innerHTML = '<option value="">Select Parameter</option>';
        Object.keys(data.parameters).forEach(param => {
            parameterSelect.innerHTML += `<option value="${param}">${param}</option>`;
        });
    }
}

function updateLimits() {
    const tankNo = document.getElementById("tankNo").value;
    if (!tankNo || !tankData[tankNo]) return;
    
    if (currentTaskType === "Replenish") {
        const selectedChemical = document.getElementById("chemicalUsed").value;
        if (selectedChemical && tankData[tankNo].chemicals[selectedChemical]) {
            const chemicalData = tankData[tankNo].chemicals[selectedChemical];
            document.getElementById("specificationLimit").value = chemicalData.specLimit;
            document.getElementById("controlLimitReplenish").value = chemicalData.controlLimit;
        }
    } else {
        const selectedParameter = document.getElementById("parameter").value;
        if (selectedParameter && tankData[tankNo].parameters[selectedParameter]) {
            const parameterData = tankData[tankNo].parameters[selectedParameter];
            document.getElementById("controlLimit").value = parameterData.controlLimit;
            document.getElementById("optimumLimit").value = parameterData.optimumLimit;
        }
    }
}

function saveTask() {
    const reportNo = document.getElementById("reportNo").value;
    const tankNo = document.getElementById("tankNo").value;
    
    if (!reportNo || !tankNo) {
        alert("Please fill in required fields (Report No. and Tank No.)");
        return;
    }
    
    const taskData = {
        id: editingTask ? currentTaskId : Date.now(),
        type: currentTaskType,
        reportNo: reportNo,
        tankNo: tankNo,
        status: "waiting for execution",
        createdAt: new Date().toLocaleString()
    };
    
    if (currentTaskType === "Replenish") {
        taskData.processName = document.getElementById("processName").value;
        taskData.chemicalUsed = document.getElementById("chemicalUsed").value;
        taskData.specificationLimit = document.getElementById("specificationLimit").value;
        taskData.controlLimit = document.getElementById("controlLimitReplenish").value;
        taskData.result = document.getElementById("result").value;
        taskData.productName = document.getElementById("productName").value;
        taskData.quantity = document.getElementById("quantity").value;
        taskData.chemistName = document.getElementById("chemistName").value;
    } else {
        taskData.tankDescription = document.getElementById("tankDescription").value;
        taskData.operatingVolume = document.getElementById("operatingVolume").value;
        taskData.parameter = document.getElementById("parameter").value;
        taskData.controlLimit = document.getElementById("controlLimit").value;
        taskData.optimumLimit = document.getElementById("optimumLimit").value;
        taskData.dateTime = document.getElementById("dateTime").value;
        taskData.chemicalAdded = document.getElementById("chemicalAdded").value;
        taskData.additionRecommendation = document.getElementById("additionRecommendation").value;
        taskData.chemistDateTime = document.getElementById("chemistDateTime").value;
    }
    
    if (editingTask) {
        const index = taskList.findIndex(t => t.id === currentTaskId);
        if (index !== -1) {
            taskList[index] = {...taskList[index], ...taskData};
        }
    } else {
        taskList.push(taskData);
    }
    
    closeTaskForm();
    renderTasks();
}

function populateTaskForm(task) {
    document.getElementById("reportNo").value = task.reportNo || '';
    document.getElementById("tankNo").value = task.tankNo || '';
    
    // Trigger population of dependent fields
    setTimeout(() => {
        populateFields();
        
        if (task.type === "Replenish") {
            document.getElementById("processName").value = task.processName || '';
            document.getElementById("chemicalUsed").value = task.chemicalUsed || '';
            document.getElementById("specificationLimit").value = task.specificationLimit || '';
            document.getElementById("controlLimitReplenish").value = task.controlLimit || '';
            document.getElementById("result").value = task.result || '';
            document.getElementById("productName").value = task.productName || '';
            document.getElementById("quantity").value = task.quantity || '';
            document.getElementById("chemistName").value = task.chemistName || '';
        } else {
            document.getElementById("tankDescription").value = task.tankDescription || '';
            document.getElementById("operatingVolume").value = task.operatingVolume || '';
            document.getElementById("parameter").value = task.parameter || '';
            document.getElementById("controlLimit").value = task.controlLimit || '';
            document.getElementById("optimumLimit").value = task.optimumLimit || '';
            document.getElementById("dateTime").value = task.dateTime || '';
            document.getElementById("chemicalAdded").value = task.chemicalAdded || '';
            document.getElementById("additionRecommendation").value = task.additionRecommendation || '';
            document.getElementById("chemistDateTime").value = task.chemistDateTime || '';
        }
    }, 100);
}

function clearTaskForm() {
    document.getElementById("task-form").reset();
}

function closeTaskForm() {
    document.getElementById("task-modal").style.display = "none";
    clearTaskForm();
}

function markComplete(id) {
    currentTaskId = id;
    document.getElementById("addition-modal").style.display = "block";
}

function openVerification(id) {
    currentTaskId = id;
    document.getElementById("verification-modal").style.display = "block";
}

function saveAddition() {
    const task = taskList.find(t => t.id === currentTaskId);
    if (!task) return;
    
    task.addition = {
        productName: document.getElementById("addProductName").value,
        quantity: document.getElementById("addQuantity").value,
        batchNo: document.getElementById("addBatchNo").value,
        expiryDate: document.getElementById("addExpiryDate").value,
        dateTime: document.getElementById("addDateTime").value,
        operatorName: document.getElementById("addOperatorName").value
    };
    
    task.status = "waiting for verify";
    closeAdditionModal();
    renderTasks();
}

function saveVerification() {
    const task = taskList.find(t => t.id === currentTaskId);
    if (!task) return;
    
    task.verification = {
        date: document.getElementById("verifyDate").value,
        time: document.getElementById("verifyTime").value,
        concentration: document.getElementById("verifyConcentration").value,
        chemist: document.getElementById("verifyChemist").value,
        remarks: document.getElementById("verifyRemarks").value,
        reviewBy: document.getElementById("verifyReviewBy").value
    };
    
    task.status = "completed";
    closeVerificationModal();
    renderTasks();
}

function closeAdditionModal() {
    document.getElementById("addition-modal").style.display = "none";
    document.getElementById("addProductName").value = '';
    document.getElementById("addQuantity").value = '';
    document.getElementById("addBatchNo").value = '';
    document.getElementById("addExpiryDate").value = '';
    document.getElementById("addDateTime").value = '';
    document.getElementById("addOperatorName").value = '';
}

function closeVerificationModal() {
    document.getElementById("verification-modal").style.display = "none";
    document.getElementById("verifyDate").value = '';
    document.getElementById("verifyTime").value = '';
    document.getElementById("verifyConcentration").value = '';
    document.getElementById("verifyChemist").value = '';
    document.getElementById("verifyRemarks").value = '';
    document.getElementById("verifyReviewBy").value = '';
}

function printTask(id) {
    const task = taskList.find(t => t.id === id);
    if (!task) return;
    
    let printHTML = '';
    
    if (task.type === "Replenish") {
        printHTML = `
            <html><head><title>Replenishment Record</title>
            <style>
                table { width: 100%; border-collapse: collapse; font-family: Arial; }
                td, th { border: 1px solid #000; padding: 6px; vertical-align: top; }
                .section-title { background: #ccc; font-weight: bold; text-align: center; }
                .verify-cell { background-color: yellow; text-align: center; }
                .logo { text-align: center; font-weight: bold; font-size: 18px; }
            </style>
            </head><body>
                <table>
                    <tr>
                        <td colspan="2" class="logo">JABIL</td>
                        <td colspan="2" class="section-title">REPLENISHMENT RECORD</td>
                    </tr>
                    <tr><td>Report No.</td><td colspan="3">${task.reportNo || ""}</td></tr>
                    <tr><td>Date</td><td>${new Date().toLocaleDateString()}</td><td>Time</td><td>${new Date().toLocaleTimeString()}</td></tr>
                    <tr><td>Tank No.</td><td colspan="3">${task.tankNo || ""}</td></tr>
                    <tr><td>Process Name</td><td colspan="3">${task.processName || ""}</td></tr>
                    <tr><td>Chemical Used</td><td colspan="3">${task.chemicalUsed || ""}</td></tr>
                    <tr><td>Specification Limit</td><td colspan="3">${task.specificationLimit || ""}</td></tr>
                    <tr><td>Control Limit</td><td colspan="3">${task.controlLimit || ""}</td></tr>
                    <tr><td>Results</td><td colspan="3">${task.result || ""}</td></tr>

                    <tr><td colspan="4" class="section-title">Additional Recommendation for Adjustment of Concentration</td></tr>
                    <tr><td>Product Name</td><td colspan="3">${task.addition?.productName || "-"}</td></tr>
                    <tr><td>Quantity to be added</td><td colspan="3">${task.addition?.quantity || "-"}</td></tr>
                    <tr><td>Chemist-Sign/Stamp</td><td colspan="3">${task.chemistName || "-"}</td></tr>

                    <tr><td colspan="4" class="section-title">Addition Made</td></tr>
                    <tr>
                        <td>Product Name</td><td>${task.addition?.productName || "-"}</td>
                        <td style="background-color: yellow; text-align:center;">&#9744;</td><td style="background-color: yellow;">Correct</td>
                    </tr>
                    <tr>
                        <td>Quantity</td><td>${task.addition?.quantity || "-"}</td>
                        <td style="background-color: yellow; text-align:center;">&#9744;</td><td style="background-color: yellow;">Correct</td>
                    </tr>
                    <tr>
                        <td>Batch No.</td><td>${task.addition?.batchNo || "-"}</td>
                        <td style="background-color: yellow; text-align:center;">&#9744;</td><td style="background-color: yellow;">Correct</td>
                    </tr>
                    <tr>
                        <td>Expiry Date</td><td>${task.addition?.expiryDate || "-"}</td>
                        <td style="background-color: yellow; text-align:center;">&#9744;</td><td style="background-color: yellow;">Correct</td>
                    </tr>
                    <tr><td>Addition Date & Time</td><td colspan="3">${task.addition?.dateTime || "-"}</td></tr>
                    <tr><td>Operator Stamp/Sign</td><td colspan="3">${task.addition?.operatorName || "-"}</td></tr>

                    <tr><td colspan="4" class="section-title">Verification Test</td></tr>
                    <tr><td>Date</td><td colspan="3">${task.verification?.date || "-"}</td></tr>
                    <tr><td>Time</td><td colspan="3">${task.verification?.time || "-"}</td></tr>
                    <tr><td>Re-analysis Concentration</td><td colspan="3">${task.verification?.concentration || "-"}</td></tr>
                    <tr><td>Chemist-Sign/Stamp</td><td colspan="3">${task.verification?.chemist || "-"}</td></tr>
                    <tr><td>Remarks (if any)</td><td colspan="3">${task.verification?.remarks || "-"}</td></tr>
                    <tr><td>Review By</td><td colspan="3">${task.verification?.reviewBy || "-"}</td></tr>
                </table>
            </body></html>
        `;
    } else {
        printHTML = `
            <html><head><title>${task.type} Record</title>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: Arial, sans-serif;
                }
                td, th {
                    border: 1px solid black;
                    padding: 6px;
                    vertical-align: top;
                }
                .header {
                    font-weight: bold;
                    background-color: #f0f0f0;
                    text-align: center;
                }
                .sub-header {
                    background-color: #dbe9db;
                    font-weight: bold;
                    text-align: center;
                }
                .verify-cell {
                    background-color: yellow;
                    text-align: center;
                }
            </style>
            </head><body>
                <table>
                    <tr>
                        <td colspan="2" style="border:none; font-weight:bold; font-size: 20px;">JABIL</td>
                        <td colspan="5" class="header">${task.type.toUpperCase()} RECORD</td>
                    </tr>
                    <tr><td>Report No:</td><td colspan="6">${task.reportNo || ""}</td></tr>
                    <tr><td>Tank No.</td><td colspan="6">${task.tankNo || ""}</td></tr>
                    <tr><td>Tank Description</td><td colspan="6">${task.tankDescription || ""}</td></tr>
                    <tr><td>Operating Volume</td><td colspan="6">${task.operatingVolume || ""}</td></tr>
                    <tr><td>Parameter</td><td colspan="6">${task.parameter || ""}</td></tr>
                    <tr><td>Control Limit</td><td colspan="6">${task.controlLimit || ""}</td></tr>
                    <tr><td>Optimum Limit</td><td colspan="6">${task.optimumLimit || ""}</td></tr>
                    <tr><td>Date & Time</td><td colspan="6">${task.dateTime || ""}</td></tr>
                    <tr><td>Chemical Added</td><td colspan="6">${task.chemicalAdded || ""}</td></tr>
                    <tr><td>Addition Recommendation</td><td colspan="6">${task.additionRecommendation || ""}</td></tr>
                    <tr><td>Chemist -Stamp/Sign Date & Time</td><td colspan="6">${task.chemistDateTime || ""}</td></tr>

                    <tr><td colspan="7" class="sub-header">Additions</td></tr>
                    <tr>
                        <td>Product Added</td>
                        <td colspan="4">${task.addition?.productName || ""}</td>
                        <td class="verify-cell">&#9744;</td><td class="verify-cell">Correct</td>
                    </tr>
                    <tr>
                        <td>Quantity</td>
                        <td colspan="4">${task.addition?.quantity || ""}</td>
                        <td class="verify-cell">&#9744;</td><td class="verify-cell">Correct</td>
                    </tr>
                    <tr>
                        <td>Batch No.</td>
                        <td colspan="4">${task.addition?.batchNo || ""}</td>
                        <td class="verify-cell">&#9744;</td><td class="verify-cell">Correct</td>
                    </tr>
                    <tr>
                        <td>Expiry Date</td>
                        <td colspan="4">${task.addition?.expiryDate || ""}</td>
                        <td class="verify-cell">&#9744;</td><td class="verify-cell">Correct</td>
                    </tr>
                    <tr>
                        <td>Operator Stamp/Sign Date&Time</td>
                        <td colspan="4">${task.addition?.operatorName || ""}</td>
                        <td colspan="2" style="background-color: yellow;">Verify by:</td>
                    </tr>

                    <tr><td colspan="7" class="sub-header">Verification Test</td></tr>
                    <tr><td>Date</td><td colspan="6">${task.verification?.date || "-"}</td></tr>
                    <tr><td>Time</td><td colspan="6">${task.verification?.time || "-"}</td></tr>
                    <tr><td>Observed Value after addition</td><td colspan="6">${task.verification?.concentration || "-"}</td></tr>
                    <tr><td>Tested By</td><td colspan="6">${task.verification?.chemist || "-"}</td></tr>
                    <tr><td>Remarks (if any)</td><td colspan="6">${task.verification?.remarks || "-"}</td></tr>
                    <tr><td>Review By</td><td colspan="6">${task.verification?.reviewBy || "-"}</td></tr>
                </table>
            </body></html>
        `;
    }

    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.print();
}

function renderTasks() {
    const taskListContainer = document.getElementById("task-list");
    taskListContainer.innerHTML = "";

    // Show all tasks including completed ones
    if (taskList.length === 0) {
        taskListContainer.innerHTML = "<p style='text-align: center; color: #666;'>No tasks found.</p>";
        return;
    }

    taskList.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";
        const statusClass = task.status.replace(/\s+/g, '-');
        card.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.type} - ${task.tankNo}</div>
                <span class="status-${statusClass}">${task.status}</span>
            </div>
            <div class="task-details">
                <p><strong>Report No.:</strong> ${task.reportNo}</p>
                <p><strong>Tank No.:</strong> ${task.tankNo}</p>
                ${task.type === "Replenish" ? `
                    <p><strong>Process Name:</strong> ${task.processName || '-'}</p>
                    <p><strong>Chemical Used:</strong> ${task.chemicalUsed || '-'}</p>
                    <p><strong>Result:</strong> ${task.result || '-'}</p>
                    <p><strong>Addition Made:</strong></p>
                    <p><strong>Product: ${task.productName || '-'}</p>
                    <p><strong>Quantity: ${task.quantity || '-'}</p>
                ` : `
                    <p><strong>Tank Description:</strong> ${task.tankDescription || '-'}</p>
                    <p><strong>Parameter:</strong> ${task.parameter || '-'}</p>
                    <p><strong>Chemical Added:</strong> ${task.chemicalAdded || '-'}</p>
                    <p><strong>Addition Recommendation:</strong> ${task.additionRecommendation || '-'}</p>
                `}
                <p><strong>Created:</strong> ${task.createdAt}</p>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="editTask(${task.id})">Edit</button>
                ${task.status === "waiting for execution" ? 
                    `<button class="btn-complete" onclick="markComplete(${task.id})">Complete</button>` : ""}
                ${task.status === "waiting for verify" ? 
                    `<button class="btn-verify" onclick="openVerification(${task.id})">Verify</button>` : ""}
                <button class="btn-print" onclick="printTask(${task.id})">Print</button>
            </div>
        `;
        taskListContainer.appendChild(card);
    });
}

function exportToExcel() {
    const rows = [];

    // Header row for the Excel sheet
    const headers = ["Report No.", "Tank No.", "Task Type", "Process Name", "Chemical Used", "Result", "Created At", "Status"];
    rows.push(headers);
    // Collect data from the taskList for each field
    taskList.forEach(task => {
        const row = [
            task.reportNo || "-",
            task.tankNo || "-",
            task.type || "-",
            task.processName || "-",
            task.chemicalUsed || "-",
            task.result || "-",
            task.createdAt || "-",
            task.status || "-"
        ];
        rows.push(row);
    });
    // Convert data to Excel format
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    // Save the Excel file
    XLSX.writeFile(wb, "TaskData.xlsx");
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
});
