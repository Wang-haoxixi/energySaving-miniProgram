<template>
	<view class="questionnaire-item" @tap="goQuestionnaire(itemData)">
		<view class="questionnaire-title flexRowStart">
			<view class="questionnaire-top" v-if="itemData.top == 2">
				置顶
			</view>
			<view class="doubleEllipsis" style="font-weight: bold;flex: 1;">
				{{$isEmpty(itemData.name)?'':itemData.name}}
			</view>
		</view>
		<view class="questionnaire-content">
			<view class="questionnaire-content-item" v-if="itemData.status==1">
				<image class="statusImg" :src="$ossUrl('icon_so_questionnaire_online.png')"></image>
				<view class="questionnaire-content-item-content">
					进行中
				</view>
			</view>
			<view class="questionnaire-content-item" v-if="itemData.status==3">
				<image class="statusImg" :src="$ossUrl('icon_so_questionnaire_end.png')"></image>
				<view class="questionnaire-content-item-content">
					已结束
				</view>
			</view>
			<view class="questionnaire-content-item" v-if="itemData.status==4">
				<image class="statusImg" :src="$ossUrl('icon_so_questionnaire_checking.png')"></image>
				<view class="questionnaire-content-item-content">
					审核中
				</view>
			</view>
			<view class="questionnaire-content-item" v-if="itemData.status==6">
				<image class="statusImg" :src="$ossUrl('icon_so_questionnaire_wait.png')"></image>
				<view class="questionnaire-content-item-content">
					未开始
				</view>
			</view>
			<view class="questionnaire-content-spilt">
			</view>
			<view class="questionnaire-content-item">
				<view class="questionnaire-content-item-title">
					{{$isEmpty(itemData.joinPeople)?'0':itemData.joinPeople}}
				</view>
				<view class="questionnaire-content-item-content">
					参与人数
				</view>
			</view>
			<view class="questionnaire-content-spilt">
			</view>
			<view class="questionnaire-content-item">
				<view class="questionnaire-content-item-title">
					{{$isEmpty(itemData.awardNumber)?'无':itemData.awardNumber}}
				</view>
				<view class="questionnaire-content-item-content">
					奖励(元)
				</view>
			</view>
		</view>
		<view class="questionnaire-other" v-if="itemData.startTime&&itemData.endTime">
			{{$isEmpty(itemData.startTime)?'':itemData.startTime}}至{{$isEmpty(itemData.endTime)?'':itemData.endTime}}
			<view class="color_919397" v-if="itemData.participate==2 && isLogin==true">
				已参加
			</view>
		</view>
		<view class="questionnaire-other " v-else>
			长期有效
			<view class="color_919397" v-if="itemData.participate==2 && isLogin==true">
				已参加
			</view>
		</view>
		<view class="questionnaire-end">
		</view>
	</view>
</template>

<script>
	import {
		goQuestionnaire
	} from '@/common/utils.js'
	export default {
		name: 'questionnaireItem',
		props: {
			itemData: {
				type: Object
			},
			isLogin:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				status: false,
			}
		},
		watch:{
			isLogin:function(n,o){
				this.isLogin = n
			}
		},
		methods: {
			goQuestionnaire(item) {
				if (item.participate == 2) {
					this.status = true
					if (item.isLogic == 1) {
						uni.navigateTo({
							url: '/pages/webView/webView?type=questionnaireLogic&id=' + item.id,
						})
					} else {
						uni.navigateTo({
							url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}&status=${this.status}`
						})
					}
				} else if (item.status == 6) {
					uni.showToast({
						title: "问卷暂未开始",
						icon: "none"
					})
				} else {
					if (item.isLogic == 1) {
						uni.navigateTo({
							url: '/pages/webView/webView?type=questionnaireLogic&id=' + item.id,
						})
					} else {
						uni.navigateTo({
							url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}&status=${this.status}`
						})
					}
				}
			}
		},
		onReady() {
			// console.log(666)
			// console.log(this.itemData)
		},
	}
</script>

<style lang="scss">
	.questionnaire-item {
		background-color: #FFFFFF;
		padding: 30rpx 40rpx 0;

		.questionnaire-title {
			font-size: 28rpx;
			line-height: 48rpx;
			color: #303031;

			.questionnaire-top {
				background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
				line-height: 32rpx;
				width: 64rpx;
				height: 32rpx;
				font-size: 22rpx;
				border-radius: 4rpx;
				color: #FFFFFF;
				margin-right: 10rpx;
				text-align: center;
			}
		}

		.questionnaire-content {
			margin-top: 20rpx;
			background-color: #F4F5F6;
			display: flex;
			border-radius: 10rpx;
			padding: 20rpx 0;

			.questionnaire-content-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 24rpx;
				line-height: 34rpx;

				.statusImg {
					width: 36rpx;
					height: 36rpx;
				}

				.questionnaire-content-item-title {
					font-weight: bold;
				}

				.questionnaire-content-item-content {
					margin-top: 10rpx;
					color: #919397;
				}
			}

			.questionnaire-content-spilt {
				width: 2rpx;
				height: 74rpx;
				background: linear-gradient(180deg, rgba(243, 244, 244, 0) 0%, #E3E4E5 20%, #E3E4E5 51%, #E3E4E5 83%, rgba(255, 255, 255, 0) 100%);
			}
		}

		.questionnaire-other {
			margin-top: 20rpx;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #BABEC0;
			display: flex;
			justify-content: space-between;
		}

		.questionnaire-end {
			margin: 30rpx -40rpx 0;
			height: 10rpx;
			background-color: #F8F8F9;
		}
	}
</style>
