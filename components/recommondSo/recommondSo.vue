<template>
	<view>
		<view class="swiper-item">
			<scroll-view scroll-y="true" class="secondRecommendScroll" :style="{height:scrollHeight + 'px'}" @scrolltolower="soMore">
				<view class="soList" v-for="(item,index) of soInfo.records" :key="index" @tap="goSoCard(item)">
					<view class="flexRow">
						<view class="flexRowStart soInfo">
							<image lazy-load="true" :src="item.avatar" class="avatarImg"></image>
							<view class="" style="flex: 1;min-width: 0;">
								<view class="color_303031 bold singleEllipsis soName">
									{{$isEmpty(item.name)?'':item.name}}
								</view>
								<view class="flexRowStart color_919397 soPosition">
									<view class="" style="margin-right: 32rpx;">
										负责人:
										<text>{{$isEmpty(item.creator)?'':item.creator}}</text>
									</view>
									<view class="">
										成员数:
										<text>{{$isEmpty(item.memberNum)?0:(item.memberNum>1300?'1300+':item.memberNum)}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="applyBtn" @tap.stop="commentsOpen('apply',item)">
							申请加入
						</view>
					</view>
				</view>
				<image class="emptyImg" v-if="!soInfo.records.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
				<uni-load-more :status="soStatus" v-if="soInfo.records.length>0"></uni-load-more>
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
			soInfo: Object,
			scrollHeight: Number
		},
		data() {
			return {
				soStatus: '',
				oss: ''
			};
		},
		onReady() {
			this.oss = this.$oss
			if (!this.soInfo.current < this.soInfo.pages) {
				this.soStatus = 'noMore';
			}
		},
		methods: {
			soMore() {
				let that = this;
				if (that.soInfo.current < that.soInfo.pages) {
					that.soStatus = 'loading';
					that.$http.get('admin/org/first_recommend', {
						params: {
							current: that.soInfo.current + 1
						}
					}).then(res => {
						that.soInfo.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.avatar=imageError(item.avatar, that.oss)
						});
						that.soInfo.records = that.soInfo.records.concat(res.data.data.records);
						that.soStatus = 'more';
					});
				} else {
					that.soStatus = 'noMore';
				}
			},
			goSoCard(item) {
				uni.navigateTo({
					url: `/pages/find/soCard/soCard?id=${item.orgId}`
				})
			},
			commentsOpen(type,item){
				// this.$emit('recommondSocommentsOpen',type,item)
				uni.navigateTo({
					url: `/pages/find/soCard/soCard?id=${item.orgId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.secondRecommendScroll {

		// position: relative;
		// top: 220rpx;
		.soList {
			padding:32rpx;
			background-color: #FFFFFF;
			.soInfo {
				flex: 1;
				min-width: 0rpx;
				.avatarImg {
					border-radius: 50%;
					width: 120rpx;
					height: 120rpx;
					margin-right: 24rpx;
				}

				.soName {
					font-size: 28rpx;
					line-height: 40rpx;
					margin-bottom: 16rpx;
				}

				.soPosition {
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			.applyBtn {
				width: 160rpx;
				height: 52rpx;
				margin-left: 20rpx;
				font-size: 24rpx;
				line-height: 52rpx;
				border-radius: 42rpx;
				color: #FFFFFF;
				text-align: center;
				background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
			}
		}
	}
</style>
