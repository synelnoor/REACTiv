// Dapet dari "http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript"
// Belom tau bisa atau ga

class ComBase64ImgFromURL{
    convert(url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
}

export default new ComBase64ImgFromURL();
