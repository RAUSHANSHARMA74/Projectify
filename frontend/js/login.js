let url = "http://localhost:1481/";

let singup = document.querySelector("#singup");
singup.addEventListener("submit", async (event) => {
  event.preventDefault();
  // console.log("hello")
  let singupData = {
    name: singup.name.value,
    email: singup.email.value,
    password: singup.password.value,
    role: singup.role.value,
  };
  if (singupData.role.toLowerCase() == "employee") {
    url += `employee/`;
  } else {
    url += `manager/`;
  }
  try {
    let response = await fetch(`${url}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(singupData),
    });
    if (response.ok) {
      let responseData = await response.json();
      console.log(responseData);
      // alert(responseData.message)
      Swal.fire(responseData.message, responseData.name, "success");
    }
  } catch (error) {
    console.log("something went wrong in singup");
  }
});

//login form
let login = document.querySelector("#login");
login.addEventListener("submit", async (event) => {
  event.preventDefault();
  let loginCheckbox = document.querySelector("#loginCheckbox").checked;
  let loginData = {
    email: login.email.value,
    password: login.password.value,
  };
  if (loginCheckbox == true) {
    url += "manager/";
  } else {
    url += `employee/`;
  }
  try {
    let response = await fetch(`${url}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (response.ok) {
      let responseData = await response.json();

      if (loginCheckbox || responseData.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseData.message,
        });
      } else {
        Swal.fire(responseData.message, responseData.name, "success");
        localStorage.setItem("detail", JSON.stringify(responseData));
        // window.location.href = "../index.html"
      }
    }
  } catch (error) {
    console.log("something went wrong in login");
  }
});
