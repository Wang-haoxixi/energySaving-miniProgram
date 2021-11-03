<template>
	<view class="">
		<view style="margin: 32rpx;">
			<view class="color_303031 bold title">
				标题
			</view>
			<textarea focus="true" maxlength="30" auto-height="true" v-model="title" placeholder="请输入标题(1-30字)" placeholder-class="inputPlaceholder" style="width: 100%; border-bottom: 0.3rpx solid #EFF0F1;color: #9aa1a7;font-size: 28rpx;line-height: 48rpx;padding-bottom: 20rpx;"/>
			<view class="content">
				<view class="color_303031 bold" style="margin-bottom: 40rpx;">
					正文
				</view>
				<textarea v-model="titleInfo" class="contentInfo" placeholder-class="contentInfoDefault" placeholder="正文内容不超过1000字" maxlength="1000"/>
			</view>
			<view class="flexRow">
				<view class="color_303031 bold" style="font-size: 28rpx;line-height: 40rpx">
					置顶
				</view>
				<view style="margin-right: -16rpx;">
					<switch color="#F74437" :checked= "topStatus==true"  @change="switchChange"  style="transform:scale(0.7)"/>
				</view>
			</view>
		</view>
		<view class="btn">
			<view class="button freeBtn" @tap="addNotice">
				<text v-if="$isEmpty(sysId)">发布</text>
				<text v-else>编辑</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				titleInfo:'',
				orgId:'',
				topStatus:false,
				sysId:''
			};
		},
		onLoad(options) {
			const {id,title,titleInfo,isTop,sysId} =options
			this.orgId =id
			console.log(this.orgId)
			this.title=title
			this.titleInfo=titleInfo
			if(!this.$isEmpty(isTop)){
				this.topStatus=JSON.parse(isTop)
				console.log(this.topStatus)
			}
			this.sysId =sysId
		},
		methods:{
			addNotice(){
				if(this.title.length==0){
					uni.showToast({
						title:"请输入标题",
						icon:"none"
					})
					return false
				}
				if(this.titleInfo.length==0){
					uni.showToast({
						title:"请输入内容",
						icon:"none"
					})
					return false
				}
				if(this.$isEmpty(this.sysId)){
					this.$http.post('ims/sys_msg/send/notice',{
						text:this.titleInfo,
						title:this.title,
						orgId:this.orgId,
						isTop:this.topStatus
					}).then(res=>{
						if(res.data.code == 1){
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}else{
							uni.showToast({
								title:"发布成功",
								icon:"none",
								duration:1000,
								success: () => {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}
					})
				}else{
					this.$http.post('ims/sys_msg/update',{
						text:this.titleInfo,
						title:this.title,
						sysInfoId:this.sysId,
						isTop:this.topStatus
					}).then(res=>{
						if(res.data.code == 1){
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}else{
							uni.showToast({
								title:"编辑成功",
								icon:"none",
								duration:1000,
								success: () => {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}
					})
				}
			},
			switchChange(){
				this.topStatus =!this.topStatus
				console.log(this.topStatus)
			}
		}
	}
</script>

<style lang="scss">
	.content{
		margin-top: 44rpx;
		position: relative;
		margin-bottom: 64rpx;
		font-size: 28rpx;
		line-height: 40rpx;
	}
	.title{
		font-size: 28rpx;
		line-height: 40rpx;
		margin-bottom: 48rpx;
	}
.btn{
	width: 100%; 
	background-color: #FFFFFF;
	z-index: 666; 
	position: fixed;
	bottom: 0rpx;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	.freeBtn{
		width:686rpx;
		margin: 24rpx 32rpx
	}
}
.inputPlaceholder{
	color: #BABEC0;
}
.contentInfo{
	border-radius: 30rpx; 
	padding: 32rpx;
	font-size:28rpx;
	line-height:48rpx;
	color:#666769;
	background-color: #F4F5F6;
	width: 622rpx;
	height: 390rpx;
	word-break:break-all;
	word-wrap:break-word;
}
.contentInfoDefault{
	font-size:28rpx;
	line-height:48rpx;
	color:#BABEC0;
}
.remark{
	font-size: 24rpx;
	line-height: 48rpx; 
	position:absolute;
	bottom: 16rpx;
	right: 40rpx;
}
.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
