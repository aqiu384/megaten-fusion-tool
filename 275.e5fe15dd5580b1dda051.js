(self.webpackChunkmegaten_fusion_tool=self.webpackChunkmegaten_fusion_tool||[]).push([[275],{3015:(t,e,n)=>{"use strict";n.d(e,{P:()=>c});var i=n(5614),s=n(1116),r=n(3522),a=n(6101);function o(t,e){1&t&&(i.TgZ(0,"tr"),i.TgZ(1,"th"),i._uU(2,"Price"),i.qZA(),i.TgZ(3,"th"),i._uU(4,"Race"),i.qZA(),i.TgZ(5,"th"),i._uU(6,"Lvl"),i.qZA(),i.TgZ(7,"th"),i._uU(8,"Name"),i.qZA(),i.qZA())}function u(t,e){1&t&&(i.TgZ(0,"tr"),i.TgZ(1,"th"),i._uU(2,"\u4fa1\u683c"),i.qZA(),i.TgZ(3,"th"),i._uU(4,"\u7a2e\u65cf"),i.qZA(),i.TgZ(5,"th"),i._uU(6,"Lvl"),i.qZA(),i.TgZ(7,"th"),i._uU(8,"\u60aa\u9b54\u540d"),i.qZA(),i.qZA())}function l(t,e){if(1&t&&(i.TgZ(0,"tr"),i.TgZ(1,"td"),i._uU(2),i.qZA(),i.TgZ(3,"td"),i._uU(4),i.qZA(),i.TgZ(5,"td"),i._uU(6),i.ALo(7,"lvlToNumber"),i.qZA(),i.TgZ(8,"td"),i.TgZ(9,"a",4),i._uU(10),i.qZA(),i.qZA(),i.qZA()),2&t){const t=e.$implicit,n=i.oxw();i.xp6(2),i.Oqu(t.price),i.xp6(2),i.Oqu(t.race1),i.xp6(2),i.Oqu(i.lcZ(7,6,t.lvl1)),i.xp6(3),i.hYB("routerLink","",n.baseUrl,"/",t.name1,""),i.xp6(1),i.Oqu(t.name1)}}let c=(()=>{class t{constructor(){this.title="Special Fusion Ingredients",this.baseUrl="../..",this.isFusion=!1,this.langEn=!0}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=i.Xpm({type:t,selectors:[["app-fusion-entry-table"]],inputs:{title:"title",baseUrl:"baseUrl",rowData:"rowData",isFusion:"isFusion",langEn:"langEn"},decls:9,vars:5,consts:[[3,"ngClass"],["colspan","4",1,"title"],[4,"ngIf"],[4,"ngFor","ngForOf"],[3,"routerLink"]],template:function(t,e){1&t&&(i.TgZ(0,"table",0),i.TgZ(1,"thead"),i.TgZ(2,"tr"),i.TgZ(3,"th",1),i._uU(4),i.qZA(),i.qZA(),i.YNc(5,o,9,0,"tr",2),i.YNc(6,u,9,0,"tr",2),i.qZA(),i.TgZ(7,"tbody"),i.YNc(8,l,11,8,"tr",3),i.qZA(),i.qZA()),2&t&&(i.Q6J("ngClass",e.isFusion?"list-table":"entry-table"),i.xp6(4),i.Oqu(e.title),i.xp6(1),i.Q6J("ngIf",e.langEn),i.xp6(1),i.Q6J("ngIf",!e.langEn),i.xp6(2),i.Q6J("ngForOf",e.rowData))},directives:[s.mk,s.O5,s.sg,r.yS],pipes:[a.Yk],encapsulation:2,changeDetection:0}),t})()},6135:(t,e,n)=>{"use strict";n.d(e,{tV:()=>b});var i=n(1501),s=n(4248),r=n(5539),a=n(5614),o=n(3522),u=n(6101),l=n(1116),c=n(649),g=n(2502);const h=["class","app-fusion-pair-table-row"],p=["class","app-fusion-pair-table-header"],d=function(t){return["sortable",t]};function f(t,e){if(1&t&&(a.TgZ(0,"tr"),a.TgZ(1,"td",8),a._uU(2),a.qZA(),a.qZA()),2&t){const t=a.oxw();a.xp6(2),a.Oqu(t.langEn?"No fusions found!":"\u5408\u4f53\u306a\u3057")}}function Z(t,e){if(1&t&&a._UZ(0,"tr",9),2&t){const t=e.$implicit,n=a.oxw();a.Q6J("ngClass",t.notes)("data",t)("leftBaseUrl",n.leftBaseUrl)("rightBaseUrl",n.rightBaseUrl)}}function m(t,e){if(1&t){const t=a.EpF();a.TgZ(0,"tr"),a.TgZ(1,"th",10),a.NdJ("click",function(){a.CHM(t);const e=a.oxw();return e.currRow=e.currRow+e.incrRow}),a._uU(2),a.qZA(),a.qZA()}if(2&t){const t=a.oxw();a.xp6(1),a.Udp("height",2,"em"),a.xp6(1),a.AsE(" Show next ",t.incrRow," out of ",t.rowData.length-t.currRow," ")}}let q=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=a.Xpm({type:t,selectors:[["tr",8,"app-fusion-pair-table-row"]],inputs:{data:"data",leftBaseUrl:"leftBaseUrl",rightBaseUrl:"rightBaseUrl"},attrs:h,decls:18,vars:15,consts:[[1,"price"],[3,"routerLink"]],template:function(t,e){1&t&&(a.TgZ(0,"td",0),a._uU(1),a.qZA(),a.TgZ(2,"td"),a._uU(3),a.qZA(),a.TgZ(4,"td"),a._uU(5),a.ALo(6,"lvlToNumber"),a.qZA(),a.TgZ(7,"td"),a.TgZ(8,"a",1),a._uU(9),a.qZA(),a.qZA(),a.TgZ(10,"td"),a._uU(11),a.qZA(),a.TgZ(12,"td"),a._uU(13),a.ALo(14,"lvlToNumber"),a.qZA(),a.TgZ(15,"td"),a.TgZ(16,"a",1),a._uU(17),a.qZA(),a.qZA()),2&t&&(a.xp6(1),a.Oqu(e.data.price),a.xp6(2),a.Oqu(e.data.race1),a.xp6(2),a.Oqu(a.lcZ(6,11,e.data.lvl1)),a.xp6(3),a.hYB("routerLink","",e.leftBaseUrl,"/",e.data.name1,""),a.xp6(1),a.Oqu(e.data.name1),a.xp6(2),a.Oqu(e.data.race2),a.xp6(2),a.Oqu(a.lcZ(14,13,e.data.lvl2)),a.xp6(3),a.hYB("routerLink","",e.rightBaseUrl,"/",e.data.name2,""),a.xp6(1),a.Oqu(e.data.name2))},directives:[o.yS],pipes:[u.Yk],encapsulation:2,changeDetection:0}),t})(),x=(()=>{class t extends s.j{constructor(){super(...arguments),this.langEn=!0}}return t.\u0275fac=function(){let e;return function(n){return(e||(e=a.n5z(t)))(n||t)}}(),t.\u0275cmp=a.Xpm({type:t,selectors:[["tfoot",8,"app-fusion-pair-table-header"]],inputs:{title:"title",leftHeader:"leftHeader",rightHeader:"rightHeader",langEn:"langEn"},features:[a.qOj],attrs:p,decls:23,vars:35,consts:[["colspan","7",1,"title"],["rowSpan","2",3,"ngClass","click"],["colspan","3"],[3,"ngClass","click"]],template:function(t,e){1&t&&(a.TgZ(0,"tr"),a.TgZ(1,"th",0),a._uU(2),a.qZA(),a.qZA(),a.TgZ(3,"tr"),a.TgZ(4,"th",1),a.NdJ("click",function(){return e.nextSortFunIndex(1)}),a._uU(5),a.qZA(),a.TgZ(6,"th",2),a._uU(7),a.qZA(),a.TgZ(8,"th",2),a._uU(9),a.qZA(),a.qZA(),a.TgZ(10,"tr"),a.TgZ(11,"th",3),a.NdJ("click",function(){return e.nextSortFunIndex(2)}),a._uU(12),a.qZA(),a.TgZ(13,"th",3),a.NdJ("click",function(){return e.nextSortFunIndex(3)}),a._uU(14,"Lvl"),a.qZA(),a.TgZ(15,"th",3),a.NdJ("click",function(){return e.nextSortFunIndex(4)}),a._uU(16),a.qZA(),a.TgZ(17,"th",3),a.NdJ("click",function(){return e.nextSortFunIndex(5)}),a._uU(18),a.qZA(),a.TgZ(19,"th",3),a.NdJ("click",function(){return e.nextSortFunIndex(6)}),a._uU(20,"Lvl"),a.qZA(),a.TgZ(21,"th",3),a.NdJ("click",function(){return e.nextSortFunIndex(7)}),a._uU(22),a.qZA(),a.qZA()),2&t&&(a.xp6(2),a.Oqu(e.title),a.xp6(2),a.Udp("width",10,"%"),a.Q6J("ngClass",a.VKq(21,d,e.sortDirClass(1))),a.xp6(1),a.Oqu(e.langEn?"Price":"\u4fa1\u683c"),a.xp6(1),a.Udp("width",45,"%"),a.xp6(1),a.Oqu(e.leftHeader),a.xp6(1),a.Udp("width",45,"%"),a.xp6(1),a.Oqu(e.rightHeader),a.xp6(2),a.Q6J("ngClass",a.VKq(23,d,e.sortDirClass(2))),a.xp6(1),a.Oqu(e.langEn?"Race":"\u7a2e\u65cf"),a.xp6(1),a.Q6J("ngClass",a.VKq(25,d,e.sortDirClass(3))),a.xp6(2),a.Q6J("ngClass",a.VKq(27,d,e.sortDirClass(4))),a.xp6(1),a.Oqu(e.langEn?"Name":"\u60aa\u9b54\u540d"),a.xp6(1),a.Q6J("ngClass",a.VKq(29,d,e.sortDirClass(5))),a.xp6(1),a.Oqu(e.langEn?"Race":"\u7a2e\u65cf"),a.xp6(1),a.Q6J("ngClass",a.VKq(31,d,e.sortDirClass(6))),a.xp6(2),a.Q6J("ngClass",a.VKq(33,d,e.sortDirClass(7))),a.xp6(1),a.Oqu(e.langEn?"Name":"\u60aa\u9b54\u540d"))},directives:[l.mk],encapsulation:2,changeDetection:0}),t})(),b=(()=>{class t extends s.D{constructor(t){super(),this.config=t,this._title="Ingredient 1 x Ingredient 2 = Result",this.leftHeader="Ingredient 1",this.rightHeader="Ingredient 2",this.leftBaseUrl="../..",this.rightBaseUrl="../..",this.initRow=500,this.incrRow=500,this.langEn=!0,this.sortFuns=[],this.currRow=this.initRow;const{raceOrder:e}=t;this.sortFuns=[(t,e)=>t.price-e.price,(t,e)=>t.price-e.price,(t,n)=>100*(e[t.race1]-e[n.race1])+n.lvl1-t.lvl1,(t,e)=>t.lvl1-e.lvl1,(t,e)=>t.name1.localeCompare(e.name1),(t,n)=>100*(e[t.race2]-e[n.race2])+n.lvl2-t.lvl2,(t,e)=>t.lvl2-e.lvl2,(t,e)=>t.name2.localeCompare(e.name2)]}set title(t){this._title=t,this.currRow=this.initRow}get title(){return this._title}getSortFun(t){return this.sortFuns[t]}}return t.\u0275fac=function(e){return new(e||t)(a.Y36(r.I7))},t.\u0275cmp=a.Xpm({type:t,selectors:[["app-fusion-pair-table"]],inputs:{leftHeader:"leftHeader",rightHeader:"rightHeader",leftBaseUrl:"leftBaseUrl",rightBaseUrl:"rightBaseUrl",initRow:"initRow",incrRow:"incrRow",langEn:"langEn",title:"title"},features:[a._Bn([i.L]),a.qOj],decls:11,vars:14,consts:[["appPositionSticky","",1,"list-table"],["appColumnWidths","",1,"app-fusion-pair-table-header",3,"langEn","title","leftHeader","rightHeader","sortFunIndex","sortFunIndexChanged"],["stickyHeader",""],[1,"list-table"],["appColumnWidths","",1,"app-fusion-pair-table-header",3,"langEn","title","leftHeader","rightHeader"],["hiddenHeader",""],[4,"ngIf"],["class","app-fusion-pair-table-row",3,"ngClass","data","leftBaseUrl","rightBaseUrl",4,"ngFor","ngForOf"],["colspan","7"],[1,"app-fusion-pair-table-row",3,"ngClass","data","leftBaseUrl","rightBaseUrl"],["colspan","7",1,"nav",3,"click"]],template:function(t,e){1&t&&(a.TgZ(0,"div"),a.TgZ(1,"table",0),a.TgZ(2,"tfoot",1,2),a.NdJ("sortFunIndexChanged",function(t){return e.sortFunIndex=t}),a.qZA(),a.qZA(),a.TgZ(4,"table",3),a._UZ(5,"tfoot",4,5),a.TgZ(7,"tbody"),a.YNc(8,f,3,1,"tr",6),a.YNc(9,Z,1,4,"tr",7),a.YNc(10,m,3,4,"tr",6),a.qZA(),a.qZA(),a.qZA()),2&t&&(a.xp6(2),a.Q6J("langEn",e.langEn)("title",e.title)("leftHeader",e.leftHeader)("rightHeader",e.rightHeader)("sortFunIndex",e.sortFunIndex),a.xp6(3),a.Udp("visibility","collapse"),a.Q6J("langEn",e.langEn)("title",e.title)("leftHeader",e.leftHeader)("rightHeader",e.rightHeader),a.xp6(3),a.Q6J("ngIf",!e.rowData.length),a.xp6(1),a.Q6J("ngForOf",e.rowData.slice(0,e.currRow)),a.xp6(1),a.Q6J("ngIf",e.currRow<e.rowData.length))},directives:[c.v,x,g.X,l.O5,l.sg,q,l.mk],encapsulation:2,changeDetection:0}),t})()},5946:(t,e,n)=>{"use strict";n.d(e,{t:()=>p});var i=n(5539),s=n(9859),r=n(5614),a=n(3966),o=n(1116),u=n(3015),l=n(6135);function c(t,e){if(1&t&&(r.TgZ(0,"table",3),r.TgZ(1,"thead"),r.TgZ(2,"tr"),r.TgZ(3,"th",4),r._uU(4),r.qZA(),r.qZA(),r.qZA(),r.TgZ(5,"tbody"),r.TgZ(6,"tr"),r.TgZ(7,"td"),r._uU(8),r.qZA(),r.qZA(),r.qZA(),r.qZA()),2&t){const t=r.oxw();r.xp6(4),r.Oqu(t.langEn?"Special Fusion Condition":"\u5408\u4f53\u6761\u4ef6"),r.xp6(4),r.Oqu(t.fusionPrereq)}}function g(t,e){if(1&t&&r._UZ(0,"app-fusion-entry-table",5),2&t){const t=r.oxw();r.Q6J("langEn",t.langEn)("title",(t.langEn?"Special Fusion Ingredients for ":"\u7279\u6b8a\u5408\u4f53 ")+t.currentDemon)("rowData",t.fusionEntries)("isFusion",!0)}}function h(t,e){if(1&t&&r._UZ(0,"app-fusion-pair-table",6),2&t){const t=r.oxw();r.Q6J("langEn",t.langEn)("title",(t.langEn?"Ingredient 1 x Ingredient 2 = ":"\u60aa\u9b541 x \u60aa\u9b542 = ")+t.currentDemon)("leftHeader",t.langEn?"Ingredient 1":"\u60aa\u9b541")("rightHeader",t.langEn?"Ingredient 2":"\u60aa\u9b542")("rowData",t.fusionPairs)}}let p=(()=>{class t{constructor(t,e,n){this.currentDemonService=t,this.changeDetectorRef=e,this.fusionDataService=n,this.fusionPrereq="",this.langEn=!0,this.fusionEntries=[],this.fusionPairs=[],this.subscriptions=[],this.toFusionEntry=t=>t=>(0,s.Fk)(t,this.compendium),this.toFusionPair=t=>t=>(0,s.S6)(t,this.compendium)}ngOnInit(){this.calculator=this.fusionDataService.fissionCalculator,this.subscriptions.push(this.fusionDataService.compendium.subscribe(t=>{this.compendium=t,this.getForwardFusions()})),this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(t=>{this.fusionChart=t,this.getForwardFusions()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(t=>{this.currentDemon=t,this.getForwardFusions()}))}ngOnDestroy(){for(const t of this.subscriptions)t.unsubscribe()}getForwardFusions(){this.compendium&&this.fusionChart&&this.currentDemon&&(this.changeDetectorRef.markForCheck(),this.langEn=this.currentDemon.charCodeAt(0)<256,this.fusionPrereq=this.compendium.getDemon(this.currentDemon).prereq,this.fusionEntries=this.compendium.getSpecialNameEntries(this.currentDemon).map(this.toFusionEntry(this.currentDemon)),this.fusionPairs=this.calculator.getFusions(this.currentDemon,this.compendium,this.fusionChart).map(this.toFusionPair(this.currentDemon)))}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(a.s),r.Y36(r.sBO),r.Y36(i.vE))},t.\u0275cmp=r.Xpm({type:t,selectors:[["app-smt-fission-table"]],decls:3,vars:3,consts:[["class","list-table",4,"ngIf"],[3,"langEn","title","rowData","isFusion",4,"ngIf"],[3,"langEn","title","leftHeader","rightHeader","rowData",4,"ngIf"],[1,"list-table"],[1,"title"],[3,"langEn","title","rowData","isFusion"],[3,"langEn","title","leftHeader","rightHeader","rowData"]],template:function(t,e){1&t&&(r.YNc(0,c,9,2,"table",0),r.YNc(1,g,1,4,"app-fusion-entry-table",1),r.YNc(2,h,1,5,"app-fusion-pair-table",2)),2&t&&(r.Q6J("ngIf",e.fusionPrereq),r.xp6(1),r.Q6J("ngIf",e.fusionEntries.length),r.xp6(1),r.Q6J("ngIf",e.fusionPairs.length||!e.fusionPrereq&&!e.fusionEntries.length))},directives:[o.O5,u.P,l.tV],encapsulation:2,changeDetection:0}),t})()},2060:(t,e,n)=>{"use strict";n.d(e,{$:()=>u});var i=n(5539),s=n(9859),r=n(5614),a=n(3966),o=n(6135);let u=(()=>{class t{constructor(t,e,n){this.currentDemonService=t,this.changeDetectorRef=e,this.fusionDataService=n,this.langEn=!0,this.fusionPairs=[],this.subscriptions=[],this.toFusionPair=t=>t=>(0,s.D0)(t,this.compendium)}ngOnInit(){this.calculator=this.fusionDataService.fusionCalculator,this.subscriptions.push(this.fusionDataService.compendium.subscribe(t=>{this.compendium=t,this.getForwardFusions()})),this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(t=>{this.fusionChart=t,this.getForwardFusions()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(t=>{this.currentDemon=t,this.getForwardFusions()}))}ngOnDestroy(){for(const t of this.subscriptions)t.unsubscribe()}getForwardFusions(){this.compendium&&this.fusionChart&&this.currentDemon&&(this.changeDetectorRef.markForCheck(),this.langEn=this.currentDemon.charCodeAt(0)<256,this.fusionPairs=this.calculator.getFusions(this.currentDemon,this.compendium,this.fusionChart).map(this.toFusionPair(this.currentDemon)))}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(a.s),r.Y36(r.sBO),r.Y36(i.vE))},t.\u0275cmp=r.Xpm({type:t,selectors:[["app-smt-fusion-table"]],decls:1,vars:5,consts:[[3,"langEn","title","leftHeader","rightHeader","rowData"]],template:function(t,e){1&t&&r._UZ(0,"app-fusion-pair-table",0),2&t&&r.Q6J("langEn",e.langEn)("title",e.currentDemon+(e.langEn?" x Ingredient 2 = Result":" x \u60aa\u9b542 = \u60aa\u9b54R"))("leftHeader",e.langEn?"Ingredient 2":"\u60aa\u9b542")("rightHeader",e.langEn?"Result":"\u60aa\u9b54R")("rowData",e.fusionPairs)},directives:[o.tV],encapsulation:2,changeDetection:0}),t})()}}]);