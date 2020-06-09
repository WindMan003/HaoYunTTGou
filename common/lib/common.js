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
}