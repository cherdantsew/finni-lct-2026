// Authoritative home-first route, applied after ux27. Conditional blocks stay flat.
A['week/next']=[S('onboarding',false),N('home')];
A['home/plan']=[S('planReturn',0),C(R('planSet'),[N('plan-ready')],[N('plan')])];
A['finance/plan']=[S('planReturn',1),C(R('planSet'),[N('plan-ready')],[N('plan')])];
A['home/goal']=route('savings');
A['home/feed']=[S('feedReturn',0),N('feed')];
A['inventory/feed']=[S('feedReturn',1),N('feed')];
A['home/pet']=[C(ge(R('hour'),R('fullUntil')),[S('feedReturn',0),N('feed')],[N('playing')])];
A['header/feed/back']=[C(eq(R('feedReturn'),0),[N('home')],[N('inventory')])];
A['header/food/back']=route('shop');
A['plan/calculate']=[S('calcReturn',0),N('count')];
A['food/calculate']=[S('calcReturn',1),N('count')];
A['header/count/back']=A['costs/next']=[C(eq(R('calcReturn'),0),[N('plan')],[N('food')])];
A['header/costs/back']=route('count');
A['header/goals/back']=A['goals/back']=route('savings');
for(let i=0;i<3;i++){
 A['goals/'+i]=A['goals/'+i].filter(a=>a.type!=='CONDITIONAL'||!a.conditionalBlocks.some(b=>b.actions.some(x=>x.type==='NODE'&&[screens().plan.id,screens().count.id,screens().savings.id].includes(x.destinationId))));
 A['goals/'+i].push(C(R('ok'),[S('hasGoal',true),N('savings')]));
}
const planTargets=['home','finance','item','goal-buy','deposit','tasks','clock'];
const planReturn=()=>planTargets.map((k,i)=>C(eq(R('planReturn'),i),[N(k)]));
A['header/plan/back']=planReturn();
A['plan-ready/next']=planReturn();
A['header/plan-ready/back']=route('plan');
// A saved plan is a baseline, not a second purchase or an automatic transfer.
A['plan/confirm']=[S('ok',and(not(R('planSet')),not(R('periodClosed')),gt(add(add(R('requiredPlan'),R('optionalPlan')),R('savingPlan')),0),E('LESS_THAN_OR_EQUAL',[add(add(R('requiredPlan'),R('optionalPlan')),R('savingPlan')),R('wallet')],'BOOLEAN'))),
 C(R('ok'),[S('planWallet',R('wallet')),S('prePlanDeposited',R('deposited')),S('prePlanWithdrawn',R('withdrawn')),S('planSet',true),S('onboarding',false),log('План на неделю сохранён.')]),
 C(R('planSet'),[N('plan-ready')]),
 C(not(R('planSet')),info('Проверь сумму','Распредели хотя бы часть денег. Общая сумма должна быть не больше кошелька.'))];
// Gate an operation without nesting Figma conditionals or consuming its intent.
function gate(list,allowed,redirect){return [S('gateAllowed',allowed),...list.map(a=>a.type==='CONDITIONAL'?{...a,conditionalBlocks:a.conditionalBlocks.map((b,i,bs)=>({...b,condition:and(R('gateAllowed'),b.condition||not(bs[0].condition))}))}:C(R('gateAllowed'),[a])),C(not(R('gateAllowed')),redirect)];}
A['item/buy']=gate(A['item/buy'],R('planSet'),[S('planReturn',2),N('plan')]);
A['goal-buy/yes']=gate(A['goal-buy/yes'],R('planSet'),[S('planReturn',3),N('plan')]);
A['savings/buy']=gate(A['savings/buy'],R('hasGoal'),[N('goals')]);
A['deposit/continue']=gate(A['deposit/continue'],R('planSet'),[S('planReturn',4),N('plan')]);
for(let i=0;i<6;i++)A['tasks/'+i]=gate(A['tasks/'+i],R('planSet'),[S('planReturn',5),N('plan')]);
for(const h of [4,8,12,24])A['clock/'+h]=gate(A['clock/'+h],R('planSet'),[S('planReturn',6),N('plan')]);
A['clock/finish']=gate(A['clock/finish'],R('planSet'),[S('planReturn',6),N('plan')]);
// Every new week starts at Home, with access to stock and prices before planning.
for(const a of A['nextweek/yes'])if(a.type==='CONDITIONAL')for(const b of a.conditionalBlocks)for(const x of b.actions)if(x.type==='NODE'&&x.destinationId===screens().plan.id)x.destinationId=screens().home.id;
for(const list of Object.values(enter))list.push(
 S('ui/hasFood',gt(R('food'),0)),S('ui/hasTreat',gt(R('treat'),0)),S('ui/noFood',eq(add(R('food'),R('treat')),0)),S('ui/needsPlan',not(R('planSet'))),
 S('ui/foodCount',J('В рюкзаке: ',R('food'),' пачек. Одной хватит на 12 игровых часов.')),
 S('ui/treatCount',J('В рюкзаке: ',R('treat'),' шт. Хватает на 8 игровых часов. Чередуй с обычным кормом.')),
 S('ui/petRequest','Поиграй со мной'),C(ge(R('hour'),R('fullUntil')),[S('ui/petRequest','Хочу кушать')]),
 S('ui/itemAction','Купить'),C(not(R('planSet')),[S('ui/itemAction','Сначала составим план')]),
 S('ui/planConfirm','Сохранить план'),C(R('planSet'),[S('ui/planConfirm','Посмотреть план')]),
 S('ui/homeGoalAction','Выбрать свою цель'),C(R('hasGoal'),[S('ui/homeGoalAction',J(R('goalTitle'),' · ',R('goalPrice'),' ₽'))]),
 ...['Домой','К финансам','Вернуться к покупке','Вернуться к покупке','В копилку','К заданиям','Продолжить'].map((s,i)=>C(eq(R('planReturn'),i),[S('ui/planReturn',s)])),
 C(not(R('hasGoal')),[S('homeGoal','На что хочешь накопить?'),S('ui/goal','Выбери в лавке вещь, на которую хочется накопить. Деньги для неё можно откладывать в копилку.')])
);
enter.home.push(
 C(not(R('planSet')),[S('ui/today','Посмотри цены в лавке и составь план: так хватит на заботу и свои покупки.')]),
 C(ge(R('hour'),R('fullUntil')),[S('ui/today','Нажми на питомца и выбери еду в рюкзаке.')]),
 C(ge(R('hour'),168),[S('ui/today','Неделя закончилась. Посмотри итоги в финансах.')])
);
A['header/home/help']=[S('helpFrom',screenKeys.indexOf('home')),S('ui/help','Нажми на питомца, чтобы покормить или поиграть. В лавке можно посмотреть товары. План на неделю поможет оставить деньги на заботу и свои желания.'),N('help')];
A['header/week/help']=[S('helpFrom',screenKeys.indexOf('week')),S('ui/help','Сначала осмотрись дома. Открой лавку и сравни цены. Перед первой покупкой составь план на неделю.'),N('help')];
A['header/plan-ready/help']=[S('helpFrom',screenKeys.indexOf('plan-ready')),S('ui/help','План подсказывает, сколько оставить на каждое направление. Возвращайся к нему в финансах, чтобы сравнивать с покупками и копилкой.'),N('help')];
enter.plan.push(C(R('planSet'),[S('ui/planFunds',J('Планировали: ',R('planWallet'),' ₽'))]));
function backpackCopy(x){if(typeof x==='string')return x.replace(/«Моих вещах»/g,'рюкзаке').replace(/«Мои вещи»|Мои вещи|мои вещи/g,'рюкзак').replace(/твоих вещах|своих вещах/g,'рюкзаке').replace(/своём инвентаре/g,'рюкзаке');if(Array.isArray(x))return x.map(backpackCopy);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,backpackCopy(v)]));return x;}
for(const k of Object.keys(A))A[k]=backpackCopy(A[k]);for(const k of Object.keys(enter))enter[k]=backpackCopy(enter[k]);

