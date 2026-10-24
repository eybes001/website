"""Create an original architectural 3D room GLB with named interactive objects.
Coordinates follow the Three.js X-horizontal, Y-up, Z-depth convention.
Designed for use alongside baked/composited photographic hero imagery, not marketed as photoreal geometry.
"""
from pathlib import Path
import math
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals
ROOT=Path(__file__).resolve().parents[1]
SCENE=trimesh.Scene()
colors={
 'walnut':('#67422a',.4,.03),'walnut_dark':('#301e16',.52,.02),'wall':('#23242a',.84,0),'charcoal':('#111a24',.62,.18),
 'stone':('#363537',.24,.1),'black':('#0d131b',.43,.28),'brass':('#c49b65',.28,.75),'chrome':('#b9b4a7',.19,.85),
 'leather':('#23232b',.75,0),'fabric':('#777079',.92,0),'rug':('#353237',.92,0),'plant':('#3e624e',.9,0),
 'warm':('#fbc58a',.48,0),'screen':('#13243d',.22,.2),'cream':('#cdb9a0',.85,0),'glass':('#35577a',.1,.4)
}
count=0

def color(c):
 c=c.lstrip('#');return tuple(int(c[i:i+2],16) for i in (0,2,4))
def material(k):
 hex_,rough,metal=colors[k];rgb=color(hex_)
 return PBRMaterial(name=k,baseColorFactor=np.array([*rgb,255],dtype=np.uint8),metallicFactor=metal,roughnessFactor=rough, doubleSided=True)
def add(mesh,name,mat):
 global count
 count+=1
 mesh.visual=TextureVisuals(material=material(mat))
 SCENE.add_geometry(mesh,node_name=f'{name}_{count:03d}',geom_name=f'{name}_{count:03d}')
 return mesh

def bx(name,c,dim,mat,ry=0):
 m=trimesh.creation.box(extents=dim)
 if ry:m.apply_transform(trimesh.transformations.rotation_matrix(ry,[0,1,0]))
 m.apply_translation(c)
 return add(m,name,mat)

def cyl(name,c,rad,height,mat,axis='y',sections=32):
 m=trimesh.creation.cylinder(radius=rad,height=height,sections=sections)
 if axis=='y': m.apply_transform(trimesh.transformations.rotation_matrix(-math.pi/2,[1,0,0]))
 elif axis=='x': m.apply_transform(trimesh.transformations.rotation_matrix(math.pi/2,[0,1,0]))
 m.apply_translation(c); return add(m,name,mat)

def ball(name,c,sc,mat,sub=2):
 m=trimesh.creation.icosphere(subdivisions=sub,radius=1)
 m.apply_scale(sc);m.apply_translation(c);return add(m,name,mat)

def bar(name,p1,p2,rad,mat):
 a,b=np.array(p1,float),np.array(p2,float)
 v=b-a
 if np.linalg.norm(v)<0.001:return
 m=trimesh.creation.cylinder(radius=rad,segment=np.array([a,b]),sections=12)
 return add(m,name,mat)

# Room shell, side wall, slatted panel, feature architectural light tracks
bx('architecture_floor',(0,-.14,0),(17,.28,13),'stone')
bx('architecture_ceiling',(0,5.8,0),(17,.18,13),'charcoal')
bx('architecture_rightWall',(8.45,2.85,0),(.18,5.9,13),'walnut_dark')
bx('architecture_backWall',(0,2.85,6.42),(17,5.9,.18),'wall')
for i in range(25):bx('architectural_walnutSlat',(8.33,2.8,-5.8+i*.45),(.07,5.48,.13),'walnut' if i%3 else 'walnut_dark')
for x in (-7.8,-4.3,-.8,2.7,6.2): bx('window_mullion',(x,3,-6.35),(.085,5.9,.12),'black')
for y in (0.5,5.6):bx('window_rail',(0,y,-6.35),(17,.085,.11),'black')
bx('window_led',(0,5.67,-6.15),(15.8,.025,.045),'warm')
bx('floor_coveLight',(0,.04,6.15),(15.8,.04,.07),'warm')
for z in [-5.1,1.0,5.2]:bx('ceiling_trackLight',(0,5.65,z),(15,.025,.07),'warm')
# rear story wall: framed image panels on back wall accessible through click
panels=[('experienceFrame',-5.5,'brass'),('cvFrame',-1.8,'cream'),('biographyFrame',1.9,'brass'),('contactObject',5.6,'cream')]
for name,x,tint in panels:
 bx(name+'_Frame',(x,2.9,6.22),(3.08,3.76,.15),'brass')
 bx(name+'_Display',(x,2.9,6.12),(2.95,3.62,.055),'screen')
 bx(name+'_TopBar',(x,4.47,6.076),(2.46,.036,.04),tint)
 # Icon medallion and type-like metallic line details
 cyl(name+'_Marker',(x,3.32,6.04),.24,.04,'brass',axis='z')
 for k in range(3): bx(name+'_TextLine',(x,2.72-k*.23,6.04),(1.9-k*.22,.025,.04),'cream')
 bx(name+'_Foot',(x,1.44,6.035),(1.3,.03,.04),'brass')
# glasspanels / city outside skyline generated in JS behind room
# Floor rugs with trim
bx('workRug',(0,.025,1.0),(7.9,.065,5.4),'rug')
for x in [-3.85,3.85]:bx('rug_trim',(x,.065,1),(.016,.009,5.12),'brass')
# Wood desk with narrow edge bevel-like triple layered geometry
bx('desk_shadow',(0,.87,-.65),(6.6,.1,2.9),'charcoal')
bx('desk_walnutTop',(0,1.0,-.65),(6.8,.14,3.04),'walnut')
bx('desk_edgeTrim',(0,.915,-.65),(6.85,.022,3.1),'brass')
for x in (-2.87,2.87):
 for z in (-1.78,.46): bx('desk_metalLeg',(x,.43,z),(.085,.8,.08),'black')
 bx('desk_bottomBar',(x,.08,-.66),(.12,.07,2.2),'brass')
# monitor: real 3D clickable object at front face
bx('analyticsMonitor_Back',(.25,2.25,-2.01),(4.52,2.38,.13),'black')
bx('analyticsMonitor_Rim',(.25,2.25,-1.924),(4.47,2.28,.065),'brass')
bx('analyticsMonitor_Display',(.25,2.25,-1.871),(4.35,2.15,.025),'screen')
bx('monitor_stand',(.25,1.29,-2.09),(.18,.53,.19),'chrome')
bx('monitor_foot',(.25,1.06,-2.08),(1.02,.055,.55),'black')
# Keyboard individually constructed keys in angled row
bx('desk_mat',(0,1.099,.12),(3.5,.017,1.18),'leather')
bx('keyboard_base',(-.35,1.13,.27),(1.43,.06,.44),'black')
for r in range(3):
 for i in range(13): bx('keyboard_key',(-1.0+i*.107,1.169,.11+r*.11),(.07,.011,.072),'cream' if i%7==0 else 'charcoal')
ball('mouse',(1.02,1.12,.35),(.12,.049,.19),'black',2)
# notebook + pen
bx('desk_notebook',(2.26,1.14,.17),(.55,.065,.81),'leather')
bx('desk_notebook_edge',(2.26,1.181,.17),(.53,.009,.79),'cream')
bar('desk_pen',(1.83,1.16,.22),(1.83,1.17,-.19),.012,'brass')
# lamp with domed shade and thin articulating arms
cyl('lamp_base',(-2.7,1.12,-1.42),.21,.06,'black')
bar('lamp_arm',(-2.7,1.16,-1.42),(-2.62,1.9,-1.73),.035,'chrome')
bar('lamp_arm',(-2.62,1.9,-1.73),(-2.22,2.15,-1.93),.035,'chrome')
ball('lamp_shade',(-2.22,2.13,-1.93),(.23,.11,.23),'black')
ball('lamp_bulb',(-2.22,2.01,-1.93),(.09,.035,.09),'warm')
# empty executive chair: rounded cushions, articulated pedestal, spokes
bx('emptyOfficeChair_seat',(.25,.84,2.03),(1.47,.24,1.08),'leather')
bx('emptyOfficeChair_back',(.25,1.75,2.52),(1.49,1.63,.26),'leather')
for x in (-.52,1.02):
 bx('chair_trim',(x,1.78,2.52),(.075,1.48,.19),'chrome')
 bx('chair_armrest',(x,1.25,2.02),(.11,.07,.91),'black')
 bar('chair_support',(x,1.23,2.4),(x,.82,2.22),.032,'chrome')
cyl('chair_piston',(.25,.38,2.08),.085,.76,'chrome')
for i in range(5):
 ang=i*math.tau/5
 bar('chair_baseSpoke',(.25,.10,2.08),(.25+.77*math.cos(ang),.10,2.08+.77*math.sin(ang)),.052,'chrome')
 ball('chair_caster',(.25+.77*math.cos(ang),.07,2.08+.77*math.sin(ang)),(.09,.09,.09),'black')
# Sculptural chaise and couch
bx('lounge_rug',(-5.25,.045,-1.7),(4.6,.05,5.1),'rug')
bx('lounge_sofaSeat',(-5.65,.48,-3.0),(3.36,.64,1.18),'fabric')
bx('lounge_sofaBack',(-5.65,1.13,-3.56),(3.38,1.16,.3),'charcoal')
for x in (-7.33,-3.97):bx('lounge_sofaArm',(x,.82,-3.02),(.24,.85,1.28),'charcoal')
for x in [-6.65,-5.65,-4.66]: ball('sofa_pillow',(x,1.14,-3.27),(.48,.31,.18),'cream')
cyl('lounge_CoffeeTable',(-5.45,.42,-.75),.73,.37,'stone')
cyl('lounge_coffeeFoot',(-5.45,.17,-.75),.44,.37,'black')
for i in range(3):cyl('table_candle',(-5.7+i*.22,.67,-.7),.038,.10+i*.06,'warm')
# bookshelves with trailing decor and plants
for h in (.78,1.77,2.76,3.75,4.74):
 bx('shelf_walnutShelf',(5.95,h,2.3),(3.5,.1,1.05),'walnut')
 bx('shelf_integratedLED',(5.95,h-.09,2.75),(3.4,.025,.035),'warm')
for x in (4.19,7.71):bx('shelf_support',(x,2.8,2.3),(.08,4.8,1.12),'brass')
for n in range(29):
 shelf=n%4;xx=4.48+(n%7)*.44
 by=.90+shelf*.99
 bx('books_collection',(xx,by+.2+(n%3)*.028,2.37),(.12,.3+.05*(n%4),.4),'cream' if n%3==0 else ('charcoal' if n%4 else 'walnut'))
for i,x in enumerate((-7.6,7.0,-3.2)):
 z=(-5.2 if i!=1 else 4.3)
 cyl('planter_ceramic',(x,.36,z),.30,.66,'stone')
 bar('plant_stem',(x,.67,z),(x,1.5,z),.038,'plant')
 for j in range(10):
  a=j*math.tau/10
  ball('plant_leaf',(x+.47*math.cos(a),1.05+.3*(j%3),z+.48*math.sin(a)),(.13,.37,.10),'plant',1)
# wall arch lighting, no human assets
bx('wall_art_border',(7.9,3.2,-3.4),(.13,2.3,2.5),'brass')
bx('wall_art_stone',(7.78,3.2,-3.4),(.08,2.19,2.33),'stone')
# export
out=ROOT/'public/models/studio.glb'
out.parent.mkdir(parents=True,exist_ok=True)
out.write_bytes(SCENE.export(file_type='glb'))
print('Exported',out,'bytes',out.stat().st_size,'nodes',len(SCENE.graph.nodes),'parts',count)
