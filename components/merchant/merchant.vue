<template>
	<view class="p-2">
		<scroll-view scroll-y="true" :style="'height:'+(scrollH)+'px;'">
			<view class="font-weight">商家名称</view>
			<view class="viewCt">{{ item.Name }}</view>
			<view class="font-weight">地址</view>
			<view class="viewCt">{{ item.Address }}</view>
			<view class="font-weight">联系方式</view>
			<view class="viewCt">{{ item.Contact }}</view>
			<view class="font-weight">商家介绍</view>
			<view class="viewCt">{{ item.Description }}</view>
<!-- 			<view class="font-weight">商家店铺二维码</view>
			<view><image :src="item.QRCodeUrl" style="max-width: 400rpx;" lazy-load="true" mode="widthFix"></image></view> -->
			<view class="font-weight">商家门面</view>
			<view><image :src="item.FaceHttpUrl" style="max-width: 600rpx;" lazy-load="true" mode="widthFix"></image></view>
			<view class="font-weight">更多形象</view>
			<view class="imgs">
				<view v-for="(url, index) in item.ImgList" :key="index">
					<image :src="url" style="max-width: 600rpx;" lazy-load="true" mode="widthFix"></image>
				</view>
			</view>
			<view class="" style="height: 30rpx;"></view>
		</scroll-view>
	</view>
</template>

<script>
	import {mapState, mapGetters, mapActions, mapMutations} from "vuex"
	
	export default {
		data() {
			return {
				item:{},
				scrollH:0
			}
		},
		onLoad() {
			
		},
		computed:{
			...mapState({
				merchantID:state=>state.merchant.merchantID
			})
		},
		methods: {
			initMerchantInfo(scrollH){
				var _self = this
				_self.scrollH = scrollH
				var postData = { id: _self.merchantID }
				_self.$H.post('/api/merchant/Intro', postData, {
					token:true,
				}).then(res=>{
					console.log('initMerchantInfo')
					console.log(res)
					_self.item = res.data
				})
			}
		}
	}
</script>

<style>

</style>
