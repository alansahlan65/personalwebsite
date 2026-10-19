import sharp from 'sharp';
const {data,info:{width,height}}=await sharp(process.argv[2]).removeAlpha().raw().toBuffer({resolveWithObject:true});
const visited=new Uint8Array(width*height),bg=[...data.subarray(0,3)],parts=[];
const top=Math.floor(height*.13),bottom=Math.floor(height*.75);
const threshold=Number(process.argv[3]??12);
const foreground=i=>bg.some((c,j)=>Math.abs(data[i*3+j]-c)>threshold);
for(let y=top;y<bottom;y++)for(let x=0;x<width;x++){
  const i=y*width+x;if(visited[i]||!foreground(i))continue;
  const q=[i];visited[i]=1;let left=x,right=x,up=y,down=y;
  for(let k=0;k<q.length;k++){
    const px=q[k]%width,py=Math.floor(q[k]/width);
    left=Math.min(left,px);right=Math.max(right,px);up=Math.min(up,py);down=Math.max(down,py);
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const nx=px+dx,ny=py+dy,n=ny*width+nx;
      if(nx<0||nx>=width||ny<top||ny>=bottom||visited[n]||!foreground(n))continue;
      visited[n]=1;q.push(n);
    }
  }
  if(q.length>8)parts.push({area:q.length,left,right,top:up,bottom:down});
}
console.log(JSON.stringify(parts.sort((a,b)=>b.area-a.area)));
