const projectForm = document.querySelector('.projectform');
const managerForm = document.querySelector('.managerform');
const employeeForm = document.querySelector('.employeeform');
document.addEventListener('DOMContentLoaded', function () {
    // Get all the buttons and forms
    const projectBtn = document.querySelector('.projectBtn');
    const managerBtn = document.querySelector('.managerBtn');
    const employeeBtn = document.querySelector('.employeeBtn');
    
    const projectTable = document.querySelector('.project');
    const managerTable = document.querySelector('.manager');
    const employeeTable = document.querySelector('.employee');

    // Function to show a specific form and hide others
    function showForm(formToShow) {
        const forms = [projectForm, managerForm, employeeForm];
        forms.forEach((form) => {
            if (form === formToShow) {
                form.style.display = 'block';
            } else {
                form.style.display = 'none';
            }
        });
    }

    // Function to show a specific table and hide others
    function showTable(tableToShow) {
        const tables = [projectTable, managerTable, employeeTable];
        tables.forEach((table) => {
            if (table === tableToShow) {
                table.style.display = 'table';
                updateListCount(table);
            } else {
                table.style.display = 'none';
            }
        });
    }

    // Function to set the active button
    function setActiveButton(activeButton) {
        const buttons = document.querySelectorAll('.worker button');
        buttons.forEach((button) => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    // Function to update the list count in the table
    function updateListCount(table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            const ol = row.querySelector('ol');
            if (ol) {
                const listCount = ol.getElementsByTagName('li').length;
                ol.setAttribute('start', index + 1); // Set the start value of the ol based on the row index
            }
        });
    }

    // Event listeners for button clicks
    projectBtn.addEventListener('click', function () {
        showForm(projectForm);
        showTable(projectTable);
        setActiveButton(projectBtn);
    });

    managerBtn.addEventListener('click', function () {
        showForm(managerForm);
        showTable(managerTable);
        setActiveButton(managerBtn);
    });

    employeeBtn.addEventListener('click', function () {
        showForm(employeeForm);
        showTable(employeeTable);
        setActiveButton(employeeBtn);
    });

    // Show the project table and form initially
    showForm(projectForm);
    showTable(projectTable);
    setActiveButton(projectBtn);
});


//code to show data in frontend


let url = "http://localhost:1481/";

// let projectUpdate = document.querySelector(".projectUpdate")
// projectUpdate.addEventListener("click", ()=>{
//     console.log("hello")
// })

// let managerUpdate = document.querySelector(".managerUpdate")
// managerUpdate.addEventListener("click", ()=>{
//     console.log("managerUpdate")
// })

// let employeeUpdate = document.querySelector(".employeeUpdate")
// employeeUpdate.addEventListener("click", ()=>{
//     console.log("employeeUpdate")
// })


//GET PROJECT DATA
async function getProjectData(){
    try {
        let res = await fetch(`${url}admin/projects`)
        if(res.ok){
            let projectData = await res.json()
            projectData = projectData.projectData
            console.log(projectData)
            showProjectData(projectData)
        }
    } catch (error) {
        console.log("something went wrong in get project Data")
    }
}
getProjectData()

let projectTable = document.querySelector(".projectTable");
function showProjectData(data) {
    projectTable.innerHTML = "";

    let showData = data.map((elm, index) => {
    let managerName = elm.manager ? elm.manager.name : "N/A";

    let employeeList = elm.employees
      ? `<ol>${elm.employees.map((employee) => `<li>${employee.name}</li>`).join("")}</ol>`
      : "No employees assigned";

    
    let formattedStartDate = new Date(elm.startDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    let formattedEndDate = new Date(elm.endDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `
      <tr>
        <td>${elm.projectName}</td>
        <td>${managerName}</td>
        <td>${employeeList}</td>
        <td>${elm.description}</td>
        <td>${elm.status === "1" ? "Completed" : elm.status== "2" ? "IN Progress" : "Not Yet Start"}</td>
        <td>${formattedStartDate}</td>
        <td>${formattedEndDate}</td>
        <td class="projectUpdate" data-id="${elm._id}">Update</td>
        <td class="projectDelete" data-id="${elm._id}">Delete</td>
      </tr>
    `;
  });

  projectTable.innerHTML = showData.join(""); 
}


// GET MANAGER DATA 
async function getManagerData(){
    console.log("hello manager")
    try {
        let res = await fetch(`${url}admin/managers`)
        if(res.ok){
            let managerData = await res.json()
            managerData = managerData.managerData
            console.log(managerData)
            showManagerData(managerData)
        }
    } catch (error) {
        console.log("something went wrong in get manager data")
    }
}
getManagerData()

let managerTable = document.querySelector(".managerTable");

function showManagerData(data) {
  managerTable.innerHTML = "";

  let showData = data.map((elm, index) => {
    let projectList = elm.projects && elm.projects.length > 0
      ? `<ol>${elm.projects.map((project) => `<li>${project.projectName}</li>`).join("")}</ol>`
      : "No projects assigned";

    let managerStatus = elm.isManager ? "Yes" : "No";
    let backgroundColor = elm.isManager ? "green" : "red";

    return `
      <tr>
        <td>${elm.name}</td>
        <td>${elm.email}</td>
        <td style="background-color: ${backgroundColor}">${managerStatus}</td>
        <td>${projectList}</td>
        <td class="managerUpdate" data-id="${elm._id}">Update</td>
        <td class="managerDelete" data-id="${elm._id}">Delete</td>
      </tr>
    `;
  });

  managerTable.innerHTML = showData.join("");
}


// GET EMPLOYEES DATA
async function getEmployeesData(){
    try {
        let res = await fetch(`${url}admin/employees`)
        if(res.ok){
            let employeeData = await res.json()
            employeeData = employeeData.employeeData
            console.log(employeeData)
            showEmployeesData(employeeData)
        }
    } catch (error) {
        console.log("something went wrong in get employee data")
    }
}

getEmployeesData()


let employeeTable = document.querySelector(".employeeTable");

function showEmployeesData(data) {
  employeeTable.innerHTML = "";
  let showData = data.map((elm, index) => {
    let projectList = elm.projects && elm.projects.length > 0
      ? `<ol>${elm.projects.map((project) => `<li>${project.projectName}</li>`).join("")}</ol>`
      : "No projects assigned";

    return `
      <tr>
        <td>${elm.name}</td>
        <td>${elm.email}</td>
        <td>${projectList}</td>
        <td>TaskList</td>
        <td>ResourcesList</td>
        <td class="employeeUpdate" data-id=${elm._id}>Update</td>
        <td class="employeeDelete" data-id=${elm._id}>Delete</td>
      </tr>
    `;
  });

  employeeTable.innerHTML = showData.join("");
}



projectForm.addEventListener("submit", async (event)=>{
    event.preventDefault()
    let id = projectForm.id.value
    if(id){
        console.log(id)
    }else{
        let obj = {
            projectName : projectForm.projectName.value,
            description : projectForm.description.value,
            status : projectForm.status.value,
            startDate : projectForm.startDate.value,
            endDate : projectForm.endDate.value
        }
        console.log(obj)
        try {
            let res = await fetch(`${url}admin/project`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(obj)
            })
            if(res.ok){
                let projectMessage = await res.json()
                console.log(projectMessage)

                // Swal.fire(responseData.message, "Project Successful added", "success");
            }
        } catch (error) {
            console.log("something went wrong in project form in post router")
        }
    }
})