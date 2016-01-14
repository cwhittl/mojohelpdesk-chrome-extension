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
        /*var message_timer = setInterval(() => {
            console.log("Getting Newest Messages");
            API_Connector.get_messages(this.props.cb_mojo_ext, this.getMessages);
        }, 30000);
        this.setState({
            message_timer: message_timer
        })*/
    },
    componentWillUnmount:function() {
        console.log("This is not firing");
        console.log(this.state.message_timer);
        clearInterval(this.state.message_timer);
    },
    getMessages: function(messages_list) {
        //console.log(this.isMounted());
        //console.log(this);
        var R = React.DOM;
        var message_count = 0
        if (!Shared.isEmpty(messages_list) && messages_list.length > 0) {
            messages_list = messages_list.reverse();
            var cb_mojo_ext = this.props.cb_mojo_ext;
            var mojo_domain = cb_mojo_ext.mojo_domain;
            var associated_users = [];
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
                var message_date = new Date(comment.created_on);
                x++
                var classes = classNames('titlebar', {
                    'is_private': comment.is_private,
                    "alt": x % 2 === 0
                });
                return R.li({
                    className: classes,
                    key: x
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
        } else {
            var message_html = R.ul({
                className: "ticket_messages"
            }, R.div({
                className: "message_header"
            }, R.li({}, "O-nay Essages-may")));
        }
        this.setState({
            title: "Messages (" + message_count + ")",
            messages: message_html,
            associated_users: associated_users
        });
    },
    getUserInfo: function() {
        if (typeof this.state.associated_users != "undefined") {
            this.state.associated_users.map(function(user_id) {
                if (user_id != 0) {
                    API_Connector.get_user(user_id, cb_mojo_ext, function(user_obj) {
                        var user = user_obj.user;
                        Shared.update_user(user.id, user.related_data.full_name, user.picture_url);
                    });
                }
            });
        }
    },
    handleMaximize: function() {
        this.getUserInfo();
        if (this.props.handleMaximize) {
            this.props.handleMaximize(event);
        }
    },
    handleMinimize: function(event) {
        this.getUserInfo();
        if (this.props.handleMinimize) {
            this.props.handleMinimize(event);
        }
    },
    render: function() {
        if (this.state.messages == "") {
            return null;
        }
        return React.createElement(Portlet, {
            disable_close: true,
            disable_maximize: false,
            title: this.state.title,
            draggable: false,
            minimized: this.props.minimized,
            handleMaximize: this.handleMaximize,
            handleMinimize: this.handleMinimize
        }, this.state.messages);
    }
});