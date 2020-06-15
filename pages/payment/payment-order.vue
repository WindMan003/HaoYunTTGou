<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderID: 0,
				price: 0
			}
		},
		onLoad(option) {
			console.log(option)
			this.price = option.price
			this.orderID = option.orderID
			
			
			this.gotoPayBill(this.orderID, this.price)
		},
		methods: {
			gotoPayBill(m_orderID, m_price){
				let _self = this
				uni.showLoading({
					title: '结算中...'
				})
				let postData = {
					OrderID: m_orderID,
					PayType: 2,
					PayChannel: 2
				}
				_self.$H.post('/api/order/PayBill', postData, {
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.redirectTo({
							url:'./payment-pay?price='+m_price+'&orderID='+m_orderID
						})
					}else{
						uni.showModal({
						    title: '提示',
						    content: res.message,
							showCancel: false,
						    success: function (res) {
						        if (res.confirm) {
						            console.log('用户点击确定');
									uni.navigateBack({
										delta: 1
									})
						        }
						    }
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
