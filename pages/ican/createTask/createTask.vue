<template>
	<view class="container">
		<view class="containerWrap">
			<view class="uni-textarea content">
				<!-- <textarea v-show="!showPicker" class="contentInfo" placeholder-class="contentInfoDefault" v-model="titleInfo"
				 @input="checkInfo" :disable-default-padding="true" placeholder="添加任务主题" maxlength="100" /> -->
				 <textarea v-show="!showPicker" class="contentInfo" placeholder-class="contentInfoDefault" v-model="titleInfo"
				  @input="checkInfo" :disable-default-padding="true" placeholder="请输入需求任务标题" maxlength="100" auto-height />
				<view v-text="titleInfo" class="contentInfo" v-show="showPicker && titleInfo.length>0">
					<!-- {{titleInfo}} -->
				</view>
				<view class="changeContentInfo" v-show="showPicker && !titleInfo.length>0">
					请输入需求任务标题
				</view>
				<view class="color_BABEC0 remark">
					<!-- 你还可以输入{{$isEmpty(limitNum)?'0':limitNum}}字 -->
				</view>
			</view>
			<view class="flexRow chooseSo" @tap="chooseSo">
				<image :src="$ossUrl('createTask_requiredIcon.png')" mode="" style="margin-right: 4rpx;width: 14rpx;height: 44rpx;"></image>
				<image v-if="oss" class="soImg" :src="$ossUrl('createTask_addSo.png')"></image>
				<view class="soName">{{name}}</view>
				<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
			</view>
			<view class="flexRow chooseMembers" @tap="chooseMembers" style="margin-left: 18rpx;">
				<image v-if="oss" class="addImg" :src="$ossUrl('createTask_addMember.png')"></image>
				<view v-if="soMemberList.length==0" class="memberTitle">添加协作人</view>
				<view v-else class="flexRowStart wrapMemberList">
					<view class="memberList" v-for="(item,index) of soMemberList" :key="index" v-if="index<=4">
						<image :src="item.avatar" mode="aspectFill"></image>
					</view>
				</view>
				<view class="flexRowStart">
					<view class="" v-if="soMemberList.length>0">
						<view v-if="soMemberList.length<=5" class=" memberCount">
							{{$isEmpty(soMemberList.length)?'0':soMemberList.length}}人
						</view>
						<view v-else class="memberCount">
							等{{$isEmpty(soMemberList.length)?'0':soMemberList.length}}人
						</view>
					</view>
					<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
				</view>
			</view>
			<view @tap="onShowDatePicker('datetime')" class="chooseTime">
				<view class="flexRow wrapChooseTime">
					<image :src="$ossUrl('createTask_requiredIcon.png')" mode="" style="margin-right: 4rpx;width: 14rpx;height: 44rpx;"></image>
					<image v-if="oss" class="deadlineImg" :src="$ossUrl('createTask_deadline.png')"></image>
					<view v-if="date== ''" class="uni-input deadlineInfo">截止时间</view>
					<view v-else class="uni-input deadlineInfo">{{$isEmpty(date)?'':date}}</view>
					<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
				</view>
			</view>
			<view class="">
				<picker class="urgencyInfo" mode="selector" :value="value"  @change="bindPickerChange" :range="array">
					<view class="flexRow wrapUrgency" style="margin-left: 18rpx;">
						<image v-if="oss" class="urgencyImg" :src="$ossUrl('createTask_urgency.png')"></image>
						<view class="flexRow urgencyContent">
							<text class=" urgencyTitle">紧急度</text>
							<view class="uni-input urgency">{{$isEmpty(value)?'':value}}</view>
						</view>
						<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
					</view>
				</picker>
				<view class="chooseRelation" @tap="addRelation">
					<view class="flexRow relationWrap" style="margin-left: 18rpx;">
						<image v-if="oss" class="relationImg" :src="$ossUrl('createTask_relation.png')"></image>
						<view class=" flexRow relationContent">
							<text>添加关联</text>
							<text class=" relationInfo" v-if="relationList.length!=0">已选{{$isEmpty(relationList.length)?'0':relationList.length}}个</text>
						</view>
						<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
					</view>
					<view v-if="relationList.length!=0" class=" flexRow relationList" v-for="(item,index) of relationList" :key="index">
						<view class="" style="width: 8rpx;height: 8rpx;background: #5F5F5F;border-radius: 50%;margin-right: 16rpx;">
							
						</view>
						<view class="singleEllipsis name">
							{{$isEmpty(item.name)&&$isEmpty(item.materialName)?'':item.name || item.materialName}}
						</view>
						<image v-if="oss" class="deleteImg" :src="$ossUrl('createTask_del_relation.png')" @tap.stop="deleteMaterial(index)"></image>
					</view>
				</view>
				<view class="urgencyInfo" @tap="chooseTaskReward">
					<view class="flexRow wrapUrgency" style="margin-left: 18rpx;">
						<image v-if="oss" class="urgencyImg" :src="$ossUrl('createTask_award.png')"></image>
						<view class="flexRow urgencyContent">
							<view class="flexRowStart">
								<text class=" urgencyTitle">奖励分配</text>
							</view>
							<view class="uni-input urgency">{{$isEmpty(rewardValue)?'':rewardValue}}</view>
						</view>
						<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
					</view>
				</view>
				<view class="descriptionContent"  @tap="addDescription">
					<view class="flexRow descriptionInfo">
						<image :src="$ossUrl('createTask_requiredIcon.png')" mode="" style="margin-right: 4rpx;width: 14rpx;height: 44rpx;"></image>
						<image v-if="oss" class="describeImg" :src="$ossUrl('createTask_description.png')"></image>
						<view class="describeTitle">任务详情</view>
						<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
					</view>
					<view v-if="description!=''" class="description">
						{{$isEmpty(description)?'':description}}
					</view>
				</view>
			</view>
			<!-- <view class="followWorkshop" v-if="isAdmin==1 ||isAdmin==2|| isAdmin==true">
				<checkbox-group name=""  @change="changeStatus">
					<label class="flexRow">
						<view class="flexRowStart">
							<image v-if="oss" class="plantImg" :src="oss+'icon_createTask_plant.png'"></image>
							<text class="color_F74437 plantTitle">同步到工场</text>
						</view>
						<checkbox color="#FF6034" :checked="isWorkshop==1" :disabled="isAdmin==true && isWorkshop==1"/>
					</label>
				</checkbox-group>
			</view> -->
			<!-- <view class="flexRowStart changeShowStatus" v-show="!showAll" @tap="changeShowAll">
				<view class="color_2F80FF" style="font-size: 28rpx;line-height: 40rpx;">
					显示全部
				</view>
				<image v-if="oss" :src="oss+'icon_blueArrowDown.png'" style="width: 44rpx;height: 44rpx;"></image>
			</view> -->
			<!-- <view class="bottom-safe" style="height: 112rpx;"></view> -->
		</view>
		<view class=""  style="height: 228rpx;">
			
		</view>
		<view class="sendBtn">
			<view class="send" @tap="submit">
				发布
			</view>
		</view>
		<mx-date-picker format="yyyy-mm-dd hh:ii" :show="showPicker" :chooseDate="date" :status="repeatStatus" :type="type" :value="date" :show-tips="true" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" @chooseTime="changeTimeType" @getRepeat="getRepeatValue"/>
		<jpPwd ref="jpPwds" @completed="completed" @forget="forget"></jpPwd>
		<uni-popup ref="dialog" type="center">
			<view class="popDialog">
				<view class="">
					<view class="color_303031 bold title">
						提示
					</view>
					<view class="color_666769 message">
						您未设置支付密码
					</view>
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancel">
						取消
					</view>
					<view class="button repeatNow" @tap="pass">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import jpPwd from '@/components/jp-pwd/jp-pwd.vue';
	import {
		imageError
	} from '@/common/utils.js';
	export default {
		components: {
			MxDatePicker,
			jpPwd
			},
		data() {
			return {
				titleInfo:'',
				soInfo:{},
				limitNum:100,
				name:'添加协作组织',
				orgId:'',
				date: "",
				value:'一般',
				array: ['一般', '紧急', '非常紧急'],
				rewardValue:'不设置奖励',
				relationList:[],
				submitRelationList:[],
				status:false,
				description:'',
				soMemberList:[],
				submitSoMemberList:[],
				isWorkshop:1,
				urgency:0,
				isAdmin:0,
				showPicker: false,
				type: 'datetime',
				oss:'',
				repeatStatus:false,
				userId:'',
				password:'',
				taskType:'',
				taskCycle:'',
				finishTime:'',
				allocationType:'',
				allocationAmount:'',
				showAll:false
			};
		},
		onLoad(options) {
			// console.log(this.orgId)
			this.userId = uni.getStorageSync('userinfo').user_id
			//通过这个字段判断奖励弹框以及页面的展示方式以及是否展示
			this.oss=this.$oss
			uni.removeStorageSync('choose')
			uni.removeStorageSync('relation')
			if(uni.getStorageSync('editTask')){
				const {taskId,isAdmin} =options	
				this.isAdmin =JSON.parse(isAdmin)
				// console.log(isAdmin)
				uni.setNavigationBarTitle({
					title:'编辑任务'
				})
				uni.setStorageSync('taskStatus',true)
			this.$http.get('/qms/cooperation_task/task_user', {
						params: {
							taskId: taskId
						}
					})
					.then(res => {
						// console.log(res)
						this.soMemberList = res.data.data
						this.soMemberList.forEach(item=>{
							item.avatar=imageError(item.avatar,this.oss)
						})
						// console.log(this.soMemberList)
						this.soMemberList=this.soMemberList.filter(item=>{
							return item.userId != this.userId
						})
						uni.setStorageSync('choose',this.soMemberList)
					})				
					// console.log(uni.getStorageSync('editTask'))
				this.titleInfo = uni.getStorageSync('editTask').title
				this.limitNum =100 - uni.getStorageSync('editTask').title.length
				this.description = uni.getStorageSync('editTask').description
				this.urgency =  uni.getStorageSync('editTask').urgency
				this.name = uni.getStorageSync('editTask').orgName
				this.orgId =uni.getStorageSync('editTask').orgId
				// this.soMemberList = uni.getStorageSync('editTask').cooperationTaskUserVOList
				this.relationList =  uni.getStorageSync('editTask').material
				uni.setStorageSync('relation',this.relationList)
				this.isWorkshop = uni.getStorageSync('editTask').isWorkshop
				this.value = this.array[this.urgency]
				// if(uni.getStorageSync('editTask').admin==0){
				// 	this.isAdmin = 0
				// }else{
				// 	this.isAdmin =1
				// }
				this.allocationType = uni.getStorageSync('editTask').allocationType
				this.allocationAmount = uni.getStorageSync('editTask').allocationAmount
				if(this.allocationType == 0){
					this.rewardValue = '不设置奖励'
				}else if(this.allocationType == 1){
					this.rewardValue = '手动奖励'
				}else if(this.allocationType == 2){
					this.rewardValue = `平均分配${this.allocationAmount}贝`
				}
				if(uni.getStorageSync('editTask').type == 0){
					this.date = uni.getStorageSync('editTask').finishTime.substring(0,16)
					// console.log(this.date)
				}else if(uni.getStorageSync('editTask').type ==1){
					this.repeatStatus =true
					this.date = '每日重复'
				}else if(uni.getStorageSync('editTask').type == 2){
					this.repeatStatus =true
					this.date = '每周重复'
				}else if(uni.getStorageSync('editTask').type == 3){
					this.repeatStatus =true
					this.date= '每月重复'
				}else if(uni.getStorageSync('editTask').type == 4){
					this.repeatStatus =true
					this.date = uni.getStorageSync('editTask').cycle+'天重复'
				}
			}else{
				const {name , orgId,isAdmin}=options
				// console.log(isAdmin)
				this.name=name
				this.orgId=orgId
				this.isAdmin=isAdmin
				if(this.$isEmpty(this.name)){
					this.$http.get('/admin/app/one_org').then(res=>{
						if(!this.$isEmpty(res.data.data.name)){
							this.name = res.data.data.name
							this.orgId = res.data.data.orgId
						}else{
							//无组织
						}
					})
				}
				uni.setStorageSync('taskStatus',false)
			}
			uni.$on('list',(data)=>{
				// console.log(data.info)
				this.soInfo=JSON.parse(data.info)
				// console.log(this.soInfo)
				this.name=this.soInfo.name
				this.orgId=this.soInfo.orgId
				this.isAdmin=this.soInfo.isAdmin
				this.relationList=[]
				this.soMemberList=[]
			})
			uni.$on('update',(data)=>{
				let list=data.array
				this.relationList=JSON.parse(list)
				this.submitRelationList=this.relationList.map(item=>{
					// console.log("材料",item)
					return {type:item.type , relatedId:item.id}
				})
				// console.log(this.relationList)
				// console.log(this.submitRelationList)
			})
			uni.$on('add',(data)=>{
				this.description=data
				// console.log(this.description)
			})
			uni.$on('allocation',(data)=>{
				this.rewardValue=data
				// console.log(this.rewardValue)
			})
			uni.$on('choose',(data)=>{
				let list = data.array
				this.soMemberList=JSON.parse(list)
				// console.log(this.soMemberList)
				this.submitSoMemberList=this.soMemberList.map(item=>{
					return item.userId
				})
				// console.log(this.submitSoMemberList)
			})
			uni.$on("title",(data)=>{
				this.titleInfo=data
				// console.log(this.titleInfo)
			})
		},
		onShow() {
			this.password = uni.getStorageSync('user').safePassword
		},
		onUnload() {
			// console.log(6)
			uni.removeStorageSync('choose')
			uni.removeStorageSync('relation')
			uni.removeStorageSync('editTask')
			uni.removeStorageSync('taskStatus')
			uni.$off()
		},
		computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        },
				pickerStatus(){
					if(!this.soMemberList.length>0){
						return true
					}else{
						return false
					}
				}
		    },
		methods:{
			cancel(){
				this.$refs.dialog.close()
			},
			pass(){
				uni.navigateTo({
					url:'/pages/my/payPassword/payPassword'
				})
				this.$refs.dialog.close()
			},
			changeShowAll(){
				this.showAll=!this.showAll
			},
			chooseTaskReward(){
				if(this.rewardValue=='不设置奖励'){
					uni.navigateTo({
						url:`/pages/ican/createTask/editReward/editReward?checkStatus=1`
					})
				}else if(this.rewardValue == '手动奖励'){
					uni.navigateTo({
						url:`/pages/ican/createTask/editReward/editReward?checkStatus=2`
					})
				}else{
					uni.navigateTo({
						url:`/pages/ican/createTask/editReward/editReward?checkStatus=3&autoAllocationValue=${this.rewardValue}`
					})
				}
			},
			getRepeatValue(value){
				this.date=value
				this.showPicker=false
				// this.repeatStatus=false
			},
			changeTimeType(e){
				if(e.detail.value==true){
					this.repeatStatus=true
					// console.log(this.repeatStatus)
				}else{
					this.repeatStatus=false
					// console.log(this.repeatStatus)
				}
			},
			onShowDatePicker(type){//显示
				// console.log(this.repeatStatus)
				if(this.repeatStatus==false){
					this.showPicker = true
				}else{
					this.showPicker = true;
					this.repeatStatus=true
				}
			},
			onSelected(e) {//选择
				this.showPicker = false;
				// this.repeatStatus=false;
				if(e) {
					this[this.type] = e.value;
					//选择的值
					this.date = e.value;
					console.log('value => '+ e.value);
					//原始的Date对象
					console.log('date => ' + e.date);
				}
			},
			addDescription(){
				uni.navigateTo({
					url:`/pages/ican/createTask/addDescription/addDescription?description=${this.description}`
				})
			},
			changeStatus(e){
				if(this.isWorkshop==1){
					this.isWorkshop=0
				}else if(this.isWorkshop==0){
					this.isWorkshop=1
				}
			},
			deleteMaterial(index){
				this.relationList.splice(index,1)
			},
			addRelation(){
				if(this.orgId==undefined){
					uni.showToast({
						title:"请先选择组织",
						icon:"none",
						duration:1000
					})
				}else{
					uni.navigateTo({
						url:`/pages/ican/createTask/addRelation/addRelation?orgId=${this.orgId}`
					})
				}
			},
			bindPickerChange(e){
				// console.log(e)
				// console.log('picker发送选择改变，携带值为', e.target.value)
				let index = e.detail.value
				this.value=this.array[index]
				this.urgency=index
			},
			bindDateChange(e) {
				// console.log(e)
			    this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			checkInfo(e){
				// console.log(e)
				// console.log(this.titleInfo)
				this.titleInfo=e.detail.value
				// console.log(this.titleInfo)
				uni.$emit("title",this.titleInfo)
				this.limitNum=100-e.detail.cursor
				if(this.limitNum<=0){
					this.limitNum=0
				}
			},
			chooseSo(){
				if(uni.getStorageSync('editTask')){
					uni.showToast({
						title:"组织不可修改",
						icon:"none"
					})
				}else{
					this.status=false
					// console.log(this.status)
					uni.navigateTo({
						url:"/pages/ican/createTask/soList/soList"
					})
				}
			},
			chooseMembers(){
				if(this.orgId==undefined){
					uni.showToast({
						title:"请先选择组织",
						icon:"none",
						duration:1000
					})
				}else{
					uni.navigateTo({
						url:`/pages/ican/createTask/soMemberList/soMemberList?orgId=${this.orgId}&name=${this.name}`
					})
				}
			},
			//加密方法
			Encrypt(word,key,iv) {
				var CryptoJS = require('../../../common/crypto.js');
				// console.log(CryptoJS)
				let srcs = CryptoJS.enc.Utf8.parse(word);
				let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
				return encrypted.toString()
			},
			completed(e) {
					this.password = uni.getStorageSync('user').safePassword
					// console.log(this.password)
				   var CryptoJS = require('../../../common/crypto.js');
				   if(this.$isEmpty(this.password)){
						//没设置密码
				   }else{
					   let key = 'gdscloudprisbest'; 
					   key = CryptoJS.enc.Latin1.parse(key);
					   const iv = key
					   this.password = (this.Encrypt(e,key,iv))
					   // console.log(this.password)
					  if(uni.getStorageSync('editTask')){
					  	let memberList = this.soMemberList.map(item=>{
					  		return item.userId
					  	})
					  	// console.log(memberList)
					  	let submitRelationList=this.relationList.map(item=>{
					  		// console.log("材料",item)
					  		return {type:item.type , relatedId:item.id}
					  	})
					  	this.$http.post('qms/cooperation_task/edit',{
					  		title:this.titleInfo,
					  		finishTime:this.finishTime,
					  		orgId:this.orgId,
					  		id:uni.getStorageSync('editTask').id,
					  		type:this.taskType,
					  		cycle:this.taskCycle,
					  		description:this.description,
					  		isWorkshop:1,
					  		urgency:this.urgency,
					  		userSet:memberList,
					  		annexes:submitRelationList,
							allocationType:this.allocationType,
							allocationAmount:this.allocationAmount,
							safePassword:this.password
					  	}).then(res=>{
					  		console.log(res)
					  		if(res.data.code == 0){
					  			uni.showToast({
					  				title:"编辑成功",
					  				icon:"success",
					  				duration:1000,
					  				success: () => {
					  					setTimeout(()=>{
					  						uni.navigateBack({
					  							delta:2
					  						})
					  						uni.removeStorageSync('choose')
					  						uni.removeStorageSync('relation')
					  						uni.removeStorageSync('editTask')
					  					},1000)
					  				}
					  			})
					  		}else{
								this.$refs.jpPwds.backs()
								this.$refs.jpPwds.toCancel()
					  			uni.showToast({
					  				title:res.data.message,
					  				icon:"none"
					  			})
					  		}
					  	})
					  }else{
					  	this.$http.post('qms/cooperation_task/save_v2',{
					  		description:this.description,
					  		urgency:this.urgency,
					  		isWorkshop:1,
					  		finishTime:this.finishTime,
					  		orgId:this.orgId,
					  		title:this.titleInfo,
					  		userSet:this.submitSoMemberList,
					  		annexes:this.submitRelationList,
					  		cycle:this.taskCycle,
					  		type:this.taskType,
					  		allocationType:this.allocationType,
					  		allocationAmount:this.allocationAmount,
					  		safePassword:this.password
					  	}).then(res=>{
					  		// console.log(res)
					  		if(res.data.code==1){
								this.$refs.jpPwds.backs()
								this.$refs.jpPwds.toCancel()
					  			uni.showToast({
					  				title:`${res.data.message}`,
					  				icon:"none",
					  				duration:2000
					  			})
					  		}
					  		if(res.data.code==0){
					  			// console.log(666)
					  			uni.showToast({
					  				title:"任务创建成功",
					  				icon:"success",
					  				duration:1000,
					  				success() {
					  					setTimeout(()=>{
					  						uni.removeStorageSync('choose')
					  						uni.removeStorageSync('relation')
					  						uni.navigateBack({
					  							delta:1
					  						})
					  					},1000)
					  				}
					  			})
					  		}
					  	})
					}
				}
			},
			forget() {
				  // console.log('忘记密码')
				  uni.navigateTo({
				  	url:"/pages/my/payPassword/payPassword"
				  })
			},
			submit(){
				if(this.titleInfo==''){
					uni.showToast({
						title:'请输入任务标题',
						icon:"none",
						duration:1000
					})
					return false
				}
				if(this.orgId==undefined){
					uni.showToast({
						title:'请选择组织',
						icon:"none",
						duration:1000
					})
					return false
				}
				if(this.date==""){
					uni.showToast({
						title:'请选择截止时间',
						icon:"none",
						duration:1000
					})
					return false
				}
				if(this.description==""){
					uni.showToast({
						title:'请输入任务详情',
						icon:"none",
						duration:1000
					})
					return false
				}
				this.finishTime = this.date+":00"
				if(this.date=='每日重复'){
					this.taskType = 1
					this.finishTime= ''
				}else if(this.date =='每周重复'){
					this.taskType = 2
					this.finishTime= ''
				}else if(this.date=='每月重复'){
					this.taskType = 3
					this.finishTime= ''
				}else if(this.date.includes('天')){
					this.taskType= 4
					this.finishTime= ''
					this.taskCycle = parseInt(this.date)
					// console.log(cycle)
				}
				if(this.rewardValue == '不设置奖励'){
					this.allocationType = 0
				}else if(this.rewardValue == '手动奖励'){
					this.allocationType = 1
				}else{
					this.allocationType = 2
					this.allocationAmount=this.rewardValue.replace('平均分配','').replace('贝','')
				}
				if((this.allocationType==2 && this.$isEmpty(uni.getStorageSync('editTask'))) ||(this.allocationType==2 && uni.getStorageSync('editTask').allocationType==0)){
					if(this.$isEmpty(this.password)){
						this.$refs.dialog.open()
					}
					else{
						this.$refs.jpPwds.toOpen()	
					}
				}else{
					if(uni.getStorageSync('editTask')){
						let memberList = this.soMemberList.map(item=>{
							return item.userId
						})
						// console.log(memberList)
						let submitRelationList=this.relationList.map(item=>{
							// console.log("材料",item)
							return {type:item.type , relatedId:item.id}
						})
						this.$http.post('qms/cooperation_task/edit',{
							title:this.titleInfo,
							finishTime:this.finishTime,
							orgId:this.orgId,
							id:uni.getStorageSync('editTask').id,
							type:this.taskType,
							cycle:this.taskCycle,
							description:this.description,
							isWorkshop:1,
							urgency:this.urgency,
							userSet:memberList,
							annexes:submitRelationList,
							allocationType:this.allocationType,
							allocationAmount:this.allocationAmount,
							safePassword:this.password
						}).then(res=>{
							console.log(res)
							if(res.data.code == 0){
								uni.showToast({
									title:"编辑成功",
									icon:"success",
									duration:1000,
									success: () => {
										setTimeout(()=>{
											uni.navigateBack({
												delta:2
											})
											uni.removeStorageSync('choose')
											uni.removeStorageSync('relation')
											uni.removeStorageSync('editTask')
										},1000)
									}
								})
							}else{
								uni.showToast({
									title:res.data.message,
									icon:"none"
								})
							}
						})
					}else{
						this.$http.post('qms/cooperation_task/save_v2',{
							description:this.description,
							urgency:this.urgency,
							isWorkshop:1,
							finishTime:this.finishTime,
							orgId:this.orgId,
							title:this.titleInfo,
							userSet:this.submitSoMemberList,
							annexes:this.submitRelationList,
							cycle:this.taskCycle,
							type:this.taskType,
							allocationType:this.allocationType,
							allocationAmount:this.allocationAmount,
							safePassword:this.password
						}).then(res=>{
							// console.log(res)
							if(res.data.code==1){
								uni.showToast({
									title:`${res.data.message}`,
									icon:"none",
									duration:2000
								})
							}
							if(res.data.code==0){
								// console.log(666)
								uni.showToast({
									title:"任务创建成功",
									icon:"success",
									duration:1000,
									success() {
										setTimeout(()=>{
											uni.removeStorageSync('choose')
											uni.removeStorageSync('relation')
											uni.navigateBack({
												delta:1
											})
										},1000)
									}
								})
							}
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.popDialog {
		padding: 32rpx 32rpx 48rpx;
		width: 590rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);
		.title {
			font-size: 36rpx;
			line-height: 52rpx;
			text-align: center;
			margin-top: 32rpx;
		}
		.message {
			font-size: 28rpx;
			line-height: 52rpx;
			text-align: center;
			margin: 48rpx 0;
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
	.knowBtn{
		background: linear-gradient(140deg, #FF7152 0%, #F74437 100%);
		width: 252rpx;
		border-radius: 44rpx;
	}
	.messageTitle{
		margin-top: 60rpx;
		margin-bottom: 40rpx;
		font-size: 40rpx;
		line-height: 56rpx;
	}
	.changeShowStatus{
		margin-top: 30rpx;
		justify-content: center;
		width: 100%;
	}
	.questionMark{
		width: 26rpx;
		height: 26rpx;
		border: 2rpx solid #2F80FF;
		margin-left: 14rpx;
		border-radius: 50%;
		font-size: 24rpx;
		line-height: 24rpx;
		text-align: center;
	}
	.changeContentInfo{
		color: #919397;
		border-radius: 30rpx;
		font-size:28rpx;
		line-height:42rpx;
		background-color: #F4F5F6;
		height:262rpx;
		padding: 22rpx 30rpx 80rpx 30rpx;
		width: 610rpx;
		word-break:break-all;
		word-wrap:break-word;
	}
	.btn{
		display: none;
	}
	.rightImg{
		width: 44rpx;
		height: 44rpx;
		margin-right: -12rpx;
	}
	.contentInfoDefault{
		font-size:28rpx;
		line-height:56rpx;
		color:#BCC4CB;
	}
	.container{
		.containerWrap{
			padding: 48rpx 32rpx 0px;
			.content{
				position: relative;
				margin-bottom: 16rpx;
				width: 100%;
				.contentInfo{
					border-radius: 16rpx; 
					font-size:28rpx;
					line-height:28rpx;
					color:#272727; 
					background-color: #F5F7F8;
					// height:288rpx;
					padding: 32rpx;
					width: 622rpx;
					word-break:break-all;
					word-wrap:break-word;
				}
				.remark{
					font-size: 24rpx;
					line-height: 48rpx; 
					position:absolute;
					bottom: 16rpx;
					right: 40rpx;
				}
			}
			.chooseSo{
				padding-top: 44rpx;
				padding-bottom: 24rpx;
				border-bottom: 0.3rpx solid #EFF0F1;
				.soImg{
					width: 44rpx;
					height: 44rpx;
					margin-right: 20rpx;
				}
				.soName{
					flex: 1;
					color: #272727;
					font-size: 30rpx;
					line-height: 40rpx;
				}
			}
			.chooseMembers{
				padding-top: 44rpx;
				padding-bottom: 24rpx;
				border-bottom: 0.3rpx solid #EFF0F1;
				.addImg{
					width: 44rpx;
					height: 44rpx;
					margin-right: 20rpx;
				}
				.memberTitle{
					flex: 1;
					color: #272727;
					font-size: 30rpx;
					line-height: 40rpx;
				}
				.wrapMemberList{
					flex: 1;
					.memberList{
						image{
							width: 64rpx;
							height: 64rpx;
							margin-right: 16rpx;
							border-radius: 50%;
						}
					}
				}
				.memberCount{
					color: #565B5F;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
			.chooseTime{
				.wrapChooseTime{
					padding-top: 44rpx;
					padding-bottom: 24rpx;
					border-bottom: 0.3rpx solid #EFF0F1;
					.deadlineImg{
						width: 44rpx;
						height: 44rpx;
						margin-right: 20rpx;
					}
					.deadlineInfo{
						flex: 1; 
						color: #272727;
						font-size: 30rpx;
						line-height: 40rpx;
					}
				}
			}
			.urgencyInfo{
				.wrapUrgency{
					padding-top: 44rpx;
					padding-bottom: 24rpx;
					border-bottom: 0.3rpx solid #EFF0F1;
					.urgencyImg{
						width: 44rpx;
						height: 44rpx;
						margin-right: 20rpx;
					}
					.urgencyContent{
						flex: 1;
						.urgencyTitle{
							color: #272727;
							font-size: 30rpx;
							line-height: 40rpx;
						}
						.urgency{
							color: #565B5F;
							font-size: 28rpx;
							line-height: 40rpx;
						}
					}
				}
			}
			.chooseRelation{
				padding-top: 44rpx;
				padding-bottom: 24rpx;
				border-bottom: 0.3rpx solid #EFF0F1;
				.relationWrap{
					.relationImg{
						width: 44rpx;
						height: 44rpx;
						margin-right: 20rpx;
					}
					.relationContent{
						flex: 1;
						color: #272727;
						font-size: 30rpx;
						line-height: 40rpx;
						.relationInfo{
							font-size: 24rpx;
							line-height: 34rpx;
							color: #565B5F;
						}
					}
				}
				.relationList{
					margin: 16rpx 0; 
					padding: 24rpx; 
					border-radius:8rpx;
					font-size: 26rpx;
					line-height: 40rpx; 
					background-color: #F5F7F8;
					.name{
						flex: 1;
					}
					.deleteImg{
						width: 44rpx;
						height: 44rpx;
						margin-left: 24rpx;
					}
				}
			}
			.descriptionContent{
				padding-top: 44rpx;
				padding-bottom: 24rpx;
				border-bottom: 0.3rpx solid #EFF0F1;
				.descriptionInfo{
					.describeImg{
						width: 44rpx;
						height: 44rpx;
						margin-right: 20rpx;
					}
					.describeTitle{
						flex: 1;
						color: #272727;
						font-size: 30rpx;
						line-height: 40rpx;
					}
				}
				.description{
					margin-top: 24rpx; 
					border-radius: 16rpx; 
					color: #272727;
					background-color: #F5F7F8; 
					font-style: 28rpx;
					line-height: 56rpx; 
					padding: 32rpx;
				}
			}
			.followWorkshop{
				padding-top: 46rpx;
				padding-bottom: 46rpx;
				.plantImg{
					width: 44rpx;
					height: 44rpx;
					margin-right: 20rpx;
				}
				.plantTitle{
					font-size: 28rpx;
					line-height: 40rpx;
				}
				checkbox{
					transform:scale(0.7);
					margin-right: -12rpx;
				}
			}
		}
		.sendBtn{
			width: 100%; 
			background-color: #FFFFFF;
			z-index: 9; 
			position: fixed;
			bottom: 0rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			.send{
				width:686rpx;
				height: 92rpx;
				// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
				background-color: #46B28B;
				margin: 24rpx 32rpx 32rpx;
				font-weight: bold;
				font-size: 30rpx;
				line-height: 92rpx;
				text-align: center;
				border-radius: 64rpx;
				color: #FFFFFF;
			}
		}
	}
	.bottom-safe {
			/* iphonex 等安全区设置，底部安全区适配 */
			/* #ifndef APP-NVUE */
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			/* #endif */
		}
</style>
