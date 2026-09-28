// Presentation ledger: all purchases grouped by product, never limited to the last N events.
// The full financeHistory remains unchanged; this layer does not move any money.
const histDefaults={'ui/historyExpanded':false,'ui/historyHasLast':false,'ui/historyNoLast':true,'ui/historyToggle':'Итоги прошлой недели ⌄','ui/historyWeek':'Эта неделя','ui/historyEarned':'0 ₽','ui/historyShowEarned':false,'ui/historyDeposit':'0 ₽','ui/historyWithdraw':'0 ₽','ui/historyShowDeposit':false,'ui/historyShowWithdraw':false,'ui/historyNoPurchases':true,'ui/historyLastRequired':'','ui/historyLastOptional':'','ui/historyLastSaving':''};
histDefaults['ui/historyShowTransfers']=false;
for(let i=0;i<8;i++){histDefaults['histQty'+i]=0;histDefaults['histCost'+i]=0;histDefaults['ui/histQty'+i]='';histDefaults['ui/histCost'+i]='0 ₽';histDefaults['ui/histVisible'+i]=false;}
for(const[k,v]of Object.entries(histDefaults)){defaults[k]=v;vars[k]={id:k,resolvedType:typeof v==='number'?'FLOAT':typeof v==='boolean'?'BOOLEAN':'STRING'};}
for(const key of ['start/new','start/demo','reset/yes'])A[key].unshift(...Object.entries(histDefaults).map(([k,v])=>S(k,v)));
const stockKeys=['food','treat','care','sticker','ribbon','ball','kite','tent'];
function historyPurchasePatch(list,goal=false){const out=[];for(const a of list){let n=a;if(a.type==='CONDITIONAL')n={...a,conditionalBlocks:a.conditionalBlocks.map(b=>({...b,actions:historyPurchasePatch(b.actions,goal)}))};out.push(n);const i=stockKeys.indexOf(a.variableId);if(a.type==='SET_VARIABLE'&&i>=0&&(!goal||i>=5)){out.push(S('histQty'+i,add(R('histQty'+i),goal?1:R('quantity'))),S('histCost'+i,add(R('histCost'+i),R(goal?'goalPrice':'price'))));}}return out;}
A['item/buy']=historyPurchasePatch(A['item/buy']);A['goal-buy/yes']=historyPurchasePatch(A['goal-buy/yes'],true);
function historyClosePatch(list){const out=[];for(const a of list){let n=a;if(a.type==='CONDITIONAL')n={...a,conditionalBlocks:a.conditionalBlocks.map(b=>({...b,actions:historyClosePatch(b.actions)}))};out.push(n);
 if(a.type==='SET_VARIABLE'&&a.variableId==='ui/lastWeek'&&!JSON.stringify(a.variableValue).includes('"id":"ui/lastWeek"'))out.push(S('ui/historyLastRequired',J('План ',R('requiredPlan'),' ₽ · потрачено ',R('requiredActual'),' ₽')),S('ui/historyLastOptional',J('План ',R('optionalPlan'),' ₽ · потрачено ',R('optionalActual'),' ₽')),S('ui/historyLastSaving',J('План ',R('savingPlan'),' ₽ · отложено ',sub(R('deposited'),R('withdrawn')),' ₽')));
 if(a.type==='SET_VARIABLE'&&a.variableId==='financeHistory'&&JSON.stringify(a.variableValue).includes('Новая неделя:'))out.push(...Array.from({length:8},(_,i)=>[S('histQty'+i,0),S('histCost'+i,0)]).flat());
}return out;}
A['nextweek/yes']=historyClosePatch(A['nextweek/yes']);
function historyView(){const a=[S('ui/historyWeek',J('Неделя ',R('week'))),S('ui/historyHasLast',gt(R('lastClosedWeek'),0)),S('ui/historyNoLast',eq(R('lastClosedWeek'),0)),S('ui/historyToggle',J('Итоги недели ',R('lastClosedWeek'),' ⌄')),S('ui/historyEarned',J('+',R('earned'),' ₽')),S('ui/historyShowEarned',gt(R('earned'),0)),S('ui/historyDeposit',J(R('deposited'),' ₽')),S('ui/historyWithdraw',J(R('withdrawn'),' ₽')),S('ui/historyShowDeposit',gt(R('deposited'),0)),S('ui/historyShowWithdraw',gt(R('withdrawn'),0)),S('ui/historyNoPurchases',eq(add(R('requiredActual'),R('optionalActual')),0))];
 for(let i=0;i<8;i++)a.push(S('ui/histVisible'+i,gt(R('histQty'+i),0)),S('ui/histCost'+i,J('−',R('histCost'+i),' ₽')),S('ui/histQty'+i,J(i===0?'Куплено пачек: ':i===1?'Куплено лакомств: ':i===2?'Куплено порций: ':'Куплено: ',R('histQty'+i))));
 a.push(S('ui/historyShowTransfers',gt(add(R('deposited'),R('withdrawn')),0)));return a;
}
enter.history.push(S('ui/historyExpanded',false),...historyView());
A['history/toggle']=[S('ui/historyExpanded',not(R('ui/historyExpanded'))),...historyView(),C(R('ui/historyExpanded'),[S('ui/historyToggle','Скрыть итоги ⌃')])];
replaceHelp('history','История финансовых операций','Здесь покупки этой недели собраны по товарам. Видно, сколько куплено и потрачено. Итоги прошлой недели открываются по кнопке.');

