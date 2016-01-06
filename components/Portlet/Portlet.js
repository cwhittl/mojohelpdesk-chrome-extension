var ALT = 18;
var Portlet = React.createClass({
    displayName: "Portlet",
    getDefaultProps: function() {
        var now = new Date();
        return {
            key: now.getTime(),
            altDown: false,
            draggable: false,
            title: "",
            closed: false,
            minimized: true,
            maximize: false,
            disable_maximize: false,
            disable_close: false,
            disable_minimize: false,
            content: null,
            handleMaximize: function(e) {
                console.log("maximize not implemented");
            }
        }
    },
    getInitialState: function() {
        return {
            altDown: false,
            draggable: this.props.draggable,
            title: this.props.title,
            closed: this.props.closed,
            minimized: this.props.minimized,
            maximize: this.props.maximize,
            content: this.props.content
        }
    },
    componentDidMount: function() {
        document.body.addEventListener('keydown', this.handleKeyDown);
        document.body.addEventListener('keyup', this.handleKeyUp);
        if(Modal){
            var newdiv = document.createElement('div');
            newdiv.setAttribute('id',this.get_key() + "-dialog-holder");
            document.body.appendChild(newdiv);
        }
    },
    componentWillUnMount: function() {
        document.body.removeEventListener('keydown', this.handleKeyDown);
        document.body.removeEventListener('keyup', this.handleKeyUp);
        if(Modal){
            var child = document.getElementById(this.get_key() + "-dialog-holder");
            document.body.removeChild(child);
        }
    },
    handleKeyDown: function(e) {
        if (e.keyCode === ALT) {
            this.setState({
                altDown: true
            });
        }
    },
    handleKeyUp: function(e) {
        if (e.keyCode === ALT) {
            this.setState({
                altDown: false
            });
        }
    },
    handleMaximize: function(e) {
        if (Modal) {
            ReactDOM.render(React.createElement(Modal, {
                children: this.state.content,
                show: true
            }), document.querySelector("#"+ this.get_key() + "-dialog-holder"));
        } else {
            console.log("Modal not included");
        }
        if (this.props.handleMaximize) {
            this.props.handleMaximize(e);
        }
        /*if (this.state.altDown) {
            // maximize
            this.props.handleMaximize(e);
        } else {
            this.props.handleFullScreen(e);
        }*/
    },
    handleMinimize: function(e) {
        this.setState({
            minimized: (this.state.minimized) ? false : true
        });
        if (this.props.handleMinimize) {
            this.props.handleMinimize(e);
        }
    },
    handleClose: function(e) {
        this.setState({
            closed: (this.state.closed) ? false : true
        });
        if (this.props.handleClose) {
            this.props.handleClose(e);
        }
    },
    // simply prevent event
    handleNop: function(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    render_controls: function() {
        var controls = [];
        if (!this.props.disable_close == true) {
            controls.push(React.createElement("div", {
                key: "titlebar-close",
                onDoubleClick: this.handleNop,
                onClick: this.handleClose,
                className: this.get_key() + "-titlebar-close"
            }));
        }
        if (!this.props.disable_minimize == true) {
            controls.push(React.createElement("div", {
                onDoubleClick: this.handleNop,
                onClick: this.handleMinimize,
                className: "titlebar-minimize",
                key: this.get_key() + "-titlebar-minimize"
            }));
        }
        if (!this.props.disable_maximize == true) {
            controls.push(React.createElement("div", {
                onDoubleClick: this.handleNop,
                onClick: this.handleMaximize,
                className: "titlebar-fullscreen",
                key: this.get_key() + "-titlebar-fullscreen"
            }));
        }
        return React.createElement("div", {
            className: "titlebar-stoplight",
            key: this.get_key() + "-titlebar-stoplight"
        }, controls);
    },
    render_titlebar: function() {
        var titlebar_classes = classNames('titlebar', {
            'mac-ver': this.props.is_mac
        });
        return React.createElement("div", {
            className: titlebar_classes,
            key: this.get_key() + "-titlebar"
        }, React.createElement("div", {
            className: "titlebar-title",
            key: this.get_key() + "-titlebar-title"
        }, this.state.title), this.render_controls());
    },
    get_key: function() {
        return "portlet-"+this.props.key;
    },
    render: function() {
        var classes = classNames('portlet', {
            'webkit-draggable': this.state.draggable,
            'alt': this.state.altDown,
            "maximized": this.state.minimized
        });
        if (this.state.closed == false) {
            results = [];
            results.push(this.render_titlebar());
            if (this.state.minimized == false) {
                results.push(React.createElement("div", {
                    className: "portlet-content",
                    key: this.get_key() + "-content"
                }, this.state.content));
            }
            return (React.createElement("div", {
                key: this.get_key(),
                className: classes
            }, results))
        }
        return null;
    }
});