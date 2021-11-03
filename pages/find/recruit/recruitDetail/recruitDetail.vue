<template>
	<view class="page" :class="{'close': data.state != 0}">
		<view class="container">
			<view class="position">
				<view class="name">
					{{$isEmpty(data.name) ? '' : data.name.split('-')[(data.name.split('-').length - 1)]}}
				</view>
				<view v-if="data.state != 0" class="bold">停止招聘</view>
				<view class="recommend" v-else-if="data.reward>0">
					<image v-if="oss" class="recommend-icon" :src="oss + 'icon_recommend.png'"></image>
					<text class="recommend-award">+{{data.reward}}贝</text>
				</view>
			</view>
			<view class="salary" v-if="data.type == 0">
				<view v-if="data.salaryStart==0 &&data.salaryEnd==0">面议</view>
				<view v-else>{{data.salaryStart}}K-{{data.salaryEnd}}K</view>
			</view>
			<view class="require">
				{{$isEmpty(data.workplace) ? '' : data.workplace}}
				{{$isEmpty(data.experience) ? '' : ' | '+data.experience}}
				{{$isEmpty(data.industry) ? '' : ' | '+data.industry}}
				{{$isEmpty(data.education) ? '' : ' | '+data.education}}
				{{$isEmpty(data.rednessDemand) ? '' : ' | 红度≥'+data.rednessDemand}}
			</view>
			<view class="support" v-if="data.type == 1">
				<image class="support-icon" :src="data.state == 0 ? $ossUrl('icon_guarantee.png') : $ossUrl('icon_guarantee_gray.png')"></image>
				<view class="support-tag-list">
					<text class="support-tag-item" v-for="(item,index) in data.welfareList" :key="index">
						{{item}}
					</text>
				</view>
			</view>
		</view>
		<view class="container flexRowStart" @tap="goCannerCard(data.createBy)">
			<view class="publisher-avatar">
				<image class="publisher-avatar" :src="data.avatar"></image>
			</view>
			<view class="publisher-main">
				<view class="publisher-info">
					<view class="publisher-name">
						{{$isEmpty(data.realName) ? '' :data.realName}}
						<text v-if="data.position">·{{data.position.substring(data.position.lastIndexOf('-') + 1)}}</text>
					</view>
					<view class="publisher-time">{{$isEmpty(data.dayDiff) ? '' :data.dayDiff}}</view>
				</view>
				<view class="publisher-other">
					发布者
				</view>
			</view>
			<image v-if="oss" :src="oss + 'icon_right_gray.png'" class="publisher-right"></image>
		</view>
		<template v-if="data.state == 0">
			<view class="container">
				<text class="subtitle" v-if="data.type==0">职位描述</text><text class="subtitle" v-if="data.type==1">具体描述</text><text
				 class="job-type" v-if="data.jobType">·{{$isEmpty(data.jobType) ? '' :data.jobType}}</text>
				<view class="tag">
					<view class="tag-text" v-for="(item,index) in data.tags" :key="index">{{item}}</view>
				</view>
				<view class="describe">
					<text class="color_666769 describe-text" v-if="!$isEmpty(data.describe)">
						{{data.describe}}
					</text>
				</view>
			</view>
			<view class="container margin0">
				<view class="flexRowStart margin20" @tap="goSoCard(data.orgId)">
					<view class="publisher-avatar">
						<image class="publisher-avatar" :src="imageError(data.soAvatar,oss)"></image>
					</view>
					<view class="publisher-main">
						<view class="publisher-info">
							<view class="publisher-name">{{$isEmpty(data.soName) ? '' :data.soName}}</view>
						</view>
						<view class="publisher-other">
							{{$isEmpty(data.slogan) ? '' :data.slogan}}
						</view>
					</view>
					<image v-if="oss" :src="oss + 'icon_right_gray.png'" class="publisher-right"></image>
				</view>
				<view class="tag" v-if="data.type==0">
					<view class="tag-text" v-for="(item,index) in data.welfareList" :key="index">{{item}}</view>
				</view>

				<view v-if="data.addressImg" class="address-image-box">
					<image class="address-image" :src="data.addressImg" @tap="showMap"></image>
				</view>
				<view class="other-positions" v-if="otherPositions.total>0">
					<view class="subtitle">该组织其他岗位</view>
					<view class="more" v-if="otherPositions.total > 0" @tap="morePosition">
						查看更多
					</view>
				</view>
				<scroll-view class="scroll-otherPositions" scroll-x="true" v-if="otherPositions.total>0">
					<view class="contentPositions">
						<view v-for="(item,index) in otherPositions.records" :key="index" class="position-item" @tap="toOtherRecruit(item)">
							<view class="position-item-main">
								<view class="positions-item-positions">
									{{item.name.split('-')[(item.name.split('-').length - 1)]}}
								</view>
								<view v-if="item.type==0">
									<view class="positions-item-salary" v-if="item.salaryStart==0 &&item.salaryEnd==0">面议</view>
									<view class="positions-item-salary" v-else>{{item.salaryStart}}K-{{item.salaryEnd}}K</view>
								</view>
							</view>
							<view class="position-item-other">
								<image class="positions-item-avatar" :src="item.avatar">
								</image>
								<view class="positions-item-name">
									{{item.realName}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="line"></view>
			<view class="similar-positions" v-if="similarPositions.total>0">
				<view class="subtitle">相似岗位</view>
				<recruit-item v-for="(item,index) in similarPositions.records" :key="index" :itemData="item"></recruit-item>
			</view>
			<bottom-button>
				<view class="bottom-item bottom-double">
					<view>
						<button class="noButton" open-type="share">
							<image v-if="oss" class="bottom-icon" :src="oss+ 'icon_share.png'" mode=""></image>
							<view class="bottom-text">
								分享
							</view>
						</button>
					</view>
					<view class="" @tap="favorite">
						<image v-if="oss && data.collect" class="bottom-icon" :src="oss+ 'icon_favorites.png'" mode=""></image>
						<image v-if="oss && data.collect==false" class="bottom-icon" :src="oss+ 'icon_favorited.png'" mode=""></image>
						<view class="bottom-text">
							收藏
						</view>
					</view>
				</view>
				<view class="bottom-item button border" @tap="progress">进步阶梯</view>
				<view class="bottom-item bottom-end button" :class="{unable: data.isDelivery == 1 || data.createBy == userId}" @tap="submitResumeConfirm">{{data.isDelivery == 1 ? '已投递' : '投递岗位'}}</view>
			</bottom-button>

		</template>
	</view>
</template>

<script>
	import bottomButton from '@/components/bottomButton/bottomButton.vue'
	import {
		goRecruit,
		goCannerCard,
		goSoCard,
		imageError
	} from '@/common/utils.js'
	export default {
		components: {
			bottomButton
		},
		data() {
			return {
				oss: '',
				data: '',
				progressId: '',
				otherPositions: '',
				similarPositions: '',
				userId: '',
			};
		},
		methods: {
			imageError,
			showMap() {
				if (this.data.latitude && this.data.longitude) {
					uni.openLocation({
						latitude: this.data.latitude,
						longitude: this.data.longitude,
						address: this.data.detailedAddress || '',
						name: this.data.detailedAddress || ''
					})
				}
				// console.log(e)
			},
			toOtherRecruit(recruit) {
				uni.navigateTo({
					url: `recruitDetail?id=${recruit.recruitId}`
				})
			},
			favorite() {
				if (this.data.collect) {
					this.$http.post('dms/collection/app/delete', {
						type: 7,
						targetIds: [this.data.recruitId]
					}).then(res => {
						if (res.data.data) {
							this.data.collect = false;
						}
					});
				} else {
					this.$http.post('dms/collection/create', {
						type: 7,
						targetId: this.data.recruitId,
						name: this.data.name
					}).then(res => {
						if (res.data.data) {
							this.data.collect = true;
						}
					});
				}
			},
			submitResumeConfirm() {
				if (this.data.isDelivery == 0 && this.data.createBy != this.userId) {
					let that = this;
					uni.showModal({
						content: '确认投递该岗位',
						confirmText: '投递',
						success: function(res) {
							if (res.confirm) {
								if (that.data.type == '0') {
									that.$http.get('dms/recruit/valid_integrity').then(res => {
										if (res.data.data) {
											that.submitResume();
										} else {
											uni.showModal({
												content: '您的个人信息尚未完善，完善后可提高申请成功率',
												cancelText: '去完善',
												confirmText: '直接投递',
												success: function(res) {
													if (res.confirm) {
														that.submitResume();
													} else if (res.cancel) {
														uni.navigateTo({
															url: '/pages/my/information/information'
														})
													}
												}
											});
										}
									})
								} else {
									that.submitResumePartner();
								}
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			},
			submitResume() {
				this.$http.post('dms/recruit_operation/delivery_position', {
					recruitId: this.data.recruitId
				}).then(res => {
					if (res.data.code === 0) {
						this.data.isDelivery = 1
					}
				})

			},
			submitResumePartner() {
				uni.navigateTo({
					url: `../recruitPartnerInfo/recruitPartnerInfo?recruitId=${this.data.recruitId}`
				})
			},
			deliverySuccess() {
				this.data.isDelivery = 1
			},
			progress() {
				uni.navigateTo({
					url: '/pages/contacts/soWorkbench/soInfo/soMaterial/soMaterial?orgId=' + this.progressId + '&ispProgress=true'
				})
			},
			goCannerCard,
			goSoCard,
			morePosition() {
				uni.navigateTo({
					url: `../morePosition/morePosition?orgId=${this.data.orgId}&soName=${this.data.soName}&soAvatar=${this.data.soAvatar}&slogan=${this.data.slogan}&recruitId=${this.data.recruitId}`
				})
			},
		},
		onLoad(option) {
			console.log(option)
			this.userId = uni.getStorageSync('user').userId
			this.oss = this.$oss;
			this.$http.get('admin/param/public_value_external/GDS_OPEN_MATERIALS_ORG').then(res => {
				this.progressId = res.data.data;
			})
			this.$http.get('dms/recruit_query/detail', {
				params: {
					recruitId: option.id,
				}
			}).then(res => {
				this.data = res.data.data;
				this.$http.get('dms/recruit_query/page_pc', {
					params: {
						type: this.data.type,
						orgId: this.data.orgId,
						recruitId: this.data.recruitId
					}
				}).then(res => {
					this.otherPositions = res.data.data;
				});
				this.$http.get('dms/recruit_query/similar', {
					params: {
						recruitId: this.data.recruitId,
						size: 5,
					}
				}).then(res => {
					this.similarPositions = res.data.data;
				});
			})
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'activity', //板块
				relationId: this.data.recruitId,
				// #ifdef  MP-WEIXIN
				markSource: 'recruit', //留痕来源
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
				console.log(res.target)
			}
			return {
				title: this.data.company + '正在招聘' + this.data.name.split('-')[(this.data.name.split('-').length - 1)],
				path: '/pages/find/recruit/recruitDetail/recruitDetail?id=' + this.data.recruitId
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save', {
				section: 'recruit', //板块
				relationId: this.data.recruitId,
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
				title: this.data.company + '正在招聘' + this.data.name.split('-')[(this.data.name.split('-').length - 1)],
			}
		},
	}
</script>

<style lang="scss" scoped>
	button::after {
		border: none;
		width: 44rpx;
	}

	.margin0 {
		margin: 0 !important;
		border-bottom: none !important;

		.tag {
			padding: 0 40rpx;
		}
	}

	.noButton {
		line-height: 40rpx;
		color: #303031;
		background-color: #FFFFFF;
		padding: 0;
		position: static;
		display: inline;
		border: none
	}

	.bottom-item {
		display: flex;
		flex: 1;
		justify-content: space-between;
		margin-right: 30rpx;
		align-items: center;

		.button {
			justify-content: center;
		}

		.border {
			color: #F74437;
			background-color: #FFFFFF;
			border: 1px solid #F74437;
		}

		.bottom-icon {
			width: 44rpx;
			height: 44rpx;
		}

		.bottom-text {
			color: #303031;
			line-height: 28rpx;
			font-size: 20rpx;
		}

		&.unable {
			background-color: #AAAAAA;
			color: #FFFFFF;
		}
	}

	.bottom-double {
		padding-left: 20rpx;
		padding-right: 40rpx;
	}

	.bottom-end {
		margin: 0;
	}

	.margin20 {
		margin: 0 40rpx !important;
	}

	.page {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		&.close {
			view {
				color: #919397 !important;
			}
		}
		.subtitle {
			color: #303031;
			font-size: 32rpx;
			line-height: 44rpx;
			font-weight: bold;
		}

		.tag {
			display: flex;
			flex-wrap: wrap;

			.tag-text {
				color: #666769;
				font-size: 20rpx;
				line-height: 28rpx;
				padding: 4rpx 10rpx;
				background-color: #F4F5F6;
				margin-right: 20rpx;
				margin-top: 20rpx;
				border-radius: 6rpx;
			}
		}

		.container {
			border-bottom: 0.3rpx solid #EFF0F1;
			padding: 40rpx 0;
			margin: 0 40rpx;

			.position {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.name {
					font-size: 36rpx;
					font-weight: bold;
					line-height: 50rpx;
				}

				.recommend {
					display: flex;
					align-items: center;

					.recommend-icon {
						width: 36rpx;
						height: 36rpx;
					}

					.recommend-award {
						color: #2F80FF;
						font-weight: bold;
						font-size: 20rpx;
						line-height: 28rpx;
						margin-left: 10rpx;
					}
				}
			}

			.salary {
				margin-top: 20rpx;
				line-height: 42rpx;
				font-size: 36rpx;
				color: #F74437;
				font-weight: bold;
			}

			.require {
				margin-top: 20rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #666769;
			}

			.support {
				margin-top: 20rpx;
				display: flex;
				align-items: flex-start;
				justify-content: flex-start;
				.support-icon {
					margin-right: 10rpx;
					width: 30rpx;
					height: 34rpx;
					flex: 34rpx 0 0;
				}

				.support-tag-list {
					flex: 200rpx 1 10;
					line-height: 34rpx;
					font-size: 0;
					.support-tag-item {
						vertical-align: middle;
						line-height: 34rpx;
						color: #666769;
						font-size: 24rpx;
						&:not(:last-child) {
							&::after {
								content: ' · ';
								vertical-align: middle;
								width: 30rpx;
								text-align: center;
							}
						}
					}
				}
				
			}

			.publisher-avatar {
				width: 76rpx;
				height: 76rpx;
				border-radius: 20rpx;
			}

			.publisher-main {
				margin-left: 20rpx;
				flex: 1;

				.publisher-info {
					display: flex;
					align-items: center;

					.publisher-name {
						font-size: 28rpx;
						color: #303031;
						line-height: 40rpx;
						font-weight: bold;
					}

					.publisher-time {
						margin-left: 10rpx;
						color: #BABEC0;
						font-size: 22rpx;
						line-height: 32rpx;
					}
				}

				.publisher-other {
					margin-top: 10rpx;
					color: #919397;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			.publisher-right {
				width: 44rpx;
				height: 44rpx;
				margin-right: -16rpx;
			}

			.other-positions {
				margin: 40rpx 40rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.more {
					color: #2F80FF;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			.address-image-box {
				margin-top: 40rpx;
				padding: 0 40rpx;
				border-radius: 30rpx;

				.address-image {
					width: 100%;
				}
			}

			.scroll-otherPositions {
				margin-top: 40rpx;
				display: flex;

				.contentPositions {
					display: flex;
					padding: 0 40rpx;

					.position-item {
						width: 446rpx;
						height: 132rpx;
						background-color: #F4F5F6;
						border-radius: 20rpx;
						padding: 20rpx;
						margin-right: 30rpx;

						.position-item-main {
							width: 406rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;

							.positions-item-positions {
								color: #303031;
								font-size: 28rpx;
								line-height: 40rpx;
								font-weight: bold;
							}

							.positions-item-salary {
								color: #F74437;
								font-size: 28rpx;
								line-height: 32rpx;
								font-weight: bold;
							}
						}

						.position-item-other {
							margin-top: 40rpx;
							display: flex;
							align-items: center;

							.positions-item-avatar {
								width: 52rpx;
								height: 52rpx;
							}

							.positions-item-name {
								color: #303031;
								font-size: 28rpx;
								font-weight: bold;
								line-height: 40rpx;
								margin-left: 20rpx;
							}
						}
					}
				}
			}
		}

		.line {
			margin: 0 40rpx;
			height: 1px;
			background-color: #EFF0F1;
		}

		.similar-positions {
			margin: 0;
			padding: 40rpx 0 152rpx;

			.subtitle {
				margin-left: 40rpx;
			}
		}

		.job-type {
			color: #919397;
			font-size: 28rpx;
			line-height: 44rpx;
		}

		.describe {
			margin-top: 20rpx;

			.describe-text {
				font-size: 28rpx;
				line-height: 48rpx;
			}
		}
	}
</style>
