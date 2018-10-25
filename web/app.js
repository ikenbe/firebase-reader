"use strict";
var $ = document.querySelectorAll.bind(document),
    $ID = document.getElementById.bind(document),
    $newEle = document.createElement.bind(document);
var cardId = 1,
    textSpeed = 0,
    appData = {};

// Dependencies
import { MDCDrawer } from "@material/drawer";
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

function app() {

    // Variables

    // Listeners
    $ID("add-text").addEventListener("click", () => {
        newCard($ID("inputArea").value, "listContainer", cardId++)
    });
    $ID("close-button").addEventListener("click", () => {
        appData.playing = null;
        $ID("close-button").parentNode.setAttribute("style", "display:none");
        $("pretext")[0].innerText = "";
        $("current")[0].innerText = "";
        $("postext")[0].innerText = "";
    });
    $ID("speed-slider").onchange = function() {
        console.log(this.value)
        textSpeed = this.value;
    }
    $ID("replay").addEventListener("click", () => {
        appData.playing = null;
        setTimeout(function() {
            play(appData.currentID)
        }, $("current")[0].innerText.length * 20 + 200 - (textSpeed) * 2);
        $("current")[0].innerText = " ";
        pauseButtonUI("reset")
    })
    $ID("pause-stream").addEventListener("click", () => {
        if (appData.playing) {
            appData.playing = null;
            pauseButtonUI("pause")
        } else {
            var textFlow = appData["text" + appData.currentID].split("|");
            appData.playing = 1;
            wordStream(textFlow, appData.streamPos);
            pauseButtonUI("play")
        }
    })

    // Functions
    function play(id) {
        $(".read-container")[0].setAttribute("style", "display:block");
        appData.currentID = id;
        //var textFlow = $ID("textcard-" + id).getAttribute("text").split("|");
        var textFlow = appData["text" + id].split("|");
        //console.log(textFlow);
        var textLoc = 0;
        appData.playing = 1;
        wordStream(textFlow, 0)
    }

    function pauseButtonUI(input) {
        if (input === "pause") $ID("pause-stream").innerHTML = "<i class=\"material-icons\">play_arrow</i>";
        if (input === "play" || input === "reset") $ID("pause-stream").innerHTML = "<i class=\"material-icons\">pause</i>"
    }

    function wordStream(textFlow, a) {
        if (appData.playing === null) return a;
        $("current")[0].innerText = textFlow[a]; //+ (textFlow[a].length * 20 + 200 - (textSpeed) * 2);
        if (!textFlow[a + 1]) { appData.playing = null; return a; }
        appData.streamPos = a;
        setTimeout(function() {
            wordStream(textFlow, a + 1);
        }, textFlow[a].length * 20 + 200 - (textSpeed) * 2)
    }

    function textCardControl(id) {
        var ctrl = document.createElement("div");
        ctrl.setAttribute("class", "controlbox");
        ctrl.setAttribute("id", "ctrl" + id);
        var btn1 = newButton("roundbutton",
            function() {
                if ($ID("textcard-" + id)) { play(id); }
            },
            "play",
            "play_arrow");
        var btn2 = newButton("controlbutton",
            function() {
                setTimeout(function() {
                    var _x = $ID("textcard-" + id);
                    if (_x != null) {
                        _x.parentNode.removeChild(_x.nextSibling);
                        _x.parentNode.removeChild(_x)
                    }
                }, 200)
            },
            "delete",
            "delete");
        ctrl.appendChild(btn1);
        ctrl.appendChild(btn2);
        return ctrl;
    }

    function newButton(DOMclass, listener, control, icon) {
        var Button = $newEle("button");
        Button.setAttribute("class", DOMclass);
        var icn = $newEle("i");
        icn.setAttribute("class", "material-icons " + control);
        icn.innerText = icon;
        Button.appendChild(icn);
        Button.addEventListener('click', listener)
        return Button;
    }

    function newCard(content, parent, cardId) {
        var workingId = cardId;
        if (content == "") return null;
        var card = document.createElement("div");
        card.setAttribute("class", "textcard");
        card.setAttribute("id", "textcard-" + workingId);
        card.appendChild(document.createTextNode(content));
        $ID(parent).appendChild(card);
        $ID(parent).appendChild(textCardControl(workingId));
        //window["segment" + workingId] = segment;
        if (content.hasCHN()) { wordSegment(content).then(res => segment(res, workingId)) } else {
            //$ID("textcard-" + (workingId)).setAttribute("text", content.replace(/\s+/g, "|")) 
            appData["text" + workingId] = content.replace(/\s+/g, "|");
        };
    }

    const wordSegment = firebase.functions().httpsCallable("nlp");


    function OLD_wordSegment(text, callback) { //LTP分词
        text = fixedURI(text.replace(/[\u201c\u201d\u3002\uff0c\u3001\u2026\u2026\uff1b\uff1a]/g, " "));
        console.log(text);
        var base = "https://api.ltp-cloud.com/analysis/?",
            key = "k1O3z0v1d9Fo8ZeDurXxAubuKTJAStqVBgDXrW0H",
            pattern = "ws",
            format = "json",
            callback = callback ? new String(callback) : "segment";
        var args = "api_key=" + key + "&text=" + text + "&pattern=" + pattern + "&format=" + format + "&callback=" + callback;
        var url = base + args;
        var req = document.createElement('script');
        req.setAttribute('src', url);
        req.setAttribute('class', 'get-word-list')
        document.getElementsByTagName('body')[0].appendChild(req);
        console.log("request sent")
    }
}

function localStore(data) {
    //console.log(Array.isArray(data));
    if (typeof(Storage) !== "undefined") {
        // 针对 localStorage/sessionStorage 的代码
        localStorage.setItem(cardId, data);
    } else {
        // 不支持 Web Storage .. 尝试使用cookie
    }
}

function segment(data, id) {
    console.log('data received:' + data);
    if (!id) id = cardId;
    appData["text" + id] = data.data[0].word.join("|");
}

function fixedURI(str) {
    str = str.replace(" for ", " %66%6fr ").replace(" or ", " %6fr ").replace(" in ", " %69%6e "); // Server returns error  when includes "for"/"or"/"in"
    return str.replace(/《》[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });;
}

document.onreadystatechange = function() {
    if (document.readyState == "complete") app();
};


/*** Disabled functions ***
    function removeEle(id) {
        if ($ID(id)) $ID(id).parentNode.removeChild($ID(id));
    }

    var _togglePlayer = function() {
        var ele = $(".read-container")[0];
        if (ele.getAttribute("style") == "display:none") ele.setAttribute("style", "display:block")
    }
*/

String.prototype.hasCHN = function(data) {
    if (!data) data = this;
    var part1 = [];
    for (var i = 0; i < data.length; ++i) {
        if (data.charCodeAt(i) > 0x2E80 && data.charCodeAt(i) < 0xFE4F) {
            return true;
        }
    }
    return false;
}

function charCodeMax(text) {
    var max = 0;
    for (var i = 0; i < text.length; ++i) {
        if (text.charCodeAt(i) > max) max = text.charCodeAt(i)
    }
    return max;
}