var Gmail_Sidebar = React.createClass({
    displayName: 'Gmail Sidebar',
    handleMinimize: function(event) {
        event.target.setState({
            minimized: true
        });
        console.log(event);
    },
    render: function() {
        console.log("add Sidebar");
        var R = React.DOM;
        var div = R.div;
        var cb_mojo_ext = this.props.cb_mojo_ext;
        var portlets = [];
        if (cb_mojo_ext.access_key == "" || cb_mojo_ext.email_address == "") {
            portlets = React.createElement("a", {
                id:"load_error",
                href: cb_mojo_ext.optionsUrl
            }, "Please Configure and Refresh");
            console.log("Error Loading Mojo HelpDesk Extension by Collective Bias - Missing Options");
        } else {
            portlets.push(React.createElement(Ticket_Update_Form, {
                cb_mojo_ext: cb_mojo_ext,
                key:"Ticket_Update_Form"
            }));
            portlets.push(React.createElement(Ticket_Messages_Form, {
                cb_mojo_ext: cb_mojo_ext,
                key:"Ticket_Messages_Form"
            }));
            portlets.push(React.createElement(Ticket_Private_Message_Form, {
                cb_mojo_ext: cb_mojo_ext,
                key:"Ticket_Private_Message_Form"
            }));
        }
        return div({
            className: "mojo_gmail_sidebar"
        }, div({
            className: "mojo_gmail_sidebar_title",
            key: "mojo_gmail_sidebar_title"
        }, "Mojo Help Desk"), portlets);
    }
});