var Ticket_Messages_Form = React.createClass({
    displayName: 'Messages',
    getInitialState: function() {
        return {
            message_count: 0,
            messages: "",
            associated_users: []
        };
    },
    componentDidMount: function() {
        API_Connector.get_messages(this.props.cb_mojo_ext, this.getMessages);
        setInterval(() => {
            console.log("Getting Newest Messages");
            API_Connector.get_messages(this.props.cb_mojo_ext, this.getMessages);
        }, 60000);
    },
    getMessages: function(messages_list) {
        console.log("messages");
        messages_list = messages_list.reverse();
        var cb_mojo_ext = this.props.cb_mojo_ext;
        var mojo_domain = cb_mojo_ext.mojo_domain;
        var R = React.DOM;
        var associated_users = [];
        var message_count = 0
        if (Shared.isEmpty(messages_list)) {
            var message_html = R.ul({
                className: "ticket_messages"
            }, R.div({
                className: "message_header"
            }, R.li({}, "O-nay Essages-may")));
        } else {
            var x = 0;
            message_count = messages_list.length;
            var message_html = R.ul({
                className: "ticket_messages"
            }, messages_list.map(function(comment_obj) {
                var comment = comment_obj.comment;
                if (Shared.isEmpty(comment.body)) {
                    return null;
                }
                var user_id = comment.user_id;
                associated_users.push(user_id);
                var is_private = ((comment.is_private == true) ? "is_private" : "is_public");
                var message_date = new Date(comment.created_on);
                return R.li({
                    className: is_private,
                    key: x++
                }, R.div({
                    className: "message_header"
                }, R.span({
                    className: "user_pic",
                    "data-user_id": user_id
                }), R.span({
                    className: "user_info",
                    "data-user_id": user_id
                }), R.span({
                    className: "time_info"
                }, "On " + message_date.toLocaleString())), R.span({
                    dangerouslySetInnerHTML: {
                        __html: Shared.linkify(Shared.clean_message_body(comment.body, mojo_domain))
                    }
                }));
            }));
        }
        this.setState({
            title: "Messages (" + message_count + ")",
            messages: message_html,
            associated_users: associated_users
        });
    },
    getUserInfo: function() {
        this.state.associated_users.map(function(user_id) {
            if (user_id != 0) {
                API_Connector.get_user(user_id, cb_mojo_ext, function(user_obj) {
                    var user = user_obj.user;
                    Shared.update_user(user.id, user.first_name + " " + user.last_name, user.picture_url);
                });
            }
        });
    },
    handleMaximize: function() {
        this.getUserInfo();
    },
    handleMinimize: function() {
        this.getUserInfo();
    },
    render: function() {
        console.log(this.state.title);
        if (this.state.messages == "") {
            return null;
        }
        return React.createElement(Portlet, {
            disable_close: true,
            disable_maximize: false,
            title: this.state.title,
            draggable: false,
            minimized: true,
            handleMaximize: this.handleMaximize,
            handleMinimize: this.handleMinimize
        }, this.state.messages);
    }
});