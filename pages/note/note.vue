<template>
	<view class="" style="background-color: #F5F5F5;" :style="'height:'+ windowHeight + 'px'">
		<view class="d-flex a-center j-center" style="height: 300rpx;">
			<view class="bg-white rounded-10 p-1" style="height: 240rpx; width: 94%;">
				<textarea class="ml-1 font-30" placeholder="请输入" :value="note" @input="noteInput"/>
			</view>
		</view>
		
		<view class="w-100 bottom-0 position-absolute" style="height: 100rpx; margin-bottom: 120rpx;">
			<view class="d-flex a-center j-center">
				<view class="font-36 rounded-50 d-flex a-center j-center" @click="sureSubmit"
				style="color: #FFFFFF; background-color: #48D1CC; width: 70%; height: 90rpx;">
					确认提交
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		components:{
		},
		data() {
			return {
				windowHeight: 0,
				note: ''
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
				}
			})
			
			if(this.cartNote != '填写备注要求 >'){
				this.note = this.cartNote
			}
		},
		computed:{
			...mapState({
				cartNote:state=>state.cart.cartNote
			}),
			...mapGetters([
				
			]),
		},
		methods:{
			...mapMutations([
				'initCartNote'
			]),
			...mapActions([
				
			]),
			noteInput(e){
				this.note = e.detail.value
			},
			sureSubmit(){
				this.initCartNote(this.note)
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>

</style>
