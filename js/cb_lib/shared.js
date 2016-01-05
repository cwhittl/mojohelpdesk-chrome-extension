function Shared() {}
Shared.isEmpty = function(str) {
    return (!str || 0 === str.length);
};
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
Shared.clean_message_body = function(msg,mojo_domain) {
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