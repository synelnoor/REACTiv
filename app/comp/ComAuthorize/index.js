import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import GetToken from './GetToken';
import GetResource from './GetResource';
import GetAuthorization from './GetAuthorization';

// Import konfigurasi
import { base_url, api_uri, sso_url } from '../AppConfig';

/**
 * Kelas untuk mengecek otorisasi setelah login
 * @author Riko Logwirno
 */
export default class ComAuthorize{

	loginData = false;

	constructor(){

	}

	setLoginData(loginData){
		if (typeof loginData == 'object' && typeof loginData.username == 'string' && typeof loginData.password == 'string') {
			this.loginData = loginData;
		}
	}

	getToken(cb){
		let token = new GetToken(ComFetch, ArrayToQueryString, sso_url, {username: this.loginData.username, password: this.loginData.password});
		token.getData((resp) => {
			cb({status: resp.status, data: resp.data});
		});
	}

	getResource(token, cb){
		let resource = new GetResource(ComFetch, ArrayToQueryString, sso_url, token);
		resource.getData((resp) => {
			cb({status: resp.status, data: resp.data});
		});
	}

	GetAuthorization(cb){
		let resource = new GetAuthorization(ComFetch, ArrayToQueryString, (base_url + api_uri), {username: this.loginData.username, password: this.loginData.password});
		resource.getData((resp) => {
			cb({status: resp.status, data: resp.data});
		});
	}

	// check(cb){
	// 	this.getToken((respToken) => {
	//console.log('getToken : ', respToken);
	// 		if (respToken.status == 200 && typeof respToken.data.error == 'undefined') {
	// 			this.getResource(data.data.access_token, (data) => {
	// 				cb({status: data.status, data: data.data});
	// 			});
	// 		}
	// 		else {
	// 			cb({status: data.status, data: data.data});
	// 		}
	// 	});
	// }

	check(cb){
		this.GetAuthorization((respJWT) => {
			cb({status: respJWT.status, data: respJWT.data});
		});
	}

}
