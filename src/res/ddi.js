let Ddi = {}
    Ddi.ddiList = [
    {"cdCountry":"55","nmCountry":"Brazil (+55)","isoCountry":"br"}
    ,{"cdCountry":"64","nmCountry":"New Zealand (+64)","isoCountry":"nz"}
    ,{"cdCountry":"61","nmCountry":"Australia (+61)","isoCountry":"au"}
    ,{"cdCountry":"1","nmCountry":"USA (+1)","isoCountry":"us"}
    ,{"cdCountry":"44","nmCountry":"UK (+44)","isoCountry":"gb"}
    ,{"cdCountry":"213","nmCountry":"Algeria (+213)","isoCountry":"dz"}
    ,{"cdCountry":"376","nmCountry":"Andorra (+376)","isoCountry":"ad"}
    ,{"cdCountry":"244","nmCountry":"Angola (+244)","isoCountry":"ao"}
    ,{"cdCountry":"1264","nmCountry":"Anguilla (+1264)","isoCountry":"ai"}
    ,{"cdCountry":"1268","nmCountry":"Antigua &amp; Barbuda (+1268)","isoCountry":"ag"}
    ,{"cdCountry":"54","nmCountry":"Argentina (+54)","isoCountry":"ar"}
    ,{"cdCountry":"374","nmCountry":"Armenia (+374)","isoCountry":"am"}
    ,{"cdCountry":"297","nmCountry":"Aruba (+297)","isoCountry":"aw"}
    ,{"cdCountry":"43","nmCountry":"Austria (+43)","isoCountry":"at"}
    ,{"cdCountry":"994","nmCountry":"Azerbaijan (+994)","isoCountry":"az"}
    ,{"cdCountry":"1242","nmCountry":"Bahamas (+1242)","isoCountry":"bs"}
    ,{"cdCountry":"973","nmCountry":"Bahrain (+973)","isoCountry":"bh"}
    ,{"cdCountry":"880","nmCountry":"Bangladesh (+880)","isoCountry":"bd"}
    ,{"cdCountry":"1246","nmCountry":"Barbados (+1246)","isoCountry":"bb"}
    ,{"cdCountry":"375","nmCountry":"Belarus (+375)","isoCountry":"by"}
    ,{"cdCountry":"32","nmCountry":"Belgium (+32)","isoCountry":"be"}
    ,{"cdCountry":"501","nmCountry":"Belize (+501)","isoCountry":"bz"}
    ,{"cdCountry":"229","nmCountry":"Benin (+229)","isoCountry":"bj"}
    ,{"cdCountry":"1441","nmCountry":"Bermuda (+1441)","isoCountry":"bm"}
    ,{"cdCountry":"975","nmCountry":"Bhutan (+975)","isoCountry":"bt"}
    ,{"cdCountry":"591","nmCountry":"Bolivia (+591)","isoCountry":"bo"}
    ,{"cdCountry":"387","nmCountry":"Bosnia Herzegovina (+387)","isoCountry":"ba"}
    ,{"cdCountry":"267","nmCountry":"Botswana (+267)","isoCountry":"bw"}
    ,{"cdCountry":"673","nmCountry":"Brunei (+673)","isoCountry":"bn"}
    ,{"cdCountry":"359","nmCountry":"Bulgaria (+359)","isoCountry":"bg"}
    ,{"cdCountry":"226","nmCountry":"Burkina Faso (+226)","isoCountry":"bf"}
    ,{"cdCountry":"257","nmCountry":"Burundi (+257)","isoCountry":"bi"}
    ,{"cdCountry":"855","nmCountry":"Cambodia (+855)","isoCountry":"kh"}
    ,{"cdCountry":"237","nmCountry":"Cameroon (+237)","isoCountry":"cm"}
    ,{"cdCountry":"1","nmCountry":"Canada (+1)","isoCountry":"ca"}
    ,{"cdCountry":"238","nmCountry":"Cape Verde Islands (+238)","isoCountry":"cv"}
    ,{"cdCountry":"1345","nmCountry":"Cayman Islands (+1345)","isoCountry":"ky"}
    ,{"cdCountry":"236","nmCountry":"Central African Republic (+236)","isoCountry":"cf"}
    ,{"cdCountry":"235","nmCountry":"Chade (+235)","isoCountry":"td"}
    ,{"cdCountry":"56","nmCountry":"Chile (+56)","isoCountry":"cl"}
    ,{"cdCountry":"86","nmCountry":"China (+86)","isoCountry":"ch"}
    ,{"cdCountry":"57","nmCountry":"Colombia (+57)","isoCountry":"co"}
    ,{"cdCountry":"269","nmCountry":"Comoros (+269)","isoCountry":"km"}
    ,{"cdCountry":"242","nmCountry":"Congo (+242)","isoCountry":"cg"}
    ,{"cdCountry":"682","nmCountry":"Cook Islands (+682)","isoCountry":"ck"}
    ,{"cdCountry":"506","nmCountry":"Costa Rica (+506)","isoCountry":"cr"}
    ,{"cdCountry":"385","nmCountry":"Croatia (+385)","isoCountry":"hr"}
    ,{"cdCountry":"53","nmCountry":"Cuba (+53)","isoCountry":"cy"}
    ,{"cdCountry":"90","nmCountry":"Cyprus - North (+90)","isoCountry":"un"}
    ,{"cdCountry":"357","nmCountry":"Cyprus - South (+357)","isoCountry":"cy"}
    ,{"cdCountry":"420","nmCountry":"Czech Republic (+420)","isoCountry":"cz"}
    ,{"cdCountry":"45","nmCountry":"Denmark (+45)","isoCountry":"dk"}
    ,{"cdCountry":"253","nmCountry":"Djibouti (+253)","isoCountry":"dj"}
    ,{"cdCountry":"1809","nmCountry":"Dominica (+1809)","isoCountry":"dm"}
    ,{"cdCountry":"1809","nmCountry":"Dominican Republic (+1809)","isoCountry":"do"}
    ,{"cdCountry":"593","nmCountry":"Ecuador (+593)","isoCountry":"ec"}
    ,{"cdCountry":"20","nmCountry":"Egypt (+20)","isoCountry":"eg"}
    ,{"cdCountry":"503","nmCountry":"El Salvador (+503)","isoCountry":"sv"}
    ,{"cdCountry":"240","nmCountry":"Equatorial Guinea (+240)","isoCountry":"gq"}
    ,{"cdCountry":"291","nmCountry":"Eritrea (+291)","isoCountry":"er"}
    ,{"cdCountry":"372","nmCountry":"Estonia (+372)","isoCountry":"ee"}
    ,{"cdCountry":"251","nmCountry":"Ethiopia (+251)","isoCountry":"et"}
    ,{"cdCountry":"500","nmCountry":"Falkland Islands (+500)","isoCountry":"fk"}
    ,{"cdCountry":"298","nmCountry":"Faroe Islands (+298)","isoCountry":"fo"}
    ,{"cdCountry":"679","nmCountry":"Fiji (+679)","isoCountry":"fj"}
    ,{"cdCountry":"358","nmCountry":"Finland (+358)","isoCountry":"fi"}
    ,{"cdCountry":"33","nmCountry":"France (+33)","isoCountry":"fr"}
    ,{"cdCountry":"594","nmCountry":"French Guiana (+594)","isoCountry":"gf"}
    ,{"cdCountry":"689","nmCountry":"French Polynesia (+689)","isoCountry":"pf"}
    ,{"cdCountry":"241","nmCountry":"Gabon (+241)","isoCountry":"ga"}
    ,{"cdCountry":"220","nmCountry":"Gambia (+220)","isoCountry":"gm"}
    ,{"cdCountry":"7880","nmCountry":"Georgia (+7880)","isoCountry":"ge"}
    ,{"cdCountry":"49","nmCountry":"Germany (+49)","isoCountry":"de"}
    ,{"cdCountry":"233","nmCountry":"Ghana (+233)","isoCountry":"gh"}
    ,{"cdCountry":"350","nmCountry":"Gibraltar (+350)","isoCountry":"gi"}
    ,{"cdCountry":"30","nmCountry":"Greece (+30)","isoCountry":"gr"}
    ,{"cdCountry":"299","nmCountry":"Greenland (+299)","isoCountry":"gl"}
    ,{"cdCountry":"1473","nmCountry":"Grenada (+1473)","isoCountry":"gd"}
    ,{"cdCountry":"590","nmCountry":"Guadeloupe (+590)","isoCountry":"gp"}
    ,{"cdCountry":"671","nmCountry":"Guam (+671)","isoCountry":"gu"}
    ,{"cdCountry":"502","nmCountry":"Guatemala (+502)","isoCountry":"gt"}
    ,{"cdCountry":"224","nmCountry":"Guinea (+224)","isoCountry":"gn"}
    ,{"cdCountry":"245","nmCountry":"Guinea - Bissau (+245)","isoCountry":"gw"}
    ,{"cdCountry":"592","nmCountry":"Guyana (+592)","isoCountry":"gy"}
    ,{"cdCountry":"509","nmCountry":"Haiti (+509)","isoCountry":"ht"}
    ,{"cdCountry":"504","nmCountry":"Honduras (+504)","isoCountry":"hn"}
    ,{"cdCountry":"852","nmCountry":"Hong Kong (+852)","isoCountry":"hk"}
    ,{"cdCountry":"36","nmCountry":"Hungary (+36)","isoCountry":"hu"}
    ,{"cdCountry":"354","nmCountry":"Iceland (+354)","isoCountry":"is"}
    ,{"cdCountry":"91","nmCountry":"India (+91)","isoCountry":"in"}
    ,{"cdCountry":"62","nmCountry":"Indonesia (+62)","isoCountry":"id"}
    ,{"cdCountry":"964","nmCountry":"Iraq (+964)","isoCountry":"ir"}
    ,{"cdCountry":"98","nmCountry":"Iran (+98)","isoCountry":"iq"}
    ,{"cdCountry":"353","nmCountry":"Ireland (+353)","isoCountry":"ie"}
    ,{"cdCountry":"972","nmCountry":"Israel (+972)","isoCountry":"il"}
    ,{"cdCountry":"39","nmCountry":"Italy (+39)","isoCountry":"it"}
    ,{"cdCountry":"1876","nmCountry":"Jamaica (+1876)","isoCountry":"jm"}
    ,{"cdCountry":"81","nmCountry":"Japan (+81)","isoCountry":"jp"}
    ,{"cdCountry":"962","nmCountry":"Jordan (+962)","isoCountry":"jo"}
    ,{"cdCountry":"7","nmCountry":"Kazakhstan (+7)","isoCountry":"kz"}
    ,{"cdCountry":"254","nmCountry":"Kenya (+254)","isoCountry":"ke"}
    ,{"cdCountry":"686","nmCountry":"Kiribati (+686)","isoCountry":"ki"}
    ,{"cdCountry":"850","nmCountry":"Korea - North (+850)","isoCountry":"kp"}
    ,{"cdCountry":"82","nmCountry":"Korea - South (+82)","isoCountry":"kr"}
    ,{"cdCountry":"965","nmCountry":"Kuwait (+965)","isoCountry":"kw"}
    ,{"cdCountry":"996","nmCountry":"Kyrgyzstan (+996)","isoCountry":"kg"}
    ,{"cdCountry":"856","nmCountry":"Laos (+856)","isoCountry":"la"}
    ,{"cdCountry":"371","nmCountry":"Latvia (+371)","isoCountry":"lv"}
    ,{"cdCountry":"961","nmCountry":"Lebanon (+961)","isoCountry":"lb"}
    ,{"cdCountry":"266","nmCountry":"Lesotho (+266)","isoCountry":"ls"}
    ,{"cdCountry":"231","nmCountry":"Liberia (+231)","isoCountry":"lr"}
    ,{"cdCountry":"218","nmCountry":"Libya (+218)","isoCountry":"ly"}
    ,{"cdCountry":"417","nmCountry":"Liechtenstein (+417)","isoCountry":"li"}
    ,{"cdCountry":"370","nmCountry":"Lithuania (+370)","isoCountry":"lt"}
    ,{"cdCountry":"352","nmCountry":"Luxembourg (+352)","isoCountry":"lu"}
    ,{"cdCountry":"853","nmCountry":"Macao (+853)","isoCountry":"mo"}
    ,{"cdCountry":"389","nmCountry":"Macedonia (+389)","isoCountry":"mk"}
    ,{"cdCountry":"261","nmCountry":"Madagascar (+261)","isoCountry":"mg"}
    ,{"cdCountry":"265","nmCountry":"Malawi (+265)","isoCountry":"mw"}
    ,{"cdCountry":"60","nmCountry":"Malaysia (+60)","isoCountry":"my"}
    ,{"cdCountry":"960","nmCountry":"Maldives (+960)","isoCountry":"mv"}
    ,{"cdCountry":"223","nmCountry":"Mali (+223)","isoCountry":"ml"}
    ,{"cdCountry":"356","nmCountry":"Malta (+356)","isoCountry":"mt"}
    ,{"cdCountry":"692","nmCountry":"Marshall Islands (+692)","isoCountry":"mh"}
    ,{"cdCountry":"596","nmCountry":"Martinique (+596)","isoCountry":"mq"}
    ,{"cdCountry":"222","nmCountry":"Mauritania (+222)","isoCountry":"mr"}
    ,{"cdCountry":"269","nmCountry":"Mayotte (+269)","isoCountry":"mu"}
    ,{"cdCountry":"52","nmCountry":"Mexico (+52)","isoCountry":"mx"}
    ,{"cdCountry":"691","nmCountry":"Micronesia (+691)","isoCountry":"fm"}
    ,{"cdCountry":"373","nmCountry":"Moldova (+373)","isoCountry":"md"}
    ,{"cdCountry":"377","nmCountry":"Monaco (+377)","isoCountry":"mc"}
    ,{"cdCountry":"976","nmCountry":"Mongolia (+976)","isoCountry":"mn"}
    ,{"cdCountry":"382","nmCountry":"Montenegro (+382)","isoCountry":"me"}
    ,{"cdCountry":"1664","nmCountry":"Montserrat (+1664)","isoCountry":"ms"}
    ,{"cdCountry":"212","nmCountry":"Morocco (+212)","isoCountry":"ma"}
    ,{"cdCountry":"258","nmCountry":"Mozambique (+258)","isoCountry":"mz"}
    ,{"cdCountry":"95","nmCountry":"Myanmar (+95)","isoCountry":"mm"}
    ,{"cdCountry":"264","nmCountry":"Namibia (+264)","isoCountry":"na"}
    ,{"cdCountry":"674","nmCountry":"Nauru (+674)","isoCountry":"nr"}
    ,{"cdCountry":"977","nmCountry":"Nepal (+977)","isoCountry":"np"}
    ,{"cdCountry":"31","nmCountry":"Netherlands (+31)","isoCountry":"nl"}
    ,{"cdCountry":"687","nmCountry":"New Caledonia (+687)","isoCountry":"nc"}
    ,{"cdCountry":"505","nmCountry":"Nicaragua (+505)","isoCountry":"ni"}
    ,{"cdCountry":"227","nmCountry":"Niger (+227)","isoCountry":"ne"}
    ,{"cdCountry":"234","nmCountry":"Nigeria (+234)","isoCountry":"ng"}
    ,{"cdCountry":"683","nmCountry":"Niue (+683)","isoCountry":"nu"}
    ,{"cdCountry":"672","nmCountry":"Norfolk Islands (+672)","isoCountry":"nf"}
    ,{"cdCountry":"670","nmCountry":"Northern Marianas (+670)","isoCountry":"mp"}
    ,{"cdCountry":"47","nmCountry":"Norway (+47)","isoCountry":"no"}
    ,{"cdCountry":"968","nmCountry":"Oman (+968)","isoCountry":"om"}
    ,{"cdCountry":"92","nmCountry":"Pakistan (+92)","isoCountry":"pk"}
    ,{"cdCountry":"680","nmCountry":"Palau (+680)","isoCountry":"pw"}
    ,{"cdCountry":"507","nmCountry":"Panama (+507)","isoCountry":"pa"}
    ,{"cdCountry":"675","nmCountry":"Papua New Guinea (+675)","isoCountry":"pg"}
    ,{"cdCountry":"595","nmCountry":"Paraguay (+595)","isoCountry":"py"}
    ,{"cdCountry":"51","nmCountry":"Peru (+51)","isoCountry":"pe"}
    ,{"cdCountry":"63","nmCountry":"Philippines (+63)","isoCountry":"ph"}
    ,{"cdCountry":"48","nmCountry":"Poland (+48)","isoCountry":"pl"}
    ,{"cdCountry":"351","nmCountry":"Portugal (+351)","isoCountry":"pt"}
    ,{"cdCountry":"1787","nmCountry":"Puerto Rico (+1787)","isoCountry":"pr"}
    ,{"cdCountry":"974","nmCountry":"Qatar (+974)","isoCountry":"qa"}
    ,{"cdCountry":"262","nmCountry":"Reunion (+262)","isoCountry":"cg"}
    ,{"cdCountry":"40","nmCountry":"Romania (+40)","isoCountry":"ro"}
    ,{"cdCountry":"7","nmCountry":"Russia (+7)","isoCountry":"ru"}
    ,{"cdCountry":"250","nmCountry":"Rwanda (+250)","isoCountry":"rw"}
    ,{"cdCountry":"378","nmCountry":"San Marino (+378)","isoCountry":"sm"}
    ,{"cdCountry":"239","nmCountry":"Sao Tome &amp; Principe (+239)","isoCountry":"st"}
    ,{"cdCountry":"966","nmCountry":"Saudi Arabia (+966)","isoCountry":"sa"}
    ,{"cdCountry":"221","nmCountry":"Senegal (+221)","isoCountry":"sn"}
    ,{"cdCountry":"381","nmCountry":"Serbia (+381)","isoCountry":"rs"}
    ,{"cdCountry":"248","nmCountry":"Seychelles (+248)","isoCountry":"sc"}
    ,{"cdCountry":"232","nmCountry":"Sierra Leone (+232)","isoCountry":"sl"}
    ,{"cdCountry":"65","nmCountry":"Singapore (+65)","isoCountry":"sg"}
    ,{"cdCountry":"421","nmCountry":"Slovak Republic (+421)","isoCountry":"sk"}
    ,{"cdCountry":"386","nmCountry":"Slovenia (+386)","isoCountry":"sl"}
    ,{"cdCountry":"677","nmCountry":"Solomon Islands (+677)","isoCountry":"sb"}
    ,{"cdCountry":"252","nmCountry":"Somalia (+252)","isoCountry":"so"}
    ,{"cdCountry":"27","nmCountry":"South Africa (+27)","isoCountry":"za"}
    ,{"cdCountry":"34","nmCountry":"Spain (+34)","isoCountry":"es"}
    ,{"cdCountry":"94","nmCountry":"Sri Lanka (+94)","isoCountry":"lk"}
    ,{"cdCountry":"290","nmCountry":"St. Helena (+290)","isoCountry":"sh"}
    ,{"cdCountry":"1869","nmCountry":"St. Kitts (+1869)","isoCountry":"kn"}
    ,{"cdCountry":"1758","nmCountry":"St. Lucia (+1758)","isoCountry":"lc"}
    ,{"cdCountry":"597","nmCountry":"Suriname (+597)","isoCountry":"sr"}
    ,{"cdCountry":"249","nmCountry":"Sudan (+249)","isoCountry":"sd"}
    ,{"cdCountry":"268","nmCountry":"Swaziland (+268)","isoCountry":"sz"}
    ,{"cdCountry":"46","nmCountry":"Sweden (+46)","isoCountry":"se"}
    ,{"cdCountry":"41","nmCountry":"Switzerland (+41)","isoCountry":"ch"}
    ,{"cdCountry":"963","nmCountry":"Syria (+963)","isoCountry":"sy"}
    ,{"cdCountry":"886","nmCountry":"Taiwan (+886)","isoCountry":"tw"}
    ,{"cdCountry":"992","nmCountry":"Tajikistan (+992)","isoCountry":"tj"}
    ,{"cdCountry":"66","nmCountry":"Thailand (+66)","isoCountry":"th"}
    ,{"cdCountry":"228","nmCountry":"Togo (+228)","isoCountry":"tg"}
    ,{"cdCountry":"676","nmCountry":"Tonga (+676)","isoCountry":"to"}
    ,{"cdCountry":"1868","nmCountry":"Trinidad &amp; Tobago (+1868)","isoCountry":"tt"}
    ,{"cdCountry":"216","nmCountry":"Tunisia (+216)","isoCountry":"tn"}
    ,{"cdCountry":"90","nmCountry":"Turkey (+90)","isoCountry":"tr"}
    ,{"cdCountry":"993","nmCountry":"Turkmenistan (+993)","isoCountry":"tm"}
    ,{"cdCountry":"1649","nmCountry":"Turks &amp; Caicos Islands (+1649)","isoCountry":"tc"}
    ,{"cdCountry":"688","nmCountry":"Tuvalu (+688)","isoCountry":"tv"}
    ,{"cdCountry":"256","nmCountry":"Uganda (+256)","isoCountry":"ug"}
    ,{"cdCountry":"380","nmCountry":"Ukraine (+380)","isoCountry":"ua"}
    ,{"cdCountry":"971","nmCountry":"United Arab Emirates (+971)","isoCountry":"ae"}
    ,{"cdCountry":"598","nmCountry":"Uruguay (+598)","isoCountry":"uy"}
    ,{"cdCountry":"998","nmCountry":"Uzbekistan (+998)","isoCountry":"uz"}
    ,{"cdCountry":"678","nmCountry":"Vanuatu (+678)","isoCountry":"vu"}
    ,{"cdCountry":"379","nmCountry":"Vatican City (+379)","isoCountry":"va"}
    ,{"cdCountry":"58","nmCountry":"Venezuela (+58)","isoCountry":"ve"}
    ,{"cdCountry":"84","nmCountry":"Vietnam (+84)","isoCountry":"vn"}
    ,{"cdCountry":"1","nmCountry":"Virgin Islands - British (+1)","isoCountry":"vg"}
    ,{"cdCountry":"1","nmCountry":"Virgin Islands - US (+1)","isoCountry":"vi"}
    ,{"cdCountry":"681","nmCountry":"Wallis &amp; Futuna (+681)","isoCountry":"wf"}
    ,{"cdCountry":"969","nmCountry":"Yemen (North)(+969)","isoCountry":"ye"}
    ,{"cdCountry":"967","nmCountry":"Yemen (South)(+967)","isoCountry":"ye"}
    ,{"cdCountry":"260","nmCountry":"Zambia (+260)","isoCountry":"zm"}
    ,{"cdCountry":"263","nmCountry":"Zimbabwe (+263)","isoCountry":"zw"}
    ];
module.exports = {Ddi}