<template>
	<view class="container">
		<view class="user-info flexRow" @tap="toCannerCard(userInfo.userId)">
			<image class="avatar" :src="avatarValid(userInfo.avatar) || $ossUrl('ic_main_main_normal.png')"></image>
			<view class="name-list">
				<view class="user-name color_303031 bold">{{userInfo.realName}}</view>
				<view class="org-name color_919397">{{userInfo.soName}}</view>
			</view>
			<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
		</view>
		<view class="content color_666769">{{text}}</view>
	</view>
</template>

<script>
	import { avatarValid } from '@/common/utils.js'
	export default {
		data () {
			return {
				userInfo: {
					avatar: ''
				},
				text: '',
			}
		},
		onLoad({infoId, text}) {
			this.text = text
			this.$http.get(`dms/recruit/publisher_info/${infoId}`).then(({data}) => {
				if (data.code === 0) {
					this.userInfo = data.data
				}
			})
		},
		methods: {
			toCannerCard (userId) {
				if (userId) {
					uni.navigateTo({
						url: `/pages/find/cannerCard/cannerCard?id=${userId}`
					})
				}
			},
			avatarValid (url) {
				return avatarValid(url)
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.user-info {
			margin: 0 40rpx;
			height: 164rpx;
			border-bottom: 1px solid #EFF0F1;
			.avatar {
				height: 76rpx;
				flex: 76rpx 0 0;
				border-radius: 20rpx;
			}
			.name-list {
				margin-left: 20rpx;
				height: 84rpx;
				flex: 200rpx 1 1;
				.user-name {
					height: 40rpx;
					line-height: 40rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.org-name {
					margin-top: 10rpx;
					height: 34rpx;
					line-height: 34rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.right-icon {
				height: 44rpx;
				flex: 44rpx 0 0;
				margin-right: -16rpx;
			}
		}
		.content {
			padding: 40rpx;
			line-height: 48rpx;
			font-size: 28rpx;
		}
	}
</style>
