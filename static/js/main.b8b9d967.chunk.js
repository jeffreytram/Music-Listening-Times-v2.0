(this["webpackJsonpmlt-2.0"]=this["webpackJsonpmlt-2.0"]||[]).push([[0],{83:function(t,e,a){},90:function(t,e,a){},91:function(t,e,a){"use strict";a.r(e);var n=a(0),i=a(3),r=a.n(i),s=a(34),c=a.n(s),o=(a(83),a(37)),l=a(10),d=a(25),u=a(6),h=a(7),m=a(8),j=a(9),f=a(2),b=a(4),y=a(5),g=[];function p(t,e,a){for(var n=["song","artist","album"],i=["Song","Artist","Album"],r=function(r){if(t===n[r])return{v:a.filter((function(t){return t[i[r]]===e}))}},s=0;s<n.length;s++){var c=r(s);if("object"===typeof c)return c.v}return[]}var v=function(t,e,a){for(var n=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],i=new Map,r=0;r<t.length;r++){var s=t[r];if(s.RawDateTime){s.ConvertedDateTime=new Date(s.RawDateTime),s.ConvertedDateTime.setHours(s.ConvertedDateTime.getHours()-5),s.Date=new Date(s.ConvertedDateTime.toDateString()),s.Time=(new Date).setHours(s.ConvertedDateTime.getHours(),s.ConvertedDateTime.getMinutes()),s.Day=n[s.ConvertedDateTime.getDay()];var c=s.Date.getFullYear();i.has(c)||i.set(c,{yearArr:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]});var o=i.get(c),l=o[s.Date.getMonth()+1];s.monthID=l.length,s.yearID=o.yearArr.length,s.ID=r,l.push(s),o.yearArr.push(s)}else t.splice(r,1),r--}var d=new Date("".concat(t[0].Date.getMonth()+2," 1 ").concat(t[0].Date.getFullYear())),u=new Date(t[t.length-1].Date);d.setHours(0,0,0,d.getMilliseconds()-1),u.setDate(1),e(i,t,[u,d]),a(d.getMonth()+1,d.getFullYear())},x=function(t,e){for(var a=t[0].Date.getFullYear(),n=t[t.length-1].Date.getFullYear(),i=a,r=[];i>=n;)r.push(i),i-=1;e(r)},O=function(){var t=document.getElementById("loading"),e=document.getElementById("content-container");t.style.display="none",e.style.display="block"},D=function(t,e,a){g=f.c("/Music-Listening-Times-v2.0/lastfm-data-utf.csv").then((function(t){return t})),function(t,e){g.then((function(a){v(a,t,e)}))}(t,e),function(t){g.then((function(e){x(e,t)}))}(a),O()},S=function(t,e){return new Date(e,t,1)},w=function(t,e){return new Date(e,t-2,1)},k=950,C=540,F=90,N=40,T=10,P=60,M={},L={},A={},I={},B={},Y={},R={},G={},V={},E=function(t){Object(m.a)(a,t);var e=Object(j.a)(a);function a(t){var n;return Object(u.a)(this,a),(n=e.call(this,t)).initializeGraph=function(){M=f.h("#main-graph").attr("width",k).attr("height",C).attr("viewBox",[0,0,k,C]).attr("preserveAspectRatio","xMidYMid meet").classed("svg-content",!0),L=f.h("#canvas").attr("width",k).attr("height",45),A=M.append("g").attr("class","x axis").attr("transform","translate(0, ".concat(C-P,")")),I=M.append("g").attr("class","y axis").attr("transform","translate(".concat(F,", 0)"));var t=new Date;t.setHours(0,0,0,0);var e=new Date;e.setHours(23,59,59,59),B=f.g().domain([t,e]).range([F,k-N]),Y=f.g().range([T,C-P]);var a=M.append("path").style("stroke","var(--secondary-color").style("stroke-width","3px").style("stroke-dasharray","4");M.on("mousemove",(function(t){var e=f.f(t);a.attr("d",(function(){var t="M"+e[0]+",0 ";return t+="L"+e[0]+",".concat(C-P)}))})).on("mouseover",(function(){a.style("opacity",.4)})).on("mouseout",(function(){a.style("opacity",0)})),M.append("text").attr("class","x label").attr("text-anchor","middle").attr("transform","translate(".concat((F+k-N)/2,", ").concat(C-P/4,")")).text("Time of Day (hrs:mins)"),M.append("text").attr("class","x label").attr("text-anchor","middle").attr("transform","translate(".concat(F/4,", ").concat((T+C-P)/2,") rotate(-90)")).text("Date"),R=M.append("g").attr("clip-path","url(#clip)"),G=R.append("g"),M.append("defs").append("clipPath").attr("id","clip").append("rect").attr("width",k-F-N).attr("height",C-T-P+14).attr("x",F).attr("y",T-7),V=f.k().scaleExtent([1,16]).extent([[F,T],[k-N,C-P]]).translateExtent([[F,T],[k-N,C-P]]),M.call(V).call(V.transform,f.l)},n.zoomed=function(t){var e=t.transform,a=e.rescaleX(B).interpolate(f.e),n=e.rescaleY(Y).interpolate(f.e);G.attr("transform",e);var i=f.a(a).ticks(f.j.every(1)).tickFormat(f.i("%H:%M")),r=f.b(n);A.call(i),I.call(r)},n.drawGraph=function(){var t=n.props,e=t.data,a=t.setClickedPoint,i=t.setFilteredDataset,r=t.sampleDate,s=t.timePeriod,c=t.settings,o=function(t,e){if("monthly"===e){var a=t.getFullYear(),n=t.getMonth(),i=new Date(a,n,1);return[new Date(a,n+1,0),i]}if("yearly"===e){var r=t.getFullYear(),s=new Date("1 1 ".concat(r)),c=new Date("1 1 ".concat(r+1));return c.setDate(c.getDate()-1),[c,s]}}(r,s);Y.domain(o);var l=f.a(B).ticks(f.j.every(1)).tickFormat(f.i("%H:%M")),d=f.b(Y);A.call(l),I.call(d);var u=e||[];M.select(".no-data-message").remove(),0===u.length&&M.append("text").attr("class","no-data-message").attr("text-anchor","middle").attr("transform","translate(".concat((F+k-N)/2,", ").concat((C-P-T)/2,")")).text("No data for ".concat(r.toLocaleString("default",{month:"long",year:"numeric"})));var h=G.selectAll(".point").data(u,(function(t){return t.ConvertedDateTime})),m=h.enter().append("g").attr("class","point");m.merge(h).attr("transform",(function(t){return"translate("+[B(t.Time),Y(t.Date)]+")"}));var j=c[0][0],b=c[0][1];m.append("circle").attr("r",b).style("opacity",j).on("click",(function(t,e){a(e.ID),i([e],"select")})),h.exit().remove(),n.drawCanvasBars(u),V.on("zoom",(function(t){return n.zoomed(t)}))},n.updateGraph=function(){var t=n.props,e=t.filteredData,a=t.filterView,i=t.settings,r=["none","day","search","select","hidden"],s=i[r.indexOf(a)][0],c=i[r.indexOf(a)][1],o=i[r.indexOf("hidden")][0],l=i[r.indexOf("hidden")][1],d=G.selectAll(".point").data(e,(function(t){return t.ConvertedDateTime}));d.select("circle").attr("r",c).style("opacity",s),d.exit().select("circle").attr("r",l).style("opacity",o),n.drawCanvasBars(e),V.on("zoom",(function(t){return n.zoomed(t)}))},n.drawCanvasBars=function(t){var e=L.node().width,a=L.node().height,n=L.node().getContext("2d");n.clearRect(0,0,e,a);for(var i=getComputedStyle(document.body).getPropertyValue("--default-rgb"),r=0;r<t.length;r++){var s=t[r];n.fillStyle="rgba(".concat(i,", .01)"),n.fillRect(B(s.Time),0,3,a)}},n.state={},n}return Object(h.a)(a,[{key:"componentDidMount",value:function(){this.initializeGraph()}},{key:"componentDidUpdate",value:function(){this.props.newLoad?this.drawGraph():this.updateGraph()}},{key:"render",value:function(){return Object(n.jsxs)("div",{children:[Object(n.jsx)("canvas",{id:"canvas"}),Object(n.jsx)("svg",{id:"main-graph"})]})}}]),a}(r.a.Component),H=function(t){Object(m.a)(a,t);var e=Object(j.a)(a);function a(t){var n;return Object(u.a)(this,a),(n=e.call(this,t)).handleChange=function(t){n.setState((function(){return{value:t.target.value}}))},n.handleSubmit=function(t){t.preventDefault();var e=n.props,a=e.setting,i=e.setFilteredDataset,r=e.data;i(p(a,n.state.value,r),"search")},n.state={value:""},n}return Object(h.a)(a,[{key:"render",value:function(){return Object(n.jsxs)("form",{onSubmit:this.handleSubmit,children:[Object(n.jsx)("input",{type:"text",id:"filter-input",list:this.props.datalist,placeholder:"Search for...",onChange:this.handleChange,value:this.state.value}),Object(n.jsx)("input",{type:"submit",className:"button",id:"submit-button",value:"Search"})]})}}]),a}(r.a.Component),z=function(t){Object(m.a)(a,t);var e=Object(j.a)(a);function a(t){var n;return Object(u.a)(this,a),(n=e.call(this,t)).handleInfoClick=function(t,e){var a=n.props,i=a.setFilteredDataset,r=a.setSearchType,s=a.data;r(t),i(p(t,e,s),"search")},n.handlePointChange=function(t){var e=n.props,a=e.setFilteredDataset,i=e.setClickedPoint,r=e.clickedPoint,s=e.entireDataset,c=r+t;c>=0&&c<s.length&&(a([s[c]],"select"),i(c))},n.state={},n}return Object(h.a)(a,[{key:"render",value:function(){var t=this,e=this.props,a=e.clickedPoint,i=e.data,r=e.entireDataset,s=e.timePeriod,c=i;void 0===i&&(c=[]);var o=r[a];void 0===o&&(o={});var l,d,u=void 0===o.Artist?"hidden":"";return"monthly"===s?(l=o.monthID<c.length-1?"":"disabled-arrow",d=o.monthID>0?"":"disabled-arrow"):"yearly"===s&&(l=o.yearID<c.length-1?"":"disabled-arrow",d=o.yearID>0?"":"disabled-arrow"),Object(n.jsxs)("div",{className:"song-info-grid ".concat(u),children:[Object(n.jsx)("img",{id:"album-art",alt:"placeholder",src:"https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"}),Object(n.jsxs)("div",{className:"info",children:[Object(n.jsx)("span",{className:"artist",onClick:function(){return t.handleInfoClick("artist",o.Artist)},children:o.Artist})," - ",Object(n.jsx)("span",{className:"song",onClick:function(){return t.handleInfoClick("song",o.Song)},children:o.Song})]}),Object(n.jsx)("div",{className:"info album",onClick:function(){return t.handleInfoClick("album",o.Album)},children:o.Album}),Object(n.jsx)("div",{className:"info date",children:o.ConvertedDateTime?o.ConvertedDateTime.toLocaleString("default",{weekday:"long",month:"long",day:"numeric",year:"numeric",hour:"numeric",minute:"numeric"}):""}),Object(n.jsxs)("div",{className:"song-arrows",children:[Object(n.jsx)(b.a,{icon:y.d,onClick:function(){return t.handlePointChange(1)},className:"".concat(l," arrow"),title:"Go to next point"}),Object(n.jsx)(b.a,{icon:y.e,onClick:function(){return t.handlePointChange(-1)},className:"".concat(d," arrow"),style:{marginLeft:"10px"},title:"Go to the previous point"})]}),Object(n.jsx)("div",{id:"tagList"})]})}}]),a}(r.a.Component),J=["none","day","search","select","hidden"],W=function(t){var e=t.display,a=t.timePeriod,i=t.settings,r=t.setSetting,s=t.setDefaultSetting;return Object(n.jsxs)("div",{className:"time-setting",children:[Object(n.jsxs)("h3",{children:[e," Settings"]}),Object(n.jsxs)("div",{className:"settings-container",children:[Object(n.jsxs)("div",{children:[Object(n.jsx)("h4",{children:"Point Opacity"}),Object(n.jsx)("div",{className:"settings-grid",children:J.map((function(t,e){return Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)("label",{htmlFor:"".concat(a,"-").concat(t,"-opacity-setting"),children:t}),Object(n.jsx)("input",{type:"range",step:".01",min:"0",max:"1",value:i[e][0],onChange:function(e){return r(a,t,"opacity",e.target.value)},id:"".concat(a,"-").concat(t,"-opacity-setting")})]})}))})]}),Object(n.jsxs)("div",{children:[Object(n.jsx)("h4",{children:"Point Radius"}),Object(n.jsx)("div",{className:"settings-grid",children:J.map((function(t,e){return Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)("label",{htmlFor:"".concat(a,"-").concat(t,"-radius-setting"),children:t}),Object(n.jsx)("input",{type:"range",step:".5",min:"1",max:"10",value:i[e][1],onChange:function(e){return r(a,t,"radius",e.target.value)},id:"".concat(a,"-").concat(t,"-radius-setting")})]})}))})]})]}),Object(n.jsx)("button",{className:"button reset-default",onClick:function(){return s(a)},children:"Reset Default"})]})},U=function(t){Object(m.a)(a,t);var e=Object(j.a)(a);function a(t){var n;return Object(u.a)(this,a),(n=e.call(this,t)).state={},n}return Object(h.a)(a,[{key:"render",value:function(){var t=this.props,e=t.setSetting,a=t.monthlySettings,i=t.yearlySettings,r=t.setDefaultSetting;return Object(n.jsxs)("div",{children:[Object(n.jsx)(W,{display:"Monthly",timePeriod:"monthly",settings:a,setSetting:e,setDefaultSetting:r}),Object(n.jsx)(W,{display:"Yearly",timePeriod:"yearly",settings:i,setSetting:e,setDefaultSetting:r})]})}}]),a}(r.a.Component),X=(a(90),["none","day","search","select","hidden"]),q=function(t){Object(m.a)(a,t);var e=Object(j.a)(a);function a(t){var n;return Object(u.a)(this,a),(n=e.call(this,t)).setDatasetBuckets=function(t,e,a){n.setState((function(){return{datasetBuckets:t,entireDataset:e,timeRange:a}}))},n.setDataset=function(t,e){var a=[],i=n.state,r=i.timePeriod,s=i.datasetBuckets;"monthly"===r?a=s.get(e)[t]:"yearly"===r&&(a=s.get(e).yearArr),n.setState((function(n){return{dataset:a,filteredDataset:a,filterView:"none",dayFilter:{mon:!1,tue:!1,wed:!1,thu:!1,fri:!1,sat:!1,sun:!1},month:t,year:e,newLoad:!0,clickedPoint:-1}}),(function(){n.state.dataset&&n.setDatalist()}))},n.setYearList=function(t){n.setState((function(){return{yearList:t}}))},n.setDatalist=function(){var t=new Set,e=new Set,a=new Set;n.state.dataset.forEach((function(n){t.add(n.Artist),e.add(n.Song),a.add(n.Album)}));var i=function(t,e){return t.toLowerCase().localeCompare(e.toLowerCase())},r=Array.from(t).sort(i),s=Array.from(e).sort(i),c=Array.from(a).sort(i);n.setState((function(){return{datalist:{artist:r,song:s,album:c},newLoad:!1}}))},n.setClickedPoint=function(t){n.setState((function(){return{clickedPoint:t,filterView:"select",dayFilter:{mon:!1,tue:!1,wed:!1,thu:!1,fri:!1,sat:!1,sun:!1}}}))},n.setFilteredDataset=function(t,e){n.setState((function(){return{filteredDataset:t,filterView:e,dayFilter:{mon:!1,tue:!1,wed:!1,thu:!1,fri:!1,sat:!1,sun:!1}}}))},n.toggleDarkTheme=function(){n.setState((function(t){return{isDarkTheme:!t.isDarkTheme}}))},n.setSearchType=function(t){n.setState((function(){return{datalistSetting:t}}))},n.toggleDayCheckbox=function(t){var e=t.target.name;n.setState((function(t){return{dayFilter:Object(d.a)(Object(d.a)({},t.dayFilter),{},Object(l.a)({},e,!t.dayFilter[e])),filterView:"day"}}),(function(){var t=function(t,e){var a=[],n=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],i=0;return["mon","tue","wed","thu","fri","sat","sun"].forEach((function(r,s){t[r]&&(a=a.concat(e.filter((function(t){return t.Day===n[s]}))),i++)})),i>0?a:e}(n.state.dayFilter,n.state.dataset);n.setState((function(){return{filteredDataset:t}}))}))},n.handleFileUpload=function(t){var e=t.target.files[0],a=new FileReader;a.addEventListener("load",(function(){!function(t,e,a,n){v(t,e,a),x(t,n),O()}(f.d(a.result,(function(t){return t})),n.setDatasetBuckets,n.setDataset,n.setYearList)}),!1),e&&a.readAsText(e)},n.setTimePeriod=function(t){n.setState((function(){return{timePeriod:t}}),(function(){n.setDataset(n.state.month,n.state.year)}))},n.setSetting=function(t,e,a,i){n.setState((function(n){var r="monthly"===t?"monthlySettings":"yearlySettings",s="opacity"===a?0:1,c=Object(o.a)(n[r]);return c[X.indexOf(e)][s]=i,Object(l.a)({},r,c)}))},n.setDefaultSetting=function(t){var e="monthly"===t?[[.3,3],[.3,3],[.5,5],[.7,7],[.05,3]]:[[.3,2],[.3,2],[.4,3],[.7,7],[.03,2]],a="monthly"===t?"monthlySettings":"yearlySettings";n.setState(Object(l.a)({},a,e))},n.state={isDarkTheme:!1,datasetBuckets:new Map,dataset:[],entireDataset:[],filteredDataset:[],filterView:"none",yearList:[],month:0,year:0,datalist:{artist:[],song:[],album:[]},datalistSetting:"artist",dayFilter:{mon:!1,tue:!1,wed:!1,thu:!1,fri:!1,sat:!1,sun:!1},newLoad:!1,clickedPoint:-1,timePeriod:"monthly",timeRange:[],monthlySettings:[[.3,3],[.3,3],[.5,5],[.7,7],[.05,3]],yearlySettings:[[.3,2],[.3,2],[.4,3],[.7,7],[.03,2]]},n}return Object(h.a)(a,[{key:"componentDidMount",value:function(){D(this.setDatasetBuckets,this.setDataset,this.setYearList)}},{key:"render",value:function(){var t=this,e=this.state,a=e.dataset,i=e.filteredDataset,r=e.entireDataset,s=e.datalist,c=e.datalistSetting,o=e.dayFilter,l=e.filterView,d=e.month,u=e.year,h=e.timePeriod,m=e.timeRange,j=e.yearList,f=e.clickedPoint,g=e.newLoad,p=e.isDarkTheme;document.getElementsByTagName("body")[0].className=p?"":"light-theme";var v=function(e){return Object(n.jsxs)("div",{id:"search-filter",children:[Object(n.jsxs)("label",{htmlFor:"general-filter",children:[Object(n.jsxs)("span",{children:[Object(n.jsx)(b.a,{icon:y.h})," Search by "]}),Object(n.jsxs)("select",{id:"filter-select",onChange:function(e){return t.setSearchType(e.target.value)},value:c,children:[Object(n.jsx)("option",{value:"artist",children:"Artist"}),Object(n.jsx)("option",{value:"song",children:"Song"}),Object(n.jsx)("option",{value:"album",children:"Album"})]})]}),Object(n.jsx)("br",{}),Object(n.jsx)(H,{setting:c,setFilteredDataset:t.setFilteredDataset,data:a,datalist:"".concat(c,"-datalist")})]})},x=function(e){var a=e.abbrevation,i=e.fullName,r=e.displayName;return Object(n.jsxs)("label",{htmlFor:a,children:[Object(n.jsx)("input",{type:"checkbox",name:a,id:a,value:i,checked:o[a],onChange:t.toggleDayCheckbox}),Object(n.jsx)("span",{className:"checkbox",children:r})]})},O=function(t){return Object(n.jsxs)("div",{id:"day-filters",children:[Object(n.jsxs)("label",{children:[Object(n.jsx)(b.a,{icon:y.c})," Filter by day of the week:"]}),Object(n.jsxs)("div",{id:"day-container",children:[Object(n.jsx)(x,{abbrevation:"mon",fullName:"Monday",displayName:"Mon"}),Object(n.jsx)(x,{abbrevation:"tue",fullName:"Tuesday",displayName:"Tue"}),Object(n.jsx)(x,{abbrevation:"wed",fullName:"Wednesday",displayName:"Wed"}),Object(n.jsx)(x,{abbrevation:"thu",fullName:"Thursday",displayName:"Thu"}),Object(n.jsx)(x,{abbrevation:"fri",fullName:"Friday",displayName:"Fri"}),Object(n.jsx)(x,{abbrevation:"sat",fullName:"Saturday",displayName:"Sat"}),Object(n.jsx)(x,{abbrevation:"sun",fullName:"Sunday",displayName:"Sun"})]})]})},D=function(e){var a=parseInt(e.target.value);t.setDataset(a,u)},k=function(e){var a=parseInt(e.target.value);t.setDataset(d,a)},C=function(e){var a,i,r=[1,2,3,4,5,6,7,8,9,10,11,12],s=S(d,u),c=w(d,u);return"monthly"===h?(a=s>m[1]?"disabled-arrow":"",i=c<m[0]?"disabled-arrow":""):"yearly"===h&&(a=-1===j.indexOf(parseInt(u)+1)&&"disabled-arrow",i=-1===j.indexOf(parseInt(u)-1)&&"disabled-arrow"),Object(n.jsxs)("div",{className:"date-navigation",children:[Object(n.jsx)(b.a,{icon:y.b,className:"up-caret arrow ".concat(i),onClick:function(){return function(e){if("monthly"===e){var a=w(d,u),n=a.getMonth()+1,i=a.getFullYear();t.setDataset(n,i)}else"yearly"===e&&t.setDataset(d,parseInt(u)-1)}(h)},title:"Go to previous ".concat("monthly"===h?"month":"year")}),Object(n.jsx)(b.a,{icon:y.a,className:"down-caret arrow ".concat(a),onClick:function(){return function(e){if("monthly"===e){var a=S(d,u),n=a.getMonth()+1,i=a.getFullYear();t.setDataset(n,i)}else"yearly"===e&&t.setDataset(d,parseInt(u)+1)}(h)},title:"Go to the next ".concat("monthly"===h?"month":"year")}),"monthly"===h&&Object(n.jsx)("select",{id:"month-select",onChange:D,value:d,children:["January","February","March","April","May","June","July","August","September","October","November","December"].map((function(t,e){return Object(n.jsx)("option",{value:r[e],children:t})}))}),Object(n.jsx)("select",{id:"year-select",onChange:k,value:u,children:j.map((function(t){return Object(n.jsx)("option",{value:t,children:t})}))})]})},F=function(e){var a=e.value;return Object(n.jsxs)("span",{className:"time-period-button",children:[Object(n.jsx)("input",{id:a,type:"radio",value:a,name:"time-period",checked:h===a,onChange:function(){return t.setTimePeriod(a)}}),Object(n.jsx)("label",{htmlFor:a,children:a})]})};return Object(n.jsxs)("div",{className:"site-container",children:[Object(n.jsxs)("div",{id:"loading",children:[Object(n.jsx)("div",{className:"lds-dual-ring"}),Object(n.jsx)("h2",{children:"Loading..."})]}),Object(n.jsxs)("div",{id:"content-container",children:[Object(n.jsxs)("div",{id:"side-options-container",onClick:this.toggleDarkTheme,children:[Object(n.jsxs)("label",{htmlFor:"file-upload",className:"side-option button",children:[Object(n.jsx)(b.a,{icon:y.j})," Import CSV"]}),Object(n.jsx)("input",{id:"file-upload",type:"file",accept:".csv",onChange:this.handleFileUpload}),Object(n.jsx)("div",{className:"button side-option",children:p?Object(n.jsx)(b.a,{icon:y.f}):Object(n.jsx)(b.a,{icon:y.i})})]}),Object(n.jsx)("h1",{children:"Music Listening Times"}),Object(n.jsxs)("div",{className:"info-grid",children:[Object(n.jsx)(v,{}),Object(n.jsx)(O,{}),Object(n.jsxs)("button",{id:"reset",className:"button",onClick:function(){return t.setDataset(d,u)},children:[Object(n.jsx)(b.a,{icon:y.g,flip:"horizontal"})," Reset"]}),Object(n.jsx)(z,{clickedPoint:f,setFilteredDataset:this.setFilteredDataset,setSearchType:this.setSearchType,setClickedPoint:this.setClickedPoint,data:a,entireDataset:r,timePeriod:h})]}),Object(n.jsxs)("div",{className:"time-settings",children:[Object(n.jsxs)("div",{className:"time-period",children:[Object(n.jsx)(F,{value:"monthly"}),Object(n.jsx)(F,{value:"yearly"})]}),Object(n.jsxs)("div",{className:"side-container",children:[Object(n.jsxs)("div",{id:"entries",children:[i?i.length:0," entries"]}),Object(n.jsx)(C,{})]})]}),Object(n.jsx)("div",{id:"main",children:Object(n.jsx)(E,{data:a,filteredData:i,filterView:l,newLoad:g,setClickedPoint:this.setClickedPoint,setFilteredDataset:this.setFilteredDataset,sampleDate:new Date("".concat(d," 1 ").concat(u)),timePeriod:h,settings:"monthly"===this.state.timePeriod?this.state.monthlySettings:this.state.yearlySettings})})]}),Object(n.jsx)("datalist",{id:"artist-datalist",children:s.artist.map((function(t){return Object(n.jsx)("option",{children:t})}))}),Object(n.jsx)("datalist",{id:"song-datalist",children:s.song.map((function(t){return Object(n.jsx)("option",{children:t})}))}),Object(n.jsx)("datalist",{id:"album-datalist",children:s.album.map((function(t){return Object(n.jsx)("option",{children:t})}))}),Object(n.jsx)(U,{setSetting:this.setSetting,monthlySettings:this.state.monthlySettings,yearlySettings:this.state.yearlySettings,timePeriod:h,setDefaultSetting:this.setDefaultSetting})]})}}]),a}(r.a.Component),K=function(t){t&&t instanceof Function&&a.e(3).then(a.bind(null,92)).then((function(e){var a=e.getCLS,n=e.getFID,i=e.getFCP,r=e.getLCP,s=e.getTTFB;a(t),n(t),i(t),r(t),s(t)}))};c.a.render(Object(n.jsx)(r.a.StrictMode,{children:Object(n.jsx)(q,{})}),document.getElementById("root")),K()}},[[91,1,2]]]);
//# sourceMappingURL=main.b8b9d967.chunk.js.map