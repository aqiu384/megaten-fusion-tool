(self.webpackChunkmegaten_fusion_tool=self.webpackChunkmegaten_fusion_tool||[]).push([[875],{4209:(e,t,s)=>{"use strict";s.d(t,{n:()=>p});var n=s(5614),i=s(1116),a=s(3787);function r(e,t){1&e&&(n.TgZ(0,"th"),n._uU(1,"Target"),n.qZA())}function o(e,t){1&e&&(n.TgZ(0,"th"),n._uU(1,"Rank"),n.qZA())}function l(e,t){1&e&&(n.TgZ(0,"th"),n._uU(1,"Inherit"),n.qZA())}function c(e,t){1&e&&(n.TgZ(0,"th"),n._uU(1,"Level"),n.qZA())}const u=function(e,t){return{extra:e,unique:t}};function m(e,t){if(1&e&&n._UZ(0,"tr",4),2&e){const e=t.$implicit,s=n.oxw();n.Q6J("hasTarget",s.hasTarget)("hasRank",s.hasRank)("hasInherit",s.hasInherit)("hasLearned",!1)("hasLvl",s.hasLvl)("data",e)("ngClass",n.WLB(7,u,e.rank>70&&e.rank<90,e.rank>90))}}function h(e,t){if(1&e&&(n.TgZ(0,"tr"),n.TgZ(1,"td"),n._uU(2),n.qZA(),n.qZA()),2&e){const e=n.oxw();n.xp6(1),n.uIk("colspan",e.skillHeaderLen),n.xp6(1),n.hij("No ",e.title," Found")}}let p=(()=>{class e{constructor(){this.title="Learned Skills",this.hasInherit=!1,this.hasTarget=!1,this.hasRank=!1,this.hasLvl=!0,this.skillHeaderLen=5}ngOnInit(){this.nextColIndices()}ngOnChanges(){this.nextSkills()}nextColIndices(){this.hasInherit&&(this.skillHeaderLen+=1),this.hasTarget&&(this.skillHeaderLen+=1),this.hasRank&&(this.skillHeaderLen+=1)}nextSkills(){this.skills=Object.keys(this.skillLevels).map(e=>this.compendium.getSkill(e));for(const e of this.skills)e.level=this.skillLevels[e.name];this.elemOrder&&this.skills.sort((e,t)=>20*(e.level-t.level)+this.elemOrder[e.element]-this.elemOrder[t.element])}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-demon-skills"]],inputs:{title:"title",hasInherit:"hasInherit",hasTarget:"hasTarget",hasRank:"hasRank",hasLvl:"hasLvl",compendium:"compendium",elemOrder:"elemOrder",skillLevels:"skillLevels"},features:[n.TTD],decls:22,vars:8,consts:[[1,"entry-table"],[1,"title"],[4,"ngIf"],["class","app-smt-skill-list-row",3,"hasTarget","hasRank","hasInherit","hasLearned","hasLvl","data","ngClass",4,"ngFor","ngForOf"],[1,"app-smt-skill-list-row",3,"hasTarget","hasRank","hasInherit","hasLearned","hasLvl","data","ngClass"]],template:function(e,t){1&e&&(n.TgZ(0,"table",0),n.TgZ(1,"thead"),n.TgZ(2,"tr"),n.TgZ(3,"th",1),n._uU(4),n.qZA(),n.qZA(),n.TgZ(5,"tr"),n.TgZ(6,"th"),n._uU(7,"Elem"),n.qZA(),n.TgZ(8,"th"),n._uU(9,"Name"),n.qZA(),n.TgZ(10,"th"),n._uU(11,"Cost"),n.qZA(),n.TgZ(12,"th"),n._uU(13,"Effect"),n.qZA(),n.YNc(14,r,2,0,"th",2),n.YNc(15,o,2,0,"th",2),n.YNc(16,l,2,0,"th",2),n.YNc(17,c,2,0,"th",2),n.qZA(),n.qZA(),n.TgZ(18,"tbody"),n.YNc(19,m,1,10,"tr",3),n.YNc(20,h,3,2,"tr",2),n._UZ(21,"tr"),n.qZA(),n.qZA()),2&e&&(n.xp6(3),n.uIk("colSpan",t.skillHeaderLen),n.xp6(1),n.Oqu(t.title),n.xp6(10),n.Q6J("ngIf",t.hasTarget),n.xp6(1),n.Q6J("ngIf",t.hasRank),n.xp6(1),n.Q6J("ngIf",t.hasInherit),n.xp6(1),n.Q6J("ngIf",t.hasLvl),n.xp6(2),n.Q6J("ngForOf",t.skills),n.xp6(1),n.Q6J("ngIf",!t.skills.length))},directives:[i.O5,i.sg,a.W,i.mk],encapsulation:2,changeDetection:0}),e})()},2573:(e,t,s)=>{"use strict";s.d(t,{O:()=>g});var n=s(5614),i=s(1116);function a(e,t){if(1&e&&(n.TgZ(0,"h2"),n._uU(1),n.qZA()),2&e){const e=n.oxw();n.xp6(1),n.Oqu(e.title)}}function r(e,t){if(1&e&&(n.TgZ(0,"th"),n._uU(1),n.qZA()),2&e){const e=n.oxw();n.xp6(1),n.Oqu(e.langEn?"Price":"\u4fa1\u683c")}}function o(e,t){if(1&e&&(n.TgZ(0,"th"),n._uU(1),n.qZA()),2&e){const e=t.$implicit;n.xp6(1),n.Oqu(e)}}function l(e,t){1&e&&(n.TgZ(0,"th"),n._uU(1,"Inherits"),n.qZA())}function c(e,t){if(1&e&&(n.TgZ(0,"th"),n._uU(1),n.qZA()),2&e){const e=t.$implicit;n.xp6(1),n.Oqu(e)}}function u(e,t){if(1&e&&(n.TgZ(0,"td"),n._uU(1),n.qZA()),2&e){const e=n.oxw();n.xp6(1),n.Oqu(e.price)}}function m(e,t){if(1&e&&(n.TgZ(0,"td"),n._uU(1),n.qZA()),2&e){const e=t.$implicit;n.xp6(1),n.Oqu(e)}}function h(e,t){if(1&e&&(n.TgZ(0,"td"),n.TgZ(1,"div"),n._uU(2),n.qZA(),n.qZA()),2&e){const e=n.oxw();n.xp6(1),n.Gre("element-icon i",e.inherits,""),n.xp6(1),n.Oqu(e.inherits)}}const p=["*"];let g=(()=>{class e{constructor(){this.title="Demon Entry",this.statHeaders=[],this.stats=[],this.fusionHeaders=[],this.price=0,this.langEn=!0}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-demon-stats"]],inputs:{title:"title",statHeaders:"statHeaders",stats:"stats",fusionHeaders:"fusionHeaders",inherits:"inherits",price:"price",langEn:"langEn"},ngContentSelectors:p,decls:19,vars:10,consts:[[4,"ngIf"],[1,"entry-table"],[1,"title"],[4,"ngFor","ngForOf"]],template:function(e,t){1&e&&(n.F$t(),n.ynx(0),n.YNc(1,a,2,1,"h2",0),n.TgZ(2,"table",1),n.TgZ(3,"thead"),n.TgZ(4,"tr"),n.TgZ(5,"th",2),n._uU(6),n.qZA(),n.qZA(),n.TgZ(7,"tr"),n.YNc(8,r,2,1,"th",0),n.YNc(9,o,2,1,"th",3),n.YNc(10,l,2,0,"th",0),n.YNc(11,c,2,1,"th",3),n.qZA(),n.qZA(),n.TgZ(12,"tbody"),n.TgZ(13,"tr"),n.YNc(14,u,2,1,"td",0),n.YNc(15,m,2,1,"td",3),n.YNc(16,h,3,4,"td",0),n.Hsn(17),n.qZA(),n.qZA(),n.qZA(),n.GkF(18),n.BQk()),2&e&&(n.xp6(1),n.Q6J("ngIf",t.title.includes("Lvl")),n.xp6(4),n.uIk("colSpan",t.stats.length+t.fusionHeaders.length+(t.inherits?1:0)+(t.price?1:0)),n.xp6(1),n.hij(" ",t.title.includes("Lvl")?t.langEn?"Stats":"\u30b9\u30c6\u30fc\u30bf\u30b9":t.title," "),n.xp6(2),n.Q6J("ngIf",t.price),n.xp6(1),n.Q6J("ngForOf",t.statHeaders),n.xp6(1),n.Q6J("ngIf",t.inherits),n.xp6(1),n.Q6J("ngForOf",t.fusionHeaders),n.xp6(3),n.Q6J("ngIf",t.price),n.xp6(1),n.Q6J("ngForOf",t.stats),n.xp6(1),n.Q6J("ngIf",t.inherits))},directives:[i.O5,i.sg],encapsulation:2,changeDetection:0}),e})()},7967:(e,t,s)=>{"use strict";s.d(t,{R:()=>h});var n=s(5614),i=s(9624),a=s(3522),r=s(1116);function o(e,t){if(1&e&&(n.TgZ(0,"th"),n._uU(1),n.qZA()),2&e){const e=t.$implicit,s=n.oxw();n.xp6(1),n.Oqu(e.slice(0,s.nameCut))}}function l(e,t){if(1&e&&(n.TgZ(0,"td",4),n._uU(1),n.qZA()),2&e){const e=t.$implicit,s=n.oxw(2);n.Q6J("ngClass",e.slice(0,4)),n.xp6(1),n.Oqu(e.slice(4,s.nameCut+4))}}function c(e,t){if(1&e&&(n.TgZ(0,"tr"),n.TgZ(1,"th"),n._uU(2),n.qZA(),n.YNc(3,l,2,2,"td",3),n.TgZ(4,"th"),n._uU(5),n.qZA(),n.qZA()),2&e){const e=t.$implicit;n.xp6(2),n.Oqu(e[0]),n.xp6(1),n.Q6J("ngForOf",e.slice(1,e.length-1)),n.xp6(2),n.Oqu(e[e.length-1])}}function u(e,t){if(1&e&&(n.TgZ(0,"th"),n._uU(1),n.qZA()),2&e){const e=t.$implicit,s=n.oxw();n.xp6(1),n.Oqu(e.slice(0,s.nameCut))}}function m(e,t){if(1&e&&(n.TgZ(0,"tr"),n.TgZ(1,"th",0),n._uU(2),n.qZA(),n.qZA()),2&e){const e=n.oxw();n.xp6(1),n.uIk("colspan",e.table[0].length),n.xp6(1),n.AsE("",e.appName," ",e.tripTitle,"")}}let h=(()=>{class e{constructor(e,t){this.title2=e,this.route=t,this.normTitle="Normal Fusions",this.tripTitle="",this.isPersona=!1,this.filterDarks=!0,this.langEn=!0,this.subscriptions=[],this.table=[],this.nameCut=4}ngOnInit(){this.subscriptions.push(this.route.parent.data.subscribe(e=>{this.appName=e.appName||"Shin Megami Tensei",this.nameCut=this.langEn?4:2,this.title2.setTitle(this.langEn?`Fusion Chart - ${this.appName} Fusion Calculator`:`\u5408\u4f53\u8868 ${this.appName} \u5408\u4f53\u30a2\u30d7\u30ea`)}))}ngOnChanges(){this.normChart&&this.fillFusionChart()}ngOnDestroy(){for(const e of this.subscriptions)e.unsubscribe()}fillFusionChart(){const t="noneNone",s=e.RESULT_COLORS.reduce((e,[t,s])=>s.reduce((e,s)=>(e[s]=t,e),e),{}),n=this.normChart.elementDemons;let i=[],a=this.normChart.races,r=[];this.filterDarks&&(i=this.normChart.races.filter(e=>this.normChart.getLightDark(e)>0),a=this.normChart.races.filter(e=>0===this.normChart.getLightDark(e)),r=this.normChart.races.filter(e=>-1===this.normChart.getLightDark(e)),0===r.length&&i.length>0&&(i=this.normChart.races.filter(e=>this.normChart.getLightDark(e)>-1),a=[],r=this.normChart.races.filter(e=>this.normChart.getLightDark(e)<-1)));const o=i.length-r.length,l=i.concat(a,n),c=r.length?r.concat(Array(l.length-r.length).fill("")):l,u=this.mitaTable?l:i.concat(a,Array(n.length).fill("")),m=this.mitaTable||r.length?Array(o).fill("").concat(r,a,n):l;this.table=[[""].concat(l,[""])];for(let e=0;e<m.length;e++){const i=Array(l.length+2).fill("empt-"),a=m[e],r=u[e],h=-1!==n.indexOf(a),p=-1!==n.indexOf(r);this.table.push(i),i[0]=a,i[i.length-1]=r;for(let o=e;o<l.length;o++){const e=l[o],a=-1!==n.indexOf(e);if(a&&p){const a=n.indexOf(r),l=n.indexOf(e),c=this.mitaTable[a][l-a-1];i[o+1]=c?(s[c]||"norm")+c:t}else if(a&&r){const n=this.normChart.getElemFusions(e)[r];i[o+1]=n?(s[n]||"rank")+(n>0?"+":"")+n.toString():t}else if(e&&r){const n=this.isPersona&&e===r?e:this.normChart.getRaceFusion(e,r);i[o+1]=n?(s[n]||(e===r?"elem":"norm"))+n:t}}if(this.tripChart)for(let n=0;n<=e-o;n++){const e=c[n];if(e&&h){const r=this.tripChart.getElemFusions(a)[e];i[n+1]=r?(s[r]||"rank")+(r>0?"+":"")+r.toString():t}else if(e&&a){const r=this.tripChart.getRaceFusion(e,a);i[n+1]=r?(s[r]||(e===a?"elem":"trip"))+r:t}}if(-1!==a.indexOf(" x ")){const[e,t]=a.split(" x "),s=e.slice(0,3)+"x"+t.slice(0,3);i[0]=s,i[i.length-1]=s}else if(-1!==a.indexOf(" ")){const e=a.split(" ")[0];i[0]=e,i[i.length-1]=e}}for(let e=0;e<this.table[0].length;e++){const t=this.table[0][e];if(-1!==t.indexOf(" x ")){const[s,n]=t.split(" x ");this.table[0][e]=s.slice(0,2)+n.slice(0,2)}}this.table.push([""].concat(c,[""]))}}return e.RESULT_COLORS=Object.entries({oran:["-2","Erthys","Gnome","Saki","Saki Mitama","Random","\u30a2\u30fc\u30b7\u30fc\u30ba","\u30ce\u30fc\u30e0","\u30b5\u30ad\u30df\u30bf\u30de"],redd:["-1","Flaemis","Salamander","Ara ","Ara Mitama","Fiend","\u30d5\u30ec\u30a4\u30df\u30fc\u30ba","\u30b5\u30e9\u30de\u30f3\u30c0\u30fc","\u30a2\u30e9\u30df\u30bf\u30de"],gree:["1","Aeros","Sylph","Kusi","Kusi Mitama","UMA","\u30a8\u30a2\u30ed\u30b9","\u30b7\u30eb\u30ad\u30fc","\u30af\u30b7\u30df\u30bf\u30de"],blue:["2","Aquans","Undine","Nigi","Nigi Mitama","Enigma","\u30a2\u30af\u30a2\u30f3\u30ba","\u30a6\u30f3\u30c7\u30a3\u30fc\u30cd","\u30cb\u30ae\u30df\u30bf\u30de"]}),e.\u0275fac=function(t){return new(t||e)(n.Y36(i.Dx),n.Y36(a.gz))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-fusion-chart"]],inputs:{normChart:"normChart",tripChart:"tripChart",mitaTable:"mitaTable",normTitle:"normTitle",tripTitle:"tripTitle",isPersona:"isPersona",filterDarks:"filterDarks",langEn:"langEn",counter:"counter"},features:[n.TTD],decls:12,vars:7,consts:[[1,"title"],[4,"ngFor","ngForOf"],[4,"ngIf"],[3,"ngClass",4,"ngFor","ngForOf"],[3,"ngClass"]],template:function(e,t){1&e&&(n.TgZ(0,"table"),n.TgZ(1,"tbody"),n.TgZ(2,"tr"),n.TgZ(3,"th",0),n._uU(4),n.qZA(),n.qZA(),n.TgZ(5,"tr"),n.YNc(6,o,2,1,"th",1),n.qZA(),n.YNc(7,c,6,3,"tr",1),n.TgZ(8,"tr"),n.YNc(9,u,2,1,"th",1),n.qZA(),n.YNc(10,m,3,3,"tr",2),n.qZA(),n._UZ(11,"tbody"),n.qZA()),2&e&&(n.xp6(3),n.uIk("colspan",t.table[0].length),n.xp6(1),n.AsE("",t.appName," ",t.normTitle,""),n.xp6(2),n.Q6J("ngForOf",t.table[0]),n.xp6(1),n.Q6J("ngForOf",t.table.slice(1,t.table.length-1)),n.xp6(2),n.Q6J("ngForOf",t.table[t.table.length-1]),n.xp6(1),n.Q6J("ngIf",t.tripTitle))},directives:[r.sg,r.O5,r.mk],styles:["table[_ngcontent-%COMP%]{width:auto;margin:0 auto;white-space:nowrap}td.elem[_ngcontent-%COMP%]{color:#0f0}td.trip[_ngcontent-%COMP%]{color:#d3d3d3}td.oran[_ngcontent-%COMP%]{color:orange}td.redd[_ngcontent-%COMP%]{color:red}td.gree[_ngcontent-%COMP%]{color:#0f0}td.blue[_ngcontent-%COMP%]{color:#0ff}td.empt[_ngcontent-%COMP%], td.none[_ngcontent-%COMP%]{color:transparent}td.empt[_ngcontent-%COMP%]{background-color:initial}"],changeDetection:0}),e})()},4354:(e,t,s)=>{"use strict";s.d(t,{O:()=>p});var n=s(1501),i=s(649),a=s(5614),r=s(1116),o=s(3522);const l=function(){return{exact:!0}};function c(e,t){if(1&e&&(a.TgZ(0,"th",4),a.TgZ(1,"a",5),a._uU(2),a.qZA(),a.qZA()),2&e){const e=t.$implicit,s=a.oxw();a.Udp("width",100/s.fusionOptions.length,"%"),a.Q6J("routerLink",e.link)("routerLinkActiveOptions",a.DdM(6,l)),a.xp6(1),a.Q6J("routerLink",e.link),a.xp6(1),a.Oqu(e.title)}}function u(e,t){if(1&e&&(a.TgZ(0,"tr"),a.TgZ(1,"th",6),a._uU(2),a.qZA(),a.qZA()),2&e){const e=a.oxw();a.xp6(1),a.uIk("colspan",e.fusionOptions.length),a.xp6(1),a.hij(" ",e.langEn?"DLC marked as excluded in fusion settings, results may be inaccurate!":"DLC\u306a\u3057"," ")}}function m(e,t){if(1&e&&(a.TgZ(0,"tr"),a.TgZ(1,"th",6),a.Hsn(2),a.qZA(),a.qZA()),2&e){const e=a.oxw();a.xp6(1),a.uIk("colspan",e.fusionOptions.length)}}const h=["*"];let p=(()=>{class e{constructor(){this.hasTripleFusion=!1,this.showFusionAlert=!1,this.excludedDlc=!1,this.langEn=!0,this.fusionOptions=e.NORMAL_FUSIONS_EN}ngOnInit(){this.fusionOptions=this.hasTripleFusion?e.TRIPLE_FUSIONS:this.langEn?e.NORMAL_FUSIONS_EN:e.NORMAL_FUSIONS_JA}ngOnChanges(){setTimeout(()=>this.stickyTable.nextEdges())}}return e.NORMAL_FUSIONS_EN=[{title:"Reverse Fusions",link:"fissions"},{title:"Forward Fusions",link:"fusions"}],e.NORMAL_FUSIONS_JA=[{title:"\u9006\u5f15\u304d\u5408\u4f53",link:"fissions"},{title:"2\u4f53\u5408\u4f53",link:"fusions"}],e.TRIPLE_FUSIONS=[{title:"Normal Reverse Fusions",link:"fissions"},{title:"Triple Reverse Fusions",link:"fissions/triple"},{title:"Triple Forward Fusions",link:"fusions/triple"},{title:"Normal Forward Fusions",link:"fusions"}],e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=a.Xpm({type:e,selectors:[["app-smt-fusions"]],viewQuery:function(e,t){if(1&e&&a.Gf(i.v,5),2&e){let e;a.iGM(e=a.CRH())&&(t.stickyTable=e.first)}},inputs:{hasTripleFusion:"hasTripleFusion",showFusionAlert:"showFusionAlert",excludedDlc:"excludedDlc",langEn:"langEn"},features:[a._Bn([n.L]),a.TTD],ngContentSelectors:h,decls:11,vars:3,consts:[["appPositionSticky","",1,"list-table"],["stickyTable",""],["class","nav","routerLinkActive","active",3,"routerLink","width","routerLinkActiveOptions",4,"ngFor","ngForOf"],[4,"ngIf"],["routerLinkActive","active",1,"nav",3,"routerLink","routerLinkActiveOptions"],[3,"routerLink"],[1,"title"]],template:function(e,t){1&e&&(a.F$t(),a.TgZ(0,"div"),a.TgZ(1,"table",0,1),a.TgZ(3,"thead"),a.TgZ(4,"tr"),a.YNc(5,c,3,7,"th",2),a.qZA(),a.YNc(6,u,3,2,"tr",3),a._UZ(7,"tr"),a.YNc(8,m,3,1,"tr",3),a._UZ(9,"tr"),a.qZA(),a.qZA(),a._UZ(10,"router-outlet"),a.qZA()),2&e&&(a.xp6(5),a.Q6J("ngForOf",t.fusionOptions),a.xp6(1),a.Q6J("ngIf",t.excludedDlc),a.xp6(2),a.Q6J("ngIf",t.showFusionAlert))},directives:[i.v,r.sg,r.O5,o.lC,o.Od,o.rH,o.yS],encapsulation:2,changeDetection:0}),e})()},1742:(e,t,s)=>{"use strict";s.d(t,{V:()=>y});var n=s(3522),i=s(5614),a=s(3378),r=s(7089),o=s(1116);let l=(()=>{class e{constructor(e){this.appCssClasses=e.compConfig.appCssClasses}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(a.Y))},e.\u0275cmp=i.Xpm({type:e,selectors:[["app-smt1-compendium"]],decls:1,vars:2,consts:[[3,"ngClass","hasSettings"]],template:function(e,t){1&e&&i._UZ(0,"app-demon-compendium",0),2&e&&i.Q6J("ngClass",t.appCssClasses)("hasSettings",!1)},directives:[r.e,o.mk],styles:[".kuzu div.element-icon{height:12px;background-size:12px;background-repeat:no-repeat;background-position:50%;color:transparent}.kuzu div.element-icon.phy{background-image:url(/assets/images/smtsj/phy.png)}.kuzu div.element-icon.gun{background-image:url(/assets/images/smtsj/gun.png)}.kuzu div.element-icon.fir{background-image:url(/assets/images/smtsj/fir.png)}.kuzu div.element-icon.ele{background-image:url(/assets/images/smtsj/ele.png)}.kuzu div.element-icon.for{background-image:url(/assets/images/smtsj/win.png)}.kuzu div.element-icon.dea{background-image:url(/assets/images/smtsj/cur.png)}.kuzu div.element-icon.min{background-image:url(/assets/images/smt4f/panic.png)}.kuzu div.element-icon.alm{background-image:url(/assets/images/smtsj/alm.png)}.kuzu div.element-icon.rec{background-image:url(/assets/images/smtsj/rec.png)}.kuzu div.element-icon.sup{background-image:url(/assets/images/smtsj/sup.png)}.kuzu div.element-icon.pas{background-image:url(/assets/images/smtsj/pas.png)}.kuzu div.element-icon.bos,.kuzu div.element-icon.inv{background-image:url(/assets/images/smtsj/spe.png)}.kuzu div.element-icon.phys{background-image:url(/assets/images/smtsj/phy.png)}.kuzu div.element-icon.fire{background-image:url(/assets/images/smtsj/fir.png)}.kuzu div.element-icon.ice{background-image:url(/assets/images/smtsj/ice.png)}.kuzu div.element-icon.elec{background-image:url(/assets/images/smtsj/ele.png)}.kuzu div.element-icon.force{background-image:url(/assets/images/smtsj/win.png)}.kuzu div.element-icon.curse{background-image:url(/assets/images/smt4f/curse.png)}.kuzu div.element-icon.strike{background-image:url(/assets/images/smtsj/phy.png)}.kuzu div.element-icon.almighty{background-image:url(/assets/images/smtsj/alm.png)}.kuzu div.element-icon.recovery{background-image:url(/assets/images/smtsj/rec.png)}.kuzu div.element-icon.support{background-image:url(/assets/images/smtsj/sup.png)}.kuzu div.element-icon.passive{background-image:url(/assets/images/smtsj/pas.png)}.kuzu div.element-icon.auto,.kuzu div.element-icon.none,.kuzu div.element-icon.racial{background-image:url(/assets/images/smtsj/spe.png)}.krch th.nav.active,.krch th.nav.active a,.krch th.title{color:#000;background-color:#856363}.krao th.nav.active,.krao th.nav.active a,.krao th.title{color:#fff;background-color:#8e283d}.mjn1 th.nav.active,.mjn1 th.nav.active a,.mjn1 th.title{color:#fff;background-color:#004381}.ds1 th.nav.active,.ds1 th.nav.active a,.ds1 th.title{color:#fff;background-color:#e83145}.ds2 th.nav.active,.ds2 th.nav.active a,.ds2 th.title{color:#fff;background-color:#0078e8}"],encapsulation:2,changeDetection:0}),e})();var c=s(5438),u=s(9624),m=s(4008);let h=(()=>{class e extends c.l{constructor(e,t,s){super(e,t,s),this.appName=`List of Demons - ${s.appName}`,this.compConfig=s.compConfig,this.defaultSortFun=(e,t)=>200*(this.compConfig.raceOrder[e.race]-this.compConfig.raceOrder[t.race])+t.lvl-e.lvl}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(u.Dx),i.Y36(i.sBO),i.Y36(a.Y))},e.\u0275cmp=i.Xpm({type:e,selectors:[["app-demon-list-container"]],features:[i.qOj],decls:2,vars:6,consts:[[3,"raceOrder","statHeaders","resistHeaders","rowData"]],template:function(e,t){1&e&&(i._UZ(0,"app-smt-demon-list",0),i.ALo(1,"async")),2&e&&i.Q6J("raceOrder",t.compConfig.raceOrder)("statHeaders",t.compConfig.baseStats)("resistHeaders",t.compConfig.resistElems)("rowData",i.lcZ(1,4,t.demons))},directives:[m.Q],pipes:[o.Ov],encapsulation:2,changeDetection:0}),e})();var p=s(9261),g=s(3787);let d=(()=>{class e extends p.e{constructor(e,t,s){super(e,t,s),this.appName=`List of Skills - ${s.appName}`,this.compConfig=s.compConfig,this.defaultSortFun=(e,t)=>1e4*(this.compConfig.elemOrder[e.element]-this.compConfig.elemOrder[t.element])+e.rank-t.rank}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(u.Dx),i.Y36(i.sBO),i.Y36(a.Y))},e.\u0275cmp=i.Xpm({type:e,selectors:[["app-skill-list-container"]],features:[i.qOj],decls:2,vars:6,consts:[[3,"elemOrder","hasRank","hasTarget","rowData"]],template:function(e,t){1&e&&(i._UZ(0,"app-smt-skill-list",0),i.ALo(1,"async")),2&e&&i.Q6J("elemOrder",t.compConfig.elemOrder)("hasRank",!1)("hasTarget",!0)("rowData",i.lcZ(1,4,t.skills))},directives:[g.J],pipes:[o.Ov],encapsulation:2,changeDetection:0}),e})();var f=s(7967);let k=(()=>{class e{constructor(e){this.fusionDataService=e,this.subscriptions=[]}ngOnInit(){const e=this.fusionDataService.compConfig;this.appName=e.appTitle,this.mitamaTable=e.mitamaTable,this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(e=>{this.normChart=e}))}ngOnDestroy(){for(const e of this.subscriptions)e.unsubscribe()}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(a.Y))},e.\u0275cmp=i.Xpm({type:e,selectors:[["app-fusion-chart-container"]],decls:1,vars:2,consts:[[3,"normChart","mitaTable"]],template:function(e,t){1&e&&i._UZ(0,"app-fusion-chart",0),2&e&&i.Q6J("normChart",t.normChart)("mitaTable",t.mitamaTable)},directives:[f.R],encapsulation:2,changeDetection:0}),e})();var v=s(2573),b=s(858),O=s(4209),Z=s(4354),T=s(4897),C=s(3966);const x=function(){return["Personality"]};function A(e,t){if(1&e&&(i.ynx(0),i.TgZ(1,"app-demon-stats",2),i.TgZ(2,"td"),i._uU(3),i.qZA(),i.qZA(),i._UZ(4,"app-demon-resists",3),i._UZ(5,"app-demon-skills",4),i._UZ(6,"app-smt-fusions"),i.BQk()),2&e){const e=i.oxw();i.xp6(1),i.Q6J("title","Lvl "+e.demon.lvl+" "+e.demon.race+" "+e.demon.name)("price",e.demon.price)("statHeaders",e.compConfig.baseStats)("fusionHeaders",i.DdM(13,x))("stats",e.demon.stats),i.xp6(2),i.Oqu(e.demon.person),i.xp6(1),i.Q6J("resistHeaders",e.compConfig.resistElems)("resists",e.demon.resists),i.xp6(1),i.Q6J("title","Innate Skills")("hasTarget",!0)("elemOrder",e.compConfig.elemOrder)("compendium",e.compendium)("skillLevels",e.demon.skills)}}function D(e,t){if(1&e&&i._UZ(0,"app-demon-missing",5),2&e){const e=i.oxw();i.Q6J("name",e.name)}}let q=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=i.Xpm({type:e,selectors:[["app-demon-entry"]],inputs:{name:"name",demon:"demon",compendium:"compendium",compConfig:"compConfig"},decls:2,vars:2,consts:[[4,"ngIf"],[3,"name",4,"ngIf"],[3,"title","price","statHeaders","fusionHeaders","stats"],[3,"resistHeaders","resists"],[3,"title","hasTarget","elemOrder","compendium","skillLevels"],[3,"name"]],template:function(e,t){1&e&&(i.YNc(0,A,7,14,"ng-container",0),i.YNc(1,D,1,1,"app-demon-missing",1)),2&e&&(i.Q6J("ngIf",t.demon),i.xp6(1),i.Q6J("ngIf",!t.demon))},directives:[o.O5,v.O,b.I,O.n,Z.O,T.t],encapsulation:2,changeDetection:0}),e})(),_=(()=>{class e{constructor(e,t,s,n){this.route=e,this.title=t,this.currentDemonService=s,this.fusionDataService=n,this.subscriptions=[],this.appName="Test App",this.appName=n.appName,this.compConfig=n.compConfig}ngOnInit(){this.subscribeAll()}ngOnDestroy(){for(const e of this.subscriptions)e.unsubscribe()}subscribeAll(){this.subscriptions.push(this.fusionDataService.compendium.subscribe(e=>{this.compendium=e,this.getDemonEntry()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(e=>{this.name=e,this.getDemonEntry()})),this.route.params.subscribe(e=>{this.currentDemonService.nextCurrentDemon(e.demonName)})}getDemonEntry(){this.compendium&&this.name&&(this.title.setTitle(`${this.name} - ${this.appName}`),this.demon=this.compendium.getDemon(this.name))}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(n.gz),i.Y36(u.Dx),i.Y36(C.s),i.Y36(a.Y))},e.\u0275cmp=i.Xpm({type:e,selectors:[["app-demon-entry-container"]],decls:1,vars:4,consts:[[3,"name","demon","compConfig","compendium"]],template:function(e,t){1&e&&i._UZ(0,"app-demon-entry",0),2&e&&i.Q6J("name",t.name)("demon",t.demon)("compConfig",t.compConfig)("compendium",t.compendium)},directives:[q],encapsulation:2,changeDetection:0}),e})();var L=s(5946),F=s(2060);const N=[{path:"",redirectTo:"demons",pathMatch:"full"},{path:"",component:l,data:{fusionTool:"chart"},children:[{path:"chart",component:k}]},{path:"",component:l,children:[{path:"demons/:demonName",component:_,children:[{path:"fissions",component:L.t},{path:"fusions",component:F.$},{path:"**",redirectTo:"fissions",pathMatch:"full"}]},{path:"demons",component:h},{path:"skills",component:d}]},{path:"**",redirectTo:"demons",pathMatch:"full"}];let y=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=i.oAB({type:e}),e.\u0275inj=i.cJS({imports:[[n.Bz.forChild(N)],n.Bz]}),e})()},3378:(e,t,s)=>{"use strict";s.d(t,{Y:()=>u});var n=s(8512);class i{constructor(e,t){this.compConfig=e,this.gameAbbr=t,this.pairRecipes={},this.entryRecipes={},this.dlcDemons={},this.initImportedData(),this.updateDerivedData()}estimateKuzuPrice(e){return Math.floor(Math.pow(e.slice(e.length-4).reduce((e,t)=>t+e,0),2)/20)}estimateDesuPrice(e){const t=e.slice(2).reduce((e,t)=>t+e,0);return Math.floor(((-.01171*t+5.0625)*t-129)*t)+1115}initImportedData(){const e={},t={},s={},n={},i={},a=this.gameAbbr.startsWith("ds");for(const r of this.compConfig.demonData[this.gameAbbr])for(const[t,s]of Object.entries(r))e[t]={name:t,race:s.race,lvl:s.lvl,currLvl:s.lvl,price:a?this.estimateDesuPrice(s.stats):100*(this.estimateKuzuPrice(s.stats)+s.lvl),inherits:0,stats:s.stats,resists:(s.nresists||s.resists).split("").map(e=>this.compConfig.resistCodes[e]),skills:s.nskills||s.skills,person:s.person||"",fusion:"normal",prereq:s.prereq||""};for(const r of this.compConfig.skillData[this.gameAbbr])for(const[e,s]of Object.entries(r))t[e]={name:e,rank:s.rank||s.cost/100||0,cost:s.cost||0,effect:s.effect||"",target:s.prereq||s.target||"Self",element:s.elem,learnedBy:[],level:0};for(const r of this.compConfig.races)i[r]={};for(const r of Object.values(e).sort((e,t)=>e.lvl-t.lvl)){i[r.race][r.lvl]=r.name;for(const[e,s]of Object.entries(r.skills))t[e].learnedBy.push({demon:r.name,level:s})}for(const[r,o]of Object.entries(this.compConfig.specialRecipes[this.gameAbbr])){const t=o,i=[],a=[],l=e[r];l.fusion=t.length>1?"special":"accident",n[r]=i,s[r]=a;for(const e of t)if(e.includes(" x ")){const[t,s]=e.split(" x ");a.push({name1:t,name2:s}),l.fusion="special"}else i.push(e)}this.demons=e,this.skills=t,this.pairRecipes=s,this.entryRecipes=n,this.invertedDemons=i}updateDerivedData(){const e=Object.assign({},this.demons),t=Object.keys(this.skills).map(e=>this.skills[e]),s={},n={};for(const i of this.compConfig.races)s[i]=[],n[i]=[];for(const[i,a]of Object.entries(this.demons))this.isElementDemon(i)||s[a.race].push(a.lvl),this.pairRecipes[i]||this.entryRecipes[i]||n[a.race].push(a.lvl);for(const i of this.compConfig.races)s[i].sort((e,t)=>e-t),n[i].sort((e,t)=>e-t);this._allDemons=Object.keys(e).map(t=>e[t]),this._allSkills=t,this.allIngredients=s,this.allResults=n}get allDemons(){return this._allDemons}get allSkills(){return this._allSkills}get specialDemons(){return[]}getDemon(e){return this.demons[e]}getSkill(e){return this.skills[e]}getSkills(e){const t=e.map(e=>this.skills[e]);return t.sort((e,t)=>1e4*(this.compConfig.elemOrder[e.element]-this.compConfig.elemOrder[t.element])+e.rank-t.rank),t}getIngredientDemonLvls(e){return this.allIngredients[e]||[]}getResultDemonLvls(e){return this.allResults[e]||[]}getSpecialNameEntries(e){return this.entryRecipes[e]||[]}getSpecialNamePairs(e){return this.pairRecipes[e]||[]}reverseLookupDemon(e,t){return this.invertedDemons[e][t]}reverseLookupSpecial(e){return[]}isElementDemon(e){return-1!==this.compConfig.elementTable.elems.indexOf(e)}}var a=s(6829);class r extends a.g{constructor(e){super(),this.initCharts(e)}initCharts(e){const t=e.normalTable.races,s=e.normalTable.table,n=e.elementTable.elems,i=e.elementTable.races,r=e.elementTable.table;this.races=t,this.elementDemons=n,this.lvlModifier=e.fusionLvlMod,this.fusionChart=a.g.loadFusionTableJson(t,s),this.fissionChart=a.g.loadFissionTableJson(t,[],s),this.elementChart={},this.elementChart=n.length?a.g.loadElementTableJson(i,n,r):t.reduce((e,t)=>(e[t]=[],e),{})}getLightDark(e){return 0}getRaceFusions(e){return Object.assign({},super.getRaceFusions(e))}}var o=s(115),l=s(5614),c=s(3522);let u=(()=>{class e{constructor(e,t){const s=t.url.split("/")[1],a=e.demonData[s]?s:"krch";this.appName=e.gameTitles[a]+" Fusion Calculator",this.fissionCalculator=e.fissionCalculator,this.fusionCalculator=e.fusionCalculator,this.compConfig=e,this.compendium=new n.X(new i(e,a)).asObservable(),this.fusionChart=new n.X(new r(e)).asObservable()}nextDlcDemons(e){return{}}}return e.\u0275fac=function(t){return new(t||e)(l.LFG(o.I7),l.LFG(c.F0))},e.\u0275prov=l.Yz7({token:e,factory:e.\u0275fac}),e})()},5875:(e,t,s)=>{"use strict";s.d(t,{y:()=>l});var n=s(1116),i=s(5425),a=s(6487),r=s(1742),o=s(5614);let l=(()=>{class e{static forRoot(){return{ngModule:e}}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=o.oAB({type:e}),e.\u0275inj=o.cJS({imports:[[n.ez,i.m,a.a,r.V]]}),e})()}}]);