import $H from '@/common/lib/request.js';
import websocket from '@/common/lib/websocket.js'
export default {
	state:{
		allGoodsList:[],
		//通过服务器拿到的购物车内物品
		cartGoodsList:[],
		//当前选中商品数量
		nowChooseCount:0,
		//当前选中商品总价格
		chooseTotalPrice:0,
		//购物车ID
		cartId:0,
		//订单ID
		OrderID:0,
		//数据库标识
		ID:0,
		//是否是购物车创建者
		isCartCreate:true,
		//备注
		cartNote: '填写备注要求 >'
	},
	getters:{
		totalPrice:(state)=>{
			var total = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				total = total + state.cartGoodsList[i].Count*state.cartGoodsList[i].Price
			}
			return total
		},
		getCartCount:(state)=>{
			var count = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				let temp = state.cartGoodsList[i]
				count = count + temp.Count
			}
			return count
		},
		//根据商品Id获得数量
		getGoodsCount:(state)=>(goodsId)=>{
			let count = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				if (state.cartGoodsList[i].ProductID === goodsId){
					count = count + state.cartGoodsList[i].Count
				}
			}
			return count
		},
		getGoodsTypeCount:(state)=>(typeId)=>{
			var tempcount = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				if (state.cartGoodsList[i].ProductTypeID === typeId){
					tempcount = tempcount + state.cartGoodsList[i].Count
				}
			}
			return tempcount
		},
		// 根据商品id获取对应商品信息
		getGoodsIdList:(state)=>(goodsId)=>{
			var tempcount = 0
			for (var i = 0; i < state.allGoodsList.length; i++) {
				if (state.allGoodsList[i].ID === goodsId){
					return state.allGoodsList[i]
				}
			}
		}
	},
	mutations:{
		//更新规格里面数据
		updateSpecDate(state, list){
			state.nowChooseCount = 0
			state.chooseTotalPrice = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				let temp = state.cartGoodsList[i]
				//只有口味
				if(temp.ProductID === list.goodsId && list.tasteId !== 0 && temp.TasteID === list.tasteId && list.specId === 0){
					state.chooseTotalPrice = temp.Count * temp.Price
					state.nowChooseCount = temp.Count
					return
				}
				//只有规格
				if(temp.ProductID === list.goodsId && list.specId !== 0 && temp.SpecificationID === list.specId && list.tasteId === 0){
					state.chooseTotalPrice = temp.Count * temp.Price
					state.nowChooseCount = temp.Count
					return
				}
				//口味规格都有
				if(temp.ProductID === list.goodsId && list.specId !== 0 && temp.SpecificationID === list.specId){
					if(list.tasteId != 0 && temp.TasteID === list.tasteId){
						state.chooseTotalPrice = temp.Count * temp.Price
						state.nowChooseCount = temp.Count
						return
					}
				}
			}
		},
		//更新购物车数据
		updateCartGoodsList(state, list){
			state.cartGoodsList = list
		},
		//清空购物车数据
		clearCartList(state){
			state.cartGoodsList = []
		},
		updateAllGoodsList(state, list){
			state.allGoodsList = list
		},
		updateCartId(state, cartId){
			state.cartId = cartId
		},
		initID(state, ID){
			state.ID = ID
		},
		updateOrderID(state, OrderID){
			if(OrderID >= 0){
				state.OrderID = OrderID
			}
		},
		initIsCartCreate(state, isCartCreate){
			state.isCartCreate = isCartCreate
		},
		initCartNote(state, cartNote){
			state.cartNote = cartNote
		}
	},
	actions:{
		//更新所有商品数据
		updateAllGoodsListFunc(context, value){
			context.commit('updateAllGoodsList', value)
		},
		updateSpecDateFunc(context, value){
			context.commit('updateSpecDate', value)
		},
		//更新购物车ID
		updateCartIdFunc(context, value){
			context.commit('updateCartId', value)
		},
		//给购物车加减商品
		operationCartGoods(context, value){
			let tempStr = ''
			if(value.operationStr === 'plus'){
				tempStr = '/api/Merchant/AddProduct'
				uni.showLoading({title: '增加中...'})
			}else if(value.operationStr === 'minus'){
				tempStr = '/api/Merchant/RemoveProduct'
				uni.showLoading({title: '修改中...'})
			}
			//判断规格
			var specId = value.specId ? value.specId : 0
			//判断口味
			var tasteId = value.tasteId ? value.tasteId : 0
			
			let count = 1
			if(value.count == '0'){
				count = 0
			}
			var actiondata = {
				MerchantID: value.merchantID,
				CartID: context.state.cartId,
				ID: context.state.ID,
				ProductID: value.nameid,
				SpecificationID: specId,
				TasteID: tasteId,
				Count: count,
				CurCount: count
			}
			console.log(actiondata)
			return new Promise((res,rej)=>{
				$H.post(tempStr, actiondata, {
					token:true,
				}).then(res=>{
					uni.hideLoading()
					console.log(res)
					if(res.status == 0){
						context.commit('updateCartGoodsList', res.data.Products)
						context.commit('updateSpecDate', {
							"goodsId":value.nameid,
							"tasteId":tasteId,
							"specId":specId
						})
					}else if(res.status == 10){
						uni.showToast({title:res.message, icon:'none', duration:2000})
						// 服务器购物车已不存在
						context.commit('updateCartId', 0)
						context.commit('clearCartList')
						websocket.closeSocketNet()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:2000})
					}
				}).catch(err=>{
					rej(err)
				})
			})
		}

	},
}