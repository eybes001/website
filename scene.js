/* Lazy-loaded 3D experience. It is not needed for the portfolio to function. */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const frames={
 entrance:{eye:[-6.1,3.85,9.0],look:[0,2.35,-1.65]},
 desk:{eye:[-2.8,2.65,4.3],look:[.18,2.08,-1.78]},
 gallery:{eye:[2.5,2.9,1.75],look:[0,2.8,6.02]},
 lounge:{eye:[-7.1,2.55,2.4],look:[-5.45,1.23,-2.8]},
 window:{eye:[-1,3.1,2.2],look:[-1.2,3.2,-6.48]}
};
export async function createStudio(mount,onSelect){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#0c1628');scene.fog=new THREE.FogExp2('#0b1220',.008);
 const camera=new THREE.PerspectiveCamera(46,1,.08,130);const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 const coarse=window.matchMedia('(pointer: coarse)').matches;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,coarse?1:1.5));renderer.shadowMap.enabled=!coarse;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.domElement.setAttribute('aria-label','3D office: drag to look, click monitor and wall displays for portfolio content');renderer.domElement.tabIndex=0;
 mount.appendChild(renderer.domElement);
 scene.add(new THREE.AmbientLight('#9ba8ca',1.15));scene.add(new THREE.HemisphereLight('#a3bbeb','#594335',1.48));
 const sun=new THREE.DirectionalLight('#ffc895',2.6);sun.position.set(-5,11,6);sun.castShadow=!coarse;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;sun.shadow.normalBias=.02;scene.add(sun);
 const p1=new THREE.PointLight('#ffc189',36,10);p1.position.set(5,4,2);scene.add(p1);const p2=new THREE.PointLight('#668ee6',24,11);p2.position.set(-5,4,-6);scene.add(p2);
 const loader=new THREE.TextureLoader();const city=await loader.loadAsync('./assets/city-night.webp').catch(()=>null);
 if(city){city.colorSpace=THREE.SRGBColorSpace;const skyline=new THREE.Mesh(new THREE.PlaneGeometry(17,5.9),new THREE.MeshBasicMaterial({map:city,side:THREE.DoubleSide,depthWrite:false}));skyline.position.set(0,2.95,-6.55);scene.add(skyline)}
 const gltf=await new GLTFLoader().loadAsync('./models/studio.glb');const root=gltf.scene;scene.add(root);
 root.traverse(o=>{if(o.isMesh){o.castShadow=!coarse;o.receiveShadow=!coarse}});
 function createCanvas(w,h,render){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');render(ctx,w,h);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex}
 const screenTex=createCanvas(1200,596,(c,w,h)=>{
  const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#101b2c');bg.addColorStop(1,'#0b1321');c.fillStyle=bg;c.fillRect(0,0,w,h);c.fillStyle='#e3bd93';c.font='700 19px Arial';c.fillText('STUDIO / DATA INTELLIGENCE',48,56);
  c.fillStyle='#e9e8e4';c.font='bold 44px Arial';c.fillText('Business at a glance.',48,114);c.fillStyle='#8599ac';c.font='22px Arial';c.fillText('INDEPENDENT SYNTHETIC DEMONSTRATION',48,159);
  [['SALES','$54,200'],['ORDERS','1,280'],['MARGIN','38.4%']].forEach(([t,v],i)=>{const x=49+i*382;c.fillStyle='#203046';c.fillRect(x,192,354,100);c.fillStyle='#a9b7c9';c.font='19px Arial';c.fillText(t,x+16,223);c.fillStyle='#ffffff';c.font='bold 32px Arial';c.fillText(v,x+16,270)});
  c.strokeStyle='#a9b5c433';for(let y=340;y<556;y+=60){c.beginPath();c.moveTo(50,y);c.lineTo(1150,y);c.stroke()}
  const vals=[.23,.31,.27,.41,.49,.46,.58,.61,.57,.73,.78,.91];c.fillStyle='#e6bb8e14';c.beginPath();c.moveTo(60,540);vals.forEach((v,i)=>c.lineTo(60+i*95,530-v*178));c.lineTo(1120,540);c.closePath();c.fill();c.strokeStyle='#f0bf8a';c.lineWidth=7;c.beginPath();vals.forEach((v,i)=>i?c.lineTo(60+i*95,530-v*178):c.moveTo(60,530-v*178));c.stroke();
 });
 const monitorScreen=new THREE.Mesh(new THREE.PlaneGeometry(4.35,2.15),new THREE.MeshBasicMaterial({map:screenTex,toneMapped:false,side:THREE.DoubleSide}));monitorScreen.position.set(.25,2.25,-1.85);scene.add(monitorScreen);monitorScreen.userData.action='analytics';
 const wallItems=[['experience',-5.5,'EXPERIENCE','THE JOURNEY'],['cv',-1.8,'MY PROFILE','CV & EDUCATION'],['about',1.9,'BIOGRAPHY','BEHIND THE WORK'],['contact',5.6,'CONTACT','GET IN TOUCH']];
 const interactables=[monitorScreen];
 wallItems.forEach(([id,x,title,sub],i)=>{const map=createCanvas(580,770,(c,w,h)=>{const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#233044');g.addColorStop(1,'#0d1725');c.fillStyle=g;c.fillRect(0,0,w,h);c.strokeStyle='#c79f7580';c.lineWidth=4;c.strokeRect(20,20,w-40,h-40);c.fillStyle='#d8b78f';c.font='700 35px Arial';c.fillText('0'+(i+1)+' / THE STUDIO',65,115);c.fillStyle='#fcf6ef';c.font='bold 56px Arial';c.fillText(title,65,365);c.fillStyle='#aebaca';c.font='26px Arial';c.fillText(sub,65,427);c.fillStyle='#d4b084';c.fillRect(65,585,100,3);c.font='700 26px Arial';c.fillText('EXPLORE    ↗',65,665)});const plane=new THREE.Mesh(new THREE.PlaneGeometry(2.91,3.56),new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide,toneMapped:false}));plane.position.set(x,2.9,6.005);plane.rotation.y=Math.PI;plane.userData.action=id;interactables.push(plane);scene.add(plane)});
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let drag=null,moved=0,orbitX=0,orbitY=0,zoom=1,view='entrance',active=true;
 let eye=new THREE.Vector3(...frames.entrance.eye),target=new THREE.Vector3(...frames.entrance.look);camera.position.copy(eye);camera.lookAt(target);
 function hitTest(e,click=false){const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(pointer,camera);const found=ray.intersectObjects(interactables,false)[0];renderer.domElement.style.cursor=found?'pointer':'grab';if(found&&click)onSelect(found.object.userData.action)}
 function onDown(e){drag={x:e.clientX,y:e.clientY};moved=0;renderer.domElement.setPointerCapture?.(e.pointerId)}
 function onMove(e){if(!drag){hitTest(e);return}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved+=Math.abs(dx)+Math.abs(dy);orbitX=THREE.MathUtils.clamp(orbitX+dx*.0028,-.28,.28);orbitY=THREE.MathUtils.clamp(orbitY+dy*.0016,-.13,.13);drag={x:e.clientX,y:e.clientY}}
 function onUp(e){if(drag&&moved<10)hitTest(e,true);drag=null}function onWheel(e){e.preventDefault();zoom=THREE.MathUtils.clamp(zoom+Math.sign(e.deltaY)*.055,.76,1.28)}
 renderer.domElement.addEventListener('pointerdown',onDown);renderer.domElement.addEventListener('pointermove',onMove);renderer.domElement.addEventListener('pointerup',onUp);renderer.domElement.addEventListener('pointercancel',()=>drag=null);renderer.domElement.addEventListener('wheel',onWheel,{passive:false});
 const resize=()=>{const r=mount.getBoundingClientRect();if(r.width<1||r.height<1)return;camera.aspect=r.width/r.height;camera.fov=r.width<650?58:46;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false)};
 const ro=new ResizeObserver(resize);ro.observe(mount);resize();let last=performance.now();
 function tick(now){if(!active)return;requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.05);last=now;const f=frames[view],eyeTarget=new THREE.Vector3(...f.eye),lookTarget=new THREE.Vector3(...f.look);const delta=eyeTarget.clone().sub(lookTarget);delta.applyAxisAngle(new THREE.Vector3(0,1,0),orbitX).multiplyScalar(zoom);eyeTarget.copy(lookTarget).add(delta);eyeTarget.y+=orbitY*delta.length();const ease=1-Math.pow(.0005,dt);camera.position.lerp(eyeTarget,ease);target.lerp(lookTarget,ease);camera.lookAt(target);renderer.render(scene,camera)}requestAnimationFrame(tick);
 return {setView(v){view=frames[v]?v:'entrance';orbitX=orbitY=0;zoom=1},destroy(){active=false;ro.disconnect();renderer.dispose();root.traverse(o=>{if(o.isMesh)o.geometry?.dispose()});screenTex.dispose();mount.replaceChildren()}};
}
