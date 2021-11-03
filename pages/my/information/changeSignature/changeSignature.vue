<template>
	<view class="">
		<view style="padding: 32rpx 0;">
			<input class="color_666769" type="text" v-model="sign" maxlength="30" style="padding: 24rpx 32rpx;border-bottom: 1px solid #F7F7F7;"/>
			<view class="color_919397" style="padding-left: 32rpx;padding-top: 24rpx;">
				用一句话精彩描述自己
			</view>
		</view>
		<view class="wrap safe-bottom">
			<view class="wrapBtn">
				<view class="button" style="width: 686rpx;" @tap="saveSign">
					保存
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sign:''
			};
		},
		onLoad(options) {
			this.sign =options.sign
		},
		methods:{
			saveSign(){
					this.$http.post('admin/user/app/update', {
						sign:this.sign
					}).then(res => {
						if(res.data.code==0){
							uni.navigateBack({
								delta:1
							})
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							})
						}
					});
			}
		}
	}
</script>

<style lang="scss">
.wrap{
	width: 100%;
	position: fixed;
	bottom: 0;
	background-color: #FFFFFF;
	.wrapBtn{
		margin: 24rpx 32rpx 32rpx;
	}
}
</style>
