var Ticket_Update_Form = React.createClass({
    displayName: 'CommentBox',
    handleChange: function(event) {
        console.log(event.target.value);
    },
    updateForm: function(event) {
        event.preventDefault();
        console.log("HI!");
    },
    render_content: function(event) {
        var R = React.DOM;
        var form = R.form;
        var input = R.input;
        return content = form({
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
    },
    handleMaximize: function(event) {
        console.log("GO GO MAXIMIZE");
        //$clone = $(this).clone();
        /*ReactDOM.render(React.createElement(Modal,{
            children:this.render_content(),
            show:true
        }),document.querySelector('[role="complementary"] .u5'));*/
        //$(ReactDOM.findDOMNode(this)).clone().appendTo("body");
    },
    render: function() {
        return React.createElement(Portlet, {
            key:"fred",
            is_mac: true,
            disable_close: true,
            disable_maximize: false,
            title: "Update",
            draggable: false,
            minimized: false,
            content: this.render_content(),
            handleMaximize: this.handleMaximize
        });
    }
});