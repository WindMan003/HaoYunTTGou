<template>
	<view class="d-flex flex-column a-center" style="background-color: #F5F5F5;" :style="'height:'+ windowHeight + 'px'">
		<view class="mt-2" style="width: 94%;" v-if="isHaveData">
			<view class="font-32 font-weight ml-1" style="height: 70rpx;">可用代金券({{list.length}})</view>
			<scroll-view scroll-y="true" :style="'height:'+ scrollH + 'px'">
				<checkbox-group @change="checkboxChange">
					<view class="border rounded-10 bg-white mt-2 p-1" v-for="(item, index) in list" :key="index">
						<view class="d-flex flex-row j-sb font-weight">
							<view class="font-32 ml-1">{{item.Name}}</view>
							<view class="d-flex flex-row a-center">
								<view class="font-38 mr-2 text-price">￥{{item.Amount}}</view>
								<checkbox class="mr-1" :value="item.ID" :checked="isSelected(item.ID)"/>
							</view>
						</view>
					</view>
				</checkbox-group>
			</scroll-view>
		</view>
		<view class="text-muted" v-else>{{noDataTip}}</view>
		<view class="position-absolute bg-white w-100" style="bottom: 0; height: 120rpx;" v-if="isHaveData">
			<view class="d-flex flex-row a-center j-sb mt-2">
				<view class="d-flex flex-row a-center ml-3 font-32">
					<view class="">已选代金券</view>
					<view class="text-price ml">￥{{couponsPrice}}</view>
				</view>
				<view class="mr-3 btn-orange-white p-1 pl-5 pr-5 border rounded-10" @click="sureCallBack">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		data() {
			return {
				windowHeight: 0,
				scrollH: 0,
				list: [],
				IDList: [],
				couponsPrice: 0,
				noDataTip: '您当前没有代金券哦~'
			}
		},
		onLoad: function(option){
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
					this.scrollH = this.windowHeight - uni.upx2px(190)
				}
			})
			
			this.list = JSON.parse(decodeURIComponent(option.list))
			console.log(this.list)
			this.getCouponsPrice(this.couponsList)
		},
		computed:{
			...mapState({
				couponsList:state=>state.user.couponsList,
			}),
			
			isHaveData(){
				if(this.list.length > 0){
					return true
				}else{
					return false
				}
			},
		},
		methods: {
			...mapMutations([
				'initCouponsList'
			]),
			checkboxChange(e){
				console.log(e.detail.value)
				this.IDList = e.detail.value
				this.initCouponsList(this.IDList)
				
				this.getCouponsPrice(this.IDList)
			},
			getCouponsPrice(m_idList){
				this.couponsPrice = 0
				for (let i = 0; i < m_idList.length; i++) {
					for (let j = 0; j < this.list.length; j++) {
						if(this.list[j].ID == m_idList[i]){
							this.couponsPrice = this.couponsPrice + this.list[j].Amount
							break
						}
					}
				}
			},
			isSelected(m_id){
				let list = this.couponsList
				for (let i = 0; i < list.length; i++) {
					if(list[i] == m_id){
						return true
					}
				}
				return false
			},
			sureCallBack(){
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>

</style>
