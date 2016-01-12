/*
Original Concept came from 
https://github.com/tgdn/titlebar-react
Retooled to be self contained for minimize and maximized
*/
var Portlet = React.createClass({
    displayName: "Portlet",
    getDefaultProps: function() {
        return {
            draggable: false,
            title: "",
            closed: false,
            minimized: true,
            maximize: false,
            disable_maximize: false,
            disable_close: false,
            disable_minimize: false,
            handleMaximize: function(e) {
                console.log("maximize not implemented");
            }
        }
    },
    getInitialState: function() {
        var now = new Date();
        return {
            draggable: this.props.draggable,
            title: this.props.title,
            closed: this.props.closed,
            maximize: this.props.maximize,
            content: this.props.children,
            key: Math.random().toString(36).substring(7) + now.getTime()
        }
    },
    componentDidMount: function() {
        if (Modal && this.props.disable_maximize != true) {
            var newdiv = document.createElement('div');
            newdiv.setAttribute('id', this.getID() + "-dialog-holder");
            document.body.appendChild(newdiv);
        }
    },
    componentWillUnMount: function() {
        if (Modal && this.props.disable_maximize != true) {
            var child = document.getElementById(this.getID() + "-dialog-holder");
            document.body.removeChild(child);
        }
    },
    handleMaximize: function(e) {
        this.setState({
            maximized: (this.state.maximized) ? false : true
        });
        var that = this;
        if (Modal) {
            var holder_id = "#" + this.getID() + "-dialog-holder";
            var modal = React.createElement(Modal, {
                id: this.getID(),
                show: true,
                handleClose: function(event) {
                    /*This is a hack to make sure another modal can be spawned, for some reason React
                    is leaving a no script tag that keeps any Modals from firing again.
                    */
                    document.querySelector(holder_id).innerHTML = "";
                }
            }, React.createElement(Portlet, {
                disable_close: false,
                disable_minimize: true,
                disable_maximize: true,
                minimized: false,
                title: this.state.title,
                handleClose: function(event) {
                    //Yes I know how hacky this is, wanna fight about it?
                    //I couldn't figure out how to trigger a modal close from outsite.
                    jQuery('[data-modal="true"]').click();
                    //modal.props.handleClose(event);
                },
                draggable: false
            }, this.props.children));
            ReactDOM.render(modal, document.querySelector(holder_id));
        } else {
            console.log("Modal not included");
        }
        if (this.props.handleMaximize) {
            this.props.handleMaximize(e);
        }
    },
    handleMinimize: function(e) {
        /*this.setState({
            minimized: (this.state.minimized) ? false : true
        });*/
        this.props.minimized = (this.props.minimized) ? false : true;
        if (this.props.handleMinimize) {
            this.props.handleMinimize(e);
        }
    },
    handleClose: function(e) {
        this.setState({
            closed: (this.state.closed) ? false : true
        });
        console.log("got here");
        console.log(this.props);
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
                className: "titlebar-close",
                onDoubleClick: this.handleNop,
                onClick: this.handleClose,
                key: this.getID() + "-titlebar-close"
            }));
        }
        if (!this.props.disable_minimize == true) {
            controls.push(React.createElement("div", {
                onDoubleClick: this.handleNop,
                onClick: this.handleMinimize,
                className: "titlebar-minimize",
                key: this.getID() + "-titlebar-minimize"
            }));
        }
        if (!this.props.disable_maximize == true) {
            controls.push(React.createElement("div", {
                onDoubleClick: this.handleNop,
                onClick: this.handleMaximize,
                className: "titlebar-fullscreen",
                key: this.getID() + "-titlebar-fullscreen"
            }));
        }
        return React.createElement("div", {
            className: "titlebar-stoplight",
            key: this.getID() + "-titlebar-stoplight"
        }, controls);
    },
    render_titlebar: function() {
        var titlebar_classes = classNames('titlebar', {
            'mac-ver': this.props.is_mac
        });
        return React.createElement("div", {
            className: titlebar_classes,
            key: this.getID() + "-titlebar"
        }, React.createElement("div", {
            className: "titlebar-title",
            key: this.getID() + "-titlebar-title",
            onDoubleClick: this.handleNop,
            onClick: this.handleMinimize,
        }, this.props.title), this.render_controls());
    },
    getID: function() {
        return "portlet-" + this.state.key;
    },
    render: function() {
        var classes = classNames('portlet', this.props.id, {
            'webkit-draggable': this.state.draggable,
            "maximized": this.state.minimized
        });
        if (this.state.closed == false) {
            results = [];
            results.push(this.render_titlebar());
            if (this.props.minimized == false) {
                results.push(React.createElement("div", {
                    className: "portlet-content",
                    key: this.getID() + "-content"
                }, this.props.children));
            }
            return (React.createElement("div", {
                id: this.getID(),
                className: classes
            }, results))
        }
        return null;
    }
});