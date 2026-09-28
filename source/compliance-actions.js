// Targeted TZ corrections. Applied after paper-v3-final-actions; no layout rebuild.
const complianceDefaults={
 adultAuthorized:false,adultFromHelp:false,adultHelpFrom:0,adultHelpText:'',
 paidCareHours:0,mealCoverage:0,reviewPlan:0,reviewActual:0,reviewExpected:0,
 reviewCorrect:false,reviewTopic:'Еда и забота',reviewDifference:0,currentGoalRemaining:60,reviewStamp:'',
 'ui/reviewQuestion':'Сравни еду и заботу с планом.',
 'ui/reviewLess':'Меньше плана','ui/reviewEqual':'Столько же','ui/reviewMore':'Больше плана',
 'ui/lastWeek':'Завершённых недель пока нет.',lastClosedWeek:0,
 'ui/glossaryOpen':false,'ui/resultState':'','ui/feedbackResult':'',
 budgetWeeks:0,weekCareMet:false,weekBudgetMet:false,weekSavingMet:false,
 'ui/careCredit':'','ui/budgetCredit':'','ui/savingCredit':'','ui/weekGrowth':'',
 'ui/lastGrowth':'После итогов недели здесь появятся твои достижения.',
 'ui/lastGrowthTitle':'Итоги недели','ui/hasPastGrowth':false,
 growthTarget:2,careLeft:2,budgetLeft:2,savingLeft:2,
 'ui/growthTitle':'Чтобы друг подрос','ui/careLeft':'','ui/budgetLeft':'','ui/savingLeft':'',
};
for(const[k,v]of Object.entries(complianceDefaults)){defaults[k]=v;vars[k]={id:k,resolvedType:typeof v==='number'?'FLOAT':typeof v==='boolean'?'BOOLEAN':'STRING'};}
for(const key of ['start/new','start/demo','reset/yes'])A[key].unshift(...Object.entries(complianceDefaults).map(([k,v])=>S(k,v)));

// Evaluate execution, not the child's ability to choose a comparison sign.
// Lower expenses are legitimate savings; confirmed category limits stay fixed.
function growthEvaluation(){return [
 S('weekCareMet',and(ge(R('paidCareHours'),144),R('careUsed'),lt(R('treatStreak'),3))),
 S('weekBudgetMet',and(R('planSet'),not(gt(R('requiredActual'),R('requiredPlan'))),not(gt(R('optionalActual'),R('optionalPlan'))),ge(sub(R('deposited'),R('withdrawn')),R('savingPlan')))),
 S('weekSavingMet',gt(sub(R('deposited'),R('withdrawn')),0)),
 S('ui/careCredit','Для роста корми друга едой из лавки хотя бы шесть дней в неделю.'),
 C(ge(R('paidCareHours'),144),[S('ui/careCredit','Друг был сыт, но его ещё нужно помыть.')]),
 C(ge(R('treatStreak'),3),[S('ui/careCredit','Три лакомства подряд — многовато. В следующий раз дай обычный корм.')]),
 C(R('weekCareMet'),[S('ui/careCredit','✓ Друг был сыт и ухожен.')]),
 S('ui/budgetCredit','Плана на эту неделю пока нет.'),
 C(R('planSet'),[S('ui/budgetCredit',J('В копилку отложено меньше, чем в плане: не хватает ',sub(R('savingPlan'),sub(R('deposited'),R('withdrawn'))),' ₽.'))]),
 C(gt(R('optionalActual'),R('optionalPlan')),[S('ui/budgetCredit',J('На покупки для себя: ',R('optionalActual'),' ₽ вместо ',R('optionalPlan'),' ₽ по плану.'))]),
 C(gt(R('requiredActual'),R('requiredPlan')),[S('ui/budgetCredit',J('На еду и заботу: ',R('requiredActual'),' ₽ вместо ',R('requiredPlan'),' ₽ по плану.'))]),
 C(R('weekBudgetMet'),[S('ui/budgetCredit','✓ Покупки и копилка — по плану.')]),
 S('ui/savingCredit','В копилке не прибавилось денег.'),
 C(R('weekSavingMet'),[S('ui/savingCredit',J('✓ В копилке стало на ',sub(R('deposited'),R('withdrawn')),' ₽ больше.'))]),
 S('ui/weekGrowth',J(R('ui/careCredit'),'\n\n',R('ui/budgetCredit'),'\n\n',R('ui/savingCredit'))),
 ];}

// G01/G05/G06/G07/G10: one final display pass, after earlier presentation rules.
function complianceRefresh(){return [
 ...growthEvaluation(),
 S('ui/itemCategory','Необязательные расходы'),C(or(eq(R('selection'),0),eq(R('selection'),2)),[S('ui/itemCategory','Обязательные расходы')]),
 C(eq(R('selection'),0),[S('ui/itemDetail',J('Пачек: ',R('quantity'),'. Одна пачка — одно кормление и 12 игровых часов сытости.'))]),
 C(eq(R('selection'),1),[S('ui/itemDetail','Одна рыбка — 8 игровых часов сытости. После трёх лакомств подряд друг просит обычный корм.')]),
 C(eq(R('selection'),2),[S('ui/itemDetail','Одна порция шампуня для мытья. Помой друга из рюкзака; такого ухода хватает на неделю.')]),
 S('currentGoalRemaining',sub(R('goalPrice'),R('savings'))),C(lt(R('currentGoalRemaining'),0),[S('currentGoalRemaining',0)]),
 C(R('hasGoal'),[S('ui/goalNote',J('Цена ',R('goalPrice'),' ₽ · в копилке ',R('savings'),' ₽\nОсталось ',R('currentGoalRemaining'),' ₽'))]),
 ...['ball','kite','tent'].map((k,i)=>C(and(R('hasGoal'),eq(R('goal'),i),R(k)),[S('ui/goalNote','Куплено · уже в рюкзаке')])),
 C(not(R('planSet')),[S('ui/compareRequired','План ещё не составлен'),S('ui/compareOptional','План ещё не составлен'),S('ui/compareSaving','План ещё не составлен')]),
 // The result itself describes the changed state (purchase, feeding, care, transfer).
 // Unchanged hunger/care labels belong on Home, not on every success screen.
 S('ui/resultState',J(R('result'),'\n\nКошелёк: ',R('wallet'),' ₽ · копилка: ',R('savings'),' ₽')),
 S('ui/feedbackResult',R('result')),C(R('exerciseCompleted'),[S('ui/feedbackResult',J(R('result'),'\n\nКошелёк: ',R('wallet'),' ₽ · копилка: ',R('savings'),' ₽'))]),
 S('growthTarget',2),C(ge(R('stage'),2),[S('growthTarget',4)]),
 ...[['care','careWeeks','Корми и мой друга'],['budget','budgetWeeks','Покупай по плану'],['saving','savingWeeks','Пополняй копилку']].flatMap(([key,counter,label])=>[
  S(key+'Left',sub(R('growthTarget'),R(counter))),C(lt(R(key+'Left'),0),[S(key+'Left',0)]),
  S('ui/'+key+'Left',J(label,' — ещё ',R(key+'Left'),' недели.')),
  C(eq(R(key+'Left'),1),[S('ui/'+key+'Left',label+' — ещё 1 неделя.')]),
  C(eq(R(key+'Left'),0),[S('ui/'+key+'Left','✓ '+label+' — готово!')]),
 ]),
 S('ui/growthTitle','Чтобы друг подрос'),
 S('ui/stages',J(R('ui/careLeft'),'\n\n',R('ui/budgetLeft'),'\n\n',R('ui/savingLeft'))),
 C(ge(R('stage'),3),[S('ui/growthTitle','Ты помог другу вырасти!'),S('ui/stages','Ты заботился о друге, покупал по плану и пополнял копилку. Продолжай — впереди новые цели.')]),
 S('ui/hasPastGrowth',gt(R('lastClosedWeek'),0)),
 ];}

// G02: one gate, including the help entry. Cancel preserves the help context.
A['home/adults']=[S('adultAuthorized',false),S('adultFromHelp',false),S('ui/adultGate',true)];
A['help/settings']=[S('adultAuthorized',false),S('adultFromHelp',true),S('adultHelpFrom',R('helpFrom')),S('adultHelpText',R('ui/help')),S('ui/adultGate',true),N('home')];
A['adult/56']=[C(R('ui/adultGate'),[S('ui/adultGate',false),S('adultAuthorized',true),N('settings')])];
for(const n of [48,64])A['adult/'+n]=[S('ui/adultGate',true),S('adultAuthorized',false)];
A['adult/cancel']=[S('ui/adultGate',false),S('adultAuthorized',false),C(R('adultFromHelp'),[S('helpFrom',R('adultHelpFrom')),S('ui/help',R('adultHelpText')),N('help')])];
A['header/settings/back']=[S('adultAuthorized',false),C(R('adultFromHelp'),[S('helpFrom',R('adultHelpFrom')),S('ui/help',R('adultHelpText')),N('help')],[N('home')])];
A['settings/home']=[S('adultAuthorized',false),N('home')];
for(const key of ['settings','reset'])enter[key].push(C(not(R('adultAuthorized')),[S('adultFromHelp',false),S('ui/adultGate',true),N('home')]));

// G08: reference on demand, not another onboarding requirement.
A['help/glossary']=[S('ui/glossaryOpen',not(R('ui/glossaryOpen')))];
for(const key of Object.keys(A).filter(k=>k.startsWith('header/')&&k.endsWith('/help')))A[key].unshift(S('ui/glossaryOpen',false));

// G03: non-overlapping paid meal coverage inside the seven-day interval.
for(const [kind,hours]of [['food',12],['treat',8]]){
 const list=A['feed/'+kind],idx=list.findIndex(a=>a.type==='SET_VARIABLE'&&a.variableId==='usingAid');
 if(idx<0)throw Error('Missing meal provenance');
 list.splice(idx+1,0,S('mealCoverage',hours),C(gt(add(R('hour'),hours),168),[S('mealCoverage',sub(168,R('hour')))]),C(lt(R('mealCoverage'),0),[S('mealCoverage',0)]),C(and(R('ok'),not(R('usingAid'))),[S('paidCareHours',add(R('paidCareHours'),R('mealCoverage')))]));
}
function prepareReview(){return [
 S('reviewTopic','Еда и забота'),S('reviewPlan',R('requiredPlan')),S('reviewActual',R('requiredActual')),
 C(E('NOT_EQUAL',[R('optionalActual'),R('optionalPlan')],'BOOLEAN'),[S('reviewTopic','Покупки для себя'),S('reviewPlan',R('optionalPlan')),S('reviewActual',R('optionalActual'))]),
 C(lt(sub(R('deposited'),R('withdrawn')),R('savingPlan')),[S('reviewTopic','В копилку'),S('reviewPlan',R('savingPlan')),S('reviewActual',sub(R('deposited'),R('withdrawn')))]),
 S('reviewExpected',0),C(lt(R('reviewActual'),R('reviewPlan')),[S('reviewExpected',-1)]),C(gt(R('reviewActual'),R('reviewPlan')),[S('reviewExpected',1)]),
 S('reviewDifference',sub(R('reviewActual'),R('reviewPlan'))),C(lt(R('reviewDifference'),0),[S('reviewDifference',sub(0,R('reviewDifference')))]),
 S('ui/reviewQuestion',J(R('reviewTopic'),': факт больше, меньше или равен плану?')),
 C(not(R('planSet')),[S('ui/reviewQuestion','Сначала составь план на эту неделю.')]),
 ];}
enter.summary.push(...prepareReview());
const reviewStamp=()=>J(R('week'),'/',R('requiredPlan'),'/',R('optionalPlan'),'/',R('savingPlan'),'/',R('requiredActual'),'/',R('optionalActual'),'/',R('deposited'),'/',R('withdrawn'));
for(const [key,answer,word]of [['stock',-1,'меньше плана'],['save',0,'равен плану'],['plan',1,'больше плана']]){
 A['summary/'+key]=[...prepareReview(),S('reviewCorrect',and(R('planSet'),eq(R('reviewExpected'),answer))),
 C(R('reviewCorrect'),[S('reviewStamp',reviewStamp()),S('reflectionChoice',J(R('reviewTopic'),': план ',R('reviewPlan'),' ₽, факт ',R('reviewActual'),' ₽ — ',word,'.')),N('nextweek')]),
 C(and(R('planSet'),not(R('reviewCorrect'))),[S('resultNext',3),S('resultTitle','Посмотрим на числа'),S('result',J(R('reviewTopic'),': план ',R('reviewPlan'),' ₽, факт ',R('reviewActual'),' ₽. Разница — ',R('reviewDifference'),' ₽. Сравни числа ещё раз.')),N('result')]),
 C(not(R('planSet')),[S('planReturn',1),N('plan')])];
}
A['result/next'].push(C(eq(R('resultNext'),3),[N('summary')]));A['header/result/back']=A['result/next'];
enter.result.push(C(eq(R('resultNext'),3),[S('ui/resultNext','Вернуться к сравнению')]));

// G04: snapshot before clearing the period; new operations cannot rewrite it.
const closeWeek=[
 ...growthEvaluation(),
 S('ok',and(not(R('periodClosed')),R('planSet'),R('reviewCorrect'),eq(R('reviewStamp'),reviewStamp()),E('NOT_EQUAL',[R('reflectionChoice'),''],'BOOLEAN'))),
 C(R('ok'),[S('periodClosed',true),S('reflectionWeeks',add(R('reflectionWeeks'),1)),
 S('lastClosedWeek',R('week')),S('ui/lastWeek',J('Неделя ',R('week'),'\n\nЕда и забота\nПлан ',R('requiredPlan'),' ₽ · факт ',R('requiredActual'),' ₽\nПокупки для себя\nПлан ',R('optionalPlan'),' ₽ · факт ',R('optionalActual'),' ₽\nВ копилку\nПлан ',R('savingPlan'),' ₽ · факт ',sub(R('deposited'),R('withdrawn')),' ₽\n\nДоход: ',add(100,R('earned')),' ₽ (карманные 100 ₽ + задания ',R('earned'),' ₽)\nВ копилку: ',R('deposited'),' ₽ · из копилки: ',R('withdrawn'),' ₽\nОсталось: кошелёк ',R('wallet'),' ₽ · копилка ',R('savings'),' ₽\n\n',R('reflectionChoice'))),
 S('ui/lastGrowthTitle',J('Итоги недели ',R('week'))),S('ui/lastGrowth',R('ui/weekGrowth')),
 S('ui/lastWeek',J(R('ui/lastWeek'),'\n\n',R('ui/weekGrowth'))),
 S('weekHistory',J(R('weekHistory'),'\n\n',R('ui/lastWeek')))]),
 C(and(R('ok'),R('weekCareMet')),[S('careWeeks',add(R('careWeeks'),1))]),
 C(and(R('ok'),R('weekBudgetMet')),[S('budgetWeeks',add(R('budgetWeeks'),1))]),
 C(and(R('ok'),R('weekSavingMet')),[S('savingWeeks',add(R('savingWeeks'),1))]),
 C(and(ge(R('careWeeks'),2),ge(R('budgetWeeks'),2),ge(R('savingWeeks'),2)),[S('stage',2)]),
 C(and(ge(R('careWeeks'),4),ge(R('budgetWeeks'),4),ge(R('savingWeeks'),4)),[S('stage',3)]),
 S('actionDone',and(R('ok'),lt(R('week'),5)))
];
const previousReset=A['nextweek/yes'].find(a=>a.type==='CONDITIONAL'&&a.conditionalBlocks[0].actions.some(x=>x.type==='SET_VARIABLE'&&x.variableId==='week')).conditionalBlocks[0].actions;
const resetWeek=[...previousReset,S('paidCareHours',0),S('reviewCorrect',false)];
A['nextweek/yes']=[...closeWeek,C(R('actionDone'),resetWeek),C(R('actionDone'),[N('home')]),
 C(and(not(R('actionDone')),eq(R('week'),5)),[S('resultNext',0),...info('Пять недель позади','Итог последней недели сохранён в истории. Покупки и копилка остались с тобой.')]),
 C(and(not(R('actionDone')),lt(R('week'),5)),[N('summary')])];

for(const key of Object.keys(A)){
 const list=A[key];const at=list.findIndex(a=>a.type==='NODE');
 if(at<0)list.push(...complianceRefresh());else list.splice(at,0,...complianceRefresh());
}
for(const key of Object.keys(enter))enter[key].push(...complianceRefresh());
// The generic result refresh never overwrites contextual continuation wording.
enter.result.push(C(eq(R('resultNext'),3),[S('ui/resultNext','Вернуться к сравнению')]));
A['help/glossary']=[S('ui/glossaryOpen',not(R('ui/glossaryOpen')))];
for(const action of A['header/summary/help'])if(action.type==='SET_VARIABLE'&&action.variableId==='ui/help')action.variableValue=L('План — что собирался потратить и отложить. Факт — что получилось. Сравни числа в указанной строке: больше, меньше или столько же.');

