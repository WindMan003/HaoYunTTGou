<template>
	<view class="d-flex flex-column a-center j-center">
		<view class="font-30">经度：{{locationList.longitude}}</view>
		<view class="font-30 mt-1">纬度：{{locationList.latitude}}</view>
		<view class="font-30 mt-1" v-if="locationList.name">位置名称：{{locationList.name}}</view>
		<view class="font-30 mt-1" v-if="locationList.address">详细地址：{{locationList.address}}</view>
		
		<view class="border text-center pl-1 pr-1 mt-1" @click="chooseLocation">选择位置</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				locationList: {},
				
			}
		},
		onLoad() {
			this.getLocation()
		},
		methods: {
			getLocation(){
				var _self = this;
				uni.getLocation({
					type: 'wgs84',
					success: function (res) {
						_self.locationList = res
						console.log(res);
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
					}
				});
			},
			chooseLocation(){
				var _self = this;
				uni.chooseLocation({
				    success: function (res) {
						_self.locationList = res
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('经度：' + res.longitude);
						console.log('纬度：' + res.latitude);
				    }
				});
			}
		}
	}
</script>

<style>

</style>
