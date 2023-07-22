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
  const taskForm = document.querySelector('.taskForm');
  const resourceForm = document.querySelector('.resourceForm');

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
