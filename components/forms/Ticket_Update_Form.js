var Ticket_Update_Form = React.createClass({
  displayName: 'Ticket_Update_Form',
  getInitialState: function() {
    return {
      ticket_id: null,
      potential_assignees: null
    };
  },
  componentDidMount: function() {
    var ticket = this.props.ticket;
    var potential_assignees = Shared.get_potential_assignees(ticket.potential_assignees);
    this.setState({
      ticket: this.props.ticket,
      ticket_description: ticket.description,
      ticket_id: ticket.id,
      due_on: Shared.convertToFormattedDate(ticket.due_on),
      scheduled_on: Shared.convertToFormattedDate(ticket.scheduled_on),
      ticket_type_id: ticket.ticket_type_id,
      status_id: ticket.status_id,
      queue_id: ticket.related_data.queue.id,
      potential_assignees: potential_assignees,
      assigned_to_id: ticket.assigned_to_id,
      ticket_priority_id: ticket.priority_id
    }, function() {
      Shared.set_custom_fields_state(this.props.cb_mojo_ext, this);
    }.bind(this));
    //Custom Fields
    /*var that = this;
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
    });*/

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
    API_Connector.send_form(this, this.props.cb_mojo_ext);
    if (this.props.handleUpdate) {
      this.props.handleUpdate();
    }
  },
  render_content: function(event) {
    var cb_mojo_ext = this.props.cb_mojo_ext;
    var R = React.DOM;
    var form = R.form;
    var input = R.input;
    var div = R.div;
    var potential_assignees = this.state.potential_assignees;
    var ticket_type = Shared.createFieldSet({
      label_text: "Type",
      id: "ticket_type_id",
    }, Shared.create_select("ticket_type_id", cb_mojo_ext.ticket_options, this.state.ticket_type_id, "Select type", this.handleChange));
    var ticket_status = Shared.createFieldSet({
      label_text: "Status",
      id: "status_id",
    }, Shared.create_select("status_id", cb_mojo_ext.status_options, this.state.status_id, "Select status", this.handleChange));
    var ticket_priority = Shared.createFieldSet({
      label_text: "Priority",
      id: "ticket_priority_id",
    }, Shared.create_select("ticket_priority_id", cb_mojo_ext.priority_options, this.state.ticket_priority_id, "Select priority", this.handleChange));
    var ticket_queue = Shared.createFieldSet({
      label_text: "Queue",
      id: "queue_id",
    }, Shared.create_select("queue_id", cb_mojo_ext.queues, this.state.queue_id, "Select queue", this.handleChange));
    var assigned_to_me = R.a({
      href: "#",
      key: "assigned_to_me",
      id: "assigned_to_me",
      onClick: this.assignToMe
    }, "Me");
    var ticket_assignee = Shared.createFieldSet({
      label_text: "Assignee",
      id: "assigned_to_id",
      labelChild: assigned_to_me
    }, Shared.create_select("assigned_to_id", potential_assignees, this.state.assigned_to_id, "Select Assignee", this.handleChange));
    var ticket_due_on = Shared.createFieldSet({
      label_text: "Due On",
      id: "due_on_fs",
    }, Shared.create_input("due_on", "date", this.state.due_on, this.handleChange, ""));
    var ticket_scheduled_on = Shared.createFieldSet({
      label_text: "Scheduled On",
      id: "scheduled_on_fs",
    }, Shared.create_input("scheduled_on", "date", this.state.scheduled_on, this.handleChange, ""));
    var controls = [];
    controls.push(ticket_status);
    controls.push(ticket_priority);
    controls.push(ticket_due_on);
    controls.push(ticket_scheduled_on);
    controls.push(ticket_type);
    controls.push(ticket_queue);
    controls.push(ticket_assignee);
    var custom_controls = Shared.create_custom_fields(this.props.ticket, this.props.cb_mojo_ext, this.state, this.handleChange);
    //var custom_controls = Shared.create_custom_fields(this.props.cb_mojo_ext, this, this.handleChange);
    controls.push(custom_controls);
    return R.div({},form({
      className: "ticketUpdateForm"
    }, R.span({
      className: this.state.status_type,
      id: "update_ticket_status_message",
      key: "status"
    }, this.state.status_message), controls), input({
      type: "submit",
      className: "update_ticket",
      value: "Update Ticket",
      onClick: this.updateForm
    }));
  },
  render: function() {
    if (this.props.ticket == null || this.state.ticket_id == null || this.state.potential_assignees == null) {
      return null;
    }
    debug.info(this.state);
    var R = React.DOM;
    return React.createElement(Portlet, {
      key: "ticket_update_form",
      id: "ticket_update_form",
      disable_close: true,
      disable_maximize: true,
      title: "Update",
      draggable: false,
      minimized: this.props.minimized,
      handleMaximize: this.props.handleMaximize,
      handleMinimize: this.props.handleMinimize
    }, this.render_content());
  }
});
