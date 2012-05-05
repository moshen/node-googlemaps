var vows = require('vows'),
  assert = require('assert'),
  gm = require('../lib/googlemaps');

vows.describe('directions').addBatch({
  'Simple Directions (From: Madison, Wi To: Chicago, Il)': {
    topic: function(){
      gm.directions('Madison , Wi, USA', 'Chicago, Il, USA' , this.callback , 'false');
    },
    'returns as a valid request': function(err, result){
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected lat/lng for Chicago': function(err, result){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat , 43.07330000000001);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng , -89.40240000000001);
    }
  }
}).export(module);

/* Directions result
{
   "status":"OK",
   "routes":[
      {
         "summary":"I-90 E",
         "legs":[
            {
               "steps":[
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.07333,
                        "lng":-89.40123
                     },
                     "end_location":{
                        "lat":43.07333,
                        "lng":-89.4026
                     },
                     "polyline":{
                        "points":"iw{eGtdt`PE|CDrB",
                        "levels":"B?B"
                     },
                     "duration":{
                        "value":10,
                        "text":"1 min"
                     },
                     "html_instructions":"Head <b>west</b> on <b>University Ave</b> toward <b>N Brooks St</b>",
                     "distance":{
                        "value":111,
                        "text":"364 ft"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.07333,
                        "lng":-89.4026
                     },
                     "end_location":{
                        "lat":43.07212,
                        "lng":-89.40264
                     },
                     "polyline":{
                        "points":"iw{eGfmt`PpFF",
                        "levels":"BB"
                     },
                     "duration":{
                        "value":34,
                        "text":"1 min"
                     },
                     "html_instructions":"Take the 1st <b>left</b> onto <b>N Brooks St</b>",
                     "distance":{
                        "value":134,
                        "text":"440 ft"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.07212,
                        "lng":-89.40264
                     },
                     "end_location":{
                        "lat":43.07211,
                        "lng":-89.401
                     },
                     "polyline":{
                        "points":"wo{eGnmt`P@gI",
                        "levels":"BB"
                     },
                     "duration":{
                        "value":45,
                        "text":"1 min"
                     },
                     "html_instructions":"Turn <b>left</b> at <b>W Johnson St</b>",
                     "distance":{
                        "value":133,
                        "text":"436 ft"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.07211,
                        "lng":-89.401
                     },
                     "end_location":{
                        "lat":43.06766,
                        "lng":-89.40124
                     },
                     "polyline":{
                        "points":"uo{eGfct`PrBT`IRlFJtEE",
                        "levels":"B???B"
                     },
                     "duration":{
                        "value":59,
                        "text":"1 min"
                     },
                     "html_instructions":"Take the 1st <b>right</b> onto <b>N Park St</b>",
                     "distance":{
                        "value":496,
                        "text":"0.3 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.06766,
                        "lng":-89.40124
                     },
                     "end_location":{
                        "lat":43.06696,
                        "lng":-89.39526
                     },
                     "polyline":{
                        "points":"{szeGvdt`PFgIJi@C_J|AmK\\kA",
                        "levels":"B????B"
                     },
                     "duration":{
                        "value":92,
                        "text":"2 mins"
                     },
                     "html_instructions":"Turn <b>left</b> at <b>Regent St</b>",
                     "distance":{
                        "value":500,
                        "text":"0.3 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.06696,
                        "lng":-89.39526
                     },
                     "end_location":{
                        "lat":43.06414,
                        "lng":-89.39059
                     },
                     "polyline":{
                        "points":"oozeGj_s`Ph@uB~NgTNgBE_@",
                        "levels":"B???B"
                     },
                     "duration":{
                        "value":80,
                        "text":"1 min"
                     },
                     "html_instructions":"Continue onto <b>Proudfit St</b>",
                     "distance":{
                        "value":507,
                        "text":"0.3 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.06414,
                        "lng":-89.39059
                     },
                     "end_location":{
                        "lat":43.06699,
                        "lng":-89.38628
                     },
                     "polyline":{
                        "points":"{}yeGdbr`PKiASs@iAeAwBmAmCoBaB_Co@eBi@aCMsB",
                        "levels":"B?????@??B"
                     },
                     "duration":{
                        "value":22,
                        "text":"1 min"
                     },
                     "html_instructions":"Continue onto <b>N Shore Dr</b>",
                     "distance":{
                        "value":500,
                        "text":"0.3 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.06699,
                        "lng":-89.38628
                     },
                     "end_location":{
                        "lat":43.04457,
                        "lng":-89.37121
                     },
                     "polyline":{
                        "points":"uozeGfgq`PZS\\?`HlBxFbA~Fv@tBEjB_@dAe@zFiEfWwTjFmF|EyFrDiDx@m@|BeAfFqAdDkAjDyB`A_@`AkAfCyBnBeCbC{DpHsO~AsB",
                        "levels":"B????@??@????@?????@?????B"
                     },
                     "duration":{
                        "value":232,
                        "text":"4 mins"
                     },
                     "html_instructions":"Turn <b>right</b> at <b>John Nolen Dr</b>",
                     "distance":{
                        "value":2943,
                        "text":"1.8 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.04457,
                        "lng":-89.37121
                     },
                     "end_location":{
                        "lat":43.04726,
                        "lng":-89.28919
                     },
                     "polyline":{
                        "points":"qcveG`in`PvA{Al@WjB_@pB_A~@gBJaBAq@[aBc@_AiAyAUu@QgA[{EeAmo@IqpBSkNeDcsAkBmuA{AuNeHeh@YoCY{FIiIz@}r@",
                        "levels":"B?????@??????@????@???@?B"
                     },
                     "duration":{
                        "value":323,
                        "text":"5 mins"
                     },
                     "html_instructions":"Merge onto <b>US-12 E/US-18 E</b> via the ramp to <b>I-90</b>",
                     "distance":{
                        "value":6889,
                        "text":"4.3 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":43.04726,
                        "lng":-89.28919
                     },
                     "end_location":{
                        "lat":41.87356,
                        "lng":-87.64563
                     },
                     "polyline":{
                        "points":"ktveGlh~_Pb@yNj@gHl@_Et@uCtAaE|AqCpAgBzRiUtDmFjByCjAyBNm@rCqEdDwGnKmRfb@wt@lGqJj]uc@rE}GhCoEjcActBjA}CzBkHnOcs@bGqZbKie@nD}MtGwX~@wCbQct@fB{IdBgLvAoNl@uJZ{KBoOaAkVcAyK_CkQy@_L_@{Nd@ePTwCfDuWtT}~AlAoGdBsH`DuKxEaMxCkGfEoHtCiEfaD}nEfCsC`DiCfBeAdCgAdD_A|Dg@vQw@~KaAfKeB`GuAxFaB|EcBfImDlmAal@xJoDxLcD|JiBrBWvIy@vG[nGKfdAv@dHUbFo@vFgAdDcAxF_ClFwC~}@wl@zMsJnMkKrrAyjA~C{C~EuFdLwMjWc[`MsN|bAwcAzHeHdHeFtFcDjHcDdGuBxF}AnpCen@dq@gLvD{AlDwB`DuCpB_Cr[}f@rNaTpCqDzCeDjIaH`GqDxGoCzJiC`Hy@dESrd@Ph`BdAdg@PhHNv{CfBzHe@rHkAjEiArJwDxDuBbHoFpH}HvImMbS_\\pSs[vCoDbDyCjDwCpEeCtCkAnGkBvCg@nEc@dVU|rEeBbQAXIpx@MzaDuB~n@U|mAgAbmHiFlF]nCa@zE_AtCy@~t@uXlKcDdBc@tGy@bHYvuEjBfD`@bDn@xGjCrFdEhL~LtW`X`HzHdYjZzCjCzDdCrGdCdMbC~O`EbVnEjL`BnI`@zLRfLGjtDSbMo@lHyA|PqEhLiDzNcD~{@aUjRiFzNeDtDo@hFa@|YSvM?dIMtj@OzEg@bEeAdDsAvxAar@bLcFxI}ChgAy]zRwHnH}BhL}C`GqBvIwBhDs@xK_BtEa@nLi@|NGvNJ~h@DvpFrAnd@^b^FrcCIrmCJhGGzCW`HwBtF}CjEeEfBiCdDgGlAiDlA{Ez@wEp@cINiYYwu@Guf@b@{NXiErAkLt@oEz@iEjCyJvAaEzD_Jhl@gdAdBuDpDiJhDkMpBwKnAsLn@gLNcNcAclGJiHGaSOaK_A{gFJyuCTcHx@eJ`@qCbBqHnB}GteA}nD`DgM`cCi~L~Ss}@xAoF`CqKb`@}_B`g@{pBrHk[vk@a}BjG}Wft@suCnLaf@dBeI|o@gcDl_@emBnIma@zMor@tx@cfFzDqWda@ihCfLks@|B{JvDeLzLc[xAmElNc^zLq\\dQyc@|Tsl@bNu^xEwNxCoLpLog@nBiJ~Hs\\xJkc@lFwRzUmr@|AiFnY{z@nt@kyBrHgTbXay@vVmt@tE}QvJoq@hAoJdHur@~Hco@r@aJZkHDeEIu{LKi_BH{d@GiXFoFMy|@DkuMp@cPrQ_xCnI{pAvNmdChGa_AzBi`@zBsUlAmJlBeLrAmGnF}SrJ{YnPad@hy@i}BjKkY|BuFlHcOhK}PpfA__BhCiE~AuDfC_Jv@eFdSsbBpCcSxl@skDdH}`@jBiIhH}Sfo@}gBxBgErC_ElU}UlCyDxAmCtd@yeAn@{AfAkE|CwQj@eFr@}NJcGAcNeCmqAMaNDiPn@kT`C_`@j@_HfDcUn@qJFkC?kNe@grCN}GpAgHl@aB`z@ghBjBaGbCoNp@yChAsDdCgGtSec@jLyS~AoE`AwDpA}G\\u@`CmEpJkO|NkYzZgr@dZun@jBoEjD_KbAuAnCcCpOiHzBoAhA}@`BiBrA_ChBcFzDgUbAmCrGoNnr@evA|FaPrB{Et_AupBlAgC`A}A|DyEdBcBzD{CxVmM|JaGpDsDrFqGvCoBnDiAr@IrEAlGVhBCvFk@pAWnQ}FlDaBbCyAzCwC|AkBrDwFbMeUlEqHbCaFpCsE`HmHfFyCrBo@rC_@hCOrLWpAD`OOrYoAvKJ",
                        "levels":"B????@???@??????@???@??A????????@???@???@?@??@??A???@A????@?????@????@???@??@???A??@?@????@??A???@??@??@??@???B??@????@?A??@?@????@??@??A????????@???@?@??A??@?@?????@????@???A?@??????@?????@???@???@????A?????????@??@??B????@??@???@???@??@???A?????@@??A???@@??????????@???@????A????????@?????@??????@?A?????@??????@?????@??A??@???@????@???@??@?@???@???A???@???@????@??@??A@???@??@???@??????@??????@??@??????A???????@?????@???@??????@?@???????B"
                     },
                     "duration":{
                        "value":9280,
                        "text":"2 hours 35 mins"
                     },
                     "html_instructions":"Take exit <b>267A</b> to merge onto <b>I-39 S/I-90 E</b> toward <b>Janesville/Chicago</b> <div style=\"font-size:0.9em\">Continue to follow I-90 E</div><div style=\"font-size:0.9em\">Partial toll road</div><div style=\"font-size:0.9em\">Entering Illinois</div>",
                     "distance":{
                        "value":223703,
                        "text":"139 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":41.87356,
                        "lng":-87.64563
                     },
                     "end_location":{
                        "lat":41.86972,
                        "lng":-87.64536
                     },
                     "polyline":{
                        "points":"wlq~Fdh}uOxC@`Io@bHG",
                        "levels":"B??B"
                     },
                     "duration":{
                        "value":40,
                        "text":"1 min"
                     },
                     "html_instructions":"Take exit <b>52A</b> for <b>Taylor St</b> toward <b>Roosevelt Rd</b>",
                     "distance":{
                        "value":428,
                        "text":"0.3 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":41.86972,
                        "lng":-87.64536
                     },
                     "end_location":{
                        "lat":41.86967,
                        "lng":-87.64704
                     },
                     "polyline":{
                        "points":"wtp~Fnf}uOHnI",
                        "levels":"BB"
                     },
                     "duration":{
                        "value":23,
                        "text":"1 min"
                     },
                     "html_instructions":"Turn <b>right</b> at <b>W Taylor St</b>",
                     "distance":{
                        "value":139,
                        "text":"456 ft"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":41.86967,
                        "lng":-87.64704
                     },
                     "end_location":{
                        "lat":41.8547,
                        "lng":-87.64656
                     },
                     "polyline":{
                        "points":"mtp~F~p}uO|FIx@OxrAeA",
                        "levels":"B??B"
                     },
                     "duration":{
                        "value":145,
                        "text":"2 mins"
                     },
                     "html_instructions":"Take the 1st <b>left</b> onto <b>S Halsted St</b>",
                     "distance":{
                        "value":1667,
                        "text":"1.0 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":41.8547,
                        "lng":-87.64656
                     },
                     "end_location":{
                        "lat":41.85258,
                        "lng":-87.65119
                     },
                     "polyline":{
                        "points":"{vm~F~m}uOfL|[",
                        "levels":"BB"
                     },
                     "duration":{
                        "value":47,
                        "text":"1 min"
                     },
                     "html_instructions":"Turn <b>right</b> at <b>S Canalport Ave</b>",
                     "distance":{
                        "value":450,
                        "text":"0.3 mi"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":41.85258,
                        "lng":-87.65119
                     },
                     "end_location":{
                        "lat":41.85258,
                        "lng":-87.65141
                     },
                     "polyline":{
                        "points":"sim~F|j~uO?j@",
                        "levels":"BB"
                     },
                     "duration":{
                        "value":5,
                        "text":"1 min"
                     },
                     "html_instructions":"Slight <b>right</b> at <b>W Cermak Rd</b>",
                     "distance":{
                        "value":18,
                        "text":"59 ft"
                     }
                  },
                  {
                     "travel_mode":"DRIVING",
                     "start_location":{
                        "lat":41.85258,
                        "lng":-87.65141
                     },
                     "end_location":{
                        "lat":41.85073,
                        "lng":-87.65126
                     },
                     "polyline":{
                        "points":"sim~Fhl~uOx@QvHK",
                        "levels":"B?B"
                     },
                     "duration":{
                        "value":42,
                        "text":"1 min"
                     },
                     "html_instructions":"Take the 1st <b>left</b> onto <b>S Morgan St</b>",
                     "distance":{
                        "value":207,
                        "text":"0.1 mi"
                     }
                  }
               ],
               "duration":{
                  "value":10479,
                  "text":"2 hours 55 mins"
               },
               "distance":{
                  "value":238825,
                  "text":"148 mi"
               },
               "start_location":{
                  "lat":43.07333,
                  "lng":-89.40123
               },
               "end_location":{
                  "lat":41.85073,
                  "lng":-87.65126
               },
               "start_address":"Madison, WI, USA",
               "end_address":"Chicago, IL, USA"
            }
         ],
         "copyrights":"Map data \u00a92010 Google",
         "overview_polyline":{
            "points":"iw{eGtdt`P?pGpFF@gIxZn@NqUlB}Lv@qC`NwRl@wCe@}CqLcKgB{Ix@SzWhFfHkAb_@a[|RqSrXkLxHkItOcYvA{AjGwB~@gBHsCuCsGw@aIeAmo@IqpBeH}xDaK{w@}@aQz@qw@fBs[~FwP|[ca@`aAydBtm@iz@jcActBfEiMvc@_uBha@qaBlEcWdCeZ^k\\aAkV}Fek@_@{Nz@}Tj\\c`CdJu[|MqXbdD_sEbJeJtLwErc@wCb[}Gr~Ast@`]}JrP}BnT{@lmA`@zMwB~KcEhtAc}@baBewAr~@afA|bAwcA`RkO`PgI~NsEnpCen@dq@gLvD{A`MmKxo@qaAhVyRtSyGfNmAdtI`FnRqBxVwJtQmPlr@agAzHiIrOiJvRwDrvHuC|nQ}LnVyDlaAy]~SwBvuEjBjIpAxGjCrFdEfhAhkAvIpGrGdCd^dInc@pHjWt@raE[bMo@lHyA`tCat@zeBsAzEg@hJyCzeBey@noBmp@b_@gKbQsCbc@sAboJlCfrG@dL_@`HwBtF}CrHoIrFqLzDwVQwwB|@eUhC{RfEcQrGaPhl@gdAvG_PzGcZ~B{Y_CqmPJyuCpB{WjqAuoE`cCi~L~{@srDvkDclNviBkgJv`B_hKdPg_AxpBimFbr@avChcDwtJtE}QvJoq@nTinBtAsYS{vb@ry@yaNvHgn@bIk\\rJ{Yb{AmdEvTaa@pfA__BhF_K~DeQvWwvBjy@{wEpx@{|BlGgKzYw[fj@qpAhF{[~@aWuCsoB\\e]xCoh@rEc^v@}NUqjDdEmOzw@cdBjJ_a@zWmk@jLySpG{Up^ep@`v@}aBvGoQrEyElSyJ~FgHhJy`@b{@ueBpJ}VbbA}tBdJ{Krh@kZ|PuPbFsA`NT`Jo@`TuGpH{DlL{Nl]}m@zF}FzIiEbN}@lxAmCHnIp|A_BfLh]pJ]",
            "levels":"B@@@@?@??@?@@?@@?@@?@??A??@??@?@?A@@@@?A??@?@?@?@@?A?A@?@@@?@@?A@@@?@?@??@@@B?@@A@@?@@A?@@@A?@?@?@??@?A?@@?@?@@?A??@?@?B?@@?@?@?@?A@@A@@?@@?A@@@?A?@@@A?@@??@?@@@?@A?@?@??@A?@@?@A??@??@@??@A@@??@?@?@?A?@@@@B"
         },
         "warnings":[

         ],
         "waypoint_order":[

         ]
      }
   ]
}
*/

// vim: set expandtab sw=2:
