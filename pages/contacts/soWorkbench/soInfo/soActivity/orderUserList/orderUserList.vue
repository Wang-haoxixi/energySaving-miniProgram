<template>
	<view class="container">
		<view class="containerWrap">
			<view class="title">
				<view class="title-item" @tap="allClick()">
					<view :class="[{ active: isAllActive }, { unactive: !isAllActive }]">全部</view>
					<view class="title-item-bottom" v-if="isAllActive"></view>
				</view>
				<view class="title-item" @tap="underwayClick()">
					<view :class="[{ active: isUnderwayActive }, { unactive: !isUnderwayActive }]">待付款</view>
					<view class="title-item-bottom" v-if="isUnderwayActive"></view>
				</view>
				<view class="title-item" @tap="endClick()">
					<view :class="[{ active: isEndActive }, { unactive: !isEndActive }]">已完成</view>
					<view class="title-item-bottom" v-if="isEndActive"></view>
				</view>
			</view>
			<view class="flexRowStart search" @tap="goSearch">
				<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
				<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" disabled></input>
			</view>
			<swiper class="content" circular @change="swiperChange" observer observerParents :current-item-id="item_id" ref="swiper">
				<swiper-item item-id="0">
					<scroll-view class="scrollList" :scroll-top="30" scroll-y="true" @scrolltolower="activityMore">
						<view class="records" @tap="goDetails(item)" v-for="(item, index) in allUserList.records" :key="index">
							<view class="flexRowStart" style="margin-bottom: 40rpx;">
								<image class="avatar" :src="imageError(item.avatar,$oss)" mode="" style="margin-right: 24rpx;"></image>
								<view class="flexRow" style="flex: 1;">
									<view class="" style="flex: 1;min-width: 0;">
										<view class="color_303031 bold userName">
											{{$isEmpty(item.name)?'':item.name}}
										</view>
										<view class="color_919397 singleEllipsis" style="font-size: 24rpx;line-height: 34rpx;">
											{{getCompanyPosition(item.company,item.position)}}
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
						<image class="emptyImg" v-if="!allUserList.records.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
						<uni-load-more :status="allStatus" v-if="allUserList.records.length>0"></uni-load-more>
					</scroll-view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</swiper-item>
				<swiper-item item-id="1">
					<scroll-view class="scrollList" :scroll-top="30" scroll-y="true" @scrolltolower="processingMore">
						<view class="records" @tap="goDetails(item)" v-for="(item, index) in noPayUserList.records" :key="index">
							<view class="flexRowStart" style="margin-bottom: 40rpx;">
								<image class="avatar" :src="imageError(item.avatar,$oss)" mode="" style="margin-right: 24rpx;"></image>
								<view class="flexRow" style="flex: 1;">
									<view class="" style="flex: 1;min-width: 0;">
										<view class="color_303031 bold userName">
											{{$isEmpty(item.name)?'':item.name}}
										</view>
										<view class="color_919397 singleEllipsis" style="font-size: 24rpx;line-height: 34rpx;">
											{{getCompanyPosition(item.company,item.position)}}
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
						<image class="emptyImg" v-if="!noPayUserList.records.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
						<uni-load-more :status="noPayStatus" v-if="noPayUserList.records.length>0"></uni-load-more>
					</scroll-view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</swiper-item>
				<swiper-item item-id="2">
					<scroll-view class="scrollList" :scroll-top="30" scroll-y="true" @scrolltolower="completedMore">
						<view class="records" @tap="goDetails(item)" v-for="(item, index) in payedUserList.records" :key="index">
							<view class="flexRowStart" style="margin-bottom: 40rpx;">
								<image class="avatar" :src="imageError(item.avatar,$oss)" mode="" style="margin-right: 24rpx;"></image>
								<view class="flexRow" style="flex: 1;">
									<view class="" style="flex: 1;min-width: 0;">
										<view class="color_303031 bold userName">
											{{$isEmpty(item.name)?'':item.name}}
										</view>
										<view class="color_919397 singleEllipsis" style="font-size: 24rpx;line-height: 34rpx;">
											{{getCompanyPosition(item.company,item.position)}}
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
						<image class="emptyImg" v-if="!payedUserList.records.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
						<uni-load-more :status="payedStatus" v-if="payedUserList.records.length>0"></uni-load-more>
					</scroll-view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import {
		imageError,
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				id:'',
				allUserList:{},
				allStatus:'more',
				noPayUserList:{},
				noPayStatus:'more',
				payedUserList:{},
				payedStatus:'more',
				isAllActive: true,
				isUnderwayActive: false,
				isEndActive: false,
				item_id: 0,
				oss:''
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			const{id} =options
			this.id=id
			this.$http.get('qms/conference_enrole/page_v2',{
				params:{
					conferenceId:id,
					orderStatus:''
				}
			}).then(res=>{
				// console.log(res)
				this.allUserList=res.data.data
				if (!(this.allUserList.current < this.allUserList.pages)) {
					this.allStatus = 'noMore';
				}
				if(this.allUserList.total){
					uni.setNavigationBarTitle({
					    title: `名单管理(${this.allUserList.total})`
					});
				}
			})
			this.$http.get('qms/conference_enrole/page_v2',{
				params:{
					conferenceId:id,
					orderStatus:0
				}
			}).then(res=>{
				// console.log(res)
				this.noPayUserList=res.data.data
				if (!(this.noPayUserList.current < this.noPayUserList.pages)) {
					this.noPayStatus = 'noMore';
				}
			})
			this.$http.get('qms/conference_enrole/page_v2',{
				params:{
					conferenceId:id,
					orderStatus:1
				}
			}).then(res=>{
				// console.log(res)
				this.payedUserList=res.data.data
				if (!(this.payedUserList.current < this.payedUserList.pages)) {
					this.payedStatus = 'noMore';
				}
			})
		},
		methods:{
			imageError,
			getCompanyPosition(company, station){
				if (!this.$isEmpty(company) && !this.$isEmpty(station)) {
					return company + " " + station;
				} else if (!this.$isEmpty(company)) {
					return company;
				} else if (!this.$isEmpty(station)) {
					return station;
				} else {
					return "暂无单位职务";
				}
			},
			goDetails(item){
				uni.navigateTo({
					url:`/pages/my/meeting/orderInfo/orderInfo?enroleId=${item.id}&type=1`
				})
			},
			goSearch(){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soActivity/orderUserList/searchOrderUser/searchOrderUser?id=${this.id}`
				})
			},
			getMoney(ticket) {
				// console.log(ticket)
				if (ticket.ticketingCanMoney != '' && ticket.ticketingMoney=='') {
					return `${ticket.ticketingCanMoney}贝`;
				} else if (ticket.ticketingMoney!=''&& ticket.ticketingCanMoney == '') {
					return `${ticket.ticketingMoney}元`;
				} else if (ticket.ticketingMoney != '' && ticket.ticketingCanMoney != '') {
					return `${ticket.ticketingCanMoney}贝/${ticket.ticketingMoney}元`;
				}else{
					return `0`;
				}
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
				if(this.allUserList.total>0){
					uni.setNavigationBarTitle({
					    title: `名单管理(${this.allUserList.total})`
					});
				}
			},
			underwayClick() {
				this.isAllActive = false;
				this.isUnderwayActive = true;
				this.isEndActive = false;
				this.item_id = 1;
				if(this.noPayUserList.total>0){
					uni.setNavigationBarTitle({
					    title: `名单管理(${this.noPayUserList.total})`
					});
				}
			},
			endClick() {
				this.isAllActive = false;
				this.isUnderwayActive = false;
				this.isEndActive = true
				this.item_id = 2
				if(this.payedUserList.total){
					uni.setNavigationBarTitle({
					    title: `名单管理(${this.payedUserList.total})`
					});
				}
			},
			activityMore() {
				let that = this;
				if (that.allUserList.current < that.allUserList.pages) {
					that.allStatus = 'loading';
					that.$http.get('qms/conference_enrole/page_v2', {
						params: {
							conferenceId:that.id,
							orderStatus:'',
							current: that.allUserList.current + 1
						}
					}).then(res => {
						that.allUserList.current = res.data.data.current;
						that.allUserList.records = that.allUserList.records.concat(res.data.data.records);
						that.allStatus = 'more';
					});
				} else {
					that.allStatus = 'noMore';
				}
			},
			processingMore() {
				let that = this;
				if (that.noPayUserList.current < that.noPayUserList.pages) {
					that.noPayStatus = 'loading';
					that.$http.get('qms/conference_enrole/page_v2', {
						params: {
							conferenceId:that.id,
							orderStatus:0,
							current: that.noPayUserList.current + 1
						}
					}).then(res => {
						that.noPayUserList.current = res.data.data.current;
						that.noPayUserList.records = that.noPayUserList.records.concat(res.data.data.records);
						that.noPayStatus = 'more';
					});
				} else {
					that.noPayStatus = 'noMore';
				}
			},
			completedMore() {
				let that = this;
				if (that.payedUserList.current < that.payedUserList.pages) {
					that.payedStatus = 'loading';
					that.$http.get('qms/conference_enrole/page_v2', {
						params: {
							conferenceId:that.id,
							orderStatus:1,
							current: that.payedUserList.current + 1
						}
					}).then(res => {
						that.payedUserList.current = res.data.data.current;
						that.payedUserList.records = that.payedUserList.records.concat(res.data.data.records);
						that.payedStatus = 'more';
					});
				} else {
					that.payedStatus = 'noMore';
				}
			}
		}
	}
</script>

<style lang="scss">
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
	.payInfo{
		border-radius: 20rpx;
		background-color: #F4F5F6;
		padding: 24rpx 20rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		margin-top: 30rpx;
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
.search{
	margin: 16rpx 32rpx;
	padding: 18rpx 32rpx;
	border-radius: 60rpx;
	background-color: #FFFFFF;
	.searchImg{
		height: 32rpx;
		width: 32rpx;
		margin-right: 16rpx;
	}
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
					background-color: #F74437;
					margin: 10rpx auto;
				}
			}
		}

		.content {
			flex: 1;

			.scrollList {
				margin: 0 32rpx;
				height: 100%;

				.records {
					padding: 32rpx;
					margin-bottom: 40rpx;
					background-color: #FFFFFF;
					border-radius: 30rpx;
					position: relative;
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
