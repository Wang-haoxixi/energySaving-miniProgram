<template>
	<view class="container">
		<view class="interview-content">{{interviewInfo.content}}</view>
		<view class="recruit-info">
			<view class="org-info flexRow" @tap="toSoCard">
				<image class="org-avatar" :src="interviewInfo.orgAvatar"></image>
				<view class="org-name">{{interviewInfo.orgName}}</view>
				<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
			</view>
			<view class="recruit-info-line flexRow">
				<view class="title bold color_303031">时间</view>
				<view class="content color_919397">{{interviewInfo.invitationTime}}</view>
			</view>
			<view class="recruit-info-line flexRow">
				<view class="title bold color_303031">职位</view>
				<view class="content color_919397">{{getPosition(interviewInfo.recruitName)}}</view>
			</view>
			<view class="recruit-info-line flexRow" @tap="showLocation">
				<view class="title bold color_303031">地点</view>
				<view class="content color_919397">{{interviewInfo.address}}</view>
				<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
			</view>
		</view>
		<view v-if="interviewInfo.state == '0'" class="button-bottom-box flexRow safe-bottom">
			<view class="button-bottom reject" @tap="handleStatusChange(2)">拒绝</view>
			<view class="button-bottom confirm" @tap="handleStatusChange(1)">确认到场面试</view>
		</view>
		<view v-else class="status-area safe-bottom color_919397">{{interviewInfo.state == '1' ? '已接受' : '已拒绝'}}</view>
		<uni-popup ref="dialog" type="bottom">
			<view>
				<view class="popDialog">
					<view class="title">
						<image class="dialog-icon" :src="$ossUrl('icon_meetting_confirm.png')"></image>
						<text class="color_666769 title-word">是否{{handleState === 1 ? '确认到场面试' : '拒绝该面试'}}？</text>
					</view>
					<view class="flexRow">
						<view class="button cancel" @tap="cancelHandle">
							取消
						</view>
						<view class="button ok" @tap="statusChange">
							确定
						</view>
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
				interviewId: '',
				interviewInfo: {},
				handleState: ''
			};
		},
		onLoad ({interviewId}) {
			this.interviewId = interviewId
			this.$http.get(`dms/recruit/notice/get_details/${interviewId}`).then(({ data }) => {
				this.interviewInfo = data.data
			})
		},
		methods: {
			getPosition (recruitName) {
				if (recruitName) {
					return recruitName.substring(recruitName.lastIndexOf('-') + 1)
				}
				return ''
			},
			showLocation () {
				if (this.interviewInfo.latitude && this.interviewInfo.longitude) {
					uni.openLocation({
						latitude: this.interviewInfo.latitude,
						longitude: this.interviewInfo.longitude,
						address: this.interviewInfo.address
					})
				}
			},
			toSoCard() {
				if (this.interviewInfo.orgId) {
					uni.navigateTo({
						url: `/pages/find/soCard/soCard?id=${this.interviewInfo.orgId}`
					})
				}
			},
			handleStatusChange (state) {
				this.handleState = state
				this.$refs.dialog.open()
			},
			cancelHandle () {
				this.$refs.dialog.close()
			},
			statusChange () {
				this.$http.post('dms/recruit/notice/update_state', {
					id: this.interviewId,
					state: this.handleState
				}).then(({data}) => {
					if (data.code === 0) {
						this.statusChangeEmit(this.interviewId, this.handleState)
						this.interviewInfo.state = this.handleState
					}
				}).finally(() => {
					this.$refs.dialog.close()
				})
			},
			statusChangeEmit (id, state) {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('sateteChange', {id, state})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.interview-content {
			padding: 30rpx 40rpx;
		}
		.recruit-info {
			margin: 20rpx 40rpx 0;
			padding: 0 30rpx;
			border-radius: 30rpx;
			background-color: #F4F5F6;
			.org-info {
				height: 128rpx;
				border-bottom: 1rpx solid #E3E4E5;
				.org-avatar {
					height: 52rpx;
					width: 52rpx;
					flex: 52rpx 0 0;
				}
				.org-name {
					margin-left: 20rpx;
					height: 44rpx;
					flex: 200rpx 1 1;
					line-height: 44rpx;
					font-weight: bold;
					font-size: 32rpx;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.recruit-info-line {
				height: 88rpx;
				.title {
					display: inline-block;
					height: 40rpx;
					line-height: 40rpx;
				}
				.content {
					margin-left: 20rpx;
					height: 40rpx;
					line-height: 40rpx;
					flex: 200rpx 1 1;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.right-icon {
				height: 44rpx;
				width: 44rpx;
				flex: 44rpx 0 0;
				margin-left: 14rpx;
				margin-right: -16rpx;
			}
			
		}
		.button-bottom-box {
			padding: 0 40rpx;
			margin-top: 50rpx;
			.button-bottom {
				height: 88rpx;
				line-height: 88rpx;
				border-radius: 20rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: bold;
				&.reject {
					flex: 204rpx 0 0;
					position: relative;
					background-color: #FFFFFF;
					color: #F74437;
					&::after {
						content: '';
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						border: 1px solid #F74437;
						border-radius: 20rpx;
					}
				}
				&.confirm {
					flex: 438rpx 0 0;
					background-color: #F74437;
					color: #FFFFFF;
				}
			}
		}
		.status-area {
			margin-top: 50rpx;
			padding: 0 40rpx;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			font-size: 32rpx;
		}
		.popDialog {
			padding: 32rpx;
		
			.title {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				margin: 48rpx 0;
		
				.dialog-icon {
					height: 52rpx;
					width: 52rpx;
				}
		
				.title-word {
					margin-left: 20rpx;
					line-height: 52rpx;
				}
			}
		
			.flexRow {
				margin-top: 80rpx;
			}
		
			.button.cancel {
				flex: 40rpx 1 1;
				background: #F5f7f8;
				color: #565B5F;
			}
		
			.button.ok {
				margin-left: 20rpx;
				flex: 40rpx 1 1;
			}
		}
	}
</style>
