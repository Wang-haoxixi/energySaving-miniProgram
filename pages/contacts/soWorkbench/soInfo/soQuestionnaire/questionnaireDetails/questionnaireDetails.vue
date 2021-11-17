<template>
	<view class="container" v-if="showPage">
		<scroll-view scroll-y="true" :scroll-into-view="toView" :style="{height:scrollHeight + 'px'}">
			<view id="comment">
				<view id="containerWrap" class="containerWrap">
					<view class="">
						<view class="bold color_303031 name">
							{{$isEmpty(questionnaireInfo.name)?'': questionnaireInfo.name}}
						</view>
					</view>
					<view v-if="questionnaireInfo.openAward==2" class="color_919397 award">
						<view>
							奖励:
						</view>
						<view class="color_F74437 awardInfo">
							{{$isEmpty(questionnaireInfo.awardNumber)?'0':questionnaireInfo.awardNumber}}贝/前{{$isEmpty(questionnaireInfo.awardScope)?'0':questionnaireInfo.awardScope}}名
						</view>
					</view>
					<view class="color_919397 deadline">
						<view>
							截止时间:
						</view>
						<view v-if="questionnaireInfo.endTime" class="timeInfo">
							{{$isEmpty(questionnaireInfo.startTime)?'':questionnaireInfo.startTime.substring(0,16)}} -
							{{$isEmpty(questionnaireInfo.endTime)?'':questionnaireInfo.endTime.substring(0,16)}}
						</view>
						<view v-else class="timeInfo">
							长期有效
						</view>
					</view>
					<view class="color_666769 slogan">
						{{$isEmpty(questionnaireInfo.remarks)?'':questionnaireInfo.remarks}}
					</view>
				</view>
				<form @submit="formSubmit">
					<view :id="'A'+item.orderNumber" class="formTitle" v-for="(item,index) of questionnaireList" :key="index">
						<singleChoice v-if="item.type==1" :optionList="item" :status="status" :isLogin="isLogin" @click="getSingleValue"></singleChoice>
						<multipleChoice v-if="item.type==2" :optionList="item" :status="status" :isLogin="isLogin" @click="getMultipleValue"></multipleChoice>
						<imgSingleChoice v-if="item.type==3" :optionList="item" :status="status" :isLogin="isLogin" @click="getImgSingleValue"></imgSingleChoice>
						<imgMultipleChoice v-if="item.type==4" :optionList="item" :status="status" :isLogin="isLogin" @click="getImgMultipleValue"></imgMultipleChoice>
						<selection v-if="item.type==5" :optionList="item" :status="status" :isLogin="isLogin" @click="getSelectionValue"></selection>
						<completion v-if="item.type==6" :optionList="item" :status="status" :isLogin="isLogin" @click="getCompletionValue"></completion>
						<startGrade v-if="item.type==8" :optionList="item" :status="status" :isLogin="isLogin" @click="getstartGradeValue"></startGrade>
					</view>
					<view class="flexRowStart">
						<button class="button" :class="status?'btnShare':'btn'" open-type="share">分享</button>
						<button v-if="isLogin==true && status==false" class="button submitBtn" form-type="submit" @submit="formSubmit"
						 :disabled="questionnaireInfo.status==6 ||questionnaireInfo.status==3">提交</button>
						<button v-if="isLogin==false && status == false" class="button submitBtn" form-type="submit" @submit="formSubmit" 
						:disabled="questionnaireInfo.status==6 || questionnaireInfo.status==3">提交</button>
					</view>
				</form>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getPhoneNumber
	} from '@/common/login.js';
	import {
		isEmpty
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				questionnaireInfo: {},
				questionnaireList: [],
				copyQuestionnaireList: [],
				list: [],
				toView: '',
				filterQuestionnaireList: [],
				quesQuestionId: '',
				isLogin: false,
				submitList: [],
				status: false,
				questionnaireStatus: 1,
				scrollHeight: 0,
				id: '',
				isNotFinished: '',
				isOnShow: false,
				isShowModal: false,
				//数据返回后在渲染HTML
				showPage: false,
				refresh: '',
				url:''
			}
		},
		onLoad(options) {
			// console.log(this.isLogin)
			// console.log(this.isLogin)
			const {
				id,
				status
			} = options
			// console.log(id)
			// console.log(options)
			this.id = id
			if(!this.$isEmpty(this.status)){
				this.status = JSON.parse(status)
				// console.log(this.status)
			}
			// console.log(status)
			this.quesQuestionId = id
			uni.$on('submit', data => {
				this.refresh = true
			})
			uni.$on('changeStatus',data=>{
				this.status = data
				this.url = `qms/questionnaire/app/${this.id}`
			})
		},
		onShow() {
			// console.log(this.isShowModal)
			var pages = getCurrentPages();
			this.isLogin = !this.$isEmpty(uni.getStorageSync('token'));
			if(this.$isEmpty(this.url)){
				if (this.isLogin) {
					this.url = `qms/questionnaire/app/${this.id}`
				} else {
					this.url = `qms/questionnaire/mini/${this.id}`
				}
			}else if (this.refresh ==true){
				this.url = `qms/questionnaire/app/${this.id}`
			}
			this.$http.get(this.url).then(res => {
				if (res.data.code == 1) {
					uni.showToast({
						title: res.data.message,
						icon: "none",
						duration: 1000,
						success: () => {
							setTimeout(() => {
								if(!(pages.length>1)){
									uni.switchTab({
										url:'/pages/tabbar/ican'
									})
								}else{
									uni.navigateBack({
										delta:1
									})
								}
							}, 1000)
						}
					})
				}
				// console.log(res)
				// console.log(res)
				this.questionnaireInfo = res.data.data
				this.questionnaireStatus = res.data.data.status
				if (this.isLogin == true && res.data.data.participate == 1) {
					//未参与
					// console.log(666)
					this.status = false
					this.submitList = uni.getStorageSync("submitList")
					if (this.refresh == true) {
						// console.log('hahahaha')
						this.$http.post('qms/answer/create', {
							list: this.submitList
						}).then(res => {
							// console.log(res)
							let status = res.data.data.status
							let content = res.data.data.content
							let subStatus = true
							let awardNumber = res.data.data.awardNumber
							uni.navigateTo({
								url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireResult/questionnaireResult?status=${status}&content=${content}&id=${this.id}&subStatus=${subStatus}&awardNumber=${awardNumber}`
							})
							uni.removeStorageSync("submitList")
						})
					}
				} else if (this.isLogin == true && res.data.data.participate != 1) {
					//已参与
					this.status = true
					uni.removeStorageSync("submitList")
					// if(this.refresh ==true){
					// 	uni.showToast({
					// 		title:"您已参与过此问卷",
					// 		icon:"none",
					// 		duration:1000
					// 	})
					// }
				}
				if (this.questionnaireStatus == 3 && res.data.data.participate == 1) {
					uni.showToast({
						title: '该问卷已结束',
						icon: 'none',
						duration: 1000,
						success: (res) => {
							setTimeout(()=>{
								uni.navigateBack()
							},1000)
						}
					})
				} else {
					// console.log(6)
					this.filterQuestionnaireList = res.data.data.quesQuestionDTO
					this.questionnaireList = this.filterQuestionnaireList.filter(item => {
						return item.type == 1 || item.type == 2 || item.type == 3 || item.type == 4 || item.type == 5 || item.type ==
							6 || item.type == 8
					})
					// console.log(this.questionnaireList)
					this.questionnaireList.forEach((item, index) => {
						item.orderNumber = index + 1
					})
					this.copyQuestionnaireList = JSON.parse(JSON.stringify(this.questionnaireList))
					// console.log(this.questionnaireList)
				}
				this.showPage = true
				console.log(this.status)
				if(this.status ==false){
					uni.setNavigationBarTitle({
						title:"问卷详情"
					})
				}else{
					uni.setNavigationBarTitle({
						title:"分析报告"
					})
				}
			})
			uni.createSelectorQuery()
				.in(this)
				.exec(ret => {
					// console.log(ret)
					let height = uni.getSystemInfoSync().windowHeight;
					// console.log(height)
					this.scrollHeight = height
				});
		},
		onHide() {
			this.isOnShow = true
		},
		onUnload() {
			uni.removeStorageSync('submitList')
			uni.$off()
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'questionnaire', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat', //留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'wechat', //留痕目标
				markType: 'share', //留痕类型
				remark: '',
			}).then(res => {
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: '我分享了【' + this.questionnaireInfo.name + '】的问卷，快去看看吧',
				path: '/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=' + this.id
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save', {
				section: 'questionnaire', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat', //留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'moments', //留痕目标
				markType: 'share', //留痕类型
				remark: '',
			}).then(res => {
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.questionnaireInfo.name + '】的问卷，快去看看吧',
			}
		},
		methods: {
			formSubmit() {
				let that = this
				let sub = !this.$isEmpty(uni.getStorageSync('submitList'));
				if (sub == true && that.isLogin == true) {
					//存有作答的值并且已登录
					that.submitList = uni.getStorageSync("submitList")
					that.$http.post('qms/answer/create', {
						list: that.submitList
					}).then(res => {
						// console.log(res)
						let status = res.data.data.status
						let content = res.data.data.content
						let subStatus = true
						let awardNumber = res.data.data.awardNumber
						uni.navigateTo({
							url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireResult/questionnaireResult?status=${status}&content=${content}&id=${that.id}&subStatus=${subStatus}&awardNumber=${awardNumber}`
						})
						uni.removeStorageSync("submitList")
					})
				} 
				else if (sub == true && that.isLogin == false) {
					that.submitList = uni.getStorageSync("submitList")
					uni.showModal({
						content: "是否匿名提交",
						success: function(res) {
							if (res.cancel) {
								that.isShowModal = true
								// uni.setStorageSync("submitList", that.submitList)
								uni.navigateTo({
									url: '/pages/getUserInfo/getUserInfo'
								})
							} else if (res.confirm) {
								that.$http.post('qms/answer/outer/create', {
									list: that.submitList
								}).then(res => {
									// let status=res.data.data.status
									let content = res.data.data
									let awardNumber = res.data.data.awardNumber
									let status = 0
									uni.navigateTo({
										url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireResult/questionnaireResult?content=${content}&status=${status}&awardNumber=${awardNumber}`
									})
								})
							}
						}
					})
					// that.$http.post('qms/answer/outer/create', {
					// 	list: that.submitList
					// }).then(res => {
					// 	// console.log(res)
					// 	let content = res.data.data
					// 	let awardNumber = res.data.data.awardNumber
					// 	let status = 0
					// 	uni.navigateTo({
					// 		url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireResult/questionnaireResult?content=${content}&status=${status}&awardNumber=${awardNumber}`
					// 	})
					// 	uni.removeStorageSync("submitList")
					// })
				} 
				else {
					let firstEmptyNumber = 0
					that.isNotFinished = !that.copyQuestionnaireList.some(item => {
						firstEmptyNumber = item.orderNumber
						return item.isRequire == 1;
					})
					// console.log(isNotFinished)
					if (that.isNotFinished == false) {
						// console.log(firstEmptyNumber)
						uni.showToast({
							icon: "none",
							duration: 2000,
							title: `请继续作答第${firstEmptyNumber}题`
						})
						// this.goAnchor(`#${firstEmptyNumber}`)
						that.toView = 'A' + firstEmptyNumber;
						// console.log(this.toView)
					}
					that.submitList = Array.from(new Set(that.list))
					if (that.isNotFinished == true) {
						if (that.isLogin == false) {
							uni.showModal({
								content: "是否匿名提交",
								success: function(res) {
									if (res.cancel) {
										that.isShowModal = true
										uni.setStorageSync("submitList", that.submitList)
										uni.navigateTo({
											url: '/pages/getUserInfo/getUserInfo'
										})
									} else if (res.confirm) {
										that.$http.post('qms/answer/outer/create', {
											list: that.submitList
										}).then(res => {
											// let status=res.data.data.status
											let content = res.data.data
											let awardNumber = res.data.data.awardNumber
											let status = 0
											uni.navigateTo({
												url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireResult/questionnaireResult?content=${content}&status=${status}&awardNumber=${awardNumber}`
											})
										})
									}
								}
							})
						} else {
							that.$http.post('qms/answer/create', {
								list: that.submitList
							}).then(res => {
								// console.log(res)
								let status = res.data.data.status
								let content = res.data.data.content
								let awardNumber = res.data.data.awardNumber
								let subStatus = false
								uni.navigateTo({
									url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireResult/questionnaireResult?status=${status}&content=${content}&id=${that.id}&subStatus=${subStatus}&awardNumber=${awardNumber}`
								})
								uni.removeStorageSync("submitList")
							})
						}
					}
				}
			},
			getSingleValue(singleValue, optionList) {
				this.copyQuestionnaireList.forEach(item => {
					if (item.id == optionList.id) {
						item.isRequire = 2
					}
				})
				this.list.push(singleValue)
			},
			getMultipleValue(multipleValue, optionList) {
				this.copyQuestionnaireList.forEach(item => {
					if (item.id == optionList.id && optionList.isRequire == 2) {
						item.isRequire = 2
					} else if (item.id == optionList.id && optionList.isRequire == 1) {
						item.isRequire = 1
					} else if (item.id == optionList.id && optionList.isRequire == 0) {
						item.isRequire = 0
					}
				})
				this.list.push(multipleValue)
			},
			getCompletionValue(completionValue, optionList) {
				this.copyQuestionnaireList.forEach(item => {
					if (item.id == optionList.id && optionList.isRequire == 2) {
						item.isRequire = 2
					} else if (item.id == optionList.id && optionList.isRequire == 1) {
						item.isRequire = 1
					}
				})
				this.list.push(completionValue)
			},
			getstartGradeValue(startGradeValue, optionList) {
				this.copyQuestionnaireList.forEach(item => {
					if (item.id == optionList.id) {
						item.isRequire = 2
					}
				})
				this.list.push(startGradeValue)
			},
			getSelectionValue(selectionValue, optionList) {
				this.copyQuestionnaireList.forEach(item => {
					if (item.id == optionList.id) {
						item.isRequire = 2
					}
				})
				this.list.push(selectionValue)
			},
			getImgSingleValue(imgSingleValue, optionList) {
				this.copyQuestionnaireList.forEach(item => {
					if (item.id == optionList.id) {
						item.isRequire = 2
					}
				})
				this.list.push(imgSingleValue)
			},
			getImgMultipleValue(imgMultipleValue, optionList) {
				this.copyQuestionnaireList.forEach(item => {
					if (item.id == optionList.id && optionList.isRequire == 2) {
						item.isRequire = 2
					} else if (item.id == optionList.id && optionList.isRequire == 1) {
						item.isRequire = 1
					}
				})
				this.list.push(imgMultipleValue)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		margin: 0 40rpx;

		.containerWrap {
			.name {
				flex: 1;
				line-height: 52rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-size: 32rpx;
				margin: 30rpx 0;
			}

			.award {
				display: flex;
				display: none;
				height: 34rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				margin-bottom: 30rpx;

				.awardInfo {
					padding-left: 20rpx;
				}
			}

			.deadline {
				display: flex;
				height: 34rpx;
				line-height: 34rpx;
				font-size: 24rpx;
				margin-bottom: 20rpx;

				.timeInfo {
					padding-left: 20rpx;
				}
			}

			.slogan {
				line-height: 48rpx;
				font-size: 28rpx;
				padding-bottom: 40rpx;
			}
		}

		form {
			.formTitle {
				margin-bottom: 40rpx;
			}
		}
	}

	::v-deep .submitBtn {
		flex: 2;
		margin-bottom: 60rpx;
		margin-left: 30rpx;
	}
	button[disabled]{
	    background:#FFD6D6 !important;
	    color: #FFFFFF !important;
	}

	::v-deep .btn {
		flex: 1;
		// color: #F74437;
		color: #46B28B;
		font-size: 28rpx;
		background: #FFFFFF;
		border-radius: 64rpx;
		// border: 2rpx solid #F74437;
		border: 2rpx solid #46B28B;
		font-weight: bold;
		margin-bottom: 60rpx
	}

	::v-deep .btnShare {
		flex: 1;
		// color: #FFFFFF;
		font-size: 28rpx;
		// background-color: #F74437;
		border-radius: 64rpx;
		font-weight: bold;
		margin-bottom: 60rpx
	}

	::v-deep .btn::after {
		border: none;
	}

	::v-deep button::after {
		border: none;
	}
</style>
