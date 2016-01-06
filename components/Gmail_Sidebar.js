var Gmail_Sidebar = React.createClass({
    displayName: 'Gmail Sidebar',
    render: function() {
        var R = React.DOM;
        var div = R.div;
        return div({
            className: "mojo_gmail_sidebar"
        }, React.createElement(Ticket_Update_Form), React.createElement(Ticket_Private_Message_Form,{fred:"fred1"}));
    }
});