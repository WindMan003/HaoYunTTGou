import $H from '@/common/lib/request.js';
export default {
	state:{
		//商家信息
		merchantInfo:'',
		//商家ID
		merchantID:'',
		//桌子ID
		tableID:'',
		//是否是多人点商品模式
		isManyPeople:true,
		merchantStatus:''
	},
	getters:{

	},
	mutations:{
		updateMerchantInfo(state, merchantInfo){
			state.merchantInfo = merchantInfo
		},
		updateMerchantID(state, merchantID){
			state.merchantID = merchantID
		},
		updateTableID(state, tableID){
			state.tableID = tableID
		},
		updateManyPeople(state, value){
			state.isManyPeople = value
		},
		updateMerchantStatus(state, merchantStatus){
			state.merchantStatus = merchantStatus
		},
	},
	actions:{
		updateManyPeopleFunc(context, value){
			context.commit('updateManyPeople', value)
		},
	},
}