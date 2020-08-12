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

function login(username) {
  localStorage.setItem("hive", username);
  url = "../?hive=" + username;
  window.location.href = url;
}


function blokzmenu() {
  var x = document.getElementById("blokzmenuPOP");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


// hivesigner integrations

pageURL = window.location.origin;

state = "/";
var client = new hivesigner.Client({
  app: 'blokz',
  callbackURL: pageURL,
  scope: ['vote', 'comment', 'comment_options'],
});


// login
var link = client.getLoginURL(state);
console.log("your login link is: " + link)


function hivelogin() {
  client.login(params, function (err, token) {
    console.log(err, token)

  });
}
// done login
function logout() {
  localStorage.removeItem('sc_token');
  localStorage.removeItem('hive');
  url = "../#";
  window.location.href = url;
}

let params = (new URL(location)).searchParams;
const token = params.get('access_token') || localStorage.getItem('sc_token');
if (token) {
  const self = this;
  this.isInit = false;
  client.setAccessToken(token);

  client.me(function (err, result) {
    if (result) self.username = result.name;
    if (err) self.error = err;
    
    localStorage.setItem("hive", username);
    localStorage.setItem('sc_token', token);
    self.isInit = true;
    console.log(err, result);
    document.getElementById("loggedin").innerHTML = "Logged in as <a href='../?hive=" + result.name + "'>" + result.name + "</a> <div style='float: right'><button onclick='logout()'><i class='material-icons'>exit_to_app</i></button></div>";

    if (getQueryVariable("access_token") !== false) {
      console.log("TOKEN FOUND: " + getQueryVariable("access_token"));
      hivesigner.setAccessToken = (getQueryVariable("access_token"));
      login(username)
    }

  });
} else {
  this.isInit = true;
}



function splash() {

  console.log("IT WORKS!! user not set");
  document.getElementById("gridd").style.display = "none";
  document.getElementById("blog").style.display = "none";
  console.log("Please click the blokz logo below");

  var html = `<div id='splash'>To get started, input your hive username in the box below and submit.` + 
  `<form id="frm1" action="/"><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="font-size: 1.25em;">`+
  `  <label class="mdl-textfield__label" for="sample4" style="font-size: 1.25em;">Load Profile</label>`+
  `  <input type="text" name="hive" class="mdl-textfield__input">`+
  `</div></form>`+
   `<hr />` +
   `to login with HiveSigner and everything else, Click the <a href='https://blokz.io/'>blokz.io</a> icon on the bottom right.<br /> ` +
   `<hr />This site was made with &#10084; by the guy at blokz, <a href="../?hive=sn0n">@sn0n</a></div>` ;

  var tempElement = document.createElement('splash');
  tempElement.innerHTML = html;
  document.getElementsByTagName('body')[0].appendChild(tempElement.firstChild);


}