<template>
	<view class="so-recruit-item" :class="{'close': recruit.state == '1'}">
		<view class="recruit-title">
			<text class="title-name">{{recruit.name.substring(recruit.name.lastIndexOf('-') + 1)}}</text>
			<text class="recruit-type" :style="{color: recruit.type == '0' ? '#2F80FF' : '#F74437'}">{{recruit.type == '0' ? '普通职位' : recruit.type == '1' ? '合伙人职位' : ''}}</text>
		</view>
		<view class="recruit-apply-info">
			<view class="info-item" style="padding-right: 20rpx;">
				<text class="info-item-title">申请人数：</text>
				<text class="info-item-num">{{recruit.deliveryNum}}</text>
			</view>
			<view class="info-item left-space">
				<text class="info-item-title">未查看：</text>
				<text class="info-item-num">{{recruit.notCheckNum}}</text>
			</view>
		</view>
		<view class="button-list flexRow">
			<view class="button-item" @tap.stop="viewDetail">投递详情</view>
			<view class="button-item" @tap.stop="changeState">{{recruit.state == '0' ? '停止招聘' : '开启招聘'}}</view>
			
			<view class="button-item" @tap.stop="handleTop" :class="{'disabled': recruit.state == '1'}">刷新职位</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'SoRecruitItem',
		props: {
			recruit: {
				type: Object,
				default: () => {},
			}
		},
		methods: {
			viewDetail() {
				this.$emit('view-detail', this.recruit)
			},
			changeState() {     
				if (this.recruit.state == '0') {
					this.$emit('handle-stop', this.recruit.recruitId)
				} else {
					this.$emit('handle-start', this.recruit.recruitId)
				}
			},
			handleTop() {
				if (this.recruit.state == '0') {
					this.$emit('handle-top', this.recruit.recruitId)
				}
			},
		}
	}
</script>

<style lang="scss">
	.so-recruit-item {
		padding: 40rpx;
		background-color: #FFFFFF;
		border-bottom: 1rpx solid #EFF0F1;

		.recruit-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 48rpx;

			.title-name {
				line-height: 44rpx;
				font-size: 32rpx;
				color: #303031;
				font-weight: bold;
			}

			.recruit-type {
				line-height: 34rpx;
				font-size: 24rpx;
			}
		}

		.recruit-apply-info {
			margin-top: 20rpx;

			.info-item {
				display: inline-block;
				height: 40rpx;
				font-size: 28rpx;

				&.left-space {
					position: relative;
					padding-left: 22rpx;

					&::after {
						content: '';
						position: absolute;
						left: 0;
						top: 10rpx;
						bottom: 8rpx;
						width: 2rpx;
						background-color: #E3E4E5;
					}
				}

				.info-item-title {
					line-height: 40rpx;
					color: #919397;
				}

				.info-item-num {
					font-weight: bold;
					color: #303031;
				}
			}
		}

		.button-list {
			margin-top: 30rpx;

			.button-item {
				height: 64rpx;
				line-height: 64rpx;
				width: 204rpx;
				text-align: center;
				border-radius: 10rpx;
				background-color: #F4F5F6;
				color: #919397;
				font-size: 28rpx;

				&.disabled {
					background-color: #919397;
					color: #FFFFFF;
				}
			}
		}

		&.close {

			.recruit-type,
			.title-name,
			.info-item-title,
			.info-item-num {
				color: #BABEC0 !important;
				font-weight: normal !important;
			}

		}
	}
</style>
