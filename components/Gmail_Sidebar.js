var Gmail_Sidebar = React.createClass({
  displayName: 'Gmail Sidebar',
  getInitialState: function() {
    return {
      ticket_description_minimized: true,
      ticket_update_minimized: false,
      ticket_messages_minimized: true,
      ticket_send_message_minimized: true,
      ticket_attachments_minimized: true,
      ticket: null
    }
  },
  handleUpdate: function() {
    API_Connector.get_ticket(this.props.cb_mojo_ext, this.getTicket);
  },
  componentDidMount: function() {
    this.handleUpdate();
    var ticket_timer = setInterval(() => {
      console.log("Getting Newest Ticket Info");
      this.handleUpdate();
    }, 180000);
    this.setState({
      ticket_timer: ticket_timer
    });
  },
  componentWillUnmount: function() {
    console.log("Unloading Ticket Timeout");
    clearInterval(this.state.ticket_timer);
  },
  getTicket: function(response) {
    var ticket = response.ticket;
    debug.info(ticket);
    this.setState({
      ticket: ticket
    });
  },
  handleMinimize: function(portlet_name) {
    var oldState = this.state;
    var available_portlets = ["update", "messages", "description", "attachments", "send_message"];
    var stateObject = function() {
      var one_not_minimized = true;
      returnObj = {};
      for (var i = 0; i < available_portlets.length; i++) {
        var state_name = "ticket_"+available_portlets[i]+"_minimized";
        var state_value = true;
        if(portlet_name == available_portlets[i]){
          state_value = !oldState[state_name];
        }
        returnObj[state_name] = state_value;
        if(state_value == false){
            one_not_minimized = false;
        }
      }
      //We want one always loaded and the update is the most popular
      if(one_not_minimized == true){
        returnObj["ticket_update_minimized"] = false;
      }
      return returnObj;
    }.bind(event)();
    this.setState(stateObject);
  },
  handleTicketUpdateMinimize: function(event) {
    this.handleMinimize("update");
  },
  handleTicketDescriptionMinimize: function(event) {
    this.handleMinimize("description");
  },
  handleMessagesMinimize: function(event) {
    this.handleMinimize("messages");
  },
  handleSendMessageMinimize: function(event) {
    this.handleMinimize("send_message");
  },
  handleAttachmentsMinimize: function(event, event1) {
    this.handleMinimize("attachments");
  },
  render: function() {
    var R = React.DOM;
    var div = R.div;
    var cb_mojo_ext = this.props.cb_mojo_ext;
    var portlets = [];
    if (cb_mojo_ext.access_key == "" || cb_mojo_ext.email_address == "") {
      portlets = React.createElement("a", {
        id: "load_error",
        href: cb_mojo_ext.optionsUrl
      }, "Please Configure and Refresh");
      console.log("Error Loading Mojo HelpDesk Extension by Collective Bias - Missing Options");
    } else if (this.state.ticket != null) {
      var submitter_full_name = this.state.ticket.related_data.user.full_name;
      var submitter_picture_url = this.state.ticket.related_data.user.picture_url;
      var user_info = Shared.create_user_info({
        user_id: this.state.ticket.user_id,
        updated_on: this.state.ticket.created_on,
        related_data: {
          user: {
            full_name: submitter_full_name,
            picture_url: submitter_picture_url
          }
        }
      })
      var ticket_update_form = React.createElement(Ticket_Update_Form, {
        cb_mojo_ext: cb_mojo_ext,
        ticket: this.state.ticket,
        key: "Ticket_Update_Form",
        handleUpdate: this.handleUpdate,
        handleMinimize: this.handleTicketUpdateMinimize,
        minimized: this.state.ticket_update_minimized
      });
      var ticket_description_form = React.createElement(Ticket_Description_Form, {
        cb_mojo_ext: cb_mojo_ext,
        ticket: this.state.ticket,
        key: "Ticket_Description_Form",
        handleMinimize: this.handleTicketDescriptionMinimize,
        minimized: this.state.ticket_description_minimized
      });
      var ticket_message_form = React.createElement(Ticket_Messages_Form, {
        cb_mojo_ext: cb_mojo_ext,
        ticket: this.state.ticket,
        key: "Ticket_Messages_Form",
        handleMinimize: this.handleMessagesMinimize,
        minimized: this.state.ticket_messages_minimized
      });
      var ticket_send_message_form = React.createElement(Ticket_Send_Message_Form, {
        cb_mojo_ext: cb_mojo_ext,
        ticket: this.state.ticket,
        key: "Ticket_Send_Message_Form",
        handleUpdate: this.handleUpdate,
        handleMinimize: this.handleSendMessageMinimize,
        minimized: this.state.ticket_send_message_minimized
      });
      var ticket_attachments_form = React.createElement(Ticket_Attachments_Form, {
        cb_mojo_ext: cb_mojo_ext,
        ticket: this.state.ticket,
        key: "Ticket_Attachments_Form",
        handleUpdate: this.handleUpdate,
        handleMinimize: this.handleAttachmentsMinimize,
        minimized: this.state.ticket_attachments_minimized
      });
      portlets.push(user_info);
      portlets.push(ticket_description_form);
      portlets.push(ticket_message_form);
      portlets.push(ticket_attachments_form);
      portlets.push(ticket_update_form);
      portlets.push(ticket_send_message_form);
    } else {
      //TODO LOADING Message
    }
    //This is done just in case there is an issue with the ticket being Loaded
    //The link can be used as a last resort.
    var open_ticket = null;
    if (cb_mojo_ext.ticket_id != "") {
      open_ticket = R.a({
        target: "_ticket",
        id: "launch_ticket",
        key: "launch_ticket",
        href: "https://" + this.props.cb_mojo_ext.mojo_domain + "/tech/#" + cb_mojo_ext.ticket_id
      }, "Open " + cb_mojo_ext.ticket_id + " in Mojo");
    }
    return div({
      className: "mojo_gmail_sidebar"
    }, div({
      className: "mojo_gmail_sidebar_title",
      key: "mojo_gmail_sidebar_title"
    }, "Mojo Help Desk"), open_ticket, portlets);
  }
});
