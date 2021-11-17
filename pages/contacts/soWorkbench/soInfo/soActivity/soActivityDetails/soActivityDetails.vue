<template>
	<view class="container">
		<view class="contentWrap">
			<view class="content">
				<view class="">
					<image class="posterImg" :src="activityInfo.poster" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class=" bold name">
						{{$isEmpty(activityInfo.name)?'':activityInfo.name}}
					</view>
					<view class="numInfo">
						<view class="flexRowStart">
							<view>阅读:</view>
							<view class=" num">{{$isEmpty(activityInfo.browseNum)?'0':activityInfo.browseNum}}</view>
							<view style="margin-left: 48rpx;">限额:</view>
							<view class=" num">{{$isEmpty(activityInfo.ticketNum)?'0':activityInfo.ticketNum}}</view>
						</view>
					</view>
					<view class=" flexRow timeInfo" >
						<view class="flexRowStart">
							<image v-if="oss" class="timeImg" :src="oss+'icon_so_activity_time.png'"></image>
							<text>{{$isEmpty(startTime)?'':startTime}}~{{$isEmpty(endTime)?'':endTime}}</text>
						</view>
					</view>
					<view class=" flexRowStart fieldInfo">
						<image v-if="oss" class="locationImg" :src="oss+'icon_so_activity_location.png'"></image>
						<view>{{$isEmpty(activityInfo.city)?'':activityInfo.city}}{{$isEmpty(activityInfo.field)?'':activityInfo.field}}</view>
					</view>
					<view class="flexRowStart labelInfo" v-if="!$isEmpty(activityInfo.label)">
						<view v-for="(item,index) of activityInfo.label" :key="index" v-if="index<3" class="color_F74437 labelList">
							<view class="labelName">{{$isEmpty(item)?'':item}}</view>
						</view>
					</view>
				</view>
				<view class="flexRowStart activityInfo" @tap="goSoCard">
					<image class="orgAvatarImg" v-if="activityInfo.orgAvatar" :src="soImageError(activityInfo.orgAvatar,$oss)" mode="aspectFill"></image>
					<view class="orgInfo">
						<view class="color_303031 bold orgName">
							{{$isEmpty(activityInfo.orgName)?'':activityInfo.orgName}}
						</view>
						<view class="color_919397 flexRowStart mark">
							<image class="markImg" v-if="activityInfo.organizationInvited==1 && oss" :src="oss+'icon_soActivityDetail_joinSo.png'"
							 mode="aspectFit"></image>
							<image class="markImg" v-if="activityInfo.organizationInvited==0 && oss" :src="oss+'icon_soActivityDetail_notJoinSo.png'"
							 mode="aspectFit"></image>
							<text>报名后即加入该组织</text>
						</view>
					</view>
				</view>
				<view class="activityContent">
					<view class=" bold title">
						活动内容
					</view>
					<jyf-parser class="color_666769 parser" :html="activityInfo.details" :tag-style="tagStyle" lazy-load></jyf-parser>
				</view>
				<view class=" bold recommend" v-if="recommendList.length>0">
					为你推荐
				</view>
				<view class="flexRow recommendList" v-for="(item, index) in recommendList" :key="index" v-if="index<=2" @tap="goApply(item)">
					<image class="recommendPosterImg" :src="item.poster" mode="aspectFill"></image>
					<view class="info">
						<view class="color_303031 bold doubleEllipsis name">
							{{$isEmpty(item.name)?'':item.name}}
						</view>
						<view class="color_3CD489 bold" style="font-size: 28rpx;line-height: 40rpx;" v-if="item.ticketingManagements && item.ticketingManagements[0].ticketingType === '1'">免费</view>
						<view class="color_F74437 bold" style="font-size: 28rpx;line-height: 40rpx;" v-if="item.ticketingManagements && item.ticketingManagements[0].ticketingType === '2'">{{ getMoney(item.ticketingManagements[0])}}</view>
						<view class="color_919397">
							<view class="flexRowStart detailInfo">
								<view>{{$isEmpty(item.startTime)?'':item.startTime.split(' ')[0]}}</view>
								<view class="line"></view>
								<view>{{$isEmpty(item.city)?'暂无':item.city}}</view>
							</view>
						</view>
					</view>
					<!-- 	<view class="button" style="width: 580rpx;margin: 30rpx 30rpx 40rpx 30rpx;">
						立即报名
					</view> -->
				</view>
			</view>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view v-if="status==1" class="btns">
			<view class="flexRow wrapBtns">
				<button class="btn" open-type="share">
					<view class="flexColumn" style="height:92rpx;justify-content: space-between;margin-left: 36rpx;">
						<image :src="$ossUrl('serviceDetail_share.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
						<view class="" style="color: #272727;font-size: 26rpx;line-height: 36rpx;">
							分享
						</view>
					</view>
				</button>
				<view class="flexColumn" style="height:92rpx;justify-content: space-between;margin-right: 68rpx;margin-left: 72rpx;" @tap="attentionMagicBox">
					<image v-if="activityInfo.collect==false" :src="$ossUrl('materialDetail_collect.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
					<image v-else :src="$ossUrl('home_star.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
					<view class="" style="color: #272727;font-size: 26rpx;line-height: 36rpx;">
						收藏
					</view>
				</view>
				<view class="button endBtn" v-if="activityInfo.isTicket==1">
					已售罄
				</view>
				<view v-else class="sellBtn" @click="goCurrentApply()">
					立即报名
				</view>
			</view>
		</view>
		<view v-if="status==2" class="btns">
			<view class="flexRow wrapBtns">
				<button class="btn" open-type="share">
					<view class="flexColumn" style="height:92rpx;justify-content: space-between;margin-left: 36rpx;">
						<image :src="$ossUrl('serviceDetail_share.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
						<view class="" style="color: #272727;font-size: 26rpx;line-height: 36rpx;">
							分享
						</view>
					</view>
				</button>
				<view class="flexColumn" style="height:92rpx;justify-content: space-between;margin-right: 68rpx;margin-left: 72rpx;" @tap="attentionMagicBox">
					<image v-if="activityInfo.collect==false" :src="$ossUrl('materialDetail_collect.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
					<image v-else :src="$ossUrl('home_star.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
					<view class="" style="color: #272727;font-size: 26rpx;line-height: 36rpx;">
						收藏
					</view>
				</view>
				<view class="endBtn">
					已结束
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		soImageError,
	} from '@/common/utils.js';
	import jyfParser from "@/components/jyf-parser/jyf-parser";	
	export default {
		components: {
			jyfParser
		},
		data() {
			return {
				activityInfo: {},
				startTime: "",
				endTime: "",
				recommendList: [],
				id: '',
				status: '',
				tagStyle: {
					body: 'line-height: 2;',
					img: 'background-size: contain|cover;width:100%;height:auto;'
				},
				oss: ''
			}
		},
		onLoad(options) {
			this.oss = this.$oss
			const {
				id
			} = options
			// console.log(id)
			this.id = id
		},
		onShow(){
			var pages = getCurrentPages();
			// console.log(pages)
			this.$http.get('qms/conference_publish/' + this.id).then(res => {
				if(res.data.code == 1){
					uni.showToast({
						title:res.data.message,
						icon:"none",
						duration:1000,
						success: () => {
							setTimeout(()=>{
								if(!(pages.length>1)){
									uni.switchTab({
										url:'/pages/tabbar/ican'
									})
								}else{
									uni.navigateBack({
										delta:1
									})
								}
							},1000)
						}
					})
				}else{
					this.activityInfo = res.data.data
					// console.log(this.activityInfo)
					this.endTime = this.activityInfo.endTime.split(" ")[0].split("-")[1] + "/" + this.activityInfo.endTime.split(" ")[
							0].split("-")[2] + " " + this.activityInfo.endTime.split(" ")[1].split(":")[0] + ":" + this.activityInfo.endTime
						.split(" ")[1].split(":")[1]
					this.startTime = this.activityInfo.startTime.split(" ")[0].split("-")[1] + "/" + this.activityInfo.startTime.split(
							" ")[0].split("-")[2] + " " + this.activityInfo.startTime.split(" ")[1].split(":")[0] + ":" + this.activityInfo
						.startTime.split(" ")[1].split(":")[1]
					this.status = res.data.data.statusFlag
					this.recommendList = res.data.data.recommendList
				}
				// console.log(res)
			})
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save',{
				section: 'activity', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat',//留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'wechat',//留痕目标
				markType: 'share',//留痕类型
				remark: '',
			}).then(res=>{
				// console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: '我分享了【' + this.activityInfo.name + '】活动，快去看看吧',
				path: '/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=' + this.id
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save',{
				section: 'activity', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat',//留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'moments',//留痕目标
				markType: 'share',//留痕类型
				remark: '',
			}).then(res=>{
				// console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: '我分享了【' + this.activityInfo.name + '】活动，快去看看吧',
				imageUrl: this.activityInfo.poster
			}
		},
		methods: {
			soImageError,
			getMoney(ticket) {
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
			goSoCard() {
				uni.navigateTo({
					url: `/pages/find/soCard/soCard?id=${this.activityInfo.orgId}`
				})
			},
			goApply(item) {
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.id}`				})
			},
			goCurrentApply() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/chooseTicket?id=${this.id}`
				})
			},
			attentionMagicBox(){
				if (this.activityInfo.collect == false) {
					this.$http.post('dms/collection/create', {
						targetId: this.activityInfo.id,
						type: 5,
					}).then(res => {
						this.activityInfo.collect = true;
					})
				} else {
					this.$http.post('dms/collection/app/delete', {
						targetIds: [this.activityInfo.id],
						type: 5,
					}).then(res => {
						if (res.data.code == 0) {
							this.activityInfo.collect = false;
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100%;

		.contentWrap {
			margin: 24rpx 32rpx;

			.content {
				height: 100%;

				.posterImg {
					width: 100%;
					height: 414rpx;
					opacity: 0.9;
					margin-bottom: 32rpx;
					border-radius: 16rpx;
				}

				.info {
					.name {
						font-size: 36rpx;
						line-height: 52rpx;
						color: #272727;
						margin-bottom: 16rpx;
					}
					.numInfo{
						font-size: 24rpx;
						line-height: 34rpx;
						color: #9AA1A7;
						margin-bottom: 32rpx;
						.num {
							padding-left: 10rpx;
						}
						
						.line {
							margin: 0 20rpx;
						}
					}
					.timeInfo {
						margin-bottom: 16rpx;
						font-size: 26rpx;
						line-height: 40rpx;
						color: #565B5F;

						.timeImg {
							width: 32rpx;
							height: 32rpx;
							padding-right: 12rpx;
						}
					}

					.fieldInfo {
						font-size: 26rpx;
						margin-bottom: 32rpx;
						line-height: 40rpx;
						color: #565B5F;
						
						.locationImg {
							width: 32rpx;
							height: 32rpx;
							padding-right: 12rpx;
						}
					}

					.labelInfo {
						margin-bottom: 48rpx;

						.labelList {
							margin-right: 16rpx;
							border-radius: 6rpx;
							background: #F5F7F8;
							font-size: 22rpx;
							line-height: 32rpx;

							.labelName {
								color: #565B5F;
								padding: 8rpx 16rpx;
							}
						}
					}
				}

				.activityInfo {
					padding: 24rpx;
					border-radius: 16rpx;
					background-color: #F5F7F8;
					margin-bottom: 16rpx;

					.orgAvatarImg {
						width: 112rpx;
						height: 112rpx;
						border-radius: 50%;
						margin-right: 24rpx;
					}

					.orgInfo {
						flex: 1;
						min-width: 0;

						.orgName {
							font-size: 32rpx;
							line-height: 48rpx;
							color: #272727;
							margin-bottom: 16rpx;
						}

						.mark {
							font-size: 24rpx;
							line-height: 48rpx;
							color: #9AA1A7;

							.markImg {
								padding-right: 10rpx;
								width: 24rpx;
								height: 24rpx;
							}
						}
					}
				}

				.activityContent {

					.title {
						font-size: 32rpx;
						line-height: 44rpx;
						padding: 32rpx 0;
					}

					.parser {
						font-size: 28rpx;
						line-height: 48rpx;
						color: #565B5F;
					}
				}

				.recommend {
					margin-top: 60rpx;
					font-size: 32rpx;
					margin-bottom: 40rpx;
				}
				.recommendList {
					margin-bottom: 60rpx;
					display: flex;
					justify-content: space-between;

					.recommendPosterImg {
						width: 320rpx;
						height: 196rpx;
						border-radius: 20rpx;
					}

					.info {
						display: flex;
						align-items: flex-start;
						flex-direction: column;
						justify-content: space-between;
						width: 320rpx;
						height: 196rpx;

						.name {
							font-size: 28rpx;
							margin-bottom: 20rpx;
							line-height: 40rpx;
						}

						.detailInfo {
							font-size: 22rpx;
							line-height: 32rpx;

							.line {
								margin: 0 10rpx;
								width: 2rpx;
								height: 16rpx;
								background-color: #BABEC0;
							}
						}
					}
				}
			}
		}

		.btns {
			width: 100%;
			position: fixed;
			bottom: 0rpx;
			border-radius: 20rpx;
			display: flex;
			background-color: #FFFFFF;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.wrapBtns {
				width: 686rpx;
				margin: 24rpx 32rpx 32rpx;

				.endBtn {
					flex: 1;
					height: 92rpx;
					line-height: 92rpx;
					font-size: 30rpx;
					text-align: center;
					background: #C7E8DC;
					border-radius: 64rpx;
					color: #FFFFFF;
				}

				.sellBtn {
					flex: 1;
					height: 92rpx;
					flex: 1;
					height: 92rpx;
					line-height: 92rpx;
					font-size: 30rpx;
					text-align: center;
					// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
					background: #46B28B;
					border-radius: 64rpx;
					color: #FFFFFF;
				}
			}
		}
	}

	::v-deep .btn {
		padding: 0;
		background-color: #FFFFFF;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
