function Shared() {}
Shared.isObject = function(val) {
    if (val === null) {
        return false;
    }
    return ((typeof val === 'function') || (typeof val === 'object'));
};
Shared.isEmpty = function(str) {
    if (str == null) {
        return true;
    }
    return (!str || 0 === str.length);
};
Shared.isValidDomain = function(val) {
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(val)) {
        return true;
    }
    return false;
}
Shared.merge_options = function(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
}
Shared.unique = function(array) {
    return array.filter(function(el, index, arr) {
        return index === arr.indexOf(el);
    });
}
Shared.linkify = function(text) {
    // http://, https://, ftp://
    var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
    // www. sans http:// or https://
    var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    // Email addresses
    var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
    return text.replace(urlPattern, '<a href="$&">$&</a>').replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>').replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
};
Shared.getLocalTimeFromGMT = function(sTime) {
    var mydate = new Date(sTime);
    mydate.setTime(mydate.getTime() + mydate.getTimezoneOffset() * 60 * 1000);
    return mydate
}
Shared.convert_object = function(mojo_object, debug_mode) {
    if (debug_mode == true) {
        console.log(mojo_object);
    }
    var return_obj = {};
    $.each(mojo_object, function() {
        return_obj[this.id] = this.name;
    });
    if (debug_mode == true) {
        console.log(return_obj);
    }
    return return_obj;
};
Shared.byTextCaseInsensitive = function(a, b) {
    var ta = a.text.toUpperCase(),
        tb = b.text.toUpperCase();
    return ta === tb ? 0 : ta < tb ? -1 : 1;
};
Shared.createMoreInfo = function(props) {
    var R = React.DOM;
    return R.img({
        className: "more_info",
        src: "../../images/icons/info.png",
        onClick: props.onHelp.bind(this, {
            help_image: props.help_image,
            help_text: props.help_text
        })
    });
};
Shared.createFieldSet = function(props, children) {
    var R = React.DOM;
    return R.fieldset({
        className: "form-group",
        key: "group-" + props.id,
        id: "group-" + props.id
    }, R.label({
        key: "label-" + props.id,
        id: "label-" + props.id
    }, props.label_text, props.labelChild), children);
};
Shared.createMessage = function(props, react_element, timeBeforeClear) {
    if (typeof timeBeforeClear == "undefined" || timeBeforeClear < 100) {
        timeBeforeClear = 3000;
    }
    react_element.setState({
        status_type: props.type,
        status_message: props.message
    }, function() {
        setTimeout(function() {
            react_element.setState({
                status_type: "",
                status_message: ""
            });
        }, timeBeforeClear);
    });
};
Shared.create_custom_fields = function(cb_mojo_ext, react_element, changeHandler) {
    var controls = []
    var state = react_element.state;
    $.each(cb_mojo_ext.custom_fields_json, function(fieldName, fieldInfo) {
        var value = "";
        if (state.hasOwnProperty(fieldName)) {
            value = state[fieldName];
        }
        switch (fieldInfo.field_type) {
            case "select":
                var options = fieldInfo["options"];
                if (fieldInfo.hasOwnProperty("dependent_to")) {
                    options = fieldInfo.options[state[fieldInfo.dependent_to]];
                }
                if (options != null && typeof options != "undefined") {
                    controls.push(Shared.createFieldSet({
                        label_text: fieldInfo.pretty_name,
                        id: fieldName,
                    }, Shared.create_select(fieldName, options, value, "Please select " + fieldInfo.pretty_name, changeHandler)));
                }
                break;
            case "input":
                //custom_html = custom_html + "<tr><td>" + fieldInfo.pretty_name + "</td><td><input type='text' id='" + fieldName + "' name='" + fieldName + "' value='" + value + "' placeholder='Please Enter " + fieldInfo.pretty_name + "' class='" + cb_mojo_ext.custom_class + "' /></td></tr>";
                break;
        }
    });
    return controls;
};
Shared.create_user_info = function(props) {
    var R = React.DOM;
    return R.div({
        className: "message_header"
    }, R.span({
        className: "user_pic",
        style: {
            backgroundImage: "url(" + props.user_picture + ")"
        },
        "data-user_id": props.user_id
    }), R.span({
        className: "user_info",
        "data-user_id": props.user_id
    }, props.user_name), R.span({
        className: "time_info"
    }, "On " + props.timestamp));
};
Shared.create_select = function(name, options, value, call_to_action, handleChange) {
    var R = React.DOM;
    var select = R.select;
    var option = R.option;
    var out_options = new Array(option({
        value: "",
        key: ""
    }, call_to_action));
    $.each(options, function(k, v) {
        var value = v.value;
        var key = v.key;
        out_options.push(option({
            value: key,
            key: key,
        }, value));
    });
    var color = "white";
    if (Shared.isEmpty(value)) {
        color = "red"
    }
    var style = {
        backgroundColor: color
    }
    return select({
        value: value,
        id: name,
        key: name,
        style: style,
        onChange: handleChange
    }, out_options);
};
Shared.update_user = function(user_id, user_name, user_pic) {
    jQuery(".user_pic[data-user_id='" + user_id + "']").css("background-image", "url(" + user_pic + ")");
    jQuery(".user_info[data-user_id='" + user_id + "']").html(user_name);
};
Shared.clean_message_body = function(msg, mojo_domain) {
    if (msg == null) {
        return;
    }
    var new_msg = msg;
    new_msg = new_msg.replace(/Automation /g, "");
    new_msg = new_msg.replace(/--My Issue--\nDescription:/g, "");
    new_msg = new_msg.replace(/Original Message:/g, "");
    if (new_msg.indexOf("Disclaimer The information contained") > -1) {
        new_msg = new_msg.substring(0, new_msg.indexOf("Disclaimer The information contained"));
    }
    if (new_msg.indexOf("\n\n\n") > -1) {
        new_msg = new_msg.substring(0, new_msg.indexOf("\n\n\n"));
    }
    if (new_msg.indexOf(mojo_domain) > -1) {
        new_msg = new_msg.substring(0, new_msg.indexOf(mojo_domain) - 34);
    }
    /*if (new_msg.indexOf("@collectivebias") > -1) {
        new_msg = new_msg.substring(0, new_msg.indexOf("@collectivebias") - 40);
    }*/
    return new_msg;
};