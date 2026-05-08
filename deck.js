(function(){
  var D=document.getElementById('D'),
      ss=D.querySelectorAll('.S'),
      nv=document.getElementById('nv'),
      sn=document.getElementById('sn'),
      N=ss.length,cur=0,lk=false;
  for(var i=0;i<N;i++){
    var b=document.createElement('button');
    b.className='dt'+(i===0?' on':'');
    b.setAttribute('data-x',i);
    nv.appendChild(b);
  }
  nv.addEventListener('click',function(e){
    var t=e.target.closest('.dt');
    if(t)go(+t.getAttribute('data-x'));
  });
  function go(n){
    if(n===cur||n<0||n>=N||lk)return;
    lk=true;
    ss[cur].classList.add('out');
    ss[cur].classList.remove('on');
    var nx=ss[n];
    setTimeout(function(){nx.classList.add('on');},60);
    setTimeout(function(){
      for(var j=0;j<N;j++)if(j!==n)ss[j].classList.remove('out');
      lk=false;
    },460);
    cur=n;
    sn.textContent=String(cur+1).padStart(2,'0')+' / '+String(N).padStart(2,'0');
    var ds=nv.querySelectorAll('.dt');
    for(var i=0;i<ds.length;i++)ds[i].className='dt'+(i===cur?' on':'');
  }
  var nbuf='',ntmr=null;
  function commitNum(){
    if(!nbuf)return;
    var n=parseInt(nbuf,10);
    nbuf='';if(ntmr){clearTimeout(ntmr);ntmr=null;}
    if(n>=1&&n<=N)go(n-1);
  }
  D.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();go((cur+1)%N);return;}
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();go((cur-1+N)%N);return;}
    if(/^[0-9]$/.test(e.key)){
      e.preventDefault();
      nbuf+=e.key;
      if(ntmr)clearTimeout(ntmr);
      var v=parseInt(nbuf,10);
      if(v*10>N||v===0){commitNum();}
      else{ntmr=setTimeout(commitNum,500);}
    }
  });
  var wlk=false,wtmr=null;
  D.addEventListener('wheel',function(e){
    e.preventDefault();
    if(wlk||lk)return;
    var d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
    if(Math.abs(d)<8)return;
    wlk=true;
    if(d<0)go((cur+1)%N);else go((cur-1+N)%N);
    if(wtmr)clearTimeout(wtmr);
    wtmr=setTimeout(function(){wlk=false;},500);
  },{passive:false});
  D.addEventListener('click',function(e){
    if(e.target.closest('.nv')||e.target.closest('a'))return;
    go((cur+1)%N);
  });
  var tx=0;
  D.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
  D.addEventListener('touchend',function(e){
    var d=e.changedTouches[0].clientX-tx;
    if(Math.abs(d)>50){d<0?go(cur+1):go(cur-1);}
  },{passive:true});
  D.focus();
})();
