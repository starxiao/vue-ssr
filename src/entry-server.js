
import {createApp} from './app.js';


// without vue-router

// export default context =>{
// 	return new Promise((resolve,reject) => {
// 		const {app} = createApp();
// 		resolve(app);
// 	})
// }


// with vue-router
export default context =>{
	return new Promise((resolve,reject)=>{
		const {app, router,store} = createApp();

		router.push(context.url);   // send url to vue-router

		router.onReady(()=>{
			const matchedComponents = router.getMatchedComponents();
			if(!matchedComponents){
				return reject({ code: 404 });
			}

			Promise.all(matchedComponents.map(component =>{
				if(component.asyncData){
					return component.asyncData({
						store,
						route: router.currentRoute
					})
				}
			})).then(()=>{

				context.state = store.state;
				resolve(app);
				
			}).catch(reject)

		},reject)
	})
}