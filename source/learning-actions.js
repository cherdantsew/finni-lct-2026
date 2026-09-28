// Last reaction layer. All branches are flat (Figma does not allow nested conditions).
const learnDefaults={planIntroSeen:false,planGuideStep:0,learnIndex:0,learnTopic:0,learnKind:0,learningFeedback:false,learnEarnedNow:false,learnLog:'',
 'ui/learnTopic':'Планируем бюджет','ui/learnIntro':'','ui/learnWeek':'Неделя 1',
 'ui/lessonAvailable':true,'ui/lessonLocked':false,'ui/lessonStatus':'Награда за задание: 10 ₽',
 'ui/lessonUnit':'пачек','ui/learnApply':'Посмотреть корм','ui/showLearnApply':false,'ui/showLearnRetry':true,
 'ui/planGuideTitle':'Сначала — необходимое','ui/planGuideBody':'','ui/planGuideStep':'1 из 3','ui/planGuideNext':'Дальше',
 'ui/learnTotal':0,'ui/learnProgress':'0 из 15 заданий выполнено','ui/planGuideSkip':true,
};
for(let i=0;i<3;i++){learnDefaults['ui/learnArt'+i]=i===0;learnDefaults['ui/planGuideArt'+i]=i===0;learnDefaults['ui/topicCount'+i]=0;learnDefaults['ui/topicProgress'+i]='0 из 5 выполнено';}
for(let i=0;i<5;i++){learnDefaults['ui/courseTitle'+i]='';learnDefaults['ui/courseStatus'+i]='';}
for(let i=0;i<15;i++){learnDefaults['learnDone'+i]=false;learnDefaults['learnPaid'+i]=false;learnDefaults['learnAttempts'+i]=0;learnDefaults['learnHelp'+i]=false;learnDefaults['learnFeedback'+i]=false;learnDefaults['learnFirst'+i]='';}
for(const[k,v]of Object.entries(learnDefaults)){defaults[k]=v;vars[k]={id:k,resolvedType:typeof v==='number'?'FLOAT':typeof v==='boolean'?'BOOLEAN':'STRING'};}
const learnLog=event=>S('learnLog',J(R('learnLog'),'\n',event));
function learningRefresh(){const a=[S('ui/learnTotal',0),S('ui/taskTitle','Уроки и задания'),S('ui/taskNote','Задания недели пройдены'),S('ui/learnWeek',J('Неделя ',R('week'))),S('ui/lessonAvailable',false),S('ui/showLearnApply',and(R('learningFeedback'),R('exerciseCompleted')))];
 a.push(S('ui/showLearnRetry',not(and(R('learningFeedback'),R('exerciseCompleted')))));
 for(let t=0;t<3;t++){a.push(S('ui/topicCount'+t,0),S('ui/learnArt'+t,eq(R('learnTopic'),t)));}
 for(const [i,l]of learningCatalog.lessons.entries()){
  a.push(C(R('learnDone'+i),[S('ui/learnTotal',add(R('ui/learnTotal'),1)),S('ui/topicCount'+l.topic,add(R('ui/topicCount'+l.topic),1))]));
  a.push(C(eq(R('learnTopic'),l.topic),[S('ui/courseTitle'+(l.week-1),l.title),S('ui/courseStatus'+(l.week-1),'Откроется: неделя '+l.week)]));
  a.push(C(and(eq(R('learnTopic'),l.topic),ge(R('week'),l.week)),[S('ui/courseStatus'+(l.week-1),l.week+'-я неделя · можно повторить')]));
  a.push(C(and(eq(R('learnTopic'),l.topic),eq(R('week'),l.week),not(R('periodClosed')),not(R('learnPaid'+i))),[S('ui/courseStatus'+(l.week-1),'Эта неделя · награда 10 ₽')]));
  a.push(C(and(eq(R('learnTopic'),l.topic),R('learnDone'+i)),[S('ui/courseStatus'+(l.week-1),'Выполнено · повторить')]));
  const fields=[S('ui/lessonAvailable',ge(R('week'),l.week)),S('ui/lessonLocked',lt(R('week'),l.week)),S('ui/lessonUnit',l.unit||'₽'),S('ui/learnApply',l.apply),S('ui/lessonStatus','Неделя '+l.week+' · повторение'),S('ui/learnIntro',l.lesson)];
  const packs=n=>n+' '+(n===1?'пачка':n>=2&&n<=4?'пачки':'пачек');
  if(l.choices)fields.push(S('ui/practiceAPrice',l.choices[0].price+' ₽'),S('ui/practiceANote',packs(l.choices[0].quantity)),S('ui/practiceBPrice',l.choices[1].price+' ₽'),S('ui/practiceBNote',packs(l.choices[1].quantity)));
  a.push(C(eq(R('learnIndex'),i),fields));
  a.push(C(and(eq(R('learnIndex'),i),eq(R('week'),l.week),not(R('periodClosed')),not(R('learnPaid'+i))),[S('ui/lessonStatus','Эта неделя · награда 10 ₽')]));
  a.push(C(and(eq(R('learnIndex'),i),R('learnPaid'+i)),[S('ui/lessonStatus','Награда получена · можно повторить')]));
  a.push(C(and(eq(R('learnIndex'),i),lt(R('week'),l.week)),[S('ui/lessonStatus','Откроется на '+l.week+'-й неделе')]));
 }
 for(let t=0;t<3;t++)a.push(S('ui/topicProgress'+t,J(R('ui/topicCount'+t),' из 5 выполнено')),C(eq(R('learnTopic'),t),[S('ui/learnTopic',learningCatalog.topics[t].title)]));
 a.push(S('ui/learnProgress',J(R('ui/learnTotal'),' из 15 заданий выполнено')),S('ui/completedCount',R('ui/learnProgress')));
 for(const[t,key,label]of[[0,'Budget','Планирование'],[1,'Shopping','Покупки'],[2,'Saving','Сбережения']])a.push(S('ui/topic'+key+'Count',R('ui/topicCount'+t)),S('ui/topic'+key,J(label,': ',R('ui/topicCount'+t),' из 5 заданий')));
 for(let i=14;i>=0;i--){const l=learningCatalog.lessons[i];a.push(C(and(eq(R('week'),l.week),not(R('learnPaid'+i)),not(R('periodClosed'))),[S('ui/taskNote','Новое задание · +10 ₽')]));}
 a.push(C(R('periodClosed'),[S('ui/taskNote','Можно повторить задания')]));
 return a;
}
// First-plan introduction is voluntary. Other entry points retain purchase/transfer context.
function guideState(){return [S('ui/planGuideTitle','Сначала — необходимое'),S('ui/planGuideBody','Другу нужны 14 пачек корма на неделю и шампунь. Если купить корм упаковками, на всё хватит 70 ₽.'),S('ui/planGuideStep','1 из 3'),S('ui/planGuideNext','Дальше'),
 C(eq(R('planGuideStep'),1),[S('ui/planGuideTitle','Оставим на цель'),S('ui/planGuideBody','Реши, сколько отложишь в копилку. Небольшие взносы помогут накопить на то, что хочется.'),S('ui/planGuideStep','2 из 3')]),
 C(eq(R('planGuideStep'),2),[S('ui/planGuideTitle','И на приятные покупки'),S('ui/planGuideBody','Остальные деньги можно оставить на покупки для себя. План поможет помнить, сколько ты решил потратить.'),S('ui/planGuideStep','3 из 3'),S('ui/planGuideNext','Составить мой план')]),
 S('ui/planGuideSkip',lt(R('planGuideStep'),2)),...[0,1,2].map(i=>S('ui/planGuideArt'+i,eq(R('planGuideStep'),i)))];}
enter['plan-guide']=guideState();
A['plan-guide/next']=[S('ok',eq(R('planGuideStep'),2)),C(R('ok'),[S('planIntroSeen',true),N('plan')]),C(not(R('ok')),[S('planGuideStep',add(R('planGuideStep'),1))]),...guideState()];
A['plan-guide/skip']=[S('planIntroSeen',true),N('plan')];
A['header/plan-guide/back']=[S('ok',eq(R('planGuideStep'),0)),C(not(R('ok')),[S('planGuideStep',sub(R('planGuideStep'),1))]),...guideState(),...planReturn().map(a=>({...a,conditionalBlocks:a.conditionalBlocks.map(b=>({...b,condition:and(R('ok'),b.condition)}))}))];
A['plan/explain']=[S('planGuideStep',0),N('plan-guide')];
A['header/plan-guide/back'].push(C(and(R('ok'),eq(R('planReturn'),7)),[N('lesson')]));
A['guide/home/plan']=[S('guideHomeSeen',true),S('ui/guideHome',false),S('planReturn',0),S('planGuideStep',0),C(R('planSet'),[N('plan-ready')],[N('plan-guide')])];
// First Home action is helpful; later plans do not repeat the course automatically.
A['home/plan']=[S('planReturn',0),S('planGuideStep',0),C(R('planSet'),[N('plan-ready')]),C(and(not(R('planSet')),not(R('planIntroSeen')),eq(R('week'),1)),[N('plan-guide')]),C(and(not(R('planSet')),or(R('planIntroSeen'),gt(R('week'),1))),[N('plan')])];
for(let t=0;t<3;t++)A['tasks/topic/'+t]=[S('learnTopic',t),N('course')];
for(const target of ['home','shop','finance','inventory'])A['course/nav/'+target]=[N(target)];
for(let w=0;w<5;w++)A['course/'+w]=[...Array.from({length:3},(_,t)=>C(eq(R('learnTopic'),t),[S('learnIndex',w*3+t)])),N('lesson')];
// Set condition and method before the independent response; previous evidence is kept per ID.
function loadLesson(){const a=[];for(const[i,l]of learningCatalog.lessons.entries())a.push(C(eq(R('learnIndex'),i),[
 S('task',i),S('learnTopic',l.topic),S('learnKind',{number:0,shop:1,plan:2}[l.kind]),S('answer',0),S('exerciseCompleted',false),S('learningFeedback',true),S('learnEarnedNow',false),
 S('attempts',R('learnAttempts'+i)),S('helpUsed',R('learnHelp'+i)),S('expected',l.expected||0),S('lessonTitle',l.title),S('lessonPrompt',l.prompt),S('lessonExplanation',l.correct),S('lessonHelp',l.hint),S('lessonStep',l.step||1),S('practiceRequired',0),S('practiceOptional',0),S('practiceSaving',0),
 S('feedbackFrom',{number:1,shop:2,plan:3}[l.kind])
 ]));return a;}
enter.lesson=[...loadLesson()];enter.course=[];
for(let i=0;i<15;i++)A['tasks/'+i]=[S('learnIndex',i),N('lesson')];
const exerciseRoute=()=>[C(eq(R('learnKind'),0),[N('exercise')]),C(eq(R('learnKind'),1),[N('practice-shop')]),C(eq(R('learnKind'),2),[N('practice-plan')])];
A['lesson/start']=[...exerciseRoute().map(a=>({...a,conditionalBlocks:a.conditionalBlocks.map(b=>({...b,condition:and(b.condition,R('ui/lessonAvailable'),R('planSet'))}))})),C(and(R('ui/lessonAvailable'),not(R('planSet'))),[S('planReturn',7),N('plan')])];
A['plan-ready/next'].push(C(eq(R('planReturn'),7),[N('lesson')]));A['header/plan/back'].push(C(eq(R('planReturn'),7),[N('lesson')]));
A['header/lesson/back']=A['lesson/back']=[N('course')];A['header/course/back']=[N('tasks')];
for(const k of ['exercise','practice-plan','practice-shop'])A['header/'+k+'/back']=[N('course')];
const answerDescription=()=>J('Ответ ',R('answer'),'; план ',R('practiceRequired'),'/',R('practiceOptional'),'/',R('practiceSaving'));
function learningJudge(){const a=[S('ok',false),S('learnEarnedNow',false)];
 for(const[i,l]of learningCatalog.lessons.entries()){
  const condition=l.kind==='plan'?and(ge(R('practiceRequired'),l.requiredMin),ge(R('practiceSaving'),l.savingMin),not(gt(add(add(R('practiceRequired'),R('practiceOptional')),R('practiceSaving')),100))):eq(R('answer'),l.expected);
  a.push(C(and(eq(R('learnIndex'),i),R('ui/lessonAvailable'),R('planSet')),[S('ok',condition)]));
  a.push(C(and(eq(R('learnIndex'),i),eq(R('learnAttempts'+i),0)),[S('learnFirst'+i,answerDescription())]));
  a.push(C(eq(R('learnIndex'),i),[S('learnAttempts'+i,add(R('learnAttempts'+i),1)),S('attempts',R('learnAttempts'+i)),learnLog(J(l.id,' · ',answerDescription(),' · помощь ',R('learnHelp'+i),' · после объяснения ',R('learnFeedback'+i),' · верно ',R('ok')))]));
  a.push(C(and(eq(R('learnIndex'),i),not(R('ok'))),[S('learnFeedback'+i,true),S('resultTitle','Давай разберёмся'),S('result',l.wrong)]));
  a.push(C(and(eq(R('learnIndex'),i),R('ok')),[S('learnDone'+i,true),S('resultTitle','Получилось!'),S('result',l.correct)]));
  a.push(C(and(eq(R('learnIndex'),i),R('ok'),eq(R('week'),l.week),not(R('learnPaid'+i)),not(R('periodClosed'))),[S('learnPaid'+i,true),S('learnEarnedNow',true),S('wallet',add(R('wallet'),10)),S('earned',add(R('earned'),10)),S('financeHistory',J(R('financeHistory'),'\nЗадание «',l.title,'»: +10 ₽.')),log('Задание «'+l.title+'»: +10 ₽.')]));
 }
 a.push(S('exerciseCompleted',R('ok')),C(R('learnEarnedNow'),[S('result',J(R('result'),'\n\nЗа задание: +10 ₽.'))]),N('feedback'));return a;
}
A['exercise/check']=learningJudge();A['practice-plan/check']=learningJudge();
A['practice-shop/a']=[S('answer',0),...learningJudge()];A['practice-shop/b']=[S('answer',1),...learningJudge()];
for(const k of ['exercise','practice-plan','practice-shop']){
 A[k+'/hint']=[S('helpUsed',true),...learningCatalog.lessons.map((l,i)=>C(eq(R('learnIndex'),i),[S('learnHelp'+i,true),learnLog(l.id+' · открыта подсказка')])),S('resultTitle','Подсказка'),S('result',R('lessonHelp')),S('exerciseCompleted',false),N('feedback')];
 A['header/'+k+'/help'].splice(-1,0,...learningCatalog.lessons.map((l,i)=>C(eq(R('learnIndex'),i),[S('learnHelp'+i,true),learnLog(l.id+' · открыта помощь')])));
}
for(const k of ['count/check','count/hint','count/choose/7','count/choose/14','count/choose/21'])A[k].unshift(S('learningFeedback',false));
A['feedback/retry']=[C(eq(R('feedbackFrom'),0),[N('count')]),C(and(gt(R('feedbackFrom'),0),R('exerciseCompleted')),[N('course')]),...exerciseRoute().map(a=>({...a,conditionalBlocks:a.conditionalBlocks.map(b=>({...b,condition:and(gt(R('feedbackFrom'),0),not(R('exerciseCompleted')),b.condition)}))}))];
A['header/feedback/back']=A['feedback/retry'];A['feedback/tasks']=[C(eq(R('feedbackFrom'),0),[N('count')],[N('course')])];
A['feedback/apply']=learningCatalog.lessons.map((l,i)=>C(and(R('exerciseCompleted'),R('learningFeedback'),eq(R('learnIndex'),i)),l.target==='plan'?[S('planReturn',1),N('plan-ready')]:[N(l.target)]));
enter.feedback.push(C(and(R('learningFeedback'),R('exerciseCompleted')),[S('ui/feedbackNext','К заданиям темы')]));
for(const key of ['start/new','start/demo','reset/yes'])A[key].unshift(...Object.entries(learnDefaults).map(([k,v])=>S(k,v)));
for(const [key,title,copy]of[
 ['plan-guide','План на неделю','План помогает заранее решить, сколько оставить на заботу, покупки и копилку. После подтверждения сравнивай его с тем, что получилось.'],
 ['course','Учимся по неделям','На каждой неделе в этой теме появляется новая ситуация. Выполненные задания можно повторять.'],
 ['lesson','Короткий урок','Прочитай одну мысль, затем попробуй решить задачу. Подсказка доступна по знаку вопроса.']])A['header/'+key+'/help']=[S('helpFrom',screenKeys.indexOf(key)),S('ui/glossaryOpen',false),S('ui/helpTitle',title),S('ui/help',copy),N('help')];
replaceHelp('tasks','Уроки и задания','Выбери тему. На каждой неделе доступны три новых задания по 10 ₽. Повторить пройденное можно без новой награды.');
replaceHelp('clock','Время в прототипе','Кнопки переводят игровые часы вперёд. Друг проголодается. Переход к итогам пропускает остаток недели, но не кормит питомца.');
// Final display overrides old six-task labels, including non-navigating actions.
for(const list of Object.values(A))list.push(...learningRefresh());
for(const list of Object.values(enter))list.push(...learningRefresh());
enter['plan-ready'].push(C(eq(R('planReturn'),7),[S('ui/planReturn','Вернуться к уроку')]));
// Lesson intro is available before planning; actual practice preserves the plan-before-period gate.

