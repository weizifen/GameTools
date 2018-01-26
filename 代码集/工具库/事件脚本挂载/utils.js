var utils = {
    /**
     * 
     * 
     * @param {any} node 节点
     * @param {any} target 目标节点
     * @param {any} component 目标节点组件名
     * @param {any} handler 处理方法
     */
    addClickEvent (node, target, component, handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);

    },
    /**
     * 
     * 
     * @param {any} node 节点
     * @param {any} target 目标节点
     * @param {any} component 目标节点组件名
     * @param {any} handler 处理方法
     *  @param {any} customEventData 传值
     */
    addToggleItemEvent (node, target, component, handler, customEventData){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        eventHandler.customEventData = customEventData;
        var clickEvents = node.getComponent(cc.Toggle).clickEvents;
        clickEvents.push(eventHandler);

    },    
    /**
     * 
     * 
     * @param {any} node 节点
     * @param {any} target 目标节点
     * @param {any} component 目标节点组件名(脚本)
     * @param {any} handler 处理方法
     */
    addSlideEvent (node, target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },
    /**
     * 
     * 监听游戏返回键
     * @param {any} node 传入所监听的节点（如this.node）
     */
    addEscEvent (node){
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
            },
            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back){
                    // cc.vv.alert.show('提示','确定要退出游戏吗？',function(){
                    //     cc.game.end();
                    // },true);
                }
            }
        }, node);
    }   
};
module.exports = utils;