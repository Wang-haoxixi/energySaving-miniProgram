<template>
	<view class="container safe-bottom">
		<scroll-view scroll-y :style="{height: swiperHeight + 'px'}">
			<view v-for="(item, index) in experienceList" :key="index" class="experience-item" @tap="editExperience(item)">
				<view class="name-delete flexRow">
					<view class="experience-name color_303031 singleEllipsis">{{item.school}}</view>
					<image class="delete-icon" :src="$ossUrl('icon_delect.png')" @tap.stop="deleteExperience(item)"></image>
				</view>
				<view class="label-list">
					<view class="label-item">{{firstLabel(item)}}</view>
					<view class="label-item">{{secondLabel(item)}}</view>
				</view>
				<textarea class="content" auto-height disabled :value="item.describe"></textarea>
			</view>
		</scroll-view>
		<view class="bottom-button-box safe-bottom">
			<view class="botton-button-list">
				<view class="button" style="width: 100%;" @tap="toAdd">添加</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperHeight: 0,
				experienceList: []
			};
		},
		onLoad () {
			this.experienceList = uni.getStorageSync('educationExperience')
			uni.createSelectorQuery()
				.select('.bottom-button-box')
				.boundingClientRect(this)
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height
				})
		},
		methods: {
			firstLabel (experience) {
				let label = experience.education || ''
				if (experience.content) {
					label += label ? ` · ${experience.content}` : experience.content
				}
				return label
			},
			secondLabel (experience) {
				let startTime = experience.starTime.replace(/-/g, '.')
				let endTime = experience.endTime.replace(/-/g, '.')
				return `${startTime}-${endTime}`
			},
			toAdd () {
				uni.removeStorageSync('educationExperienceEdit')
				uni.navigateTo({
					url: './educationExperienceEdit',
					events: {
						update: (data) => {
							this.experienceList = data
							uni.setStorageSync('educationExperience', data)
							const eventChannel = this.getOpenerEventChannel()
							eventChannel.emit('updateExperience', data)
						}
					}
				})
			},
			editExperience (experience) {
				uni.setStorageSync('educationExperienceEdit', experience)
				uni.navigateTo({
					url: './educationExperienceEdit',
					events: {
						update: (data) => {
							this.experienceList = data
							uni.setStorageSync('educationExperience', data)
							const eventChannel = this.getOpenerEventChannel()
							eventChannel.emit('updateExperience', data)
						}
					}
				})
			},
			deleteExperience (experience) {
				this.$http.post(`admin/app/delete/experience?id=${experience.id}&type=1`).then(({data}) => {
					if (data.code === 0) {
						uni.showToast({
							icon: 'none',
							title: '删除成功'
						})
						this.experienceList = data.data.learningSituation
						uni.setStorageSync('educationExperience', data.data.learningSituation)
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('update', data.data)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.experience-item {
			margin: 0 32rpx;
			padding: 32rpx 0;
			border-bottom: 1rpx solid #EFF0F1;
			.name-delete {
				height: 44rpx;
				.experience-name {
					height: 44rpx;
					flex: 200rpx 1 1;
					line-height: 44rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
				.delete-icon {
					height: 44rpx;
					width: 44rpx;
					flex: 44rpx 0 0;
				}
			}
			.label-list {
				margin-left: - 20rpx;
				.label-item {
					display: inline-block;
					position: relative;
					margin-top: 20rpx;
					margin: 20rpx 0 0 20rpx;
					padding-right: 20rpx;
					height: 34rpx;
					line-height: 34rpx;
					color: #919397;
					font-size: 24rpx;
					&:not(:last-child)::after {
						content: '';
						position: absolute;
						right: 0;
						top: 6rpx;
						bottom: 6rpx;
						border-left: 2rpx solid #E3E4E5;
					}
				}
			}
			.content {
				margin-top: 40rpx;
				font-size: 28rpx;
				color: #666769;
				min-height: 48rpx;
				line-height: 48rpx;
			}
		}
		.bottom-button-box {
			.botton-button-list {
				padding: 24rpx 32rpx;
		
				.bottom-button {
					height: 72rpx;
					line-height: 72rpx;
					border-radius: 20rpx;
					background-color: #F74437;
					color: #FFFFFF;
					font-size: 32rpx;
					font-weight: bold;
					text-align: center;
				}
			}
		
		}
	}
</style>
