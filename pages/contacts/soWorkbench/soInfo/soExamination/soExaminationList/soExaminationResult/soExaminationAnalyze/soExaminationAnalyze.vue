<template>
	<view class="container">
		<view class="examName doubleEllipsis">
			{{$isEmpty(checkInfo.examName)?'':checkInfo.examName}}
		</view>
		<view id="content" class="content" @tap="checkMore">
			<image v-if="status==false && oss" :src="oss+'image_soExaminationAnalyze_score.png'" style="width: 100%;height: 164rpx;border-radius: 20rpx;"></image>
			<image v-if="status==true && oss" :src="oss+'image_soExaminationAnalyze_scoreDetails.png'"  style="width: 100%;height: 670rpx;border-radius: 20rpx;"></image>
			<view class="color_FFFFFF contentInfo">
				<view class="flexRow contentInfoTitle">
					<view class="">
						得分(分)
					</view>
					<view class="">
						结果
					</view>
				</view>
				<view class="flexRow bold contentInfoResult">
					<view class="score">
						{{$isEmpty(checkInfo.score)?'0':checkInfo.score}}
					</view>
					<view class="result">
						{{$isEmpty(checkInfo.result)?'':checkInfo.result}}
					</view>
				</view>
				<view class="contentInfoType" v-if="status==true">
					<view class="flexRow" style="margin-bottom: 40rpx;">
						<view class="typeInfo" style="text-align: left;">
							题型
						</view>
						<view class="typeInfo" style="text-align: center;">
							卷面分
						</view>
						<view class="typeInfo" style="text-align: right;">
							得分
						</view>
					</view>
					<view class="flexRow bold" style="margin-bottom: 40rpx;font-size: 28rpx;line-height: 40rpx;" v-for="(item,index) of questionTypeList" :key="index">
						<view class="typeInfo" style="text-align: left;">
							{{$isEmpty(item.label)?'':item.label}}
						</view>
						<view class="typeInfo" style="text-align: center;">
							{{$isEmpty(item.total)?'0':item.total}}
						</view>
						<view class="typeInfo" style="text-align: right;">
							{{$isEmpty(item.score)?'0':item.score}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="flexRowStart" style="padding: 24rpx 40rpx 20rpx 40rpx;position: sticky;top: 0rpx;background-color: #FFFFFF;z-index: 999;" id="kind">
			<view class="flexColumn" style="margin-right: 40rpx;height: 60rpx;" @tap="allTest()">
				<view :class="[{ active: allActive }, { unactive: !allActive }]">所有题目</view>
				<view class="title-item-bottom" v-if="allActive"></view>
			</view>
			<view class="flexColumn" @tap="falseTest()" style="height: 60rpx;">
				<view :class="[{ active: falseActive }, { unactive: !falseActive }]">只看错题</view>
				<view class="title-item-bottom" v-if="falseActive"></view>
			</view>
		</view>
		<swiper :style="{height:swiperHeight + 'px'}" @change="swiperChange" observer observerParents :current-item-id="item_id" ref="swiper">
			<swiper-item item-id="0" >
				<scroll-view :scroll-y="scrollStatus" style="height: 100vh">
					<view class="">
						<view id="list" class="" v-for="(item,index) of questionTypeList" :key="index">
							<view class="">
								<view class="flexRowStart quesInfo" style="position: sticky;background-color: #FFFFFF;z-index: 998;top:0;">
									<image v-if="oss" class="examIcon" :src="oss+'icon_examinationTypeIcon.png'" mode=""></image>
									<view class="color_303031 bold label">
										{{$isEmpty(item.label)?'':item.label}}
									</view>
									<view class="color_919397 flexRowStart" style="font-size: 20rpx;">
										<view class="color_919397" style="font-size: 20rpx;">
											(共{{$isEmpty(item.end) || $isEmpty(item.start) ?'0': item.end-item.start +1}}题，合计{{$isEmpty(item.total)?'0':item.total}}分)
										</view>
									</view>
								</view>
								<view class="" v-if="item.value=='RADIO'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class="" v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of singleQuestionList" :key="index2" style="margin-bottom: 60rpx;">
										<view class=" color_303031" style="font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold" style="flex: 1;">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="optionsJsonList" v-for="(item3,index3) of item2.examQuestionVO.optionsJson" :key="index3">
											<view class="flexRow">
												<view class="flexRowStart color_666769 optionsJsonItem" style="align-items: flex-start;">
													<view class="">
														{{$isEmpty(item3.key)?'':item3.key}} 、
													</view>
													<view class="" style="flex: 1;min-width: 0;word-break: break-all">
														{{$isEmpty(item3.value)?'':item3.value}}
													</view>
												</view>
												<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]" style="margin-left: 20rpx;">
													<image class="answerImg" v-if="item3.key == item2.userAnswerJson[0] && oss" :src="oss+'icon_soExaminationAnalyze_true.png'"></image>
													<view v-else class="answerIcon">
													</view>
												</view>
												<view class="" v-else style="margin-left: 20rpx;">
													<view class="answerIcon">
													</view>
												</view>
											</view>
											<view class="" v-if="!$isEmpty(item3.optionUrl)">
												<image :src="item3.optionUrl" mode="aspectFit" style="width: 100%;margin-top: 20rpx;"></image>
											</view>
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_answer.png'"></image>
												<view class="flexRow" style="flex: 1;">
													<view class="color_666769 bold answerInfoTitle" style="flex: 1;margin-right: 30rpx;">
														<text>正确答案:</text>
														<text class="color_3CD489" style="margin-left: 10rpx;">{{$isEmpty(item2.answerJson)?'': item2.answerJson[0]}}</text>
													</view>
													<view class="color_666769 bold flexRowStart answerInfoTitle" style="flex: 1;">
														<view>考生答案:</view>
														<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]">
															<text v-if="item2.answerJson[0]==item2.userAnswerJson[0]" class="color_3CD489" style="margin-left: 10rpx;">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson[0]}}</text>
															<text v-if="item2.answerJson[0]!=item2.userAnswerJson[0]" class="color_F74437" style="margin-left: 10rpx;">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson[0]}}</text>
														</view>
														<view class="color_F74437" style="margin-left: 10rpx;" v-else>
															未作答
														</view>
													</view>
												</view>
											</view>
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0': item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_analyze.png'"></image>
												<view class="singleEllipsis" style="flex: 1;min-width: 0rpx;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'暂无解析':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="" v-if="item.value=='CHECKBOX'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class=""  v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of doubleQuestionList" :key="index2" style="margin-bottom: 60rpx;">
										<view class="color_303031" style="margin-bottom: 30rpx;font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="optionsJsonList" v-for="(item3,index3) of item2.examQuestionVO.optionsJson" :key="index3">
											<view class="flexRow">
												<view class="flexRowStart color_666769 optionsJsonItem" style="align-items: flex-start;">
													<view class="">
														{{$isEmpty(item3.key)?'':item3.key}} 、
													</view>
													<view class="" style="flex: 1;word-break: break-all">
														{{$isEmpty(item3.value)?'':item3.value}}
													</view>
												</view>
												<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]">
													<image class="answerImg" v-if="item2.userAnswerJson.includes(item3.key) && oss" :src="oss+'icon_soExaminationAnalyze_true.png'">
													</image>
													<view v-else class="answerIcon">
													</view>
												</view>
												<view class="" v-else>
													<view class="answerIcon">
													</view>
												</view>
											</view>
											<view class="" v-if="!$isEmpty(item3.optionUrl)">
												<image :src="item3.optionUrl" mode="aspectFit" style="width: 100%;margin-top: 20rpx;"></image>
											</view>
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;align-items: flex-start;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_answer.png'"></image>
												<view class="flexRow" style="flex: 1;align-items: flex-start;">
													<view class="color_666769 bold answerInfoTitle flexRowStart" style="flex: 1;align-items: flex-start;margin-right: 30rpx;">
														<text>正确答案:</text>
														<text class="color_3CD489" style="margin-left: 10rpx;flex: 1;word-break: break-all;">{{$isEmpty(item2.answerJson)?'':item2.answerJson.join('')}}</text>
													</view>
													<view class="color_666769 bold answerInfoTitle flexRowStart" style="align-items: flex-start;flex: 1;">
														<text>考生答案:</text>
														<view class="" v-if="!$isEmpty(item2.userAnswerJson)&& item2.userAnswerJson!=[]" style="flex: 1;">
															<text v-if="item2.grade==item2.score" class="color_3CD489" style="margin-left: 10rpx;word-break: break-all;">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson.join('')}}</text>
															<text v-if="item2.grade!=item2.score" class="color_F74437" style="margin-left: 10rpx;word-break: break-all;">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson.join('')}}</text>
														</view>
														<text class="color_F74437" style="margin-left: 10rpx;flex: 1;" v-else>
															未作答
														</text>
													</view>
												</view>
											</view>
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0': item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_analyze.png'"></image>
												<view class="tribleEllipsis" style="flex: 1;min-width: 0rpx;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'暂无解析':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="" v-if="item.value=='CHECKED'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class=""  v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of judgeQuestionList" :key="index2" style="margin-bottom: 60rpx;">
										<view class=" color_303031" style="margin-bottom: 30rpx;font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold" style="flex: 1;">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="optionsJsonList" v-for="(item3,index3) of item2.examQuestionVO.optionsJson" :key="index3">
											<view class="flexRow">
												<view class="flexRowStart color_666769 optionsJsonItem">
													<view class="" style="flex: 1;word-break: break-all">
														{{$isEmpty(item3.value)?'':item3.value}}
													</view>
												</view>
												<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]">
													<image class="answerImg" v-if="item3.key == item2.userAnswerJson[0] && oss" :src="oss+'icon_soExaminationAnalyze_true.png'"></image>
													<view v-else class="answerIcon">
													</view>
												</view>
												<view class="" v-else>
													<view class="answerIcon">
													</view>
												</view>
											</view>
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_answer.png'"></image>
												<view class="flexRow" style="flex: 1;">
													<view class="color_666769 bold answerInfoTitle" style="flex: 1;margin-right: 30rpx;">
														<text>正确答案:</text>
														<text v-if="item2.answerJson[0]=='A'" class="color_3CD489" style="margin-left: 10rpx;">正确</text>
														<text v-if="item2.answerJson[0]=='B'" class="color_3CD489" style="margin-left: 10rpx;">错误</text>
													</view>
													<view class="color_666769 bold flexRowStart answerInfoTitle" style="flex: 1;">
														<view>考生答案:</view>
														<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]">
															<text v-if="item2.userAnswerJson[0]=='A' && item2.userAnswerJson[0]==item2.answerJson[0]" class="color_3CD489" style="margin-left: 10rpx;">正确</text>
															<text v-if="item2.userAnswerJson[0]=='B' && item2.userAnswerJson[0]==item2.answerJson[0]" class="color_3CD489" style="margin-left: 10rpx;">错误</text>
															<text v-if="item2.userAnswerJson[0]=='A' && item2.userAnswerJson[0]!=item2.answerJson[0]" class="color_F74437" style="margin-left: 10rpx;">正确</text>
															<text v-if="item2.userAnswerJson[0]=='B' && item2.userAnswerJson[0]!=item2.answerJson[0]" class="color_F74437" style="margin-left: 10rpx;">错误</text>
														</view>
														<text class="color_F74437" style="margin-left: 10rpx;" v-else>
															未作答
														</text>
													</view>
												</view>
											</view>
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0':item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_analyze.png'"></image>
												<view class="singleEllipsis" style="flex: 1;min-width: 0rpx;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'暂无解析':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="" v-if="item.value=='GAPFILLING'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class=""  v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of gapQuestionList" :key="index2" style="margin-bottom: 60rpx;">
										<view class=" color_303031" style="margin-bottom: 30rpx;font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold" style="flex: 1;">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="" v-for="(item3,index3) of item2.examQuestionVO.optionsJson" :key="index3">
											<view class="" style="padding: 30rpx; margin-bottom: 40rpx;	border-radius: 20rpx;background-color: #F4F5F6;">
												<view class="flexRowStart color_666769" style="margin-bottom: 28rpx;font-size: 28rpx;line-height: 40rpx;">
													<view class="">
														{{$isEmpty(item3.key)?'':item3.key}} 、
													</view>
													<view style="flex: 1;word-break: break-all;">填空题</view>
												</view>
												<textarea v-model="item2.userAnswerJson[index3]" disabled style="width: 550rpx; height: 96rpx; padding: 30rpx;background-color: #FFFFFF;color: #919397;font-size: 28rpx;line-height: 48rpx;border-radius: 20rpx;"/>
											</view>
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;align-items: flex-start;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_answer.png'"></image>
												<view class="" style="flex: 1;">
													<view class="color_666769 bold answerInfoTitle flexRowStart" style="align-items: flex-start;margin-bottom: 30rpx;">
														<view style="margin-right: 10rpx;">正确答案:</view>
														<view class="color_3CD489" style="flex: 1;">{{item2.answerJson[0].split('|').join('、')}}</view>
													</view>
													<view class="color_666769 bold flexRowStart answerInfoTitle flexRowStart" style="align-items: flex-start;">
														<view style="margin-right: 10rpx;">考生答案:</view>
														<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]" style="flex: 1;">
															<text v-if="item2.grade==item2.score" class="color_3CD489">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson.join('、')}}</text>
															<text v-if="item2.grade!=item2.score" class="color_F74437">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson.join('、')}}</text>
														</view>
														<view class="color_F74437" v-else>
															未作答
														</view>
													</view>
												</view>
											</view>
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0':item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_analyze.png'"></image>
												<view class="singleEllipsis" style="flex: 1;min-width: 0rpx;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'暂无解析':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="" v-if="item.value=='ESSAYQUESTION'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class=""  v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of essayQuestionList" :key="index2" style="margin-bottom: 60rpx;">
										<view class=" color_303031" style="margin-bottom: 30rpx;font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold" style="flex: 1;">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="color_666769" style="background-color: #F4F5F6;padding: 30rpx;border-radius: 20rpx;font-size: 28rpx;line-height: 48rpx;">
											{{$isEmpty(item2.userAnswerJson)?'无': item2.userAnswerJson[0]}}
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0':item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;align-items: flex-start;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_essayAnalyze.png'"></image>
												<view class="" style="flex: 1;word-break: break-all;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'暂无解析':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="1" >
				<scroll-view :scroll-y="scrollStatus" style="height: 100vh;" v-if="questionListWrong.length>0">
					<view class="">
						<view id="list" class="" v-for="(item,index) of questionTypeListWrong" :key="index">
							<view class="">
								<view class="flexRowStart quesInfo" style="position: sticky;background-color: #FFFFFF;z-index: 998;top:0">
									<image class="examIcon" v-if="oss" :src="oss+'icon_examinationTypeIcon.png'"></image>
									<view class="color_303031 bold label">
										{{$isEmpty(item.label)?'':item.label}}
									</view>
									<view class="color_919397 flexRowStart" style="font-size: 20rpx;">
										<view class="color_919397" style="font-size: 20rpx;">
											(共{{$isEmpty(item.end) || $isEmpty(item.start) ?'0': item.end-item.start +1}}题，合计{{$isEmpty(item.total)?'0':item.total}}分)
										</view>
									</view>
								</view>
								<view class=""  v-if="item.value=='RADIO'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class="" v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of singleQuestionListWrong" :key="index2" style="margin-bottom: 60rpx;">
										<view class=" color_303031" style="margin-bottom: 30rpx;font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold" style="flex: 1;">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="optionsJsonList" v-for="(item3,index3) of item2.examQuestionVO.optionsJson" :key="index3">
											<view class="flexRow">
												<view class="flexRowStart color_666769 optionsJsonItem" style="align-items: flex-start;">
													<view class="">
														{{$isEmpty(item3.key)?'':item3.key}} 、
													</view>
													<view class="" style="flex: 1;min-width: 0;word-break: break-all">
														{{$isEmpty(item3.value)?'':item3.value}}
													</view>
												</view>
												<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]" style="margin-left: 20rpx;">
													<image class="answerImg" v-if="item3.key == item2.userAnswerJson[0] && oss" :src="oss+'icon_soExaminationAnalyze_true.png'"></image>
													<view v-else class="answerIcon">
													</view>
												</view>
												<view class="" v-else style="margin-left: 20rpx;">
													<view class="answerIcon">
													</view>
												</view>
											</view>
											<view class="" v-if="!$isEmpty(item3.optionUrl)">
												<image :src="item3.optionUrl" mode="aspectFit" style="width: 100%;margin-top: 20rpx;"></image>
											</view>
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_answer.png'"></image>
												<view class="flexRow" style="flex: 1;">
													<view class="color_666769 bold answerInfoTitle" style="flex: 1;margin-right: 30rpx;">
														<text>正确答案:</text>
														<text class="color_3CD489" style="margin-left: 10rpx;">{{$isEmpty(item2.answerJson)?'': item2.answerJson[0]}}</text>
													</view>
													<view class="color_666769 bold flexRowStart answerInfoTitle" style="flex: 1;">
														<view>考生答案:</view>
														<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]">
															<text v-if="item2.answerJson[0]==item2.userAnswerJson[0]" class="color_3CD489" style="margin-left: 10rpx;">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson[0]}}</text>
															<text v-if="item2.answerJson[0]!=item2.userAnswerJson[0]" class="color_F74437" style="margin-left: 10rpx;">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson[0]}}</text>
														</view>
														<view class="color_F74437" style="margin-left: 10rpx;" v-else>
															未作答
														</view>
													</view>
												</view>
											</view>
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0': item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_analyze.png'"></image>
												<view class="singleEllipsis" style="flex: 1;min-width: 0rpx;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'暂无解析':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="" v-if="item.value=='CHECKBOX'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class=""  v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of doubleQuestionListWrong" :key="index2" style="margin-bottom: 60rpx;">
										<view class="color_303031" style="margin-bottom: 30rpx;font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="optionsJsonList" v-for="(item3,index3) of item2.examQuestionVO.optionsJson" :key="index3">
											<view class="flexRow">
												<view class="flexRowStart color_666769 optionsJsonItem" style="align-items: flex-start;">
													<view class="">
														{{$isEmpty(item3.key)?'':item3.key}} 、
													</view>
													<view class="" style="flex: 1;word-break: break-all">
														{{$isEmpty(item3.value)?'':item3.value}}
													</view>
												</view>
												<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]">
													<image class="answerImg" v-if="item2.userAnswerJson.includes(item3.key) && oss" :src="oss+'icon_soExaminationAnalyze_true.png'">
													</image>
													<view v-else class="answerIcon">
													</view>
												</view>
												<view class="" v-else>
													<view class="answerIcon">
													</view>
												</view>
											</view>
											<view class="" v-if="!$isEmpty(item3.optionUrl)">
												<image :src="item3.optionUrl" mode="aspectFit" style="width: 100%;margin-top: 20rpx;"></image>
											</view>
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;align-items: flex-start;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_answer.png'"></image>
												<view class="flexRow" style="flex: 1;align-items: flex-start;">
													<view class="color_666769 bold answerInfoTitle flexRowStart" style="flex: 1;align-items: flex-start;margin-right: 30rpx;">
														<text>正确答案:</text>
														<text class="color_3CD489" style="margin-left: 10rpx;flex: 1;word-break: break-all;">{{$isEmpty(item2.answerJson)?'':item2.answerJson.join('')}}</text>
													</view>
													<view class="color_666769 bold answerInfoTitle flexRowStart" style="align-items: flex-start;flex: 1;">
														<text>考生答案:</text>
														<view class="" v-if="!$isEmpty(item2.userAnswerJson)&& item2.userAnswerJson!=[]" style="flex: 1;">
															<text v-if="item2.grade==item2.score" class="color_3CD489" style="margin-left: 10rpx;word-break: break-all;">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson.join('')}}</text>
															<text v-if="item2.grade!=item2.score" class="color_F74437" style="margin-left: 10rpx;word-break: break-all;">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson.join('')}}</text>
														</view>
														<text class="color_F74437" style="margin-left: 10rpx;flex: 1;" v-else>
															未作答
														</text>
													</view>
												</view>
											</view>
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0': item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_analyze.png'"></image>
												<view class="tribleEllipsis" style="flex: 1;min-width: 0rpx;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'暂无解析':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="" v-if="item.value=='CHECKED'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class=""  v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of judgeQuestionListWrong" :key="index2" style="margin-bottom: 60rpx;">
										<view class=" color_303031" style="margin-bottom: 30rpx;font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold" style="flex: 1;">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="" v-for="(item3,index3) of item2.examQuestionVO.optionsJson" :key="index3">
											<view class="flexRow optionsJsonList">
												<view class="flexRowStart color_666769 optionsJsonItem">
													<view class="" style="flex: 1;word-break: break-all">
														{{$isEmpty(item3.value)?'':item3.value}}
													</view>
												</view>
												<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]">
													<image class="answerImg" v-if="item3.key == item2.userAnswerJson[0] && oss" :src="oss+'icon_soExaminationAnalyze_true.png'"></image>
													<view v-else class="answerIcon">
													</view>
												</view>
												<view class="" v-else>
													<view class="answerIcon">
													</view>
												</view>
											</view>
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_answer.png'"></image>
												<view class="color_666769 bold answerInfoTitle" style="flex: 1;margin-right: 30rpx;">
													<text>正确答案:</text>
													<text v-if="item2.answerJson[0]=='A'" class="color_3CD489" style="margin-left: 10rpx;">正确</text>
													<text v-if="item2.answerJson[0]=='B'" class="color_3CD489" style="margin-left: 10rpx;">错误</text>
												</view>
												<view class="color_666769 bold flexRowStart answerInfoTitle" style="flex: 1;">
													<view>考生答案:</view>
													<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]">
														<text v-if="item2.userAnswerJson[0]=='A' && item2.userAnswerJson[0]==item2.answerJson[0]" class="color_3CD489" style="margin-left: 10rpx;">正确</text>
														<text v-if="item2.userAnswerJson[0]=='B' && item2.userAnswerJson[0]==item2.answerJson[0]" class="color_3CD489" style="margin-left: 10rpx;">错误</text>
														<text v-if="item2.userAnswerJson[0]=='A' && item2.userAnswerJson[0]!=item2.answerJson[0]" class="color_F74437" style="margin-left: 10rpx;">正确</text>
														<text v-if="item2.userAnswerJson[0]=='B' && item2.userAnswerJson[0]!=item2.answerJson[0]" class="color_F74437" style="margin-left: 10rpx;">错误</text>
													</view>
													<view class="color_F74437" style="margin-left: 10rpx;" v-else>
														未作答
													</view>
												</view>
											</view>
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0':item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_analyze.png'"></image>
												<view class="singleEllipsis" style="flex: 1;min-width: 0rpx;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="" v-if="item.value=='GAPFILLING'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class=""  v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of gapQuestionListWrong" :key="index2" style="margin-bottom: 60rpx;">
										<view class=" color_303031" style="margin-bottom: 30rpx;font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold" style="flex: 1;">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="" v-for="(item3,index3) of item2.examQuestionVO.optionsJson" :key="index3">
											<view class="" style="padding: 30rpx; margin-bottom: 40rpx;	border-radius: 20rpx;background-color: #F4F5F6;">
												<view class="flexRowStart color_666769" style="margin-bottom: 28rpx;font-size: 28rpx;line-height: 40rpx;">
													<view class="">
														{{$isEmpty(item3.key)?'':item3.key}} 、
													</view>
													<view style="flex: 1;word-break: break-all;">填空题</view>
												</view>
												<textarea v-model="item2.userAnswerJson[index3]" disabled style="width: 550rpx; height: 96rpx; padding: 30rpx;background-color: #FFFFFF;color: #919397;font-size: 28rpx;line-height: 48rpx;border-radius: 20rpx;"/>
											</view>
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;align-items: flex-start;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_answer.png'"></image>
												<view class="" style="flex: 1;">
													<view class="color_666769 bold answerInfoTitle flexRowStart" style="align-items: flex-start;margin-bottom: 30rpx;">
														<view style="margin-right: 10rpx;">正确答案:</view>
														<view class="color_3CD489" style="flex: 1;">{{item2.answerJson[0].split('|').join('、')}}</view>
													</view>
													<view class="color_666769 bold flexRowStart answerInfoTitle flexRowStart" style="align-items: flex-start;">
														<view style="margin-right: 10rpx;">考生答案:</view>
														<view class="" v-if="!$isEmpty(item2.userAnswerJson) && item2.userAnswerJson!=[]" style="flex: 1;">
															<text v-if="item2.grade==item2.score" class="color_3CD489">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson.join('、')}}</text>
															<text v-if="item2.grade!=item2.score" class="color_F74437">{{$isEmpty(item2.userAnswerJson)?'':item2.userAnswerJson.join('、')}}</text>
														</view>
														<view class="color_F74437" v-else>
															未作答
														</view>
													</view>
												</view>
											</view>
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0':item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_analyze.png'"></image>
												<view class="singleEllipsis" style="flex: 1;min-width: 0rpx;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="" v-if="item.value=='ESSAYQUESTION'" style="margin:0 40rpx;padding-top: 40rpx;border-top: 2rpx solid #EFF0F1;">
									<view class=""  v-if="item.value == item2.examQuestionVO.type" v-for="(item2,index2) of essayQuestionListWrong" :key="index2" style="margin-bottom: 60rpx;">
										<view class=" color_303031" style="margin-bottom: 30rpx;font-size: 28rpx;">
											<text class="bold" style="">
												{{$isEmpty(index2)?'1':index2+1}} 、
											</text>
											<text class="bold" style="flex: 1;">
												{{$isEmpty(item2.examQuestionVO.title)?'':item2.examQuestionVO.title}}
											</text>
											<text class="color_919397" style="font-size: 20rpx;margin-left: 10rpx;">
												({{$isEmpty(item2.grade)?'0':item2.grade}}分)
											</text>
										</view>
										<view class="" v-if="!$isEmpty(item2.examQuestionVO.titleUrl)">
											<image :src="item2.examQuestionVO.titleUrl" mode="aspectFit" style="width: 100%;"></image>
										</view>
										<view class="color_666769" style="background-color: #F4F5F6;padding: 30rpx;border-radius: 20rpx;font-size: 28rpx;line-height: 48rpx;">
											{{$isEmpty(item2.userAnswerJson)?'无': item2.userAnswerJson[0]}}
										</view>
										<view class="answerInfo">
											<view class="flexRowStart" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_score.png'"></image>
												<view class="color_303031 answerInfoScore">
													{{$isEmpty(item2.score)?'0':item2.score}}分
												</view>
											</view>
											<view class="flexRowStart color_666769 answerInfoScore" style="padding-top: 30rpx;">
												<image class="icon" v-if="oss" :src="oss+'icon_soExaminationAnalyze_essayAnalyze.png'"></image>
												<view class="singleEllipsis" style="flex: 1;min-width: 0rpx;">
													{{$isEmpty(item2.examQuestionVO.quesExplain)?'':item2.examQuestionVO.quesExplain}}
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="bottom-safe" style="height: 112rpx;"></view>
				</scroll-view>
				<view class="flexRow" style="justify-content: center;margin-top: 20rpx;" v-else>
					<image v-if="oss" :src="oss+'pic_examination_noMistake.png'" mode="aspectFit" style="width: 280rpx;height: 280rpx;" ></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oss:'',
				checkInfo:{},
				status:false,
				questionTypeList:[],
				questionList:[],
				singleQuestionList:[],
				doubleQuestionList:[],
				judgeQuestionList:[],
				gapQuestionList:[],
				essayQuestionList:[],
				questionTypeListWrong:[],
				questionListWrong:[],
				singleQuestionListWrong:[],
				doubleQuestionListWrong:[],
				judgeQuestionListWrong:[],
				gapQuestionListWrong:[],
				essayQuestionListWrong:[],
				swiperHeight:'',
				item_id:'',
				allActive:true,
				falseActive:false,
				kindHeight:0,
				scrollStatus:false,
				imgHeight:''
			};
		},
		onLoad(options) {
			const {id} =options
			this.oss=this.$oss
			this.$http.get('qms/exam_answer/check_paper/' + id).then(res=>{
				// console.log(res)
				this.checkInfo =res.data.data
				this.questionTypeList = res.data.data.quesType
				this.questionList = res.data.data.examAnswerVOList
				this.singleQuestionList = this.questionList.filter(item=>{
					return item.examQuestionVO.type =="RADIO"
				})
			
				this.doubleQuestionList =this.questionList.filter(item=>{
					return item.examQuestionVO.type =="CHECKBOX"
				})
				
				this.judgeQuestionList =this.questionList.filter(item=>{
					return item.examQuestionVO.type =="CHECKED"
				})
				this.gapQuestionList =this.questionList.filter(item=>{
					return item.examQuestionVO.type =="GAPFILLING"
				})
				this.essayQuestionList =this.questionList.filter(item=>{
					return item.examQuestionVO.type =="ESSAYQUESTION"
				})
				
			})
			this.$http.get('qms/exam_answer/check_wrong_paper/' + id).then(res=>{
				// console.log(res)
				this.questionTypeListWrong = res.data.data.quesType
				this.questionListWrong = res.data.data.examAnswerVOList
				let newArr = []
				for (let i = 0; i < this.questionTypeListWrong.length; i++) {
					for (let j = 0; j < this.questionListWrong.length; j++) {
						if(this.questionTypeListWrong[i].value == this.questionListWrong[j].examQuestionVO.type){
							if(!newArr.includes(this.questionTypeListWrong[i])){
								newArr.push(this.questionTypeListWrong[i]);
							}
							console.log(newArr)
						}
					}
				}
				// console.log(newArr)
				this.questionTypeListWrong=newArr
				this.singleQuestionListWrong = this.questionListWrong.filter(item=>{
					return item.examQuestionVO.type =="RADIO"
				})
			
				this.doubleQuestionListWrong =this.questionListWrong.filter(item=>{
					return item.examQuestionVO.type =="CHECKBOX"
				})
				
				this.judgeQuestionListWrong =this.questionListWrong.filter(item=>{
					return item.examQuestionVO.type =="CHECKED"
				})
				this.gapQuestionListWrong =this.questionListWrong.filter(item=>{
					return item.examQuestionVO.type =="GAPFILLING"
				})
				this.essayQuestionListWrong =this.questionListWrong.filter(item=>{
					return item.examQuestionVO.type =="ESSAYQUESTION"
				})
				
			})
			uni.createSelectorQuery()
				.in(this)
				.select('#kind')
				.boundingClientRect()
				.select('#content')
				.boundingClientRect()
				.exec(ret => {
					// console.log(ret)
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height
					this.scrollKindHeight =ret[0].height
					//计算为214，实际为213.6
					this.imgHeight = ret[1].height-1
					// let height = uni.getSystemInfoSync().windowHeight;
					// // console.log(height)
					// this.swiperHeight =height - ret[0].height
					// console.log(this.scrollHeight)
				});
		},
		onPageScroll(e) {
			if(e.scrollTop > this.imgHeight){
				this.scrollStatus =true
			}else{
				this.scrollStatus =false
			}
		},
		watch: {
			status: {
				handler: function() {
					//加延时器是因为监听拿到的值都是前一个值
					setTimeout(()=>{
						uni.createSelectorQuery()
							.in(this)
							.select('#content')
							.boundingClientRect()
							.exec(ret => {
								// console.log(ret)
								//计算为214，实际为213.6
								this.imgHeight = ret[0].height-1
							});
					},300)
				},
				deep: true,
				// immediate:true
			},
		},
		methods:{
			checkMore(){
				this.status = !this.status
			},
			swiperChange(e){
				if (e.detail.current == 0) {
					this.allTest();
				} else if (e.detail.current == 1) {
					this.falseTest();
				}
			},
			allTest(){
				this.allActive = true
				this.falseActive =false
				this.item_id = 0;
			},
			falseTest(){
				this.item_id = 1;
				this.allActive = false
				this.falseActive =true
			},
		}
	}
</script>

<style lang="scss">
	.active {
		color: #f74437;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		margin-bottom: 10rpx;
	}
	
	.unactive {
		color: #919397;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		margin-bottom: 10rpx;
	}
	.title-item-bottom {
		width: 12rpx;
		height: 6rpx;
		border-radius: 3rpx;
		background-color: #F74437;
	}
	.icon{
		width: 72rpx;
		height: 36rpx;
		margin-right: 20rpx;
	}
	.answerInfo{
		margin-top: 50rpx;
		padding:0 30rpx 30rpx 30rpx;
		border-radius: 20rpx;
		box-shadow: 0rpx 0rpx 8rpx 2rpx rgba(0, 0, 0, 0.08);
		.answerInfoTitle{
			font-size: 24rpx;
			line-height: 28rpx;
		}
		.answerInfoScore{
			font-size: 24rpx;
			line-height: 28rpx;
		}
	}
	.answerIcon{
		width: 24rpx;
		height: 24rpx;
		border: 4rpx solid #E3E4E5;
		border-radius: 50%;
	}
	.answerImg{
		width: 32rpx;
		height: 32rpx;
	}
	.optionsJsonList{
		padding: 20rpx 30rpx;
		background-color: #F4F5F6;
		border-radius: 20rpx;
		margin-top: 30rpx;
		.optionsJsonItem{
			font-size: 28rpx;
			line-height: 40rpx;
			flex: 1;
			min-width: 0;
		}
	}
	.quesInfo{
		padding: 20rpx 40rpx;
		align-items: flex-end;
		.label{
			font-size: 28rpx;
			margin-right: 10rpx;
		}
	}
.container{
	.examName{
		font-weight: 600;
		font-size: 32rpx;
		line-height: 48rpx;
		padding: 0 40rpx;
		padding-top: 20rpx;
		text-align: center;
		word-break: break-all
	}
	.content{
		position: relative;
		padding: 40rpx;
		
		.contentInfo{
			position: absolute;
			top: 0rpx;
			left: 0rpx;
			bottom: 0rpx;
			right: 0rpx;
			margin: auto;
			padding: 80rpx;
			.contentInfoTitle{
				margin-bottom: 6rpx;
				font-size: 24rpx;
				line-height: 34rpx
			}
			.contentInfoResult{
				margin-bottom: 34rpx;
				.score{
					font-size: 44rpx;
					line-height: 52rpx;
				}
				.result{
					font-weight: 600;
					font-size: 32rpx;
					line-height: 44rpx;
				}
			}
			.contentInfoType{
				padding-top: 40rpx;
				border-top: 2rpx solid #FFFFFF;
				font-size: 24rpx;
				line-height: 34rpx;
				.typeInfo{
					flex: 1;
				}
			}
		}
	}
}
.examIcon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}
	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
	
</style>
