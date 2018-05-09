let util = {
    // 从图集资源中加载某张图片

    /**
     * 
     * 
     * @param {any} AtlasPath 图集资源路径
     * @param {any} imgIndex 图集中图片的名字
     * @param {any} imgNode 需要引用这张图片的节点
     */
    loadingImgFromAtlas (AtlasPath, imgIndex, imgNode) {
        cc.loader.loadRes(AtlasPath, cc.SpriteAtlas, (err, Atlas) => {
            let sprite = imgNode.getComponent(cc.Sprite);
            let spriteFrame = Atlas.getSpriteFrame(imgIndex);
            sprite.spriteFrame = spriteFrame;        
        });
    },   
    /**
     * 
     * 
     * @param {any} imgPath 图片路径
     * @param {any} imgNode 图片节点
     */
    loadingImg (imgPath, imgNode) {
        if (!imgNode) {
            console.log(imgNode);
            console.log('图片节点为空');
            return;
        }
        if (!imgPath) {
            // 图片路径不存在
            console.log(imgPath);
            console.log('图片路径不存在');   
            return;         
        }
        console.log('图片路径:' + imgPath);
        cc.loader.loadRes(imgPath, cc.SpriteFrame, (err, spriteFrame) => {
            let sprite = imgNode.getComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;        
        });
    },    
    /**
     * 
     * 坐标系转换代码
     * @param {any} curNode 带转换坐标的节点
     * @param {any} targetNode 目标节点
     * @returns 坐标
     */
    getNodePos (curNode, targetNode) {
        let worldPos = curNode.parent.convertToWorldSpaceAR(curNode.position);
        let pos = targetNode.convertToNodeSpaceAR(worldPos);
        return pos;
    },
    /**
     *加载简易弹窗 
     * 
     * @param {any} path 路径
     * @param {any} parentNode 父节点
     */
    loadingAlert (path, parentNode) {
        cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
            let item = cc.instantiate(prefab);
            item.parent = parentNode;
        });
    },
    /**
     * 更新微信头像 若没有使用本地
     * 
     * @param {any} photoURL 
     * @param {any} photoNode 
     * @param {any} size 
     */
    updateWXPhoto: function (photoURL, photoNode, size) {
        if (photoNode) {
            var filename = photoURL;
            if (photoURL && photoURL.indexOf('http') == 0) {
                if (filename.indexOf('/0', filename.length - 4) > 0) {
                    if (size) {
                        filename = filename.slice(0, -1) + size;
                    } else {
                        filename = filename.slice(0, -1) + '132';
                    }
                }

                cc.loader.load({ url: filename, type: 'png' }, function (photoNode, err, texture) {
                    var spriteComp = photoNode.getComponent(cc.Sprite);
                    if (!err && spriteComp) {
                        spriteComp.spriteFrame = new cc.SpriteFrame(texture);
                    }
                }.bind(this, photoNode));
            } else {
                if (!filename)
                    filename = 'client/scenes/hall/topBlock/n1';

                cc.loader.loadRes(filename, cc.SpriteFrame, function (photoNode, err, spriteFrame) {
                    var spriteComp = photoNode.getComponent(cc.Sprite);
                    if (!err && spriteComp) {
                        spriteComp.spriteFrame = spriteFrame;
                    }
                }.bind(this, photoNode));
            }
        }
    },
    
    // 三角函数
    // 已知两点 求角度

    /**
     * 
     * 
     * @param {any} start (0,0)的坐标
     * @param {any} end 移动的起始(x, y)或者终点坐标(y, x)
     * @returns 
     */
    angle(start,end){
        let diff_x = end.x - start.x;
        let diff_y = end.y - start.y;
        //返回角度,不是弧度
        return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    },
     
    /**
     * 加载通过动画编辑器制作的动画效果并执行
     * 
     * @param {any} typeName 类型名
     * @param {any} callBack 动画执行结束后的回调函数
     */
    loadingAnim (typeName,parentNode, callBack) {
        cc.loader.loadRes(typeName, cc.Prefab, (err, prefab) => {
            let item = cc.instantiate(prefab);
            item.parent = parentNode;     
            let anim = item.getComponent(cc.Animation);           
            anim.play();
            anim.on('finished', () => {item.destroy(); 
                if (callBack) {
                    callBack();
                }
            });
        });
    },
        


};
module.exports = util;