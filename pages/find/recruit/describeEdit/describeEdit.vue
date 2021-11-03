<template>
	<view>
		<textarea class="text-area" v-model="describe" :maxlength="500" placeholder="请填写具体描述"></textarea>
		<view class="bottom-button-box safe-bottom">
			<view class="bottom-button" @tap="savedescribe">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				describe: ''
			};
		},
		onLoad ({describe}) {
			this.describe = describe
		},
		methods: {
			savedescribe () {
				if (this.describe.trim()) {
					let pages = getCurrentPages()
					let beforePage = pages[pages.length - 2]
					uni.navigateBack({
						success: () => {
							beforePage.$vm.describeChange(this.describe)
						}
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '请填写具体描述'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.text-area {
		box-sizing: border-box;
		width: 100%;
		padding: 40rpx;
		line-height: 48rpx;
	}
	.bottom-button-box {
		padding: 0 40rpx;
		.bottom-button {
			height: 72rpx;
			line-height: 72rpx;
			border-radius: 20rpx;
			background-color: #F74437;
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
		}
	}
</style>
