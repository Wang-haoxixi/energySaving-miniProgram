<template>
	<view class="safe-bottom">
		<view class="flexRowStart search">
			<image class="searchImg" v-if="oss" :src="oss + 'icon_search_gray.png'"></image>
			<input maxlength="500" placeholder="搜索" style="flex: 1;" placeholder-style="color:#BCC4CB" @input="search" v-model="searchText"></input>
		</view>
		<view class="cannerList" v-for="(item,index) of celebrityInfo.records" :key="index" @tap.stop="goCannerCard(item)">
			<view class="flexRow">
				<view class="cannerInfo" style="width: 100%;">
					<image lazy-load="true" :src="item.avatar" class="avatarImg"></image>
					<view class="flexColumnStart" style="flex: 1;">
						<view class="flexRow" style="width: 100%;">
							<view class="flexColumnStart">
								<view class="flexRowStart">
									<view class="bold color_303031 cannerName">
										{{$isEmpty(item.realName)?'':item.realName}}
									</view>
									<!-- <image class="celebrityLevel" v-if="item.redness==1 && oss" :src="oss+'icon_ican_celebrityLevelOne.png'"></image>
									<image class="celebrityLevel" v-if="item.redness==2 && oss" :src="oss+'icon_ican_celebrityLevelTwo.png'"></image>
									<image class="celebrityLevel" v-if="item.redness==3 && oss" :src="oss+'icon_ican_celebrityLevelThree.png'"></image>
									<image class="celebrityLevel" v-if="item.redness==4 && oss" :src="oss+'icon_ican_celebrityLevelFour.png'"></image>
									<image class="celebrityLevel" v-if="item.redness==5 && oss" :src="oss+'icon_ican_celebrityLevelFive.png'"></image> -->
								</view>
								<view class="color_919397 singleEllipsis cannerCompany">
									{{getCompanyStation(item.company,item.station)}}
								</view>
							</view>
							<view v-if="item.isFollowed==0" class="attention" @tap.stop="attentionCanner(item,index)">
								+关注
							</view>
							<view v-else class="attentioned" @tap.stop="attentionCanner(item,index)">
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
		</view>
		<image class="emptyImg" v-if="!celebrityInfo.records.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
		<uni-load-more :status="celebrityStatus" v-if="celebrityInfo.records.length>0"></uni-load-more>
		<!-- <view class="bottom-safe" style="height: 112rpx;"></view> -->
	</view>
</template>

<script>
	import {
		getCompanyStation,
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				celebrityInfo:{
					records:[]
				},
				celebrityStatus: '',
				oss: '',
				userId:'',
				searchText:''
			};
		},
		onLoad() {
			this.oss = this.$oss
			this.$http.get('admin/user/redness_hall',{
				params:{
					userName:this.searchText.trim()
				}
			}).then(res => {
				// console.log(res)
				if (res.data.code == 0) {
					this.celebrityInfo = res.data.data
					this.celebrityInfo.records.forEach(item => {
						item.avatar = imageError(item.avatar, this.oss)
					})
					if (!this.celebrityInfo.current < this.celebrityInfo.pages) {
						this.celebrityStatus = 'noMore';
					}
				} else {
					this.celebrityInfo = {}
				}
			})
		},
		onShow() {
			this.userId = uni.getStorageSync('userinfo').user_id;
		},
		methods: {
			search(){
				this.$http.get('admin/user/redness_hall',{
					params:{
						userName:this.searchText.trim()
					}
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.celebrityInfo = res.data.data
						this.celebrityInfo.records.forEach(item => {
							item.avatar = imageError(item.avatar, this.oss)
						})
						if (!this.celebrityInfo.current < this.celebrityInfo.pages) {
							this.celebrityStatus = 'noMore';
						}
					} else {
						this.celebrityInfo = {}
					}
				})
			},
			celebrityMore() {
				let that = this;
				if (that.celebrityInfo.current < that.celebrityInfo.pages) {
					that.celebrityStatus = 'loading';
					that.$http.get('admin/user/redness_hall', {
						params: {
							current: that.celebrityInfo.current + 1,
							userName:this.searchText.trim()
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
			
					if (item.isFollowed == 0) {
						this.$http.post('admin/follow/user', {
							userId: this.userId,
							followId: item.userId,
							sign: 0,
							type: 1
						}).then(res => {
							// console.log(res)
							if (res.data.code == 0) {
								item.isFollowed = 1
							} else {
								uni.showToast({
									title: `${res.data.message}`,
									icon: "none",
									duration: 1000
								})
							}
						})
					} else {
						this.$http.post('admin/follow/user', {
							userId: this.userId,
							followId: item.userId,
							sign: 1,
							type: 1
						}).then(res => {
							// console.log(res)
							if (res.data.code == 0) {
								item.isFollowed = 0
							} else {
								uni.showToast({
									title: `${res.data.message}`,
									icon: "none",
									duration: 1000
								})
							}
						})
					}
			
			},
			goCannerCard(item) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.userId}`
				})
			},
			getCompanyStation
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		margin: 16rpx 32rpx;
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #F5f7f8;
	
		.searchImg {
			height: 32rpx;
			width: 32rpx;
			margin-right: 10rpx;
		}
	}
	
	.attention {
		margin-left: 20rpx;
		color: #FFFFFF;
		width: 140rpx;
		border-radius: 42rpx;
		line-height: 52rpx;
		text-align: center;
		height: 52rpx;
		font-size: 26rpx;
		background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
	}
	
	.attentioned {
		margin-left: 20rpx;
		color: #FFFFFF;
		width: 140rpx;
		font-size: 26rpx;
		background-color: #FFD6D6;
		border-radius: 42rpx;
		text-align: center;
		height: 52rpx;
		line-height: 52rpx;
	}
.cannerList {
			padding: 30rpx 40rpx;

			.cannerInfo {
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
					margin:8rpx 0px;
					font-size: 24rpx;
					line-height: 34rpx;
				}
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
</style>
