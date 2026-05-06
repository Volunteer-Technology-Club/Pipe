const { JSDOM } = require("jsdom");

const express = require("express");
const fs = require("fs");
const path = require("path");

const srcReg = new RegExp("src=*.?");
const hrefReg = new RegExp("href=*.?");

const app = express();

app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "docs" + (req.url == "/" ? "/index.html" : req.url)));
});

app.use(express.urlencoded({ extended: true }));

app.post("/{*any}", async (req, res) => {
    const page = await fetch(req.body.search);

    var dom = new JSDOM(await page.text());

    for (var child of Array.from(dom.window.document.children)) {
        parseChild(child);
    }

    res.type(".html");

    res.send(dom.serialize());
});

async function parseChild(child) {
    if (child.getAttribute("src")) {
        const src = await fetch(child.getAttribute("src"));
        const blob = await src.blob();
        
        const dataurl = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString("base64")}`;
        
        child.setAttribute("src", dataurl);

        for (var nested of Array.from(child.children)) {
            parseChild(nested);
        }
    } 
}

app.listen(6080, () => {
    console.log("Listening on port 6080");
});