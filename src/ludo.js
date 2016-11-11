/**
 * @module ludo
 * @main ludo
 */
window.ludo = {
    form:{ validator:{} },color:{}, dialog:{},remote:{},tree:{},model:{},tpl:{},video:{},storage:{},
    grid:{}, effect:{},paging:{},calendar:{},layout:{},progress:{},keyboard:{},chart:{},
    dataSource:{},controller:{},card:{},canvas:{},socket:{},menu:{},view:{},audio:{}, ludoDB:{}
};

if (navigator.appName == 'Microsoft Internet Explorer'){
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch (e) { }
}

ludo.SINGLETONS = {};

ludo.CmpMgrClass = new Class({
    Extends:Events,
    components:{},
    formElements:{},
    /**
     * Reference to current active component
     * @property object activeComponent
     * @private
     */
    activeComponent:undefined,
    /**
     * Reference to currently selected button
     * @property object activeButton
     * @private
     */
    activeButton:undefined,
    /** Array of available buttons for a component. Used for tab navigation
     * @property array availableButtons
     * @private
     */
    availableButtons:undefined,

    initialize:function () {
        $(document.documentElement).on('keypress', this.autoSubmit.bind(this));
    },

    autoSubmit:function (e) {
        if (e.key == 'enter') {
            if (e.target.tagName.toLowerCase() !== 'textarea') {
                if (this.activeButton) {
                    this.activeButton.click();
                }
            }
        }
        if (e.key == 'tab') {
            var tag = e.target.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') {
                this.selectNextButton();
            }
        }
    },
    registerComponent:function (component) {
        this.components[component.id] = component;
        if (component.buttonBar || component.buttons) {
            component.addEvent('activate', this.selectFirstButton.bind(this));
            component.addEvent('hide', this.clearButtons.bind(this));
        }
        if (component.singleton && component.type) {
            ludo.SINGLETONS[component.type] = component;
        }
    },

    selectFirstButton:function (cmp) {
        if (cmp.isHidden() || !cmp.getButtons) {
            return;
        }

        this.activeComponent = cmp;
        if (this.activeButton) {
            this.activeButton.deSelect();
        }
        this.activeButton = undefined;

        var buttons = this.availableButtons = cmp.getButtons();
        var i;
        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].selected) {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }

        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].type == 'form.SubmitButton') {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }
        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].type == 'form.CancelButton') {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }
    },

    selectNextButton:function () {
        if (this.activeButton) {
            this.activeButton.deSelect();
        }

        var index = this.availableButtons.indexOf(this.activeButton);
        index++;
        if (index >= this.availableButtons.length) {
            index = 0;
        }
        this.activeButton = this.availableButtons[index];
        this.activeButton.select();
    },

    clearButtons:function (cmp) {
        if (this.activeComponent && this.activeComponent.getId() == cmp.getId()) {
            this.activeComponent = undefined;
            this.activeButton = undefined;
            this.activeButton = undefined;
        }
    },

    deleteComponent:function (component) {
        this.clearButtons(component);
        delete this.components[component.getId()];
    },

    get:function (id) {
        return id['initialize'] !== undefined ? id : this.components[id];
    },

    zIndex:1,
    getNewZIndex:function () {
        this.zIndex++;
        return this.zIndex;
    },

    newComponent:function (cmpConfig, parentComponent) {
		console.log('old code');
        cmpConfig = cmpConfig || {};
        if (!this.isConfigObject(cmpConfig)) {
            if (parentComponent) {
                if (cmpConfig.getParent() && cmpConfig.getParent().removeChild) {
                    cmpConfig.getParent().removeChild(cmpConfig);
                }
                cmpConfig.setParentComponent(parentComponent);
            }
            return cmpConfig;
        } else {
            if (parentComponent) {
                cmpConfig.els = cmpConfig.els || {};
                if (!cmpConfig.renderTo && parentComponent.getEl())cmpConfig.renderTo = parentComponent.getEl();
                cmpConfig.parentComponent = parentComponent;
            }
            var ret;
            var cmpType = this.getViewType(cmpConfig, parentComponent);
            if (cmpType.countNameSpaces > 1) {
                var tokens = cmpConfig.type.split(/\./g);
                var ns = tokens.join('.');
                ret = eval('new window.ludo.' + ns + '(cmpConfig)');
                if (!ret.type)ret.type = ns;
                return ret;
            }
            else if (cmpType.nameSpace) {
                if (!window.ludo[cmpType.nameSpace][cmpType.componentType] && parentComponent) {
                    parentComponent.log('Class ludo.' + cmpType.nameSpace + '.' + cmpType.componentType + ' does not exists');
                }
                ret = new window.ludo[cmpType.nameSpace][cmpType.componentType](cmpConfig);
                if (!ret.type)ret.type = cmpType.nameSpace;
                return ret;
            } else {
                if (!window.ludo[cmpType.componentType] && parentComponent) {
                    parentComponent.log('Cannot create object of type ' + cmpType.componentType);
                }
                return new window.ludo[cmpType.componentType](cmpConfig);
            }
        }
    },

    getViewType:function (config, parentComponent) {
        var cmpType = '';
        var nameSpace = '';
        if (config.type) {
            cmpType = config.type;
        }
        else if (config.cType) {
            cmpType = config.cType;
        } else {
            cmpType = parentComponent.cType;
        }
        var countNS = 0;
        if (cmpType.indexOf('.') >= 0) {
            var tokens = cmpType.split(/\./g);
            nameSpace = tokens[0];
            cmpType = tokens[1];
            countNS = tokens.length - 1;
        }
        return {
            nameSpace:nameSpace,
            componentType:cmpType,
            countNameSpaces:countNS
        }
    },

    isConfigObject:function (obj) {
        return obj && obj.initialize ? false : true;
    }
});

ludo.CmpMgr = new ludo.CmpMgrClass();

ludo.getView = function (id) {
    return ludo.CmpMgr.get(id);
};

ludo.get = function (id) {
    return ludo.CmpMgr.get(id);
};

ludo.$ = function(id){
    return ludo.CmpMgr.get(id);
};

ludo._new = function (config) {
    if (config.type && ludo.SINGLETONS[config.type]) {
        return ludo.SINGLETONS[config.type];
    }
    return ludo.factory.create(config);
};


ludo.FormMgrClass = new Class({
    Extends:Events,
    formElements:{},
    elementArray:[],
    posArray:{},
    forms:{},

    add:function (item) {
        var name = item.getName();
        if (!this.formElements[name]) {
            this.formElements[name] = item;
            this.elementArray.push(item);
            this.posArray[item.getId()] = this.elementArray.length - 1;
        }

        item.addEvent('focus', this.setFocus.bind(this));
        item.addEvent('click', this.setFocus.bind(this));

    },

    getNext:function (formComponent) {
        if (this.posArray[formComponent.getId()]) {
            var index = this.posArray[formComponent.getId()];
            if (index < this.elementArray.length - 1) {
                return this.elementArray[index + 1];
            }
        }
        return null;
    },

    get:function (name) {
        return this.formElements[name] ? this.formElements[name] : null;
    },



    currentFocusedElement:undefined,

    setFocus:function (value, component) {
        if (component.isFormElement() && component !== this.currentFocusedElement) {
			if(this.currentFocusedElement && this.currentFocusedElement.hasFocus()){
				this.currentFocusedElement.blur();
			}
            this.currentFocusedElement = component;

            this.fireEvent('focus', component);
        }
    }

});
ludo.Form = new ludo.FormMgrClass();

Events.prototype.on = Events.prototype.addEvent;