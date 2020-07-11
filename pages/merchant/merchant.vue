<template>
	<view class="main">
		<view class="d-flex flex-row w-100 main-bg-color border-bottom" style="height: 80rpx;">
			<view class="d-flex flex-row">
				<view class="d-flex flex-row j-center a-center font-32" style="width: 120rpx; height: 80rpx;"
				v-for="(item,index) in tabs" :key="index" @tap="changeTab(index)">
					<text :class="tabIndex === index ? 'border-bottom-6 font-weight':'main-text-color'">
						{{item.name}}
					</text>
				</view>
			</view>
			
			<view class="d-flex flex-row w-100 a-center j-end">
				<view class="border pl-2 pr-2 rounded-10 mr-5 font-30 btn-orange-white text-center" @click="gotoActivity">
					商家活动
				</view>
			</view>
		</view>
		
		
		<swiper :duration="150" :style="'height:'+(swiperH)+'px;'" :current="tabIndex" @change="onChangeTab">
			<swiper-item class="swiper-item">
				<!-- 左侧分类导航 -->
				<view class="d-flex flex-row w-100">
					<scroll-view scroll-y class="left-bg-color" style="width: 24%;">
						<view class="w-100 d-flex a-center" style="height: 90rpx;"
						v-for="(item,index) in categoryList" :key="index" 
						:class="item.indexId === currentId ? 'left-bg-color-hover':''"
						@click="showCategory(item)">
							<view class="w-100 font-28 text-center position-relative">
								{{item.Name}}
							</view>
						</view>
					</scroll-view>
					<!-- 右侧子导航 -->
					<scroll-view :croll-with-animation="true" scroll-y style="left: 24%; width: 76%;"
					:style="'height:'+scrollH+'px;'" @scroll="asideScroll" :scroll-top="tabScrollTop">
						<view class="ml-3 mt" v-for="(item,index) in categoryList" :key="index"
						:id="'goodsBox'+item.indexId">
							<view class="font-32 bg-color-w position-sticky" style="height: 70rpx; z-index: 18; top: 0;">
								{{item.Name}}
							</view>
					
							<view class="w-100" v-for="(rowData, index2) in goodsList" :key="index2"
							v-if="item.ID == rowData.ProductTypeID">
								<view class="d-flex flex-row mt-2" style="height: 200rpx;">
									<view class="main-bg-color-w" style="width: 170rpx; height: 170rpx; border-radius: 10rpx;">
										<image :src="rowData.MinTitleImgUrl" lazy-load="true" mode="aspectFit" @click="previewImage(index2)"></image>
									</view>
									
									<view class="d-flex flex-1 flex-column ml-2 position-relative" style="height: 180rpx;">
										<view class="font-weight font-32">
											{{rowData.Name}}
										</view>
										<view class="font-28 text-light-muted mt-1">
											已售{{rowData.SellCount}}
										</view>
										<view class="position-absolute" style="bottom: 0;">
											<view class="d-flex flex-row a-end">
												<view class="font-weight"><price>{{rowData.Price}}</price></view>
												<view class="ml font-20 text-light-muted line-through" v-if="rowData.OldPrice != 0">
													<text>￥{{rowData.OldPrice}}</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
			<swiper-item>
				<merchant-info ref="merchantRef"></merchant-info>
			</swiper-item>
			<swiper-item>
				<notice ref="noticeRef"></notice>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import price from "@/components/common/price.vue"
	import notice from "@/components/notice/notice.vue"
	import merchantInfo from "@/components/merchantinfo/merchantinfo.vue"
	
	export default {
		components:{
			price,
			merchantInfo,
			notice
		},
		props:{
			
		},
		data() {
			return {
				merchantID: 0,
				swiperH: 0,
				scrollH: 0,
				tabIndex:0,
				currentId:1,
				categoryList:[],
				goodsList:[],
				tabScrollTop: 0,
				sizeCalcState: false,
				isFirst: true,
				tabs: [
					{name:'商品'},
					{name:'商家'},
					{name:'公告'},
				]
			}
		},
		onLoad:function(option) {
			//获取可视区域高度
			uni.getSystemInfo({
				success: (res) => {
					this.swiperH = res.windowHeight - uni.upx2px(80)
					this.scrollH = this.swiperH
				}
			})
			
			console.log(option)
			this.merchantID = option.merchantID
			// this.merchantID = 1
			this.initMerchantConfig()
		},
		computed:{
			getFilePaths(){
				var temp = this.goodsList
				var tempFilePaths = []
				for (var i = 0; i < temp.length; i++) {
					tempFilePaths.push(temp[i].TitleImgUrl)
				}
				return tempFilePaths
			},
		},
		methods: {
			initMerchantConfig(){
				var _self = this
				//初始化请求商品数据
				_self.$H.post('/api/Merchant/GetMerchantConfig',{
					MerchantID:_self.merchantID
				},{
					token:true,
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.syncGoodsInfo()
					}
				})
			},
			//请求商品信息
			syncGoodsInfo(){
				var _self = this
				//初始化请求商品数据
				_self.$H.post('/api/Merchant/ProductList',{
					MerchantID:_self.merchantID
				},{
					token:true,
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						let tempList = res.data
						tempList.ProductTypeList.forEach((item, index)=>{
							item.indexId = index + 1
							item.number = 0
						})
						tempList.ProductList.forEach((item, index)=>{
							item.id = index + 1
						})
						_self.categoryList = tempList.ProductTypeList
						_self.goodsList = tempList.ProductList
						_self.getMerchantInfo()
					}
				})
			},
			//获取商家信息
			getMerchantInfo(){
				var _self = this
				var postData = { 
					id: _self.merchantID
				}
				_self.$H.post('/api/merchant/Intro', postData).then(res=>{
					console.log(res)
					if(res.status == 0){
						//初始化商家信息
						_self.$refs.merchantRef.initMerchantInfo(_self.swiperH, _self.merchantID)
						//初始化公告信息
						_self.$refs.noticeRef.initNoticeList(_self.swiperH, _self.merchantID)
					}
				})
			},
			previewImage(index){
				var tempFilePaths = this.getFilePaths
				uni.previewImage({
					current:index,
					urls:tempFilePaths,
					indicator:'number',
					loop:true
				})
			},
			changeTab(index){
				this.tabIndex = index
			},
			//监听滑动列表
			onChangeTab(e){
				this.changeTab(e.detail.current)
			},
			//一级分类点击
			showCategory(item){
				if(this.isFirst){
					//点击后计算属性
					this.isFirst = false
					this.calcSize()
					setTimeout(()=>{
						this.showCategory(item)
					}, 200)
				}else{
					this.currentId = item.indexId;
					this.tabScrollTop = this.categoryList[item.indexId - 1].top + 5;
				}
			},
			asideScroll(e){
				let that = this;
				if(that.isFirst){
					that.isFirst = false
					that.calcSize()
				}else{
					let scrollTop = Math.round(e.detail.scrollTop);
					let tabs = that.categoryList.filter(item=>item.top <= scrollTop).reverse();
					if(tabs.length > 0){
						that.currentId = tabs.length
					}
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.categoryList.forEach(item=>{
					if(!this.sizeCalcState){
						let view = uni.createSelectorQuery().select("#goodsBox" + item.indexId);
						view.fields({
							size: true
						}, data => {
							item.top = h;
							h += Math.round(data.height);
							item.bottom = h;
							this.sizeCalcState = true;
						}).exec();
					}
				})
			},
			gotoActivity(){
				console.log('gotoActivity')
				uni.navigateTo({
					url: '../activity/activity-newmerchant?merchantID='+this.merchantID
				})
			}
		}
	}
</script>

<style>

</style>
