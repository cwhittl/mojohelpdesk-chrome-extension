function Shared() {}
Shared.prototype.isEmpty = function(str) {
    return (!str || 0 === str.length);
};
Shared.convert_object = function(mojo_object,debug_mode) {
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