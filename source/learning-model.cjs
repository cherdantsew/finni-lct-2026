// Current Figma model. JSON content is deliberately separate from UI authoring.
const fs=require('node:fs'),vm=require('node:vm');
const helper=fs.readFileSync(__dirname+'/figma-helpers.js','utf8');
const layers=['figma-actions.js','figma-ux27-actions.js','figma-home-first-actions.js','paper-v3-actions.js','paper-v3-copy.js','paper-v3-final-actions.js','compliance-actions.js','child-copy-transform.js','child-copy-actions.js','growth-help-actions.js','home-care-actions.js','pet-hub-actions.js','learning-actions.js'];
const keys=['start','profile','pet','intro','count','plan','home','shop','food','item','result','inventory','feed','finance','savings','deposit','withdraw','withdraw-confirm','goals','goal-buy','goal-cancelled','tasks','exercise','feedback','help','clock','summary','nextweek','growth','history','rescue','playing','settings','reset','notification','practice-plan','practice-shop','week','costs','plan-ready','wash','plan-guide','course','lesson'];
const catalog=require('./learning-content.json');
layers.push('history-cards-actions.js');
const code=helper.slice(helper.indexOf('const initial ='),helper.indexOf('const vars='))+
`\nconst vars=Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,{id:k,resolvedType:typeof v==='number'?'FLOAT':typeof v==='boolean'?'BOOLEAN':'STRING'}]));const page={children:${JSON.stringify(keys)}.map(k=>({name:'V2/'+k,id:k}))};const learningCatalog=${JSON.stringify(catalog)};\n`+
helper.slice(helper.indexOf('function L('),helper.indexOf('async function click('))+layers.map(p=>fs.readFileSync(__dirname+'/'+p,'utf8')).join('\n')+'\noutput={A,enter,defaults};';
const context={};vm.runInNewContext(code,context);module.exports={...context.output,keys,catalog};

