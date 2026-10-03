"""Seed data for common HSN codes used in Indian businesses."""
from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.hsn_code import HSNCode

COMMON_HSN_CODES = [
    ("0101", "Live horses, asses, mules", 0.0, "Animals", "horses animals livestock"),
    ("0201", "Meat of bovine animals, fresh or chilled", 0.0, "Food", "meat beef"),
    ("0401", "Milk and cream", 0.0, "Dairy", "milk cream dairy"),
    ("0901", "Coffee", 5.0, "Beverages", "coffee beans roasted"),
    ("0902", "Tea", 5.0, "Beverages", "tea green black"),
    ("1001", "Wheat and meslin", 0.0, "Cereals", "wheat grain flour"),
    ("1006", "Rice", 5.0, "Cereals", "rice paddy basmati"),
    ("1701", "Cane or beet sugar", 5.0, "Sugar", "sugar cane beet"),
    ("2201", "Waters including mineral waters", 18.0, "Beverages", "water mineral packaged"),
    ("2202", "Sweetened or flavoured water", 28.0, "Beverages", "soft drinks cola soda aerated"),
    ("2523", "Portland cement", 28.0, "Construction", "cement portland clinker"),
    ("2710", "Petroleum oils", 18.0, "Fuel", "petrol diesel petroleum oil"),
    ("3004", "Medicaments", 12.0, "Pharma", "medicine drugs pharmaceutical tablet"),
    ("3304", "Beauty or make-up preparations", 28.0, "Cosmetics", "cosmetics beauty makeup cream"),
    ("3401", "Soap", 18.0, "FMCG", "soap detergent cleaning"),
    ("3808", "Insecticides", 18.0, "Agriculture", "insecticide pesticide herbicide"),
    ("3923", "Plastic articles for packing", 18.0, "Packaging", "plastic container bottle packaging"),
    ("4011", "New pneumatic tyres of rubber", 28.0, "Automobile", "tyre tire rubber pneumatic"),
    ("4202", "Trunks, suitcases, bags", 18.0, "Leather", "bag suitcase trunk briefcase"),
    ("4802", "Paper and paperboard", 12.0, "Paper", "paper printing writing"),
    ("4901", "Printed books, newspapers", 0.0, "Publishing", "book newspaper magazine printed"),
    ("5208", "Woven fabrics of cotton", 5.0, "Textiles", "cotton fabric cloth woven textile"),
    ("6109", "T-shirts, singlets, tank tops", 5.0, "Apparel", "tshirt shirt clothing garment"),
    ("6203", "Men's suits, jackets, trousers", 5.0, "Apparel", "suit jacket trouser pant formal"),
    ("6403", "Footwear with rubber soles", 18.0, "Footwear", "shoes footwear boots sandal"),
    ("6802", "Worked stone", 28.0, "Construction", "stone granite marble tile"),
    ("6907", "Ceramic tiles", 18.0, "Construction", "tile ceramic floor wall"),
    ("7005", "Float glass", 18.0, "Construction", "glass float sheet window"),
    ("7108", "Gold", 3.0, "Precious metals", "gold bullion bar"),
    ("7113", "Articles of jewellery", 3.0, "Jewellery", "jewellery gold silver ring necklace"),
    ("7204", "Iron and steel waste and scrap", 18.0, "Metals", "iron steel scrap waste"),
    ("7210", "Flat-rolled iron or steel products", 18.0, "Metals", "steel sheet coil galvanized"),
    ("7214", "Iron or steel bars and rods", 18.0, "Metals", "steel bar rod rebar TMT"),
    ("7308", "Iron or steel structures", 18.0, "Metals", "steel structure fabrication"),
    ("7318", "Screws, bolts, nuts of iron or steel", 18.0, "Hardware", "screw bolt nut washer fastener"),
    ("7606", "Aluminium plates, sheets", 18.0, "Metals", "aluminium aluminum plate sheet"),
    ("8414", "Air or vacuum pumps", 18.0, "Machinery", "pump air vacuum compressor"),
    ("8415", "Air conditioning machines", 28.0, "Appliances", "AC air conditioner cooling"),
    ("8418", "Refrigerators and freezers", 18.0, "Appliances", "refrigerator fridge freezer"),
    ("8443", "Printing machinery, printers", 18.0, "IT", "printer printing machine scanner"),
    ("8471", "Automatic data processing machines", 18.0, "IT", "computer laptop desktop server"),
    ("8504", "Electrical transformers", 18.0, "Electrical", "transformer inverter UPS"),
    ("8517", "Telephone sets, smartphones", 18.0, "Electronics", "phone mobile smartphone telephone"),
    ("8521", "Video recording apparatus", 18.0, "Electronics", "video recorder camera dvr"),
    ("8528", "Monitors and projectors", 18.0, "Electronics", "monitor display LED LCD projector TV"),
    ("8536", "Electrical switches and connectors", 18.0, "Electrical", "switch socket connector plug"),
    ("8544", "Insulated wire and cables", 18.0, "Electrical", "wire cable electric insulated copper"),
    ("8703", "Motor cars and vehicles", 28.0, "Automobile", "car vehicle automobile sedan SUV"),
    ("8711", "Motorcycles and cycles", 28.0, "Automobile", "motorcycle bike scooter two wheeler"),
    ("9401", "Seats and chairs", 18.0, "Furniture", "chair seat sofa furniture office"),
    ("9403", "Other furniture", 18.0, "Furniture", "furniture table desk cabinet shelf"),
    ("9405", "Lamps and lighting fittings", 18.0, "Lighting", "lamp light LED bulb fixture"),
    ("9503", "Toys", 12.0, "Toys", "toy game puzzle doll"),
    ("9801", "Laboratory chemicals and reagents", 5.0, "Lab", "chemical reagent laboratory"),
    ("9954", "Construction services", 18.0, "Services", "construction building renovation"),
    ("9971", "Financial and related services", 18.0, "Services", "financial banking insurance brokerage"),
    ("9972", "Real estate services", 18.0, "Services", "real estate rental property"),
    ("9973", "Leasing or rental services", 18.0, "Services", "lease rental hire"),
    ("9983", "Other professional services", 18.0, "Services", "consulting professional advisory"),
    ("9985", "Support services", 18.0, "Services", "support maintenance cleaning security"),
    ("9986", "Support services to agriculture", 0.0, "Agriculture", "agriculture farming cultivation"),
    ("9988", "Manufacturing services", 18.0, "Services", "manufacturing fabrication assembly"),
    ("9991", "Public administration services", 0.0, "Government", "government public administration"),
    ("9992", "Education services", 0.0, "Education", "education school college university training"),
    ("9993", "Health and social services", 0.0, "Healthcare", "health hospital medical clinic"),
    ("9995", "Services of households", 0.0, "Domestic", "household domestic maid cook driver"),
    ("9996", "Extraterritorial organisations", 0.0, "International", "international organisation embassy"),
    ("9997", "Other services not elsewhere classified", 18.0, "Services", "miscellaneous other service"),
]


def seed_hsn_codes(db: Session) -> int:
    count = 0
    for code, description, gst_rate, category, keywords in COMMON_HSN_CODES:
        existing = db.get(HSNCode, code)
        if not existing:
            hsn = HSNCode(
                code=code,
                description=description,
                gst_rate=gst_rate,
                category=category,
                search_keywords=keywords,
            )
            db.add(hsn)
            count += 1
    db.commit()
    return count
