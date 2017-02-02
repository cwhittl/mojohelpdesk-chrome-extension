var Mojo_Custom_Fields_Form = React.createClass({
    displayName: 'Mojo_Custom_Fields_Form',
    getInitialState: function() {
        return {error_message: "", show: true, dialog_holder_id: this.props.dialog_holder_id};
    },
    componentWillMount: function() {
        API_Connector.get_ticket(this.props.cb_mojo_ext, this.getTicket, this.handleError);
    },
    handleError: function(event) {
        var message = "Unknown Error, Please Enable Debug and Check Javascript Console";
        if (event.hasOwnProperty("responseText")) {
            message = "Message From Mojo -- " + event.responseText;
        } else {
            debug.error(event);
        }
        this.setState({error_message: message});
    },
    handleChange: function(event) {
        var stateObject = function() {
            returnObj = {};
            returnObj[this.target.id] = this.target.value;
            return returnObj;
        }.bind(event)();
        this.setState(stateObject);
    },
    getTicket: function(response) {
        debug.info(response);
        var ticket = response.ticket;
        var ticket_type_id = ticket.ticket_type_id;
        var potential_assignees = Shared.get_potential_assignees(ticket.potential_assignees);
        this.setState({
            ticket: ticket,
            ticket_description: ticket.description,
            ticket_id: ticket.id,
            ticket_type_id: ticket_type_id,
            related_data: ticket.related_data,
            status_id: ticket.status_id,
            queue_id: ticket.related_data.queue.id,
            potential_assignees: potential_assignees,
            assigned_to_id: ticket.assigned_to_id,
            ticket_priority_id: ticket.priority_id
        }, function() {
            Shared.set_custom_fields_state(this.props.cb_mojo_ext, this);
        }.bind(this));
    },
    componentWillUnMount: function() {
        var child = document.getElementById(this.state.dialog_holder_id);
        document.body.removeChild(child);
    },
    updateForm: function(event) {
        event.preventDefault();
        var that = this;
        API_Connector.send_form(this, this.props.cb_mojo_ext, function() {
            if (that.props.reload == true) {
                setTimeout(function() {
                    window.location.reload(false);
                }, 1500);
            }
        });
    },
    render: function() {
        var R = React.DOM;
        var input = R.input;
        if (this.state.error_message != "") {
            return React.createElement(Modal, {
                show: true,
                handleClose: function(event) {
                    /*This is a hack to make sure another modal can be spawned, for some reason React
          is leaving a no script tag that keeps any Modals from firing again.
          */
                    document.querySelector(holder_key).innerHTML = "";
                }
            }, React.createElement("div", {
                id: "ajax_error"
            }, this.state.error_message));
        }
        if (this.state.ticket == null || this.state.show != true || !Modal) {
            return null;
        }
        var that = this;
        var holder_key = "#" + this.state.dialog_holder_id;
        return React.createElement(Modal, {
            show: true,
            handleClose: function(event) {
                /*This is a hack to make sure another modal can be spawned, for some reason React
        is leaving a no script tag that keeps any Modals from firing again.
        */
                document.querySelector(holder_key).innerHTML = "";
            }
        }, React.createElement(Portlet, {
            disable_close: false,
            disable_minimize: true,
            disable_maximize: false,
            minimized: false,
            title: this.state.title,
            handleClose: function(event) {
                //Yes I know how hacky this is, wanna fight about it?
                //I couldn't figure out how to trigger a modal close from outsite.
                jQuery('[data-modal="true"]').click();
                //modal.props.handleClose(event);
            },
            draggable: false
        }, R.span({
            className: this.state.status_type,
            id: "update_ticket_status_message",
            key: "status"
        }, this.state.status_message), Shared.create_custom_fields(this.state.ticket, this.props.cb_mojo_ext, this.state, this.handleChange), input({type: "submit", className: "update_ticket", value: "Update Ticket", onClick: this.updateForm})));
    }
});
