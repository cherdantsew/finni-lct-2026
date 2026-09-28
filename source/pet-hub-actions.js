// Approved pet sheet and separate activity routes. Economy/growth remain unchanged.
const petHubDefaults={
 'ui/petPanel':false,'petActivityFromHub':false,
 'ui/petSad':true,'ui/petHappy':false,
 'ui/foodState':'Голоден','ui/cleanState':'Испачкался',
 'ui/feedInstruction':'Выбери еду из рюкзака. Одна пачка — одно кормление.',
 'ui/washInstruction':'Шампунь уже в рюкзаке. Нажми «Помыть друга».',
 'ui/washStock':'Шампуня пока нет','ui/canWash':false,'ui/needShampoo':true,'ui/isClean':false,
 'ui/noPlayToys':true,'ui/hasPlayToys':false,
};
for(const[k,v]of Object.entries(petHubDefaults)){defaults[k]=v;vars[k]={id:k,resolvedType:typeof v==='boolean'?'BOOLEAN':'STRING'};}
function petEmotionState(){return [S('ui/petSad',E('OR',[E('OR',[ge(R('hour'),R('fullUntil')),not(R('careUsed'))],'BOOLEAN'),E('OR',[not(R('playDone')),ge(R('treatStreak'),3)],'BOOLEAN')],'BOOLEAN')),S('ui/petHappy',not(R('ui/petSad')))];}
function petHubState(){const a=[
 S('ui/foodState','Голоден'),C(lt(R('hour'),R('fullUntil')),[S('ui/foodState','Сыт')]),
 S('ui/cleanState','Испачкался'),C(R('careUsed'),[S('ui/cleanState','Чистый')]),
 S('ui/petRequest','Поиграй со мной'),C(R('playDone'),[S('ui/petRequest','Мне весело с тобой!')]),
 C(not(R('careUsed')),[S('ui/petRequest','Пора купаться!')]),
 C(ge(R('hour'),R('fullUntil')),[S('ui/petRequest','Покорми меня')]),
 C(ge(R('treatStreak'),3),[S('ui/petRequest','В следующий раз дай корм')]),
 S('ui/noPlayToys',not(E('OR',[E('OR',[R('ball'),R('kite')],'BOOLEAN'),R('tent')],'BOOLEAN'))),S('ui/hasPlayToys',not(R('ui/noPlayToys'))),
 S('ui/taskTitle','Выполнить задания'),S('ui/taskNote','Награда получена · можно повторить'),
 ];
 for(let i=5;i>=0;i--)a.push(C(and(R('offer'+i),not(R('paid'+i))),[S('ui/taskNote',['Корм на неделю','Сравни покупки','План для цели','Шаг к цели','Покупка и остаток','Разберись с планом'][i]+' · +10 ₽')]));
 a.push(C(R('periodClosed'),[S('ui/taskNote','Пять недель позади · твои успехи')]),...petEmotionState());return a;
}
enter.home.push(...petHubState());
enter.playing.push(...petHubState());
for(const key of Object.keys(A).filter(k=>k.startsWith('guide/home/')||k.startsWith('adult/')||k==='home/adults'))A[key].push(...petHubState());
defaults['ui/taskNote']='Корм на неделю · +10 ₽';
enter.feed.push(S('ui/feedInstruction',petHubDefaults['ui/feedInstruction']),C(lt(R('hour'),R('fullUntil')),[S('ui/feedInstruction','Друг уже сыт. Еда останется в рюкзаке до следующего кормления.')]));
for(const[k,v]of Object.entries({'ui/feedFoodAction':'Дать одну пачку','ui/feedTreatAction':'Дать одну рыбку'})){defaults[k]=v;vars[k]={id:k,resolvedType:'STRING'};}
enter.feed.push(S('ui/feedFoodAction','Дать одну пачку'),S('ui/feedTreatAction','Дать одну рыбку'),C(lt(R('hour'),R('fullUntil')),[S('ui/feedFoodAction','Друг уже сыт'),S('ui/feedTreatAction','Друг уже сыт')]));
enter.wash=[...enter.inventory,
 S('ui/isClean',R('careUsed')),S('ui/canWash',and(gt(R('care'),0),not(R('careUsed')),not(R('periodClosed')))),
 S('ui/needShampoo',and(eq(R('care'),0),not(R('careUsed')),not(R('periodClosed')))),
 S('ui/washStock',J('В рюкзаке: ',R('care'))),S('ui/washInstruction',petHubDefaults['ui/washInstruction']),
 C(eq(R('care'),0),[S('ui/washInstruction','В рюкзаке нет шампуня. Его можно купить в лавке.')]),
 C(R('careUsed'),[S('ui/washInstruction','Друг уже чистый. Теперь можно поиграть!')]),
 C(R('periodClosed'),[S('ui/washInstruction','Пять недель завершены. Посмотри, как вырос твой друг.')]),
];
for(const key of ['start/new','start/demo','reset/yes'])A[key].unshift(...Object.entries(petHubDefaults).map(([k,v])=>S(k,v)));
A['home/pet']=[...petHubState(),S('ui/petPanel',true)];
A['pet-hub/close']=[S('ui/petPanel',false)];
for(const [key,to]of [['feed','feed'],['wash','wash'],['play','playing'],['growth','growth']])A['pet-hub/'+key]=[S('ui/petPanel',false),S('petActivityFromHub',true),S('feedReturn',2),N(to)];
A['pet-hub/back']=[S('ui/petPanel',true),N('home')];
A['header/feed/back']=[C(eq(R('feedReturn'),2),[S('ui/petPanel',true),N('home')]),C(eq(R('feedReturn'),0),[N('home')]),C(eq(R('feedReturn'),1),[N('inventory')])];
for(const key of ['playing','growth']){
 const old=A['header/'+key+'/back'];
 // These source-specific routes are plain navigation in the current model.
 A['header/'+key+'/back']=[C(R('petActivityFromHub'),[S('ui/petPanel',true),N('home')]),C(not(R('petActivityFromHub')),old.filter(a=>a.type==='NODE'))];
}
A['header/wash/back']=A['pet-hub/back'];
A['wash/use']=A['inventory/care'];
A['wash/shop']=A['shop/care'];
A['wash/play']=[S('petActivityFromHub',true),N('playing')];
A['wash/growth']=[S('petActivityFromHub',true),N('growth')];
for(const to of ['home','shop','finance','inventory'])A['wash/nav/'+to]=[S('ui/petPanel',false),N(to)];
A['header/wash/help']=[S('helpFrom',screenKeys.indexOf('wash')),S('ui/glossaryOpen',false),S('ui/helpTitle','Как помыть друга?'),S('ui/help','Одной порции шампуня хватает на одно мытьё. Купи её в лавке, затем вернись сюда. На этой неделе повторно мыть друга не нужно.'),N('help')];
for(const key of ['feed','wash','result'])enter[key].push(...petEmotionState());
replaceHelp('home','Позаботимся о друге','Нажми на питомца и выбери: покормить, помыть или поиграть. Там же можно посмотреть, как он растёт.');
replaceHelp('playing','Поиграем вместе','Погладь друга, чтобы поднять ему настроение, или выбери купленную игрушку. Для чистоты нужно отдельно помыть друга шампунем.');
// Petting has its own truthful, short result, not a generic toy result.
function pettingCopy(x){if(Array.isArray(x))return x.map(pettingCopy);if(!x||typeof x!=='object')return x;
 if(x.type==='SET_VARIABLE'&&x.variableId==='resultTitle')return S('resultTitle','Друг рад ласке');
 return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,pettingCopy(v)]));}
A['playing/pet']=pettingCopy(A['playing/pet']);
for(const key of ['home/play','inventory/play','home/growth','settings/growth'])if(A[key])A[key].unshift(S('petActivityFromHub',false));

