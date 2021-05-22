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
    var response = replacePlaceholders(fs.readFileSync('pages/index.html').toString());
    res.status(200).set('Content-Type', 'text/html').send(response);
});

app.get('/item', (req, res) => {
    const identifier = req.query.identifier;
    var item = getItem(identifier);
    if(item == null) {
        res.status(404).send('Invalid identifier');
        return;
    }
    var response = replaceItemPlaceholders(replacePlaceholders(fs.readFileSync('pages/item.html').toString()), item);
    res.status(200).send(response);
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
 * andra routings
 */

// returnerar fil utefter förfrågan
app.get('/get', (req, res) => {
    const file = req.query.file;
    res.status(200).sendFile(path.resolve(process.cwd(), file));
});

/*
 * produkt routings
 */

app.get('/items', (req, res) => {
    const response = getItems();
    res.status(200).set('Content-Type', 'text/json').send(response);
});

/*
 * komponent routings
 */

app.get('/item-components', (req, res) => {
    const response = getItemComponents();
    res.status(200).set('Content-Type', 'text/html').send(response);
});

app.get('/item-component', (req, res) => {
    const response = getItemComponent(req.query.identifier);
    res.status(200).set('Content-Type', 'text/html').send(response);
});

/*
 * produkt funktioner
 */ 

function getItems() {
    var items = [];
    fs.readdirSync('items').forEach(itemDirectory => {
        var directoryFiles = fs.readdirSync('items/' + itemDirectory);
        if(!isValidItem(directoryFiles))
            return;
        items.push(JSON.parse(fs.readFileSync('items/' + itemDirectory + '/item.json')));
    });
    return items;
}

function getItem(identifier) {
    var response;
    getItems().forEach(item => {
        if(item['identifier'] === identifier)
            response = item;
    });
    return response;
}

function isValidItem(directoryFiles) {
    return directoryFiles.includes('image.jpg') && directoryFiles.includes('item.json');
}

/*
 * komponent funktioner
 */

function getItemComponents() {
    var html = '';
    const itemComponent = fs.readFileSync('components/item-small.html');
    getItems().forEach(item => {
        html += replaceItemPlaceholders(itemComponent.toString(), item);
    });
    return html;
}

function getItemComponent(identifier) {
    var item = getItem(identifier);
    if(item == null)
        return 'Invalid identifier'
    return replaceItemPlaceholders(replacePlaceholders(fs.readFileSync('components/item-big.html').toString()), item);
}

/*
 * andra funktioner
 */

function replacePlaceholders(input) {
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

    // valuta
    while(input.includes('%currency-name%'))
        input = input.replace('%currency-name%', config['currency']['name']);
    while(input.includes('%currency-prefix%'))
        input = input.replace('%currency-prefix%', config['currency']['prefix']);
    while(input.includes('%currency-suffix%'))
        input = input.replace('%currency-suffix%', config['currency']['suffix']);

    return input;
}

function replaceItemPlaceholders(input, item) {
    while(input.includes('%identifier%'))
        input = input.replace('%identifier%', item['identifier']);
    while(input.includes('%brand%'))
        input = input.replace('%brand%', item['brand']);
    while(input.includes('%name%'))
        input = input.replace('%name%', item['name']);
    while(input.includes('%color%'))
        input = input.replace('%color%', arrayToString(item['color']));
    while(input.includes('%price%'))
        input = input.replace('%price%', item['price']);
    while(input.includes('%image%'))
        input = input.replace('%image%', item['image']);
    return input;
}

function arrayToString(array) {
    var response = '';
    array.forEach(element => {
        response += element + ' / ';
    });
    return response.substring(0, response.length - 3);
}

function loadConfig() {
    config = JSON.parse(fs.readFileSync('config.json'));
}

/*
 * startpunkt
 */
loadConfig();

app.listen(port, () =>
    console.log('App running (CTRL + C to stop) \n > localhost:' + port));
