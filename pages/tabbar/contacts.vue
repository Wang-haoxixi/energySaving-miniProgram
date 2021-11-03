<template>
	<view class="container">
		<view :style="{ height: systemInfo.statusBarHeight + 'px' }"></view>
		<view class="title" id="title"
			:style="{height:menuButton.height +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height) *2 +'px',width:systemInfo.safeArea.width -(systemInfo.safeArea.width - menuButton.left) +'px',padding:'0 0 ' +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height +'px'),lineHeight: menuButton.height + 'px',}">
			<view class="search" @tap="goSearch">
				<image class="search-icon" :src="$ossUrl('icon_search_gray.png')"></image>
				<input class="search-input" placeholder="搜索服务名称快速协作" disabled />
			</view>
		</view>
		<view class="" style="height: 48rpx;width: 100%;" id="gap"></view>
		<view class="flexRow">
			<scroll-view scroll-y="true" style="width: 176rpx;background-color: #F5F7F8;"
				:style="{height:scrollHeight+'px'}">
				<view v-for="(item,index) of data" :key="index" class="scroll_item" :class="index==current?'active':''"
					@tap="changeType(item,index)">
					<view class="icon_line" v-show="index==current" style="position: absolute;top: 40rpx;left: 0px;">
					</view>
					<view class="">
						{{item.name}}
					</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" scroll-with-animation
				style="flex: 1;background-color: #FFFFFF;padding: 0 26rpx 0 20rpx;" :style="{height:scrollHeight+'px'}">
				<view class="class-item" v-for="(item, index) in data[ current ].children" :key='index'>
					<view class="typeTitle">
						{{ item.name }}
					</view>
					<view class="typeWrap">
						<view class="typeTitleItem" @tap="goServiceList(item2)" v-for="(item2,index2) in item.children"
							:key='index2'>
							<image :src="item2.icon" class="typeIcon"></image>
							<view class="typeName">
								{{ item2.name }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		isEmpty,
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				systemInfo: '',
				menuButton: '',
				data: {},
				scrollHeight: '',
				current: 0,
				//跳转传值要用
				name: '节能产业',
			}
		},
		onLoad() {
			this.menuButton = uni.getMenuButtonBoundingClientRect();
			this.systemInfo = uni.getSystemInfoSync();
			this.$http.get('dms/product/type/tree').then(res => {
				this.data = res.data.data
			});
		},
		async onShow() {
			const page = this.$mp.page
			await this.$onLaunched
			if (typeof page.getTabBar === 'function' &&
				page.getTabBar()) {
				page.getTabBar().setData({
					selected: 1
				})
			}
			uni.createSelectorQuery()
				.in(this)
				.select('#title')
				.boundingClientRect()
				.select('#gap')
				.boundingClientRect()
				.exec(ret => {
					console.log('ret..', ret)
					console.log('windowHeight..', uni.getSystemInfoSync().windowHeight)
					let height = uni.getSystemInfoSync().windowHeight - this.systemInfo.statusBarHeight - ret[0]
						.height;
					// this.scrollHeight = height - ret[1].height - 140 / 750 * wx.getSystemInfoSync().windowWidth
					this.scrollHeight = height - ret[1].height - 50

					switch (uni.getSystemInfoSync().platform) {
						case 'android':
							this.scrollHeight = height - ret[1].height - 50
							console.log('客户端是Android')
							break;
						case 'ios':
							console.log('客户端是iOS')
							this.scrollHeight = height - ret[1].height - 84
							break;
						case 'devtools':
							this.scrollHeight = height - ret[1].height - 84
							console.log('客户端是在开发者工具上')
							break;
						default:
							console.log('客户端是在其他工具上')
							break;
					}
				});
		},
		methods: {
			changeType(item, index) {
				this.current = index
				this.name = item.name
			},
			goSearch() {
				uni.navigateTo({
					url: '/pages/find/magicBox/search/search'
				})
			},
			goServiceList(item) {
				uni.navigateTo({
					url: '/pages/find/magicBox/more/more?tag=' + item.name + '&orderTypeName=' + this.name +
						'&type=' + item.productType
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.icon_line {
		width: 4rpx;
		height: 28rpx;
		background: linear-gradient(180deg, #FF825C 0%, #FF3636 100%);
		border-radius: 6px;
	}

	.active {
		background-color: #FFFFFF;
		color: #F73737 !important;
	}

	.scroll_item {
		color: #272727;
		font-size: 28rpx;
		line-height: 106rpx;
		width: 176rpx;
		height: 106rpx;
		text-align: center;
		position: relative;
	}


	.typeTitle {
		color: #272727;
		font-size: 30rpx;
		font-weight: 500;
		line-height: 21px;
		padding: 32rpx 0 32rpx 20rpx;
	}

	.typeWrap {
		margin-bottom: 48rpx;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-row-gap: 15px;

		.typeTitleItem {
			padding: 0 10px;
			box-sizing: border-box;
			width: 176rpx;
			height: 188rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.typeIcon {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-bottom: 16rpx;
			}

			.typeName {
				text-align: center;
				font-size: 24rpx;
				line-height: 36rpx;
				color: #565B5F;
				width: 136rpx;
				height: 72rpx;

				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}
	}

	.title {
		display: flex;

		.search {
			display: flex;
			flex: 1;
			height: 100%;
			background: #f3f7f9;
			padding: 0 32rpx;
			margin: 0 32rpx;
			border-radius: 40rpx;
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
</style>
