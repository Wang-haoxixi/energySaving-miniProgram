<template>
	<view class="container">
		<view class="title">
			<view class="kindList" id="list">
				<view class="flexRowStart kindListItem" :class="activeKind?'pickOn':'pickOff'" @tap="chooseKind">
					<text>{{$isEmpty(examKind)?'':examKind}}</text>
					<image class="pickImg" v-if="activeKind && oss" mode="aspectFill" :src="oss+'icon_soExamination_pickon.png'"></image>
					<image class="pickImg" v-else-if="oss" :src="oss+'icon_triangle_gray.png'" style="width: 33rpx;height: 33rpx;"></image>
				</view>
				<view class="flexRowStart kindListItem" :class="activeSort?'pickOn':'pickOff'" @tap="chooseSort">
					<text>{{$isEmpty(examSort)?'':examSort}}</text>
					<image class="pickImg" v-if="activeSort && oss" mode="aspectFill" :src="oss+'icon_soExamination_pickon.png'"></image>
					<image class="pickImg" v-else-if="oss" :src="oss+'icon_triangle_gray.png'" style="width: 33rpx;height: 33rpx;"></image>
				</view>
				<view class="flexRowStart kindListItem" :class="activeType?'pickOn':'pickOff'" @tap="chooseType">
					<text>筛选</text>
					<image class="pickImg" v-if="activeType && oss" mode="aspectFill" :src="oss+'icon_soExamination_pickon.png'"></image>
					<image class="pickImg" v-else-if="oss" :src="oss+'icon_triangle_gray.png'" style="width: 33rpx;height: 33rpx;"></image>
				</view>
			</view>
			<view class="flexRowStart search" @tap="goSearch">
				<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
				<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" disabled></input>
			</view>
			<uni-popup ref="sortStatus" type="top">
				<view class="">
					<view class="kindList" id="list" @tap="hide" style="margin: 0 40rpx;">
						<view class="flexRowStart kindListItem" :class="activeKind?'pickOn':'pickOff'" @tap="hideChooseKind">
							<text>{{$isEmpty(examKind)?'':examKind}}</text>
							<image class="pickImg" v-if="activeKind && oss" mode="aspectFill" :src="oss+'icon_soExamination_pickon.png'"></image>
							<image class="pickImg" v-else-if="oss" :src="oss+'icon_triangle_gray.png'" style="width: 33rpx;height: 33rpx;"></image>
						</view>
						<view class="flexRowStart kindListItem" :class="activeSort?'pickOn':'pickOff'" @tap="hideChooseSort">
							<text>{{$isEmpty(examSort)?'':examSort}}</text>
							<image class="pickImg" v-if="activeSort && oss" mode="aspectFill" :src="oss+'icon_soExamination_pickon.png'"></image>
							<image class="pickImg" v-else-if="oss" :src="oss+'icon_triangle_gray.png'" style="width: 33rpx;height: 33rpx;"></image>
						</view>
						<view class="flexRowStart kindListItem" :class="activeType?'pickOn':'pickOff'" @tap="hideChooseType">
							<text>筛选</text>
							<image class="pickImg" v-if="activeType && oss" mode="aspectFill" :src="oss+'icon_soExamination_pickon.png'"></image>
							<image class="pickImg" v-else-if="oss" :src="oss+'icon_triangle_gray.png'" style="width: 33rpx;height: 33rpx;"></image>
						</view>
					</view>
					<view class="" v-if="activeKind==true">
						<view class="sortAction color_919397 flexRow" :style="{top:topHeight + 'px',maxHeight:maxHeight+'px'}" style="align-items: flex-start;">
							<scroll-view class="flexColumnStart kindScroll" scroll-y="true" :style="{maxHeight:maxHeight+'px'}" style="padding-right: 40rpx;">
								<view class=" flexColumn singleEllipsis kindScrollItem" :class="item.status?'pickOn':'pickOff'" v-for="(item,index) of allTypeList" :key="index" @tap="firstAll(item,index)">
									{{$isEmpty(item.label)?'':item.label}}
								</view>
								<view class="" style="width: 0.3rpx;height: 100%;background-color: #EFF0F1;">
									
								</view>
							</scroll-view>
							<scroll-view class="flexColumnStart kindScroll" scroll-y="true"  style="padding-right: 40rpx;" :style="{maxHeight:maxHeight+'px'}">
								<view v-if="secondTypeStatus" class=" flexColumn singleEllipsis kindScrollItem" :class="item.status?'pickOn':'pickOff'" v-for="(item,index) of secondTypeList" :key="index" @tap="secondAll(item,index)">
									{{$isEmpty(item.label)?'':item.label}}
								</view>
							</scroll-view>
							<scroll-view class="flexColumnStart kindScroll" scroll-y="true" style="padding-right: 40rpx;" :style="{maxHeight:maxHeight+'px'}">
								<view v-if="thirdTypeStatus" class="flexColumn singleEllipsis kindScrollItem" :class="item.status?'pickOn':'pickOff'" v-for="(item,index) of thidTypeList" :key="index" @tap="thirdAll(item,index)">
									{{$isEmpty(item.label)?'':item.label}}
								</view>
							</scroll-view>
						</view>
					</view>
					<view class="" v-else-if="activeSort==true">
						<view class="flexColumn sortAction" :style="{top:topHeight + 'px'}">
							<view class="sortKind" :class="item.status?'pickOn':'pickSortOff'" v-for="(item,index) of sortList" :key="index" :style="index<2?'border-bottom:0.3rpx solid #F4F4F4':''" @tap="changeSort(item,index)">
								{{$isEmpty(item.name)?'':item.name}}
							</view>
						</view>
					</view>
					<view class="" v-else-if="activeType==true">
						<view class="sortAction color_303031" :style="{top:topHeight + 'px'}">
							<view class="typeTitle bold">
								难度
							</view>
							<view class="flexRow chooseBtn" style="margin-bottom: 60rpx;">
								<view class="chooseBtnItem" :class="item.status?'pickChooseOn':'pickChooseOff'" v-for="(item,index) of hardLevel" :key="index" @tap="changeHardLevel(item,index)">
									{{$isEmpty(item.label)?'':item.label}}
								</view>
							</view>
							<view class="typeTitle bold">
								状态
							</view>
							<view class="flexRow chooseBtn" style="margin-bottom: 60rpx;">
								<view class="chooseBtnItem" :class="item.status?'pickChooseOn':'pickChooseOff'" v-for="(item,index) of examStatus" :key="index" @tap="changeExamStatus(item,index)">
									{{$isEmpty(item.name)?'':item.name}}
								</view>
							</view>
							<view class="typeTitle bold">
								类型
							</view>
							<view class="flexRowStart chooseBtn" style="margin-bottom: 60rpx;">
								<view class="chooseBtnItem" :class="item.status?'pickChooseOn':'pickChooseOff'" v-for="(item,index) of examType" :key="index" style="margin-right: 30rpx;" @tap="changeExamType(item,index)">
									{{$isEmpty(item.name)?'':item.name}}
								</view>
							</view>
							
							<view class="btns flexRow">
								<view class="button resetBtn" @tap="resetChoose">
									重置
								</view>
								<view class="button confirmBtn" @tap="confirmChoose">
									确定
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<scroll-view :scroll-y="scrollStatus">
			<view class="" style="padding-top: 12rpx;">
				<view class="examList" v-for="(item,index) of examList.records" :key="index" @tap="goDetails(item)">
					<view class="doubleEllipsis bold color_303031 examName">
						{{$isEmpty(item.examName)?'':item.examName}}
					</view>
					<view class="flexRow examInfo color_919397">
						<view class="time">
							<view class="">
								{{$isEmpty(item.appShowTime)?'长期有效':item.appShowTime}}
							</view>
						</view>
						<view class="member">
							{{$isEmpty(item.testNumber)?'0':item.testNumber}}人已考
						</view>
					</view>
					<view class="flexRow examOrg color_2F80FF" style="justify-content: flex-end;">
						<view v-if="item.beginStatus==1" class="btn color_F74437" style="background: rgba(247, 68, 55, 0.1);">
							立即参加
						</view>
						<view v-if="item.beginStatus==2" class="btn color_919397" style="background-color: #E3E4E5;">
							未开始
						</view>
						<view v-if="item.beginStatus==3" class="btn color_2F80FF" style="background: rgba(224, 233, 246, 0.9);">
							已参加
						</view>
					</view>
					<view class="freeStatus" v-if="item.chargeStatus==2 || item.chargeStatus==3">
						<image v-if="oss" :src="oss+'icon_soExamination_notFree.png'"></image>
					</view>
				</view>
			</view>
			<image class="noExamImg" v-if="!examList.records.length > 0 && oss" :src="oss+'pic_emptyExam.png'" mode="aspectFit"></image>
			<uni-load-more :status="examListStatus" v-if="examList.records.length>0"></uni-load-more>
		</scroll-view>
		<view class="bottom-safe" style="height: 112rpx;"></view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				orgId:'',
				examList:{},
				oss:'',
				examListStatus:'noMore',
				activeKind:true,
				activeSort:false,
				activeType:false,
				examKind:'全部分类',
				examSort:'排序',
				topHeight:'',
				maxHeight:'',
				sortNum:'',
				level:'',
				chargeStatus:'',
				testStatus:'',
				firstAllStatus:'',
				secondAllStatus:'',
				thirdAllStatus:'',
				sortList:[
					{name:'智能排序',status:false,value:'1'},{name:'考试人数',status:false,value:'2'},{name:'发布时间',status:false,value:'3'},
				],
				examStatus:[{name:'可参加',status:false,value:'1'},{name:'未开始',status:false,value:'2'},{name:'已参加',status:false,value:'3'}],
				examType:[{name:'免费',status:false,value:'1'},{name:'收费',status:false,value:'2'}],
				hardLevel:[],
				allTypeList:[],
				secondTypeList:[],
				secondTypeStatus:false,
				thidTypeList:[],
				thirdTypeStatus:false,
				scrollStatus:true
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			const {orgId }= options
			this.orgId = orgId
			this.$http.get('qms/exam_org_dict/get_query_param_new',{
				params:{
					source:'1',
					orgId:this.orgId
				}
			}).then(res=>{
				console.log(res)
				if(!this.$isEmpty(res.data.data.level) &&  res.data.data.level.length>0){
					this.hardLevel = res.data.data.level.map(item=>{
						return {
							...item,
							status:false
						}
					})
				}else{
					this.hardLevel =[]
				}
				if(!this.$isEmpty(res.data.data.type) &&res.data.data.type.length>0){
					this.allTypeList = res.data.data.type.map(item=>{
						return{
							...item,
							status:false
						}
					})
				}else{
					this.allTypeList=[]
				}
			})
			uni.createSelectorQuery()
				.in(this)
				.select('#list')
				.boundingClientRect()
				.exec(ret => {
					// console.log(ret)
					let height = uni.getSystemInfoSync().windowHeight;
					// console.log(height)
					this.topHeight = ret[0].height
					// console.log(this.scrollHeight)
					this.maxHeight = height * 0.6
				});
		},
		onShow() {
			this.$http.get('qms/exam_examination/app_page',{
				params:{
					source:'1',
					orgId:this.orgId,
					sort: this.sortNum,
					testStatus: this.testStatus,
					chargeStatus: this.chargeStatus,
					level: this.level,
					type: this.firstAllStatus
				}
			}).then(res=>{
				// console.log(res)
				this.examList=res.data.data
				if(!(this.examList.current<this.examList.pages)){
					this.examListStatus='noMore'
				}else{
					this.examListStatus='more'
				}
			})
		},
		onReachBottom() {
			let that =this
			if (that.examList.current < that.examList.pages) {
				that.examListStatus = 'loading';
				that.$http.get('qms/exam_examination/app_page', {
					params: {
						source:'1',
						orgId:that.orgId,
						sort:that.sortNum,
						testStatus:that.testStatus,
						chargeStatus:that.chargeStatus,
						level:that.level,
						type:that.firstAllStatus,
						current: that.examList.current + 1
					}
				}).then(res => {
					that.examList.current = res.data.data.current;
					that.examList.records = that.examList.records.concat(res.data.data.records);
					that.examListStatus = 'more';
				});
			} else {
				that.examListStatus = 'noMore';
			}
		},
		methods:{
			hide(){
				this.$refs.sortStatus.close()
				this.scrollStatus=true
			},
			goDetails(item){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationDetails/soExaminationDetails?id=${item.id}&examName=${item.examName}`
				})
			},
			chooseKind(){
				this.activeKind=true,
				this.activeSort=false,
				this.activeType=false,
				this.$refs.sortStatus.open()
				this.scrollStatus =false
			},
			chooseSort(){
				this.activeKind=false,
				this.activeSort=true,
				this.activeType=false,
				this.$refs.sortStatus.open()
				this.scrollStatus =false
			},
			chooseType(){	
				this.activeKind=false,
				this.activeSort=false,
				this.activeType=true,
				this.$refs.sortStatus.open()
				this.scrollStatus =false
			},
			hideChooseKind(){
				
				this.$refs.sortStatus.close()
				this.scrollStatus=true
			},
			hideChooseSort(){
				
				this.$refs.sortStatus.close()
				this.scrollStatus=true
			},
			hideChooseType(){	
				
				this.$refs.sortStatus.close()
				this.scrollStatus=true
			},
			changeSort(item,index){
				this.examSort=item.name
				this.sortList.forEach(item2=>{
					if(item2.name == item.name){
						item2.status =true
					}else{
						item2.status =false
					}
				})
				this.sortNum=item.value
				this.$http.get('qms/exam_examination/app_page',{
					params:{
						source:'1',
						orgId:this.orgId,
						sort:this.sortNum,
						testStatus:this.testStatus,
						chargeStatus:this.chargeStatus,
						level:this.level,
						type:this.firstAllStatus,
					}
				}).then(res=>{
					// console.log(res)
					this.examList=res.data.data
					if(!this.examList.current<this.examList.pages){
						this.examListStatus='noMore'
					}
				})
				this.$refs.sortStatus.close()
				this.scrollStatus=true
			},
			changeHardLevel(item,index){
				this.hardLevel.forEach(item2=>{
					if(item2.label == item.label){
						item2.status =true
					}else{
						item2.status =false
					}
				})
			},
			changeExamStatus(item,index){
				this.examStatus.forEach(item2=>{
					if(item2.name == item.name){
						item2.status =true
					}else{
						item2.status =false
					}
				})
			},
			changeExamType(item,index){
				this.examType.forEach(item2=>{
					if(item2.name == item.name){
						item2.status =true
					}else{
						item2.status =false
					}
				})
			},
			resetChoose(){
				this.level=''
				this.chargeStatus=''
				this.testStatus=''
				this.hardLevel.forEach(item=>{
					item.status=false
				})
				this.examStatus.forEach(item=>{
					item.status=false
				})
				this.examType.forEach(item=>{
					item.status=false
				})
			},
			confirmChoose(){
				this.hardLevel.forEach(item=>{
					if(item.status==true){
						this.level =item.value
					}
				})
				this.examStatus.forEach(item=>{
					if(item.status==true){
						this.testStatus =item.value
					}
				})
				this.examType.forEach(item=>{
					if(item.status==true){
						this.chargeStatus =item.value
					}
				})
				this.$refs.sortStatus.close()
				this.scrollStatus=true
				this.$http.get('qms/exam_examination/app_page', {
					params: {
						source:'1',
						orgId:this.orgId,
						sort:this.sortNum,
						testStatus:this.testStatus,
						chargeStatus:this.chargeStatus,
						level:this.level,
						type:this.firstAllStatus,
					}
				}).then(res => {
					this.examList=res.data.data
					if(!this.examList.current<this.examList.pages){
						this.examListStatus='noMore'
					}
				});
			},
			firstAll(item,index){
				this.secondTypeStatus = false
				this.thirdTypeStatus = false
				this.allTypeList.forEach(item2=>{
					if(item2.label == item.label){
						item2.status =true
					}else{
						item2.status =false
					}
				})
				if(this.$isEmpty(item.children)){
					this.$refs.sortStatus.close()
					this.scrollStatus=true
					this.examKind = item.label
					this.firstAllStatus = item.value
					this.$http.get('qms/exam_examination/app_page',{
						params:{
							source:'1',
							orgId:this.orgId,
							sort:this.sortNum,
							testStatus:this.testStatus,
							chargeStatus:this.chargeStatus,
							level:this.level,
							type:this.firstAllStatus
						}
					}).then(res=>{
						this.examList=res.data.data
						if(!this.examList.current<this.examList.pages){
							this.examListStatus='noMore'
						}
					})
				}else{
					this.secondTypeList = item.children.map(item=>{
						return {
							...item,
							status:false
						}
					})
					this.secondTypeStatus = true
				}
			},
			secondAll(item,index){
				this.thirdTypeStatus = false
				this.secondTypeList.forEach(item2=>{
					if(item2.label == item.label){
						item2.status =true
					}else{
						item2.status =false
					}
				})
				if(this.$isEmpty(item.children)){
					this.$refs.sortStatus.close()
					this.scrollStatus=true
					this.examKind = item.label
					this.firstAllStatus = item.value
					this.$http.get('qms/exam_examination/app_page',{
						params:{
							source:'1',
							orgId:this.orgId,
							sort:this.sortNum,
							testStatus:this.testStatus,
							chargeStatus:this.chargeStatus,
							level:this.level,
							type:this.firstAllStatus
						}
					}).then(res=>{
						this.examList=res.data.data
						if(!this.examList.current<this.examList.pages){
							this.examListStatus='noMore'
						}
					})
				}else{
					this.thidTypeList = item.children.map(item=>{
						return {
							...item,
							status:false
						}
					})
					this.thirdTypeStatus = true
				}
			},
			thirdAll(item,index){
				this.thidTypeList.forEach(item2=>{
					if(item2.label == item.label){
						item2.status =true
					}else{
						item2.status =false
					}
				})
				this.$refs.sortStatus.close()
				this.scrollStatus=true
				this.examKind = item.label
				this.firstAllStatus = item.value
				this.$http.get('qms/exam_examination/app_page',{
					params:{
						source:'1',
						orgId:this.orgId,
						sort:this.sortNum,
						testStatus:this.testStatus,
						chargeStatus:this.chargeStatus,
						level:this.level,
						type:this.firstAllStatus
					}
				}).then(res=>{
					this.examList=res.data.data
					if(!this.examList.current<this.examList.pages){
						this.examListStatus='noMore'
					}
				})
			},
			goSearch(){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soExamination/searchExam/searchExam?orgId=${this.orgId}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.memberImg{
		width: 26rpx;
		height: 26rpx;
		margin-right: 10rpx;
	}
.kindScroll{
	width: 250rpx; 
	// border-right:0.3rpx solid #EFF0F1 ;
	.kindScrollItem{
		flex: 1;
		min-width: 0rpx;
		padding: 34rpx 0;
		text-align: center;
	}
}
.btns{
	margin-bottom: 40rpx;
	}
	::v-deep.resetBtn{
		margin-right: 30rpx;
		flex: 1;
		padding: 22rpx 128rpx;
		background: #F5f7f8;
		color: #565B5F;
	}
	::v-deep.confirmBtn{
		flex: 1;
		padding: 22rpx 128rpx;
	}
.title{
	position: sticky;
	top: 0rpx;
	z-index: 9;
	background-color: #FFFFFF;
	padding: 0 32rpx;
	padding-bottom: 20rpx;
}
.sortAction{
	width:670rpx;
	padding: 0 40rpx;
	background-color: #FFFFFF;
	position: absolute;
	left: 0rpx;
	top: 0rpx;
	z-index: 10;
	border-radius: 0rpx 0rpx 20rpx 20rpx;
	font-size: 28rpx;
	line-height: 40rpx;
	.sortKind{
		width: 100%;
		text-align: center;
		padding: 30rpx 0rpx;
	}
	.line{
		width: 100%;
		height: 0.3rpx;
		background-color: #F4F4F4;
	}
	.typeTitle{
		margin-bottom: 30rpx;
	}
	.chooseBtn{
		font-size: 24rpx;
		line-height: 34rpx;
		.chooseBtnItem{
			width: 204rpx;
			height: 66rpx;
			text-align: center;
			line-height: 66rpx;
			border-radius: 10rpx;
		}
	}
}
.pickImg{
	width: 44rpx;
	height: 44rpx;
	margin-left: 4rpx;
}
.pickOn{
	font-weight: bold;
	color: #F74437;
}
.pickOff{
	font-weight: normal;
	color: #919397;
}
.pickSortOff{
	font-weight: normal;
	color: #666769;
}
.pickChooseOn{
	font-weight: bold;
	color: #F74437;
	background:rgba(247, 68, 55, 0.1)
}
.pickChooseOff{
	font-weight: normal;
	color: #303031;
	background-color: #F4F5F6;
}
.noExamImg{
	width: 100%;
}
.search{
	padding: 18rpx 32rpx;
	border-radius: 60rpx;
	background-color: #F5f7f8;
	.searchImg{
		height: 32rpx;
		width: 32rpx;
		margin-right: 16rpx;
	}
}
.inputDefault {
	font-size: 28rpx;
	color: #919397;
}
input {
	flex: 1;
	font-size: 28rpx;
	padding: 0 14rpx;
	color: #666769;
}
.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
.container{
	.kindList{
		padding:40rpx 0 30rpx 0;
		position: relative;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		line-height: 40rpx;
		.kindListItem{
			width: 250rpx;
			justify-content: center;
		}
	}
	.examList{
		margin: 0 40rpx;
		padding: 30rpx;
		background-color:#F4F5F6;
		border-radius: 30rpx;
		position: relative;
		margin-bottom: 40rpx;
		.examName{
			font-size: 32rpx;
			line-height: 48rpx;
			margin-bottom: 20rpx;
		}
		.examInfo{
			font-size: 22rpx;
			line-height: 32rpx;
			margin-bottom: 30rpx;
		}
		.examOrg{
			font-size: 24rpx;
			line-height: 34rpx;
			.btn{
				width: 156rpx;
				height: 50rpx;
				line-height: 50rpx;
				text-align: center;
				border-radius: 26rpx;
			}
		}
		.freeStatus{
			width: 60rpx;
			height: 36rpx;
			position: absolute;
			top: -6rpx;
			left: -8rpx;
			image{
				width: 60rpx;
				height: 36rpx;
			}
		}
	}
}
</style>
