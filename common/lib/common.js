import $md5 from './md5.js'
export default {
	sort_ascii(obj, signkey) {
		let arr = new Array();
		let num = 0;
		for (let i in obj) {
			arr[num] = i;
			num++;
		}
		let sortArr = arr.sort();
		let str = '';             //自定义排序字符串
		for (let i in sortArr) {
			str += sortArr[i] + '=' + obj[sortArr[i]] + '&';
		}
		//去除两侧字符串
		let char = '&'
		str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
		
		str = str + '&key=' + signkey
		str = $md5(str)
		
		return str;
	},
	showToast(m_data){
		if(m_data.messageShowType == 1){
			// toast提示
			uni.showToast({title: m_data.message, icon: 'none', duration: m_data.messageShowTime})
		}else if(m_data.messageShowType == 2){
			// 弹窗提示
			uni.showModal({
			    title: '提示',
			    content: m_data.message,
				showCancel: false
			});
		}
	}
}