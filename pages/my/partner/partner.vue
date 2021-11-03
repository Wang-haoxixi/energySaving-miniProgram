<template>
	<view class="page">
		<view class="main">
			<view class="content">
				<view class="avatar">
					<image class="avatar" v-if="data.avatar" :src="imageError(data.avatar,$oss)" mode="aspectFill"></image>
				</view>
				<view class="base">
					<view class="name">
						{{ $isEmpty(data.realName)?'':data.realName }}
					</view>
					<view class="id">
						{{ $isEmpty(data.serialNo)?'':'NO.'+data.serialNo }}
					</view>
				</view>
				<view class="level">
					{{ $isEmpty(data.rank)?'':data.rank }}
				</view>
			</view>
			<view class="growing">
				<view class="growing-title">
					等级成长：
				</view>
				<view class="nextLevel">
					{{ $isEmpty(data.balance)?'':'距离下一级：'+data.balance }}
				</view>
			</view>
			<view class="progress">
				<progress stroke-width="3" border-radius="1.5" :percent="data.progress" activeColor="#FFFFFF" backgroundColor="#FFFFFF4D"></progress>
			</view>
		</view>
		<view class="title">
			合伙人权益
		</view>
		<view class="sub" @tap="goMagic">
			<view class="discount">
				<image v-if="oss" class="icon" :src="oss + 'icon_my_partner_tag.png'"></image>
				<view class="discount-text">
					{{ $isEmpty(data.discountRate)?'':data.discountRate+'折' }}
				</view>
			</view>
			<view class="proxy">
				代理产品
			</view>
		</view>
	</view>
</template>

<script>
	import {
			imageError
		} from '@/common/utils.js'
	export default {
		data() {
			return {
				oss: '',
				data: ''
			};
		},
		methods:{
			imageError,
			goMagic(){
				uni.switchTab({
					url:'/pages/tabbar/contacts'
				})
			}
		},
		onLoad() {
			this.oss = this.$oss;
			this.$http.get('dms/proxy/my/info').then(res => {
				this.data = res.data.data;
				this.data.progress = (this.data.nextBail - this.data.balance) / this.data.nextBail * 100
			})
		}
	}
</script>

<style lang="scss">
	.page {
		padding: 32rpx;

		.main {
			background-image: url('https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/bg_my_partner_main.png');
			// width: 610rpx;
			height: 208rpx;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			padding: 32rpx;

			.content {
				display: flex;
				align-items: center;

				.avatar {
					width: 92rpx;
					height: 92rpx;
					border-radius: 50%;
				}

				.base {
					margin-left: 24rpx;
					flex: 1;

					.name {
						font-weight: bold;
						color: #FFFFFF;
						font-size: 28rpx;
						line-height: 40rpx;
					}

					.id {
						font-size: 20rpx;
						line-height: 28rpx;
						color: #FFFFFFCC;
						margin-top: 10rpx;
					}
				}

				.level {
					background-image: url('https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/bg_my_partner_level.png');
					width: 88rpx;
					height: 42rpx;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					margin-right: -10rpx;
					padding: 32rpx 0 14rpx;
					text-align: center;
					color: #F74437;
					font-size: 36rpx;
					font-weight: bold;
					line-height: 42rpx;
				}
			}

			.growing {
				margin-top: 40rpx;
				display: flex;
				justify-content: space-between;

				.growing-title {
					font-weight: bold;
					color: #FFFFFF;
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.nextLevel {
					color: #FFFFFFCC;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			.progress {
				margin-top: 30rpx;
			}
		}

		.title {
			margin-top: 60rpx;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 44rpx;
			color: #303031;
		}

		.sub {
			margin-top: 40rpx;
			background-image: url('https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/bg_my_partner_sub.png');
			// width: 670rpx;
			height: 104rpx;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.discount {
				display: flex;
				align-items: center;

				.icon {
					margin-left: 26rpx;
					width: 36rpx;
					height: 36rpx;
				}

				.discount-text {
					color: #FFFFFF;
					font-size: 28rpx;
					line-height: 40rpx;
					margin-left: 16rpx;
				}
			}

			.proxy {
				padding: 8rpx 20rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #2F80FF;
				font-weight: bold;
				background-color: #FFFFFF;
				border-radius: 25rpx;
				margin-right: 30rpx;
			}
		}
	}
</style>
