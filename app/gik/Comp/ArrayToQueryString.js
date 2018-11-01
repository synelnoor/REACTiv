/**
 * Fungsi untuk convert array object ke uri, cek:
 * http://stackoverflow.com/questions/4656168/javascript-array-to-urlencoded
 */

export default (array_in) => {
    var outR = new Array();

    for(var key in array_in){
        outR.push(encodeURIComponent(key) + '=' + encodeURIComponent(array_in[key]));
    }

    return outR.join('&');
}
