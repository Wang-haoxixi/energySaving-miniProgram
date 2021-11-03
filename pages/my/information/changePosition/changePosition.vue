<template>
	<view class="">
		<view class="flexRow" style="padding: 32rpx;border-bottom: 1px solid #F7F7F7;">
			<view class="" style="margin-right: 48rpx;">
				单位
			</view>
			<input class="color_666769" type="text" placeholder="请输入单位名称" v-model="company" maxlength="20" style="flex: 1;text-align: right;"/>
		</view>
		<view class="flexRow" style="padding: 32rpx;border-bottom: 1px solid #F7F7F7;" @tap="choosePosition">
			<view class="" style="margin-right: 48rpx;">
				职位
			</view>
			<view class="flexRowStart" style="flex: 1;">
				<view class="color_666769" style="text-align: right;flex: 1;">
					{{$isEmpty(position)?'请选择职位':position}}
				</view>
				<image class="list-end" :src="$ossUrl('icon_right_gray.png')"></image>
			</view>
		</view>
		<view class="wrap safe-bottom">
			<view class="wrapBtn">
				<view class="button" style="width: 686rpx;" @tap="saveChange">
					保存
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				position:'',
				company:''
			};
		},
		onLoad(options) {
			this.company=options.company
			this.position=options.position
			uni.$on('positionChange', data=>{
				// console.log(data)
				this.position=data
			})
		},
		methods:{
			choosePosition(){
				uni.navigateTo({
					url:'/pages/find/recruit/positionSelection/positionSelection'
				})
			},
			saveChange(){
				if(this.$isEmpty( this.company)){
					uni.showToast({
						title:"请填写单位名称",
						icon:"none"
					})
				}else{
					this.$http.post('admin/user/app/update', {
						company:this.company,
						position:this.position
					}).then(res => {
						if(res.data.code==0){
							uni.navigateBack({
								delta:1
							})
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							})
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.list-end {
		margin-right: -16rpx;
		height: 44rpx;
		width: 44rpx;
	}
.wrap{
	width: 100%;
	position: fixed;
	bottom: 0;
	background-color: #FFFFFF;
	.wrapBtn{
		margin: 24rpx 32rpx 32rpx;
	}
}
</style>
