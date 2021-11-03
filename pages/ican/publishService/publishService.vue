<template>
	<view>
		<view class="container">
		 	<view class="title bold flexRowStart">
		 		<view class="color_F74437" style="margin-right: 8rpx;">
		 			*
		 		</view>
				<view class="">
					发布类型
				</view>
		 	</view>
			<view class="labelList">
				<view @tap="chooseItem(item)" :class="item.status?'checked':''" class="labelList_item color_303031" v-for="(item,index) of dictList" :key="index">
					{{item.typeDesc}}
				</view>
			</view>
			<view class="title bold flexRowStart">
				<view class="color_F74437" style="margin-right: 8rpx;">
					*
				</view>
				<view class="">
					名称
				</view>
			</view>
			<view class="flexRow name">
				<input style="flex: 1;" type="text" placeholder="请输入名称" maxlength="20" placeholder-style="color:#BCC4CB" v-model="name" />
				<image :src="$ossUrl('home_arrowright.png')" mode="" class="rightImg"></image>
			</view>
			<view @tap="chooseOrg" class="flexRow title" style="margin-bottom: 16rpx;border-bottom:1px solid #EDEDED50 ;">
				<view class="flexRowStart bold">
					<view class="color_F74437" style="margin-right: 8rpx;">
						*
					</view>
					<view class="">
						所属组织
					</view>
				</view>
				<view class="flexRowStart" style="flex: 1; margin-left: 32rpx;">
					<!-- <view class="" style="color: #BCC4CB ;font-size: 28rpx;line-height: 40rpx;">
						请选择所属组织
					</view> -->
					<input style="text-align: right;flex: 1;" placeholder="请选择所属组织" disabled placeholder-style="color:#BCC4CB" v-model="orgName" />
					<image :src="$ossUrl('home_arrowright.png')" mode="" class="rightImg"></image>
				</view>
			</view>
			<view class="flexRow title" @tap="chooseLabel" style="margin-bottom: 16rpx;border-bottom:1px solid #EDEDED50 ;">
				<view class="flexRowStart bold">
					<view class="color_F74437" style="margin-right: 8rpx;">
						*
					</view>
					<view class="">
						标签
					</view>
				</view>
				<view class="flexRow" style="flex: 1; margin-left: 32rpx;justify-content: flex-end;">
					<view class="flexRow" style="justify-content: flex-end;" v-if="tagKeywords.length>0">
						<view class="tagItem" v-for="(item,index) of tagKeywords" :key="index" v-if="index<3">
							{{item}}
						</view>
					</view>
					<image :src="$ossUrl('home_arrowright.png')" mode="" class="rightImg"></image>
				</view>
			</view>
			<view class="title bold flexRowStart">
				<view class="color_F74437" style="margin-right: 8rpx;">
					*
				</view>
				<view class="">
					标题图
				</view>
			</view>
			<view class="emptyImgWrap">
				<!-- <image v-if="$isEmpty(imageUrl)" @tap="choosePoster" :src="$ossUrl('publish_add.png')" mode="" class="img"></image>
				<image v-else :src="imageUrl" @tap="choosePoster" mode="" class="img" style="border-radius: 16rpx;"></image> -->
				<sunui-upimg @change="getPosterInfo" upload_count='1' :upload_auto="true" ref="upimg" :upimg_preview="posterImg" :header="header"></sunui-upimg>
			</view>
			<view class="title bold flexRowStart">
				<view class="">
					产品截图({{$isEmpty(imgLength)?'0': imgLength}}/5)
				</view>
			</view>
			<view class="emptyImgWrap">
				<!-- <view class="ImgWrap">
					<view class="" v-for="(item,index) of previewImgUrl" :key="index">
						<image :src="item" mode="" class="img" style="border-radius: 16rpx;"></image>
					</view>
					<image :src="$ossUrl('publish_add.png')" mode="" class="img" @tap="chooseDetailImg" v-if="previewImgUrl.length<5"></image>
				</view> -->
				<sunui-upimg @change="getImageInfo" :upload_count="5" :upload_auto="true" ref="upimg" :upimg_preview="detailImgs" :header="header"></sunui-upimg>
			</view>
			<view class="title bold flexRowStart">
				<view class="color_F74437" style="margin-right: 8rpx;">
					*
				</view>
				<view class="">
					简介
				</view>
			</view>
			<view class="flexRow name" @tap="editDescription">
				<input v-if="$isEmpty(description)" type="text" placeholder="请输入简介" disabled placeholder-style="color:#BCC4CB" style="flex: 1;min-width: 0;" class="singleEllipsis"/>
				<view v-else style="flex: 1;min-width: 0;" class="singleEllipsis">{{description}}</view>
				<image :src="$ossUrl('home_arrowright.png')" mode="" class="rightImg"></image>
			</view>
			<view class="priceTitle flexRow">
				<view class="flexRowStart">
					<view class="color_F74437" style="margin-right: 8rpx;">
						*
					</view>
					<view class="">
						价格
					</view>
				</view>
				<view class="chooseFree flexRowStart">
					<view :class="isFree==1?'freeChecked':''" @tap="changeFree">
						免费
					</view>
					<view class="line">
						
					</view>
					<view :class="isFree==0?'freeChecked':''" @tap="changePay">
						收费
					</view>
				</view>
			</view>
			<view class="priceContent" v-show="isFree==0">
				<view class="flexRow priceContentItem color_303031" style="margin-bottom: 48rpx;">
					<view class="flexRowStart" style="margin-right: 16rpx;">
						<image @tap="changePriceCheck" v-if="priceStatus==true" :src="$ossUrl('publish_checked.png')" mode="aspectFit" style="margin-right: 16rpx; width: 40rpx;height: 40rpx;"></image>
						<image @tap="changePriceCheck" v-else :src="$ossUrl('publish_check.png')" mode="aspectFit" style="margin-right: 16rpx; width: 40rpx;height: 40rpx;"></image>
						<view class="">
							宝贝价格
						</view>
					</view>
					<view class="flexRowStart" style="flex: 1;">
						<input type="number" :disabled="!priceStatus" style="text-align: right;flex: 1;" placeholder="请输入宝贝价格" placeholder-style="color:#BCC4CB" v-model="price" />
						<view class="" style="margin-left: 16rpx;">
							贝
						</view>
					</view>
				</view>
				<view class="flexRow priceContentItem color_303031">
					<view class="flexRowStart" style="margin-right: 16rpx;">
						<image @tap="changeCashCheck" v-if="cashStatus==true" :src="$ossUrl('publish_checked.png')" mode="aspectFit" style="margin-right: 16rpx; width: 40rpx;height: 40rpx;"></image>
						<image @tap="changeCashCheck" v-else :src="$ossUrl('publish_check.png')" mode="aspectFit" style="margin-right: 16rpx; width: 40rpx;height: 40rpx;"></image>
						<view class="">
							线下价格
						</view>
					</view>
					<view class="flexRowStart" style="flex: 1;">
						<input type="number" :disabled="!cashStatus" style="text-align: right;flex: 1;" placeholder="请输入线下价格" placeholder-style="color:#BCC4CB" v-model="cash" />
						<view class="" style="margin-left: 16rpx;">
							元
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="" style="height: 228rpx;">
			
		</view>
		<uni-popup ref="allocationDialog" type="center">
			<view class="popDialog">
				<view class="color_666769 message">
					是否确认完成填写并提交审核
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancel">
						取消
					</view>
					<view class="button repeatNow" @tap="confirm">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
		<view class="safe-bottom wrapBtn">
			<view class="btn flexRow">
				<view class="button" style="flex: 1;" @tap="submit">
					提交审核
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dictList:[],
				name:'',
				orgName:'',
				orgId:'',
				description:'',
				price:'',
				priceStatus:true,
				cash:'',
				cashStatus:false,
				//0收费，1免费
				isFree:0,
				imageUrl:'',
				posterImg:[],
				previewImgUrl:[],
				detailImgs:[],
				tagKeywords:[],
				type:'',
				typeName:'',
				serviceArr: [],
				header: {},
				id:''
			};
		},
		onLoad(options) {
			this.id=options.id
			if(!this.$isEmpty(options.orgName) && !this.$isEmpty(options.orgId)){
				this.orgName=options.orgName
				this.orgId = options.orgId
			}
			this.$http.get('dms/app/shop/dict').then(res=>{
				this.dictList=res.data.data.map(item=>{
					return {
						...item,
						status:false
					}
				})
				if(!this.$isEmpty(options.id)){
					this.$http.get('dms/app/square/' + options.id).then(res=>{
						// console.log(res)
						this.name =res.data.data.name
						this.cash = res.data.data.cash
						if(!this.$isEmpty(this.cash)){
							this.cashStatus=true
						}else{
							this.cashStatus=false
						}
						this.description= res.data.data.description
						this.imageUrl = res.data.data.imageUrl
						let posterImg=[
							{path:this.imageUrl}
						]
						this.posterImg=posterImg
						this.isFree = res.data.data.isFree
						this.orgId =res.data.data.orgId
						this.orgName = res.data.data.orgName
						this.previewImgUrl = res.data.data.previewImgUrl
						this.detailImgs =res.data.data.previewImgUrl.map(item=>{
							return {
								path:item
							}
						})
						this.price=res.data.data.price
						if(!this.$isEmpty(this.price)){
							this.priceStatus=true
						}else {
							this.priceStatus=false
						}
						this.tagKeywords = res.data.data.tagKeywords
						this.type =res.data.data.type
						this.dictList.forEach(item=>{
							if(item.type == this.type){
								item.status=true
								this.typeName =item.typeDesc
							}
						})
					})
				}
			})
			uni.$on('list',(data)=>{
				let soInfo=JSON.parse(data.info)
				this.orgName=soInfo.name
				this.orgId=soInfo.orgId
			})
			uni.$on('tag',(data)=>{
				this.tagKeywords=data
			})
			uni.$on('description',(data)=>{
				this.description=data
			})
		},
		onShow() {
			this.header = {
				Authorization: uni.getStorageSync('token')
			};
		},
		computed:{
			imgLength(){
				return this.previewImgUrl.length
			}
		},
		methods:{
			cancel(){
				this.$refs.allocationDialog.close()
			},
			confirm(){
				if(this.$isEmpty(this.id)){
					this.$http.post('dms/app/square/publish',{
						cash:this.cash,
						description:this.description,
						imageUrl:this.imageUrl,
						isFree:this.isFree,
						name:this.name,
						orgId:this.orgId,
						orgName:this.orgName,
						previewImgUrl:this.previewImgUrl,
						price:this.price,
						tagKeywords:this.tagKeywords,
						type:this.type,
						typeName:this.typeName
					}).then(res=>{
						// console.log(res)
						if(res.data.data==true){
							this.$refs.allocationDialog.close()
							uni.showToast({
								title:"发布成功",
								icon:"none",
								duration:1000,
								success: () => {
									setTimeout(()=>{
										uni.navigateBack()
									},1000)
								}
							})
						}else {
							this.$refs.allocationDialog.close()
							uni.showToast({
								title:res.data.msg,
								icon:"none",
								duration:1000
							})
						}
					})
				}else{
					this.$http.post('dms/product/update',{
						id:this.id,
						cash:this.cash,
						description:this.description,
						imageUrl:this.imageUrl,
						isFree:this.isFree,
						name:this.name,
						orgId:this.orgId,
						orgName:this.orgName,
						previewImgUrl:this.previewImgUrl,
						price:this.price,
						tagKeywords:this.tagKeywords,
						type:this.type,
						typeName:this.typeName
					}).then(res=>{
						// console.log(res)
						if(res.data.data==true){
							this.$refs.allocationDialog.close()
							uni.showToast({
								title:"发布成功",
								icon:"none",
								duration:1000,
								success: () => {
									setTimeout(()=>{
										uni.navigateBack()
									},1000)
								}
							})
						}else {
							this.$refs.allocationDialog.close()
							uni.showToast({
								title:res.data.msg,
								icon:"none",
								duration:1000
							})
						}
					})
				}
			},
			submit(){
				// console.log(666)
				if(this.$isEmpty(this.type)){
					uni.showToast({
						title:"请选择发布类型",
						icon:"none",
						duration:1000
					})
				}else if(this.$isEmpty(this.name)){
					uni.showToast({
						title:"请输入名称",
						icon:"none",
						duration:1000
					})
				}else if(this.$isEmpty(this.orgId)){
					uni.showToast({
						title:"请选择所属组织",
						icon:"none",
						duration:1000
					})
				}else if(!this.tagKeywords.length>0){
					uni.showToast({
						title:"请选择标签",
						icon:"none",
						duration:1000
					})
				}else if(this.$isEmpty(this.imageUrl)){
					uni.showToast({
						title:"请选择标题图片",
						icon:"none",
						duration:1000
					})
				}else if(this.$isEmpty(this.description)){
					uni.showToast({
						title:"请填写简介",
						icon:"none",
						duration:1000
					})
				}else if(this.isFree==0){
					if(this.priceStatus==false && this.cashStatus==false){
						uni.showToast({
							title:"请选择价格输入",
							icon:"none",
							duration:1000
						})
					}else if(this.priceStatus ==true && this.$isEmpty(this.price)){
						uni.showToast({
							title:"请输入宝贝价格",
							icon:"none",
							duration:1000
						})
					}else if(this.priceStatus ==true && this.price==0){
						uni.showToast({
							title:"宝贝价格应大于0",
							icon:"none",
							duration:1000
						})
					}else if(this.cashStatus ==true && this.$isEmpty(this.cash)){
						uni.showToast({
							title:"请输入线下价格",
							icon:"none",
							duration:1000
						})
					}
					else if(this.cashStatus ==true && this.cash==0){
						uni.showToast({
							title:"线下价格应大于0",
							icon:"none",
							duration:1000
						})
					}else{
						this.$refs.allocationDialog.open()
					}
				}else{
					this.$refs.allocationDialog.open()
				}
			},
			chooseItem(item){
				this.dictList.forEach(item=>{
					item.status=false
				})
				item.status = !item.status
				this.type=item.type
				this.typeName =item.typeDesc
			},
			chooseOrg(){
				uni.navigateTo({
					url:'/pages/ican/createTask/soList/soList'
				})
			},
			chooseLabel(){
				if(this.$isEmpty(this.type)){
					uni.showToast({
						title:"请选择类型",
						icon:"none",
						duration:1000
					})
				}else{
					if(!this.tagKeywords.length>0){
						uni.navigateTo({
							url:`/pages/ican/publishService/chooseLabel/chooseLabel?type=${this.type}`
						})
					}else{
						uni.navigateTo({
							url:`/pages/ican/publishService/chooseLabel/chooseLabel?type=${this.type}&tagKeywords=${this.tagKeywords}`
						})
					}
				}
			},
			changeFree(){
				this.isFree = 1
			},
			changePay(){
				this.isFree=0
			},
			changePriceCheck(){
				if(this.priceStatus == true){
					this.priceStatus=false
					this.price=''
				}else{
					this.priceStatus=true
				}
			},
			changeCashCheck(){
				if(this.cashStatus == true){
					this.cashStatus=false
					this.cash=''
				}else{
					this.cashStatus=true
				}
			},
			getImageInfo(e) {
				this.previewImgUrl =e
				// console.log(this.previewImgUrl)			
			},
			getPosterInfo(e){
				this.imageUrl =e[0]	
				// console.log(this.imageUrl)
			},
			editDescription(){
				if(this.$isEmpty(this.description)){
					uni.navigateTo({
						url:'/pages/ican/publishService/serviceDescription/serviceDescription'
					})
				}else{
					uni.navigateTo({
						url:`/pages/ican/publishService/serviceDescription/serviceDescription?description=${this.description}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popDialog {
		width: 590rpx;
		padding: 32rpx 32rpx 48rpx;
		background-color: #FFFFFF;
	
		.message {
			font-size: 36rpx;
			line-height: 52rpx;
			margin: 48rpx;
			text-align: center;
		}
	
		.noRepeat {
			flex: 1;
			background: #F5f7f8;
			color: #565B5F;
			margin-right: 30rpx;
		}
	
		.repeatNow {
			flex: 1;
		}
	}
	.ImgWrap{
		display: grid;
		grid-template-columns: repeat(3,1fr);
	}
	.tagItem{
		background: #F5F7F8;
		border-radius: 4rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: #565B5F;
		padding: 6rpx 12rpx;
		margin-left:16rpx;
	}
	.wrapBtn{
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #FFFFFF;
		z-index: 999;
		.btn{
			padding: 24rpx 32rpx 32rpx;
		}
	}
	.priceContent{
		padding: 32rpx 24rpx 32rpx 32rpx;
		background-color: #f5f7f8;
		border-radius: 8rpx;
		margin: 0 32rpx;
		.priceContentItem{
			justify-content: space-between;
			font-size: 28rpx;
			line-height: 40rpx;
		}
	}
	.priceTitle{
		padding: 24rpx 0;
		margin: 0 32rpx;
		font-size: 32rpx;
		line-height: 44rpx;
		color: #272727;
		justify-content: space-between;
		.chooseFree{
			padding: 12rpx 24rpx;
			border: 1px solid #ECEEF0;
			border-radius: 60rpx;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #BCC4CB;
			.line{
				margin: 0 16rpx;
				width: 0px;
				height: 22rpx;
				border: 1px solid #ECEEF0;
			}
		}
	}
	.emptyImgWrap{
		margin-bottom: 16rpx;
		overflow: hidden;
	}
	.img{
		width: 160rpx;
		height: 160rpx;
	}
	.rightImg{
		width: 14rpx;
		height: 40rpx;
		margin-left: 18rpx;
	}
	.checked{
		color: #f73737 !important;
		background: rgba(247, 55, 55, .1) !important;
	}
	.freeChecked{
		color: #f73737 !important;
	}
	.title{
		font-size: 32rpx;
		line-height: 44rpx;
		color: #272727;
		padding: 32rpx 0;
		margin: 0 32rpx;
	}
	.labelList{
		padding: 0 32rpx;
		margin-bottom: 16rpx;
		display: grid;
		grid-template-columns: repeat(4,1fr);
		grid-column-gap:16rpx;
		grid-row-gap: 16rpx;
		.labelList_item{
			background-color: #f5f7f8;
			width: 160rpx;
			height: 60rpx;
			text-align: center;
			font-size: 26rpx;
			line-height: 60rpx;
			border-radius: 8rpx;
		}
	}
	.name{
		margin: 0 32rpx;
		padding-top: 24rpx;
		padding-bottom: 16rpx;
		border-bottom:1px solid #EDEDED50;
		margin-bottom: 16rpx;
	}
.container{
	padding: 24rpx 0;
}
</style>
