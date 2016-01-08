function Shared() {}
Shared.isEmpty = function(str) {
    return (!str || 0 === str.length);
};
Shared.merge_options = function(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
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
Shared.create_select = function(name, options, value, call_to_action, handleChange) {
    var R = React.DOM;
    var select = R.select;
    var option = R.option;
    var out_options = [];
    $.each(options, function(k, v) {
        out_options.push(option({
            value: k,
            key: k
        }, v));
    });
    return select({
        value: value,
        placeholder: call_to_action,
        onChange: handleChange
    }, out_options);
};
Shared.update_user = function(user_id, user_name, user_pic) {
    jQuery(".user_pic[data-user_id='" + user_id + "']").css("background-image", "url(" + user_pic + ")");
    jQuery(".user_info[data-user_id='" + user_id + "']").html(user_name);
    // jQuery(".is_private .user_info[data-user_id='" + user_id + "']").html(user_name + " (Private)");
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