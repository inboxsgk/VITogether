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





function forget_pass() {
  document.getElementById("l-form").style.display = "none";
  document.getElementById("l-forgot").style.display = "block";
}

function reset() {
  window.alert("Reset");
  document.getElementById("l-form").style.display = "block";
  document.getElementById("l-forgot").style.display = "none";
}

async function login() {
  var uEmail = document.getElementById("email_input_login").value;
  var uPass = document.getElementById("password_input_login").value;
    
  var req_data = {'email' : uEmail, 'passwd': uPass};

  var url = 'http://127.0.0.1:5000/api/login?email='+uEmail+'&passwd='+uPass; 
  const response = await fetch(url)
  .then((response) => response.json())
  .then((data) => {dat=JSON.parse(JSON.stringify(data))})
  .then(() => console.log(dat));

  if (dat.success == 'true'){
    setCookie('app', dat.token, 7);
    loadfunc();
  }
}