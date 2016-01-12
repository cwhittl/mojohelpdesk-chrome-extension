var Ticket_Update_Form = React.createClass({
    displayName: 'Ticket_Update_Form',
    getInitialState: function() {
        return {
            ticket: null
        };
    },
    componentDidMount: function() {
        API_Connector.get_ticket(this.props.cb_mojo_ext, this.getTicket);
    },
    getTicket: function(response) {
        var ticket = response.ticket;
        var ticket_type_id = ticket.ticket_type_id;
        var potential_assignees = ticket.potential_assignees;
        var potential_assignees_sorted = [];
        $.each(potential_assignees, function(k, v) {
            potential_assignees_sorted.push({
                key: v.id,
                value: v.name
            });
        });
        potential_assignees_sorted.sort(function(a, b) {
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
        });
        this.setState({
            ticket: ticket,
            ticket_description: ticket.description,
            ticket_id: ticket.id,
            ticket_type_id: ticket_type_id,
            related_data: ticket.related_data,
            ticket_status_id: ticket.status_id,
            queue_id: ticket.related_data.queue.id,
            potential_assignees: potential_assignees_sorted,
            assigned_to_id: ticket.assigned_to_id
        });
        //Custom Fields
        var that = this;
        $.each(this.props.cb_mojo_ext.custom_fields_json, function(fieldName, fieldInfo) {
            var value = "";
            if (ticket.hasOwnProperty(fieldName)) {
                value = ticket[fieldName];
                var stateObject = function() {
                    returnObj = {};
                    returnObj[fieldName] = value;
                    return returnObj;
                }
                that.setState(stateObject);
            }
        });
    },
    handleMaximize: function() {
        if (this.props.handleMaximize) {
            this.props.handleMaximize(event);
        }
    },
    handleMinimize: function(event) {
        if (this.props.handleMinimize) {
            this.props.handleMinimize(event);
        }
    },
    handleChange: function(event) {
        var stateObject = function() {
            returnObj = {};
            returnObj[this.target.id] = this.target.value;
            return returnObj;
        }.bind(event)();
        this.setState(stateObject);
    },
    assignToMe: function(event) {
        event.preventDefault();
        this.setState({
            assigned_to_id: this.props.cb_mojo_ext.mojo_agent_id
        });
    },
    updateForm: function(event) {
        event.preventDefault();
        //console.log(this.state);
        API_Connector.send_form(this, this.props.cb_mojo_ext);
    },
    render_content: function(event) {
        if (this.state.ticket_id == null) {
            return null;
        }
        if (this.state.potential_assignees == null) {
            return null;
        }
        var cb_mojo_ext = this.props.cb_mojo_ext;
        var related_data = this.state.related_data;
        var submitter_full_name = related_data.user.full_name;
        var submitter_picture_url = related_data.user.picture_url;
        var R = React.DOM;
        var form = R.form;
        var input = R.input;
        var div = R.div;
        var potential_assignees = this.state.potential_assignees;
        var ticket_type = Shared.createFieldSet({
            label_text: "Ticket Type",
            id: "ticket_type_id",
        }, Shared.create_select("ticket_type_id", cb_mojo_ext.ticket_options, this.state.ticket_type_id, "Please select type", this.handleChange));
        var ticket_status = Shared.createFieldSet({
            label_text: "Ticket Status",
            id: "ticket_status_id",
        }, Shared.create_select("ticket_status_id", cb_mojo_ext.status_options, this.state.ticket_status_id, "Please select status", this.handleChange));
        var ticket_queue = Shared.createFieldSet({
            label_text: "Ticket Queue",
            id: "queue_id",
        }, Shared.create_select("queue_id", cb_mojo_ext.queues, this.state.queue_id, "Please select queue", this.handleChange));
        var assigned_to_me = R.a({
            href: "#",
            key: "assigned_to_me",
            id: "assigned_to_me",
            onClick: this.assignToMe
        }, "To Me");
        var ticket_assignee = Shared.createFieldSet({
            label_text: "Assignee",
            id: "assigned_to_id",
            labelChild: assigned_to_me
        }, Shared.create_select("assigned_to_id", potential_assignees, this.state.assigned_to_id, "Please select Assignee", this.handleChange));
        var controls = [];
        controls.push(ticket_type);
        controls.push(ticket_status);
        controls.push(ticket_queue);
        controls.push(ticket_assignee);
        var custom_controls = Shared.create_custom_fields(this.props.cb_mojo_ext, this, this.handleChange);
        controls.push(custom_controls);
        var ticket_create_date = new Date(this.state.ticket.created_on);
        return form({
            className: "ticketUpdateForm"
        }, R.span({
            className: this.state.status_type,
            id: "update_ticket_status_message",
            key: "status"
        }, this.state.status_message), R.a({
            target: "_ticket",
            id: "launch_ticket",
            href: "https://" + this.props.cb_mojo_ext.mojo_domain + "/tech/#" + this.state.ticket_id
        }, "Open " + this.state.ticket_id + " in Mojo"), Shared.create_user_info({
            user_id: this.state.ticket.user_id,
            user_name: submitter_full_name,
            user_picture: submitter_picture_url,
            timestamp: ticket_create_date.toLocaleString()
        }), div({
            className: "ticket_info"
        }, Shared.clean_message_body(this.state.ticket_description, cb_mojo_ext)), controls, input({
            type: "submit",
            className: "update_ticket",
            value: "Update Ticket",
            onClick: this.updateForm
        }));
    },
    render: function() {
        var R = React.DOM;
        return React.createElement(Portlet, {
            key: "ticket_update_form",
            id: "ticket_update_form",
            disable_close: true,
            disable_maximize: true,
            title: "Update Ticket",
            draggable: false,
            minimized: false,
            handleMaximize: this.handleMaximize,
            handleMinimize: this.handleMinimize
        }, this.render_content());
    }
});