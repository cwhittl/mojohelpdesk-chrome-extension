function Shared() {}
Shared.reverse = function(a) {
  var b = [],
    counter = 0;
  for (var i = a.length - 1; i >= 0; i -= 1) {
    b[counter] = a[i];
    counter += 1;
  }
  return b;
};
Shared.setDebug = function(isDebug) {
  if (isDebug) {
    window.debug = {
      log: window.console.log.bind(window.console, '%s: '),
      error: window.console.error.bind(window.console, 'error: '),
      info: window.console.info.bind(window.console, 'info: '),
      warn: window.console.warn.bind(window.console, 'warn: ')
    };
  } else {
    var __no_op = function() {};
    window.debug = {
      log: __no_op,
      error: __no_op,
      warn: __no_op,
      info: __no_op
    }
  }
};
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
Shared.convertToFormattedDate = function(inDate) {
  if (inDate != null && inDate != "") {
    if (inDate instanceof Date) {
      date_obj = inDate;
    } else {
      date_obj = new Date(inDate);
    }
    var year = date_obj.getFullYear(),
      month = date_obj.getMonth() + 1,
      day = date_obj.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  } else {
    return inDate;
  }
};
Shared.convert_object = function(mojo_object) {
  debug.info(mojo_object);
  var return_obj = {};
  $.each(mojo_object, function() {
    return_obj[this.id] = this.name;
  });
  debug.info(return_obj);
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
Shared.get_potential_assignees = function(potential_assignees) {
  var potential_assignees_sorted = [];
  $.each(potential_assignees, function(k, v) {
    potential_assignees_sorted.push({
      key: v.id,
      value: v.name
    });
  });
  potential_assignees_sorted.sort(function(a, b) {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  });
  return potential_assignees_sorted;
}
Shared.create_custom_fields_OLD = function(cb_mojo_ext, react_element, changeHandler) {
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
        if (fieldInfo.hasOwnProperty("dependent_field_name")) {
          options = fieldInfo.options[state[fieldInfo.dependent_field_name]];
        }
        if (options != null && typeof options != "undefined") {
          controls.push(Shared.createFieldSet({
            label_text: fieldInfo.pretty_name,
            id: fieldName,
          }, Shared.create_select(fieldName, options, value, "Select " + fieldInfo.pretty_name, changeHandler)));
        }
        break;
      case "input":
        //custom_html = custom_html + "<tr><td>" + fieldInfo.pretty_name + "</td><td><input type='text' id='" + fieldName + "' name='" + fieldName + "' value='" + value + "' placeholder='Please Enter " + fieldInfo.pretty_name + "' class='" + cb_mojo_ext.custom_class + "' /></td></tr>";
        break;
    }
  });
  return controls;
};
Shared.getObjectFromJSON = function(name, json_obj) {
  var return_me = null;
  $.each(json_obj, function(fieldName, fieldInfo) {
    var key = Object.keys(fieldInfo)[0];
    if (key == name) {
      return_me = fieldInfo[key];
    }
  });
  return return_me;
};
Shared.get_custom_fields_xml = function(cb_mojo_ext, state) {
  var ticket = state.ticket;
  var custom_field_attributes = ticket.related_data.field_attributes;
  var XML = "";
  custom_field_attributes.map(function(custom_field) {
    var rObj = {};
    var custfield_extended = Shared.getObjectFromJSON(custom_field.name, cb_mojo_ext.custom_fields_json);
    //If it's dependent on something and that's not right we want to clear it out.
    if (custfield_extended != null) {
      if (custfield_extended.hasOwnProperty("dependent_field_value") && (custfield_extended.dependent_field_value != state[custfield_extended.dependent_field_name])) {
        value = "";
      } else {
        value = state[custom_field.name];
      }
      XML = XML + "<" + custom_field.name + ">" + value + "</" + custom_field.name + ">";
    }
  });
  return XML;
};
Shared.set_custom_fields_state = function(cb_mojo_ext, react_element) {
  var state = react_element.state;
  var ticket = state.ticket;
  var custom_field_attributes = ticket.related_data.field_attributes;
  custom_field_attributes.map(function(custom_field) {
    var custfield_extended = Shared.getObjectFromJSON(custom_field.name, cb_mojo_ext.custom_fields_json);
    //If it's dependent on something and that's not right we want to clear it out.
    if (custfield_extended != null && ticket.hasOwnProperty(custom_field.name)) {
      var value = ticket[custom_field.name];
      react_element.setState(function() {
        var returnObj = {};
        returnObj[custom_field.name] = value;
        return returnObj;
      });
    }
  });
};
Shared.create_custom_fields = function(ticket, cb_mojo_ext, state, changeHandler) {
  var custom_field_attributes = ticket.related_data.field_attributes;
  var custom_controls = custom_field_attributes.map(function(custom_field) {
    if (custom_field.name.indexOf("custom_field") < 0) {
      return null;
    }
    if (custom_field.is_visible_for_end_user != true) {
      return null;
    }
    var dependent_field_name = null;
    var custfield_extended = Shared.getObjectFromJSON(custom_field.name, cb_mojo_ext.custom_fields_json);
    var is_dependent = false;
    var is_value_dependent = false;

    if (custfield_extended != null && custfield_extended.hasOwnProperty("dependent_field_name") && state.hasOwnProperty(custfield_extended.dependent_field_name)) {
      is_dependent = true;
      if (custfield_extended.hasOwnProperty("dependent_field_value") && (custfield_extended.dependent_field_value != state[custfield_extended.dependent_field_name])) {
        return null;
      }
    }
    var value = "";
    var control = null;
    if (state.hasOwnProperty(custom_field.name)) {
      value = state[custom_field.name];
    } else {
      value = custom_field.value;
    }
    var R = React.DOM;
    switch (custom_field.field_type) {
      case 1: //input
        //TODO Check custom_fields_json for custom select and if not just spit out an input
        if (custfield_extended != null && custfield_extended.hasOwnProperty("field_type")) {
          switch (custfield_extended.field_type) {
            case "select":
              var options = custfield_extended["options"];
              if (custfield_extended.hasOwnProperty("dependent_field_name")) {
                options = custfield_extended.options[state[custfield_extended.dependent_field_name]];
              }
              if (options != null && typeof options != "undefined") {
                control = Shared.create_select(custom_field.name, options, value, "Select " + custom_field.label, changeHandler);
              }
              break;
            default:
              control = R.div({}, "This type is not implemented yet, sorry");
              break;
          }
        } else {
          control = Shared.create_input(custom_field.name, "text", value, changeHandler, custom_field.label);
        }
        break;
      case 2: //textarea
        control = R.textarea({
          id: custom_field.name,
          name: custom_field.name,
          placeholder: custom_field.label,
          value: value,
          onChange: changeHandler
        });
        break;
      case 3: //select
        control = Shared.create_select(custom_field.name, custom_field.options, value, "Select " + custom_field.label, changeHandler);
        break;
      case 4: //numeric
        control = Shared.create_input(custom_field.name, "number", value, changeHandler, custom_field.label);
        break;
      case 5: //decimal
        control = Shared.create_input(custom_field.name, "decimal", value, changeHandler, custom_field.label);
        break;
        //TODO All types
      default:
        control = R.div({}, "This type is not implemented yet, sorry");
        break;
    }
    return Shared.createFieldSet({
      label_text: custom_field.label,
      id: custom_field.name,
    }, control);
  })
  return custom_controls;
};
Shared.create_user_info = function(user) {
  var R = React.DOM;
  var now = new Date();
  var url = user.related_data.user.picture_url;
  if (url == null) {
    url = chrome.extension.getURL("images/icons/default_user.png");
  } else if (url == "/images/automation-icon.png") {
    url = chrome.extension.getURL("images/icons/optimus.gif");
  }
  return R.div({
    key: Math.random().toString(36).substring(7) + now.getTime(),
    className: "message_header"
  }, R.span({
    className: "user_pic",
    style: {
      backgroundImage: "url(" + url + ")"
    },
    "data-user_id": user.user_id
  }), R.span({
    className: "user_info",
    "data-user_id": user.user_id
  }, user.related_data.user.full_name), R.span({
    className: "time_info"
  }, "On " + new Date(user.updated_on)));
};
Shared.create_input = function(name, type, value, changeHandler, placeholder, disabled) {
  var props = {
    id: name,
    placeholder: placeholder,
    name: name,
    type: type,
    value: value,
    onChange: changeHandler
  };
  if (disabled == true) {
    props.disabled = disabled;
  }
  if (type == "decimal") {
    props.step = "any";
  }
  var R = React.DOM;
  return R.input(props);
};
Shared.create_select = function(name, options, value, call_to_action, changeHandler) {
  var R = React.DOM;
  var select = R.select;
  var option = R.option;
  var out_options = new Array(option({
    value: "",
    key: ""
  }, call_to_action));
  $.each(options, function(k, v) {
    var value = v;
    var key = v;
    if (v.hasOwnProperty("value")) {
      value = v.value;
      key = v.key;
    }
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
    onChange: changeHandler
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
  return new_msg;
};
Shared.get_scheduled_on = function(created_on, priority_id, cb_mojo_ext) {
  return Shared.convertToFormattedDate(Shared.get_date_based_on_priority("scheduled_on", created_on, priority_id, cb_mojo_ext));
};
Shared.get_due_on = function(created_on, priority_id, cb_mojo_ext) {
  return Shared.convertToFormattedDate(Shared.get_date_based_on_priority("due_on", created_on, priority_id, cb_mojo_ext));
};
Shared.get_date_based_on_priority = function(type, created_on, priority_id, cb_mojo_ext) {
  if (!(created_on instanceof Date)) {
    created_on = new Date(created_on);
  }
  if (!(priority_id instanceof Number)) {
    priority_id = Number(priority_id);
  }
  var add_days = 0;
  switch (priority_id) {
    case 10:
      if (type == "scheduled_on") {
        add_days = cb_mojo_ext.emergency_scheduled_on_days;
      } else {
        add_days = cb_mojo_ext.emergency_due_on_days;
      }
      break;
    case 20:
      if (type == "scheduled_on") {
        add_days = cb_mojo_ext.urgent_scheduled_on_days;
      } else {
        add_days = cb_mojo_ext.urgent_due_on_days;
      }
      break;
    case 30:
      if (type == "scheduled_on") {
        add_days = cb_mojo_ext.normal_scheduled_on_days;
      } else {
        add_days = cb_mojo_ext.normal_due_on_days;
      }
      break;
    default:
      if (type == "scheduled_on") {
        add_days = cb_mojo_ext.low_scheduled_on_days;
      } else {
        add_days = cb_mojo_ext.low_due_on_days;
      }
  }
  return created_on.addbizDays(add_days);
};
Shared.setStorage = function(obj){
  if(typeof chrome.storage.sync != undefined){
    chrome.storage.sync.set(obj);
  }else{
    chrome.storage.local.set(obj);
  }
};
Shared.getStorage = function(obj,funktion = new function(items){}){
  if(typeof chrome.storage.sync != undefined){
    chrome.storage.sync.get(obj,funktion);
  }else{
    chrome.storage.local.get(obj,funktion);
  }
};
Shared.clearStorage = function(){
  if(typeof chrome.storage.sync != undefined){
    chrome.storage.sync.clear();
  }else{
    chrome.storage.local.clear();
  }
};