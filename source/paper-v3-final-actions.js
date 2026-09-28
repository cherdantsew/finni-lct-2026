// Presentation-only requirements found in final TZ review. No economy mutations.
for(const[k,v]of Object.entries({'ui/itemCategory':'Обязательные расходы','ui/topicBudgetCount':0,'ui/topicShoppingCount':0,'ui/topicSavingCount':0,'ui/topicBudget':'Планирование: 0 из 3 заданий','ui/topicShopping':'Покупки: 0 из 2 заданий','ui/topicSaving':'Сбережения: 0 из 1 задания'})){defaults[k]=v;vars[k]={id:k,resolvedType:typeof v==='number'?'FLOAT':'STRING'};}
enter.item.push(S('ui/itemCategory','Обязательные расходы'),C(ge(R('selection'),3),[S('ui/itemCategory','Необязательные расходы')]));
for(const[k,label,ids]of[['Budget','Планирование',[0,2,5]],['Shopping','Покупки',[1,4]],['Saving','Сбережения',[3]]]){
 enter.settings.push(S('ui/topic'+k+'Count',0),...ids.map(i=>C(R('completed'+i),[S('ui/topic'+k+'Count',add(R('ui/topic'+k+'Count'),1))])),S('ui/topic'+k,J(label,': ',R('ui/topic'+k+'Count'),' из ',ids.length,ids.length===1?' задания':' заданий')));
}
const wrongFeedback=[
 'Каждый день нужны две пачки: одна утром и одна вечером. Посчитай их на все дни из условия.',
 'Сравни цену одной пачки: раздели общую цену покупки на число пачек.',
 'Оставь не меньше 70 ₽ на еду и заботу и хотя бы 10 ₽ в копилку. Весь план должен уложиться в 100 ₽.',
 'На ближайшую покупку нужны 10 ₽. Оставь их в кошельке, а остальное можно отложить.',
 'Сначала проверь всю стоимость покупки. Дешевле за пачку не значит, что денег хватит на всю покупку.',
 'Сравни запланированные и потраченные деньги. Новый доход пополняет кошелёк, но не меняет прежний план.'
].map((copy,i)=>C(and(not(R('ok')),eq(R('task'),i)),[S('result',copy)]));
for(const k of ['exercise/check','practice-plan/check','practice-shop/a','practice-shop/b'])A[k].splice(A[k].length-1,0,...wrongFeedback);
defaults['ui/feedbackNext']='Вернуться к заданию';vars['ui/feedbackNext']={id:'ui/feedbackNext',resolvedType:'STRING'};
defaults['ui/feedbackShowExit']=true;vars['ui/feedbackShowExit']={id:'ui/feedbackShowExit',resolvedType:'BOOLEAN'};
enter.feedback.push(S('ui/feedbackNext','Вернуться к заданию'),C(R('exerciseCompleted'),[S('ui/feedbackNext','К заданиям')]),S('ui/feedbackShowExit',not(R('exerciseCompleted'))));

