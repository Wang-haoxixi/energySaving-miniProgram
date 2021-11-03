<template>
	<view class="page">
		<view class="top">
			<view class="top-title">余额：<text class="top-content">{{$isEmpty(data.balance)?0:data.balance}}</text></view>
		</view>
		<view class="my-item" @tap="transfer" v-if="isAdmin==1||isAdmin==2">
			<image v-if="oss" class="my-item-icon" :src="oss + 'icon_my_transfer.png'"></image>
			<view class="my-item-text">宝贝转账</view>
			<image v-if="oss" class="my-item-right" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="my-item" @tap="order">
			<image v-if="oss" class="my-item-icon" :src="oss + 'icon_my_order.png'"></image>
			<view class="my-item-text">流水明细</view>
			<image v-if="oss" class="my-item-right" :src="oss + 'icon_right_gray.png'"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: '',
				oss: '',
				id:'',
				isAdmin:''
			};
		},
		methods:{
			order(){
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/dataAssets/manageAssets/manageSoBillList/manageSoBillList?id=${this.id}`
				})
			},
			transfer(){
				let that =this
				uni.showActionSheet({
				    itemList: ['转给组织', '转给个人'],
				    success: function (res) {
				        // console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if(res.tapIndex==0){
							uni.navigateTo({
								url:`/pages/my/nengbei/transferList/transferList?type=1&role=so&senderId=${that.id}`
							})
						}else if(res.tapIndex==1){
							uni.navigateTo({
								url:`/pages/my/nengbei/transferList/transferList?type=2&role=so&senderId=${that.id}`
							})
						}
				    },
				    fail: function (res) {
				        // console.log(res.errMsg);
				    }
				});
			}
		},
		onLoad(options) {
			this.oss = this.$oss;
			this.id =options.orgId
			this.isAdmin=options.isAdmin
			console.log(this.isAdmin)
			this.$http.get('fms/account/balance/valuation',{
				params:{
					id:options.orgId,
					type:3
				}
			}).then(res => {
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
		width: 686rpx;
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
		margin-top: 20rpx;

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
