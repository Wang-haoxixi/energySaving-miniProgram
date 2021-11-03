<template>
	<view class="container">
		<view class="org-info flexRow" @tap="toSoCard(info.orgId)">
			<image class="avatar" :src="avatarValid(info.soAvatar) || $ossUrl('ic_main_main_normal.png')"></image>
			<view class="name-desc">
				<view class="org-name color_303031 bold">{{info.soName}}</view>
				<view class="org-desc color_919397">{{info.slogan}}</view>
			</view>
			<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
		</view>
		<view>
			<recruit-item v-for="itemData in recruitList" :key="itemData.recruitId" :itemData="itemData"></recruit-item>
			<uni-load-more v-if="moreShow" :status="loadMoreStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {
		avatarValid
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				info: {},
				recruitList: [],
				page: {
					current: 1,
					size: 20,
				},
				loadMoreStatus: 'more',
				moreShow: false,
				filter: false,
			}
		},
		onLoad(info) {
			this.info = info
			this.getData()
		},
		onReachBottom () {
			if (this.loadMoreStatus == 'more') {
				this.page.current = this.page.current + 1
				this.getData()
			}
		},
		methods: {
			getData () {
				this.loadMoreStatus = 'loading'
				this.$http.get('dms/recruit_query/page_pc', {
					params: {
						type: 0,
						orgId: this.info.orgId,
						recruitId: this.info.recruitId,
						...this.page
					}
				}).then(({data}) => {
					if (data.code === 0) {
						// if (!this.filter) {
						// 	for (let i = 0; i < data.data.records.length; i++) {
						// 		if (data.data.records[i].recruitId == this.info.recruitId) {
						// 			data.data.records.splice(i, 1)
						// 			this.filter = true
						// 			break
						// 		}
						// 	}
						// }
						this.recruitList = [...this.recruitList, ...data.data.records]
						if (this.page.current < data.data.pages) {
							this.loadMoreStatus = 'more'
						} else {
							this.loadMoreStatus = 'noMore'
						}
						if (data.data.total > 0) {
							this.moreShow = true
						}
					}
				})
			},
			toSoCard() {
				uni.navigateTo({
					url: `/pages/find/soCard/soCard?id=${this.info.orgId}`
				})
			},
			avatarValid(avatar) {
				return avatarValid(avatar)
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.org-info {
			margin: 0 40rpx;
			height: 164rpx;
			border-bottom: 1px solid #EFF0F1;

			.avatar {
				height: 76rpx;
				flex: 76rpx 0 0;
				border-radius: 20rpx;
			}

			.name-desc {
				margin-left: 20rpx;
				height: 84rpx;
				flex: 200rpx 1 1;

				.org-name {
					height: 40rpx;
					line-height: 40rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.org-desc {
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

		.content-box {
			padding: 0 40rpx;
		}
	}
</style>
