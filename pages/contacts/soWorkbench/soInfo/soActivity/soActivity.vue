<template>
	<view class="container">
		<view class="containerWrap">
			<view class="title">
				<view class="title-item" @tap="allClick()">
					<view :class="[{ active: isAllActive }, { unactive: !isAllActive }]">全部</view>
					<view class="title-item-bottom" v-if="isAllActive"></view>
				</view>
				<view class="title-item" @tap="underwayClick()">
					<view :class="[{ active: isUnderwayActive }, { unactive: !isUnderwayActive }]">进行中</view>
					<view class="title-item-bottom" v-if="isUnderwayActive"></view>
				</view>
				<view class="title-item" @tap="endClick()">
					<view :class="[{ active: isEndActive }, { unactive: !isEndActive }]">已结束</view>
					<view class="title-item-bottom" v-if="isEndActive"></view>
				</view>
			</view>
			<swiper class="content" circular @change="swiperChange" observer observerParents :current-item-id="item_id" ref="swiper">
				<swiper-item item-id="0">
					<scroll-view class="scrollList" :scroll-top="30" scroll-y="true" @scrolltolower="activityMore">
						<view class="records" @tap="goDetails(item)" v-for="(item, index) in activity.records" :key="index">
							<view class="" style="">
								<image lazy-load="true" class="poster" :src="item.poster" mode="aspectFill"></image>
							</view>
							<view v-if="item.statusFlag==0" class="statusFlag color_FFFFFF bold">
								草稿
							</view>
							<view v-if="item.statusFlag==1" class="statusFlagIng color_FFFFFF bold">
								进行中
							</view>
							<view v-if="item.statusFlag==2" class="statusFlag color_FFFFFF bold">
								已结束
							</view>
							<view v-if="item.statusFlag==3" class="statusFlag color_FFFFFF bold">
								已下架
							</view>
							<view class="info">
								<view class="color_303031 bold name">
									{{$isEmpty(item.name)?'':item.name}}
								</view>
								<view class="color_919397 flexRow timeInfo">
									<view class="flexRowStart">
										<image v-if="oss" class="timeImg" :src="oss+'icon_so_activity_time.png'"></image>
										<text>{{$isEmpty(item.startTime)?'':item.startTime.split(" ")[0].split("-")[1]+"/"+item.startTime.split(" ")[0].split("-")[2]+" "+ item.startTime.split(" ")[1].split(":")[0]+":"+item.startTime.split(" ")[1].split(":")[1]}}~{{$isEmpty(item.endTime)?'':item.endTime.split(" ")[0].split("-")[1]+"/"+item.endTime.split(" ")[0].split("-")[2]+" "+ item.endTime.split(" ")[1].split(":")[0]+":"+item.endTime.split(" ")[1].split(":")[1]}}</text>
									</view>
									<view class="flexRowStart">
										<text>审核：</text>
										<text v-if="item.auditStatus==0" class="color_3CD489">未提交</text>
										<text v-if="item.auditStatus==1" class="color_3CD489">审核中</text>
										<text v-if="item.auditStatus==2" class="color_3CD489">未通过</text>
										<text v-if="item.auditStatus==3" class="color_3CD489">已通过</text>
									</view>
								</view>
								<view class="color_919397 flexRowStart fieldInfo">
									<image v-if="oss" class="locationImg" :src="oss+'icon_so_activity_location.png'"></image>
									<text>{{$isEmpty(item.city)?'':item.city}}{{$isEmpty(item.field)?'':'-'+item.field}}</text>
								</view>
								<view class="flexRow" v-if="item.isAdmin==1 || item.isAdmin==2">
									<view class="button" style="flex: 1;margin-right: 30rpx;" @tap.stop='goOrderUserList(item)'>
										名单管理
									</view>
									<view class="button" style=" flex: 1;" @tap.stop='goOrderTicketList(item)'>
										票务管理
									</view>
								</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!activity.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
						<uni-load-more :status="activityStatus" v-if="activity.records.length>0"></uni-load-more>
					</scroll-view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</swiper-item>
				<swiper-item item-id="1">
					<scroll-view class="scrollList" :scroll-top="30" scroll-y="true" @scrolltolower="processingMore">
						<view class="records" @tap="goDetails(item)" v-for="(item, index) in processing.records" :key="index">
							<view class="" style="">
								<image lazy-load="true" class="poster" :src="item.poster" mode="aspectFill"></image>
							</view>
							<view v-if="item.statusFlag==0" class="statusFlag color_FFFFFF bold">
								草稿
							</view>
							<view v-if="item.statusFlag==1" class="statusFlagIng color_FFFFFF bold">
								进行中
							</view>
							<view v-if="item.statusFlag==2" class="statusFlag color_FFFFFF bold">
								已结束
							</view>
							<view v-if="item.statusFlag==3" class="statusFlag color_FFFFFF bold">
								已下架
							</view>
							<view class="info">
								<view class="color_303031 bold name">
									{{$isEmpty(item.name)?'':item.name}}
								</view>
								<view class="color_919397 flexRow timeInfo">
									<view class="flexRowStart">
										<image v-if="oss" class="timeImg" :src="oss+'icon_so_activity_time.png'"></image>
										<text>{{$isEmpty(item.startTime)?'':item.startTime.split(" ")[0].split("-")[1]+"/"+item.startTime.split(" ")[0].split("-")[2]+" "+ item.startTime.split(" ")[1].split(":")[0]+":"+item.startTime.split(" ")[1].split(":")[1]}}~{{$isEmpty(item.endTime)?'':item.endTime.split(" ")[0].split("-")[1]+"/"+item.endTime.split(" ")[0].split("-")[2]+" "+ item.endTime.split(" ")[1].split(":")[0]+":"+item.endTime.split(" ")[1].split(":")[1]}}</text>
									</view>
								</view>
								<view class="color_919397 flexRowStart fieldInfo">
									<image v-if="oss" class="locationImg" :src="oss+'icon_so_activity_location.png'"></image>
									<text>{{$isEmpty(item.city)?'':item.city}}-{{$isEmpty(item.field)?'':item.field}}</text>
								</view>
								<view class="flexRow" v-if="item.isAdmin==1 || item.isAdmin==2">
									<view class="button" style="flex: 1;margin-right: 30rpx;" @tap.stop='goOrderUserList(item)'>
										名单管理
									</view>
									<view class="button" style=" flex: 1;" @tap.stop='goOrderTicketList(item)'>
										票务管理
									</view>
								</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!processing.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
						<uni-load-more :status="processingStatus" v-if="processing.records.length>0"></uni-load-more>
					</scroll-view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</swiper-item>
				<swiper-item item-id="2">
					<scroll-view class="scrollList" :scroll-top="30" scroll-y="true" @scrolltolower="completedMore">
						<view class="records" @tap="goDetails(item)" v-for="(item, index) in completed.records" :key="index">
							<view class="" style="">
								<image lazy-load="true" class="poster" :src="item.poster" mode="aspectFill"></image>
							</view>
							<view v-if="item.statusFlag==0" class="statusFlag color_FFFFFF bold">
								草稿
							</view>
							<view v-if="item.statusFlag==1" class="statusFlagIng color_FFFFFF bold">
								进行中
							</view>
							<view v-if="item.statusFlag==2" class="statusFlag color_FFFFFF bold">
								已结束
							</view>
							<view v-if="item.statusFlag==3" class="statusFlag color_FFFFFF bold">
								已下架
							</view>
							<view class="info">
								<view class="color_303031 bold name">
									{{$isEmpty(item.name)?'':item.name}}
								</view>
								<view class="color_919397 flexRow timeInfo">
									<view class="flexRowStart">
										<image v-if="oss" class="timeImg" :src="oss+'icon_so_activity_time.png'"></image>
										<text>{{$isEmpty(item.startTime)?'':item.startTime.split(" ")[0].split("-")[1]+"/"+item.startTime.split(" ")[0].split("-")[2]+" "+ item.startTime.split(" ")[1].split(":")[0]+":"+item.startTime.split(" ")[1].split(":")[1]}}~{{$isEmpty(item.endTime)?'':item.endTime.split(" ")[0].split("-")[1]+"/"+item.endTime.split(" ")[0].split("-")[2]+" "+ item.endTime.split(" ")[1].split(":")[0]+":"+item.endTime.split(" ")[1].split(":")[1]}}</text>
									</view>
								</view>
								<view class="color_919397 flexRowStart fieldInfo">
									<image v-if="oss" class="locationImg" :src="oss+'icon_so_activity_location.png'"></image>
									<text>{{$isEmpty(item.city)?'':item.city}}-{{item.field}}</text>
								</view>
								<view class="flexRow" v-if="item.isAdmin==1 || item.isAdmin==2">
									<view class="button" style="flex: 1;margin-right: 30rpx;" @tap.stop='goOrderUserList(item)'>
										名单管理
									</view>
									<view class="button" style=" flex: 1;" @tap.stop='goOrderTicketList(item)'>
										票务管理
									</view>
								</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!completed.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
						<uni-load-more :status="completedStatus" v-if="completed.records.length>0"></uni-load-more>
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
				activity: {},
				processing: {},
				completed: {},
				activityStatus: 'more',
				processingStatus: 'more',
				completedStatus: 'more',
				isAllActive: true,
				isUnderwayActive: false,
				isEndActive: false,
				item_id: 0,
				orgId: 0,
				oss: ''
			}
		},
		onLoad(options) {
			const {
				orgId
			} = options
			// console.log(orgId)
			this.oss = this.$oss
			this.orgId = orgId
			this.$http.get('qms/conference_publish/so_page', {
				params: {
					orgId: orgId,
					size: 20,
					current: 1,
				}
			}).then(res => {
				this.activity = res.data.data;
				if (!(this.activity.current < this.activity.pages)) {
					this.activityStatus = 'noMore';
				}
			});
			this.$http.get('qms/conference_publish/so_page', {
				params: {
					orgId: orgId,
					size: 20,
					statusFlag: 1,
					current: 1,
				}
			}).then(res => {
				this.processing = res.data.data;
				if (!(this.processing.current < this.processing.pages)) {
					this.processingStatus = 'noMore';
				}
			})
			this.$http.get('qms/conference_publish/so_page', {
				params: {
					orgId: orgId,
					size: 20,
					statusFlag: 2,
					current: 1,
				}
			}).then(res => {
				this.completed = res.data.data;
				if (!(this.completed.current < this.completed.pages)) {
					this.completedStatus = 'noMore';
				}
			})
		},
		methods: {
			goOrderUserList(item){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soActivity/orderUserList/orderUserList?id=${item.id}`
				})
			},
			goOrderTicketList(item){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soActivity/orderTicketList/orderTicketList?id=${item.id}`
				})
			},
			activityMore() {
				let that = this;
				if (that.activity.current < that.activity.pages) {
					that.activityStatus = 'loading';
					that.$http.get('qms/conference_publish/so_page', {
						params: {
							orgId: that.orgId,
							size: 20,
							current: that.activity.current + 1
						}
					}).then(res => {
						that.activity.current = res.data.data.current;
						that.activity.records = that.activity.records.concat(res.data.data.records);
						that.activityStatus = 'more';
					});
				} else {
					that.activityStatus = 'noMore';
				}
			},
			processingMore() {
				let that = this;
				if (that.processing.current < that.processing.pages) {
					that.processingStatus = 'loading';
					that.$http.get('qms/conference_publish/so_page', {
						params: {
							orgId: that.orgId,
							statusFlag: 1,
							size: 20,
							current: that.processing.current + 1
						}
					}).then(res => {
						that.processing.current = res.data.data.current;
						that.processing.records = that.processing.records.concat(res.data.data.records);
						that.processingStatus = 'more';
					});
				} else {
					that.processingStatus = 'noMore';
				}
			},
			completedMore() {
				let that = this;
				if (that.completed.current < that.completed.pages) {
					that.completedStatus = 'loading';
					that.$http.get('qms/conference_publish/so_page', {
						params: {
							orgId: that.orgId,
							statusFlag: 2,
							size: 20,
							current: that.completed.current + 1
						}
					}).then(res => {
						that.completed.current = res.data.data.current;
						that.completed.records = that.completed.records.concat(res.data.data.records);
						that.completedStatus = 'more';
					});
				} else {
					that.completedStatus = 'noMore';
				}
			},
			goDetails(item) {
				// console.log(item)
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.id}`
				})
			},
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5f7f8;
	}

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
					// background-color: #F74437;
					background-color: #46B28B;
					margin: 10rpx auto;
				}
			}
		}

		.content {
			flex: 1;

			.scrollList {
				height: 100%;

				.records {
					margin: 0 32rpx;
					margin-bottom: 40rpx;
					background-color: #FFFFFF;
					border-radius: 30rpx;
					position: relative;

					.poster {
						width: 100%;
						height: 414rpx;
						opacity: 0.9;
						border-radius: 30rpx 30rpx 0px 0px;
					}

					.statusFlag {
						font-size: 24rpx;
						line-height: 54rpx;
						text-align: center;
						width: 120rpx;
						height: 54rpx;
						position: absolute;
						top: 42rpx;
						right: 0rpx;
						background-color: #000000;
						border-radius: 20rpx 0px 0px 20rpx;
						opacity: 0.9;
					}

					.statusFlagIng {
						font-size: 24rpx;
						line-height: 54rpx;
						text-align: center;
						width: 120rpx;
						height: 54rpx;
						position: absolute;
						top: 42rpx;
						right: 0rpx;
						background-color: #F74437;
						border-radius: 20rpx 0px 0px 20rpx;
						opacity: 0.9;
					}

					.info {
						padding: 20rpx 30rpx;

						.name {
							font-size: 32rpx;
							margin-bottom: 20rpx;
						}

						.timeInfo {
							margin-bottom: 20rpx;
							font-size: 22rpx;

							.timeImg {
								width: 26rpx;
								height: 26rpx;
								margin-right: 16rpx
							}
						}

						.fieldInfo {
							font-size: 22rpx;
							margin-bottom: 30rpx;

							.locationImg {
								width: 26rpx;
								height: 26rpx;
								padding-right: 16rpx;
							}
						}
					}
				}
			}
		}
	}

	.active {
		// color: #f74437;
		color: #46B28B;
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
