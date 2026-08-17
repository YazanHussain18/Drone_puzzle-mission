const GRID = 50;

const COMMANDS = {
  takeoff:{label:'drone.takeoff()',icon:'🚁',desc:'إقلاع',python:'drone.takeoff()',type:'takeoff'},
  forward:{label:'drone.move_forward(50)',icon:'⬆️',desc:'تقدم 50',python:'drone.move_forward(50)',type:'move',dist:1},
  forward2:{label:'drone.move_forward(100)',icon:'⏫',desc:'تقدم 100',python:'drone.move_forward(100)',type:'move',dist:2},
  left:{label:'drone.rotate_counter_clockwise(90)',icon:'↶',desc:'يسار 90°',python:'drone.rotate_counter_clockwise(90)',type:'turn',amount:-1},
  right:{label:'drone.rotate_clockwise(90)',icon:'↷',desc:'يمين 90°',python:'drone.rotate_clockwise(90)',type:'turn',amount:1},
  wait:{label:'sleep(1)',icon:'⏸️',desc:'انتظر ثانية',python:'sleep(1)',type:'wait'},
  land:{label:'drone.land()',icon:'🛬',desc:'هبوط',python:'drone.land()',type:'land'},
  repeat2:{label:'repeat(2)',icon:'🔁',desc:'كرر التالي مرتين',python:'# REPEAT NEXT COMMAND 2 TIMES',type:'repeat',count:2},
  repeat4:{label:'repeat(4)',icon:'🔁',desc:'كرر التالي 4 مرات',python:'# REPEAT NEXT COMMAND 4 TIMES',type:'repeat',count:4},
  repeat4pair:{label:'repeat_pair(4)',icon:'🔁',desc:'كرر الأمرين التاليين 4 مرات',python:'# REPEAT NEXT 2 COMMANDS 4 TIMES',type:'repeatpair',count:4}
};

const DIFFICULTIES = {
  easy:{label:'مبتدئ',icon:'🌱',cls:'easy'},
  medium:{label:'مستكشف',icon:'🧭',cls:'medium'},
  advanced:{label:'مبرمج',icon:'💻',cls:'advanced'},
  expert:{label:'خبير',icon:'🏆',cls:'expert'}
};

const LEVELS = [
 {tier:'easy',title:'Hello Drone',mission:'اجعل الدرون يقلع، ينتظر قليلاً، ثم يهبط في نفس المكان.',goal:'إقلاع → انتظار → هبوط',start:[1,6],dir:0,target:[1,6],obstacles:[],palette:['takeoff','wait','land'],recommended:['takeoff','wait','land'],hint:'ابدأ دائماً بالإقلاع، وأنهِ المهمة بالهبوط.',success:'أول برنامج ناجح! أنت الآن تتحكم بالدرون باستخدام أوامر مرتبة.'},
 {tier:'easy',title:'أول رحلة',mission:'المستشفى أمام الدرون مباشرة. أوصل الدواء ثم اهبط.',goal:'تحرك 100 ثم اهبط',start:[1,6],dir:0,target:[3,6],obstacles:[],palette:['takeoff','forward','forward2','land'],recommended:['takeoff','forward2','land'],hint:'المستشفى يبعد مربعين. يوجد أمر يتحرك مربعين مرة واحدة.',success:'رائع! غيّرت مكان الدرون باستخدام move_forward.'},
 {tier:'easy',title:'انعطف إلى الهدف',mission:'الهدف ليس أمامك. تقدم ثم انعطف للوصول إليه.',goal:'استخدم تقدم + دوران',start:[1,6],dir:0,target:[3,4],obstacles:[],palette:['takeoff','forward','forward2','right','left','land'],recommended:['takeoff','forward2','left','forward2','land'],hint:'تقدم أولاً إلى نفس عمود الهدف، ثم تحتاج دوراناً واحداً.',success:'ممتاز! أنت الآن تستخدم الحركة والدوران في برنامج واحد.'},

 {tier:'medium',title:'تجنب الصخرة',mission:'يوجد عائق أمام الطريق المباشر. برمج مساراً آمناً حوله.',goal:'لا تصطدم بالعائق',start:[1,6],dir:0,target:[5,6],obstacles:[[3,6]],palette:['takeoff','forward','right','left','land'],recommended:['takeoff','left','forward','right','forward','forward','forward','forward','right','forward','left','land'],hint:'بدلاً من المرور عبر العائق، اصعد صفاً ثم أكمل طريقك.',success:'أحسنت! البرنامج لم يكن مجرد حركة، بل حل مشكلة.'},
 {tier:'medium',title:'الممر المتعرج',mission:'اعبر الممر بين العوائق ثم اهبط في منطقة الإنقاذ.',goal:'اختر اتجاهاتك بعناية',start:[1,6],dir:0,target:[6,3],obstacles:[[3,6],[3,5],[5,4],[5,3]],palette:['takeoff','forward','forward2','right','left','land'],recommended:['takeoff','left','forward2','forward2','right','forward2','forward2','forward','right','forward','land'],hint:'فكّر في الطريق على شكل خطوات: أعلى → يمين → أعلى → يمين.',success:'مهمة ناجحة! قسمت المشكلة الكبيرة إلى خطوات صغيرة.'},
 {tier:'medium',title:'Debug Mission',mission:'الكود الموجود جاهز تقريباً، لكنه يحتوي على خطأ واحد. شغّله، لاحظ الخطأ، ثم أصلحه.',goal:'ابحث عن الـ Bug',start:[1,6],dir:0,target:[4,4],obstacles:[[3,6]],palette:['takeoff','forward','right','left','land'],prefill:['takeoff','forward','forward','right','forward','forward','land'],recommended:['takeoff','left','forward','forward','right','forward','forward','forward','land'],hint:'إذا كان الطريق أمامك مغلقاً، فهل يجب أن تتقدم أم تغيّر الاتجاه أولاً؟',success:'وجدت الـ Bug وأصلحته! هذه هي عملية Debugging.'},

 {tier:'advanced',title:'تعرف على التكرار',mission:'تحرك خطوتين للأمام، لكن استخدم بلوك التكرار لتقليل عدد الأوامر.',goal:'استخدم repeat(2)',start:[1,6],dir:0,target:[3,6],obstacles:[],palette:['takeoff','forward','repeat2','land'],recommended:['takeoff','repeat2','forward','land'],requireCommand:'repeat2',hint:'ضع repeat(2) قبل الأمر الذي تريد تكراره.',success:'ممتاز! التكرار يجعل البرنامج أقصر وأسهل.'},
 {tier:'advanced',title:'دورية مربعة',mission:'اجعل الدرون يدور حول مربع صغير ويعود إلى نقطة البداية ثم يهبط.',goal:'ارجع إلى START',start:[3,5],dir:0,target:[3,5],obstacles:[],palette:['takeoff','forward','right','repeat4pair','land'],recommended:['takeoff','repeat4pair','forward','right','land'],special:'square',requireCommand:'repeat4pair',hint:'المربع يتكرر فيه نفس النمط أربع مرات: تقدم ثم دوران.',success:'رائع! استخدمت فكرة loop لصنع دورية كاملة.'},
 {tier:'advanced',title:'أقصر برنامج',mission:'أوصل الدرون للهدف، وحاول استخدام أقل عدد ممكن من البلوكات.',goal:'استخدم التكرار بذكاء',start:[1,6],dir:0,target:[5,6],obstacles:[],palette:['takeoff','forward','repeat4','land'],recommended:['takeoff','repeat4','forward','land'],requireCommand:'repeat4',maxBlocks:4,hint:'بدلاً من وضع forward أربع مرات، هل يوجد أمر يكرر الأمر التالي؟',success:'كود قصير وذكي! هذه بداية التفكير مثل المبرمج.'},

 {tier:'expert',title:'مهمة الجسر',mission:'اعبر الطريق الضيق بين منطقتين خطرتين. أي اصطدام يعني إعادة المحاولة.',goal:'دقة + ترتيب',start:[1,6],dir:0,target:[8,2],obstacles:[[3,6],[3,5],[3,4],[5,4],[6,4],[7,4],[7,3]],palette:['takeoff','forward','forward2','right','left','land'],recommended:['takeoff','left','forward2','forward2','right','forward2','forward2','forward2','forward','land'],hint:'ابحث عن الممر الفارغ أولاً قبل كتابة الكود.',success:'أحسنت! خططت للمسار قبل التنفيذ، وهذا هو التفكير البرمجي.'},
 {tier:'expert',title:'مهمة الإنقاذ',mission:'انطلق من القاعدة، تجنب العوائق، ووصل إلى فريق الإنقاذ في الجهة الأخرى.',goal:'مهمة طويلة بدون أخطاء',start:[1,6],dir:0,target:[9,1],obstacles:[[3,6],[3,5],[5,5],[5,4],[5,3],[7,3],[8,3],[8,2]],palette:['takeoff','forward','forward2','right','left','repeat2','land'],recommended:['takeoff','left','forward2','forward2','forward','right','forward2','forward2','forward2','forward2','land'],hint:'قسم الطريق إلى 3 أجزاء: صعود، انتقال، ثم صعود أخير.',success:'مهمة إنقاذ ناجحة! أنت تتحكم في برنامج أطول بثقة.'},
 {tier:'expert',title:'Final Mission',mission:'هذه آخر مهمة: أوصل الدواء إلى المستشفى بأقل عدد من الأخطاء. خطط أولاً ثم شغّل.',goal:'خطط → اكتب → اختبر → Debug',start:[1,6],dir:0,target:[10,1],obstacles:[[3,6],[3,5],[4,5],[6,5],[6,4],[6,3],[8,3],[9,3],[9,2]],palette:['takeoff','forward','forward2','right','left','repeat2','land'],recommended:['takeoff','left','forward2','forward2','right','forward2','forward2','forward2','forward','left','forward','right','forward2','land'],hint:'لا تبدأ بالسحب مباشرة. ارسم المسار بعينك أولاً.',success:'أنهيت جميع المهمات! أنت الآن Python Drone Expert.'}
];

const $ = s => document.querySelector(s);
const startScreen=$('#startScreen'),gameScreen=$('#gameScreen'),completeScreen=$('#completeScreen');
const programList=$('#programList'),emptyProgram=$('#emptyProgram'),feedback=$('#feedback');
const canvas=$('#arenaCanvas'),ctx=canvas.getContext('2d'),arenaMessage=$('#arenaMessage');

let currentLevel=0,completed=0,totalStars=0,levelAttempts=0,program=[],teamName='فريق الدرون';
let soundOn=true,running=false,execution=[],execIndex=0,drone=null;

function showScreen(el){[startScreen,gameScreen,completeScreen].forEach(x=>x.classList.remove('active'));el.classList.add('active')}
function meta(){return DIFFICULTIES[LEVELS[currentLevel].tier]}
function setFeedback(text,type=''){feedback.textContent=text;feedback.className='feedback show';if(type)feedback.classList.add(type)}
function clearFeedback(){feedback.textContent='';feedback.className='feedback'}
function beep(ok=true){
  if(!soundOn)return;
  try{const C=window.AudioContext||window.webkitAudioContext,a=new C(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=ok?700:190;o.type=ok?'sine':'square';g.gain.setValueAtTime(.05,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.15);o.start();o.stop(a.currentTime+.15)}catch(e){}
}
function confetti(){
  const colors=['#4f2db7','#5bded2','#f3b642','#2da160','#3c8fd1'];
  for(let i=0;i<65;i++){const e=document.createElement('i');e.className='confetti';e.style.left=Math.random()*100+'vw';e.style.background=colors[i%colors.length];e.style.animationDelay=Math.random()*.45+'s';document.body.appendChild(e);setTimeout(()=>e.remove(),2500)}
}

function buildTrack(){
  const w=$('#levelTrack');w.innerHTML='';
  LEVELS.forEach((_,i)=>{const n=document.createElement('div');n.className='level-node';if(i===3||i===6||i===9)n.classList.add('break');n.textContent=i+1;w.appendChild(n)})
}
function updateTrack(){
  document.querySelectorAll('.level-node').forEach((n,i)=>{n.classList.toggle('done',i<completed);n.classList.toggle('current',i===currentLevel&&completed<LEVELS.length);n.classList.toggle('locked',i>currentLevel)});
  $('#starScore').textContent=totalStars
}
function renderLevel(){
  const l=LEVELS[currentLevel],m=meta();levelAttempts=0;running=false;execIndex=0;
  $('#levelNumber').textContent=currentLevel+1;$('#levelTitle').textContent=l.title;
  $('#difficultyBadge').textContent=`${m.icon} ${m.label}`;$('#difficultyBadge').className=`difficulty-badge ${m.cls}`;
  $('#missionText').textContent=l.mission;$('#goalText').textContent=l.goal;$('#teamChip').textContent=teamName;
  renderPalette(l.palette);program=l.prefill?[...l.prefill]:[];renderProgram();resetSimulation();clearFeedback();updateTrack()
}
function renderPalette(ids){
  const w=$('#commandPalette');w.innerHTML='';
  ids.forEach(id=>{const c=COMMANDS[id],e=document.createElement('div');e.className='command-card';e.draggable=true;
    e.innerHTML=`<div class="command-icon">${c.icon}</div><div><strong>${c.label}</strong><small>${c.desc}</small></div>`;
    e.addEventListener('dragstart',ev=>{ev.dataTransfer.setData('text/command',id);ev.dataTransfer.effectAllowed='copy'});
    e.addEventListener('click',()=>{program.push(id);renderProgram()});w.appendChild(e)
  })
}

function renderProgram(){
  programList.innerHTML='';emptyProgram.classList.toggle('hidden',program.length>0);
  program.forEach((id,index)=>{const c=COMMANDS[id],e=document.createElement('div');e.className='program-block';e.draggable=true;
    e.innerHTML=`<code>${c.label}</code><button class="remove-block">×</button>`;
    e.querySelector('button').addEventListener('click',ev=>{ev.stopPropagation();program.splice(index,1);renderProgram()});
    e.addEventListener('dragstart',ev=>{e.classList.add('dragging');ev.dataTransfer.setData('text/reorder',String(index));ev.dataTransfer.effectAllowed='move'});
    e.addEventListener('dragend',()=>e.classList.remove('dragging'));
    e.addEventListener('dragover',ev=>ev.preventDefault());
    e.addEventListener('drop',ev=>{ev.preventDefault();const from=parseInt(ev.dataTransfer.getData('text/reorder'));if(Number.isInteger(from)&&from!==index){const [it]=program.splice(from,1);program.splice(index,0,it);renderProgram()}});
    programList.appendChild(e)
  });
  updatePythonPreview()
}
$('#programDropzone').addEventListener('dragover',e=>e.preventDefault());
$('#programDropzone').addEventListener('drop',e=>{e.preventDefault();const id=e.dataTransfer.getData('text/command');if(id&&COMMANDS[id]){program.push(id);renderProgram()}});

function expandProgram(){
  const out=[];
  for(let i=0;i<program.length;i++){
    const c=COMMANDS[program[i]];
    if(c.type==='repeat'){
      const next=program[i+1];
      if(next){for(let r=0;r<c.count;r++)out.push(next);i++}
    }else if(c.type==='repeatpair'){
      const first=program[i+1], second=program[i+2];
      if(first && second){
        for(let r=0;r<c.count;r++){out.push(first);out.push(second)}
        i+=2;
      }
    }else out.push(program[i])
  }
  return out
}
function updatePythonPreview(){
  const lines=['from djitellopy import Tello','from time import sleep','','drone = Tello()','drone.connect()',''];
  for(let i=0;i<program.length;i++){
    const id=program[i],c=COMMANDS[id];
    if(c.type==='repeat'){
      const next=program[i+1];
      lines.push(`for i in range(${c.count}):`);
      if(next){lines.push(`    ${COMMANDS[next].python}`);i++}
      else lines.push('    # اسحب أمراً بعد repeat');
    } else if(c.type==='repeatpair'){
      const first=program[i+1], second=program[i+2];
      lines.push(`for i in range(${c.count}):`);
      if(first && second){
        lines.push(`    ${COMMANDS[first].python}`);
        lines.push(`    ${COMMANDS[second].python}`);
        i+=2;
      } else lines.push('    # اسحب أمرين بعد repeat_pair');
    } else lines.push(c.python)
  }
  $('#pythonPreview').textContent=lines.join('\n')
}

function cell(x,y){return{x:60+x*GRID,y:65+y*GRID}}
function resetSimulation(){
  const l=LEVELS[currentLevel];drone={x:l.start[0],y:l.start[1],dir:l.dir,flying:false,landed:false,crashed:false,moves:0,battery:100};
  execution=expandProgram();execIndex=0;$('#movesBadge').textContent='Moves: 0';$('#batteryBadge').textContent='🔋 100%';arenaMessage.classList.add('hidden');drawArena()
}
function drawArena(){
  const l=LEVELS[currentLevel];ctx.clearRect(0,0,canvas.width,canvas.height);
  const g=ctx.createLinearGradient(0,0,0,canvas.height);g.addColorStop(0,'#faf8fd');g.addColorStop(1,'#eee9f8');ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#e3ddef';ctx.lineWidth=1;
  for(let x=0;x<=12;x++){const p=60+x*GRID;ctx.beginPath();ctx.moveTo(p,65);ctx.lineTo(p,465);ctx.stroke()}
  for(let y=0;y<=8;y++){const p=65+y*GRID;ctx.beginPath();ctx.moveTo(60,p);ctx.lineTo(660,p);ctx.stroke()}
  drawPad(l.start[0],l.start[1],'START','#2da160','#e9f8ef');drawPad(l.target[0],l.target[1],currentLevel===0?'LAND':'TARGET','#4f2db7','#f1edfb');
  l.obstacles.forEach(([x,y])=>drawObstacle(x,y));
  if(l.special==='square'){const pts=[[3,5],[4,5],[4,4],[3,4],[3,5]].map(([x,y])=>cell(x,y));ctx.save();ctx.strokeStyle='rgba(79,45,183,.25)';ctx.setLineDash([8,7]);ctx.lineWidth=3;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore()}
  drawDrone(drone.x,drone.y,drone.dir,drone.flying)
}
function drawPad(x,y,label,stroke,fill){const p=cell(x,y);ctx.save();ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y,28,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=stroke;ctx.font='bold 10px Tahoma';ctx.textAlign='center';ctx.fillText(label,p.x,p.y+4);ctx.restore()}
function drawObstacle(x,y){const p=cell(x,y);ctx.save();ctx.fillStyle='#fff3d8';ctx.strokeStyle='#e0a531';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(p.x-23,p.y-23,46,46,10);ctx.fill();ctx.stroke();ctx.fillStyle='#9a6900';ctx.font='bold 18px Tahoma';ctx.textAlign='center';ctx.fillText('⚠',p.x,p.y+7);ctx.restore()}
function drawDrone(x,y,dir,flying){
  const p=cell(x,y),ang=[0,Math.PI/2,Math.PI,-Math.PI/2][dir];ctx.save();ctx.translate(p.x,p.y);ctx.rotate(ang);
  if(flying){ctx.shadowColor='rgba(79,45,183,.3)';ctx.shadowBlur=14}
  ctx.strokeStyle='#25252b';ctx.lineWidth=5;ctx.lineCap='round';
  [[-18,-12,18,12],[-18,12,18,-12]].forEach(a=>{ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(a[2],a[3]);ctx.stroke()});
  ctx.fillStyle='#4f2db7';ctx.beginPath();ctx.roundRect(-17,-12,34,24,8);ctx.fill();
  [[-21,-14],[21,-14],[-21,14],[21,14]].forEach(([rx,ry])=>{ctx.fillStyle='#1e1e24';ctx.beginPath();ctx.arc(rx,ry,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(79,45,183,.75)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(rx,ry,12,3,0,0,Math.PI*2);ctx.stroke()});
  ctx.fillStyle='#5bded2';ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(12,-5);ctx.lineTo(12,5);ctx.closePath();ctx.fill();ctx.restore()
}
function obstacleAt(x,y){return LEVELS[currentLevel].obstacles.some(([ox,oy])=>ox===x&&oy===y)}
function arenaMsg(text,good=false){arenaMessage.textContent=text;arenaMessage.classList.remove('hidden');arenaMessage.style.color=good?'#2da160':'#4f2db7';setTimeout(()=>arenaMessage.classList.add('hidden'),1200)}
function applyCommand(id){
  const c=COMMANDS[id];
  if(c.type==='takeoff'){if(drone.flying)return{ok:false,msg:'الدرون في الجو بالفعل'};drone.flying=true;drone.landed=false;return{ok:true,msg:'TAKEOFF 🚁'}}
  if(c.type==='land'){if(!drone.flying)return{ok:false,msg:'يجب الإقلاع أولاً'};drone.flying=false;drone.landed=true;return{ok:true,msg:'LAND 🛬'}}
  if(!drone.flying)return{ok:false,msg:'يجب الإقلاع أولاً!'};
  if(c.type==='wait')return{ok:true,msg:'WAIT ⏸️'};
  if(c.type==='turn'){drone.dir=(drone.dir+c.amount+4)%4;drone.moves++;drone.battery=Math.max(0,drone.battery-1);return{ok:true,msg:c.amount>0?'TURN RIGHT ↷':'TURN LEFT ↶'}}
  if(c.type==='move'){
    const dirs=[[1,0],[0,1],[-1,0],[0,-1]];
    for(let s=0;s<c.dist;s++){const nx=drone.x+dirs[drone.dir][0],ny=drone.y+dirs[drone.dir][1];if(nx<0||nx>11||ny<0||ny>7||obstacleAt(nx,ny)){drone.crashed=true;return{ok:false,msg:'⚠ اصطدام! Debug الكود'}}drone.x=nx;drone.y=ny;drone.moves++;drone.battery=Math.max(0,drone.battery-2)}
    return{ok:true,msg:'MOVE ⬆️'}
  }
  return{ok:true,msg:''}
}
function missionSuccess(){
  const l=LEVELS[currentLevel],target=drone.x===l.target[0]&&drone.y===l.target[1],req=!l.requireCommand||program.includes(l.requireCommand),blocks=!l.maxBlocks||program.length<=l.maxBlocks;
  return target&&drone.landed&&!drone.crashed&&req&&blocks
}
function failText(){
  const l=LEVELS[currentLevel];
  if(drone.crashed)return'حدث اصطدام. راجع ترتيب الأوامر وجرب طريقاً آخر.';
  if(!drone.landed)return'وصل البرنامج للنهاية بدون هبوط. أضف drone.land().';
  if(drone.x!==l.target[0]||drone.y!==l.target[1])return'هبط الدرون، لكن ليس داخل الهدف. عدّل المسار.';
  if(l.requireCommand&&!program.includes(l.requireCommand))return'المسار صحيح، لكن المطلوب استخدام التكرار في هذا المستوى.';
  if(l.maxBlocks&&program.length>l.maxBlocks)return`نجحت الرحلة، لكن حاول إنجازها بـ ${l.maxBlocks} بلوكات فقط.`;
  return'قريب جداً! راجع البرنامج وحاول مرة أخرى.'
}

async function runProgram(){
  if(running||program.length===0)return;running=true;levelAttempts++;resetSimulation();execution=expandProgram();
  for(execIndex=0;execIndex<execution.length;execIndex++){const r=applyCommand(execution[execIndex]);$('#movesBadge').textContent=`Moves: ${drone.moves}`;$('#batteryBadge').textContent=`🔋 ${drone.battery}%`;drawArena();arenaMsg(r.msg,r.ok);beep(r.ok);await new Promise(res=>setTimeout(res,r.ok?600:800));if(!r.ok)break}
  running=false;if(missionSuccess())levelSuccess();else setFeedback(failText(),'bad')
}
function runStep(){
  if(running)return;
  if(execIndex===0)resetSimulation();
  execution=expandProgram();
  if(execIndex>=execution.length){if(missionSuccess())levelSuccess();else setFeedback(failText(),'bad');return}
  const r=applyCommand(execution[execIndex]);execIndex++;$('#movesBadge').textContent=`Moves: ${drone.moves}`;$('#batteryBadge').textContent=`🔋 ${drone.battery}%`;drawArena();arenaMsg(r.msg,r.ok);beep(r.ok);
  if(!r.ok){levelAttempts++;setFeedback(r.msg,'bad')}
  if(execIndex>=execution.length)setTimeout(()=>{if(missionSuccess())levelSuccess();else setFeedback(failText(),'bad')},350)
}

function levelStars(){if(levelAttempts<=1)return 3;if(levelAttempts===2)return 2;return 1}
function levelSuccess(){
  const l=LEVELS[currentLevel],m=meta(),earned=levelStars();$('#successBadge').textContent=`${m.icon} ${m.label}`;$('#successBadge').className=`difficulty-badge ${m.cls}`;
  $('#successTitle').textContent=`تمت المهمة ${currentLevel+1}!`;$('#successText').textContent=l.success;$('#earnedStars').textContent='⭐'.repeat(earned)+'☆'.repeat(3-earned);
  $('#nextBtn').textContent=currentLevel===LEVELS.length-1?'إنهاء اللعبة ★':'المستوى التالي ←';$('#successModal').classList.add('show');beep(true);confetti()
}
function nextLevel(){
  totalStars+=levelStars();completed++;$('#successModal').classList.remove('show');
  if(completed>=LEVELS.length){finishGame();return}
  currentLevel++;if(currentLevel===3||currentLevel===6||currentLevel===9)showStage();else renderLevel()
}
function showStage(){
  const m=meta();$('#stageIcon').textContent=m.icon;$('#stageTitle').textContent=m.label;
  $('#stageText').textContent=currentLevel===3?'الآن ستظهر عوائق. فكر في المسار قبل كتابة الكود.':currentLevel===6?'حان وقت التكرار وDebugging. سنجعل البرامج أقصر وأذكى.':'المرحلة الأخيرة! المهمات أطول، لكن كل شيء تعلمته يكفي لحلها.';
  $('#stageModal').classList.add('show')
}
function finishGame(){$('#finalStars').textContent=totalStars;$('#completeText').textContent=`${teamName} — أنهيتم جميع المهمات من أول Takeoff حتى Final Mission.`;showScreen(completeScreen);confetti()}

$('#startBtn').addEventListener('click',()=>{teamName=$('#teamInput').value.trim()||'فريق الدرون';currentLevel=0;completed=0;totalStars=0;showScreen(gameScreen);renderLevel()});
$('#homeBtn').addEventListener('click',()=>{if(!running)showScreen(startScreen)});
$('#soundBtn').addEventListener('click',()=>{soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'🔊':'🔇'});
$('#runBtn').addEventListener('click',runProgram);$('#stepBtn').addEventListener('click',runStep);
$('#resetBtn').addEventListener('click',()=>{if(!running){execIndex=0;resetSimulation();clearFeedback()}});
$('#clearBtn').addEventListener('click',()=>{if(!running){program=[];renderProgram();execIndex=0;resetSimulation()}});
$('#hintBtn').addEventListener('click',()=>setFeedback(`💡 ${LEVELS[currentLevel].hint}`));
$('#solutionBtn').addEventListener('click',()=>{const first=LEVELS[currentLevel].recommended?.[0];setFeedback(first?`ابدأ بهذا الأمر: ${COMMANDS[first].label}`:'فكّر في أول خطوة من الحل.')});
$('#nextBtn').addEventListener('click',nextLevel);
$('#stageContinueBtn').addEventListener('click',()=>{$('#stageModal').classList.remove('show');renderLevel()});
$('#playAgainBtn').addEventListener('click',()=>showScreen(startScreen));

buildTrack();updateTrack();updatePythonPreview();
