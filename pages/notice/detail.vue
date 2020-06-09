<template>
	<view class="p-2">
		<view class="text-center pb-1">
			<view class="font-weight">{{ item.Name }}</view>
			<view class="text-muted">{{ item.CreateTime }}</view>
		</view>

		<divider></divider>
		<view class="pt-2" style="text-indent: 2em;word-break: break-all">{{ item.Contents }}</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			let id = e.id;
			this.loadData(id);
		},
		data() {
			return {
				item: {}
			};
		},
		methods: {
			loadData(id) {
				var _self = this
				let url = '/api/merchant/NoticeDetail';
				let postData = { id: id };
				_self.$H.post(url, postData).then(res => {
					_self.item = res.data;
				});
			}
		}
	};
</script>

<style>
	
</style>
