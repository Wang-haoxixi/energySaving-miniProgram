<template>
	<view class="interview-item">
		<view class="interview-info flexRow">
			<view class="user-box">
				<so-recruit-user :user="userInfo"></so-recruit-user>
			</view>
			<view class="time-status">
				<view class="time">{{itemData.invitationTime.substring(11, 16)}}</view>
				<view class="status" :class="'status_' + itemData.state">{{itemData.stateName}}</view>
			</view>
		</view>
		<view class="interview-post">面试岗位：{{itemData.recruitName.substring(itemData.recruitName.lastIndexOf('-') + 1)}}</view>
	</view>
</template>

<script>
	import soRecruitUser from '../../soRecruitUser/soRecruitUser.vue'
	export default {
		components: {
			soRecruitUser
		},
		props: {
			itemData: {
				type: Object,
				required: true,
			}
		},
		computed: {
			userInfo () {
				return {
					...this.itemData,
					realName: this.itemData.receiveName,
					avatar: this.itemData.receiveAvatar
				}
			}
		}
	}
</script>

<style lang="scss">
	.interview-item {
		padding: 20rpx 0 40rpx;
		.interview-info {
			.user-box {
				flex: 100rpx 1 1;
			}
			.time-status {
				display: flex;
				height: 88rpx;
				flex: 200rpx 0 0;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-end;
				.time {
					height: 38rpx;
					line-height: 38rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #F74437;
				}
				.status {
					height: 34rpx;
					line-height: 34rpx;
					font-size: 24rpx;
					&.status_0 {
						color: #2F80FF;
					}
					&.status_1 {
						color: #919397;
					}
					&.status_2 {
						color: #BABEC0;
					}
				}
			}
		}
		
		.interview-post {
			margin: {
				top: 30rpx;
				left: 108rpx;
			}
			height: 40rpx;
			line-height: 40rpx;
			font-size: 28rpx;
			color: #666769;
		}
	}
</style>
