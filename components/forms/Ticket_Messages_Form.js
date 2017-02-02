var Ticket_Messages_Form = React.createClass({
    displayName: 'Messages',
    render_content: function() {
        var messages_list = this.props.ticket.all_comments;
        var R = React.DOM;
        var message_count = 0
        if (!Shared.isEmpty(messages_list) && messages_list.length > 0) {
            //We want latest first
            var sorted_messages_list = Shared.reverse(messages_list);
            var cb_mojo_ext = this.props.cb_mojo_ext;
            var mojo_domain = cb_mojo_ext.mojo_domain;
            var x = 0;
            message_count = sorted_messages_list.length;
            var message_html = R.ul({
                className: "ticket_messages"
            }, sorted_messages_list.map(function(comment) {
                if (Shared.isEmpty(comment.body)) {
                    return null;
                }
                x++;
                var classes = classNames('titlebar', {
                    'is_private': comment.is_private,
                    "alt": x % 2 === 0
                });
                return R.li({
                    className: classes,
                    key: x
                }, Shared.create_user_info(comment), R.span({
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
        return message_html;
    },

    render: function() {
        if (this.props.ticket == null) {
            return null;
        }
        return React.createElement(Portlet, {
            disable_close: true,
            disable_maximize: false,
            title: "Messages (" + this.props.ticket.all_comments.length + ")",
            id: "ticket_messages_form",
            draggable: false,
            minimized: this.props.minimized,
            handleMaximize: this.props.handleMaximize,
            handleMinimize: this.props.handleMinimize
        }, this.render_content());
    }
});
