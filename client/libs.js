// attach the .compare method to Array's prototype to call it on any array
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] !== array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

Array.prototype.contains = function (element) {
    if (!element)
       return false;

    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && element instanceof Array) {
            if (this[i].compare(element))
                return true;
        } else if (this[i] == element) {
            return true;
        }
    }

    return false;
}
