<template>
	<view class="" style="background-color: #F5F5F5;" :style="'height:'+ windowHeight + 'px'">
		<scroll-view scroll-y :style="'height:'+ scrollH + 'px'">
			<view class="d-flex a-center j-center" style="height: 100rpx;">
				<view class="d-flex a-center j-center rounded-10" style="width: 94%; background-color: #48D1CC; height: 80rpx;">
					<view class="font-32">
						桌子号：{{tableID}}
					</view>
				</view>
			</view>
			<view class="mt-1 d-flex a-center j-center">
				<view class="rounded-10 d-flex flex-column bg-white pb-1" style="width: 94%">
					<view class="ml-2 mr-2">
						<view class="mt-1 d-flex flex-row a-center position-relative" v-if="!isshenhe">
							<view class="font-36 font-weight">{{merchantInfo.Name}}</view>
							<view class="position-absolute border rounded-25 pl-2 pr-2" @click="continueAdd"
							style="border-color: #48D1CC; color: #48D1CC; right: 10rpx;">
								继续点餐
							</view>
						</view>
						<view class="d-flex flex-column">
							<view class="mt-2" style="color: #48D1CC;">已点商品</view>
							<block v-for="(item, index) in cartGoodsList" :key="index">
								<view class="d-flex flex-row a-center mt-2">
									<view class="font-30" style="width: 25%;">{{item.ProductName}}</view>
									<view class="font-28" style="width: 45%;">{{getSpecStr(item)}}</view>
									<view class="font-28" style="width: 15%;">x{{item.Count}}</view>
									<view class="font-30 font-weight" style="width: 15%;">{{'¥'+getOneGoodTotalPrice(item)}}</view>
								</view>
							</block>
							<view class="d-flex flex-row a-center mt-2" v-if="getServiceAmount > 0">
								<view class="font-30" style="width: 85%;">服务费</view>
								<view class="font-30 font-weight" style="width: 15%;">{{'¥'+getServiceAmount}}</view>
							</view>
							<view class="mt-2 border-bottom"></view>
							<view class="position-relative mt-3" style="height: 80rpx;">
								<view class="position-absolute" style="right: 30rpx;">
									<view class="d-flex flex-row">
										<view class="font-36">总价</view>
										<view class="font-36 font-weight" style="color: #FF582B;">{{'¥'+totalPrice}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="d-flex a-center j-center mt-3" style="height: 100rpx;" v-if="merchantStatus.IsNeedServiceFee == 1 && !isshenhe && OrderID == 0">
				<view class="d-flex a-center flex-row rounded-10 bg-white position-relative" style="width: 94%; height: 100rpx;">
					<view class="ml-3 font-32 font-weight" style="width: 40%;">
						用餐人数
					</view>
					<view class="d-flex flex-row a-center j-end p font-30" style="width: 60%;">
						<input style="width: 100rpx;" type="number" placeholder="请输入" @blur="userCountInput"/>
						<view class="ml-1 mr-2">人</view>
					</view>
				</view>
			</view>
			<view class="d-flex a-center j-center mt-3" style="height: 100rpx;">
				<view class="d-flex a-center flex-row rounded-10 bg-white position-relative" style="width: 94%; height: 100rpx;">
					<view class="ml-3 font-32 font-weight" style="width: 20%;">
						备注
					</view>
					<view class="d-flex flex-row a-center" style="width: 80%; height: 80rpx;" @click="gotoNote">
						<view class="position-absolute p" style="right: 15rpx;">
							<view class="">{{cartNote}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="w-100 bottom-0 d-flex flex-row position-absolute" style="height: 120rpx; margin-bottom: 40rpx; background-color: #696969;">
			<view class="d-flex flex-row a-center ml-3">
				<text class="font-36" style="color: #FFFFFF;">{{'¥'+totalPrice}}</text>
			</view>
		
			<view class="position-absolute" style="right: 20rpx;" @click="sureOrder">
				<view class="d-flex a-center j-center" style="height: 120rpx;">
					<view class="pl-4 pr-4 p-1 font-36 rounded-50" 
					:style="isClick ? 'background-color: #48D1CC':'background-color: #C8C7CC'"
					style="color: #FFFFFF; background-color: #48D1CC;">
						确认订单
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		components:{
		},
		data() {
			return {
				scrollH:0,
				isTouch:true,
				cartID:0,
				windowHeight: 0,
				isClick: true,
				userCount: 0,
				oldPrice: 0,
				totalPrice: 0,
			}
		},
		onLoad: function(option){
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
					this.scrollH = res.windowHeight - uni.upx2px(165)
				}
			})
			
			this.cartID = option.cartID
			this.totalPrice = Number(option.totalPrice)
			this.oldPrice = this.totalPrice
		},
		computed:{
			...mapState({
				tableID:state=>state.merchant.tableID,
				cartGoodsList:state=>state.cart.cartGoodsList,
				merchantID:state=>state.merchant.merchantID,
				merchantStatus:state=>state.merchant.merchantStatus,
				merchantInfo:state=>state.merchant.merchantInfo,
				cartNote:state=>state.cart.cartNote,
				OrderID:state=>state.cart.OrderID,
				isshenhe:state=>state.user.isshenhe
			}),
			...mapGetters([
			]),
			getServiceAmount(){
				return this.merchantStatus.ServiceUnitPrice * this.userCount
			}
		},
		methods:{
			...mapMutations([
				'clearCartList',
				'updateOrderID',
				'updateCartId'
			]),
			...mapActions([
			]),
			userCountInput(e){
				this.userCount = e.detail.value
				if(this.userCount < 1){
					uni.showToast({title: '请输入正确的用餐人数', icon: 'none', duration: 1500})
					return
				}
				if(this.oldPrice != this.totalPrice){
					this.totalPrice = this.oldPrice
				}
				let temp = this.merchantStatus.ServiceUnitPrice * this.userCount
				this.totalPrice = this.totalPrice + temp
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
			continueAdd(){
				uni.navigateBack({
					delta: 1
				})
			},
			sureOrder(){
				var _self = this;
				uni.showModal({
				    title: '提示',
				    content: '确认提交订单',
				    success: function (res) {
				        if (res.confirm) {
				            _self.submitOrder()
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			submitOrder(){
				let _self = this;
				if(_self.merchantStatus.IsNeedServiceFee == 1 && _self.userCount < 1 && _self.OrderID == 0){
					uni.showToast({title: '请输入正确的用餐人数', icon: 'none', duration: 1500})
					return
				}
				_self.isClick = false
				console.log("确认订单")
				uni.showLoading({title: '订单确认中...'})
				let note = '无'
				if(_self.cartNote != '填写备注要求 >'){
					note = _self.cartNote
				}
				// OrderID>0表示继续添加
				let orderId = 0
				if(_self.OrderID > 0){
					orderId = _self.OrderID
				}
				let postData = {
					MerchantID: _self.merchantID,
					CartID: _self.cartID,
					OrderID: orderId,
					UserCount: _self.userCount,
					UserNote: note
				}
				console.log(postData)
				_self.$H.post('/api/order/SubmitOrder', postData, {
					token:true
				}).then(res=>{
					uni.hideLoading()
					console.log(res)
					if(res.status == 0){
						_self.$Common.showToast(res)
						setTimeout(()=>{
							_self.isClick = true
							_self.updateOrderID(0)
							_self.updateCartId(0)
							_self.clearCartList()
							if(res.data.IsMustPayfirst == 1){
								uni.redirectTo({
									url:'./payment-bill?price='+_self.totalPrice+'&orderID='+res.data.OrderID,
								})
							}else{
								uni.navigateBack({
									animationType: 'pop-out',
									animationDuration: 200
								})
							}
						}, res.messageShowTime)
					}else{
						_self.isClick = true
						_self.$Common.showToast(res)
					}
				})
			},
			getOneGoodTotalPrice(m_item){
				let total = m_item.Price*m_item.Count
				let numStr = total.toString()
				let index = numStr.indexOf('.')
				let result = Number(numStr.slice(0, index + 3))
				
				return result
			},
			gotoNote(){
				uni.navigateTo({
					url:'../note/note'
				})
			}
		}
	}
</script>

<style>

</style>
