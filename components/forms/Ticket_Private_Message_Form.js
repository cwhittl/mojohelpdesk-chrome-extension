var Ticket_Private_Message_Form = React.createClass({
    displayName: 'Private Message Form',
    getInitialState: function() {
        return {
            message: ''
        };
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
        this.setState({
            message: event.target.value
        });
    },
    updateForm: function(event) {
        event.preventDefault();
        console.log("Update Private Message");
        API_Connector.send_private_message(this, this.props.cb_mojo_ext, this.onSent);
    },
    onSent: function() {
        this.setState({
            message: ""
        });
    },
    render: function() {
        var R = React.DOM;
        var form = R.form;
        var textarea = R.textarea;
        var button = R.button;
        var content = form({
            className: "privateMessageForm"
        }, R.span({
            className: this.state.status_type,
            id: "update_ticket_status_message",
            key: "status"
        }, this.state.status_message), textarea({
            id: "private_message",
            value: this.state.message,
            placeholder: "Private Message",
            onChange: this.handleChange
        }), button({
            type: "button",
            onClick: this.updateForm
        }, "Send Message"));
        return React.createElement(Portlet, {
            title: "Send PM",
            disable_close: true,
            disable_maximize: true,
            draggable: false,
            minimized: this.props.minimized,
            handleMaximize: this.handleMaximize,
            handleMinimize: this.handleMinimize
        }, content);
    }
});