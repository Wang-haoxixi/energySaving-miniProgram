<template>
 	<view class="container safe-bottom">
 		<view class="flexRowStart content" id='title'>
 			<view class="flexRowStart" v-for="(item,index) of titleList" :key="index" style="width: 250rpx;justify-content: center;" @tap="resetSelect(item,index)">
 				<view class="color_F74437 bold singleEllipsis" style="max-width: 130rpx;">
 					{{$isEmpty(item)?'': item}}
 				</view>
 				<image v-if="oss" :src="oss+'icon_createTask_grayRight.png'" style="width: 44rpx;height: 44rpx;"></image>
 			</view>
 			<view class="flexRowStart" style="width: 250rpx;justify-content: center;" v-if="status==true">
 				<view class="color_919397">
 					请输入
 				</view>
 				<image v-if="oss" :src="oss+'icon_createTask_grayRight.png'" style="width: 44rpx;height: 44rpx;"></image>
 			</view>
 		</view>
 		<scroll-view scroll-y="true" :style="{height:scrollHeight + 'px'}">
 			<view class="" style="font-size: 28rpx;line-height: 40rpx;">
 				<view @tap="selectIndustry(item,index)" class="industryList" :class="item.status?'select':'unselect'" v-for="(item,index) of industryList"
 				 :key="index">
 					{{$isEmpty(item.name)?'':item.name}}
 				</view>
 			</view>
 			<!-- <view class="bottom-safe" style="height: 112rpx;"></view> -->
 		</scroll-view>
 	</view>
 </template>
 
 <script>
 	export default {
 		data() {
 			return {
 				titleList: [],
 				industryList: [],
 				oss: '',
 				scrollHeight:'',
 				status:true
 			};
 		},
 		onLoad(options) {
 			this.oss = this.$oss
 			this.$http.get('dms/industry/tree').then(res => {
 				console.log(res)
 				this.industryList = res.data.data.map(item => {
 					return {
 						...item,
 						status: false
 					}
 				})
 				if(!this.$isEmpty(options.titleList)){
 					this.titleList =options.titleList.split('-')
 					// console.log(this.titleList)
 					this.status=options.status
 					// console.log(this.status)
 					if(this.titleList.length==1){
 						//只有一层
 						this.industryList.forEach(item=>{
 							if(item.name == this.titleList[0]){
 								item.status =true
 							}
 						})
 					}else if(this.titleList.length==2){
 						//有两层
 						// console.log(this.industryList)
 						this.industryList = this.industryList.filter(item=>{
 							return item.name == this.titleList[0]
 						})[0].children
 						// console.log(6,this.industryList)
 						this.industryList.forEach(item2=>{
 							if(item2.name == this.titleList[1]){
 								item2.status=true
 							}
 						})
 					}else if(this.titleList.length==3){
 						//有三层
 						this.industryList = this.industryList.filter(item=>{
 							return item.name == this.titleList[0]
 						})[0].children
 						// console.log(6,this.industryList)
 						this.industryList = this.industryList.filter(item2=>{
 							return item2.name == this.titleList[1]
 						})[0].children
 						this.industryList.forEach(item3=>{
 							if(item3.name ==this.titleList[2]){
 								item3.status=true
 							}
 						})
 					}
 				}
 			})
 			uni.createSelectorQuery()
 				.in(this)
 				.select('#title')
 				.boundingClientRect()
 				.exec(ret => {
 					let height = uni.getSystemInfoSync().windowHeight;
 					this.scrollHeight = height - ret[0].height
 				});
 		},
 		methods: {
 			selectIndustry(item, index) {
 				this.industryList.forEach(item2 => {
 					item2.status = false
 				})
 				item.status = true
 				if(this.status ==true){
 					this.titleList.push(item.name)
 				}else{
 					if(this.titleList.length==3){
 						this.titleList.splice(2,1,item.name)
 					}else if(this.titleList.length==2){
 						this.titleList.splice(1,1,item.name)
 					}else if(this.titleList.length==1){
 						this.titleList.splice(0,1,item.name)
 					}
 					console.log(this.titleList)
 					this.status =true
 				}
 				if(item.children.length>0){
 					this.industryList = item.children.map(item3=>{
 						return {
 							...item3,
 							status: false
 						}
 					})
 				}else{
 					this.status=false
 					uni.$emit('industry',JSON.stringify(this.titleList))
 					uni.navigateBack({
 						delta:1
 					})
 				}
 			},
 			resetSelect(item,index){
 				// console.log(this.titleList)
 				this.status=true
 				if(index == 1){
 					this.titleList.splice(index,2)
 					let industryList =[]
 					this.$http.get('dms/industry/tree').then(res => {
 						console.log(res)
 						industryList = res.data.data.filter(item2=>{
 							return item2.name == this.titleList[0]
 						})
 						console.log(industryList)
 						this.industryList = industryList[0].children
 						console.log(this.industryList)
 					})
 				}else if (index ==0){
 					this.titleList=[]
 					this.$http.get('dms/industry/tree').then(res => {
 						console.log(res)
 						this.industryList = res.data.data.map(item => {
 							return {
 								...item,
 								status: false
 							}
 						})
 					})
 				}
 			}
 		}
 	}
 </script>
 
 <style lang="scss">
 	.industryList{
 		width:100%;
 		height:108rpx;
 		line-height: 108rpx;
 		text-align: center;
 		border-bottom: 2rpx solid #EFF0F1;
 	}
 	.content{
 		padding-bottom: 24rpx;
 		padding-top: 40rpx; 
 		font-size: 28rpx;
 		line-height: 40rpx;
 	}
 	.select {
 		background-color: #F4F5F6;
 		color: #303031;
 		font-weight: bold;
 	}
 
 	.unselect {
 		background-color: #FFFFFF;
 		color: #919397;
 		font-weight: normal;
 	}
 
 	.bottom-safe {
 		/* iphonex 等安全区设置，底部安全区适配 */
 		/* #ifndef APP-NVUE */
 		padding-bottom: constant(safe-area-inset-bottom);
 		padding-bottom: env(safe-area-inset-bottom);
 		/* #endif */
 	}
 </style>
 