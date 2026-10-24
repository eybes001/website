import {Suspense,useEffect,useMemo,useRef,useState} from 'react';
import {Canvas,useFrame,ThreeEvent} from '@react-three/fiber';
import {useGLTF,OrbitControls} from '@react-three/drei';
import * as THREE from 'three';
import type {RefObject} from 'react';
type View='entrance'|'desk'|'gallery'|'lounge'|'window';
type Props={view:View,onSelect:(panel:string)=>void};
const frames:Record<View,{eye:[number,number,number],look:[number,number,number]}>= {
 entrance:{eye:[-6.1,3.85,9],look:[0,2.35,-1.65]},desk:{eye:[-2.8,2.65,4.3],look:[.18,2.08,-1.78]},
 gallery:{eye:[2.5,2.9,1.75],look:[0,2.8,6.02]},lounge:{eye:[-7.1,2.55,2.4],look:[-5.45,1.23,-2.8]},window:{eye:[-1,3.1,2.2],look:[-1.2,3.2,-6.48]}
};
function Model({onSelect}:{onSelect:(panel:string)=>void}){
 const gltf=useGLTF('/models/studio.glb');const scene=useMemo(()=>gltf.scene.clone(true),[gltf]);
 const handle=(e:ThreeEvent<MouseEvent>)=>{const name=(e.object.name||'');const actions:Record<string,string>={'analyticsMonitor':'analytics','experienceFrame':'experience','cvFrame':'cv','biographyFrame':'about','contactObject':'contact'};const id=Object.keys(actions).find(x=>name.includes(x));if(id){e.stopPropagation();onSelect(actions[id]);}};
 return <primitive object={scene} onClick={handle}/>;
}
function GuidedCamera({view,controls}:{view:View,controls:RefObject<any>}){
 const target=useRef(new THREE.Vector3());
 useFrame(({camera},dt)=>{const f=frames[view],ease=1-Math.exp(-dt*3.5);camera.position.lerp(new THREE.Vector3(...f.eye),ease);target.current.lerp(new THREE.Vector3(...f.look),ease);if(controls.current){controls.current.target.lerp(target.current,ease);controls.current.update()}else camera.lookAt(target.current)});
 return null;
}
export default function StudioScene({view,onSelect}:Props){
 const controls=useRef<any>(null);const [error,setError]=useState(false);
 useEffect(()=>{const listener=(e:ErrorEvent)=>{if(e.message.includes('WebGL'))setError(true)};window.addEventListener('error',listener);return()=>window.removeEventListener('error',listener)},[]);
 if(error)return <div className="react-studio-error">3D graphics are unavailable. All portfolio sections remain accessible below.</div>;
 return <Canvas shadows dpr={[1,1.6]} camera={{position:frames[view].eye,fov:46,near:.1,far:140}} gl={{toneMapping:THREE.ACESFilmicToneMapping}}><color attach="background" args={['#0c1628']}/><fogExp2 attach="fog" args={['#0b1220',.008]}/><ambientLight intensity={1.15} color="#9ba8ca"/><hemisphereLight intensity={1.4} color="#a3bbeb" groundColor="#594335"/><directionalLight position={[-5,11,6]} intensity={2.6} color="#ffc895" castShadow shadow-mapSize={[1024,1024]}/><pointLight position={[5,4,2]} intensity={36} color="#ffc189"/><pointLight position={[-5,4,-6]} intensity={24} color="#668ee6"/><Suspense fallback={null}><Model onSelect={onSelect}/></Suspense><GuidedCamera view={view} controls={controls}/><OrbitControls ref={controls} minDistance={2} maxDistance={24} enablePan={false} maxPolarAngle={Math.PI*.67}/></Canvas>
}
