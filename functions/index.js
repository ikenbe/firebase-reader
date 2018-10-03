'use strict';

const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
//const http = require('http');
const fetch = require('node-fetch');
//const Promise = require('promise');
const token = 'Zw0W3ei-.16623.DrLIECAJsEM2';
let postOptions = {
    host: "http://api.bosonnlp.com",
    port: 80,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Token": token
    }
};

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.cors = functions.https.onRequest((req, res) => {
    console.log("This is [req.app]: " + req.app);
    console.log("This is [req.baseUrl]: " + req.baseUrl);
    console.log("[req.body]: " + req.body);
    console.log("[req.method]: " + req.method);
    console.log("req.toString" + req.toString());
    req = (req !== "[object Object]") ? req : "这是另一段示例文本";
    cors(req, res, () => {
        let fetchMeta = {
            port: 80,
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json",
                "X-Token": token
            },
            data: parseDatas("这是一段示例文本"),
            body: parseDatas(req)
        }
        fetch("http://api.bosonnlp.com/tag/analysis", fetchMeta)
            .then(r => {
                //console.log(r);
                return r.json()
            })
            .then(body => {
                console.log(body);
                let resp = { "data": body };
                return res.send(resp);
            })
            .catch(console.log);
    })
})

exports.nlp = functions.https.onCall((data) => {
    let fetchMeta = {
        port: 80,
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json",
            "X-Token": token
        },
        body: parseDatas(data)
    }
    return fetch("http://api.bosonnlp.com/tag/analysis", fetchMeta)
        .then(r => {
            //console.log(r);
            return r.json()
        })
        .catch(console.log);
})

exports.webPaser = functions.https.onCall((data) => {
        let fetchMeta = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "atLIp1lTKvDdtElc0O2RDjOuEb1LNRBd60q0nOw6"
            }
        }
        return fetch("https://mercury.postlight.com/parser" + "?url=" + data, fetchMeta)
            .then(r => {
                console.log(r)
                return r.content
            })
    })
    /*
    exports.bigben = functions.https.onRequest((req, res) =>
        cors(req, res, () => {
            const hours = (new Date().getHours() % 12) + 1 // London is UTC + 1hr;
            res.status(200).send(`<!doctype html>
          <head>
            <title>Time</title>
          </head>
          <body>
            ${'BONG '.repeat(hours)}
            </body>
        </html>`);

        }));
    */

function parseDatas(data) {
    var datas = [];
    if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
            datas.push(encodeString(data[i]));
        }
    } else {
        datas.push(encodeString(data));
    }
    return '[' + datas.toString() + ']';
}

function encodeString(data) {
    data = "\"" + escape(data).replace(/%/g, '\\') + "\"";
    data = restorePunctuation(data);
    return data;
}

function restorePunctuation(data) {
    data = data.replace(/\\A0/g, " ");
    data = data.replace(/\\A2/g, "\\u00A2");
    data = data.replace(/\\A3/g, "\\u00A3");
    data = data.replace(/\\A4/g, "\\u00A4");
    data = data.replace(/\\A5/g, "\\u00A5");
    data = data.replace(/\\A6/g, "\\u00A6");
    data = data.replace(/\\A7/g, "\\u00A7");
    data = data.replace(/\\A8/g, "\\u00A8");
    data = data.replace(/\\A9/g, "\\u00A9");
    data = data.replace(/\\AA/g, "\\u00AA");
    data = data.replace(/\\AB/g, "\\u00AB");
    data = data.replace(/\\AC/g, "\\u00AC");
    data = data.replace(/\\AD/g, "\\u00AD");
    data = data.replace(/\\AE/g, "\\u00AE");
    data = data.replace(/\\AF/g, "\\u00AF");
    data = data.replace(/\\B0/g, "\\u00B0");
    data = data.replace(/\\B1/g, "\\u00B1");
    data = data.replace(/\\B2/g, "\\u00B2");
    data = data.replace(/\\B3/g, "\\u00B3");
    data = data.replace(/\\B4/g, "\\u00B4");
    data = data.replace(/\\B5/g, "\\u00B5");
    data = data.replace(/\\B6/g, "\\u00B6");
    data = data.replace(/\\B7/g, ".");
    data = data.replace(/\\B8/g, "\\u00B8");
    data = data.replace(/\\B9/g, "\\u00B9");
    data = data.replace(/\\BA/g, "\\u00BA");
    data = data.replace(/\\BB/g, "\\u00BB");
    data = data.replace(/\\BC/g, "\\u00BC");
    data = data.replace(/\\BD/g, "\\u00BD");
    data = data.replace(/\\BE/g, "\\u00BE");
    data = data.replace(/\\BF/g, "\\u00BF");
    data = data.replace(/\\D7/g, " ");
    data = data.replace(/\\0A/g, " ");
    data = data.replace(/\\0D/g, " ");
    data = data.replace(/\\20/g, " ");
    data = data.replace(/\\21/g, "!");
    data = data.replace(/\\22/g, "\"");
    data = data.replace(/\\23/g, "#");
    data = data.replace(/\\24/g, "$");
    data = data.replace(/\\25/g, "%");
    data = data.replace(/\\26/g, "&");
    data = data.replace(/\\27/g, "'");
    data = data.replace(/\\28/g, "(");
    data = data.replace(/\\29/g, ")");
    data = data.replace(/\\2C/g, ",");
    data = data.replace(/\\3A/g, ":");
    data = data.replace(/\\3B/g, ";");
    data = data.replace(/\\3C/g, "<");
    data = data.replace(/\\3D/g, "=");
    data = data.replace(/\\3E/g, ">");
    data = data.replace(/\\3F/g, "?");
    data = data.replace(/\\5B/g, "[");
    data = data.replace(/\\5D/g, "]");
    data = data.replace(/\\5E/g, "^");
    data = data.replace(/\\7B/g, "{");
    data = data.replace(/\\7C/g, "|");
    data = data.replace(/\\7D/g, "}");
    data = data.replace(/\\7E/g, "~");
    return data;
}