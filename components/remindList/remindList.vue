<template>
	<view>
		<view class="list" v-for="(item,index) of list.records" :key="index" @tap="goDetails(item)">
			<view class="flexRow" style="margin-bottom: 46rpx;">
				<view class="flexRowStart">
					<view class="" style="position: relative;">
						<image lazy-load="true" :src="item.senderAvatar" class="avatarImg"></image>
						<!-- 	<view v-if="item.isRead==1" class="" style="position: absolute;top: 0rpx;right: 20rpx;width: 12rpx;height: 12rpx;background-color: #F74437;border-radius: 50%;">
							
						</view> -->
					</view>
					<view class="color_303031 bold senderName">
						{{$isEmpty(item.senderName)?'': item.senderName}}
					</view>
				</view>
				<view class="color_BABEC0 time">
					<!-- {{$isEmpty(item.time)?'':item.time}} -->
					{{($isEmpty(item.time)?'':item.time)}}
				</view>
			</view>
			<view class="color_919397 title">
				{{$isEmpty(item.title)?'':item.title}}
			</view>
			<view class="centerLine">

			</view>
			<view class="flexRow">
				<view class="color_666769 bold info">
					查看详情
				</view>
				<image class="rightGrayImg" v-if="oss" :src="oss+'icon_createTask_grayRight.png'"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: Object,
		},
		data() {
			return {
				oss: '',
			};
		},
		onReady() {
			this.oss = this.$oss
		},
		methods: {
			goDetails(item) {
				if (item.type == 10186 || item.type == 10187 || item.type == 10189 || item.type == 10190 || item.type == 10191 ||
					item.type == 10192 || item.type == 10193 || item.type == 10194 || item.type == 10195 || item.type == 10196 || item
					.type == 10203) {
					uni.navigateTo({
						url: `/pages/ican/taskDetail/taskDetail?taskId=${item.dataId}`
					})
				} else if (item.type == 10188) {
					uni.showToast({
						title: "任务已删除",
						icon: "none"
					})
				} else if (item.type == 10053 || item.type == 10058 || item.type == 10080 || item.type == 10055 || item.type ==
					10070 || item.type == 10069 || item.type == 10102 ||
					item.type == 10116 || item.type == 10117) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soWorkbench?id=${item.dataId}`
					})
				} else if (item.type == 10197 || item.type == 10205) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.dataId}`
					})
				} else if(item.type == 10232){
					uni.navigateTo({
						url: '/pages/webView/webView?type=questionnaireLogic&id=' + item.dataId,
						fail(res) {
							console.log(res)
						}
					})
					
				} else if (item.type == 10119) {
					uni.navigateTo({
						url: `/pages/my/nengbei/detail/detail?id=${item.dataId}`
					})
				} else if (item.type == 11206 || item.type == 10206 || item.type == 10091 || item.type == 10174) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soSummary/soSummaryDetail/soSummaryDetail?id=${item.dataId}`
					})
				} else if (item.type == 10175) {
					uni.showToast({
						title: "纪要已删除",
						icon: "none"
					})
				} else if (item.type == 10047 || item.type == 10048 || item.type == 10049) {
					uni.navigateTo({
						url: `/pages/find/magicBox/detail/detail?id=${item.dataId}`
					})
				} else if (item.type == 10094 || item.type == 10095 || item.type == 10096 || item.type == 10097 ||
					item.type == 10098 || item.type == 10099 || item.type == 10100) {
					uni.navigateTo({
						url: `/pages/find/attention/detail/detail?id=${item.dataId}`
					})
				} else if (item.type == 10101 || item.type == 10085 || item.type == 10086 || item.type == 10087 || item.type ==
					10042) {
					uni.navigateTo({
						url: `/pages/find/cannerCard/cannerCard?id=${item.senderId}`
					})
				} else if (item.type == 10212) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soRecruit/soRecruitNoticeReceive/soRecruitNoticeReceive?infoId=${item.id}&text=${item.text}`
					})
				} else if(item.type == 10214){
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationDetails/soExaminationDetails?id=${item.dataId}`
					})
				}else {
					uni.showToast({
						title: "暂不支持的消息",
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		padding: 30rpx 24rpx 22rpx 30rpx;
		background-color: #F4F5F6;
		border-radius: 30rpx;
		margin-bottom: 40rpx;

		.avatarImg {
			width: 56rpx;
			height: 56rpx;
			margin-right: 20rpx;
			border-radius: 20rpx;
		}

		.senderName {
			font-size: 32rpx;
			line-height: 44rpx;
		}

		.time {
			font-size: 22rpx;
			line-height: 32rpx;
		}

		.title {
			line-height: 48rpx;
			font-size: 28rpx;
			margin-bottom: 40rpx;
		}

		.centerLine {
			width: 100%;
			height: 0.3rpx;
			background-color: #EFF0F1;
			margin-bottom: 24rpx;
		}

		.info {
			font-size: 28rpx;
			line-height: 40rpx;
		}

		.rightGrayImg {
			width: 44rpx;
			height: 44rpx;
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
