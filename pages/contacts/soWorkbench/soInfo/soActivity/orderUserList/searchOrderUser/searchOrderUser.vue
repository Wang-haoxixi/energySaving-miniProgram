<template>
	<view class="container">
		<view class="flexRowStart search">
			<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
			<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" v-model="searchText" @input="search"></input>
		</view>
		<view class="records" @tap="goDetails(item)" v-for="(item, index) in searchList.records" :key="index">
			<view class="flexRowStart" style="margin-bottom: 40rpx;">
				<image class="avatar" :src="imageError(item.avatar,$oss)" mode="" style="margin-right: 24rpx;"></image>
				<view class="flexRow" style="flex: 1;">
					<view class="" style="flex: 1;min-width: 0;">
						<view class="color_303031 bold userName">
							{{$isEmpty(item.name)?'':item.name}}
						</view>
						<view class="color_919397 singleEllipsis" style="font-size: 24rpx;line-height: 34rpx;">
							<text style="margin-right: 10rpx;">{{$isEmpty(item.company)?'':item.company}}</text><text>{{$isEmpty(item.position)?'':item.position}}</text>
						</view>
					</view>
					<view class="auditStatus">
						<view v-if="item.auditStatus==1" class="color_2F80FF">
							审核中
						</view>
						<view v-if="item.auditStatus==2" class="color_3CD489">
							通过
						</view>
						<view v-if="item.auditStatus==3" class="color_F74437">
							未通过
						</view>
					</view>
				</view>
			</view>
			<view class="" style="margin-bottom: 40rpx;">
				<view class="flexRow ticketInfo">
					<view class="color_919397" style="margin-right: 56rpx;">
						购买
					</view>
					<view class="flexRowStart color_303031 bold singleEllipsis" style="flex: 1;min-width: 0;">
						<view class="singleEllipsis ticketingName">{{$isEmpty(item.ticketingName)?'':item.ticketingName}}</view>
						<view class="color_FFFFFF freeIcon" v-if="item.paymentMethod == 0 &&item.paymentMethod != ''">
							免
						</view>
						<view class="color_FFFFFF payIcon" v-else>
							付
						</view>
						<view class="color_919397" style="margin:0 20rpx;">X</view>
						<view>{{$isEmpty(item.orderNum)?'':item.orderNum}}</view>
					</view>
				</view>
				<view class="flexRow payInfo" v-if="item.paymentMethod != 0 ||item.orderStatus==0">
					<view class="color_919397">
						支付金额
					</view>
					<view class="flexRowStart color_303031 bold">
						<view v-if="!$isEmpty(item.money)">{{item.money}}<text v-if="item.paymentMethod==1">贝</text><text v-if="item.paymentMethod==2">元</text></view>
						<view class="" v-else>
							{{getMoney(item)}}
						</view>
					</view>
				</view>
			</view>
			<view class="" style="font-size: 24rpx;line-height: 34rpx;">
				<view class="flexRow" v-if="item.paymentMethod == 0 && item.paymentMethod !=''">
					<view class="color_3CD489">
						已支付
					</view>
					<view class="color_919397">
						共{{$isEmpty(item.contactsCount)?'':item.contactsCount}}条报名信息
					</view>
				</view>
				<view class="flexRow" v-if="item.paymentMethod == 1">
					<view class="color_3CD489">
						宝贝支付-支付成功
					</view>
					<view class="color_919397">
						共{{$isEmpty(item.contactsCount)?'':item.contactsCount}}条报名信息
					</view>
				</view>
				<view class="flexRow" v-if="item.paymentMethod == 2">
					<view class="color_3CD489">
						微信支付-支付成功
					</view>
					<view class="color_919397">
						共{{$isEmpty(item.contactsCount)?'':item.contactsCount}}条报名信息
					</view>
				</view>
				<view class="flexRow" v-if="item.orderStatus==0">
					<view class="color_F74437">
						待支付
					</view>
				</view>
				<view class="flexRow" v-if="item.orderStatus==3">
					<view class="color_919397">
						取消报名
					</view>
				</view>
			</view>
		</view>
		<image class="emptyImg" v-if="!searchList.records.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
		<uni-load-more :status="status" v-if="searchList.records.length>0"></uni-load-more>
	</view>
</template>

<script>
	import {
		imageError,
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				searchList:{},
				id:'',
				oss:'',
				status:'more',
				searchText:''
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			const {id} =options
			this.id=id
			this.$http.get('qms/conference_enrole/page_v2',{
				params:{
					conferenceId:id,
					orderStatus:''
				}
			}).then(res=>{
				// console.log(res)
				this.searchList=res.data.data
				if (!(this.searchList.current < this.searchList.pages)) {
					this.status = 'noMore';
				}
			})
		},
		onReachBottom() {
			let that = this
			if (that.searchList.current < that.searchList.pages) {
				that.status = 'loading';
				that.$http.get('qms/conference_enrole/page_v2', {
					params: {
						conferenceId:that.id,
						orderStatus:'',
						nama:this.searchText,
						current: that.searchList.current + 1
					}
				}).then(res => {
					that.searchList.current = res.data.data.current;
					that.searchList.records = that.searchList.records.concat(res.data.data.records);
					that.status = 'more';
				});
			} else {
				that.status = 'noMore';
			}
		},
		methods:{
			imageError,
			search(){
				this.$http.get('qms/conference_enrole/page_v2',{
					params:{
						conferenceId:this.id,
						orderStatus:'',
						name:this.searchText
					}
				}).then(res=>{
					// console.log(res)
					this.searchList=res.data.data
					if (!(this.searchList.current < this.searchList.pages)) {
						this.status = 'noMore';
					}
				})
			},
			getMoney(ticket) {
				// console.log(ticket)
				if (ticket.ticketingCanMoney != '' && ticket.ticketingMoney=='') {
					return `${ticket.ticketingCanMoney}贝`;
				} else if (ticket.ticketingMoney!=''&& ticket.ticketingCanMoney == '') {
					return `${ticket.ticketingMoney}元`;
				} else if (ticket.ticketingMoney != '' && ticket.ticketingCanMoney != '') {
					return `${ticket.ticketingMoney}贝/${ticket.ticketingMoney}元`;
				}else{
					return `0`;
				}
			},
		}
	}
</script>

<style lang="scss">
	.payInfo{
		border-radius: 20rpx;
		background-color: #F5f7f8;
		padding: 24rpx 20rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		margin-top: 30rpx;
	}
	.ticketInfo{
		border-radius: 20rpx;
		background-color: #F5f7f8;
		padding: 24rpx 20rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		.ticketingName{
			margin-right: 10rpx;
			flex: 1;
			min-width: 0;
			text-align: right;
		}
		.freeIcon{
			text-align: center; 
			background-color:#3CD489;
			font-size: 20rpx;
			line-height: 30rpx;
			border-radius: 50%;
			width: 28rpx;
			line-height: 28rpx;
		}
		.payIcon{
			text-align: center; 
			background-color: #F74437;
			font-size: 20rpx;
			line-height: 30rpx;
			border-radius: 50%;
			width: 28rpx;
			line-height: 28rpx;
		}
	}
	.auditStatus{
		font-size: 28rpx;
		line-height: 40rpx;
		margin-left: 20rpx;
	}
	.userName{
		font-size: 28rpx;
		line-height: 40rpx;
		margin-bottom: 20rpx;
	}
	page {
		background-color: #F5f7f8;
	}
.container{
	padding:0 32rpx;
	.search{
		margin: 16rpx 0;
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #FFFFFF;
		.searchImg{
			height: 32rpx;
			width: 32rpx;
			margin-right: 16rpx;
		}
	}
	.records {
		padding: 32rpx;
		margin-bottom: 40rpx;
		background-color: #FFFFFF;
		border-radius: 30rpx;
		position: relative;
	}
}

</style>
