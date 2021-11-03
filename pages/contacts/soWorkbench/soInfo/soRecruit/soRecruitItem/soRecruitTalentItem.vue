<template>
	<view class="user-item">
		<view class="basic-info flexRowStart">
			<image class="avatar" :src="avatarValid(user.avatar) || $ossUrl('ic_main_main_normal.png')"></image>
			<view class="some-info">
				<view class="name-location flexRow">
					<view class="name-level">
						<view class="user-name color_303031">{{user.realName}}</view>
						<image class="level-icon" :src="getLevelIcon(user.redness)"></image>
					</view>
					<text class="location">{{user.workPlace}}</text>
				</view>
				<view class="mix-info-list">
					<view v-if="user.sex" class="mix-info-item">{{user.sex == '1' ? '男' : user.sex == '2' ? '女' : ''}}</view>
					<view v-if="user.age" class="mix-info-item">{{user.age}}岁</view>
					<view v-if="user.education" class="mix-info-item">{{user.education}}</view>
					<view v-if="user.workYear" class="mix-info-item">{{user.workYear}}</view>
				</view>
			</view>
		</view>
		<view class="experience-list">
			<view class="experience-item">
				<template v-if="user.recentWork">
					<image class="experience-icon" :src="$ossUrl('icon_task_detail_describe.png')"></image>
					<text class="experience-info-time">{{getDateDiff(user.recentWork.starTime, user.recentWork.endTime)}}</text>
					<view class="experience-info-detail">{{user.recentWork.company}}{{getPosition(user.recentWork.position)}}</view>
				</template>
				<view v-else>暂未填写工作经历</view>
			</view>
			<view class="experience-item">
				<template v-if="user.recentStudy">
					<image class="experience-icon" :src="$ossUrl('icon_task_detail_describe.png')"></image>
					<text class="experience-info-time">{{getDateRange(user.recentStudy.starTime, user.recentStudy.endTime)}}</text>
					<view class="experience-info-detail">{{user.recentStudy.school}}{{getPosition(user.recentStudy.content)}}</view>
				</template>
				<view v-else>暂未填写学习经历</view>
			</view>
		</view>
		<view v-if="user.abilityTag && user.abilityTag.length > 0" class="ability-list">
			<view v-for="(ability, index) in user.abilityTag" :key="index" class="ability-item">{{ability}}</view>
		</view>
	</view>
</template>

<script>
	import {
		avatarValid,
		dateFormat
	} from '@/common/utils.js'
	export default {
		name: 'SoRecruitTalentItem',
		props: {
			user: {
				type: Object,
				default: () => {}
			}
		},
		methods: {
			getLevelIcon(redness) {
				if (redness == 2) {
					return this.$ossUrl('icon_ican_newLevelTwo.png')
				} else if (redness == 3) {
					return this.$ossUrl('icon_ican_newLevelThree.png')
				} else if (redness == 4) {
					return this.$ossUrl('icon_ican_newLevelFour.png')
				} else if (redness == 5) {
					return this.$ossUrl('icon_ican_newLevelFive.png')
				} else {
					return this.$ossUrl('icon_ican_newLevelOne.png')
				}
			},
			getDateRange(startTime = null, endTime = null, format = 'YYYY') {
				let startDate
				if (startTime) {
					startDate = new Date(startTime)
					if (isNaN(startDate.getTime())) {
						startDate = new Date()
					}
				} else {
					return ''
				}
				let endDate
				if (endTime) {
					endDate = new Date(endTime)
					if (isNaN(endDate.getTime())) {
						endDate = new Date()
					}
				} else {
					endDate = new Date()
				}

				return `${dateFormat(startDate, format)}-${dateFormat(endDate, format)}`
			},
			getDateDiff(startTime = null, endTime = null) {
				let startDate
				if (startTime) {
					startDate = new Date(startTime)
					if (isNaN(startDate.getTime())) {
						startDate = new Date()
					}
				} else {
					return ''
				}
				let endDate
				if (endTime) {
					endDate = new Date(endTime)
					if (isNaN(endDate.getTime())) {
						endDate = new Date()
					}
				} else {
					endDate = new Date()
				}
				if (endDate.getTime() > startDate.getTime()) {
					let startYear = startDate.getFullYear()
					let startMon = startDate.getMonth()
					let startDay = startDate.getDate()
					let endYear = endDate.getFullYear()
					let endMon = endDate.getMonth()
					let endDay = endDate.getDate()
					let diffYear = endYear - startYear + (endMon < startMon ? 1 : 0)
					let diffMon = 0
					if (endMon < startMon) {
						endMon = endMon + 12

					}
					diffMon = endMon - startMon + (endDay >= startDay ? 1 : 0)
					return `${diffYear ? diffYear + '年' : ''}${diffMon}个月`
				} else {
					return ''
				}
			},
			getPosition(position = '') {
				if (position) {
					return `·${position.substring(position.lastIndexOf('-') + 1)}`
				}
				return ''
			},
			sendNotice() {
				this.$emit('send-notice')
			},
			avatarValid(url) {
				return avatarValid(url)
			}
		}
	}
</script>

<style lang="scss">
	.user-item {
		.basic-info {
			height: 88rpx;

			.avatar {
				height: 88rpx;
				width: 88rpx;
				flex: 88rpx 0 0;
				border-radius: 20rpx;
			}

			.some-info {
				height: 88rpx;
				flex: 200rpx 1 1;
				margin-left: 20rpx;

				.name-location {
					height: 44rpx;

					.name-level {
						height: 44rpx;
						line-height: 44rpx;
						font-size: 0;

						.user-name {
							vertical-align: middle;
							display: inline-block;
							height: 44rpx;
							max-width: 200rpx;
							line-height: 44rpx;
							font-size: 32rpx;
							font-weight: bold;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.level-icon {
							display: inline-block;
							vertical-align: middle;
							margin-left: 10rpx;
							height: 44rpx;
							line-height: 44rpx;
							width: 40rpx;
						}
					}

					.location {
						line-height: 34rpx;
						font-size: 24rpx;
						color: #BABEC0;
					}
				}

				.mix-info-list {
					margin: {
						top: 10rpx;
					}

					height: 34rpx;
					line-height: 34rpx;

					.mix-info-item {
						display: inline-block;
						vertical-align: middle;
						line-height: 34rpx;
						font-size: 24rpx;
						color: #919397;

						&:not(:first-child) {
							&::before {
								content: '·';
								display: inline-block;
								height: 34rpx;
								line-height: 34rpx;
								width: 20rpx;
								text-align: center;
							}
						}
					}
				}
			}

		}

		.experience-list {
			.experience-item {
				margin-top: 20rpx;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				height: 40rpx;
				line-height: 40rpx;
				color: #666769;
				font-size: 28rpx;

				&:first-child {
					margin-top: 30rpx;
				}

				.experience-icon {
					height: 40rpx;
					width: 36rpx;
					flex: 36rpx 0 0;
				}

				.experience-info-time {
					margin-left: 10rpx;
					white-space: nowrap;
				}

				.experience-info-detail {
					margin-left: 10rpx;
					flex: 20rpx 1 1;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
		
		.ability-list {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-wrap: wrap;
			margin: -20rpx -10rpx 0;
			padding-top: 30rpx;
			.ability-item {
				display: inline-block;
				vertical-align: top;
				margin: 20rpx 10rpx 0;
				padding: 0 16rpx;
				height: 48rpx;
				line-height: 48rpx;
				background-color: #F4F5F6;
				border-radius: 6rpx;
				font-size: 22rpx;
				color: #666769;
			}
		}
	}
</style>
