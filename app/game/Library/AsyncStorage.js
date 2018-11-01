/**
 * @author: Artha Prihardana 
 * @Date: 2017-09-06 15:44:28 
 * @Last Modified by: Artha Prihardana
 * @Last Modified time: 2018-01-08 16:04:39
 */
import { AsyncStorage } from 'react-native';

/**
 * Buat class AsyncStorage
 */
class NewAsyncStorage{

	constructor(){}

	async getItemByKey(tablekey,cb){
		try{
			let e = await AsyncStorage.getItem(tablekey);
			cb(e);
		} catch(e) {
			//cb(null);
		}
	}

	static setItem(table,key,value,cb){
		AsyncStorage.setItem(('@'+table+':'+key),value,(q)=>{cb(q)});
	}

	static removeItem(table,key,cb){
		AsyncStorage.removeItem(('@'+table+':'+key),(q)=>{cb(q)});
	}

	static mergeItem(table, key, value, cb) {
		AsyncStorage.mergeItem(('@'+table+':'+key), value, (q)=>cb(q));
	}

}

export default NewAsyncStorage;
