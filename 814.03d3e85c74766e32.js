"use strict";(self.webpackChunkmegaten_fusion_tool=self.webpackChunkmegaten_fusion_tool||[]).push([[814],{755:(U,Z,l)=>{l.d(Z,{n:()=>u});var D=l(627),t=l(4769),e=l(6814),a=l(3934),b=l(2173);function v(s,i){if(1&s&&(t.TgZ(0,"th"),t._uU(1),t.ALo(2,"translateComp"),t.qZA()),2&s){const n=t.oxw();t.xp6(1),t.Oqu(t.xi3(2,1,n.msgs.Target,n.lang))}}function x(s,i){if(1&s&&(t.TgZ(0,"th"),t._uU(1),t.ALo(2,"translateComp"),t.qZA()),2&s){const n=t.oxw();t.xp6(1),t.Oqu(t.xi3(2,1,n.msgs.Rank,n.lang))}}function F(s,i){1&s&&(t.TgZ(0,"th"),t._uU(1,"Inherit"),t.qZA())}function k(s,i){1&s&&(t.TgZ(0,"th"),t._uU(1,"Lvl"),t.qZA())}const c=function(s,i){return{extra:s,unique:i}};function f(s,i){if(1&s&&t._UZ(0,"tr",4),2&s){const n=i.$implicit,o=t.oxw();t.Q6J("hasTarget",o.hasTarget)("hasRank",o.hasRank)("hasInherit",o.hasInherit)("hasLearned",!1)("hasLvl",o.hasLvl)("skillLvl",n.level)("data",n)("ngClass",t.WLB(8,c,n.rank>70&&n.rank<90,n.rank>90))}}function _(s,i){if(1&s&&(t.TgZ(0,"tr")(1,"td"),t._uU(2),t.qZA()()),2&s){const n=t.oxw();t.xp6(1),t.uIk("colspan",n.skillHeaderLen),t.xp6(1),t.hij("No ",n.title," Found")}}let u=(()=>{class s{constructor(){this.title="Learned Skills",this.hasInherit=!1,this.hasTarget=!1,this.hasRank=!1,this.hasLvl=!0,this.lang="en",this.skillHeaderLen=5,this.msgs=D.oI}ngOnInit(){this.nextColIndices()}ngOnChanges(){this.nextSkills()}nextColIndices(){this.hasInherit&&(this.skillHeaderLen+=1),this.hasTarget&&(this.skillHeaderLen+=1),this.hasRank&&(this.skillHeaderLen+=1)}nextSkills(){this.skills=Object.keys(this.skillLevels).map(n=>this.compendium.getSkill(n));for(const n of this.skills)n.level=this.skillLevels[n.name];this.elemOrder&&this.skills.sort((n,o)=>200*(n.level-o.level)+this.elemOrder[n.element]-this.elemOrder[o.element])}static#t=this.\u0275fac=function(o){return new(o||s)};static#e=this.\u0275cmp=t.Xpm({type:s,selectors:[["app-demon-skills"]],inputs:{title:"title",hasInherit:"hasInherit",hasTarget:"hasTarget",hasRank:"hasRank",hasLvl:"hasLvl",compendium:"compendium",elemOrder:"elemOrder",skillLevels:"skillLevels",lang:"lang"},features:[t.TTD],decls:26,vars:24,consts:[[1,"entry-table"],[1,"title"],[4,"ngIf"],["class","app-smt-skill-list-row",3,"hasTarget","hasRank","hasInherit","hasLearned","hasLvl","skillLvl","data","ngClass",4,"ngFor","ngForOf"],[1,"app-smt-skill-list-row",3,"hasTarget","hasRank","hasInherit","hasLearned","hasLvl","skillLvl","data","ngClass"]],template:function(o,h){1&o&&(t.TgZ(0,"table",0)(1,"thead")(2,"tr")(3,"th",1),t._uU(4),t.qZA()(),t.TgZ(5,"tr")(6,"th"),t._uU(7),t.ALo(8,"translateComp"),t.qZA(),t.TgZ(9,"th"),t._uU(10),t.ALo(11,"translateComp"),t.qZA(),t.TgZ(12,"th"),t._uU(13),t.ALo(14,"translateComp"),t.qZA(),t.TgZ(15,"th"),t._uU(16),t.ALo(17,"translateComp"),t.qZA(),t.YNc(18,v,3,4,"th",2),t.YNc(19,x,3,4,"th",2),t.YNc(20,F,2,0,"th",2),t.YNc(21,k,2,0,"th",2),t.qZA()(),t.TgZ(22,"tbody"),t.YNc(23,f,1,11,"tr",3),t.YNc(24,_,3,2,"tr",2),t._UZ(25,"tr"),t.qZA()()),2&o&&(t.xp6(3),t.uIk("colSpan",h.skillHeaderLen),t.xp6(1),t.Oqu(h.title),t.xp6(3),t.Oqu(t.xi3(8,12,h.msgs.Elem,h.lang)),t.xp6(3),t.Oqu(t.xi3(11,15,h.msgs.Name,h.lang)),t.xp6(3),t.Oqu(t.xi3(14,18,h.msgs.Cost,h.lang)),t.xp6(3),t.Oqu(t.xi3(17,21,h.msgs.Effect,h.lang)),t.xp6(2),t.Q6J("ngIf",h.hasTarget),t.xp6(1),t.Q6J("ngIf",h.hasRank),t.xp6(1),t.Q6J("ngIf",h.hasInherit),t.xp6(1),t.Q6J("ngIf",h.hasLvl),t.xp6(2),t.Q6J("ngForOf",h.skills),t.xp6(1),t.Q6J("ngIf",!h.skills.length))},dependencies:[e.mk,e.sg,e.O5,a.W,b.zi],encapsulation:2,changeDetection:0})}return s})()},8520:(U,Z,l)=>{l.d(Z,{O:()=>s});var D=l(627),t=l(4769),e=l(6814),a=l(2173);function b(i,n){if(1&i&&(t.TgZ(0,"h2"),t._uU(1),t.qZA()),2&i){const o=t.oxw();t.xp6(1),t.Oqu(o.title)}}function v(i,n){if(1&i&&(t.TgZ(0,"th"),t._uU(1),t.ALo(2,"translateComp"),t.qZA()),2&i){const o=t.oxw();t.xp6(1),t.Oqu(t.xi3(2,1,o.msgs.Price,o.lang))}}function x(i,n){if(1&i&&(t.TgZ(0,"th"),t._uU(1),t.qZA()),2&i){const o=n.$implicit;t.xp6(1),t.Oqu(o)}}function F(i,n){1&i&&(t.TgZ(0,"th"),t._uU(1,"Inherits"),t.qZA())}function k(i,n){if(1&i&&(t.TgZ(0,"th"),t._uU(1),t.qZA()),2&i){const o=n.$implicit;t.xp6(1),t.Oqu(o)}}function c(i,n){if(1&i&&(t.TgZ(0,"td"),t._uU(1),t.qZA()),2&i){const o=t.oxw();t.xp6(1),t.Oqu(o.price)}}function f(i,n){if(1&i&&(t.TgZ(0,"td"),t._uU(1),t.qZA()),2&i){const o=n.$implicit;t.xp6(1),t.Oqu(o)}}function _(i,n){if(1&i&&(t.TgZ(0,"td")(1,"div"),t._uU(2),t.qZA()()),2&i){const o=t.oxw();t.xp6(1),t.Gre("element-icon i",o.inherits,""),t.xp6(1),t.Oqu(o.inherits)}}const u=["*"];let s=(()=>{class i{constructor(){this.title="Demon Entry",this.statHeaders=[],this.stats=[],this.fusionHeaders=[],this.price=0,this.lang="en",this.msgs=D.Ou}static#t=this.\u0275fac=function(h){return new(h||i)};static#e=this.\u0275cmp=t.Xpm({type:i,selectors:[["app-demon-stats"]],inputs:{title:"title",statHeaders:"statHeaders",stats:"stats",fusionHeaders:"fusionHeaders",inherits:"inherits",price:"price",lang:"lang"},ngContentSelectors:u,decls:20,vars:13,consts:[[4,"ngIf"],[1,"entry-table"],[1,"title"],[4,"ngFor","ngForOf"]],template:function(h,m){1&h&&(t.F$t(),t.ynx(0),t.YNc(1,b,2,1,"h2",0),t.TgZ(2,"table",1)(3,"thead")(4,"tr")(5,"th",2),t._uU(6),t.ALo(7,"translateComp"),t.qZA()(),t.TgZ(8,"tr"),t.YNc(9,v,3,4,"th",0),t.YNc(10,x,2,1,"th",3),t.YNc(11,F,2,0,"th",0),t.YNc(12,k,2,1,"th",3),t.qZA()(),t.TgZ(13,"tbody")(14,"tr"),t.YNc(15,c,2,1,"td",0),t.YNc(16,f,2,1,"td",3),t.YNc(17,_,3,4,"td",0),t.Hsn(18),t.qZA()()(),t.GkF(19),t.BQk()),2&h&&(t.xp6(1),t.Q6J("ngIf",m.title.includes("Lvl")),t.xp6(4),t.uIk("colSpan",m.stats.length+m.fusionHeaders.length+(m.inherits?1:0)+(m.price?1:0)),t.xp6(1),t.hij(" ",m.title.includes("Lvl")?t.xi3(7,10,m.msgs.Stats,m.lang):m.title," "),t.xp6(3),t.Q6J("ngIf",m.price),t.xp6(1),t.Q6J("ngForOf",m.statHeaders),t.xp6(1),t.Q6J("ngIf",m.inherits),t.xp6(1),t.Q6J("ngForOf",m.fusionHeaders),t.xp6(3),t.Q6J("ngIf",m.price),t.xp6(1),t.Q6J("ngForOf",m.stats),t.xp6(1),t.Q6J("ngIf",m.inherits))},dependencies:[e.sg,e.O5,a.zi],encapsulation:2,changeDetection:0})}return i})()},8615:(U,Z,l)=>{l.d(Z,{R:()=>_});var D=l(3184),t=l(627),e=l(4769),a=l(6593),b=l(4487),v=l(6814);function x(u,s){if(1&u&&(e.TgZ(0,"th"),e._uU(1),e.qZA()),2&u){const i=s.$implicit,n=e.oxw();e.xp6(1),e.Oqu(i.slice(0,n.nameCut))}}function F(u,s){if(1&u&&(e.TgZ(0,"td",4),e._uU(1),e.qZA()),2&u){const i=s.$implicit,n=e.oxw(2);e.Q6J("ngClass",i.slice(0,4)),e.xp6(1),e.Oqu(i.slice(4,n.nameCut+4))}}function k(u,s){if(1&u&&(e.TgZ(0,"tr")(1,"th"),e._uU(2),e.qZA(),e.YNc(3,F,2,2,"td",3),e.TgZ(4,"th"),e._uU(5),e.qZA()()),2&u){const i=s.$implicit;e.xp6(2),e.Oqu(i[0]),e.xp6(1),e.Q6J("ngForOf",i.slice(1,i.length-1)),e.xp6(2),e.Oqu(i[i.length-1])}}function c(u,s){if(1&u&&(e.TgZ(0,"th"),e._uU(1),e.qZA()),2&u){const i=s.$implicit,n=e.oxw();e.xp6(1),e.Oqu(i.slice(0,n.nameCut))}}function f(u,s){if(1&u&&(e.TgZ(0,"tr")(1,"th",0),e._uU(2),e.qZA()()),2&u){const i=e.oxw();e.xp6(1),e.uIk("colspan",i.table[0].length),e.xp6(1),e.AsE("",i.appName," ",i.tripTitle,"")}}class _{static#t=this.RESULT_COLORS=Object.entries({oran:["-2","Erthys","Gnome","Saki","Saki Mitama","Random","\u30a2\u30fc\u30b7\u30fc\u30ba","\u30ce\u30fc\u30e0","\u30b5\u30ad\u30df\u30bf\u30de"],redd:["-1","Flaemis","Salamander","Ara ","Ara Mitama","Fiend","\u30d5\u30ec\u30a4\u30df\u30fc\u30ba","\u30b5\u30e9\u30de\u30f3\u30c0\u30fc","\u30a2\u30e9\u30df\u30bf\u30de"],gree:["1","Aeros","Sylph","Kusi","Kusi Mitama","UMA","\u30a8\u30a2\u30ed\u30b9","\u30b7\u30eb\u30ad\u30fc","\u30af\u30b7\u30df\u30bf\u30de"],blue:["2","Aquans","Undine","Nigi","Nigi Mitama","Enigma","\u30a2\u30af\u30a2\u30f3\u30ba","\u30a6\u30f3\u30c7\u30a3\u30fc\u30cd","\u30cb\u30ae\u30df\u30bf\u30de"]});constructor(s,i){this.title2=s,this.route=i,this.normTitle="Normal Fusions",this.tripTitle="",this.isPersona=!1,this.filterDarks=!0,this.lang="en",this.msgs=t.R9,this.subscriptions=[],this.table=[],this.nameCut=4}ngOnInit(){this.subscriptions.push(this.route.parent.data.subscribe(s=>{this.appName=s.appName||"Shin Megami Tensei",this.nameCut=parseInt((0,D.y0)(this.msgs.NameCut,s.lang)),this.title2.setTitle((0,D.y0)(this.msgs.AppTitle,s.lang).replace("$APP",this.appName))}))}ngOnChanges(){this.normChart&&this.fillFusionChart()}ngOnDestroy(){for(const s of this.subscriptions)s.unsubscribe()}fillFusionChart(){const s="noneNone",n=_.RESULT_COLORS.reduce((C,[O,L])=>L.reduce((A,j)=>(A[j]=O,A),C),{}),o=this.normChart.elementDemons;let h=[],m=this.normChart.races,E=[];this.filterDarks&&(h=this.normChart.races.filter(C=>this.normChart.getLightDark(C)>0),m=this.normChart.races.filter(C=>0===this.normChart.getLightDark(C)),E=this.normChart.races.filter(C=>-1===this.normChart.getLightDark(C)),0===E.length&&h.length>0&&(h=this.normChart.races.filter(C=>this.normChart.getLightDark(C)>-1),m=[],E=this.normChart.races.filter(C=>this.normChart.getLightDark(C)<-1)));const R=h.length-E.length,y=h.concat(m,o),P=E.length?E.concat(Array(y.length-E.length).fill("")):y,N=this.mitaTable?y:h.concat(m,Array(o.length).fill("")),S=this.mitaTable||E.length?Array(R).fill("").concat(E,m,o):y;this.table=[[""].concat(y,[""])];for(let C=0;C<S.length;C++){const O=Array(y.length+2).fill("empt-"),L=S[C],A=N[C],j=-1!==o.indexOf(L),g=-1!==o.indexOf(A);this.table.push(O),O[0]=L,O[O.length-1]=A;for(let T=C;T<y.length;T++){const r=y[T],p=-1!==o.indexOf(r);if(p&&g){const d=o.indexOf(A),I=o.indexOf(r),M=this.mitaTable[d][I-d-1];O[T+1]=M?(n[M]||"norm")+M:s}else if(p&&A){const d=this.normChart.getElemFusions(r)[A];O[T+1]=d?(n[d]||"rank")+(d>0?"+":"")+d.toString():s}else if(r&&A){const d=this.isPersona&&r===A?r:this.normChart.getRaceFusion(r,A);O[T+1]=d?(n[d]||(r===A?"elem":"norm"))+d:s}}if(this.tripChart)for(let T=0;T<=C-R;T++){const r=P[T];if(r&&j){const p=this.tripChart.getElemFusions(L)[r];O[T+1]=p?(n[p]||"rank")+(p>0?"+":"")+p.toString():s}else if(r&&L){const p=this.tripChart.getRaceFusion(r,L);O[T+1]=p?(n[p]||(r===L?"elem":"trip"))+p:s}}if(-1!==L.indexOf(" x ")){const[T,r]=L.split(" x "),p=T.slice(0,3)+"x"+r.slice(0,3);O[0]=p,O[O.length-1]=p}else if(-1!==L.indexOf(" ")){const T=L.split(" ")[0];O[0]=T,O[O.length-1]=T}}for(let C=0;C<this.table[0].length;C++){const O=this.table[0][C];if(-1!==O.indexOf(" x ")){const[L,A]=O.split(" x ");this.table[0][C]=L.slice(0,2)+A.slice(0,2)}}this.table.push([""].concat(P,[""]))}static#e=this.\u0275fac=function(i){return new(i||_)(e.Y36(a.Dx),e.Y36(b.gz))};static#s=this.\u0275cmp=e.Xpm({type:_,selectors:[["app-fusion-chart"]],inputs:{normChart:"normChart",tripChart:"tripChart",mitaTable:"mitaTable",normTitle:"normTitle",tripTitle:"tripTitle",isPersona:"isPersona",filterDarks:"filterDarks",lang:"lang",counter:"counter"},features:[e.TTD],decls:12,vars:7,consts:[[1,"title"],[4,"ngFor","ngForOf"],[4,"ngIf"],[3,"ngClass",4,"ngFor","ngForOf"],[3,"ngClass"]],template:function(i,n){1&i&&(e.TgZ(0,"table")(1,"tbody")(2,"tr")(3,"th",0),e._uU(4),e.qZA()(),e.TgZ(5,"tr"),e.YNc(6,x,2,1,"th",1),e.qZA(),e.YNc(7,k,6,3,"tr",1),e.TgZ(8,"tr"),e.YNc(9,c,2,1,"th",1),e.qZA(),e.YNc(10,f,3,3,"tr",2),e.qZA(),e._UZ(11,"tbody"),e.qZA()),2&i&&(e.xp6(3),e.uIk("colspan",n.table[0].length),e.xp6(1),e.AsE("",n.appName," ",n.normTitle,""),e.xp6(2),e.Q6J("ngForOf",n.table[0]),e.xp6(1),e.Q6J("ngForOf",n.table.slice(1,n.table.length-1)),e.xp6(2),e.Q6J("ngForOf",n.table[n.table.length-1]),e.xp6(1),e.Q6J("ngIf",n.tripTitle))},dependencies:[v.mk,v.sg,v.O5],styles:["table[_ngcontent-%COMP%]{width:auto;margin:0 auto;white-space:nowrap}td.elem[_ngcontent-%COMP%]{color:#0f0}td.trip[_ngcontent-%COMP%]{color:#d3d3d3}td.oran[_ngcontent-%COMP%]{color:orange}td.redd[_ngcontent-%COMP%]{color:red}td.gree[_ngcontent-%COMP%]{color:#0f0}td.blue[_ngcontent-%COMP%]{color:#0ff}td.none[_ngcontent-%COMP%]{color:transparent}td.empt[_ngcontent-%COMP%]{background-color:transparent;color:transparent}"],changeDetection:0})}},4069:(U,Z,l)=>{l.d(Z,{O:()=>u});var D=l(3247),t=l(3808),e=l(627),a=l(4769),b=l(6814),v=l(4487),x=l(2173);const F=function(){return{exact:!0}};function k(s,i){if(1&s&&(a.TgZ(0,"th",4)(1,"a",5),a._uU(2),a.ALo(3,"translateComp"),a.qZA()()),2&s){const n=i.$implicit,o=a.oxw();a.Udp("width",100/o.fusionOptions.length,"%"),a.Q6J("routerLink",n.link)("routerLinkActiveOptions",a.DdM(9,F)),a.xp6(1),a.Q6J("routerLink",n.link),a.xp6(1),a.Oqu(a.xi3(3,6,n.title,o.lang))}}function c(s,i){if(1&s&&(a.TgZ(0,"tr")(1,"th",6),a._uU(2),a.ALo(3,"translateComp"),a.qZA()()),2&s){const n=a.oxw();a.xp6(1),a.uIk("colspan",n.fusionOptions.length),a.xp6(1),a.hij(" ",a.xi3(3,2,n.msgs.DlcExcluded,n.lang)," ")}}function f(s,i){if(1&s&&(a.TgZ(0,"tr")(1,"th",6),a.Hsn(2),a.qZA()()),2&s){const n=a.oxw();a.xp6(1),a.uIk("colspan",n.fusionOptions.length)}}const _=["*"];let u=(()=>{class s{constructor(){this.hasTripleFusion=!1,this.showFusionAlert=!1,this.excludedDlc=!1,this.lang="en",this.msgs=e.Od,this.fusionOptions=[{title:this.msgs.NormalFissions,link:"fissions"},{title:this.msgs.NormalFusions,link:"fusions"}]}ngOnInit(){this.hasTripleFusion&&(this.fusionOptions=[{title:this.msgs.DoubleFissions,link:"fissions"},{title:this.msgs.TripleFissions,link:"fissions/triple"},{title:this.msgs.TripleFusions,link:"fusions/triple"},{title:this.msgs.DoubleFusions,link:"fusions"}])}ngOnChanges(){setTimeout(()=>this.stickyTable.nextEdges())}static#t=this.\u0275fac=function(o){return new(o||s)};static#e=this.\u0275cmp=a.Xpm({type:s,selectors:[["app-smt-fusions"]],viewQuery:function(o,h){if(1&o&&a.Gf(t.v,5),2&o){let m;a.iGM(m=a.CRH())&&(h.stickyTable=m.first)}},inputs:{hasTripleFusion:"hasTripleFusion",showFusionAlert:"showFusionAlert",excludedDlc:"excludedDlc",lang:"lang"},features:[a._Bn([D.L]),a.TTD],ngContentSelectors:_,decls:11,vars:3,consts:[["appPositionSticky","",1,"list-table"],["stickyTable",""],["class","nav","routerLinkActive","active",3,"routerLink","width","routerLinkActiveOptions",4,"ngFor","ngForOf"],[4,"ngIf"],["routerLinkActive","active",1,"nav",3,"routerLink","routerLinkActiveOptions"],[3,"routerLink"],[1,"title"]],template:function(o,h){1&o&&(a.F$t(),a.TgZ(0,"div")(1,"table",0,1)(3,"thead")(4,"tr"),a.YNc(5,k,4,10,"th",2),a.qZA(),a.YNc(6,c,4,5,"tr",3),a._UZ(7,"tr"),a.YNc(8,f,3,1,"tr",3),a._UZ(9,"tr"),a.qZA()(),a._UZ(10,"router-outlet"),a.qZA()),2&o&&(a.xp6(5),a.Q6J("ngForOf",h.fusionOptions),a.xp6(1),a.Q6J("ngIf",h.excludedDlc),a.xp6(2),a.Q6J("ngIf",h.showFusionAlert))},dependencies:[b.sg,b.O5,v.lC,v.rH,v.Od,t.v,x.zi],encapsulation:2,changeDetection:0})}return s})()},3917:(U,Z,l)=>{l.d(Z,{V:()=>j});var D=l(4487),t=l(4769),e=l(5553),a=l(6814),b=l(5390);let v=(()=>{class g{constructor(r){this.appCssClasses=r.compConfig.appCssClasses}static#t=this.\u0275fac=function(p){return new(p||g)(t.Y36(e.Y))};static#e=this.\u0275cmp=t.Xpm({type:g,selectors:[["app-smt1-compendium"]],decls:1,vars:2,consts:[[3,"ngClass","hasSettings"]],template:function(p,d){1&p&&t._UZ(0,"app-demon-compendium",0),2&p&&t.Q6J("ngClass",d.appCssClasses)("hasSettings",!1)},dependencies:[a.mk,b.e],styles:[".kuzu div.element-icon{height:12px;background-size:12px;background-repeat:no-repeat;background-position:center;color:transparent}.kuzu div.element-icon.phy{background-image:url(/assets/images/smtsj/phy.png)}.kuzu div.element-icon.gun{background-image:url(/assets/images/smtsj/gun.png)}.kuzu div.element-icon.fir{background-image:url(/assets/images/smtsj/fir.png)}.kuzu div.element-icon.ice{background-image:url(/assets/images/smtsj/ice.png)}.kuzu div.element-icon.ele{background-image:url(/assets/images/smtsj/ele.png)}.kuzu div.element-icon.for{background-image:url(/assets/images/smtsj/win.png)}.kuzu div.element-icon.dea{background-image:url(/assets/images/smtsj/cur.png)}.kuzu div.element-icon.min{background-image:url(/assets/images/smt4f/panic.png)}.kuzu div.element-icon.alm{background-image:url(/assets/images/smtsj/alm.png)}.kuzu div.element-icon.rec{background-image:url(/assets/images/smtsj/rec.png)}.kuzu div.element-icon.sup{background-image:url(/assets/images/smtsj/sup.png)}.kuzu div.element-icon.pas{background-image:url(/assets/images/smtsj/pas.png)}.kuzu div.element-icon.inv{background-image:url(/assets/images/smtsj/spe.png)}.kuzu div.element-icon.bos{background-image:url(/assets/images/smtsj/spe.png)}.kuzu div.element-icon.mys{background-image:url(/assets/images/smt4f/curse.png)}.kuzu div.element-icon.aut{background-image:url(/assets/images/smtsj/spe.png)}.kuzu div.element-icon.rac{background-image:url(/assets/images/smtsj/spe.png)}.kuzu div.element-icon.non{background-image:url(/assets/images/smtsj/spe.png)}.krch th.title,.krch th.nav.active,.krch th.nav.active a{color:#000;background-color:#856363}.krao th.title,.krao th.nav.active,.krao th.nav.active a{color:#fff;background-color:#8e283d}.mjn1 th.title,.mjn1 th.nav.active,.mjn1 th.nav.active a{color:#fff;background-color:#004381}.ds1 th.title,.ds1 th.nav.active,.ds1 th.nav.active a{color:#fff;background-color:#e83145}.ds2 th.title,.ds2 th.nav.active,.ds2 th.nav.active a{color:#fff;background-color:#0078e8}\n"],encapsulation:2,changeDetection:0})}return g})();var x=l(1032),F=l(6593),k=l(4101);let c=(()=>{class g extends x.l{constructor(r,p,d){super(r,p,d),this.appName=`List of Demons - ${d.appName}`,this.compConfig=d.compConfig,this.defaultSortFun=(I,M)=>200*(this.compConfig.raceOrder[I.race]-this.compConfig.raceOrder[M.race])+M.lvl-I.lvl}static#t=this.\u0275fac=function(p){return new(p||g)(t.Y36(F.Dx),t.Y36(t.sBO),t.Y36(e.Y))};static#e=this.\u0275cmp=t.Xpm({type:g,selectors:[["app-demon-list-container"]],features:[t.qOj],decls:2,vars:6,consts:[[3,"raceOrder","statHeaders","resistHeaders","rowData"]],template:function(p,d){1&p&&(t._UZ(0,"app-smt-demon-list",0),t.ALo(1,"async")),2&p&&t.Q6J("raceOrder",d.compConfig.raceOrder)("statHeaders",d.compConfig.baseStats)("resistHeaders",d.compConfig.resistElems)("rowData",t.lcZ(1,4,d.demons))},dependencies:[k.Q,a.Ov],encapsulation:2,changeDetection:0})}return g})();var f=l(4330),_=l(3934);let u=(()=>{class g extends f.e{constructor(r,p,d){super(r,p,d),this.appName=`List of Skills - ${d.appName}`,this.compConfig=d.compConfig,this.defaultSortFun=(I,M)=>1e4*(this.compConfig.elemOrder[I.element]-this.compConfig.elemOrder[M.element])+I.rank-M.rank}static#t=this.\u0275fac=function(p){return new(p||g)(t.Y36(F.Dx),t.Y36(t.sBO),t.Y36(e.Y))};static#e=this.\u0275cmp=t.Xpm({type:g,selectors:[["app-skill-list-container"]],features:[t.qOj],decls:2,vars:6,consts:[[3,"elemOrder","hasRank","hasTarget","rowData"]],template:function(p,d){1&p&&(t._UZ(0,"app-smt-skill-list",0),t.ALo(1,"async")),2&p&&t.Q6J("elemOrder",d.compConfig.elemOrder)("hasRank",!1)("hasTarget",!0)("rowData",t.lcZ(1,4,d.skills))},dependencies:[_.J,a.Ov],encapsulation:2,changeDetection:0})}return g})();var s=l(8615);let i=(()=>{class g{constructor(r){this.fusionDataService=r,this.subscriptions=[]}ngOnInit(){const r=this.fusionDataService.compConfig;this.appName=r.appTitle,this.mitamaTable=r.mitamaTable,this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(p=>{this.normChart=p}))}ngOnDestroy(){for(const r of this.subscriptions)r.unsubscribe()}static#t=this.\u0275fac=function(p){return new(p||g)(t.Y36(e.Y))};static#e=this.\u0275cmp=t.Xpm({type:g,selectors:[["app-fusion-chart-container"]],decls:1,vars:2,consts:[[3,"normChart","mitaTable"]],template:function(p,d){1&p&&t._UZ(0,"app-fusion-chart",0),2&p&&t.Q6J("normChart",d.normChart)("mitaTable",d.mitamaTable)},dependencies:[s.R],encapsulation:2,changeDetection:0})}return g})();var n=l(7880),o=l(8520),h=l(1009),m=l(755),E=l(4069),R=l(8711);const y=function(){return["Personality"]};function P(g,T){if(1&g&&(t.ynx(0),t.TgZ(1,"app-demon-stats",2)(2,"td"),t._uU(3),t.qZA()(),t._UZ(4,"app-demon-resists",3)(5,"app-demon-skills",4)(6,"app-smt-fusions"),t.BQk()),2&g){const r=t.oxw();t.xp6(1),t.Q6J("title","Lvl "+r.demon.lvl+" "+r.demon.race+" "+r.demon.name)("price",r.demon.price)("statHeaders",r.compConfig.baseStats)("fusionHeaders",t.DdM(13,y))("stats",r.demon.stats),t.xp6(2),t.Oqu(r.demon.person),t.xp6(1),t.Q6J("resistHeaders",r.compConfig.resistElems)("resists",r.demon.resists),t.xp6(1),t.Q6J("title","Innate Skills")("hasTarget",!0)("elemOrder",r.compConfig.elemOrder)("compendium",r.compendium)("skillLevels",r.demon.skills)}}function N(g,T){if(1&g&&t._UZ(0,"app-demon-missing",5),2&g){const r=t.oxw();t.Q6J("name",r.name)}}let S=(()=>{class g{static#t=this.\u0275fac=function(p){return new(p||g)};static#e=this.\u0275cmp=t.Xpm({type:g,selectors:[["app-demon-entry"]],inputs:{name:"name",demon:"demon",compendium:"compendium",compConfig:"compConfig"},decls:2,vars:2,consts:[[4,"ngIf"],[3,"name",4,"ngIf"],[3,"title","price","statHeaders","fusionHeaders","stats"],[3,"resistHeaders","resists"],[3,"title","hasTarget","elemOrder","compendium","skillLevels"],[3,"name"]],template:function(p,d){1&p&&(t.YNc(0,P,7,14,"ng-container",0),t.YNc(1,N,1,1,"app-demon-missing",1)),2&p&&(t.Q6J("ngIf",d.demon),t.xp6(1),t.Q6J("ngIf",!d.demon))},dependencies:[a.O5,n.t,o.O,h.I,m.n,E.O],encapsulation:2,changeDetection:0})}return g})(),C=(()=>{class g{constructor(r,p,d,I){this.route=r,this.title=p,this.currentDemonService=d,this.fusionDataService=I,this.subscriptions=[],this.appName="Test App",this.appName=I.appName,this.compConfig=I.compConfig}ngOnInit(){this.subscribeAll()}ngOnDestroy(){for(const r of this.subscriptions)r.unsubscribe()}subscribeAll(){this.subscriptions.push(this.fusionDataService.compendium.subscribe(r=>{this.compendium=r,this.getDemonEntry()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(r=>{this.name=r,this.getDemonEntry()})),this.route.params.subscribe(r=>{this.currentDemonService.nextCurrentDemon(r.demonName)})}getDemonEntry(){this.compendium&&this.name&&(this.title.setTitle(`${this.name} - ${this.appName}`),this.demon=this.compendium.getDemon(this.name))}static#t=this.\u0275fac=function(p){return new(p||g)(t.Y36(D.gz),t.Y36(F.Dx),t.Y36(R.s),t.Y36(e.Y))};static#e=this.\u0275cmp=t.Xpm({type:g,selectors:[["app-demon-entry-container"]],decls:1,vars:4,consts:[[3,"name","demon","compConfig","compendium"]],template:function(p,d){1&p&&t._UZ(0,"app-demon-entry",0),2&p&&t.Q6J("name",d.name)("demon",d.demon)("compConfig",d.compConfig)("compendium",d.compendium)},dependencies:[S],encapsulation:2,changeDetection:0})}return g})();var O=l(5657),L=l(4689);const A=[{path:"",redirectTo:"demons",pathMatch:"full"},{path:"",component:v,data:{fusionTool:"chart"},children:[{path:"chart",component:i}]},{path:"",component:v,children:[{path:"demons/:demonName",component:C,children:[{path:"fissions",component:O.t},{path:"fusions",component:L.$},{path:"**",redirectTo:"fissions",pathMatch:"full"}]},{path:"demons",component:c},{path:"skills",component:u}]},{path:"**",redirectTo:"demons",pathMatch:"full"}];let j=(()=>{class g{static#t=this.\u0275fac=function(p){return new(p||g)};static#e=this.\u0275mod=t.oAB({type:g});static#s=this.\u0275inj=t.cJS({imports:[D.Bz.forChild(A),D.Bz]})}return g})()},5553:(U,Z,l)=>{l.d(Z,{Y:()=>F});var D=l(5619);class t{constructor(c){this.compConfig=c,this.pairRecipes={},this.entryRecipes={},this.initImportedData(),this.updateDerivedData()}estimateKuzuPrice(c){return Math.floor(Math.pow(c.slice(c.length-4).reduce((f,_)=>_+f,0),2)/20)}estimateDesuPrice(c){const f=c.slice(c.length-4).reduce((_,u)=>u+_,0);return Math.floor(((-.01171*f+5.0625)*f-129)*f)+1115}initImportedData(){const c={},f={},_={},u={},s={},i=this.compConfig.isDesu,n={};for(const[o,h]of Object.entries(this.compConfig.resistCodes))n[o]=((h/1e3|0)<<10)+(h%1e3/2.5|0);for(const o of this.compConfig.demonData)for(const[h,m]of Object.entries(o))c[h]={name:h,race:m.race,lvl:m.lvl,currLvl:m.lvl,price:i?this.estimateDesuPrice(m.stats):100*(this.estimateKuzuPrice(m.stats)+m.lvl),inherits:0,stats:m.stats,resists:(m.nresists||m.resists).split("").map(E=>n[E]),skills:m.nskills||m.skills,person:m.person||"",fusion:"normal",prereq:m.prereq||""};for(const o of this.compConfig.skillData)for(const[h,m]of Object.entries(o))f[h]={name:h,rank:m.rank||(1023&m.cost)/10||0,cost:m.cost||0,effect:m.effect||"",target:m.prereq||m.target||"Self",element:m.elem,learnedBy:[],level:0};for(const o of this.compConfig.races)s[o]={};for(const o of Object.values(c).sort((h,m)=>h.lvl-m.lvl)){s[o.race][o.lvl]=o.name;for(const[h,m]of Object.entries(o.skills))f[h].learnedBy.push({demon:o.name,level:m})}for(const[o,h]of Object.entries(this.compConfig.specialRecipes)){const m=h,E=[],R=[],y=c[o];y.fusion=m.length>1?"special":"accident",u[o]=E,_[o]=R;for(const P of m)if(P.includes(" x ")){const[N,S]=P.split(" x ");R.push({name1:N,name2:S}),y.fusion="special"}else E.push(P)}this.demons=c,this.skills=f,this.pairRecipes=_,this.entryRecipes=u,this.invertedDemons=s}updateDerivedData(){const c=Object.assign({},this.demons),f=Object.keys(this.skills).map(s=>this.skills[s]),_={},u={};for(const s of this.compConfig.races)_[s]=[],u[s]=[];for(const[s,i]of Object.entries(this.demons))this.isElementDemon(s)||_[i.race].push(i.lvl),!this.pairRecipes[s]&&!this.entryRecipes[s]&&u[i.race].push(i.lvl);for(const s of this.compConfig.races)_[s].sort((i,n)=>i-n),u[s].sort((i,n)=>i-n);this._allDemons=Object.keys(c).map(s=>c[s]),this._allSkills=f,this.allIngredients=_,this.allResults=u}get allDemons(){return this._allDemons}get allSkills(){return this._allSkills}get specialDemons(){return[]}getDemon(c){return this.demons[c]}getSkill(c){return this.skills[c]}getSkills(c){const f=c.map(_=>this.skills[_]);return f.sort((_,u)=>1e4*(this.compConfig.elemOrder[_.element]-this.compConfig.elemOrder[u.element])+_.rank-u.rank),f}getIngredientDemonLvls(c){return this.allIngredients[c]||[]}getResultDemonLvls(c){return this.allResults[c]||[]}getSpecialNameEntries(c){return this.entryRecipes[c]||[]}getSpecialNamePairs(c){return this.pairRecipes[c]||[]}reverseLookupDemon(c,f){return this.invertedDemons[c][f]}reverseLookupSpecial(c){return[]}isElementDemon(c){return-1!==this.compConfig.elementTable.elems.indexOf(c)}updateFusionSettings(c){}}var e=l(6262);class a extends e.g{constructor(c){super(),this.initCharts(c)}initCharts(c){const f=c.normalTable.races,_=c.normalTable.table,u=c.elementTable.elems,s=c.elementTable.races,i=c.elementTable.table;this.races=f,this.elementDemons=u,this.lvlModifier=c.fusionLvlMod,this.fusionChart=e.g.loadFusionTableJson(f,_),this.fissionChart=e.g.loadFissionTableJson(f,[],_),this.elementChart={},this.elementChart=u.length?e.g.loadElementTableJson(s,u,i):f.reduce((n,o)=>(n[o]=[],n),{})}getLightDark(c){return 0}getRaceFusions(c){return Object.assign({},super.getRaceFusions(c))}}var b=l(7548),v=l(4769),x=l(4487);let F=(()=>{class k{constructor(f,_){const u=_.url.split("/")[1];this.compConfig=f.configs[f.configs[u]?u:"krch"],this.appName=this.compConfig.appTitle+" Fusion Calculator",this.fissionCalculator=this.compConfig.fissionCalculator,this.fusionCalculator=this.compConfig.fusionCalculator,this.compendium=new D.X(new t(this.compConfig)).asObservable(),this.fusionChart=new D.X(new a(this.compConfig)).asObservable()}updateFusionSettings(f){return{}}static#t=this.\u0275fac=function(_){return new(_||k)(v.LFG(b.I7),v.LFG(x.F0))};static#e=this.\u0275prov=v.Yz7({token:k,factory:k.\u0275fac})}return k})()},2814:(U,Z,l)=>{l.d(Z,{y:()=>v});var D=l(6814),t=l(6208),e=l(8325),a=l(3917),b=l(4769);let v=(()=>{class x{static forRoot(){return{ngModule:x}}static#t=this.\u0275fac=function(c){return new(c||x)};static#e=this.\u0275mod=b.oAB({type:x});static#s=this.\u0275inj=b.cJS({imports:[D.ez,t.m,e.SharedCompendiumModule,a.V]})}return x})()}}]);