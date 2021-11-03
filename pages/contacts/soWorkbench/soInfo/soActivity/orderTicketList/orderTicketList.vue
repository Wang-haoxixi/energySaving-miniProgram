<template>
	<view class="container">
		<view class="ticketList" v-for="(item,index) of ticketList" :key="index" @tap="goDetail(item)">
			<view class="flexRow" style="margin-bottom: 40rpx;">
				<view v-if="item.ticketingType==2" class="color_F74437 payTicket">
					收费票
				</view>
				<view v-if="item.ticketingType==1" class="color_3CD489 freeTicket">
					免费票
				</view>
				<view class="singleEllipsis color_666769 ticketingName">
					{{$isEmpty(item.ticketingName)?'':item.ticketingName}}
				</view>
			</view>
			<view class="" style="font-size: 28rpx;line-height: 40rpx;">
				<view v-if="item.ticketingType==2" class="flexRow priceInfo">
					<view class="flexRowStart">
						<image v-if="oss" class="payImg" :src="oss+'icon_chooseTicket_eachPay.png'"></image>
						<view class="color_919397">
							单价
						</view>
					</view>
					<view class="color_303031 bold">
						{{getMoney(item)}}
					</view>
				</view>
				<view class="flexRow surplusInfo">
					<view class="flexRowStart">
						<image v-if="oss" class="surplusTicketImg" :src="oss+'icon_chooseTicket_surplusTicket.png'"></image>
						<view class="color_919397">余票</view>
					</view>
					<view class="color_303031 bold">
						{{$isEmpty(item.surplus)?'暂无余票':item.surplus}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				oss: '',
				ticketList: ''
			};
		},
		onLoad(options) {
			const {
				id
			} = options
			this.oss = this.$oss
			this.id = id
			this.$http.get('qms/conference_ticketing/get_by_conference', {
				params: {
					conferenceId: this.id
				}
			}).then(res => {
				this.ticketList = res.data.data
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
			},
			goDetail(item){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soActivity/orderTicketList/orderTicketDetail/orderTicketDetail?id=${item.id}`
				})
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
	.priceInfo{
		background-color: #F5f7f8;
		padding: 26rpx 20rpx;
		border-radius: 20rpx;
	}
	.payTicket{
		font-size: 20rpx;
		line-height: 34rpx;
		padding: 0 10rpx;
		background: rgba(247, 68, 55, .1);
		border-radius: 8rpx;
	}
	.freeTicket{
		background: rgba(60, 212, 137, .1);
		font-size: 20rpx;
		line-height: 34rpx;
		padding: 0 10rpx;
		border-radius: 8rpx;
	}
	.ticketingName{
		flex: 1;
		min-width: 0;
		margin-left: 10rpx;
		font-size: 24rpx;
		line-height: 34rpx;
	}
	.ticketList{
		background-color: #FFFFFF;
		padding: 32rpx;
		border-radius: 30rpx;
		margin-bottom: 40rpx;
	}
	page {
		background-color: #F5f7f8;
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
