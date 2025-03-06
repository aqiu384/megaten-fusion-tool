"use strict";(self.webpackChunkmegaten_fusion_tool=self.webpackChunkmegaten_fusion_tool||[]).push([[5060],{1538:(I,R,a)=>{a.d(R,{a:()=>f});var C=a(1090),s=a(2598),F=a(177),n=a(8935),t=a(4207);function b(p,P){if(1&p&&(s.j41(0,"tr")(1,"td"),s.EFF(2),s.k0s(),s.j41(3,"td"),s.EFF(4),s.k0s(),s.j41(5,"td"),s.EFF(6),s.nI1(7,"lvlToNumber"),s.k0s(),s.j41(8,"td")(9,"a",3),s.EFF(10),s.k0s()()()),2&p){const c=P.$implicit,d=s.XpG();s.R7$(2),s.JRh(c.price),s.R7$(2),s.JRh(c.race1),s.R7$(2),s.JRh(s.bMT(7,6,c.lvl1)),s.R7$(3),s.FCK("routerLink","",d.baseUrl,"/",c.name1,""),s.R7$(1),s.JRh(c.name1)}}let f=(()=>{class p{constructor(){this.title="Special Fusion Ingredients",this.baseUrl="../..",this.isFusion=!1,this.lang="en",this.msgs=C.cK}static{this.\u0275fac=function(d){return new(d||p)}}static{this.\u0275cmp=s.VBU({type:p,selectors:[["app-fusion-entry-table"]],inputs:{title:"title",baseUrl:"baseUrl",rowData:"rowData",isFusion:"isFusion",lang:"lang"},decls:19,vars:15,consts:[[3,"ngClass"],["colspan","4",1,"title"],[4,"ngFor","ngForOf"],[3,"routerLink"]],template:function(d,l){1&d&&(s.j41(0,"table",0)(1,"thead")(2,"tr")(3,"th",1),s.EFF(4),s.k0s()(),s.j41(5,"tr")(6,"th"),s.EFF(7),s.nI1(8,"translateComp"),s.k0s(),s.j41(9,"th"),s.EFF(10),s.nI1(11,"translateComp"),s.k0s(),s.j41(12,"th"),s.EFF(13,"Lvl"),s.k0s(),s.j41(14,"th"),s.EFF(15),s.nI1(16,"translateComp"),s.k0s()()(),s.j41(17,"tbody"),s.DNE(18,b,11,8,"tr",2),s.k0s()()),2&d&&(s.Y8G("ngClass",l.isFusion?"list-table":"entry-table"),s.R7$(4),s.JRh(l.title),s.R7$(3),s.JRh(s.i5U(8,6,l.msgs.Price,l.lang)),s.R7$(3),s.JRh(s.i5U(11,9,l.msgs.Race,l.lang)),s.R7$(5),s.JRh(s.i5U(16,12,l.msgs.Name,l.lang)),s.R7$(3),s.Y8G("ngForOf",l.rowData))},dependencies:[F.YU,F.Sq,n.Wk,t.uz,t.Z2],encapsulation:2,changeDetection:0})}}return p})()},1540:(I,R,a)=>{a.d(R,{cK:()=>E});var C=a(3885),s=a(6661),F=a(6947),n=a(1090),t=a(2598),b=a(8935),f=a(4207),p=a(177),P=a(9108),c=a(361);const d=["class","app-fusion-pair-table-row"],l=["class","app-fusion-pair-table-header"],g=function(r){return["sortable",r]};function m(r,U){if(1&r&&(t.j41(0,"tr")(1,"td",8),t.EFF(2),t.nI1(3,"translateComp"),t.k0s()()),2&r){const o=t.XpG();t.R7$(2),t.JRh(t.i5U(3,1,o.msgs.NoFusionsFound,o.lang))}}function _(r,U){if(1&r&&t.nrm(0,"tr",9),2&r){const o=U.$implicit,h=t.XpG();t.Y8G("ngClass",o.notes)("data",o)("leftBaseUrl",h.leftBaseUrl)("rightBaseUrl",h.rightBaseUrl)}}function T(r,U){if(1&r){const o=t.RV6();t.j41(0,"tr")(1,"th",10),t.bIt("click",function(){t.eBV(o);const e=t.XpG();return t.Njj(e.currRow=e.currRow+e.incrRow)}),t.EFF(2),t.k0s()()}if(2&r){const o=t.XpG();t.R7$(1),t.xc7("height",2,"em"),t.R7$(1),t.Lme(" Show next ",o.incrRow," out of ",o.rowData.length-o.currRow," ")}}let i=(()=>{class r{static{this.\u0275fac=function(h){return new(h||r)}}static{this.\u0275cmp=t.VBU({type:r,selectors:[["tr",8,"app-fusion-pair-table-row"]],inputs:{data:"data",leftBaseUrl:"leftBaseUrl",rightBaseUrl:"rightBaseUrl"},attrs:d,decls:18,vars:15,consts:[[1,"price"],[3,"routerLink"]],template:function(h,e){1&h&&(t.j41(0,"td",0),t.EFF(1),t.k0s(),t.j41(2,"td"),t.EFF(3),t.k0s(),t.j41(4,"td"),t.EFF(5),t.nI1(6,"lvlToNumber"),t.k0s(),t.j41(7,"td")(8,"a",1),t.EFF(9),t.k0s()(),t.j41(10,"td"),t.EFF(11),t.k0s(),t.j41(12,"td"),t.EFF(13),t.nI1(14,"lvlToNumber"),t.k0s(),t.j41(15,"td")(16,"a",1),t.EFF(17),t.k0s()()),2&h&&(t.R7$(1),t.JRh(e.data.price),t.R7$(2),t.JRh(e.data.race1),t.R7$(2),t.JRh(t.bMT(6,11,e.data.lvl1)),t.R7$(3),t.FCK("routerLink","",e.leftBaseUrl,"/",e.data.name1,""),t.R7$(1),t.JRh(e.data.name1),t.R7$(2),t.JRh(e.data.race2),t.R7$(2),t.JRh(t.bMT(14,13,e.data.lvl2)),t.R7$(3),t.FCK("routerLink","",e.rightBaseUrl,"/",e.data.name2,""),t.R7$(1),t.JRh(e.data.name2))},dependencies:[b.Wk,f.Z2],encapsulation:2,changeDetection:0})}}return r})(),D=(()=>{class r extends s.O{constructor(){super(...arguments),this.lang="en",this.msgs=n.cK}static{this.\u0275fac=function(){let o;return function(e){return(o||(o=t.xGo(r)))(e||r)}}()}static{this.\u0275cmp=t.VBU({type:r,selectors:[["tfoot",8,"app-fusion-pair-table-header"]],inputs:{title:"title",leftHeader:"leftHeader",rightHeader:"rightHeader",lang:"lang"},features:[t.Vt3],attrs:l,decls:28,vars:50,consts:[["colspan","7",1,"title"],["rowSpan","2",3,"ngClass","click"],["colspan","3"],[3,"ngClass","click"]],template:function(h,e){1&h&&(t.j41(0,"tr")(1,"th",0),t.EFF(2),t.k0s()(),t.j41(3,"tr")(4,"th",1),t.bIt("click",function(){return e.nextSortFunIndex(1)}),t.EFF(5),t.nI1(6,"translateComp"),t.k0s(),t.j41(7,"th",2),t.EFF(8),t.k0s(),t.j41(9,"th",2),t.EFF(10),t.k0s()(),t.j41(11,"tr")(12,"th",3),t.bIt("click",function(){return e.nextSortFunIndex(2)}),t.EFF(13),t.nI1(14,"translateComp"),t.k0s(),t.j41(15,"th",3),t.bIt("click",function(){return e.nextSortFunIndex(3)}),t.EFF(16,"Lvl"),t.k0s(),t.j41(17,"th",3),t.bIt("click",function(){return e.nextSortFunIndex(4)}),t.EFF(18),t.nI1(19,"translateComp"),t.k0s(),t.j41(20,"th",3),t.bIt("click",function(){return e.nextSortFunIndex(5)}),t.EFF(21),t.nI1(22,"translateComp"),t.k0s(),t.j41(23,"th",3),t.bIt("click",function(){return e.nextSortFunIndex(6)}),t.EFF(24,"Lvl"),t.k0s(),t.j41(25,"th",3),t.bIt("click",function(){return e.nextSortFunIndex(7)}),t.EFF(26),t.nI1(27,"translateComp"),t.k0s()()),2&h&&(t.R7$(2),t.JRh(e.title),t.R7$(2),t.xc7("width",10,"%"),t.Y8G("ngClass",t.eq3(36,g,e.sortDirClass(1))),t.R7$(1),t.JRh(t.i5U(6,21,e.msgs.Price,e.lang)),t.R7$(2),t.xc7("width",45,"%"),t.R7$(1),t.JRh(e.leftHeader),t.R7$(1),t.xc7("width",45,"%"),t.R7$(1),t.JRh(e.rightHeader),t.R7$(2),t.Y8G("ngClass",t.eq3(38,g,e.sortDirClass(2))),t.R7$(1),t.JRh(t.i5U(14,24,e.msgs.Race,e.lang)),t.R7$(2),t.Y8G("ngClass",t.eq3(40,g,e.sortDirClass(3))),t.R7$(2),t.Y8G("ngClass",t.eq3(42,g,e.sortDirClass(4))),t.R7$(1),t.JRh(t.i5U(19,27,e.msgs.Name,e.lang)),t.R7$(2),t.Y8G("ngClass",t.eq3(44,g,e.sortDirClass(5))),t.R7$(1),t.JRh(t.i5U(22,30,e.msgs.Race,e.lang)),t.R7$(2),t.Y8G("ngClass",t.eq3(46,g,e.sortDirClass(6))),t.R7$(2),t.Y8G("ngClass",t.eq3(48,g,e.sortDirClass(7))),t.R7$(1),t.JRh(t.i5U(27,33,e.msgs.Name,e.lang)))},dependencies:[p.YU,f.uz],encapsulation:2,changeDetection:0})}}return r})(),E=(()=>{class r extends s.r{constructor(o){super(),this.config=o,this._title="Ingredient 1 x Ingredient 2 = Result",this.leftHeader="Ingredient 1",this.rightHeader="Ingredient 2",this.leftBaseUrl="../..",this.rightBaseUrl="../..",this.initRow=500,this.incrRow=500,this.lang="en",this.msgs=n.cK,this.sortFuns=[],this.currRow=this.initRow;const{raceOrder:h}=o;this.sortFuns=[(e,u)=>e.price-u.price,(e,u)=>e.price-u.price,(e,u)=>100*(h[e.race1]-h[u.race1])+u.lvl1-e.lvl1,(e,u)=>e.lvl1-u.lvl1,(e,u)=>e.name1.localeCompare(u.name1),(e,u)=>100*(h[e.race2]-h[u.race2])+u.lvl2-e.lvl2,(e,u)=>e.lvl2-u.lvl2,(e,u)=>e.name2.localeCompare(u.name2)]}set title(o){this._title=o,this.currRow=this.initRow}get title(){return this._title}getSortFun(o){return this.sortFuns[o]}static{this.\u0275fac=function(h){return new(h||r)(t.rXU(F.HI))}}static{this.\u0275cmp=t.VBU({type:r,selectors:[["app-fusion-pair-table"]],inputs:{leftHeader:"leftHeader",rightHeader:"rightHeader",leftBaseUrl:"leftBaseUrl",rightBaseUrl:"rightBaseUrl",initRow:"initRow",incrRow:"incrRow",lang:"lang",title:"title"},features:[t.Jv_([C.P]),t.Vt3],decls:11,vars:14,consts:[["appPositionSticky","",1,"list-table"],["appColumnWidths","",1,"app-fusion-pair-table-header",3,"lang","title","leftHeader","rightHeader","sortFunIndex","sortFunIndexChanged"],["stickyHeader",""],[1,"list-table"],["appColumnWidths","",1,"app-fusion-pair-table-header",3,"lang","title","leftHeader","rightHeader"],["hiddenHeader",""],[4,"ngIf"],["class","app-fusion-pair-table-row",3,"ngClass","data","leftBaseUrl","rightBaseUrl",4,"ngFor","ngForOf"],["colspan","7"],[1,"app-fusion-pair-table-row",3,"ngClass","data","leftBaseUrl","rightBaseUrl"],["colspan","7",1,"nav",3,"click"]],template:function(h,e){1&h&&(t.j41(0,"div")(1,"table",0)(2,"tfoot",1,2),t.bIt("sortFunIndexChanged",function(v){return e.sortFunIndex=v}),t.k0s()(),t.j41(4,"table",3),t.nrm(5,"tfoot",4,5),t.j41(7,"tbody"),t.DNE(8,m,4,4,"tr",6),t.DNE(9,_,1,4,"tr",7),t.DNE(10,T,3,4,"tr",6),t.k0s()()()),2&h&&(t.R7$(2),t.Y8G("lang",e.lang)("title",e.title)("leftHeader",e.leftHeader)("rightHeader",e.rightHeader)("sortFunIndex",e.sortFunIndex),t.R7$(3),t.xc7("visibility","collapse"),t.Y8G("lang",e.lang)("title",e.title)("leftHeader",e.leftHeader)("rightHeader",e.rightHeader),t.R7$(3),t.Y8G("ngIf",!e.rowData.length),t.R7$(1),t.Y8G("ngForOf",e.rowData.slice(0,e.currRow)),t.R7$(1),t.Y8G("ngIf",e.currRow<e.rowData.length))},dependencies:[p.YU,p.Sq,p.bT,P.a,c.N,D,i,f.uz],encapsulation:2,changeDetection:0})}}return r})()},2649:(I,R,a)=>{a.d(R,{J:()=>m});var C=a(6947),s=a(4660),F=a(1090),n=a(2598),t=a(8696),b=a(177),f=a(1538),p=a(1540),P=a(4207);function c(_,T){if(1&_&&(n.j41(0,"table",3)(1,"thead")(2,"tr")(3,"th",4),n.EFF(4),n.nI1(5,"translateComp"),n.k0s()()(),n.j41(6,"tbody")(7,"tr")(8,"td"),n.EFF(9),n.k0s()()()()),2&_){const i=n.XpG();n.R7$(4),n.JRh(n.i5U(5,2,i.msgs.SpecialFusionCondition,i.lang)),n.R7$(5),n.JRh(i.fusionPrereq)}}function d(_,T){if(1&_&&(n.nrm(0,"app-fusion-entry-table",5),n.nI1(1,"translateComp")),2&_){const i=n.XpG();n.Y8G("lang",i.lang)("title",n.i5U(1,5,i.msgs.SpecialFusionIngredients,i.lang)+i.currentDemon)("baseUrl",i.hasFissionFromDemons?"../../demons":"../..")("rowData",i.fusionEntries)("isFusion",!0)}}function l(_,T){if(1&_&&(n.nrm(0,"app-fusion-pair-table",6),n.nI1(1,"translateComp"),n.nI1(2,"translateComp"),n.nI1(3,"translateComp")),2&_){const i=n.XpG();n.Y8G("lang",i.lang)("title",n.i5U(1,7,i.msgs.Title,i.lang)+i.currentDemon)("leftHeader",n.i5U(2,10,i.msgs.LeftHeader,i.lang))("rightHeader",n.i5U(3,13,i.msgs.RightHeader,i.lang))("leftBaseUrl",i.hasFissionFromDemons?"../../demons":"../..")("rightBaseUrl",i.hasFissionFromDemons?"../../demons":"../..")("rowData",i.fusionPairs)}}let m=(()=>{class _{constructor(i,D,E){this.currentDemonService=i,this.changeDetectorRef=D,this.fusionDataService=E,this.fusionPrereq="",this.lang="en",this.hasFissionFromDemons=!1,this.fusionEntries=[],this.fusionPairs=[],this.msgs=F.JG,this.subscriptions=[],this.toFusionEntry=r=>U=>(0,s._m)(U,this.compendium),this.toFusionPair=r=>U=>(0,s.on)(U,this.compendium)}ngOnInit(){this.calculator=this.fusionDataService.fissionCalculator,this.subscriptions.push(this.fusionDataService.compendium.subscribe(i=>{this.compendium=i,this.getReverseFissions()})),this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(i=>{this.fusionChart=i,this.getReverseFissions()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(i=>{this.currentDemon=i,this.getReverseFissions()}))}ngOnDestroy(){for(const i of this.subscriptions)i.unsubscribe()}getFusionPairs(){return this.calculator.getFusions(this.currentDemon,this.compendium,this.fusionChart).map(this.toFusionPair(this.currentDemon))}getReverseFissions(){this.compendium&&this.fusionChart&&this.currentDemon&&(this.changeDetectorRef.markForCheck(),this.lang=this.currentDemon.charCodeAt(0)<256?"en":"ja",this.fusionPrereq=this.compendium.getDemon(this.currentDemon).prereq,this.fusionEntries=this.compendium.getSpecialNameEntries(this.currentDemon).map(this.toFusionEntry(this.currentDemon)),this.fusionPairs=this.getFusionPairs())}static{this.\u0275fac=function(D){return new(D||_)(n.rXU(t.i),n.rXU(n.gRc),n.rXU(C.iJ))}}static{this.\u0275cmp=n.VBU({type:_,selectors:[["app-smt-fission-table"]],decls:3,vars:3,consts:[["class","list-table",4,"ngIf"],[3,"lang","title","baseUrl","rowData","isFusion",4,"ngIf"],[3,"lang","title","leftHeader","rightHeader","leftBaseUrl","rightBaseUrl","rowData",4,"ngIf"],[1,"list-table"],[1,"title"],[3,"lang","title","baseUrl","rowData","isFusion"],[3,"lang","title","leftHeader","rightHeader","leftBaseUrl","rightBaseUrl","rowData"]],template:function(D,E){1&D&&(n.DNE(0,c,10,5,"table",0),n.DNE(1,d,2,8,"app-fusion-entry-table",1),n.DNE(2,l,4,16,"app-fusion-pair-table",2)),2&D&&(n.Y8G("ngIf",E.fusionPrereq),n.R7$(1),n.Y8G("ngIf",E.fusionEntries.length),n.R7$(1),n.Y8G("ngIf",E.fusionPairs.length||!E.fusionEntries.length))},dependencies:[b.bT,f.a,p.cK,P.uz],encapsulation:2,changeDetection:0})}}return _})()},3452:(I,R,a)=>{a.d(R,{y:()=>P});var C=a(6947),s=a(4660),F=a(1090),n=a(2598),t=a(8696),b=a(1540),f=a(4207);let P=(()=>{class c{constructor(l,g,m){this.currentDemonService=l,this.changeDetectorRef=g,this.fusionDataService=m,this.lang="en",this.hasFusionToPersonas=!1,this.fusionPairs=[],this.msgs=F.y4,this.subscriptions=[],this.toFusionPair=_=>T=>(0,s.lA)(T,this.compendium)}ngOnInit(){this.calculator=this.fusionDataService.fusionCalculator,this.subscriptions.push(this.fusionDataService.compendium.subscribe(l=>{this.compendium=l,this.getForwardFusions()})),this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(l=>{this.fusionChart=l,this.getForwardFusions()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(l=>{this.currentDemon=l,this.getForwardFusions()}))}ngOnDestroy(){for(const l of this.subscriptions)l.unsubscribe()}getForwardFusions(){this.compendium&&this.fusionChart&&this.currentDemon&&(this.changeDetectorRef.markForCheck(),this.lang=this.currentDemon.charCodeAt(0)<256?"en":"ja",this.fusionPairs=this.calculator.getFusions(this.currentDemon,this.compendium,this.fusionChart).map(this.toFusionPair(this.currentDemon)))}static{this.\u0275fac=function(g){return new(g||c)(n.rXU(t.i),n.rXU(n.gRc),n.rXU(C.iJ))}}static{this.\u0275cmp=n.VBU({type:c,selectors:[["app-smt-fusion-table"]],decls:4,vars:16,consts:[[3,"lang","title","leftHeader","rightHeader","leftBaseUrl","rightBaseUrl","rowData"]],template:function(g,m){1&g&&(n.nrm(0,"app-fusion-pair-table",0),n.nI1(1,"translateComp"),n.nI1(2,"translateComp"),n.nI1(3,"translateComp")),2&g&&n.Y8G("lang",m.lang)("title",m.currentDemon+n.i5U(1,7,m.msgs.Title,m.lang))("leftHeader",n.i5U(2,10,m.msgs.LeftHeader,m.lang))("rightHeader",n.i5U(3,13,m.msgs.RightHeader,m.lang))("leftBaseUrl","..")("rightBaseUrl",m.hasFusionToPersonas?"../../personas":"../..")("rowData",m.fusionPairs)},dependencies:[b.cK,f.uz],encapsulation:2,changeDetection:0})}}return c})()}}]);