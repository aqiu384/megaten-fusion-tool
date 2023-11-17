"use strict";(self.webpackChunkmegaten_fusion_tool=self.webpackChunkmegaten_fusion_tool||[]).push([[159],{3687:(S,k,r)=>{r.d(k,{d:()=>b});var c=r(4769),e=r(6593),D=r(6814);function f(u,_){if(1&u){const i=c.EpF();c.TgZ(0,"tr")(1,"td")(2,"label"),c._uU(3),c.TgZ(4,"input",3),c.NdJ("change",function(){const C=c.CHM(i).$implicit,O=c.oxw();return c.KtG(O.toggledName.emit(C.name))}),c.qZA()()()()}if(2&u){const i=_.$implicit;c.xp6(3),c.hij("",i.name.split(",").join(", ")," "),c.xp6(1),c.Q6J("checked",i.included)}}let b=(()=>{var u;class _{constructor(p){this.title=p,this.dlcTitle="Included DLC Demons",this.langEn=!0,this.toggledName=new c.vpe}set appTitle(p){this.title.setTitle((this.langEn?"Fusion Settings - ":"\u5408\u4f53\u8a2d\u5b9a ")+p)}}return(u=_).\u0275fac=function(p){return new(p||u)(c.Y36(e.Dx))},u.\u0275cmp=c.Xpm({type:u,selectors:[["app-demon-dlc-settings"]],inputs:{dlcDemons:"dlcDemons",dlcTitle:"dlcTitle",langEn:"langEn",appTitle:"appTitle"},outputs:{toggledName:"toggledName"},decls:10,vars:2,consts:[[1,"entry-table"],[1,"title"],[4,"ngFor","ngForOf"],["type","checkbox",3,"checked","change"]],template:function(p,d){1&p&&(c.ynx(0),c.TgZ(1,"h2"),c._uU(2),c.qZA(),c.TgZ(3,"table",0)(4,"thead")(5,"tr")(6,"th",1),c._uU(7,"DLC"),c.qZA()()(),c.TgZ(8,"tbody"),c.YNc(9,f,5,2,"tr",2),c.qZA()(),c.BQk()),2&p&&(c.xp6(2),c.Oqu(d.dlcTitle),c.xp6(7),c.Q6J("ngForOf",d.dlcDemons))},dependencies:[D.sg],encapsulation:2,changeDetection:0}),_})()},9052:(S,k,r)=>{r.d(k,{m:()=>f});var c=r(7548),e=r(4769),D=r(8615);let f=(()=>{var b;class u{constructor(i,p){this.changeDetectorRef=i,this.fusionTrioService=p,this.subscriptions=[]}ngOnInit(){this.subscriptions.push(this.fusionTrioService.squareChart.subscribe(i=>{this.normChart=i.normalChart,this.tripChart=i.tripleChart}))}ngOnDestroy(){for(const i of this.subscriptions)i.unsubscribe()}}return(b=u).\u0275fac=function(i){return new(i||b)(e.Y36(e.sBO),e.Y36(c.Ir))},b.\u0275cmp=e.Xpm({type:b,selectors:[["app-triple-fusion-chart"]],decls:1,vars:4,consts:[[3,"normChart","tripChart","normTitle","tripTitle"]],template:function(i,p){1&i&&e._UZ(0,"app-fusion-chart",0),2&i&&e.Q6J("normChart",p.normChart)("tripChart",p.tripChart)("normTitle","Normal Fusions")("tripTitle","Triple Fusions")},dependencies:[D.R],encapsulation:2,changeDetection:0}),u})()},3186:(S,k,r)=>{r.d(k,{f:()=>e});var c=r(4769);let e=(()=>{var D;class f{constructor(u,_){this.changeDetector2=u,this.fusionDataService2=_,this.subscriptions=[]}ngOnInit(){this.subscriptions.push(this.fusionDataService2.compendium.subscribe(u=>{this.changeDetector2.markForCheck(),this.compendium=u,this._dlcDemons=Object.assign({},this.compendium.dlcDemons),this.dlcDemons=Object.entries(this._dlcDemons).map(([_,i])=>({name:_,included:i}))}))}ngOnDestroy(){for(const u of this.subscriptions)u.unsubscribe()}toggleName(u){this._dlcDemons[u]=!this._dlcDemons[u],this.fusionDataService2.nextDlcDemons(this._dlcDemons)}}return(D=f).\u0275fac=function(u){c.$Z()},D.\u0275dir=c.lG2({type:D}),f})()},2812:(S,k,r)=>{r.d(k,{t:()=>e});var c=r(6262);class e extends c.g{constructor(f,b,u){super(),this.elementDemons=[],this.lvlModifier=.5,this.initCharts(f,u)}initCharts(f,b){const u=f.races,_=f.table,i=[];for(let p=0;p<u.length;p++)i.push(_[p].slice(b?0:p,b?p+1:u.length)),b||(i[p][0]="-");this.races=u,this.lvlModifier=b?4.25:.5,this.fissionChart=c.g.loadFissionTableJson(u,this.elementDemons,i),this.fusionChart=c.g.loadFusionTableJson(u,i),this.elementChart={}}}},3754:(S,k,r)=>{r.d(k,{V:()=>Ee});var c=r(4487),e=r(4769),D=r(2026),f=r(6814),b=r(5390);let u=(()=>{var n;class a{constructor(t){this.appCssClasses=t.compConfig.appCssClasses,this.otherLinks=[{title:"Shadow List",link:"shadows"}],this.otherLinks.push(t.compConfig.hasTripleFusion?{title:"QR Code Generator",link:"qrcodes"}:{title:"Recipe Generator",link:"recipes"})}}return(n=a).\u0275fac=function(t){return new(t||n)(e.Y36(D.Y))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-pq2-compendium"]],decls:1,vars:3,consts:[[3,"ngClass","mainList","otherLinks"]],template:function(t,o){1&t&&e._UZ(0,"app-demon-compendium",0),2&t&&e.Q6J("ngClass",o.appCssClasses)("mainList","persona")("otherLinks",o.otherLinks)},dependencies:[f.mk,b.e],styles:[".pq2 div.element-icon{height:25px;background-size:25px;background-repeat:no-repeat;background-position:center;color:transparent}.pq2 div.element-icon.i2079,.pq2 div.element-icon.phy{background-image:url(/assets/images/p5/phys.png)}.pq2 div.element-icon.fir{background-image:url(/assets/images/p5/fire.png)}.pq2 div.element-icon.ice{background-image:url(/assets/images/p5/ice.png)}.pq2 div.element-icon.ele{background-image:url(/assets/images/p5/elec.png)}.pq2 div.element-icon.win{background-image:url(/assets/images/p5/wind.png)}.pq2 div.element-icon.psy{background-image:url(/assets/images/p5/psy.png)}.pq2 div.element-icon.nuk{background-image:url(/assets/images/p5/nuke.png)}.pq2 div.element-icon.ble{background-image:url(/assets/images/p5/bless.png)}.pq2 div.element-icon.cur{background-image:url(/assets/images/p5/curse.png)}.pq2 div.element-icon.mag{background-image:url(/assets/images/p5/almighty.png)}.pq2 div.element-icon.ail{background-image:url(/assets/images/p5/ailment.png)}.pq2 div.element-icon.rec{background-image:url(/assets/images/p5/healing.png)}.pq2 div.element-icon.i4095,.pq2 div.element-icon.alm{background-image:url(/assets/images/p5/almighty.png)}.pq2 div.element-icon.def{background-image:url(/assets/images/p5/support.png)}.pq2 div.element-icon.i4088,.pq2 div.element-icon.sup{background-image:url(/assets/images/p5/support.png)}.pq2 div.element-icon.i2047,.pq2 div.element-icon.nav{background-image:url(/assets/images/p5/trait.png)}.pq2 div.element-icon.pas{background-image:url(/assets/images/p5/passive.png)}.pq2 th.title,.pq2 th.nav.active,.pq2 th.nav.active a{color:#fff;background-color:#ff4800}.pq div.element-icon{height:25px;background-size:25px;background-repeat:no-repeat;background-position:center;color:transparent}.pq div.element-icon.cut{background-image:url(/assets/images/p5/sword.png)}.pq div.element-icon.i3584,.pq div.element-icon.i3591,.pq div.element-icon.bas{background-image:url(/assets/images/p5/phys.png)}.pq div.element-icon.sta{background-image:url(/assets/images/p5/gun.png)}.pq div.element-icon.i376,.pq div.element-icon.i383,.pq div.element-icon.i3960,.pq div.element-icon.i3967,.pq div.element-icon.fir{background-image:url(/assets/images/p5/fire.png)}.pq div.element-icon.i248,.pq div.element-icon.i255,.pq div.element-icon.i3832,.pq div.element-icon.i3839,.pq div.element-icon.ice{background-image:url(/assets/images/p5/ice.png)}.pq div.element-icon.i472,.pq div.element-icon.i479,.pq div.element-icon.i4056,.pq div.element-icon.i4063,.pq div.element-icon.ele{background-image:url(/assets/images/p5/elec.png)}.pq div.element-icon.i440,.pq div.element-icon.i447,.pq div.element-icon.i4024,.pq div.element-icon.i4031,.pq div.element-icon.win{background-image:url(/assets/images/p5/wind.png)}.pq div.element-icon.i496,.pq div.element-icon.i503,.pq div.element-icon.i4080,.pq div.element-icon.i4087,.pq div.element-icon.lig{background-image:url(/assets/images/p5/bless.png)}.pq div.element-icon.i488,.pq div.element-icon.i495,.pq div.element-icon.i4072,.pq div.element-icon.i4079,.pq div.element-icon.dar{background-image:url(/assets/images/p5/curse.png)}.pq div.element-icon.ail{background-image:url(/assets/images/p5/ailment.png)}.pq div.element-icon.rec{background-image:url(/assets/images/p5/healing.png)}.pq div.element-icon.i504,.pq div.element-icon.i511,.pq div.element-icon.i4088,.pq div.element-icon.i4095,.pq div.element-icon.alm{background-image:url(/assets/images/p5/almighty.png)}.pq div.element-icon.sup{background-image:url(/assets/images/p5/support.png)}.pq div.element-icon.nav{background-image:url(/assets/images/p5/trait.png)}.pq div.element-icon.pas{background-image:url(/assets/images/p5/passive.png)}.pq th.title,.pq th.nav.active,.pq th.nav.active a{color:#000;background-color:#aa1ca9}.p5t div.element-icon{height:25px;background-size:25px;background-repeat:no-repeat;background-position:center;color:transparent}.p5t div.element-icon.i512,.p5t div.element-icon.phy{background-image:url(/assets/images/p5/phys.png)}.p5t div.element-icon.i256,.p5t div.element-icon.gun{background-image:url(/assets/images/p5/gun.png)}.p5t div.element-icon.i128,.p5t div.element-icon.fir{background-image:url(/assets/images/p5/fire.png)}.p5t div.element-icon.i64,.p5t div.element-icon.ice{background-image:url(/assets/images/p5/ice.png)}.p5t div.element-icon.i32,.p5t div.element-icon.ele{background-image:url(/assets/images/p5/elec.png)}.p5t div.element-icon.i16,.p5t div.element-icon.win{background-image:url(/assets/images/p5/wind.png)}.p5t div.element-icon.i8,.p5t div.element-icon.psy{background-image:url(/assets/images/p5/psy.png)}.p5t div.element-icon.i4,.p5t div.element-icon.nuk{background-image:url(/assets/images/p5/nuke.png)}.p5t div.element-icon.i2,.p5t div.element-icon.ble{background-image:url(/assets/images/p5/bless.png)}.p5t div.element-icon.i1,.p5t div.element-icon.cur{background-image:url(/assets/images/p5/curse.png)}.p5t div.element-icon.rec{background-image:url(/assets/images/p5/healing.png)}.p5t th.title,.p5t th.nav.active,.p5t th.nav.active a{color:#fff;background-color:#f41000}\n"],encapsulation:2,changeDetection:0}),a})();var _=r(1032),i=r(6593),p=r(4101);let d=(()=>{var n;class a extends _.l{constructor(t,o,m,h){super(t,m,h),this.showAllies=!o.snapshot.data.showShadows,this.showEnemies=!this.showAllies,this.compConfig=h.compConfig,this.defaultSortFun=(T,N)=>200*(this.compConfig.raceOrder[T.race]-this.compConfig.raceOrder[N.race])+N.lvl-T.lvl,this.appName=`List of Personas - ${h.appName}`,this.statHeaders=this.compConfig.baseStats,this.resistHeaders=this.compConfig.resistElems,this.inheritOrder=this.compConfig.elemOrder,this.showEnemies&&(this.appName=`List of Shadows - ${h.appName}`,this.statHeaders=this.compConfig.enemyStats,this.resistHeaders=this.compConfig.enemyResists,this.inheritOrder=null)}}return(n=a).\u0275fac=function(t){return new(t||n)(e.Y36(i.Dx),e.Y36(c.gz),e.Y36(e.sBO),e.Y36(D.Y))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-demon-list-container"]],features:[e.qOj],decls:2,vars:8,consts:[[3,"isEnemy","raceOrder","statHeaders","resistHeaders","inheritOrder","rowData"]],template:function(t,o){1&t&&(e._UZ(0,"app-smt-demon-list",0),e.ALo(1,"async")),2&t&&e.Q6J("isEnemy",o.showEnemies)("raceOrder",o.compConfig.raceOrder)("statHeaders",o.statHeaders)("resistHeaders",o.resistHeaders)("inheritOrder",o.inheritOrder)("rowData",e.lcZ(1,6,o.demons))},dependencies:[p.Q,f.Ov],encapsulation:2,changeDetection:0}),a})();var C=r(4330),O=r(3934);let v=(()=>{var n;class a extends C.e{constructor(t,o,m){super(t,o,m),this.appName=`List of Skills - ${m.appName}`,this.compConfig=m.compConfig,this.defaultSortFun=(h,T)=>1e4*(this.compConfig.elemOrder[h.element]-this.compConfig.elemOrder[T.element])+h.rank-T.rank}}return(n=a).\u0275fac=function(t){return new(t||n)(e.Y36(i.Dx),e.Y36(e.sBO),e.Y36(D.Y))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-skill-list-container"]],features:[e.qOj],decls:2,vars:8,consts:[[3,"elemOrder","hasRank","hasTarget","isPersona","transferTitle","rowData"]],template:function(t,o){1&t&&(e._UZ(0,"app-smt-skill-list",0),e.ALo(1,"async")),2&t&&e.Q6J("elemOrder",o.compConfig.elemOrder)("hasRank",!1)("hasTarget",!0)("isPersona",!0)("transferTitle","Skill Card")("rowData",e.lcZ(1,6,o.skills))},dependencies:[O.J,f.Ov],encapsulation:2,changeDetection:0}),a})();var l=r(7880),g=r(8520),y=r(755),A=r(9012),P=r(4069),U=r(8711),J=r(1009);let w=(()=>{var n;class a{}return(n=a).\u0275fac=function(t){return new(t||n)},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-enemy-entry"]],inputs:{name:"name",demon:"demon",compendium:"compendium",compConfig:"compConfig"},decls:19,vars:14,consts:[[3,"title","statHeaders","stats"],[1,"entry-table"],["colspan","2",1,"title"],[3,"resistHeaders","resists","ailmentHeaders","ailments"],[3,"hasTarget","hasLvl","elemOrder","compendium","skillLevels"]],template:function(t,o){1&t&&(e._UZ(0,"app-demon-stats",0),e.TgZ(1,"table",1)(2,"thead")(3,"tr")(4,"th",2),e._uU(5,"Appearances"),e.qZA()(),e.TgZ(6,"tr")(7,"th"),e._uU(8,"Areas"),e.qZA(),e.TgZ(9,"th"),e._uU(10,"Drops"),e.qZA()()(),e.TgZ(11,"tbody")(12,"tr")(13,"td"),e._uU(14),e.qZA(),e.TgZ(15,"td"),e._uU(16),e.qZA()()()(),e._UZ(17,"app-demon-resists",3)(18,"app-demon-skills",4)),2&t&&(e.Q6J("title","Lvl "+o.demon.lvl+" "+o.demon.race+" "+o.demon.name)("statHeaders",o.compConfig.enemyStats)("stats",o.demon.stats),e.xp6(14),e.Oqu(o.demon.area),e.xp6(2),e.Oqu(o.demon.drop),e.xp6(1),e.Q6J("resistHeaders",o.compConfig.enemyResists)("resists",o.demon.resists)("ailmentHeaders",o.compConfig.ailmentElems)("ailments",o.demon.ailments),e.xp6(1),e.Q6J("hasTarget",!0)("hasLvl",!1)("elemOrder",o.compConfig.elemOrder)("compendium",o.compendium)("skillLevels",o.demon.skills))},dependencies:[g.O,J.I,y.n],encapsulation:2,changeDetection:0}),a})();function Y(n,a){if(1&n&&(e.ynx(0),e._UZ(1,"app-demon-stats",2)(2,"app-demon-inherits",3)(3,"app-demon-skills",4)(4,"app-smt-fusions",5),e.BQk()),2&n){const s=e.oxw();e.xp6(1),e.Q6J("title","Lvl "+s.demon.lvl+" "+s.demon.race+" "+s.demon.name)("price",s.demon.price)("statHeaders",s.compConfig.baseStats)("stats",s.demon.stats)("inherits",s.demon.inherits),e.xp6(1),e.Q6J("inheritHeaders",s.compConfig.inheritElems)("inherits",s.compendium.getInheritElems(s.demon.inherits)),e.xp6(1),e.Q6J("hasTarget",!0)("elemOrder",s.compConfig.elemOrder)("compendium",s.compendium)("skillLevels",s.demon.skills),e.xp6(1),e.Q6J("hasTripleFusion",s.compConfig.hasTripleFusion)("excludedDlc","excluded"===s.demon.fusion)}}function I(n,a){if(1&n&&e._UZ(0,"app-demon-missing",6),2&n){const s=e.oxw();e.Q6J("name",s.name)}}function R(n,a){if(1&n&&e._UZ(0,"app-demon-entry",1),2&n){const s=e.oxw();e.Q6J("name",s.name)("demon",s.demon)("compConfig",s.compConfig)("compendium",s.compendium)}}function B(n,a){if(1&n&&e._UZ(0,"app-enemy-entry",1),2&n){const s=e.oxw();e.Q6J("name",s.name)("demon",s.demon)("compConfig",s.compConfig)("compendium",s.compendium)}}let G=(()=>{var n;class a{}return(n=a).\u0275fac=function(t){return new(t||n)},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-demon-entry"]],inputs:{name:"name",demon:"demon",compendium:"compendium",compConfig:"compConfig"},decls:2,vars:2,consts:[[4,"ngIf"],[3,"name",4,"ngIf"],[3,"title","price","statHeaders","stats","inherits"],[3,"inheritHeaders","inherits"],[3,"hasTarget","elemOrder","compendium","skillLevels"],[3,"hasTripleFusion","excludedDlc"],[3,"name"]],template:function(t,o){1&t&&(e.YNc(0,Y,5,13,"ng-container",0),e.YNc(1,I,1,1,"app-demon-missing",1)),2&t&&(e.Q6J("ngIf",o.demon),e.xp6(1),e.Q6J("ngIf",!o.demon))},dependencies:[f.O5,l.t,g.O,y.n,A.N,P.O],encapsulation:2,changeDetection:0}),a})(),L=(()=>{var n;class a{constructor(t,o,m,h){this.route=t,this.title=o,this.currentDemonService=m,this.fusionDataService=h,this.subscriptions=[],this.appName="Test App",this.appName=h.appName,this.compConfig=h.compConfig}ngOnInit(){this.subscribeAll()}ngOnDestroy(){for(const t of this.subscriptions)t.unsubscribe()}subscribeAll(){this.subscriptions.push(this.fusionDataService.compendium.subscribe(t=>{this.compendium=t,this.getDemonEntry()})),this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(t=>{this.name=t,this.getDemonEntry()})),this.route.params.subscribe(t=>{this.currentDemonService.nextCurrentDemon(t.demonName)})}getDemonEntry(){this.compendium&&this.name&&(this.title.setTitle(`${this.name} - ${this.appName}`),this.demon=this.compendium.getDemon(this.name))}}return(n=a).\u0275fac=function(t){return new(t||n)(e.Y36(c.gz),e.Y36(i.Dx),e.Y36(U.s),e.Y36(D.Y))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-demon-entry-container"]],decls:2,vars:2,consts:[[3,"name","demon","compConfig","compendium",4,"ngIf"],[3,"name","demon","compConfig","compendium"]],template:function(t,o){1&t&&(e.YNc(0,R,1,4,"app-demon-entry",0),e.YNc(1,B,1,4,"app-enemy-entry",0)),2&t&&(e.Q6J("ngIf",!o.demon||!o.demon.isEnemy),e.xp6(1),e.Q6J("ngIf",o.demon&&o.demon.isEnemy))},dependencies:[f.O5,G,w],encapsulation:2,changeDetection:0}),a})();const q=Array(24).fill(0);function E(n,a){return n.split("").map(s=>s.charCodeAt(0)).concat(Array(a-n.length).fill(0))}q[0]=4,q[2]=50,q[4]=50,q[6]=50,q[7]=50,q[8]=50,q[12]=50,q[16]=50,q[20]=50;const Q=[].concat(E("aqiu384.github.io",21),E("https://youtu.be/b1KfNEPKncQ",33)),F="kitaro",x="bancho",H=[].concat(E(F,17),E(x,17)),K=[].concat(E(F,29),E(x,29)),X=[].concat(E(F,17),E(x,17),E("renren",17),E("hamuko",17)),W=[].concat([34,50],Array(36).fill(31),[31,0,31,0,0,0,1,128]),V=[].concat([34,50],Array(54).fill(31),[31,0,1,0]);var Z=r(95);let te=(()=>{var n;class a{constructor(){this.byteArray=[],this.errorLvl="L",this.typeNum=10,this.qrFactory=qrcode(this.typeNum,this.errorLvl),this.qrImg=null}ngOnChanges(){this.createQrcode()}createQrcode(){this.qrFactory=qrcode(this.typeNum,this.errorLvl),this.qrFactory.addData(this.byteArray.map(t=>String.fromCharCode(t)).join("")),this.qrFactory.make(),this.qrImg=this.qrFactory.createImgTag(5)}}return(n=a).\u0275fac=function(t){return new(t||n)},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-qrcode"]],inputs:{byteArray:"byteArray",errorLvl:"errorLvl",typeNum:"typeNum"},features:[e.TTD],decls:1,vars:1,consts:[[3,"innerHtml"]],template:function(t,o){1&t&&e._UZ(0,"div",0),2&t&&e.Q6J("innerHtml",o.qrImg,e.oJD)},encapsulation:2,changeDetection:0}),a})();var se=r(2173);function oe(n,a){if(1&n&&(e.TgZ(0,"option",17),e._uU(1),e.qZA()),2&n){const s=a.index;e.Q6J("value",s+1),e.xp6(1),e.Oqu(s+1)}}function ie(n,a){if(1&n&&(e.TgZ(0,"option",17),e._uU(1),e.qZA()),2&n){const s=a.index;e.Q6J("value",s+1),e.xp6(1),e.Oqu(s+1)}}function ae(n,a){if(1&n&&(e.TgZ(0,"option",17),e._uU(1),e.qZA()),2&n){const s=a.index;e.Q6J("value",s+1),e.xp6(1),e.Oqu(s+1)}}function re(n,a){if(1&n&&(e.TgZ(0,"option",17),e._uU(1),e.qZA()),2&n){const s=a.$implicit;e.Q6J("value",s),e.xp6(1),e.Oqu(s)}}function le(n,a){if(1&n&&(e.TgZ(0,"option",17),e._uU(1),e.qZA()),2&n){const s=a.$implicit;e.Q6J("value",s.name),e.xp6(1),e.Oqu(s.name)}}function ce(n,a){if(1&n&&(e.TgZ(0,"option",17),e._uU(1),e.qZA()),2&n){const s=a.$implicit;e.Q6J("value",s),e.xp6(1),e.Oqu(s)}}function me(n,a){if(1&n&&(e.TgZ(0,"option",17),e._uU(1),e.qZA()),2&n){const s=a.$implicit;e.Q6J("value",s.name),e.xp6(1),e.Oqu(s.name)}}function pe(n,a){if(1&n&&(e.ynx(0),e.TgZ(1,"td"),e._uU(2),e.ALo(3,"skillCostToString"),e.qZA(),e.TgZ(4,"td"),e._uU(5),e.qZA(),e.TgZ(6,"td"),e._uU(7),e.qZA(),e.BQk()),2&n){const s=a.$implicit;e.xp6(1),e.Udp("color",s.cost?null:"transparent"),e.xp6(1),e.Oqu(e.lcZ(3,5,s.cost)),e.xp6(3),e.Oqu(s.effect),e.xp6(2),e.Oqu(s.target)}}function de(n,a){1&n&&(e.TgZ(0,"td"),e._uU(1,"-"),e.qZA(),e.TgZ(2,"td"),e._uU(3,"-"),e.qZA(),e.TgZ(4,"td"),e._uU(5,"-"),e.qZA())}const ue=function(n){return{unique:n}};function he(n,a){if(1&n){const s=e.EpF();e.ynx(0,18),e.TgZ(1,"tr",19)(2,"td")(3,"select",20),e.NdJ("change",function(){const m=e.CHM(s).$implicit,h=e.oxw();return e.KtG(m.controls.name.setValue(h.skills[m.controls.elem.value][0].name))}),e.TgZ(4,"option",21),e._uU(5,"-"),e.qZA(),e.YNc(6,ce,2,2,"option",9),e.qZA()(),e.TgZ(7,"td")(8,"select",22),e.YNc(9,me,2,2,"option",9),e.qZA()(),e.YNc(10,pe,8,7,"ng-container",23),e.YNc(11,de,6,0,"ng-template",null,24,e.W1O),e.qZA(),e.BQk()}if(2&n){const s=a.$implicit,t=a.index,o=e.MAs(12),m=e.oxw();e.Q6J("formGroupName",t),e.xp6(1),e.Q6J("ngClass",e.VKq(6,ue,(m.compendium.getSkill(s.controls.name.value)||m.blankSkill).rank>90)),e.xp6(5),e.Q6J("ngForOf",m.elems),e.xp6(3),e.Q6J("ngForOf",m.skills[s.controls.elem.value]),e.xp6(1),e.Q6J("ngIf",m.compendium.getSkill(s.controls.name.value))("ngIfElse",o)}}let ge=(()=>{var n;class a{constructor(t){this.fb=t,this.defaultRace="Fool",this.defaultDemon="Slime",this.demons={},this.skills={},this.dcodes={},this.scodes={},this.range99=Array(99),this.range299=Array(299),this.price=0,this.blankSkill={code:0,cost:0,level:0,rank:0,target:"Self",name:"-",element:"-",inherit:"-",effect:"-",learnedBy:[],transfer:[]},this.createForm()}ngOnChanges(){this.initDropdowns()}createForm(){const t=[];for(let o=0;o<6;o++)t.push(this.fb.group({elem:"-",name:"-"}));this.form=this.fb.group({language:"eng",lvl:1,hp:1,mp:1,race:this.defaultRace,demon:this.defaultDemon,skills:this.fb.array(t)}),this.form.valueChanges.subscribe(o=>{if(this.form.valid){const m=this.compendium.getDemon(o.demon),h=o.skills.map(M=>this.compendium.getSkill(M.name)||this.blankSkill),T={language:o.language,demonCode:m.code,lvl:parseInt(o.lvl,10),exp:-1,hp:parseInt(o.hp,10),mp:parseInt(o.mp,10),skillCodes:h.map(M=>M.code)},N=T.skillCodes.reduce((M,Ae)=>0!==Ae?M+1:M,0);this.price=10*Math.floor((800+120*T.lvl)*(1+.25*N)/10),this.passBytes=function z(n,a){return a&&a.includes("2")?function ne(n){const a=q.slice(),s=Array(25).fill(0),t=n.lvl,o=Math.floor((((-.0479755766*t+9.28700353)*t+71.9694228)*t-81.1026214)*t+.120783542),m=n.exp<0?o:n.exp;"jpn"!==n.language&&(a[6]=256-a[6]),s[0]=n.demonCode%256,s[1]=2*n.lvl+Math.floor(n.demonCode/256),s[2]=m%256,s[3]=Math.floor(m/256)%256,s[4]=Math.floor(m/65536);for(let h=0;h<6;h++)s[6+2*h]=n.skillCodes[h]%256,s[6+2*h+1]=Math.floor(n.skillCodes[h]/256);return s[22]=10*n.hp%256,s[23]=10*n.mp%16*16+Math.floor(n.hp/25.6),s[24]=Math.floor(n.mp/1.6),[].concat(a,Q,X,V,s,Array(21).fill(0))}(n):function ee(n){const a="jpn"===n.language?H:K,s=Array(30).fill(0),t=n.lvl,o=Math.floor((((-.07600161*t+14.0603287)*t-.02256972)*t+.59031556)*t-1.87981906),m=n.exp<0?o:n.exp;s[0]=n.demonCode,s[2]=n.lvl,s[6]=m%256,s[7]=Math.floor(m/256)%256,s[8]=Math.floor(m/65536);for(let h=0;h<6;h++)s[10+2*h]=n.skillCodes[h]%256,s[10+2*h+1]=Math.floor(n.skillCodes[h]/256);return s[26]=10*n.hp%256,s[27]=Math.floor(n.hp/25.6),s[28]=10*n.mp%256,s[29]=Math.floor(n.mp/25.6),[].concat(q,Q,a,W,s,Array(40).fill(0))}(n)}(T,this.compConfig.appTitle)}})}initDropdowns(){if(this.demons={},this.skills={"-":[this.blankSkill]},this.dcodes={},this.scodes={0:this.blankSkill},this.compConfig&&this.compendium){for(const t of this.compendium.allDemons.filter(o=>o.code))this.demons[t.race]||(this.demons[t.race]=[]),this.demons[t.race].push(t),this.dcodes[t.code]=t;for(const t of this.compendium.allSkills.filter(o=>o.code))this.skills[t.element]||(this.skills[t.element]=[]),this.skills[t.element].push(t),this.scodes[t.code]=t;for(const t of Object.values(this.demons))t.sort((o,m)=>m.lvl-o.lvl);for(const t of Object.values(this.skills))t.sort((o,m)=>o.rank-m.rank);this.races=this.compConfig.races.filter(t=>this.demons[t]),this.elems=this.compConfig.skillElems.filter(t=>this.skills[t]),this.setDefaultValues(this.defaultDemon)}}changeRace(t){const o=this.demons[t][0];this.form.controls.demon.setValue(o.name),this.setDefaultValues(o.name)}setDefaultValues(t){const o=Array(6).fill(this.blankSkill),m=this.compendium.getDemon(t);let h=0;for(const[T,N]of Object.entries(m.skills))0===N&&(o[h++]=this.compendium.getSkill(T));this.form.patchValue({lvl:Math.floor(m.lvl),hp:m.stats[0],mp:m.stats[1],race:m.race,demon:m.name,skills:o.map(T=>({elem:T.element,name:T.name}))})}}return(n=a).\u0275fac=function(t){return new(t||n)(e.Y36(Z.qu))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-password-generator"]],inputs:{defaultRace:"defaultRace",defaultDemon:"defaultDemon",compendium:"compendium",compConfig:"compConfig"},features:[e.TTD],decls:69,vars:9,consts:[[3,"formGroup"],[1,"entry-table"],["colspan","2",1,"title"],[3,"byteArray"],["colspan","7",1,"title"],["formControlName","language"],["value","jpn"],["value","eng"],["formControlName","lvl"],[3,"value",4,"ngFor","ngForOf"],["formControlName","hp"],["formControlName","mp"],["formControlName","race",3,"change"],["formControlName","demon",3,"change"],["formArrayName","skills",1,"list-table"],["colspan","5",1,"title"],[3,"formGroupName",4,"ngFor","ngForOf"],[3,"value"],[3,"formGroupName"],[3,"ngClass"],["formControlName","elem",3,"change"],["value","-"],["formControlName","name"],[4,"ngIf","ngIfElse"],["noEntry",""]],template:function(t,o){1&t&&(e.TgZ(0,"form",0)(1,"h2"),e._uU(2,"QR Code Generator"),e.qZA(),e.TgZ(3,"table",1)(4,"tr")(5,"th",2),e._uU(6,"QR Code"),e.qZA()(),e.TgZ(7,"tr")(8,"td"),e._UZ(9,"app-qrcode",3),e.qZA()()(),e.TgZ(10,"table",1)(11,"tr")(12,"th",4),e._uU(13,"Persona Entry"),e.qZA()(),e.TgZ(14,"tr")(15,"th"),e._uU(16,"Price"),e.qZA(),e.TgZ(17,"th"),e._uU(18,"Language"),e.qZA(),e.TgZ(19,"th"),e._uU(20,"Level"),e.qZA(),e.TgZ(21,"th"),e._uU(22,"HP"),e.qZA(),e.TgZ(23,"th"),e._uU(24,"MP"),e.qZA(),e.TgZ(25,"th"),e._uU(26,"Race"),e.qZA(),e.TgZ(27,"th"),e._uU(28,"Demon"),e.qZA()(),e.TgZ(29,"tr")(30,"td"),e._uU(31),e.qZA(),e.TgZ(32,"td")(33,"select",5)(34,"option",6),e._uU(35,"Japanese"),e.qZA(),e.TgZ(36,"option",7),e._uU(37,"English"),e.qZA()()(),e.TgZ(38,"td")(39,"select",8),e.YNc(40,oe,2,2,"option",9),e.qZA()(),e.TgZ(41,"td")(42,"select",10),e.YNc(43,ie,2,2,"option",9),e.qZA()(),e.TgZ(44,"td")(45,"select",11),e.YNc(46,ae,2,2,"option",9),e.qZA()(),e.TgZ(47,"td")(48,"select",12),e.NdJ("change",function(){return o.changeRace(o.form.controls.race.value)}),e.YNc(49,re,2,2,"option",9),e.qZA()(),e.TgZ(50,"td")(51,"select",13),e.NdJ("change",function(){return o.setDefaultValues(o.form.controls.demon.value)}),e.YNc(52,le,2,2,"option",9),e.qZA()()()(),e.TgZ(53,"table",14)(54,"tr")(55,"th",15),e._uU(56,"Learned Skills"),e.qZA()(),e.TgZ(57,"tr")(58,"th"),e._uU(59,"Element"),e.qZA(),e.TgZ(60,"th"),e._uU(61,"Name"),e.qZA(),e.TgZ(62,"th"),e._uU(63,"Cost"),e.qZA(),e.TgZ(64,"th"),e._uU(65,"Effect"),e.qZA(),e.TgZ(66,"th"),e._uU(67,"Target"),e.qZA()(),e.YNc(68,he,13,8,"ng-container",16),e.qZA()()),2&t&&(e.Q6J("formGroup",o.form),e.xp6(9),e.Q6J("byteArray",o.passBytes),e.xp6(22),e.Oqu(o.price),e.xp6(9),e.Q6J("ngForOf",o.range99),e.xp6(3),e.Q6J("ngForOf",o.range299),e.xp6(3),e.Q6J("ngForOf",o.range99),e.xp6(3),e.Q6J("ngForOf",o.races),e.xp6(3),e.Q6J("ngForOf",o.demons[o.form.controls.race.value]),e.xp6(16),e.Q6J("ngForOf",o.form.controls.skills.controls))},dependencies:[f.mk,f.sg,f.O5,Z._Y,Z.YN,Z.Kr,Z.EJ,Z.JJ,Z.JL,Z.sg,Z.u,Z.x0,Z.CE,te,se.tq],styles:["td[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{width:100%}input[_ngcontent-%COMP%]{width:95%;border-width:3px}input.ng-valid[_ngcontent-%COMP%]{border-color:#0f0}input.ng-invalid[_ngcontent-%COMP%]{border-color:red}"],changeDetection:0}),a})(),fe=(()=>{var n;class a{constructor(t,o){this.fusionDataService=t,this.title=o,this.subscriptions=[],this.compConfig=this.fusionDataService.compConfig}ngOnInit(){this.setTitle(),this.subscribeAll()}ngOnDestroy(){this.unsubscribeAll()}setTitle(){this.title.setTitle(`QR Code Generator - ${this.fusionDataService.appName}`)}subscribeAll(){this.subscriptions.push(this.fusionDataService.compendium.subscribe(t=>{this.compendium=t}))}unsubscribeAll(){for(const t of this.subscriptions)t.unsubscribe()}}return(n=a).\u0275fac=function(t){return new(t||n)(e.Y36(D.Y),e.Y36(i.Dx))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-password-generator-container"]],decls:1,vars:2,consts:[[3,"compendium","compConfig"]],template:function(t,o){1&t&&e._UZ(0,"app-password-generator",0),2&t&&e.Q6J("compendium",o.compendium)("compConfig",o.compConfig)},dependencies:[ge],encapsulation:2,changeDetection:0}),a})();var Ce=r(3186),ve=r(3687);let _e=(()=>{var n;class a extends Ce.f{constructor(t,o){super(t,o),this.changeDetector=t,this.fusionDataService=o,this.appTitle=o.appName}}return(n=a).\u0275fac=function(t){return new(t||n)(e.Y36(e.sBO),e.Y36(D.Y))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-demon-dlc-settings-container"]],features:[e.qOj],decls:1,vars:3,consts:[[3,"dlcDemons","appTitle","dlcTitle","toggledName"]],template:function(t,o){1&t&&(e.TgZ(0,"app-demon-dlc-settings",0),e.NdJ("toggledName",function(h){return o.toggleName(h)}),e.qZA()),2&t&&e.Q6J("dlcDemons",o.dlcDemons)("appTitle",o.appTitle)("dlcTitle","Included DLC Personas")},dependencies:[ve.d],encapsulation:2,changeDetection:0}),a})();var De=r(4436);let be=(()=>{var n;class a{constructor(t,o){this.fusionDataService=t,this.title=o,this.subscriptions=[];const m=this.fusionDataService.compConfig;this.maxSkills=m.hasTripleFusion?6:2,this.recipeConfig={fissionCalculator:this.fusionDataService.fissionCalculator,fusionCalculator:this.fusionDataService.fusionCalculator,races:m.races,skillElems:m.skillElems,inheritElems:m.inheritElems,restrictInherits:!0,triExclusiveRaces:["Fool","Tower","Moon","Sun","Judgement"],triFissionCalculator:this.fusionDataService.triFissionCalculator,triFusionCalculator:this.fusionDataService.triFusionCalculator,defaultDemon:"Pixie"}}ngOnInit(){this.setTitle(),this.subscribeAll()}ngOnDestroy(){this.unsubscribeAll()}setTitle(){this.title.setTitle(`Recipe Generator - ${this.fusionDataService.appName}`)}subscribeAll(){this.subscriptions.push(this.fusionDataService.compendium.subscribe(t=>{this.compendium=t})),this.subscriptions.push(this.fusionDataService.squareChart.subscribe(t=>{this.squareChart=t}))}unsubscribeAll(){for(const t of this.subscriptions)t.unsubscribe()}}return(n=a).\u0275fac=function(t){return new(t||n)(e.Y36(D.Y),e.Y36(i.Dx))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-recipe-generator-container"]],decls:1,vars:4,consts:[[3,"maxSkills","compendium","squareChart","recipeConfig"]],template:function(t,o){1&t&&e._UZ(0,"app-recipe-generator",0),2&t&&e.Q6J("maxSkills",o.maxSkills)("compendium",o.compendium)("squareChart",o.squareChart)("recipeConfig",o.recipeConfig)},dependencies:[De.X],encapsulation:2,changeDetection:0}),a})();var ye=r(5657),Te=r(4689),ke=r(6857),Oe=r(4170);const Ze=[{path:"",redirectTo:"personas",pathMatch:"full"},{path:"",component:u,data:{fusionTool:"chart"},children:[{path:"chart",component:r(9052).m}]},{path:"",component:u,children:[{path:"personas/:demonName",component:L,children:[{path:"fissions/triple",component:ke.p},{path:"fusions/triple",component:Oe.n},{path:"fissions",component:ye.t},{path:"fusions",component:Te.$},{path:"**",redirectTo:"fissions",pathMatch:"full"}]},{path:"shadows/:demonName",component:L},{path:"personas",component:d},{path:"shadows",component:d,data:{showShadows:!0}},{path:"skills",component:v},{path:"qrcodes",component:fe},{path:"recipes",component:be},{path:"settings",component:_e}]},{path:"**",redirectTo:"personas",pathMatch:"full"}];let Ee=(()=>{var n;class a{}return(n=a).\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[c.Bz.forChild(Ze),c.Bz]}),a})()},2026:(S,k,r)=>{r.d(k,{Y:()=>u});var c=r(5619);class e{constructor(i){this.compConfig=i,this.specialRecipes={},this.initImportedData(),this.updateDerivedData()}initImportedData(){const i={},p={},d={},C={},O={};if(this._dlcDemons={},this.compConfig.dlcData){Object.assign(this.compConfig.demonData,this.compConfig.dlcData);for(const v of Object.keys(this.compConfig.dlcData))this._dlcDemons[v]=!1}for(const[v,l]of Object.entries(this.compConfig.demonData)){const g=Object.values(l.skills).reduce((A,P)=>0===P?A+1:A,0),y=10*Math.floor((800+120*l.lvl)*(1+.25*g)/10);i[v]={name:v,race:l.race,lvl:l.lvl,currLvl:l.lvl,price:y,inherits:this.compConfig.inheritTypes[l.inherit],stats:l.stats,skills:l.skills,resists:[],ailments:[],code:l.code||0,fusion:l.fusion||"normal",prereq:l.prereq||""}}for(const[v,l]of Object.entries(this.compConfig.enemyData))p[v]={name:v,race:l.race,lvl:l.lvl,currLvl:l.lvl,price:0,inherits:0,stats:l.stats,resists:l.resists.split("").map(g=>this.compConfig.resistCodes[g]),ailments:l.ailments.split("").map(g=>this.compConfig.resistCodes[g]),skills:l.skills.reduce((g,y)=>(g[y]=0,g),{}),area:l.area,drop:l.drops.join(", "),code:0,fusion:"normal",isEnemy:!0};for(const[v,l]of Object.entries(this.compConfig.specialRecipes))C[v]=l,i[v].fusion="special";for(const[v,l]of Object.entries(this.compConfig.skillData))d[v]={name:v,element:l.elem,cost:l.cost||0,rank:l.unique?91:l.cost/100||1,effect:l.effect,target:l.target||"Self",learnedBy:[],transfer:[],code:l.code||0,level:0},l.card&&(d[v].transfer=l.card.split(", ").map(g=>({demon:g,level:0})));for(const v of this.compConfig.races)O[v]={};for(const v of Object.values(i).sort((l,g)=>l.lvl-g.lvl)){"party"!==v.fusion&&(O[v.race][v.lvl]=v.name);for(const[l,g]of Object.entries(v.skills))d[l].learnedBy.push({demon:v.name,level:g})}this.demons=i,this.enemies=p,this.skills=d,this.specialRecipes=C,this.invertedDemons=O}updateDerivedData(){const i=Object.assign({},this.demons),p=[],d={},C={};for(const l of Object.values(this.skills))l.learnedBy.length<1?l.rank=99:p.push(l);for(const l of this.compConfig.races)d[l]=[],C[l]=[];for(const[l,g]of Object.entries(this.demons))"party"!==g.fusion&&(d[g.race].push(g.lvl),this.specialRecipes.hasOwnProperty(l)||C[g.race].push(g.lvl));for(const l of this.compConfig.races)d[l].sort((g,y)=>g-y),C[l].sort((g,y)=>g-y);for(const[l,g]of Object.entries(this._dlcDemons))for(const y of l.split(",")){if(!g){const{race:A,lvl:P}=this.demons[y];delete i[y],d[A]=d[A].filter(U=>U!==P),C[A]=C[A].filter(U=>U!==P)}this.demons[y].fusion=g?"normal":"excluded"}const O=Object.keys(i).map(l=>i[l]),v=Object.keys(this.enemies).map(l=>this.enemies[l]);this._allDemons=v.concat(O),this._allSkills=p,this.allIngredients=d,this.allResults=C}get dlcDemons(){return this._dlcDemons}set dlcDemons(i){this._dlcDemons=i,this.updateDerivedData()}get allDemons(){return this._allDemons}get allSkills(){return this._allSkills}get specialDemons(){return Object.keys(this.specialRecipes).map(i=>this.demons[i])}getDemon(i){return this.demons[i]||this.enemies[i]}getSkill(i){return this.skills[i]}getSkills(i){const p=this.compConfig.elemOrder,d=i.map(C=>this.skills[C]);return d.sort((C,O)=>1e4*(p[C.element]-p[O.element])+C.rank-O.rank),d}getIngredientDemonLvls(i){return this.allIngredients[i]||[]}getResultDemonLvls(i){return this.allResults[i]||[]}getSpecialNameEntries(i){return this.specialRecipes[i]||[]}getSpecialNamePairs(i){return[]}getInheritElems(i){return i.toString(2).padStart(this.compConfig.inheritElems.length,"0").split("").map(p=>100*parseInt(p))}reverseLookupDemon(i,p){return this.invertedDemons[i][p]}reverseLookupSpecial(i){return[]}isElementDemon(i){return!1}}var D=r(2812),f=r(7548),b=r(4769);let u=(()=>{var _;class i{constructor(d){this.fissionCalculator=f.Bz,this.fusionCalculator=f.wC,this.triFissionCalculator=f.nL,this.triFusionCalculator=f.RD,this.compConfig=d,this.appName=d.appTitle+" Fusion Calculator",this._compendium=new e(this.compConfig),this._compendium$=new c.X(this._compendium),this.compendium=this._compendium$.asObservable(),this._fusionChart=new D.t(d.normalTable,d.races),this._fusionChart$=new c.X(this._fusionChart),this.fusionChart=this._fusionChart$.asObservable(),this._tripleChart=new D.t(d.normalTable,d.races,!0),this._squareChart$=new c.X({normalChart:this._fusionChart,tripleChart:this._tripleChart,raceOrder:d.raceOrder}),this.squareChart=this._squareChart$.asObservable();const C=JSON.parse(localStorage.getItem(d.settingsKey));C&&C.version&&C.version>=d.settingsVersion&&this.nextDlcDemons(C.dlcDemons),window.addEventListener("storage",this.onStorageUpdated.bind(this))}nextDlcDemons(d){localStorage.setItem(this.compConfig.settingsKey,JSON.stringify({version:this.compConfig.settingsVersion,dlcDemons:d})),this._compendium.dlcDemons=d,this._compendium$.next(this._compendium)}onStorageUpdated(d){d.key===this.compConfig.settingsKey&&(this._compendium.dlcDemons=JSON.parse(d.newValue).dlcDemons,this._compendium$.next(this._compendium))}}return(_=i).\u0275fac=function(d){return new(d||_)(b.LFG(f.I7))},_.\u0275prov=b.Yz7({token:_,factory:_.\u0275fac}),i})()},159:(S,k,r)=>{r.d(k,{G:()=>_});var c=r(95),e=r(6814),D=r(6208),f=r(8325),b=r(3754),u=r(4769);let _=(()=>{var i;class p{static forRoot(){return{ngModule:p}}}return(i=p).\u0275fac=function(C){return new(C||i)},i.\u0275mod=u.oAB({type:i}),i.\u0275inj=u.cJS({imports:[e.ez,D.m,c.UX,f.a,b.V]}),p})()}}]);