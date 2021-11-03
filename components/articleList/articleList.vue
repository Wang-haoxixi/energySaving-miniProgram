<template>
	<view style="background-color: #F5f7f8;">
		<view class="swiper-item">
			<scroll-view scroll-y="true" class="secondRecommendScroll" :style="{height:scrollHeight + 'px'}" @scrolltolower="articleMore">
				<view v-for="(item,index) of articleInfo.records" :key="index" class="articleList" @tap="goArticleDetails(item)">
					<view class="color_303031 bold doubleEllipsis articleName">
						{{$isEmpty(item.materialName)?'':item.materialName}}
					</view>
					<view class="color_919397 doubleEllipsis articleInfo">
						{{$isEmpty(item.materialIntro)?'':item.materialIntro}}
					</view>
					<view class="flexRow wrapArticleInfo">
						<view class="flexRowStart">
							<image lazy-load="true" :src="item.avatar" class="avatarImg"></image>
							<view class="color_919397 publisherName">
								{{$isEmpty(item.realName)?'暂无':item.realName}}
							</view>
						</view>
						<view class="color_919397 articleCreateTime">
							{{$isEmpty(item.createTime)?'':item.createTime.split(' ')[0]}}
						</view>
					</view>
				</view>
				<image class="emptyImg" v-if="!articleInfo.records.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
				<uni-load-more :status="articleStatus" v-if="articleInfo.records.length>0"></uni-load-more>
				<view class="bottom-safe"></view>
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
			articleInfo: Object,
			scrollHeight: Number
		},
		data() {
			return {
				articleStatus: '',
				oss:''
			};
		},
		onReady() {
			this.oss=this.$oss
			if (!this.articleInfo.current < this.articleInfo.pages) {
				this.articleStatus = 'noMore';
			}
		},
		methods:{
			articleMore() {
				let that = this;
				if (that.articleInfo.current < that.articleInfo.pages) {
					that.articleStatus = 'loading';
					that.$http.get('dms/material/page', {
						params: {
							materialType:1,
							current: that.articleInfo.current + 1
						}
					}).then(res => {
						that.articleInfo.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.avatar=imageError(item.avatar, that.oss)
						});
						that.articleInfo.records = that.articleInfo.records.concat(res.data.data.records);
						that.articleStatus = 'more';
					});
				} else {
					that.articleStatus = 'noMore';
				}
			},
			goArticleDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.id}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.secondRecommendScroll {
	
		// position: relative;
		// top: 220rpx;
		.articleList {
			padding: 32rpx 24rpx;
			border-radius: 16rpx;
			margin-bottom: 16rpx;
			background-color: #FFFFFF;

			.articleName {
				font-size: 32rpx;
				line-height: 52rpx;
				margin-bottom: 16rpx;
			}
			.articleInfo{
				font-size: 26rpx;
				line-height: 40rpx;
				margin-bottom: 32rpx;
			}

			.wrapArticleInfo {
				// margin-bottom: 30rpx;

				.avatarImg {
					width: 40rpx;
					height: 40rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
				}

				.publisherName {
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.articleCreateTime {
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}
		}
	}
</style>
