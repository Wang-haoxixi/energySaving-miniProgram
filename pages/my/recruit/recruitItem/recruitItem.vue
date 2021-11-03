<template>
	<view class="container" @tap="goRecruit(itemData.recruitId)">
		<view class="item title">
			<view class="item-name">
				{{$isEmpty(itemData.name) ? '' : itemData.name.split('-')[(itemData.name.split('-').length - 1)]}}
			</view>
			<view class="item-salary">
				<view v-if="itemData.state == 1">
					停止招聘
				</view>
				<view v-else-if="itemData.type == 0">
					<view v-if="itemData.salaryStart==0 &&itemData.salaryEnd==0">面议</view>
					<view v-else>{{itemData.salaryStart}}K-{{itemData.salaryEnd}}K</view>
				</view>
				<view class="tag-point" v-if="itemData.isRead==0"> </view>
			</view>
		</view>
		<view class="item content">
			<view class="item-workPlace">
				{{itemData.workplace}}
			</view>
			<view class="item-time">
				{{itemData.createTime.substring(0,10)}}
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
				data: ''
			}
		},
		onReady() {
			this.oss = this.$oss;
		},
		methods: {
			goRecruit,
		}
	}
</script>

<style lang="scss">
	.tag-point {
		height: 12rpx;
		width: 12rpx;
		background-color: #F74437;
		border-radius: 12rpx;
		margin: -12rpx -12rpx 0 0;
	}

	.container {
		padding: 40rpx 0;
		margin: 0 40rpx;
		border-bottom: 0.3rpx solid #EFF0F1;

		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.item-name {
				color: #303031;
			}

			.item-salary {
				display: flex;
				color: #F74437;
				font-weight: bold;
			}

			.item-workPlace {
				color: #919397;
			}

			.item-time {
				color: #BABEC0;
			}
		}

		.title {
			font-size: 32rpx;
			font-weight: bold;
		}

		.content {
			margin-top: 30rpx;
			font-size: 24rpx;
		}
	}
</style>
