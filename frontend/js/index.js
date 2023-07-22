let nav = document.querySelector(".nav-links")
let name = document.querySelector(".name")
let detail = JSON.parse(localStorage.getItem("detail"))
console.log(detail)
name.innerText = detail.name
if(detail==null){
    console.log("false")
}else{
    if(detail.employee==true){
        nav.innerHTML = ""
        nav.innerHTML = `
        <a href="./html/employee.html">WorkSpace</a>
        <button class="logout">LogOut</button>
        `
    }
    let logout = document.querySelector(".logout")
    logout.addEventListener("click", ()=>{
        localStorage.clear()
        window.location.href="./index.html"
    })
}