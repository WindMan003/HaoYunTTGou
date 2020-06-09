export default {
	data() {
		return {
			socketTask: null,
			// 确保websocket是打开状态
			socketOpen: false,
		}
	},
	initWebSocket(callback, msg, m_url) {
		var _self = this
		// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
		console.log(m_url)
		_self.socketTask = uni.connectSocket({
			url: m_url,
			// url: 'wss://ws.tuanmi028.com:8080',
			success(data) {
				console.log(data);
				console.log("websocket打开成功");
				// _self.heartCheck.reset().start();
			},
			fail(data) {
				console.log(data);
				console.log("websocket打开失败");
				_self.reconnect(callback, msg, m_url);
			},
		});
		
		_self.socketTask.onOpen((res)=>{
			console.log("WebSocket连接正常打开中...！")
			_self.socketOpen = true
			
			// 注：只有连接正常打开中 ，才能正常成功发送消息
			_self.socketTask.send({
				data: msg,
				async success() {
					console.log("消息发送成功");
				},
			});
			
			// 注：只有连接正常打开中 ，才能正常收到消息
			_self.socketTask.onMessage((res) => {
				console.log("收到服务器内容：" + res.data);
				if(res.data != 'connected'){
					callback(JSON.parse(res.data))
				}
			});
		})
		
		_self.socketTask.onError((res) => {
			console.log("连接出错：" + JSON.stringify(res));
			// _self.closeSocketNet()
			// setTimeout(()=>{
			_self.reconnect(callback, msg, m_url);
			// }, 1000)
		})
		
		// 这里仅是事件监听【如果socket关闭了会执行】
		_self.socketTask.onClose(() => {
			console.log("已经被关闭了")
			// if(_self.socketOpen){
			// 	_self.initWebSocket(callback, msg, m_url)
			// }
		})
	},
	// 关闭websocket
	closeSocketNet() {
		var _self = this
		if(_self.socketOpen){
			_self.socketTask.close({
				success(res) {
					_self.socketOpen = false
					console.log("关闭成功", res)
				},
				fail(err) {
					console.log("关闭失败", err)
				}
			})
		}
	},
	reconnect(callback, msg, m_url) {
		var _self = this
	    if(_self.socketOpen) return;
	    _self.socketOpen = true;
	    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
	        _self.initWebSocket(callback, msg, m_url);
	        _self.socketOpen = false;
	    }, 2000);
	},
	//心跳检测
	// heartCheck() {
	// 	var _self = this
	// 	setTimeout(()=>{
	// 		if(!_self.userOff){
				
	// 		}
	// 	}, _self.timeout)
		
		
		
		
		
	//     var timeout = 10000,        //10S发一次心跳
	//     var timeoutObj = null,
	//     var serverTimeoutObj = null,
	//     reset: function(){
	//         clearTimeout(this.timeoutObj);
	//         clearTimeout(this.serverTimeoutObj);
	//         return this;
	//     },
	//     start: function(){
	//         var _self = this;
	//         _self.timeoutObj = setTimeout(function(){
	//             //这里发送一个心跳，后端收到后，返回一个心跳消息，
	//             //onmessage拿到返回的心跳就说明连接正常
	//             _self.socketTask.send("ping");
	//             console.log("ping!")
	//             _self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
	//                 _self.socketTask.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
	//             }, _self.timeout)
	//         }, _self.timeout)
	//     }
	// }
}