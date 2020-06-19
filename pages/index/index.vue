<template>
	<view class="main">
		<view class="w-100 main-bg-color border-bottom position-relative" style="height: 80rpx;">
			<view class="d-flex flex-row">
				<view class="d-flex flex-row a-center j-center font-32"
				style="width: 120rpx; height: 80rpx;"
				v-for="(item,index) in tabs" :key="index" @tap="changeTab(index)">
					<text :class="tabIndex === index ? 'border-bottom-6 font-weight':'main-text-color'">
						{{item.name}}
					</text>
				</view>
				<!-- <view class="border font-28 pl-1 pr-1 position-absolute text-center" 
				style="border-color: #EE7621; color: #EE7621; right: 15rpx; bottom: 10rpx; border-radius: 8rpx;"
				@click="onOrderList">
					我的订单
				</view> -->
			</view>
		</view>
		
		
		<swiper :duration="150" :style="'height:'+(scrollH)+'px;'" :current="tabIndex" @change="onChangeTab">
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
								<view class="position-absolute" style="right: 5rpx; top: -25rpx;" v-if="getGoodsTypeCount(item.ID)>0">
									<uni-badge :text="getGoodsTypeCount(item.ID)" type="error"></uni-badge>
								</view>
							</view>
						</view>
					</scroll-view>
					<!-- 右侧子导航 -->
					<scroll-view :croll-with-animation="true" scroll-y style="left: 24%; width: 76%;"
					:style="'height:'+(scrollH-45)+'px;'" @scroll="asideScroll" :scroll-top="tabScrollTop">
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
										
										<block v-if="!isshenhe">
											<block v-if="rowData.Specifications || rowData.TasteList">
												<view class="position-absolute" style="right: 0; bottom: 0;">
													<view class="border mr-2 font-28 d-flex a-center j-center pl-4 pr-4" 
													style="border-radius: 5rpx; background: #FFA500;" @click="choosePopup(rowData.ID)">
														<text v-if="rowData.Specifications">选规格</text>
														<text v-else>选口味</text>
													</view>
													<view class="position-absolute" style="right: 10rpx; top: -20rpx;" v-if="getGoodsCount(rowData.ID)>0">
														<uni-badge :text="getGoodsCount(rowData.ID)" type="error"></uni-badge>
													</view>
												</view>
											</block>
											<block v-else>
												<view class="position-absolute" style="right: 0; bottom: 0; z-index: 16;">
													<hx-number-box :value="getGoodsCount(rowData.ID)" :nameid="rowData.ID" @createid="openCreateCartId" />
												</view>
											</block>
										</block>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				
				<!-- 购物车 -->
				<block v-if="!isshenhe">
					<view class="main-bg-color-w d-flex flex-row a-center position-relative" style="height: 90rpx;" :style="'z-index:'+zindex">
						<view class="d-flex flex-row a-center" style="width: 80%;"  @click="openCartDetail">
							<view class="ml-3 position-relative" style="width: 80rpx;">
								<image src="/static/store/cart.png" mode="widthFix"></image>
								<view class="position-absolute" style="right: -15rpx; top: -5rpx;" v-if="getCartCount>0">
									<uni-badge :text="getCartCount" type="error"></uni-badge>
								</view>
							</view>
										
							<view class="ml-4" v-if="isManyPeople && cartId != 0">
								<view class="d-flex flex-row a-center">
									<text class="font-30">购物车ID:</text>
									<text class="font-30" style="color: #FF582B;">{{cartId}}</text>
								</view>
							</view>
							
							<view class="ml-4" v-if="totalPrice > 0">
								<view class="d-flex flex-row a-center">
									<text class="font-30">价格:</text>
									<text class="font-30" style="color: #FF582B;">￥{{totalPrice}}</text>
								</view>
							</view>
						</view>

						<view class="position-absolute" style="height: 90rpx; right: 0;" 
						@click="toSettlement" v-if="!isManyPeople || cartId != 0"
						:style="totalPrice > 0 ? 'background-color: #FFA500':'background-color: #C0C0C0;'">
							<view class="d-flex a-center pl-2 pr-2 font-32 font-weight" style="height: 90rpx; color: #FFFFFF;">
								去结算>>
							</view>
						</view>
						
						<view class="position-absolute" style="height: 90rpx; background-color: #FFA500; right: 0;"
						@click="openCreateCartId" v-if="isManyPeople && cartId == 0">
							<view class="d-flex a-center pl-2 pr-2 font-32 font-weight" style="height: 90rpx;">
								创建/加入购物车
							</view>
						</view>
					</view>
				</block>
				<!-- 商品规格层 -->
				<goods-popup ref="goodspopup" @createid="openCreateCartId"></goods-popup>
				
				<!-- 购物车抽屉层 -->
				<cart-popup ref="cartpopup"></cart-popup>
				
				<!-- 创建购物车ID层 -->
				<block v-if="isManyPeople">
					<create-cartid-popup ref="creatidpopup"></create-cartid-popup>
				</block>
			</swiper-item>
			<swiper-item>
				<merchant ref="merchantRef"></merchant>
			</swiper-item>
			<swiper-item>
				<!-- 公告 -->
				<notice ref="noticeRef"></notice>
			</swiper-item>
			<!-- <swiper-item>333333333</swiper-item> -->
		</swiper>
	</view>
</template>

<script>
	import hxNumberBox from "@/components/uni-number-box/uni-number-box.vue";
	import price from "@/components/common/price.vue"
	import goodsPopup from "@/components/cart/goods-popup.vue"
	import cartPopup from "@/components/cart/cart-popup.vue"
	import createCartidPopup from "@/components/cart/create-cartid-popup.vue"
	import notice from "@/components/notice/notice.vue"
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	import merchant from "@/components/merchant/merchant.vue"
	import websocket from "@/common/lib/websocket.js"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		components:{
			hxNumberBox,
			price,
			goodsPopup,
			cartPopup,
			createCartidPopup,
			merchant,
			notice,
			uniBadge
		},
		props:{
			
		},
		data() {
			return {
				zindex:90,
				showCartDrawer:false,
				showPopup:false,
				scrollH:500, //可滑动区域高度
				tabIndex:0,
				currentId:1,
				categoryList:[],
				goodsList:[],
				tabScrollTop: 0,
				sizeCalcState: false,
				isFirst: true,
				cartIsOpen: false,
				//tabs
				tabs: [
					{name:'商品'},
					{name:'商家'},
					{name:'公告'},
					// {name:'平台'},
				]
			}
		},
		onLoad(){
			//获取可视区域高度
			uni.getSystemInfo({
				success: (res) => {
					this.scrollH = res.windowHeight - uni.upx2px(75)
				}
			})

			this.initMerchantConfig()
		},
		computed:{
			...mapState({
				cartGoodsList:state=>state.cart.cartGoodsList,
				cartId:state=>state.cart.cartId,
				totalPrice:state=>state.cart.totalPrice,
				merchantID:state=>state.merchant.merchantID,
				tableID:state=>state.merchant.tableID,
				isManyPeople:state=>state.merchant.isManyPeople,
				isshenhe:state=>state.user.isshenhe
			}),
			...mapGetters([
				'getGoodsCount',
				'getGoodsTypeCount',
				'getCartCount'
			]),
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
			...mapMutations([
				'updateCartGoodsList',
				'updateMerchantInfo',
				'updateMerchantStatus'
			]),
			...mapActions([
				'updateAllGoodsListFunc',
				'updateManyPeopleFunc',
				'updateCartIdFunc'
			]),
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
						if(res.data.OpenMultiplayerBuy == 0){
							_self.updateManyPeopleFunc(false)
						}else if(res.data.OpenMultiplayerBuy == 1){
							_self.updateManyPeopleFunc(true)
						}
						_self.updateMerchantStatus(res.data)
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
						_self.updateAllGoodsListFunc(_self.goodsList)
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
						_self.updateMerchantInfo(res.data)
						//初始化商家信息
						_self.$refs.merchantRef.initMerchantInfo(_self.scrollH)
						//初始化公告信息
						_self.$refs.noticeRef.initNoticeList(_self.scrollH)
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
			//规格选择
			choosePopup(goodsId){
				this.zindex = 90
				this.$refs.goodspopup.showPopup(goodsId)
			},
			//购物车详情页
			openCartDetail(){
				if(this.cartId != 0){
					if(!this.cartIsOpen){
						this.zindex = 100
						this.$refs.cartpopup.showCartPopup()
						this.cartIsOpen = true
					}else{
						this.$refs.cartpopup.closeCartPopup()
						this.cartIsOpen = false
					}
				}else{
					uni.showToast({title: '您还没有点餐', icon: 'none', duration: 1500})
				}
			},		
			//创建购物车ID
			openCreateCartId(){
				this.$refs.creatidpopup.showPopup()
			},
			toSettlement(){
				if(this.cartGoodsList.length > 0){
					uni.navigateTo({
						url:'../payment/payment?cartID=' + this.cartId + '&totalPrice=' + this.totalPrice
					})
				}else{
					uni.showToast({title: '您还没有点餐', icon: 'none', duration: 1500})
				}

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
			
			
		}
	}
</script>

<style>

</style>
