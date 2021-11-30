<template>
	<view>
		<view class="top">
			<view :style="{paddingTop: menuButton.bottom + 'px'}">
				<view v-if="isLogin">
					<view class="title" @tap="information">
						<view class="avatar">
							<image class="avatar" v-if="data.avatar" :src="imageError(data.avatar,$oss)" mode="aspectFill"></image>
						</view>
						<view class="content">
							<view class="name">
								{{ $isEmpty(data.realName)?'':data.realName }}
							</view>
							<view class="tag-list">
								<view class="tag" style="background: rgba(247, 55, 55, .2);color: #F73737;" @tap.stop="goWebView('redness')">
									<view class="tag-text">活跃度：<text class="bold">V{{ $isEmpty(data.redness)?'0':data.redness }}</text> </view>
									<image v-if="oss" class="tag-right" :src="oss + 'icon_my_right_red.png'"></image>
								</view>
								<view class="tag bg_color_F737E31A color_F737E3" @tap.stop="navigateTo('partner')">
									<view class="tag-text">合伙人：<text class="bold">V{{ $isEmpty(data.rank)?'0':data.rank }}</text></view>
									<image v-if="oss" class="tag-right" :src="oss + 'icon_my_right_purple.png'"></image>
								</view>
							</view>
						</view>
						<image v-if="oss" class="title-right" :src="oss + 'icon_my_right_gray.png'"></image>
					</view>
					<view class="exponent">
						<view class="exponent-item" @tap="goWebView('userFaith')">
							<view class="exponent-title">{{ $isEmpty(data.exponent.credit)?'0':data.exponent.credit }}</view>
							<view class="exponent-content">信用值</view>
						</view>
						<view class="exponent-item" @tap="navigateTo('nengbei')">
							<view class="exponent-title">{{ $isEmpty(data.exponent.bellAssets)?'0':parseInt(data.exponent.bellAssets) }}</view>
							<view class="exponent-content">能贝</view>
						</view>
						<view class="exponent-item" @tap="navigateTo('ownSoList')">
							<view class="exponent-title">{{ $isEmpty(data.exponent.soCount)?'0':data.exponent.soCount }}</view>
							<view class="exponent-content">组织</view>
						</view>
						<view class="exponent-item" @tap="goTaskList">
							<view class="exponent-title">{{ $isEmpty(data.exponent.taskCount)?'0':data.exponent.taskCount }}</view>
							<view class="exponent-content">任务</view>
						</view>
					</view>
				</view>
				<view v-else>
					<view class="title" @tap="login">
						<view class="avatar">
							<!-- <image v-if="oss" class="avatar" :src="oss + 'default_littleIcon.png'" mode="aspectFill"></image> -->
							<image v-if="oss" class="avatar" :src="oss + 'icon_energy_default_miniavatar.png'" mode="aspectFill"></image>
						</view>
						<view class="content">
							<view class="login">注册/登录</view>
						</view>
						<image v-if="oss" class="title-right" :src="oss + 'icon_my_right_gray.png'"></image>
					</view>
					<view class="exponent">
						<view class="exponent-item">
							<view class="exponent-title">0</view>
							<view class="exponent-content">信用值</view>
						</view>
						<view class="exponent-item">
							<view class="exponent-title">0</view>
							<view class="exponent-content">能贝</view>
						</view>
						<view class="exponent-item">
							<view class="exponent-title">0</view>
							<view class="exponent-content">组织</view>
						</view>
						<view class="exponent-item">
							<view class="exponent-title">0</view>
							<view class="exponent-content">任务数</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="function">
			<view class="function-title">
				常用功能
			</view>
			<view class="function-list">
				<view class="item" @tap="navigateTo('meeting')">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_activity.png'"> </image>
					<view class="item-text">
						活动
					</view>
				</view>
				<view class="item" @tap="navigateTo('orderList')">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_order_new.png'"> </image>
					<view class="item-text">
						订单
					</view>
				</view>
				<view class="item" @tap="navigateTo('ownThoughtsList')">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_talkabout.png'"> </image>
					<view class="item-text">
						动态
					</view>
				</view>
				<!-- <view class="item">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_dig.png'"> </image>
					<view class="item-text">
						挖贝任务
					</view>
				</view> -->
				<view class="item" @tap="navigateTo('attention')">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_attention_new.png'"> </image>
					<view class="item-text">
						关注
					</view>
				</view>
				<view class="item" @tap="navigateTo('favorites')">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_fav.png'"> </image>
					<view class="item-text">
						收藏
					</view>
				</view>
				<!-- <view class="item" @tap="navigateTo('examination')">					
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_exam.png'"> </image>
					<view class="item-text">
						考试
					</view>
				</view> -->
				<!-- <view class="item" @tap="navigateTo('recruit')">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_recruit.png'"> </image>
					<view class="item-text">
						应聘
					</view>
				</view> -->
				<!-- <view class="item">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_statistical.png'"> </image>
					<view class="item-text">
						统计
					</view>
				</view> -->
				<view class="item" @tap="navigateTo('publishList')">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_publish.png'"> </image>
					<view class="item-text">
						发布
					</view>
				</view>
				<!-- <view class="item">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_download.png'"> </image>
					<view class="item-text">
						下载
					</view>
				</view> -->
				<view class="item" @tap="navigateTo('payPassword')">
					<image v-if="oss" class="item-icon" :src="oss + 'icon_my_setup.png'"> </image>
					<view class="item-text">
						设置
					</view>
				</view>
			</view>
		</view>
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
				data: {
					exponent: {
						taskCount: 0,
						credit: 0,
						soCount: 0,
					},
					redness: 0
				},
				isLogin: false,
				oss: '',
				menuButton: {},
			};
		},
		methods: {
			imageError,
			login() {
				uni.navigateTo({
					url: '../getUserInfo/getUserInfo'
				});
			},
			navigateTo(url) {
				uni.navigateTo({
					url: '../my/' + url + '/' + url
				});
			},
			goWebView(type) {
				uni.navigateTo({
					url: '../webView/webView?type=' + type
				});
			},
			information() {
				uni.navigateTo({
					url: '../my/information/information?data=' + this.data
				});
			},
			service() {
				uni.navigateTo({
					url: '../my/service/service?realName=' + this.data.realName + '&avatar=' + this.data.avatar
				});
			},
			goTaskList() {
				uni.navigateTo({
					url: "/pages/find/cooperation/cooperation"
				})
			},
			getCompanyStation,
		},
		async onShow() {
			const page = this.$mp.page
			await this.$onLaunched;
			if (typeof page.getTabBar === 'function' &&
				page.getTabBar()) {
				page.getTabBar().setData({
					selected: 4
				})
			}
			// if (typeof page.getTabBar === 'function' &&  
			//     page.getTabBar()) {  
			//     page.getTabBar().setData({  
			//         selected: 3
			//     })  
			// }
			this.isLogin = !this.$isEmpty(uni.getStorageSync('token'));
			if (this.isLogin) {
				this.$http.get('admin/app/my').then(res => {
					console.log('res..',res)
					this.data = res.data.data;
					uni.setStorageSync('user', res.data.data);
				});
			}
		},
		onLoad() {
			this.oss = this.$oss;
			this.menuButton = uni.getMenuButtonBoundingClientRect();
		}
	};
</script>

<style lang="scss">
	page {
		margin-bottom: 100rpx;
	}

	.top {
		background-image: url('https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/EnergySaving/pic_energy_my_bg.png');
		width: 750rpx;
		height: 480rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.title {
			padding: 20rpx 24rpx 0 40rpx;
			display: flex;
			align-items: center;

			.avatar {
				width: 132rpx;
				height: 132rpx;
				border-radius: 50%;
			}

			.content {
				margin-left: 24rpx;
				flex: 1;

				.name {
					color: #303031;
					font-size: 36rpx;
					line-height: 50rpx;
					font-weight: bold;
				}

				.login {
					color: #919397;
					font-size: 36rpx;
					line-height: 50rpx;
				}

				.tag-list {
					margin-top: 20rpx;
					display: flex;

					.tag {
						padding: 8rpx 16rpx;
						border-radius: 22rpx;
						margin-right: 20rpx;
						display: flex;
						align-items: center;

						.tag-text {
							font-size: 20rpx;
							line-height: 20rpx;
						}

						.tag-right {
							width: 18rpx;
							height: 28rpx;
						}
					}
				}
			}

			.title-right {
				width: 44rpx;
				height: 44rpx;
			}
		}

		.exponent {
			margin-top: 60rpx;
			display: flex;

			.exponent-item {
				flex: 1;
				text-align: center;

				.exponent-title {
					font-weight: bold;
					font-size: 36rpx;
					color: #303031;
					line-height: 42rpx;
				}

				.exponent-content {
					margin-top: 10rpx;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #919397;
				}
			}
		}
	}

	.function {
		margin-top: 60rpx;

		.function-title {
			margin-left: 40rpx;
			font-size: #303031;
			line-height: 44rpx;
			font-weight: bold;
		}

		.function-list {
			margin-top: 40rpx;
			display: flex;
			flex-wrap: wrap;

			.item {
				width: 187.5rpx;
				margin-bottom: 30rpx;
				text-align: center;

				.item-icon {
					width: 64rpx;
					height: 64rpx;
				}

				.item-text {
					color: #666769;
					font-size: 24rpx;
					margin-top: 10rpx;
					line-height: 34rpx;
				}
			}
		}
	}
</style>
