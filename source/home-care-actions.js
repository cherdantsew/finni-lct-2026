// Scoped clarity pass, 28 Sep. Preserve economy and the complete activity journal.
defaults.financeHistory='Начало игры: +100 ₽ в кошелёк.';
vars.financeHistory={id:'financeHistory',resolvedType:'STRING'};
function homeCareCopy(x){
 if(typeof x==='string')return ({'Нужен уход':'Пора помыть →','Чистый и ухоженный':'Чистый',
  'Доступно сейчас · +10 ₽':'Есть задание · +10 ₽',
  'История денег':'История финансовых операций'}[x]??x);
 if(Array.isArray(x))return x.map(homeCareCopy);
 if(!x||typeof x!=='object')return x;
 if(x.type==='SET_VARIABLE'&&x.variableId==='ui/taskTitle')return S('ui/taskTitle','Выполнить задания');
 return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,homeCareCopy(v)]));
}
function literals(x){if(x?.type==='STRING')return[x.value];if(!x||typeof x!=='object')return[];return Object.values(x).flatMap(v=>Array.isArray(v)?v.flatMap(literals):literals(v));}
function financialEvent(value){return literals(value).some(s=>/^(Начало игры:|Куплено: |Куплена цель: |В копилку: |Из копилки в кошелёк: |Снятая сумма возвращена в копилку: |Новая неделя: |Дело: )/.test(s));}
function financeAlias(x){if(Array.isArray(x))return x.map(financeAlias);if(!x||typeof x!=='object')return x;if(x.type==='VARIABLE_ALIAS'&&x.id==='history')return{...x,id:'financeHistory'};return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,financeAlias(v)]));}
function withFinanceJournal(list){return list.flatMap(a=>{
 if(a.type==='CONDITIONAL')return[{...a,conditionalBlocks:a.conditionalBlocks.map(b=>({...b,actions:withFinanceJournal(b.actions)}))}];
 if(a.type==='SET_VARIABLE'&&a.variableId==='history'&&financialEvent(a.variableValue))return[a,{...a,variableId:'financeHistory',variableValue:financeAlias(a.variableValue)}];
 return[a];
});}
for(const k of Object.keys(A))A[k]=withFinanceJournal(homeCareCopy(A[k]));
for(const k of Object.keys(enter))enter[k]=withFinanceJournal(homeCareCopy(enter[k]));
defaults['ui/care']='Пора помыть →';defaults['ui/taskTitle']='Выполнить задания';
defaults['ui/taskNote']='Есть задание · +10 ₽';
function replaceHelp(key,title,copy){A['header/'+key+'/help']=A['header/'+key+'/help'].map(a=>a.type==='SET_VARIABLE'&&a.variableId==='ui/helpTitle'?S('ui/helpTitle',title):a.type==='SET_VARIABLE'&&a.variableId==='ui/help'?S('ui/help',copy):a);}
replaceHelp('playing','Игра и чистота','Погладь друга, чтобы поднять ему настроение. Чтобы помыть его, купи шампунь в лавке и выбери его в рюкзаке.');
replaceHelp('home','С чего начать?','Нажми на друга, чтобы покормить или поиграть. «Пора помыть» ведёт в рюкзак: там выбери шампунь. Если его нет, купи в лавке.');
replaceHelp('history','Откуда и куда идут деньги?','Здесь записано, сколько ты получил, потратил и перевёл между кошельком и копилкой. Покупки уменьшают твои деньги, а перевод только меняет место хранения.');
const washCopy={
 'ui/washTitle':'Как помыть друга',
 'ui/washBody':'Нажми на шампунь в рюкзаке. Если его нет, купи в лавке.',
 'ui/washNote':'Чтобы помыть друга, купи шампунь в лавке.',
};
for(const[k,v]of Object.entries(washCopy)){defaults[k]=v;vars[k]={id:k,resolvedType:'STRING'};}
enter.playing.push(S('ui/washTitle',washCopy['ui/washTitle']),S('ui/washBody',washCopy['ui/washBody']),C(R('careUsed'),[S('ui/washTitle','Друг уже чистый'),S('ui/washBody','Ты уже помыл его на этой неделе. Теперь можно поиграть!')]));
enter.inventory.push(S('ui/washNote',washCopy['ui/washNote']),C(R('careUsed'),[S('ui/washNote','Друг уже чистый. Снова помоешь его на следующей неделе.')]));

