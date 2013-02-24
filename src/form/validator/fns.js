

ludo.form.validator.required = function(value, required){
    return !required || value.length > 0;
};

ludo.form.validator.minLength = function(value, minLength){
    return value.length === 0 || value.length >= minLength;
};

ludo.form.validator.maxLength = function(value, maxLength){
    return value.length === 0 || value.length <= maxLength;
};

ludo.form.validator.regex = function(value, regex){
    return value.length === 0 || regex.test(value);
};

ludo.form.validator.minValue = function(value, minValue){
    return value.length === 0 || parseInt(value) >= minValue;
};
ludo.form.validator.maxValue = function(value, maxValue){
    return value.length === 0 || parseInt(value) <= maxValue;
};
ludo.form.validator.twin = function(value, twin){
    console.log(twin);
    var cmp = ludo.get(twin);
    return !cmp || (cmp && value === cmp.value);
};