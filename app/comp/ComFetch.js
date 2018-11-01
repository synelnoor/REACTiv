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
    };
    sendData = "";
	encodeData = "encodeQueryString";

    // Nothing for now
    constructor(){
        //
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
        this.sendHeaders['Accept'] = sendHeadersAccept;
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
     * Set Authorization header untuk dikirim ke server
     * @param {String} sendAuthorization JWT
     */
    setAuthorization(sendAuthorization){
        this.sendHeaders['Authorization'] = sendAuthorization;
    }

    /**
     * Set Headers untuk request secara keseluruhan
     * @param    Object  Data Headers
     * @return   void
     */
    setHeaders(sendHeaders){
        this.sendHeaders = sendHeaders;
        //if (Object.keys(sendHeaders).length > 0) {
        //	for (var i in sendHeaders) {
        //		if (sendHeaders.hasOwnProperty(i)) {
        //			this.sendHeaders[i] = sendHeaders[i];
        //		}
        //	}
        //}
    }

    /**
     * Set Data yang akan di kirim ke server, hanya untuk method selain GET
     * @param    Object  Data yang akan dikirim
     * @return   void
     */
    setSendData(sendData) {
        if (this.encodeData == "encodeQueryString") {
            this.sendData = ArrayToQueryString(sendData);
        }
        else if(this.encodeData == "json"){
            this.sendData = JSON.stringify(sendData);
        }
        else if(this.encodeData == "queryString"){
            let outR = new Array();

            for(var key in sendData){
                outR.push(key + '=' + sendData[key]);
            }
            this.sendData = outR.join('&');
        }
        else if (this.encodeData == "FormData") {
            this.sendData = sendData;
        }
    }

    /**
     * Set apakah data body akan di encode atau tidak, default "encodeQueryString"
     * @param {string} x encodeQueryString, json, queryString
     */
    setEncodeData(x){
        this.encodeData = x;
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
            // console.log('fetch response', response);
            // console.log('fetch body sent', this.setParams());
            if (response.status == 200) {
                response.json().then((resJSON) => callback({status: response.status, data: resJSON}));
            }
            else {
                callback({status: response.status, data: null});
            }
        })
        .catch((error)=>{
            //console.log('fetch error response', error);
            callback({status: error, data: null});
        });

    }

    sendFetchTes(callback) {
        if (this.sendMethod !== "GET") {
            var xxx = {
                method: this.sendMethod,
                headers: this.sendHeaders,
                body: JSON.stringify({
                    firstParam: 'yourValue',
                    secondParam: 'yourOtherValue',
                })
            }
        }
        else {
            var xxx = this.setParams();
        }

        // fetch(this.restURL + this.resource, this.setParams())
        fetch(this.restURL + this.resource, xxx)
        .then((response) => {
            //console.log('fetch response', response);
            if (response.status == 200) {
                response.json().then((resJSON) => callback({status: response.status, data: resJSON}));
            }
            else {
                callback({status: response.status, data: null});
            }
        })
        .catch((error)=>{
            //console.log('fetch error response', error);
            callback({status: error, data: null});
        });
    }
}

export default ComFetch;
