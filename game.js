const GRID = 50;

// Direction: 0=east, 1=south, 2=west, 3=north
const LEVELS = [
  {tier:'easy',title:'الإقلاع الأول',mission:'أقلع، تحرك إلى منصة الهدف القريبة، ثم اهبط.',start:[1,6],dir:0,target:[3,6],obstacles:[]},
  {tier:'easy',title:'انعطف يميناً',mission:'الهدف ليس أمامك مباشرة. استخدم الدوران للوصول إليه.',start:[1,5],dir:0,target:[4,7],obstacles:[]},
  {tier:'easy',title:'الطريق الطويل',mission:'صل إلى المستشفى في الجهة الأخرى بأقل عدد من الحركات.',start:[1,6],dir:0,target:[8,6],obstacles:[]},

  {tier:'medium',title:'الصخرة الأولى',mission:'الطريق المباشر مسدود. جد أقصر طريق حول الصخرة.',start:[1,6],dir:0,target:[6,6],obstacles:[[3,6]]},
  {tier:'medium',title:'ممران',mission:'اختر المسار الأقصر بين العوائق للوصول إلى الهدف.',start:[1,6],dir:0,target:[7,3],obstacles:[[3,6],[3,5],[5,4],[5,3]]},
  {tier:'medium',title:'منطقة الإنقاذ',mission:'اعبر بين العوائق ووصل إلى منطقة الإنقاذ دون اصطدام.',start:[1,6],dir:0,target:[8,2],obstacles:[[3,6],[3,5],[3,4],[5,4],[6,4],[7,4]]},

  {tier:'hard',title:'الممر الضيق',mission:'يوجد ممر واحد آمن. ابحث عنه وحاول تحقيق أقل عدد من الحركات.',start:[1,6],dir:0,target:[9,1],obstacles:[[3,6],[3,5],[4,5],[5,5],[5,4],[5,3],[7,3],[8,3],[8,2]]},
  {tier:'hard',title:'حول الجدار',mission:'الجدار يمنع الطريق المباشر. التف حوله بأقصر مسار.',start:[1,6],dir:0,target:[9,6],obstacles:[[4,4],[4,5],[4,6],[4,7],[6,5],[6,6],[6,7]]},
  {tier:'hard',title:'مهمة المستشفى',mission:'أوصل الدواء إلى المستشفى عبر المنطقة المليئة بالعوائق.',start:[1,6],dir:0,target:[10,1],obstacles:[[3,6],[3,5],[4,5],[6,5],[6,4],[6,3],[8,3],[9,3],[9,2]]},

  {tier:'expert',title:'المتاهة',mission:'خطط قبل التحرك. أي حركة زائدة ستبعدك عن أفضل نتيجة.',start:[1,6],dir:0,target:[10,1],obstacles:[[2,4],[3,4],[4,4],[4,5],[6,6],[6,5],[6,4],[7,4],[8,4],[8,3],[8,2]]},
  {tier:'expert',title:'مسار الطوارئ',mission:'اختر الطريق الأسرع للوصول إلى فريق الطوارئ.',start:[1,7],dir:3,target:[10,0],obstacles:[[2,5],[3,5],[4,5],[4,4],[4,3],[6,2],[7,2],[8,2],[8,1]]},
  {tier:'expert',title:'Final Rescue',mission:'المهمة الأخيرة. أوصل الدواء بأقل عدد ممكن من الحركات ثم اهبط.',start:[0,7],dir:0,target:[11,0],obstacles:[[2,7],[2,6],[2,5],[4,4],[5,4],[6,4],[6,3],[8,2],[9,2],[10,2]]}
];

const META = {
  easy:{label:'مبتدئ',icon:'🌱',cls:'easy'},
  medium:{label:'مستكشف',icon:'🧭',cls:'medium'},
  hard:{label:'متقدم',icon:'💻',cls:'hard'},
  expert:{label:'خبير',icon:'🏆',cls:'expert'}
};

const $ = s => document.querySelector(s);
const canvas = $('#arenaCanvas');
const ctx = canvas.getContext('2d');
const startScreen = $('#startScreen');
const gameScreen = $('#gameScreen');
const completeScreen = $('#completeScreen');

let currentLevel = 0;
let completed = 0;
let totalStars = 0;
let totalMoves = 0;
let teamName = 'فريق الدرون';
let soundOn = true;
let drone;
let attempts = 1;
let levelStartTime = 0;
let timerId = null;
let levelFinished = false;

function showScreen(el){
  [startScreen,gameScreen,completeScreen].forEach(x=>x.classList.remove('active'));
  el.classList.add('active');
}

function beep(good=true){
  if(!soundOn) return;
  try{
    const C=window.AudioContext||window.webkitAudioContext;
    const ac=new C(),o=ac.createOscillator(),g=ac.createGain();
    o.connect(g);g.connect(ac.destination);o.type=good?'sine':'square';o.frequency.value=good?690:190;
    g.gain.setValueAtTime(.055,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.16);
    o.start();o.stop(ac.currentTime+.16);
  }catch(e){}
}

function confetti(){
  const colors=['#4f2db7','#5bded2','#f3b642','#2da160','#3c8fd1'];
  for(let i=0;i<70;i++){
    const c=document.createElement('i');c.className='confetti';
    c.style.left=Math.random()*100+'vw';c.style.background=colors[i%colors.length];
    c.style.animationDelay=Math.random()*.5+'s';document.body.appendChild(c);
    setTimeout(()=>c.remove(),2500);
  }
}

function buildTrack(){
  const wrap=$('#levelTrack');wrap.innerHTML='';
  LEVELS.forEach((_,i)=>{
    const n=document.createElement('div');n.className='level-node';
    if(i===3||i===6||i===9)n.classList.add('break');
    n.textContent=i+1;wrap.appendChild(n);
  });
}

function updateTrack(){
  document.querySelectorAll('.level-node').forEach((n,i)=>{
    n.classList.toggle('done',i<completed);
    n.classList.toggle('current',i===currentLevel&&completed<LEVELS.length);
    n.classList.toggle('locked',i>currentLevel);
  });
  $('#totalStars').textContent=totalStars;
}

function setFeedback(text,type=''){
  const f=$('#feedback');f.textContent=text;f.className='feedback show';if(type)f.classList.add(type);
}
function clearFeedback(){const f=$('#feedback');f.textContent='';f.className='feedback'}

function startTimer(){
  if(timerId)clearInterval(timerId);
  levelStartTime=Date.now();
  timerId=setInterval(()=>{
    const sec=Math.floor((Date.now()-levelStartTime)/1000);
    $('#timerBadge').textContent='⏱ '+String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');
  },250);
}
function stopTimer(){if(timerId){clearInterval(timerId);timerId=null}}

function computePar(level){
  const [sx,sy]=level.start,[tx,ty]=level.target;
  const blocked=new Set(level.obstacles.map(([x,y])=>`${x},${y}`));
  const q=[[sx,sy,0]],seen=new Set([`${sx},${sy}`]);
  while(q.length){
    const [x,y,d]=q.shift();
    if(x===tx&&y===ty)return d;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,ny=y+dy,k=`${nx},${ny}`;
      if(nx<0||nx>11||ny<0||ny>7||blocked.has(k)||seen.has(k))continue;
      seen.add(k);q.push([nx,ny,d+1]);
    }
  }
  return null;
}

function renderLevel(){
  const l=LEVELS[currentLevel],m=META[l.tier];
  $('#levelNumber').textContent=currentLevel+1;
  $('#levelTitle').textContent=l.title;
  $('#difficultyBadge').textContent=`${m.icon} ${m.label}`;
  $('#difficultyBadge').className=`difficulty-badge ${m.cls}`;
  $('#missionText').textContent=l.mission;
  $('#teamChip').textContent=teamName;
  $('#parCount').textContent=computePar(l);
  attempts=1;
  $('#attemptCount').textContent=attempts;
  levelFinished=false;
  resetLevel(false);
  updateTrack();
}

function resetLevel(countAttempt=true){
  if(countAttempt){attempts++;$('#attemptCount').textContent=attempts}
  const l=LEVELS[currentLevel];
  drone={x:l.start[0],y:l.start[1],dir:l.dir,flying:false,moves:0,battery:100,crashed:false};
  $('#moveCount').textContent='0';
  $('#batteryBadge').textContent='🔋 100%';
  $('#flightStatus').textContent='على الأرض';
  $('#pythonCommand').textContent='# ابدأ بالإقلاع';
  $('#timerBadge').textContent='⏱ 00:00';
  clearFeedback();
  levelFinished=false;
  startTimer();
  drawArena();
}

function cell(x,y){return{x:70+x*55,y:78+y*55}}

function drawArena(){
  const l=LEVELS[currentLevel];
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const grad=ctx.createLinearGradient(0,0,0,canvas.height);
  grad.addColorStop(0,'#faf8fd');grad.addColorStop(1,'#eee9f8');
  ctx.fillStyle=grad;ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.strokeStyle='#e3ddef';ctx.lineWidth=1;
  for(let x=0;x<=12;x++){const px=70+x*55;ctx.beginPath();ctx.moveTo(px,78);ctx.lineTo(px,518);ctx.stroke()}
  for(let y=0;y<=8;y++){const py=78+y*55;ctx.beginPath();ctx.moveTo(70,py);ctx.lineTo(730,py);ctx.stroke()}

  drawPad(l.start[0],l.start[1],'START','#2da160','#e9f8ef');
  drawPad(l.target[0],l.target[1],'TARGET','#4f2db7','#f1edfb');

  l.obstacles.forEach(([x,y])=>drawObstacle(x,y));
  drawDrone();
}

function drawPad(x,y,label,stroke,fill){
  const p=cell(x,y);
  ctx.save();ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(p.x,p.y,29,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle=stroke;ctx.font='bold 10px Tahoma';ctx.textAlign='center';ctx.fillText(label,p.x,p.y+4);ctx.restore();
}

function drawObstacle(x,y){
  const p=cell(x,y);
  ctx.save();ctx.fillStyle='#fff3d8';ctx.strokeStyle='#dfa431';ctx.lineWidth=3;
  ctx.beginPath();ctx.roundRect(p.x-24,p.y-24,48,48,11);ctx.fill();ctx.stroke();
  ctx.fillStyle='#966400';ctx.font='bold 19px Tahoma';ctx.textAlign='center';ctx.fillText('⚠',p.x,p.y+7);ctx.restore();
}

function drawDrone(){
  const p=cell(drone.x,drone.y);
  const angle=[0,Math.PI/2,Math.PI,-Math.PI/2][drone.dir];
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(angle);
  if(drone.flying){ctx.shadowColor='rgba(79,45,183,.3)';ctx.shadowBlur=16}
  ctx.strokeStyle='#222228';ctx.lineWidth=5;ctx.lineCap='round';
  [[-20,-13,20,13],[-20,13,20,-13]].forEach(a=>{ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(a[2],a[3]);ctx.stroke()});
  ctx.fillStyle='#4f2db7';ctx.beginPath();ctx.roundRect(-18,-13,36,26,8);ctx.fill();
  [[-23,-15],[23,-15],[-23,15],[23,15]].forEach(([x,y])=>{
    ctx.fillStyle='#1d1d22';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(79,45,183,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,13,3,0,0,Math.PI*2);ctx.stroke();
  });
  ctx.fillStyle='#5bded2';ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(13,-6);ctx.lineTo(13,6);ctx.closePath();ctx.fill();
  ctx.restore();
}

function blocked(x,y){
  return LEVELS[currentLevel].obstacles.some(([ox,oy])=>ox===x&&oy===y);
}

function toast(text,good=false){
  const t=$('#arenaToast');t.textContent=text;t.classList.remove('hidden');t.style.color=good?'#2da160':'#4f2db7';
  setTimeout(()=>t.classList.add('hidden'),1100);
}

function updateStats(){
  $('#moveCount').textContent=drone.moves;
  $('#batteryBadge').textContent=`🔋 ${drone.battery}%`;
  $('#flightStatus').textContent=drone.flying?'في الجو':'على الأرض';
}

function actionTakeoffLand(){
  if(levelFinished)return;
  if(!drone.flying){
    drone.flying=true;
    $('#pythonCommand').textContent='drone.takeoff()';
    toast('TAKEOFF 🚁',true);beep(true);updateStats();drawArena();
  }else{
    drone.flying=false;
    $('#pythonCommand').textContent='drone.land()';
    toast('LAND 🛬',true);beep(true);updateStats();drawArena();
    checkLanding();
  }
}

function actionForward(){
  if(levelFinished)return;
  if(!drone.flying){toast('أقلع أولاً!');setFeedback('اضغط SPACE للإقلاع أولاً.','bad');beep(false);return}

  const dirs=[[1,0],[0,1],[-1,0],[0,-1]];
  const nx=drone.x+dirs[drone.dir][0],ny=drone.y+dirs[drone.dir][1];
  $('#pythonCommand').textContent='drone.move_forward(50)';

  if(nx<0||nx>11||ny<0||ny>7||blocked(nx,ny)){
    toast('⚠ BLOCKED');setFeedback('الطريق مسدود. غيّر الاتجاه وحاول مرة أخرى.','bad');beep(false);return;
  }

  drone.x=nx;drone.y=ny;drone.moves++;drone.battery=Math.max(0,drone.battery-2);
  toast('FORWARD ⬆️',true);beep(true);updateStats();drawArena();
}

function actionTurn(amount){
  if(levelFinished)return;
  if(!drone.flying){toast('أقلع أولاً!');setFeedback('اضغط SPACE للإقلاع أولاً.','bad');beep(false);return}
  drone.dir=(drone.dir+amount+4)%4;
  $('#pythonCommand').textContent=amount>0?'drone.rotate_clockwise(90)':'drone.rotate_counter_clockwise(90)';
  toast(amount>0?'TURN RIGHT ↷':'TURN LEFT ↶',true);beep(true);drawArena();
}

function checkLanding(){
  const l=LEVELS[currentLevel];
  if(drone.x===l.target[0]&&drone.y===l.target[1]){
    finishLevel();
  }else{
    setFeedback('هبطت بأمان، لكنك لست على الهدف. أقلع وحاول الوصول إليه.','bad');
  }
}

function starsForMoves(moves,par){
  if(moves===par)return 3;
  if(moves<=par+2)return 2;
  return 1;
}

function finishLevel(){
  levelFinished=true;stopTimer();
  const l=LEVELS[currentLevel],m=META[l.tier],par=computePar(l),earned=starsForMoves(drone.moves,par);

  $('#resultBadge').textContent=`${m.icon} ${m.label}`;
  $('#resultBadge').className=`difficulty-badge ${m.cls}`;
  $('#resultTitle').textContent=`تمت المهمة ${currentLevel+1}!`;
  $('#resultText').textContent='وصل الدرون إلى الهدف وهبط بنجاح.';
  $('#resultMoves').textContent=drone.moves;
  $('#resultPar').textContent=par;
  $('#earnedStars').textContent='⭐'.repeat(earned)+'☆'.repeat(3-earned);

  let msg='';
  if(drone.moves===par)msg='🏆 أفضل مسار ممكن! لم تضيع أي حركة.';
  else if(drone.moves<=par+2)msg=`قريب جداً! يمكنك تقليل ${drone.moves-par} حركة.`;
  else msg=`نجحت! جرّب مرة أخرى لاحقاً للوصول إلى ${par} حركات.`;
  $('#resultMessage').textContent=msg;

  $('#nextBtn').textContent=currentLevel===LEVELS.length-1?'إنهاء التحدي ★':'المستوى التالي ←';
  $('#resultModal').classList.add('show');beep(true);confetti();
}

function nextLevel(){
  const par=computePar(LEVELS[currentLevel]);
  totalStars+=starsForMoves(drone.moves,par);
  totalMoves+=drone.moves;
  completed++;
  $('#resultModal').classList.remove('show');

  if(completed>=LEVELS.length){finishGame();return}
  currentLevel++;
  if(currentLevel===3||currentLevel===6||currentLevel===9)showStage();
  else renderLevel();
}

function showStage(){
  const m=META[LEVELS[currentLevel].tier];
  $('#stageIcon').textContent=m.icon;
  $('#stageTitle').textContent=m.label;
  $('#stageText').textContent=
    currentLevel===3?'الآن تظهر العوائق. ابحث عن أقصر مسار قبل التحرك.'
    :currentLevel===6?'المسارات أصبحت أطول. كل حركة إضافية تؤثر على نتيجتك.'
    :'المرحلة الأخيرة! خطط جيداً وحاول الوصول إلى أفضل عدد من الحركات.';
  $('#stageModal').classList.add('show');
}

function finishGame(){
  $('#finalStars').textContent=totalStars;
  $('#finalMoves').textContent=totalMoves;
  $('#completeText').textContent=`${teamName} — أنهيتم 12 مهمة. حاولوا إعادة التحدي وتحطيم عدد الحركات!`;
  showScreen(completeScreen);confetti();
}

function handleKey(key){
  if(!gameScreen.classList.contains('active')||$('#resultModal').classList.contains('show')||$('#stageModal').classList.contains('show'))return;
  if(key===' '||key==='Spacebar'){actionTakeoffLand();return}
  if(key==='ArrowUp'||key==='w'||key==='W'){actionForward();return}
  if(key==='ArrowLeft'||key==='a'||key==='A'){actionTurn(-1);return}
  if(key==='ArrowRight'||key==='d'||key==='D'){actionTurn(1);return}
  if(key==='r'||key==='R'){resetLevel(true);return}
}

document.addEventListener('keydown',e=>{
  if(['ArrowUp','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();
  handleKey(e.key);
});

document.querySelectorAll('.key-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const a=btn.dataset.action;
    if(a==='space')actionTakeoffLand();
    if(a==='up')actionForward();
    if(a==='left')actionTurn(-1);
    if(a==='right')actionTurn(1);
  });
});

$('#startBtn').addEventListener('click',()=>{
  teamName=$('#teamInput').value.trim()||'فريق الدرون';
  currentLevel=0;completed=0;totalStars=0;totalMoves=0;
  showScreen(gameScreen);renderLevel();
});
$('#resetBtn').addEventListener('click',()=>resetLevel(true));
$('#nextBtn').addEventListener('click',nextLevel);
$('#stageContinueBtn').addEventListener('click',()=>{$('#stageModal').classList.remove('show');renderLevel()});
$('#playAgainBtn').addEventListener('click',()=>showScreen(startScreen));
$('#homeBtn').addEventListener('click',()=>{stopTimer();showScreen(startScreen)});
$('#soundBtn').addEventListener('click',()=>{soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'🔊':'🔇'});

buildTrack();
updateTrack();
