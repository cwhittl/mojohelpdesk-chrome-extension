var Ticket_Messages_Form = React.createClass({
    displayName: 'CommentBox',
    getInitialState: function() {
        return {
            messages: ''
        };
    },
    componentDidMount: function() {
        API_Connector.get_messages(this);
    },
    updateForm: function(event) {
        event.preventDefault();
        console.log("HI!");
    },
    render: function() {
        var R = React.DOM;
        var form = R.form;
        var input = R.input;
        return R.ul({
            className: "messages"
        }, this.state.messages);
        /*return form({
            className: "commentForm"
        }, input({
            type: "text",
            placeholder: "Your name",
            onChange: this.handleChange
        }), input({
            type: "text",
            placeholder: "Say something..."
        }), input({
            type: "submit",
            value: "Post",
            onClick: this.updateForm
        }));*/
    }
});