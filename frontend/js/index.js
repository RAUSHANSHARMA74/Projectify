let nav = document.querySelector(".nav-links")
let detail = JSON.parse(localStorage.getItem("detail"))
console.log(detail)
if(detail==null){
    console.log("false")
}else{
    if(detail.employee==true){
        nav.innerHTML = ""
        nav.innerHTML = `
        <a href="../html/manager.html">WorkSpace</a>
        <button class="logout">LogOut</button>
        `
    }
    let logout = document.querySelector(".logout")
    logout.addEventListener("click", ()=>{
        localStorage.clear()
        window.location.href="./index.html"
    })
}