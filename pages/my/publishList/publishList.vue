<template>
	<view>
		<view class="container">
			<view class="wrapTitle">
				<view class="title" @tap="serviceClick()">
					<view :class="[{ active: isServiceActive }, { unactive: !isServiceActive }]">服务</view>
					<view class="titleLine" v-if="isServiceActive"></view>
				</view>
				<view class="title" @tap="activityClick()">
					<view :class="[{ active: isActivityActive }, { unactive: !isActivityActive }]">活动</view>
					<view class="titleLine" v-if="isActivityActive"></view>
				</view>
				<view class="title" @tap="questionaireClick()">
					<view :class="[{ active: isQuestionaireActive }, { unactive: !isQuestionaireActive }]">问卷</view>
					<view class="titleLine" v-if="isQuestionaireActive"></view>
				</view>
			</view>
			<swiper circular @change="swiperChange" class="safe-bottom" style="flex: 1;margin-top: 16rpx;" observer observerParents :current-item-id="item_id" ref="swiper">
				<swiper-item item-id="0">
					<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="activityMoreAll">
						<view class="list" v-for="(item, index) in serviceList" :key="index" @tap="goServiceDetails(item)">
							<view class="flexRowStart magicInfo">
								<image lazy-load="true" :src="item.picture" mode="aspectFill" class="goodsImg"></image>
								<view class="wrapInfo">
									<view class="color_303031 doubleEllipsis goods bold">
										{{$isEmpty(item.name)?'':item.name}}
									</view>
									<view class="" style="width: 100%;">
										<view class="color_919397" style="font-size: 24rpx;line-height: 34rpx;margin-bottom: 18rpx;">
											{{$isEmpty(item.orgName)?'':item.orgName}}
										</view>
										<view class="flexRow">
											<view class="color_919397" style="font-size: 22rpx;line-height: 40rpx;">
												{{$isEmpty(item.createTime)?'':item.createTime.substring(0,10)}}
											</view>
											<view class="" v-if="item.state==0" style="font-size: 26rpx;line-height: 40rpx;color:#9AA1A7;">
												未提交审核
											</view>
											<view class="" v-if="item.state==1" style="font-size: 26rpx;line-height: 40rpx;color:#57DBB1;">
												审核中
											</view>
											<view class="" v-if="item.state==2" style="font-size: 26rpx;line-height: 40rpx;color:#F73737;">
												审核通过
											</view>
											<view class="" v-if="item.state==3" style="font-size: 26rpx;line-height: 40rpx;color:#9AA1A7;">
												审核失败
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!serviceList.length>0 &&oss" :src="oss+'pic_noOrderList.png'" mode="aspectFit"></image>
						<uni-load-more :status="serviceMoreStatus" v-if="serviceList.length>0"></uni-load-more>
					</scroll-view>
				</swiper-item>
				<swiper-item item-id="1">
					<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="activityMoreIng">
						<view class="list" v-for="(item, index) in activityList" :key="index" @tap="goActivityDetails(item)">
							<view class="flexRowStart magicInfo">
								<image lazy-load="true" :src="item.picture" mode="aspectFill" class="goodsImg" style="width: 300rpx;height: 180rpx;"></image>
								<view class="wrapInfo" style="height: 180rpx;">
									<view class="color_303031 doubleEllipsis goods bold">
										{{$isEmpty(item.name)?'':item.name}}
									</view>
									<view class="" style="width: 100%;">
										<view class="color_919397" style="font-size: 24rpx;line-height: 34rpx;margin-bottom: 18rpx;">
											{{$isEmpty(item.orgName)?'':item.orgName}}
										</view>
										<view class="flexRow">
											<view class="color_919397" style="font-size: 22rpx;line-height: 40rpx;">
												{{$isEmpty(item.createTime)?'':item.createTime.substring(0,10)}}
											</view>
											<view class="" v-if="item.state==0" style="font-size: 26rpx;line-height: 40rpx;color:#9AA1A7;">
												草稿
											</view>
											<view class="" v-if="item.state==1" style="font-size: 26rpx;line-height: 40rpx;color:#57DBB1;">
												进行中
											</view>
											<view class="" v-if="item.state==2" style="font-size: 26rpx;line-height: 40rpx;color:#9AA1A7;">
												已结束
											</view>
											<!-- <view class="" v-if="item.state==3" style="font-size: 26rpx;line-height: 40rpx;color:#9AA1A7;">
												审核失败
											</view> -->
										</view>
									</view>
								</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!activityList.length>0 && oss" :src="oss+'pic_noOrderList.png'" mode="aspectFit"></image>
						<uni-load-more :status="activityMoreStatus" v-if="activityList.length>0"></uni-load-more>
					</scroll-view>
				</swiper-item>
				<swiper-item item-id="2">
					<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="activityMoreEnd">
						<view class="list" v-for="(item, index) in questionaireList" :key="index" @tap="goQuestionaireDetails(item)">
							<view class="flexRowStart magicInfo">
								<image lazy-load="true" :src="item.picture" mode="aspectFill" class="goodsImg"></image>
								<view class="wrapInfo">
									<view class="color_303031 doubleEllipsis goods bold">
										{{$isEmpty(item.name)?'':item.name}}
									</view>
									<view class="" style="width: 100%;">
										<view class="color_919397" style="font-size: 24rpx;line-height: 34rpx;margin-bottom: 18rpx;">
											{{$isEmpty(item.orgName)?'':item.orgName}}
										</view>
										<view class="flexRow">
											<view class="color_919397" style="font-size: 22rpx;line-height: 40rpx;">
												{{$isEmpty(item.createTime)?'':item.createTime.substring(0,10)}}
											</view>
											<view class="" v-if="item.state==1" style="font-size: 26rpx;line-height: 40rpx;color:#57DBB1;">
												进行中
											</view>
											<view class="" v-if="item.state==2" style="font-size: 26rpx;line-height: 40rpx;color:#9AA1A7;">
												草稿
											</view>
											<view class="" v-if="item.state==3" style="font-size: 26rpx;line-height: 40rpx;color:#9AA1A7;">
												已结束
											</view>
											<view class="" v-if="item.state==4" style="font-size: 26rpx;line-height: 40rpx;color:#57DBB1;">
												审核中
											</view>
											<view class="" v-if="item.state==5" style="font-size: 26rpx;line-height: 40rpx;color:#F73737;">
												未通过
											</view>
											<view class="" v-if="item.state==6" style="font-size: 26rpx;line-height: 40rpx;color:#9AA1A7;">
												未开始
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!questionaireList.length>0 && oss" :src="oss+'pic_noOrderList.png'" mode="aspectFit"></image>
						<uni-load-more :status="questionaireMoreStatus" v-if="questionaireList.length>0"></uni-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import {
		goCheckoutCounter,
		soImageError,
		imageError
	} from '@/common/utils.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		isEmpty
	} from '@/common/utils.js'
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				serviceInfo: {},
				activityInfo: {},
				questionaireInfo: {},
				serviceList: [],
				activityList: [],
				questionaireList: [],
				isServiceActive: true,
				isActivityActive: false,
				isQuestionaireActive: false,
				item_id: 0,
				serviceMoreStatus: 'more',
				activityMoreStatus: 'more',
				questionaireMoreStatus: 'more',
				oss: '',
				status: false
			};
		},
		onLoad() {
			this.oss = this.$oss
			this.$http.get('dms/app/square/my',{
				params:{
					size:10,
					current:1
				}
			}).then(res => {
				// console.log(res)
				this.serviceInfo = res.data.data;
				this.serviceList = res.data.data.records;
				if (this.serviceInfo.current == this.serviceInfo.pages) {
					this.serviceMoreStatus = 'noMore';
				} else if (this.serviceInfo.pages == 0) {
					this.serviceMoreStatus = 'noMore';
				}
			})
			this.$http.get('qms/conference_publish/my_release', {
				params: {
					size: 20,
					current:1
				}
			}).then(res => {
				// console.log(res)
				this.activityInfo = res.data.data;
				this.activityList = res.data.data.records;
				if (this.activityInfo.current == this.activityInfo.pages) {
					this.activityMoreStatus = 'noMore';
				} else if (this.activityInfo.pages == 0) {
					this.activityMoreStatus = 'noMore';
				}
			})
			this.$http.get('qms/questionnaire/my_publish', {
				params: {
					size: 20,
					current:1
				}
			}).then(res => {
				// console.log(res)
				this.questionaireInfo = res.data.data;
				this.questionaireList = res.data.data.records;
				if (this.questionaireInfo.current == this.questionaireInfo.pages) {
					this.questionaireMoreStatus = 'noMore';
				} else if (this.questionaireInfo.pages == 0) {
					this.questionaireMoreStatus = 'noMore';
				}
			})
		},
		onShow() {
				this.$http.get('dms/app/square/my',{
					params:{
						size:20,
						current:1
					}
				}).then(res => {
					// console.log(res)
					this.serviceInfo = res.data.data;
					this.serviceList = res.data.data.records;
					if (this.serviceInfo.current == this.serviceInfo.pages) {
						this.serviceMoreStatus = 'noMore';
					} else if (this.serviceInfo.pages == 0) {
						this.serviceMoreStatus = 'noMore';
					}
				})
				this.$http.get('qms/conference_publish/my_release', {
					params: {
						size:20,
						current:1
					}
				}).then(res => {
					// console.log(res)
					this.activityInfo = res.data.data;
					this.activityList = res.data.data.records;
					if (this.activityInfo.current == this.activityInfo.pages) {
						this.activityMoreStatus = 'noMore';
					} else if (this.activityInfo.pages == 0) {
						this.activityMoreStatus = 'noMore';
					}
				})
				this.$http.get('qms/questionnaire/my_publish', {
					params: {
						size: 20,
						current:1
					}
				}).then(res => {
					// console.log(res)
					this.questionaireInfo = res.data.data;
					this.questionaireList = res.data.data.records;
					if (this.questionaireInfo.current == this.questionaireInfo.pages) {
						this.questionaireMoreStatus = 'noMore';
					} else if (this.questionaireInfo.pages == 0) {
						this.questionaireMoreStatus = 'noMore';
					}
				})
		},
		methods: {
			soImageError,
			imageError,
			goCheckoutCounter,
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.serviceClick();
				} else if (e.detail.current == 1) {
					this.activityClick();
				} else if (e.detail.current == 2) {
					this.questionaireClick()
				} 
			},
			activityMoreAll() {
				let that = this;
				if (that.serviceInfo.current < that.serviceInfo.pages) {
					that.serviceMoreStatus = 'loading';
					that.$http.get('dms/app/square/my', {
						params: {
							current: that.serviceInfo.current + 1
						}
					}).then(res => {
						that.serviceInfo.current = res.data.data.current;
						that.serviceList = that.serviceList.concat(res.data.data.records);
						that.serviceMoreStatus = 'more';
					});
				} else {
					that.serviceMoreStatus = 'noMore';
				}
			},
			activityMoreIng() {
				let that = this;
				if (that.activityInfo.current < that.activityInfo.pages) {
					that.activityMoreStatus = 'loading';
					that.$http.get('qms/conference_publish/my_release', {
						params: {
							current: that.activityInfo.current + 1
						}
					}).then(res => {
						that.activityInfo.current = res.data.data.current;
						that.activityList = that.activityList.concat(res.data.data.records);
						that.activityMoreStatus = 'more';
					});
				} else {
					that.activityMoreStatus = 'noMore';
				}
			},
			activityMoreEnd() {
				let that = this;
				if (that.questionaireInfo.current < that.questionaireInfo.pages) {
					that.questionaireMoreStatus = 'loading';
					that.$http.get('qms/questionnaire/my_publish', {
						params: {
							current: that.questionaireInfo.current + 1
						}
					}).then(res => {
						that.questionaireInfo.current = res.data.data.current;
						that.questionaireList = that.questionaireList.concat(res.data.data.records);
						that.questionaireMoreStatus = 'more';
					});
				} else {
					that.questionaireMoreStatus = 'noMore';
				}
			},
			serviceClick() {
				// console.log(666)
				this.isServiceActive = true;
				this.isActivityActive = false;
				this.isQuestionaireActive = false;
				this.item_id = 0;
				// this.$http.get('fms/order/my/order_page').then(res => {
				// 	// console.log(res)
				// 	this.serviceInfo = res.data.data;
				// 	this.serviceList = res.data.data.records;
				// 	if (this.serviceInfo.current == this.serviceInfo.pages) {
				// 		this.serviceMoreStatus = 'noMore';
				// 	} else if (this.serviceInfo.pages == 0) {
				// 		this.serviceMoreStatus = 'noMore';
				// 	}
				// });
			},
			activityClick() {
				this.isServiceActive = false;
				this.isActivityActive = true;
				this.isQuestionaireActive = false;
				this.item_id = 1;
				// this.$http.get('fms/order/my/order_page', {
				// 	params: {
				// 		status: 0
				// 	}
				// }).then(res => {
				// 	// console.log(res)
				// 	this.activityInfo = res.data.data;
				// 	this.activityList = res.data.data.records;
				// 	if (this.activityInfo.current == this.activityInfo.pages) {
				// 		this.activityMoreStatus = 'noMore';
				// 	} else if (this.activityInfo.pages == 0) {
				// 		this.activityMoreStatus = 'noMore';
				// 	}
				// });
				// console.log(this.showList)
			},
			questionaireClick() {
				this.isServiceActive = false;
				this.isActivityActive = false;
				this.isQuestionaireActive = true
				this.item_id = 2
				// this.$http.get('fms/order/my/order_page', {
				// 	params: {
				// 		status: 1
				// 	}
				// }).then(res => {
				// 	// console.log(res)
				// 	this.questionaireInfo = res.data.data;
				// 	this.questionaireList = res.data.data.records;
				// 	if (this.questionaireInfo.current == this.questionaireInfo.pages) {
				// 		this.questionaireMoreStatus = 'noMore';
				// 	} else if (this.questionaireInfo.pages == 0) {
				// 		this.questionaireMoreStatus = 'noMore';
				// 	}
				// });
				// console.log(this.showList)
			},
			goServiceDetails(item) {
				uni.navigateTo({
					url: `/pages/find/magicBox/detail/detail?id=${item.id}`
				})
			},
			goActivityDetails(item){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.id}`
				})
			},
			goQuestionaireDetails(item){
				if(item.state == 2){
					uni.showToast({
						title:"该状态不可点击",
						icon:"none"
					})
				}else if(item.state==4){
					uni.showToast({
						title:"该问卷审核中,请等待",
						icon:"none"
					})
				}else if(item.state == 5){
					uni.showToast({
						title:"该问卷未通过审核",
						icon:"none"
					})
				}else if(item.state == 6){
					uni.showToast({
						title:"该问卷未开始,请等待",
						icon:"none"
					})
				}else {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}`
					})
				}
			},
			isEmpty
		}
	}
</script>

<style lang="scss">
	.applyBtn {
		width: 160rpx;
		height: 60rpx;
		padding: 0;
		font-size: 26rpx;
		line-height: 36rpx;
		border-radius: 30rpx;
	}

	.payBtn {
		width: 160rpx;
		height: 60rpx;
		padding: 0;
		font-size: 26rpx;
		line-height: 36rpx;
		border-radius: 30rpx;
		margin-left: 30rpx;
	}

	.cancelBtn {
		width: 156rpx;
		height: 56rpx;
		background: #FFFFFF;
		color: #272727;
		border: 2rpx solid #EDEDED;
		padding: 0;
		font-size: 26rpx;
		line-height: 36rpx;
		border-radius: 30rpx;
	}

	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;

		.wrapTitle {
			padding: 24rpx 32rpx 0;
			display: flex;
			background-color: #FFFFFF;

			.title {
				text-align: center;
				flex: 1;

				.titleLine {
					width: 20rpx;
					height: 6rpx;
					border-radius: 10rpx;
					background: linear-gradient(180deg, #FF825C 0%, #FF3636 100%);
					margin: 10rpx auto;
				}
			}
		}

		.scroll-Y {
			height: 100%;
			width: 702rpx;
			margin: 0 auto;

			.list {
				margin-bottom: 16rpx;
				background-color: #FFFFFF;
				border-radius: 16rpx;
				position: relative;
				padding: 32rpx 24rpx;

				.order-type {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.order-type-text {
						font-size: 24rpx;
						line-height: 34rpx;
						color: #919397;
					}
				}

				.magicTitle {
					font-size: 30rpx;
					line-height: 42rpx;
					// margin-bottom: 24rpx;

					.orgImg {
						width: 36rpx;
						height: 36rpx;
						margin-right: 20rpx;
						border-radius: 50%;
					}

					.orgName {
						flex: 1;
						min-width: 0;
					}

					.icon {
						font-weight: normal;
					}
				}

				.magicInfo {
					// margin-bottom: 24rpx;

					.goodsImg {
						width: 184rpx;
						height: 184rpx;
						margin-right: 16rpx;
						border-radius: 16rpx;
					}

					.wrapInfo {
						flex: 1;
						height: 184rpx;
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: space-between;

						.goods {
							font-size: 30rpx;
							line-height: 42rpx;
							margin-bottom: 40rpx;
						}

						.icon {
							width: 100%;
							font-size: 30rpx;
							line-height: 42rpx;
						}
					}
				}

				.numInfo {
					font-size: 30rpx;
					line-height: 42rpx;
					margin-bottom: 24rpx;
					text-align: right;
				}
			}
		}
	}

	page {
		background-color: #F4F5F6;
	}

	.active {
		color: #272727;
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
</style>
