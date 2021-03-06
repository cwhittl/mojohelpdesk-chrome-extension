function CB_Mojo_Extension_Loader() {
    var _this = this;
    var queues = [];
    API_Connector.get_queues(cb_mojo_ext, function(response) {
        debug.info(response);
        $.each(response, function() {
            $.each(this, function(k, v) {
                queues.push({key: v.id, value: v.name});
            });
        });
        cb_mojo_ext.queues = queues;
        if (cb_mojo_ext.mojo_agent_id == "" && !Shared.isEmpty(cb_mojo_ext.email_address)) {
            API_Connector.get_agent_id(cb_mojo_ext, function(response) {
                debug.info(response);
                cb_mojo_ext.mojo_agent_id = response.user.id;
                Shared.setStorage({mojo_agent_id: cb_mojo_ext.mojo_agent_id});
                _this.init(cb_mojo_ext);
            }, function(event) {
                debug.error(event);
            });
        } else {
            _this.init(cb_mojo_ext);
        }
    }, function(event) {
        debug.error(event);
    });

    this.init = function(cb_mojo_ext) {
        target = document.querySelector('head > title');
        observer = this.title_observer();
        // set up an observer for the title element to catch transitions between gmail
        //If you wanted to get more serious you could look at this https://github.com/kartiktalwar/gmail.js
        observer.observe(target, {
            subtree: true,
            characterData: true,
            childList: true
        });

        if (document.URL.indexOf(cb_mojo_ext.mojo_domain) > -1 && document.URL.indexOf("ma/#/tickets/") > -1) {
            this.enhance_mojo_ui(cb_mojo_ext);
            console.log("Mojo UI Enhanced Loaded - Mojo HelpDesk Extension by Collective Bias");
        }
        console.log("Finished Loading Mojo HelpDesk Extension by Collective Bias");
    }

    this.title_observer = function() {
        var sidebar = null;
        var container = null;
        return new window.WebKitMutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                debug.info(mutation);
                if (cb_mojo_ext.baseURI == mutation.target.baseURI) {
                    return;
                }
                cb_mojo_ext.baseURI = mutation.target.baseURI;
                if (document.URL.indexOf(cb_mojo_ext.mojo_domain) > -1 && document.URL.indexOf("ma/#/tickets/") > -1) {
                    this.enhance_mojo_ui(cb_mojo_ext);
                    console.log("Mojo UI Enhanced Loaded - Mojo HelpDesk Extension by Collective Bias");
                } else if (document.URL.indexOf(cb_mojo_ext.email_domain) > -1) {
                    setTimeout(function() {
                        email = $("span[name='" + cb_mojo_ext.mojo_domain + "']").attr("email");
                        if (email != null) {
                            var ticket_id = ticket_id = email.substring(email.indexOf(".") + 1, email.indexOf("@"));
                            container = document.querySelector('[role="complementary"] .u5');
                            debug.info(ticket_id);
                            if (!Shared.isEmpty(ticket_id)) {
                                console.log("Gmail Ticket Loaded - Mojo HelpDesk Extension by Collective Bias");
                                cb_mojo_ext.ticket_id = ticket_id;
                                sidebar = React.createElement(Gmail_Sidebar, {cb_mojo_ext: cb_mojo_ext});
                                ReactDOM.render(sidebar, container);
                            }
                        } else if (sidebar != null) {
                            ReactDOM.unmountComponentAtNode(container);
                        }
                    }, 750);
                }
            });
        });
    }

    this.enhance_mojo_ui = function(cb_mojo_ext) {
        var ticket_id = window.location.href.split("/").slice(-1)[0].split("?").slice(0)[0];
        if (!$.isNumeric(ticket_id)) {
            return;
        }
        cb_mojo_ext.ticket_id = ticket_id;
        cb_mojo_ext.is_modal = true;
        //YES THIS IS HACKY, but it's due to trying to add on to Mojo's UI and requires a wait until it's done loading
        setTimeout(function() {
            var holder_key = "cb_mojo_dialog_holder_id";
            var newdiv = document.createElement('div');
            newdiv.setAttribute('id', holder_key);
            document.body.appendChild(newdiv);
            jQuery("#ticket-form-info table tr").on("click", function() {
                ReactDOM.render(React.createElement(Mojo_Custom_Fields_Form, {
                    cb_mojo_ext: cb_mojo_ext,
                    dialog_holder_id: holder_key,
                    reload: true
                }), document.querySelector("#" + holder_key));
            });
            jQuery('a[ng-click="onEditAssigneeQueueType()"]').on("click", function() {
                setTimeout(function() {
                    jQuery('a[ng-click="onSaveAssigneeQueueType()"]').on("click", function() {
                        setTimeout(function() {
                            ReactDOM.render(React.createElement(Mojo_Custom_Fields_Form, {
                                cb_mojo_ext: cb_mojo_ext,
                                dialog_holder_id: holder_key,
                                reload: true
                            }), document.querySelector("#" + holder_key));
                        }, 500);
                    });
                }, 1000);
            });
            jQuery(".ticket-side-options a").on("click", function() {
                $btn = jQuery(this);
                $subcategory_field = $btn.closest("#ticket-form-info").find("label:contains('Sub Category')").nextAll('input').first();
                $subcategory_field.prop('disabled', true);
                $subcategory_field_change = jQuery("<button>Change Sub Category</button>");
                $subcategory_field_change.on("click", function() {
                    ReactDOM.render(React.createElement(Mojo_Custom_Fields_Form, {
                        cb_mojo_ext: cb_mojo_ext,
                        dialog_holder_id: holder_key,
                        reload: true
                    }), document.querySelector("#" + holder_key));
                });
                $subcategory_field_change.insertAfter($subcategory_field);
            });
            jQuery(".showTicketDetail").find("a[href^='http']").attr('target', '_blank').css("color", "green");
            console.log("CB Mojo Enhanced UI Loaded");
        }, 1500);
    }
}
