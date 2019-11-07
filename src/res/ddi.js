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
    ,{"cdCountry":"224","nmCountry":"Guinea (+224)","isoCountry":""}
    ,{"cdCountry":"245","nmCountry":"Guinea - Bissau (+245)","isoCountry":""}
    ,{"cdCountry":"592","nmCountry":"Guyana (+592)","isoCountry":""}
    ,{"cdCountry":"509","nmCountry":"Haiti (+509)","isoCountry":""}
    ,{"cdCountry":"504","nmCountry":"Honduras (+504)","isoCountry":""}
    ,{"cdCountry":"852","nmCountry":"Hong Kong (+852)","isoCountry":""}
    ,{"cdCountry":"36","nmCountry":"Hungary (+36)","isoCountry":""}
    ,{"cdCountry":"354","nmCountry":"Iceland (+354)","isoCountry":""}
    ,{"cdCountry":"91","nmCountry":"India (+91)","isoCountry":""}
    ,{"cdCountry":"62","nmCountry":"Indonesia (+62)","isoCountry":""}
    ,{"cdCountry":"964","nmCountry":"Iraq (+964)","isoCountry":""}
    ,{"cdCountry":"98","nmCountry":"Iran (+98)","isoCountry":""}
    ,{"cdCountry":"353","nmCountry":"Ireland (+353)","isoCountry":""}
    ,{"cdCountry":"972","nmCountry":"Israel (+972)","isoCountry":"il"}
    ,{"cdCountry":"39","nmCountry":"Italy (+39)","isoCountry":"it"}
    ,{"cdCountry":"1876","nmCountry":"Jamaica (+1876)","isoCountry":""}
    ,{"cdCountry":"81","nmCountry":"Japan (+81)","isoCountry":"jp"}
    ,{"cdCountry":"962","nmCountry":"Jordan (+962)","isoCountry":""}
    ,{"cdCountry":"7","nmCountry":"Kazakhstan (+7)","isoCountry":""}
    ,{"cdCountry":"254","nmCountry":"Kenya (+254)","isoCountry":""}
    ,{"cdCountry":"686","nmCountry":"Kiribati (+686)","isoCountry":""}
    ,{"cdCountry":"850","nmCountry":"Korea - North (+850)","isoCountry":""}
    ,{"cdCountry":"82","nmCountry":"Korea - South (+82)","isoCountry":""}
    ,{"cdCountry":"965","nmCountry":"Kuwait (+965)","isoCountry":""}
    ,{"cdCountry":"996","nmCountry":"Kyrgyzstan (+996)","isoCountry":""}
    ,{"cdCountry":"856","nmCountry":"Laos (+856)","isoCountry":""}
    ,{"cdCountry":"371","nmCountry":"Latvia (+371)","isoCountry":""}
    ,{"cdCountry":"961","nmCountry":"Lebanon (+961)","isoCountry":""}
    ,{"cdCountry":"266","nmCountry":"Lesotho (+266)","isoCountry":""}
    ,{"cdCountry":"231","nmCountry":"Liberia (+231)","isoCountry":""}
    ,{"cdCountry":"218","nmCountry":"Libya (+218)","isoCountry":""}
    ,{"cdCountry":"417","nmCountry":"Liechtenstein (+417)","isoCountry":""}
    ,{"cdCountry":"370","nmCountry":"Lithuania (+370)","isoCountry":""}
    ,{"cdCountry":"352","nmCountry":"Luxembourg (+352)","isoCountry":""}
    ,{"cdCountry":"853","nmCountry":"Macao (+853)","isoCountry":""}
    ,{"cdCountry":"389","nmCountry":"Macedonia (+389)","isoCountry":""}
    ,{"cdCountry":"261","nmCountry":"Madagascar (+261)","isoCountry":""}
    ,{"cdCountry":"265","nmCountry":"Malawi (+265)","isoCountry":""}
    ,{"cdCountry":"60","nmCountry":"Malaysia (+60)","isoCountry":""}
    ,{"cdCountry":"960","nmCountry":"Maldives (+960)","isoCountry":""}
    ,{"cdCountry":"223","nmCountry":"Mali (+223)","isoCountry":""}
    ,{"cdCountry":"356","nmCountry":"Malta (+356)","isoCountry":""}
    ,{"cdCountry":"692","nmCountry":"Marshall Islands (+692)","isoCountry":""}
    ,{"cdCountry":"596","nmCountry":"Martinique (+596)","isoCountry":""}
    ,{"cdCountry":"222","nmCountry":"Mauritania (+222)","isoCountry":""}
    ,{"cdCountry":"269","nmCountry":"Mayotte (+269)","isoCountry":""}
    ,{"cdCountry":"52","nmCountry":"Mexico (+52)","isoCountry":"mx"}
    ,{"cdCountry":"691","nmCountry":"Micronesia (+691)","isoCountry":"fm"}
    ,{"cdCountry":"373","nmCountry":"Moldova (+373)","isoCountry":""}
    ,{"cdCountry":"377","nmCountry":"Monaco (+377)","isoCountry":""}
    ,{"cdCountry":"976","nmCountry":"Mongolia (+976)","isoCountry":""}
    ,{"cdCountry":"1664","nmCountry":"Montserrat (+1664)","isoCountry":""}
    ,{"cdCountry":"212","nmCountry":"Morocco (+212)","isoCountry":""}
    ,{"cdCountry":"258","nmCountry":"Mozambique (+258)","isoCountry":""}
    ,{"cdCountry":"95","nmCountry":"Myanmar (+95)","isoCountry":""}
    ,{"cdCountry":"264","nmCountry":"Namibia (+264)","isoCountry":""}
    ,{"cdCountry":"674","nmCountry":"Nauru (+674)","isoCountry":""}
    ,{"cdCountry":"977","nmCountry":"Nepal (+977)","isoCountry":""}
    ,{"cdCountry":"31","nmCountry":"Netherlands (+31)","isoCountry":""}
    ,{"cdCountry":"687","nmCountry":"New Caledonia (+687)","isoCountry":""}
    ,{"cdCountry":"505","nmCountry":"Nicaragua (+505)","isoCountry":""}
    ,{"cdCountry":"227","nmCountry":"Niger (+227)","isoCountry":""}
    ,{"cdCountry":"234","nmCountry":"Nigeria (+234)","isoCountry":""}
    ,{"cdCountry":"683","nmCountry":"Niue (+683)","isoCountry":""}
    ,{"cdCountry":"672","nmCountry":"Norfolk Islands (+672)","isoCountry":""}
    ,{"cdCountry":"670","nmCountry":"Northern Marianas (+670)","isoCountry":""}
    ,{"cdCountry":"47","nmCountry":"Norway (+47)","isoCountry":"no"}
    ,{"cdCountry":"968","nmCountry":"Oman (+968)","isoCountry":""}
    ,{"cdCountry":"92","nmCountry":"Pakistan (+92)","isoCountry":""}
    ,{"cdCountry":"680","nmCountry":"Palau (+680)","isoCountry":""}
    ,{"cdCountry":"507","nmCountry":"Panama (+507)","isoCountry":""}
    ,{"cdCountry":"675","nmCountry":"Papua New Guinea (+675)","isoCountry":""}
    ,{"cdCountry":"595","nmCountry":"Paraguay (+595)","isoCountry":""}
    ,{"cdCountry":"51","nmCountry":"Peru (+51)","isoCountry":""}
    ,{"cdCountry":"63","nmCountry":"Philippines (+63)","isoCountry":""}
    ,{"cdCountry":"48","nmCountry":"Poland (+48)","isoCountry":""}
    ,{"cdCountry":"351","nmCountry":"Portugal (+351)","isoCountry":""}
    ,{"cdCountry":"1787","nmCountry":"Puerto Rico (+1787)","isoCountry":""}
    ,{"cdCountry":"974","nmCountry":"Qatar (+974)","isoCountry":""}
    ,{"cdCountry":"262","nmCountry":"Reunion (+262)","isoCountry":""}
    ,{"cdCountry":"40","nmCountry":"Romania (+40)","isoCountry":""}
    ,{"cdCountry":"7","nmCountry":"Russia (+7)","isoCountry":""}
    ,{"cdCountry":"250","nmCountry":"Rwanda (+250)","isoCountry":""}
    ,{"cdCountry":"378","nmCountry":"San Marino (+378)","isoCountry":""}
    ,{"cdCountry":"239","nmCountry":"Sao Tome &amp; Principe (+239)","isoCountry":""}
    ,{"cdCountry":"966","nmCountry":"Saudi Arabia (+966)","isoCountry":""}
    ,{"cdCountry":"221","nmCountry":"Senegal (+221)","isoCountry":""}
    ,{"cdCountry":"381","nmCountry":"Serbia (+381)","isoCountry":""}
    ,{"cdCountry":"248","nmCountry":"Seychelles (+248)","isoCountry":""}
    ,{"cdCountry":"232","nmCountry":"Sierra Leone (+232)","isoCountry":""}
    ,{"cdCountry":"65","nmCountry":"Singapore (+65)","isoCountry":""}
    ,{"cdCountry":"421","nmCountry":"Slovak Republic (+421)","isoCountry":""}
    ,{"cdCountry":"386","nmCountry":"Slovenia (+386)","isoCountry":""}
    ,{"cdCountry":"677","nmCountry":"Solomon Islands (+677)","isoCountry":""}
    ,{"cdCountry":"252","nmCountry":"Somalia (+252)","isoCountry":""}
    ,{"cdCountry":"27","nmCountry":"South Africa (+27)","isoCountry":""}
    ,{"cdCountry":"34","nmCountry":"Spain (+34)","isoCountry":""}
    ,{"cdCountry":"94","nmCountry":"Sri Lanka (+94)","isoCountry":""}
    ,{"cdCountry":"290","nmCountry":"St. Helena (+290)","isoCountry":""}
    ,{"cdCountry":"1869","nmCountry":"St. Kitts (+1869)","isoCountry":""}
    ,{"cdCountry":"1758","nmCountry":"St. Lucia (+1758)","isoCountry":""}
    ,{"cdCountry":"597","nmCountry":"Suriname (+597)","isoCountry":""}
    ,{"cdCountry":"249","nmCountry":"Sudan (+249)","isoCountry":""}
    ,{"cdCountry":"268","nmCountry":"Swaziland (+268)","isoCountry":""}
    ,{"cdCountry":"46","nmCountry":"Sweden (+46)","isoCountry":""}
    ,{"cdCountry":"41","nmCountry":"Switzerland (+41)","isoCountry":""}
    ,{"cdCountry":"963","nmCountry":"Syria (+963)","isoCountry":""}
    ,{"cdCountry":"886","nmCountry":"Taiwan (+886)","isoCountry":""}
    ,{"cdCountry":"992","nmCountry":"Tajikistan (+992)","isoCountry":""}
    ,{"cdCountry":"66","nmCountry":"Thailand (+66)","isoCountry":""}
    ,{"cdCountry":"228","nmCountry":"Togo (+228)","isoCountry":""}
    ,{"cdCountry":"676","nmCountry":"Tonga (+676)","isoCountry":""}
    ,{"cdCountry":"1868","nmCountry":"Trinidad &amp; Tobago (+1868)","isoCountry":""}
    ,{"cdCountry":"216","nmCountry":"Tunisia (+216)","isoCountry":""}
    ,{"cdCountry":"90","nmCountry":"Turkey (+90)","isoCountry":""}
    ,{"cdCountry":"993","nmCountry":"Turkmenistan (+993)","isoCountry":""}
    ,{"cdCountry":"1649","nmCountry":"Turks &amp; Caicos Islands (+1649)","isoCountry":""}
    ,{"cdCountry":"688","nmCountry":"Tuvalu (+688)","isoCountry":""}
    ,{"cdCountry":"256","nmCountry":"Uganda (+256)","isoCountry":""}
    ,{"cdCountry":"380","nmCountry":"Ukraine (+380)","isoCountry":""}
    ,{"cdCountry":"971","nmCountry":"United Arab Emirates (+971)","isoCountry":""}
    ,{"cdCountry":"598","nmCountry":"Uruguay (+598)","isoCountry":"uy"}
    ,{"cdCountry":"998","nmCountry":"Uzbekistan (+998)","isoCountry":""}
    ,{"cdCountry":"678","nmCountry":"Vanuatu (+678)","isoCountry":""}
    ,{"cdCountry":"379","nmCountry":"Vatican City (+379)","isoCountry":""}
    ,{"cdCountry":"58","nmCountry":"Venezuela (+58)","isoCountry":""}
    ,{"cdCountry":"84","nmCountry":"Vietnam (+84)","isoCountry":""}
    ,{"cdCountry":"1","nmCountry":"Virgin Islands - British (+1)","isoCountry":""}
    ,{"cdCountry":"1","nmCountry":"Virgin Islands - US (+1)","isoCountry":""}
    ,{"cdCountry":"681","nmCountry":"Wallis &amp; Futuna (+681)","isoCountry":""}
    ,{"cdCountry":"969","nmCountry":"Yemen (North)(+969)","isoCountry":""}
    ,{"cdCountry":"967","nmCountry":"Yemen (South)(+967)","isoCountry":""}
    ,{"cdCountry":"260","nmCountry":"Zambia (+260)","isoCountry":""}
    ,{"cdCountry":"263","nmCountry":"Zimbabwe (+263)","isoCountry":""}
    ];
module.exports = {Ddi}