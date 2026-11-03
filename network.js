const nodes = [
  { name: 'Client', icon: '>_', title: 'Start with the requirement.', copy: 'A request starts with a real need. My client-facing work includes requirements clarification and delivering bespoke benefits configurations at Benefex.', link: '#experience' },
  { name: 'API', icon: '{ }', title: 'A clear API boundary.', copy: 'RESTful APIs using PHP and CakePHP, NestJS and TypeScript, and .NET and C#. Clear responsibilities connect the request to application behaviour.', link: '#experience' },
  { name: 'Service', icon: 'ƒ', title: 'Business logic in focus.', copy: 'NestJS microservices and .NET internal tooling are part of my commercial work. This node represents the application logic behind an API.', link: '#projects' },
  { name: 'Database', icon: '▤', title: 'Reliable data flows.', copy: 'MySQL and PostgreSQL queries, database optimisation, and anonymisation pipelines connect the application to useful, safer data.', link: '#projects' },
  { name: 'Tests', icon: '✓', title: 'Check the behaviour.', copy: 'Playwright regression tests, backend unit coverage, and penetration testing support release confidence. This illustration simplifies that workflow.', link: '#skills' },
  { name: 'Environment', icon: '◇', title: 'Consistent environments.', copy: 'Docker development environments and AWS deployment support are part of my experience. This is a conceptual release route, not a depiction of a production pipeline.', link: '#experience' }
];
const links = [[0,1],[1,2],[2,3],[1,4],[4,5],[2,4],[3,5]];
const wide = [[12,50],[36,50],[62,25],[86,25],[62,75],[86,75]];
const compact = [[23,16],[77,16],[23,50],[77,50],[23,84],[77,84]];
const routes = { data: [0,1,2,3,2,1,0], quality: [0,1,4,1,0], delivery: [0,1,4,5,4,1,0] };
const dialog = document.querySelector('.network-dialog');
const launcher = document.querySelector('.network-launch');
const map = document.querySelector('.network-map');
const backdrop = document.querySelector('.page-background');
const route = document.querySelector('#network-route');
const send = document.querySelector('#network-send');
const status = document.querySelector('#network-status');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 600px)');
const ns = 'http://www.w3.org/2000/svg';
let timer = null;
let runToken = 0;
let selected = 1;
function svgElement(tag, attributes) {
  const element = document.createElementNS(ns, tag);
  Object.entries(attributes).forEach(([key,value]) => element.setAttribute(key,value));
  return element;
}
function buildGraph(positions, background = false) {
  const svg = svgElement('svg',{viewBox:'0 0 1000 700',preserveAspectRatio:background?'xMidYMid slice':'none','aria-hidden':'true',class:background?'constellation':''});
  if (background) {
    for (let i=0;i<60;i++) svg.append(svgElement('circle',{cx:(i*173+29)%1000,cy:(i*97+41)%700,r:i%4===0?1.6:.7,class:'network-star'}));
    [160,270,390].forEach(radius=>svg.append(svgElement('ellipse',{cx:500,cy:350,rx:radius,ry:radius*.7,class:'network-orbit'})));
  }
  links.forEach(([a,b],index)=>{
    const [x1,y1]=positions[a]; const [x2,y2]=positions[b];
    const path = `M${x1*10},${y1*7} Q${(x1+x2)*5},${y1*7} ${x2*10},${y2*7}`;
    svg.append(svgElement('path',{d:path,class:'network-edge','data-edge':`${a}-${b}`}));
    if(background) { const flow=svgElement('path',{d:path,pathLength:100,class:'network-flow'}); flow.style.animationDelay=`-${index*1.7}s`; svg.append(flow); }
  });
  if(background) positions.forEach(([x,y],index)=>{
    svg.append(svgElement('circle',{cx:x*10,cy:y*7,r:24,class:'network-halo'}));
    svg.append(svgElement('circle',{cx:x*10,cy:y*7,r:4,class:'network-core'}));
    const label=svgElement('text',{x:x*10,y:y*7+45,'text-anchor':'middle',class:'network-caption'});label.textContent=nodes[index].name.toUpperCase();svg.append(label);
  });
  return svg;
}
backdrop.append(buildGraph(wide,true));
const buttons = nodes.map((node,index)=>{
  const button=document.createElement('button');button.type='button';button.className='network-node';button.dataset.node=index;
  button.setAttribute('aria-pressed',String(index===selected));
  const symbol=document.createElement('span');symbol.textContent=node.icon;symbol.setAttribute('aria-hidden','true');
  button.append(symbol,document.createTextNode(node.name));button.addEventListener('click',()=>selectNode(index));return button;
});
function selectNode(index) {
  selected=index;
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  document.querySelector('#network-node-title').textContent=nodes[index].title;
  document.querySelector('#network-node-copy').textContent=nodes[index].copy;
  document.querySelector('#network-evidence').href=nodes[index].link;
}
function layout() {
  const positions=mobile.matches?compact:wide;
  map.replaceChildren(buildGraph(positions));
  buttons.forEach((button,i)=>{button.style.setProperty('--node-x',`${positions[i][0]}%`);button.style.setProperty('--node-y',`${positions[i][1]}%`);map.append(button);});
}
function reset(message='Ready. Select a node or send a request.') {
  clearTimeout(timer); timer=null;runToken++;
  send.disabled=false;route.disabled=false;
  map.querySelectorAll('.traced').forEach(edge=>edge.classList.remove('traced'));
  buttons.forEach(button=>button.classList.remove('visited','in-flight'));
  status.textContent=message;
}
function trace(a,b) {
  const edge=map.querySelector(`[data-edge="${a}-${b}"]`)||map.querySelector(`[data-edge="${b}-${a}"]`);
  edge?.classList.add('traced');
}
function sendRequest() {
  reset();
  const token=runToken;
  const path=routes[route.value];
  const immediate=reduced.matches||document.documentElement.classList.contains('motion-paused');
  send.disabled=true;route.disabled=true;
  let step=0;
  function advance() {
    if(token!==runToken)return;
    const current=path[step];
    buttons.forEach(button=>button.classList.remove('in-flight'));
    buttons[current].classList.add('visited','in-flight');
    if(step)trace(path[step-1],current);
    status.textContent=`Simulated request · ${nodes[current].name} · step ${step+1}/${path.length}`;
    step++;
    if(step<path.length) {
      if(immediate)advance();else timer=setTimeout(advance,550);
    } else {
      buttons[current].classList.remove('in-flight');
      status.textContent=`200 OK · Simulation complete: ${path.map(index=>nodes[index].name).join(' → ')}`;
      send.disabled=false;route.disabled=false;timer=null;
    }
  }
  advance();
}
layout();selectNode(selected);launcher.hidden=false;
launcher.addEventListener('click',()=>{dialog.showModal();document.querySelector('.network-close').focus();});
document.querySelector('.network-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{reset();launcher.focus();});
document.querySelector('#network-evidence').addEventListener('click',()=>dialog.close());
send.addEventListener('click',sendRequest);
document.querySelector('#network-reset').addEventListener('click',()=>reset());
route.addEventListener('change',()=>reset());
mobile.addEventListener('change',()=>{reset();layout();});
reduced.addEventListener('change',()=>reset('Motion preference updated. Ready to send.'));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&timer)reset('Simulation paused while the page is hidden. Send to restart.');});
