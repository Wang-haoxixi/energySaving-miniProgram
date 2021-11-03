<template>
	<view class="container">
		<view class="" style="padding: 20rpx 0rpx;" id="title">
			<view class="flexRow title">
				<view class="title-item" :class="{ item_active: type == 'underway' }" @tap="showUnderway">
					<view class="flexColumn">
						<view class="" style="margin-bottom: 10rpx;">
							进行中{{$isEmpty(countFor)?'0': countFor}}
						</view>
						<view class="titleLine" v-if="type=='underway'"></view>
					</view>
				</view>
				<view class="title-item" :class="{ item_active: type == 'over' }" @tap="showOver">
					<view class="flexColumn">
						<view class="" style="margin-bottom: 10rpx;">
							已逾期{{$isEmpty(countOver)?'0':countOver}}
						</view>
						<view class="titleLine" v-if="type=='over'"></view>
					</view>
				</view>
				<view class="title-item" :class="{ item_active: type == 'finished' }" @tap="showFinished">
					<view class="flexColumn">
						<view class="" style="margin-bottom: 10rpx;">
							已完成{{$isEmpty(countFinish)?'0':countFinish}}
						</view>
						<view class="titleLine" v-if="type=='finished'"></view>
					</view>
				</view>
				<view class="title-item" :class="{ item_active: type == 'closed' }" @tap="showClosed">
					<view class="flexColumn">
						<view class="" style="margin-bottom: 10rpx;">
							已关闭{{$isEmpty(countClose)?'0':countClose}}
						</view>
						<view class="titleLine" v-if="type=='closed'"></view>
					</view>
				</view>
			</view>
			<view class="flexRow" style="padding: 0 20rpx;">
				<view class="flexRowStart search" @tap='goSearch'>
					<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
					<input placeholder="搜索" placeholder-class="inputDefault" disabled="true"></input>
				</view>
				<view class="flexRowStart">
					<image v-if="oss" :src="oss+'icon_add.png'" mode="" style="width: 44rpx;height: 44rpx;" @tap="createTask"></image>
					<image v-if="oss" :src="oss+'icon_taskDetails_taskActions.png'" mode="" style="width: 44rpx;height: 44rpx;margin-left: 20rpx;"
					 @tap='showActions'></image>
				</view>
			</view>
		</view>
		<swiper circular @change="swiperChange" style="flex: 1;" observer observerParents :current-item-id="type" ref="swiper"
		 :style="{height: swiperHeight + 'px'}">
			<swiper-item item-id="underway">
				<scroll-view scroll-y="true" :style="{height: swiperHeight + 'px'}" style="width:670rpx;padding: 0 20rpx;"
				 @scrolltolower='underwayMore'>
					<view v-for="(item,index) of underwayList.records" :key="index" @tap.stop="goTaskDetail(item)" class="containerItem flexRow">
						<view class="flexRowStart" style="flex: 1;min-width: 0;">
							<image class="topMark" v-if="oss && item.isTop==1" :src="oss+'icon_taskList_topMark.png'"></image>
							<view style="margin-right: 30rpx;">
								<Your_Exios-Circle :size="15" :percent="item.plan" :direction="180" circleWidth="2" :circleColor="item.taskState==2?'#666769':'#32CDA5'">
									<image class="img" slot="content" v-show="item.taskState==1 && oss" :src="oss+'icon_ican_checked.png'" mode="aspectFit"></image>
									<image class="img" slot="content" v-show="item.taskState==2 && oss" :src="oss+'icon_ican_closed.png'" mode="aspectFit"></image>
								</Your_Exios-Circle>
							</view>
							<view class="wrap" style="flex: 1;min-width: 0rpx;">
								<view class="flexRowStart" style="flex: 1;min-width: 0rpx;">
									<image v-if="item.isOfficial!=0 && oss" :src="oss+'icon_taskList_official.png'" style="width: 60rpx;height: 32rpx;margin-right: 10rpx;"></image>
									<image v-if="oss && item.allocationType!=0" :src="oss+'pic_taskList_reward.png'" style="width: 36rpx;height: 36rpx;margin-right: 6rpx;"></image>
									<view style="flex: 1;min-width: 0;" class="singleEllipsis bold titleInfo" :class="item.taskState==1||item.taskState==2?'active':'unactive'">
										{{$isEmpty(item.title)?'':item.title}}
									</view>
								</view>
								<view class="color_919397 flexRowStart wrapFinishTime">
									<view class="urgencyStatus flexRowStart" v-if="item.urgency==1 || item.urgency==2">
										<!-- <image v-if="oss" :src="oss+'pic_taskList_urgency.png'" style="width: 28rpx;height: 28rpx;margin-right: 4rpx;"></image> -->
										<view class="color_F74437" v-if="item.urgency==1">紧急</view>
										<view class="color_F74437" v-if="item.urgency==2">非常紧急</view>
									</view>
									<view class="" v-if="item.type==0">
										<view class="color_F74437" v-if="item.expires">{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
										<view v-else>{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
									</view>
									<view class="" v-else>
										<view class="">
											已重复{{$isEmpty(item.repeatTime)?'0':item.repeatTime}}次
										</view>
									</view>
								</view>
							</view>
						</view>
						<image :src="imageError(item.avatar,$oss)" class="imgAvatar">
						</image>
						<view v-if="item.haveRead==0" class="readMark">
						</view>
					</view>
					<image class="emptyImg" v-if="!underwayList.records.length>0 &&oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
					<uni-load-more :status="underwayStatus" v-if="underwayList.records.length>0"></uni-load-more>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="over">
				<scroll-view scroll-y="true" :style="{height: swiperHeight + 'px'}" style="width: 670rpx;padding: 0 20rpx;"
				 @scrolltolower='overMore'>
					<view v-for="(item,index) of overList.records" :key="index" @tap.stop="goTaskDetail(item)" class="containerItem flexRow">
						<view class="flexRowStart" style="flex: 1;min-width: 0;">
							<image class="topMark" v-if="oss && item.isTop==1" :src="oss+'icon_taskList_topMark.png'"></image>
							<view style="margin-right: 30rpx;">
								<Your_Exios-Circle :size="15" :percent="item.plan" :direction="180" circleWidth="2" :circleColor="item.taskState==2?'#666769':'#32CDA5'">
									<image class="img" slot="content" v-show="item.taskState==1 && oss" :src="oss+'icon_ican_checked.png'" mode="aspectFit"></image>
									<image class="img" slot="content" v-show="item.taskState==2 && oss" :src="oss+'icon_ican_closed.png'" mode="aspectFit"></image>
								</Your_Exios-Circle>
							</view>
							<view class="wrap" style="flex: 1;min-width: 0rpx;">
								<view class="flexRowStart" style="flex: 1;min-width: 0rpx;">
									<image v-if="item.isOfficial!=0 && oss" :src="oss+'icon_taskList_official.png'" style="width: 60rpx;height: 32rpx;margin-right: 10rpx;"></image>
									<image v-if="oss && item.allocationType!=0" :src="oss+'pic_taskList_reward.png'" style="width: 36rpx;height: 36rpx;margin-right: 6rpx;"></image>
									<view style="flex: 1;min-width: 0;" class="singleEllipsis bold titleInfo" :class="item.taskState==1||item.taskState==2?'active':'unactive'">
										{{$isEmpty(item.title)?'':item.title}}
									</view>
								</view>
								<view class="color_919397 flexRowStart wrapFinishTime">
									<view class="urgencyStatus flexRowStart" v-if="item.urgency==1 || item.urgency==2">
										<!-- <image v-if="oss" :src="oss+'pic_taskList_urgency.png'" style="width: 28rpx;height: 28rpx;margin-right: 4rpx;"></image> -->
										<view class="color_F74437" v-if="item.urgency==1">紧急</view>
										<view class="color_F74437" v-if="item.urgency==2">非常紧急</view>
									</view>
									<view class="" v-if="item.type==0">
										<view class="color_F74437" v-if="item.expires">{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
										<view v-else>{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
									</view>
									<view class="" v-else>
										<view class="">
											已重复{{$isEmpty(item.repeatTime)?'0':item.repeatTime}}次
										</view>
									</view>
								</view>
							</view>
						</view>
						<image :src="imageError(item.avatar,$oss)" class="imgAvatar">
						</image>
						<view v-if="item.haveRead==0" class="readMark">
						</view>
					</view>
					<image class="emptyImg" v-if="!overList.records.length>0 &&oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
					<uni-load-more :status="overStatus" v-if="overList.records.length>0"></uni-load-more>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="finished">
				<scroll-view scroll-y="true" :style="{height: swiperHeight + 'px'}" style="width:670rpx;padding: 0 20rpx;"
				 @scrolltolower='finishedMore'>
					<view v-for="(item,index) of finishedList.records" :key="index" @tap.stop="goTaskDetail(item)" class="containerItem flexRow">
						<view class="flexRowStart" style="flex: 1;min-width: 0;">
							<image class="topMark" v-if="oss && item.isTop==1" :src="oss+'icon_taskList_topMark.png'"></image>
							<view style="margin-right: 30rpx;">
								<Your_Exios-Circle :size="15" :percent="item.plan" :direction="180" circleWidth="2" :circleColor="item.taskState==2?'#666769':'#32CDA5'">
									<image class="img" slot="content" v-show="item.taskState==1 && oss" :src="oss+'icon_ican_checked.png'" mode="aspectFit"></image>
									<image class="img" slot="content" v-show="item.taskState==2 && oss" :src="oss+'icon_ican_closed.png'" mode="aspectFit"></image>
								</Your_Exios-Circle>
							</view>
							<view class="wrap" style="flex: 1;min-width: 0rpx;">
								<view class="flexRowStart" style="flex: 1;min-width: 0rpx;">
									<image v-if="item.isOfficial!=0 && oss" :src="oss+'icon_taskList_official.png'" style="width: 60rpx;height: 32rpx;margin-right: 10rpx;"></image>
									<image v-if="oss && item.allocationType!=0" :src="oss+'pic_taskList_reward.png'" style="width: 36rpx;height: 36rpx;margin-right: 6rpx;"></image>
									<view style="flex: 1;min-width: 0;" class="singleEllipsis bold titleInfo" :class="item.taskState==1||item.taskState==2?'active':'unactive'">
										{{$isEmpty(item.title)?'':item.title}}
									</view>
								</view>
								<view class="color_919397 flexRowStart wrapFinishTime">
									<view class="urgencyStatus flexRowStart" v-if="item.urgency==1 || item.urgency==2">
										<!-- <image v-if="oss" :src="oss+'pic_taskList_urgency.png'" style="width: 28rpx;height: 28rpx;margin-right: 4rpx;"></image> -->
										<view class="color_F74437" v-if="item.urgency==1">紧急</view>
										<view class="color_F74437" v-if="item.urgency==2">非常紧急</view>
									</view>
									<view class="" v-if="item.type==0">
										<view class="color_F74437" v-if="item.expires">{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
										<view v-else>{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
									</view>
									<view class="" v-else>
										<view class="">
											已重复{{$isEmpty(item.repeatTime)?'0':item.repeatTime}}次
										</view>
									</view>
								</view>
							</view>
						</view>
						<image :src=" imageError(item.avatar,$oss)" class="imgAvatar">
						</image>
						<view v-if="item.haveRead==0" class="readMark">
						</view>
					</view>
					<image class="emptyImg" v-if="!finishedList.records.length>0 &&oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
					<uni-load-more :status="finishedStatus" v-if="finishedList.records.length>0"></uni-load-more>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="closed">
				<scroll-view scroll-y="true" :style="{height: swiperHeight + 'px'}" style="width: 670rpx;padding: 0 20rpx;"
				 @scrolltolower='closedMore'>
					<view v-for="(item,index) of closedList.records" :key="index" @tap.stop="goTaskDetail(item)" class="containerItem flexRow">
						<view class="flexRowStart" style="flex: 1;min-width: 0;">
							<image class="topMark" v-if="oss && item.isTop==1" :src="oss+'icon_taskList_topMark.png'"></image>
							<view style="margin-right: 30rpx;">
								<Your_Exios-Circle :size="15" :percent="item.plan" :direction="180" circleWidth="2" :circleColor="item.taskState==2?'#666769':'#32CDA5'">
									<image class="img" slot="content" v-show="item.taskState==1 && oss" :src="oss+'icon_ican_checked.png'" mode="aspectFit"></image>
									<image class="img" slot="content" v-show="item.taskState==2 && oss" :src="oss+'icon_ican_closed.png'" mode="aspectFit"></image>
								</Your_Exios-Circle>
							</view>
							<view class="wrap" style="flex: 1;min-width: 0rpx;">
								<view class="flexRowStart" style="flex: 1;min-width: 0rpx;">
									<image v-if="item.isOfficial!=0 && oss" :src="oss+'icon_taskList_official.png'" style="width: 60rpx;height: 32rpx;margin-right: 10rpx;"></image>
									<image v-if="oss && item.allocationType!=0" :src="oss+'pic_taskList_reward.png'" style="width: 36rpx;height: 36rpx;margin-right: 6rpx;"></image>
									<view style="flex: 1;min-width: 0;" class="singleEllipsis bold titleInfo" :class="item.taskState==1||item.taskState==2?'active':'unactive'">
										{{$isEmpty(item.title)?'':item.title}}
									</view>
								</view>
								<view class="color_919397 flexRowStart wrapFinishTime">
									<view class="urgencyStatus flexRowStart" v-if="item.urgency==1 || item.urgency==2">
										<!-- <image v-if="oss" :src="oss+'pic_taskList_urgency.png'" style="width: 28rpx;height: 28rpx;margin-right: 4rpx;"></image> -->
										<view class="color_F74437" v-if="item.urgency==1">紧急</view>
										<view class="color_F74437" v-if="item.urgency==2">非常紧急</view>
									</view>
									<view class="" v-if="item.type==0">
										<view class="color_F74437" v-if="item.expires">{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
										<view v-else>{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
									</view>
									<view class="" v-else>
										<view class="">
											已重复{{$isEmpty(item.repeatTime)?'0':item.repeatTime}}次
										</view>
									</view>
								</view>
							</view>
						</view>
						<image :src="imageError(item.avatar,$oss)" class="imgAvatar">
						</image>
						<view v-if="item.haveRead==0" class="readMark">
						</view>
					</view>
					<image class="emptyImg" v-if="!closedList.records.length>0 &&oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
					<uni-load-more :status="closedStatus" v-if="closedList.records.length>0"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		imageError,
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				swiperHeight: 0,
				oss: '',
				item_id: 0,
				userId: '',
				type: 'underway',
				orgId: '',
				underwayList: {},
				underwayStatus: 'more',
				finishedList: {},
				finishedStatus: 'more',
				closedList: {},
				closedStatus: 'more',
				overList: {},
				overStatus: 'more',
				countFor: 0,
				countOver: 0,
				countFinish: 0,
				countClose: 0,
				create: 0,
				name: '',
				isAdmin: ''
			};
		},
		onLoad(options) {
			const {
				orgId,
				name,
				isAdmin
			} = options
			this.orgId = orgId
			this.name = name
			this.isAdmin = isAdmin
			this.oss = this.$oss;
			this.userId = uni.getStorageSync('userinfo').user_id
			uni.createSelectorQuery()
				.in(this)
				.select('#title')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height
				});
		},
		onShow() {
			this.refreshUnderway()
			this.refreshOver()
			this.refreshFinished()
			this.refreshClosed()
		},
		methods: {
			imageError,
			showActions() {
				let that = this
				uni.showActionSheet({
					itemList: ['全部任务', '我发起的', '我收到的'],
					itemColor: '#303031',
					success: function(res) {
						// console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if (res.tapIndex == 0) {
							that.create = 0
							that.refreshUnderway()
							that.refreshOver()
							that.refreshFinished()
							that.refreshClosed()
						} else if (res.tapIndex == 1) {
							that.create = 1
							that.refreshUnderway()
							that.refreshOver()
							that.refreshFinished()
							that.refreshClosed()
						} else if (res.tapIndex == 2) {
							that.create = 2
							that.refreshUnderway()
							that.refreshOver()
							that.refreshFinished()
							that.refreshClosed()
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			goSearch() {
				uni.navigateTo({
					url: `/pages/ican/searchTask/searchTask?orgId=${this.orgId}`
				})
			},
			createTask() {
				uni.navigateTo({
					url: `/pages/ican/createTask/createTask?orgId=${this.orgId}&name=${this.name}&isAdmin=${this.isAdmin}`
				})
			},
			goTaskDetail(item) {
				// console.log(item)
				uni.navigateTo({
					url: `/pages/ican/taskDetail/taskDetail?taskId=${item.id}`
				})
			},
			underwayMore() {
				if (this.underwayList.current < this.underwayList.pages) {
					this.$http.get('qms/cooperation_list/my_task_state_page', {
						params: {
							orgId: this.orgId,
							create: this.create,
							state: 0,
							size: 10,
							current: this.underwayList.current + 1
						}
					}).then(res => {
						console.log(res)
						this.underwayList.current = res.data.data.current
						this.underwayList.records = this.underwayList.records.concat(res.data.data.records.map(item => {
							var index = item.finishTime.lastIndexOf(":");
							item.finishTime = item.finishTime.substring(0, index)
							return {
								...item,
								finishTime: item.finishTime
							}
						}))
						this.underwayStatus = 'more'
					});
				} else {
					this.underwayStatus = 'noMore'
				}
			},
			overMore() {
				if (this.overList.current < this.overList.pages) {
					this.$http.get('qms/cooperation_list/my_task_state_page', {
						params: {
							orgId: this.orgId,
							create: this.create,
							state: 5,
							size: 10,
							current: this.overList.current + 1
						}
					}).then(res => {
						console.log(res)
						this.overList.current = res.data.data.current
						this.overList.records = this.overList.records.concat(res.data.data.records.map(item => {
							var index = item.finishTime.lastIndexOf(":");
							item.finishTime = item.finishTime.substring(0, index)
							return {
								...item,
								finishTime: item.finishTime
							}
						}))
						this.overStatus = 'more'
					});
				} else {
					this.overStatus = 'noMore'
				}
			},
			finishedMore() {
				if (this.finishedList.current < this.finishedList.pages) {
					this.$http.get('qms/cooperation_list/my_task_state_page', {
						params: {
							orgId: this.orgId,
							create: this.create,
							state: 1,
							size: 10,
							current: this.finishedList.current + 1
						}
					}).then(res => {
						console.log(res)
						this.finishedList.current = res.data.data.current
						this.finishedList.records = this.finishedList.records.concat(res.data.data.records.map(item => {
							var index = item.finishTime.lastIndexOf(":");
							item.finishTime = item.finishTime.substring(0, index)
							return {
								...item,
								finishTime: item.finishTime
							}
						}))
						this.finishedStatus = 'more'
					});
				} else {
					this.finishedStatus = 'noMore'
				}
			},
			closedMore() {
				if (this.closedList.current < this.closedList.pages) {
					this.$http.get('qms/cooperation_list/my_task_state_page', {
						params: {
							orgId: this.orgId,
							create: this.create,
							state: 2,
							size: 10,
							current: this.closedList.current + 1
						}
					}).then(res => {
						console.log(res)
						this.closedList.current = res.data.data.current
						this.closedList.records = this.closedList.records.concat(res.data.data.records.map(item => {
							var index = item.finishTime.lastIndexOf(":");
							item.finishTime = item.finishTime.substring(0, index)
							return {
								...item,
								finishTime: item.finishTime
							}
						}))
						this.closedStatus = 'more'
					});
				} else {
					this.closedStatus = 'noMore'
				}
			},
			swiperChange(e) {
				console.log(e)
				this.type = e.detail.currentItemId
			},
			showUnderway() {
				this.type = 'underway'
			},
			showOver() {
				this.type = 'over'
			},
			showFinished() {
				this.type = 'finished'
			},
			showClosed() {
				this.type = 'closed'
			},
			refreshUnderway() {
				this.$http.get('qms/cooperation_list/my_task_state_page', {
					params: {
						orgId: this.orgId,
						create: this.create,
						state: 0,
						size: 10,
					}
				}).then(res => {
					// console.log(res)
					this.underwayList = res.data.data
					this.countFor = this.underwayList.total
					this.underwayList.records = this.underwayList.records.map(item => {
						var index = item.finishTime.lastIndexOf(":");
						item.finishTime = item.finishTime.substring(0, index)
						return {
							...item,
							finishTime: item.finishTime
						}
					})
					if (this.underwayList.current == this.underwayList.pages) {
						this.underwayStatus = 'noMore'
					} else if (this.underwayList.pages == 0) {
						this.underwayStatus = 'noMore'
					}
				});
			},
			refreshOver() {
				this.$http.get('qms/cooperation_list/my_task_state_page', {
					params: {
						orgId: this.orgId,
						create: this.create,
						state: 5,
						size: 10,
					}
				}).then(res => {
					// console.log(res)
					this.overList = res.data.data
					this.countOver = this.overList.total
					this.overList.records = this.overList.records.map(item => {
						var index = item.finishTime.lastIndexOf(":");
						item.finishTime = item.finishTime.substring(0, index)
						return {
							...item,
							finishTime: item.finishTime
						}
					});
					if (this.overList.current == this.overList.pages) {
						this.overStatus = 'noMore'
					} else if (this.overList.pages == 0) {
						this.overStatus = 'noMore'
					}
				});
			},
			refreshFinished() {
				this.$http.get('qms/cooperation_list/my_task_state_page', {
					params: {
						orgId: this.orgId,
						create: this.create,
						state: 1,
						size: 10,
					}
				}).then(res => {
					// console.log(res)
					this.finishedList = res.data.data
					this.countFinish = this.finishedList.total
					this.finishedList.records = this.finishedList.records.map(item => {
						var index = item.finishTime.lastIndexOf(":");
						item.finishTime = item.finishTime.substring(0, index)
						return {
							...item,
							finishTime: item.finishTime
						}
					});
					if (this.finishedList.current == this.finishedList.pages) {
						this.finishedStatus = 'noMore'
					} else if (this.finishedList.pages == 0) {
						this.finishedStatus = 'noMore'
					}
				});
			},
			refreshClosed() {
				this.$http.get('qms/cooperation_list/my_task_state_page', {
					params: {
						orgId: this.orgId,
						create: this.create,
						state: 2,
						size: 10,
					}
				}).then(res => {
					// console.log(res)
					this.closedList = res.data.data
					this.countClose = this.closedList.total
					this.closedList.records = this.closedList.records.map(item => {
						var index = item.finishTime.lastIndexOf(":");
						item.finishTime = item.finishTime.substring(0, index)
						return {
							...item,
							finishTime: item.finishTime
						}
					});
					if (this.closedList.current == this.closedList.pages) {
						this.closedStatus = 'noMore'
					} else if (this.closedList.pages == 0) {
						this.closedStatus = 'noMore'
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		flex: 1;
		margin-right: 40rpx;
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #F5f7f8;

		.searchImg {
			height: 32rpx;
			width: 32rpx;
			margin-right: 16rpx;
		}
	}

	.active {
		color: #919397
	}

	.unactive {
		color: #303031;
	}

	.container {
		padding: 0 20rpx;
	}

	.containerItem {
		position: relative;
		border-radius: 30rpx;
		padding: 30rpx;
		background-color: #F4F5F6;
		margin-bottom: 30rpx;
	}

	.wrap {
		flex: 1;

		.titleInfo {
			flex: 1;
			font-size: 28rpx;
		}

		.wrapFinishTime {
			font-size: 20rpx;
			font-weight: 400;
			padding-top: 12rpx;

			.urgencyStatus {
				font-size: 20rpx;
				line-height: 28rpx;
				margin-right: 30rpx;
			}

			.line {
				font-size: 18rpx;
				margin-right: 20rpx;
				margin-left: 20rpx;
			}
		}
	}

	.imgAvatar {
		width: 92rpx;
		height: 92rpx;
		border-radius: 50%;
	}

	.readMark {
		width: 16rpx;
		height: 16rpx;
		background-color: #F74437;
		border-radius: 50%;
		position: absolute;
		right: 34rpx;
		top: 28rpx;
	}

	.topMark {
		width: 60rpx;
		height: 32rpx;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
	}

	.title {
		padding-bottom: 20rpx;

		.title-item {
			flex: 1;
			text-align: center;
			font-size: 28rpx;
			line-height: 50rpx;
			color: #919397;

			&.item_active {
				font-size: 36rpx;
				line-height: 50rpx;
				font-weight: bold;
				color: #F74437;
			}

			.titleLine {
				width: 12rpx;
				height: 6rpx;
				border-radius: 3rpx;
				background-color: #F74437;
			}
		}
	}
</style>
