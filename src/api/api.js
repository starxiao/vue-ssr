
//api.js

import axios from 'axios';

export function fetchItem(){
	return new Promise(function(resolve,reject){
		axios({
			method: 'GET',
			url: 'http://localhost:8989/api/index.json',
			}).then(function(res){
				resolve(res.data);
			}).catch(function(err){
				reject(err);
			});
		});
}

