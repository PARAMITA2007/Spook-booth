const THEMES={Pumpkin:["#ff7a2b","#1a0a00"],Midnight:["#0d0d26","#ff9a4d"],Bone:["#f1e9ff","#1d1030"],Blood:["#7a0f22","#ffd1a0"],Slime:["#b6f23c","#14230a"]};
const FILTERS={None:"none",Noir:"grayscale(1) contrast(1.3)",Vampire:"sepia(.8) hue-rotate(-25deg) saturate(1.6) contrast(1.1)",Ghost:"brightness(1.15) contrast(.85) saturate(.4)",Toxic:"hue-rotate(80deg) saturate(1.6)",Candlelight:"sepia(.55) saturate(1.3) brightness(.95)"};
const STICKERS=["🎃","👻","🦇","🕸️","💀","🏰","🗝️"];
const $=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms));
let n=3,shots=[],theme="Pumpkin",filter="None",stk=new Set(["🎃","🦇"]),stream=null,busy=false;
const v=$("#v"),cv=$("#strip"),ctx=cv.getContext("2d");
const gate=$("#gate");
$("#enter").onclick=()=>{$("#g1").hidden=true;$("#g2").hidden=false;$("#allow").focus()};
$("#skip").onclick=()=>gate.classList.add("out");
$("#allow").onclick=async()=>{if(await startCam())gate.classList.add("out");else $("#gerr").textContent="Camera access was blocked. Allow it in your browser’s address bar, or choose Not now to upload photos instead."};

Object.entries(THEMES).forEach(([k,[bg]])=>{const b=document.createElement("button");b.style.background=bg;b.title=k;b.setAttribute("aria-label",k+" strip");b.setAttribute("aria-pressed",k===theme);b.onclick=()=>{theme=k;document.querySelectorAll("#sw button").forEach(x=>x.setAttribute("aria-pressed",x===b));draw()};$("#sw").append(b)});
Object.keys(FILTERS).forEach(k=>$("#filter").append(new Option(k,k)));
STICKERS.forEach(s=>{const b=document.createElement("button");b.textContent=s;b.setAttribute("aria-label","Sticker "+s);b.setAttribute("aria-pressed",stk.has(s));b.onclick=()=>{stk.has(s)?stk.delete(s):stk.add(s);b.setAttribute("aria-pressed",stk.has(s));draw()};$("#stk").append(b)});
document.querySelectorAll("[name=n]").forEach(r=>r.onchange=()=>{n=+r.value;shots=[];thumbs();draw()});
$("#filter").onchange=e=>{filter=e.target.value;v.style.filter=FILTERS[filter];draw()};
["#cap","#date","#mir"].forEach(s=>$(s).addEventListener("input",()=>{v.classList.toggle("nomirror",!$("#mir").checked);draw()}));

async function startCam(){
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280}},audio:false});
    v.srcObject=stream;$("#msg").hidden=true;$("#shootBtn").disabled=false;$("#camBtn").disabled=true;return true;
  }catch(e){$("#msg").textContent="Camera is blocked or missing. Allow camera access in your browser, or upload photos instead.";return false}
}
$("#camBtn").onclick=startCam;
function grab(src,w,h){const c=document.createElement("canvas");c.width=640;c.height=480;const x=c.getContext("2d"),s=Math.max(640/w,480/h);
  x.drawImage(src,(640-w*s)/2,(480-h*s)/2,w*s,h*s);return c}
async function session(){
  if(busy)return;busy=true;shots=[];thumbs();draw();$("#shootBtn").disabled=true;
  for(let i=0;i<n;i++){
    for(let t=3;t>0;t--){$("#count").textContent=t;await sleep(900)}
    $("#count").textContent="";const f=$("#flash");f.classList.remove("go");void f.offsetWidth;f.classList.add("go");
    shots.push(grab(v,v.videoWidth,v.videoHeight));thumbs();draw();await sleep(700);
  }
  busy=false;$("#shootBtn").disabled=false;
}
$("#shootBtn").onclick=session;
$("#up").onchange=async e=>{
  const room=n-shots.length,files=[...e.target.files];
  if(room<=0){$("#hint").textContent="Your strip is full. Remove a photo first, or switch to 6 photos.";e.target.value="";return}
  for(const f of files.slice(0,room)){
    const img=new Image();img.src=URL.createObjectURL(f);await img.decode().catch(()=>{});
    if(img.width)shots.push(grab(img,img.width,img.height));
  }
  $("#hint").textContent=files.length>room?`Added ${room}. The rest didn’t fit in a ${n}-photo strip.`:`${shots.length} of ${n} photos added.`;
  thumbs();draw();e.target.value="";
};
$("#reset").onclick=()=>{shots=[];thumbs();draw()};
function thumbs(){$("#thumbs").replaceChildren(...shots.map((s,i)=>{const c=document.createElement("canvas");c.width=64;c.height=48;c.getContext("2d").drawImage(s,0,0,64,48);const b=document.createElement("button");b.className="th";b.title="Remove this photo";b.setAttribute("aria-label","Remove photo "+(i+1));b.append(c);b.onclick=()=>{if(busy)return;shots.splice(i,1);thumbs();draw()};return b}))}

// Shots stay raw, so every customization re-renders without retaking.
function draw(){
  const [bg,fg]=THEMES[theme],pw=300,ph=225,pad=22,gap=14,cols=n===6?2:1,rows=n/cols,foot=100;
  cv.width=pad*2+cols*pw+(cols-1)*gap;cv.height=pad+rows*ph+(rows-1)*gap+foot;
  ctx.fillStyle=bg;ctx.fillRect(0,0,cv.width,cv.height);
  ctx.strokeStyle=fg;ctx.lineWidth=2;ctx.strokeRect(7,7,cv.width-14,cv.height-14);
  const corners=[[8,30],[pw-36,30],[8,ph-10],[pw-36,ph-10]];
  for(let i=0;i<n;i++){
    const x=pad+(i%cols)*(pw+gap),y=pad+Math.floor(i/cols)*(ph+gap),s=shots[i];
    ctx.fillStyle="#050302";ctx.fillRect(x,y,pw,ph);
    if(s){ctx.save();ctx.filter=FILTERS[filter];
      if($("#mir").checked){ctx.translate(x+pw,y);ctx.scale(-1,1);ctx.drawImage(s,0,0,pw,ph)}else ctx.drawImage(s,x,y,pw,ph);
      ctx.restore();
      ctx.font="28px serif";[...stk].forEach((e,k)=>{const c=corners[(i+k)%4];ctx.fillText(e,x+c[0],y+c[1])});
    }else{ctx.fillStyle="#4a3716";ctx.font="40px serif";ctx.textAlign="center";ctx.fillText("👻",x+pw/2,y+ph/2+14);ctx.textAlign="left"}
    ctx.strokeStyle=fg;ctx.lineWidth=3;ctx.strokeRect(x,y,pw,ph);
  }
  ctx.fillStyle=fg;ctx.textAlign="center";
  ctx.font="32px Creepster,cursive";ctx.fillText($("#cap").value||"Spook Booth",cv.width/2,cv.height-52,cv.width-40);
  if($("#date").checked){ctx.font="15px Rubik,sans-serif";ctx.fillText(new Date().toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"}),cv.width/2,cv.height-26)}
  ctx.textAlign="left";
  $("#dl").disabled=$("#reset").disabled=!shots.length;
}

// Save the strip as a PNG file.
$("#dl").onclick=()=>cv.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="spook-booth-strip.png";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)},"image/png");
document.fonts.ready.then(draw);draw();
