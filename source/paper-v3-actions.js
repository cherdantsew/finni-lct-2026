// Paper-reference interface: display data and context links over the tested economy.
A['feed/shop']=A['inventory/shop']=route('shop');
A['shop/goals']=route('goals');A['home/growth']=route('growth');
for(const k of ['shop','finance','inventory'])A['header/'+k+'/back']=route('home');
for(const k of ['home','shop','finance','inventory']){const cap=k[0].toUpperCase()+k.slice(1);A['guide/'+k+'/open']=[S('ui/guide'+cap,true)];A['guide/'+k+'/close']=[S('guide'+cap+'Seen',true),S('ui/guide'+cap,false)];enter[k].push(S('ui/guide'+cap,not(R('guide'+cap+'Seen'))));}
A['home/adults']=[S('ui/adultGate',true)];A['adult/cancel']=[S('ui/adultGate',false)];A['adult/56']=[S('ui/adultGate',false),N('settings')];for(const n of [48,64])A['adult/'+n]=[S('ui/adultGate',true)];
A['header/settings/back']=route('home');
for(const [k,title,copy]of [['sticker','Твоя наклейка','Она теперь в твоей коллекции.'],['ribbon','Твоя лента','Она теперь в твоей коллекции.']])A['inventory/'+k]=[S('resultNext',1),...info(title,copy)];
for(const [key,copy]of [['stock','Сначала проверю еду в рюкзаке.'],['save','Сначала отложу на цель.'],['plan','Сравню цены перед покупкой.']])A['summary/'+key]=[S('reflectionChoice',copy),N('nextweek')];
const or=(...a)=>a.reduce((p,c)=>E('OR',[p,c],'BOOLEAN'));
const doneTotal=()=>['completed0','completed1','completed2','completed3','completed4','completed5'].map(k=>R(k));
// A separate counter avoids implicit Boolean-to-number coercion in Figma.
function paperRefresh(){const a=[
 S('ui/wallet',J(R('wallet'),' ₽')),S('ui/savings',J(R('savings'),' ₽')),S('ui/amount',J(R('amount'),' ₽')),
 S('ui/planButton','Составить план'),C(R('planSet'),[S('ui/planButton','Мой план')]),
 S('ui/hunger','Пора поесть'),C(lt(R('hour'),R('fullUntil')),[S('ui/hunger','Сыт и доволен')]),
 S('ui/care','Нужен уход'),C(R('careUsed'),[S('ui/care','Чистый и ухоженный')]),
 S('ui/isHungry',ge(R('hour'),R('fullUntil'))),S('ui/isContent',lt(R('hour'),R('fullUntil'))),
 S('ui/petRequest','Поиграй со мной'),C(ge(R('hour'),R('fullUntil')),[S('ui/petRequest','Покорми меня')]),C(ge(R('treatStreak'),3),[S('ui/petRequest','Хочется корма')]),
 S('ui/petStage',J(R('petName'),' · ',R('ui/growth'))),
 S('ui/hasFood',gt(R('food'),0)),S('ui/hasTreat',gt(R('treat'),0)),S('ui/noFood',eq(add(R('food'),R('treat')),0)),
 S('ui/anyFood',gt(add(R('food'),R('treat')),0)),S('ui/toyRow0',or(R('ball'),R('kite'))),S('ui/toyRow1',or(R('tent'),R('sticker'))),S('ui/toyRow2',R('ribbon')),
 S('ui/hasCare',gt(R('care'),0)),S('ui/noCare',eq(R('care'),0)),S('ui/noToys',not(or(R('ball'),R('kite'),R('tent'),R('sticker'),R('ribbon')))),
 S('ui/foodShort',J('Пачек: ',R('food'))),S('ui/treatShort',J('Штук: ',R('treat'))),
 S('ui/goalTitle','Выбери свою цель'),S('ui/goalNote','Посмотри хотелки в лавке →'),
 C(R('hasGoal'),[S('ui/goalTitle',R('goalTitle')),S('ui/goalNote',J('В копилке ',R('savings'),' из ',R('goalPrice'),' ₽'))]),
 S('ui/compareRequired',J('План ',R('requiredPlan'),' ₽ · потрачено ',R('requiredActual'),' ₽')),
 S('ui/compareOptional',J('План ',R('optionalPlan'),' ₽ · потрачено ',R('optionalActual'),' ₽')),
 S('ui/compareSaving',J('План ',R('savingPlan'),' ₽ · отложено ',sub(R('deposited'),R('withdrawn')),' ₽')),
 S('ui/planRest',J('Осталось распределить: ',sub(R('wallet'),add(add(R('requiredPlan'),R('optionalPlan')),R('savingPlan'))),' ₽')),
 S('ui/practicePlanRest',J('Осталось распределить: ',sub(100,add(add(R('practiceRequired'),R('practiceOptional')),R('practiceSaving'))),' ₽')),
 S('ui/nextWeekAction','Начать новую неделю'),C(eq(R('week'),5),[S('ui/nextWeekAction','Сохранить итоги')]),
 S('ui/itemName',R('itemTitle')),S('ui/itemPrice',J(R('price'),' ₽')),
 S('ui/purchaseConfirmation',J('В кошельке ',R('wallet'),' ₽. После покупки останется ',sub(R('wallet'),R('price')),' ₽.')),
 C(lt(R('wallet'),R('price')),[S('ui/purchaseConfirmation',J('Для покупки не хватает ',sub(R('price'),R('wallet')),' ₽. Можно выполнить задание или заглянуть в копилку.'))]),
 S('ui/completedNumber',0),S('ui/taskTitle','Твои задания'),S('ui/taskNote','Новые задания — в 1-й, 3-й и 5-й дни'),
 S('ui/practiceAPrice','5 ₽'),S('ui/practiceANote','1 пачка'),S('ui/practiceBPrice','28 ₽'),S('ui/practiceBNote','7 пачек'),
 C(eq(R('task'),4),[S('ui/practiceAPrice','15 ₽'),S('ui/practiceANote','3 пачки')]),
 ];
 for(const [i,detail]of ['Одна пачка — одно кормление. Корм насыщает на 12 игровых часов.','Рыбка насыщает на 8 игровых часов. Чередуй лакомства с кормом.','Помой и расчеши питомца. Одной покупки хватает на заботу в течение недели.','Наклейка для твоей коллекции.','Лента для твоей коллекции.','Твой мяч. После покупки можно играть.','Твой воздушный змей. После покупки можно запускать.','Твоя палатка. После покупки можно заглянуть внутрь.'].entries()){a.push(S('itemVisible'+i,eq(R('selection'),i)),C(eq(R('selection'),i),[S('ui/itemDetail',detail)]));}
 for(let i=0;i<3;i++){a.push(S('goalVisible'+i,eq(R('goal'),i)),C(and(R('hasGoal'),eq(R('goal'),i),R(['ball','kite','tent'][i])),[S('ui/goalNote','Куплено · уже в рюкзаке')]));}
 for(let i=5;i>=0;i--)a.push(S('ui/taskStatus'+i,'Можно потренироваться'),C(R('completed'+i),[S('ui/completedNumber',add(R('ui/completedNumber'),1)),S('ui/taskStatus'+i,'Выполнено · можно повторить')]),C(and(R('offer'+i),not(R('paid'+i))),[S('ui/taskStatus'+i,'Доступно · награда 10 ₽'),S('ui/taskTitle',['Корм на неделю','Сравни покупки','План для цели','Шаг к цели','Покупка и остаток','Разберись с планом'][i]),S('ui/taskNote','Доступно сейчас · +10 ₽')]),C(and(R('offer'+i),R('paid'+i)),[S('ui/taskStatus'+i,'Награда получена · повторить')]));
 a.push(S('ui/completedCount',J(R('ui/completedNumber'),' из 6 выполнено')),C(R('periodClosed'),[S('ui/taskTitle','Пять недель позади'),S('ui/taskNote','Посмотри свои достижения')]));
 return a;
}
const replacements={
 'Набор ухода на неделю':'Щётка и шампунь',
 'Корм · 1 пачек':'Корм · 1 пачка',
 'Питомец ухожен. Из запаса использован один набор, монеты не списаны.':'Ты помыл и расчесал питомца. Он чистый и довольный!',
 'Ты использовал набор ухода. Питомец чистый и довольный!':'Ты помыл и расчесал питомца. Он чистый и довольный!',
 'Проверь запас':'Забота о питомце',
 'Нужен набор ухода. Если на этой неделе уход уже выполнен, повторно ничего не расходуем.':'Для заботы нужны щётка и шампунь из лавки. Если друг уже чистый, можно поиграть с ним.',
 'Открыть мои вещи':'Открыть рюкзак',
 'Какой набор выбрать?':'Какая покупка выгоднее?',
 'Новая неделя: посмотри на запас и составь план трат.':'Посмотри, что уже есть в рюкзаке, и составь план на неделю.',
 };
function paperCopy(x){if(typeof x==='string'){let y=replacements[x]||x;return y.replace(/набор ухода/g,'щётку и шампунь').replace(/Набор ухода/g,'Щётка и шампунь').replace(/вещь в рюкзак(?=[ .,!?]|$)/g,'вещь в рюкзаке');}if(Array.isArray(x))return x.map(paperCopy);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,paperCopy(v)]));return x;}
for(const k of Object.keys(A))A[k]=paperCopy([...A[k].filter(a=>a.type!=='NODE'),...paperRefresh(),...A[k].filter(a=>a.type==='NODE')]);
for(const k of Object.keys(enter))enter[k]=paperCopy([...enter[k],...paperRefresh()]);

