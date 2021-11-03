<template>
	<scroll-view class="scroll" :scroll-top="30" scroll-y="true">
		<view @tap="goDetail(item)" v-for="(item, index) in data.records" :key="index" class="item">
			<image lazy-load="true" class="avatar" mode="aspectFill" :src="item.avatar"></image>
			<view class="content">
				<view class="name singleEllipsis">{{$isEmpty(item.remarks)?'':item.remarks}}</view>
				<view class="time">{{$isEmpty(item.createTime)?'':item.createTime}}</view>
			</view>
			<view v-if="item.type == 'A'" class="money color_F74437">
				+{{$isEmpty(item.amount)?'':item.amount}}
			</view>
			<view v-if="item.type == 'L'" class="money color_919397">
				-{{$isEmpty(item.amount)?'':item.amount}}
			</view>
		</view>
		<image class="emptyImg" v-if="!data.records.length > 0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
		<uni-load-more :status="moreStatus" v-if="data.records.length > 0"></uni-load-more>
		<view class="bottom-safe" style="height: 112rpx;"></view>
	</scroll-view>
</template>

<script>
	import {
		imageError,
		soImageError
	} from '@/common/utils.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				data: '',
				moreStatus: 'more',
				oss:''
			};
		},
		onReachBottom() {
			let that = this;
			if (that.data.current < that.data.pages) {
				that.moreStatus = 'loading';
				that.$http.get('fms/app/red/flow/page', {
					params: {
						current: that.data.current + 1
					}
				}).then(res => {
					that.data.current = res.data.data.current;
					res.data.data.records.forEach(item => {
						item.avatar = soImageError(item.avatar, that.oss)
					})
					that.data.records = that.data.records.concat(res.data.data.records);
					that.moreStatus = 'more';
				});
			} else {
				that.moreStatus = 'noMore';
			}
		},
		methods: {
			soImageError,
			goDetail(item) {
				uni.navigateTo({
					url: '../detail/detail?id=' + item.id
				})
			}
		},
		onLoad() {
			this.oss = this.$oss;
			this.$http.get('fms/app/red/flow/page', {
				params: {
					current: 1
				}
			}).then(res => {
				this.data = res.data.data;
				this.data.records.forEach(item => {
					item.avatar = soImageError(item.avatar, this.oss)
				})
				// console.log(this.data)
				if(!(this.data.current>this.data.pages)){
					// console.log(6)
					this.moreStatus='noMore'
				}
			});
		}
	}
</script>

<style lang="scss">
	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
	.scroll {
		// height: 500rpx;
		// padding-top: 10rpx;
	}

	.item {
		display: flex;
		align-items: center;
		padding: 32rpx 0;
		margin: 0 32rpx;
		border-bottom: 0.3rpx solid #EFF0F1;

		.avatar {
			width: 92rpx;
			height: 92rpx;
			border-radius: 50%;
		}

		.content {
			margin-left: 24rpx;

			.name {
				color: #272727;
				font-size: 28rpx;
				line-height: 40rpx;
				width: 340rpx;
			}

			.time {
				color: #9aa1a7;
				font-size: 22rpx;
				line-height: 32rpx;
			}
		}

		.money {
			font-weight: bold;
			flex: 1;
			text-align: right;
			font-size: 28rpx;
			line-height: 32rpx;
		}
	}
</style>
