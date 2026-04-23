const express = require("express");
const fs = require("fs");
const path = require("path");

const srcReg = new RegExp("src=*.?");

const app = express();

app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "docs" + (req.url == "/" ? "/index.html" : req.url)));
});

app.use(express.urlencoded({ extended: true }));

app.post("/{*any}", async (req, res) => {
    const page = await fetch(req.body.search);
    const html = await page.text();

    const elems = html.split(" ");
    
    for (var i = 0; i < elems.length; i++) {
        if (srcReg.test(elems[i])) {
            const src = await fetch(elems[i].substring(5, elems[i].length - 1));
            const blob = await src.blob();

            const dataurl = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString("base64")}`;
            console.log(dataurl);
            elems[i] = `src="${dataurl}"`;
        }
    }

    res.type(".html");

    res.send(html);
});

app.listen(6080, () => {
    console.log("Listening on port 6080");
});