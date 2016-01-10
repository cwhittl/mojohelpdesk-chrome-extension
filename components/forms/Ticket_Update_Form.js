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
            ticket_description: ticket.description,
            ticket_id: ticket.id,
            ticket_type: ticket.ticket_type.id,
            related_data: ticket.related_data,
            ticket_status: ticket.status_id,
            queue_id: ticket.related_data.queue.id,
            potential_assignees: potential_assignees_sorted,
            assigned_to_id: ticket.assigned_to_id
        });
    },
    handleChange: function(event) {
        var stateObject = function() {
            returnObj = {};
            returnObj[this.target.id] = this.target.value;
            return returnObj;
        }.bind(event)();
        this.setState(stateObject);
    },
    handleQueueChange: function(event) {
        console.log(event.target.value);
    },
    assignToMe: function(event) {
        event.preventDefault();
        this.setState({
            assigned_to_id: this.props.cb_mojo_ext.mojo_agent_id
        });
    },
    updateForm: function(event) {
        event.preventDefault();
        console.log("HI!");
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
            id: "ticket_type",
        }, Shared.create_select("ticket_type", cb_mojo_ext.ticket_options, this.state.ticket_type, "Please select type", this.handleChange));
        var ticket_status = Shared.createFieldSet({
            label_text: "Ticket Status",
            id: "ticket_status",
        }, Shared.create_select("ticket_status", cb_mojo_ext.status_options, this.state.ticket_status, "Please select status", this.handleChange));
        var ticket_queue = Shared.createFieldSet({
            label_text: "Ticket Queue",
            id: "queue_id",
        }, Shared.create_select("queue_id", cb_mojo_ext.queues, this.state.queue_id, "Please select queue", this.handleQueueChange));
        var ticket_assignee = Shared.createFieldSet({
            label_text: "Assignee",
            id: "assigned_to_id",
        }, Shared.create_select("assigned_to_id", potential_assignees, this.state.assigned_to_id, "Please select Assignee", this.handleChange));
        var assigned_to_me = R.a({
            href: "#",
            key: "assigned_to_me",
            id: "assigned_to_me",
            onClick: this.assignToMe
        }, "Assign To Me");
        var controls = [];
        controls.push(ticket_type);
        controls.push(ticket_status);
        controls.push(ticket_queue);
        controls.push(ticket_assignee);
        controls.push(assigned_to_me);
        return form({
            className: "updateForm"
        }, controls, input({
            type: "submit",
            value: "Update Ticket",
            onClick: this.updateForm
        }), div({
            className: "ticket_info",
            style: {
                backgroundImage: submitter_picture_url
            }
        }, "Submitted By " + submitter_full_name), div({
            className: "ticket_info"
        }, Shared.clean_message_body(this.state.ticket_description, cb_mojo_ext)));
    },
    render: function() {
        return React.createElement(Portlet, {
            disable_close: true,
            title: "Update",
            draggable: false,
            minimized: false
        }, this.render_content());
    }
});