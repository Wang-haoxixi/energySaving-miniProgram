<template>
	<view class="container">
		<view class="containerWrap">
			<view class="title">
				<view class="title-item" @tap="allClick()">
					<view :class="[{ active: isAllActive }, { unactive: !isAllActive }]">我发布的</view>
					<view class="title-item-bottom" v-if="isAllActive"></view>
				</view>
				<view class="title-item" @tap="underwayClick()">
					<view :class="[{ active: isUnderwayActive }, { unactive: !isUnderwayActive }]">我参与的</view>
					<view class="title-item-bottom" v-if="isUnderwayActive"></view>
				</view>
				<view class="title-item" @tap="endClick()">
					<view :class="[{ active: isEndActive }, { unactive: !isEndActive }]">我收到的</view>
					<view class="title-item-bottom" v-if="isEndActive"></view>
				</view>
			</view>
			<swiper class="content" circular @change="swiperChange" observer observerParents :current-item-id="item_id" ref="swiper">
				<swiper-item item-id="0">
					<scroll-view class="scrollList" :scroll-top="30" scroll-y="true" @scrolltolower="publishMore">
						<view class="records" v-for="(item,index) of publishList" :key="index" @tap="goDetails(item)">
							<view class="records-item">
								<view class="color_303031 singleEllipsis summaryTitle">
									{{$isEmpty(item.title)?'':item.title}}
								</view>
								<view class="flexRowStart">
									<view class="color_919397 publisher">
										<text style="margin-right: 8rpx;">发送人:</text>
										<text>{{$isEmpty(item.creatorRealName)?'':item.creatorRealName}}</text>
									</view>
									<view class="color_919397 time">{{$isEmpty(item.createTime)?'':item.createTime.split(' ')[0]}}</view>
								</view>
							</view>
						</view>
						<uni-load-more :status="publishStatus" v-if="publishList.length>0"></uni-load-more>
						<image class="emptyImg" v-if="!publishList.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
					</scroll-view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</swiper-item>
				<swiper-item item-id="1">
					<scroll-view class="scrollList" :scroll-top="30" scroll-y="true" @scrolltolower="joinMore">
						<view class="records" v-for="(item,index) of joinList" :key="index" @tap="goDetails(item)">
							<view class="records-item">
								<view class="color_303031 singleEllipsis summaryTitle">
									{{$isEmpty(item.title)?'':item.title}}
								</view>
								<view class="flexRowStart">
									<view class="color_919397 publisher">
										<text style="margin-right: 8rpx;">发送人:</text>
										<text>{{$isEmpty(item.creatorRealName)?'':item.creatorRealName}}</text>
									</view>
									<view class="color_919397 time">{{$isEmpty(item.createTime)?'':item.createTime.split(' ')[0]}}</view>
								</view>
							</view>
						</view>
						<uni-load-more :status="joinStatus" v-if="joinList.length>0"></uni-load-more>
						<image class="emptyImg" v-if="!joinList.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
					</scroll-view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</swiper-item>
				<swiper-item item-id="2">
					<scroll-view class="scrollList" :scroll-top="30" scroll-y="true" @scrolltolower="receptMore">
						<view class="records" v-for="(item,index) of receptList" :key="index" @tap="goDetails(item)">
							<view class="records-item">
								<view class="color_303031 singleEllipsis summaryTitle">
									{{$isEmpty(item.title)?'':item.title}}
								</view>
								<view class="flexRowStart">
									<view class="color_919397 publisher">
										<text style="margin-right: 8rpx;">发送人:</text>
										<text>{{$isEmpty(item.creatorRealName)?'':item.creatorRealName}}</text>
									</view>
									<view class="color_919397 time">{{$isEmpty(item.createTime)?'':item.createTime.split(' ')[0]}}</view>
								</view>
							</view>
						</view>
						<uni-load-more :status="receptStatus" v-if="receptList.length>0"></uni-load-more>
						<image class="emptyImg" v-if="!receptList.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
					</scroll-view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				publishInfo: {},
				joinInfo: {},
				receptInfo: {},
				publishList: [],
				joinList: [],
				receptList: [],
				publishStatus: 'more',
				joinStatus: 'more',
				receptStatus: 'more',
				isAllActive: true,
				isUnderwayActive: false,
				isEndActive: false,
				item_id: 0,
				orgId: 0,
				oss: ''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			const {
				orgId
			} = options
			this.orgId = orgId
			this.$http.get('dms/meeting_summary/page/personal', {
				params: {
					nowOrgId: orgId
				}
			}).then(res => {
				console.log(res)
				this.publishInfo = res.data.data
				this.publishList = this.publishInfo.records
				if (!(this.publishInfo.current < this.publishInfo.pages)) {
					this.publishStatus = 'noMore';
				}
			})
			this.$http.get('dms/meeting_summary/my_involved/page', {
				params: {
					nowOrgId: orgId
				}
			}).then(res => {
				console.log(res)
				this.joinInfo = res.data.data
				this.joinList = this.joinInfo.records
				if (!(this.joinInfo.current < this.joinInfo.pages)) {
					this.joinStatus = 'noMore';
				}
			})
			this.$http.get('dms/meeting_summary/my_received/page', {
				params: {
					nowOrgId: orgId
				}
			}).then(res => {
				console.log(res)
				this.receptInfo = res.data.data
				this.receptList = this.receptInfo.records
				if (!(this.receptInfo.current < this.receptInfo.pages)) {
					this.receptStatus = 'noMore';
				}
			})
		},
		methods: {
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.allClick();
				} else if (e.detail.current == 1) {
					this.underwayClick();
				} else {
					this.endClick()
				}
			},
			allClick() {
				this.isAllActive = true;
				this.isUnderwayActive = false;
				this.isEndActive = false;
				this.item_id = 0;
			},
			underwayClick() {
				this.isAllActive = false;
				this.isUnderwayActive = true;
				this.isEndActive = false;
				this.item_id = 1;
			},
			endClick() {
				this.isAllActive = false;
				this.isUnderwayActive = false;
				this.isEndActive = true
				this.item_id = 2
			},
			publishMore() {
				let that = this;
				if (that.publishInfo.current < that.publishInfo.pages) {
					that.publishStatus = 'loading';
					that.$http.get('dms/meeting_summary/page/personal', {
						params: {
							nowOrgId: that.orgId,
							current: that.publishInfo.current + 1
						}
					}).then(res => {
						that.publishInfo.current = res.data.data.current;
						that.publishList = that.publishInfo.records.concat(res.data.data.records);
						that.publishStatus = 'more';
					});
				} else {
					that.publishStatus = 'noMore';
				}
			},
			joinMore() {
				let that = this;
				if (that.joinInfo.current < that.joinInfo.pages) {
					that.joinStatus = 'loading';
					that.$http.get('dms/meeting_summary/my_involved/page', {
						params: {
							nowOrgId: that.orgId,
							current: that.joinInfo.current + 1
						}
					}).then(res => {
						that.joinInfo.current = res.data.data.current;
						that.joinList = that.joinInfo.records.concat(res.data.data.records);
						that.joinStatus = 'more';
					});
				} else {
					that.joinStatus = 'noMore';
				}
			},
			receptMore() {
				let that = this;
				if (that.receptInfo.current < that.receptInfo.pages) {
					that.receptStatus = 'loading';
					that.$http.get('dms/meeting_summary/my_received/page', {
						params: {
							nowOrgId: that.orgId,
							current: that.receptInfo.current + 1
						}
					}).then(res => {
						that.receptInfo.current = res.data.data.current;
						that.receptList = that.receptInfo.records.concat(res.data.data.records);
						that.receptStatus = 'more';
					});
				} else {
					that.receptStatus = 'noMore';
				}
			},
			goDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soSummary/soSummaryDetail/soSummaryDetail?id=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.containerWrap {
		height: 100vh;
		display: flex;
		flex-direction: column;

		.title {
			display: flex;
			text-align: center;
			margin-top: 20rpx;

			.title-item {
				flex: 1;
				text-align: center;

				.title-item-bottom {
					width: 12rpx;
					height: 6rpx;
					border-radius: 3rpx;
					background-color: #F74437;
					margin: 10rpx auto;
				}
			}
		}

		.content {
			flex: 1;

			.scrollList {
				height: 100%;

				.records {
					width: 670rpx;
					margin: 0 auto;
					margin-bottom: 40rpx;
					background-color: #FFFFFF;
					border-radius: 30rpx;
					position: relative;

					.records-item {
						border-radius: 30rpx;
						background-color: #F4F5F6;
						padding: 24rpx 40rpx 36rpx;

						.summaryTitle {
							font-size: 28rpx;
							line-height: 40rpx;
							margin-bottom: 10rpx;
						}

						.publisher {
							font-size: 22rpx;
							line-height: 32rpx;
						}

						.time {
							font-size: 20rpx;
							line-height: 28rpx;
							margin-left: 46rpx;
						}
					}
				}
			}
		}
	}

	.active {
		color: #f74437;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 50rpx;
	}

	.unactive {
		color: #919397;
		font-size: 28rpx;
		font-weight: normal;
		line-height: 50rpx;
	}

	.swiper-item {
		display: block;
		height: 100%;
		// line-height: 300rpx;
		text-align: center;
		background-color: #f4f5f6;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
