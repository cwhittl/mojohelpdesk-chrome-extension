function API_Connector() {}
API_Connector.get_messages = function(react_this,cb_mojo_ext) {
    var mojo_domain = "collectivebias.mojohelpdesk.com";
    $.getJSON("https://mysupport.mojohelpdesk.com/api/tickets/11720081/comments.json?access_key=ab0f5fd27c0d2a5af3e33b902e1c239ac01b8616", function(result) {
        //console.log(result);
        //var ticket = result.ticket;
        var R = React.DOM;
        var lis = [];
        $.each(result, function(k, v) {
            var comment = v.comment;
            //console.log(comment);
            if (!Shared.isEmpty(comment.body)) {
                var user_id = comment.user_id;
                var is_private = ((comment.is_private == true) ? "is_private" : "is_public");
                //associated_users.push(user_id);
                //var message_date = Shared.getLocalTimeFromGMT(comment.created_on);
                var message_date = new Date(comment.created_on);
                //messages_html = "<li class='" + is_private + "'><div class='message_header'><span class='user_pic' data-email='" + user_id + "'></span><span class='user_info' data-email='" + user_id + "'></span><span class='time_info'>On " + message_date.toLocaleString() + "</span></div>" + Shared.linkify(Shared.clean_message_body(comment.body, mojo_domain)) + "</li>" + messages_html;
                lis.push(R.li({
                    key: k,
                    className: is_private
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
                }, "On " + message_date.toLocaleString()), R.span({
                    dangerouslySetInnerHTML: {
                        __html: Shared.linkify(Shared.clean_message_body(comment.body, mojo_domain))
                    }
                }))));
            }
        });
        console.log(lis);
        react_this.setState({
            messages: lis
        });
    }.bind(react_this));
}