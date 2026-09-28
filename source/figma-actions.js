// Declarative Figma reactions. All conditionals are top-level: the runtime forbids nested ones.
const A={};const route=k=>[N(k)];
const log=value=>S('history',J(R('history'),'\n',value));
const info=(title,body,target='result')=>[S('resultTitle',title),S('result',body),N(target)];
function refresh(){const a=[
  ...Array.from({length:6},(_,i)=>S('offer'+i,and(not(R('periodClosed')),i<3?not(E('OR',[eq(R('week'),2),eq(R('week'),4)],'BOOLEAN')):E('OR',[eq(R('week'),2),eq(R('week'),4)],'BOOLEAN'),ge(R('hour'),(i%3)*48)))),
  S('ui/wallet',J(R('wallet'),' монет')),S('ui/savings',J(R('savings'),' монет')),
  S('homeWallet',J('Кошелёк\n',R('wallet'),' монет')),S('homeSavings',J('Копилка\n',R('savings'),' монет')),
  S('ui/money',J('Кошелёк: ',R('wallet'),' монет\nКопилка: ',R('savings'),' монет\nВсего: ',add(R('wallet'),R('savings')),' монет')),
  S('ui/stock',J('Корм: ',R('food'),' пачек\nЛакомства: ',R('treat'),' шт.\nНаборы ухода: ',R('care'))),
  S('ui/amount',J(R('amount'),' монет')),S('ui/answer',J('',R('answer'))),
  S('ui/time',J('Неделя ',R('week'),' · прошло ',R('hour'),' игровых часов')),
  S('ui/plan',J('Распределено: ',add(add(R('requiredPlan'),R('optionalPlan')),R('savingPlan')),' из ',R('wallet'),' монет')),
  S('ui/fact',J('Еда и уход: план ',R('requiredPlan'),' → потрачено ',R('requiredActual'),'\nНеобязательные: план ',R('optionalPlan'),' → потрачено ',R('optionalActual'),'\nВ копилку после плана: план ',R('savingPlan'),' → переведено ',sub(R('deposited'),R('prePlanDeposited')),'\nИз копилки после плана взято: ',sub(R('withdrawn'),R('prePlanWithdrawn')),'\nДополнительный доход за неделю: ',R('earned'))),
  S('ui/forecast',J('Копилка после составления плана: план +',R('savingPlan'),', фактически ',sub(sub(R('deposited'),R('prePlanDeposited')),sub(R('withdrawn'),R('prePlanWithdrawn'))),' монет.')),
  S('ui/goal',J(R('goalTitle'),' · ',R('goalPrice'),' монет\nВ копилке: ',R('savings'),'\nОсталось: ',sub(R('goalPrice'),R('savings')))),
  C(ge(R('savings'),R('goalPrice')),[S('ui/goal',J(R('goalTitle'),'\nДенег в копилке достаточно. Вещь пока не куплена.'))]),
  S('homeGoal',J('Цель: ',R('goalTitle'),' · ',R('goalPrice'),'\nВ копилке ',R('savings'),' · осталось ',sub(R('goalPrice'),R('savings')))),
  C(ge(R('savings'),R('goalPrice')),[S('homeGoal',J(R('goalTitle'),' · ',R('goalPrice'),'\nНакоплено! Вещь ещё не куплена.'))]),
  S('ui/meal',J('Прошло: ',R('hour'),' ч.\nСытость до: ',R('fullUntil'),' ч.\nЛакомств подряд: ',R('treatStreak'))),
  S('ui/ownership','Постоянных вещей пока нет.'),S('selectedOwned',false),
  S('ui/item',J(R('itemTitle'),'\nЦена: ',R('price'),' монет\nВ запас добавится: ',R('quantity'))),
  S('ui/confirm',J('Кошелёк сейчас: ',R('wallet'),'\nЦена: ',R('price'),'\nОстанется: ',sub(R('wallet'),R('price')))),
  C(lt(R('wallet'),R('price')),[S('ui/confirm',J('Кошелёк: ',R('wallet'),'\nЦена: ',R('price'),'\nНе хватает: ',sub(R('price'),R('wallet')),' монет.'))]),
  S('ui/purchaseConfirmation',R('ui/confirm')),
  S('ui/planButton','Составить план'),S('ui/planConfirm','Сохранить мой план'),
  C(R('planSet'),[S('ui/planButton','Посмотреть мой план'),S('ui/planConfirm','План сохранён · к финансам'),S('ui/plan',J('В плане: ',add(add(R('requiredPlan'),R('optionalPlan')),R('savingPlan')),' монет. При составлении в кошельке было ',R('planWallet'),'.'))]),
  C(and(R('planSet'),gt(add(R('prePlanDeposited'),R('prePlanWithdrawn')),0)),[S('ui/fact',J(R('ui/fact'),'\nДо плана: в копилку ',R('prePlanDeposited'),', из копилки ',R('prePlanWithdrawn'),'. Эти переводы учтены отдельно.'))]),
  S('ui/nextWeek','Монеты, копилка и вещи сохранятся. Добавятся 100 монет. План и факты новой недели начнутся отдельно.'),
  C(eq(R('week'),5),[S('ui/nextWeek','Это пятая, последняя неделя демонстрации. Сохраним итоги; новых денег больше не добавится. Можно будет посмотреть историю и свои вещи.')]),
  S('ui/totals',J('Кормлений: ',R('feedCount'),'\nВ копилку добавлено: ',R('deposited'),'\nИз копилки взято: ',R('withdrawn'),'\nОстаток кошелька: ',R('wallet'))),
  S('ui/stages',J('Недель с заботой: ',R('careWeeks'),'\nС разбором плана: ',R('reflectionWeeks'),'\nС приростом копилки: ',R('savingWeeks'),'\nСледующая стадия — после 2, затем 4 недель по каждому направлению.')),
  S('ui/growth','Малыш'),C(ge(R('stage'),2),[S('ui/growth','Исследователь')]),C(ge(R('stage'),3),[S('ui/growth','Помощник')]),
  S('appearance',add(E('MULTIPLICATION',[R('outfit'),3]),R('species'))),
  S('ui/petChoice',''),
];
for(const [k]of Object.entries(defaults).filter(([k])=>k.startsWith('planValue/')))a.push(S(k,J('',R(k.slice(10)))));
for(let i=0;i<3;i++)a.push(C(eq(R('species'),i),[S('ui/petChoice',['Лоскут','Каплик','Листолап'][i])]));
for(let i=0;i<3;i++)a.push(C(eq(R('outfit'),i),[S('ui/petChoice',J(R('ui/petChoice'),' · ',['косынка','накидка','сумка'][i]))]));
for(let i=0;i<27;i++)a.push(S('petVisible'+i,and(eq(R('appearance'),i%9),eq(R('stage'),Math.floor(i/9)+1))));
for(const [k,t,id]of[['sticker','Наклейка',3],['ribbon','Лента',4],['ball','Мяч',5],['kite','Воздушный змей',6],['tent','Палатка',7]]){
  a.push(C(and(eq(R('selection'),id),R(k)),[S('selectedOwned',true)]));
}
a.push(C(E('OR',[E('OR',[R('sticker'),R('ribbon')],'BOOLEAN'),E('OR',[R('ball'),E('OR',[R('kite'),R('tent')],'BOOLEAN')],'BOOLEAN')],'BOOLEAN'),[S('ui/ownership','Купленные вещи:')]));
for(const [k,t]of[['sticker','Наклейка'],['ribbon','Лента'],['ball','Мяч'],['kite','Воздушный змей'],['tent','Палатка']])a.push(C(R(k),[S('ui/ownership',J(R('ui/ownership'),'\n✓ ',t))]));
for(const [i,k]of['ball','kite','tent'].entries())a.push(C(and(eq(R('goal'),i),R(k)),[S('ui/goal',J(R('goalTitle'),' — куплено!\nВещь в «Моих вещах». Можно выбрать новую цель.')),S('homeGoal',J(R('goalTitle'),' — куплено!\nНайди в «Моих вещах».'))]));
a.push(C(not(R('planSet')),[S('ui/fact',J('План ещё не составлен. Сначала посмотри цены и распредели оставшиеся монеты.\nУже переведено в копилку: ',R('deposited'),'\nВзято из копилки: ',R('withdrawn'),'\nЗаработано: ',R('earned'))),S('ui/forecast','Сначала составь план на неделю. Монеты останутся в кошельке.')]),S('ui/offers',''));
for(let i=0;i<6;i++)a.push(C(R('offer'+i),[S('ui/offers',J(R('ui/offers'),['Запас на неделю','Сравни цену пачки','Собери свой план','Шаг к цели','Покупка и остаток','Разберись с планом'][i],': '))]),C(and(R('offer'+i),R('paid'+i)),[S('ui/offers',J(R('ui/offers'),'награда получена\n'))]),C(and(R('offer'+i),not(R('paid'+i))),[S('ui/offers',J(R('ui/offers'),'+10 за завершение\n'))]));
a.push(S('ui/today','На сегодня дела выполнены. Можно поиграть, проверить план или перейти к следующему дню в демо.'));
for(let i=5;i>=0;i--)a.push(C(and(R('offer'+i),not(R('paid'+i))),[S('ui/today',J('Дело с наградой +10: ',['Запас на неделю','Сравни цену пачки','Собери свой план','Шаг к цели','Покупка и остаток','Разберись с планом'][i],'. Открой «Мои дела».'))]));
a.push(C(ge(R('hour'),R('fullUntil')),[S('ui/today','Друг проголодался. Нажми «Покормить» и выбери еду из запаса.')]),C(and(ge(R('hour'),R('fullUntil')),eq(add(R('food'),R('treat')),0)),[S('ui/today','Запас еды пуст. Купи корм в лавке: он появится в «Моих вещах».')]),C(not(R('planSet')),[S('ui/today','Началась новая неделя. Посмотри, что осталось, и составь план в «Моих финансах».')]),C(R('periodClosed'),[S('ui/today','Пять недель завершены. Можно посмотреть свои вещи и историю или начать заново в настройках.')]));
a.push(S('goalRemaining',sub(R('goalPrice'),sub(R('savings'),R('amount')))),C(lt(R('goalRemaining'),0),[S('goalRemaining',0)]));
for(const [id,detail]of [[0,'Обязательные расходы.\n1 пачка — 1 кормление и 12 игровых часов сытости.'],[1,'Необязательные расходы.\n1 штука — 8 игровых часов сытости. Три лакомства подряд снижают настроение: нужен обычный корм.'],[2,'Обязательные расходы.\nОдин набор на неделю. Применение из запаса без повторной оплаты.'],[3,'Необязательные расходы.\nПостоянная вещь для твоей коллекции.'],[4,'Необязательные расходы.\nПостоянная вещь для твоей коллекции.'],[5,'Необязательные расходы.\nПостоянная игрушка. После покупки можно играть.'],[6,'Необязательные расходы.\nПостоянная игрушка. После покупки можно запускать.'],[7,'Необязательные расходы.\nПостоянная вещь. После покупки можно заглянуть внутрь.']])a.push(C(eq(R('selection'),id),[S('ui/item',J(R('itemTitle'),'\nЦена: ',R('price'),' монет\nКоличество: ',R('quantity'),'\n',detail))]));
return a;}
const refreshed=(actions,destination)=>[...actions,...refresh(),...(destination?[N(destination)]:[])];
const reset=()=>Object.entries(initial).map(([k,v])=>S(k,v));
A['start/new']=refreshed(reset(),'profile');A['start/demo']=refreshed(reset(),'intro');A['reset/yes']=refreshed(reset(),'start');A['reset/no']=route('home');
A['profile/sasha']=refreshed([S('nickname','Саша')]);A['profile/masha']=refreshed([S('nickname','Маша')]);A['profile/next']=route('pet');
for(const k of['species','outfit'])for(let i=0;i<3;i++)A['pet/'+k+'/'+i]=refreshed([S(k,i)]);
A['pet/name/fil']=[S('petName','Филя')];A['pet/name/spark']=[S('petName','Искорка')];A['pet/next']=route('intro');A['intro/next']=refreshed([S('answer',0)],'count');
A['count/minus']=refreshed([C(gt(R('answer'),0),[S('answer',sub(R('answer'),1))])]);A['count/plus']=refreshed([C(lt(R('answer'),28),[S('answer',add(R('answer'),1))])]);
A['count/check']=[C(eq(R('answer'),14),[N('plan')],[...info('Посчитаем ещё','За один день нужны 2 пачки. Сложи такой запас для 7 дней.','feedback')])];
A['count/hint']=info('Подсказка','Можно сложить семь двоек: по две пачки на каждый день. После подсказки это прохождение с помощью.','feedback');
for(const k of['requiredPlan','optionalPlan','savingPlan']){
 A['plan/'+k+'/minus']=refreshed([C(and(not(R('planSet')),gt(R(k),0)),[S(k,sub(R(k),5))])]);
 A['plan/'+k+'/plus']=refreshed([C(and(not(R('planSet')),lt(R(k),R('wallet'))),[S(k,add(R(k),5))])]);
}
A['plan/confirm']=[S('ok',and(not(R('planSet')),E('LESS_THAN_OR_EQUAL',[add(add(R('requiredPlan'),R('optionalPlan')),R('savingPlan')),R('wallet')],'BOOLEAN'))),C(R('ok'),[S('planSet',true),S('onboarding',false),log('План сохранён. Деньги не списаны.'),N('food')]),C(not(R('ok')),info('Проверь план','Сумма направлений не должна превышать кошелёк. Если план уже подтверждён, исходные числа сохраняются до следующей недели.'))];
for(const [k,to]of Object.entries({'home/feed':'feed','home/play':'playing','home/tasks':'tasks','home/finance':'finance','home/clock':'clock','shop/food':'food','item/cancel':'shop','result/inventory':'inventory','result/home':'home','inventory/feed':'feed','inventory/play':'playing','inventory/shop':'shop','feed/shop':'food','feed/rescue':'rescue','finance/savings':'savings','finance/plan':'plan','finance/history':'history','finance/summary':'summary','savings/goal':'goals','goals/back':'savings','feedback/tasks':'tasks','feedback/home':'home','help/settings':'settings','clock/home':'home','summary/back':'home','nextweek/no':'summary','growth/home':'home','history/finance':'finance','rescue/tasks':'tasks','rescue/savings':'savings','playing/home':'home','settings/notification':'notification','settings/growth':'growth','settings/reset':'reset','settings/home':'home','notification/open':'home','notification/later':'home'}))A[k]=route(to);
A['result/back']=[{type:'BACK'}];A['help/return']=[{type:'BACK'}];A['feedback/retry']=[{type:'BACK'}];
function select(id,title,price,q=1){return refreshed([S('selection',id),S('itemTitle',title),S('price',price),S('quantity',q)],'item');}
for(const[q,p]of[[1,5],[7,28],[14,56]])A['food/'+q]=select(0,'Корм · '+q+' пачек',p,q);
for(const[k,id,title,p]of[['treat',1,'Лакомство',3],['care',2,'Набор ухода на неделю',14],['sticker',3,'Наклейка',10],['ribbon',4,'Лента',15],['ball',5,'Мяч',30],['kite',6,'Воздушный змей',60],['tent',7,'Палатка',100]])A['shop/'+k]=select(id,title,p);
A['item/buy']=[S('ok',and(ge(R('wallet'),R('price')),not(R('selectedOwned')),R('planSet'))),C(R('ok'),[S('wallet',sub(R('wallet'),R('price'))),log(J('Куплено: ',R('itemTitle'),' за ',R('price'),' монет.')),S('resultTitle','Куплено'),S('result',J(R('itemTitle'),' теперь в «Моих вещах».\nВ кошельке осталось ',R('wallet'),' монет.'))]),C(and(R('ok'),E('OR',[eq(R('selection'),0),eq(R('selection'),2)],'BOOLEAN')),[S('requiredActual',add(R('requiredActual'),R('price')))]),C(and(R('ok'),not(E('OR',[eq(R('selection'),0),eq(R('selection'),2)],'BOOLEAN'))),[S('optionalActual',add(R('optionalActual'),R('price')))])];
for(const [i,k]of ['food','treat','care','sticker','ribbon','ball','kite','tent'].entries())A['item/buy'].push(C(and(R('ok'),eq(R('selection'),i)),[S(k,i<3?add(R(k),R('quantity')):true)]));
A['item/buy'].push(C(not(R('ok')),[S('resultTitle','Покупка не выполнена'),S('result','Проверь кошелёк: монет должно хватить. Постоянную вещь покупают один раз. Перед покупками составь план. Деньги и вещи не изменились.')]),...refresh(),N('result'));
function feeding(kind,ttl){return [S('ok',and(gt(R(kind),0),ge(R('hour'),R('fullUntil')))),C(R('ok'),[S(kind,sub(R(kind),1)),S('fullUntil',add(R('hour'),ttl)),S('feedCount',add(R('feedCount'),1)),S('treatStreak',kind==='food'?0:add(R('treatStreak'),1)),S('mood','Спасибо, я сыт!'),log(kind==='food'?'Использована 1 пачка корма. Деньги не списаны.':'Использовано 1 лакомство. Деньги не списаны.'),S('resultTitle','Питомец поел'),S('result',J('Из запаса использована 1 ',kind==='food'?'пачка корма':'штука лакомства','. Сытость на ',ttl,' игровых часов.'))]),C(and(R('ok'),ge(R('treatStreak'),3)),[S('mood','Хочется обычной еды'),S('result','Три лакомства подряд: сытость есть, но настроение снизилось. В следующий раз выбери обычный корм — он поможет восстановить настроение.')]),C(not(R('ok')),[S('resultTitle','Сейчас не покормили'),S('result','Проверь запас и сытость. Если питомец уже сыт, еду не расходуем. Если запас пуст, загляни в лавку.')]),...refresh(),N('result')];}
A['feed/food']=feeding('food',12);A['feed/treat']=feeding('treat',8);
A['inventory/care']=[S('ok',and(gt(R('care'),0),not(R('careUsed')))),C(R('ok'),[S('care',sub(R('care'),1)),S('careUsed',true),log('Использован набор ухода. Повторной оплаты нет.'),...info('Уход выполнен','Питомец ухожен. Из запаса использован один набор, монеты не списаны.')]),C(not(R('ok')),info('Проверь запас','Нужен набор ухода. Если на этой неделе уход уже выполнен, повторно ничего не расходуем.'))];
for(const[k,owned,text]of[['pet',null,'Друг рад общению. Погладить и играть можно бесплатно.'],['ball','ball','Мяч покатился по коврику. Можно играть снова без оплаты.'],['kite','kite','Вы запустили своего змея. Он остаётся в твоих вещах.'],['tent','tent','В палатке уютно. Покупать её повторно не нужно.']])A['playing/'+k]=owned?[C(R(owned),[S('playDone',true),...info('Поиграли вместе',text)],info('Вещи пока нет','Эту вещь можно купить в лавке. Погладить питомца можно уже сейчас, бесплатно.'))]:[S('playDone',true),...info('Поиграли вместе',text)];
A['rescue/yes']=[S('ok',and(eq(R('food'),0),eq(R('treat'),0),eq(R('wallet'),0),eq(R('savings'),0),not(R('claimUsed')))),C(R('ok'),[S('food',1),S('claimUsed',true),log('Получена 1 пачка помощи, без дохода и расхода.'),...info('Пачка помощи в запасе','Можно покормить друга. Потраченные раньше монеты не вернулись, финансового достижения за помощь нет.')]),C(not(R('ok')),info('Посмотрим, что уже есть','Проверь запасы, кошелёк и копилку. Помощь доступна, когда они пусты, один раз за игровой день.'))];
for(const k of['deposit','withdraw']){A['savings/'+k]=refreshed([S('amount',0),S('goalTransfer',0)],k);A[k+'/minus']=refreshed([C(ge(R('amount'),5),[S('amount',sub(R('amount'),5))])]);A[k+'/plus']=refreshed([C(E('LESS_THAN_OR_EQUAL',[add(R('amount'),5),R(k==='deposit'?'wallet':'savings')],'BOOLEAN'),[S('amount',add(R('amount'),5))])]);A[k+'/cancel']=route('savings');}
A['deposit/continue']=[S('ok',and(gt(R('amount'),0),ge(R('wallet'),R('amount')))),C(R('ok'),[S('wallet',sub(R('wallet'),R('amount'))),S('savings',add(R('savings'),R('amount'))),S('deposited',add(R('deposited'),R('amount'))),log(J('В копилку: ',R('amount'),' монет. Это перевод, не расход.')),S('amount',0),...info('Деньги отложены','Общая сумма денег не изменилась. Теперь часть хранится в копилке.')]),C(not(R('ok')),info('Выбери сумму','Нужна положительная сумма не больше денег в кошельке. Ничего не изменилось.'))];
const withdrawPreview=()=>[S('ui/confirm',J('Взять ',R('amount'),' монет?\nКопилка: ',R('savings'),' → ',sub(R('savings'),R('amount')),'\nКошелёк: ',R('wallet'),' → ',add(R('wallet'),R('amount')),'\nДо цели после перевода: ',R('goalRemaining'),' монет.'))];
A['withdraw/continue']=[S('ok',and(gt(R('amount'),0),ge(R('savings'),R('amount')))),...withdrawPreview(),C(R('ok'),[N('withdraw-confirm')],info('Выбери сумму','Нужна положительная сумма не больше накоплений.'))];A['withdraw-confirm/no']=route('savings');
A['withdraw-confirm/yes']=[S('ok',and(gt(R('amount'),0),ge(R('savings'),R('amount')))),C(R('ok'),[S('savings',sub(R('savings'),R('amount'))),S('wallet',add(R('wallet'),R('amount'))),S('withdrawn',add(R('withdrawn'),R('amount'))),log(J('Из копилки в кошелёк: ',R('amount'),' монет.'))]),C(and(R('ok'),gt(R('goalTransfer'),0)),[S('amount',0),N('goal-buy')]),C(and(R('ok'),eq(R('goalTransfer'),0)),[S('amount',0),...info('Монеты в кошельке','Перевод завершён. Это твои прежние деньги, не новый заработок.')]),C(not(R('ok')),info('Перевод не выполнен','Проверь сумму и остаток копилки.'))];
for(const[i,title,p,k]of[[0,'Мяч',30,'ball'],[1,'Воздушный змей',60,'kite'],[2,'Палатка',100,'tent']])A['goals/'+i]=[C(not(R(k)),[S('goal',i),S('goalPrice',p),S('goalTitle',title),N('savings')],info('Уже куплено','Эта вещь уже в твоём инвентаре. Выбери другую цель.'))];
A['savings/buy']=[S('selectedOwned',false),S('goalTransfer',0)];for(const[i,k]of['ball','kite','tent'].entries())A['savings/buy'].push(C(and(eq(R('goal'),i),R(k)),[S('selectedOwned',true)]));
A['savings/buy'].push(S('ok',not(R('selectedOwned'))),C(and(R('ok'),ge(R('wallet'),R('goalPrice'))),[S('price',R('goalPrice')),N('goal-buy')]),C(and(R('ok'),lt(R('wallet'),R('goalPrice')),ge(R('savings'),sub(R('goalPrice'),R('wallet')))),[S('amount',sub(R('goalPrice'),R('wallet'))),S('goalTransfer',R('amount')),...withdrawPreview(),N('withdraw-confirm')]),C(and(R('ok'),lt(add(R('wallet'),R('savings')),R('goalPrice'))),info('Пока не хватает','Можно отложить ещё, выполнить доступное дело или выбрать другую цель. Деньги не списаны.')),C(R('selectedOwned'),info('Уже куплено','Вещь в «Моих вещах». Повторной покупки не будет.')));
A['goal-buy/yes']=[S('ok',ge(R('wallet'),R('goalPrice')))];for(const[i,k]of['ball','kite','tent'].entries())A['goal-buy/yes'].push(C(and(eq(R('goal'),i),R(k)),[S('ok',false)]));
A['goal-buy/yes'].push(C(R('ok'),[S('wallet',sub(R('wallet'),R('goalPrice'))),S('optionalActual',add(R('optionalActual'),R('goalPrice'))),log(J('Куплена цель: ',R('goalTitle'),' за ',R('goalPrice'),' монет.')),S('goalTransfer',0),S('resultTitle','Теперь это твоё!'),S('result',J(R('goalTitle'),' куплен. Найди вещь в «Моих вещах» и попробуй её использовать.'))]));for(const[i,k]of['ball','kite','tent'].entries())A['goal-buy/yes'].push(C(and(R('ok'),eq(R('goal'),i)),[S(k,true)]));A['goal-buy/yes'].push(C(not(R('ok')),[S('resultTitle','Покупка не выполнена'),S('result','Проверь остаток кошелька и свои вещи: повторно покупать уже купленное нельзя.')]),...refresh(),N('result'));
A['goal-buy/no']=[C(gt(R('goalTransfer'),0),[N('goal-cancelled')],[N('savings')])];A['goal-cancelled/keep']=[S('goalTransfer',0),N('finance')];A['goal-cancelled/return']=[S('ok',and(gt(R('goalTransfer'),0),ge(R('wallet'),R('goalTransfer')))),C(R('ok'),[S('wallet',sub(R('wallet'),R('goalTransfer'))),S('savings',add(R('savings'),R('goalTransfer'))),S('deposited',add(R('deposited'),R('goalTransfer'))),log(J('Снятая сумма возвращена в копилку: ',R('goalTransfer'))),S('goalTransfer',0),N('savings')]),C(not(R('ok')),info('Проверь кошелёк','Сумма уже возвращена или часть денег потрачена. Автоматического списания нет.'))];
for(const h of[4,8,12,24])A['clock/'+h]=[S('hour',add(R('hour'),h)),C(gt(R('hour'),168),[S('hour',168)]),C(ge(R('hour'),R('fullUntil')),[S('mood','Я проголодался')]),...refresh(),N('home')];
A['clock/finish']=[S('hour',168),C(ge(R('hour'),R('fullUntil')),[S('mood','Я проголодался')]),N('summary')];
for(const[k,t]of[['stock','В следующий раз учту запас.'],['save','В следующий раз отложу раньше.'],['plan','В следующий раз выберу другой план.']])A['summary/'+k]=[S('ok',not(R('reflected'))),C(R('ok'),[S('reflectionWeeks',add(R('reflectionWeeks'),1)),S('reflected',true),S('weekHistory',J(R('weekHistory'),'\nНеделя ',R('week'),': еда/уход ',R('requiredActual'),'; покупки ',R('optionalActual'),'; в копилку ',R('deposited'),'; из копилки ',R('withdrawn'),'. ',t))]),C(and(R('ok'),ge(R('feedCount'),2),R('careUsed')),[S('careWeeks',add(R('careWeeks'),1))]),C(and(R('ok'),gt(sub(R('deposited'),R('withdrawn')),0)),[S('savingWeeks',add(R('savingWeeks'),1))]),C(and(ge(R('careWeeks'),2),ge(R('reflectionWeeks'),2),ge(R('savingWeeks'),2)),[S('stage',2)]),C(and(ge(R('careWeeks'),4),ge(R('reflectionWeeks'),4),ge(R('savingWeeks'),4)),[S('stage',3)]),N('nextweek')];
A['nextweek/yes']=[S('ok',lt(R('week'),5)),C(R('ok'),[S('week',add(R('week'),1)),S('wallet',add(R('wallet'),100)),S('hour',0),S('fullUntil',0),S('planSet',false),S('reflected',false),S('careUsed',false),S('claimUsed',false),S('feedCount',0),S('requiredActual',0),S('optionalActual',0),S('deposited',0),S('withdrawn',0),S('earned',0),S('requiredPlan',0),S('optionalPlan',0),S('savingPlan',0),S('mood','Доброе утро! Пора поесть.'),...Array.from({length:6},(_,i)=>S('paid'+i,false)),log('Новая неделя: +100 монет. Остатки и вещи сохранены.')])];
for(let i=0;i<6;i++)A['nextweek/yes'].push(C(R('ok'),[S('offer'+i,i<3?not(E('OR',[eq(R('week'),2),eq(R('week'),4)],'BOOLEAN')):E('OR',[eq(R('week'),2),eq(R('week'),4)],'BOOLEAN'))]));
A['nextweek/yes'].push(C(R('ok'),[N('plan')],info('Пять недель пройдены','Это конец демонстрационного объёма. Можно посмотреть историю, вещи и рост или начать новое прохождение.')));
// A second click cannot issue the next allowance again: it must follow a reviewed week.
A['nextweek/yes'][0]=S('ok',and(lt(R('week'),5),R('reflected')));
// Rescue can renew only after 24 game hours, not every tap on the clock.
A['rescue/yes'][0]=S('ok',and(eq(R('food'),0),eq(R('treat'),0),eq(R('wallet'),0),eq(R('savings'),0),ge(R('hour'),R('helpAvailableAt'))));
A['rescue/yes'][1].conditionalBlocks[0].actions.splice(2,0,S('helpAvailableAt',add(R('hour'),24)));
A['nextweek/yes'][1].conditionalBlocks[0].actions.push(S('helpAvailableAt',0));
const lessons=[
 ['Запас на оставшиеся дни',J('До конца недели осталось ',sub(8,R('week')),' дней. Питомцу нужны 2 пачки в день. Запас пуст. Сколько пачек понадобится?'),E('MULTIPLICATION',[sub(8,R('week')),2]),'Умножь число дней на 2 пачки. Это запас, а не количество монет.','Раздели дни на пары кормлений: по две пачки на каждый день.',1,'exercise'],
 ['Цена одной пачки','А: одна пачка за 5 монет. Б: 7 пачек за 28 монет. В каком варианте одна пачка дешевле?',1,'В наборе одна пачка стоит 28 ÷ 7 = 4 монеты, отдельно — 5. Набор дешевле за пачку, но требует больше денег сразу.','Чтобы сравнить, раздели цену набора на количество пачек.',1,'practice-shop'],
 ['Свой учебный план','Распредели 100 монет: не меньше 70 на обязательное, хотя бы 10 в копилку. Можно оставить остаток.',0,'Подходит несколько планов. Обязательные расходы обеспечены, часть денег отложена, сумма не превышает 100.','Проверь три условия: обязательное ≥70, копилка ≥10, общая сумма ≤100.',5,'practice-plan'],
 ['Шаг к цели',J('В учебном кошельке ',add(30,E('MULTIPLICATION',[R('week'),5])),' монет. На предстоящую покупку нужно оставить 10. Сколько МАКСИМУМ можно перевести в копилку?'),add(20,E('MULTIPLICATION',[R('week'),5])),'Перевод в копилку не расходует общую сумму денег. Но в кошельке нужно оставить деньги на предстоящую покупку.','Вычти 10 из суммы учебного кошелька.',5,'exercise'],
 ['Покупка по средствам','В учебном кошельке 20 монет. На ближайшие дни нужны 3 пачки. А: 3 пачки по 5 = 15. Б: 7 пачек за 28. Какую покупку можно оплатить сейчас без снятия из копилки?',0,'Три отдельные пачки стоят 15, остаётся 5. Большой набор дешевле за пачку, но его общая цена 28 больше доступных 20.','Сравни полную стоимость покупки с 20 монетами. Низкая цена пачки не означает доступную общую цену.',1,'practice-shop'],
 ['План и факт','На необязательные покупки планировали 10, потратили 20. Дополнительно заработали 10. На сколько фактические покупки превысили план?',10,'На 10 монет. Дополнительный доход объясняет возможность покупки, но не переписывает прежний план. Превышение само по себе не означает плохое решение.','Сравни только план покупок и фактические покупки: 20 − 10.',5,'exercise'],
];
for(let i=0;i<6;i++){const [title,prompt,expected,explanation,hint,step,dest]=lessons[i];A['tasks/'+i]=refreshed([S('task',i),S('answer',0),S('attempts',0),S('helpUsed',false),S('exerciseCompleted',false),S('expected',expected),S('lessonTitle',title),S('lessonPrompt',prompt),S('lessonExplanation',explanation),S('lessonHelp',hint),S('lessonStep',step),S('practiceRequired',0),S('practiceOptional',0),S('practiceSaving',0)],dest);}
for(const k of['practiceRequired','practiceOptional','practiceSaving']){
 A['practice-plan/'+k+'/minus']=refreshed([C(ge(R(k),5),[S(k,sub(R(k),5))])]);
 A['practice-plan/'+k+'/plus']=refreshed([C(lt(R(k),100),[S(k,add(R(k),5))])]);
}
const judge=condition=>{
 const a=[S('attempts',add(R('attempts'),1)),S('ok',condition),S('resultTitle','Попробуй ещё'),S('result','Сравни условие со своим решением. Монеты не списаны. Можно вернуться к выбору или открыть подсказку.'),C(R('ok'),[S('exerciseCompleted',true),S('resultTitle','Решение найдено'),S('result',R('lessonExplanation'))])];
 for(let i=0;i<6;i++){a.push(C(and(R('ok'),eq(R('task'),i),R('offer'+i),not(R('paid'+i))),[S('wallet',add(R('wallet'),10)),S('earned',add(R('earned'),10)),S('paid'+i,true),S('result',J(R('result'),'\nНаграда: +10 монет в кошелёк.')),log(J('Дело: ',R('lessonTitle'),'. Награда +10. Попыток: ',R('attempts')))]),C(and(R('ok'),eq(R('task'),i)),[S('completed'+i,true)]));}
 a.push(C(and(R('ok'),R('helpUsed')),[S('result',J(R('result'),'\nТы воспользовался подсказкой. Это выполнение с помощью.'))]),C(R('ok'),[log(J('Завершено: ',R('lessonTitle'),'. Попыток: ',R('attempts'),'.'))]),...refresh(),N('feedback'));return a;
};
A['exercise/check']=judge(eq(R('answer'),R('expected')));
A['practice-plan/check']=judge(and(ge(R('practiceRequired'),70),ge(R('practiceSaving'),10),E('LESS_THAN_OR_EQUAL',[add(add(R('practiceRequired'),R('practiceOptional')),R('practiceSaving')),100],'BOOLEAN')));
A['practice-shop/a']=[S('answer',0),...judge(eq(R('answer'),R('expected')))];A['practice-shop/b']=[S('answer',1),...judge(eq(R('answer'),R('expected')))];
A['exercise/minus']=refreshed([C(ge(R('answer'),R('lessonStep')),[S('answer',sub(R('answer'),R('lessonStep')))])]);A['exercise/plus']=refreshed([C(lt(R('answer'),200),[S('answer',add(R('answer'),R('lessonStep')))])]);
for(const k of['exercise','practice-plan','practice-shop'])A[k+'/hint']=[S('helpUsed',true),log(J('Открыта подсказка: ',R('lessonTitle'))),...info('Подсказка',R('lessonHelp'),'feedback')];
// Re-entry refresh for computed texts. Financial previews deliberately override the generic one.
const enter={};for(const k of Object.keys(screens()))enter[k]=refresh();
enter['withdraw-confirm']=[...refresh(),...withdrawPreview()];
enter['goal-buy']=[...refresh(),S('ui/confirm',J('Кошелёк: ',R('wallet'),'\nЦена вещи: ',R('goalPrice'),'\nПосле покупки: ',sub(R('wallet'),R('goalPrice')),' монет.\nЭто необязательные расходы.'))];
// One confirmation is consumed once. Reopening a product creates a fresh intent.
for(const key of Object.keys(A).filter(k=>k.startsWith('food/')||(/^shop\//.test(k)&&k!=='shop/food')))A[key].unshift(S('actionDone',false));
A['item/buy'][0]=S('ok',and(ge(R('wallet'),R('price')),not(R('selectedOwned')),R('planSet'),not(R('actionDone')),not(R('periodClosed'))));
A['item/buy'][1].conditionalBlocks[0].actions.unshift(S('actionDone',true));
// The review choice is a draft; the week is recorded only on explicit confirmation.
for(const[k,t]of[['stock','Учту уже купленный запас.'],['save','Отложу деньги раньше.'],['plan','Выберу другой план.']])A['summary/'+k]=[S('reflectionChoice',t),N('nextweek')];
const close=[S('ok',and(not(R('periodClosed')),E('NOT_EQUAL',[R('reflectionChoice'),''],'BOOLEAN'))),
 C(R('ok'),[S('periodClosed',true),S('reflectionWeeks',add(R('reflectionWeeks'),1)),S('weekHistory',J(R('weekHistory'),'\nНеделя ',R('week'),': еда/уход ',R('requiredActual'),'; покупки ',R('optionalActual'),'; пополнения ',R('deposited'),'; снятия ',R('withdrawn'),'. ',R('reflectionChoice')))]),
 C(and(R('ok'),ge(R('feedCount'),2),R('careUsed')),[S('careWeeks',add(R('careWeeks'),1))]),
 C(and(R('ok'),gt(sub(R('deposited'),R('withdrawn')),0)),[S('savingWeeks',add(R('savingWeeks'),1))]),
 C(and(ge(R('careWeeks'),2),ge(R('reflectionWeeks'),2),ge(R('savingWeeks'),2)),[S('stage',2)]),
 C(and(ge(R('careWeeks'),4),ge(R('reflectionWeeks'),4),ge(R('savingWeeks'),4)),[S('stage',3)])];
const nextReset=A['nextweek/yes'][1].conditionalBlocks[0].actions;
nextReset.push(S('reflectionChoice',''),S('periodClosed',false));
A['nextweek/yes']=[...close,S('actionDone',and(R('ok'),lt(R('week'),5))),C(R('actionDone'),nextReset)];
for(let i=0;i<6;i++)A['nextweek/yes'].push(C(R('actionDone'),[S('offer'+i,i<3?not(E('OR',[eq(R('week'),2),eq(R('week'),4)],'BOOLEAN')):E('OR',[eq(R('week'),2),eq(R('week'),4)],'BOOLEAN'))]));
A['nextweek/yes'].push(C(R('actionDone'),[N('plan')],info('Демонстрация завершена','Пять недель можно посмотреть в истории. Нового дохода нет. Вещи и накопления сохранены; новое прохождение доступно в настройках.')));
// Clear day labels on ordinary screens; hours remain on the explicit simulation control.
for(const actions of Object.values(enter)){for(let i=0;i<7;i++)actions.push(C(ge(R('hour'),i*24),[S('ui/time',J('Неделя ',R('week'),' · день ',i+1))]));actions.push(C(ge(R('hour'),168),[S('ui/time',J('Неделя ',R('week'),' · пора подвести итоги'))]));}
// Final journey refinements: choose a personal goal before making the first plan.
A['intro/next']=route('goals');
for(const[i,title,p,k]of[[0,'Мяч',30,'ball'],[1,'Воздушный змей',60,'kite'],[2,'Палатка',100,'tent']])A['goals/'+i]=[
 S('ok',not(R(k))),C(R('ok'),[S('goal',i),S('goalPrice',p),S('goalTitle',title),S('answer',0)]),
 C(and(R('ok'),R('onboarding')),[N('count')]),C(and(R('ok'),not(R('onboarding'))),[N('savings')]),
 C(not(R('ok')),info('Уже куплено','Эта вещь уже в твоём инвентаре. Выбери другую цель.'))];
A['goals/back']=[C(R('onboarding'),[S('answer',0),N('count')],[N('savings')])];
// Assistance is tracked separately; it does not count as independently funded care.
A['rescue/yes'][1].conditionalBlocks[0].actions.unshift(S('aidFood',add(R('aidFood'),1)));
for(const kind of ['food','treat']){
 A['feed/'+kind].splice(1,0,S('usingAid',kind==='food'?gt(R('aidFood'),0):false));
 A['feed/'+kind].splice(2,0,C(and(R('ok'),R('usingAid')),[S('aidFood',sub(R('aidFood'),1))]),C(and(R('ok'),not(R('usingAid'))),[S('paidFeedCount',add(R('paidFeedCount'),1))]));
}
close[2]=C(and(R('ok'),ge(R('paidFeedCount'),2),R('careUsed')),[S('careWeeks',add(R('careWeeks'),1))]);
A['nextweek/yes'][2]=close[2];
nextReset.push(S('paidFeedCount',0));
A['nextweek/yes'][A['nextweek/yes'].length-1]=C(R('actionDone'),[N('plan')]);
A['nextweek/yes'].push(C(and(not(R('actionDone')),eq(R('week'),5)),info('Демонстрация завершена','Пять недель можно посмотреть в истории. Нового дохода нет. Вещи и копилка сохранены; новое прохождение доступно в настройках.')),C(and(not(R('actionDone')),lt(R('week'),5)),info('Сначала подведи итоги','Новая неделя начинается после выбора в итогах. Повторное нажатие не выдаёт деньги ещё раз.')));
// After the fifth review, economic state is read-only until an explicit reset.
for(const key of ['item/buy','goal-buy/yes','feed/food','feed/treat','inventory/care','rescue/yes','deposit/continue','withdraw/continue','withdraw-confirm/yes','goal-cancelled/return','exercise/check','practice-plan/check','practice-shop/a','practice-shop/b']){
 for(const action of A[key])if(action.type==='SET_VARIABLE'&&action.variableId===vars.ok.id)action.variableValue=and(action.variableValue,not(R('periodClosed')));
}
A['goal-buy/yes'][0].variableValue=and(A['goal-buy/yes'][0].variableValue,R('planSet'));
// A mood response to free attention never conceals hunger or the need for ordinary food.
for(const key of ['playing/pet','playing/ball','playing/kite','playing/tent'])A[key].unshift(C(and(not(R('periodClosed')),lt(R('hour'),R('fullUntil')),lt(R('treatStreak'),3)),[S('mood','Мне весело с тобой!')]));
enter.home.push(S('ui/time',J(R('petName'),' · ',R('ui/time'))));
enter['withdraw-confirm'].push(S('ui/withdrawConfirmation',R('ui/confirm')));
enter['goal-buy'].push(S('ui/goalConfirmation',R('ui/confirm')));
// Once money is prepared for a purchase, do not present it as lost goal progress.
enter['withdraw-confirm'].push(C(gt(R('goalTransfer'),0),[S('ui/withdrawConfirmation',J('Для покупки: ',R('goalTitle'),'\nВзять из копилки ',R('amount'),' монет?\nКопилка: ',R('savings'),' → ',sub(R('savings'),R('amount')),'\nКошелёк: ',R('wallet'),' → ',add(R('wallet'),R('amount')),'\nПокупку подтвердишь следующим шагом.'))]));
enter['goal-buy'].push(S('ui/goal',J(R('goalTitle'),' · ',R('goalPrice'),' монет\nПосле покупки найдёшь вещь в «Моих вещах».')));
A['plan/confirm']=[C(R('planSet'),[N('finance')]),S('ok',and(not(R('planSet')),not(R('periodClosed')),E('LESS_THAN_OR_EQUAL',[add(add(R('requiredPlan'),R('optionalPlan')),R('savingPlan')),R('wallet')],'BOOLEAN'))),C(R('ok'),[S('planSet',true),S('onboarding',false),log('План сохранён. Деньги не списаны.'),N('food')]),C(and(not(R('ok')),not(R('planSet'))),info('Проверь план','Сумма направлений не должна превышать кошелёк. В завершённой демонстрации новый план не сохраняется.'))];
// Fix the comparison baseline at confirmation; earlier transfers stay historical.
A['plan/confirm'][2].conditionalBlocks[0].actions.unshift(S('planWallet',R('wallet')),S('prePlanDeposited',R('deposited')),S('prePlanWithdrawn',R('withdrawn')));

