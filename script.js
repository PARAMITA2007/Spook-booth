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

