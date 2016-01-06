var Ticket_Private_Message_Form = React.createClass({
    displayName: 'Private Message Form',
    getInitialState: function() {
        return {
            message: ''
        };
    },
    handleChange: function(event) {
        this.setState({
            message: event.target.value
        });
    },
    updateForm: function(event) {
        event.preventDefault();
        //console.log(this.props);
        //console.log(this.state.message);
    },
    render: function() {
        var R = React.DOM;
        var form = R.form;
        var textarea = R.textarea;
        var button = R.button;
        return form({
            className: "privateMessageForm"
        }, textarea({
            name: "message",
            value: this.state.message,
            placeholder: "Private Message",
            onChange: this.handleChange
        }), button({
            type: "button",
            onClick: this.updateForm
        }, "Send Message"));
    }
});