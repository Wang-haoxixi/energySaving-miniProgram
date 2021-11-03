<template>
	<view style="padding: 40rpx;">
		<view class="title">修改收货人信息</view>
		<view class="content">
			<view class="flexRow content-item">
				<view class="content-item-title">收货人</view><input placeholder="请填写收货人" placeholder-class="inputDefault" v-model="data.realName"></input>
			</view>
			<view class="flexRow content-item">
				<view class="content-item-title">联系方式</view><input maxlength="11" type="number" placeholder="请填写联系方式"
				 placeholder-class="inputDefault" v-model="data.phone"></input>
			</view>
			<!-- <view class="flexRow content-item">
				<view class="content-item-title">邮箱</view><input placeholder="请填写邮箱" placeholder-class="inputDefault" v-model="data.mail"></input>
			</view> -->
		</view>
		<!-- <view class="remind">
			报告类产品将通过邮件的形式发送至您的邮箱，请正确填写邮箱地址
		</view> -->
		<view class="button editBtn" @tap="edit">确认修改</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: '',
			};
		},
		methods: {
			edit() {
				uni.setStorageSync('user', this.data);
				uni.navigateBack();
			}
		},
		onLoad() {
			this.data = uni.getStorageSync('user');
		}
	}
</script>

<style lang="scss">
	.title {
		font-weight: bold;
		font-size: 32rpx;
		line-height: 44rpx;
		margin-top: 20rpx;
	}

	.content {
		margin-top: 40rpx;

		.content-item {
			height: 108rpx;
			border-bottom: 0.3px #eff0f1 solid;

			.content-item-title {
				font-size: 28rpx;
				font-weight: bold;
				line-height: 40rpx;
			}
		}
	}

	.inputDefault {
		font-size: 28rpx;
		color: #919397;
	}

	input {
		text-align: right;
		width: 520rpx;
		font-size: 28rpx;
		padding: 0 14rpx;
		color: #666769;
	}

	.remind {
		margin-top: 40rpx;
		color: #919397;
		font-size: 24rpx;
		line-height: 44rpx;
	}
	.editBtn{
		width: 670rpx;
		margin-top: 60rpx;
	}
</style>
