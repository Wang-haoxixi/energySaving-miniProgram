<template>
	<view>
		<view class="swiper-item">
			<scroll-view scroll-y="true" class="fifthRecommendScroll" :style="{height:scrollHeight + 'px'}" @scrolltolower="productMore">
				<view class="productList" v-for="(item,index) of productInfo.records" :key="index" @tap="goProductDetails(item)">
					<view class="flexRowStart productInfo">
						<image lazy-load="true" :src="item.imageUrl" class="productImg"></image>
						<view class="productWrap">
							<view class="flexRow productTitle" style="margin-bottom: 20rpx;">
								<view class="color_303031 bold singleEllipsis productName">
									{{$isEmpty(item.name)?'':item.name}}
								</view>
								<view class="flexRowStart productMark" v-if="item.isOfficial==1">
									<image v-if="oss" :src="oss+'icon_official_mini.png'" class="productMarkImg" mode="aspectFit"></image>
									<view class="color_2F80FF bold productMarkTitle">
										官方认证
									</view>
								</view>
							</view>
							<view class="flexRow productContent">
								<view class="color_919397 singleEllipsis productContentOrgName">
									{{$isEmpty(item.orgName)?'':item.orgName}}
								</view>
								<view class="color_F74437 bold flexRowStart">
									<image v-if="oss" :src="oss+'icon_star.png'" class="starImg"></image>
									<text> {{$isEmpty(item.score)?'0':item.score}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="flexRow productAction">
						<view class="color_919397" style="display: flex;align-items: center;">
							<view v-for="(item2,index2) in item.tagKeywords" :key="index2" class="productTagKeywords">
								<text style="margin: 0 6rpx;">{{$isEmpty(item2)?'':item2}}</text> <text v-if="index2<item.tagKeywords.length-1">·</text>
							</view>
						</view>
						<view v-if="item.isFollowed==0" class="color_FFFFFF bold attentionBtn" style="background-color: #F74437;"
						 @tap.stop="attentionMagicBox(item)">
							收藏
						</view>
						<view v-else class="color_919397 bold attentionBtn" @tap.stop="attentionMagicBox(item)">
							已收藏
						</view>
					</view>
				</view>
				<image class="emptyImg" v-if="!productInfo.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
				<uni-load-more :status="productStatus" v-if="productInfo.records.length>0"></uni-load-more>
				<view class="bottom-safe" style="height: 112rpx;"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	export default {
		props: {
			productInfo: Object,
			scrollHeight: Number
		},
		data() {
			return {
				userId:'',
				productStatus: '',
				oss:''
			};
		},
		onReady() {
			this.userId = uni.getStorageSync('userinfo').user_id;
			this.oss=this.$oss
			if (!this.productInfo.current < this.productInfo.pages) {
				this.productStatus = 'noMore';
			}
		},
		methods:{
			goProductDetails(item) {
				uni.navigateTo({
					url: `/pages/find/magicBox/detail/detail?id=${item.id}`
				})
			},
			productMore() {
				let that = this;
				if (that.productInfo.current < that.productInfo.pages) {
					that.productStatus = 'loading';
					that.$http.get('dms/app/product/shop_page', {
						params: {
							type: 0,
							orderField: "score",
							orderType: "desc",
							current: that.productInfo.current + 1
						}
					}).then(res => {
						that.productInfo.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							res.data.data.records.forEach(item => {
								item.imageUrl=imageError(item.imageUrl, that.oss)
							});
						})
						that.productInfo.records = that.productInfo.records.concat(res.data.data.records);
						that.productStatus = 'more';
					});
				} else {
					that.productStatus = 'noMore';
				}
			},
			attentionMagicBox(item) {
				if (item.isFollowed == 0) {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.id,
						sign: 0,
						type: 4
					}).then(res => {
						if (res.data.code == 0) {
							item.isFollowed = 1
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none",
								duration: 1000
							})
						}
					})
				} else {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.id,
						sign: 1,
						type: 4
					}).then(res => {
						if (res.data.code == 0) {
							item.isFollowed = 0
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none",
								duration: 1000
							})
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.fifthRecommendScroll {
		// position: relative;
		// top: 220rpx;
		.productList {
			padding: 30rpx 40rpx;

			.productInfo {
				.productImg {
					width: 116rpx;
					height: 116rpx;
					border-radius: 30rpx;
					margin-right: 20rpx;
				}

				.productWrap {
					flex: 1;

					.productTitle {
						.productName {
							font-size: 30rpx;
							line-height: 42rpx;
							width: 400rpx;
						}

						.productMark {
							.productMarkImg {
								width: 24rpx;
								height: 24rpx;
								margin-right: 8rpx;
							}

							.productMarkTitle {
								font-size: 20rpx;
								line-height: 28rpx;
							}
						}
					}

					.productContent {
						font-size: 24rpx;
						line-height: 34rpx;

						.productContentOrgName {
							width: 400rpx;
						}

						.starImg {
							margin-right: 12rpx;
							width: 22rpx;
							height: 22rpx;
						}
					}
				}
			}

			.productAction {
				margin-top: 10rpx;
				margin-left: 132rpx;

				.productTagKeywords {
					font-size: 20rpx;
					line-height: 28rpx;
				}

				.attentionBtn {
					width: 96rpx;
					height: 50rpx;
					font-size: 24rpx;
					line-height: 50rpx;
					text-align: center;
					background-color: #F3F4F5;
					border-radius: 26rpx;
				}
			}
		}
	}
</style>
