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




// MAIN BODY OF DISPLAYING A PROFILE
window.onload = function loading() {


  //check if user is set
  if (typeof user !== 'undefined') {

    // gets posting_json_metadata for generic profile data for user
    hive.api.call('database_api.find_accounts', { accounts: [user] }, (err, res) => {
      posting_json = JSON.parse(JSON.stringify(res.accounts[0].posting_json_metadata));
      // TODO: -- remove testing notes ^>^
      console.log("posting_json: " + posting_json);
      // display avater
      document.getElementById("profimg").src = JSON.parse(posting_json).profile.profile_image;
      // display cover image
      document.getElementById("coverimage").style.backgroundImage = "url('" + JSON.parse(posting_json).profile.cover_image + "')";
    });

    // get recent posts
    hive.api.getDiscussionsByAuthorBeforeDate(user, null, now, 5, (err, result) => {
      // TODO: set loop for each & display inline popup
      var recent1 = JSON.parse(JSON.stringify(result[0]));
      console.log(recent1);
      var recent1date = recent1.created.slice(0, 10);
      document.getElementById("recent1").innerHTML = "1. <a href='http://peakd.com/@" + user + "/" + recent1.permlink + "' target='_blank'>" + recent1.title + "</a> <br /><span>&nbsp;</span>Posted on " + recent1date + "<br />";
      var recent2 = JSON.parse(JSON.stringify(result[1]));
      // TODO: -- remove testing notes ^>^
      console.log(recent2);
      var recent2date = recent2.created.slice(0, 10);
      document.getElementById("recent2").innerHTML = "2. <a href='http://peakd.com/@" + user + "/" + recent2.permlink + "' target='_blank'>" + recent2.title + "</a> <br /><span>&nbsp;</span>Posted on " + recent2date + "<br />";
      var recent3 = JSON.parse(JSON.stringify(result[2]));
      // TODO: -- remove testing notes ^>^
      console.log(recent3);
      var recent3date = recent3.created.slice(0, 10);
      document.getElementById("recent3").innerHTML = "3. <a href='http://peakd.com/@" + user + "/" + recent3.permlink + "' target='_blank'>" + recent3.title + "</a> <br /><span>&nbsp;</span>Posted on " + recent3date + "<br />";
      document.getElementById("recentM").innerHTML = "<br /><div>View More on <a href='http://peakd.com/@" + user + "/' target='_blank'>peakd.com/@" + user + "</a></div><hr />";
    });

    // show link to peakd profile
    document.getElementById("hiveuser").innerHTML = "<a href='http://peakd.com/@" + user + "' target='_blank'>@" + user + "</a>";

    // fetch blokzprofile post from hive
    hive.api.getDiscussionsByAuthorBeforeDate(user, 'blokzprofile', now, 1, (err, result) => {

      // user has a blokz/profile
      if (result.length >= 1) {
        console.log("meep :" + result);
        var blokify = JSON.parse(JSON.stringify(result[0].body));
        var blokzmeta = JSON.parse((result[0].json_metadata));
        console.log(blokify);
        var bitff = JSON.parse(JSON.stringify(blokzmeta));
        console.log("blokzmeta: " + bitff.app);
        console.log(bitff.interests);
        document.getElementById("name").innerHTML = bitff.name;
        document.getElementById("article").innerHTML = bitff.article;
        document.getElementById("usertitle").innerHTML = bitff.usertitle;
        var profage = year.getFullYear() - bitff.birthyear;
        document.getElementById("age").innerHTML = profage;
        document.getElementById("sign").innerHTML = bitff.sign;
        document.getElementById("location").innerHTML = bitff.location;
        document.getElementById("gender").innerHTML = bitff.gender;
        document.getElementById("favsite").innerHTML = "<a href='" + bitff.favsite + "' target='_blank'>" + bitff.favsite + "</a>";
        // interests
        var skills = bitff.interests;
        skillsLog = skills.split(',');
        skillsLog.forEach(function (entry) {
          console.log(entry);
          entryy = entry.replace(/\s+/g, '');
          entryy = entryy.replace(/[^a-zA-Z0-9]/g, '');
          entryy = entryy.toLowerCase();
          // creat chips for each interest
          var vadd = document.createElement('button');
          vadd.className = "mdl-chip";
          vadd.id = entryy;
          vadd.setAttribute("onclick", "window.open('https://peakd.com/created/" + entryy + "','_blank');");
          document.getElementById("interests").appendChild(vadd);
          var sadd = document.createElement('span');
          sadd.className = "mdl-chip__text";
          sadd.id = entryy + "2";
          document.getElementById(entryy).appendChild(sadd);
          var t = document.createTextNode(entryy);
          document.getElementById(entryy + "2").appendChild(t);
          // ENDNEW
        });

        // favorite steemians
        var favs = bitff.favorites;
        favsLog = favs.split(',');
        favsLog.forEach(function (entry) {
          console.log("show: " + entry);
          entryy = entry.replace(/\s+/g, '');
          entryy = entryy.toLowerCase();
          // CURRENT TODO: FRIEND IMAGE
          console.log("CAUGHT: " + entryy);
          var favfriend = document.createElement("div");
          favfriend.id = entryy + "_";
          favfriend.setAttribute("onclick", "window.location.href='./?hive=" + entryy + "';");
          favfriend.style = "display: inline-block; padding: 5px; margin: 15px auto;width: 100px;  text-align: center"
          document.getElementById("favorites").appendChild(favfriend);
          var para = document.createElement("div");                 // Create a <p> element
          para.id = favfriend.id + "sub";
          var ffs = document.createElement("div");
          ffs.id = favfriend.id;
          var ffsName = document.createElement("div");
          ffsName.id = favfriend.id + "ffsName";
          var ff = favfriend.id + "NEW";   // placeholder
          document.getElementById(entryy + "_").appendChild(para);
          document.getElementById(ffs.id).appendChild(ffsName);
          var image = document.createElement("img");
          var imageParent = document.getElementById(para.id);
          image.className = "avatar";
          image.src = "https://images.hive.blog/u/" + entryy + "/avatar";            // image.src = "IMAGE URL/PATH"
          imageParent.appendChild(image);
          document.getElementById(entryy + "_").appendChild(ffsName);
          ffsName.innerHTML = "<small id='" + ff + "'>" + entryy + "</small>";

        }); // finished displaying blokzprofile
        
      } else {

        // LOAD GENERIC posting_json_metadata for non blokz/profile user
        console.log("user does not exist! or something went wrong")
        hive.api.call('database_api.find_accounts', { accounts: [user] }, (err, res) => {
          posting_json = JSON.parse(JSON.stringify(res.accounts[0].posting_json_metadata));
          console.log("posting_json: " + posting_json);
          document.getElementById("profimg").src = JSON.parse(posting_json).profile.profile_image;
          document.getElementById("coverimage").style.backgroundImage = "url('" + JSON.parse(posting_json).profile.cover_image + "')";
          if (JSON.parse(posting_json).profile.website !== undefined) {
            document.getElementById("favsite").innerHTML = "<a href='" + JSON.parse(posting_json).profile.website + "' target='_blank'>" + JSON.parse(posting_json).profile.website + "</a>";
          } else {
            document.getElementById("strongWebsite").style.display = "none";
          }
          if (JSON.parse(posting_json).profile.location !== undefined) {
            document.getElementById("location").innerHTML = JSON.parse(posting_json).profile.location;
          } else {
            document.getElementById("strongLocation").style.display = "none";
          }
          document.getElementById("usertitle").innerHTML = JSON.parse(posting_json).profile.about;
          document.getElementById("name").innerHTML = JSON.parse(posting_json).profile.name;
          document.getElementById("strongAge").style.display = "none";
          document.getElementById("strongSign").style.display = "none";
          document.getElementById("strongGender").style.display = "none";
          document.getElementById("strongFriends").style.display = "none";
          document.getElementById("strongAbout").style.display = "none";
          document.getElementById("strongFollow").style.display = "none";


          //console.log("Location: " +JSON.parse(posting_json).profile.location);

        });
        // finished displaying posting_json_metadata for non blokz/profile user
      }
    });
  } else {

    // TODO: splash page w/ user input
    console.log("IT WORKS!! user not set");
    document.getElementById("gridd").style.display = "none";
    this.console.log("Please click the blokz logo below");

  }
};




function blokzmenu() {
  var x = document.getElementById("blokzmenuPOP");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}