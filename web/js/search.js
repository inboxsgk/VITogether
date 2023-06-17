var dat;
var x = [];
var cur_slot;

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
  if (cooki == "" || cooki == null || cooki == 'null'){
    window.location.replace("/login.html");
  }
  
}

window.onload = loadfunc();

function cpy(){
  var text = document.getElementById('link_l').innerHTML;
  navigator.clipboard.writeText(text).then(function() {
  console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
  console.error('Async: Could not copy text: ', err);
  });
}

function slot_choose(id){
  var link = dat['courses'][x[0]][id];
  cur_slot = id;
  if (link == "null"){
    cur_slot = id;
    document.getElementById("error_text").style.display = "block";
  } else {
    document.getElementById("link_text").style.display = "block";
    document.getElementById("link_l").style.display = "block";
    document.getElementById("text-link--").style.display = "block";
    document.getElementById("link_l").href=link;
    document.getElementById("link_l").innerHTML=link;
  }
}

function logout() {
  document.cookie = "app=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.replace("/login.html");
}

async function search_op(){
  var url="http://127.0.0.1:5000/api/search?q="+document.getElementById('search_input_box').value;
  const response = await fetch(url)
  .then((response) => response.json())
  .then((data) => {dat=JSON.stringify(data)})
  .then(() => console.log(dat));
  
  dat = JSON.parse(dat);
  console.log(Object.keys(dat));

  document.getElementById("l-form").style.display = "none";
  document.getElementById("l-form-1").style.display = "block";

  document.getElementById('search_input_box_1').value = document.getElementById('search_input_box').value;

  document.getElementById("fac_name").innerHTML = dat.name;
  document.getElementById("fac_desig").innerHTML = dat.desig;
  document.getElementById("fac_school").innerHTML = dat.dept+", "+dat.school;
  
  x = [];
  for (var i in dat['courses']) {
    x[x.length] = i;
  }

  for (var i in dat['courses'][x[0]]){
    var myDiv = document.getElementById("l-form-1");
    var button = document.createElement('div');
    button.innerHTML = `<button class="btn btn-primary btn-block" id="`+i+`" onclick="slot_choose('`+i+`')">`+i+`</button>`;
    button.appendChild(document.createElement('br'));
    myDiv.appendChild(button);
  }

  console.log(x);

}

function search_op_2() {
  document.getElementById('search_input_box').value = document.getElementById('search_input_box_1').value;
  search_op();
  
}