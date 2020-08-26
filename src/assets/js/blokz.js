const year = new Date();
const now = new Date().toISOString().split('.')[0];
tag = "null";
post = false;
userLatest = undefined;
pageURL = window.location.origin;
state = "/";
let params = (new URL(location)).searchParams;
const token = params.get('access_token') || localStorage.getItem('sc_token');
update = false;
hiveuser = undefined;

var md = new Remarkable();
md.set({
  html: true,
  breaks: true,
  xhtmlOut: true,
  linkify: true
});

var client = new hivesigner.Client({
  app: 'blokz',
  callbackURL: pageURL,
  scope: ['vote', 'comment', 'comment_options', 'custom_json'],
});

var link = client.getLoginURL(state);
console.log("your login link is: " + link)

function hivelogin() {
  client.login(params, function (err, token) {
    console.log(err, token)
  });
}

function logout() {
  localStorage.removeItem('sc_token');
  localStorage.removeItem('hive');
  setTimeout(continueExecution, 2000);

}
function continueExecution()
{
  url = "../#";
  window.location.href = url;
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
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

function genTags(item, index) {
  document.getElementById("display").innerHTML += "<a href='?tag=" + item + "'>" + item + "</a> &nbsp;";
}

function hiveuserUp() {
  console.log("TRIGGERED!!!");
  let hiveuserUP = document.getElementById("hiveuser").value;
  console.log(hiveuserUP);
  hive.api.getDiscussionsByAuthorBeforeDate(hiveuserUP, 'blokzprofile', now, 1, (err, result) => {
    // populate data
    if (result) {
      console.log("results are in:");
      console.log(result);
      var blokify = JSON.parse(JSON.stringify(result[0].body));
      var blokzmeta = JSON.parse((result[0].json_metadata));
      console.log(blokify);
      console.log("blokzmeta: " + blokzmeta);
      console.log(blokzmeta.blokz);
      var bitff = JSON.parse(JSON.stringify(blokzmeta));
      console.log(bitff);
      document.getElementById("name").value = bitff.name;
      document.getElementById("article").value = bitff.article;
      document.getElementById("usertitle").value = bitff.usertitle;
      document.getElementById("birthyear").value = bitff.birthyear;
      document.getElementById("location").value = bitff.location;
      document.getElementById("gender").value = bitff.gender;
      document.getElementById("interests").value = bitff.interests;
      document.getElementById("favorites").value = bitff.favorites;
      document.getElementById("favsite").value = bitff.favsite;
    } else {
      reject(err);
    }
  });
}

// uses private posting key to update profile
function updateProfile() {
  var data = "<img src='https://personal.community/images/logo512.png'><br />I've created a <a href='https://personal.community'>personal.community</a> profile, please check it out here:<br /> <a href='https://personal.community/?hive=" + document.getElementById('hiveuser').value + "' target='_blank'>personal.community/?hive=" + document.getElementById('hiveuser').value + "</a>";
  var article = document.getElementById('article').value;
  var name = document.getElementById('name').value;
  var favsite = document.getElementById('favsite').value;
  var usertitle = document.getElementById('usertitle').value;
  var birthyear = document.getElementById('birthyear').value;
  //var sign = document.getElementById('sign').value;
  var gender = document.getElementById('gender').value;
  var location = document.getElementById('location').value;
  var interests = document.getElementById('interests').value;
  var favorites = document.getElementById('favorites').value;
  console.log("proof: " + favsite + article + name + usertitle + birthyear + gender + location + interests + favorites);
  hive.broadcast.comment(
    document.getElementById('postingKey').value,
    '', //author
    'blokzprofile', //firsttag
    document.getElementById('hiveuser').value,
    'blokzprofile', //permlink
    'My Personal.Community Profile',
    data,
    // json meta
    {
      tags: ['blokz'],
      app: 'blokz',
      article: article,
      name: name,
      favsite: favsite,
      usertitle: usertitle,
      birthyear: birthyear,
      gender: gender,
      location: location,
      interests: interests,
      favorites: favorites
    },
    function (err, result) {
      if (err)
        alert('failure ' + err);
      else
        alert('Profile Updated');

      // localStorage.setItem("hive", (document.getElementById('hiveuser').value));
      // window.location.href = '../';
    }
  );
}


function blokz_hivesigner() {
  pageURL = window.location.origin;
  state = "/";
  var client = new hivesigner.Client({
    app: 'blokz',
    callbackURL: pageURL,
    scope: ['vote', 'comment', 'comment_options'],
  });
  var params = {};
  // build profile data
  var data = "<img src='https://personal.community/images/logo512.png'><br />I've created a <a href='https://personal.community'>personal.community</a> profile, please check it out here: <a href='https://personal.community/?hive=" + document.getElementById('hiveuser').value + "' target='_blank'>personal.community/?hive=" + document.getElementById('hiveuser').value + "</a> to view.";
  var article = document.getElementById('article').value;
  var name = document.getElementById('name').value;
  var usertitle = document.getElementById('usertitle').value;
  var birthyear = document.getElementById('birthyear').value;
  var gender = document.getElementById('gender').value;
  var location = document.getElementById('location').value;
  var interests = document.getElementById('interests').value;
  var favorites = document.getElementById('favorites').value;
  var title = "My Blokz Profile";
  var account_name = document.getElementById('hiveuser').value;

  permlink = "blokzprofile";
  console.log("proof: " + article + name + usertitle + birthyear + gender + location + interests + favorites);

  // profile build finished
  var json_mm = {
    "tags": ['blokz'],
    "app": 'blokz',
    "article": article,
    "name": name,
    "usertitle": usertitle,
    "birthyear": birthyear,
    "gender": gender,
    "location": location,
    "interests": interests,
    "favorites": favorites
  };
  json_mm = JSON.stringify(json_mm);

  comment_options = {
    "author": account_name,
    "permlink": "blokzprofile",
    "max_accepted_payout": "1000000.000 SBD",
    "percent_steem_dollars": "5000",
    "allow_votes": true,
    "allow_curation_rewards": true,
    "extensions": [
      [
        0,
        {
          "beneficiaries": [
            { "account": "blokz", "weight": 300 },
            { "account": "sn0n", "weight": 100 },
          ]
        }
      ]
    ]
  };
  comment_options = JSON.stringify(comment_options);

  client.comment(
    account_name,
    'blokzprofile',
    document.getElementById('hiveuser').value,
    'blokzprofile',
    'My Personal.Community Profile',
    data,
    {
      tags: ['blokz'],
      app: 'blokz',
      article: article,
      name: name,
      favsite: favsite,
      usertitle: usertitle,
      birthyear: birthyear,
      gender: gender,
      location: location,
      interests: interests,
      favorites: favorites
    },
    function (err, result) {
      if (err)
        console.log("failure : " + JSON.stringify(err))
      else
        alert('Profile Updated');
    }
  );


  var link = client.getLoginURL(state);
  console.log("your login link is: " + link)

  function hivelogin() {
    client.login(params, function (err, token) {
      console.log(err, token)

    });
  }

  //TODO BLOCK

  // 
  // hivesigner code
};


if (getQueryVariable("access_token") !== false) {
  console.log("TOKEN FOUND: " + getQueryVariable("access_token"));
  hivesigner.setAccessToken = (getQueryVariable("access_token"));
}

if (localStorage.getItem("hive") !== null) {
  hiveuser = localStorage.getItem("hive");
  console.log(typeof hiveuser)
} else {
  console.log("user does not exist! or something went wrong");
}

if (getQueryVariable("steem") !== false) {
  steemuser = getQueryVariable("steem");
  localStorage.setItem("steem", steemuser);
  console.log(steemuser + " connected");
}

if (getQueryVariable("hive") !== false) {
  hiveuser = getQueryVariable("hive");
  localStorage.setItem("hive", hiveuser);
  console.log(hiveuser + " connected");
}

if (getQueryVariable("tag") !== false) {
  tag = getQueryVariable("tag");

  hiveuser = undefined;
} else if (getQueryVariable("post") !== false) {
  post = "true";
  hiveuser = undefined;
} else if (getQueryVariable("userLatest") !== false) {
  userLatest = getQueryVariable("userLatest");

  hiveuser = undefined;
}







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

  document.getElementById("gridd").style.display = "none";
  console.log("Please click the blokz logo below");
  var html = `<div id='splash'><img src='../images/logo192.png'><br />browse site as :` +
    `<form id="frm1" action="/"><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="font-size: 1.25em;">` +
    `  <label class="mdl-textfield__label" for="sample4" style="font-size: 1.25em;">username</label>` +
    `  <input type="text" name="hive" class="mdl-textfield__input">` +
    `</div></form>` +
    `<br />or login with <br />` +
    `<div id="loggedin">` +

    `      <button onclick="hivelogin()"><img src="../images/hivesigner.svg" height="16px" width="16px" />` +
    `        hivesigner` +
    `      </button>` +

    `    </div>` +
    `<hr />Click the <a href='https://blokz.io/'>blokz.io</a> icon on the bottom right to navigate site.<br /> ` +
    `<hr />Made with &#10084; by <a href="../?hive=sn0n">@sn0n</a></div>`;
  var tempElement = document.createElement('splash');
  tempElement.innerHTML = html;
  document.getElementsByTagName('body')[0].appendChild(tempElement.firstChild);

}



// MAIN BODY OF DISPLAYING A PROFILE
window.onload = function loading() {






  var oldestPermLink = "";

  if (tag !== "null") {

    hive.api.getDiscussionsByCreated({ "tag": tag, "limit": 10 }, function (err, result) {

      if (err === null) {

        var i, len = result.length;

        document.getElementById("display").innerHTML += "<small>most recent</small><div style='font-size: 300%; padding: .1em; margin: .2em'> " + tag + "</div>";

        for (i = 0; i < len; i++) {

          var discussion = result[i];
          console.log(i, discussion);
          console.log("who dun it " + discussion.author);
          console.log("where do i find it? @" + discussion.author + "/" + discussion.permlink);
          document.getElementById("display").innerHTML += "<a href='?post=@" + discussion.author + "/" + discussion.permlink + "'>" + discussion.title + "</a><br /> by " + discussion.author + " on " + discussion.created.slice(0, 10) + "<br />";
          document.getElementById("comments").style.display = "none";

        }

      } else {

        console.log(err);

      }

    });

  } else if (post === "true") {

    var letting = getQueryVariable("post").split("/");
    author = letting[0].replace("@", '');
    permlink = letting[1];
    console.log("letting : " + author + permlink);
    hive.api.getContent(author, permlink, function (err, result) {
      console.log(err, result);
      post1 = md.render(result.body).replace("\n", "");
      //post1 = post1.replace(new RegExp("<img ", 'g'), "<img width='80%' ");
      document.getElementById("display").innerHTML += "<div style='font-weight: strong; font-size: 400%; line-height: 100%; padding: .1em;'>" + result.title + "</div>";
      document.getElementById("display").innerHTML += "<br />Posted by <a href='../?hive=" + result.author + "'>@" + result.author + "</a>";
      document.getElementById("display").innerHTML += "<br />on " + result.created.slice(0, 10) + "<hr>";
      document.getElementById("display").innerHTML += md.render(post1);
      document.getElementById("display").innerHTML += "<hr /> tags: <br />";
      jsonTAGS = JSON.parse(result.json_metadata);
      jsonTAGS.tags.forEach(genTags);
      // todo : comments
      document.getElementById("comments").innerHTML += "<h3>Comments</h3>";
      hive.api.getContentReplies(author, permlink, function (err, result) {
        console.log(err, result);
        if (result.length > 0) {
          console.log("testing number " + result.length)
          comments = JSON.stringify(result[0].author);
          for (var i = 0; i < result.length; i++) {
            console.log(" for loop data : " + JSON.stringify(result[i]));
            thisPost = JSON.parse(JSON.stringify(result[i]));
            console.log("who dis " + thisPost.author);
            console.log("i is " + i);
            document.getElementById("comments").innerHTML += "<div id='comm'>" + thisPost.author + " <a href='?post=@" + thisPost.author + "/" + thisPost.permlink + "'>says</a>: " + md.render(result[i].body) + "</div>";
            // if parent_author is listed, put on top of post
          }
          console.log("comment from: " + comments);

        } else {

          console.log("no comments");
          document.getElementById("comments").innerHTML += "no comments to show";

        }

      });

    });

  } else if (userLatest !== undefined) {

    console.log("user connected for showing their latest posts : " + userLatest);
    // get recent posts
    hive.api.getDiscussionsByAuthorBeforeDate(userLatest, null, now, 20, (err, result) => {
      // testing for loop for posts. 
      // data for each post in a loop
      document.getElementById("display").innerHTML += "most recent posts of <h1><a href='../?hive=" + userLatest + "'>" + userLatest + "</a></h1>";
      for (var i = 0; i < result.length; i++) {
        console.log(" for loop data : " + JSON.stringify(result[i]));
        thisPost = JSON.parse(JSON.stringify(result[i]));
        console.log("who dis " + userLatest);
        console.log("i is " + i);
        // http://127.0.0.1:3000/browser/?post=yabapmatt/some-thoughts-on-the-future
        document.getElementById("display").innerHTML += "<a href='?post=" + userLatest + "/" + thisPost.permlink + "'>" + thisPost.title + "</a><br /> by " + userLatest + " on " + thisPost.created.slice(0, 10) + "<br />";
        document.getElementById("comments").style.display = "none";
      }
    });

  } else if (hiveuser !== undefined) {

    // gets posting_json_metadata for generic profile data for user
    hive.api.call('database_api.find_accounts', { accounts: [hiveuser] }, (err, res) => {
      posting_json = JSON.parse(JSON.stringify(res.accounts[0].posting_json_metadata));
      // TODO: -- remove testing notes ^>^
      console.log("posting_json: " + posting_json);
      // display avater
      document.getElementById("profimg").src = JSON.parse(posting_json).profile.profile_image;
      // display cover image
      document.getElementById("coverimage").style.backgroundImage = "url('" + JSON.parse(posting_json).profile.cover_image + "')";
    });

    // get recent posts
    hive.api.getDiscussionsByAuthorBeforeDate(hiveuser, null, now, 10, (err, result) => {

      // testing for loop for posts. 
      // data for each post in a loop

      for (var i = 0; i < result.length; i++) {
        console.log(" for loop data : " + JSON.stringify(result[i]));
        thisPost = JSON.parse(JSON.stringify(result[i]));
        console.log("who dis " + thisPost.author);
        console.log("i is " + i);
      }

      // TODO: set loop for each & display inline popup
      var recent1 = JSON.parse(JSON.stringify(result[0]));
      console.log(recent1);
      var recent1date = recent1.created.slice(0, 10);
      post1 = md.render(recent1.body).replace("\n", "");
      post1 = post1.replace(new RegExp("<img ", 'g'), "<img width='80%' ");
      console.log("Looking fo this: " + post1);
      linktocontent = "1. <a href='browser/?post=" + recent1.author + "/" + recent1.permlink + "'>" + recent1.title + "</a> <br /><span>&nbsp;</span>Posted on " + recent1date + "<br />";
      document.getElementById("recent1link").innerHTML = linktocontent;

      //document.getElementById("HivePost").innerHTML = marked(recent1.body);
      console.log("TESTING RECENT POST: " + recent1.body);


      var recent2 = JSON.parse(JSON.stringify(result[1]));
      console.log("recent 2")
      console.log(recent2);
      var recent2date = recent2.created.slice(0, 10);

      post2 = md.render(recent2.body).replace("\n", "");
      post2 = post2.replace(new RegExp("<img ", 'g'), "<img width='80%' ");
      linktocontent = "2. <a href='browser/?post=" + recent2.author + "/" + recent2.permlink + "'>" + recent2.title + "</a> <br /><span>&nbsp;</span>Posted on " + recent2date + "<br />";
      document.getElementById("recent2link").innerHTML = linktocontent;

      //document.getElementById("HivePost").innerHTML = marked(recent1.body);
      console.log("TESTING RECENT POST: " + recent2.body);



      var recent3 = JSON.parse(JSON.stringify(result[2]));
      console.log(recent3);
      var recent3date = recent3.created.slice(0, 10);

      post3 = md.render(recent3.body).replace("\n", "");
      post3 = post3.replace(new RegExp("<img ", 'g'), "<img width='80%' ");
      linktocontent = "3. <a href='browser/?post=" + recent3.author + "/" + recent3.permlink + "'>" + recent3.title + "</a> <br /><span>&nbsp;</span>Posted on " + recent3date + "<br />";
      document.getElementById("recent3link").innerHTML = linktocontent;

      //document.getElementById("HivePost").innerHTML = marked(recent1.body);
      console.log("TESTING RECENT POST: " + recent3.body);




      // view more on peakd
      document.getElementById("recentM").innerHTML = "<a href='../browser/?userLatest=" + thisPost.author + "'>View More</a><br /><br />";
    });

    // show link to peakd profile
    document.getElementById("hiveuser").innerHTML = "<a href='http://peakd.com/@" + hiveuser + "' target='_blank'>@" + hiveuser + "</a>";

    // fetch blokzprofile post from hive
    hive.api.getDiscussionsByAuthorBeforeDate(hiveuser, 'blokzprofile', now, 1, (err, result) => {

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
          vadd.setAttribute("onclick", "window.location.href='../browser/?tag=" + entryy + "';");
          document.getElementById("interests").appendChild(vadd);
          var sadd = document.createElement('span');
          sadd.className = "mdl-chip__text";
          sadd.id = entryy + "2";
          document.getElementById(entryy).appendChild(sadd);
          var t = document.createTextNode("#" + entryy);
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
        hive.api.call('database_api.find_accounts', { accounts: [hiveuser] }, (err, res) => {
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
          if (JSON.parse(posting_json).profile.about !== undefined) {
          titleset = JSON.parse(posting_json).profile.about;
          } else {
          titleset = "";
          }
          document.getElementById("usertitle").innerHTML = titleset;
          document.getElementById("name").innerHTML = hiveuser;
          document.getElementById("strongAge").style.display = "none";
          document.getElementById("strongGender").style.display = "none";
          document.getElementById("strongFriends").style.display = "none";
          document.getElementById("strongAbout").style.display = "none";
          document.getElementById("strongFollow").style.display = "none";
          document.getElementById("age").style.display = "none";
          document.getElementById("gender").style.display = "none";


          //console.log("Location: " +JSON.parse(posting_json).profile.location);

        });
        // finished displaying posting_json_metadata for non blokz/profile user
      }
    });
    document.title = hiveuser + "'s personal.community profile";

    document.getElementById("comments").style.display = "none";
    document.getElementById("display").style.display = "none";

  } else if (update === true) {

    console.log("welcome to updating a profile");

  } else {

    splash();
    document.getElementById("comments").style.display = "none";
    document.getElementById("display").style.display = "none";

  };

};