var Modal = React.createClass({
    displayName: "Modal",
    getDefaultProps: function() {
        return {
            show: false
        }
    },
    getInitialState: function() {
        return {
            opacity: 0,
            display: "block",
            visibility: "hidden",
            show: this.props.show
        }
    },
    getInitialStyles: function() {
        var styles = {};
        styles.modal = {
            position: 'fixed',
            fontFamily: 'Arial, Helvetica, sans-serif',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 99999,
            transition: 'opacity 1s ease-in',
            pointerEvents: 'auto',
            overflowY: 'auto'
        }
        styles.container = {
            width: '400px',
            position: 'relative',
            margin: '10% auto',
            padding: '5px 20px 13px 20px',
            background: '#fff'
        }
        styles.close = {
            background: '#606061',
            color: '#FFFFFF',
            lineHeight: '25px',
            position: 'absolute',
            right: '-12px',
            textAlign: 'center',
            top: '-10px',
            width: '24px',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderRadius: '12px',
            boxShadow: '1px 1px 3px #000',
            cursor: 'pointer'
        }
        return styles;
    },
    /*constructor(props) {
        super()
        this.hideOnOuterClick = this.hideOnOuterClick.bind(this)
        this.fadeIn = this.fadeIn.bind(this)
        this.fadeOut = this.fadeOut.bind(this)
        let opacity = 0,
            display = 'block',
            visibility = 'hidden';
        if (props.show) {
            opacity = 1;
            display = 'block';
            visibility = 'visible'
        }
        this.state = {
            opacity,
            display,
            visibility,
            show: props.show
        };
    }*/
    hideOnOuterClick: function(event) {
        if (this.props.closeOnOuterClick === false) return
        if (event.target.dataset.modal) {
            this.fadeOut();
            if (this.props.onClose) {
                this.props.onClose(event);
            }
        }
        //this.props.onClose(event)
    },
    componentWillReceiveProps: function(props) {
        if (this.props.show != props.show) {
            if (this.props.transitionSpeed) {
                if (props.show == true) this.fadeIn()
                else this.fadeOut()
            } else this.setState({
                show: props.show
            })
        }
    },
    fadeIn: function() {
        this.setState({
            display: 'block',
            visibility: 'visible',
            show: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    opacity: 1
                })
            }, 10)
        })
    },
    fadeOut: function() {
        this.setState({
            opacity: 0
        }, () => {
            setTimeout(() => {
                this.setState({
                    show: false
                });
                if(this.props.handleClose){
                    this.props.handleClose();
                }
            }, this.props.transitionSpeed)
        })
    },
    render: function() {
        if (!this.state.show) return null
        var modalStyle;
        var containerStyle;
        //completely overwrite if they use a class
        if (this.props.className) {
            modalStyle = this.props.style
            containerStyle = this.props.containerStyle
        } else {
            modalStyle = Object.assign({}, this.getInitialStyles().modal, this.props.style)
            containerStyle = Object.assign({}, this.getInitialStyles().container, this.props.containerStyle)
        }
        if (this.props.transitionSpeed) modalStyle = Object.assign({}, this.state, modalStyle)
        var R = React.DOM;
        var div = R.div;
        return (div({
            style: modalStyle,
            onClick: this.hideOnOuterClick,
            "data-modal": true
        }, div({
            className: this.props.containerClassName,
            style: containerStyle
        }, this.props.children)))
    }
});