"use strict";(self.webpackChunkmegaten_fusion_tool=self.webpackChunkmegaten_fusion_tool||[]).push([[913],{4537:(U,D,s)=>{s.d(D,{P:()=>C});var n=s(4769),m=s(6814),i=s(4487),t=s(2173);function T(o,h){1&o&&(n.TgZ(0,"tr")(1,"th"),n._uU(2,"Price"),n.qZA(),n.TgZ(3,"th"),n._uU(4,"Race"),n.qZA(),n.TgZ(5,"th"),n._uU(6,"Lvl"),n.qZA(),n.TgZ(7,"th"),n._uU(8,"Name"),n.qZA()())}function F(o,h){1&o&&(n.TgZ(0,"tr")(1,"th"),n._uU(2,"\u4fa1\u683c"),n.qZA(),n.TgZ(3,"th"),n._uU(4,"\u7a2e\u65cf"),n.qZA(),n.TgZ(5,"th"),n._uU(6,"Lvl"),n.qZA(),n.TgZ(7,"th"),n._uU(8,"\u60aa\u9b54\u540d"),n.qZA()())}function g(o,h){if(1&o&&(n.TgZ(0,"tr")(1,"td"),n._uU(2),n.qZA(),n.TgZ(3,"td"),n._uU(4),n.qZA(),n.TgZ(5,"td"),n._uU(6),n.ALo(7,"lvlToNumber"),n.qZA(),n.TgZ(8,"td")(9,"a",4),n._uU(10),n.qZA()()()),2&o){const p=h.$implicit,a=n.oxw();n.xp6(2),n.Oqu(p.price),n.xp6(2),n.Oqu(p.race1),n.xp6(2),n.Oqu(n.lcZ(7,6,p.lvl1)),n.xp6(3),n.hYB("routerLink","",a.baseUrl,"/",p.name1,""),n.xp6(1),n.Oqu(p.name1)}}let C=(()=>{class o{constructor(){this.title="Special Fusion Ingredients",this.baseUrl="../..",this.isFusion=!1,this.langEn=!0}static#t=this.\u0275fac=function(a){return new(a||o)};static#n=this.\u0275cmp=n.Xpm({type:o,selectors:[["app-fusion-entry-table"]],inputs:{title:"title",baseUrl:"baseUrl",rowData:"rowData",isFusion:"isFusion",langEn:"langEn"},decls:9,vars:5,consts:[[3,"ngClass"],["colspan","4",1,"title"],[4,"ngIf"],[4,"ngFor","ngForOf"],[3,"routerLink"]],template:function(a,d){1&a&&(n.TgZ(0,"table",0)(1,"thead")(2,"tr")(3,"th",1),n._uU(4),n.qZA()(),n.YNc(5,T,9,0,"tr",2),n.YNc(6,F,9,0,"tr",2),n.qZA(),n.TgZ(7,"tbody"),n.YNc(8,g,11,8,"tr",3),n.qZA()()),2&a&&(n.Q6J("ngClass",d.isFusion?"list-table":"entry-table"),n.xp6(4),n.Oqu(d.title),n.xp6(1),n.Q6J("ngIf",d.langEn),n.xp6(1),n.Q6J("ngIf",!d.langEn),n.xp6(2),n.Q6J("ngForOf",d.rowData))},dependencies:[m.mk,m.sg,m.O5,i.rH,t.Yk],encapsulation:2,changeDetection:0})}return o})()},5057:(U,D,s)=>{s.d(D,{tV:()=>A});var n=s(3247),m=s(9217),i=s(7548),t=s(4769),T=s(4487),F=s(2173),g=s(6814),C=s(3808),o=s(5068);const h=["class","app-fusion-pair-table-row"],p=["class","app-fusion-pair-table-header"],a=function(u){return["sortable",u]};function d(u,P){if(1&u&&(t.TgZ(0,"tr")(1,"td",8),t._uU(2),t.qZA()()),2&u){const l=t.oxw();t.xp6(2),t.Oqu(l.langEn?"No fusions found!":"\u5408\u4f53\u306a\u3057")}}function r(u,P){if(1&u&&t._UZ(0,"tr",9),2&u){const l=P.$implicit,_=t.oxw();t.Q6J("ngClass",l.notes)("data",l)("leftBaseUrl",_.leftBaseUrl)("rightBaseUrl",_.rightBaseUrl)}}function E(u,P){if(1&u){const l=t.EpF();t.TgZ(0,"tr")(1,"th",10),t.NdJ("click",function(){t.CHM(l);const e=t.oxw();return t.KtG(e.currRow=e.currRow+e.incrRow)}),t._uU(2),t.qZA()()}if(2&u){const l=t.oxw();t.xp6(1),t.Udp("height",2,"em"),t.xp6(1),t.AsE(" Show next ",l.incrRow," out of ",l.rowData.length-l.currRow," ")}}let f=(()=>{class u{static#t=this.\u0275fac=function(_){return new(_||u)};static#n=this.\u0275cmp=t.Xpm({type:u,selectors:[["tr",8,"app-fusion-pair-table-row"]],inputs:{data:"data",leftBaseUrl:"leftBaseUrl",rightBaseUrl:"rightBaseUrl"},attrs:h,decls:18,vars:15,consts:[[1,"price"],[3,"routerLink"]],template:function(_,e){1&_&&(t.TgZ(0,"td",0),t._uU(1),t.qZA(),t.TgZ(2,"td"),t._uU(3),t.qZA(),t.TgZ(4,"td"),t._uU(5),t.ALo(6,"lvlToNumber"),t.qZA(),t.TgZ(7,"td")(8,"a",1),t._uU(9),t.qZA()(),t.TgZ(10,"td"),t._uU(11),t.qZA(),t.TgZ(12,"td"),t._uU(13),t.ALo(14,"lvlToNumber"),t.qZA(),t.TgZ(15,"td")(16,"a",1),t._uU(17),t.qZA()()),2&_&&(t.xp6(1),t.Oqu(e.data.price),t.xp6(2),t.Oqu(e.data.race1),t.xp6(2),t.Oqu(t.lcZ(6,11,e.data.lvl1)),t.xp6(3),t.hYB("routerLink","",e.leftBaseUrl,"/",e.data.name1,""),t.xp6(1),t.Oqu(e.data.name1),t.xp6(2),t.Oqu(e.data.race2),t.xp6(2),t.Oqu(t.lcZ(14,13,e.data.lvl2)),t.xp6(3),t.hYB("routerLink","",e.rightBaseUrl,"/",e.data.name2,""),t.xp6(1),t.Oqu(e.data.name2))},dependencies:[T.rH,F.Yk],encapsulation:2,changeDetection:0})}return u})(),O=(()=>{class u extends m.j{constructor(){super(...arguments),this.langEn=!0}static#t=this.\u0275fac=function(){let l;return function(e){return(l||(l=t.n5z(u)))(e||u)}}();static#n=this.\u0275cmp=t.Xpm({type:u,selectors:[["tfoot",8,"app-fusion-pair-table-header"]],inputs:{title:"title",leftHeader:"leftHeader",rightHeader:"rightHeader",langEn:"langEn"},features:[t.qOj],attrs:p,decls:23,vars:35,consts:[["colspan","7",1,"title"],["rowSpan","2",3,"ngClass","click"],["colspan","3"],[3,"ngClass","click"]],template:function(_,e){1&_&&(t.TgZ(0,"tr")(1,"th",0),t._uU(2),t.qZA()(),t.TgZ(3,"tr")(4,"th",1),t.NdJ("click",function(){return e.nextSortFunIndex(1)}),t._uU(5),t.qZA(),t.TgZ(6,"th",2),t._uU(7),t.qZA(),t.TgZ(8,"th",2),t._uU(9),t.qZA()(),t.TgZ(10,"tr")(11,"th",3),t.NdJ("click",function(){return e.nextSortFunIndex(2)}),t._uU(12),t.qZA(),t.TgZ(13,"th",3),t.NdJ("click",function(){return e.nextSortFunIndex(3)}),t._uU(14,"Lvl"),t.qZA(),t.TgZ(15,"th",3),t.NdJ("click",function(){return e.nextSortFunIndex(4)}),t._uU(16),t.qZA(),t.TgZ(17,"th",3),t.NdJ("click",function(){return e.nextSortFunIndex(5)}),t._uU(18),t.qZA(),t.TgZ(19,"th",3),t.NdJ("click",function(){return e.nextSortFunIndex(6)}),t._uU(20,"Lvl"),t.qZA(),t.TgZ(21,"th",3),t.NdJ("click",function(){return e.nextSortFunIndex(7)}),t._uU(22),t.qZA()()),2&_&&(t.xp6(2),t.Oqu(e.title),t.xp6(2),t.Udp("width",10,"%"),t.Q6J("ngClass",t.VKq(21,a,e.sortDirClass(1))),t.xp6(1),t.Oqu(e.langEn?"Price":"\u4fa1\u683c"),t.xp6(1),t.Udp("width",45,"%"),t.xp6(1),t.Oqu(e.leftHeader),t.xp6(1),t.Udp("width",45,"%"),t.xp6(1),t.Oqu(e.rightHeader),t.xp6(2),t.Q6J("ngClass",t.VKq(23,a,e.sortDirClass(2))),t.xp6(1),t.Oqu(e.langEn?"Race":"\u7a2e\u65cf"),t.xp6(1),t.Q6J("ngClass",t.VKq(25,a,e.sortDirClass(3))),t.xp6(2),t.Q6J("ngClass",t.VKq(27,a,e.sortDirClass(4))),t.xp6(1),t.Oqu(e.langEn?"Name":"\u60aa\u9b54\u540d"),t.xp6(1),t.Q6J("ngClass",t.VKq(29,a,e.sortDirClass(5))),t.xp6(1),t.Oqu(e.langEn?"Race":"\u7a2e\u65cf"),t.xp6(1),t.Q6J("ngClass",t.VKq(31,a,e.sortDirClass(6))),t.xp6(2),t.Q6J("ngClass",t.VKq(33,a,e.sortDirClass(7))),t.xp6(1),t.Oqu(e.langEn?"Name":"\u60aa\u9b54\u540d"))},dependencies:[g.mk],encapsulation:2,changeDetection:0})}return u})(),A=(()=>{class u extends m.D{constructor(l){super(),this.config=l,this._title="Ingredient 1 x Ingredient 2 = Result",this.leftHeader="Ingredient 1",this.rightHeader="Ingredient 2",this.leftBaseUrl="../..",this.rightBaseUrl="../..",this.initRow=500,this.incrRow=500,this.langEn=!0,this.sortFuns=[],this.currRow=this.initRow;const{raceOrder:_}=l;this.sortFuns=[(e,c)=>e.price-c.price,(e,c)=>e.price-c.price,(e,c)=>100*(_[e.race1]-_[c.race1])+c.lvl1-e.lvl1,(e,c)=>e.lvl1-c.lvl1,(e,c)=>e.name1.localeCompare(c.name1),(e,c)=>100*(_[e.race2]-_[c.race2])+c.lvl2-e.lvl2,(e,c)=>e.lvl2-c.lvl2,(e,c)=>e.name2.localeCompare(c.name2)]}set title(l){this._title=l,this.currRow=this.initRow}get title(){return this._title}getSortFun(l){return this.sortFuns[l]}static#t=this.\u0275fac=function(_){return new(_||u)(t.Y36(i.I7))};static#n=this.\u0275cmp=t.Xpm({type:u,selectors:[["app-fusion-pair-table"]],inputs:{leftHeader:"leftHeader",rightHeader:"rightHeader",leftBaseUrl:"leftBaseUrl",rightBaseUrl:"rightBaseUrl",initRow:"initRow",incrRow:"incrRow",langEn:"langEn",title:"title"},features:[t._Bn([n.L]),t.qOj],decls:11,vars:14,consts:[["appPositionSticky","",1,"list-table"],["appColumnWidths","",1,"app-fusion-pair-table-header",3,"langEn","title","leftHeader","rightHeader","sortFunIndex","sortFunIndexChanged"],["stickyHeader",""],[1,"list-table"],["appColumnWidths","",1,"app-fusion-pair-table-header",3,"langEn","title","leftHeader","rightHeader"],["hiddenHeader",""],[4,"ngIf"],["class","app-fusion-pair-table-row",3,"ngClass","data","leftBaseUrl","rightBaseUrl",4,"ngFor","ngForOf"],["colspan","7"],[1,"app-fusion-pair-table-row",3,"ngClass","data","leftBaseUrl","rightBaseUrl"],["colspan","7",1,"nav",3,"click"]],template:function(_,e){1&_&&(t.TgZ(0,"div")(1,"table",0)(2,"tfoot",1,2),t.NdJ("sortFunIndexChanged",function(b){return e.sortFunIndex=b}),t.qZA()(),t.TgZ(4,"table",3),t._UZ(5,"tfoot",4,5),t.TgZ(7,"tbody"),t.YNc(8,d,3,1,"tr",6),t.YNc(9,r,1,4,"tr",7),t.YNc(10,E,3,4,"tr",6),t.qZA()()()),2&_&&(t.xp6(2),t.Q6J("langEn",e.langEn)("title",e.title)("leftHeader",e.leftHeader)("rightHeader",e.rightHeader)("sortFunIndex",e.sortFunIndex),t.xp6(3),t.Udp("visibility","collapse"),t.Q6J("langEn",e.langEn)("title",e.title)("leftHeader",e.leftHeader)("rightHeader",e.rightHeader),t.xp6(3),t.Q6J("ngIf",!e.rowData.length),t.xp6(1),t.Q6J("ngForOf",e.rowData.slice(0,e.currRow)),t.xp6(1),t.Q6J("ngIf",e.currRow<e.rowData.length))},dependencies:[g.mk,g.sg,g.O5,C.v,o.X,O,f],encapsulation:2,changeDetection:0})}return u})()},5657:(U,D,s)=>{s.d(D,{t:()=>p});var n=s(7548),m=s(6404),i=s(4769),t=s(8711),T=s(6814),F=s(4537),g=s(5057);function C(a,d){if(1&a&&(i.TgZ(0,"table",3)(1,"thead")(2,"tr")(3,"th",4),i._uU(4),i.qZA()()(),i.TgZ(5,"tbody")(6,"tr")(7,"td"),i._uU(8),i.qZA()()()()),2&a){const r=i.oxw();i.xp6(4),i.Oqu(r.langEn?"Special Fusion Condition":"\u5408\u4f53\u6761\u4ef6"),i.xp6(4),i.Oqu(r.fusionPrereq)}}function o(a,d){if(1&a&&i._UZ(0,"app-fusion-entry-table",5),2&a){const r=i.oxw();i.Q6J("langEn",r.langEn)("title",(r.langEn?"Special Fusion Ingredients for ":"\u7279\u6b8a\u5408\u4f53 ")+r.currentDemon)("rowData",r.fusionEntries)("isFusion",!0)}}function h(a,d){if(1&a&&i._UZ(0,"app-fusion-pair-table",6),2&a){const r=i.oxw();i.Q6J("langEn",r.langEn)("title",(r.langEn?"Ingredient 1 x Ingredient 2 = ":"\u60aa\u9b541 x \u60aa\u9b542 = ")+r.currentDemon)("leftHeader",r.langEn?"Ingredient 1":"\u60aa\u9b541")("rightHeader",r.langEn?"Ingredient 2":"\u60aa\u9b542")("rowData",r.fusionPairs)}}let p=(()=>{class a{constructor(r,E,f){this.currentDemonService=r,this.changeDetectorRef=E,this.fusionDataService=f,this.fusionPrereq="",this.langEn=!0,this.fusionEntries=[],this.fusionPairs=[],this.subscriptions=[],this.toFusionEntry=O=>A=>(0,m.Fk)(A,this.compendium),this.toFusionPair=O=>A=>(0,m.S6)(A,this.compendium)}ngOnInit(){this.calculator=this.fusionDataService.fissionCalculator,this.subscriptions.push(this.fusionDataService.compendium.subscribe(r=>{this.compendium=r,this.getForwardFusions()})),this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(r=>{this.fusionChart=r,this.getForwardFusions()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(r=>{this.currentDemon=r,this.getForwardFusions()}))}ngOnDestroy(){for(const r of this.subscriptions)r.unsubscribe()}getForwardFusions(){this.compendium&&this.fusionChart&&this.currentDemon&&(this.changeDetectorRef.markForCheck(),this.langEn=this.currentDemon.charCodeAt(0)<256,this.fusionPrereq=this.compendium.getDemon(this.currentDemon).prereq,this.fusionEntries=this.compendium.getSpecialNameEntries(this.currentDemon).map(this.toFusionEntry(this.currentDemon)),this.fusionPairs=this.calculator.getFusions(this.currentDemon,this.compendium,this.fusionChart).map(this.toFusionPair(this.currentDemon)))}static#t=this.\u0275fac=function(E){return new(E||a)(i.Y36(t.s),i.Y36(i.sBO),i.Y36(n.vE))};static#n=this.\u0275cmp=i.Xpm({type:a,selectors:[["app-smt-fission-table"]],decls:3,vars:3,consts:[["class","list-table",4,"ngIf"],[3,"langEn","title","rowData","isFusion",4,"ngIf"],[3,"langEn","title","leftHeader","rightHeader","rowData",4,"ngIf"],[1,"list-table"],[1,"title"],[3,"langEn","title","rowData","isFusion"],[3,"langEn","title","leftHeader","rightHeader","rowData"]],template:function(E,f){1&E&&(i.YNc(0,C,9,2,"table",0),i.YNc(1,o,1,4,"app-fusion-entry-table",1),i.YNc(2,h,1,5,"app-fusion-pair-table",2)),2&E&&(i.Q6J("ngIf",f.fusionPrereq),i.xp6(1),i.Q6J("ngIf",f.fusionEntries.length),i.xp6(1),i.Q6J("ngIf",f.fusionPairs.length||!f.fusionPrereq&&!f.fusionEntries.length))},dependencies:[T.O5,F.P,g.tV],encapsulation:2,changeDetection:0})}return a})()},4689:(U,D,s)=>{s.d(D,{$:()=>F});var n=s(7548),m=s(6404),i=s(4769),t=s(8711),T=s(5057);let F=(()=>{class g{constructor(o,h,p){this.currentDemonService=o,this.changeDetectorRef=h,this.fusionDataService=p,this.langEn=!0,this.fusionPairs=[],this.subscriptions=[],this.toFusionPair=a=>d=>(0,m.D0)(d,this.compendium)}ngOnInit(){this.calculator=this.fusionDataService.fusionCalculator,this.subscriptions.push(this.fusionDataService.compendium.subscribe(o=>{this.compendium=o,this.getForwardFusions()})),this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(o=>{this.fusionChart=o,this.getForwardFusions()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(o=>{this.currentDemon=o,this.getForwardFusions()}))}ngOnDestroy(){for(const o of this.subscriptions)o.unsubscribe()}getForwardFusions(){this.compendium&&this.fusionChart&&this.currentDemon&&(this.changeDetectorRef.markForCheck(),this.langEn=this.currentDemon.charCodeAt(0)<256,this.fusionPairs=this.calculator.getFusions(this.currentDemon,this.compendium,this.fusionChart).map(this.toFusionPair(this.currentDemon)))}static#t=this.\u0275fac=function(h){return new(h||g)(i.Y36(t.s),i.Y36(i.sBO),i.Y36(n.vE))};static#n=this.\u0275cmp=i.Xpm({type:g,selectors:[["app-smt-fusion-table"]],decls:1,vars:5,consts:[[3,"langEn","title","leftHeader","rightHeader","rowData"]],template:function(h,p){1&h&&i._UZ(0,"app-fusion-pair-table",0),2&h&&i.Q6J("langEn",p.langEn)("title",p.currentDemon+(p.langEn?" x Ingredient 2 = Result":" x \u60aa\u9b542 = \u60aa\u9b54R"))("leftHeader",p.langEn?"Ingredient 2":"\u60aa\u9b542")("rightHeader",p.langEn?"Result":"\u60aa\u9b54R")("rowData",p.fusionPairs)},dependencies:[T.tV],encapsulation:2,changeDetection:0})}return g})()}}]);