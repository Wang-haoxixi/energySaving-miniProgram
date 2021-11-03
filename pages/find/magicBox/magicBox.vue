<template>
	<view class="container">
		<view class="search" @tap="goSearch">
			<image v-if="oss" class="search-icon" :src="oss+'icon_search_gray.png'"></image>
			<input class="search-text" placeholder="搜索" placeholder-class="inputDefault" disabled="true" />
		</view>
		<banner slotNumber="app_mofang_top" :customStyle="{width:'702rpx',margin:'0 24rpx'}"></banner>
		<view v-for="(item,index) in data" :key="index">
			<scroll-view class="scroll-tag" v-if="item.type == 2" scroll-x="true">
				<view class="contentTag">
					<view @tap="goTagMore(item2)" class="flexRow tagList" v-for="(item2,index2) in item.products" :key="index2">
						<view class="color_FFFFFF tagName">{{$isEmpty(item2.name)?'':item2.name}}</view>
						<image class="rightImg" v-if="oss" :src="oss+'icon_find_magicBox_right.png'"></image>
					</view>
				</view>
			</scroll-view>
			<view v-if="item.type == 3" class="magicBoxWrap">
				<view class="flexRow magicBoxTitle">
					<view class="bold color_303031" style="font-size: 32rpx;">{{$isEmpty(item.typeDesc)?'':item.typeDesc}}</view>
					<view class="color_F74437" style="font-size: 24rpx;" @tap="goMore(item)">查看更多</view>
				</view>
				<scroll-view class="scroll-magicBox" scroll-x="true">
					<view class="contentMagicBox">
						<view @tap="gomagicBox(item2.id)" v-for="(item2,index2) in item.products" :key="index2" class="magicBoxList">
							<image lazy-load="true" class="img" :src="item2.imageUrl" mode="aspectFit"></image>
							<view class="doubleEllipsis color_666769 magicBoxName">{{$isEmpty(item2.name)?'':item2.name}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view v-if="item.type == 4" class="magicBoxWrap">
				<view class="flexRow magicBoxTitle">
					<view class="color_303031 bold" style="font-size: 32rpx;">{{$isEmpty(item.typeDesc)?'':item.typeDesc}}</view>
					<view class="color_F74437" style="font-size: 24rpx;" @tap="goMore(item)">查看更多</view>
				</view>
				<scroll-view class="scroll-magicBox" scroll-x="true">
					<view class="contentMagicBox">
						<view @tap="gomagicBox(item2.id)" v-for="(item2,index2) in item.products" :key="index2" class="list">
							<image lazy-load="true" class="imageUrl" :src="item2.imageUrl" mode="aspectFill"></image>
						</view>
					</view>
				</scroll-view>
			</view>
			<view v-if="item.type == 6" class="magicBoxWrap">
				<view class="flexRow magicBoxTitle">
					<view class="bold color_303031" style="font-size: 32rpx;">推荐关注</view>
					<view class="color_F74437" style="font-size: 24rpx;" @tap="goMore(item)">查看更多</view>
				</view>
				<scroll-view class="scroll-magicBox" scroll-x="true">
					<view class="recommend">
						<view class="recommend-item" @tap="goSoCard(item2.orgId)" v-for="(item2,index2) in item.recommendOrg" :key="index2">
							<view class="avatarView">
								<image lazy-load="true" :src="item2.avatar" mode="aspectFill" class="avatar"></image>
							</view>
							<view class="center">
								<view class="name doubleEllipsis">{{$isEmpty(item2.name)?'':item2.name}}</view>
							</view>
							<view class="center">
								<view v-if="item2.isFollowed==0" class="color_FFFFFF attention" style="background-color: #F74437;" @tap.stop="attentionMember(item2)">+关注</view>
								<view v-else class="color_F74437 attention" @tap.stop="attentionMember(item2)" style="background-color: #F4F5F6;font-weight: normal;color: #919397;">已关注</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view v-if="item.type == 7" class="magicBoxWrap">
				<view class="flexRow magicBoxTitle">
					<view class="bold color_303031" style="font-size: 32rpx;">{{$isEmpty(item.typeDesc)?'':item.typeDesc}}</view>
					<view class="color_F74437" style="font-size: 24rpx;" @tap="goMore(item)">查看更多</view>
				</view>
				<scroll-view class="scroll-magicBox" scroll-x="true">
					<view class="contentMagicBox">
						<view @tap="gomagicBox(item2.id)" v-for="(item2,index2) in item.products" :key="index2" class="magicBoxList">
							<image lazy-load="true" class="img" :src="item2.imageUrl" mode="aspectFit"></image>
							<view class="doubleEllipsis color_666769 magicBoxName">{{$isEmpty(item2.name)?'':item2.name}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		gomagicBox,
		goSoCard
	} from '@/common/utils.js';
	import {
		banner
	} from '@/components/banner/banner.vue'
	export default {
		components: {
			banner
		},
		data() {
			return {
				data: '',
				oss: '',
				current: 1,
				pages: ''
			};
		},
		onReachBottom() {
			if (!(this.$isEmpty(this.pages)) && !(this.pages+1> this.current)) {
			} else {
				this.$http.get('dms/app/tag_product/page', {
					params: {
						current: this.current,
						size: 4
					}
				}).then(res => {
					// console.log(res.data.data.records)
					this.data = this.data.concat(res.data.data.records)
					// console.log(this.data)
					this.pages = res.data.data.pages
					this.current=this.current+1
				})
			}
		},
		onPullDownRefresh() {
			this.$http
				.get('dms/app/square/shop_index')
				.then(res => {
					this.data = res.data.data;
				});
		},
		methods: {
			goMore(item) {
				// console.log(item)
				if (this.$isEmpty(item.id)) {
					item.id = '';
				}
				if (item.type == 5) {
					uni.navigateTo({
						url: '/pages/find/magicBox/cannerMore/cannerMore?type=' + item.type + '&typeDesc=' + item.typeDesc
					})
				} else if (item.type == 6) {
					uni.navigateTo({
						url: '/pages/find/magicBox/soMore/soMore?type=' + item.type + '&typeDesc=' + item.typeDesc
					})
				}else if(item.type == 7){
					uni.navigateTo({
						url: 'more/more?type=7&typeDesc=' + item.typeDesc
					})
				}
				 else {
					uni.navigateTo({
						url: 'more/more?id=' + item.id + '&typeDesc=' + item.typeDesc
					})
				}
			},
			goTagMore(item) {
				uni.navigateTo({
					url: 'more/more?type=2&typeDesc=' + item.name
				})
			},
			goSearch() {
				uni.navigateTo({
					url: 'search/search'
				})
			},
			getCompanyStation,
			gomagicBox,
			goSoCard,
			attentionMember(item) {
				if (item.isFollowed == 0) {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.orgId,
						sign: 0,
						type: 2
					}).then(res => {
						if (res.data.code == 0) {
							item.isFollowed = 1
						}
					})
				} else {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.orgId,
						sign: 1,
						type: 2
					}).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: "取消关注成功",
								icon: "none",
							});
							item.isFollowed = 0
						}
					})
				}
			},
		},
		onLoad() {
			this.userId = uni.getStorageSync('userinfo').user_id
			this.oss = this.$oss
			this.$http
				.get('dms/app/square/shop_index')
				.then(res => {
					this.data = res.data.data;
				});
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 0 32rpx;
	}

	.center {
		display: flex;
		justify-content: center;
	}

	.content {
		width: 100%;
		height: 270rpx;
		margin-top: 40rpx;

		.content-item {
			width: 670rpx;
			height: 270rpx;

			.img {
				width: 670rpx;
				height: 270rpx;
				margin-left: 40rpx;
				border-radius: 30rpx;
			}
		}
	}

	.scroll-tag {
		margin-top: 40rpx;
		display: flex;

		.contentTag {
			display: flex;
			margin-left: 10rpx;
			display: flex;
			white-space: nowrap;

			.tagList {
				margin-left: 30rpx;
				height: 54rpx;
				border-radius: 27rpx;
				background-color: #2F80FF;
				padding: 0 20rpx;

				.tagName {
					font-size: 24rpx;
					line-height: 34rpx;
				}

				.rightImg {
					height: 24rpx;
					width: 24rpx;
					margin-left: 10rpx;
				}
			}
		}
	}

	.magicBoxWrap {
		margin-top: 40rpx;

		.magicBoxTitle {
			width: 670rpx;
			margin-left: 40rpx;
		}

		.scroll-magicBox {
			margin-top: 40rpx;
			display: flex;

			.contentMagicBox {
				display: flex;
				margin-left: 20rpx;

				.magicBoxList {
					margin-left: 30rpx;
					width: 144rpx;

					.img {
						width: 144rpx;
						height: 144rpx;
						border-radius: 30rpx;
					}

					.magicBoxName {
						margin-top: 10rpx;
						line-height: 34rpx;
						font-size: 24rpx;
						width: 144rpx;
					}
				}

				.list {
					.imageUrl {
						margin-left: 20rpx;
						width: 516rpx;
						height: 258rpx;
						border-radius: 30rpx;
					}
				}
			}
		}
	}

	.search {
		padding: 18rpx 32rpx;
		margin: 16rpx 0;
		border-radius: 60rpx;
		background-color: #F5f7f8;
		display: flex;
		flex-direction: row;
		align-items: center;

		.search-icon {
			height: 32rpx;
			width: 32rpx;
		}

		.search-text {
			flex: 1;
			font-size: 28rpx;
			padding: 0 14rpx;
			color: #666769;
		}

		.inputDefault {
			font-size: 28rpx;
			color: #919397;
		}
	}

	.poster-swiper {
		margin-top: 40rpx;
		width: 670rpx;
		height: 270rpx;
		border-radius: 30rpx
	}

	.recommend {
		margin-left: 10rpx;
		display: flex;

		.recommend-item {
			display: flex;
			flex-direction: column;
			margin-left: 30rpx;
			height: 364rpx;
			border-radius: 30rpx;
			width: 240rpx;
			border: 1rpx solid rgba(247, 68, 55, 0.1);

			.avatarView {
				margin-top: 40rpx;
				width: 100rpx;
				height: 100rpx;
				padding: 0 70rpx;
				border-radius: 30rpx;

				.avatar {
					width: 100rpx;
					height: 100rpx;
				}
			}

			.name {
				width: 154rpx;
				height: 80rpx;
				margin-top: 32rpx;
				text-align: center;
				color: #919397;
				font-size: 24rpx;
				line-height: 40rpx;
			}

			.attention {
				margin-top: 34rpx;
				font-size: 24rpx;
				font-weight: bold;
				line-height: 32rpx;
				padding: 4rpx 16rpx;
				border-radius: 21rpx;
			}
		}
	}
</style>
