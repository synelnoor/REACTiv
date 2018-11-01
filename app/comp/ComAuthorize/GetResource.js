import ErrorComFetch from './ErrorComFetch';

/**
 * Kelas untuk mengambil Resource dari SSO berdasarkan kelas GetToken
 * @type {[type]}
 */
export default class GetResource{

	ComFetch = null;
	ArrayToQueryString = null;
	urlSSO = null;
	token: null;

	constructor(ComFetch, ArrayToQueryString, urlSSO, token){
		this.validasiInput(ComFetch, ArrayToQueryString, urlSSO, token);

		this.ComFetch = new ComFetch();
		this.ArrayToQueryString = ArrayToQueryString;
		this.urlSSO = urlSSO;
		this.token = token;
	}

	validasiInput(ComFetch, ArrayToQueryString, urlSSO, token){
		if (typeof ComFetch != 'function') {
			throw new ErrorComFetch('ComFetch seharusnya kelas breeee', 'construct');
		}
		if (typeof ArrayToQueryString != 'function') {
			throw new ErrorComFetch('ArrayToQueryString seharusnya function breeee, tapi kyknya ga di butuhin banget buat sekarang', 'construct');
		}
		if (typeof urlSSO != 'string') {
			throw new ErrorComFetch('UrlSSO harus di isi breee', 'construct');
		}
		if (typeof token != 'string') {
			throw new ErrorComFetch('Token harus ada breee', 'construct');
		}
	}

	getData(cb){
        let urlResource = 'Resource';

        this.ComFetch.setRestURL(this.urlSSO);
		this.ComFetch.setResource(urlResource);
		this.ComFetch.setMethod('POST');
		this.ComFetch.setHeadersContentType('application/x-www-form-urlencoded');
		this.ComFetch.setSendData({
			access_token: this.token
		});

        this.ComFetch.sendFetch((resp) => {
			cb({status: resp.status, data: resp.data});
        });
	}
}
