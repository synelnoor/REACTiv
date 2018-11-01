/**
 * ComSearchArrayValue, Fungsi untuk mencari value dari indexed array dan mengembalikan key dan value tsb
 * @param  {array} arr Array yang akan di cari
 * @param  {Mixed} val   Kata kunci yang akan di cari
 * @return Mixed       jika ketemu {Key: Value} atau boolean false jika tidak
 */
export default (arr, val) => {
    if (typeof arr != 'object' || arr.length <= 0 || typeof val == 'undefined') {
        return false;
    }

    for (var i in arr) {
        if (arr.hasOwnProperty(i) && arr[i] == val) {
            var ret = {};
            ret[ i ] = arr[i];
            return ret;
        }
    }

    return false;
}
