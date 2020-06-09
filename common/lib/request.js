import $store from '@/store/index.js'
export default {
	// 全局配置
	common:{
		// baseUrl:"http://192.168.101.5",
		baseUrl:"https://userapi.tuanmi028.com",
		header:{
			'Content-Type':'application/json;charset=UTF-8',
			'Content-Type':'application/x-www-form-urlencoded'
		},
		data:{},
		method:'GET',
		dataType:'json'
	},
	// 请求 返回promise
	request(options = {}){
		// 组织参数
		options.url = this.common.baseUrl + options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		
		// token
		if (options.token) {
			options.header.Authorization = 'BasicAuth ' + $store.state.user.token;
			options.header.Cookie = $store.state.user.sessionID;
			// 验证token
			// if (!$store.state.user.token) {
			// 	uni.showToast({
			// 		title: '请先登录',
			// 		icon:"none"
			// 	});
				
			// 	return uni.navigateTo({
			// 		url: '/pages/login/login'
			// 	});
			// }
		}
		
		// 请求
		return new Promise((res,rej)=>{
			// 请求之前... todo
			// 请求中...
			uni.request({
				...options,
				success: (result) => {
					// 服务端失败
					if(options.native){
						return res(result)
					}
					if(result.statusCode !== 200){
						if (options.toast !== false) {
							uni.showToast({
								title: result.data.msg || '服务端失败',
								icon: 'none'
							});
						}
						return rej(result.data) 
					}
					// 成功
					let data = result.data
					res(data)
				},
				fail: (error) => {
					uni.showToast({
						title: error.errMsg || '请求失败',
						icon: 'none'
					});
					return rej()
				}
			});
		})
	},
	// get请求
	get(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	// post请求
	post(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	del(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}