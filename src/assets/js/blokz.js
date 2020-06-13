// TODO: This is part of the 'age' code, clean up later
const year = new Date();
const now = new Date().toISOString().split('.')[0];

// checks for url variables like ?hive=sn0n
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

// TODO: set access_token if found from hivesigner 
// set user to localstorage user for index
// fallback for steem links
// set user to ?hive in url
if (getQueryVariable("access_token") !== false) {
  console.log("TOKEN FOUND: " + getQueryVariable("access_token"));
  hivesigner.setAccessToken = (getQueryVariable("access_token"));
}
if (localStorage.getItem("hive") !== null) {
  user = localStorage.getItem("hive");
  console.log(typeof user)
} else {
  console.log("user does not exist! or something went wrong");
}
if (getQueryVariable("steem") !== false) {
  user = getQueryVariable("steem");
  localStorage.setItem("hive", user);
  console.log(user + " connected");
}
if (getQueryVariable("hive") !== false) {
  user = getQueryVariable("hive");
  localStorage.setItem("hive", user);
  console.log(user + " connected");
}


function blokzmenu() {
  var x = document.getElementById("blokzmenuPOP");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}