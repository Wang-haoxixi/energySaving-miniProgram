<template>
	<view class="container" :class="isChooseShow?'maskClass':''">
		<view class="contentTitle" id="title">
			<view class="flexRowStart search">
				<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
				<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"></input>
			</view>
			<view class="flexRowStart" style="margin-top: 32rpx;" id="kind">
				<view class="flexColumn" style="margin-right: 40rpx;height: 60rpx;" @tap="testRecords()">
					<view :class="[{ active: testActive }, { unactive: !testActive }]">考试记录</view>
					<view class="title-item-bottom" v-if="testActive"></view>
				</view>
				<view class="flexColumn" @tap="testCertificate()" style="height: 60rpx;">
					<view :class="[{ active: certificateActive }, { unactive: !certificateActive }]">我的证书</view>
					<view class="title-item-bottom" v-if="certificateActive"></view>
				</view>
			</view>
		</view>
		<swiper :style="{height:swiperHeight + 'px'}" @change="swiperChange" observer observerParents :current-item-id="item_id"
		 ref="swiper">
			<swiper-item item-id="0">
				<scroll-view :style="{height:swiperHeight + 'px'}" scroll-y="true" style="width: 670rpx;padding: 0 40rpx;"
				 @scrolltolower="getMoreExam">
					<view class="" style="padding-top: 12rpx;">
						<view class="examList" v-for="(item,index) of showList" :key="index" @tap="goDetails(item)">
							<view class="doubleEllipsis bold color_303031 examName">
								{{$isEmpty(item.examName)?'':item.examName}}
							</view>
							<view class="flexRow examInfo color_919397">
								<view class="time flexRowStart">
									<view class="flexRowStart">
										<view class="">
											时间:
										</view>
										<view class="" style="margin-left: 14rpx;">
											{{$isEmpty(item.createTime)?'':item.createTime.substring(0,10)}}
										</view>
									</view>
									<view class="" style="margin: 0 20rpx;background-color: #BABEC0;width:2rpx;height: 16rpx;">

									</view>
									<view class="flexRowStart">
										<view class="">
											状态:
										</view>
										<view v-if="item.state == 1" class="" style="margin-left: 14rpx;">
											未提交
										</view>
										<view v-if="item.state == 2" class="" style="margin-left: 14rpx;">
											已阅卷
										</view>
										<view v-if="item.state == 3" class="" style="margin-left: 14rpx;">
											未阅卷
										</view>
									</view>
								</view>
								<view class="member flexRowStart">
									<view class="">
										成绩:
									</view>
									<view v-if="$isEmpty(item.score) && item.score !=0" class="color_2F80FF" style="margin-left: 14rpx;">
										暂无
									</view>
									<view v-else class="color_2F80FF" style="margin-left: 14rpx;">
										{{$isEmpty(item.score)?'0':item.score}}分
									</view>
								</view>
							</view>
							<view class="flexRow examOrg">
								<view class="flexRowStart color_666769">
									<image v-if="oss" class="soAvatarImg" :src="oss+'icon_soExamination_soAvatar.png'"></image>
									<view class="">
										{{$isEmpty(item.orgName)?'':item.orgName}}
									</view>
								</view>
								<view v-if="item.state==1" class="btn color_F74437">
									继续答题
								</view>
								<view v-if="item.state==2 || item.state==3" class="btn color_F74437">
									查看试卷
								</view>
							</view>
							<view class="freeStatus" v-if="item.chargeStatus==2 ||item.chargeStatus==3">
								<image v-if="oss" :src="oss+'icon_soExamination_notFree.png'" mode=""></image>
							</view>
						</view>
					</view>
					<image class="emptyImg" v-if="!showList.length > 0 && oss" :src="oss+'pic_emptyExam.png'" mode="aspectFit"></image>
					<uni-load-more :status="examListStatus" v-if="showList.length>0"></uni-load-more>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="1">
				<scroll-view :style="{height:swiperHeight + 'px'}" scroll-y="true" style="width: 670rpx;padding: 0 40rpx;"
				 @scrolltolower="getMoreCertificate">
					<view class="" style="padding-top: 12rpx;">
						<view class="examList" v-for="(item,index) of certificateList.records" :key="index" @tap="checkCertificate(item)">
							<view class="doubleEllipsis bold color_303031 examName">
								{{$isEmpty(item.certificateName)?'':item.certificateName}}
							</view>
							<view class="flexRow examInfo color_919397">
								<view class="time flexRowStart">
									<view class="">
										获得时间:
									</view>
									<view class="" style="margin-left: 14rpx;">
										{{$isEmpty(item.validTime)?'': item.validTime.substring(0,10)}}
									</view>
								</view>
								<view class="member flexRowStart">
									<view class="">
										有效期:
									</view>
									<view class="color_2F80FF" style="margin-left: 14rpx;">
										{{$isEmpty(item.validityPeriod)?'永久有效':item.validityPeriod}}
									</view>
								</view>
							</view>
							<view class="flexRow examOrg">
								<view class="flexRowStart color_666769">
									<image class="soAvatarImg" v-if="oss" :src="oss+'icon_soExaminationAnalyze_certificateIcon.png'"></image>
									<view class="" v-if="item.level==1">
										初级
									</view>
									<view class="" v-if="item.level==2">
										中级
									</view>
									<view class="" v-if="item.level==3">
										高级
									</view>
								</view>
								<view class="btn color_F74437">
									查看证书
								</view>
							</view>
							<view class="freeStatus" v-if="item.chargeStatus==2">
								<image v-if="oss" :src="oss+'icon_soExamination_notFree.png'" mode=""></image>
							</view>
						</view>
					</view>
					<image class="emptyImg" v-if="!certificateList.records.length > 0 &&oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
					<uni-load-more :status="certificateListStatus" v-if="certificateList.records.length > 0"></uni-load-more>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<uni-popup ref="dialogWait" type="bottom">
			<view class="popDialog">
				<view class="flexRowStart" style="justify-content: center;">
					<image v-if="oss" class="confirmImg" :src="oss+'icon_meetting_confirm.png'"></image>
					<view class="color_666769 message">
						您的试卷还未阅卷，暂时无法查看
					</view>
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancelWait">
						取消
					</view>
					<view class="button repeatNow" @tap="passWait">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				examList: {
					records: []
				},
				certificateList: {
					records: []
				},
				showList: [],
				oss: '',
				examListStatus: '',
				certificateListStatus: '',
				swiperHeight: '',
				item_id: 0,
				testActive: true,
				certificateActive: false,
				searchText: ''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			uni.createSelectorQuery()
				.in(this)
				.select('#title')
				.boundingClientRect()
				// .select('#kind')
				// .boundingClientRect()
				.exec(ret => {
					// console.log(ret)
					let height = uni.getSystemInfoSync().windowHeight;
					// console.log(height)
					this.swiperHeight = height - ret[0].height
					// console.log(this.scrollHeight)
				});
		},
		onShow() {
			this.$http.get('qms/exam_examination_management/my_pager', {
				params: {
					examName: this.searchText
				}
			}).then(res => {
				// console.log(res)
				this.examList = res.data.data
				this.showList = this.examList.records
				if (!(this.examList.current < this.examList.pages)) {
					this.examListStatus = 'noMore'
				} else {
					this.examListStatus = 'more'
				}
			})
			this.$http.get('qms/exam_user_certificate/my_certificate', {
				params: {
					name: this.searchText,
				}
			}).then(res => {
				// console.log(res)
				this.certificateList = res.data.data
				if (!(this.certificateList.current < this.certificateList.pages)) {
					this.certificateListStatus = 'noMore'
				} else {
					this.examListStatus = 'more'
				}
			})
		},
		methods: {
			getMoreExam() {
				let that = this
				if (that.examList.current < that.examList.pages) {
					that.examListStatus = 'loading';
					that.$http.get('qms/exam_examination_management/my_pager', {
						params: {
							examName: that.searchText,
							current: that.examList.current + 1
						}
					}).then(res => {
						that.examList.current = res.data.data.current;
						that.examList.records = that.examList.records.concat(res.data.data.records);
						that.showList = that.examList.records
						that.examListStatus = 'more';
					});
				} else {
					that.examListStatus = 'noMore';
				}
			},
			getMoreCertificate() {
				let that = this
				if (that.certificateList.current < that.certificateList.pages) {
					that.certificateListStatus = 'loading';
					that.$http.get('qms/exam_user_certificate/my_certificate', {
						params: {
							name: that.searchText,
							current: that.certificateList.current + 1
						}
					}).then(res => {
						that.certificateList.current = res.data.data.current;
						that.certificateList.records = that.certificateList.records.concat(res.data.data.records);
						that.certificateListStatus = 'more';
					});
				} else {
					that.certificateListStatus = 'noMore';
				}
			},
			checkCertificate(item) {
				uni.navigateTo({
					url: `/pages/my/examination/myCertificate/myCertificate?imgUrl=${item.imgUrl}&id=${item.id}&certificateName=${item.certificateName}`
				})
			},
			cancelWait() {
				this.$refs.dialogWait.close()
			},
			passWait() {
				this.$refs.dialogWait.close()
			},
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.testRecords();
				} else if (e.detail.current == 1) {
					this.testCertificate();
				}
			},
			testCertificate() {
				this.certificateActive = true
				this.testActive = false
				this.item_id = 1;
				this.searchText = ""
				this.$http.get('qms/exam_user_certificate/my_certificate', {
					params: {
						name: this.searchText,
					}
				}).then(res => {
					// console.log(res)
					this.certificateList = res.data.data
					if (!(this.certificateList.current < this.certificateList.pages)) {
						this.certificateListStatus = 'noMore'
					} else {
						this.examListStatus = 'more'
					}
				})
			},
			testRecords() {
				this.item_id = 0;
				this.certificateActive = false
				this.testActive = true
				this.searchText = ""
				this.$http.get('qms/exam_examination_management/my_pager', {
					params: {
						examName: this.searchText
					}
				}).then(res => {
					// console.log(res)
					this.examList = res.data.data
					this.showList = this.examList.records
					if (!(this.examList.current < this.examList.pages)) {
						this.examListStatus = 'noMore'
					} else {
						this.examListStatus = 'more'
					}
				})
			},
			goDetails(item) {
				if (item.state == 1) {
					this.$http.get('qms/exam_answer/check_state_v2/2',{
						params:{
							id:item.examinationId,
							manageId:item.id
						}
					}).then(res=>{
						console.log(res)
						if(res.data.data.code == 4){
							uni.showToast({
								title:res.data.data.msg,
								icon:"none"
							})
						}else if(res.data.data.code == 2){
						uni.showToast({
							title: '交卷成功，成绩由人工阅卷最终确定',
							icon: 'none',
							duration: 1000
						})
					}  else if (res.data.data.code == 1){
						uni.redirectTo({
							url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?id=${this.examInfo.manageId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}`
						})
					}else{
							uni.navigateTo({
								url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?manageId=${item.id}`
							})
						}
					})
				} else if (item.state == 2) {
					this.$http.get('qms/exam_answer/check_state_v2/1',{
						params:{
							id:item.examinationId,
							manageId:item.id
						}
					}).then(res=>{
						// console.log(res)
						if(res.data.data.code == 20){
							uni.showToast({
								title:res.data.data.hint,
								icon:'none',
								duration:1000
							})
						}else{
							uni.navigateTo({
								url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationAnalyze/soExaminationAnalyze?id=${item.id}`
							})
						}
					})
				} else if (item.state == 3) {
					this.$refs.dialogWait.open()
				}
			},
			search() {
				if (this.item_id == 0) {
					this.$http.get('qms/exam_examination_management/my_pager', {
						params: {
							examName: this.searchText
						}
					}).then(res => {
						// console.log(res)
						this.examList = res.data.data
						this.showList = this.examList.records
						if (!this.examList.current < this.examList.pages) {
							this.examListStatus = 'noMore'
						}
					})
				} else if (this.item_id == 1) {
					this.$http.get('qms/exam_user_certificate/my_certificate', {
						params: {
							name: this.searchText
						}
					}).then(res => {
						// console.log(res)
						this.certificateList = res.data.data
						if (!this.certificateList.current < this.certificateList.pages) {
							this.certificateListStatus = 'noMore'
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.popDialog {
		padding: 32rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);

		.message {
			font-size: 28rpx;
			line-height: 52rpx;
			text-align: center;
			margin: 48rpx 0;
		}

		.noRepeat {
			flex: 1;
			background: #F5f7f8;
			color: #565B5F;
			margin-right: 30rpx;
		}

		.repeatNow {
			flex: 1;
		}
	}

	.confirmImg {
		width: 52rpx;
		height: 52rpx;
		margin-right: 20rpx;
	}

	.active {
		color: #f74437;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		margin-bottom: 10rpx;
	}

	.unactive {
		color: #919397;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		margin-bottom: 10rpx;
	}

	.title-item-bottom {
		width: 12rpx;
		height: 6rpx;
		border-radius: 3rpx;
		background-color: #F74437;
	}

	.soAvatarImg {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	::v-deep.resetBtn {
		margin-right: 30rpx;
		flex: 1;
		padding: 20rpx 126rpx;
		background-color: #FFFFFF;
		border: 2rpx solid #F74437;
		color: #F74437;
	}

	::v-deep.confirmBtn {
		flex: 1;
		padding: 22rpx 128rpx;
	}

	.contentTitle {
		position: sticky;
		top: 0rpx;
		z-index: 9;
		background-color: #FFFFFF;
		padding: 40rpx 40rpx 28rpx;
	}

	.pickImg {
		width: 44rpx;
		height: 44rpx;
		margin-left: 4rpx;
	}

	.search {
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #F5f7f8;

		.searchImg {
			height: 32rpx;
			width: 32rpx;
			margin-right: 16rpx;
		}
	}

	.inputDefault {
		font-size: 28rpx;
		color: #919397;
	}

	input {
		flex: 1;
		font-size: 28rpx;
		padding: 0 14rpx;
		color: #666769;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.container {
		.examList {
			padding: 30rpx;
			background-color: #F4F5F6;
			border-radius: 30rpx;
			position: relative;
			margin-bottom: 40rpx;

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
					background: rgba(247, 68, 55, 0.1);
				}
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
	}
</style>
