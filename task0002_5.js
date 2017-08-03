window.onload=function(){
    var box=$('div');
    var indz=2;
    var liS=document.getElementsByTagName('li');
    var ulS=document.getElementsByTagName('ul');
    
    //事件代理
    delegateEvent(box, 'li', 'mousedown', function(ev){
        indz++;
        this.style.zIndex=indz;
        this.style.opacity=0.3;
        var Oeven=ev||event;
        var disX=Oeven.pageX-this.offsetLeft;//鼠标到移动元素左边缘的距离
        var disY=Oeven.pageY-this.offsetTop;
        console.log(Oeven.pageY);
        console.log(this.offsetTop);

        //在原位置创建li元素
        var newli=document.createElement('li');
        this.parentElement.appendChild(newli);
        addClass(newli,"newli");
        newli.style.left=this.offsetLeft + 'px';
        console.log(newli.offsetLeft);
        newli.style.top=this.offsetTop+'px';
        newli.style.position = "absolute";
        console.log(newli.offsetTop);
        
        var moveEle=this;
        
        addEvent(document,'mousemove',onmousemove);
        addEvent(document,'mouseup',onmouseup);
        
        
        function onmousemove(ev){//鼠标移动函数
  
            var Oev=ev||event;
            var liLeft=Oev.pageX-disX;
            
            var litop=Oev.pageY-disY;
            /*if (oriX!=Oev.clientX ||oriY!=Oev.clientY){
                var movevalue=true;
            }*/
            var maxLeft=innerWidth-moveEle.offsetWidth;
    
 
            var maxTop =innerHeight-moveEle.offsetHeight;
            
            //检测是否碰到客户端边缘
            if(liLeft<0){
                liLeft=0;
            }
            else if(liLeft>maxLeft){
                liLeft=maxLeft;
            }
            if (litop<0){
                litop=0;
            }
            else if(litop>maxTop){
                litop=maxTop;
            }
            
            //移动元素跟随鼠标移动
            moveEle.style.left=liLeft + 'px';
            moveEle.style.top=litop + 'px';
            
            //检测碰撞元素
            var nearLi=findNear(moveEle,liS);
            if (nearLi){
                if (document.getElementsByClassName('active')){
                    removeClass(document.getElementsByClassName('active')[0],'active');
                }
                addClass(nearLi,'active');
            }
        }
        function findNear(ele,elS){ 
            //检测最近的碰撞元素，ele是移动的元素，elS是待碰撞的元素数组    
            var minDis=999999999;
            var r1=ele.offsetLeft+ele.offsetWidth;
            var l1=ele.offsetLeft;
            var b1=ele.offsetTop+ele.offsetHeight;
            var t1=ele.offsetTop;
            var nearindex=-1;
            
            for (var i=0 ; i<elS.length; i++){
                if (elS[i]==ele) continue;
                else{
                    var r2=elS[i].offsetLeft+elS[i].offsetWidth;
                    var l2=elS[i].offsetLeft;
                    var b2=elS[i].offsetTop+elS[i].offsetHeight;
                    var t2=elS[i].offsetTop;
                    if (l2>r1 || t2>b1 || l1>r2 || b2<t1){
                        continue;
                    }else{
                        var disn=Math.sqrt((l2-l1)*(l2-l1)+(t2-t1)*(t2-t1));
                        if (disn<minDis){
                            minDis=disn;
                            nearindex=i;
                        }
                    }
                }
            }
            if (nearindex!=-1){
                return elS[nearindex];
            }
        }
        
        
        //鼠标按键弹起时执行的函数
        function onmouseup(ev){
            removeEvent(document, "mousemove", onmousemove);
            removeEvent(document, "mouseup", onmouseup);
            if(document.getElementsByClassName('active')){
                removeClass(document.getElementsByClassName('active')[0],'active');
            }  
            moveEle.style.opacity=1;
            var nearLi=findNear(moveEle,liS);
            var nearUl=findNear(moveEle,ulS);
            if (nearLi){
                
                
                
                var pmo=moveEle.parentElement;
                var pne=nearLi.parentElement;
                var pmoLi=pmo.getElementsByTagName('li');
                var pneLi=pne.getElementsByTagName('li');
                
                moveEle.parentNode.removeChild(moveEle);
                nearLi.parentNode.appendChild(moveEle);
                var nearLiTop=nearLi.offsetTop;
				var nearLiLeft=nearLi.offsetLeft;
				
                    //移出元素下面的同胞元素上移
                for (var i=0; i<pmoLi.length;i++){
                    if (pmoLi[i]!=newli && pmoLi[i]!=moveEle && pmoLi[i].offsetTop>newli.offsetTop){
                        pmoLi[i].style.top=(pmoLi[i].offsetTop-pmoLi[i].offsetHeight) + 'px';
                    }
                }
				
				
                //移入ul中元素下移
                for(var i=0; i<pneLi.length;i++){
                    if(pneLi[i].offsetTop>=nearLiTop){
                        pneLi[i].style.top=(pneLi[i].offsetTop + pneLi[i].offsetHeight) + 'px';
                    }
                }
				
				//移动元素归位
                moveEle.style.top=nearLiTop+ 'px';
                moveEle.style.left=nearLiLeft + 'px'; 
                
                newli.parentNode.removeChild(newli);
                
                
   
            }else if(nearUl){//与父级碰撞
                
                
                //上移
                var pmo=moveEle.parentElement;
                var pmoLi=pmo.getElementsByTagName('li');
                for (var i=0; i<pmoLi.length;i++){
                    if (pmoLi[i]!=newli && pmoLi[i]!=moveEle && pmoLi[i].offsetTop>newli.offsetTop){
                        pmoLi[i].style.top=(pmoLi[i].offsetTop-pmoLi[i].offsetHeight) + 'px';
                    }
                }
                newli.parentNode.removeChild(newli);
                  
                //归位
                moveEle.parentNode.removeChild(moveEle);
                var nearUlLi=nearUl.getElementsByTagName('li');
                if (nearUlLi.length>0){
                    
                    moveEle.style.top=(nearUlLi[nearUlLi.length-1].offsetTop +nearUlLi[nearUlLi.length-1].offsetHeight)+ 'px';
                    
                    moveEle.style.left=nearUlLi[nearUlLi.length-1].offsetLeft + 'px'; 
                    console.log(nearUlLi[nearUlLi.length-1]);
                }else{
                    moveEle.style.top=0+'px';
                    moveEle.style.left=nearUl.offsetLeft + 'px';
                }
                nearUl.appendChild(moveEle);
                
            }
            else{
                moveEle.style.top=newli.offsetTop + 'px';
                moveEle.style.left=newli.offsetLeft + 'px';
                newli.parentNode.removeChild(newli);
            }
            
            
        }
    }) ;
}
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  