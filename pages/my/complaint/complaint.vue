<template>
	<view class="container">
		<view class="containerWrap">
			<textarea v-model="sendvalue" @input="textAreaInput" maxlength="500" placeholder="您的宝贵意见，我能团队将尽快改进" placeholder-class="textAreaDefault"></textarea>
			<view class="color_BABEC0 mark">你还可以输入{{ inputCount }}字</view>
		</view>
		<button @tap="submit" class="button">提交</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			inputCount: 500,
			sendvalue: ''
		};
	},
	methods: {
		textAreaInput(e) {
			this.inputCount = 500 - e.detail.cursor;
		},
		submit() {
			if(this.sendvalue==""){
				uni.showToast({
					icon: 'none',
					title: '意见不能为空',
					duration:2000
				});
			}else{
				this.$http.post('admin/app/complaint', { content: this.sendvalue }).then(res => {
					if (res.data.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '提交成功',
							success() {
								setTimeout(function() {                           
								        uni.navigateBack();
								    }, 1000)  
							}
						});
					}
				})
			}
		}
	}
};
</script>

<style lang="scss">
.container{
	margin: 60rpx 40rpx 0;
	.containerWrap{
		display: flex;
		flex-direction: column;
		border-radius: 30rpx;
		background-color: #F4F5F6;
		height: 80vh;
		.mark{
			margin: 30rpx;
			font-size: 24rpx;
			text-align: end;
		}
	}
}
.textAreaDefault {
	font-size: 28rpx;
	color: #919397;
	line-height: 48rpx;
}
textarea {
	flex: 1;
	font-size: 28rpx;
	line-height: 48rpx;
	padding: 26rpx 30rpx;
	color: #666769;
}
::v-deep button{
	width: 100%;
	font-size: 32rpx;
	padding: 22rpx 0;
	margin-top: 60rpx;
}
</style>
