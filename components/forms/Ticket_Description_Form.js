var Ticket_Description_Form = React.createClass({
    displayName: 'Ticket_Description_Form',
    render_content: function(event) {
        if (this.props.ticket == null) {
            return null;
        }
        if (!this.props.ticket.hasOwnProperty("description")) {
            return null;
        }
        var R = React.DOM;
        var form = R.form;
        var input = R.input;
        var div = R.div;
        return form({
            className: "ticketDescForm"
        }, div({
            className: "ticket_info"
        }, Shared.clean_message_body(this.props.ticket.description, this.props.cb_mojo_ext)));
    },
    render: function() {
        var R = React.DOM;
        return React.createElement(Portlet, {
            key: "ticket_description_form",
            id: "ticket_description_form",
            disable_close: true,
            disable_maximize: false,
            title: "Description",
            draggable: false,
            minimized: this.props.minimized,
            handleMaximize: this.props.handleMaximize,
            handleMinimize: this.props.handleMinimize
        }, this.render_content());
    }
});
