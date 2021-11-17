<template>
	<view class="container">
		<view class="flexRow contentBorder" id="list" style="position: relative;padding: 32rpx;">
			<view class="">
				<view class="bold" style="margin-bottom: 48rpx;">
					允许加入
				</view>
				<view class="color_919397">
					允许平台用户加入组织
				</view>
			</view>
			<view style="margin-right: -16rpx;">
				<switch color="#46B28B" :checked="soInfo.org.allowJoin==true" @change="switchChangeJoin" style="transform:scale(0.7)" />
			</view>
		</view>
		<view class="" style="padding: 40rpx;">
			<view class="flexRow contentBorder" style="padding-bottom: 24rpx;">
				<view class="">
					<view class="bold" style="margin-bottom: 48rpx;">
						加入免审
					</view>
					<view class="color_919397">
						自动通过平台用户加入组织申请
					</view>
				</view>
				<view style="margin-right: -16rpx;">
					<switch color="#46B28B" :checked="soInfo.org.isExempt==true" @change="switchChangeExempt" style="transform:scale(0.7)" />
				</view>
			</view>
			<view class="contentBorder" style="padding-bottom: 24rpx;margin-top: 44rpx;">
				<view class="flexRow" style="margin-bottom: 48rpx;" @tap="goCharge">
					<view class="bold">
						入组收费
					</view>
					<view class="color_303031 flexRowStart" v-if="soInfo.org.isCharge==false">
						<view class="">
							已关闭
						</view>
						<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
					</view>
					<view class="color_303031 flexRowStart" v-if="soInfo.org.isCharge==true">
						<view class="">
							已开启
						</view>
						<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
					</view>
				</view>
				<view class="flexRow">
					<view class="color_919397">
						对申请加入组织的用户进行收费
					</view>
					<view class="color_F74437" v-if="soInfo.org.isCharge==true">
						{{soInfo.org.cost}}贝/人
					</view>
				</view>
			</view>
		</view>
		<view v-if="showStatus==false" class="mask" :style="{top:topHeight + 'px'}">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				soInfo: '',
				oss:'',
				id:'',
				topHeight:'',
				showStatus:true
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			this.id=options.id
		},
		onShow(){
			this.$http.get(`admin/app/org/workplace/v2/${this.id}`).then(res => {
				this.soInfo = res.data.data;
				console.log(this.soInfo)
				this.showStatus = this.soInfo.org.allowJoin
			})
			uni.createSelectorQuery()
				.in(this)
				.select('#list')
				.boundingClientRect()
				.exec(ret => {
					this.topHeight = ret[0].height
				});
		},
		methods: {
			goCharge(){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/manageEdit/soCharge/soCharge?status=${this.soInfo.org.isCharge}&num=${this.soInfo.org.cost}&id=${this.soInfo.org.orgId}`
				})
			},
			switchChangeJoin(e){
				console.log(e)
				if(e.detail.value==true){
					this.$http.get('admin/app/open/allow',{
						params:{
							exempt:1,
							orgId:this.soInfo.org.orgId
						}
					}).then(res=>{
						if(res.data.code==0){
							this.soInfo.org.allowJoin =e.detail.value
							this.showStatus =e.detail.value
						}else{
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}
					})
				}else{
					this.$http.get('admin/app/open/allow',{
						params:{
							exempt:0,
							orgId:this.soInfo.org.orgId
						}
					}).then(res=>{
						if(res.data.code==0){
							this.soInfo.org.allowJoin =e.detail.value
							this.showStatus =e.detail.value
							console.log(this.showStatus)
						}else{
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}
					})
				}
			},
			switchChangeExempt(e){
				console.log(e)
				if(e.detail.value==true){
					this.$http.get('admin/app/open/exempt',{
						params:{
							exempt:1,
							orgId:this.soInfo.org.orgId
						}
					}).then(res=>{
						if(res.data.code==0){
							this.soInfo.org.isExempt =e.detail.value
						}else{
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}
					})
				}else{
					this.$http.get('admin/app/open/exempt',{
						params:{
							exempt:0,
							orgId:this.soInfo.org.orgId
						}
					}).then(res=>{
						if(res.data.code==0){
							this.soInfo.org.isExempt =e.detail.value
						}else{
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.contentBorder{
		border-bottom: 2rpx solid #EFF0F1;
	}
	.mask{
		background:rgba(255,255,255,.5);
		width:100%;
		height: 600rpx;
		position: absolute;
		left: 0rpx;
	}
	.container {
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.rightImg {
		width: 44rpx;
		height: 44rpx;
		margin-right: -16rpx;
	}
</style>
