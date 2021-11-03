<template>
	<view class="container safe-bottom">
		<view v-for="recruit in recruitList" :key="recruit.recruitId" class="recruit-item" @tap="invite(recruit)">{{recruit.name}}</view>
		<uni-load-more v-if="moreShow" :status="moreStatus"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orgId: '',
				userId: '',
				userName: '',
				recruitList: [],
				page: {
					current: 1,
					size: 40,
				},
				moreShow: false,
				moreStatus: 'more'
			};
		},
		onLoad ({userId, userName, orgId}) {
			this.userId = userId
			this.userName = userName
			this.orgId = orgId
			this.getRecruitList()
		},
		onReachBottom () {
			if (this.moreStatus == 'more') {
				this.page.current = this.page.current + 1
				this.getRecruitList()
			}
		},
		methods: {
			getRecruitList () {
				this.moreStatus = 'loading'
				this.$http.get('dms/recruit/so_recruit', {
					params: {
						orgId: this.orgId,
						state: 0,
						...this.page
					}
				}).then(({data}) => {
					if (data.code === 0) {
						this.moreShow = true
						if (this.page.current === 1) {
							this.recruitList = data.data.records
						} else {
							this.recruitList = this.recruitList.concat(data.data.records)
						}
						if (this.page.current < data.data.pages) {
							this.moreStatus = 'more'
						} else {
							this.moreStatus = 'noMore'
						}
					}
				})
			},
			invite (recruit) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soRecruit/soRecruitNotice/soRecruitNotice?orgId=${this.orgId}&receiveId=${this.userId}&receiveName=${this.userName}&recruitId=${recruit.recruitId}&recruitName=${recruit.name}`
				})
			}
		}
	}
</script>

<style lang="scss">
.container {
		padding: 0 40rpx;
		.recruit-item {
			height: 92rpx;
			line-height: 92rpx;
			color: #919397;
			font-size: 28rpx;
			border-bottom: 1rpx solid #EFF0F1;
			.label {
				color: #2F80FF;
			}
		}
	}
</style>
