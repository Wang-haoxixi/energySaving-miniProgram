<template>
	<view class="">
		<scroll-view scroll-y="true" :style="{height:scrollHeight + 'px'}" @scrolltolower="articleMore">
			<view class="taskList" v-for="(item,index) of qusetionnaireInfo.records" :key="index" @tap="goTskDetail(item)">
				<view class="color_303031 doubleEllipsis name bold">
					{{$isEmpty(item.name)?'':item.name}}
				</view>
				<view class="flexRow status">
					<view class="flexColumn statusInfo" v-if="item.status==1">
						<image v-if="oss" class="statusImg" style="margin-bottom: 14rpx;" :src="oss+'icon_so_questionnaire_online.png'"></image>
						<text>进行中</text>
					</view>
					<view class="flexColumn statusInfo" v-if="item.status==3">
						<image v-if="oss" class="statusImg" style="margin-bottom: 14rpx;" :src="oss+'icon_so_questionnaire_end.png'"></image>
						<text>已结束</text>
					</view>
					<view class="flexColumn statusInfo" v-if="item.status==4">
						<image v-if="oss" class="statusImg"  style="margin-bottom: 14rpx;" :src="oss+'icon_so_questionnaire_checking.png'"></image>
						<text>审核中</text>
					</view>
					<view class="flexColumn statusInfo" v-if="item.status==6">
						<image v-if="oss" class="statusImg"  style="margin-bottom: 14rpx;" :src="oss+'icon_so_questionnaire_wait.png'"></image>
						<text>未开始</text>
					</view>
					<view class="flexColumn statusInfo">
						<!-- <image v-if="oss" class="statusImg" :src="oss+'icon_so_questionnaire_group.png'"></image> -->
						<text class="color_303031" style="font-size: 36rpx;line-height: 42rpx;font-weight: bold;">{{$isEmpty(item.joinPeople)?'0':item.joinPeople}}</text>
						<text class="txt">参与人数</text>
					</view>
					<view class="flexColumn statusInfo">
						<!-- <image v-if="oss" class="statusImg" :src="oss+'icon_so_questionnaire_group.png'"></image> -->
						<text class="color_303031" style="font-size: 36rpx;line-height: 42rpx;font-weight: bold;">{{$isEmpty(item.awardNumber)?'0':item.awardNumber}}</text>
						<text class="txt">奖励(贝)</text>
					</view>
				</view>
				<view class="flexRow countInfo">
					<view class="color_919397" v-if="item.startTime&&item.endTime">
						<text class="txt">截止时间:</text>
						<text>{{$isEmpty(item.startTime)?'':item.startTime}}至{{$isEmpty(item.endTime)?'':item.endTime}}</text>
					</view>
					<view class="color_919397" v-else>
						<text class="txt">截止时间:</text>
						<text>长期有效</text>
					</view>
					<view v-if="item.openAward==2" class="flexRow awardInfo">
						<image v-if="oss" class="awardImg" :src="oss+'icon_so_questionnaire_logo.png'"></image>
						<text class="color_F74437">+{{$isEmpty(item.awardNumber)?'0':item.awardNumber}}</text>
					</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!qusetionnaireInfo.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<uni-load-more :status="questionnaireStatus" v-if="qusetionnaireInfo.records.length>0"></uni-load-more>
			<view class="bottom-safe"></view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	export default {
		name:"questionnaires",
		props: {
			qusetionnaireInfo: Object,
			scrollHeight: Number
		},
		data() {
			return {
				questionnaireStatus: '',
				oss:'',
				status:false
			};
		},
		onReady() {
			this.oss=this.$oss
			if (!this.qusetionnaireInfo.current < this.qusetionnaireInfo.pages) {
				this.questionnaireStatus = 'noMore';
			}
		},
		methods:{
			articleMore() {
				let that = this;
				if (that.qusetionnaireInfo.current < that.qusetionnaireInfo.pages) {
					that.questionnaireStatus = 'loading';
					that.$http.get('qms/questionnaire/factory_page', {
						params: {
							current: that.qusetionnaireInfo.current + 1
						}
					}).then(res => {
						that.qusetionnaireInfo.current = res.data.data.current;
						let list = res.data.data.records
						list.forEach(item => {
							if (item.startTime && item.endTime) {
								item.startTime = item.startTime.split(' ')[0]
								item.endTime = item.endTime.split(' ')[0]
							}
						})
						that.qusetionnaireInfo.records = that.qusetionnaireInfo.records .concat(list);
						that.questionnaireStatus = 'more';
					});
				} else {
					that.questionnaireStatus = 'noMore';
				}
			},
			goTskDetail(item) {
				if (item.participate == 2) {
					this.status = true
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}&status=${this.status}`
					})
				} else if (item.status == 6) {
					uni.showToast({
						title: "问卷暂未开始",
						icon: "none"
					})
				} else {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}`
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.taskList {
			padding: 32rpx 32rpx 24rpx; 
			background-color: #FFFFFF;
			border-radius: 16rpx;
			margin-bottom: 16rpx;

			.name {
				font-size: 32rpx;
				line-height: 44rpx;
			}

			.status {
				border-radius: 8rpx;
				 margin: 24rpx 0; 
				 background-color: #f5f7f8;
				 height: 142rpx;
				 padding: 0 64rpx;
				 justify-content:space-between;

				.statusInfo {
					font-size: 24rpx;
					line-height: 34rpx;
					height: 142rpx;
					color: #9AA1A7;
					justify-content: center;

					.statusImg {
						width: 36rpx;
						height: 36rpx;
						
					}

					.txt {
						margin-top: 8rpx;
					}
				}
			}
		}

		.countInfo {
			font-size: 24rpx;
			line-height: 34rpx;

			.txt {
				padding-right: 10rpx;
			}

			.awardInfo {
				display: none;
				height: 44rpx;
				border-radius: 22rpx;
				background-color: rgba(247, 68, 55, .1);
				padding: 0 20rpx;

				.awardImg {
					width: 28rpx;
					height: 28rpx;
					margin-left: 10rpx;
				}
			}
		}
	

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
