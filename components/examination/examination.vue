<template>
	<view>
		<scroll-view scroll-y="true" :style="{height:scrollHeight + 'px'}" @scrolltolower="examMore" @refresherrefresh="examPulldown" refresher-enabled="true" :refresher-triggered="examPulldownStatus">
			<view class="">
				<view class="examList" v-for="(item,index) of examData.records" :key="index" @tap="goDetails(item)">
					<view class="doubleEllipsis bold color_303031 examName">
						{{$isEmpty(item.examName)?'':item.examName}}
					</view>
					<view class="flexRow examInfo color_919397">
						<view class="time">
							<view class="">
								{{$isEmpty(item.appShowTime)?'长期有效':item.appShowTime}}
							</view>
						</view>
						<view class="member">
							{{$isEmpty(item.testNumber)?'0':item.testNumber}}人已考
						</view>
					</view>
					<view class="flexRow examOrg color_2F80FF">
						<view class="flexRowStart color_666769">
							<image v-if="oss" class="soAvatarImg" :src="oss+'icon_soExamination_soAvatar.png'"></image>
							<view class="">
								{{$isEmpty(item.orgName)?'':item.orgName}}
							</view>
						</view>
						<view v-if="item.beginStatus==1" class="btn color_main_4fc975" style="background: rgba(70, 178, 139, .1);">
							立即参加
						</view>
						<view v-if="item.beginStatus==2" class="btn color_919397" style="background-color: #E3E4E5;">
							未开始
						</view>
						<view v-if="item.beginStatus==3" class="btn color_2F80FF" style="background: rgba(224, 233, 246, 0.9);">
							已参加
						</view>
					</view>
					<view class="freeStatus" v-if="item.chargeStatus==2 || item.chargeStatus==3">
						<image v-if="oss" :src="oss+'icon_soExamination_notFree.png'" mode=""></image>
					</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!examData.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<uni-load-more :status="examstatus" v-if="examData.records.length>0"></uni-load-more>
			<view class="bottom-safe" style="height: 0;"></view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			examData: Object,
			scrollHeight: Number,
			examstatus: "",
		},
		data(){
			return{
				saveToken: '',
				url: '',
				oss: '',
				
				examPulldownStatus: false,
			}
		},
		onReady() {
			this.oss=this.$oss
			if (!this.examData.current < this.examData.pages) {
				this.examstatus = 'noMore';
			}
		},
		methods:{
			examPulldown(){
				console.log('examPulldown..')
				this.examPulldownStatus = true
				this.saveToken = this.$isEmpty(uni.getStorageSync('token'));
				if (this.saveToken) {
					this.url = 'qms/exam_examination/visitor_app_page';
				} else {
					this.url = 'qms/exam_examination/app_page';
				}
				this.$http.get(this.url, {
					params: {
						source: '2',
					}
				}).then(res=>{
					this.examData = res.data.data
					this.examPulldownStatus = false
				})
			},
			goDetails(item) {
				// console.log(item.id)
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationDetails/soExaminationDetails?id=${item.id}&examName=${item.examName}`
				})
			},
			examMore(){
				console.log('触底..')
				this.saveToken = this.$isEmpty(uni.getStorageSync('token'));
				if (this.saveToken) {
					this.url = 'qms/exam_examination/visitor_app_page';
				} else {
					this.url = 'qms/exam_examination/app_page';
				}
				let that = this;
				if (that.examData.current < that.examData.pages) {
					that.examstatus = 'loading';
					that.$http.get(this.url, {
						params: {
							source: '2',
							current: that.examData.current + 1
						}
					}).then(res => {
						that.examData.current = res.data.data.current;
						let list = res.data.data.records
						that.examData.records = that.examData.records .concat(list);
						that.examstatus = 'more';
					});
				} else {
					that.examstatus = 'noMore';
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.examList {
	padding: 32rpx 32rpx 24rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	margin-bottom: 16rpx;

	.examName {
		font-size: 32rpx;
		line-height: 48rpx;
		margin-bottom: 20rpx;
	}

	.examInfo {
		font-size: 22rpx;
		line-height: 32rpx;
		margin-bottom: 30rpx;
	}

	.examOrg {
		font-size: 24rpx;
		line-height: 34rpx;

		.btn {
			width: 156rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			border-radius: 26rpx;
		}
	}
	
	.soAvatarImg{
		width: 48rpx;
		height: 48rpx;
		margin-right: 10rpx;
	}

	.freeStatus {
		width: 60rpx;
		height: 36rpx;
		position: absolute;
		top: -6rpx;
		left: -8rpx;

		image {
			width: 60rpx;
			height: 36rpx;
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