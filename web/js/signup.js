function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function loadfunc(){
    let cooki = getCookie("app");
    if (cooki == "" || cooki == null){
      setCookie("app", null, 28);
    } else if (cooki != 'null'){
      window.location.replace("/search.html");
    }
    
  }
  
  window.onload = loadfunc();
  
  

async function signup() {
    var uEmail = document.getElementById("email_input").value;
    var uPass = document.getElementById("password_input").value;
    
    if (uPass != document.getElementById("password_re_input").value) {
        alert("Passwords don't match!");
    }
      
    var req_data = {'email' : uEmail, 'passwd': uPass};
  
    var url = 'http://127.0.0.1:5000/api/signup?email='+uEmail+'&passwd='+uPass; 
    const response = await fetch(url)
    .then((response) => response.json())
    .then((data) => {dat=JSON.parse(JSON.stringify(data))})
    .then(() => console.log(dat));
  
    if (dat.success == 'true'){
        window.location.replace("/login.html");
    }
  }