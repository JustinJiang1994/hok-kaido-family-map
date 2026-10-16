const PLACES=[];
function add(id,name,city,type,lat,lon,days,desc,status,detail,url,phone='',budget=''){PLACES.push({id,name,city,type,lat,lon,days,desc,status,detail,url,phone,budget});}
add('odori','大通公园 · 圣诞市集','札幌','sight',43.060,141.353,[17,18],'木屋、灯串与电视塔，旅程的圣诞主场。','计划景点','2026年11月20日—12月25日，11:00—21:00。市集与札幌、慕尼黑的姐妹城市关系有关，2002年开始举办。','https://www.sapporo.travel/white-illumination/event/munich/');
add('shiroi','白色恋人公园','札幌','sight',43.088,141.271,[18],'甜点、欧式庭院与50周年爱心灯饰。','计划景点','2026年12月1日开始冬季灯饰，延长营业至19:00。付费参观与手作体验有各自的截止时间，需另查预约。建议留2—3小时。','https://www.shiroikoibitopark.jp/christmas/');
add('shrine','北海道神宫','札幌','sight',43.054,141.308,[18],'白雪参道与树林，给城市行程留一点安静。','计划景点','目前11—12月常规开放至16:00，排在白天。附近是圆山公园。','https://www.sapporo.travel/spot/facility/hokkaido_shrine/');
add('red','红砖厅舍','札幌','sight',43.064,141.347,[19],'红砖与白雪，北海道历史的一扇窗。','顺路候选','旧北海道厅建于1888年，可以寻找建筑里的五稜星装饰。馆内介绍北海道历史与阿伊努文化，靠近札幌站。','https://www.sapporo.travel/spot/facility/former_hokkaido_government_office/');
add('clock','札幌钟楼','札幌','sight',43.063,141.353,[18,19],'原本是札幌农学校演武场的小建筑。','顺路候选','札幌农学校后来发展为北海道大学。钟楼适合短暂停留。','https://www.sapporo.travel/spot/facility/clock_tower/');
add('t38','JR Tower T38','札幌','sight',43.068,141.352,[17,19],'在温暖的室内，俯瞰棋盘般的城市。','顺路候选','札幌站直连展望室，适合抵达较早的首晚。与电视塔、藻岩山三选一即可，视天气与体力决定。','https://www.jr-tower.com/t38');
add('tv','札幌电视塔','札幌','sight',43.061,141.357,[18],'俯看大通公园与冬季灯饰。','顺路候选','逛市集时可追加展望台，不必为观景点来回穿城。','https://www.sapporo.travel/spot/facility/sapporo_tv_tower/');
add('zoo','旭山动物园','旭川','sight',43.768,142.480,[20],'企鹅、海豹与北极熊，这一天的主角。','计划景点','企鹅散步需要足够积雪，12月20日尚不能保证。建议留4小时左右，并在园内休息吃饭。','https://www.city.asahikawa.hokkaido.jp/asahiyamazoo/generalinformation/d075901.html');
add('otok','男山酒造资料馆','旭川','sight',43.797,142.399,[20],'从传统器具与浮世绘认识酿酒文化。','体力允许再加','位于动物园与市区之间的另一方向，只有提前结束时才考虑。资料馆与试饮商店不同；驾车者不试饮。','https://www.otokoyama.com/museum/');
add('science','科学馆 サイパル','旭川','sight',43.756,142.372,[20],'互动科学与室内亲子备用。','周一休馆','可作20日天气差时的候选；2026年12月21日休馆，不能用作美瑛当天的默认替代。','https://www.city.asahikawa.hokkaido.jp/science/06/p002414.html');
add('blue','白金青池','美瑛','sight',43.494,142.614,[21],'冰雪与树影，等待16:30的灯光。','16:30后','本季12月灯光16:30—21:00，约15分钟一轮变化。冬季可能看不到蓝色水面；不是夏季照片中的景观。','https://www.town.biei.hokkaido.jp/culture/event/illuminate.html');
add('falls','白须瀑布','美瑛','sight',43.474,142.639,[21],'白色瀑布从岩壁涌出，落入蓝色河谷。','白天优先','在桥上观景，不需走入河谷。它是地下水涌出的潜流瀑；建议自然光下先看，再去青池灯光。','https://www.biei-hokkaido.jp/en/tourist-spot');
add('tree','圣诞树之木','美瑛','sight',43.552,142.447,[21],'一棵孤树与大片雪原留白。','管制需复核','当前旅游协会有树前道路步行观景管制说明。出发前查停车入口；周围农地即使覆雪也不能进入。','https://www.biei-hokkaido.jp/en/facility/christmas-tree');
add('ken','Ken & Mary 之木','美瑛','sight',43.611,142.455,[21],'因1972年日产Skyline广告而得名的白杨。','可选树景','与七星之树择重点，不必集齐所有树。坐标为景区附近示意；按允许停车与观景位置活动。','https://www.biei-hokkaido.jp/en/facility/ken-merry-tree');
add('seven','七星之树','美瑛','sight',43.634,142.454,[21],'树与起伏的丘陵，美瑛北部的远景。','除雪道路需复核','往年部分接近道路冬季不除雪，不能套用夏季导航。若路况不合适就跳过。','https://www.biei-hokkaido.jp/ja/23634');
add('shiki','四季彩之丘','美瑛','sight',43.530,142.465,[21],'羊驼与雪上活动，让孩子也有参与感。','雪上项目待定','冬季项目以积雪和年龄条件为准，12月21日是否开放需复核。和纯摄影景点取舍，避免一天过满。','https://www.biei-hokkaido.jp/ja/facility/shikisai-no-oka-flower-park-winter');
const HUBS=[['札幌',43.062,141.354],['旭川',43.771,142.365],['美瑛',43.591,142.461],['新千岁机场',42.787,141.681]];
const REGIONS={all:[139.1,41.3,145.9,45.8],route:[140.9,42.55,143,44.05],sapporo:[141.25,43.035,141.395,43.105],asahikawa:[142.32,43.735,142.51,43.82],biei:[142.38,43.43,142.70,43.66],airport:[141.673,42.781,141.691,42.795]};
const GEONOTES={all:'北海道在日本北部。这次走中西部，而不是环岛：札幌是城市停留点，旭川是动物园与美瑛的住宿基地。灰色城市仅作方位参照。',route:'札幌到旭川向东北；美瑛在旭川以南。返程机场在札幌东南，离旭川并不近。连线只帮助理解方向，不代表道路、车程或航线。',sapporo:'白色恋人公园在市区西北侧，神宫在西侧；札幌站、钟楼、大通和薄野较集中。啤酒园在市中心东北侧，需要额外往返。',asahikawa:'动物园在旭川市区东面，餐厅大多集中在车站北侧。冬天留足市区与动物园之间的转场时间。',biei:'丘陵与树景多在美瑛镇周围；青池、白须瀑布在东南方的白金地区。白须瀑布更靠山，适合先看白天景色再返回青池看灯。',airport:'机场餐厅标记仅表示航站楼附近，不代表楼层和具体入口。所列逛吃点主要在国内线安检外，国际线返程需另外留出转场时间。'};

add("unimuseum","北海道大学综合博物馆","札幌","sight",43.0726,141.342,[],"走进大学里的免费博物馆，从巨大骨架和标本认识北海道的自然与研究。","补充景点","照片为馆舍资料图，不代表12月积雪情况。","https://www.sapporo.travel/spot/facility/hokkaido_university_museum/");
add("beer","札幌啤酒博物馆","札幌","sight",43.0713,141.3686,[],"在红砖建筑里了解札幌啤酒与北海道近代产业的故事。","补充景点","儿童及驾驶者不饮酒。照片是该博物馆资料图，季节布置可能变化。","https://www.sapporobeer.jp/brewery/s_museum/kengaku/");
add("moiwa","藻岩山山顶展望台","札幌","sight",43.022,141.3226,[],"从海拔531米的山顶，看札幌的灯光铺向石狩平原。","补充景点","夜景为官方资料照片；实际能见度和积雪以当天为准。","https://www.sapporo.travel/night-view-guide/spot/moiwayama/");
add("tokiwa","常磐公园","旭川","sight",43.7759,142.3581,[],"旭川市中心的老公园，把树木、池塘和城市文化设施连在一起。","补充景点","配图为非冬季实景，用来认识园区形态；12月通常不是照片中的绿地状态。","https://www.asahikawa-park.or.jp/park/synthesis/tokiwa.html");
add("kitasaito","北彩都花园","旭川","sight",43.7591,142.363,[],"旭川站南侧的河畔花园，在车站附近就能看见开阔的城市自然。","补充景点","配图为非冬季花园资料图；冰雪项目开放情况不作保证。","https://asahikawa-park.or.jp/kitasaito/");
add("hokusei","北西之丘展望公园","美瑛","sight",43.6057,142.4573,[],"以金字塔形展望台闻名的丘陵公园，可认识美瑛镇北侧的田园地形。","补充景点","这是季节限制明显的景点，12月不作为保证可上塔的景点。照片与当天雪况不同。","https://www.biei-hokkaido.jp/ja/facility/hokusei-no-oka");
add("takushin","拓真馆","美瑛","sight",43.529872,142.489253,[],"在摄影作品里看懂美瑛的四季，也理解眼前的雪原为何让人着迷。","补充景点","配图为本期展览宣传图，含摄影作品，不是展厅现场照片。","https://www.biei-hokkaido.jp/ja/27074");
