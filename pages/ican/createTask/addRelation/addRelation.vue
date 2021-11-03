<template>
	<view class="">
		<view class="container">
			<view class="contentWrap">
				<view id="containerWrap" class="flexRow wrapTitle">
					<view @tap="allClick()">
						<view :class="[{ active: isAllActive }, { unactive: !isAllActive }]">材料</view>
						<view class="title" v-if="isAllActive"></view>
					</view>
					<view style="" @tap="underwayClick()">
						<view :class="[{ active: isUnderwayActive }, { unactive: !isUnderwayActive }]">问卷</view>
						<view class="title" v-if="isUnderwayActive"></view>
					</view>
					<view style="" @tap="endClick()">
						<view :class="[{ active: isEndActive }, { unactive: !isEndActive }]">活动</view>
						<view class="title" v-if="isEndActive"></view>
					</view>
				</view>
				<swiper circular @change="swiperChange" :style="{height:swiperHeight + 'px'}" observer observerParents
				 :current-item-id="item_id" ref="swiper">
					<swiper-item item-id="0">
						<view class="searchInput">
							<view id="search" class="wrapSearch">
								<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
								<input maxlength="500" placeholder="搜索名称" placeholder-class="inputDefault" @input="searchMaterial" v-model="searchMaterialText"></input>
							</view>
						</view>
						<scroll-view :style="{height:scrollHeight + 'px'}" :scroll-top="30" scroll-y="true" class="scroll-Y"
						 @scrolltolower="materialMore">
							<checkbox-group name="" @change="selectMaterial($event,item)" v-for="(item,index) of materialList" :key="index">
								<label class="flexRow content">
									<view class="flexRowStart contentInfo">
										<image class="img" :src="oss+'icon_Word.png'" v-if="oss && item.format=='.doc' || item.format=='.docx'||item.format=='.dot'"></image>
										<image class="img" :src="oss+'icon_PDF.png'" v-else-if="oss && item.format=='.pdf'"></image>
										<image class="img" :src="oss+'icon_PPT.png'" v-else-if="oss && item.format=='.pptx' || item.format=='.pps'|| item.format=='.ppam'|| item.format=='.ppt'"></image>
										<image class="img" :src="oss+'icon_Excel.png'" v-else-if="oss && item.format=='.xlt' || item.format=='.xls'|| item.format=='.xla'|| item.format=='.xlsx'"></image>
										<image class="img" :src="oss+'icon_TXT.png'" v-else-if="oss"></image>
										<view class="singleEllipsis contentDetail">
											<view class="color_303031 singleEllipsis bold materialName">
												{{$isEmpty(item.materialName)?'':item.materialName}}
											</view>
											<view class="flexRowStart count">
												<view class="countRead">
													<text class="color_919397 read">浏览:</text>
													<text class="color_2F80FF">{{$isEmpty(item.views)?'0':item.views}}</text>
												</view>
												<view class="countLoad">
													<text class="color_919397 load">下载:</text>
													<text class="color_2F80FF">{{$isEmpty(item.downloadTimes)?'0':item.downloadTimes}}</text>
												</view>
											</view>
										</view>
									</view>
									<checkbox class="select" :value="item.id" color="#FF6034" :checked="item.checked" />
								</label>
							</checkbox-group>
							<image class="emptyImg" v-if="!materialList.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
							<uni-load-more :status="materialStatus" v-if="materialList.length>0 "></uni-load-more>
						</scroll-view>
						<view class="bottom-safe" style="height: 112rpx;"></view>
					</swiper-item>
					<swiper-item item-id="1">
						<view class="searchInput">
							<view id="search" class="wrapSearch">
								<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
								<input maxlength="500" placeholder="搜索名称" placeholder-class="inputDefault" @input="searchQuestionnaire" v-model="searchQuestionnaireText"></input>
							</view>
						</view>
						<scroll-view :style="{height:scrollHeight + 'px'}" :scroll-top="30" scroll-y="true" class="scroll-Y"
						 @scrolltolower="questionnaireMore">
							<checkbox-group name="" @change="selectQuestionnaire($event,item)" v-for="(item, index) in questionnaireList"
							 :key="index">
								<label class="flexRow content">
									<view class="contentInfo">
										<view class="">
											<view class="color_303031 doubleEllipsis bold qusetionnaireName">
												{{$isEmpty(item.name)?'':item.name}}
											</view>
											<view class="color_919397 flexRow wrapJoin">
												<view class="flexRow">
													<image v-if="oss" class="img" :src="oss+'icon_so_questionnaire_group.png'"></image>
													<text class="txt">参与人数:</text>
													<text class="color_303031">{{$isEmpty(item.joinPeople)?'0':item.joinPeople}}</text>
												</view>
											</view>
											<view class="flexRow wrapTime">
												<view class="color_919397" v-if="item.startTime&&item.endTime">
													<text class="title">截止时间:</text>
													<text>{{$isEmpty(item.startTime)?'':item.startTime}}-{{$isEmpty(item.endTime)?'':item.endTime}}</text>
												</view>
												<view class="color_919397" v-else>
													<text class="title">截止时间:</text>
													<text style="">长期有效</text>
												</view>
												<view v-if="item.openAward==2" class="flexRow award">
													<image v-if="oss" class="awardImg" :src="oss+'icon_so_questionnaire_logo.png'"></image>
													<text class="color_F74437 awardNumber">+{{$isEmpty(item.awardNumber)?'0':item.awardNumber}}</text>
												</view>
											</view>
										</view>
									</view>
									<checkbox class="select" :value="item.id" color="#FF6034" :checked="item.checked" />
								</label>
							</checkbox-group>
							<image class="emptyImg" v-if="!questionnaireList.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
							<uni-load-more :status="questionnaireStatus" v-if="questionnaireList.length>0"></uni-load-more>
						</scroll-view>
						<view class="bottom-safe" style="height: 112rpx;"></view>
					</swiper-item>
					<swiper-item item-id="2">
						<view class="searchInput">
							<view id="search" class="wrapSearch">
								<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
								<input maxlength="500" placeholder="搜索名称" placeholder-class="inputDefault" @input="searchActivity" v-model="searchActivityText"></input>
							</view>
						</view>
						<scroll-view :style="{height:scrollHeight + 'px'}" :scroll-top="30" scroll-y="true" class="scroll-Y"
						 @scrolltolower="activityMore">
							<checkbox-group name="" @change="selectActicity($event,item)" v-for="(item, index) in activityList" :key="index">
								<label class="flexRow content">
									<view class="contentInfo">
										<view class="">
											<view class="color_303031 bold activityName">
												{{$isEmpty(item.name)?'':item.name}}
											</view>
											<view class="color_919397 flexRow wrapActivityTime">
												<view class="flexRowStart">
													<image v-if="oss" class="timeImg" :src="oss+'icon_so_activity_time.png'"></image>
													<text>{{$isEmpty(item.startTime)?'':item.startTime.split(" ")[0].split("-")[1]+"/"+item.startTime.split(" ")[0].split("-")[2]+" "+ item.startTime.split(" ")[1].split(":")[0]+":"+item.startTime.split(" ")[1].split(":")[1]}}~{{$isEmpty(item.endTime)?'':item.endTime.split(" ")[0].split("-")[1]+"/"+item.endTime.split(" ")[0].split("-")[2]+" "+ item.endTime.split(" ")[1].split(":")[0]+":"+item.endTime.split(" ")[1].split(":")[1]}}</text>
												</view>
											</view>
											<view class="color_919397 flexRowStart wrapActivityField">
												<image v-if="oss" class="locationImg" :src="oss+'icon_so_activity_location.png'"></image>
												<text>{{$isEmpty(item.city)?'':item.city}}-{{$isEmpty(item.field)?'':item.field}}</text>
											</view>
										</view>
									</view>
									<checkbox class="select" :value="item.id" color="#FF6034" :checked="item.checked" />
								</label>
							</checkbox-group>
							<image class="emptyImg" v-if="!activityList.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
							<uni-load-more :status="activityStatus" v-if="activityList.length>0"></uni-load-more>
						</scroll-view>
						<view class="bottom-safe" style="height: 112rpx;"></view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view id="btn" class="btn">
			<view class="button makeSure" @tap="checkRelation">
				确定 <text v-if="totalNumber!=0">(已选择{{$isEmpty(totalNumber)?'0':totalNumber}}个)</text>
			</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				orgId: '',
				isAllActive: true,
				isUnderwayActive: false,
				isEndActive: false,
				item_id: 0,
				searchMaterialText: '',
				searchQuestionnaireText: '',
				searchActivityText: '',
				materialInfo: {},
				mList: [],
				materialList: [],
				questionnaireInfo: {},
				qList: [],
				questionnaireList: [],
				activityInfo: {},
				aList: [],
				activityList: [],
				materialStatus: 'more',
				questionnaireStatus: 'more',
				activityStatus: 'more',
				materialListOut: [],
				questionnaireListOut: [],
				activityListOut: [],
				swiperHeight: 0,
				scrollHeight: 0,
				oss: '',
				array: []
			};
		},
		onLoad(options) {
			const {
				orgId
			} = options
			this.oss = this.$oss
			if (!this.$isEmpty(uni.getStorageSync('relation'))) {
				this.array = uni.getStorageSync('relation')
				// console.log(this.array)
			}
			this.orgId = orgId
			this.$http.get('qms/conference_publish/so_page', {
				params: {
					orgId: orgId,
					statusFlag: 1
				}
			}).then(res => {
				// console.log(res)
				this.activityInfo = res.data.data
				this.aList = res.data.data.records
				this.activityList = this.aList.map(item => {
					return {
						...item,
						checked: false
					}
				})
				this.array.forEach(item => {
					if (item.type == 2) {
						this.activityList.forEach(item2 => {
							if (item.id == item2.id) {
								item2.checked = true
							}
						})
					}
				})
				if (this.activityInfo.current == this.activityInfo.pages) {
					this.activityStatus = 'noMore'
				} else if (this.activityInfo.pages == 0) {
					this.activityStatus = 'noMore'
				}
			})
			this.$http.get('qms/questionnaire/page_so', {
				params: {
					orgId: orgId,
					status: 1
				}
			}).then(res => {
				// console.log(res)
				this.questionnaireInfo = res.data.data
				this.qList = res.data.data.records
				this.questionnaireList = this.qList.map(item => {
					return {
						...item,
						checked: false
					}
				})
				this.array.forEach(item => {
					if (item.type == 1) {
						this.questionnaireList.forEach(item2 => {
							if (item.id == item2.id) {
								item2.checked = true
							}
						})
					}
				})
				if (this.questionnaireInfo.current == this.questionnaireInfo.pages) {
					this.questionnaireStatus = 'noMore'
				} else if (this.questionnaireInfo.pages == 0) {
					this.questionnaireStatus = 'noMore'
				}
			})
			this.$http.get('dms/material/so/page', {
				params: {
					orgId: orgId,
					materialLevelId: 0
				}
			}).then(res => {
				// console.log(res)
				this.materialInfo = res.data.data
				this.mList = res.data.data.records
				this.materialList = this.mList.map(item => {
					return {
						...item,
						checked: false
					}
				})
				this.array.forEach(item => {
					if (item.type == 0) {
						this.materialList.forEach(item2 => {
							if (item.id == item2.id) {
								item2.checked = true
							}
						})
					}
				})
				if (this.materialInfo.current == this.materialInfo.pages) {
					this.materialStatus = 'noMore'
				} else if (this.materialInfo.pages == 0) {
					this.materialStatus = 'noMore'
				}
			})
			uni.createSelectorQuery()
				.in(this)
				.select('#containerWrap')
				.boundingClientRect()
				.select('#search')
				.boundingClientRect()
				.select('#btn')
				.boundingClientRect()
				.exec(ret => {
					// console.log(ret)
					let height = uni.getSystemInfoSync().windowHeight;
					// console.log(height)
					height = height - ret[0].height - ret[2].height;
					this.swiperHeight = height
					// console.log(this.swiperHeight)
					this.scrollHeight = this.swiperHeight - ret[1].height - ret[2].height;
					// console.log(this.scrollHeight)
				});
		},
		computed: {
			totalNumber() {
				let num = this.array.length
				return num
			}
		},
		methods: {
			checkRelation() {
				console.log(this.array)
				uni.setStorageSync('relation', this.array)
				uni.$emit('update', {
					array: JSON.stringify(this.array)
				})
				uni.navigateBack({
					delta: 1
				})
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
			},
			underwayClick() {
				this.isAllActive = false;
				this.isUnderwayActive = true;
				this.isEndActive = false;
				this.item_id = 1;
			},
			endClick() {
				this.isAllActive = false;
				this.isUnderwayActive = false;
				this.isEndActive = true
				this.item_id = 2
			},
			searchMaterial() {
				this.$http.get('dms/material/so/page', {
					params: {
						orgId: this.orgId,
						materialLevelId: 0,
						materialName: this.searchMaterialText
					}
				}).then(res => {
					// console.log(res)
					this.materialInfo = res.data.data
					this.mList = res.data.data.records
					this.materialList = this.mList.map(item => {
						return {
							...item,
							checked: false
						}
					})
					if (this.materialInfo.current == this.materialInfo.pages) {
						this.materialStatus = 'noMore'
					} else if (this.materialInfo.pages == 0) {
						this.materialStatus = 'noMore'
					}
				})
			},
			searchQuestionnaire() {
				this.$http.get('qms/questionnaire/page_so', {
					params: {
						orgId: this.orgId,
						status: 1,
						name: this.searchQuestionnaireText
					}
				}).then(res => {
					console.log(res)
					this.questionnaireInfo = res.data.data
					this.qList = res.data.data.records
					this.questionnaireList = this.qList.map(item => {
						return {
							...item,
							checked: false
						}
					})
					if (this.questionnaireInfo.current == this.questionnaireInfo.pages) {
						this.questionnaireStatus = 'noMore'
					} else if (this.questionnaireInfo.pages == 0) {
						this.questionnaireStatus = 'noMore'
					}
				})
			},
			searchActivity() {
				this.$http.get('qms/conference_publish/so_page', {
					params: {
						orgId: this.orgId,
						statusFlag: 1,
						name: this.searchActivityText
					}
				}).then(res => {
					// console.log(res)
					this.activityInfo = res.data.data
					this.aList = res.data.data.records
					this.activityList = this.aList.map(item => {
						return {
							...item,
							checked: false
						}
					})
					if (this.activityInfo.current == this.activityInfo.pages) {
						this.activityStatus = 'noMore'
					} else if (this.activityInfo.pages == 0) {
						this.activityStatus = 'noMore'
					}
				})
			},
			selectMaterial(e, item) {
				// console.log(item)
				// this.materialListOut=[]
				this.materialListOut = this.array.filter(item => {
					return item.type == 0
				})
				if (item.checked == false) {
					item.checked = true
					let list = { ...item,
						type: 0
					}
					this.materialListOut.push(list)
				} else {
					this.materialListOut = this.materialListOut.filter(item2 => {
						item.checked = false
						return item.id != item2.id
					})
				}
				this.array = this.array.filter(item => {
					return item.type != 0
				})
				console.log(this.array)
				this.array = [...this.array, ...this.materialListOut]
			},
			selectQuestionnaire(e, item) {
				// console.log(this.questionnaireList)
				console.log(item)
				// this.materialListOut=[]
				this.questionnaireListOut = this.array.filter(item => {
					return item.type == 1
				})
				if (item.checked == false) {
					item.checked = true
					let list = { ...item,
						type: 1
					}
					this.questionnaireListOut.push(list)
				} else {
					this.questionnaireListOut = this.questionnaireListOut.filter(item2 => {
						item.checked = false
						return item.id != item2.id
					})
				}
				this.array = this.array.filter(item => {
					return item.type != 1
				})
				this.array = [...this.array, ...this.questionnaireListOut]
			},
			selectActicity(e, item) {
				// console.log(this.activityList)
				console.log(item)
				// this.materialListOut=[]
				this.activityListOut = this.array.filter(item => {
					return item.type == 2
				})
				if (item.checked == false) {
					item.checked = true
					let list = { ...item,
						type: 2
					}
					this.activityListOut.push(list)
				} else {
					this.activityListOut = this.activityListOut.filter(item2 => {
						item.checked = false
						return item.id != item2.id
					})
				}
				this.array = this.array.filter(item => {
					return item.type != 2
				})
				this.array = [...this.array, ...this.activityListOut]
			},
			materialMore() {
				let that = this
				if (that.materialInfo.current < that.materialInfo.pages) {
					that.materialStatus = 'loading';
					that.$http.get('dms/material/so/page', {
						params: {
							materialLevelId: 0,
							orgId: that.orgId,
							materialName: that.searchMaterialText,
							current: that.materialInfo.current + 1
						}
					}).then(res => {
						// console.log(res)
						that.materialInfo.current = res.data.data.current;
						let list = res.data.data.records.map(item => {
							return {
								...item,
								checked: false
							}
						})
						that.array.forEach(item => {
							if (item.type == 0) {
								list.forEach(item2 => {
									if (item.id == item2.id) {
										item2.checked = true
									}
								})
							}
						})
						that.materialList = that.materialList.concat(list);
						that.materialStatus = 'more';
					});
				} else {
					that.materialStatus = 'noMore';
				}
			},
			questionnaireMore() {
				let that = this
				if (that.questionnaireInfo.current < that.questionnaireInfo.pages) {
					that.questionnaireStatus = 'loading';
					that.$http.get('qms/questionnaire/page_so', {
						params: {
							status: 1,
							orgId: that.orgId,
							name: that.searchQuestionnaireText,
							current: that.questionnaireInfo.current + 1
						}
					}).then(res => {
						// console.log(res)
						that.questionnaireInfo.current = res.data.data.current;
						let list = res.data.data.records.map(item => {
							return {
								...item,
								checked: false
							}
						})
						that.array.forEach(item => {
							if (item.type == 1) {
								list.forEach(item2 => {
									if (item.id == item2.id) {
										item2.checked = true
									}
								})
							}
						})
						that.questionnaireList = that.questionnaireList.concat(list);
						that.questionnaireStatus = 'more';
					});
				} else {
					that.questionnaireStatus = 'noMore';
				}
			},
			activityMore() {
				let that = this
				if (that.activityInfo.current < that.activityInfo.pages) {
					that.activityStatus = 'loading';
					that.$http.get('qms/conference_publish/so_page', {
						params: {
							orgId: that.orgId,
							statusFlag: 1,
							name: that.searchActivityText,
							current: that.activityInfo.current + 1
						}
					}).then(res => {
						// console.log(res)
						that.activityInfo.current = res.data.data.current;
						let list = res.data.data.records.map(item => {
							return {
								...item,
								checked: false
							}
						})
						that.array.forEach(item => {
							if (item.type == 2) {
								list.forEach(item2 => {
									if (item.id == item2.id) {
										item2.checked = true
									}
								})
							}
						})
						that.activityList = that.activityList.concat(list);
						that.activityStatus = 'more';
					});
				} else {
					that.activityStatus = 'noMore';
				}
			}
		}
	}
</script>

<style lang="scss">
	.contentWrap {
		display: flex;
		flex-direction: column;

		.wrapTitle {
			margin: 32rpx;
			padding: 20rpx 40rpx 0rpx;

			.title {
				width: 12rpx;
				height: 6rpx;
				border-radius: 3rpx;
				background-color: #F74437;
				margin: 10rpx auto;
			}
		}

		.searchInput {
			padding: 0rpx 32rpx;

			.wrapSearch {
				padding: 18rpx 32rpx;
				margin: 16rpx 0;
				border-radius: 60rpx;
				background-color: #F5f7f8;
				display: flex;
				flex-direction: row;
				align-items: center;

				.searchImg {
					height: 32rpx;
					width: 32rpx;
				}
			}
		}
	}

	.content {
		margin: 0 32rpx;
		border-bottom: 0.3rpx solid #EFF0F1;

		.contentInfo {
			padding: 30rpx 0;
			position: relative;

			.img {
				margin-right: 32rpx;
				width: 72rpx;
				height: 72rpx;
			}

			.contentDetail {
				width: 520rpx;

				.materialName {
					font-size: 28rpx;
					margin-bottom: 10rpx;
				}

				.count {
					font-size: 24rpx;

					.countRead {
						margin-right: 20rpx;

						.read {
							padding-right: 10rpx;
						}
					}

					.countLoad {
						.load {
							padding-right: 10rpx;
						}
					}
				}
			}

			.qusetionnaireName {
				font-size: 28rpx;
				line-height: 2;
			}

			.wrapJoin {
				margin: 30rpx 0;
				font-size: 24rpx;

				.img {
					width: 36rpx;
					height: 36rpx;
					padding-right: 10rpx;
				}

				.txt {
					padding-right: 10rpx
				}
			}

			.wrapTime {
				font-size: 20rpx;

				.title {
					padding-right: 10rpx;
				}

				.award {
					display: none;
					height: 44rpx;
					border-radius: 22rpx;
					background-color: rgba(247, 68, 55, .1);
					padding: 0 20rpx;

					.awardImg {
						width: 28rpx;
						height: 28rpx;
					}

					.awardNumber {
						font-size: 20rpx;
						padding-left: 10rpx;
					}
				}
			}

			.activityName {
				font-size: 32rpx;
				margin-bottom: 20rpx;
			}

			.wrapActivityTime {
				margin-bottom: 20rpx;
				font-size: 22rpx;

				.timeImg {
					width: 26rpx;
					height: 26rpx;
					padding-right: 16rpx;
				}
			}

			.wrapActivityField {
				font-size: 22rpx;

				.locationImg {
					width: 26rpx;
					height: 26rpx;
					padding-right: 16rpx;
				}
			}
		}
	}

	.btn {
		width: 100%;
		background-color: #FFFFFF;
		z-index: 666;
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.makeSure {
			width: 686rpx;
			margin: 24rpx 32rpx
		}
	}

	.active {
		color: #f74437;
		font-size: 36rpx;
		font-weight: bold;
	}

	.unactive {
		color: #919397;
		font-size: 28rpx;
		font-weight: normal;
	}

	.swiper-item {
		display: block;
		height: 100%;
		// line-height: 300rpx;
		text-align: center;
		background-color: #f4f5f6;
	}

	.select {
		transform: scale(0.7);
		margin-right: -12rpx;
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
</style>
