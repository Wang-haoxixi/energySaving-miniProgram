<template>
	<view class="container">
		<view class="flexRowStart intro_relation_item" v-for="(item,index) of data.relations" :key="index" @tap="gomagicBox(item.id)">
			<image style="width: 140rpx;height: 140rpx;margin-right: 24rpx;border-radius: 8rpx;" :src="item.imageUrl" mode=""></image>
			<view class="intro_relation_item_info flexColumnStart">
				<view class="intro_relation_item_info_name">
					{{item.name}}
				</view>
				<view class="intro_relation_item_info_label flexRowStart">
					<view class="intro_relation_item_info_label_item" v-for="(item2,index2) of item.tagKeywords" :key="index2">
						{{item2}}
					</view>
				</view>
				<view class="flexRow intro_relation_item_info_money">
					<view class="intro_relation_item_info_money_wrap">
						<view v-if="item.isFree==1">免费</view>
						<view v-if="item.isFree==0">{{$isEmpty(item.price)?'':item.price+'贝'}}<text v-if="item.cash>0">
							<text v-if="item.cash&&item.price">/</text>{{$isEmpty(item.cash)?'':item.cash+'元'}}</text>
						</view>
					</view>
					<view class="flexRowStart">
						<image :src="$ossUrl('home_star.png')" mode="" style="width: 26rpx;height: 26rpx;"></image>
						<view class="" style="margin-left: 10rpx;font-size: 24rpx;line-height: 40rpx;color: #9AA1A7;">
							{{$isEmpty(item.score)?'暂无评分':item.score}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:{},
				oss:'',
				id:''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			this.id = options.id;
			this.$http.get('dms/app/shop', {
				params: {
					id: this.id
				}
			}).then(res => {
				this.data = res.data.data;
			});
		}
	}
</script>

<style lang="scss">
.container{
	padding:0 32rpx;
}
		.intro_relation_item{
				padding: 32rpx 0;
				.intro_relation_item_info{
					flex: 1;
					.intro_relation_item_info_name{
						color: #272727;
						font-size: 30rpx;
						line-height: 42rpx;
						font-weight: bold;
						margin-bottom: 16rpx;
					}
					.intro_relation_item_info_label{
						margin-bottom: 16rpx;
						.intro_relation_item_info_label_item{
							padding: 6rpx 12rpx;
							background-color: #f5f7f8;
							border-radius: 4rpx;
							font-size: 22rpx;
							line-height: 32rpx;
							color: #565B5F;
							margin-right: 8rpx;
						}
					}
					.intro_relation_item_info_money{
						width: 100%;
						.intro_relation_item_info_money_wrap{
							flex: 1;
							color: #F73737;
							line-height: 40rpx;
							font-size: 28rpx;
						}
					}
				}
			}
</style>
