// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { astar } from "./AStar";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        const grid = new astar.Grid(3, 3);
        grid.setStartNode(0, 0);
        grid.setEndNode(1, 2);
        grid.setWalkable(0, 1, false);
        grid.setWalkable(1, 1, false);
        const astart = new astar.AStar();
        const flag = astart.findPath(grid);
        console.log(flag);
        console.log(astart.path);
    }

    // update (dt) {}
}
