<template>
	<view class="main" style="height: 100%;">
		<view class="d-flex a-center j-center" style="height: 600rpx;">
			<image src="../../static/logo/haoyunTT.png" lazy-load="true" style="width: 400rpx;" mode="widthFix"></image>
		</view>
		<view class="" style="height: 100rpx;"></view>
		
		<view class="d-flex a-center j-center">
			<view class="" style="width: 92%;">
				<button type="primary" open-type="getUserInfo" @getuserinfo="wxUserInfo">微信登录</button>
				<!-- #ifdef MP-WEIXIN -->
				<view class="mt-3" v-if="isShenhe">
					<button type="default" @click="shenheLogin">游客登录</button>
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		data() {
			return {
				isShenhe: false,
				shenheVersion: '1.0.16',
				isHaveMerID: true
			}
		},
		computed:{
			...mapState({
				signkey:state=>state.user.signkey,
			})
		},
		
		onLoad: function(option){
			console.log(option)
			if(option.q){
				// 微信小程序通过普通二维码进入
				let link = decodeURIComponent(option.q)
				option = this.getJsonByLink(link)
				
				console.log(option)
			}
			if(option.MerchantID){
				// 测试直接传入参数
				console.log('true')
				this.isHaveMerID = true
				this.updateMerchantID(option.MerchantID)
				this.updateTableID(option.TableID)
				this.updateCartIdFunc(0)
				this.clearCartList()
			}else{
				// 没有接收到参数，使用默认参数
				console.log('false')
				this.isHaveMerID = false
				this.updateMerchantID('1')
				this.updateTableID('1')
			}
			
			this.getConfigData()
		},
		
		methods: {
			...mapMutations([
				'login',
				'updateMerchantID',
				'updateTableID',
				'initAppconfig',
				'clearCartList',
				'initIsShenhe'
			]),
			...mapActions([
				'updateCartIdFunc'
			]),
			// 获取JSON
			getJsonByLink(m_link){
				let arr = m_link.split("?")[1].split("&");   //先通过？分解得到？后面的所需字符串，再将其通过&分解开存放在数组里
				let obj = {};
				for (let i of arr) {
				  obj[i.split("=")[0]] = i.split("=")[1];  //对数组每项用=分解开，=前为对象属性名，=后为属性值
				}
				return obj
			},
			// 获取是否是审核状态
			getConfigData(){
				var _self = this
				var m_math = Math.ceil(Math.random()*10);
				var keyObj = {'websocket':m_math}
				var keyData = this.$Common.sort_ascii(keyObj, this.signkey)
				_self.$H.post('/api/config/GetAppConfig',{
					websocket: m_math,
					sign: keyData
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.initAppconfig(res.data)
						if(!this.isHaveMerID){
							this.updateMerchantID(res.data.MerchantID)
							this.updateTableID('1')
						}
						console.log(res.data.isWxShenhe)
						console.log(_self.shenheVersion)
						if(res.data.isWxShenhe == _self.shenheVersion){
							console.log('shenhe')
							_self.isShenhe = true
							_self.initIsShenhe(true)
						}else{
							console.log('no-shenhe')
							_self.isShenhe = false
							_self.initIsShenhe(false)
						}
					}
				})
			},
			shenheLogin(){
				var _self = this
				_self.$H.post('/api/user/login',{
					WxCode: '',
					account: 'wxshenhe',
					password: _self.$md5('wxshenhe'),
				}).then(res=>{
					console.log(res)
					_self.$Common.showToast(res)
					if(res.status == 0){
						//存储用户信息
						_self.login(res.data)
						_self.gotoIndex()
					}
				})
			},
			weixinLogin(){
				var _self = this
				uni.login({
					provider: 'weixin',
					success: function (loginRes) {
						console.log(loginRes);
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							success: function (infoRes) {
								console.log(infoRes)
								console.log('用户昵称为：' + infoRes.userInfo.nickName);
								uni.showLoading({title: '登录中...'})
								_self.$H.post('/api/user/login',{
									WxCode:loginRes.code,
									account:loginRes.code,
									password:loginRes.code,
									Gender:infoRes.userInfo.gender,
									AvatarUrl:infoRes.userInfo.avatarUrl,
									NickName:infoRes.userInfo.nickName,
									City:infoRes.userInfo.city,
									Province:infoRes.userInfo.province
								}).then(res=>{
									console.log(res)
									uni.hideLoading()
									if(res.status == 0){
										//存储用户信息
										_self.login(res.data)
										_self.gotoIndex()
									}
								})
							}
						});
					}
				});
			},

			wxUserInfo:function(res){
				if (!res.detail.iv) {
					uni.showToast({
						title: "您取消了授权,登录失败",
						icon: "none",
						duration: 1500
					});
					return false;
				}
				
				this.weixinLogin()
			},
			
			gotoIndex(){
				uni.switchTab({
					url:'../index/index'
				})
			}
		}
	}
</script>

<style>
	
</style>
