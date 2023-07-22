document.addEventListener('DOMContentLoaded', function () {
    // Get all the buttons and tables
    const projectBtn = document.querySelector('.projectBtn');
    const taskBtn = document.querySelector('.taskBtn');
    const resourceBtn = document.querySelector('.resourceBtn');
    const managerBtn = document.querySelector('.managerBtn');
  
    const projectTable = document.querySelector('.project');
    const taskTable = document.querySelector('.task');
    const resourceTable = document.querySelector('.resource');
    const managerTable = document.querySelector('.manager');
  
    // Function to show a specific table and hide others
    function showTable(tableToShow) {
      const tables = [projectTable, taskTable, resourceTable, managerTable];
      tables.forEach((table) => {
        if (table === tableToShow) {
          table.style.display = 'table';
        } else {
          table.style.display = 'none';
        }
      });
    }
  
    // Event listeners for button clicks
    projectBtn.addEventListener('click', function () {
      showTable(projectTable);
    });
  
    taskBtn.addEventListener('click', function () {
      showTable(taskTable);
    });
  
    resourceBtn.addEventListener('click', function () {
      showTable(resourceTable);
    });
  
    managerBtn.addEventListener('click', function () {
      showTable(managerTable);
    });
  
    // Initially, display the project table and hide others
    showTable(projectTable);
  });
  