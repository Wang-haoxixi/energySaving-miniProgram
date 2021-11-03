<template>
	<view class="container">
		<view class="name-time flexRow">
			<view class="recruit-name bold color_303031">{{itemData.recruitName.substring(itemData.recruitName.lastIndexOf('-') + 1)}}</view>
			<view class="time color_F74437">{{itemData.invitationTime.substring(11, 16)}}</view>
		</view>
		<view class="org-status flexRow">
			<image class="org-avatar" :src="itemData.orgAvatar"></image>
			<view class="org-name color_919397">{{itemData.orgName}}</view>
			<view class="status" :style="{color: status.color}">{{status.text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			itemData: {
				type: Object,
				required: true
			}
		},
		computed: {
			status () {
				return {
					text: this.itemData.state == '0' ? '待处理' : this.itemData.state == '1' ? '已接受' : this.itemData.state == '2' ? '已拒绝' : '',
					 color: this.itemData.state == '0' ? '#2F80FF' : this.itemData.state == '1' ? '#3CD489' : this.itemData.state == '2' ? '#BABEC0' : ''
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 40rpx 0;
		&:not(:last-child) {
			border-bottom: 1rpx solid #F8F8F9;
		}
		.name-time {
			height: 44rpx;
			.recruit-name {
				height: 44rpx;
				line-height: 44rpx;
				font-size: 32rpx;
			}
			.time {
				height: 38rpx;
				line-height: 38rpx;
				font-size: 32rpx;
			}
		}
		.org-status {
			margin-top: 30rpx;
			height: 52rpx;
			.org-avatar {
				height: 52rpx;
				width: 52rpx;
				flex: 52rpx 0 0;
				border-radius: 20rpx;
			}
			.org-name {
				margin-left: 20rpx;
				height: 40rpx;
				line-height: 40rpx;
				flex: 200rpx 1 1;
				font-size: 28rpx;
			}
			.status {
				height: 34rpx;
				line-height: 34rpx;
				font-size: 24rpx;
			}
		}
	}
</style>
