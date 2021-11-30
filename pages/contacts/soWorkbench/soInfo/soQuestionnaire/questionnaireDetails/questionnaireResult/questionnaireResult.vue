<template>
	<view>
		<view class="color_303031 bold title" v-if="status==0 || status==1 || status==2 || status==3">
			提交成功
		</view>
		<view class="color_303031 bold title" v-if="status==4 || status==5 || status==6">
			提交失败
		</view>
		<view class="content">
			<image class="img" v-if="status==0 ||status==1 || status==2 || status==3 && oss" :src="oss+'ican_questionnaireResult_success.png'"
			 mode="aspectFit"></image>
			<image class="img" v-if="status==4 || status==5 || status==6 && oss" :src="oss+'icon_questionnaireResult_fail.png'"
			 mode="aspectFit"></image>
			<view class="color_666769">
				<view class="contentWrap" v-if="status==1">
					<view>
						提交成功，感谢作答。
					</view>
					<view>
						恭喜您获得<text class="color_F74437 bold">{{awardNumber}}能贝</text>奖励
					</view>
				</view>
				<view class="contentWrap" v-if="status==2">
					<view>
						提交成功
					</view>
					<view>
						与能贝奖励只差一点，请继续努力。
					</view>
				</view>
				<view class="contentWrap" v-if="status==0 || status==3">
					<view>
						提交成功
					</view>
					<view>
						感谢您的作答
					</view>
				</view>
				<view class="contentWrap" v-if="status==4">
					<view>
						提交失败
					</view>
					<view>
						问卷日期截止
					</view>
				</view>
				<view class="contentWrap" v-if="status==5">
					<view>
						提交失败
					</view>
					<view>
						问卷已删除
					</view>
				</view>
				<view class="contentWrap" v-if="status==6">
					<view>
						提交失败
					</view>
					<view>
						网络异常或已答
					</view>
				</view>
			</view>
		</view>
		<button class="button" @click="goBack">返回</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				awardNumber: '',
				status: -1,
				content: '',
				code: -1,
				id: '',
				subStatus: '',
				oss: ''
			}
		},
		onLoad(options) {
			this.oss = this.$oss
			console.log(options)
			const {
				status,
				content,
				id,
				subStatus,
				awardNumber
			} = options
			// console.log(options)
			this.id = id
			this.subStatus = subStatus
			// console.log(this.subStatus)
			this.status = status
			this.content = content
			this.awardNumber = awardNumber
			if (this.content.split(',').length > 1) {
				this.code = 1
			} else if (this.content.split(',').length == 1) {
				this.code = 0
			}
		},
		onUnload() {},
		methods: {
			goBack() {
				if (this.status == 0 || this.status == 1 || this.status == 2 || this.status == 3) {
					uni.$emit('changeStatus', true)
				}
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		margin: 20rpx auto;
		font-size: 34rpx;
		text-align: center;
	}

	.content {
		margin: 0 auto;
		margin-top: 120rpx;
		margin-bottom: 60rpx;
		text-align: center;

		.img {
			margin-bottom: 40rpx;
			width: 150rpx;
			height: 150rpx;
		}

		.contentWrap {
			margin-bottom: 20rpx;
			font-size: 28rpx
		}
	}

	::v-deep button {
		width: 480rpx;
		// height: 72rpx;
		display: flex;
		justify-content: center;
	}
</style>
