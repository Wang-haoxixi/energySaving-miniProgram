<template>
	<view class="">
		<uni-nav-bar id="navbar" left-icon="back" :title="timeTitle" status-bar="true" :fixed="true" @clickLeft="saveAnswer"></uni-nav-bar>
		<view class="container">
			<view id="title" class="flexRow content">
				<view class="flexRowStart">
					<image v-if="oss" class="examIcon" :src="oss+'icon_examinationTypeIcon.png'" mode=""></image>
					<view class="flexRowStart" style="align-items: flex-end;">
						<view class="color_303031 bold questionType">
							{{$isEmpty(questionType)?'': questionType}}
						</view>
						<view class="color_919397" style="font-size: 20rpx;">
							(本题{{$isEmpty(questionList)?'':questionList[item_id].grade}}分，合计{{$isEmpty(quesTypeScore)?'':quesTypeScore}}分)
						</view>
					</view>
				</view>
				<view class="color_919397 bold quesTitle">
					<text class="color_303031">{{$isEmpty(currentNum)?'1':currentNum+1}}</text> / <text>{{$isEmpty(questionList)?'0':questionList.length}}</text>
				</view>
			</view>
			<swiper class="" observer observerParents :current="item_id" ref="swiper" :style="{height:swiperHeight + 'px'}">
				<swiper-item :item-id="item.questionNum-1" v-for="(item,index) of questionList" :key="index" @touchmove.stop="stopTouchMove">
					<view class="swiper-item">
						<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}">
							<view class="" style="padding-bottom: 30rpx;padding-top: 40rpx;">
								<text class="color_F74437 bold quesTitle">
									* {{$isEmpty(item.questionNum)?'0':item.questionNum}} 、
								</text>
								<text class="color_303031 bold quesTitle">
									{{$isEmpty(item.examQuestionVO.title)?'':item.examQuestionVO.title}}
								</text>
								<!-- <text class="color_919397 grade">
									({{$isEmpty(item.grade)?'0':item.grade}}分)
								</text> -->
							</view>
							<view class="" v-if="!$isEmpty(item.examQuestionVO.titleUrl)">
								<image :src="item.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
							</view>
							<view class="">
								<radio-group v-if="questionType=='单选题' ||questionType=='判断题'">
									<label @tap="choose(item2,item)" class="uni-list-cell uni-list-cell-pd quesItem" style="display: block;" v-for="(item2, index2) in item.examQuestionVO.optionsJson"
									 :key="index2">
										<view class="flexRow">
											<view class="flexRowStart color_666769 quesItemInfo">
												<view class="">
													{{$isEmpty(item2.key)?'':item2.key}} 、
												</view>
												<view style="flex: 1;word-break: break-all;">{{$isEmpty(item2.value)?'':item2.value}}</view>
											</view>
											<view>
												<radio :value="item2.key" :checked="item2.status==true" />
											</view>
										</view>
										<view class="" v-if="!$isEmpty(item2.optionUrl)">
											<image :src="item2.optionUrl" mode="aspectFit" style="width: 100%;margin-top: 20rpx;"></image>
										</view>
									</label>
								</radio-group>
								<checkbox-group v-if="questionType=='多选题'">
									<label @tap="choose(item3,item)" class="uni-list-cell uni-list-cell-pd quesItem" style="display: block;" v-for="(item3, index3) in item.examQuestionVO.optionsJson"
									 :key="index3">
										<view class="flexRow">
											<view class="flexRowStart color_666769 quesItemInfo">
												<view class="">
													{{$isEmpty(item3.key)?'':item3.key}} 、
												</view>
												<view style="flex: 1;word-break: break-all;">{{$isEmpty(item3.value)?'':item3.value}}</view>
											</view>
											<view>
												<checkbox :value="item3.key" :checked="item3.status==true" />
												<!-- :checked="item.userAnswerJson.includes(item2.key)" -->
											</view>
										</view>
										<view class="" v-if="!$isEmpty(item3.optionUrl)">
											<image :src="item3.optionUrl" mode="aspectFit" style="width: 100%;margin-top: 20rpx;"></image>
										</view>
									</label>
								</checkbox-group>
								<view v-if="questionType=='填空题'" v-for="(item4, index4) in item.examQuestionVO.optionsJson" :key="index4" class="quesItem"
								 style="padding: 30rpx; margin-bottom: 40rpx;">
									<view class="flexRowStart quesItemInfo color_666769" style="margin-bottom: 28rpx;">
										<view class="">
											{{$isEmpty(item4.key)?'':item4.key}} 、
										</view>
										<view style="flex: 1;word-break: break-all;">填空题</view>
									</view>
									<textarea v-model="item4.value" @input="chooseInfo($event,item4,item,index4)" placeholder="请输入"
									 placeholder-style="color:#BABEC0;" style="width: 550rpx; height: 96rpx; padding: 30rpx;background-color: #FFFFFF;color: #919397;font-size: 28rpx;line-height: 48rpx;border-radius: 20rpx;" />
									</view>
								<view v-if="questionType=='问答题'" style="position: relative;">
									<textarea :value="item.examQuestionVO.value" @input="chooseAnswerInfo($event,item)" maxlength="-1" style="width: 610rpx; height: 304rpx; padding: 30rpx;background-color: #F4F5F6;color: #919397;font-size: 28rpx;line-height: 48rpx;border-radius: 20rpx;"/>
									<image v-if="oss" :src="oss+'icon_soExaminationList_extension.png'" @tap.stop="importMore(item,index)" mode="" style="z-index: 999; position: absolute;bottom: 14rpx;right: 14rpx; width: 44rpx;height: 44rpx;"></image>
								</view>
							</view>
						</scroll-view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="btn" id="btns" >
			<view class="flexRow" style="margin: 20rpx 40rpx 20rpx 40rpx;">
				<view class="flexColumn" @tap="saveAnswer" style="padding: 0 20rpx;">
					<image v-if="oss" class="bottomImg" :src="oss+'icon_soExaminationList_saveOut.png'"></image>
					<view class="bottomTitle">
						保存退出
					</view>
				</view>
				<view class="flexColumn" @tap="checkCard" style="padding: 0 20rpx;">
					<image v-if="oss" class="bottomImg" :src="oss+'icon_soExaminationList_card.png'"></image>
					<view class="bottomTitle">
						答题卡
					</view>
				</view>
				<view class="button firstBtn" v-if="item_id==0" style="margin: 0 30rpx;">
					上一题
				</view>
				<view class="button lastBtn" v-else @tap="goLast" style="margin: 0 30rpx;">
					上一题
				</view>
				<view class="button" style="flex: 1;" v-if="item_id < questionList.length-1" @tap="goNext">
					下一题
				</view>
				<view class="button" style="flex: 1;" v-if="item_id == questionList.length-1" @tap='submitAnswer'>
					交卷
				</view>
			</view>
		</view>
		<uni-popup ref="dialog" type="bottom">
			<view class="popDialog">
				<view class="flexRowStart" style="justify-content: center;">
					<image v-if="oss" class="confirmImg" :src="oss+'icon_meetting_confirm.png'"></image>
					<view class="color_666769 message">
						{{$isEmpty(content)?'':content}}
					</view>
				</view>
				<view class="flexRow" style="margin-top: 48rpx;">
					<view class="button noRepeat" @tap="cancel">
						取消
					</view>
					<view class="button repeatNow" @tap="pass">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="card" type="bottom">
			<view class="cardDialog" :style="{height:cardHeight + 'px'}">
				<view class="cardInfo" id="cardTitle">
					<view class="title color_303031 bold">
						答题卡
					</view>
					<view class="flexRowStart" style="margin-bottom: 30rpx;">
						<view class="color_303031 answerInfo">
							答题说明
						</view>
						<image v-if="oss" class="cardImg" :src="oss+'icon_soExaminationList_cardTrue.png'"></image>
						<view class="color_666769 answerStatus">
							已答
						</view>
						<image v-if="oss" class="cardImg" :src="oss+'icon_soExaminationList_cardNot.png'"></image>
						<view class="color_666769 answerStatus">
							未答
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" :style="{height:cardScrollHeight + 'px'}">
					<view class="" v-for="(item,index) of questionTypeList" :key="index">
						<view class="" style="padding-top: 30rpx;">
							<view class="color_303031 bold numlistTitle">
								{{$isEmpty(item.label)?'':item.label}}
							</view>
							<view class="numlist">
								<view v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of questionList" :key="index2" @tap="goQuesNum(index2)">
									<view v-if="item2.status ==false" class="color_303031 numlistItemFalse">
										{{index2 + 1}}
									</view>
									<view v-else-if="item2.status ==true" class="color_FFFFFF numlistItemTrue">
										{{index2 + 1}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup,
			uniNavBar
		},
		data() {
			return {
				oss: '',
				listInfo: {},
				questionTypeList: [],
				questionList: [],
				item_id: 0,
				swiperHeight: '',
				cardHeight:'',
				cardScrollHeight:'',
				timer: '',
				userAnswer: '',
				questionNum: 1,
				examId: '',
				remainingTime: '',
				timeTitle:'',
				content:'',
				mark:'',
				description:''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			const {
				id,
				manageId
			} = options
			uni.$on('addInfo',(data)=>{
				// console.log(this.description)
				// console.log(data)
				this.mark =data.mark
				this.description = data.description
				// console.log(this.questionList[mark])
				this.questionList[this.mark].examQuestionVO.value = this.description
				//回传值为空时，修改该题状态
				if(this.description==''){
					this.questionList[this.mark].status =false
				}else{
					this.questionList[this.mark].status =true
				}
				this.userAnswer =this.description
				// console.log(this.userAnswer)
				// console.log(this.questionList[mark].examQuestionVO.value)
			})
			if (this.$isEmpty(manageId)) {
				this.$http.post('qms/exam_answer/create_test_pager', {
					examinationId: id
				}).then(res => {
					this.listInfo = res.data.data
					this.examId = this.listInfo.id
					this.remainingTime = parseInt(this.listInfo.remainingTime.split('-')[0]*60 )+ parseInt(this.listInfo.remainingTime.split('-')[1])
					// console.log(this.remainingTime)
					this.questionTypeList = res.data.data.quesType
					this.questionList = res.data.data.examAnswerVOList
					this.timeStamp(this.remainingTime)
					this.timer = setInterval(() => {
						if (this.remainingTime < 0) {
							this.questionNum = this.item_id + 1
							if(this.$isEmpty(this.userAnswer) && this.questionList[this.item_id].status==true){
								this.$http.post('qms/exam_answer/commit_paper', {
									examId: this.examId,
									remainingTime:'0-0'
								}).then(res => {
									console.log(res)
									if(res.data.code == 1){
										uni.showToast({
											title:res.data.message,
											icon:"none",
											success: () => {
												setTimeout(()=>{
													uni.navigateBack({
														delta:1
													})
												},1000)
											}
										})
									}else{
										uni.redirectTo({
											url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?manageId=${res.data.data.manageId}&id=${res.data.data.examinationId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}&status=${res.data.data.code}`
										})
									}
								})
							}else{
								this.$http.post('qms/exam_answer/answer_question', {
									examId: this.examId,
									questionNum: this.questionNum,
									remainingTime:'0-0',
									userAnswer: this.userAnswer
								}).then(res => {
									if(res.data.code == 1){
										uni.showToast({
											title:res.data.message,
											icon:"none",
											success: () => {
												setTimeout(()=>{
													uni.navigateBack({
														delta:1
													})
												},1000)
											}
										})
									}else{
										this.$http.post('qms/exam_answer/commit_paper', {
											examId: this.examId,
											remainingTime:'0-0'
										}).then(res => {
											uni.redirectTo({
												url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?manageId=${res.data.data.manageId}&id=${res.data.data.examinationId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}&status=${res.data.data.code}`
											})
										})
									}
								})
							}
							// this.$http.post('qms/exam_answer/commit_paper', {
							// 	examId: this.examId,
							// 	remainingTime:'0-0'
							// }).then(res => {
							// 	console.log(1)
							// 	if(res.data.code == 1){
							// 		uni.showToast({
							// 			title:res.data.message,
							// 			icon:"none",
							// 			success: () => {
							// 				setTimeout(()=>{
							// 					uni.navigateBack({
							// 						delta:1
							// 					})
							// 				},1000)
							// 			}
							// 		})
							// 	}else{
							// 		uni.redirectTo({
							// 			url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?manageId=${res.data.data.manageId}&id=${res.data.data.examinationId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}&status=${res.data.data.code}`
							// 		})
							// 	}
							// })
							clearInterval(this.timer)
						} else {
							this.timeStamp(this.remainingTime--)
						}
					}, 1000)
					const list =this.questionList.map (item=>{
						const {examQuestionVO = {}} =item
						const {optionsJson = []} =examQuestionVO
						return {
							...item,
							examQuestionVO:{
								...examQuestionVO,
								value:'',
								optionsJson:optionsJson.map(item2=>{
									return{
										...item2,
										status:false
									}
								})
							}
						}
					})
					// console.log(list)
					this.questionList =list
					this.questionList = this.questionList.map(item => {
						return {
							...item,
							status: false
						}
					})
					
				})
			} else {
				this.$http.get('qms/exam_answer/continue_test_pager/' + manageId).then(res => {
					// console.log(res)
					this.listInfo = res.data.data
					this.examId = this.listInfo.id
					this.remainingTime = parseInt(this.listInfo.remainingTime.split('-')[0]*60 )+ parseInt(this.listInfo.remainingTime.split('-')[1])
					this.questionTypeList = res.data.data.quesType
					this.questionList = res.data.data.examAnswerVOList
					// console.log(this.remainingTime)
					this.timeStamp(this.remainingTime)
					this.timer = setInterval(() => {
						if (this.remainingTime < 0) {
							// let time = this.changeTime(this.remainingTime)
							this.questionNum = this.item_id + 1
							if(this.$isEmpty(this.userAnswer) && this.questionList[this.item_id].status==true){
								this.$http.post('qms/exam_answer/commit_paper', {
									examId: this.examId,
									remainingTime:'0-0'
								}).then(res => {
									console.log(res)
									if(res.data.code == 1){
										uni.showToast({
											title:res.data.message,
											icon:"none",
											success: () => {
												setTimeout(()=>{
													uni.navigateBack({
														delta:1
													})
												},1000)
											}
										})
									}else{
										uni.redirectTo({
											url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?manageId=${res.data.data.manageId}&id=${res.data.data.examinationId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}&status=${res.data.data.code}`
										})
									}
								})
							}else{
								this.$http.post('qms/exam_answer/answer_question', {
									examId: this.examId,
									questionNum: this.questionNum,
									remainingTime:'0-0',
									userAnswer: this.userAnswer
								}).then(res => {
									if(res.data.code == 1){
										uni.showToast({
											title:res.data.message,
											icon:"none",
											success: () => {
												setTimeout(()=>{
													uni.navigateBack({
														delta:1
													})
												},1000)
											}
										})
									}else{
										this.$http.post('qms/exam_answer/commit_paper', {
											examId: this.examId,
											remainingTime:'0-0'
										}).then(res => {
											uni.redirectTo({
												url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?manageId=${res.data.data.manageId}&id=${res.data.data.examinationId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}&status=${res.data.data.code}`
											})
										})
									}
								})
							}
							// this.$http.post('qms/exam_answer/commit_paper', {
							// 	examId: this.examId,
							// 	remainingTime:'0-0'
							// }).then(res => {
							// 	if(res.data.code == 1){
							// 		uni.showToast({
							// 			title:res.data.message,
							// 			icon:"none",
							// 			success: () => {
							// 				setTimeout(()=>{
							// 					uni.navigateBack({
							// 						delta:1
							// 					})
							// 				},1000)
							// 			}
							// 		})
							// 	}else{
							// 		uni.redirectTo({
							// 			url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?manageId=${res.data.data.manageId}&id=${res.data.data.examinationId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}&status=${res.data.data.code}`
							// 		})
							// 	}
							// })
							clearInterval(this.timer)
						} else {
							// console.log(this.remainingTime)
							this.timeStamp(this.remainingTime--)
						}
					}, 1000)
					const list =this.questionList.map (item=>{
						const {examQuestionVO = {}} =item
						const {optionsJson = []} =examQuestionVO
						return {
							...item,
							examQuestionVO:{
								...examQuestionVO,
								value:'',
								optionsJson:optionsJson.map(item2=>{
									return{
										...item2,
										status:false
									}
								})
							}
						}
					})
					// console.log(list)
					this.questionList =list
					// console.log(this.questionList)
					this.questionList = this.questionList.map(item => {
						return {
							...item,
							status: false
						}
					})
					this.questionList.forEach(item2 => {
						if(item2.examQuestionVO.type == 'GAPFILLING'){
							if(this.$isEmpty(item2.userAnswerJson)){
								item2.status =false
							}else{
								let status = item2.userAnswerJson.some(que=>{
									return que !=""
								})
								item2.status =status
								item2.userAnswerJson.forEach((res,index)=>{
									item2.examQuestionVO.optionsJson.forEach((resp,index2)=>{
										if(index == index2){
											resp.value =res
										}
									})
								})
							}		
						}else if(item2.examQuestionVO.type == 'ESSAYQUESTION'){
							if(item2.userAnswer == '' ||this.$isEmpty(item2.userAnswer)){
								item2.status = false
							}else{
								item2.status = true
								item2.examQuestionVO.value = item2.userAnswer
							}
						}else{
							if (item2.userAnswer == "[]" || this.$isEmpty(item2.userAnswer)) {
								item2.status = false
							} else {
								item2.status = true
							}
						}
					})
					// console.log(this.questionList)
					this.questionList.forEach(item=>{
						item.examQuestionVO.optionsJson.forEach(item2=>{
							if(!this.$isEmpty(item.userAnswerJson) && item.userAnswerJson.length>0){
								if(item.userAnswerJson.includes(item2.key)){
									item2.status =true
								}
							}
						})
					})
				})
			}
			uni.createSelectorQuery()
				.in(this)
				.select('#title')
				.boundingClientRect()
				.select('#btns')
				.boundingClientRect()
				.select('#navbar')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height - ret[1].height-ret[2].height
				});
		},
		onShow() {
			// console.log(this.remainingTime)
		},
		onUnload() {
			this.$refs.dialog.open()
			clearInterval(this.timer)
			uni.$off()
		},
		onHide() {
		},
		computed: {
			currentNum() {
				let currentNum = this.item_id
				return currentNum
			},
			questionType() {
				let questionType = ''
				this.questionTypeList.forEach(item => {
					if (this.item_id <= item.end - 1 && this.item_id >= item.start - 1) {
						questionType = item.label
					}
				})
				return questionType
			},
			questionTypeNum() {
				let questionTypeNum = ''
				this.questionTypeList.forEach(item => {
					if (this.item_id <= item.end - 1 && this.item_id >= item.start - 1) {
						questionTypeNum = parseInt(item.end - item.start + 1)
					}
				})
				return questionTypeNum
			},
			quesTypeScore() {
				let quesTypeScore = ''
				this.questionTypeList.forEach(item => {
					if (this.item_id <= item.end - 1 && this.item_id >= item.start - 1) {
						quesTypeScore = item.total
					}
				})
				return quesTypeScore
			}
		},
		methods: {
			importMore(item,index){
				// console.log(6)
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationListEssay/soExaminationListEssay?description=${item.examQuestionVO.value}&mark=${index}`
				})
			},
			stopTouchMove() {
				return false
			},
			goLast() {
				let time = this.changeTime(this.remainingTime)
				// console.log(time)
				// console.log(this.item_id)
				this.questionNum = this.item_id + 1
				// console.log(this.questionList[this.item_id])
				// console.log(this.questionNum)
				if(this.$isEmpty(this.userAnswer) && this.questionList[this.item_id].status==true){
					console.log('满足不提交条件')
				}else{
					this.$http.post('qms/exam_answer/answer_question', {
						examId: this.examId,
						questionNum: this.questionNum,
						remainingTime: time,
						userAnswer: this.userAnswer
					}).then(res => {
						// console.log(res)
						if(res.data.code == 1){
							uni.showToast({
								title:res.data.message,
								icon:"none",
								success: () => {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}else{
							this.userAnswer = ''
						}
					})
				}
				this.item_id--
			},
			goNext() {
				let time = this.changeTime(this.remainingTime)
				this.questionNum = this.item_id + 1
				// console.log(this.questionList[this.item_id])
				// console.log(this.questionNum)
				// console.log(this.questionNum)
				if(this.$isEmpty(this.userAnswer) && this.questionList[this.item_id].status==true){
					console.log('满足不提交条件')
				}else{
					this.$http.post('qms/exam_answer/answer_question', {
						examId: this.examId,
						questionNum: this.questionNum,
						remainingTime: time,
						userAnswer: this.userAnswer
					}).then(res => {
						if(res.data.code == 1){
							uni.showToast({
								title:res.data.message,
								icon:"none",
								success: () => {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}else{
							this.userAnswer = ''
						}
						// console.log(res)
					})
				}
					++this.item_id;
			},
			saveAnswer() {
				this.content ='您将退出考试,请在48小时内完成答卷'
				this.$refs.dialog.open()
			},
			cancel() {
				this.$refs.dialog.close()
			},
			submitAnswer(){
				let submitStatus = this.questionList.every(item=>{
					return item.status ==true
				})
				if(submitStatus ==true){
					this.content ='您已完成所有试题，确定交卷吗？'
				}else{
					this.content ='您还有试题未完成，是否现在交卷？'
				}
				this.$refs.dialog.open()
			},
			pass() {
				let time = this.changeTime(this.remainingTime)
				if(this.content == '您将退出考试,请在48小时内完成答卷'){
						this.questionNum = this.item_id + 1
						if(this.$isEmpty(this.userAnswer) && this.questionList[this.item_id].status==true){
							console.log('满足不提交条件')
							this.$http.post('qms/exam_examination_management/update', {
								id: this.examId,
								remainingTime: time
							}).then(res => {
								// console.log(res)
								if(res.data.code == 1){
									uni.showToast({
										title:res.data.message,
										icon:"none",
										success: () => {
											setTimeout(()=>{
												uni.navigateBack({
													delta:1
												})
											},1000)
										}
									})
								}else{
									uni.navigateBack({
										delta: 1
									})
									this.$refs.dialog.close()
								}
								// console.log(this.questionList)
							})
						}else{
							this.$http.post('qms/exam_answer/answer_question', {
								examId: this.examId,
								questionNum: this.questionNum,
								remainingTime: time,
								userAnswer: this.userAnswer
							}).then(res => {
								if(res.data.code == 1){
									uni.showToast({
										title:res.data.message,
										icon:"none",
										success: () => {
											setTimeout(()=>{
												uni.navigateBack({
													delta:1
												})
											},1000)
										}
									})
								}else{
									this.$http.post('qms/exam_examination_management/update', {
										id: this.examId,
										remainingTime: time
									}).then(res => {
										// console.log(res)
										uni.navigateBack({
											delta: 1
										})
										this.$refs.dialog.close()
										// console.log(this.questionList)
									})
								}
							})
						}
					
				}else if (this.content =='您已完成所有试题，确定交卷吗？' || this.content =='您还有试题未完成，是否现在交卷？'){
						this.questionNum = this.item_id + 1
						if(this.$isEmpty(this.userAnswer) && this.questionList[this.item_id].status==true){
							this.$http.post('qms/exam_answer/commit_paper', {
								examId: this.examId,
								remainingTime:time
							}).then(res => {
								console.log(res)
								if(res.data.code == 1){
									uni.showToast({
										title:res.data.message,
										icon:"none",
										success: () => {
											setTimeout(()=>{
												uni.navigateBack({
													delta:1
												})
											},1000)
										}
									})
								}else{
									uni.redirectTo({
										url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?manageId=${res.data.data.manageId}&id=${res.data.data.examinationId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}&status=${res.data.data.code}`
									})
									this.$refs.dialog.close()
								}
							})
						}else{
							this.$http.post('qms/exam_answer/answer_question', {
								examId: this.examId,
								questionNum: this.questionNum,
								remainingTime:time,
								userAnswer: this.userAnswer
							}).then(res => {
								if(res.data.code == 1){
									uni.showToast({
										title:res.data.message,
										icon:"none",
										success: () => {
											setTimeout(()=>{
												uni.navigateBack({
													delta:1
												})
											},1000)
										}
									})
								}else{
									this.$http.post('qms/exam_answer/commit_paper', {
										examId: this.examId,
										remainingTime:time
									}).then(res => {
										uni.redirectTo({
											url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?manageId=${res.data.data.manageId}&id=${res.data.data.examinationId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}&status=${res.data.data.code}`
										})
										this.$refs.dialog.close()
									})
								}
							})
						}
				}
			},
			choose(item_item,item){
				if (this.questionType == '单选题' || this.questionType == '判断题') {
					item.examQuestionVO.optionsJson.forEach(item3=>{
						item3.status =false
					})
					item_item.status = true
					this.userAnswer = item_item.key
					console.log(this.userAnswer)
					if(this.userAnswer == ''){
						//判断该题是否已经作答
						item.status =false
					}else{
						item.status =true
					}
				// } else if (this.questionType == '复选题') {
				} else if (this.questionType == '多选题') {
					// console.log(item2.status)
					let userAnswer =[]
					if(item_item.status ==false){
						item_item.status=true
						// console.log(item_item.status)
						// console.log(item)
					}else if(item_item.status == true){
						item_item.status =false
						// console.log(item_item.status)
						// console.log(item)
					}
					item.examQuestionVO.optionsJson.forEach(item3=>{
						if(item3.status == true){
							userAnswer.push(item3.key)
						}
					})
					// console.log(userAnswer)
					this.userAnswer =JSON.stringify(userAnswer)
					console.log(this.userAnswer)
					if(this.userAnswer == '' || this.userAnswer == "[]"){
						item.status =false
					}else{
						item.status =true
					}	
				}
			},
			chooseInfo(e,item_item,item,index){
				if(this.$isEmpty(item.userAnswer)){
					item_item.value = e.detail.value
					this.userAnswer =item.examQuestionVO.optionsJson.map(item=>{
						return item.value
					})
					// console.log(this.userAnswer)
					let status = this.userAnswer.some(que=>{
						return que != ""
					})
					item.status =status
					// console.log(item.status)
					this.userAnswer =JSON.stringify(this.userAnswer)
					console.log(this.userAnswer)
				}else{
					this.userAnswer = item.userAnswerJson
					item_item.value = e.detail.value
					this.userAnswer.splice(index,1,item_item.value)
					let status = this.userAnswer.some(que=>{
						return que != ""
					})
					// console.log(status)
					item.status =status
					// console.log(this.userAnswer)
					// console.log(item.status)
					this.userAnswer =JSON.stringify(this.userAnswer)
				}
			},
			chooseAnswerInfo(e,item){
				this.userAnswer = e.detail.value
				item.examQuestionVO.value = e.detail.value
				if(this.userAnswer == ''){
					item.status = false
				}else{
					item.status =true
				}
			},
			checkCard(){
				this.$refs.card.open()
				uni.createSelectorQuery()
					 .in(this)
					 .select('#cardTitle')
					 .boundingClientRect()
					 .exec(ret=>{
						 //cardTitle高度无法拿到
						 let height = uni.getSystemInfoSync().windowHeight;
						 this.cardHeight =height * 0.7
						 //cardTitle高度无法拿到，固剪一个固定值
						 this.cardScrollHeight = this.cardHeight -75
					// console.log(ret)
				});
			},
			goQuesNum(index){
				let time = this.changeTime(this.remainingTime)
				this.questionNum = this.item_id + 1
				if(this.$isEmpty(this.userAnswer) && this.questionList[this.item_id].status==true){
					console.log('满足不提交条件')
					this.item_id = index
					this.questionNum =this.item_id + 1
				}else{
					this.$http.post('qms/exam_answer/answer_question', {
						examId: this.examId,
						questionNum: this.questionNum,
						remainingTime: time,
						userAnswer: this.userAnswer
					}).then(res => {
						// console.log(res)
						if(res.data.code == 1){
							uni.showToast({
								title:res.data.message,
								icon:"none",
								success: () => {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}else{
							this.userAnswer = ''
							this.item_id = index
							this.questionNum =this.item_id + 1
						}
					})
				}
				setTimeout(()=>{
					this.$refs.card.close()
				},300)
			},
			timeStamp(times) {
				// let timestamp = Date.parse(new Date());
				let letime = times;
				let time = parseInt(letime);
				if (time > 60) {
					let second = time % 60;
					let min = parseInt(letime / 60);
					// 直接返回字符串格式：
					// time = min + "分" + second + "秒";  
					// 返回对象格式：
					time = {
						min: min,
						second: second
					};
					if (min > 60) {
						min = parseInt(letime / 60) % 60;
						let hour = parseInt(parseInt(letime / 60) / 60);
						// 直接返回字符串格式：
						// time = hour + "时" + min + "分" + second + "秒";
						// 返回对象格式：
						time = {
							hour: hour,
							min: min,
							second: second
						}
					}
				} else {
					time = {
						second: times
					};
				}
				// 判断是否小于10，小于10就补零
				if (time.hour < 10) {
					time.hour = '0' + time.hour
				} else if (time.hour == undefined) {
					time.hour = '00'
				}
				if (time.min < 10) {
					time.min = '0' + time.min
				} else if (time.min == undefined) {
					time.min = "00"
				}
				if(time.second < 10) {
					time.second = '0' + time.second
				}
				// 输出结果：
				// console.log(time)
				this.timeTitle = time
				this.timeTitle  = `${this.timeTitle.hour}:${this.timeTitle.min}:${this.timeTitle.second}`
			},
			changeTime(times) {
				// let timestamp = Date.parse(new Date());
				let letime = times;
				let time = parseInt(letime);
				if (time > 60) {
					let second = time % 60;
					let min = parseInt(letime / 60);
					// 直接返回字符串格式：
					// time = min + "分" + second + "秒";  
					// 返回对象格式：
					time = {
						min: min,
						second: second
					};
				} else {
					time = {
						second: times
					};
				}
				if (time.min < 10) {
					time.min = time.min
				} else if (time.min == undefined) {
					time.min = "0"
				}
				if(time.second < 10) {
					time.second = time.second
				}
				else if (time.second == undefined) {
					time.second = "0"
				}
				// 输出结果：
				// console.log(time)
				let copyTime =''
				copyTime = time
				return copyTime  = `${copyTime.min}-${copyTime.second}`
			},
		}
	}
</script>

<style lang="scss">
	.numlist{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		.numlistItemFalse{
			font-size: 28rpx;
			line-height: 40rpx; 
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			border: 2rpx solid #E3E4E5;
			text-align: center;
			line-height: 64rpx;
			margin: 0 20rpx;
			margin-bottom: 30rpx;
		}
		.numlistItemTrue{
			font-size: 28rpx;
			line-height: 40rpx; 
			width: 68rpx;
			height: 68rpx;
			background-color: #3CD489; 
			border-radius: 50%;
			text-align: center;
			line-height: 68rpx;
			margin: 0 20rpx;
			margin-bottom: 30rpx;
		}
	}
	.numlistTitle{
		font-size: 28rpx;
		line-height: 40rpx;
		margin-bottom: 40rpx;
	}
	.cardInfo{
		.title{
			font-size: 34rpx;
			line-height: 48rpx;
			margin-bottom: 60rpx;
			text-align: center;
		}
		.answerInfo{
			font-weight: 600;
			font-size: 32rpx;
			line-height: 44rpx;
			margin-right: 30rpx;
		}
		.answerStatus{
			margin-right: 20rpx;
			font-size: 28rpx;
			line-height: 40rpx;
		}
		.cardImg{
			margin-right: 10rpx;
			width: 32rpx;
			height: 32rpx;
		}
	}
	.confirmImg{
		width: 52rpx;
		height: 52rpx;
		margin-right: 20rpx;
	}
	.bottomTitle{
		font-size: 18rpx;
		line-height: 26rpx;
	}
	.bottomImg{
		width: 44rpx;
		height: 44rpx;
	}
	.quesItem{
		background-color: #F4F5F6;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		margin-bottom: 30rpx;
		.quesItemInfo{
			font-size: 28rpx;
			line-height: 40rpx;
			flex: 1;
		}
	}
	.grade{
		font-size:20rpx;
		line-height: 48rpx;
	}
	.quesTitle{
		font-size: 28rpx;
		line-height: 48rpx;
	}
	.questionType{
		margin-right: 10rpx;
		font-size: 28rpx;
	}
	.content{
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #EFF0F1;
		padding-top: 40rpx;
	}
	.popDialog {
		padding: 32rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);
		.message {
			font-size: 28rpx;
			line-height: 52rpx;
			// text-align: center;
			margin:48rpx;
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
	
	.cardDialog{
		padding: 32rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
		border: 2rpx solid #E3E4E5;
	}
	
	.saveBtn {
		color: #919397;
		background-color: #F4F5F6;
		flex: 1;
		margin: 0 30rpx;
	}

	.lastBtn {
		color: #919397;
		background-color: #F4F5F6;
		flex: 1;
	}

	.firstBtn {
		background-color: #919397;
		flex: 1;
	}

	.container {
		padding: 0rpx 40rpx 0 40rpx;
	}

	.examIcon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}

	radio {
		transform: scale(0.7)
	}

	checkbox {
		transform: scale(0.7)
	}


	.btn {
		width: 100%;
		background-color: #FFFFFF;
		z-index: 666;
		position: fixed;
		z-index: 98;
		bottom: 0rpx;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
	}
	.addBtn{
		position: fixed;
		bottom: 300rpx;
		right: 6rpx;
		image{
			height: 152rpx;
			width: 152rpx;
		}
	}
</style>
