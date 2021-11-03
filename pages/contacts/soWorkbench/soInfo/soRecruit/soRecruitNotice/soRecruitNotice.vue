<template>
	<view class="container safe-bottom">
		<view id="so-recruit-notice-top">
			<!-- <view class="wrap-line flexRow">
				<view class="wrap-line-title color_303031">模板类型</view>
				<view class="wrap-line-content">
					<view class="notice-type" :class="{'choice': type === 0}" @tap="typeChange(0)">面试通知</view>
					<view class="notice-type" :class="{'choice': type === 1}" style="margin-left: 20rpx;" @tap="typeChange(1)">其他</view>
				</view>
			</view> -->
			<view class="wrap-line flexRow" @tap="toChooseModel">
				<view class="wrap-line-title color_303031">模板名称</view>
				<view class="wrap-line-content">
					<view class="model-choose">
						<view class="model-title color_919397">{{modelTitle}}</view>
						<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
					</view>
				</view>
			</view>
			<view class="wrap-line flexRow">
				<view class="wrap-line-title color_303031">收件人</view>
				<view class="wrap-line-content">
					<text class="notice-receivename color_919397">{{receiveName}}</text>
				</view>
			</view>
			<view class="wrap-line flexRow">
				<view class="wrap-line-title color_303031">标题</view>
				<view class="wrap-line-content">
					<input class="notice-theme" v-model="theme" />
				</view>
			</view>
		</view>
		<view class="content-area" :style="{height: contentHeight + 'px'}">
			<view class="content-title color_303031">正文</view>
			<textarea class="content"
				v-model="content"
				placeholder="请输入通知内容"
				placeholder-class="content-placeholder"
				auto-height/>
		</view>
		<view v-show="type === 0">
			<view class="wrap-line flexRow" style="border-bottom-style: none">
				<view class="wrap-line-title color_303031">附带信息</view>
			</view>
			<view class="interview-info">
				<view class="interview-info-item flexRow">
					<view class="interview-info-item-title color_303031">职位</view>
					<view class="interview-info-item-content color_919397">{{recruitName.substring(recruitName.lastIndexOf('-') + 1)}}</view>
				</view>
				<view class="interview-info-item flexRow" @tap="toChooseTime">
					<view class="interview-info-item-title color_303031">时间</view>
					<view class="interview-info-item-content color_919397">{{invitationTime || '请输入'}}</view>
					<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
				</view>
				<view class="interview-info-item flexRow" @tap="toChooseAddress">
					<view class="interview-info-item-title color_303031">地点</view>
					<view class="interview-info-item-content color_919397">{{address || '请选择'}}</view>
					<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
				</view>
			</view>
		</view>
		<view class="button-bottom-box">
			<view class='safe-bottom'>
				<view class="button-bottom" @click="sendNotice">发送</view>
			</view>
		</view>
		<mx-date-picker-time format="yyyy-mm-dd hh:ii:ss" :show="picker.show" type="datetime" :value="invitationTime" :show-tips="true" :show-seconds="true" :time-range="picker.timeRange" @confirm="chooseTime" @cancel="timeCancel"/>
	</view>
</template>

<script>
	import MxDatePickerTime from "@/components/mx-datepicker/mx-datepicker-time.vue";
	export default {
		components: {
			MxDatePickerTime
		},
		data() {
			return {
				receiveId: '',
				orgId: '',
				type: 0,
				modelId: '',
				modelTitle: '',
				receiveName: '',
				theme: '',
				content: '',
				recruitId: '',
				recruitName: '',
				invitationTime: '',
				address: '',
				latitude: '',
				longitude: '',
				defaultModel: {},
				picker: {
					show: false,
					timeRange: [],
				}
			};
		},
		onLoad(options) {
			this.orgId = options.orgId
			this.receiveId = options.receiveId
			this.receiveName = options.receiveName
			this.recruitId = options.recruitId
			this.recruitName = options.recruitName
			this.$http.get('admin/dict/type/RECRUIT_TIME').then(({data}) => {
				this.picker.timeRange = data.data
			})
			this.$http.get(`/dms/recruit/mail/get_by_so/${this.orgId}`, {
				params: {
					orgId: 0
				}
			}).then(({data}) => {
				if (data.code === 0 && data.data && data.data.length > 0 && this.type === 0) {
					this.defaultModel = data.data[0]
					this.modelId = data.data[0].id
					this.modelTitle = data.data[0].name
					this.theme = data.data[0].theme
					this.content = data.data[0].content
				}
			})
			uni.$on('model-choice', (model) => {
				this.modelId = model.id
				this.modelTitle = model.name
				this.content = model.content
				this.theme = model.theme
			})
		},
		onUnload () {
			uni.$off('model-choice')
		},
		methods: {
			typeChange (type) {
				this.type = type
				this.initData()
			},
			initData () {
				if (this.type === 0) {
					this.modelId = this.defaultModel.id || ''
					this.modelTitle = this.defaultModel.name || ''
					this.theme = this.defaultModel.theme || ''
					this.content = this.defaultModel.content
					this.invitationTime = ''
					this.address = ''
					this.latitude = ''
					this.longitude = ''
				} else {
					this.modelId = ''
					this.modelTitle = ''
					this.theme = ''
					this.content = ''
					this.invitationTime = ''
					this.address = ''
					this.latitude = ''
					this.longitude = ''
				}
			},
			toChooseModel () {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soRecruit/soRecruitNoticeModel/soRecruitNoticeModel?orgId=${this.orgId}&modelId=${this.modelId}&type=${this.type}`
				})
			},
			toChooseTime () {
				this.picker.show = true
			},
			chooseTime (data) {
				console.log(data)
				this.invitationTime = data.value
				this.picker.show = false
			},
			timeCancel () {
				this.picker.show = false
			},
			toChooseAddress () {
				uni.getSetting({
					success: (res) => {
						
						if (!res || !res.authSetting || !res.authSetting.hasOwnProperty('scope.userLocation')) {
							// 未设置过权限
							uni.authorize({
								scope: 'scope.userLocation',
								success: () => {
									uni.chooseLocation({
									    success: (res) => {
											this.address = res.address + res.name
											this.latitude = res.latitude
											this.longitude = res.longitude
									    }
									});
								}
							})
						} else if (!res.authSetting['scope.userLocation']) {
							// 设置过权限且拒绝
							uni.showModal({
								title: '小程序将使用位置信息，是否前往设置？',
								success: ({confirm}) => {
									console.log(confirm)
									if (confirm) {
										uni.openSetting()
									}
								}
							})
						} else {
							// 设置过权限且同意
							uni.chooseLocation({
							    success: (res) => {
									this.address = res.address + res.name
									this.latitude = res.latitude
									this.longitude = res.longitude
							    }
							});
						}
					}
				})
			},
			sendNotice () {
				if (this.content.trim()) {
					this.$http.post('dms/recruit/notice/send', {
						receiveId: this.receiveId,
						orgId: this.orgId,
						type: this.type,
						theme: this.theme,
						content: this.content,
						recruitId: this.recruitId,
						invitationTime: this.invitationTime,
						address: this.address,
						latitude: this.latitude,
						longitude: this.longitude,
					}).then(({ data }) => {
						if (data.code === 0) {
							uni.showToast({
								icon: 'none',
								title: '已发送'
							})
							uni.navigateBack()
						}
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请输入通知内容！'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.wrap-line {
			height: 108rpx;
			padding: 0 40rpx;
			border-bottom: 1rpx solid #EFF0F1;
			.wrap-line-title {
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				font-weight: bold;
			}
			.wrap-line-content {
				
				.model-choose {
					margin-right: -16rpx;
					line-height: 44rpx;
					font-size: 0;
					.model-title {
						display: inline-block;
						vertical-align: middle;
						line-height: 40rpx;
						font-size: 28rpx;
					}
					.right-icon {
						margin-left: 2rpx;
						vertical-align: middle;
						height: 44rpx;
						width: 44rpx;
					}
				}
				.notice-type {
					display: inline-block;
					padding: 8rpx 20rpx;
					height: 34rpx;
					line-height: 34rpx;
					border-radius: 25rpx;
					background-color: #F4F5F6;
					font-size: 24rpx;
					color: #919397;
					&.choice {
						background-color: #FEECEA;
						color: #F74437;
					}
				}
				.notice-theme {
					height: 40rpx;
					line-height: 40rpx;
					text-align: right;
					font-size: 28rpx;
					color: #919397;
				}
				.notice-receivename {
					font-size: 28rpx;
				}
			}
		}
		.content-area {
			padding: 30rpx 40rpx;
			border-bottom: 1rpx solid #EFF0F1;
			.content-title {
				height: 40rpx;
				line-height: 40rpx;
			}
			.content {
				margin-top: 30rpx;
				width: 100%;
				height: 144rpx;
				line-height: 48rpx;
				font-size: 28rpx;
			}
			.content-placeholder {
				line-height: 48rpx;
				color: #BABEC0;
			}
		}
		.interview-info {
			padding: 0 30rpx;
			margin: 0 40rpx;
			border-radius: 30rpx;
			background-color: #F4F5F6;
			.interview-info-item {
				height: 88rpx;
				font-size: 28rpx;
				.interview-info-item-title {
					display: inline-block;
					height: 40rpx;
					line-height: 40rpx;
					font-weight: bold;
				}
				.interview-info-item-content {
					margin-left: 20rpx;
					height: 40rpx;
					line-height: 40rpx;
					flex: 200rpx 1 1;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.right-icon {
					margin-left: 14rpx;
					margin-right: -16rpx;
					height: 44rpx;
					width: 44rpx;
				}
			}
		}
		.button-bottom-box {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 20rpx 40rpx;
			.button-bottom {
				height: 72rpx;
				line-height: 72rpx;
				background-color: #F74437;
				border-radius: 20rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				font-weight: bold;
				text-align: center;
			}
		}
	}
</style>
