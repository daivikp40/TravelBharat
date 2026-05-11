// Tourist places data for all states - inspired by gujarattourism.com style
const U = 'https://images.unsplash.com/photo-';
const S = '?w=800&q=80';
export const TOURIST_PLACES = {
  gujarat: [
    { id:'gj1', name:'Rann of Kutch', city:'Kutch', cat:'Nature', desc:'White salt desert stretching endlessly under starlit skies. The Rann Utsav festival transforms this into a cultural extravaganza.', best:'Oct–Feb', images:[`${U}1524492707947-54b2bb40a516${S}`,`${U}1582461798637-37b56a05c2db${S}`,`${U}1546961342-ea5f62d7f712${S}`] },
    { id:'gj2', name:'Gir National Park', city:'Junagadh', cat:'Nature', desc:'Last abode of the Asiatic Lion. Witness majestic lions in their natural habitat amid teak forests.', best:'Dec–Mar', images:[`${U}1587474260584-136574528ed5${S}`,`${U}1546961342-ea5f62d7f712${S}`] },
    { id:'gj3', name:'Somnath Temple', city:'Veraval', cat:'Religious', desc:'One of the 12 Jyotirlingas, this magnificent temple has been rebuilt multiple times through history.', best:'Oct–Mar', images:[`${U}1582510003544-4d00b7f74220${S}`,`${U}1564507592333-c60657eea523${S}`] },
    { id:'gj4', name:'Dwarka', city:'Dwarka', cat:'Religious', desc:'Ancient kingdom of Lord Krishna. Dwarkadhish Temple stands as a monument to devotion and architecture.', best:'Oct–Mar', images:[`${U}1564507592333-c60657eea523${S}`,`${U}1582510003544-4d00b7f74220${S}`] },
    { id:'gj5', name:'Statue of Unity', city:'Kevadia', cat:'Heritage', desc:'World\'s tallest statue at 182m, a tribute to Sardar Vallabhbhai Patel with breathtaking valley views.', best:'Oct–Feb', images:[`${U}1524492707947-54b2bb40a516${S}`,`${U}1546961342-ea5f62d7f712${S}`] },
    { id:'gj6', name:'Rani ki Vav', city:'Patan', cat:'Heritage', desc:'UNESCO World Heritage stepwell with 800+ sculptures. A masterpiece of Solanki dynasty craftsmanship.', best:'Oct–Mar', images:[`${U}1582461798637-37b56a05c2db${S}`,`${U}1524492707947-54b2bb40a516${S}`] },
    { id:'gj7', name:'Mandvi Beach', city:'Kutch', cat:'Nature', desc:'Pristine beach with windmill farms and the Vijay Vilas Palace nearby. Perfect for sunset views.', best:'Nov–Feb', images:[`${U}1512343879784-a960bf40e7f2${S}`,`${U}1582461798637-37b56a05c2db${S}`] },
    { id:'gj8', name:'Saputara', city:'Dang', cat:'Adventure', desc:'Gujarat\'s only hill station nestled in the Sahyadri range. Boating, trekking, and misty mornings.', best:'Jul–Mar', images:[`${U}1506905925346-21bda4d32df4${S}`,`${U}1558618666-fcd25c85cd64${S}`] },
  ],
  rajasthan: [
    { id:'rj1', name:'Amber Fort', city:'Jaipur', cat:'Heritage', desc:'Majestic hilltop fort blending Hindu and Mughal architecture. Elephant rides and light shows enchant visitors.', best:'Oct–Mar', images:[`${U}1599661046289-e31897846e41${S}`,`${U}1477587458883-47145ed32a1a${S}`,`${U}1561361058-c24e614dd530${S}`] },
    { id:'rj2', name:'Hawa Mahal', city:'Jaipur', cat:'Heritage', desc:'Palace of Winds with 953 honeycomb windows. Iconic pink sandstone facade of the Pink City.', best:'Oct–Mar', images:[`${U}1599661046289-e31897846e41${S}`,`${U}1586077424050-17d06a1b4ffd${S}`] },
    { id:'rj3', name:'Thar Desert', city:'Jaisalmer', cat:'Adventure', desc:'Golden sand dunes, camel safaris, and desert camping under a million stars.', best:'Oct–Feb', images:[`${U}1477587458883-47145ed32a1a${S}`,`${U}1586077424050-17d06a1b4ffd${S}`] },
    { id:'rj4', name:'Lake Pichola', city:'Udaipur', cat:'Nature', desc:'Romantic lake surrounded by palaces, ghats and hills. Lake Palace appears to float on water.', best:'Sep–Mar', images:[`${U}1561361058-c24e614dd530${S}`,`${U}1599661046289-e31897846e41${S}`] },
    { id:'rj5', name:'Ranthambore', city:'Sawai Madhopur', cat:'Nature', desc:'Tiger reserve where you can spot Royal Bengal Tigers amid ancient ruins.', best:'Oct–Jun', images:[`${U}1586077424050-17d06a1b4ffd${S}`,`${U}1477587458883-47145ed32a1a${S}`] },
    { id:'rj6', name:'Pushkar', city:'Pushkar', cat:'Religious', desc:'Sacred town with Brahma Temple and holy lake. The Pushkar Camel Fair is world-famous.', best:'Oct–Mar', images:[`${U}1599661046289-e31897846e41${S}`,`${U}1561361058-c24e614dd530${S}`] },
  ],
  kerala: [
    { id:'kl1', name:'Alleppey Backwaters', city:'Alappuzha', cat:'Nature', desc:'Cruise on traditional houseboats through serene backwater canals lined with coconut palms.', best:'Sep–Mar', images:[`${U}1602216056096-3b40cc0c9944${S}`,`${U}1593693411515-c20261bcad6e${S}`,`${U}1567157577867-05ccb1388e66${S}`] },
    { id:'kl2', name:'Munnar', city:'Idukki', cat:'Nature', desc:'Rolling tea plantations, misty peaks, and cool mountain air. South India\'s most popular hill station.', best:'Sep–May', images:[`${U}1609789515136-5d02aa74c7ff${S}`,`${U}1602216056096-3b40cc0c9944${S}`] },
    { id:'kl3', name:'Wayanad', city:'Wayanad', cat:'Adventure', desc:'Lush green district with wildlife sanctuaries, ancient caves, and spice plantations.', best:'Oct–May', images:[`${U}1593693411515-c20261bcad6e${S}`,`${U}1567157577867-05ccb1388e66${S}`] },
    { id:'kl4', name:'Kovalam Beach', city:'Trivandrum', cat:'Nature', desc:'Crescent-shaped beach with lighthouse views. Perfect for Ayurvedic retreats and swimming.', best:'Sep–Mar', images:[`${U}1567157577867-05ccb1388e66${S}`,`${U}1602216056096-3b40cc0c9944${S}`] },
    { id:'kl5', name:'Periyar Wildlife', city:'Thekkady', cat:'Nature', desc:'Boat safaris to spot elephants, deer and rare birds in this tiger reserve.', best:'Sep–Mar', images:[`${U}1609789515136-5d02aa74c7ff${S}`,`${U}1593693411515-c20261bcad6e${S}`] },
  ],
  goa: [
    { id:'go1', name:'Baga Beach', city:'North Goa', cat:'Nature', desc:'Vibrant beach with water sports, shacks, and legendary nightlife. Goa\'s most popular beach.', best:'Nov–Feb', images:[`${U}1512343879784-a960bf40e7f2${S}`,`${U}1582719508461-905c673771fd${S}`,`${U}1587922546307-776227941871${S}`] },
    { id:'go2', name:'Dudhsagar Falls', city:'South Goa', cat:'Adventure', desc:'Spectacular four-tiered waterfall cascading from 310m. Trek through dense forest to reach it.', best:'Jun–Sep', images:[`${U}1614082242765-7c98ca0f3df3${S}`,`${U}1587922546307-776227941871${S}`] },
    { id:'go3', name:'Basilica of Bom Jesus', city:'Old Goa', cat:'Heritage', desc:'UNESCO World Heritage church holding remains of St. Francis Xavier. Portuguese baroque architecture.', best:'Oct–Mar', images:[`${U}1582719508461-905c673771fd${S}`,`${U}1512343879784-a960bf40e7f2${S}`] },
    { id:'go4', name:'Palolem Beach', city:'South Goa', cat:'Nature', desc:'Crescent-shaped beach with calm waters, perfect for kayaking and dolphin spotting.', best:'Nov–Mar', images:[`${U}1587922546307-776227941871${S}`,`${U}1512343879784-a960bf40e7f2${S}`] },
  ],
  himachal: [
    { id:'hp1', name:'Manali', city:'Kullu', cat:'Adventure', desc:'Gateway to Rohtang Pass and Solang Valley. Skiing, paragliding, and river rafting paradise.', best:'Mar–Jun', images:[`${U}1558618666-fcd25c85cd64${S}`,`${U}1508193638397-1c4234db14d8${S}`,`${U}1626016636312-93b024cfc4b3${S}`] },
    { id:'hp2', name:'Shimla', city:'Shimla', cat:'Heritage', desc:'Former British summer capital. Colonial architecture, Mall Road, and toy train rides.', best:'Mar–Jun', images:[`${U}1571619574538-28c47b75e18a${S}`,`${U}1558618666-fcd25c85cd64${S}`] },
    { id:'hp3', name:'Dharamshala', city:'Kangra', cat:'Religious', desc:'Home of the Dalai Lama. Tibetan monasteries, cricket stadium with mountain backdrop.', best:'Mar–Jun', images:[`${U}1626016636312-93b024cfc4b3${S}`,`${U}1508193638397-1c4234db14d8${S}`] },
    { id:'hp4', name:'Kasol', city:'Kullu', cat:'Adventure', desc:'Mini Israel of India. Backpacker paradise with Parvati Valley treks and hot springs.', best:'Mar–Jun', images:[`${U}1508193638397-1c4234db14d8${S}`,`${U}1558618666-fcd25c85cd64${S}`] },
  ],
  tamilnadu: [
    { id:'tn1', name:'Meenakshi Temple', city:'Madurai', cat:'Religious', desc:'Ancient temple with 14 colorful gopurams covered in thousands of mythological sculptures.', best:'Oct–Mar', images:[`${U}1582510003544-4d00b7f74220${S}`,`${U}1558618047-3c8c76ca7d13${S}`,`${U}1583316174775-bd6dc2d2b2f4${S}`] },
    { id:'tn2', name:'Ooty', city:'Nilgiris', cat:'Nature', desc:'Queen of Hill Stations. Botanical gardens, tea estates, and Nilgiri mountain railway.', best:'Oct–Jun', images:[`${U}1564501049412-61c2a3083791${S}`,`${U}1558618047-3c8c76ca7d13${S}`] },
    { id:'tn3', name:'Marina Beach', city:'Chennai', cat:'Nature', desc:'Second longest urban beach in the world. Iconic lighthouse and evening food stalls.', best:'Nov–Feb', images:[`${U}1583316174775-bd6dc2d2b2f4${S}`,`${U}1582510003544-4d00b7f74220${S}`] },
    { id:'tn4', name:'Mahabalipuram', city:'Kanchipuram', cat:'Heritage', desc:'UNESCO site with 7th-century rock-cut temples and Shore Temple facing the Bay of Bengal.', best:'Oct–Mar', images:[`${U}1558618047-3c8c76ca7d13${S}`,`${U}1564501049412-61c2a3083791${S}`] },
  ],
  'jammu-kashmir': [
    { id:'jk1', name:'Dal Lake', city:'Srinagar', cat:'Nature', desc:'Jewel of Srinagar. Shikara rides, floating markets, and houseboats surrounded by mountains.', best:'Apr–Oct', images:[`${U}1566837945700-30057527ade0${S}`,`${U}1601932893038-3eb57ccfc01e${S}`,`${U}1583412121-f6e8413e9e7c${S}`] },
    { id:'jk2', name:'Gulmarg', city:'Baramulla', cat:'Adventure', desc:'Meadow of flowers turned ski resort. World\'s highest gondola ride with Himalayan panoramas.', best:'Dec–Mar', images:[`${U}1539768942893-daf0f5bb9e5f${S}`,`${U}1566837945700-30057527ade0${S}`] },
    { id:'jk3', name:'Pahalgam', city:'Anantnag', cat:'Nature', desc:'Valley of Shepherds. Base camp for Amarnath Yatra with stunning Lidder River views.', best:'Apr–Oct', images:[`${U}1601932893038-3eb57ccfc01e${S}`,`${U}1583412121-f6e8413e9e7c${S}`] },
    { id:'jk4', name:'Sonamarg', city:'Ganderbal', cat:'Nature', desc:'Meadow of Gold. Gateway to Thajiwas Glacier with fields of wildflowers.', best:'May–Oct', images:[`${U}1583412121-f6e8413e9e7c${S}`,`${U}1539768942893-daf0f5bb9e5f${S}`] },
  ],
  maharashtra: [
    { id:'mh1', name:'Gateway of India', city:'Mumbai', cat:'Heritage', desc:'Iconic arch monument overlooking the Arabian Sea. Symbol of Mumbai built in 1924.', best:'Oct–Feb', images:[`${U}1570168007204-dfb528c6958f${S}`,`${U}1529253355930-ddbe423a2ac7${S}`,`${U}1562979314-bee7453e911c${S}`] },
    { id:'mh2', name:'Ajanta Caves', city:'Aurangabad', cat:'Heritage', desc:'UNESCO Buddhist cave monuments with stunning 2nd-century frescoes and sculptures.', best:'Oct–Mar', images:[`${U}1601000938259-4d14e97ebc7c${S}`,`${U}1562979314-bee7453e911c${S}`] },
    { id:'mh3', name:'Lonavala', city:'Pune', cat:'Nature', desc:'Popular hill station with misty valleys, Bhushi Dam, and ancient Karla-Bhaja caves.', best:'Jun–Feb', images:[`${U}1529253355930-ddbe423a2ac7${S}`,`${U}1570168007204-dfb528c6958f${S}`] },
    { id:'mh4', name:'Mahabaleshwar', city:'Satara', cat:'Nature', desc:'Strawberry capital of India. Venna Lake, sunset points, and ancient temples.', best:'Oct–Jun', images:[`${U}1562979314-bee7453e911c${S}`,`${U}1601000938259-4d14e97ebc7c${S}`] },
  ],
  uttarakhand: [
    { id:'uk1', name:'Rishikesh', city:'Dehradun', cat:'Adventure', desc:'Yoga capital of the world. River rafting, bungee jumping, and Beatles Ashram.', best:'Sep–Jun', images:[`${U}1506905925346-21bda4d32df4${S}`,`${U}1485470733090-0aae1788d5af${S}`,`${U}1544461772-722f2e5f02e5${S}`] },
    { id:'uk2', name:'Haridwar', city:'Haridwar', cat:'Religious', desc:'Gateway to Gods. Evening Ganga Aarti at Har Ki Pauri is a mesmerizing spiritual experience.', best:'Oct–Mar', images:[`${U}1597077662418-e36c7c7b8d1d${S}`,`${U}1506905925346-21bda4d32df4${S}`] },
    { id:'uk3', name:'Kedarnath', city:'Rudraprayag', cat:'Religious', desc:'One of the Char Dham. Ancient Shiva temple at 3,583m surrounded by snow-capped peaks.', best:'May–Jun', images:[`${U}1544461772-722f2e5f02e5${S}`,`${U}1485470733090-0aae1788d5af${S}`] },
    { id:'uk4', name:'Auli', city:'Chamoli', cat:'Adventure', desc:'India\'s premier ski destination with panoramic views of Nanda Devi peak.', best:'Nov–Mar', images:[`${U}1485470733090-0aae1788d5af${S}`,`${U}1597077662418-e36c7c7b8d1d${S}`] },
  ],
  'west-bengal': [
    { id:'wb1', name:'Darjeeling', city:'Darjeeling', cat:'Nature', desc:'Queen of Hills. Toy train, tea gardens, and views of Kanchenjunga at sunrise.', best:'Oct–Mar', images:[`${U}1587474260584-136574528ed5${S}`,`${U}1558431382-27e303142255${S}`] },
    { id:'wb2', name:'Sundarbans', city:'South 24 Parganas', cat:'Nature', desc:'Largest mangrove forest. Home to Royal Bengal Tigers. Boat safaris through tidal waterways.', best:'Sep–Mar', images:[`${U}1591014661313-bf5e15ad0b7e${S}`,`${U}1523978591478-c753949ff840${S}`] },
    { id:'wb3', name:'Victoria Memorial', city:'Kolkata', cat:'Heritage', desc:'Magnificent marble monument dedicated to Queen Victoria. Museum with Mughal-era art.', best:'Oct–Mar', images:[`${U}1558431382-27e303142255${S}`,`${U}1587474260584-136574528ed5${S}`] },
  ],
  karnataka: [
    { id:'ka1', name:'Hampi', city:'Ballari', cat:'Heritage', desc:'UNESCO ruins of Vijayanagara Empire. Boulder-strewn landscape with 500+ ancient monuments.', best:'Oct–Feb', images:[`${U}1545126520-8d3f5a3a0f9e${S}`,`${U}1606994776600-8a0e484c9f2e${S}`] },
    { id:'ka2', name:'Coorg', city:'Kodagu', cat:'Nature', desc:'Scotland of India. Coffee plantations, Abbey Falls, and misty green hills.', best:'Oct–Mar', images:[`${U}1630415757524-c5df07297a76${S}`,`${U}1593693411515-c20261bcad6e${S}`] },
    { id:'ka3', name:'Mysore Palace', city:'Mysuru', cat:'Heritage', desc:'Indo-Saracenic marvel illuminated by 97,000 bulbs during Dasara. Royal grandeur at its finest.', best:'Oct–Feb', images:[`${U}1606994776600-8a0e484c9f2e${S}`,`${U}1545126520-8d3f5a3a0f9e${S}`] },
    { id:'ka4', name:'Gokarna', city:'Uttara Kannada', cat:'Nature', desc:'Pristine beaches and ancient temples. More peaceful alternative to Goa for beach lovers.', best:'Oct–Mar', images:[`${U}1593693411515-c20261bcad6e${S}`,`${U}1630415757524-c5df07297a76${S}`] },
  ],
  odisha: [
    { id:'od1', name:'Konark Sun Temple', city:'Puri', cat:'Heritage', desc:'UNESCO chariot-shaped temple dedicated to Sun God. Architectural marvel of 13th century.', best:'Oct–Feb', images:[`${U}1599030374987-64a8deb69085${S}`,`${U}1582296088269-d1c8cef66af0${S}`] },
    { id:'od2', name:'Jagannath Temple', city:'Puri', cat:'Religious', desc:'One of the Char Dham. Annual Rath Yatra draws millions of devotees.', best:'Oct–Mar', images:[`${U}1609259168461-a3012c97ec24${S}`,`${U}1599030374987-64a8deb69085${S}`] },
    { id:'od3', name:'Chilika Lake', city:'Puri', cat:'Nature', desc:'Asia\'s largest brackish water lagoon. Irrawaddy dolphins and migratory bird paradise.', best:'Oct–Mar', images:[`${U}1582296088269-d1c8cef66af0${S}`,`${U}1558618666-fcd25c85cd64${S}`] },
  ],
  punjab: [
    { id:'pb1', name:'Golden Temple', city:'Amritsar', cat:'Religious', desc:'Holiest Sikh shrine shimmering in gold. Free community kitchen serves 100,000+ daily.', best:'Oct–Mar', images:[`${U}1592549585866-486f0d36f4cd${S}`,`${U}1560969184-10fe8719e047${S}`] },
    { id:'pb2', name:'Wagah Border', city:'Amritsar', cat:'Heritage', desc:'Electrifying flag-lowering ceremony at the India-Pakistan border every evening.', best:'Oct–Mar', images:[`${U}1560969184-10fe8719e047${S}`,`${U}1599661046289-e31897846e41${S}`] },
    { id:'pb3', name:'Anandpur Sahib', city:'Rupnagar', cat:'Religious', desc:'Holy city where Khalsa was born. Stunning gurudwaras and annual Hola Mohalla festival.', best:'Oct–Mar', images:[`${U}1582510003544-4d00b7f74220${S}`,`${U}1592549585866-486f0d36f4cd${S}`] },
  ],
  sikkim: [
    { id:'sk1', name:'Tsomgo Lake', city:'East Sikkim', cat:'Nature', desc:'Sacred glacial lake at 3,753m. Changes color with seasons. Yak rides along frozen shores.', best:'Mar–Jun', images:[`${U}1544948503-fa5c8d87e2a0${S}`,`${U}1506905925346-21bda4d32df4${S}`] },
    { id:'sk2', name:'Gangtok', city:'East Sikkim', cat:'Nature', desc:'Capital with panoramic Kanchenjunga views. MG Marg pedestrian street and Buddhist monasteries.', best:'Mar–Jun', images:[`${U}1571619574538-28c47b75e18a${S}`,`${U}1544948503-fa5c8d87e2a0${S}`] },
    { id:'sk3', name:'Pelling', city:'West Sikkim', cat:'Nature', desc:'Gateway to Kanchenjunga. Skywalk bridge, Rabdentse ruins, and monastery visits.', best:'Mar–May', images:[`${U}1558618666-fcd25c85cd64${S}`,`${U}1506905925346-21bda4d32df4${S}`] },
  ],
  'andhra-pradesh': [
    { id:'ap1', name:'Tirupati', city:'Chittoor', cat:'Religious', desc:'Richest temple in the world. Sri Venkateswara Temple atop Tirumala hills draws 50,000+ daily.', best:'Sep–Mar', images:[`${U}1564507592333-c60657eea523${S}`,`${U}1582510003544-4d00b7f74220${S}`] },
    { id:'ap2', name:'Araku Valley', city:'Visakhapatnam', cat:'Nature', desc:'Coffee plantations, tribal culture, and Borra Caves. Train journey through Eastern Ghats.', best:'Oct–Feb', images:[`${U}1587922546307-776227941871${S}`,`${U}1558618047-3c8c76ca7d13${S}`] },
    { id:'ap3', name:'Visakhapatnam', city:'Vizag', cat:'Nature', desc:'City of Destiny. Ramakrishna Beach, submarine museum, and Kailasagiri hilltop park.', best:'Oct–Feb', images:[`${U}1558618047-3c8c76ca7d13${S}`,`${U}1564507592333-c60657eea523${S}`] },
  ],
};
