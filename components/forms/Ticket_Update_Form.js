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
        this.setState({
            ticket: ticket
        });
        /*var ticket_id = ticket.id;
        var status_id = ticket.status_id;
        var related_data = ticket.related_data;
        var ticket_type = ticket.ticket_type.name;
        var ticket_type_id = ticket.ticket_type.id;
        var assigned_to_id = ticket.assigned_to_id;
        var queue = related_data.queue;
        var messages = ticket.all_comments;
        var submitter_full_name = related_data.user.full_name;
        var submitter_picture_url = related_data.user.picture_url;
        var submitter_email = related_data.user.email;
        var ticket_queue_id = queue.id;
        var ticket_queue_name = queue.name;
        var ticket_type_id = ticket.ticket_type.id;
        var ticket_description = ticket.description;
        var potential_assignees = ticket.potential_assignees;
        potential_assignees_fixed = Shared.convert_object(potential_assignees);*/
    },
    handleTypeChange: function(event) {
        console.log(event.target.value);
    },
    handleStatusChange: function(event) {
        console.log(event.target.value);
    },
    handleAssigneeChange: function(event) {
        console.log(event.target.value);
    },
    updateForm: function(event) {
        event.preventDefault();
        console.log("HI!");
    },
    render_content: function(event) {
        console.log(ticket);
        if (this.state.ticket == null) {
            return null;
        }
        var ticket = this.state.ticket;
        if(ticket.potential_assignees == null){
            return null;
        }
        var cb_mojo_ext = this.props.cb_mojo_ext;
        
        var related_data = this.state.ticket.related_data;
        var submitter_full_name = related_data.user.full_name;
        var submitter_picture_url = related_data.user.picture_url;
        
        var R = React.DOM;
        var form = R.form;
        var input = R.input;
        var div = R.div;
        var potential_assignees = ticket.potential_assignees;
        var assigned_to_id = ticket.assigned_to_id;
        var potential_assignees_fixed = Shared.convert_object(potential_assignees);
        var ticket_type = Shared.create_select("ticket_type", cb_mojo_ext.ticket_options, ticket.type_id, "Please select type",this.handleTypeChange);
        var ticket_status = Shared.create_select("ticket_status", cb_mojo_ext.status_options, ticket.status_id, "Please select status",this.handleStatusChange);
        var ticket_assignee = Shared.create_select("assigned_to_id", potential_assignees_fixed, ticket.assigned_to_id, "Please select Assignee",this.handleAssigneeChange);
        return form({
            className: "updateForm"
        }, ticket_type, ticket_status, ticket_assignee, input({
            type: "submit",
            value: "Update Ticket",
            onClick: this.updateForm
        }), div({
            className:"ticket_info",
            style: {
                backgroundImage: submitter_picture_url
            }
        }, "Submitted By " + submitter_full_name), div({
            className: "ticket_info"
        }, Shared.clean_message_body(ticket.description, cb_mojo_ext)));
    },
    handleMaximize: function(event) {
        console.log("GO GO MAXIMIZE");
        //$clone = $(this).clone();
        /*ReactDOM.render(React.createElement(Modal,{
            children:this.render_content(),
            show:true
        }),document.querySelector('[role="complementary"] .u5'));*/
        //$(ReactDOM.findDOMNode(this)).clone().appendTo("body");
    },
    render: function() {
        return React.createElement(Portlet, {
            disable_close: true,
            disable_maximize: true,
            title: "Update",
            draggable: false,
            minimized: false,
            handleMaximize: this.handleMaximize
        }, this.render_content());
    }
});