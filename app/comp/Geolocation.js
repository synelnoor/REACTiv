class Geolocation {
	watchID : ?number = null;

	get_location(callback){
		navigator.geolocation.getCurrentPosition(
			(position)=>{
				callback(JSON.stringify({'location':position}));
			},
			(error)=>{
				callback(JSON.stringify({'error':error}));
			},
			//{
			//	enableHighAccuracy:false,
			//	timeout:20000,
			//	maximumAge:1000
			//}
		);
	}

	watch_location(callback){
		this.watchID = navigator.geolocation.watchPosition(
			(position)=>{
				callback(JSON.stringify({'location':position}));
			},
			(error)=>{
				//callback(JSON.stringify(error));
				//callback(JSON.stringify({'error':error}));
			}
		);
	}
}

export default new Geolocation();