// ===================
// 4×4 Block System — 2 bits per cell, 32 bits per block
// ===================
// Tile encoding: 0b00=floor1(8) 0b01=floor2(9) 0b10=wall1(10) 0b11=wall2(11)
// Row-major: bits 31-30 = cell(0,0), bits 1-0 = cell(3,3)
// Wall test: cell >= 2 (bit 1 set)

// Block 0: Open floor
//  . . . .    Block 1: Solid wall1
//  . . . .     W W W W
//  . . . .     W W W W
//  . . . .     W W W W
const B0=0,B1=0xAAAAAAAA;
// Block 2: Center pillar (2×2 wall1)
//  . . . .    Block 3: Checkerboard (floor1/floor2)
//  . W W .     . f . f
//  . W W .     f . f .
//  . . . .     . f . f
const B2=0x00282800,B3=0x11441144;
// Block 4: L-corner (wall1 top-left)
//  W W . .    Block 5: H-corridor (wall1 top+bottom)
//  W . . .     W W W W
//  . . . .     . . . .
//  . . . .     . . . .
const B4=0xA0800000,B5=0xAA0000AA;
// Block 6: Scatter (diagonal wall2 dots)
//  w . . .    Block 7: Mixed pillar (wall1+wall2 2×2)
//  . . w .     . . . .
//  . . . .     . W w .
//  . w . .     . w W .
const B6=0xC00C0030,B7=0x002C3800;

const BLOCKS=[B0,B1,B2,B3,B4,B5,B6,B7];

// Decode cell type (0-3) from a block bitmask at local row,col
function _cell(bv,r,c){return(bv>>>((15-(r*4+c))*2))&3}

// ===================
// Tutorial Level Definitions
// ===================
// Small arenas for the 4-step tutorial. Each has `tutorial: <step>` flag.
// Step 0: Move — empty room, pass after 1s movement
// Step 1: Shoot — 1 dummy enemy (doesn't fire), pass on kill
// Step 2: Dodge — 2 enemies fire, player can't shoot, pass after dodging 3 bullets
// Step 3: Combo — 1 enemy fires, kill it in 1 shot
const TUTORIAL_LEVELS = [
    { gw:4, gh:3, tutorial:0,
      blocks:[0,0,0,0, 0,0,0,0, 0,0,0,0],
      spawn:[8.5,5.5], enemies:[] },
    { gw:4, gh:3, tutorial:1,
      blocks:[0,0,0,0, 0,0,0,0, 0,0,0,0],
      spawn:[4.5,5.5], enemies:[[11.5,5.5],[8.5,8.5],[5.5,8.5]] },
    { gw:5, gh:3, tutorial:2,
      blocks:[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
      spawn:[10.5,5.5], enemies:[[4.5,9.5],[16.5,9.5]] },
    { gw:5, gh:3, tutorial:3,
      blocks:[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
      spawn:[10.5,5.5], enemies:[[16.5,5.5],[4.5,9.5],[16.5,9.5]] },
];

// ===================
// Level Definitions — block-based, coordinate spawns
// ===================
// gw/gh: grid in 4×4 blocks. blocks[]: row-major block indices.
// spawn:[x,y]  enemies:[[x,y,fireIdx,walks],...]  boss:[x,y]|null
const LEVEL_DEFINITIONS=[
    // {gw:6,gh:3, // Training Room (24×12)
    //  blocks:[0,0,0,0,0,0, 0,0,3,0,2,0, 0,0,0,0,0,0],
    //  spawn:[4.5,3.5],enemies:[[14.5,5.5]]},
    {gw:7,gh:3, // Crossfire Corridors (28×12)
     blocks:[0,0,0,0,0,0,0, 0,4,0,2,0,4,0, 0,0,0,3,0,0,0],
     spawn:[2.5,5.5],enemies:[[18.5,5.5],[14.5,9.5],[6.5,9.5],[22.5,9.5],[10.5,5.5]]},
    {gw:10,gh:6, // Final Showdown — Boss (40×24)
     blocks:[0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
     spawn:[6.5,5.5],enemies:[],boss:[20.5,12.5]},
];

// ===================
// Block → Tile Decoder
// ===================
function decodeLevelTiles(gw,gh,blocks){
    const w=gw*4,h=gh*4,walls=[],tileTypes=[];
    for(let x=0;x<w;x++)tileTypes[x]=[];
    for(let r=0;r<h;r++)for(let c=0;c<w;c++){
        const ty=h-1-r;
        let ct;
        if(r===0||r===h-1||c===0||c===w-1)ct=2;
        else{
            const bid=blocks[((r/4)|0)*gw+((c/4)|0)];
            ct=_cell(BLOCKS[bid],r%4,c%4);
        }
        tileTypes[c][ty]=ct;
        if(ct>=2)walls.push(vec2(c,ty));
    }
    return{walls,tileTypes,w,h};
}

// ===================
// Level Parser
// ===================
function parseLevelDefinition(level){
    const{gw,gh,blocks:bi}=level;
    const{walls,tileTypes,w,h}=decodeLevelTiles(gw,gh,bi);
    return{
        width:w,height:h,size:vec2(w,h),walls,tileTypes,
        enemies:(level.enemies||[]).map(e=>({pos:vec2(e[0],e[1])})),
        playerSpawn:vec2(level.spawn[0],level.spawn[1]),
        bossSpawn:level.boss?vec2(level.boss[0],level.boss[1]):null,
    };
}

// ===================
// Seeded PRNG (Mulberry32)
// ===================
function mulberry32(seed){
    let s=seed|0;
    return function(){
        s=s+0x6D2B79F5|0;
        let t=Math.imul(s^s>>>15,1|s);
        t=t+Math.imul(t^t>>>7,61|t)^t;
        return((t^t>>>14)>>>0)/4294967296;
    };
}

// ===================
// Infinite Level Generator
// ===================
let _proceduralCount=0;
const _IBLOCKS=[0,0,0,0,2,3,4,6,7]; // weighted interior blocks (no solid/corridor)

function _testWall(blocks,gw,w,h,cx,cy){
    if(cx<0||cy<0||cx>=w||cy>=h)return true;
    const r=h-1-cy,c=cx;
    if(r===0||r===h-1||c===0||c===w-1)return true;
    const bid=blocks[((r/4)|0)*gw+((c/4)|0)];
    return _cell(BLOCKS[bid],r%4,c%4)>=2;
}

function _clear(blocks,gw,w,h,cx,cy){
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)
        if(_testWall(blocks,gw,w,h,cx+dx,cy+dy))return false;
    return true;
}

function generateProceduralLevel(difficulty){
    difficulty=difficulty||1;
    _proceduralCount++;
    const rng=mulberry32(_proceduralCount*7919+difficulty*31);
    const ri=n=>(rng()*n)|0;
    const gw=min(6+((difficulty/2)|0),9),gh=min(3+((difficulty/3)|0),5);
    const w=gw*4,h=gh*4;
    const blocks=[];
    for(let by=0;by<gh;by++)for(let bx=0;bx<gw;bx++)
        blocks.push((bx===0||bx===gw-1||by===0||by===gh-1)?0:_IBLOCKS[ri(_IBLOCKS.length)]);
    // Ensure at least one wall block interior
    if(gw>2&&gh>2){
        let ok=false;
        for(let i=0;i<blocks.length;i++)if(blocks[i]!==0&&blocks[i]!==3){ok=true;break;}
        if(!ok)blocks[gw+1+ri(gw-2)]=_IBLOCKS[4+ri(_IBLOCKS.length-4)];
    }
    // Player spawn bottom-left with clearance
    let px=2,py=2;
    for(let a=0;a<50;a++){px=2+ri(4);py=2+ri(3);if(_clear(blocks,gw,w,h,px,py))break;}
    // Enemies scale with difficulty
    const cnt=min(2+difficulty,10),enemies=[];
    let att=0;
    while(enemies.length<cnt&&att++<300){
        const ex=2+ri(w-4),ey=2+ri(h-4);
        if(abs(ex-px)+abs(ey-py)<6)continue;
        if(!_clear(blocks,gw,w,h,ex,ey))continue;
        // Only spawn on B0 (open floor) blocks
        const br=((h-1-ey)/4)|0,bc=(ex/4)|0;
        if(blocks[br*gw+bc]!==0)continue;
        let ov=false;
        for(const e of enemies)if(abs(e[0]-ex)<2&&abs(e[1]-ey)<2){ov=true;break;}
        if(ov)continue;
        enemies.push([ex+.5,ey+.5]);
    }
    return{gw,gh,blocks,spawn:[px+.5,py+.5],enemies};
}
