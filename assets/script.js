function fetchItems() {
    const Http = new XMLHttpRequest();
    const url = '/item-components';
    Http.open('GET', url, true);
    Http.send();

    Http.onloadend = (e) => {
        document.getElementById('items').innerHTML = Http.responseText;
    };
}

function fetchItem(identifier) {
    const Http = new XMLHttpRequest();
    const url = '/item-component?identifier=' + identifier;
    Http.open('GET', url, true);
    Http.send();

    Http.onloadend = (e) => {
        document.getElementById('content').innerHTML = Http.responseText;
    };
}