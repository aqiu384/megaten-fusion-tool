"use strict";(self.webpackChunkmegaten_fusion_tool=self.webpackChunkmegaten_fusion_tool||[]).push([[711],{755:(A,D,u)=>{u.d(D,{n:()=>_});var t=u(4769),f=u(6814),e=u(3934);function g(o,n){1&o&&(t.TgZ(0,"th"),t._uU(1,"Target"),t.qZA())}function T(o,n){1&o&&(t.TgZ(0,"th"),t._uU(1,"Rank"),t.qZA())}function F(o,n){1&o&&(t.TgZ(0,"th"),t._uU(1,"Inherit"),t.qZA())}function Z(o,n){1&o&&(t.TgZ(0,"th"),t._uU(1,"Level"),t.qZA())}const d=function(o,n){return{extra:o,unique:n}};function O(o,n){if(1&o&&t._UZ(0,"tr",4),2&o){const i=n.$implicit,s=t.oxw();t.Q6J("hasTarget",s.hasTarget)("hasRank",s.hasRank)("hasInherit",s.hasInherit)("hasLearned",!1)("hasLvl",s.hasLvl)("skillLvl",i.level)("data",i)("ngClass",t.WLB(8,d,i.rank>70&&i.rank<90,i.rank>90))}}function C(o,n){if(1&o&&(t.TgZ(0,"tr")(1,"td"),t._uU(2),t.qZA()()),2&o){const i=t.oxw();t.xp6(1),t.uIk("colspan",i.skillHeaderLen),t.xp6(1),t.hij("No ",i.title," Found")}}let _=(()=>{var o;class n{constructor(){this.title="Learned Skills",this.hasInherit=!1,this.hasTarget=!1,this.hasRank=!1,this.hasLvl=!0,this.skillHeaderLen=5}ngOnInit(){this.nextColIndices()}ngOnChanges(){this.nextSkills()}nextColIndices(){this.hasInherit&&(this.skillHeaderLen+=1),this.hasTarget&&(this.skillHeaderLen+=1),this.hasRank&&(this.skillHeaderLen+=1)}nextSkills(){this.skills=Object.keys(this.skillLevels).map(s=>this.compendium.getSkill(s));for(const s of this.skills)s.level=this.skillLevels[s.name];this.elemOrder&&this.skills.sort((s,h)=>200*(s.level-h.level)+this.elemOrder[s.element]-this.elemOrder[h.element])}}return(o=n).\u0275fac=function(s){return new(s||o)},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-demon-skills"]],inputs:{title:"title",hasInherit:"hasInherit",hasTarget:"hasTarget",hasRank:"hasRank",hasLvl:"hasLvl",compendium:"compendium",elemOrder:"elemOrder",skillLevels:"skillLevels"},features:[t.TTD],decls:22,vars:8,consts:[[1,"entry-table"],[1,"title"],[4,"ngIf"],["class","app-smt-skill-list-row",3,"hasTarget","hasRank","hasInherit","hasLearned","hasLvl","skillLvl","data","ngClass",4,"ngFor","ngForOf"],[1,"app-smt-skill-list-row",3,"hasTarget","hasRank","hasInherit","hasLearned","hasLvl","skillLvl","data","ngClass"]],template:function(s,h){1&s&&(t.TgZ(0,"table",0)(1,"thead")(2,"tr")(3,"th",1),t._uU(4),t.qZA()(),t.TgZ(5,"tr")(6,"th"),t._uU(7,"Elem"),t.qZA(),t.TgZ(8,"th"),t._uU(9,"Name"),t.qZA(),t.TgZ(10,"th"),t._uU(11,"Cost"),t.qZA(),t.TgZ(12,"th"),t._uU(13,"Effect"),t.qZA(),t.YNc(14,g,2,0,"th",2),t.YNc(15,T,2,0,"th",2),t.YNc(16,F,2,0,"th",2),t.YNc(17,Z,2,0,"th",2),t.qZA()(),t.TgZ(18,"tbody"),t.YNc(19,O,1,11,"tr",3),t.YNc(20,C,3,2,"tr",2),t._UZ(21,"tr"),t.qZA()()),2&s&&(t.xp6(3),t.uIk("colSpan",h.skillHeaderLen),t.xp6(1),t.Oqu(h.title),t.xp6(10),t.Q6J("ngIf",h.hasTarget),t.xp6(1),t.Q6J("ngIf",h.hasRank),t.xp6(1),t.Q6J("ngIf",h.hasInherit),t.xp6(1),t.Q6J("ngIf",h.hasLvl),t.xp6(2),t.Q6J("ngForOf",h.skills),t.xp6(1),t.Q6J("ngIf",!h.skills.length))},dependencies:[f.mk,f.sg,f.O5,e.W],encapsulation:2,changeDetection:0}),n})()},8520:(A,D,u)=>{u.d(D,{O:()=>o});var t=u(4769),f=u(6814);function e(n,i){if(1&n&&(t.TgZ(0,"h2"),t._uU(1),t.qZA()),2&n){const s=t.oxw();t.xp6(1),t.Oqu(s.title)}}function g(n,i){if(1&n&&(t.TgZ(0,"th"),t._uU(1),t.qZA()),2&n){const s=t.oxw();t.xp6(1),t.Oqu(s.langEn?"Price":"\u4fa1\u683c")}}function T(n,i){if(1&n&&(t.TgZ(0,"th"),t._uU(1),t.qZA()),2&n){const s=i.$implicit;t.xp6(1),t.Oqu(s)}}function F(n,i){1&n&&(t.TgZ(0,"th"),t._uU(1,"Inherits"),t.qZA())}function Z(n,i){if(1&n&&(t.TgZ(0,"th"),t._uU(1),t.qZA()),2&n){const s=i.$implicit;t.xp6(1),t.Oqu(s)}}function d(n,i){if(1&n&&(t.TgZ(0,"td"),t._uU(1),t.qZA()),2&n){const s=t.oxw();t.xp6(1),t.Oqu(s.price)}}function O(n,i){if(1&n&&(t.TgZ(0,"td"),t._uU(1),t.qZA()),2&n){const s=i.$implicit;t.xp6(1),t.Oqu(s)}}function C(n,i){if(1&n&&(t.TgZ(0,"td")(1,"div"),t._uU(2),t.qZA()()),2&n){const s=t.oxw();t.xp6(1),t.Gre("element-icon i",s.inherits,""),t.xp6(1),t.Oqu(s.inherits)}}const _=["*"];let o=(()=>{var n;class i{constructor(){this.title="Demon Entry",this.statHeaders=[],this.stats=[],this.fusionHeaders=[],this.price=0,this.langEn=!0}}return(n=i).\u0275fac=function(h){return new(h||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-demon-stats"]],inputs:{title:"title",statHeaders:"statHeaders",stats:"stats",fusionHeaders:"fusionHeaders",inherits:"inherits",price:"price",langEn:"langEn"},ngContentSelectors:_,decls:19,vars:10,consts:[[4,"ngIf"],[1,"entry-table"],[1,"title"],[4,"ngFor","ngForOf"]],template:function(h,m){1&h&&(t.F$t(),t.ynx(0),t.YNc(1,e,2,1,"h2",0),t.TgZ(2,"table",1)(3,"thead")(4,"tr")(5,"th",2),t._uU(6),t.qZA()(),t.TgZ(7,"tr"),t.YNc(8,g,2,1,"th",0),t.YNc(9,T,2,1,"th",3),t.YNc(10,F,2,0,"th",0),t.YNc(11,Z,2,1,"th",3),t.qZA()(),t.TgZ(12,"tbody")(13,"tr"),t.YNc(14,d,2,1,"td",0),t.YNc(15,O,2,1,"td",3),t.YNc(16,C,3,4,"td",0),t.Hsn(17),t.qZA()()(),t.GkF(18),t.BQk()),2&h&&(t.xp6(1),t.Q6J("ngIf",m.title.includes("Lvl")),t.xp6(4),t.uIk("colSpan",m.stats.length+m.fusionHeaders.length+(m.inherits?1:0)+(m.price?1:0)),t.xp6(1),t.hij(" ",m.title.includes("Lvl")?m.langEn?"Stats":"\u30b9\u30c6\u30fc\u30bf\u30b9":m.title," "),t.xp6(2),t.Q6J("ngIf",m.price),t.xp6(1),t.Q6J("ngForOf",m.statHeaders),t.xp6(1),t.Q6J("ngIf",m.inherits),t.xp6(1),t.Q6J("ngForOf",m.fusionHeaders),t.xp6(3),t.Q6J("ngIf",m.price),t.xp6(1),t.Q6J("ngForOf",m.stats),t.xp6(1),t.Q6J("ngIf",m.inherits))},dependencies:[f.sg,f.O5],encapsulation:2,changeDetection:0}),i})()},7363:(A,D,u)=>{u.d(D,{dP:()=>E});var t=u(4769),f=u(3247),e=u(9217),g=u(6814),T=u(4487),F=u(3808),Z=u(5068);const d=["class","app-fusion-trio-table-row"];function O(c,p){if(1&c){const l=t.EpF();t.TgZ(0,"tr")(1,"th",1),t.NdJ("click",function(){t.CHM(l);const a=t.oxw();return t.KtG(a.toggleShowing.emit(a.showIndex))}),t._uU(2," Show "),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td"),t._uU(6),t.qZA(),t.TgZ(7,"td"),t._uU(8),t.qZA(),t.TgZ(9,"td")(10,"a",2),t._uU(11),t.qZA()(),t.TgZ(12,"td",3),t._uU(13),t.qZA()()}if(2&c){const l=t.oxw();t.xp6(1),t.Udp("height",1,"em"),t.xp6(3),t.Oqu(l.trio.minPrice),t.xp6(2),t.Oqu(l.trio.demon.race),t.xp6(2),t.Oqu(l.trio.demon.currLvl),t.xp6(2),t.hYB("routerLink","",l.baseUrl,"/",l.trio.demon.name,""),t.xp6(1),t.Oqu(l.trio.demon.name),t.xp6(1),t.Udp("color","#666"),t.xp6(1),t.hij("",l.trio.fusions.length," recipes hidden")}}function C(c,p){if(1&c&&(t.ynx(0),t.TgZ(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td")(6,"a",2),t._uU(7),t.qZA()(),t.BQk()),2&c){const l=t.oxw().$implicit,r=t.oxw(3);t.xp6(2),t.Oqu(l.race),t.xp6(2),t.Oqu(l.currLvl),t.xp6(2),t.hYB("routerLink","",r.baseUrl,"/",l.name,""),t.xp6(1),t.Oqu(l.name)}}function _(c,p){if(1&c&&(t.ynx(0),t.YNc(1,C,8,5,"ng-container",0),t.BQk()),2&c){const l=p.$implicit,r=t.oxw(3);t.xp6(1),t.Q6J("ngIf",r.trio.demon!==l)}}const o=function(c,p,l){return[c,p,l]};function n(c,p){if(1&c&&(t.TgZ(0,"tr")(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td"),t._uU(6),t.qZA(),t.TgZ(7,"td")(8,"a",2),t._uU(9),t.qZA()(),t.YNc(10,_,2,1,"ng-container",5),t.qZA()),2&c){const l=p.$implicit,r=t.oxw(2);t.xp6(2),t.Oqu(l.price),t.xp6(2),t.Oqu(r.trio.demon.race),t.xp6(2),t.Oqu(r.trio.demon.currLvl),t.xp6(2),t.hYB("routerLink","",r.baseUrl,"/",r.trio.demon.name,""),t.xp6(1),t.Oqu(r.trio.demon.name),t.xp6(1),t.Q6J("ngForOf",t.kEZ(7,o,l.d1,l.d2,l.d3))}}function i(c,p){if(1&c){const l=t.EpF();t.ynx(0),t.TgZ(1,"tr")(2,"th",4),t.NdJ("click",function(){t.CHM(l);const a=t.oxw();return t.KtG(a.toggleShowing.emit(a.showIndex))}),t._uU(3," Hide "),t.qZA()(),t.YNc(4,n,11,11,"tr",5),t.BQk()}if(2&c){const l=t.oxw();t.xp6(2),t.Udp("height",1,"em"),t.uIk("rowspan",l.trio.fusions.length+1),t.xp6(2),t.Q6J("ngForOf",l.trio.fusions)}}const s=["class","app-fusion-trio-table-header"],h=function(c){return["sortable",c]};function m(c,p){1&c&&(t.TgZ(0,"tbody")(1,"tr")(2,"td",8),t._uU(3,"No fusions found!"),t.qZA()()())}function x(c,p){if(1&c){const l=t.EpF();t.TgZ(0,"tbody",9),t.NdJ("toggleShowing",function(a){t.CHM(l);const v=t.oxw();return t.KtG(v.toggleShowing(a))}),t.qZA()}if(2&c){const l=p.$implicit,r=p.index,a=t.oxw();t.Q6J("trio",l)("showing",a.showing[r])("showIndex",r)}}let U=(()=>{var c;class p{constructor(){this.baseUrl="../../..",this.toggleShowing=new t.vpe}}return(c=p).\u0275fac=function(r){return new(r||c)},c.\u0275cmp=t.Xpm({type:c,selectors:[["tbody",8,"app-fusion-trio-table-row"]],inputs:{trio:"trio",showing:"showing",showIndex:"showIndex",baseUrl:"baseUrl"},outputs:{toggleShowing:"toggleShowing"},attrs:d,decls:2,vars:2,consts:[[4,"ngIf"],[1,"nav",3,"click"],[3,"routerLink"],["colspan","6"],[1,"nav","active",3,"click"],[4,"ngFor","ngForOf"]],template:function(r,a){1&r&&(t.YNc(0,O,14,11,"tr",0),t.YNc(1,i,5,4,"ng-container",0)),2&r&&(t.Q6J("ngIf",!a.showing),t.xp6(1),t.Q6J("ngIf",a.showing))},dependencies:[g.sg,g.O5,T.rH],encapsulation:2,changeDetection:0}),p})(),k=(()=>{var c;class p extends e.j{constructor(){super(...arguments),this.hideAll=new t.vpe}toggleHideAll(){this.hideAll.emit(!0)}}return(c=p).\u0275fac=function(){let l;return function(a){return(l||(l=t.n5z(c)))(a||c)}}(),c.\u0275cmp=t.Xpm({type:c,selectors:[["tfoot",8,"app-fusion-trio-table-header"]],inputs:{title:"title",leftHeader:"leftHeader"},outputs:{hideAll:"hideAll"},features:[t.qOj],attrs:s,decls:35,vars:24,consts:[["colspan","11",1,"title"],["rowspan","2",1,"sortable",3,"click"],["rowSpan","2",3,"ngClass","click"],["colspan","3"],[3,"ngClass","click"]],template:function(r,a){1&r&&(t.TgZ(0,"tr")(1,"th",0),t._uU(2),t.qZA()(),t.TgZ(3,"tr")(4,"th",1),t.NdJ("click",function(){return a.toggleHideAll()}),t._uU(5,"Hide All"),t.qZA(),t.TgZ(6,"th",2),t.NdJ("click",function(){return a.nextSortFunIndex(1)}),t._uU(7,"Price"),t.qZA(),t.TgZ(8,"th",3),t._uU(9),t.qZA(),t.TgZ(10,"th",3),t._uU(11,"Ingredient 2"),t.qZA(),t.TgZ(12,"th",3),t._uU(13,"Ingredient 3"),t.qZA()(),t.TgZ(14,"tr")(15,"th",4),t.NdJ("click",function(){return a.nextSortFunIndex(2)}),t._uU(16,"Race"),t.qZA(),t.TgZ(17,"th",4),t.NdJ("click",function(){return a.nextSortFunIndex(3)}),t._uU(18,"Lvl"),t.TgZ(19,"span"),t._uU(20,"--"),t.qZA()(),t.TgZ(21,"th",4),t.NdJ("click",function(){return a.nextSortFunIndex(4)}),t._uU(22,"Name"),t.qZA(),t.TgZ(23,"th"),t._uU(24,"Race"),t.qZA(),t.TgZ(25,"th"),t._uU(26,"Lvl"),t.qZA(),t.TgZ(27,"th"),t._uU(28,"Name"),t.qZA(),t.TgZ(29,"th"),t._uU(30,"Race"),t.qZA(),t.TgZ(31,"th"),t._uU(32,"Lvl"),t.qZA(),t.TgZ(33,"th"),t._uU(34,"Name"),t.qZA()()),2&r&&(t.xp6(2),t.Oqu(a.title),t.xp6(2),t.Udp("width",8,"%"),t.xp6(2),t.Udp("width",8,"%"),t.Q6J("ngClass",t.VKq(16,h,a.sortDirClass(1))),t.xp6(2),t.Udp("width",28,"%"),t.xp6(1),t.Oqu(a.leftHeader),t.xp6(1),t.Udp("width",28,"%"),t.xp6(2),t.Udp("width",28,"%"),t.xp6(3),t.Q6J("ngClass",t.VKq(18,h,a.sortDirClass(2))),t.xp6(2),t.Q6J("ngClass",t.VKq(20,h,a.sortDirClass(3))),t.xp6(4),t.Q6J("ngClass",t.VKq(22,h,a.sortDirClass(4))))},dependencies:[g.mk],styles:["span[_ngcontent-%COMP%]{color:transparent}"],changeDetection:0}),p})(),E=(()=>{var c;class p extends e.D{constructor(r){super(),this.changeDetector=r,this.title="Fusion Trio Table",this.leftHeader="Ingredient 1",this.showing=[],this.sortFuns=[]}ngOnInit(){this.nextSortFuns()}ngAfterViewChecked(){this.matchColWidths()}toggleShowing(r){this.showing[r]=!this.showing[r]}toggleHideAll(){for(let r=0;r<this.showing.length;r++)this.showing[r]=!1}nextSortFuns(){this.sortFuns=[],this.raceOrder&&(this.sortFuns.push((r,a)=>r.minPrice-a.minPrice,(r,a)=>r.minPrice-a.minPrice,(r,a)=>200*(this.raceOrder[r.demon.race]-this.raceOrder[a.demon.race])+r.demon.currLvl-a.demon.currLvl,(r,a)=>r.demon.currLvl-a.demon.currLvl,(r,a)=>r.demon.name.localeCompare(a.demon.name)),this.sort())}getSortFun(r){return this.sortFuns[r]}}return(c=p).\u0275fac=function(r){return new(r||c)(t.Y36(t.sBO))},c.\u0275cmp=t.Xpm({type:c,selectors:[["app-fusion-trio-table"]],inputs:{title:"title",leftHeader:"leftHeader",raceOrder:"raceOrder"},features:[t._Bn([f.L]),t.qOj],decls:9,vars:9,consts:[["appPositionSticky","",1,"list-table"],["appColumnWidths","",1,"app-fusion-trio-table-header",3,"title","leftHeader","sortFunIndex","hideAll","sortFunIndexChanged"],["stickyHeader",""],[1,"list-table"],["appColumnWidths","",1,"app-fusion-trio-table-header",3,"title","leftHeader"],["hiddenHeader",""],[4,"ngIf"],["class","app-fusion-trio-table-row",3,"trio","showing","showIndex","toggleShowing",4,"ngFor","ngForOf"],["colspan","11"],[1,"app-fusion-trio-table-row",3,"trio","showing","showIndex","toggleShowing"]],template:function(r,a){1&r&&(t.TgZ(0,"div")(1,"table",0)(2,"tfoot",1,2),t.NdJ("hideAll",function(){return a.toggleHideAll()})("sortFunIndexChanged",function(I){return a.sortFunIndex=I}),t.qZA()(),t.TgZ(4,"table",3),t._UZ(5,"tfoot",4,5),t.YNc(7,m,4,0,"tbody",6),t.YNc(8,x,1,3,"tbody",7),t.qZA()()),2&r&&(t.xp6(2),t.Q6J("title",a.title)("leftHeader",a.leftHeader)("sortFunIndex",a.sortFunIndex),t.xp6(3),t.Udp("visibility","collapse"),t.Q6J("title",a.title)("leftHeader",a.leftHeader),t.xp6(2),t.Q6J("ngIf",!a.rowData.length),t.xp6(1),t.Q6J("ngForOf",a.rowData))},dependencies:[g.sg,g.O5,F.v,Z.X,k,U],encapsulation:2,changeDetection:0}),p})()},4069:(A,D,u)=>{u.d(D,{O:()=>_});var t=u(3247),f=u(3808),e=u(4769),g=u(6814),T=u(4487);const F=function(){return{exact:!0}};function Z(o,n){if(1&o&&(e.TgZ(0,"th",4)(1,"a",5),e._uU(2),e.qZA()()),2&o){const i=n.$implicit,s=e.oxw();e.Udp("width",100/s.fusionOptions.length,"%"),e.Q6J("routerLink",i.link)("routerLinkActiveOptions",e.DdM(6,F)),e.xp6(1),e.Q6J("routerLink",i.link),e.xp6(1),e.Oqu(i.title)}}function d(o,n){if(1&o&&(e.TgZ(0,"tr")(1,"th",6),e._uU(2),e.qZA()()),2&o){const i=e.oxw();e.xp6(1),e.uIk("colspan",i.fusionOptions.length),e.xp6(1),e.hij(" ",i.langEn?"DLC marked as excluded in fusion settings, results may be inaccurate!":"DLC\u306a\u3057"," ")}}function O(o,n){if(1&o&&(e.TgZ(0,"tr")(1,"th",6),e.Hsn(2),e.qZA()()),2&o){const i=e.oxw();e.xp6(1),e.uIk("colspan",i.fusionOptions.length)}}const C=["*"];let _=(()=>{var o;class n{constructor(){this.hasTripleFusion=!1,this.showFusionAlert=!1,this.excludedDlc=!1,this.langEn=!0,this.fusionOptions=n.NORMAL_FUSIONS_EN}ngOnInit(){this.fusionOptions=this.hasTripleFusion?n.TRIPLE_FUSIONS:this.langEn?n.NORMAL_FUSIONS_EN:n.NORMAL_FUSIONS_JA}ngOnChanges(){setTimeout(()=>this.stickyTable.nextEdges())}}return(o=n).NORMAL_FUSIONS_EN=[{title:"Reverse Fusions",link:"fissions"},{title:"Forward Fusions",link:"fusions"}],o.NORMAL_FUSIONS_JA=[{title:"\u9006\u5f15\u304d\u5408\u4f53",link:"fissions"},{title:"2\u8eab\u5408\u4f53",link:"fusions"}],o.TRIPLE_FUSIONS=[{title:"Normal Reverse Fusions",link:"fissions"},{title:"Triple Reverse Fusions",link:"fissions/triple"},{title:"Triple Forward Fusions",link:"fusions/triple"},{title:"Normal Forward Fusions",link:"fusions"}],o.\u0275fac=function(s){return new(s||o)},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-smt-fusions"]],viewQuery:function(s,h){if(1&s&&e.Gf(f.v,5),2&s){let m;e.iGM(m=e.CRH())&&(h.stickyTable=m.first)}},inputs:{hasTripleFusion:"hasTripleFusion",showFusionAlert:"showFusionAlert",excludedDlc:"excludedDlc",langEn:"langEn"},features:[e._Bn([t.L]),e.TTD],ngContentSelectors:C,decls:11,vars:3,consts:[["appPositionSticky","",1,"list-table"],["stickyTable",""],["class","nav","routerLinkActive","active",3,"routerLink","width","routerLinkActiveOptions",4,"ngFor","ngForOf"],[4,"ngIf"],["routerLinkActive","active",1,"nav",3,"routerLink","routerLinkActiveOptions"],[3,"routerLink"],[1,"title"]],template:function(s,h){1&s&&(e.F$t(),e.TgZ(0,"div")(1,"table",0,1)(3,"thead")(4,"tr"),e.YNc(5,Z,3,7,"th",2),e.qZA(),e.YNc(6,d,3,2,"tr",3),e._UZ(7,"tr"),e.YNc(8,O,3,1,"tr",3),e._UZ(9,"tr"),e.qZA()(),e._UZ(10,"router-outlet"),e.qZA()),2&s&&(e.xp6(5),e.Q6J("ngForOf",h.fusionOptions),e.xp6(1),e.Q6J("ngIf",h.excludedDlc),e.xp6(2),e.Q6J("ngIf",h.showFusionAlert))},dependencies:[g.sg,g.O5,T.lC,T.rH,T.Od,f.v],encapsulation:2,changeDetection:0}),n})()},6857:(A,D,u)=>{u.d(D,{p:()=>Z});var t=u(7548),f=u(6404),e=u(4769),g=u(4487),T=u(8711),F=u(7363);let Z=(()=>{var d;class O{constructor(_,o,n,i){this.route=_,this.currentDemonService=o,this.changeDetectorRef=n,this.fusionTrioService=i,this.subscriptions=[],this.fissionTrios=[],this.toDemonTrio=s=>(0,f.Aw)(s,this.compendium),this.sortDemonTrio=(s,h)=>s.price-h.price}ngOnInit(){this.pairCalculator=this.fusionTrioService.fissionCalculator,this.calculator=this.fusionTrioService.triFissionCalculator,this.subscriptions.push(this.fusionTrioService.compendium.subscribe(_=>{this.compendium=_,this.checkFissions()})),this.subscriptions.push(this.fusionTrioService.squareChart.subscribe(_=>{this.chart=_,this.checkFissions()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(_=>{this.currentDemon=_,this.checkFissions()}))}ngOnDestroy(){for(const _ of this.subscriptions)_.unsubscribe()}checkFissions(){this.compendium&&this.chart&&this.currentDemon&&(this.changeDetectorRef.markForCheck(),this.getFissions())}getFissions(){const o=this.calculator.getFusions(this.currentDemon,this.compendium,this.chart).map(this.toDemonTrio),n={};for(const i of o)for(const s of[i.d1.name,i.d2.name,i.d3.name])n[s]||(n[s]=[]),n[s].push(i);for(const i of Object.values(n))i.sort(this.sortDemonTrio);this.fissionTrios=Object.entries(n).map(i=>({demon:this.compendium.getDemon(i[0]),minPrice:i[1][0].price,fusions:i[1]}))}}return(d=O).\u0275fac=function(_){return new(_||d)(e.Y36(g.gz),e.Y36(T.s),e.Y36(e.sBO),e.Y36(t.Ir))},d.\u0275cmp=e.Xpm({type:d,selectors:[["app-triple-fission-table"]],decls:1,vars:3,consts:[[3,"title","raceOrder","rowData"]],template:function(_,o){1&_&&e._UZ(0,"app-fusion-trio-table",0),2&_&&e.Q6J("title","Ingredient 1 x Ingredient 2 x Ingredient 3 = "+o.currentDemon)("raceOrder",o.chart.raceOrder)("rowData",o.fissionTrios)},dependencies:[F.dP],encapsulation:2,changeDetection:0}),O})()},4170:(A,D,u)=>{u.d(D,{n:()=>Z});var t=u(7548),f=u(6404),e=u(4769),g=u(4487),T=u(8711),F=u(7363);let Z=(()=>{var d;class O{constructor(_,o,n,i){this.route=_,this.currentDemonService=o,this.changeDetectorRef=n,this.fusionTrioService=i,this.subscriptions=[],this.fusionTrios=[],this.toDemonTrio=s=>(0,f.YL)(s,this.compendium),this.sortDemonTrio=(s,h)=>s.price-h.price}ngOnInit(){this.pairCalculator=this.fusionTrioService.fusionCalculator,this.calculator=this.fusionTrioService.triFusionCalculator,this.subscriptions.push(this.fusionTrioService.compendium.subscribe(_=>{this.compendium=_,this.checkFusions()})),this.subscriptions.push(this.fusionTrioService.squareChart.subscribe(_=>{this.chart=_,this.checkFusions()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(_=>{this.currentDemon=_,this.checkFusions()}))}ngOnDestroy(){for(const _ of this.subscriptions)_.unsubscribe()}checkFusions(){this.compendium&&this.chart&&this.currentDemon&&(this.changeDetectorRef.markForCheck(),this.getFusions())}getFusions(){const o=this.calculator.getFusions(this.currentDemon,this.compendium,this.chart).map(this.toDemonTrio),n={};for(const i of o)n[i.d3.name]||(n[i.d3.name]=[]),n[i.d3.name].push(i);for(const i of Object.values(n))i.sort(this.sortDemonTrio);this.fusionTrios=Object.entries(n).map(i=>({demon:this.compendium.getDemon(i[0]),minPrice:i[1][0].price,fusions:i[1]}))}}return(d=O).\u0275fac=function(_){return new(_||d)(e.Y36(g.gz),e.Y36(T.s),e.Y36(e.sBO),e.Y36(t.Ir))},d.\u0275cmp=e.Xpm({type:d,selectors:[["app-triple-fusion-table"]],decls:1,vars:4,consts:[[3,"title","raceOrder","leftHeader","rowData"]],template:function(_,o){1&_&&e._UZ(0,"app-fusion-trio-table",0),2&_&&e.Q6J("title","Result = Lvl "+o.compendium.getDemon(o.currentDemon).currLvl+" "+o.currentDemon+" x Ingredient 2 x Ingredient 3")("raceOrder",o.chart.raceOrder)("leftHeader","Result")("rowData",o.fusionTrios)},dependencies:[F.dP],encapsulation:2,changeDetection:0}),O})()}}]);