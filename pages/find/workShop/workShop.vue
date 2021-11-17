<template>
	<view class="container safe-bottom">
		<view class="search" @tap="goSearch">
			<image v-if="oss" class="search-icon" :src="oss+'icon_search_gray.png'"></image>
			<input class="search-text" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"
			 disabled="true" />
		</view>
		<banner slotNumber="app_activity_page" :customStyle="{width:'702rpx',margin:'0 24rpx'}"></banner>
		<view class="wrapType">
			<view class="typeList" v-for="(item,index) in data.type" :key="index" @tap="typeSearch(item)">
				<image class="typeImg" :src="item.pictureAddress"></image>
				<view class="color_666769 typeName">{{$isEmpty(item.name)?'':item.name}}</view>
			</view>
		</view>
		<view class="contentWrap">
			<view class="flexRowStart recommendTitle" v-if="!$isEmpty(data.recommendList) && data.recommendList.length>0">
				<image :src="$ossUrl('icon_energy_activitycenter _tuijian.png')" mode="" style="width: 36rpx;height: 40rpx;margin-right: 12rpx;"></image>
				<view class="color_303031">强烈推荐</view>
			</view>
			<swiper v-if="!$isEmpty(data.recommendList) && data.recommendList.length>0"  class="recommend-swiper" :style="{height:[data.recommendList.length>2?'882rpx':'476rpx']}" circular indicator-dots autoplay indicator-color="#9DD4C2" indicator-active-color="#46B28B">
				<swiper-item class="recommend-swiper-item">
					<view v-if="index<4" class="recommend-swiper-view" v-for="(item,index) in data.recommendList" :key="index" @tap="detail(item)">
						<image class="recommend-swiper-view-img" mode="aspectFill" :src="item.poster"></image>
						<view class="flexColumnStart" style="justify-content: space-between;height: 186rpx;">
							<view class="doubleEllipsis bold color_303031 name">{{$isEmpty(item.name)?'':item.name}}</view>
							<view class="city">{{$isEmpty(item.startTime)?'':item.startTime.substring(0,10)}}
								| {{ $isEmpty(item.city)?'':item.city }}</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item class="recommend-swiper-item" v-if="!$isEmpty(data.recommendList) && data.recommendList.length>4">
					<view v-if="index>3" class="recommend-swiper-view" v-for="(item,index) in data.recommendList" :key="index" @tap="detail(item)">
						<image class="recommend-swiper-view-img" mode="aspectFit" :src="item.poster"></image>
						<view class="flexColumnStart" style="justify-content: space-between;height: 186rpx;">
							<view class="doubleEllipsis bold color_303031 name">{{item.name}}</view>
							<view class="city">{{$isEmpty(item.startTime)?'':item.startTime.substring(0,10)}}
								| {{ $isEmpty(item.city)?'':item.city }}</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="color_303031 likeTitle" v-if="data.loveList && data.loveList.length>0">猜你喜欢</view>
			<view class="loveList" v-for="(item,index) in data.loveList" :key="index" @tap="detail(item)">
				<view class="loveList-item">
					<view class="flexRowStart">
						<image :src="item.poster" mode="aspectFill" class="posterImg"></image>
						<view class="loveList-item-info flexColumnStart">
							<view class="bold doubleEllipsis name">{{item.name}}</view>
							<view>
								<view class="color_3CD489 typeInfo" v-if="item.ticketingManagements &&item.ticketingManagements[0].ticketingType === '1'">免费</view>
								<view class="color_F74437 typeInfo" v-if="item.ticketingManagements &&item.ticketingManagements[0].ticketingType === '2'">{{ getMoney(item.ticketingManagements[0])}}</view>
								<view class="color_919397 city">{{$isEmpty(item.startTime)?'':item.startTime.substring(0,10)}}
									|
									{{ $isEmpty(item.city)?'':item.city }}</view>
							</view>
						</view>
					</view>
					<view class="flexRow soInfo">
						<view class="color_666769 type">{{ $isEmpty(item.type)?'':item.type }}</view>
						<button class="btn"  @tap.stop="detail(item)">立即抢票</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: '',
				oss: ''
			};
		},
		methods: {
			getMoney(ticket) {
				if (ticket.canMoney != '' && ticket.money == '') {
					return `${ticket.canMoney}贝`;
				} else if (ticket.money != '' && ticket.canMoney == '') {
					return `${ticket.money}元`;
				} else if (ticket.money != '' && ticket.canMoney != '') {
					return `${ticket.canMoney}贝/${ticket.money}元`;
				}else{
					return `0`;
				}
			},
			detail(item) {
				// console.log(item.id)
				uni.navigateTo({
					url: '../../contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=' + item.id,
				})
			},
			typeSearch(item) {
				uni.navigateTo({
					url: 'activity/activity?status=' + item.type + '&typeName=' + item.name
				})
			},
			goSearch() {
				uni.navigateTo({
					url:'/pages/find/workShop/searchActivity/searchActivity'
				})
			}
		},
		onLoad() {
			this.oss = this.$oss
			this.$http
				.get('qms/conference_publish/activitie_home')
				.then(res => {
					this.data = res.data.data;
				});
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5f7f8;
	}
	.search {
		margin: 16rpx 32rpx;
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #FFFFFF;
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


	.recommend-swiper {
		// padding-left: 10rpx;
		// margin-top: 40rpx;
		width: 100%;
	}

	.recommend-swiper-item {
		width: 702rpx !important;
		padding:0 24rpx;
		// height: 806rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.recommend-swiper-view {
		width: 342rpx;
		height: 390rpx;
		border-radius: 16rpx;
		background-color: #FFFFFF;

		.recommend-swiper-view-img {
			width: 100%;
			height: 204rpx;
			border-radius: 16rpx 16rpx 0 0;
		}

		.name {
			font-size: 28rpx;
			line-height: 40rpx;
			margin-top: 20rpx;
			padding: 0 16rpx;
		}

		.city {
			font-size: 24rpx;
			line-height: 34rpx;
			margin-bottom: 32rpx;
			padding: 0 16rpx;
			color: #BCC4CB;
		}
	}

	// .poster-swiper-item {
	// 	display: block;
	// 	height: 276rpx;
	// 	line-height: 276rpx;
	// 	text-align: center;
	// 	width: 670rpx;
	// 	border-radius: 30rpx
	// }

	.container {

		.title {
			margin-top: 32rpx;
			display: flex;

			.titleInfo {
				margin: 0 32rpx;
				border-radius: 28rpx;
				background-color: #F744371A;
				padding: 8rpx 32rpx;
				line-height: 40rpx;
				font-size: 28rpx;
			}
		}

		.wrapType {
			margin-top: 48rpx;
			display: flex;

			.typeList {
				flex: 1;
				text-align: center;

				.typeImg {
					width: 80rpx;
					height: 80rpx;
				}

				.typeName {
					text-align: center;
					font-size: 24rpx;
					line-height: 34rpx;
					margin-top: 16rpx;
				}
			}
		}

		.contentWrap {
			margin-top: 32rpx;

			.recommendTitle {
				padding: 28rpx 24rpx;
				font-size: 36rpx;
				line-height: 50rpx;
				font-weight: bolder;
			}

			.likeTitle {
				padding: 28rpx 24rpx;
				font-size: 36rpx;
				line-height: 50rpx;
				margin-top: 32rpx;
				font-weight: bolder;
			}

			.loveList {
				// border-bottom: #EFF0F1 0.3rpx solid;
				margin:0px 24rpx 16rpx;
				background-color: #FFFFFF;
				border-radius: 16rpx;
				.loveList-item {
					padding: 24rpx;
					.posterImg {
						width: 300rpx;
						height: 180rpx;
						border-radius: 20rpx;
					}

					.loveList-item-info {
						height: 180rpx;
						margin-left: 30rpx;
						flex: 1;
						justify-content: space-between;

						.name {
							font-size: 28rpx;
							line-height: 40rpx;
						}

						.typeInfo {
							font-size: 28rpx;
							line-height: 40rpx;
						}

						.city {
							font-size: 24rpx;
							line-height: 34rpx;
							margin-top: 14rpx;
						}
					}
				}

				.soInfo {
					margin-top: 24rpx;

					.type {
						font-size: 24rpx;
						flex: 1;
						color: #9AA1A7;
						line-height: 40rpx;
					}
					.btn{
						width: 160rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						font-size: 24rpx;
						color: #FFFFFF;					
						// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
						background-color: #46B28B;
						border-radius: 38rpx;
					}
				}
			}
		}
	}
</style>
