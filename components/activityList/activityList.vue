<template>
	<view style="background-color: #F5f7f8;">
		<view class="swiper-item">
			<scroll-view scroll-y="true" class="thirdRecommendScroll" :style="{height:scrollHeight + 'px'}" @scrolltolower="activityMore">
				<view class="flexRowStart activityList" v-for="(item,index) in acticityInfo.records" :key="index" @tap="goActivityDetails(item)">
					<image lazy-load="true" :src="item.poster" class="posterImg" mode="aspectFit"></image>
					<view class="activityInfo">
						<view class="bold doubleEllipsis name color_303031 activityName">{{ $isEmpty(item.name)?'':item.name}}</view>
						<view class="">
							<view style="color: #46B28B;" class="bold activityTicket" v-if="item.ticketingManagements && item.ticketingManagements[0].ticketingType === '1'">免费</view>
							<view class="color_F74437 bold activityTicket" v-if="item.ticketingManagements && item.ticketingManagements[0].ticketingType === '2'">{{ getMoney(item.ticketingManagements[0])}}</view>
							<view class="color_919397 activityCity">
								{{$isEmpty(item.startTime)?'':item.startTime.substring(0,10)}}
								|
								{{ $isEmpty(item.city)?'':item.city }}</view>
						</view>
					</view>
				</view>
				<image class="emptyImg" v-if="!acticityInfo.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
				<uni-load-more :status="acticityStatus" v-if="acticityInfo.records.length>0"></uni-load-more>
				<view class="bottom-safe"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			acticityInfo: Object,
			scrollHeight: {
				type:Number,
				default:100
			}
		},
		data() {
			return {
				acticityStatus: '',
				oss:''
			};
		},
		onReady() {
			this.oss =this.$oss
			if (!this.acticityInfo.current < this.acticityInfo.pages) {
				this.acticityStatus = 'noMore';
			}
		},
		methods:{
			activityMore() {
				let that = this;
				if (that.acticityInfo.current < that.acticityInfo.pages) {
					that.acticityStatus = 'loading';
					that.$http.get('qms/conference_publish/activitie_page', {
						params: {
							status: '',
							current: that.acticityInfo.current + 1
						}
					}).then(res => {
						that.acticityInfo.current = res.data.data.current;
						that.acticityInfo.records = that.acticityInfo.records.concat(res.data.data.records);
						that.acticityStatus = 'more';
					});
				} else {
					that.acticityStatus = 'noMore';
				}
			},
			goActivityDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.id}`
				})
			},
			getMoney(ticket) {
				if (ticket.canMoney != '' && ticket.money=='') {
					return `${ticket.canMoney}贝`;
				} else if (ticket.money!=''&& ticket.canMoney == '') {
					return `${ticket.money}元`;
				} else if (ticket.money != '' && ticket.canMoney != '') {
					return `${ticket.canMoney}贝/${ticket.money}元`;
				}else{
					return `0`;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.thirdRecommendScroll {

		// position: relative;
		// top: 220rpx;
		.activityList {
			padding: 24rpx;
			border-radius: 16rpx;
			margin-bottom: 16rpx;
			background-color: #FFFFFF;

			.posterImg {
				width: 300rpx;
				height: 180rpx;
				border-radius: 16rpx;
				margin-right: 24rpx;
			}

			.activityInfo {
				flex: 1;
				height: 180rpx;
				display:flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-between;
				.activityName {
					font-size: 28rpx;
					line-height: 40rpx;
					margin-bottom: 20rpx;
				}

				.activityTicket {
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.activityCity {
					font-size: 22rpx;
					line-height: 32rpx;
					margin-top: 8rpx;
				}
			}
		}
	}
</style>
