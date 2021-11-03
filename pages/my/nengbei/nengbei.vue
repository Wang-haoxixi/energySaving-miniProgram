<template>
	<view class="page">
		<view class="top">
			<view class="top-title">余额：<text class="top-content">{{$isEmpty(data.balance)?0:data.balance}}</text></view>
		</view>
		<view class="my-item" @tap="transfer">
			<image v-if="oss" class="my-item-icon" :src="oss + 'icon_my_transfer.png'"></image>
			<view class="my-item-text">转账</view>
			<view class="my-item-end">给好友转账</view>
			<image v-if="oss" class="my-item-right" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="my-item" @tap="order">
			<image v-if="oss" class="my-item-icon" :src="oss + 'icon_my_order.png'"></image>
			<view class="my-item-text">账单</view>
			<view class="my-item-end">查看所有账单</view>
			<image v-if="oss" class="my-item-right" :src="oss + 'icon_right_gray.png'"></image>
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
		methods:{
			order(){
				uni.navigateTo({
					url: 'billList/billList'
				})
			},
			transfer(){
				uni.showActionSheet({
				    itemList: ['转给组织', '转给个人'],
				    success: function (res) {
				        // console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if(res.tapIndex==0){
							uni.navigateTo({
								// type动态顶部title，role与so转账区分开
								url:`/pages/my/nengbei/transferList/transferList?type=1&role=user`
							})
						}else if(res.tapIndex==1){
							uni.navigateTo({
								url:`/pages/my/nengbei/transferList/transferList?type=2&role=user`
							})
						}
				    },
				    fail: function (res) {
				        // console.log(res.errMsg);
				    }
				});
			}
		},
		onLoad() {
			this.oss = this.$oss;
		},
		onShow() {
			this.$http.get('fms/app/red/account').then(res => {
				this.data = res.data.data;
			});
		}
	}
</script>

<style lang="scss">
	.top {
		text-align: right;
		line-height: 136rpx;
		color: #FFFFFF;
		width: 670rpx;
		height: 136rpx;
		background-image: url('https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/bg_my_nengbei.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		margin: 32rpx;

		.top-title {
			font-size: 28rpx;
		}

		.top-content {
			font-size: 36rpx;
			font-weight: bold;
			padding-right: 40rpx;
		}
	}

	.my-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 32rpx;
		margin-right: 32rpx;
		padding-top: 24rpx;
		padding-bottom: 24rpx;
		margin-top: 24rpx;

		.my-item-icon {
			height: 48rpx;
			width: 48rpx;
		}

		.my-item-text {
			color: #666769;
			margin-left: 20rpx;
			font-size: 28rpx;
			flex: 1;
		}

		.my-item-end {
			font-size: 24rpx;
			color: #919397;
			margin-right: 4rpx;
		}

		.my-item-right {
			height: 44rpx;
			width: 44rpx;
		}
	}
</style>
