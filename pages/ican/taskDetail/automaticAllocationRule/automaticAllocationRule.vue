<template>
	<view class="">
		<view class="container">
			<view class="flexRow">
				<view class="color_303031 bold">
					分配规则
				</view>
			</view>
			<view class="">
				<view class="color_666769" style="margin-bottom: 60rpx;">
					<view class="">
						1、设置后会在您的账户中将输入的分配宝贝暂时锁定;
					</view>
					<view class="">
						2、在您确认完成后，将平均分配给处于参与任务的并且标记任务完成的所有成员。
					</view>
				</view>
				<view class="">
					<view class="">
						<text class="bold">请注意:</text>
					</view>
					<view class="color_666769">
						<view class="">
							1、任务结束前，参与任务并完成的人员只剩余1个，会将全部的分配给予该成员。
						</view>
						<view class="">
							2、若完成前，所有参与人员退出，那么您设置的宝贝将在您的选择完成后完整退回您的账户。
						</view>
					</view>
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
		padding: 60rpx 40rpx;
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
			color: #F73737;
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
