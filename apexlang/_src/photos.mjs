// The photos of the starter websites: Static Application Files under website-studio/img/.
// tools/fetch-photos.mjs downloads them from Unsplash (Unsplash License: free to use, copy, modify and distribute,
// no attribution required; not to be sold unaltered or compiled into a competing photo service), resizes them on the
// Unsplash CDN and writes docs/CREDITS.md. Each entry lists alternative photo ids, tried in order.
// w: width (heroes 1440, cards 800, people 600); h: height for a fixed crop. alt describes the first id's photo.
const P = (file, w, h, alt, ...ids) => ({ file: "website-studio/img/" + file + ".jpg", w, h, alt, ids });
export const PHOTOS = [
    // Halcyon - design studio
    P("studio-hero-1", 1440, 900, "Designers working on laptops around a table", "photo-1522071820081-009f0129c71c", "photo-1531403009284-440f080d1e12"),
    P("studio-hero-2", 1440, 900, "A long, bright studio floor", "photo-1497366216548-37526070297c", "photo-1497366811353-6870744d04b2"),
    P("studio-hero-3", 1440, 900, "Sketching a user flow on a whiteboard", "photo-1531403009284-440f080d1e12", "photo-1552664730-d307ca884978"),
    P("studio-about", 900, 1125, "The studio in Lisbon", "photo-1497366811353-6870744d04b2", "photo-1497215728101-856f4ea42174"),
    P("work-1", 800, 600, "Colour swatches for a brand identity", "photo-1561070791-2526d30994b5", "photo-1586717791821-3f44a563fa4c"),
    P("work-2", 800, 600, "A website design on a large screen", "photo-1559028012-481c04fa702d", "photo-1467232004584-a241de8bcf5d"),
    P("work-3", 800, 600, "A mobile app on a phone", "photo-1512941937669-90a1b58e7e9c", "photo-1551650975-87deedd944c3"),
    P("work-4", 800, 600, "Coffee packaging", "photo-1559056199-641a0ac8b55e", "photo-1495474472287-4d71bcdd2085"),
    P("work-5", 800, 600, "A product dashboard on a large screen", "photo-1551288049-bebda4e38f71", "photo-1460925895917-afdab827c52f"),
    P("work-6", 800, 600, "A beach resort with a pool", "photo-1566073771259-6a8506099945", "photo-1542314831-068cd1dbfeeb"),
    // people
    P("person-1", 600, 750, "Portrait of a woman smiling", "photo-1494790108377-be9c29b29330", "photo-1438761681033-6461ffad8d80"),
    P("person-2", 600, 750, "Portrait of a man smiling", "photo-1507003211169-0a1dd7228f2d", "photo-1500648767791-00dcc994a43e"),
    P("person-3", 600, 750, "Portrait of a woman", "photo-1531123897727-8f129e1688ce", "photo-1544005313-94ddf0286df2"),
    P("person-4", 600, 750, "Portrait of a man in a grey sweater", "photo-1500648767791-00dcc994a43e", "photo-1472099645785-5658abf4ff4e"),
    P("person-5", 600, 750, "Portrait of a woman", "photo-1580489944761-15a19d654956", "photo-1573496359142-b8d87734a5a2"),
    P("person-6", 600, 750, "Portrait of a man in a suit", "photo-1560250097-0b93528c311a", "photo-1519085360753-af0119f7cbe7"),
    // Meridian - company
    P("company-hero", 1440, 990, "Modern office towers", "photo-1486406146926-c627a92ad1ab", "photo-1497366754035-f200968a6e72"),
    P("company-meeting", 900, 675, "A talk in an open office", "photo-1556761175-5973dc0f32e7", "photo-1542744173-8e7e53415bb0"),
    P("company-team", 900, 675, "Colleagues working on laptops", "photo-1551434678-e076c223a692", "photo-1522202176988-66273c2fd55f"),
    P("company-plan", 900, 675, "Planning notes next to a laptop", "photo-1454165804606-c3d57bc86b40", "photo-1504384308090-c894fdcc538d"),
    P("news-1", 800, 500, "Charts on a laptop", "photo-1460925895917-afdab827c52f", "photo-1551288049-bebda4e38f71"),
    P("news-2", 800, 500, "An open-plan office", "photo-1504384308090-c894fdcc538d", "photo-1486312338219-ce68d2c6f44d"),
    P("news-3", 800, 500, "A presentation in a meeting room", "photo-1542744173-8e7e53415bb0", "photo-1556761175-b413da4baf72"),
    // Osteria Lume - restaurant
    P("food-hero-1", 1440, 900, "A plated dish at a set table", "photo-1414235077428-338989a2e8c0", "photo-1504674900247-0877df9cc836"),
    P("food-hero-2", 1440, 900, "The dining room in the evening", "photo-1517248135467-4c7edcad34c4", "photo-1555396273-367ea4eb4db5"),
    P("food-hero-3", 1440, 900, "Two cooks laughing in the kitchen", "photo-1556910103-1c02745aae4d", "photo-1577219491135-ce391730fb2c"),
    P("food-about", 900, 1125, "Plates shared across the table", "photo-1466978913421-dad2ebd01d17", "photo-1556909114-f6e7ad7d3136"),
    P("dish-1", 600, 600, "Roasted salmon with summer vegetables", "photo-1467003909585-2f8a72700288", "photo-1519708227418-c8fd9a32b7a2"),
    P("dish-2", 600, 600, "A bowl of grilled halloumi, egg and greens", "photo-1546069901-ba9599a7e63c", "photo-1512621776951-a57141f2eefd"),
    P("dish-3", 600, 600, "Wood-fired pizza", "photo-1565299624946-b28f40a0ae38", "photo-1513104890138-7c749659a591"),
    P("dish-4", 600, 600, "A chocolate dessert", "photo-1563805042-7684c019e1cb", "photo-1565958011703-44f9829ba187"),
    P("dish-5", 600, 600, "Spaghetti with prawns and cherry tomatoes", "photo-1563379926898-05f4575a45d8", "photo-1551183053-bf91a1d81141"),
    P("dish-6", 600, 600, "Cups of coffee with latte art", "photo-1495474472287-4d71bcdd2085", "photo-1509042239860-f550ce710b93"),
    P("room-1", 800, 800, "A bright dining room with tall windows", "photo-1555396273-367ea4eb4db5", "photo-1514933651103-005eec06c04b"),
    P("room-2", 800, 800, "A scallop starter on a wooden board", "photo-1529543544282-ea669407fca3", "photo-1543007630-9710e4a00a20"),
    // clinic
    P("clinic-hero", 1440, 900, "A doctor in a white coat", "photo-1576091160399-112ba8d25d1d", "photo-1579684385127-1ef15d508118"),
    P("clinic-room", 900, 675, "The clinic reception", "photo-1519494026892-80bbd2d6fd0d", "photo-1516549655169-df83a0774514"),
    P("clinic-lab", 900, 675, "A laboratory with modern equipment", "photo-1579154204601-01588f351e67", "photo-1581595219315-a187dd40c322"),
    P("doctor-1", 600, 750, "Portrait of a doctor", "photo-1559839734-2b71ea197ec2", "photo-1612349317150-e413f6a5b16d"),
    P("doctor-2", 600, 750, "Portrait of a doctor", "photo-1622253692010-333f2da6031d", "photo-1537368910025-700350fe46c7"),
    P("doctor-3", 600, 750, "Portrait of a doctor", "photo-1594824476967-48c8b964273f", "photo-1651008376811-b90baee60c1f"),
    // Harbor & Stone - real estate
    P("home-hero-1", 1440, 900, "A modern white house with a pool", "photo-1600596542815-ffad4c1539a9", "photo-1613490493576-7fde63acd811"),
    P("home-hero-2", 1440, 900, "A modern house at dusk", "photo-1600585154340-be6161a56a0c", "photo-1512917774080-9991f1c4c750"),
    P("home-1", 800, 600, "A family house with a garden", "photo-1570129477492-45c003edd2be", "photo-1564013799919-ab600027ffc6"),
    P("home-2", 800, 600, "A bright living room", "photo-1493809842364-78817add7ffb", "photo-1502672260266-1c1ef2d93688"),
    P("home-3", 800, 600, "A living room with plants", "photo-1502672260266-1c1ef2d93688", "photo-1560448204-e02f11c3d0e2"),
    P("home-4", 800, 600, "A couple cooking in a bright kitchen", "photo-1556909114-f6e7ad7d3136", "photo-1600607687939-ce8a6c25118c"),
    P("home-5", 800, 600, "A house with a pool", "photo-1512917774080-9991f1c4c750", "photo-1600585154340-be6161a56a0c"),
    P("home-6", 800, 600, "A white house with a pool", "photo-1564013799919-ab600027ffc6", "photo-1580587771525-78b9dba3b914"),
    // Northwind Data Summit - event
    P("event-hero-1", 1440, 900, "A speaker on stage in front of an audience", "photo-1505373877841-8d25f7d46678", "photo-1475721027785-f74eccf877e2"),
    P("event-hero-2", 1440, 900, "A conference audience", "photo-1540575467063-178a50c2df87", "photo-1515187029135-18ee286d815b"),
    P("event-venue", 900, 675, "The conference hall", "photo-1511578314322-379afb476865", "photo-1492684223066-81342ee5ff30"),
    // Lina Haddad - portfolio
    P("portfolio-hero", 1440, 810, "A designer's desk with a laptop and a screen", "photo-1499951360447-b19be8fe80f5", "photo-1467232004584-a241de8bcf5d"),
    // Ledgerline - SaaS
    P("saas-hero", 1440, 900, "An analytics dashboard on a screen", "photo-1551288049-bebda4e38f71", "photo-1460925895917-afdab827c52f"),
    P("saas-1", 900, 675, "Paperwork with a calculator and a phone", "photo-1554224155-6726b3ff858f", "photo-1554224154-26032ffc0d07"),
    P("saas-2", 900, 675, "A shop owner taking a payment on a tablet", "photo-1556740758-90de374c12ad", "photo-1600880292203-757bb62b4baf")
];
export const photoFile = name => "website-studio/img/" + name + ".jpg";
