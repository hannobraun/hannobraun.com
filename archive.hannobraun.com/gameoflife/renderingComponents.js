(function(){var a=require("spell/common/core/component"),b=require("spell/common/math/Vector"),c={};c.appearance=function(a){return c.buildAppearance(a).build()},c.buildAppearance=function(c){return{_offset:new b(0,0),_scale:new b(1,1),_zIndex:0,withOffset:function(){this._offset=b.fromArguments(arguments);return this},withScale:function(){this._scale=b.fromArguments(arguments);return this},withZIndex:function(a){this._zIndex=a;return this},build:function(){var b={image:c,offset:this._offset,scale:this._scale,zIndex:this._zIndex};return a("appearance",b)}}},c.animation=function(b){var c={currentId:b,nextId:b,frame:0,dt:0};return a("animation",c)},typeof window=="undefined"?module.exports=c:register("spell/common/rendering/renderingComponents",c)})()