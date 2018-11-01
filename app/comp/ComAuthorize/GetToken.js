import ErrorComFetch from './ErrorComFetch';

/**
 * Kelas untuk mengambil token login berdasarkan username dan password
 * @type {[type]}
 */
export default class GetToken{

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
        let urlResource = 'PasswordCredentials';

        this.ComFetch.setRestURL(this.urlSSO);
		this.ComFetch.setResource(urlResource);
		this.ComFetch.setMethod('POST');
		this.ComFetch.setHeadersContentType('application/x-www-form-urlencoded');
		this.ComFetch.setSendData({
			grant_type: "password",
			username: this.loginData.username,
			password: this.loginData.password,
			client_id: "ik-mobile-sso-client-id-1234567890",
			client_secret: "ik-mobile-sso-client-secret-1234567890",
			scope: "userinfo"
		});

        this.ComFetch.sendFetch((resp) => {
			cb({status: resp.status, data: resp.data});
        });
	}
}
