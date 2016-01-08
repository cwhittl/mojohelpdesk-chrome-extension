console.log("Loading Mojo HelpDesk Extension by Collective Bias");
var cb_mojo_ext = new CB_Mojo_Extension();
target = document.querySelector('head > title');
observer = new window.WebKitMutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (cb_mojo_ext.baseURI == mutation.target.baseURI) {
            return;
        }
        cb_mojo_ext.baseURI = mutation.target.baseURI;
        if (cb_mojo_ext.debug_mode == true) {
            console.log(mutation);
        }
        if (document.URL.indexOf(cb_mojo_ext.mojo_domain) > -1 && document.URL.indexOf("ma/#/tickets/") > -1) {
            cb_mojo_ext.is_modal = true
            var ticket_id = window.location.href.split("/").slice(-1)[0].split("?").slice(0)[0];
            cb_mojo_ext.ticket_id = ticket_id;
            cb_mojo_ext.enhance_mojo_ui(cb_mojo_ext);
        } else {
            var title = mutation.target.textContent;
            if (title.indexOf(cb_mojo_ext.title_selector) > 0 && title.indexOf("(#") > 0) {
                var ticket_id = title.substring(title.indexOf("(#") + 2, title.lastIndexOf(")")).trim();
                cb_mojo_ext.ticket_id = ticket_id;
                ReactDOM.render(React.createElement(Gmail_Sidebar, {
                    cb_mojo_ext: cb_mojo_ext
                }), document.querySelector('[role="complementary"] .u5'));
            }
        }
    });
});
// set up an observer for the title element
//If you wanted to get more serious you could look at this https://github.com/kartiktalwar/gmail.js
if (document.URL.indexOf(cb_mojo_ext.mojo_domain) > -1 && document.URL.indexOf("ma/#/tickets/") > -1) {
    cb_mojo_ext.is_modal = true
    var ticket_id = window.location.href.split("/").slice(-1)[0].split("?").slice(0)[0];
}
observer.observe(target, {
    subtree: true,
    characterData: true,
    childList: true
});
console.log("Finished Loading Mojo HelpDesk Extension by Collective Bias");