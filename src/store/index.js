


export default{
	namespaced: true,
	state: function(){
		return {
			count: 0,
		}
	},
	actions:{
		inc: function(){
			commit('inc');
		}
	},
	mutations:{
		inc: function(){
			state.count++;
		}
	}
}