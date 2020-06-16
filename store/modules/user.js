export default {
	state:{
		userinfo:false,
		token:false,
		loginStatus:false,
		sessionID:false,
		userSite:false,
		
		appConfig:false,
		signkey:'_qwe57812HGGas_iii87idFF425',
		isshenhe: true
	},
	mutations:{
		// 初始化数据
		initUser(state){
			let userinfo = uni.getStorageSync('userinfo')
			if (userinfo) {
				userinfo = JSON.parse(userinfo)
				console.log(userinfo)
				
				state.userinfo = userinfo
				state.token = userinfo.token
				state.sessionID = userinfo.sessionID
				state.userSite = userinfo.userSite
				state.loginStatus = true
			}
		},
		// 登录
		login(state, userinfo){
			state.userinfo = userinfo
			state.token = userinfo.token
			state.sessionID = userinfo.sessionID
			state.userSite = userinfo.userSite
			state.loginStatus = true
			uni.setStorageSync('userinfo',JSON.stringify(userinfo))
		},
		// 退出
		logout(state){
			state.token = false
			state.userinfo = false
			state.loginStatus = false
			uni.removeStorageSync('userinfo')
		},
		
		initAppconfig(state, appConfig){
			if(appConfig){
				state.appConfig = appConfig
			}
		},
		
		initIsShenhe(state, m_shenhe){
			state.isshenhe = m_shenhe
		}
	},
	actions:{
		// 登录
		initLogin({commit}){
			var _self = this
			uni.showLoading({title:'登陆中...'})
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
							uni.showLoading({title: '登陆中...'})
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
									_self.initMerchantConfig()
								}
							})
						},
						fail:function(res){
							console.log('获取用户信息失败！' + res.errMsg)
							uni.showLoading({title: '登陆中...'})
							_self.$H.post('/api/user/login',{
								WxCode:loginRes.code,
								account:loginRes.code,
								password:loginRes.code,
								Gender:'',
								AvatarUrl:'',
								NickName:'',
								City:'',
								Province:''
							}).then(res=>{
								console.log(res)
								uni.hideLoading()
								if(res.status == 0){
									//存储用户信息
									_self.login(res.data)
									_self.initMerchantConfig()
								}
							})
						}
					});
				}
			});
		}
	}
}