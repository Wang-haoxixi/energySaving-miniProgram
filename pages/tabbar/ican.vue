<template>
	<view>
		<view class="top">
			<view :style="{ height: systemInfo.statusBarHeight + 'px' }"></view>
			<view class="title"
				:style="{height:menuButton.height +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height) *2 +'px',width:systemInfo.safeArea.width -(systemInfo.safeArea.width - menuButton.left) +'px',padding:'0 0 ' +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height +'px'),lineHeight: menuButton.height + 'px',}">
				<view class="search" @tap="goSearch">
					<image class="search-icon" :src="$ossUrl('icon_search_gray.png')"></image>
					<input class="search-input" placeholder="搜索" disabled/>
				</view>
			</view>
			<!-- <banner slotNumber="module_home_banner" :customStyle="{width:'702rpx',margin:'0 24rpx'}"></banner> -->
			<banner slotNumber="energy_mini_home_banner" :customStyle="{width:'702rpx',margin:'0 24rpx'}"></banner>
			<view class="function_centry flexRowStart">
				<view class="function_centry_item flexColumn" @tap="goServiceCenter">
					<image :src="$ossUrl('home_function_store.png')" mode="" class="img"></image>
					<view class="function_centry_item_title">
						应用组件
					</view>
				</view>
				<view class="function_centry_item flexColumn" @tap="goFunction('specialList')">
					<image :src="$ossUrl('home_function_specialist.png')" mode="" class="img"></image>
					<view class="function_centry_item_title">
						行业大咖
					</view>
				</view>
				<view class="function_centry_item flexColumn" @tap="goActivityCenter">
					<image :src="$ossUrl('home_function_activity.png')" mode="" class="img"></image>
					<view class="function_centry_item_title">
						活动中心
					</view>
				</view>
				<view class="function_centry_item flexColumn" @tap="goFunction('publishService')">
					<image :src="$ossUrl('home_publish.png')" mode="" class="img"></image>
					<view class="function_centry_item_title">
						立即发布
					</view>
				</view>
			</view>
			<view class="service_title flexRow">
				<view>精选服务</view>
				<view class="service_title_more flexRowStart"  @tap="goServiceMore">
					<view>更多</view>
					<image :src="$ossUrl('home_arrowright.png')" mode="" class="rightImg"></image>
				</view>
			</view>
			<view class="service_list">
				<view class="service_list_item" v-for="(item,index) of serviceList.records" :key="index" @tap="goServiceDetails(item)">
					<view class="flexRowStart" style="margin-bottom: 24rpx;">
						<image :src="soImageError(item.orgImg,$oss)" mode="" class="avatar_img"></image>
						<view class="org_name">
							{{$isEmpty(item.orgName)?'':item.orgName}}
						</view>
					</view>
					<view class="flexRowStart">
						<image :src="soImageError(item.imageUrl,$oss)" mode="" class="poster_img"></image>
						<view class="service_info flexColumnStart" style="justify-content: space-between;">
							<view class="service_info_name doubleEllipsis">
								{{$isEmpty(item.name)?'':item.name}}
							</view>
							<view class="flexColumnStart service_info_else">
								<view class="flexRow service_info_else_star">
									<view class="flexRowStart">
										<!-- <image :src="$ossUrl('home_star.png')" mode="" class="star_img"></image> -->
										<view class="" style="margin-top: 10rpx;">
											<uni-rate margin="2" size="28" disabled="true" :value="item.score"></uni-rate>
										</view>
										<view class="" v-if="item.score" style="margin-left: 16rpx;">
											{{$isEmpty(item.score)?'':item.score.toFixed(1)}}
										</view>
										<view class="bold" v-else style="margin-left: 16rpx;">
											暂无评分
										</view>
									</view>
									<!-- <view class="action">
										在线咨询
									</view> -->
								</view>
								<view class="service_info_else_price" v-if="item.isFree == 0">
									<!-- <view class="" v-if="item.payCurrency==1">
										{{$isEmpty(item.price)?'0':item.price}}贝
									</view>
									<view class="" v-else-if="item.payCurrency==2">
										{{$isEmpty(item.cash)?'0':item.cash}}元
									</view>
									<view class="" v-else-if="item.payCurrency==9">
										{{$isEmpty(item.price)?'0':item.price}}贝/{{$isEmpty(item.cash)?'0':item.cash}}元
									</view> -->
									<view class="">
										{{$isEmpty(item.cash)?'0':item.cash}}元
									</view>
								</view>
								<view class="service_info_else_price" v-else>
									免费
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="service_title flexRow">
				<view>精选干货</view>
				<view class="service_title_more flexRowStart" @tap="goList('shareList')">
					<view>更多</view>
					<image :src="$ossUrl('home_arrowright.png')" mode="" class="rightImg"></image>
				</view>
			</view>
			<view class="share_list">
				<view class="share_list_item" v-for="(item,index) of shareList.records" :key="index" @tap="goShareDetails(item)">
					<view class="share_list_item_name doubleEllipsis">
						{{$isEmpty(item.materialName)?'':item.materialName}}
					</view>
					<view class="share_list_item_info doubleEllipsis">
						{{$isEmpty(item.materialIntro)?'':item.materialIntro}}
					</view>
					<view class="share_list_item_else flexRow">
						<view class="flexRowStart">
							<image :src="imageError(item.avatar,$oss)" mode="" class="avatar_img"></image>
							<view>
								{{$isEmpty(item.realName)?'暂无':item.realName}}
							</view>
						</view>
						<view style="color: #BCC4CB;">
							{{$isEmpty(item.createTime)?'':item.createTime.substring(0,10)}}
						</view>
					</view>
				</view>
				<uni-load-more :status="shareStatus" v-if="shareList.records.length>0"></uni-load-more>
				<view style="height: 178rpx;"></view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		banner
	} from '@/components/banner/banner.vue'
	import {
		imageError,
		soImageError
	} from '../../common/utils.js'
	export default {
		components: {
			banner
		},
		data() {
			return {
				systemInfo: '',
				menuButton: '',
				serviceList: {
					records: []
				},
				shareList: {
					records: []
				},
				shareStatus:'more',
				oss:''
			}
		},
		async onShow() {
			const page = this.$mp.page
			await this.$onLaunched;
			if (typeof page.getTabBar === 'function' &&
				page.getTabBar()) {
				page.getTabBar().setData({
					selected: 0
				})
			}
		},
		onLoad() {
			this.oss =this.$oss
			this.menuButton = uni.getMenuButtonBoundingClientRect();
			this.systemInfo = uni.getSystemInfoSync();
			this.$http.get('dms/app/product/shop_page', {
				params: {
					current: 1,
					size: 3,
					orderField: 'score',
					orderType: 'desc'
				}
			}).then(res => {
				this.serviceList = res.data.data;
				// this.serviceList.records.forEach(item=>{
				// 	item.orgImg = soImageError(item.orgImg,this.oss)
				// })
			});
			this.$http.get('dms/material/page', {
				params: {
					current: 1,
					size: 20,
					materialType: 1
				}
			}).then(res => {
				this.shareList = res.data.data;
				// this.shareList.records.forEach(item=>{
				// 	item.avatar = imageError(item.avatar,this.oss)
				if(!this.shareList.current<this.shareList.pages){
					this.shareStatus='nomore'
				}
				// })
			});
		},
		onReachBottom() {
			let that = this;
			if (that.shareList.current < that.shareList.pages) {
				that.shareStatus = 'loading';
				that.$http.get('dms/material/page', {
					params: {
						size: 10,
						materialType: 1,
						current: that.shareList.current + 1
					}
				}).then(res => {
					that.shareList.current = res.data.data.current;
					that.shareList.records = that.shareList.records.concat(res.data.data.records);
					that.shareStatus = 'more';
				});
			} else {
				that.shareStatus = 'noMore';
			}
		},
		methods: {
			imageError,
			soImageError,
			goSearch() {
				uni.navigateTo({
					url: "/pages/find/search/search"
				})
			},
			goActivityCenter() {
				uni.navigateTo({
					url: '/pages/find/workShop/workShop'
				})
			},
			goServiceCenter(){
				uni.navigateTo({
					url:'/pages/find/magicBox/more/more'
				})
			},
			goList(path){
				uni.navigateTo({
					url:`/pages/ican/${path}/${path}`
				})
			},
			goServiceMore(){
				uni.navigateTo({
					url: '/pages/find/magicBox/more/more'
				})
			},
			goFunction(path){
				uni.navigateTo({
					url:`/pages/ican/${path}/${path}`
				})
			},
			goShareDetails(item){
				uni.navigateTo({
					url:'/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id='+item.id
				})
			},
			goServiceDetails(item){
				uni.navigateTo({
					url:'/pages/find/magicBox/detail/detail?id='+item.id
				})
			}
		}
	}
</script>
<style lang="scss">
	.service_title {
		padding: 28rpx 24rpx;
		font-size: 36rpx;
		line-height: 50rpx;
		font-weight: bold;

		.service_title_more {
			font-size: 28rpx;
			line-height: 40rpx;
			color: #9AA1A7;
			font-weight: normal;
		}
	}

	.service_list {
		padding:0 24rpx;
		margin-bottom: 32rpx;

		.service_list_item {
			padding: 24rpx 24rpx 32rpx;
			background-color: #FFFFFF;
			margin-bottom: 16rpx;
			border-radius: 16rpx;

			.avatar_img {
				width: 44rpx;
				height: 44rpx;
				margin-right: 16rpx;
				border-radius: 50%;
			}

			.org_name {
				font-size: 26rpx;
				line-height: 36rpx;
				color: #565B5F;
			}

			.poster_img {
				width: 276rpx;
				height: 196rpx;
				border-radius: 16rpx;
				margin-right: 24rpx;
			}

			.service_info {
				flex: 1;
				height: 196rpx;

				.service_info_name {
					width: 100%;
					color: #272727;
					font-size: 30rpx;
					line-height: 48rpx;
					font-weight: bold;
				}

				.service_info_else {
					width: 100%;

					.service_info_else_price {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #F73737;
						// margin-bottom: 18rpx;
					}

					.service_info_else_star {
						width: 100%;
						color: #9AA1A7;
						font-size: 24rpx;
						line-height: 40rpx;
						margin-bottom: 22rpx;
						.star_img {
							width: 28rpx;
							height: 28rpx;
							margin-right: 8rpx;
						}

						.action {
							width: 160rpx;
							height: 50rpx;
							background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
							border-radius: 42rpx;
							color: #FFFFFF;
							text-align: center;
							line-height: 50rpx;
						}
					}
				}
			}
		}
	}

	.share_list {
		padding:0 24rpx;

		.share_list_item {
			padding: 32rpx 24rpx;
			background-color: #FFFFFF;
			margin-bottom: 16rpx;
			border-radius: 16rpx;
			.share_list_item_name{
				font-size: 30rpx;
				line-height: 44rpx;
				font-weight: bold;
				margin-bottom: 16rpx;
			}
			.share_list_item_info{
				font-size: 26rpx;
				line-height: 40rpx;
				color: #9AA1A7;
				margin-bottom: 32rpx;
			}
			.share_list_item_else{
				font-size: 22rpx;
				line-height: 32rpx;
				color: #565B5F;
				.avatar_img{
					width: 36rpx;
					height: 36rpx;
					margin-right: 8rpx;
					border-radius: 50%;
				}
			}
		}
	}

	.rightImg {
		width: 14rpx;
		height: 40rpx;
		margin-left: 16rpx;
	}

	page {
		background-color: #F7F9FA;
	}

	.function_centry {
		margin: 48rpx 40rpx 32rpx;

		.function_centry_item {
			margin-right: 90rpx;
			.img {
				width: 100rpx;
				height: 100rpx;
			}

			.function_centry_item_title {
				font-size: 24rpx;
				line-height: 34rpx;
				margin-top: 16rpx;
				color: #565B5F;
			}
		}
	}

	.top {
		width: 100vw;
		height: 1002rpx;
		background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);

		.title {
			display: flex;

			.search {
				display: flex;
				flex: 1;
				height: 100%;
				background: #f3f7f9;
				padding: 0 32rpx;
				margin: 0 32rpx;
				border-radius: 60rpx;
				align-items: center;

				.search-icon {
					width: 32rpx;
					height: 32rpx;
				}

				.search-input {
					width: 100%;
					height: 40rpx;
					min-height: 40rpx;
					padding-left: 10rpx;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}
	}
</style>
