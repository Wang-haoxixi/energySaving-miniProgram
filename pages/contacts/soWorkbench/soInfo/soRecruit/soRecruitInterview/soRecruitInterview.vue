<template>
	<view class="safe-bottom">
		<view v-for="(interviewDay, timeLabel) in interviewData" :key="timeLabel" class="interview-days">
			<view class="interview-days-date">
				<text>{{timeLabel}}</text>
			</view>
			<interview-item v-for="(item, index) in interviewDay" :key="index" :itemData="item" @tap="toCannerCard(item.receiveId)"></interview-item>
		</view>
	</view>
</template>

<script>
	import interviewItem from './interviewItem/interviewItem.vue'
	export default {
		components: {
			interviewItem
		},
		data() {
			return {
				orgId: '',
				interviewList: []
			};
		},
		onLoad ({orgId}) {
			this.orgId = orgId;
			this.getInterviewList();
		},
		computed: {
			interviewData () {
				if (this.interviewList && this.interviewList.length > 0) {
					let interviewData = {}
					for (let i = 0; i < this.interviewList.length; i++) {
						let key = this.interviewList[i].timeLabel
						if (key) {
							if (!interviewData.hasOwnProperty(key)) {
								interviewData[key] = []
							}
							interviewData[key].push(this.interviewList[i])
						}
					}
					console.log(interviewData)
					return interviewData
				}
				return {}
			}
		},
		methods: {
			getInterviewList () {
				this.$http.get(`dms/recruit/notice/get_invitation_so/${this.orgId}`, {
					params: {
						...this.page
					}
				}).then(({data}) => {
					this.interviewList = data.data.records
				})
			},
			toCannerCard (userId) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${userId}&fromRecruit=true`
				})
			}
		}
	}
</script>

<style lang="scss">
.interview-days {
	padding: 0 40rpx;
	border-bottom: 10rpx solid #F8F8F9;
	.interview-days-date {
		position: sticky;
		top: 0;
		padding: 20rpx 0;
		background-color: #FFFFFF;
		text {
			padding: 8rpx 20rpx;
			border-radius: 25rpx;
			background-color: #F4F5F6;
			line-height: 34rpx;
			font-size: 24rpx;
			color: #919397;
		}
	}
}
</style>
