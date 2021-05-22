/*
 * bibliotek och variabler
 */
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

const port = 5000;
var config;

/*
 * sido routings
 */
app.get('/', (req, res) => {
    var response = replace(fs.readFileSync('pages/index.html').toString());
    res.status(200).set('Content-Type', 'text/html').send(response);
});

/*
 * script och style routings
 */
app.get('/script', (req, res) => {
    var response = fs.readFileSync('assets/script.js').toString();
    res.status(200).set('Content-Type', 'text/javascript').send(response);
});

app.get('/style', (req, res) => {
    var response = fs.readFileSync('assets/style.css').toString();
    res.status(200).set('Content-Type', 'text/css').send(response);
});

/*
 * other routings
 */

// returnerar fil utefter förfrågan
app.get('/get', (req, res) => {
    const file = req.query.file;
    res.status(200).sendFile(path.resolve(process.cwd(), file));
});

/*
 * startpunkt
 */
loadConfig();

app.listen(port, () =>
    console.log('App running (CTRL + C to stop) \n > localhost:' + port));

/*
 * andra funktioner
 */

function replace(input) {
    // head
    while(input.includes('%head%'))
        input = input.replace('%head%', fs.readFileSync('assets/head.html').toString());

    // komponenter
    while(input.includes('%header%'))
		input = input.replace('%header%', fs.readFileSync('components/header.html').toString());
	while(input.includes('%footer%'))
        input = input.replace('%footer%', fs.readFileSync('components/footer.html').toString());
    
    // namn
    while(input.includes('%company-name%'))
        input = input.replace('%company-name%', config['company-name']);
    while(input.includes('%tab-name%'))
        input = input.replace('%tab-name%', config['tab-name']);
    while(input.includes('%header-title%'))
        input = input.replace('%header-title%', config['header-title']);

    return input;
}

function loadConfig() {
    config = JSON.parse(fs.readFileSync('config.json'));
}