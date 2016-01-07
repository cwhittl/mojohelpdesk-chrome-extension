var Gmail_Sidebar = React.createClass({
    displayName: 'Gmail Sidebar',
    render: function() {
        var R = React.DOM;
        var div = R.div;

        var cb_mojo_ext = this.props.cb_mojo_ext;
        return div({
            className: "mojo_gmail_sidebar"
        }, div({
            className: "mojo_gmail_sidebar_title"
        }, "Mojo Help Desk"), React.createElement(Ticket_Update_Form, {
            cb_mojo_ext: cb_mojo_ext
        }), React.createElement(Ticket_Messages_Form, {
            cb_mojo_ext: cb_mojo_ext
        }), React.createElement(Ticket_Private_Message_Form, {
            cb_mojo_ext: cb_mojo_ext
        }));
    }
});