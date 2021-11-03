<template>
	<view class="container">
		<view class="flexRowStart search">
			<image v-if="oss" class="img" :src="oss+'icon_search_gray.png'"></image>
			<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText" focus="true"></input>
		</view>
		<view class="taskList" v-for="(item,index) of ActivityList" :key="index" @tap="goActivityDetail(item)">
			<view class="flexRow" style="margin-top: 32rpx;margin-bottom: 32rpx;">
				<image :src="item.poster" lazy-load="true" mode="aspectFill" style="width: 300rpx;margin-right: 24rpx;height: 180rpx;border-radius: 20rpx;"></image>
				<view class="flexColumnStart" style="flex: 1;justify-content: space-between;height: 180rpx;">
					<view class="doubleEllipsis color_303031 bold" style="font-size: 28rpx;line-height: 40rpx;word-break: break-all;">
						{{$isEmpty(item.name)?'':item.name}}
					</view>
					<view class="">
						<view class="color_3CD489 typeInfo" v-if="item.ticketingManagements && item.ticketingManagements[0].ticketingType === '1'">免费</view>
						<view class="color_F74437 typeInfo" v-if="item.ticketingManagements &&item.ticketingManagements[0].ticketingType === '2'">{{ getMoney(item.ticketingManagements[0])}}</view>
						<view class="flexRowStart color_919397" style="font-size: 22rpx;line-height: 32rpx;margin-top: 16rpx;">
							<view class="">
								{{$isEmpty(item.startTime)?'':item.startTime.split(' ')[0]}}
							</view>
							<view class="" style="width: 2rpx;height: 16rpx;background-color: #BABEC0;margin: 0 10rpx;">
								
							</view>
							<view class="">
								{{$isEmpty(item.city)?'':item.city}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<image class="emptyImg" v-if="!ActivityList.length>0 && oss" :src="oss+'pic_search.png'" mode="aspectFit"></image>
		<uni-load-more :status="activityStatus" v-if="ActivityList.length>0"></uni-load-more>
		<view class="bottom-safe" style="height: 112rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activityInfo: {},
				ActivityList: [],
				activityStatus: '',
				oss: ''
			};
		},
		onLoad() {
			this.oss = this.$oss
		},
		onReachBottom() {
			// console.log(666)
			let that = this
			if (that.activityInfo.current < that.activityInfo.pages) {
				that.activityStatus = 'loading';
				that.$http.get('qms/conference_publish/search_activity', {
					params: {
						name: that.searchText,
						current: that.activityInfo.current + 1
					}
				}).then(res => {
					// console.log(res)
					that.activityInfo.current = res.data.data.current;
					that.ActivityList = that.ActivityList.concat(res.data.data.records);
					that.activityStatus = 'more';
				});
			} else {
				that.activityStatus = 'noMore';
			}
		},
		methods: {
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
			search() {
				if (this.searchText.length == 0) {
					this.activityInfo = {}
					this.ActivityList = []
				} else {
					this.$http
						.get('qms/conference_publish/search_activity', {
							params: {
								name: this.searchText
							}
						})
						.then(res => {
							// console.log(res)
							this.activityInfo = res.data.data
							this.ActivityList = this.activityInfo.records
							if(!(this.activityInfo.current<this.activityInfo.pages)){
								this.activityStatus='noMore'
							}else{
								this.activityStatus='more'
							}
					});
				}
			},
			goActivityDetail(item){
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inputDefault {
		font-size: 28rpx;
		color: #919397;
	}

	input {
		flex: 1;
		font-size: 28rpx;
		padding: 0 14rpx;
		color: #666769;
	}

	.container {
		padding: 0 32rpx;

		.search {
			margin: 16rpx 0;
			padding: 18rpx 32rpx;
			border-radius: 60rpx;
			background-color: #F5f7f8;

			.img {
				height: 32rpx;
				width: 32rpx;
			}
		}

	}
	.typeInfo {
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
