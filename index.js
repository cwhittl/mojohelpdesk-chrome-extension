console.log("Loading Mojo HelpDesk Extension by Collective Bias");

function CB_Mojo_Extension_Loader() {
    this.init = function(cb_mojo_ext) {
        console.log(cb_mojo_ext);
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
                    var re = new RegExp(cb_mojo_ext.title_selector);
                    var title_search = title.match(re);
                    if (title_search != null) {
                        var ticket_id = title_search[title_search.length - 1]
                        console.log(ticket_id);
                        if (!Shared.isEmpty(ticket_id)) {
                            if (cb_mojo_ext.access_key == "" || cb_mojo_ext.email_address == "") {
                                sidebar = React.createElement("div", {
                                    className: "error"
                                }, "Please Configure");
                                console.log("Error Loading Mojo HelpDesk Extension by Collective Bias - Missing Options");
                            } else {
                                cb_mojo_ext.ticket_id = ticket_id;
                                sidebar = React.createElement(Gmail_Sidebar, {
                                    cb_mojo_ext: cb_mojo_ext
                                });
                            }
                            ReactDOM.render(sidebar, document.querySelector('[role="complementary"] .u5'));
                        }
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
    }
    new CB_Mojo_Extension(function(cb_mojo_ext) {
        API_Connector.get_queues(cb_mojo_ext, function(response) {
            if (cb_mojo_ext.debug_mode == true) {
                console.log(response);
            } // server response
            var queues = [];
            $.each(response, function() {
                $.each(this, function(k, v) {
                    queues.push({
                        key: v.id,
                        value: v.name
                    });
                });
            });
            cb_mojo_ext.queues = queues;
            if (cb_mojo_ext.mojo_agent_id == "") {
                API_Connector.get_agent_id(cb_mojo_ext, function(response) {
                    if (cb_mojo_ext.debug_mode == true) {
                        console.log(response);
                    } // server response
                    cb_mojo_ext.mojo_agent_id = response.user.id;
                    chrome.storage.sync.set({
                        mojo_agent_id: cb_mojo_ext.mojo_agent_id
                    });
                });
            }
        });
        this.init(cb_mojo_ext);
    });
}
CB_Mojo_Extension_Loader();