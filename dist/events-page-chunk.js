(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{100:function(e,n,i){"use strict";i.r(n);var a=i(101),t=i.n(a);for(var d in a)"default"!==d&&function(e){i.d(n,e,function(){return a[e]})}(d);n.default=t.a},101:function(e,n,i){"use strict";i(102),e.exports={name:"events-page",props:{},data:function(){return{eventsQuery:i(78),sections:[{title:"Participating",filters:{isParticipating:!0,NOT:{status:"Cancelled"}}},{title:"Other",filters:{isParticipating:!1,NOT:{status:"Cancelled"}}}]}},methods:{rounds:function(e){return e.currentRound?e.currentRound.index+1+" / "+e.numRounds:e.numRounds},host:function(e){return e.host.username},linker:function(e){return"/events/"+e.slug}},metaInfo:function(){return{title:function(){return"List of events"},meta:[{name:"description",content:"List of events."}]}},apollo:{currentUser:{query:i(21)}}}},102:function(e,n,i){"use strict";i.r(n),i(20).default.register({plus:{width:448,height:512,paths:[{d:"M416 208H272V64C272 46.3 257.7 32 240 32H208C190.3 32 176 46.3 176 64V208H32C14.3 208 0 222.3 0 240V272C0 289.7 14.3 304 32 304H176V448C176 465.7 190.3 480 208 480H240C257.7 480 272 465.7 272 448V304H416C433.7 304 448 289.7 448 272V240C448 222.3 433.7 208 416 208z"}]}})},103:function(e,n,i){var a=i(187);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);(0,i(10).default)("bcf83de8",a,!0,{})},186:function(e,n,i){"use strict";var a=i(103);i.n(a).a},187:function(e,n,i){(e.exports=i(9)(!1)).push([e.i,"\n.events-paginator[data-v-b3507284]{margin-top:25px\n}\n.section-title[data-v-b3507284]{font-weight:bold;border-bottom:1px solid #c0c0c0;margin-bottom:5px\n}\n",""])},277:function(e,n,i){"use strict";var a=function(){var e=this,n=e.$createElement,i=e._self._c||n;return i("div",[i("hero",{attrs:{title:"Events",subtitle:"Find an event to take part in"}}),e._v(" "),i("div",{staticClass:"columns is-centered"},[i("section",{staticClass:"content-box column is-three-quarters"},[i("div",[e.currentUser?i("router-link",{staticClass:"button",attrs:{to:{path:"/create-event"}}},[i("span",{staticClass:"icon"},[i("icon",{staticStyle:{"margin-right":"10px"},attrs:{name:"plus",scale:"1"}})],1),e._v("\n          New event\n        ")]):e._e()],1),e._v(" "),e._l(e.sections,function(n){return i("div",{staticClass:"events-paginator"},[i("div",{staticClass:"section-title"},[e._v(e._s(n.title))]),e._v(" "),i("paginator",{attrs:{resource:"events",query:e.eventsQuery,"show-headers":!0,headers:[{field:"name",title:"Name",sortable:!0},{field:"status",title:"Status",sortable:!0},{field:e.host,title:"Host",sortable:!0,sortField:"hostUserId",tooltip:"The username of the user hosting the event"},{field:"numParticipants",title:"Participants",sortable:!0,tooltip:"The number of currently signed up participants"},{field:e.rounds,title:"Rounds",sortable:!0,tooltip:"Number of rounds in the event and (possibly) the current round"},{field:"isPublic",title:"Public",sortable:!0,tooltip:"Whether the event is available for everyone"},{field:"isScheduleVisible",title:"Visible schedule",sortable:!0,tooltip:"Whether the swap schedule is visible for everyone who can see the event"},{field:"areChangesVisible",title:"Visible changes",sortable:!0,tooltip:"Whether uploaded files should be public everyone who can see the event"}],linker:e.linker,sort:"status",descending:!1,filters:n.filters}})],1)})],2)])],1)},t=[];i.d(n,"a",function(){return a}),i.d(n,"b",function(){return t})},58:function(e,n,i){"use strict";i.r(n);var a=i(277),t=i(100);for(var d in t)"default"!==d&&function(e){i.d(n,e,function(){return t[e]})}(d);i(186);var r=i(4),s=Object(r.a)(t.default,a.a,a.b,!1,null,"b3507284",null);n.default=s.exports},77:function(e,n){var i={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"userParts"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"User"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"slug"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"username"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"gravatar"},arguments:[{kind:"Argument",name:{kind:"Name",value:"size"},value:{kind:"Variable",name:{kind:"Name",value:"gravatarSize"}}}],directives:[]}]}}],loc:{start:0,end:87}};i.loc.source={body:" fragment userParts on User {\n  id\n  slug\n  username\n  gravatar(size: $gravatarSize)\n}\n",name:"GraphQL request",locationOffset:{line:1,column:1}};e.exports=i},78:function(e,n,i){var a={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"Events"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"details"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}},defaultValue:{kind:"BooleanValue",value:!1}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"offset"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"limit"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"500"}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"maxDescription"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"NullValue"}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"gravatarSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"40"}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filters"}},type:{kind:"NamedType",name:{kind:"Name",value:"EventsFilter"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sort"}},type:{kind:"NamedType",name:{kind:"Name",value:"EventsSortField"}},defaultValue:{kind:"EnumValue",value:"id"}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"descending"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}},defaultValue:{kind:"BooleanValue",value:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"events"},arguments:[{kind:"Argument",name:{kind:"Name",value:"selection"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"offset"},value:{kind:"Variable",name:{kind:"Name",value:"offset"}}},{kind:"ObjectField",name:{kind:"Name",value:"limit"},value:{kind:"Variable",name:{kind:"Name",value:"limit"}}},{kind:"ObjectField",name:{kind:"Name",value:"sort"},value:{kind:"Variable",name:{kind:"Name",value:"sort"}}},{kind:"ObjectField",name:{kind:"Name",value:"descending"},value:{kind:"Variable",name:{kind:"Name",value:"descending"}}},{kind:"ObjectField",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"filters"}}}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"slug"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[{kind:"Argument",name:{kind:"Name",value:"maxLength"},value:{kind:"Variable",name:{kind:"Name",value:"maxDescription"}}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"currentRound"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"index"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"currentRoundsubmission"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"roundsubmissionParts"},directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"numRounds"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"numParticipants"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"roundsubmissions"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"include"},arguments:[{kind:"Argument",name:{kind:"Name",value:"if"},value:{kind:"Variable",name:{kind:"Name",value:"details"}}}]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"roundsubmissionParts"},directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"participants"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"include"},arguments:[{kind:"Argument",name:{kind:"Name",value:"if"},value:{kind:"Variable",name:{kind:"Name",value:"details"}}}]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"userParts"},directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"host"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"userParts"},directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"areChangesVisible"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isScheduleVisible"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isParticipant"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isAdministrator"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isPublic"},arguments:[],directives:[]},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"AdministeredEvent"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"initialFile"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"filename"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sizeHuman"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"downloadUrl"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"invitedUsers"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"userParts"},directives:[]}]}}]}}]}}]}}],loc:{start:0,end:1210}};a.loc.source={body:'#import "./fragments/userParts.gql"\r\n#import "./fragments/roundsubmissionParts.gql"\r\n\r\nquery Events (\r\n  $details: Boolean = false,\r\n  $offset: Int = 0,\r\n  $limit: Int = 500,\r\n  $maxDescription: Int = null,\r\n  $gravatarSize: Int = 40,\r\n  $filters: EventsFilter,\r\n  $sort: EventsSortField = id,\r\n  $descending: Boolean = false\r\n) {\r\n  events(selection: {\r\n    offset: $offset,\r\n    limit: $limit,\r\n    sort: $sort,\r\n    descending: $descending,\r\n    filters: $filters\r\n  }) {\r\n    id\r\n    slug\r\n    name\r\n    status\r\n    description(maxLength: $maxDescription)\r\n    currentRound {\r\n      id\r\n      index\r\n    }\r\n    currentRoundsubmission {\r\n      ...roundsubmissionParts\r\n    }\r\n    numRounds\r\n    numParticipants\r\n    roundsubmissions @include(if: $details) {\r\n      ...roundsubmissionParts\r\n    }\r\n    participants @include(if: $details)  {\r\n      ...userParts\r\n    }\r\n    host {\r\n      ...userParts\r\n    }\r\n    areChangesVisible\r\n    isScheduleVisible\r\n    isParticipant\r\n    isAdministrator\r\n    isPublic\r\n    ... on AdministeredEvent {\r\n      initialFile {\r\n        id\r\n        filename\r\n        sizeHuman\r\n        downloadUrl\r\n      }\r\n      invitedUsers {\r\n        ...userParts\r\n      }\r\n    }\r\n  }\r\n}\r\n',name:"GraphQL request",locationOffset:{line:1,column:1}};var t={};function d(e){return e.filter(function(e){if("FragmentDefinition"!==e.kind)return!0;var n=e.name.value;return!t[n]&&(t[n]=!0,!0)})}a.definitions=a.definitions.concat(d(i(77).definitions)),a.definitions=a.definitions.concat(d(i(79).definitions));var r={};function s(e,n){for(var i=0;i<e.definitions.length;i++){var a=e.definitions[i];if(a.name&&a.name.value==n)return a}}a.definitions.forEach(function(e){if(e.name){var n=new Set;!function e(n,i){if("FragmentSpread"===n.kind)i.add(n.name.value);else if("VariableDefinition"===n.kind){var a=n.type;"NamedType"===a.kind&&i.add(a.name.value)}n.selectionSet&&n.selectionSet.selections.forEach(function(n){e(n,i)}),n.variableDefinitions&&n.variableDefinitions.forEach(function(n){e(n,i)}),n.definitions&&n.definitions.forEach(function(n){e(n,i)})}(e,n),r[e.name.value]=n}}),e.exports=a,e.exports.Events=function(e,n){var i={kind:e.kind,definitions:[s(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);for(var a=r[n]||new Set,t=new Set,d=new Set(a);d.size>0;){var l=d;d=new Set,l.forEach(function(e){t.has(e)||(t.add(e),(r[e]||new Set).forEach(function(e){d.add(e)}))})}return t.forEach(function(n){var a=s(e,n);a&&i.definitions.push(a)}),i}(a,"Events")},79:function(e,n){var i={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"roundsubmissionParts"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Roundsubmission"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"round"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"index"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"participant"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"userParts"},directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"originalParticipant"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"userParts"},directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"song"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"fileSeeded"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"filename"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"downloadUrl"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"fileSubmitted"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"filename"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"downloadUrl"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:308}};i.loc.source={body:"fragment roundsubmissionParts on Roundsubmission {\n  id\n  status\n  round {\n    id\n    index\n  }\n  participant {\n    ...userParts\n  },\n  originalParticipant {\n    ...userParts\n  }\n  song { id }\n  fileSeeded {\n    id\n    filename\n    downloadUrl\n  }\n  fileSubmitted {\n    id\n    filename\n    downloadUrl\n  }\n}\n",name:"GraphQL request",locationOffset:{line:1,column:1}};e.exports=i}}]);