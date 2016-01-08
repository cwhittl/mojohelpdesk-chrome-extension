var Ticket_Description_Form = React.createClass({
    displayName: 'CommentBox',
    render: function() {
        var R = React.DOM;
        var div = R.div;
        var content = form({
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
        }));
        return React.createElement(Portlet, {
            disable_close: true,
            key: 111,
            title: "Messages",
            draggable: false
        },content);
    }
});