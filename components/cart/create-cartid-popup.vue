<template>
	<uni-popup type="center" ref="popup" className="uni-popup__wrapper-box-goods-spec">
		<view class="d-flex flex-column w-100" style="height: 500rpx; background-color: #FFFFFF; border-radius: 3%;">
			<view class="w-100 border-bottom text-center font-36 font-weight mt-2" style="height: 90rpx">
				购物车
			</view>
			
			<view class="d-flex j-center mt-3">
				<view class="p-1" style="width: 35%;">
					<input class="text-center border-bottom font-28" type="number" :value="inputCartId"
					 placeholder="输入购物车ID" maxlength="4" @input="cartIdInput"/>
				</view>
				
<!-- 				<view class="border text-center font-28 font-weight p"
				style="background: #FFA500; border-radius: 10rpx; width: 160rpx; color: #FFFFFF;"
				@click="joinCart">
					点击加入
				</view> -->
			</view>
			
			<view class="text-center mt-3 font-24 w-100" style="color: red;">
				*加入购物车,可实现多人共同点餐！
			</view>
<!-- 			<view class="ml-3 mt-3 font-28 w-100 text-center">
				tips:或者点击创建按钮创建自己的购物车
			</view> -->
			
			<view class="d-flex a-center j-center mt-5 flex-row j-sa">
				<view class="border text-center font-36 font-weight p-1" 
				style="background: #FFA500; border-radius: 10rpx; width: 200rpx; color: #FFFFFF;"
				@click="joinCart">
					加入
				</view>
				
				<view class="border text-center font-36 font-weight p-1"
				style="background: #FFA500; border-radius: 10rpx; width: 200rpx; color: #FFFFFF;"
				@click="createCart">
					点餐
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import websocket from "@/common/lib/websocket.js"

	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default{
		components:{
		},
		props:{
		},
		data() {
			return {
				inputCartId: ''
			}
		},
		computed:{
			...mapState({
				cartId:state=>state.cart.cartId,
				merchantID:state=>state.merchant.merchantID,
				tableID:state=>state.merchant.tableID,
				appConfig:state=>state.user.appConfig,
				token:state=>state.user.token
			}),
			...mapGetters([

			]),
		},
		methods:{
			...mapMutations([
				'updateCartGoodsList',
				'updateOrderID',
				'initIsCartCreate',
				'initID'
			]),
			...mapActions([
				'updateCartIdFunc'
			]),
			
			showPopup(){
				//初始化数据
				this.$refs.popup.open()
			},
			cartIdInput(e){
				this.inputCartId = e.detail.value
			},
			joinCart(){
				var _self = this
				if(_self.inputCartId == 0){
					uni.showToast({title: '请输入4位购物车ID', icon: 'none', duration: 1500})
				}else{
					uni.showLoading({title: '加入中...'})
					_self.$H.post('/api/Merchant/SelectCart',{
						MerchantID: _self.merchantID,
						CartID: _self.inputCartId
					},{
						token:true
					}).then(res=>{
						uni.hideLoading()
						console.log(res)
						if(res.status == 0){
							_self.updateCartIdFunc(res.data.CartID)
							_self.initID(res.data.ID)
							_self.syncCartList(res.data)
							_self.connectWebsocket()
							_self.updateOrderID(0)
							_self.initIsCartCreate(false)
							_self.inputCartId = ''
							_self.$refs.popup.onTap()
						}else{
							_self.$Common.showToast(res)
						}
					})
				}
			},
			createCart(){
				var _self = this
				uni.showLoading({title: '创建中...'})
				_self.$H.post('/api/Merchant/CreateShoppingCart',{
					MerchantID: _self.merchantID,
					TableID: _self.tableID
				},{
					token:true
				}).then(res=>{
					uni.hideLoading()
					console.log(res)
					if(res.status == 0){
						_self.updateCartIdFunc(res.data.CartID)
						_self.initID(res.data.ID)
						_self.connectWebsocket()
						_self.updateOrderID(0)
						_self.initIsCartCreate(true)
						_self.inputCartId = ''
						_self.$refs.popup.onTap()
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			connectWebsocket(){
				console.log(this.merchantID)
				console.log(this.cartId)
				console.log(this.token)
				//socket连接
				websocket.initWebSocket(this.syncCartList, 
				JSON.stringify({action:'startOrder', merchantID:this.merchantID, cartID:this.cartId, token:this.token}),
				this.appConfig.WebSocketUrl)
			},
			//更新购物车数据
			syncCartList(res){
				console.log(res)
				this.updateCartGoodsList(res.Products)
			},
		}
	}
</script>

<style>

</style>
