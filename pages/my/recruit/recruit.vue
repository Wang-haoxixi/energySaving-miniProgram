<template>
	<view>
		<view class="search-title" id="top">
			<view class="wrap-title flexRow" @tap="titleClick">
				<view class="title" :class="[{ active: item_id == 0 }, { 'not-read': allRead }]" data-type="0">已投递</view>
				<view class="title" :class="[{ active: item_id == 1 }, { 'not-read': checkRead }]" data-type="1">被查看</view>
				<view class="title" :class="[{ active: item_id == 2 }, { 'not-read': rejectRead }]" data-type="2">不合适</view>
				<view class="title" :class="[{ active: item_id == 3 }, { 'not-read': interviewRead }]" data-type="3">面试邀请</view>
			</view>
			<!-- <image class="del-icon" v-if="oss" :src="oss+ 'icon_delect.png'"></image> -->
		</view>
		<swiper circular @change="swiperChange" observer observerParents :current-item-id="item_id" ref="swiper" :style="{height: swiperHeight + 'px'}">
			<swiper-item item-id="0">
				<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="more">
					<recruit-item v-for="(item,index) in all.records" :key="index" :itemData="item" @tap="detail(item)"></recruit-item>
					<image class="emptyImg" v-if="!all.records.length > 0 && oss" :src="oss+'pic_noPosition.png'" mode="aspectFit"></image>
					<uni-load-more :status="allStatus" v-if="all.records.length>0"></uni-load-more>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="1">
				<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="more">
					<recruit-item v-for="(item,index) in check.records" :key="index" :itemData="item" @tap="detail(item)"></recruit-item>
					<image class="emptyImg" v-if="!check.records.length > 0 && oss" :src="oss+'pic_noPosition.png'" mode="aspectFit"></image>
					<uni-load-more :status="checkStatus" v-if="all.records.length>0"></uni-load-more>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="2">
				<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="more">
					<recruit-item v-for="(item,index) in reject.records" :key="index" :itemData="item" @tap="detail(item)"></recruit-item>
					<image class="emptyImg" v-if="!reject.records.length > 0 && oss" :src="oss+'pic_noPosition.png'" mode="aspectFit"></image>
					<uni-load-more :status="rejectStatus" v-if="all.records.length>0"></uni-load-more>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="3">
				<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="more">
					<view class="interview-days" v-for="(interview, timeLabel) in interviewData" :key="timeLabel">
						<view class="interview-days-date">
							<text>{{timeLabel}}</text>
						</view>
						<interview-item v-for="(item, index) in interview" :key="index" :itemData="item" @tap="toInterviewDetail(item.id)"></interview-item>
					</view>
					<image v-if="!interview.records.length > 0 && oss" :src="oss + 'pic_nothing_show.png'" mode="aspectFit" style="width: 100%;"></image>
					<uni-load-more :status="interviewStatus"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		recruitItem
	} from './recruitItem/recruitItem.vue';
	import { interviewItem } from './recruitItem/interviewItem.vue'
	export default {
		components: {
			recruitItem,
			interviewItem
		},
		data() {
			return {
				oss: this.$oss,
				item_id: 0,
				swiperHeight: 0,
				all: {},
				check: {},
				reject: {},
				interview: {},
				allStatus: '',
				checkStatus: '',
				rejectStatus: '',
				interviewStatus: '',
			};
		},
		computed: {
			allRead () {
				if (this.all.records) {
					let records = this.all.records
					for (let i = 0; i < records.length; i++) {
						if (records[i].isRead == 0) {
							return true
						}
					}
					return false
				}
				return false
			},
			checkRead () {
				if (this.check.records) {
					let records = this.check.records
					for (let i = 0; i < records.length; i++) {
						if (records[i].isRead == 0) {
							return true
						}
					}
					return false
				}
			},
			rejectRead () {
				if (this.reject.records) {
					let records = this.reject.records
					for (let i = 0; i < records.length; i++) {
						if (records[i].isRead == 0) {
							return true
						}
					}
					return false
				}
			},
			interviewRead () {
				if (this.interview.records) {
					let records = this.interview.records
					for (let i = 0; i < records.length; i++) {
						if (records[i].isRead == 0) {
							return true
						}
					}
					return false
				}
			},
			interviewData () {
				if (this.interview.records && this.interview.records.length > 0) {
					let interviewData = {}
					let records = this.interview.records
					for (let i = 0; i < records.length; i++) {
						let key = records[i].timeLabel
						if (!interviewData.hasOwnProperty(key)) {
							interviewData[key] = []
						}
						interviewData[key].push(records[i])
					}
					return interviewData
				}
				return {}
			}
		},
		methods: {
			detail(itemData) {
				this.all.records.forEach(item => {
					if (item.applyId === itemData.applyId && item.type === itemData.type) {
						item.isRead = "1";
					}
				})
				this.check.records.forEach(item => {
					if (item.applyId === itemData.applyId && item.type === itemData.type) {
						item.isRead = "1";
					}
				})
				this.reject.records.forEach(item => {
					if (item.applyId === itemData.applyId && item.type === itemData.type) {
						item.isRead = "1";
					}
				})
				if (itemData.isRead == "0") {
					this.$http.post('dms/recruit_operation/read', {
						applyId: itemData.applyId,
						type: itemData.type
					})
				}
			},
			swiperChange(e) {
				this.item_id = e.detail.current
			},
			titleClick (event) {
				if (event.target.dataset.type) {
					this.item_id = event.target.dataset.type
				}
			},
			getInterview (current = 1) {
				this.$http.get('dms/recruit/notice/get_invitation_my', {
					params: {
						current: current,
						size: 20,
						type: '0'
					}
				}).then(({ data }) => {
					if (current > 1) {
						this.interview.current = data.data.current;
						this.interview.records = this.interview.records.concat(data.data.records);
						this.interviewStatus = 'more';
					} else {
						this.interview = data.data;
						if (!(this.interview.current < this.interview.pages)) {
							this.interviewStatus = 'noMore';
						}
					}
				})
			},
			getData(type, current) {
				this.$http.get('dms/recruit_query/my_apply', {
					params: {
						type: type,
						current: current,
						size: 20,
					}
				}).then(res => {
					if (type == 'all') {
						if (current > 1) {
							this.all.current = res.data.data.current;
							res.data.data.records.forEach(item => {
								item.avatar = imageError(item.avatar, this.oss)
							})
							this.all.records = this.all.records.concat(res.data.data.records);
							this.allStatus = 'more';
						} else {
							this.all = res.data.data;
							if (!(this.all.current < this.all.pages)) {
								this.allStatus = 'noMore';
							}
						}
					} else if (type == 'check') {
						if (current > 1) {
							this.check.current = res.data.data.current;
							res.data.data.records.forEach(item => {
								item.avatar = imageError(item.avatar, this.oss)
							})
							this.check.records = this.check.records.concat(res.data.data.records);
							this.checkStatus = 'more';
						} else {
							this.check = res.data.data;
							if (!(this.check.current < this.check.pages)) {
								this.checkStatus = 'noMore';
							}
						}
					} else if (type == 'reject') {
						if (current > 1) {
							this.reject.current = res.data.data.current;
							res.data.data.records.forEach(item => {
								item.avatar = imageError(item.avatar, this.oss)
							})
							this.reject.records = this.reject.records.concat(res.data.data.records);
							this.rejectStatus = 'more';
						} else {
							this.reject = res.data.data;
							if (!(this.reject.current < this.reject.pages)) {
								this.rejectStatus = 'noMore';
							}
						}
					}
				})
			},
			more() {
				if (this.item_id == 0) {
					let that = this;
					if (that.all.current < that.all.pages) {
						that.allStatus = 'loading';
						that.getData('all', that.all.current + 1)
					} else {
						that.allStatus = 'noMore';
					}
				} else if (this.item_id == 1) {
					let that = this;
					if (that.check.current < that.check.pages) {
						that.checkStatus = 'loading';
						that.getData('check', that.check.current + 1)
					} else {
						that.checkStatus = 'noMore';
					}
				} else if (this.item_id == 2) {
					let that = this;
					if (that.reject.current < that.reject.pages) {
						that.rejectStatus = 'loading';
						that.getData('reject', that.reject.current + 1)
					} else {
						that.rejectStatus = 'noMore';
					}
				} else if (this.item_id == 3) {
					let that = this;
					if (that.interview.current < that.interview.pages) {
						that.interviewStatus = 'loading';
						that.getInterview(that.interview.current + 1)
					} else {
						that.interviewStatus = 'noMore';
					}
				}
			},
			toInterviewDetail (id) {
				uni.navigateTo({
					url: `../recruitInterviewDetail/recruitInterviewDetail?interviewId=${id}`,
					events: {
						sateteChange: ({id, state}) => {
							console.log(this.interview.records)
							let records = this.interview.records
							for (let i = 0; i < records.length; i++) {
								if (records[i].id == id) {
									records[i].state = state
									break
								}
							}
						}
					}
				})
			}
		},
		onLoad() {
			uni.createSelectorQuery()
				.in(this)
				.select('#top')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height;
				});
			this.getData('all', 1);
			this.getData('check', 1);
			this.getData('reject', 1);
			this.getInterview()
		},
	}
</script>

<style lang="scss">
	.tag-point {
		height: 12rpx;
		width: 12rpx;
		background-color: #F74437;
		border-radius: 12rpx;
		margin: -12rpx -12rpx 0 0;
	}

	.search-title {
		padding: 30rpx 40rpx 0;

		.wrap-title {

			.title {
				position: relative;
				font-weight: bold;
				padding-bottom: 16rpx;
				line-height: 44rpx;
				text-align: center;
				font-size: 32rpx;
				color: #919397;
				display: flex;

				&.active {
					color: #f74437;
					&::before {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						margin-left: -6rpx;
						width: 12rpx;
						height: 6rpx;
						border-radius: 3rpx;
						background-color: #F74437;
					}
				}
				&.not-read {
					&::after {
						content: '';
						position: absolute;
						right: -12rpx;
						top: -12rpx;
						height: 12rpx;
						width: 12rpx;
						background-color: #F74437;
						border-radius: 12rpx;
					}
				}
			}
		}

		.del-icon {
			width: 44rpx;
			height: 44rpx;
		}
	}

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
