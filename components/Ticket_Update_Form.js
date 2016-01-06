var Ticket_Update_Form = React.createClass({
    displayName: 'CommentBox',
    handleChange: function(event) {
        console.log(event.target.value);
    },
    updateForm: function(event) {
        event.preventDefault();
        console.log("HI!");
    },
    render: function() {
        var R = React.DOM;
        var form = R.form;
        var input = R.input;
        return form({
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
    }
});