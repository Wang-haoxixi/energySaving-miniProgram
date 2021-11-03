<template>
	<view>
		<view class="flexColumn">
			<image v-if="!data.length>0" :src="$ossUrl('pic_nothing_show.png')" mode="aspectFit"></image>
			<view class="emptyText" v-if="!data.length>0">
				暂无地址内容…
			</view>
		</view>
		<view class="item" v-for="(item,index) in data" :key="index" @longtap="delect(item)" @tap="choose(item)">
			<view class="item-top">
				<view class="default" v-if="item.isDefault == 1">
					默认
				</view>
				<view class="name">
					{{item.consignee}}
				</view>
				<image :src="$ossUrl('icon_edit_gray.png')" class="icon-edit" @tap.stop="edit(item)"></image>
			</view>
			<view class="phone">
				{{item.phone}}
			</view>
			<view class="address">
				{{item.cityArea}}{{item.address}}
			</view>
			<!-- <view class="item-bottom">
				<text class="postcode">{{item.zipCode}}</text>
				<text class="email">{{item.mail}}</text>
			</view> -->
		</view>
		<bottom-button>
			<view class="button" @tap="add">增加地址</view>
		</bottom-button>
	</view>
</template>

<script>
	import bottomButton from '@/components/bottomButton/bottomButton.vue'
	export default {
		components: {
			bottomButton
		},
		data() {
			return {
				data: [],
				order: false,
			};
		},
		methods: {
			choose(item) {
				if (this.order === true) {
					uni.setStorageSync('userReceiveAddress', item);
					uni.navigateBack();
				}
			},
			delect(item) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '你确定要删除吗？',
					success: function(res) {
						if (res.confirm) {
							that.$http.post('admin/receive_address/delete/' + item.id).then(res => {
								console.log(res)
								that.$http.get('admin/receive_address/list').then(res => {
									that.data = res.data.data;
								});
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			edit(item) {
				uni.navigateTo({
					url: 'editShippingAddress/editShippingAddress?type=edit&id=' + item.id,
				})
			},
			add() {
				uni.navigateTo({
					url: 'editShippingAddress/editShippingAddress',
				})
			}
		},
		onShow() {
			this.$http.get('admin/receive_address/list').then(res => {
				this.data = res.data.data;
			});
		},
		onLoad(option) {
			if (option.type == 'order') {
				this.order = true;
			}
		}
	}
</script>

<style lang="scss">
	.button {
		width: 686rpx;
	}

	.emptyText {
		text-align: center;
		margin-top: 40rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #919397;
	}

	.item {
		margin: 0 32rpx;
		padding: 32rpx 0;
		border-bottom: 0.3rpx solid #EFF0F1;

		.item-top {
			display: flex;
			align-items: center;

			.default {
				font-weight: bold;
				padding: 0 10rpx;
				background-color: #FEECEA;
				color: #F74437;
				font-size: 24rpx;
				line-height: 34rpx;
			}

			.name {
				margin-left: 10rpx;
				font-size: 32rpx;
				line-height: 44rpx;
				font-weight: bold;
				color: #000000;
				flex: 1;
			}

			.icon-edit {
				width: 44rpx;
				height: 44rpx;
			}
		}

		.phone {
			margin-top: 10rpx;
			color: #919397;
			font-size: 24rpx;
			line-height: 34rpx;
		}

		.address {
			font-size: 28rpx;
			color: #303031;
			line-height: 48rpx;
		}

		.item-bottom {
			margin-top: 20rpx;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #919397;

			.postcode {
				padding-right: 10rpx;
				border-right: 0.3rpx solid #EFF0F1;
			}

			.email {
				margin-left: 10rpx;
			}
		}
	}
</style>
