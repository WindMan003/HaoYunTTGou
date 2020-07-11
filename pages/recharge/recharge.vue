<template>
	<view class="h-100 position-relative" style="background-color: #F5F5F5;">
		<view class="bg-white d-flex flex-column">
			<view class="font-32 mt-3 ml-4">充值金额</view>
			<view class="p mt-2 ml-4 a-center d-flex flex-row">
				<view class="font-60">￥</view>
				<input class="ml-1 font-55" style="height: 60rpx;" type="number" value="" @blur="priceInput"/>
			</view>
			<view class="" style="height: 30rpx;"></view>
		</view>
		
		<view class="d-flex flex-row a-center p-1 ml-1" style="height: 60rpx;">支付方式</view>
		<view class="w-100 bg-white d-flex flex-column">
			<!-- #ifdef MP-WEIXIN -->
			<view class="d-flex flex-row a-center pt pb">
				<view class="d-flex flex-row a-center" style="width: 80%;">
					<view class="ml-2 d-flex flex-row a-center">
						<image src="../../static/pay/wxpay.png" style="width: 70rpx;" mode="widthFix"></image>
					</view>
					<view class="font-34 ml-3">微信支付</view>
				</view>
				<view class="d-flex a-center j-center" style="width: 20%;">
					<checkbox-group @change="choosePayTypeWx">
						<label>
							<checkbox value="wxpay" :checked="defaultWx" color="#32CD32" />
						</label>
					</checkbox-group>
				</view>
			</view>
			<!-- #endif -->

			<!-- #ifdef MP-ALIPAY -->
			<view class="d-flex flex-row a-center pt pb">
				<view class="d-flex flex-row a-center" style="width: 80%;">
					<view class="ml-2 d-flex flex-row a-center">
						<image src="../../static/pay/alipay.png" style="width: 70rpx;" mode="widthFix"></image>
					</view>
					<view class="font-34 ml-3">支付宝支付</view>
				</view>
				<view class="d-flex a-center j-center" style="width: 20%;">
					<checkbox-group @change="choosePayTypeAli">
						<label>
							<checkbox value="alipay" :checked="defaultAli" color="#32CD32" />
						</label>
					</checkbox-group>
				</view>
			</view>
			<!-- #endif -->
		</view>
		
		<view class="w-100 bottom-0 d-flex flex-row position-absolute" style="height: 150rpx; margin-bottom: 150rpx;">
			<view class="w-100 d-flex a-center j-center mt-3 position-absolute">
				<view class="font-38 rounded-50 pt-1 pb-1 border text-center" 
				:style="isClick ? 'background-color: #48D1CC':'background-color: #C8C7CC'"
				style="width: 80%; color: #FFFFFF; background-color: #48D1CC;" @click="submitPayOrder">确认支付</view>
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
				payTypeName: 'wxpay',
				defaultWx: true,
				defaultAli: false,
				price: 0,
				isClick: true,
				wvid: 0,
				callback: null
			}
		},
		onLoad(option) {
			console.log(option)
			this.wvid = option.wvid
			this.callback = option.callback
		},
		onBackPress(options) {
			let m_webview = this.getWebview(this.wvid)
			if(m_webview){
				m_webview.evalJS(this.callback)
			}
		},
		computed:{
			...mapState({
				merchantID:state=>state.merchant.merchantID,
				webview:state=>state.user.webview
			}),
			...mapGetters([
			]),
		},
		methods:{
			...mapMutations([
				'initWebview'
			]),
			...mapActions([
			]),
			priceInput(e){
				this.price = e.detail.value
			},
			getWebview(wvid){
				for (let i = 0; i < this.webview.length; i++) {
					console.log(this.webview[i].wvid)
					console.log(wvid)
					if(this.webview[i].wvid == wvid){
						return this.webview[i].webview
					}
				}
				return null
			},
			choosePayTypeWx(e){
				var typeName = e.detail.value
				if(typeName.length > 0){
					this.payTypeName = typeName[0]
					this.defaultWx = true
					this.defaultAli = false
				}else{
					this.payTypeName = ''
				}
				console.log(this.payTypeName)
			},
			choosePayTypeAli(e){
				var typeName = e.detail.value
				if(typeName.length > 0){
					this.payTypeName = typeName[0]
					this.defaultAli = true
					this.defaultWx = false
				}else{
					this.payTypeName = ''
				}
				console.log(this.payTypeName)
			},
			submitPayOrder(){
				var _self = this
				_self.isClick = false
				if(_self.payTypeName == ''){
					uni.showToast({title:'请选择支付方式', icon:'none', duration:1500})
					return
				}
				uni.showLoading({title:'提交支付中...', mask:true})
				_self.$H.post('/api/user/SubmitPayOrder',{
					Amount: _self.price,
					PayChannel: 2
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					_self.isClick = true
					if(res.status == 0){
						_self.goToPay(res.data)
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			goToPay(m_orderID){
				var _self = this
				_self.isClick = false
				_self.$H.post('/API/User/CreateUserPayWxOrder',{
					OrderID: m_orderID
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					_self.isClick = true
					if(res.status == 0){
						_self.payHandler(res.data)
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			payHandler(m_data) {
				var that = this;
				m_data = JSON.parse(m_data)
				// #ifdef MP-WEIXIN
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: m_data.toString(),
					timeStamp: m_data.timeStamp.toString(), // 时间戳从1970年1月1日至今的秒数，即当前的时间
					nonceStr: m_data.nonceStr, // 随机字符串，长度为32个字符以下
					package: m_data.package, // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx
					signType: 'MD5', //签名算法，暂支持 MD5
					paySign: m_data.paySign, // 签名
					success: function (res) {
						// 支付成功的回调中
						uni.showModal({
						    title: '提示',
						    content: '微信支付成功',
							showCancel: false,
						    success: function (res) {
						        if (res.confirm) {
									let m_webview = that.getWebview(that.wvid)
									if(m_webview){
										m_webview.evalJS(that.callback)
									}
									uni.navigateBack({
										delta: 1
									})
						        }
						    }
						});
					},
					fail: function (err) {
						console.log(err)
						// 支付失败的回调中 用户未付款
						uni.showToast({
							title: '支付取消',
							duration: 1500,
						});
					}
				});
				// #endif
			}
		}

	}
</script>

<style>

</style>
