<template>
	<view class="apply-user">
		<view class="user-info">
			<image class="user-avatar" :src="avatarValid(applyUser.userAvatar) || $ossUrl('ic_main_main_normal')"></image>
			<viwe class="user-desc">
				<view class="name-status">
					<view class="name-level">
						<view class="user-name" :style="{color: applyUser.status == '3' ? '#BABEC0' : ''}">{{applyUser.realName}}</view>
						<image class="user-level" :src="$ossUrl(getLevelIcon(applyUser.redness))"></image>
					</view>
					<text class="apply-status"
						:style="{color: applyUser.isCheck == '0' ? '#F74437' : '#BABEC0'}">{{getCheck(applyUser.isCheck)}}</text>
				</view>
				<view class="apply-time" :style="{color: applyUser.status == '3' ? '#BABEC0' : ''}">{{applyUser.applyTime.substring(0, 10)}}</view>
				<view class="matching-info flexRow">
					<view class="matching-info-pic">
						<view class="matching-info-pic-rate" :class="{'disabled': applyUser.status == 3}" :style="{width: applyUser.matchingDegree + '%'}"></view>
					</view>
					<view class="matching-info-text" :class="{'disabled': applyUser.status == 3}">匹配度：{{applyUser.matchingDegree}}%</view>
				</view>
				<view class="operation-list flexRow">
					<view v-if="applyUser.status == 1" class="operation-item" @tap.stop="notFit">不合适</view>
					<view v-if="applyUser.status == 3" class="operation-item disabled" @tap.stop="">已拒绝</view>
					<view v-if="applyUser.status == 3" class="operation-item disabled-button"@tap.stop="">发通知</view>
					<view v-else class="operation-item" @tap.stop="sendNotice">发通知</view>
					<!-- <view class="operation-item" @tap.stop="toChat">聊天</view> -->
				</view>
			</viwe>
		</view>
		
	</view>
</template>

<script>
	import { avatarValid } from '@/common/utils.js'
	export default {
		name: 'applyUser',
		props: {
			applyUser: {
				type: Object,
				default: () => {}
			}
		},
		methods: {
			getLevelIcon (redness) {
				if (redness == 2) {
					return 'icon_ican_newLevelTwo.png'
				} else if (redness == 3) {
					return 'icon_ican_newLevelThree.png'
				} else if (redness == 4) {
					return 'icon_ican_newLevelFour.png'
				} else if (redness == 5) {
					return 'icon_ican_newLevelFive.png'
				} else {
					return 'icon_ican_newLevelOne.png'
				}
			},
			getCheck (isCheck) {
				if (isCheck == '0') {
					return '未查看'
				} else if (isCheck == '1') {
					return '已查看'
				}
			},
			notFit () {
				this.$emit('to-reject')
			},
			sendNotice () {
				this.$emit('send-notice')
			},
			toChat () {
				uni.showToast({
					icon: 'none',
					title: '功能暂未开放！',
				})
			},
			avatarValid (avatar) {
				return avatarValid(avatar)
			}
		}
	}
</script>

<style lang="scss">
	.apply-user {
		padding: {
			top: 40rpx;
			left: 40rpx;
		}
		.user-info {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.user-avatar {
				height: 96rpx;
				flex: 96rpx 0 0;
				border-radius: 30rpx;
			}
			.user-desc {
				margin-left: 20rpx;
				padding: {
					right: 40rpx;
					bottom: 46rpx;
				}
				flex: 20rpx 1 1;
				border-bottom: 1rpx solid #EFF0F1;
				.name-status {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 44rpx;
					.name-level {
						height: 44rpx;
						line-height: 44rpx;
						font-size: 0;
						.user-name {
							display: inline-block;
							vertical-align: middle;
							line-height: 44rpx;
							font-size: 28rpx;
							font-weight: bold;
						}
						.user-level {
							margin-left: 10rpx;
							vertical-align: middle;
							height: 44rpx;
							width: 40rpx;
						}
					}
					.apply-status {
						line-height: 34rpx;
						font-size: 24rpx;
					}
				}
				.apply-time {
					margin-top: 10rpx;
					height: 34rpx;
					line-height: 34rpx;
					color: #919397;
				}
				.matching-info {
					margin-top: 30rpx;
					height: 34rpx;
					line-height: 34rpx;
					.matching-info-pic {
						height: 14rpx;
						flex: 288rpx 0 0;
						border-radius: 12rpx;
						background-color: #EFF0F1;
						.matching-info-pic-rate {
							height: 14rpx;
							border-radius: 12rpx;
							background-color: #3CD489;
							&.disabled {
								background-color: #BABEC0;
							}
						}
					}
					.matching-info-text {
						height: 34rpx;
						line-height: 34rpx;
						font-size: 24rpx;
						color: #666769;
						&.disabled {
							color: #BABEC0;
						}
					}
				}
				.operation-list {
					margin-top: 50rpx;
					height: 64rpx;
					.operation-item {
						flex: 174rpx 0 0;
						height: 64rpx;
						line-height: 64rpx;
						text-align: center;
						background-color: #F4F5F6;
						border-radius: 24rpx;
						color: #919397;
						font-size: 28rpx;
						&.disabled {
							background-color: inherit;
							color: #BABEC0;
						}
						&.disabled-button {
							background-color: #F4F5F6;
							color: #BABEC0;
						}
					}
				}
			}
		}
		
	}
</style>
