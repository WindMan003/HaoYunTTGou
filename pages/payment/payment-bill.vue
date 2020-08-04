<template>
	<view class="">
		<scroll-view scroll-y="true" style="background-color: #F5F5F5;" :style="'height:'+ windowHeight + 'px'">
			<view class="d-flex flex-column a-center">
				<view class="" style="width: 94%;">
					<view class="w-100 border rounded-10 bg-white mt-2 d-flex flex-column a-center">
						<view class="mt-3 font-36">订单金额</view>
						<view class="mt-1 font-40 text-price pb-3">￥{{amount}}</view>
					</view>
					
					<view class="w-100 border rounded-10 bg-white mt-2">
						<uni-list-item title="商家代金券" :showSale="showSale" :rightText="getUserVouchers" @click="coupons"></uni-list-item>
					</view>
					
					<view class="w-100 border rounded-10 bg-white mt-2">
						<view class="font-34 ml-2 mt-1">使用代金币</view>
						<view class="d-flex flex-row a-center ml-2 mt-1 mb-1">
							<input class="" style="height: 80rpx;" v-model="buyCoinText" type="number" placeholder="请输入" @input="buyCoinInput"/>
						</view>
						<view class="d-flex flex-row a-center pb-1 font-24 text-muted">
							<view class="ml-2 text-Orange" v-if="isBuyCoinEnough">可用余额 {{buyCoin}}</view>
							<view class="ml-2" style="color: red;" v-else>*超出可用余额</view>
						</view>
					</view>
					
					<view class="w-100 border rounded-10 bg-white mt-2">
						<view class="font-34 ml-2 mt-1">使用账户余额</view>
						<view class="d-flex flex-row a-center ml-2 mt-1 mb-1">
							<input class="" style="height: 80rpx;" v-model="luckyCoinText" type="number" placeholder="请输入" @input="luckyCoinInput"/>
						</view>
						<view class="d-flex flex-row a-center pb-1 font-24 text-muted">
							<view class="ml-2 text-Orange" v-if="isLuckyCoinEnough">可用余额 {{luckyCoin}}</view>
							<view class="ml-2" style="color: red;" v-else>*超出可用余额</view>
						</view>
					</view>
					
					<view class="w-100 border rounded-10 bg-white mt-2 d-flex flex-row a-center j-sb p-2" style="width: 94%;">
						<view class="font-34">满减活动</view>
						<view class="text-muted">-1.00元</view>
					</view>
					
					<view class="w-100 d-flex flex-row a-center mt-2 j-end">
						<view class="d-flex flex-row mr-2">
							<view class="">优惠：</view>
							<view class="text-price">￥{{saleAmount}}</view>
						</view>
					</view>
					
					<view class="w-100 d-flex flex-row a-center mt-2 j-end">
						<view class="d-flex flex-row mr-2">
							<view class="">合计：</view>
							<view class="text-price">￥{{payAmount}}</view>
						</view>
					</view>
					
					<view class="" style="height: 200rpx;"></view>
				</view>
			</view>
		</scroll-view>
		
		<view class="w-100 d-flex a-center j-center mt-4 position-absolute" style="bottom: 0; margin-bottom: 40rpx;">
			<view class="font-38 btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
			style="width: 90%;" @click="checkIsOverflow">支付{{payAmount}}元</view>
		</view>
	</view>
</template>

<script>
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		components:{
			uniListItem
		},
		data() {
			return {
				amount: 0,
				payAmount: 0,
				saleAmount: 0,
				windowHeight: 0,
				amountList: [],
				rightText1: '暂无可用',
				orderID: '',
				couponsPrice: 0,
				buyCoin: 0,
				luckyCoin: 0,
				buyCoinText: '',
				luckyCoinText: '',
				luckyCoinTips: '',
				voucherIDs: '',
				isBuyCoinEnough: true,
				isLuckyCoinEnough: true,
				showSale: false,
				isOverflow: false
			}
		},
		onLoad: function(option){
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
				}
			})
			this.orderID = option.orderID
			this.amount = Number(option.price).toFixed(2)
			this.payAmount = this.amount
			this.getAmountList()
		},
		computed:{
			...mapState({
				merchantID:state=>state.merchant.merchantID,
				couponsList:state=>state.user.couponsList,
			}),
			...mapGetters([
			]),
			
			getUserVouchers(){
				if(this.amountList.UserVouchers){
					let length = this.amountList.UserVouchers.length
					if(length > 0){
						this.getCouponsPrice(this.couponsList, this.amountList.UserVouchers)
						this.getPayAmount()
						
						if(this.couponsPrice > 0){
							return '- ' + this.couponsPrice
						}else{
							return '可用'+ length +'张'
						}
					}else{
						return '暂无可用'
					}
				}else{
					return '暂无可用'
				}
			},
		},
		methods:{
			...mapMutations([
			]),
			...mapActions([
			]),
			getAmountList() {
				var _self = this;
				_self.$H.post('/api/Order/UserAmountInfo', {
					MerchantID: _self.merchantID
				}, {
					token:true,
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.amountList = res.data
						_self.luckyCoin = res.data.LuckyCoin
						_self.buyCoin = res.data.BuyCoin
					}else{
						_self.$Common.showToast(res)
					}
				});
			},
			buyCoinInput(e){
				let total = this.amountList.BuyCoin
				let temp = Number(e.detail.value)
				
				if(temp > total){
					this.isBuyCoinEnough = false
					return
				}else{
					this.buyCoinText = temp
					this.isBuyCoinEnough = true
				}
				this.getPayAmount()
			},
			luckyCoinInput(e){
				let total = this.amountList.LuckyCoin
				let temp = Number(e.detail.value)
				
				if(temp > total){
					this.isLuckyCoinEnough = false
					return
				}else{
					this.luckyCoinText = temp
					this.isLuckyCoinEnough = true
				}
				this.getPayAmount()
			},
			getCouponsPrice(m_idList, voucherList){
				let temp = 0
				let tempIDs = ''
				for (let i = 0; i < m_idList.length; i++) {
					if(i == 0){
						tempIDs = String(m_idList[i])
					}else{
						tempIDs = tempIDs + ',' + String(m_idList[i])
					}
					for (let j = 0; j < voucherList.length; j++) {
						if(voucherList[j].ID == m_idList[i]){
							temp = temp + voucherList[j].Amount
							break
						}
					}
				}
				this.couponsPrice = temp
				this.voucherIDs = tempIDs
			},
			getPayAmount(){
				this.isOverflow = false;
				this.saleAmount = 0
				this.payAmount = this.amount
				if(this.luckyCoinText > 0){
					this.saleAmount = this.saleAmount + this.luckyCoinText
					this.payAmount = this.payAmount - this.luckyCoinText
				}
				if(this.buyCoinText > 0){
					this.saleAmount = this.saleAmount + this.buyCoinText
					this.payAmount = this.payAmount - this.buyCoinText
				}
				if(this.couponsPrice > 0){
					this.showSale = true
					this.saleAmount = this.saleAmount + this.couponsPrice
					this.payAmount = this.payAmount - this.couponsPrice
				}else{
					this.showSale = false
				}
				
				if(this.payAmount < 0) {
					this.isOverflow = true;
					this.payAmount = 0;
				}
				this.saleAmount = Number(this.saleAmount).toFixed(2)
				this.payAmount = Number(this.payAmount).toFixed(2)
			},
			checkIsOverflow(){
				let _self = this
				if(this.isOverflow){
					uni.showModal({
					    title: '提示',
					    content: '使用优惠金额超出订单金额，确定继续支付？',
					    success: function (res) {
					        if (res.confirm) {
					            console.log('用户点击确定');
								_self.payBill()
					        }else if (res.cancel) {
								console.log('用户点击取消');
							}
					    }
					});
				}else{
					_self.payBill()
				}
			},
			payBill(){
				let _self = this
				if((!_self.isBuyCoinEnough) || (!_self.isLuckyCoinEnough)){
					uni.showToast({
						title: '输入值有误，请检查后在提交！',
						icon: 'none',
						duration: 1500
					})
					return
				}
				if(_self.luckyCoinText == '') _self.luckyCoinText = 0;
				if(_self.buyCoinText == '') _self.buyCoinText = 0;
				uni.showLoading({title: '结算中...'})
				let postData = {
					OrderID: _self.orderID,
					UseLuckyCoin: _self.luckyCoinText,
					UseBuyCoin: _self.buyCoinText,
					UseVoucherIDs: _self.voucherIDs
				}
				console.log(postData)
				_self.$H.post('/api/order/PayBill', postData, {
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						if(res.data.PayAmount == 0){
							uni.showModal({
							    title: '提示',
							    content: '支付成功',
								showCancel: false,
							    success: function (res) {
							        if (res.confirm) {
							            uni.navigateBack({
							            	delta: 1
							            })
							        }
							    }
							});
						}else{
							uni.redirectTo({
								url: './payment-pay?price=' + res.data.PayAmount + '&orderID=' + _self.orderID
							})
						}
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			coupons(){
				let list = this.amountList.UserVouchers
				uni.navigateTo({
					url: '../coupons/coupons?list=' + encodeURIComponent(JSON.stringify(list))
				})
			}
		}
	}
</script>

<style>

</style>
