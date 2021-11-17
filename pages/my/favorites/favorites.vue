<template>
	<view class="container">
		<view class="flexRowStart title" id="title">
			<view class="title-item" :class="{ item_active: type == 'magicBox' }" @tap="showMagicBox">
				服务
			</view>
		<!-- 	<view class="title-item" :class="{ item_active: type == 'recruit' }" @tap="showRecruit">
				能聘
			</view> -->
			<view class="title-item" :class="{ item_active: type == 'material' }" @tap="showMaterial">
				材料
			</view>
			<view class="title-item" :class="{ item_active: type == 'article' }" @tap="showArticle">
				文章
			</view>
			<view class="title-item" :class="{ item_active: type == 'activity' }" @tap="showActivity">
				活动
			</view>
		</view>
		<swiper circular @change="swiperChange" style="flex: 1;" observer observerParents :current-item-id="type" ref="swiper"
		 :style="{height: swiperHeight + 'px'}">
			<swiper-item item-id="magicBox">
				<scroll-view style="height: 100%;" :scroll-top="30" scroll-y="true" @scrolltolower="magicBoxMore">
					<view @tap="goMagicBox(item)" @longpress="cancelAttention(item)" v-for="(item, index) in magicBoxList.records"
					 :key="index" class="canner-item">
						<image lazy-load="true" class="avatar" :src="soImageError(item.imageUrl,$oss)"></image>
						<view class="item-content">
							<view class="item-content-start">
								<view class="flexRow" style="width: 100%;">
									<view class="item-content-name singleEllipsis bold">{{$isEmpty(item.name)?'':item.name}}</view>
									<view class="official" v-if="item.isOfficial==1">
										<image v-if="oss" class="icon" :src="oss+'icon_official_mini.png'"></image>官方认证
									</view>
								</view>
								<view class="item-content-tag flexRowStart" style="width: 100%;">
									<view class="item-content-tag-item color_919397" v-for="(item2,index2) of item.tagKeywords" :key="index2" v-if="index2<3"> {{$isEmpty(item2)?'':item2}}</view>
								</view>
								<view class="item-content-score color_F74437 flexRow" style="width: 100%; margin-top: 16rpx;font-size: 24rpx;line-height: 34rpx;">
									<view class="" v-if="item.isFree==1" style="font-weight: 600;">
										免费
									</view>
									<view v-else class="" style="font-weight: 600;">
										<!-- {{getMoney(item)}} -->
										<view class="" v-if="item.payCurrency==1">
											{{$isEmpty(item.price)?'0':item.price}}贝
										</view>
										<view class="" v-if="item.payCurrency==2">
											{{$isEmpty(item.cash)?'0':item.cash}}元
										</view>
										<view class="" v-if="item.payCurrency==9">
											{{$isEmpty(item.price)?'0':item.price}}贝/{{$isEmpty(item.cash)?'0':item.cash}}元
										</view>
									</view>
									<view class="flexRowStart">
										<!-- <image :src="$ossUrl('home_star.png')" mode="" style="width: 26rpx;height: 26rpx;margin-right: 10rpx;"></image> -->
										<view class="" style="margin-top: 10rpx;">
											<uni-rate margin="2" size="28" disabled="true" :value="item.score"></uni-rate>
										</view>
										<view class="bold" v-if="item.score>0" style="font-size: 24rpx;line-height: 40rpx;color: #9AA1A7;font-weight: normal;margin-left: 16rpx;">
											{{$isEmpty(item.score)?'':item.score.toFixed(1)}}
										</view>
										<view class="bold" v-else style="font-size: 24rpx;line-height: 40rpx;color: #9AA1A7;font-weight: normal;margin-left: 16rpx;">
											暂无评分
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<image class="emptyImg" v-if="!magicBoxList.records.length > 0 &&oss" :src="oss+'pic_energy_default_wushoucang.png'" mode="aspectFit"></image>
					<uni-load-more :status="magicBoxStatus" v-if="magicBoxList.records.length > 0"></uni-load-more>
					<view class="safe-bottom"></view>
				</scroll-view>
			</swiper-item>
			<!-- <swiper-item item-id="recruit">
				<scroll-view style="height: 100%;" :scroll-top="30" scroll-y="true" @scrolltolower="recruitMore">
					<view v-for="(item,index) in recruit.records" :key="index" class="recruit-item" @tap="goRecruit(item.recruitId)">
						<view class="first-line flexRow">
							<view class="recruit-name">{{$isEmpty(item.name)?'':item.name}}</view>
							<view v-if="item.state == 1" class="bold color_919397">停止招聘</view>
							<view v-else-if="item.type == 0" class="recruit-salary">{{item.salaryStart==0 && item.salaryEnd==0 ? '面议' : `${item.salaryStart}K-${item.salaryEnd}K`}}</view>
						</view>
						<view class="second-line color_666769">{{$isEmpty(item.workplace)?'':item.workplace}}</view>
					</view>
					<image class="emptyImg" v-if="!recruit.records.length > 0 &&oss" :src="oss+'pic_energy_default_wushoucang.png'" mode="aspectFit"></image>
					<uni-load-more :status="recruitStatus" v-if="recruit.records.length > 0"></uni-load-more>
					<view class="safe-bottom"></view>
				</scroll-view>
			</swiper-item> -->
			<swiper-item item-id="material">
				<scroll-view style="height: 100%;" :scroll-top="30" scroll-y="true" @scrolltolower="materialMore">
					<view v-for="(item,index) in materialInfo.records" :key="index" class="" @tap='goArticleDetails(item)'>
						<view class="material-item">
							<view class="materialName bold" style="margin-bottom: 20rpx;">{{$isEmpty(item.materialName)?'':item.materialName}}</view>
							<view class="flexRow">
								<view class="flexRowStart" style="font-size: 28rpx;line-height: 40rpx;flex: 1;">
									<image :src="imageError(item.avatar,$oss)" mode="" style="width:40rpx;height: 40rpx;border-radius: 10rpx;margin-right: 20rpx;"></image>
									<view class="color_919397" style="flex: 1;white-space:normal;word-break: break-all;">
										{{item.createUser}}
									</view>
								</view>
								<view class="color_919397" style="font-size: 24rpx;line-height: 34rpx;margin-left: 20rpx;">
									{{$isEmpty(item.createTime)?'':item.createTime.split(' ')[0]}}
								</view>
							</view>
						</view>
					</view>
					<image class="emptyImg" v-if="!materialInfo.records.length > 0 &&oss" :src="oss+'pic_energy_default_wushoucang.png'" mode="aspectFit"></image>
					<uni-load-more :status="materialStatus" v-if="materialInfo.records.length > 0"></uni-load-more>
					<view class="safe-bottom"></view>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="article">
				<scroll-view style="height: 100%;" :scroll-top="30" scroll-y="true" @scrolltolower="articleMore">
					<view v-for="(item,index) in articleInfo.records" :key="index" class="" @tap='goArticleDetails(item)'>
						<view class="material-item">
							<view class="materialName bold" style="margin-bottom: 20rpx;">{{$isEmpty(item.materialName)?'':item.materialName}}</view>
							<view class="flexRow">
								<view class="flexRowStart" style="font-size: 28rpx;line-height: 40rpx;">
									<image :src="imageError(item.avatar,$oss)" mode="" style="width:40rpx;height: 40rpx;border-radius: 10rpx;margin-right: 20rpx;"></image>
									<view class="color_919397" style="flex: 1;">
										{{item.createUser}}
									</view>
								</view>
								<view class="color_919397" style="font-size: 24rpx;line-height: 34rpx;margin-left: 20rpx;">
									{{$isEmpty(item.createTime)?'':item.createTime.split(' ')[0]}}
								</view>
							</view>
						</view>
					</view>
					<image class="emptyImg" v-if="!articleInfo.records.length > 0 &&oss" :src="oss+'pic_energy_default_wushoucang.png'" mode="aspectFit"></image>
					<uni-load-more :status="articleStatus" v-if="articleInfo.records.length > 0"></uni-load-more>
					<view class="safe-bottom"></view>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="activity">
				<scroll-view style="height: 100%;" :scroll-top="30" scroll-y="true" @scrolltolower="activityMore">
					<view class="flexRowStart activityList" v-for="(item,index) in activityInfo.records" :key="index" @tap="goActivityDetails(item)">
						<image lazy-load="true" :src="item.poster" class="posterImg" mode="aspectFit"></image>
						<view class="activityInfo">
							<view class="bold doubleEllipsis name color_303031 activityName">{{ $isEmpty(item.name)?'':item.name}}</view>
							<view class="flexColumnStart">
								<view class="color_3CD489 bold activityTicket" v-if="item.ticketingManagements && item.ticketingManagements[0].ticketingType === '1'">免费</view>
								<view class="color_F74437 bold activityTicket" v-if="item.ticketingManagements && item.ticketingManagements[0].ticketingType === '2'">{{ getMoney(item.ticketingManagements[0])}}</view>
								<view class="color_919397 activityCity">
									{{$isEmpty(item.startTime)?'':item.startTime.substring(0,10)}}
									|
									{{ $isEmpty(item.city)?'':item.city }}</view>
							</view>
						</view>
					</view>
					<image class="emptyImg" v-if="!activityInfo.records.length > 0 &&oss" :src="oss+'pic_energy_default_wushoucang.png'" mode="aspectFit"></image>
					<uni-load-more :status="activityStatus" v-if="activityInfo.records.length > 0"></uni-load-more>
					<view class="safe-bottom"></view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		imageError,
		soImageError,
		goRecruit
	} from '@/common/utils.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	// import recruitItem from '@/pages/find/recruit/recruitItem/recruitItem.vue'
	export default {
		components: {
			uniLoadMore,
			// recruitItem
		},
		data() {
			return {
				swiperHeight: 0,
				oss: '',
				magicBoxList: [],
				recruit: {},
				magicBoxStatus: 'more',
				recruitStatus: 'more',
				materialInfo:{},
				materialStatus:'more',
				articleInfo:{},
				articleStatus:'more',
				activityInfo:{},
				activityStatus:'more',
				item_id: 0,
				userId: '',
				type: 'magicBox'
			};
		},
		onLoad() {
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
			this.$http.get('dms/product/collect_page', {
				params: {
					size: 20,
				}
			}).then(res => {
				this.magicBoxList = res.data.data;
				this.magicBoxList.records.forEach(item => {
					item.imageUrl = soImageError(item.imageUrl, this.oss)
				})
				if (!(this.magicBoxList.current < this.magicBoxList.pages)) {
					this.magicBoxStatus = 'noMore';
				} else {
					this.magicBoxStatus = 'more';
				}
			});
			this.$http.get('qms/conference_publish/collection_activity', {
				params: {
					size: 20,
				}
			}).then(res => {
				this.activityInfo = res.data.data;
				this.activityInfo.records.forEach(item => {
					item.poster = soImageError(item.poster, this.oss)
				})
				if (!(this.activityInfo.current < this.activityInfo.pages)) {
					this.activityStatus = 'noMore';
				} else {
					this.activityStatus = 'more';
				}
			});
			this.$http.get('dms/recruit/collect/get_page', {
				params: {
					size: 10
				}
			}).then(res => {
				this.recruit = res.data.data;
				if (!(this.recruit.current < this.recruit.pages)) {
					this.recruitStatus = 'noMore';
				} else {
					this.recruitStatus = 'more';
				}
			});
			this.$http.get('dms/material/collect_page', {
				params: {
					materialType:0,
					size: 10
				}
			}).then(res => {
				this.materialInfo = res.data.data;
				this.materialInfo.records.forEach(item => {
					item.avatar = imageError(item.avatar, this.oss)
				})
				if (!(this.materialInfo.current < this.materialInfo.pages)) {
					this.materialStatus = 'noMore';
				} else {
					this.materialStatus = 'more';
				}
			});
			this.$http.get('dms/material/collect_page', {
				params: {
					materialType:1,
					size: 10
				}
			}).then(res => {
				this.articleInfo = res.data.data;
				this.articleInfo.records.forEach(item => {
					item.avatar = imageError(item.avatar, this.oss)
				})
				if (!(this.articleInfo.current < this.articleInfo.pages)) {
					this.articleStatus = 'noMore';
				} else {
					this.articleStatus = 'more';
				}
			});
		},
		methods: {
			goRecruit,
			imageError,
			soImageError,
			cancelAttention(item) {
				let that = this
				if (that.item_id == 0) {
					console.log(item)
					uni.showModal({
						title: '提示',
						content: `你确定要取消收藏"${item.name}"吗？`,
						confirmColor: "#F74437",
						success: res => {
							if (res.confirm) {
								that.$http.post('dms/collection/app/delete', {
									targetIds: [item.id],
									type: 6,
								}).then(res => {
									if (res.data.code == 0) {
										uni.showToast({
											title: "取消收藏成功",
											icon: "none",
											success: () => {
												this.$http.get('dms/product/collect_page', {
													params: {
														size: 20
													}
												}).then(res => {
													this.magicBoxList = res.data.data;
													this.magicBoxList.records.forEach(item => {
														item.imageUrl = soImageError(item.imageUrl, this.oss)
													})
													if (!(this.magicBoxList.current < this.magicBoxList.pages)) {
														this.magicBoxStatus = 'noMore';
													} else {
														this.magicBoxStatus = 'more';
													}
												});
											}
										})
									}
								})
							} else if (res.cancel) {
								// console.log('用户点击取消');
							}
						}
					});
				}
			},
			materialMore(){
				if (this.materialStatus !== 'more') {
					return
				}
				let that = this;
				if (that.materialInfo.current < that.materialInfo.pages) {
					that.materialStatus = 'loading';
					that.$http.get('dms/material/collect_page', {
						params: {
							materialType:0,
							size: 10,
							current: that.materialInfo.current + 1
						}
					}).then(res => {
						that.materialInfo.current = res.data.data.current;
						res.data.data.records.forEach(item=>{
							item.avatar = imageError(item.avatar)
						})
						that.materialInfo.records = that.materialInfo.records.concat(res.data.data.records);
						that.materialStatus = 'more';
					});
				} else {
					that.materialStatus = 'noMore';
				}
			},
			articleMore(){
				if (this.articleStatus !== 'more') {
					return
				}
				let that = this;
				if (that.articleInfo.current < that.articleInfo.pages) {
					that.articleStatus = 'loading';
					that.$http.get('dms/material/collect_page', {
						params: {
							materialType:1,
							size: 10,
							current: that.articleInfo.current + 1
						}
					}).then(res => {
						that.articleInfo.current = res.data.data.current;
						res.data.data.records.forEach(item=>{
							item.avatar = imageError(item.avatar)
						})
						that.articleInfo.records = that.articleInfo.records.concat(res.data.data.records);
						that.articleStatus = 'more';
					});
				} else {
					that.articleStatus = 'noMore';
				}
			},
			activityMore(){
				if (this.activityStatus !== 'more') {
					return
				}
				let that = this;
				if (that.activityInfo.current < that.activityInfo.pages) {
					that.activityStatus = 'loading';
					that.$http.get('qms/conference_publish/collection_activity', {
						params: {
							size: 10,
							current: that.activityInfo.current + 1
						}
					}).then(res => {
						that.activityInfo.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.poster = soImageError(item.poster, this.oss)
						});
						that.activityInfo.records = that.activityInfo.records.concat(res.data.data.records);
						that.activityStatus = 'more';
					});
				} else {
					that.activityStatus = 'noMore';
				}
			},
			magicBoxMore() {
				if (this.magicBoxStatus !== 'more') {
					return
				}
				let that = this;
				if (that.magicBoxList.current < that.magicBoxList.pages) {
					that.magicBoxStatus = 'loading';
					that.$http.get('dms/product/collect_page', {
						params: {
							size: 20,
							current: that.magicBoxList.current + 1
						}
					}).then(res => {
						that.magicBoxList.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.imageUrl = soImageError(item.imageUrl, this.oss)
						});
						that.magicBoxList.records = that.magicBoxList.records.concat(res.data.data.records);
						that.magicBoxStatus = 'more';
					});
				} else {
					that.magicBoxStatus = 'noMore';
				}
			},
			recruitMore() {
				if (this.recruitStatus !== 'more') {
					return
				}
				let that = this;
				if (that.recruit.current < that.recruit.pages) {
					that.recruitStatus = 'loading';
					that.$http.get('dms/recruit/collect/get_page', {
						params: {
							size: 10,
							current: that.recruit.current + 1
						}
					}).then(res => {
						that.recruit.current = res.data.data.current;
						that.recruit.records = that.recruit.records.concat(res.data.data.records);
						that.recruitStatus = 'more';
					});
				} else {
					that.recruitStatus = 'noMore';
				}
			},
			getCompanyStation,
			swiperChange(e) {
				this.type = e.detail.currentItemId
			},
			showMagicBox() {
				this.type = 'magicBox'
			},
			showRecruit() {
				this.type = 'recruit'
			},
			showMaterial(){
				this.type = 'material'
			},
			showArticle(){
				this.type = 'article'
			},
			showActivity(){
				this.type = 'activity'
			},
			goMagicBox(item) {
				uni.navigateTo({
					url: '/pages/find/magicBox/detail/detail?id=' + item.id
				});
			},
			goArticleDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.id}`
				})
			},
			goActivityDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.id}`
				})
			},
			getMoney(ticket) {
				if (ticket.canMoney != 0 && ticket.money==0) {
					return `${ticket.canMoney}贝`;
				} else if (ticket.money!=0&& ticket.canMoney == 0) {
					return `${ticket.money}元`;
				} else if (ticket.money != 0 && ticket.canMoney != 0) {
					return `${ticket.canMoney}贝/${ticket.money}元`;
				}else{
					return `0`;
				}
			},
		}
	}
</script>

<style lang="scss">
	.avatar {
				height: 140rpx;
				width: 140rpx;
			}
	
			.item-content {
				flex: 1;
				min-width: 0;
				margin-left: 24rpx;
	
				.item-content-start {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: flex-start;
					height: 140rpx;
					flex: 1;
					.item-content-name {
						flex: 1;
						color: #272727;
						margin-bottom: 16rpx;
						font-size: 30rpx;
						line-height: 42rpx;
					}
	
					.item-content-score {
						display: flex;
						align-items: center;
	
						.icon {
							width: 18rpx;
							height: 18rpx;
							margin-right: 14rpx;
						}
	
						margin-top: 10rpx;
						color: #F74437;
						font-size: 24rpx;
						font-weight: bold;
						line-height: 34rpx;
					}
	
					.item-content-tag {
						color: #565B5F;
						font-size: 22rpx;
						line-height: 32rpx;
						.item-content-tag-item{
							background-color:#F5F7F8 ;
							border-radius: 4rpx;
							padding: 6rpx 12rpx;
							margin-right: 8rpx;
						}
					}
				}
	
	}
	.activityList {
		padding: 16rpx 32rpx;
	
		.posterImg {
			width: 320rpx;
			height: 196rpx;
			border-radius: 20rpx;
			margin-right: 30rpx;
		}
	
		.activityInfo {
			flex: 1;
			height: 196rpx;
			display:flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
			.activityName {
				font-size: 28rpx;
				line-height: 40rpx;
				margin-bottom: 20rpx;
			}
	
			.activityTicket {
				font-size: 28rpx;
				line-height: 40rpx;
			}
	
			.activityCity {
				font-size: 22rpx;
				line-height: 32rpx;
				margin-top: 30rpx;
				margin-top:14rpx;
			}
		}
	}
	.container {
		// padding: 0 32rpx;
	}

	.title {
		padding: 16rpx 32rpx;

		.title-item {
			font-size: 28rpx;
			line-height: 40rpx;
			font-weight: bold;
			color: #303031;
			padding: 8rpx 20rpx;
			margin-right: 20rpx;
			border-radius: 28rpx;
			margin-right: 20rpx;

			&.item_active {
				// color: #F74437;
				color: #46B28B;
				// background-color: rgba(247, 68, 55, .1);
				background-color: #DAF0E8;
			}
		}
	}

	.canner-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		// padding: 0 32rpx;
		padding: 16rpx 32rpx;

		.name {
			color: #303031;
			font-size: 28rpx;
		}

		.company {
			font-size: 24rpx;
			margin-top: 10rpx;
			color: #919397;
		}
	}

	.swiper-item {
		display: block;
		height: 100%;
		// line-height: 300rpx;
		text-align: center;
		background-color: #f4f5f6;
	}

	.recruit-item {
		padding:16rpx 32rpx;
		border-bottom: 1rpx solid #EFF0F1;

		.first-line {
			word-break: break-all;
			height: 40rpx;
			font-size: 30rpx;
			font-weight: bold;

			.recruit-name {}

			.recruit-salary {
				line-height: 42rpx;
				color: #F74437;
			}
		}

		.second-line {
			margin-top: 40rpx;
			height: 40rpx;
			font-size: 24rpx;
		}
	}
	.material-item{
		padding: 16rpx 32rpx;
		border-bottom: 1rpx solid #EFF0F1;
		.materialName{
			font-size: 32rpx;
			line-height: 52rpx;
		}
	}
</style>
