var Ticket_Messages_Form = React.createClass({
    displayName: 'Messages',
    getInitialState: function() {
        return {
            messages: ''
        };
    },
    componentDidMount: function() {
        API_Connector.get_messages(null, this.getMessages);
    },
    updateForm: function(event) {
        event.preventDefault();
        console.log("HI!");
    },
    getMessages: function(messages_list) {
        var mojo_domain = "collectivebias.mojohelpdesk.com";
        var R = React.DOM;
        var lis = [];
        var li = R.li;
        var div = R.div;
        var span = R.span;
        $.each(messages_list, function(k, v) {
            var comment = v.comment;
            console.log(comment);
            if (!Shared.isEmpty(comment.body)) {
                var user_id = comment.user_id;
                var is_private = ((comment.is_private == true) ? "is_private" : "is_public");
                //associated_users.push(user_id);
                //var message_date = Shared.getLocalTimeFromGMT(comment.created_on);
                var message_date = new Date(comment.created_on);
                lis.push(li({
                    key: k,
                    className: is_private
                }, div({
                    className: "message_header"
                }, span({
                    className: "user_pic",
                    "data-user_id": user_id
                }), span({
                    className: "user_info",
                    "data-user_id": user_id
                }), span({
                    className: "time_info"
                }, "On " + message_date.toLocaleString()), span({
                    dangerouslySetInnerHTML: {
                        __html: Shared.linkify(Shared.clean_message_body(comment.body, mojo_domain))
                    }
                }))));
            }
        });
        //console.log(lis);
        //console.log(this);
        this.setState({
            messages: lis
        });
    },
    render: function() {
        var R = React.DOM;
        var messages_elements = R.ul({
            className: "messages"
        }, this.state.messages);
        return React.createElement(Portlet, {
            is_mac: true,
            disable_close: true,
            title: "Messages",
            draggable: false,
            content: messages_elements
        });
    }
});