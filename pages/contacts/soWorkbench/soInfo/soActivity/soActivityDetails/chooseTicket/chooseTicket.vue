<template>
	<view class="container">
		<view class="containerWrap">
			<view class="content">
				<image class="posterImg" :src="activityInfo.poster" mode="aspectFill"></image>
				<view class="info">
					<view class="color_303031 bold name">
						{{$isEmpty(activityInfo.name)?'':activityInfo.name}}
					</view>
					<view class="color_919397 flexRow activityInfo">
						<view class="flexRowStart">
							<image v-if="oss" class="timeImg" :src="oss+'icon_so_activity_time.png'"></image>
							<text>{{$isEmpty(startTime)?'':startTime}}~{{$isEmpty(endTime)?'':endTime}}</text>
						</view>
						<view class="flexRowStart count">
							<view>阅读:</view>
							<view class="color_2F80FF num">{{$isEmpty(activityInfo.browseNum)?'':activityInfo.browseNum}}</view>
							<view class="line">|</view>
							<view>限额:</view>
							<view class="color_2F80FF num">{{$isEmpty(activityInfo.ticketNum)?'':activityInfo.ticketNum}}</view>
						</view>
					</view>
					<view class="color_919397 flexRowStart fieldInfo">
						<image v-if="oss" class="locationImg" :src="oss+'icon_so_activity_location.png'"></image>
						<view>{{$isEmpty(activityInfo.city)?'':activityInfo.city}}{{$isEmpty(activityInfo.field)?'':activityInfo.field}}</view>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<radio-group>
					<view class="ticketList" v-for="(item, index) in ticketList" :key="index">
						<label class="uni-list-cell uni-list-cell-pd" @tap="remindMsg(item)">
							<view class="flexRow typeInfo" @tap="changeRadio(item)">
								<view v-if="item.ticketingType==1" class="flexRowStart">
									<view class="color_3CD489 freeTicket">免费票</view>
									<image v-if="item.needAudit ==true && oss" :src="oss+'icon_activityAuditMark.png'" class="auditImg"></image>
									<view class="color_666769 ticketingName">{{$isEmpty(item.ticketingName)?'':item.ticketingName}}</view>
								</view>
								<view v-if="item.ticketingType==2" class="flexRowStart">
									<view class="color_F74437 payTicket">收费票</view>
									<image v-if="item.needAudit ==true && oss" :src="oss+'icon_activityAuditMark.png'" class="auditImg"></image>
									<view class="color_666769 ticketingName">{{$isEmpty(item.ticketingName)?'':item.ticketingName}}</view>
								</view>
								<view>
									<radio class="select" id="radio" :value="item.ticketingName"
									 color="#FF6034" :checked="item.checkStatus" />
								</view>
							</view>
						</label>
						<view v-if="item.ticketingType==2" class="payTicketInfo">
							<view class="flexRow wrapPayTicketInfo">
								<view class="flexRowStart">
									<image v-if="oss" class="payImg" :src="oss+'icon_chooseTicket_eachPay.png'"></image>
									<view class="color_919397 eachTitle">单价</view>
								</view>
								<view class="flexRowStart">
									<view class="color_919397 moneyInfo">
										{{$isEmpty(item.money)?'':item.money+'元'}} <text v-if="!($isEmpty(item.money)||$isEmpty(item.canMoney))">/</text>
										{{$isEmpty(item.canMoney)?'':item.canMoney+'贝'}}
									</view>
								</view>
							</view>
							<view class="flexRow countInfo">
								<view class="flexRowStart">
									<image v-if="oss" class="levelImg" :src="oss+'icon_chooseTicket_level.png'"></image>
									<view class="color_F74437 rank">V{{$isEmpty(item.rank)?'0':item.rank}}特权价</view>
								</view>
								<view class="flexRowStart discountMoneyInfo">
									<view class="color_F74437 wrapDiscountMoneyInfo">
										{{$isEmpty(item.discountMoney)?'':item.discountMoney+'元'}} <text v-if="!($isEmpty(item.discountMoney)||$isEmpty(item.discountCanMoney))">/</text>
										{{$isEmpty(item.discountCanMoney)?'':item.discountCanMoney + '贝'}}
									</view>
								</view>
							</view>
						</view>
						<view class="ticketNumInfo">
							<view class="flexRow">
								<view class="flexRowStart">
									<image v-if="oss" class="surplusTicketImg" :src="oss+'icon_chooseTicket_surplusTicket.png'"></image>
									<view class="color_919397 surplusTitle">余票</view>
								</view>
								<view class="color_303031 bold surplusNum">
									{{$isEmpty(item.surplus)?'0':item.surplus}}张
								</view>
							</view>
						</view>
						<view class="payNumInfo">
							<view class="flexRow">
								<view class="flexRowStart">
									<image v-if="oss" class="ticketCountImg" :src="oss+'icon_chooseTicket_ticketCount.png'"></image>
									<view class="color_919397 payNumTitle">购买数量</view>
								</view>
								<view class="color_303031 bold flexRowStart">
									<image v-if="oss" class="reduceImg" :src="oss+'icon_chooseTicket_reduce.png'" @tap.stop="reduceTicket(item)"></image>
									<!-- <view class="" style="font-size: 28rpx;line-height: 40rpx;flex: 1;">
										{{item.ticketCount}}
									</view> -->
									<input type="number" v-model="item.ticketCount" @blur="checkNum(item)" :disabled="item.checkStatus==false" />
									<image v-if="oss" class="addImg" :src="oss+'icon_chooseTicket_add.png'" mode="aspectFit" @tap.stop="addTicket(item)"></image>
								</view>
							</view>
						</view>
						<view class="color_919397 remarkInfo">
							<text> 备注:{{$isEmpty(item.remarks)?'无':item.remarks}}</text>
						</view>
					</view>
				</radio-group>
			</view>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view class="btn">
			<view class="button" @tap="goApplyForm" :class="status?'nextBtn':'notNextBtn'">
				下一步
			</view>
		</view>
		<uni-popup ref='auditDialog' type="center">
			<view class="popDialog flexColumn">
				<view class="">
					<view class="color_303031 title">
						主办方开启了审核
					</view>
					<view class="color_666769 message">
						报名后需由主办方审核通过，方可参加活动
					</view>
				</view>
				<view class="button" @tap="closeAudit" style="width: 100%;">
					继续
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		isEmpty
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				list: [],
				ticketList: [],
				endTime: '',
				startTime: '',
				activityInfo: {},
				conferenceId: '',
				ticketId: '',
				ticketCount: 1,
				oss: '',
				status: true,
				auditStatus:false
			};
		},
		onLoad(options) {
			const {
				id
			} = options
			// console.log(id)
			this.oss = this.$oss
			this.conferenceId = id
			// console.log(this.conferenceId)
			this.$http.get('qms/conference_publish/' + this.conferenceId).then(res => {
				// console.log(res)
				this.activityInfo = res.data.data
				this.endTime = this.activityInfo.endTime.split(" ")[0].split("-")[1] + "/" + this.activityInfo.endTime.split(" ")[
						0].split("-")[2] + " " + this.activityInfo.endTime.split(" ")[1].split(":")[0] + ":" + this.activityInfo.endTime
					.split(" ")[1].split(":")[1]
				this.startTime = this.activityInfo.startTime.split(" ")[0].split("-")[1] + "/" + this.activityInfo.startTime.split(
						" ")[0].split("-")[2] + " " + this.activityInfo.startTime.split(" ")[1].split(":")[0] + ":" + this.activityInfo
					.startTime.split(" ")[1].split(":")[1]
			})
			this.$http.get('qms/conference_ticketing/get_by_conference', {
				params: {
					conferenceId: this.conferenceId
				}
			}).then(res => {
				// console.log(res)
				this.list = res.data.data
				if (this.list.length == 0 || this.$isEmpty(this.list)) {
					this.status = false
				} else {
					if (this.list.length > 0) {
						// console.log(this.list)
						this.ticketList = this.list.map((res, index) => {
							// console.log(res)
							let discountMoney = 0
							let discountCanMoney = 0
							//只对付费票进行操作，免费票默认折扣后价格都为0
							if (res.ticketingType == 2) {
								//只对价格大于0的进行操作
								if (res.money > 0) {
									if (res.money > 0.1) {
										discountMoney = Math.round(res.money * res.discountRate * 100) / 100
									} else {
										if (res.money * res.discountRate < 0.01) {
											discountMoney = 0.01
										} else {
											discountMoney = res.money * res.discountRate
										}
									}
								}
								if (res.canMoney > 0) {
									if (res.canMoney > 0.1) {
										discountCanMoney = Math.round(res.canMoney * res.discountRate * 100) / 100
									} else {
										if (res.canMoney * res.discountRate < 0.01) {
											discountCanMoney = 0.01;
										} else {
											discountCanMoney = res.canMoney * res.discountRate
										}
									}
								}
							}
							return {
								...res,
								discountCanMoney: discountCanMoney,
								discountMoney: discountMoney,
								ticketCount: 1,
								checkStatus: false
							}
						})
						// console.log(this.ticketList)
						if(this.ticketList.length == 1){
							this.ticketList.forEach(item => {
								this.ticketId = item.id
								item.checkStatus = true
								this.ticketCount =item.ticketCount
								if(item.needAudit==true){
									this.auditStatus=true
								}
								return true
							})
						}
					}
				}
			})
		},
		onShow() {},
		methods: {
			checkNum(item) {
				// console.log(item)
				if (item.ticketCount == "") {
					item.ticketCount = 1
					this.ticketCount = item.ticketCount
				}
				if (item.ticketCount > item.surplus) {
					item.ticketCount = item.surplus
					this.ticketCount = item.ticketCount
				}
				this.ticketCount = item.ticketCount
				// console.log(item.ticketCount)
				// console.log(this.ticketCount)
				// console.log(item)
			},
			remindMsg(item) {
				// console.log(item)
				if (item.ticketingType == 1 && item.surplus == 0) {
					uni.showToast({
						title: "余票不足",
						icon: "none",
						duration: 1000
					})
				}
				// if (item.ticketingType == 2) {
				// 	uni.showToast({
				// 		title: "这是付费项目，请在app端购买",
				// 		icon: "none",
				// 		duration: 1000
				// 	})
				// }
			},
			changeRadio(item) {
				// console.log(item)
				this.ticketList.forEach(item => {
					// console.log(item)
					item.checkStatus = false
				})
				this.ticketId = item.id
				item.checkStatus = true
				if(item.needAudit==true){
					this.auditStatus=true
				}else{
					this.auditStatus=false
				}
				this.ticketCount = item.ticketCount
			},
			addTicket(item) {
				if (item.checkStatus == false) {
					return false
				}
				if (item.surplus == item.ticketCount) {
					return false
				}
				if(item.limitTicket == this.ticketCount){
					uni.showToast({
						title:`最多购买${item.limitTicket}张`,
						icon:"none"
					})
					return false
				}
				item.ticketCount++;
				this.ticketCount = item.ticketCount
				// console.log(this.ticketCount)
				// console.log(item)
			},
			reduceTicket(item) {
				if (item.checkStatus == false) {
					return false
				}
				if (item.ticketCount == 1) {
					return false
				}
				item.ticketCount--;
				this.ticketCount = item.ticketCount
				// console.log(item)
			},
			goApplyForm() {
				if (this.status == false) {
					return false
					
				}else {
					let status = this.ticketList.some(item => {
						return item.checkStatus == true
					})
					// console.log(status)
					if (status == true) {
						// console.log(this.conferenceId,this.ticketId,this.ticketCount)
						if(this.auditStatus ==true){
							this.$refs.auditDialog.open()
						}else {
							uni.redirectTo({
								url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/applyForm/applyForm?conferenceId=${this.conferenceId}&ticketId=${this.ticketId}&ticketCount=${this.ticketCount}`
							})
						}
					}else {
						uni.showToast({
							title: "请至少选择一种票",
							icon: "none",
							duration: 1000
						})
					}
				}
				// console.log(this.form)
			},
			closeAudit(){
				uni.redirectTo({
					url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/applyForm/applyForm?conferenceId=${this.conferenceId}&ticketId=${this.ticketId}&ticketCount=${this.ticketCount}`
				})
			},
			isEmpty
		}
	}
</script>

<style lang="scss">
	.auditImg{
		width: 32rpx;
		height: 32rpx;
		margin: 0 10rpx;
	}
	.popDialog {
		padding: 32rpx;
		width: 590rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);
	
		.title {
			font-size: 36rpx;
			line-height: 52rpx;
			margin-top: 32rpx;
			text-align: center;
		}
		.message{
			font-size: 28rpx;
			line-height: 52rpx;
			text-align: center;
			margin: 48rpx 0;
		}
	}
	page {
		background-color: #F5f7f8;
	}

	.container {
		height: 100%;

		.containerWrap {
			margin: 32rpx;

			.content {
				background-color: #FFFFFF;
				border-radius: 30rpx;
				margin-bottom: 40rpx;

				.posterImg {
					width: 100%;
					height: 414rpx;
					opacity: 0.9;
					margin-bottom: 20rpx;
					border-radius: 30rpx 30rpx 0 0;
				}

				.info {
					padding: 0 30rpx;

					.name {
						font-size: 32rpx;
						margin-bottom: 20rpx;
					}

					.activityInfo {
						padding-bottom: 20rpx;
						font-size: 22rpx;

						.timeImg {
							width: 26rpx;
							height: 26rpx;
							padding-right: 16rpx;
						}

						.count {
							.num {
								padding-left: 10rpx;
							}

							.line {
								margin: 0 20rpx;
							}
						}
					}

					.fieldInfo {
						font-size: 22rpx;
						padding-bottom: 30rpx;

						.locationImg {
							width: 26rpx;
							height: 26rpx;
							padding-right: 16rpx;
						}
					}
				}
			}

			.ticketList {
				background-color: #FFFFFF;
				border-radius: 30rpx;
				padding: 30rpx;
				margin-bottom: 30rpx;

				.typeInfo {
					margin-bottom: 38rpx;

					.freeTicket {
						background: rgba(60, 212, 137, .1);
						border-radius: 8rpx;
						font-size: 20rpx;
						line-height: 28rpx;
						margin-right: 10rpx;
						width: 80rpx;
						height: 28rpx;
						text-align: center;
					}

					.payTicket {
						background: rgba(247, 68, 55, .1);
						border-radius: 8rpx;
						font-size: 20rpx;
						line-height: 28rpx;
						margin-right: 10rpx;
						width: 80rpx;
						height: 28rpx;
						text-align: center;
					}

					.ticketingName {
						font-size: 24rpx;
						line-height: 34rpx;
					}

					.select {
						transform: scale(0.7)
					}
				}

				.payTicketInfo {
					border-radius: 20rpx;
					background-color: #F5f7f8;
					margin-bottom: 30rpx;
					padding: 24rpx 20rpx;

					.wrapPayTicketInfo {
						margin-bottom: 52rpx;

						.payImg {
							margin-right: 10rpx;
							width: 36rpx;
							height: 36rpx;
						}

						.eachTitle {
							font-size: 28rpx;
							line-height: 40rpx;
						}

						.moneyInfo {
							font-size: 28rpx;
							line-height: 40rpx;
							text-decoration: line-through;
						}
					}

					.countInfo {
						.levelImg {
							margin-right: 10rpx;
							width: 36rpx;
							height: 36rpx;
						}

						.rank {
							font-size: 28rpx;
							line-height: 40rpx;
						}

						.discountMoneyInfo {
							.wrapDiscountMoneyInfo {
								font-size: 28rpx;
								line-height: 40rpx;
							}
						}
					}
				}

				.ticketNumInfo {
					border-radius: 20rpx;
					background-color: #F5f7f8;
					margin-bottom: 30rpx;
					padding: 24rpx 20rpx;

					.surplusTicketImg {
						margin-right: 10rpx;
						width: 36rpx;
						height: 36rpx;
					}

					.surplusTitle {
						font-size: 28rpx;
						line-height: 40rpx;
					}

					.surplusNum {
						font-size: 28rpx;
						line-height: 40rpx;
					}
				}

				.payNumInfo {
					border-radius: 20rpx;
					background-color: #F5f7f8;
					padding: 24rpx 20rpx;

					.ticketCountImg {
						margin-right: 10rpx;
						width: 36rpx;
						height: 36rpx;
					}

					.payNumTitle {
						font-size: 28rpx;
						line-height: 40rpx;
					}

					.reduceImg {
						width: 40rpx;
						height: 40rpx;
						margin-right: 20rpx;
					}

					.addImg {
						width: 40rpx;
						height: 40rpx;
						margin-left: 20rpx;
					}

					input {
						max-width: 60rpx;
						text-align: center;
						font-size: 28rpx;
						line-height: 40rpx;
					}
				}

				.remarkInfo {
					font-size: 24rpx;
					line-height: 40rpx;
					margin-top: 20rpx;
				}
			}
		}

		.btn {
			width: 100%;
			background-color: #FFFFFF;
			z-index: 666;
			position: fixed;
			bottom: 0rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.nextBtn {
				width: 686rpx;
				margin: 24rpx 32rpx
			}
		}
	}

	::v-deep .notNextBtn {
		width: 686rpx;
		margin: 24rpx 32rpx;
		color: #FFFFFF;
		background-color: #9aa1a7;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
