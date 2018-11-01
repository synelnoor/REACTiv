// Kelas untuk mendapatkan data Assignment dari server
// Author Riko Logwirno
import ArrayToQueryString from './ArrayToQueryString';

class ComFetch {

    // Parameter default untuk koneksi ke restAPI
    restURL = "";
    resource = "";
    sendMethod = "GET";
    sendHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    sendData = "";

    // Nothing for now
    constructor(){
    }

    //
    // Setter
    //

        /**
         * Set Url
         * @param    string  Url server
         * @return   void
         */
        setRestURL(restURL) {
            this.restURL = restURL;
        }

        /**
         * Set Resource URI
         * @param    string  Uri untuk akses server
         * @return   void
         */
        setResource(resource) {
            this.resource = resource;
        }

        /**
         * Set Method
         * @param    string  Method untuk akses ke server RESTful
         * @return   void
         */
        setMethod(sendMethod) {
            this.sendMethod = sendMethod;
        }

        /**
         * Set Headers Accept
         * @param    string  Headers yang diminta (ex. JSON / HTML)
         * @return   void
         */
        setHeadersAccept(sendHeadersAccept) {
            this.sendHeaders.Accept = sendHeadersAccept;
        }

        /**
         * Set Content-Type / Tipe konten yang di akan di kirim ke server (ex. form-data / x-www-form-urlencoded / raw / binary)
         * @param    string  Tipe konten
         * @return   void
         */
        setHeadersContentType(sendHeadersContentType) {
            this.sendHeaders['Content-Type'] = sendHeadersContentType;
        }

        /**
         * Set Headers untuk request secara keseluruhan
         * @param    Object  Data Headers
         * @return   void
         */
        setHeaders(sendHeaders){
            this.sendHeaders = sendHeaders;
        }

        /**
         * Set Data yang akan di kirim ke server, hanya untuk method selain GET
         * @param    Object  Data yang akan dikirim
         * @return   void
         */
        setSendData(sendData) {
            this.sendData = ArrayToQueryString(sendData);
        }

        /**
         * Private Set parameter data yang akan di kirim ke server berdasarkan data yang sudah di set
         * @return   Object
         */
        setParams(){
            params = {};
            params["method"] = this.sendMethod;
            params["headers"] = this.sendHeaders;
            if (this.sendMethod !== "GET") {
                if (typeof params.headers['Content-Type'] == "undefined") {
                    params.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                }
                params["body"] = this.sendData;
            }
            return params;
        }

    //
    // END Setter
    //

    /**
     * Kirim request ke server RESTful
     * @param    Callback    Data balikan dari server
     */
     sendFetch(callback) {

         fetch(this.restURL + this.resource, this.setParams())
         .then((response) => {
             if (response.status == 200) {
                 response.json().then((resJSON) => callback({status: response.status, data: resJSON}));
             }
             else {
                 callback({status: response.status, data: null});
             }
         })
         .catch((error)=>{
             callback({status: error, data: null});
         });

     }
}

export default new ComFetch
