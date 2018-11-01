/**
* Fungsi untuk mencari indexed array dari array multi
* @param  Array arr    Array Indexed
* @param  Array k  Key untuk object
* @param  Array v  Value yang dicari
* @return Object     Object yang di temukan, false jika tidak ketemu
* @author Riko Logwirno
*/
export default (arr, k, v) => {
    if (typeof arr != 'object' || arr.length <= 0 || typeof k == 'undefined' || typeof v == 'undefined') {
        return false;
    }

    for (var i in arr) {
        if (arr.hasOwnProperty(i) && arr[i].hasOwnProperty(k) && arr[i][k] == v) {
            return arr[i];
        }
    }

    return false;
}
