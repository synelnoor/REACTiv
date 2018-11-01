import ErrorComFetch from './ErrorComFetch';

/**
 * Kelas untuk mengambil token login berdasarkan username dan password
 * @type {[type]}
 */
export default class GetAuthorization{

	ComFetch = null;
	ArrayToQueryString = null;
	urlSSO = null;
	loginData = {};

	constructor(ComFetch, ArrayToQueryString, urlSSO, loginData){
		this.validasiInput(ComFetch, ArrayToQueryString, urlSSO, loginData);

		this.ComFetch = new ComFetch();
		this.ArrayToQueryString = ArrayToQueryString;
		this.urlSSO = urlSSO;
		this.loginData = loginData;
	}

	validasiInput(ComFetch, ArrayToQueryString, urlSSO, loginData){
		if (typeof ComFetch != 'function') {
			throw new ErrorComFetch('ComFetch seharusnya kelas breeee', 'construct');
		}
		if (typeof ArrayToQueryString != 'function') {
			throw new ErrorComFetch('ArrayToQueryString seharusnya function breeee, tapi kyknya ga di butuhin banget buat sekarang', 'construct');
		}
		if (typeof urlSSO != 'string') {
			throw new ErrorComFetch('UrlSSO harus di isi breee', 'construct');
		}
		if (typeof loginData != 'object') {
			throw new ErrorComFetch('Data login harus di isi breee', 'construct');
		}
	}

	getData(cb){
        let urlResource = 'login';

        this.ComFetch.setRestURL(this.urlSSO);
		this.ComFetch.setResource(urlResource);
		this.ComFetch.setMethod('POST');
		this.ComFetch.setHeadersContentType('application/x-www-form-urlencoded');
		this.ComFetch.setSendData({
			username: this.loginData.username,
			password: this.loginData.password
		});

        this.ComFetch.sendFetch((resp) => {
			cb({status: resp.status, data: resp.data});
        });
	}
}
