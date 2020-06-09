import Vue from "vue"
import Vuex from "vuex"

import cart from "@/store/modules/cart.js"
import user from "@/store/modules/user.js"
import order from "@/store/modules/order.js"
import merchant from "@/store/modules/merchant.js"

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		cart,
		user,
		order,
		merchant
	}
})