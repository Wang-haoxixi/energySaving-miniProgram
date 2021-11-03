<template>
	<view class="container">
		<view class="flexRow">
			<view class="color_303031 bold rankTitle">评分</view>
			<view class="flexRowStart rank">
				<uni-rate margin="20" size="40" :value="rank" @change="rankChange"></uni-rate>
			</view>
		</view>
		<textarea focus="true" placeholder="请输入评论内容" placeholder-class="inputDefault" v-model="input" auto-height maxlength="255"></textarea>
		<view class="bottom">
			<button @tap="upload" class="button" :disabled="input.length<1" style="border: none;color: #FFFFFF;">提交</button>
		</view>
	</view>
</template>

<script>
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	export default {
		data() {
			return {
				targetId: '',
				type: '',
				input: '',
				rank: 5,
			};
		},
		methods: {
			rankChange(e) {
				this.rank = e.value
			},
			upload() {
				let that = this
				that.$http.post('dms/shop_comment/create', {
					targetId: that.targetId,
					content: that.input,
					type: that.type,
					rank: that.rank
				}).then(res => {
					if (res.data.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '提交成功',
							success() {
								setTimeout(function() {
									uni.navigateBack();
									that.status = false
								}, 1000)
							}
						});
					}
				})
			}
		},
		onLoad(option) {
			this.targetId = option.targetId;
			this.type = option.type;
		}
	}
</script>

<style lang="scss">
	button::after {
		border: none;
	}

	.bottom {
		position: fixed;
		bottom: 40rpx;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.button {
		width: 670rpx;
	}

	.inputDefault {
		color: #BABEC0;
		line-height: 28rpx;
		font-size: 28rpx;
	}

	textarea {
		margin-top: 60rpx;
		font-size: 28rpx;
		line-height: 28rpx;
		color: #666769;
	}

	.container {
		padding: 40rpx;

		.rankTitle {
			font-size: 32rpx;
			line-height: 44rpx;
		}

		.rank {
			height: 40rpx;
			margin-left: -20rpx;
			margin-top: 30rpx;
		}
	}
</style>
