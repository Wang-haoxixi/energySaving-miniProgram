<template>
	<view class="container">
		<view v-for="(item,index) of data.workExperience" :key="index" style="margin-bottom: 40rpx;">
			<view class="color_303031 bold company">
				{{getCompanyStation(item.company)}}
			</view>
			<view class="color_919397 flexRowStart content">
				<view class="">
					{{$isEmpty(item.department)?'':item.department}}
				</view>
				<view class="color_E3E4E5 line" v-if="!$isEmpty(item.department) && !$isEmpty(item.starTime)">
					|
				</view>
				<view class="">
					{{$isEmpty(item.starTime)?'':item.starTime}} - {{$isEmpty(item.endTime)?'':item.endTime}}
				</view>
			</view>
			<view class="color_666769 describe" v-if="!$isEmpty(item.describe)">
				{{item.describe}}
			</view>
			<view class="color_666769 describe" v-else>
				暂无描述
			</view>
			<view class="bottomLine">
				
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCompanyStation
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				data:{}
			};
		},
		onLoad(options) {
			const {id} =options
			console.log(id)
			this.$http.get('admin/app/user/style/' + id).then(res => {
				console.log(res)
				this.data = res.data.data
				// this.data = res.data.data.card;
			});
		},
		methods:{
			getCompanyStation
		}
	}
</script>

<style lang="scss" scoped>
.container{
	margin: 32rpx;
	.company{
		font-size: 32rpx;
		line-height: 44rpx;
		margin-bottom: 20rpx;
	}
	.content{
		font-size: 24rpx;
		line-height: 34rpx;
		margin-bottom: 40rpx;
		.line{
			margin: 0 20rpx;
			font-size: 20rpx;
		}
	}
	.describe{
		font-size: 28rpx;
		line-height: 48rpx;
	}
	.bottomLine{
		margin-top: 40rpx;
		height: 0.3rpx;
		background-color: #EFF0F1;
		border-radius: 20rpx;
	}
}
</style>
