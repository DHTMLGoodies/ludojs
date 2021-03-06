/**
 * This class connects view modules and controllers
 * @namespace ludo.controller
 * @class ludo.controller.Manager
 */
ludo.controller.Manager = new Class({
    Extends: ludo.Core,
    controllers : [],
    components : [],

    registerController:function(controller){
        this.controllers.push(controller);
        for(var i=0;i<this.components.length;i++){
            var c = this.components[i];
            if(controller.shouldBeControllerFor(c)){
                this.assignControllerTo(controller,c);
            }
        }
    },

    registerComponent:function(component){
        if(!component.hasController()){
            this.components.push(component);
            var controller = this.getControllerFor(component);
            if(controller){
                this.assignControllerTo(controller,component);
            }
        }
    },

    getControllerFor:function(component){
        for(var i=0;i<this.controllers.length;i++){
            if(this.controllers[i].shouldBeControllerFor(component)){
                return this.controllers[i];
            }
        }
		return undefined;
    },

    assignSpecificControllerFor:function(controller, component){
        if (typeof controller === "string") {
            controller = ludo.get(controller);
            if(controller){
                this.assignControllerTo(controller,component);
            }
            return;
        }
        controller = component.createDependency('controller-' + String.uniqueID(), controller);
        this.assignControllerTo(controller,component);
    },

    assignControllerTo:function(controller, component){
        component.setController(controller);
        controller.addBroadcastFor(component);
        controller.addView(component);
    }
});

ludo.controllerManager = new ludo.controller.Manager();