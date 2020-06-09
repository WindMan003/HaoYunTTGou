<template>
	<view class="w-100">
		<view class="main bg-white rounded-10 p-1" style="width: 94%;">
			<view class="ml-1 mt-1">
				<view class="font-weight border-bottom pb-1">{{item.MerchantName}}>></view>
				<view class="pt-1" @click="openOrderDetail(item.ID)">
					<view class="">
						<text>下单时间：</text>
						<text>{{ item.CreateTime }}</text>
					</view>
					<view>
						<text>订单号：</text>
						<text>{{ item.ID }}</text>
						<text class="ml-3">订单状态：</text>
						<text>{{ item.StatusName }}</text>
					</view>
					<view>
						<text>订单金额：</text>
						<text class="main-text-color">{{ item.Amount }}</text>
						<text class="ml-3">实付款：</text>
						<text class="main-text-color">{{ item.PayAmount }}</text>
					</view>
				</view>
				<view class="text-right pb-1">
					<button v-if="item.Status == 0" size="mini" type="primary" @click="cancelOrder(item.ID)">取消</button>
					<button v-else-if="item.Status == 1 || item.Status == 2" size="mini" type="primary" @click="gotoPay(item.PayAmount, item.ID)">
						去付款
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	var options = {
		token: true
	};
	export default {
		components:{
		},
		data() {
			return {
				
			}
		},
		props:{
			item:{
				type:Object,
				default:null
			}
		},
		computed:{
			...mapState({
				orderList:state=>state.order.orderList
			}),
			...mapGetters([
			]),
		},
		methods: {
			cancelOrder(orderID) {
				uni.showModal({
					title: '提示',
					content: '确认是否取消？',
					success: res => {
						if (res.confirm) {
							this.cancelOrderSure(orderID)
						}
					}
				});
			},
			cancelOrderSure(orderID){
				var _self = this;
				var postData = {
					orderID: orderID
				}
				_self.$H.post('/api/Order/CancelOrder', postData, options).then(res => {
					console.log(res)
					if(res.status == 0){
						var temp = _self.orderList
						for (let i = 0; i < temp.length; i++) {
							if(temp[i].ID == orderID){
								temp[i].Status = 4
								temp[i].StatusName = '用户取消'
								break
							}
						}
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				});
			},
			openOrderDetail(orderID) {
				uni.navigateTo({
					url:'../../pages/order/detail?orderID=' + orderID,
					animationType: 'pop-in',
					animationDuration: 200
				});
			},
			gotoPay(m_price, m_orderID) {
				console.log('aaaaaaaaaaaaa')
				uni.navigateTo({
					url:'../../pages/payment/payment-pay?price='+m_price+'&orderID='+m_orderID,
				})
			},
		}
	}
</script>

<style>

</style>