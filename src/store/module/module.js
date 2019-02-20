

export default{
	namespaced: true,
	state(){
		return {
			count: 0,
		}
	},
	mutations:{
		addCount: state => state.count++
	}
}