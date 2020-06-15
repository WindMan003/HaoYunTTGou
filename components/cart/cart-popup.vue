<template>
	<uni-popup type="bottom" ref="popup" className="uni-popup__wrapper-box-cart">
		<view class="d-flex w-100" style="background-color: #FFFFFF; border-radius: 3%; max-height: 880rpx; min-height: 360rpx;">
			<view class="d-flex flex-column w-100">
				<view class="d-flex a-center border-bottom j-center w-100" style="width: 100%; height: 70rpx;">
					<text class="font-28 position-absolute" style="right: 15rpx; color: #007AFF;" @click="clearCart">清空购物车</text>
					<text class="font-28 position-absolute" style="left: 15rpx; color: #007AFF;" @click="deleteCart">{{getDeleteBtnTitle}}</text>
				</view>
				
				<scroll-view scroll-y style="max-height: 720rpx; min-height: 200rpx;">
					<block v-for="(item,index) in cartGoodsList" :key="index">
						<view class="row ml-3 mt-2 mt-1 mb-1">
							<view class="main-bg-color-w" style="flex: 0 0 150rpx; height: 150rpx; border-radius: 8rpx;">
								<image :src="item.TitleImgUrl" style="width: 100%;height: 100%;" mode="aspectFit"></image>
							</view>
							<view class="d-flex flex-column ml-2 flex-1 position-relative">
								<view class="d-flex flex-row a-center">
									<view class="font-32 font-weight">{{item.ProductName}}</view>
									<view class="position-absolute border pl-1 pr-1 rounded-20 font-20" @click="deleteGoods(item)"
									style="right: 20rpx; background-color: red; color: #FFFFFF;">删除</view>
								</view>
								<view class="font-24 mb-auto">
									{{getSpecStr(item)}}
								</view>
								<view class="font-weight">
									<price>{{getOneGoodTotalPrice(item)}}</price>
								</view>
								<view class="position-absolute" style="right: 10rpx; bottom: 10rpx; z-index: 16;">
									<hx-number-box :value="item.Count" :nameid="item.ProductID" 
									:tasteId="item.TasteID" :specId="item.SpecificationID"></hx-number-box>
								</view>
							</view>
						</view>
						<divider></divider>
					</block>
				</scroll-view>
				
				<view style="width: 100%; height: 90rpx;"></view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import divider from "@/components/common/divider.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import hxNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import price from "@/components/common/price.vue"
	import websocket from "@/common/lib/websocket.js"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default{
		components:{
			divider,
			uniPopup,
			hxNumberBox,
			price
		},
		props:{
		},
		data() {
			return {
				bgHeight:0,
				scrollH:0,
				isCreate:false
			}
		},
		onLoad() {

		},
		computed:{
			...mapState({
				cartGoodsList:state=>state.cart.cartGoodsList,
				cartId:state=>state.cart.cartId,
				ID:state=>state.cart.ID,
				merchantID:state=>state.merchant.merchantID,
				isCartCreate:state=>state.cart.isCartCreate
			}),
			...mapGetters([

			]),
			
			getDeleteBtnTitle(){
				if(this.isCartCreate){
					return '删除购物车'
				}else{
					return '退出购物车'
				}
			}
		},
		methods:{
			...mapMutations([
				'clearCartList',
				'updateCartId',
				'updateOrderID',
			]),
			...mapActions([
				'operationCartGoods'
			]),
			showCartPopup(){			
				this.$refs.popup.open()
			},
			closeCartPopup(){
				this.$refs.popup.onTap()
			},
			clearCart(){
				var _self = this
				uni.showModal({
				    title: '提示',
				    content: '确定清空购物车',
				    success: function (res) {
				        if (res.confirm) {
				            _self.$H.post('/api/Merchant/ClearCart',{
				            	MerchantID:_self.merchantID,
				            	CartID:_self.cartId,
								ID:_self.ID
				            },{
				            	token:true
				            }).then(res=>{
				            	console.log(res)
				            	if(res.status === 0){
				            		_self.clearCartList()
				            		_self.$refs.popup.onTap()
				            	}else{
				            		_self.$Common.showToast(res)
				            	}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			deleteCart(){
				var _self = this
				if(_self.isCartCreate){
					uni.showModal({
					    title: '提示',
					    content: '确定删除购物车',
					    success: function (res) {
					        if (res.confirm) {
					            _self.$H.post('/api/Merchant/DeleteShoppingCart',{
					            	MerchantID:_self.merchantID,
					            	CartID:_self.cartId,
									ID:_self.ID,
					            },{
					            	token:true
					            }).then(res=>{
					            	console.log(res)
					            	if(res.status == 0){
					            		_self.clearCartList()
										_self.updateCartId(0)
										_self.updateOrderID(0)
										websocket.closeSocketNet()
					            		_self.$refs.popup.onTap()
					            	}else{
					            		_self.$Common.showToast(res)
					            	}
					            })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}else{
					uni.showModal({
					    title: '提示',
					    content: '确定退出购物车',
					    success: function (res) {
					        if (res.confirm) {
								_self.clearCartList()
								_self.updateCartId(0)
								_self.updateOrderID(0)
								_self.$refs.popup.onTap()
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}
				
			},
			getSpecStr(list){
				let tasteName = list.TasteName ? list.TasteName:''
				let specName = list.SpecificationName ? list.SpecificationName:''
			
				if(tasteName && specName){
					return `规格：${specName}  ${tasteName}`
				}else if(specName){
					return `规格：${specName}`
				}else if(tasteName){
					return `口味：${tasteName}`
				}else{
					return ''
				}
			},
			deleteGoods(m_item){
				var _self = this
				uni.showModal({
				    title: '提示',
				    content: '确定删除此商品',
				    success: function (res) {
				        if (res.confirm) {
							_self.operationCartGoods({
								operationStr: 'minus',
								nameid: m_item.ProductID,
								tasteId: m_item.TasteID,
								specId: m_item.SpecificationID,
								merchantID: _self.merchantID,
								count: '0'
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			getOneGoodTotalPrice(m_item){
				let total = m_item.Price*m_item.Count
				let numStr = total.toString()
				let index = numStr.indexOf('.')
				let result = Number(numStr.slice(0, index + 3))
				
				return result
			}
		}
	}
</script>

<style>

</style>
