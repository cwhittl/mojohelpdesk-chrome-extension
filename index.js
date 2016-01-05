function loadBabel(file) {
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "text/babel";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the body element in order to load the script
    document.body.appendChild(jsElm);
}
function loadJS(file) {
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "text/javascript";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the body element in order to load the script
    document.body.appendChild(jsElm);
}
//document.addEventListener('DOMContentLoaded', function() {
//console.log("fred");
//document.querySelectorAll('div[role="complementary"] .u5').innerHTML("FRED");
//loadJS(chrome.extension.getURL("lib/browser.min.js"));
//});
//loadBabel(chrome.extension.getURL("components/App.js"));
setTimeout(function() {
    console.log("FRED");
    ReactDOM.render(React.createElement(App,null), document.querySelector('[role="complementary"] .u5'));
}, 10000);