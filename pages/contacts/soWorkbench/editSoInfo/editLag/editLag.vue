<template>
	<view>
		<view class="container">
			<view class="" style="padding:0rpx 24rpx;">
				<view class="flexRowStart content">
					<view class="color_FFFFFF topTagList" @tap="deleteTag(item,index)" v-for="(item,index) of tagList" :key="index" style="background-color: #46B28B;">
						{{$isEmpty(item)?'':item}}<text style="margin-left: 10rpx;">X</text>
					</view>
					<input v-if="tagList.length<5" placeholder="输入我的标签" placeholder-style="color:#BABEC0;font-size: 28rpx;" @confirm="pushTag" type="text" v-model="addTxt" maxlength="6" style="text-align: center;height: 46rpx;min-height:46rpx; width: 170rpx;border-radius: 10rpx;margin: 0rpx 10rpx;margin-bottom: 30rpx;font-size: 20rpx;line-height: 46rpx;"/>
				</view>
				<view class="color_BABEC0 titleInfo">
					每个标签不超过6个字
				</view>
			</view>
			<view class="" style="padding:0rpx 32rpx;">
				<view class="flexRow" style="margin-bottom: 40rpx;margin-left: 10rpx;">
					<view class="">
						为您推荐
					</view>
				</view>
				<view class="flexRowStart" style="flex-wrap: wrap;">
					<view class="tagList" @tap="chooseTag(item)" :class="item.status?'selectBg':'unSelectBg'" v-for="(item,index) of recommendList" :key="index">
						<text v-if="item.status==false">+</text><text v-if="item.status==true">√</text>{{$isEmpty(item.name)?'':item.name}}
					</view>
				</view>
			</view>
		</view>
		<view class="btn" v-if="adminStatus!=0">
			<view class="button freeBtn" @tap="addNotice">
				发布
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tagList: [],
				recommendList:[],
				addTxt:'',
				self:'',
				userId:''
			};
		},
		onLoad(options) {
			this.tagList = JSON.parse(options.tagList)
			this.self =options.self
			this.userId = options.userId
			// console.log(this.self)
			this.$http.get('tms/tag/fake_rec_tags').then(res=>{
				this.recommendList=res.data.data
				this.recommendList =this.recommendList.map(item=>{
					return{
						...item,
						status:false
					}
				})
				this.recommendList.forEach(item=>{
					this.tagList.forEach(item2=>{
						if(item.name == item2){
							item.status=true
						}
					})
				})
			})
		},
		methods:{
			pushTag(){
				if(this.addTxt==''){
					
				}else{
					let addStatus = this.tagList.some(item=>{
						return item == this.addTxt
					})
					if(addStatus){
						uni.showToast({
							title:"标签已存在",
							icon:"none"
						})
					}else{
						this.tagList.push(this.addTxt)
						this.recommendList.forEach(item=>{
							if(item.name==this.addTxt){
								item.status=true
							}
						})
						this.addTxt=''
					}
				}
			},
			deleteTag(item,index){
				this.tagList.splice(index,1)
				this.recommendList.forEach(item2=>{
					if(item2.name == item){
						item2.status=false
					}
				})
			},
			chooseTag(item){
				if(item.status==false && this.tagList.length<5){
					item.status=true
					this.tagList.push(item.name)
				}else if(item.status==false && this.tagList.length>=5){
					uni.showToast({
						title:"最多添加五个标签",
						icon:"none"
					})
				}
			},
			addNotice(){
				if(this.self='mySelf'){
					this.$http.post('admin/user/update', {
						abilityTag:this.tagList,
						userId:this.userId
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
					})
				}else{
					uni.$emit('tagList',JSON.stringify(this.tagList))
					uni.navigateBack({
						delta:1
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.titleInfo{
		font-size: 24rpx;
		line-height: 34rpx; 
		margin: 20rpx 0rpx 60rpx;
	}
	.topTagList{
		font-size: 20rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0rpx 20rpx;
		border-radius: 10rpx;
		margin: 0rpx 10rpx;
		margin-bottom: 30rpx;
	}
	.tagList{
		font-size: 20rpx;
		line-height: 28rpx;
		padding: 10rpx 28rpx;
		border-radius: 10rpx;
		margin: 0rpx 10rpx;
		margin-bottom: 30rpx;
	}
	.content{
		flex-wrap: wrap;
		border-bottom: 2rpx solid #EFF0F1;
	}
	.unSelectBg{
		background-color: #F4F5F6;
		color: #919397;
	}
	.selectBg{
		// background-color: #2F80FF;
		background-color: #46B28B;
		color: #FFFFFF;
	}
	.container{
		padding: 32rpx 0rpx;
	}
	.btn {
		width: 100%;
		background-color: #FFFFFF;
		z-index: 666;
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.freeBtn {
			width: 686rpx;
			margin: 24rpx 32rpx
		}
	}
</style>
