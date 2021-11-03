<template>
	<view class="container">
		<view class="" style="margin-bottom: 40rpx;">
			<view class="color_303031 bold" style="font-size: 32rpx;line-height: 48rpx;">
				{{$isEmpty(ticketInfo.ticketingName)?'':ticketInfo.ticketingName}}
			</view>
		</view>
		<view class="priceContent">
			<view v-if="ticketInfo.ticketingType==2" class="flexRow priceInfo">
				<view class="flexRowStart">
					<image v-if="oss" class="payImg" :src="oss+'icon_chooseTicket_eachPay.png'"></image>
					<view class="color_919397">
						单价
					</view>
				</view>
				<view class="color_303031 bold">
					{{getMoney(ticketInfo)}}
				</view>
			</view>
			<view class="flexRow surplusInfo">
				<view class="flexRowStart">
					<image v-if="oss" class="surplusTicketImg" :src="oss+'icon_chooseTicket_surplusTicket.png'"></image>
					<view class="color_919397">余票</view>
				</view>
				<view class="color_303031 bold">
					{{$isEmpty(ticketInfo.surplus)?'暂无余票':ticketInfo.surplus}}
				</view>
			</view>
		</view>
		<view class="color_666769" style="font-size: 24rpx;line-height: 44rpx;">
			{{$isEmpty(ticketInfo.remarks)?'':ticketInfo.remarks}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oss: '',
				id: '',
				ticketInfo: ''
			};
		},
		onLoad(options) {
			const {
				id
			} = options
			this.oss = this.$oss
			this.id = id
			this.$http.get('qms/conference_ticketing/select_by_id', {
				params: {
					id: this.id
				}
			}).then(res => {
				this.ticketInfo = res.data.data
			})
		},
		methods:{
			getMoney(ticket) {
				// console.log(ticket)
				if (ticket.canMoney != '' && ticket.money=='') {
					return `${ticket.canMoney}贝`;
				} else if (ticket.money!=''&& ticket.canMoney == '') {
					return `${ticket.money}元`;
				} else if (ticket.money != '' && ticket.canMoney != '') {
					return `${ticket.canMoney}贝/${ticket.money}元`;
				}else{
					return `0`;
				}
			}
		}
	}
</script>

<style lang="scss">
	.surplusInfo{
		margin-top: 30rpx;
		background-color: #F5f7f8;
		padding: 26rpx 20rpx;
		border-radius: 20rpx;
	}
	.priceContent{
		font-size: 28rpx;
		line-height: 40rpx;
		margin-bottom: 40rpx;
		.priceInfo{
			background-color: #F5f7f8;
			padding: 26rpx 20rpx;
			border-radius: 20rpx;
		}
	}
	.container {
		padding: 32rpx;
	}

	.payImg {
		margin-right: 10rpx;
		width: 36rpx;
		height: 36rpx;
	}

	.surplusTicketImg {
		margin-right: 10rpx;
		width: 36rpx;
		height: 36rpx;
	}
</style>
