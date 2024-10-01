function init(){
    try{
        document.getElementById('canvas1').remove()
    }
    catch(e){}

    var buffer=document.createElement('canvas')
    buffer.id='canvas1'
    buffer.height=window.innerHeight
    buffer.width=window.innerWidth
    document.getElementById('main').appendChild(buffer)
    
    $.post('ms?column=NG',{},function(data){
        console.log("MSG",data.STATUS),"json"
    })

    temp=new canvas
    temp.to_draw.addEventListener('mousemove',function(){
        temp.coord=event.clientX
        temp.calmap()
        temp.clear()
        temp.drawTMP()
    })
    temp.to_draw.addEventListener('click',function(){
        temp.calmap()
        temp.add_step()
        temp.send_req(temp)
    })
}

class canvas{

    constructor(){
        this.coord=null
        this.x_range=[]

        var p1icon=document.createElement('img')
        p1icon.src='/static/img/Chess_kdt45.svg.png'
        var p2icon=document.createElement('img')
        p2icon.src='/static/img/Chess_qdt45.svg.png'
        
        this.palyer_list=[new player('p1',0,p1icon,"black"),
            new player('p2',1,p2icon,"red")]
        this.mapsize=[8,8]

        this.log=[]
        for (let i=0;i<this.mapsize[0];i++){
            this.log[i]=[]
            for (let j=0;j<this.mapsize[1];j++){
                this.log[i][j]=2
            }
        }
        
        this.to_draw=document.getElementById('canvas1')
        this.square=(Math.min(this.to_draw.height,this.to_draw.width))
        this.ctx=this.to_draw.getContext('2d')
        this.turn=0
    }

    add_step(){
        this.log[this.index_temp[0]][this.index_temp[1]]=this.turn
        this.turn^=1
        console.log(this.log)
    }

    send_req(t){
        $.post('ms?column='+this.index_temp[1],{}, 
            function(data){
                console.log(data.STATUS);
                if (data.STATUS=='VIC') {
                    if (data.P=='C'){
                        alert("YOU WIN!")
                    }
                    else{
                        alert("I WIN!")
                    }
                }
                else{
                    var column=parseInt(data.COLUMN)
                    console.log(column)
                    for(var row=(t.mapsize[0]-1); row>0; row--){
                        if (t.log[row][column]==2){
                            console.log([row,column])
                            console.log(t.turn)
                            t.log[row][column]=t.turn
                            t.turn^=1
                            console.log(t.log)
                            break
                        }
                    }
                }
        },'json').fail(function(){
              console.log("error");
        });
    }

    getCookie(st){
        return "12345"
    }

    drawBG(){
        var ctx=this.ctx
        ctx.lineWidth='3'
        ctx.strokeStyle='black'
        ctx.beginPath();
        ctx.lineJoin='round'
        for(var i=0;i<(this.mapsize[0]+1);i++){
            ctx.moveTo(((this.to_draw.width/2)-(this.square/2)),
            ((this.to_draw.height/2)-(this.square/2)+(i*this.square/this.mapsize[0])))
            ctx.lineTo(((this.to_draw.width/2)+(this.square/2)),
            ((this.to_draw.height/2)-(this.square/2)+(i*this.square/this.mapsize[0])))
        }
        for(var j=0;j<(this.mapsize[1]+1);j++){
            ctx.moveTo(((this.to_draw.width/2)-(this.square/2)+(j*this.square/this.mapsize[1])),
            ((this.to_draw.height/2)-(this.square/2)))
            ctx.lineTo(((this.to_draw.width/2)-(this.square/2)+(j*this.square/this.mapsize[1])),
            ((this.to_draw.height/2)+(this.square/2)))
        }
        ctx.save()
        ctx.stroke()
        this.x_range=[]
        for(var i=0;i<this.mapsize[1];i++){
            this.x_range.push((this.to_draw.width/2)-(this.square/2)+((i+1/2)*(this.square/this.mapsize[1])))
        }
    }

    drawIC(){
        var ctx=this.ctx
        ctx.restore()
        for(var i=0;i<this.mapsize[0];i++){
            for(var j=0;j<this.mapsize[1];j++){
                if(this.log[i][j]!=2){
                    ctx.drawImage(this.palyer_list[this.log[i][j]].icon,
                        (this.to_draw.width/2)-(this.square/2)+(j*this.square/this.mapsize[1]),
                        (this.to_draw.height/2)-(this.square/2)+(i*this.square/this.mapsize[0]),
                        this.square/this.mapsize[0],this.square/this.mapsize[1])
                }
            }
        }
        ctx.save()
        ctx.stroke()
    }

    calmap(){//时间间隔调用&鼠标移动调用
        var operator=[]
        for(const i of this.x_range){
            operator.push(Math.abs(i-this.coord))
        }
        var yIndex=0
        for(var i=0;i<operator.length;i++){
            if(operator[i]<operator[yIndex]){
                yIndex=i
            }
        }
        var xIndex=0
        for(var i=this.mapsize[0]-1;i>0;i--){
            if(this.log[i][yIndex]==2){
                xIndex=i
                break
            }
            if(this.log[0][yIndex]!=2){
                xIndex='illegal'
                break
            }
        }
        this.index_temp=[xIndex,yIndex]
    }

    drawTMP(){
        this.drawBG()
        this.drawIC()
        var ctx=this.ctx
        if(this.index_temp[0]!='illegal'){//refresh//&&this.done==true
            //ctx.beginPath()
            ctx.drawImage(this.palyer_list[this.turn].icon,
                ((this.to_draw.width/2)-(this.square/2)+(this.index_temp[1]*this.square/this.mapsize[1])),
                ((this.to_draw.height/2)-(this.square/2)+(this.index_temp[0]*this.square/this.mapsize[0])),
                this.square/this.mapsize[0],this.square/this.mapsize[1])
        }
        ctx.stroke()
    }

    clear(){
        var ctx=this.ctx
        ctx.clearRect(0,0,this.to_draw.width,this.to_draw.height)
    }

}

class player{

    constructor(name,seq,icon,color){
        this.name=name
        this.seq=seq
        this.icon=icon
        this.color=color
        this.pos=[]
    }

    makestep(x,y){
        this.pos.push([x,y])
    }

}