var Ticket_Attachments_Form = React.createClass({
  displayName: 'Ticket_Attachments_Form',
  render_content: function(event) {
    var cb_mojo_ext = this.props.cb_mojo_ext;
    var R = React.DOM;
    var form = R.form;
    var input = R.input;
    var div = R.div;
    var attachments_array = this.props.ticket.attachments;
    var attachments_list = R.div({}, "Nothing currently attached");
    if (attachments_array.length > 0) {
      attachments_list = attachments_array.map(function(attachment) {
        var link = R.a({
          href: API_Connector.get_attachment_url(attachment.id)
        }, attachment.filename);
        switch (attachment.content_type) {
          case "image/png":
          case "image/jpeg":
          case "image/jpg":
          case "image/gif":
            var holder_id = "#" + attachment.id + "-attachment-dialog-holder";
            if (document.getElementById(holder_id) == null) {
              var newdiv = document.createElement('div');
              newdiv.setAttribute('id', holder_id);
              document.body.appendChild(newdiv);
            }
            return R.div({
              key: attachment.id,
              className: "attachment-image"
            }, link, R.div({}, R.object({
              data: API_Connector.get_attachment_url(attachment.id),
              type: attachment.content_type,
              onClick: function() {
                var modal = React.createElement(Modal, {
                  id: attachment.id,
                  show: true,
                  containerStyle: {
                    width: "800px"
                  },
                  handleClose: function(event) {
                    /*This is a hack to make sure another modal can be spawned, for some reason React
                    is leaving a no script tag that keeps any Modals from firing again.
                    */
                    document.getElementById(holder_id).innerHTML = "";
                  }
                }, R.object({
                  className: "modal_image",
                  data: API_Connector.get_attachment_url(attachment.id),
                  type: attachment.content_type
                }));
                ReactDOM.render(modal, document.getElementById(holder_id));
              }
            })));
            break;
          default:
            return R.div({
              className: "attachment-document",
              key: attachment.id
            }, link, R.div({}));
        }
      })
    }
    var attachment_html = R.div({
      className: "ticket_attachments"
    }, attachments_list);
    return attachment_html;
  },
  render: function() {
    if (this.props.ticket == null) {
      return null;
    }
    /*if (!this.props.ticket.hasOwnProperty("attachments") && this.props.ticket.attachments.length == 0) {
      return null;
    }*/
    var R = React.DOM;
    return React.createElement(Portlet, {
      key: "ticket_attachments_form",
      id: "ticket_attachments_form",
      disable_close: true,
      disable_maximize: true,
      title: "Attachments (" + this.props.ticket.attachments.length + ")",
      draggable: false,
      minimized: this.props.minimized,
      handleMaximize: this.props.handleMaximize,
      handleMinimize: this.props.handleMinimize
    }, this.render_content());
  }
});
