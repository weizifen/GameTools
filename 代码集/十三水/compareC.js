// 2 - A  从21 - 141
let ct = require('sss_ct');
let compare = {
    pokerTypeArr: [], // 所有类型扑克
    bak_subPokerArr: [], // 上举该牌组后  从所有牌型中剔除出来的牌
    error: 0,
    // Func

    // 排序 (从大到小)
    sortCard (pokers) {
        let tempCard = pokers;
        tempCard.sort((a, b) => {
            return b - a;
        });
        return tempCard;
    },

    // 获得单张牌的大小（不包括花色）
    getCardValue(poker) {
        return Math.floor(poker / 10);
    },

    // 获得牌型 (1:方片 2: 梅花 3:红桃 4:黑桃)
    getCardType (poker) {return Math.floor(poker % 10); },  
    
    // 去除花色
    spliceColor (pokers) {
        let tempArr = [];
        for (let i = 0; i < pokers.length; i++) {
            const a = pokers[i];
            let noColorA = this.getCardValue(a);
            tempArr.push(noColorA);            
        }
        return tempArr;
    },

    // 取消牌型 （就是从已选中的牌arr放进未选中的里面, 从三墩中移除下来
    cancelSelectedArr () {
        // TODO
    },

    /**
     * 按牌值 eg.去除花色
     * @param {any} pokers 
     */
    getAllType(pokers) {
        // 检测同类型的有几张 
        let allPokers = {};
        for (let i = 0; i < pokers.length; i++) {
            const poker = pokers[i];
            if (!allPokers[this.getCardValue(poker)]) {
                allPokers[this.getCardValue(poker)] = [];
            }
            allPokers[this.getCardValue(poker)].push(poker);
        }
        console.log(allPokers);
        return allPokers;
    },
    
    /**
     * 按花色
     * @param {any} pokers 
     */ 
    getAllSameColor (allPokers) {
        let allColorPoker = {};
        for (let i = 0; i < allPokers.length; i++) {
            const poker = allPokers[i];
            let color = this.getCardType(poker);
            if (!allColorPoker[color]) {
                allColorPoker[color] = [];
            }
            allColorPoker[color].push(poker);            
        }
        return allColorPoker;
    },     

    // 数组：集合中获取指定子集的个数
    getSubArr (arr, count) {
        let i;
        let mask;
        let total;
        total = (1 << arr.length); // // 1 << n 即把1的二进制形式，左移n位；因为2^n不好表达，所以采用移位的方式;(n个元素共有2^n个子集，包括空集)
        let totalArr = [];
        for (let j = 0; j < total; j++) {
            let sub = [];
            i = 0; // 每一次循环，i都重新置0；对应原数组中的第一个数字。
            mask = j; // 序号j对应的是第(j+1)个子集。
            while (mask > 0) // 通过移位的方式，直至mask的二进制形式中，所有位都为0。
            {
                if (mask & 1){ // 若mask的二进制形式的最后一位非0，输出该位对应的数字。
                    sub.push(arr[i]);
                } 
                mask >>= 1; // mask右移一位
                i++;
            }
            totalArr.push(sub);
        }
        // console.log(totalArr);  
        let fi = totalArr.filter(((element) => {
            return element.length == count;
        }));     
        // console.log(fi);
        return fi;
    },   

    // 获得所有两对
    getLiangDui (pokerTypeArr) {
        let twoArr = pokerTypeArr[ct.DOUBLE_CARD];
        let LiangDui = [];
        if (twoArr.length > 1) {
            let fi = this.getSubArr(twoArr, 2);       
            LiangDui = fi.filter((element) => {
                return this.getCardValue(element[0][0]) != this.getCardValue(element[1][0]);
            });   
            console.log('两对');
            console.log('----------');
            console.log(LiangDui);
            console.log('----------');
            if (!pokerTypeArr[ct.TWO_DOUBLE]) {
                pokerTypeArr[ct.TWO_DOUBLE] = [];
            }        
            pokerTypeArr[ct.TWO_DOUBLE] = LiangDui;               
        }     
    },

    // 获得所有的葫芦
    getHuLu (pokerTypeArr) {    
        let threeArr = pokerTypeArr[ct.THREE_SAME];
        let twoArr = pokerTypeArr[ct.DOUBLE_CARD];
        let HuLu = [];
        if (threeArr && twoArr) {
            for (let i = 0; i < threeArr.length; i++) {
                const itemA = threeArr[i];
                for (let j = 0; j < twoArr.length; j++) {
                    const itemB = twoArr[j];
                    if (this.getCardValue(itemA[0]) != this.getCardValue(itemB[0])) {
                        let temp = itemA.concat(itemB);
                        HuLu.push(temp);                            
                    }                    
                }                
            }            
            console.log('葫芦');
            console.log('----------');
            console.log(HuLu);
            console.log('----------');
            if (!pokerTypeArr[ct.THREE_TWO_CARD]) {
                pokerTypeArr[ct.THREE_TWO_CARD] = [];
            }        
            pokerTypeArr[ct.THREE_TWO_CARD] = HuLu;            
        }
    },

    // 获得所有的同花
    getSameColor (allColorPoker, pokerTypeArr) {
        for (const key in allColorPoker) {
            if (allColorPoker.hasOwnProperty(key)) {
                const subArr = allColorPoker[key];
                if (subArr.length >= 5) {
                    let fi = this.getSubArr(subArr, 5);
                    if (!pokerTypeArr[ct.SAME_COLOR]) {
                        pokerTypeArr[ct.SAME_COLOR] = [];
                    }        
                    for (let index = 0; index < fi.length; index++) {
                        const element = fi[index];
                        pokerTypeArr[ct.SAME_COLOR].push(element);                    
                    }                                             
                }                
            }
        }
        console.log('同花');
        console.log('----------');
        console.log(pokerTypeArr[ct.SAME_COLOR]);
        console.log('----------');
    },
    // 顺子 只要判断相邻的数字数值是否差1就可以  
    isConnect(cards) {  
        let mark = false;
        if (cards[0] == 11) { // 如果顺子以J打头  就不是顺子
            return mark;
        }              
        if (cards.length < 5) { return false; }
        for (let i = 0; i < cards.length - 1; i++) {
            if (cards[i] == cards[i + 1] - 1) { // 因为大于等于五张且存在二  舍去
                mark = true;
            } else {
                if (mark == true && cards[0] == 2 && i == 3 && cards[cards.length - 1] == 14) { // 2345A
                    mark = true;
                }else {
                    mark = false;                    
                }
                break;
            }
        }
        return mark;
    },

    getConnect (allPokers) {
        let totalArr = [];
        let tmppokers = Object.keys(allPokers);
        let otherPokerLen = 5; // 其他游戏中顺子不止五张  移植斗地主        
        let tempFunc = (fiveCard) => {
            let tempArr = [];

            let oneArr = allPokers[fiveCard[0]];        
            let twoArr = allPokers[fiveCard[1]];        
            let threeArr = allPokers[fiveCard[2]];        
            let fourArr = allPokers[fiveCard[3]];        
            let fiveArr = allPokers[fiveCard[4]];        
            for (let i = 0; i < oneArr.length; i++) {
                const one = oneArr[i];
                for (let o = 0; o < twoArr.length; o++) {
                    const two = twoArr[o];
                    for (let p = 0; p < threeArr.length; p++) {
                        const three = threeArr[p];
                        for (let q = 0; q < fourArr.length; q++) {
                            const four = fourArr[q];
                            for (let x = 0; x < fiveArr.length; x++) {
                                const five = fiveArr[x];
                                let subArr = [];
                                subArr.push(one);
                                subArr.push(two);
                                subArr.push(three);
                                subArr.push(four);
                                subArr.push(five);

                                tempArr.push(subArr);

                            }
                            
                        }
                        
                    }
                }
                
            }
            return tempArr;
        };
        for (let j = 0; j <= tmppokers.length - otherPokerLen; j++) {
            let fiveCard = tmppokers.slice(j, j + otherPokerLen);   //  fivePoker仅仅是个命名 里面牌可能大于五张
            if (this.isConnect(fiveCard)) {
                // let tempSub = tempFunc(fiveCard);
                // totalArr.push(tempFunc(fiveCard));
                totalArr = totalArr.concat(tempFunc(fiveCard));
            }
        }
        console.log('顺子');
        console.log('----------');
        console.log(totalArr);
        console.log('----------');        
    }, 

    // 获得同花顺
    getConnectSameColor (pokerTypeArr) {
        let same_color = pokerTypeArr[ct.SAME_COLOR];
        let totalArr = [];
        if (same_color) {
            for (let i = 0; i < same_color.length; i++) {
                const subArr = same_color[i];
                let fiveCard = subArr.map((value) => {
                    return this.getCardValue(value);
                });                
                if (this.isConnect(fiveCard)) {
                    totalArr.push(subArr);
                }
                
            }
        }
        console.log('同花顺');
        console.log('----------');
        console.log(totalArr);
        console.log('----------');           

    },

    /**
     *
     * 刷新bottom显示可点击的牌型
     * @param {*} pokers
     */
    refreshCT (pokers) {
        let tempPoker = pokers;
        let allPokers = this.getAllType(pokers); // 按牌值分类
        let allColorPoker = this.getAllSameColor(pokers); // 按花色分类
        let pokerTypeArr = {};
        for (const cardValue in allPokers) {
            if (allPokers.hasOwnProperty(cardValue)) {
                const itemArr = allPokers[cardValue]; // 牌大小的数组 如 key: 3 , value : [31,32,33]
                if (itemArr.length >= 2) { // 所有对子
                    if (!pokerTypeArr[ct.DOUBLE_CARD]) {
                        pokerTypeArr[ct.DOUBLE_CARD] = [];
                    }
                    let fi = this.getSubArr(itemArr, 2);
                    for (let index = 0; index < fi.length; index++) {
                        const element = fi[index];
                        pokerTypeArr[ct.DOUBLE_CARD].push(element);                    
                    }
                }

                if (itemArr.length >= 3) { // 所有三条
                    if (!pokerTypeArr[ct.THREE_SAME]) {
                        pokerTypeArr[ct.THREE_SAME] = [];
                    }                    
                    let fi = this.getSubArr(itemArr, 3);
                    for (let index = 0; index < fi.length; index++) {
                        const element = fi[index];
                        pokerTypeArr[ct.THREE_SAME].push(element);                    
                    } 
                } 
                
                if (itemArr.length >= 4) { // 所有铁支
                    if (!pokerTypeArr[ct.FOUR_ONE_CARD]) {
                        pokerTypeArr[ct.FOUR_ONE_CARD] = [];
                    }                    
                    let fi = this.getSubArr(itemArr, 4);
                    for (let index = 0; index < fi.length; index++) {
                        const element = fi[index];
                        pokerTypeArr[ct.FOUR_ONE_CARD].push(element);                    
                    }                    
                } 
                
                if (itemArr.length >= 5) { // 所有五同
                    if (!pokerTypeArr[ct.FIVE_SAME_CARD]) {
                        pokerTypeArr[ct.FIVE_SAME_CARD] = [];
                    }                    
                    let fi = this.getSubArr(itemArr, 5);
                    for (let index = 0; index < fi.length; index++) {
                        const element = fi[index];
                        pokerTypeArr[ct.FIVE_SAME_CARD].push(element);                    
                    }                    
                }                
            }
        }        
        this.getLiangDui(pokerTypeArr); // 两对
        this.getHuLu(pokerTypeArr); // 葫芦

        this.getSameColor(allColorPoker, pokerTypeArr); // 同花

        this.getConnect(allPokers); // 顺子

        this.getConnectSameColor(pokerTypeArr); // 同花顺

        console.log(pokerTypeArr); 

        this.pokerTypeArr = pokerTypeArr;

        return pokerTypeArr;
    },

    // 检测三墩牌型pokerArr [subPokerArr]
    refreshSelectCT (pokerArr) {
        // 同花
        // let tongHua = (len) => {
        //     let allColorPoker = this.getAllSameColor(pokerArr); // 按花色分类
        // };
        let pokerType = ct.ERROR_CARDS;
        let allPokers = this.getAllType(pokerArr); // 按牌值分类
        let allColorPoker = this.getAllSameColor(pokerArr); // 按花色分类
        let len = pokerArr.length;
        if (len == 3) { // 头墩检测： 乌龙 对子 三张（冲三）
            let tmpObj = {
                1:1, // 乌龙
                2:0, // 对子
                4:0, // 三条
            };
            for (const i in allPokers) {
                if (allPokers.hasOwnProperty(i)) {
                    const subArr = allPokers[i];
                    if (subArr.length == 2) {
                        tmpObj['2'] = 1;
                    }                        
                    if (subArr.length == 3) {
                        tmpObj['4'] = 1;
                    }                        
                }
            }
            if (tmpObj['4']) {
                pokerType = ct.THREE_SAME;
            } else if (tmpObj['2']) {
                pokerType = ct.DOUBLE_CARD;
            } else {
                pokerType = ct.WU_LONG;
            }
        } else {
            // TODO 5张牌检测: 五同
            let tmpObj = {
                1:1, // 乌龙
                5:0, // 顺子
                6:0, // 同花
                7:0, // 葫芦
                8:0, // 铁支
                9:0, // 同花顺
                10:0, // 五同
            };
            
            for (const subPokerArr in allPokers) {
                if (allPokers.hasOwnProperty(subPokerArr)) {
                    const valueArr = allPokers[subPokerArr];
                    if (valueArr.length == 5) { // 五同
                        tmpObj['10'] = 1;
                    } else if (valueArr.length == 4) { // 铁支
                        tmpObj['8'] = 1;
                    } else if (valueArr.length == 3) { // 葫芦
                        tmpObj['7'] = 1;
                    }                    
                }
            }
            
            if (tmpObj['10'] != 1) { // 如果是五同 就不用执行同花顺的检测了
                // 同花
                for (const color in allColorPoker) {
                    if (allColorPoker.hasOwnProperty(color)) {
                        const valueArr = allColorPoker[color];
                        if (valueArr.length == 5) {
                            tmpObj['6'] = 1;
                        }                        
                    }
                }
                // 顺子
                let noSameValue = Object.keys(allPokers);
                if (noSameValue.length == 5) { // 牌值不同的数量需要为5张才需要计算顺子
                    let flag = this.isConnect(noSameValue);
                    if (flag) {
                        tmpObj['5'] = 1;                        
                    }
                }

                if (tmpObj['5'] == 1 && tmpObj['6'] == 1) {
                    tmpObj['9'] = 1;
                }

                if (tmpObj['9'] == 1) {
                    pokerType = ct.CONNECT_SAME_CARD;
                } else if (tmpObj['8'] == 1) {
                    pokerType = ct.FOUR_ONE_CARD;
                } else if (tmpObj['7'] == 1) {
                    pokerType = ct.THREE_TWO_CARD;
                } else if (tmpObj['6'] == 1) {
                    pokerType = ct.SAME_COLOR;
                } else if (tmpObj['5'] == 1) {
                    pokerType = ct.CONNECT_CARD;
                } else {
                    pokerType = ct.WU_LONG;
                }
            } else {
                pokerType = ct.FIVE_SAME_CARD;
            }
        }   
        return pokerType;
    },

    // 检测三墩是否能组成特殊牌 (手动摆的时候是不是与服务端传回来的特殊牌顺序一致)
    checkSpecial () {
        // TODO:
    },

    // 三墩排完检测是否有倒水 [[subPokerArr]]
    isDownWater (ctArr, pokerArr) {
        let mark = true;
        let dun1 = pokerArr[0];
        let dun2 = pokerArr[1];
        let dun3 = pokerArr[2];
        let pokers1 = this.getAllType(dun1); // 按牌值分类
        let pokers2 = this.getAllType(dun2); // 按牌值分类
        let pokers3 = this.getAllType(dun3); // 按牌值分类

        // 排序扑克 如 {3:[31], 4:[41,42,43]} 变成 [31,41,42,43]
        let sortPoker = (pp) => {
            let ttArr = [];
            for (const value in pp) {
                if (pp.hasOwnProperty(value)) {
                    const subArr = pp[value];
                    if (ttArr.length) {
                        if (subArr.length > ttArr.length) {
                            ttArr.push(...subArr);
                        } else {
                            ttArr = [...subArr, ...ttArr];
                        }
                    } else {
                        ttArr.push(...subArr);
                    }
                }
            }
            return ttArr;
        };

 
        if (ctArr[0] < ctArr[1] && ctArr[1] < ctArr[2]) { // 一定没有倒水
            mark = false;
        } else if (ctArr[0] > ctArr[1] || ctArr[0] > ctArr[2] || ctArr[1] > ctArr[2]) { // 一定倒水
            mark = true;
        } else {
            // let allPokers = this.getAllType(pokerArr); // 按牌值分类
            // let allColorPoker = this.getAllSameColor(pokerArr); // 按花色分类
    
            // 乌龙对子三条检测
            let wds = (dunA, dunB) => {
                let coreCode = (a, b) => {
                    let flag = false;
                    for (let m = 0; m < b.length; m++) {
                        const valueB = b[b.length - m - 1];                        
                        const valueA = a[a.length - m - 1];
                        if (valueA > valueB) {
                            flag = true;
                            break;
                        }                        
                    }
                    return flag;
                };
                

                let fflag = false;
                let tempObj1 = dunA.slice();
                let tempObj2 = dunB.slice();
                if (tempObj1.length == tempObj2.length) {
                    fflag = coreCode(tempObj1, tempObj2);
                } else { // 有头墩
                    let tempObj22 = tempObj2.slice(2);
                    fflag = coreCode(tempObj1, tempObj22);
                }
                return fflag;
            };


            // 未去除花色
            let a = sortPoker(pokers1);
            let b = sortPoker(pokers2);
            let c = sortPoker(pokers3);
            // 去除花色
            let noColorA = this.spliceColor(a).sort((a, b) => {return a - b;});
            let noColorB = this.spliceColor(b).sort((a, b) => {return a - b;});
            let noColorC = this.spliceColor(c).sort((a, b) => {return a - b;});
            // 牌型相同 冲三葫芦也比较
            if (ctArr[0] == ctArr[1]) { // 头墩与中墩 头墩可能存在的牌型 乌龙 对子  牌型每张都要检测下去
                mark = wds(noColorA, noColorB);
            } else if (ctArr[0] == ctArr[2]) { // 头墩与尾墩
                mark = wds(noColorA, noColorC); 
            } else if (ctArr[1] == ctArr[2]) {
                mark = wds(noColorB, noColorC); 
            }            
        }
        return mark;
    },



    /**
     *
     *
     * @param {*} Type 1: 取出 2: 放入
     * @param {*} tempPokerArr
     * @param {*} copyPokerArr 原生牌型数据的一份拷贝
     */
    checkCurrentTypePoker (Type, tempPokerArr, copyPokerArr) {
        // this.bak_subPokerArr
        if (Type == 1) {
            for (let i = 0; i < tempPokerArr.length; i++) {
                const element1 = tempPokerArr[i];
                let tempIndex = copyPokerArr.indexOf(element1);    
                if (tempIndex != -1) {
                    copyPokerArr.splice(tempIndex, 1);          
                }            
            }
            this.pokerTypeArr = this.refreshCT(copyPokerArr);
        } else {
            copyPokerArr.push(...tempPokerArr);
            this.pokerTypeArr = this.refreshCT(copyPokerArr);
        }
        let tempObj = {
            copyPokerArr: copyPokerArr,
            pokerTypeArr: this.pokerTypeArr,
        };
        return tempObj;   
    },
    
    
};


module.exports = compare;