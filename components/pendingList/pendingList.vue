<template>
	<view class="content">
		<view class="flexRow" v-for="(item,index) of list" :key="index" style="margin-bottom: 60rpx;" @tap="goDetails(item)">
			<view class="flexRowStart">
				<image :src="item.senderAvatar" class="avatarImg"></image>
				<view>
					<view class="color_303031 wrapTitle">
						<text v-if="item.type == 10041">好友申请:</text>
						<text v-else-if="item.type == 10079">+组织申请:</text>
						<text v-else-if="item.type == 10084">拜师申请:</text>
						<text v-else-if="item.type == 10052">组织邀请:</text>
						<text v-else-if="item.type == 10077">组织管理者邀请:</text>
						<text v-else-if="item.type == 10198">申请加入任务:</text>
						<text style="margin-left: 20rpx;">{{item.senderName}}</text>
					</view>
					<view class="color_919397 titleContactWrap">
						{{$isEmpty(item.title)?'':item.title}}
					</view>
				</view>
			</view>
			<view class="flexRowStart">
				<image v-if="oss" :src="oss+'icon_contact_cancelPend.png'" class="actionImg" style="margin-right: 30rpx;" @tap.stop="cancel(item,index)"></image>
				<image v-if="oss" :src="oss+'icon_contact_confirmPend.png'" class="actionImg" @tap.stop="pass(item,index)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			list:Array,
		},
		data() {
			return {
				oss:'',
			};
		},
		onReady() {
			this.oss =this.$oss
		},
		methods:{
			cancel(item,index){
				this.$http.get(`ims/sys_msg/reject/${item.id}`).then(res=>{
					if(res.data.code ==0){
						uni.showToast({
							title:"处理成功",
							icon:"none",
							duration:1000,
							success: () => {
								this.$emit('delete',index)
							}
						})
					}else{
						uni.showToast({
							title:res.data.message,
							icon:"none",
							duration:1000,
						})
					}
				})
			},
			pass(item,index){
				this.$http.get(`ims/sys_msg/pass/${item.id}`).then(res=>{
					if(res.data.code ==0){
						uni.showToast({
							title:"处理成功",
							icon:"none",
							duration:1000,
							success: () => {
								this.$emit('delete',index)
							}
						})
					}else{
						uni.showToast({
							title:res.data.message,
							icon:"none",
							duration:1000,
						})
					}
				})
			},
			goDetails(item){
				if(item.sysInfoListUtilVO){
					let info = item.sysInfoListUtilVO
					if(info.remark){
						uni.navigateTo({
							url:`/pages/contacts/pendDetails/pendDetails?type=${item.type}&time=${item.time}&text=${info.remark}&id=${item.id}&userId=${item.senderId}`
						})
					}else{
						uni.navigateTo({
							url:`/pages/contacts/pendDetails/pendDetails?&type=${item.type}&time=${item.time}&text=${item.text}&id=${item.id}&userId=${item.senderId}`
						})
					}
				}else{
					uni.navigateTo({
						url:`/pages/contacts/pendDetails/pendDetails?type=${item.type}&time=${item.time}&text=${item.text}&id=${item.id}&userId=${item.senderId}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.avatarImg{
	width: 112rpx;
	height: 112rpx;
	border-radius: 50%;
	margin-right: 24rpx;
}
.wrapTitle{
	font-size: 28rpx;
	line-height: 40rpx;
	margin-bottom: 10rpx;
}
.titleContactWrap{
	font-size: 22rpx;
	line-height: 32rpx;
}
.actionImg{
	width: 32rpx;
	height: 32rpx;
}
</style>
