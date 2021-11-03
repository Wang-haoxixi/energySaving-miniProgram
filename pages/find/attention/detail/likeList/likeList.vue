<template>
	<view>
		<view class="list-item" v-for="(item,index) in data" :key="index" @tap="goCannerCard(item.id)">
			<image class="item-avatar" :src="imageError(item.avatar,$oss)"></image>
			<view class="item-text">
				<view class="name"> {{$isEmpty(item.name)?'':item.name}}</view>
				<view class="company">{{getCompanyStation(item.company,item.station)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		goCannerCard,
		getCompanyStation,
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				data: ''
			};
		},
		methods: {
			goCannerCard,
			getCompanyStation,
			imageError
		},
		onLoad(options) {
			this.$http.get('dms/thoughts/thumb_members/' + options.id).then(res => {
				console.log(res.data.data)
				this.data = res.data.data;
			});
		}
	}
</script>

<style lang="scss">
	.list-item {
		margin: 0 32rpx;
		padding: 32rpx 0;
		display: flex;
		height: 84rpx;
		align-items: center;
		border-bottom: 0.3rpx solid #EFF0F1;

		.item-avatar {
			height: 92rpx;
			width: 92rpx;
			border-radius: 50%;
		}

		.item-text {
			margin-left: 24rpx;

			.name {
				font-weight: bold;
				color: #303031;
				font-size: 28rpx;
			}

			.company {
				margin-top: 10rpx;
				font-size: 24rpx;
				color: #919397;
			}
		}

	}
</style>
