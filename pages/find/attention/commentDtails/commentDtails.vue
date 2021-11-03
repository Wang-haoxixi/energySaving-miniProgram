<template>
	<view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup,
		},
		data() {
			return {
			};
		},
		onLoad(option) {
			console.log(option);
			this.$http.get('dms/app/thoughts_reply/page', {
				params: {
					commentId: option.id,
					size: 999
				}
			}).then(res => {
				console.log(res)
			});
		}
	}
</script>

<style lang="scss">
	.bottom {
		height: 112rpx;
		bottom: 0;
		position: fixed;
		background-color: #FFFFFF;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.popup_input {
		padding: 30rpx;
		background-color: #FFFFFF;
		display: flex;
		font-size: 28rpx;
		align-items: flex-end;
	}

	.inputDefault {
		color: #919397;
		padding: 20rpx;
		line-height: 48rpx;
	}

	textarea {
		flex: 1;
		padding: 20rpx;
		line-height: 48rpx;
		background-color: #F4F5F6;
		color: #666769;
		border-radius: 20rpx;
		height: 184rpx;
	}

	.reply-item {
		display: flex;
		padding: 40rpx;

		.reply-item-avatar {
			height: 76rpx;
			width: 76rpx;
			border-radius: 20rpx;
		}

		.reply-item-right {
			margin-left: 20rpx;
			flex: 1;
		}

		.name {
			color: #303031;
			font-size: 28rpx;
			line-height: 40rpx;
			font-weight: bold;
		}

		.content {
			margin-top: 20rpx;
			color: #666769;
			line-height: 40rpx;
			font-size: 28rpx;
		}

		.reply-time {
			font-size: 20rpx;
			color: #BABEC0;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30rpx;

			.reply-time-icon {
				color: #919397;
				display: flex;
				align-items: center;

				.icon {
					height: 28rpx;
					width: 28rpx;
				}

				.text {
					margin-left: 8rpx;
				}
			}
		}

		.thoughtsReply {
			word-break: break-all;
			margin-top: 40rpx;
			padding: 20rpx;
			background-color: #F4F5F6;
			border-radius: 20rpx;

			.thoughtsReply-item {
				color: #666769;
				font-size: 28rpx;
				line-height: 48rpx;
				margin-top: 20rpx;
			}
		}

	}

	.reply {
		background-color: #F4F5F6;
		padding: 40rpx 0;
	}

	.splitLine {
		height: 0.3rpx;
		background-color: #EFF0F1;
		text-align: center;
		width: 670rpx;
		margin-left: 40rpx;
	}

	.center {
		display: flex;
		justify-content: center;
	}

	.talk {
		padding: 20rpx 0;

		.talk-item {
			margin-top: 40rpx;

			.talk-item-title {
				padding: 0 40rpx;
				display: flex;
				align-items: center;

				.avatar {
					width: 76rpx;
					height: 76rpx;
					border-radius: 20rpx;
				}

				.talk-item-title-text {
					margin-left: 20rpx;

					.name {
						color: #303031;
						font-size: 28rpx;
						line-height: 38rpx;
						font-weight: bold;
					}

					.company {
						margin-top: 10rpx;
						color: #919397;
						font-size: 22rpx;
						line-height: 32rpx;
					}
				}

			}

			.talk-text {
				padding: 0 40rpx 0 20rpx;
				margin-left: 20rpx;
				margin-top: 30rpx;
				color: #303031;
				font-size: 28rpx;
				line-height: 48rpx;
			}

			.talk-imgs {
				margin-top: 4rpx;
				padding-left: 40rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;

				.talk-img {
					margin-top: 30rpx;
					margin-right: 29rpx;
					width: 204rpx;
					height: 204rpx;
					border-radius: 20rpx;
				}

				.talk-img-single {
					margin-top: 30rpx;
					width: 460rpx;
					height: 616rpx;
					border-radius: 20rpx;
				}
			}

			.talk-end {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 0.3rpx solid #EFF0F1;
				margin: 0 40rpx;
				font-size: 26rpx;
				color: #565B5F;
				line-height: 36rpx;

				.talk-icon {
					margin-left: 60rpx;
					padding: 40rpx 0;
					height: 44rpx;
					width: 44rpx;
				}

				.talk-end-text {
					margin-left: 10rpx;
					padding: 40rpx 0;
				}
			}
		}
	}

	.thumbsUp-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 88rpx;
		margin-left: 40rpx;
		margin-right: 24rpx;

		.thumbsUp-item-text {
			color: #919397;
			font-size: 28rpx;
			line-height: 40rpx;
			flex: 1;
		}

		.thumbsUp-item-right {
			height: 44rpx;
			width: 44rpx;
		}
	}
</style>
