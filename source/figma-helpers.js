// Figma authoring, not APK code. Execute with a following batch through use_figma.
const page = await figma.getNodeByIdAsync('603:892');
await figma.setCurrentPageAsync(page);
const createdNodeIds = [], mutatedNodeIds = [];
const all = await figma.variables.getLocalVariablesAsync();
const tokens = Object.fromEntries(all.filter(v=>v.name.indexOf('/')>=0 && ['VariableCollectionId:277:3','VariableCollectionId:277:4'].includes(v.variableCollectionId)).map(v=>[v.name,v]));
const collections = await figma.variables.getLocalVariableCollectionsAsync();
let collection = collections.find(c=>c.name==='Финни · Живая игра V2');
if (!collection) { collection=figma.variables.createVariableCollection('Финни · Живая игра V2'); collection.renameMode(collection.defaultModeId,'Демонстрация'); }
const initial = {
  guideHomeSeen:false,guideShopSeen:false,guideFinanceSeen:false,guideInventorySeen:false,
  'ui/petStage':'Филя · малыш',
  'ui/completedNumber':0,
  'ui/anyFood':false,'ui/toyRow0':false,'ui/toyRow1':false,'ui/toyRow2':false,'ui/practicePlanRest':'Осталось распределить: 100 ₽','ui/nextWeekAction':'Начать новую неделю',
  'ui/practiceAPrice':'5 ₽','ui/practiceANote':'1 пачка','ui/practiceBPrice':'28 ₽','ui/practiceBNote':'7 пачек',
  'ui/guideHome':true,'ui/guideShop':true,'ui/guideFinance':true,'ui/guideInventory':true,
  'ui/hunger':'Пора поесть','ui/care':'Нужен уход','ui/taskTitle':'Задание: корм на неделю','ui/taskNote':'0 из 6 выполнено · +10 ₽',
  'ui/goalTitle':'Выбери свою цель','ui/goalNote':'Посмотри хотелки в лавке →','ui/compareRequired':'План 0 ₽ · потрачено 0 ₽','ui/compareOptional':'План 0 ₽ · потрачено 0 ₽','ui/compareSaving':'План 0 ₽ · отложено 0 ₽',
  'ui/hasCare':false,'ui/noCare':true,'ui/noToys':true,'ui/careCount':'0 комплектов','ui/foodShort':'0 пачек','ui/treatShort':'0 шт.',
  'ui/itemName':'Корм','ui/itemPrice':'5 ₽','ui/itemDetail':'1 пачка — одно кормление. Сытость на 12 игровых часов.','ui/planRest':'Осталось распределить: 100 ₽',
  'ui/summaryChoice':'Выбери, что попробуешь на следующей неделе.','ui/completedCount':'0 из 6 выполнено','ui/isHungry':true,'ui/isContent':false,
  wallet:100,savings:0,week:1,hour:0,fullUntil:0,treatStreak:0,food:0,treat:0,care:0,
  careUsed:false,playDone:false,planSet:false,requiredPlan:0,optionalPlan:0,savingPlan:0,
  requiredActual:0,optionalActual:0,deposited:0,withdrawn:0,earned:0,feedCount:0,careWeeks:0,reflectionWeeks:0,savingWeeks:0,
  nickname:'Саша',petName:'Филя',appearance:0,stage:1,mood:'Я проголодался',goal:1,goalPrice:60,goalTitle:'Воздушный змей',
  ball:false,kite:false,tent:false,sticker:false,ribbon:false,selection:0,price:5,quantity:1,itemTitle:'Корм · 1 пачка',amount:0,
  task:0,answer:0,attempts:0,helpUsed:false,paid0:false,paid1:false,paid2:false,
  completed0:false,completed1:false,completed2:false,completed3:false,completed4:false,completed5:false,
  ok:false,actionDone:false,goalTransfer:0,result:'',resultTitle:'Готово',history:'Начало игры: +100 монет в кошелёк.',
  weekHistory:'',expected:14,lessonTitle:'Запас на неделю',lessonPrompt:'',lessonExplanation:'',lessonHelp:'',lessonStep:1,
  selectedOwned:false,onboarding:true,notifications:false,
  paid3:false,paid4:false,paid5:false,offer0:true,offer1:true,offer2:true,offer3:false,offer4:false,offer5:false,
  exerciseCompleted:false,practiceRequired:0,practiceOptional:0,practiceSaving:0,claimUsed:false,
  reflected:false,species:0,outfit:0,helpAvailableAt:0,reflectionChoice:'',periodClosed:false,
  aidFood:0,paidFeedCount:0,usingAid:false,goalRemaining:60,
  planWallet:100,prePlanDeposited:0,prePlanWithdrawn:0,
  helpFrom:0,feedbackFrom:0,resultNext:0,journey:0,nextStep:0,
  planReturn:0,calcReturn:0,feedReturn:0,hasGoal:false,gateAllowed:false,
  'ui/hasFood':false,'ui/hasTreat':false,'ui/noFood':true,'ui/needsPlan':true,
  'ui/petRequest':'Хочу кушать','ui/itemAction':'Составить план','ui/planReturn':'Домой',
  'ui/foodCount':'Корм: 0 пачек','ui/treatCount':'Лакомства: 0 шт.',
  'ui/homeGoalAction':'Выбрать свою цель',
  'ui/planSummary':'Еда и уход: 0 ₽\nПокупки: 0 ₽\nВ копилку: 0 ₽','ui/resultNext':'Продолжить','ui/nextAction':'Что дальше?','ui/help':'','ui/planFunds':'На неделю: 100 ₽',
};
for(let i=0;i<8;i++)initial['itemVisible'+i]=i===0;
for(let i=0;i<3;i++)initial['goalVisible'+i]=i===1;
for(let i=0;i<6;i++)initial['ui/taskStatus'+i]='Практика';
initial['ui/adultGate']=false;
const defaults={...initial};
for(const key of ['requiredPlan','optionalPlan','savingPlan']) defaults['planValue/'+key]='0';
for(const key of ['practiceRequired','practiceOptional','practiceSaving']) defaults['planValue/'+key]='0';
defaults.homeWallet='Кошелёк\n100 монет';defaults.homeSavings='Копилка\n0 монет';
defaults.homeGoal='Цель: Воздушный змей · 60\nВ копилке 0 · осталось 60';
defaults['ui/today']='Пора купить корм и покормить друга.';
Object.assign(defaults,{
 'ui/planButton':'Составить план','ui/planConfirm':'Сохранить мой план',
 'ui/nextWeek':'Монеты, копилка и вещи сохранятся. Добавятся 100 монет. Новый план составишь отдельно.',
 'ui/purchaseConfirmation':'Кошелёк: 100\nЦена: 5\nОстанется: 95 монет.',
 'ui/withdrawConfirmation':'Выбери сумму на предыдущем экране. Снятие не считается доходом.',
 'ui/goalConfirmation':'Воздушный змей · 60 монет\nПосле покупки вещь появится в «Моих вещах».',
});
for (let i=0;i<27;i++) defaults['petVisible'+i]=i===0;
for(const [k,v] of Object.entries({wallet:'100 монет',savings:'0 монет',time:'Неделя 1 · день 1',stock:'Корм: 0 пачек',money:'В кошельке 100 · В копилке 0',plan:'',fact:'',goal:'Воздушный змей · 60 монет',need:'14 пачек на неделю',meal:'Питомец проголодался',item:'',amount:'0 монет',answer:'0',growth:'Малыш',offers:'',confirm:'',mood:'Я проголодался',profile:'Привет, Саша!',pet:'Филя',petChoice:'Лоскут · косынка',stages:'',forecast:'',ownership:'',totals:''})) defaults['ui/'+k]=v;
Object.assign(defaults,{'ui/plan':'Распределено: 0 из 100 монет','ui/fact':'План ещё не составлен. Посмотри цены и реши, сколько отложить на каждое направление.','ui/item':'Корм · 1 пачка\n5 монет · обязательные расходы.\nОдно кормление, 12 игровых часов сытости.','ui/offers':'Запас на неделю: +10 монет\nСледующие дела откроются в 3-й и 5-й дни.','ui/stages':'Забота: 0 недель\nРазбор плана: 0\nПрирост копилки: 0\nСледующие стадии — после 2 и 4 недель по каждому направлению.','ui/ownership':'Постоянных вещей пока нет.','ui/totals':'Кормлений: 0\nВ копилку добавлено: 0\nИз копилки взято: 0','ui/forecast':'Сначала составь план на неделю.',result:'Здесь будет результат твоего действия: что изменилось в деньгах и вещах.',lessonPrompt:'Питомцу нужны 2 пачки в день. Сколько пачек потребуется на 7 дней?',weekHistory:'Завершённых недель пока нет.'});
const vars=Object.fromEntries(all.filter(v=>v.variableCollectionId===collection.id).map(v=>[v.name,v]));
for(const [k,value] of Object.entries(defaults)) if(!vars[k]){
  const type=typeof value==='number'?'FLOAT':typeof value==='boolean'?'BOOLEAN':'STRING';
  const v=figma.variables.createVariable(k,collection,type);v.scopes=type==='STRING'?['TEXT_CONTENT']:type==='BOOLEAN'?['ALL_SCOPES']:[];
  v.setValueForMode(collection.defaultModeId,value);vars[k]=v;
}
const styles=Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s=>[s.name.replace('Finni/',''),s]));
await Promise.all([{family:'Nunito',style:'ExtraBold'},{family:'Nunito',style:'Regular'},{family:'Balsamiq Sans',style:'Regular'}].map(f=>figma.loadFontAsync(f)));
const componentIds={Primary:'280:5',Secondary:'280:12',Accent:'280:19',Card:'284:5',Choice:'289:2'};
const components=Object.fromEntries(await Promise.all(Object.entries(componentIds).map(async([k,id])=>[k,await figma.getNodeByIdAsync(id)])));
const logoSource=await figma.getNodeByIdAsync('181:2373');
function record(n){createdNodeIds.push(n.id);if('findAll'in n)createdNodeIds.push(...n.findAll().map(c=>c.id));return n;}
function paint(key){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',tokens[key]);}
function gap(n,x){n.setBoundVariable('itemSpacing',tokens['space/'+x]);}
function pad(n,x){for(const k of ['paddingLeft','paddingRight','paddingTop','paddingBottom'])n.setBoundVariable(k,tokens['space/'+x]);}
function col(parent,name,w=320,g=12){const n=record(figma.createAutoLayout('VERTICAL'));n.name=name;n.resize(w,48);n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.fills=[];gap(n,g);parent.appendChild(n);return n;}
function row(parent,name,w=320,g=8){const n=record(figma.createAutoLayout('HORIZONTAL'));n.name=name;n.resize(w,48);n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='AUTO';n.counterAxisAlignItems='CENTER';n.fills=[];gap(n,g);parent.appendChild(n);return n;}
async function txt(parent,label,style='Body',width=320,binding){const n=record(figma.createText());n.name=binding?'value/'+binding:label.slice(0,60);await n.setTextStyleIdAsync(styles[style].id);n.resize(width,24);n.characters=label;n.fills=[paint('text/primary')];parent.appendChild(n);if(binding)n.setBoundVariable('characters',vars[binding]);n.textAutoResize='HEIGHT';return n;}
async function button(parent,label,key,kind='Primary',w=320){const n=record(components[kind].createInstance());n.name='action/'+key;n.setProperties({[kind==='Choice'?'Label#289:0':'Label#280:0']:label});n.resize(w,kind==='Choice'?48:56);parent.appendChild(n);n.layoutSizingHorizontal='FIXED';return n;}
async function card(parent,title,body,binding){const n=record(components.Card.createInstance());n.name='card/'+title;n.setProperties({'Title#284:0':title,'Body#284:9':body});n.resize(320,120);parent.appendChild(n);n.primaryAxisSizingMode='AUTO';if(binding)n.findAllWithCriteria({types:['TEXT']}).find(t=>t.name==='body').setBoundVariable('characters',vars[binding]);return n;}
async function shell(key,title,index,nav=true){if(page.children.some(n=>n.name==='V2/'+key))throw new Error('Existing screen '+key+'; inspect before rebuilding');const root=record(figma.createFrame());root.name='V2/'+key;root.resize(360,800);root.x=80+(index%7)*440;root.y=80+Math.floor(index/7)*920;root.fills=[paint('surface/canvas')];root.cornerRadius=24;root.clipsContent=true;page.appendChild(root);
  for(const [id,x,y] of [['181:2426',330,190],['181:2432',0,515]]){const source=await figma.getNodeByIdAsync(id);const l=record(source.clone());root.appendChild(l);l.visible=true;l.opacity=.35;l.x=x;l.y=y;}
  const header=row(root,'header',320,16);header.x=20;header.y=16;await button(header,'‹',key+'/back','Choice',48);const logo=record(logoSource.clone());header.appendChild(logo);logo.visible=true;logo.resize(144,53);await button(header,'?',key+'/help','Choice',48);
  const viewport=record(figma.createFrame());root.appendChild(viewport);viewport.name='scroll';viewport.x=0;viewport.y=80;viewport.resize(360,nav?638:708);viewport.fills=[];viewport.clipsContent=true;viewport.overflowDirection='VERTICAL';const body=col(viewport,'content',360,12);pad(body,20);await txt(body,title,'Heading');
  if(nav){const bar=row(root,'navigation',360,0);bar.x=0;bar.y=724;bar.resize(360,76);bar.counterAxisSizingMode='FIXED';bar.fills=[paint('surface/raised')];for(const [target,label]of[['home','Дом'],['shop','Лавка'],['finance','Мои\nфинансы'],['inventory','Мои\nвещи']])await button(bar,label,key+'/nav/'+target,'Choice',90);}
  return {root,body};
}
async function pet(parent,height=170){const scene=record(figma.createFrame());parent.appendChild(scene);scene.name='Питомец · выбранный образ и стадия';scene.resize(320,height);scene.fills=[];
  const rug=record((await figma.getNodeByIdAsync('209:2')).clone());scene.appendChild(rug);rug.visible=true;rug.resize(292,64);rug.x=14;rug.y=height-65;
  const sources=await Promise.all(Array.from({length:27},(_,i)=>figma.getNodeByIdAsync(String('143:')+(1628+i+Math.floor(i/9)))));
  for(let i=0;i<27;i++){const n=record(sources[i].clone());scene.appendChild(n);n.resize(148,143);n.x=86;n.y=height-150;n.setBoundVariable('visible',vars['petVisible'+i]);}
  return scene;
}
function L(value){const type=typeof value==='number'?'FLOAT':typeof value==='boolean'?'BOOLEAN':'STRING';return {type,resolvedType:type,value};}
function R(name){const v=vars[name];if(!v)throw new Error('Unknown variable '+name);return{type:'VARIABLE_ALIAS',resolvedType:v.resolvedType,value:{type:'VARIABLE_ALIAS',id:v.id}};}
function E(fn,args,type='FLOAT'){return {type:'EXPRESSION',resolvedType:type,value:{expressionFunction:fn,expressionArguments:args.map(a=>a&&typeof a==='object'?a:L(a))}};}
const add=(a,b)=>E('ADDITION',[a,b]),sub=(a,b)=>E('SUBTRACTION',[a,b]),eq=(a,b)=>E('EQUALS',[a,b],'BOOLEAN'),ge=(a,b)=>E('GREATER_THAN_OR_EQUAL',[a,b],'BOOLEAN'),gt=(a,b)=>E('GREATER_THAN',[a,b],'BOOLEAN'),lt=(a,b)=>E('LESS_THAN',[a,b],'BOOLEAN'),and=(...args)=>args.reduce((a,b)=>E('AND',[a,b],'BOOLEAN')),not=a=>E('NOT',[a],'BOOLEAN');
function J(...a){return a.map(x=>x&&typeof x==='object'?x:L(x)).reduce((p,c)=>E('ADDITION',[p,c],'STRING'));}
function S(name,value){return{type:'SET_VARIABLE',variableId:vars[name].id,variableValue:value&&typeof value==='object'?value:L(value)};}
function C(condition,yes,no=[]){return {type:'CONDITIONAL',conditionalBlocks:[{condition,actions:yes},...(no.length?[{actions:no}]:[])]};}
function screens(){return Object.fromEntries(page.children.filter(n=>n.name.startsWith('V2/')).map(n=>[n.name.slice(3),n]));}
function N(key){const target=screens()[key];if(!target)throw new Error('Unknown screen '+key);return {type:'NODE',destinationId:target.id,navigation:'NAVIGATE',transition:null,resetScrollPosition:true};}
async function click(n,actions){await n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions}]);mutatedNodeIds.push(n.id);}
function result(extra={}){return {...extra,pageId:page.id,createdNodeIds:[...new Set(createdNodeIds)],mutatedNodeIds:[...new Set(mutatedNodeIds)],variables:Object.fromEntries(Object.entries(vars).map(([k,v])=>[k,v.id]))};}

