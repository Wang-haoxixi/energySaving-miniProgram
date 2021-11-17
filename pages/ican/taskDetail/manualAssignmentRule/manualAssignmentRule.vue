<template>
	<view class="">
		<view class="container">
			<view class="color_303031 bold">
				分配规则
			</view>
			<view class="color_666769">
				<view style="margin-bottom: 60rpx;">
					选择手动分配，您在确认完成任务时可进行批量打赏。
				</view>
			</view>
			<view class="">
				<view class="bold color_303031">请注意:</view>
				<view class="color_666769">
					在任务结束前，请确保您的任务有参与人员，若参与人员全部退出任务，那么将在任务完成时不再提醒奖励分配。
				</view>
			</view>
		</view>
		<view class="btn" v-if="taskStatus==false">
			<view class="flexRowStart" style="margin: 20rpx 40rpx;">
				<view class="button noRepeat" @tap="cancel">
					取消分配
				</view>
				<view class="button" style="flex: 1;" @tap="goBack">
					已了解
				</view>
			</view>
		</view>
		<view class="btn" v-else>
			<view class="button send" @tap="goBack">
				已了解
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taskStatus:''
			};
		},
		onLoad() {
			this.taskStatus= uni.getStorageSync('taskStatus')
		},
		methods: {
			goBack() {
				uni.setStorageSync('taskStatus',true)
				uni.navigateBack({
					delta: 1
				})
			},
			cancel(){
				uni.setStorageSync('taskStatus',true)
				uni.navigateBack({
					delta: 2
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 40rpx 40rpx;
		font-size: 28rpx;
		line-height: 48rpx;
	}

	.btn {
		position: fixed;
		bottom: 0rpx;
		background-color: #FFFFFF;
		width: 100%;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.noRepeat {
			width: 172rpx;
			background: #FFFFFF;
			// color: #F73737;
			color: #46B28B;
			// border: 2rpx solid #F73737;
			border: 2rpx solid #46B28B;
			margin-right: 30rpx;
		}
		.send {
			width: 686rpx;
			margin: 24rpx 32rpx
		}
	}
</style>
