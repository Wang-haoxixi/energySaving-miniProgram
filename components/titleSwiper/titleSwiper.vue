<template>
	<view class="title-swiper flexRow">
		<view class="title-list bold">
			<view v-for="title in swiperList" :key="title.key"
			 class="title-item"></view>
		</view>
		<swiper>
			<swiper-item v-for="swiper in swiperList" :key="swiper.key">
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props: {
			swiperList: {
				type: Array,
				default: () => [
					{
						title: '全部',
						key: 'all',
					},
					{
						title: '已查1看',
						key: 'yes',
					},
					{
						title: '未查看',
						key: 'not',
					}
				]
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.title-swiper {
		justify-content: space-between;
		.title-item {
			display: inline-block;
			position: relative;
			padding-bottom: 16rpx;
			line-height: 44rpx;
			font-size: 32rpx;
			color: #919397;
			&.active {
				color: #F74437;
				&::after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					height: 6rpx;
					width: 12rpx;
					border-radius: 3rpx;
					background-color: #F74437;
				}
			}
			
		}
	}
</style>
