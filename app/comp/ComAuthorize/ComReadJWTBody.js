import { decode as base64decode } from 'base-64';

/**
 * Baca body JWT dan kembalikan dengan format object
 * @param  {String} jwt
 * @return {Object}
 * @author Riko Logwirno
 */
export default (jwt) => {
	let pecah_jwt = jwt.split('.');
	// alert('pecah_jwt[1] : ' + pecah_jwt[1]);
	let body_jwt = '';
	let decode_jwt = base64decode(pecah_jwt[1]);
	// alert('decode_jwt' + decode_jwt);
	try{
		body_jwt = JSON.parse(decode_jwt);
	}
	catch(err){
		// Toengg Error, JWT ga valid breee...
		return false;
	}
	// alert('body_jwt success')
	return body_jwt;
}
