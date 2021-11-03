<template>
	<view class="container">
		<view class="flexRow">
			<view class="">
				<view class="">
					允许加入
				</view>
				<view class="">
					允许平台用户加入组织
				</view>
			</view>
			<view style="margin-right: -16rpx;">
				<switch color="#F74437"  @change="switchChange"  style="transform:scale(0.7)"/>
			</view>
		</view>
		<view class="flexRow">
			<view class="">
				<view class="">
					加入免审
				</view>
				<view class="">
					自动通过平台用户加入组织申请
				</view>
			</view>
			<view style="margin-right: -16rpx;">
				<switch color="#F74437"  @change="switchChange"  style="transform:scale(0.7)"/>
			</view>
		</view>
		<view class="">
			<view class="flexRow">
				<view class="">
					入组收费
				</view>
				<view class="">
					{{$isEmpty(value)?'':value}}
				</view>
			</view>
			<view class="flexRow">
				<view class="">
					对申请加入组织的用户进行收费
				</view>
				<view class="">
					{{$isEmpty(num)?'':num}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:'',
				num:''
			};
		}
	}
</script>

<style lang="scss">
.container{
	padding: 40rpx;
}
</style>
