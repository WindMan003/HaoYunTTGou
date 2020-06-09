<template>
	<view class="d-flex" style="color: #FF582B;" :class="priceSize">
		<text class="a-self-start mr" :class="unitSize">¥</text>
		<slot />
	</view>
</template>

<script>
	export default {
		props:{
			priceSize:{
				type:String,
				default:"font-28"
			},
			unitSize:{
				type:String,
				default:"font-28"
			},
		}
	}
</script>

<style>
</style>
