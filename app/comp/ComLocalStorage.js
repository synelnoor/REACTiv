import { AsyncStorage } from 'react-native';

// Kelas untuk abstraksi AsyncStorage
class ComLocalStorage {
    table = false;
    key = false;
    whereValue = false;

    constructor() {
        //
    }

    /**
     * Fungsi untuk membelah nama tabel dan key dari format key yang di simpan di AsyncStorage
     * @param   string   key dari AsyncStorage yang akan di pecah
     * @return  object  {table: string, key: string} Jika data tidak ada maka isinya kosong ''
     */
    breakKeys(a){
        let table;
        let key;

        var breakA = /@([A-Za-z0-9]\w+)\:([A-Za-z0-9]\w+)/igm.exec(a);

        if (breakA != null) {

            table = typeof breakA[1] != 'undefined' ? breakA[1] : false;
            key = typeof breakA[2] != 'undefined' ? breakA[2] : false;

            return {table: table, key: key};

        }
        else {
            return {table: '', key: ''};
        }
    }

    /**
     * Setter untuk nama tabel
     * @param   String   Nama tabel
     */
    setTable(a){
        this.table = a;
    }

    /**
     * Setter untuk nama key yang akan dipilih, cat: jika tabel kosong maka key ini tidak digunakan
     * @param   string  nama key
     */
    setKey(a){
        this.key = a;
    }

    /**
     * Setter untuk pemilihan value yang diinginkan, untuk sekarang hanya ada untuk pencarian eksak
     * @param   object
     */
    setWhereValue(a){
        this.whereValue = a;
    }

    /**
     * Ambil semua keys dari local storage
     * @param   callback  {err: bool, ?keys: array}
     */
    getAllKeys(cb){
        AsyncStorage.getAllKeys((err, keys) => {
            if (err == null) {
                cb({error: false, keys: keys});
            }
            else {
                cb({error: err});
            }
        });
    }

    /**
     * Method untuk mengembalikan data yang di simpan dari local storage (AsyncStorage)
     * @param   callback    {err: bool, data: object}
     */
    getItem(cb){

		this.getKeys((tableKey) => {
			this.getData( tableKey, (respon_data) => cb(respon_data) );
		});

    }

	async getItemByKey(key,cb){
		try{
			let e = await AsyncStorage.getItem(key);
			cb(e);
		}
		catch(e){
			//cb(null);
		}
	}

	/**
	 * Method Abstraksi untuk penarikan key berdasarkan nama tabel atau key yang telah di set
	 * @param  {Callback(respon_data)} cb Callback dari method getAllKeys
	 */
	getKeys(cb){
		let tableKey = new Array();
		let thiss = this;

		if (this.table && !this.key) {
            this.getAllKeys(data => {
				let keys = data.keys;
                for (var i in keys) {

                    if (keys.hasOwnProperty(i)) {
                        let key = thiss.breakKeys(keys[i]).key;
                        tableKey.push('@'+thiss.table+':'+key);
                    }
                }
				cb(tableKey);
            });
        }
        else if (!this.table && !this.key) {
            this.getAllKeys(data => {
				let keys = data.keys;
                for (var i in keys) {

                    if (keys.hasOwnProperty(i)) {
                        tableKey.push(keys[i]);
                    }
                }
				cb(tableKey);
            });
        }
        else if (this.table && this.key) {
            tableKey.push('@'+this.table+':'+this.key);
			cb(tableKey);
        }
	}

	/**
	 * Abstraksi untuk pengambilan data dengan banyak
	 * @param  {Array}   tableKey lemparan dari method getItem
	 * @param  {Callback} cb       Callback dari AsyncStorage terdapat {err: ?null, data: object}
	 */
	getData(tableKey, cb) {
		let thiss = this;

		AsyncStorage.multiGet(tableKey, (err, data) => {
            if (!err) {

                let datax = {};

                if (thiss.whereValue) {
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            let key = thiss.breakKeys( data[i][0] ).key;
                            let val = data[i][1];
                            if (typeof thiss.whereValue[key] != 'undefined' && thiss.whereValue[key] == val) {
                                datax[key] = val;
                            }
                        }
                    }
                }
                else  {
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            let key = thiss.breakKeys( data[i][0] ).key;
                            let val = data[i][1];
                            datax[key] = val;
                        }
                    }
                }

                return cb({error: err, data: datax});
            }
            else {
                return cb({error: err});
            }
        });
	}

	/**
	 * Static method untuk menambahkan data baru ke local storage
	 * @param {String}   table [description]
	 * @param {String}   key   [description]
	 * @param {String}   value [description]
	 * @param {Callback(error)} cb    [description]
	 */
	static setItem(table, key, value, cb){
		AsyncStorage.setItem(('@'+table+':'+key), value, (error) => { cb(error); });
	}

	/**
	 * Hapus data dari tabel berdasarkan nama tabel dan key-nya
	 * @param  {String}   table [description]
	 * @param  {String}   key   [description]
	 * @param  {Callback(error)} cb    [description]
	 */
	 static removeItem(table, key, cb){
	 	AsyncStorage.removeItem(('@'+table+':'+key), (error) => { cb(error); });
	 }

	// removeData(cb){
	// 	let thiss = this;
	//
    //     if (thiss.whereValue) {
    //         for (var i in data) {
    //             if (data.hasOwnProperty(i)) {
    //                 let key = thiss.breakKeys( data[i][0] ).key;
    //                 let val = data[i][1];
    //                 if (typeof thiss.whereValue[key] != 'undefined' && thiss.whereValue[key] == val) {
    //                     datax[key] = val;
	// 					AsyncStorage.removeItem(('@'+table+':'+key), (error) => { cb(error); });
    //                 }
    //             }
    //         }
    //     }
    //     else  {
    //         for (var i in data) {
    //             if (data.hasOwnProperty(i)) {
    //                 let key = thiss.breakKeys( data[i][0] ).key;
    //                 let val = data[i][1];
    //                 datax[key] = val;
	// 				AsyncStorage.removeItem(('@'+table+':'+key), (error) => { cb(error); });
    //             }
    //         }
    //     }
	//
	// 	return cb({error: err});
	//
	// }

	/**
	 * Author : Ari
	 * Mengambil data dari local storage lebih dari satu
	 * contoh array yang di terima
	 * data = {
	 * 			"key1":"table1",
	 * 			"key2":"table2",
	 * 		}
	 * @param  {[type]}   keyTable [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	getMultiple(keyTable,callback){
		AsyncStorage.multiGet(keyTable, (err, data) => {
            callback({error: err, data: data});
        });
	}

	/**
	 * Author : Ari
	 * Menambahkan data ke local storage lebih dari satu
	 * contoh array yang di terima
	 * data = [
	 * 			['k1', 'val1'],
	 * 			['k2', 'val2'],
	 * 		]
	 * @param  {[type]}   keyTable [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	setMultiple(keyTable,callback){
		AsyncStorage.multiSet(keyTable, (err, data) => {
            callback({error: err, data: data});
        });
	}

	/**
	 * [removeMultiple description]
	 * @param  {[type]}   keyTable [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	removeMultiple(keyTable,callback){
		AsyncStorage.multiRemove(keyTable, (err) => {
            callback({ error: err });
        });
	}
}

export default ComLocalStorage;
