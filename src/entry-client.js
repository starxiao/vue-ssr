
import Vue from 'vue';
import {createApp} from './app.js';

const {app,router,store} = createApp();

if(window.__INITIAL_STATE__){
	store.replaceState(window.__INITIAL_STATE__);
}



// 客户端在展示之前的预请求数据
// Vue.mixin({
// 	beforeMount(){
// 		console.log('beforeMount');
// 		const {asyncData} = this.$options;
// 		if(asyncData){
// 			this.dataPromise = asyncData({
// 				store: this.$store,
// 				route: this.$route
// 			})
// 		}
// 	},
// 	beforeRouteUpdate (to, from, next) {
// 		console.log('beforeRouteUpdate');
// 	    const { asyncData } = this.$options
// 	    if (asyncData) {
// 	      asyncData({
// 	        store: this.$store,
// 	        route: to
// 	      }).then(next).catch(next)
// 	    } else {
// 	      next()
// 	    }
//    }
// });

router.onReady(()=>{
	app.$mount('#app');
});


