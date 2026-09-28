// Apply after the base AST, before wiring. No nested conditionals.
A['start/new']=refreshed([...reset(),S('journey',1)],'profile');
A['intro/next']=route('week'); A['week/next']=route('count');
A['costs/next']=route('goals'); A['plan-ready/next']=route('food');
for(const n of [7,14,21])A['count/choose/'+n]=[S('answer',n),S('feedbackFrom',0),C(eq(R('answer'),14),[N('costs')],info('Посчитаем ещё раз','На каждый из семи дней нужны две пачки. Сложи 7 + 7 и выбери ответ.','feedback'))];
A['count/check']=[S('feedbackFrom',0),C(eq(R('answer'),14),[N('costs')],info('Посчитаем ещё раз','На каждый из семи дней нужны две пачки. Сложи 7 + 7 и выбери ответ.','feedback'))];
A['count/hint']=[S('feedbackFrom',0),...info('Семь дней — две порции','Представь два ряда: семь пачек на утро и семь на вечер. Сколько всего?','feedback')];
for(let i=0;i<3;i++)for(const a of A['goals/'+i])if(a.type==='CONDITIONAL')for(const b of a.conditionalBlocks)for(const x of b.actions)if(x.type==='NODE'&&x.destinationId===screens().count.id)x.destinationId=screens().plan.id;
const confirmed=A['plan/confirm'][2].conditionalBlocks[0].actions;
confirmed.splice(confirmed.length-1,1,S('journey',2),N('plan-ready'));
const back={profile:'start',pet:'profile',intro:'pet',week:'intro',count:'week',costs:'count',plan:'finance','plan-ready':'plan',food:'shop',item:'shop',result:'home',feed:'inventory',savings:'finance',deposit:'savings',withdraw:'savings','withdraw-confirm':'withdraw',goals:'savings','goal-buy':'savings','goal-cancelled':'savings',tasks:'home',exercise:'tasks',feedback:'tasks',help:'home',clock:'home',summary:'finance',nextweek:'summary',growth:'home',history:'finance',rescue:'feed',playing:'home',settings:'help',reset:'settings',notification:'settings','practice-plan':'tasks','practice-shop':'tasks'};
for(const[k,d]of Object.entries(back))A['header/'+k+'/back']=route(d);
A['header/goals/back']=[C(R('onboarding'),[N('costs')],[N('savings')])];
A['header/plan/back']=[C(R('onboarding'),[N('goals')],[N('finance')])];
A['header/food/back']=[C(eq(R('journey'),2),[N('plan-ready')],[N('shop')])];
A['header/item/back']=A['item/cancel']=[C(eq(R('selection'),0),[N('food')],[N('shop')])];
A['header/goal-buy/back']=A['goal-buy/no'];
A['header/goal-cancelled/back']=A['goal-cancelled/keep'];
const helpCopy={
 start:'Здесь ты научишься планировать деньги на заботу о питомце, покупки и свою цель. Нажми «Начать».',
 profile:'Выбери имя, которым к тебе будет обращаться Финни.',pet:'Выбери питомца, наряд и имя. Вы будете заботиться друг о друге.',
 intro:'Питомцу нужны две пачки корма в день и один набор ухода на неделю.',
 week:'На семь дней ты получаешь 100 игровых рублей. Реши, сколько оставить на заботу, покупки и копилку.',
 count:'Утром нужна одна пачка, вечером — ещё одна. Посчитай запас на семь дней.',
 costs:'Сравни цену одинакового количества: 14 отдельных пачек и один набор из 14.',
 goals:'Выбери вещь, ради которой хочется откладывать деньги. Её цена поможет понять, сколько нужно накопить.',
 plan:'План помогает рассчитать неделю. Корм и уход — обязательные расходы. Покупки для удовольствия — необязательные. Часть денег можно отложить.',
 'plan-ready':'План готов. Теперь выбери корм и купи запас в лавке.',
 home:'Питомец и подсказка под ним показывают, что сделать дальше. Деньги — в «Финансах», покупки — в «Моих вещах».',
 shop:'Сравни цены и выбери покупку, которая подходит твоему плану.',food:'Одна пачка — одно кормление. В наборе пачка дешевле, но за весь набор нужно заплатить сразу.',
 item:'Посмотри цену и остаток денег. Если покупка подходит, нажми «Купить».',
 inventory:'Здесь лежат твои покупки. Выбери корм, набор ухода или игрушку, чтобы использовать их.',
 feed:'Выбери еду из запаса. Обычный корм насыщает на 12 игровых часов, лакомство — на 8.',
 finance:'Сравни, сколько ты планировал потратить и отложить, с тем, что получилось. Это поможет решить, что покупать дальше.',
 savings:'Откладывай деньги на выбранную вещь. Когда суммы хватит, её можно купить.',
 deposit:'Выбери сумму для копилки. В кошельке должны остаться деньги на ближайшие покупки.',
 withdraw:'Из копилки можно взять деньги на покупки. Подумай, как это повлияет на твою цель.',
 tasks:'Задания помогают разобраться в деньгах. Дела с наградой приносят 10 ₽ в кошелёк.',
 summary:'Сравни план с результатом и выбери, что учтёшь на следующей неделе.',
};
const screenKeys=Object.keys(screens());
for(const[k,i]of screenKeys.map((k,i)=>[k,i]))A['header/'+k+'/help']=[S('helpFrom',i),S('ui/help',helpCopy[k]||'Посмотри, что изменится после твоего решения. Если сомневаешься, вернись к предыдущему шагу.'),N('help')];
A['help/return']=screenKeys.filter(k=>k!=='help').map(k=>C(eq(R('helpFrom'),screenKeys.indexOf(k)),[N(k)]));A['header/help/back']=A['help/return'];
A['help/settings']=route('settings');A['header/settings/back']=route('help');
for(let i=0;i<6;i++)A['tasks/'+i].unshift(S('feedbackFrom',[1,2,3,1,2,1][i]));
A['feedback/retry']=[C(eq(R('feedbackFrom'),0),[N('count')]),C(eq(R('feedbackFrom'),1),[N('exercise')]),C(eq(R('feedbackFrom'),2),[N('practice-shop')]),C(eq(R('feedbackFrom'),3),[N('practice-plan')])];A['header/feedback/back']=A['feedback/retry'];
A['feedback/tasks']=[C(eq(R('feedbackFrom'),0),[N('count')],[N('tasks')])];
for(const key of ['item/buy','goal-buy/yes','rescue/yes'])A[key].unshift(S('resultNext',1));
for(const key of ['feed/food','feed/treat','inventory/care','playing/pet','playing/ball','playing/kite','playing/tent'])A[key].unshift(S('resultNext',0));
for(const key of ['deposit/continue','withdraw-confirm/yes','goal-cancelled/return'])A[key].unshift(S('resultNext',2));
A['result/next']=[C(eq(R('resultNext'),0),[N('home')]),C(eq(R('resultNext'),1),[N('inventory')]),C(eq(R('resultNext'),2),[N('savings')])];A['header/result/back']=A['result/next'];
A['feedback/retry']=[C(eq(R('feedbackFrom'),0),[N('count')]),C(and(gt(R('feedbackFrom'),0),R('exerciseCompleted')),[N('tasks')]),...A['feedback/retry'].slice(1).map(a=>({...a,conditionalBlocks:a.conditionalBlocks.map(b=>({...b,condition:and(b.condition,not(R('exerciseCompleted')))}))}))];A['header/feedback/back']=A['feedback/retry'];
const nextLabels=['Проверить план','Купить корм','Покормить','Купить набор ухода','Позаботиться','Пополнить копилку','Дела с наградой','Поиграть','Посмотреть итоги'];
const nextRoutes=['plan','food','feed','shop','inventory','deposit','tasks','playing','summary'];
A['home/next']=nextRoutes.map((k,i)=>C(eq(R('nextStep'),i),i===5?[S('amount',0),N(k)]:[N(k)]));
for(const list of Object.values(enter))list.push(
 S('ui/planSummary',J('Еда и уход: ',R('requiredPlan'),' ₽\nПокупки: ',R('optionalPlan'),' ₽\nВ копилку: ',R('savingPlan'),' ₽')),
 S('ui/resultNext','Домой'),C(eq(R('resultNext'),1),[S('ui/resultNext','Открыть мои вещи')]),C(eq(R('resultNext'),2),[S('ui/resultNext','Посмотреть копилку')]),
 S('nextStep',7),S('ui/today','Питомец сыт. Можно поиграть вместе.'),
 ...Array.from({length:6},(_,i)=>C(and(R('offer'+i),not(R('paid'+i))),[S('nextStep',6),S('ui/today','Есть дело с наградой 10 ₽. Это ещё один шаг к твоей цели.')])),
 C(and(gt(R('savingPlan'),sub(R('deposited'),R('withdrawn'))),gt(R('wallet'),0)),[S('nextStep',5),S('ui/today','Ты планировал отложить деньги. Посмотри, сколько ещё нужно добавить в копилку.')]),
 C(not(R('careUsed')),[S('nextStep',3),S('ui/today','На этой неделе питомцу нужен уход. Набор стоит 14 ₽.')]),
 C(and(not(R('careUsed')),gt(R('care'),0)),[S('nextStep',4),S('ui/today','Набор ухода уже есть в твоих вещах. Позаботься о питомце.')]),
 C(ge(R('hour'),R('fullUntil')),[S('nextStep',2),S('ui/today','Питомец проголодался. Выбери еду из своего запаса.')]),
 C(and(ge(R('hour'),R('fullUntil')),eq(add(R('food'),R('treat')),0)),[S('nextStep',1),S('ui/today','Корм закончился. Пора пополнить запас в лавке.')]),
 C(not(R('planSet')),[S('nextStep',0),S('ui/today','Новая неделя: посмотри на запас и составь план трат.')]),
 C(ge(R('hour'),168),[S('nextStep',8),S('ui/today','Неделя закончилась. Посмотри, что получилось с твоим планом.')]),
 ...nextLabels.map((s,i)=>C(eq(R('nextStep'),i),[S('ui/nextAction',s)]))
);
// Rewrite only string literals, preserving all arithmetic and guards.
const copyMap={
 'План сохранён. Деньги не списаны.':'План на неделю сохранён.',
 'Сначала составь план на неделю. Монеты останутся в кошельке.':'План поможет рассчитать расходы до следующей выдачи денег.',
 'План сохранён · к финансам':'Посмотреть мои финансы',
 'Общая сумма денег не изменилась. Теперь часть хранится в копилке.':'Ты стал ближе к своей цели. Посмотри, сколько уже отложено.',
 'Перевод завершён. Это твои прежние деньги, не новый заработок.':'Деньги в кошельке. Теперь их можно потратить на покупку.',
 'Сравни условие со своим решением. Монеты не списаны. Можно вернуться к выбору или открыть подсказку.':'Посмотри на числа в условии ещё раз. Если нужна помощь, открой подсказку.',
 '\nТы воспользовался подсказкой. Это выполнение с помощью.':'',
 'Можно покормить друга. Потраченные раньше монеты не вернулись, финансового достижения за помощь нет.':'Пачка уже в твоих вещах. Теперь можно покормить питомца.',
 'Питомец ухожен. Из запаса использован один набор, монеты не списаны.':'Ты использовал набор ухода. Питомец чистый и довольный!',
 'Проверь кошелёк: монет должно хватить. Постоянную вещь покупают один раз. Перед покупками составь план. Деньги и вещи не изменились.':'Для покупки нужен план и достаточная сумма в кошельке. А уже купленную игрушку ищи в «Моих вещах».',
};
function clean(v){if(typeof v==='string'){let s=Object.hasOwn(copyMap,v)?copyMap[v]:v;s=s.replace(/монет(?:ы|а)?/g,'₽').replace(/Монеты/g,'Деньги').replace(/ Деньги не списаны\./g,'').replace(/ без повторной оплаты/g,'').replace(/ Повторной оплаты нет\./g,'');return s.replace(/оставшиеся ₽/g,'оставшиеся деньги').replace(/твои ₽/g,'твои деньги').replace(/свои ₽/g,'свои деньги').replace(/Если ₽ мало/g,'Если денег мало').replace(/Нужна положительная сумма не больше денег в кошельке. Ничего не изменилось./g,'Выбери сумму от 5 ₽, которая есть в кошельке.');}if(Array.isArray(v))return v.map(clean);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,clean(x)]));return v;}
for(const k of Object.keys(A))A[k]=clean(A[k]);for(const k of Object.keys(enter))enter[k]=clean(enter[k]);
enter.plan.push(S('ui/planFunds',J('На неделю: ',R('wallet'),' ₽')));

