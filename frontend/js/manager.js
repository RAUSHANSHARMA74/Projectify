const taskForm = document.querySelector('.taskForm');
const resourceForm = document.querySelector('.resourceForm');
document.addEventListener('DOMContentLoaded', function () {
  // Get all the buttons and tables
  const projectBtn = document.querySelector('.projectBtn');
  const taskBtn = document.querySelector('.taskBtn');
  const resourceBtn = document.querySelector('.resourceBtn');
  const managerBtn = document.querySelector('.employeeBtn');

  const projectTable = document.querySelector('.project');
  const taskTable = document.querySelector('.task');
  const resourceTable = document.querySelector('.resource');
  const employeeTable = document.querySelector('.employee');

  // Get all the forms
  

  // Function to show a specific table and hide others
  function showTable(tableToShow) {
    const tables = [employeeTable, projectTable, taskTable, resourceTable];
    tables.forEach((table) => {
      if (table === tableToShow) {
        table.style.display = 'table';
      } else {
        table.style.display = 'none';
      }
    });
  }

  // Function to show a specific form and hide others
  function showForm(formToShow) {
    const forms = [taskForm, resourceForm];
    forms.forEach((form) => {
      if (form === formToShow) {
        form.style.display = 'block';
      } else {
        form.style.display = 'none';
      }
    });
  }

  // Event listeners for button clicks to show tables
  projectBtn.addEventListener('click', function () {
    showTable(projectTable);
    showForm(null); // Hide any form when switching tables
  });

  taskBtn.addEventListener('click', function () {
    showTable(taskTable);
    showForm(taskForm); // Show taskForm when clicking taskBtn
  });

  resourceBtn.addEventListener('click', function () {
    showTable(resourceTable);
    showForm(resourceForm); // Show resourceForm when clicking resourceBtn
  });

  managerBtn.addEventListener('click', function () {
    showTable(employeeTable);
    showForm(null); // Hide any form when switching tables
  });

  // Default state: show employee table and hide forms
  showTable(employeeTable);
  showForm(null);
});


//code to show data on frontend
let globalTaskData = []
let globalResourceData = []
let url = "http://localhost:1481/";

taskForm.addEventListener("submit", async (event)=>{
  event.preventDefault()
  let projectId = taskForm.projectId.value
  let employeeId = taskForm.employeeId.value
  let taskId = taskForm.taskId.value
  let obj = {
    taskName : taskForm.taskName.value,
    description: taskForm.description.value,
    startDate :  taskForm.startDate.value,
    endDate : taskForm.endDate.value
  }

  if(projectId && employeeId){
    obj["project"] = projectId
    obj["employee"] = employeeId
    try {
      let res = await fetch(`${url}manager/tasks/${taskId}`, {
        method : "PATCH",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(obj)
      })
      if(res.ok){
        let data = await res.json()
        console.log(data)
      }
    } catch (error) {
      console.log("something went wrong in task post ")
    }
  }else{
    try {
      let res = await fetch(`${url}manager/tasks`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(obj)
      })
      if(res.ok){
        let data = await res.json()
        console.log(data)
      }
    } catch (error) {
      console.log("something went wrong in task post ")
      console.log(error)
    }
  }
})

//get all task Data
async function getAllTasksData(){
  try {
    let res = await fetch(`${url}manager/tasks`)
    if(res.ok){
      let allData = await res.json()
      allData = allData.allTaskData
      // console.log(allData)
      globalTaskData = allData
      showAllTasksData(allData)
    }
  } catch (error) {
    console.log("something went wrong in task data")
  }
}
getAllTasksData()

let taskTable = document.querySelector(".taskTable");

function showAllTasksData(data) {
  taskTable.innerHTML = "";

  let showData = data.map((elm, index) => {
    let employeeName = elm.employee ? elm.employee.name : "No employee assigned";
    let projectName = elm.project ? elm.project.projectName : "No project assigned";

    let resourceList = elm.resources && elm.resources.length > 0
      ? `<ol>${elm.resources.map((resource) => `<li data-id="${resource._id}">${resource.resourceName}</li>`).join("")}</ol>`
      : "No resources assigned";

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
        <td>${elm.taskName}</td>
        <td>${employeeName}</td>
        <td>${projectName}</td>
        <td>${elm.description}</td>
        <td>${formattedStartDate}</td>
        <td>${formattedEndDate}</td>
        <td>${resourceList}</td>
        <td>${elm.status === "1" ? "Completed" : elm.status === "2" ? "In Progress" : "Not Yet Start"}</td>
        <td class="taskUpdate" data-id="${elm._id}">Update</td>
        <td class="taskDelete" data-id="${elm._id}">Delete</td>
      </tr>
    `;
  });

  taskTable.innerHTML = showData.join("");

  let taskUpdate = document.querySelectorAll(".taskUpdate")
  for(let taskBtn of taskUpdate){
    taskBtn.addEventListener("click", ()=>{
      let id = taskBtn.dataset.id
      console.log(id)
      let filterData = globalTaskData.filter((elm, index)=>{
        return elm._id == id
      })
      filterData = filterData[0]
      // console.log(filterData)
      taskForm.taskId.removeAttribute('readonly')
      taskForm.employeeId.removeAttribute('readonly')
      taskForm.projectId.removeAttribute('readonly')
      taskForm.employeeId.value = filterData.employee ?._id ?? "NA"
      taskForm.projectId.value = filterData.project ?._id ?? "NA"
      taskForm.taskId.value = filterData._id
      taskForm.taskName.value = filterData.taskName;
      taskForm.description.value = filterData.description
      const startDate = new Date(filterData.startDate).toISOString().split('T')[0];
      const endDate = new Date(filterData.endDate).toISOString().split('T')[0];
      taskForm.startDate.value = startDate
      taskForm.endDate.value = endDate
    })
  }

  let taskDelete = document.querySelectorAll(".taskDelete")
  for(let taskDeleteBtn of taskDelete){
    taskDeleteBtn.addEventListener("click",async ()=>{
      let id = taskDeleteBtn.dataset.id;
      try {
        let res = await fetch(`${url}manager/tasks/${id}`,{
          method : "DELETE",
          headers : {
            "Content-Type" : "application/json"
          }
        })
        if(res.ok){
          let data = await res.json()
          console.log(data)
          getAllTasksData()
        }
      } catch (error) {
        console.log("something went wrong in task delete")
      }
    })
  }
}


//resources data
resourceForm.addEventListener("submit", async (event)=>{
  event.preventDefault()
  let obj = {
    resourceName : resourceForm.resourceName.value,
    description : resourceForm.description.value,
    type : resourceForm.type.value,
    availability : resourceForm.availability.value
  }
  let resourceId = resourceForm.resourceId.value
  let taskId = resourceForm.taskId.value
  if(resourceId && taskId){
    obj["task"] = taskId
    try {
      let res = await fetch(`${url}manager/resources/${resourceId}`, {
        method : "PATCH",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(obj)
      })
      if(res.ok){
        let data = await res.json()
        console.log(data)
      }
    } catch (error) {
      console.log("something went wrong in task post ")
    }
  }else{
    try {
      let res = await fetch(`${url}manager/resources`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(obj)
      })
      if(res.ok){
        let data = await res.json()
        console.log(data)
        getResourceData()
      }
    } catch (error) {
      console.log("something went wrong in task post ")
      console.log(error)
    }
  }
})

async function getResourceData(){
  try {
    let res = await fetch(`${url}manager/resources`)
    if(res.ok){
      let allData = await res.json()
      allData = allData.resourceData
      console.log(allData)
      globalResourceData = allData
      showAllResourceData(allData)
    }
  } catch (error) {
    console.log("something went wrong in task data")
  }
}

getResourceData()

let resourceTable = document.querySelector(".resourceTable");

function showAllResourceData(data) {
  resourceTable.innerHTML = ""; 

  let showData = data.map((elm) => {
    let taskName = elm.task ? elm.task.taskName : "No task assigned";

    return `
      <tr>
        <td>${elm.resourceName}</td>
        <td>${taskName}</td>
        <td>${elm.description}</td>
        <td>${elm.type}</td>
        <td>${elm.availability ? "Available" : "Not Available"}</td>
        <td class="resourceUpdate" data-id="${elm._id}">Update</td>
        <td class="resourceDelete" data-id="${elm._id}">Delete</td>
      </tr>
    `;
  });

  resourceTable.innerHTML = showData.join("");
  let resourceUpdate = document.querySelectorAll(".resourceUpdate")
  for(let resourceBtn of resourceUpdate){
    resourceBtn.addEventListener("click", ()=>{
      let id = resourceBtn.dataset.id
      console.log(id)
      let filterData = globalResourceData.filter((elm, index)=>{
        return elm._id == id
      })
      filterData = filterData[0]
      console.log(filterData)
      resourceForm.resourceId.removeAttribute('readonly')
      resourceForm.taskId.removeAttribute('readonly')
      resourceForm.resourceId.value = filterData._id
      resourceForm.resourceName.value = filterData.resourceName;
      resourceForm.description.value = filterData.description
      resourceForm.type.value = filterData.type
      resourceForm.availability.value = filterData.availability
    })
  }

  let resourceDelete = document.querySelectorAll(".resourceDelete")
  for(let resourceBtn of resourceDelete){
    resourceBtn.addEventListener("click",async ()=>{
      let id = resourceBtn.dataset.id;
      try {
        let res = await fetch(`${url}manager/resources/${id}`,{
          method : "DELETE",
          headers : {
            "Content-Type" : "application/json"
          }
        })
        if(res.ok){
          let data = await res.json()
          console.log(data)
          getResourceData()
        }
      } catch (error) {
        console.log("something went wrong in resources delete")
      }
    })
  }
}


// get all Project data
async function getAllProjectData(){
  try {
    let res = await fetch(`${url}manager/projects`)
    if(res.ok){
      let data = await res.json()
      data = data.projectData
      console.log(data)
      showProjectData(data)
    }
  } catch (error) {
    console.log("something went wrong in get project data")
  }
}
getAllProjectData()

let projectTable = document.querySelector(".projectTable");

function showProjectData(data) {
  projectTable.innerHTML = "";

  let showData = data.map((elm) => {
    let employeeList = elm.employees && elm.employees.length > 0
      ? `<ol>${elm.employees.map((employee) => `<li data-id="${employee._id}">${employee.name}</li>`).join("")}</ol>`
      : "No resources assigned";

    let taskList = elm.tasks && elm.tasks.length > 0
      ? `<ol>${elm.tasks.map((task) => `<li data-id="${task._id}">${task.taskName}</li>`).join("")}</ol>`
      : "No tasks assigned";

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
        <td>${elm.description}</td>
        <td>${formattedStartDate}</td>
        <td>${formattedEndDate}</td>
        <td>${employeeList}</td>
        <td>${taskList}</td>
        <td>${elm.status === "1" ? "Completed" : elm.status === "2" ? "In Progress" : "Not Yet Start"}</td>
        <td>
          <select name="projectStatus" id="projectStatus" data-id="${elm._id}">
            <option value="">Project-Update</option>
            <option value="2">In Progress</option>
            <option value="1">Complete</option>
          </select>
        </td>
      </tr>
    `;
  });

  projectTable.innerHTML = showData.join("");
  let projectStatus = document.querySelectorAll("#projectStatus")
  for(let statusBtn of projectStatus){
    statusBtn.addEventListener("change", async()=>{
      let id = statusBtn.dataset.id
      let statuscode = statusBtn.value
      console.log(typeof statuscode)
      try {
        let res = await fetch(`${url}manager/projects/${id}`, {
          method : "PATCH",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({status : statuscode})
        })
        if(res.ok){
          let data = await res.json()
          getAllProjectData()
        }
      } catch (error) {
        console.log("something went wrong in status")
      }
    })
  }
}


//get employees data 
async function getEmployeesData(){
  try {
    let res = await fetch(`${url}manager/employees`)
    if(res.ok){
      let data = await res.json()
      data = data.employeeData
      console.log(data)
      showEmployeeData(data)
    }
  } catch (error) {
    console.log("something went wrong in get project data")
    console.log(error)
  }
}
getEmployeesData()


let employeeTable = document.querySelector(".employeeTable");

function showEmployeeData(data) {
  employeeTable.innerHTML = "";

  let showData = data.map((elm) => {
    let taskList = elm.tasks && elm.tasks.length > 0
      ? `<ol>${elm.tasks.map((task) => `<li>${task.taskName}</li>`).join("")}</ol>`
      : "No tasks assigned";

    let resourceList = elm.tasks && elm.tasks.length > 0 && elm.tasks[0].resources && elm.tasks[0].resources.length > 0
      ? `<ol>${elm.tasks[0].resources.map((resource) => `<li>${resource.resourceName}</li>`).join("")}</ol>`
      : "No resources assigned";

    let projectName = elm.tasks && elm.tasks.length > 0 && elm.tasks[0].project && elm.tasks[0].project.projectName
      ? elm.tasks[0].project.projectName
      : "N/A";

    return `
      <tr>
        <td>${elm.name}</td>
        <td>${projectName}</td>
        <td>${taskList}</td>
        <td>${resourceList}</td>
        <td>${elm.tasks && elm.tasks.length > 0 ? getStatusText(elm.tasks[0].status) : "N/A"}</td>
      </tr>
    `;
  });

  employeeTable.innerHTML = showData.join("");
}

function getStatusText(status) {
  switch (status) {
    case "1":
      return "Completed";
    case "2":
      return "In Progress";
    case "3":
      return "Not Yet Start";
    default:
      return "Unknown";
  }
}
