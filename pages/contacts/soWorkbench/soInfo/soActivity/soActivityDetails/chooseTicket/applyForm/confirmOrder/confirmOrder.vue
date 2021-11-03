<template>
	<view class="container">
		<view class="containerWrap">
			<view class="orderInfo">
				<view class="orderInfo-top">
					<view class="orderInfo-poster">
						<image class="orderInfo-poster" mode="aspectFit" :src="data.iconUrl">
						</image>
					</view>
					<view class="orderInfo-content">
						<view class="orderInfo-title">
							{{$isEmpty(data.activityName)?'':data.activityName}}
						</view>
						<view class="orderInfo-title-other">
							<view class="orderInfo-title-univalent color_3CD489" v-if="data.ticketingType==1">
								免费
							</view>
							<view class="orderInfo-title-univalent color_F74437" v-else-if="data.ticketingType==2">
								<!-- {{$isEmpty(data.money)?'':data.money+'元/'}}{{$isEmpty(data.canMoney)?'':data.canMoney+'贝'}} -->
								{{getMoney(data)}}
							</view>
							<view class="orderInfo-title-num">
								{{$isEmpty(data.amount)?'':'x'+data.amount}}
							</view>
						</view>
					</view>
				</view>
				<view class="discount">
					<view class="discount-title">
						合伙人优惠
					</view>
					<view class="discount-content" v-if="data.ticketingType==1">
						0贝
					</view>
					<view class="discount-content" v-else-if="data.ticketingType==2">
						{{getDiscountMoney(data)}}
					</view>
				</view>
				<view class="subtotal">
					<view class="subtotal-title">
						小计
						<text class="color_919397">
							（共{{$isEmpty(data.amount)?'':data.amount}}件）
						</text>
					</view>
					<view class="subtotal-content color_3CD489" v-if="data.ticketingType==1">
						免费
					</view>
					<view class="subtotal-content color_F74437" v-else-if="data.ticketingType==2">
						{{getTotalMoney(data)}}
					</view>
				</view>
			</view>
			<view class="personInfo">
				<view @tap="checkUserinfo(item,index)" class="flexColumnStart" :class="index<submitList.length-1?'borderBottom':''" v-for="(item,index) of submitList" :key="index" style="padding-top: 32rpx;padding-bottom: 38rpx">
					<view class="flexRow" style="width: 100%;margin-bottom: 32rpx;">
						<view class="userIcon">
							联系人{{$isEmpty(index)?'':index+1}}
						</view>
						<image v-if="index!=0 && oss" :src="oss+'icon_activityDeleteUser.png'" style="width: 28rpx;height: 28rpx;" @tap.stop="deleteUser(index)"></image>
					</view>
					<view class="flexRow" style="width: 100%;">
						<view class="">
							<view class="color_303031 userName">
								{{$isEmpty(item)?'':item[0].value}}
							</view>
							<view class="color_666769 userPhone">
								{{$isEmpty(item)?'':item[1].value}}
							</view>
						</view>
						<image v-if="oss" :src="oss+'icon_right_gray_gray.png'" class="rightImg"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="safe-bottom"></view>
		<bottom-button>
			<view class="bottom-button-text">
				共{{$isEmpty(data.amount)?'0':data.amount}}件，合计：<text class="bottom-button-total color_3CD489" v-if="data.ticketingType==1">免费</text>
				<text class="bottom-button-total color_F74437" v-else-if="data.ticketingType==2">{{getTotalMoney(data)}}</text>
			</view>
			<view class="button apply-result" @tap="goApplyResult">提交订单</view>
		</bottom-button>
	</view>
</template>

<script>
	import bottomButton from '@/components/bottomButton/bottomButton.vue'
	export default {
		components: {
			bottomButton
		},
		data() {
			return {
				conferenceId:'',
				orderNum:'',
				ticketId:'',
				data: '',
				submitList:[],
				oss:'',
				userIndex:''
			};
		},
		onLoad(options) {
			// console.log(options)
			this.oss=this.$oss
			this.submitList = uni.getStorageSync('submitList')
			const {conferenceId, orderNum,ticketId} =options
			this.conferenceId =conferenceId
			this.orderNum =orderNum
			this.ticketId =ticketId
			// console.log(this.form.ticketingId);
			this.$http.get('qms/conference_publish/confirm_order', {
				params: {
					ticketingId: this.ticketId,
					amount: this.orderNum
				}
			}).then(res => {
				this.data = res.data.data;
				// console.log(this.data)
			})
			uni.$on('data', (res) => {
				// this.submitList.push(res)
				this.submitList.splice(this.userIndex,1,res)
				// uni.setStorageSync('submitList', this.submitList)
				// console.log(this.submitList)
			})
		},
		methods: {
			checkUserinfo(item,index){
				this.userIndex =index
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/applyForm/addUsers/addUsers?userInfo=${JSON.stringify(item)}&activityId=${this.conferenceId}`
				})
			},
			deleteUser(index){
				this.submitList.splice(index,1)
			},
			getMoney(ticket) {
				if (!this.$isEmpty(ticket.canMoney) && this.$isEmpty(ticket.money)) {
					return `${ticket.canMoney}贝`;
				} else if (this.$isEmpty(ticket.canMoney) && !this.$isEmpty(ticket.money)) {
					return `${ticket.money}元`;
				} else if (!(this.$isEmpty(ticket.canMoney) && this.$isEmpty(ticket.money))) {
					return `${ticket.canMoney}贝/${ticket.money}元`;
				}else{
					return `0`;
				}
			},
			getDiscountMoney(ticket) {
				if (!this.$isEmpty(ticket.discountCanMoney) && this.$isEmpty(ticket.discountMoney) && ticket.discountCanMoney!=0) {
					return `-${ticket.discountCanMoney}贝`;
				} else if (this.$isEmpty(ticket.discountCanMoney) && !this.$isEmpty(ticket.discountMoney && ticket.discountMoney!=0)) {
					return `-${ticket.discountMoney}元`;
				} else if (!(this.$isEmpty(ticket.discountCanMoney) && this.$isEmpty(ticket.discountMoney && ticket.discountMoney!=0 && ticket.discountCanMoney!=0))) {
					return `-${ticket.discountCanMoney}贝/-${ticket.discountMoney}元`;
				}else if(this.$isEmpty(ticket.discountCanMoney) && this.$isEmpty(ticket.discountMoney) && ticket.discountCanMoney == 0){
					return `${ticket.discountCanMoney}贝`;
				}
				else if(this.$isEmpty(ticket.discountCanMoney) && this.$isEmpty(ticket.discountMoney) && ticket.discountMoney == 0){
					return `${ticket.discountMoney}元`;
				}
				else if(this.$isEmpty(ticket.discountCanMoney) && this.$isEmpty(ticket.discountMoney) && ticket.discountMoney == 0 && ticket.discountCanMoney==0){
					return `${ticket.discountCanMoney}贝/${ticket.discountMoney}元`;
				}
			},
			getTotalMoney(ticket) {
				if (!this.$isEmpty(ticket.totalCanMoney) && this.$isEmpty(ticket.totalMoney)) {
					return `${ticket.totalCanMoney}贝`;
				} else if (this.$isEmpty(ticket.totalCanMoney) && !this.$isEmpty(ticket.totalMoney)) {
					return `${ticket.totalMoney}元`;
				} else if (!(this.$isEmpty(ticket.totalCanMoney) && this.$isEmpty(ticket.totalMoney))) {
					return `${ticket.totalCanMoney}贝/${ticket.totalMoney}元`;
				}
			},
			goApplyResult() {
				this.$http.post('qms/conference_enrole_form/all/create',
					{
						conferenceId:this.conferenceId,
						orderNum:this.orderNum,
						ticketingId:this.ticketId,
						source:'2',
						infoFormConfigList:this.submitList
						
					}
				).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						if(this.data.ticketingType==2){
							uni.redirectTo({
								url:`/pages/find/checkoutCounter/checkoutCounter?id=${res.data.data.orderNumber}`
							})
						}else{
							uni.redirectTo({
								// url: 'applyResult/applyResult?orderNumber=' + res.data.data.orderNumber
								url:`/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/applyForm/confirmOrder/applyResult/applyResult?id=${res.data.data.orderNumber}`
							})
						}
					}else{
						uni.showToast({
							title:res.data.message,
							icon:"none",
							duration:1000
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.rightImg{
		width: 48rpx;
		height: 48rpx;
		margin-right: -14rpx;
	}
	.userName{
		font-size: 32rpx;
		line-height: 44rpx;
		margin-bottom: 6rpx;
	}
	.userPhone{
		font-size: 28rpx;
		line-height: 40rpx;
	}
	.userIcon{
		background-color: #F5f7f8;
		padding: 10rpx 24rpx;
		border-radius: 50%;
		font-size: 22rpx;
	}
	.borderBottom{
		border-bottom: 2rpx solid #EFF0F1;
	}
	page {
		background-color: #F5f7f8;
	}

	.safe-bottom {
		height: 112rpx;
	}

	.bottom-item {
		justify-content: space-between;
	}

	.bottom-button-text {
		font-size: 24rpx;
		line-height: 34rpx;
		color: #919397;

		.bottom-button-total {
			font-weight: bold;
			font-size: 28rpx;
		}
	}

	.apply-result {
		width: 204rpx;
		padding: 0;
		height: 72rpx;
	}

	.container {
		height: 100%;

		.containerWrap {
			padding: 32rpx;

			.orderInfo {
				padding: 32rpx;
				background-color: #FFFFFF;
				border-radius: 30rpx;

				.orderInfo-top {
					display: flex;

					.orderInfo-poster {
						width: 180rpx;
						height: 180rpx;
						border-radius: 30rpx;
					}

					.orderInfo-content {
						margin-left: 20rpx;
						flex: 1;

						.orderInfo-title {
							color: #303031;
							line-height: 48rpx;
							font-size: 28rpx;
						}

						.orderInfo-title-other {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-top: 40rpx;

							.orderInfo-title-univalent {
								font-size: 32rpx;
								line-height: 44rpx;
								font-weight: bold;
							}

							.orderInfo-title-num {
								color: #919397;
								font-size: 24rpx;
								line-height: 34rpx;
							}
						}
					}
				}

				.discount {
					margin-top: 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.discount-title {
						color: #303031;
						font-size: 28rpx;
						line-height: 40rpx;
						font-weight: bold;
					}

					.discount-content {
						line-height: 34rpx;
						font-size: 24rpx;
						color: #919397;
					}
				}

				.subtotal {
					margin-top: 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.subtotal-title {
						color: #303031;
						font-size: 28rpx;
						line-height: 40rpx;
						font-weight: bold;
					}

					.subtotal-content {
						line-height: 40rpx;
						font-size: 28rpx;
					}
				}
			}

			.personInfo {
				margin-top: 16rpx;
				padding: 0 32rpx;
				background-color: #FFFFFF;
				border-radius: 30rpx;

				.info {
					padding-top: 32rpx;
					padding-bottom: 32rpx;

					.title {
						font-size: 28rpx;
						line-height: 40rpx;
					}

					.remarks {
						font-size: 28rpx;
						line-height: 48rpx;
						margin-top: 36rpx;
					}
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

			.freeBtn {
				width: 686rpx;
				margin: 24rpx 32rpx
			}
		}
	}
</style>
