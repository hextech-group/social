function buildprofile(hiveuser) {


    let profile = document.getElementById('TempProfile');
    let display = document.getElementById('profile');
    display.appendChild(profile.content.cloneNode(true));
    console.log("fetching profile for : " + hiveuser)
    // gets posting_json_metadata for generic profile data for user
    hive.api.call('database_api.find_accounts', { accounts: [hiveuser] }, (err, res) => {
        let posting_json = res.accounts[0].posting_json_metadata;
        console.log("posting_json: " + posting_json);
        if (JSON.parse(posting_json).profile.about !== undefined) {
            let saniabo = JSON.parse(posting_json).profile.about;
            let saniabout = sanitize(saniabo);
            document.getElementById("usertitle").innerHTML = saniabout;
        } else {
            titleset = "";
        }
        if (JSON.parse(posting_json).profile.name !== undefined) {
            let saniname = JSON.parse(posting_json).profile.name;
            let saniName1 = sanitize(saniname);
            document.getElementById("name").innerHTML = saniName1;
        } else {
            document.getElementById("name").innerHTML = hiveuser;
        }
        if (JSON.parse(posting_json).profile.website !== undefined) {
            let saniweb = JSON.parse(posting_json).profile.website;
            let saniwebsite = sanitize(saniweb);
            document.getElementById("favsite").innerHTML = "<a href='" + saniwebsite + "' target='_blank'>" + saniwebsite + "</a>";
        } else {
            document.getElementById("strongWebsite").style.display = "none";
        }
        if (JSON.parse(posting_json).profile.location !== undefined) {
            let saniloc = JSON.parse(posting_json).profile.location;
            let sanilocation = sanitize(saniloc);
            console.log("loc " + sanilocation)
            document.getElementById("location").innerHTML = sanilocation;
        } else {
            document.getElementById("strongLocation").style.display = "none";
        }
        let createdAge = res.accounts[0].created.slice(0, 10);
        let datedd = createdAge.split("-");
        console.log("Member since: " + datedd[0]);
        function monthName(mon) {
            return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon - 1];
        }
        document.getElementById("age").innerHTML = monthName(datedd[1]) + " " + datedd[2] + ", " + datedd[0];
        // TODO: -- remove testing notes ^>^
        // console.log("posting_json: " + posting_json);
        // display avater
        // https://images.hive.blog/u/" + result.author + "/avatar
        let useravatar = "https://images.hive.blog/u/" + hiveuser + "/avatar";
        document.getElementById("profimg").src = useravatar;
        // display cover image
        document.getElementById("coverimage").style.backgroundImage = "url('https://images.hive.blog/0x0/" + JSON.parse(posting_json).profile.cover_image + "')";
    });

    hive.api.getDiscussionsByAuthorBeforeDate(hiveuser, null, now, 10, (err, result) => {
        // testing for loop for posts. 
        // data for each post in a loop
        //document.getElementById("blog").innerHTML += "most recent posts of <h1><a href='../?hive=" + hiveuser + "'>" + hiveuser + "</a></h1>";
        for (var i = 0; i < result.length; i++) {

            // testing for replies 
            // console.log(" for loop data : " + JSON.stringify(result[i]));
            // console.log("who dis " + hiveuser);
            // console.log("i is " + i);
            // http://127.0.0.1:3000/?post=yabapmatt/some-thoughts-on-the-future
            reactionCount = result[i].active_votes.length;
            // console.log('post created on : ' + result[i].created);
            let postedon = new Date(result[i].created.slice(0, 10)).toDateString();
            let descjson = JSON.parse(result[i].json_metadata);
            console.log("working with json_metadata: " + JSON.stringify(descjson.description));

            if (descjson.description !== undefined) {
                console.log("success on description : " + descjson.description);
                postdesc = sanitize(descjson.description);
            } else {
                console.log("no desc");
                postdesc = md.render(result[i].body);
                postdesc = strip(postdesc);
                postdesc = sanitize(postdesc);
                postdesc = truncate(postdesc, 20);
                console.log("What post desc we working with here: " + postdesc);
                postdesc = postdesc + "...";
            }
            postedon = postedon.split('GMT');


            document.getElementById("blog").innerHTML += "<div style='background-color: #fff; border: 1px solid #e7e7f1;box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); padding: 1em; margin: 1em;'><a href='?post=" + hiveuser + "/" + result[i].permlink + "'>" + result[i].title + "</a>" +
                "<div style='overflow: hidden'>" + postdesc + "</div>" +
                "<div style='margin-top: 1em; min-width: 50%; text-align: right'> " + postedon + "</div></div>";
             <span class='material-icons' style='font-size:12px'>thumbs_up_down</span> //  + reactionCount + 

        }
    });


    // show link to peakd profile
    // TODO : remove link 
    document.getElementById("hiveuser").innerHTML = "<br /><a href='http://peakd.com/@" + hiveuser + "' target='_peakd'><img src='../images/peakd.png'></a> &#8226; ";
    document.getElementById("hiveuser").innerHTML += "<a href='http://hivestats.io/@" + hiveuser + "' target='_hivestats'><img src='../images/hivestats.ico'></a> &#8226; ";
    document.getElementById("hiveuser").innerHTML += "<a href='https://hive-engine.com/?p=balances&a=" + hiveuser + "' target='_hiveengine'><img src='../images/hive_engine.png' height='32px' width='32px'></a> &#8226; ";
    document.getElementById("hiveuser").innerHTML += "<a href='https://dcity.io/city?c=" + hiveuser + "' target='_dcity'><img src='../images/dcity.png' height='32px' width='151px'></a>  ";
    // https://hiveblocks.com/@
    // fetch blokzprofile post from hive
    hive.api.getContent(hiveuser, 'blokzprofile', function (err, result) {
        // hive.api.getDiscussionsByAuthorBeforeDate(hiveuser, 'blokzprofile', now, 1, (err, result) => {
        // user has a blokz/profile
        console.log("whats goin on here?")
        // console.log(err, result)
        if (result) {

            // console.log("meep :" + JSON.stringify(result));
            var blokzmeta = JSON.parse(result.json_metadata);
            console.log("test " + blokzmeta.article);
            // console.log("what is blokify " + blokify);
            var bitff = JSON.parse(JSON.stringify(blokzmeta));
            // console.log("blokzmeta: " + bitff.app);
            // console.log(bitff.interests);
            document.getElementById("article").innerHTML = sanitize(md.render(blokzmeta.article));
            // ~~~ md.render(blokzmeta.article).replace("\n", "");
            //var profage = year.getFullYear() - sanitize(blokzmeta.birthyear);

            // document.getElementById("location").innerHTML = sanitize(blokzmeta.location);
            // document.getElementById("gender").innerHTML = sanitize(blokzmeta.gender);
            // document.getElementById("favsite").innerHTML = "<a href='" + sanitize(blokzmeta.favsite) + "' target='_blank'>" + sanitize(blokzmeta.favsite) + "</a>";
            // interests

            /* <a class='mdl-chip mdl-chip--contact mdl-chip--deletable' href='../?tag=hive-167922'>
            <img class='mdl-chip__contact mdl-color--pink' src='https://images.hive.blog/u/hive-167922/avatar'></img>
            <span class='mdl-chip__text'>leofinance &nbsp;</span>
            </a>  */

            var interests = sanitize(bitff.interests);
            let interestsLog = interests.split(',');

            interestsLog.forEach(function (entry) {
                console.log(entry);
                if (entry.substring(0, 5) == "hive-") {
                    console.log("community found in interests at " + entry);
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", url);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            let communityinfo = JSON.parse(xhr.responseText)
                            console.log("at bat " + communityinfo.result.title);
                            let originalchips = document.getElementById("interests").innerHTML;
                            document.getElementById("interests").innerHTML = "<a class='mdl-chip mdl-chip--contact mdl-chip--deletable' href='../?tag=" + entry + "'><img class='mdl-chip__contact mdl-color--pink' src='https://images.hive.blog/u/" + entry + "/avatar'></img><span class='mdl-chip__text'>" + communityinfo.result.title + "&nbsp;</span></a>" + originalchips;
                        }
                    };
                    var data = '{"jsonrpc":"2.0", "method":"bridge.get_community", "params":{"name":"' + entry + '","observer":"blokz"}, "id":1}';
                    xhr.send(data);
                } else {
                    if (entry.length > 2) {
                        let entryy = entry; //.replace(/\s+/g, '');
                        // entryy = entryy.replace(/[^a-zA-Z0-9]/g, '');
                        entryy = entryy.toLowerCase();
                        // creat chips for each interest
                        // todo: parse for communities and update those 'hive-'
                        var vadd = document.createElement('button');
                        vadd.className = "mdl-chip";
                        vadd.id = entryy;
                        vadd.setAttribute("onclick", "window.location.href='/?tag=" + entryy + "';");
                        document.getElementById("interests").appendChild(vadd);
                        var sadd = document.createElement('span');
                        sadd.className = "mdl-chip__text";
                        sadd.id = entryy + "2";
                        document.getElementById(entryy).appendChild(sadd);
                        var t = document.createTextNode("#" + entryy);
                        document.getElementById(entryy + "2").appendChild(t);
                    }
                };

                // todo: community chips

                // end of fix community named chips


                // ENDNEW
            });

            // favorite steemians
            var favs = sanitize(bitff.favorites);
            // console.log("favs : " + favs);
            let favsLog = favs.split(',');
            favsLog.forEach(function (entry) {
                if (entry.length > 2) {
                    // console.log("show: " + entry);
                    let entryy = entry.replace(/\s+/g, '');
                    entryy = entryy.toLowerCase();
                    // CURRENT TODO: FRIEND IMAGE
                    // console.log("CAUGHT: " + entryy);
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
                }
            }); // finished displaying blokzprofile

        } else {
            nonBlokzUser(hiveuser);
        }
        hidecomm();
    });
    document.title = hiveuser + "'s personal.community profile";
}