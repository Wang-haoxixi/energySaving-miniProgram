<template>
	<view>
		<view class="swiper-item">
			<scroll-view scroll-y="true" class="firstRecommendScroll" :style="{height:scrollHeight + 'px'}" @scrolltolower="celebrityMore">
				<view class="cannerList" v-for="(item,index) of celebrityInfo.records" :key="index" @tap.stop="goCannerCard(item)">
					<view class="flexRow" style="align-items: flex-start;">
						<view class="cannerInfo">
							<image lazy-load="true" mode="aspectFill" :src="item.avatar" class="avatarImg"></image>
						</view>
						<view class="flexColumnStart" style="flex: 1;">
							<view class="flexRowStart" style="width: 100%;">
								<view class="bold color_303031 cannerName">
									{{$isEmpty(item.realName)?'':item.realName}}
								</view>
								<!-- <image class="celebrityLevel" v-if="item.redness==1 && oss" :src="oss+'icon_ican_celebrityLevelOne.png'"></image>
								<image class="celebrityLevel" v-if="item.redness==2 && oss" :src="oss+'icon_ican_celebrityLevelTwo.png'"></image>
								<image class="celebrityLevel" v-if="item.redness==3 && oss" :src="oss+'icon_ican_celebrityLevelThree.png'"></image>
								<image class="celebrityLevel" v-if="item.redness==4 && oss" :src="oss+'icon_ican_celebrityLevelFour.png'"></image>
								<image class="celebrityLevel" v-if="item.redness==5 && oss" :src="oss+'icon_ican_celebrityLevelFive.png'"></image> -->
							</view>
							<view class="flexRow" style="min-width: 0; width: 100%;">
								<view class="color_919397 singleEllipsis cannerCompany" style="flex: 1;font-size: 24rpx;line-height: 34rpx;color: #9AA1A7;max-width: 376rpx;">
									{{getCompanyStation(item.company,item.station)}}
								</view>
								<view v-if="item.isFollowed==0" class="color_FFFFFF cannerAttention" @tap.stop="attentionCanner(item,index)">
									+关注
								</view>
								<view v-else class="color_FFFFFF cannerAttentioned" @tap.stop="attentionCanner(item,index)">
									已关注
								</view>
							</view>
							<view class="abilityTagList">
								<view class="color_919397 abilityTagListContent" v-for="(item2,index2) of item.abilityTag" :key="index2" v-if="index2<3">
									<view class="">
										{{$isEmpty(item2)?'':item2}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<image class="emptyImg" v-if="!celebrityInfo.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
				<uni-load-more :status="celebrityStatus" v-if="celebrityInfo.records.length>0"></uni-load-more>
				<view class="bottom-safe"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		imageError
	} from '@/common/utils.js';
	export default {
		props: {
			celebrityInfo: Object,
			scrollHeight: Number
		},
		data() {
			return {
				celebrityStatus: '',
				oss: ''
			};
		},
		onReady() {
			this.oss = this.$oss
			if (!this.celebrityInfo.current < this.celebrityInfo.pages) {
				this.celebrityStatus = 'noMore';
			}
		},
		methods: {
			celebrityMore() {
				let that = this;
				if (that.celebrityInfo.current < that.celebrityInfo.pages) {
					that.celebrityStatus = 'loading';
					that.$http.get('admin/user/redness_hall', {
						params: {
							userName:'',
							current: that.celebrityInfo.current + 1
						}
					}).then(res => {
						that.celebrityInfo.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.avatar=imageError(item.avatar, that.oss)
						});
						that.celebrityInfo.records = that.celebrityInfo.records.concat(res.data.data.records);
						that.celebrityStatus = 'more';
					});
				} else {
					that.celebrityStatus = 'noMore';
				}
			},
			attentionCanner(item, index) {
				this.$emit("attentionRedness", item, index)
			},
			goCannerCard(item){
				this.$emit("cannerRedness",item)
			},
			getCompanyStation
		}
	}
</script>

<style lang="scss" scoped>
	.firstRecommendScroll {

		// position: relative;
		// top: 220rpx;
		.cannerList {
			padding: 32rpx;
			background-color: #FFFFFF;

			.cannerInfo {
				// flex: 1;
				display: flex;
				align-items: flex-start;
				justify-content: flex-start;

				.avatarImg {
					width: 112rpx;
					height: 112rpx;
					margin-right: 24rpx;
					border-radius: 50%;
				}

				.cannerName {
					font-size: 28rpx;
					line-height: 40rpx;
					margin-right: 10rpx;
				}

				.celebrityLevel {
					width: 70rpx;
					height: 40rpx;
				}

				.cannerCompany {
					margin-top: 8rpx;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			.cannerAttention {
				margin-left: 20rpx;
				font-size: 26rpx;
				width: 140rpx;
				height: 52rpx;
				line-height: 52rpx;
				border-radius: 42rpx;
				// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
				background-color: #46B28B;
				text-align: center;
			}
			.cannerAttentioned {
				margin-left: 20rpx;
				font-size: 26rpx;
				width: 140rpx;
				height: 52rpx;
				line-height: 52rpx;
				// background-color: #FFD6D6;
				background-color: #C7E8DC;
				border-radius: 42rpx;
				text-align: center;
			}

			.abilityTagList {

				.abilityTagListContent {
					margin-bottom: 10rpx;
					margin-right: 20rpx;
					display: inline-block;
					padding: 4rpx 10rpx;
					background-color: #F4F5F6;
					border-radius: 10rpx;
					font-size: 20rpx;
					line-height: 28rpx;
				}
			}
		}
	}
</style>
