
let url = "http://localhost:1481/";

async function getEmployeesData(){
  try {
    let res = await fetch(`${url}employee/employees`)
    if(res.ok){
      let allData = await res.json()
      allData = allData.employeeData
      console.log(allData)
      // globalTaskData = allData
      showEmployeeData(allData)
    }
  } catch (error) {
    console.log("something went wrong in task data")
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

    let resourceList = elm.tasks && elm.tasks.length > 0
      ? `<ol>${elm.tasks.map((task) => task.resources ? task.resources.map((resource) => `<li>${resource.resourceName}</li>`).join("") : "No resources assigned").join("")}</ol>`
      : "No tasks assigned";

    let projectName = elm.tasks && elm.tasks.length > 0 && elm.tasks[0].project && elm.tasks[0].project.projectName
      ? elm.tasks[0].project.projectName
      : "N/A";

    let description = elm.tasks && elm.tasks.length > 0 && elm.tasks[0].description
      ? elm.tasks[0].description
      : "N/A";

    let formattedStartDate = elm.tasks && elm.tasks.length > 0 && elm.tasks[0].startDate
      ? new Date(elm.tasks[0].startDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

    let formattedEndDate = elm.tasks && elm.tasks.length > 0 && elm.tasks[0].endDate
      ? new Date(elm.tasks[0].endDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

    let statusText = elm.tasks && elm.tasks.length > 0 && elm.tasks[0].status
      ? getStatusText(elm.tasks[0].status)
      : "Unknown";

    let type = elm.tasks && elm.tasks.length > 0 && elm.tasks[0].type
      ? elm.tasks[0].type
      : "N/A";

    return `
    <tr>
      <td>${taskList}</td>
      <td>${projectName}</td>
      <td>${description}</td>
      <td>${resourceList}</td>
      <td>${type}</td>
      <td>${formattedStartDate}</td>
      <td>${formattedEndDate}</td>
      <td>${statusText}</td>
      <td>Update Status</td>
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




