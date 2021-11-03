<template>
	<view class="info-item" @tap="goRecruit(itemData.recruitId)">
		<view class="top-info">
			<view class="info-name">
				<view class="name-text">
					{{$isEmpty(itemData.name) ? '' : itemData.name.split('-')[(itemData.name.split('-').length - 1)]}}
				</view>
				<view v-if="itemData.reward" class="reward-label">推荐</view>
			</view>
			<text v-if="itemData.type == 0">
				<text class="salary" v-if="itemData.salaryStart==0 &&itemData.salaryEnd==0">面议</text>
				<text class="salary" v-else>{{itemData.salaryStart}}K-{{itemData.salaryEnd}}K</text>
			</text>
		</view>
		<view class="label-list">
			<view class="label-item" v-if="itemData.experience&&itemData.experience!=''">{{itemData.experience}}</view>
			<view class="label-item" v-if="itemData.education &&itemData.education!=''">{{itemData.education}}</view>
			<view class="label-item" v-if="itemData.rednessDemand &&itemData.rednessDemand!=''">红度值≥{{itemData.rednessDemand}}</view>
			<view class="label-item" v-for="(item,index) in itemData.tags" :key="index">{{item}}</view>
		</view>
		<view class="desc-list">
			<view class="desc-item">{{itemData.soName}}</view>
			<!-- <view class="desc-item">已认证</view> -->
			<view class="desc-item">{{soNum}}</view>
		</view>
		<view class="bottom-info">
			<view class="publisher-info">
				<image class="publisher-avatar" :src="itemData.avatar"></image>
				<text class="publisher-name singleEllipsis">
					{{itemData.realName}}
					<text v-if="itemData.position">·{{itemData.position.substring(itemData.position.lastIndexOf('-') + 1)}}</text>
				</text>
			</view>
			<view class="other-info">
				<!-- <view class="recommend-info" v-if="itemData.reward>0">
					<image v-if="oss" class="recommend-icon" :src="oss + 'icon_recommend.png'"></image>
					<text class="recommend-award">+{{$isEmpty(itemData.reward)? '':itemData.reward+'贝'}}</text>
				</view> -->
				<text class="location-info">{{itemData.workplace}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		goRecruit
	} from '@/common/utils.js'
	export default {
		name: 'recruitItem',
		props: {
			itemData: {
				type: Object
			},
		},
		data() {
			return {
				oss: '',
				soNum: '',
				data: ''
			}
		},
		onReady() {
			this.oss = this.$oss;
			if (this.itemData.soNum > 9999) {
				this.soNum = "10000人以上";
			} else if (this.itemData.soNum > 999) {
				this.soNum = "1000 - 9999人";
			} else if (this.itemData.soNum > 499) {
				this.soNum = "500 - 1000人";
			} else if (this.itemData.soNum > 99) {
				this.soNum = "100 - 499人";
			} else if (this.itemData.soNum > 19) {
				this.soNum = "20 - 99人";
			} else if (this.itemData.soNum > 0) {
				this.soNum = "1 - 20人";
			} else {
				this.soNum = "";
			}
		},
		methods: {
			goRecruit,
		}
	}
</script>

<style lang="scss">
	.info-item {
		position: relative;
		padding: 32rpx 24rpx;
		margin-bottom: 16rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 40rpx;
			right: 40rpx;
			border-bottom: 1rpx solid #EFF0F1;
		}

		.top-info {
			display: flex;
			justify-content: space-between;
			height: 44rpx;
			font-size: 32rpx;

			.info-name {
				height: 44rpx;
				line-height: 44rpx;
				font-weight: bold;
				.name-text {
					display: inline-block;
					vertical-align: middle;
					line-height: 44rpx;
					color: #303031;
				}
				.reward-label {
					display: inline-block;
					vertical-align: middle;
					margin-left: 10rpx;
					text-align: center;
					width: 64rpx;
					height: 32rpx;
					line-height: 32rpx;
					border-radius: 4rpx;
					background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
					font-size: 22rpx;
					color: #FFFFFF;
				}
			}

			.salary {
				line-height: 44rpx;
				color: #F74437;
				font-weight: bold;
			}
		}

		.label-list {
			margin: 20rpx 0 -20rpx -20rpx;

			.label-item {
				display: inline-block;
				margin: 0 0 20rpx 20rpx;
				padding: 4rpx 10rpx;
				line-height: 28rpx;
				background-color: #F4F5F6;
				border-radius: 6rpx;
				font-size: 20rpx;
				color: #666769;
			}
		}

		.desc-list {
			margin: 20rpx 0 -20rpx -20rpx;

			.desc-item {
				display: inline-block;
				margin: 0 20rpx 20rpx 20rpx;
				height: 34rpx;
				line-height: 34rpx;
				font-size: 24rpx;
				color: #666769;

				&:not(:last-child) {
					padding-right: 2rpx;
					position: relative;

					&::after {
						content: '';
						position: absolute;
						right: -20rpx;
						top: 6rpx;
						height: 22rpx;
						width: 2rpx;
						background-color: #E3E4E5;
					}
				}
			}
		}

		.bottom-info {
			margin-top: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.publisher-info {
				display: flex;
				align-items: center;
				height: 52rpx;

				.publisher-avatar {
					height: 52rpx;
					width: 52rpx;
					border-radius: 20rpx;
				}

				.publisher-name {
					width: 322rpx;
					margin-left: 20rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					color: #303031;
				}
			}

			.other-info {
				display: flex;
				height: 40rpx;
				flex-wrap: nowrap;
				align-items: center;

				.recommend-info {
					display: flex;
					align-items: center;
					height: 36rpx;

					.recommend-icon {
						height: 36rpx;
						width: 36rpx;
					}

					.recommend-award {
						margin-left: 10rpx;
						line-height: 28rpx;
						font-size: 20rpx;
						color: #2F80FF;
					}
				}

				.location-info {
					margin-left: 20rpx;
					line-height: 34rpx;
					color: #BABEC0;
					font-size: 24rpx;
				}
			}
		}
	}
</style>
