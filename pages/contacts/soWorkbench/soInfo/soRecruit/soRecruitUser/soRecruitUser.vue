<template>
	<view class="user-info flexRowStart">
		<image class="avatar" :src="user.avatar"></image>
		<view class="some-info">
			<view class="name-level">
				<view class="user-name color_303031">{{user.realName}}</view>
				<image class="level-icon" :src="getLevelIcon(user.redness)"></image>
			</view>
			<view class="mix-info-list">
				<view v-if="user.sex" class="mix-info-item">{{user.sex == '1' ? '男' : user.sex == '2' ? '女' : ''}}</view>
				<view v-if="user.age" class="mix-info-item">{{user.age}}岁</view>
				<view v-if="user.education" class="mix-info-item">{{user.education}}</view>
				<view v-if="user.workYear" class="mix-info-item">{{user.workYear}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			user: {
				type: Object,
				required: true
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
		}
	}
</script>

<style lang="scss">
	.user-info {
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

			.mix-info-list {
				margin: {
					top: 10rpx;
				}

				height: 34rpx;
				line-height: 34rpx;
				font-size: 0;

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
</style>
