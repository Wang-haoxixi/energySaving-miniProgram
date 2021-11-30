<template>
	<view class="page">
		<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y safe-bottom" @scrolltolower="activityMoreEnd">
			<view v-for="(item, index) in showEndList" :key="index" class="scroll-item" @tap="goDetails(item)">
				<view>
					<image lazy-load="true" :src="item.poster" mode="aspectFill" class="poster"></image>
				</view>
				<view v-if="item.statusFlag==1" class="status bg_color_F74437">
					进行中
				</view>
				<view v-if="item.statusFlag==2" class="status bg_color_000000">
					已结束
				</view>
				<view class="info">
					<view class="name">
						{{$isEmpty(item.name)?'':item.name}}
					</view>
					<view class="color_919397 flexRow content">
						<view class="time">
							<image v-if="oss" :src="oss + 'icon_so_activity_time.png'" class="time-icon"></image>
							<text>{{item.startTime.split(" ")[0]}} | {{$isEmpty(item.week)?'':item.week}}</text>
						</view>
						<view class="color_3CD489 content-text" v-if="item.ticketingManagements[0].ticketingType==1 && item.orderStatus==1 ">
							免费票
						</view>
						<view class="color_F74437 content-text" v-else-if="item.paymentMethod==9 && item.orderStatus==0">
							线下支付-待付款
						</view>
						<view class="color_F74437 content-text" v-else-if="item.orderStatus==0 && item.paymentMethod==0">
							待支付
						</view>
						<view class="color_919397 content-text" v-else-if="item.paymentMethod==1 && item.orderStatus==1">
							能贝付款-已支付
						</view>
						<view class="color_BABEC0 content-text" v-else-if="item.orderStatus==3">
							已取消
						</view>
					</view>
					<view class="location">
						<image v-if="oss" :src="oss + 'icon_so_activity_location.png'" class="location-icon"></image>
						<text>{{$isEmpty(item.city)?'':item.city}}{{$isEmpty(item.field)?'':item.field}}</text>
					</view>
					<view class="more" @tap.stop="more(item)">
						<view class="more-title">
							{{$isEmpty(item.conferenceTicketingEnroleVOs.length)?'':'你有'+item.conferenceTicketingEnroleVOs.length+'次购票记录'}}
						</view>
						<view class="more-content" v-if="item.show == false">
							<view class="more-text">
								点击查看
							</view>
							<image class="show-icon" :src="$ossUrl('icon_activity_hide.png')"></image>
						</view>
						<view class="more-content" v-else-if="item.show == true">
							<view class="more-text">
								收起
							</view>
							<image class="show-icon" :src="$ossUrl('icon_activity_show.png')"></image>
						</view>
					</view>
					<view class="ticket-list" v-if="item.show">
						<view class="ticket" v-for="(item2,index2) in item.conferenceTicketingEnroleVOs" :key="index2" @tap.stop="checkInfo(item2)">
							<view class="ticket-item">
								<view class="">
									<text class="bold color_303031">票种：</text><text v-if="item2.ticketingType==1">免费票</text><text v-else-if="item2.ticketingType==2">付费票</text>
									{{$isEmpty(item2.orderNum)?'':' x '+item2.orderNum}}
								</view>
								<!-- <view class="order-information button" @tap.stop="checkInfo(item2)">
									购票信息
								</view> -->
								<view @tap.stop="checkCode(item2)" class="checkCodeBtn" v-if="item2.auditStatus==0 ||item2.auditStatus==2">
									查看签到码
								</view>
								<view @tap.stop="checkRefuse(item2)" class="checkReasonBtn" v-if="item2.auditStatus==3">
									查看理由
								</view>
							</view>
							<view class="ticket-item">
								<view class="">
									<text class="bold color_303031">票名：</text>{{$isEmpty(item2.ticketingName)?'':item2.ticketingName}}
								</view>
							</view>
							<view class="ticket-item">
								<view class="">
									<text class="bold color_303031">票价：</text>
									<text class="color_3CD489" v-if="item2.ticketingType==1">
										免费
									</text>
									<text class="color_F74437" v-else-if="item2.ticketingType==2">
										{{$isEmpty(item2.money)?'':item2.money+'元'}} <text v-if="item2.money&&item2.canMoney">/</text> {{$isEmpty(item2.orderTotal)?'':item2.orderTotal+'贝'}}
									</text>
								</view>
							</view>
							<view class="ticket-item" v-if="item2.auditStatus!=0">
								<view class="" style="flex: 1;">
									<view class="">
										<text class="bold color_303031">审核状态：</text>
										<text class="color_3CD489" v-if="item2.auditStatus==2" >通过</text>
										<text class="color_2F80FF" v-if="item2.auditStatus==1" >审核中</text>
										<text class="color_F74437" v-if="item2.auditStatus==3" >未通过</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!showEndList.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<uni-load-more :status="activityMoreStatusEnd" v-if="showEndList.length>0"></uni-load-more>
		</scroll-view>
		<uni-popup ref="refusedialog" type="center">
			<view class="popDialog">
				<view class="flexRowStart" style="justify-content: center;">
					<view class="color_666769 message">
						{{auditRemark}}
					</view>
				</view>
				<view class="flexRow">
					<view class="button" @tap="confirmRefuse" style="flex: 1;">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				activityinfoEnd: {},
				showEndList: [],
				orgId: 0,
				activityMoreStatusEnd: 'more',
				oss: '',
				auditRemark:''
			};
		},
		methods: {
			checkRefuse(item2){
				this.$refs.refusedialog.open()
				this.$http.get('qms/conference_enrole/get_remark',{
					params:{
						enroleId:item2.id
					}
				}).then(res=>{
					this.auditRemark=res.data.data
				})
			},
			confirmRefuse(){
				this.$refs.refusedialog.close()
			},
			checkCode(item) {
				console.log(item)
				uni.navigateTo({
					url: `/pages/my/meeting/orderInfo/checkCode/checkCode?id=${item.id}`
				})
			},
			more(item) {
				item.show = !item.show;
			},
			getMoney(ticket) {
				if (ticket.canMoney != '' && ticket.money == '') {
					return `${ticket.canMoney}贝`;
				} else if (ticket.money != '' && ticket.canMoney == '') {
					return `${ticket.money}元`;
				} else if (ticket.money != '' && ticket.canMoney != '') {
					return `${ticket.canMoney}贝/${ticket.money}元`;
				}else{
					return `0`;
				}
			},
			checkInfo(item) {
				uni.navigateTo({
					url: `/pages/my/meeting/orderInfo/orderInfo?enroleId=${item.id}&type=2`
				})
			},
			goPay(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/applyForm/confirmOrder/confirmOrder?enroleId=${item.enroleId}`
				})
			},
			activityMoreEnd() {
				let that = this
				if (that.activityinfoEnd.current < that.activityinfoEnd.pages) {
					that.activityMoreStatusEnd = 'loading';
					that.$http.get('qms/conference_publish/user_page_v3', {
						params: {
							orderStatus: 1,
							current: that.activityinfoEnd.current + 1
						}
					}).then(res => {
						that.activityinfoEnd.current = res.data.data.current;
						that.showEndList = that.showEndList.concat(res.data.data.records.map(item => {
							var week = this.getMyDay(new Date(item.startTime.split(" ")[0]))
							// console.log(week)
							return {
								...item,
								week: week,
								show: false
							}
						}));
						that.activityMoreStatusEnd = 'more';
					});
				} else {
					that.activityMoreStatusEnd = 'noMore';
				}
			},
			goDetails(item) {
				// console.log(item)
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.id}`
				})
			},
			getMyDay(date) {
				var week;
				if (date.getDay() == 0) week = "周日";
				if (date.getDay() == 1) week = "周一";
				if (date.getDay() == 2) week = "周二";
				if (date.getDay() == 3) week = "周三";
				if (date.getDay() == 4) week = "周四";
				if (date.getDay() == 5) week = "周五";
				if (date.getDay() == 6) week = "周六";
				return week;
			}
		},
		onLoad() {
			this.oss = this.$oss;
			this.$http.get('qms/conference_publish/user_page_v3', {
				params: {
					orderStatus: 1
				}
			}).then(res => {
				if (res.data.code == 0) {
					this.activityinfoEnd = res.data.data;
					this.showEndList = res.data.data.records;
					this.showEndList = this.showEndList.map(item => {
						var week = this.getMyDay(new Date(item.startTime.split(" ")[0]))
						return {
							...item,
							week: week,
							show: false
						}
					})
					this.showEndList.forEach((item,index)=>{
						if(index==0){
							item.show=true
						}
					})
					if (this.activityinfoEnd.current == this.activityinfoEnd.pages) {
						this.activityMoreStatusEnd = 'noMore';
					} else if (this.activityinfoEnd.pages == 0) {
						this.activityMoreStatusEnd = 'noMore';
					}
				}
			});
		}
	};
</script>

<style lang="scss">
	.checkCodeBtn{
		font-size: 24rpx;
		line-height: 34rpx;
		padding: 8rpx 24rpx;
		border-radius: 10rpx;
		color: #FFFFFF;
		// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
		background-color: #46B28B;
	}
	.checkReasonBtn{
		font-size: 24rpx;
		line-height: 34rpx;
		padding: 8rpx 24rpx;
		border-radius: 10rpx;
		color: #FFFFFF;
		// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
		background-color: #46B28B;
	}
	.popDialog {
		width: 590rpx;
		padding: 32rpx 32rpx 48rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);
	}
	.message {
		margin:48rpx 0;
		text-align: center;
		font-size: 28rpx;
		line-height: 52rpx;
	}
	
	page {
		background-color: #F5f7f8;
	}

	.page {
		// height: 100vh;
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

		.scroll-Y {
			height: 100%;

			.scroll-item {
				margin: 32rpx 32rpx 0;
				background-color: #FFFFFF;
				border-radius: 30rpx;
				position: relative;

				.poster {
					width: 100%;
					height: 414rpx;
					opacity: 0.9;
					border-radius: 30rpx 30rpx 0px 0px;
				}

				.status {
					color: #FFFFFF;
					font-size: 24rpx;
					font-weight: 500;
					line-height: 54rpx;
					text-align: center;
					width: 120rpx;
					height: 54rpx;
					position: absolute;
					top: 42rpx;
					right: 0rpx;
					border-radius: 20rpx 0px 0px 20rpx;
					opacity: 0.9;
				}

				.info {
					padding: 20rpx 30rpx 40rpx 30rpx;

					.name {
						font-size: 32rpx;
						margin-bottom: 20rpx;
						color: #303031;
						font-weight: bold;
					}

					.content {
						margin-bottom: 20rpx;
						font-size: 22rpx;

						.time {
							display: flex;
							align-items: center;

							.time-icon {
								width: 26rpx;
								height: 26rpx;
								padding-right: 16rpx;
							}
						}

						.content-text {
							line-height: 32rpx;
						}
					}

					.location {
						font-size: 22rpx;
						display: flex;
						align-items: center;
						margin-bottom: 30rpx;
						color: #919397;

						.location-icon {
							width: 26rpx;
							height: 26rpx;
							padding-right: 16rpx;
						}
					}

					.more {
						margin-top: 20rpx;
						padding: 20rpx 0;
						color: #2F80FF;
						font-size: 28rpx;
						line-height: 40rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-bottom: 0.3rpx solid #EFF0F1;

						.more-content {
							display: flex;
							align-items: center;

							.show-icon {
								width: 44rpx;
								height: 44rpx;
								margin-left: 2rpx;
							}
						}

					}

					.ticket-list {
						.ticket {
							padding: 20rpx 0;
							border-bottom: 0.3rpx solid #EFF0F1;

							.ticket-item {
								display: flex;
								align-items: center;
								justify-content: space-between;
								font-size: 28rpx;
								line-height: 40rpx;
								color: #919397;
								margin-top: 30rpx;

								.sub-title {
									font-size: 24rpx;
									line-height: 34rpx;
								}

								.order-information {
									padding: 8rpx 16rpx;
									font-size: 24rpx;
									line-height: 34rpx;
									background-color: #f744371a;
									color: #f74437;
								}

								.countdown {
									margin-top: 10rpx;
								}

								.ticket-cancel {
									padding: 8rpx 16rpx;
									font-size: 24rpx;
									line-height: 34rpx;
									background-color: #E3E4E5;
									color: #919397;
								}
							}
						}
					}

					.button-list {
						justify-content: space-between;
						margin-right: -30rpx;

						.button {
							background-color: #F4F5F6;
							color: #919397;
							flex: 1;
							margin-right: 30rpx;
						}

						.button-pay {
							background-color: #F74437;
							color: #FFFFFF;
							flex: 1;
						}
					}
				}
			}
		}
	}
</style>
