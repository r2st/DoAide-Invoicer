import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";

const GST_DATABASE = [
  { name: "Rice", hsn: "1006", rate: 5, type: "Goods", category: "Food Grains" },
  { name: "Wheat", hsn: "1001", rate: 5, type: "Goods", category: "Food Grains" },
  { name: "Sugar", hsn: "1701", rate: 5, type: "Goods", category: "Food Products" },
  { name: "Tea", hsn: "0902", rate: 5, type: "Goods", category: "Beverages" },
  { name: "Coffee", hsn: "0901", rate: 5, type: "Goods", category: "Beverages" },
  { name: "Milk products", hsn: "0401", rate: 5, type: "Goods", category: "Dairy" },
  { name: "Butter", hsn: "0405", rate: 12, type: "Goods", category: "Dairy" },
  { name: "Cheese", hsn: "0406", rate: 12, type: "Goods", category: "Dairy" },
  { name: "Ghee", hsn: "0405", rate: 12, type: "Goods", category: "Dairy" },
  { name: "Packaged food", hsn: "2106", rate: 18, type: "Goods", category: "Food Products" },
  { name: "Spices (unprocessed)", hsn: "0904", rate: 5, type: "Goods", category: "Food Products" },
  { name: "Namkeen / Snacks", hsn: "2106", rate: 12, type: "Goods", category: "Food Products" },
  { name: "Restaurant services (non-AC)", sac: "9963", rate: 5, type: "Services", category: "Food & Hospitality" },
  { name: "Restaurant services (AC / 5-star)", sac: "9963", rate: 18, type: "Services", category: "Food & Hospitality" },
  { name: "Hotel room (tariff up to ₹1,000)", sac: "9963", rate: 12, type: "Services", category: "Food & Hospitality" },
  { name: "Hotel room (tariff ₹1,001–₹7,500)", sac: "9963", rate: 12, type: "Services", category: "Food & Hospitality" },
  { name: "Hotel room (tariff above ₹7,500)", sac: "9963", rate: 18, type: "Services", category: "Food & Hospitality" },

  { name: "Cotton fabrics", hsn: "5208", rate: 5, type: "Goods", category: "Textiles" },
  { name: "Silk fabrics", hsn: "5007", rate: 5, type: "Goods", category: "Textiles" },
  { name: "Readymade garments (up to ₹1,000)", hsn: "6109", rate: 5, type: "Goods", category: "Apparel" },
  { name: "Readymade garments (above ₹1,000)", hsn: "6109", rate: 12, type: "Goods", category: "Apparel" },
  { name: "Footwear (up to ₹1,000)", hsn: "6402", rate: 5, type: "Goods", category: "Apparel" },
  { name: "Footwear (above ₹1,000)", hsn: "6402", rate: 12, type: "Goods", category: "Apparel" },

  { name: "Mobile phones", hsn: "8517", rate: 18, type: "Goods", category: "Electronics" },
  { name: "Laptops / Computers", hsn: "8471", rate: 18, type: "Goods", category: "Electronics" },
  { name: "Television", hsn: "8528", rate: 18, type: "Goods", category: "Electronics" },
  { name: "Air conditioner", hsn: "8415", rate: 28, type: "Goods", category: "Electronics" },
  { name: "Refrigerator", hsn: "8418", rate: 18, type: "Goods", category: "Electronics" },
  { name: "Washing machine", hsn: "8450", rate: 18, type: "Goods", category: "Electronics" },
  { name: "Printer", hsn: "8443", rate: 18, type: "Goods", category: "Electronics" },
  { name: "Camera", hsn: "9006", rate: 18, type: "Goods", category: "Electronics" },
  { name: "LED / LCD monitors", hsn: "8528", rate: 18, type: "Goods", category: "Electronics" },
  { name: "Batteries", hsn: "8506", rate: 18, type: "Goods", category: "Electronics" },

  { name: "Cement", hsn: "2523", rate: 28, type: "Goods", category: "Construction" },
  { name: "Steel / Iron", hsn: "7208", rate: 18, type: "Goods", category: "Construction" },
  { name: "Bricks", hsn: "6901", rate: 5, type: "Goods", category: "Construction" },
  { name: "Marble / Granite", hsn: "2515", rate: 18, type: "Goods", category: "Construction" },
  { name: "Plywood", hsn: "4412", rate: 18, type: "Goods", category: "Construction" },
  { name: "Paint", hsn: "3208", rate: 28, type: "Goods", category: "Construction" },
  { name: "Tiles (ceramic)", hsn: "6907", rate: 18, type: "Goods", category: "Construction" },
  { name: "Sanitary ware", hsn: "6910", rate: 18, type: "Goods", category: "Construction" },
  { name: "Pipes (PVC)", hsn: "3917", rate: 18, type: "Goods", category: "Construction" },
  { name: "Glass", hsn: "7003", rate: 18, type: "Goods", category: "Construction" },

  { name: "Cars (petrol/diesel, up to 1200cc)", hsn: "8703", rate: 28, type: "Goods", category: "Automobiles" },
  { name: "Cars (above 1200cc)", hsn: "8703", rate: 28, type: "Goods", category: "Automobiles" },
  { name: "Two-wheelers", hsn: "8711", rate: 28, type: "Goods", category: "Automobiles" },
  { name: "Auto parts / accessories", hsn: "8708", rate: 28, type: "Goods", category: "Automobiles" },
  { name: "Tyres", hsn: "4011", rate: 28, type: "Goods", category: "Automobiles" },

  { name: "Medicines (Ayurvedic)", hsn: "3003", rate: 12, type: "Goods", category: "Healthcare" },
  { name: "Medicines (Allopathic)", hsn: "3004", rate: 12, type: "Goods", category: "Healthcare" },
  { name: "Medical equipment", hsn: "9018", rate: 12, type: "Goods", category: "Healthcare" },
  { name: "Sanitizers", hsn: "3808", rate: 18, type: "Goods", category: "Healthcare" },

  { name: "Stationery", hsn: "4820", rate: 18, type: "Goods", category: "Office Supplies" },
  { name: "Printer paper", hsn: "4802", rate: 12, type: "Goods", category: "Office Supplies" },
  { name: "Books (printed)", hsn: "4901", rate: 0, type: "Goods", category: "Education" },
  { name: "Notebooks", hsn: "4820", rate: 12, type: "Goods", category: "Education" },
  { name: "Pens / Pencils", hsn: "9608", rate: 18, type: "Goods", category: "Office Supplies" },
  { name: "Furniture (wooden)", hsn: "9403", rate: 18, type: "Goods", category: "Furniture" },
  { name: "Mattress", hsn: "9404", rate: 18, type: "Goods", category: "Furniture" },

  { name: "Gold / Silver jewelry", hsn: "7113", rate: 3, type: "Goods", category: "Precious Metals" },
  { name: "Diamonds (rough)", hsn: "7102", rate: 0.25, type: "Goods", category: "Precious Metals" },

  { name: "Soap / Shampoo", hsn: "3401", rate: 18, type: "Goods", category: "Personal Care" },
  { name: "Toothpaste", hsn: "3306", rate: 18, type: "Goods", category: "Personal Care" },
  { name: "Cosmetics", hsn: "3304", rate: 28, type: "Goods", category: "Personal Care" },
  { name: "Perfume / Deodorant", hsn: "3303", rate: 28, type: "Goods", category: "Personal Care" },
  { name: "Hair oil", hsn: "3305", rate: 18, type: "Goods", category: "Personal Care" },

  { name: "IT / Software services", sac: "9983", rate: 18, type: "Services", category: "Technology" },
  { name: "Cloud hosting / SaaS", sac: "9983", rate: 18, type: "Services", category: "Technology" },
  { name: "Web development", sac: "9983", rate: 18, type: "Services", category: "Technology" },
  { name: "App development", sac: "9983", rate: 18, type: "Services", category: "Technology" },
  { name: "Digital marketing", sac: "9983", rate: 18, type: "Services", category: "Technology" },
  { name: "SEO services", sac: "9983", rate: 18, type: "Services", category: "Technology" },

  { name: "Legal services", sac: "9982", rate: 18, type: "Services", category: "Professional" },
  { name: "Accounting / CA services", sac: "9982", rate: 18, type: "Services", category: "Professional" },
  { name: "Consulting services", sac: "9983", rate: 18, type: "Services", category: "Professional" },
  { name: "Architecture services", sac: "9983", rate: 18, type: "Services", category: "Professional" },
  { name: "Interior design services", sac: "9983", rate: 18, type: "Services", category: "Professional" },
  { name: "Management consulting", sac: "9983", rate: 18, type: "Services", category: "Professional" },

  { name: "Cab / Taxi services", sac: "9964", rate: 5, type: "Services", category: "Transport" },
  { name: "Goods transport (GTA)", sac: "9965", rate: 5, type: "Services", category: "Transport" },
  { name: "Courier services", sac: "9968", rate: 18, type: "Services", category: "Transport" },
  { name: "Air travel (economy)", sac: "9964", rate: 5, type: "Services", category: "Transport" },
  { name: "Air travel (business class)", sac: "9964", rate: 12, type: "Services", category: "Transport" },
  { name: "Railway transport", sac: "9964", rate: 5, type: "Services", category: "Transport" },

  { name: "Renting of commercial property", sac: "9972", rate: 18, type: "Services", category: "Real Estate" },
  { name: "Renting of residential property", sac: "9972", rate: 18, type: "Services", category: "Real Estate" },
  { name: "Construction services (affordable housing)", sac: "9954", rate: 1, type: "Services", category: "Real Estate" },
  { name: "Construction services (non-affordable)", sac: "9954", rate: 5, type: "Services", category: "Real Estate" },

  { name: "Gym / Fitness services", sac: "9996", rate: 18, type: "Services", category: "Recreation" },
  { name: "Salon / Beauty services", sac: "9997", rate: 18, type: "Services", category: "Recreation" },
  { name: "Event management", sac: "9983", rate: 18, type: "Services", category: "Recreation" },
  { name: "Photography services", sac: "9989", rate: 18, type: "Services", category: "Recreation" },

  { name: "Insurance (life)", sac: "9971", rate: 18, type: "Services", category: "Financial" },
  { name: "Insurance (health)", sac: "9971", rate: 18, type: "Services", category: "Financial" },
  { name: "Banking services", sac: "9971", rate: 18, type: "Services", category: "Financial" },
  { name: "Stockbroking services", sac: "9971", rate: 18, type: "Services", category: "Financial" },

  { name: "Education services (school/college)", sac: "9992", rate: 0, type: "Services", category: "Education" },
  { name: "Coaching / Tuition", sac: "9992", rate: 18, type: "Services", category: "Education" },
  { name: "Online courses / EdTech", sac: "9992", rate: 18, type: "Services", category: "Education" },
  { name: "Healthcare services", sac: "9993", rate: 0, type: "Services", category: "Healthcare" },

  { name: "Advertising services", sac: "9983", rate: 18, type: "Services", category: "Media" },
  { name: "Printing services", sac: "9989", rate: 18, type: "Services", category: "Media" },
  { name: "Broadcasting services", sac: "9984", rate: 18, type: "Services", category: "Media" },
  { name: "OTT / Streaming services", sac: "9984", rate: 18, type: "Services", category: "Media" },

  { name: "Cleaning / Housekeeping", sac: "9985", rate: 18, type: "Services", category: "Facility" },
  { name: "Security services", sac: "9985", rate: 18, type: "Services", category: "Facility" },
  { name: "Manpower supply", sac: "9985", rate: 18, type: "Services", category: "Facility" },

  { name: "Electricity", hsn: "2716", rate: 18, type: "Goods", category: "Utilities" },
  { name: "Solar panels", hsn: "8541", rate: 12, type: "Goods", category: "Energy" },
  { name: "Petrol / Diesel", hsn: "2710", rate: 0, type: "Goods", category: "Fuel (outside GST)" },
  { name: "LPG (domestic)", hsn: "2711", rate: 5, type: "Goods", category: "Fuel" },
  { name: "Fertilizers", hsn: "3102", rate: 5, type: "Goods", category: "Agriculture" },
  { name: "Pesticides", hsn: "3808", rate: 18, type: "Goods", category: "Agriculture" },
  { name: "Tractors", hsn: "8701", rate: 12, type: "Goods", category: "Agriculture" },
];

const CATEGORIES = [...new Set(GST_DATABASE.map((i) => i.category))].sort();

function RateBadge({ rate }) {
  let color = "good";
  if (rate >= 18) color = "warn";
  if (rate >= 28) color = "bad";
  return <span className={`chip chip-${color} font-mono`}>{rate}%</span>;
}

export default function GstRateFinderPage() {
  usePageTitle("GST Rate Finder — Find GST Rate & HSN/SAC Code");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GST_DATABASE.filter((item) => {
      const matchCategory = !selectedCategory || item.category === selectedCategory;
      if (!q) return matchCategory;
      const matchQuery =
        item.name.toLowerCase().includes(q) ||
        (item.hsn && item.hsn.includes(q)) ||
        (item.sac && item.sac.includes(q)) ||
        item.category.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, selectedCategory]);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex items-center max-w-5xl w-full mx-auto px-5 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
            <rect x="4" y="6" width="32" height="28" rx="4" fill="var(--brand)" />
            <rect x="8" y="12" width="18" height="2" rx="1" fill="var(--brand-text)" />
            <rect x="8" y="17" width="24" height="2" rx="1" fill="var(--brand-text)" />
            <rect x="8" y="22" width="14" height="2" rx="1" fill="var(--brand-text)" />
            <rect x="8" y="27" width="20" height="2" rx="1" fill="var(--brand-text)" />
          </svg>
          <span className="font-display text-2xl tracking-tight text-ink-strong">
            DoAide <em className="text-brand">Invoicer</em>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <Link to="/create" className="btn btn-primary text-sm">Create Invoice</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 pb-16">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl lg:text-4xl text-ink-strong mb-2">GST Rate Finder</h1>
          <p className="text-ink-soft text-sm max-w-lg mx-auto">
            Search for any product or service to find its applicable GST rate, HSN/SAC code, and category. Covers 100+ items across all major sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <div className="sm:col-span-3">
            <input
              type="search"
              placeholder="Search products or services... e.g. laptop, consulting, cement, 8471"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field text-base"
              autoFocus
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field text-sm"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-ink-muted mb-4">
          Showing {results.length} of {GST_DATABASE.length} items
          {query && <> matching &ldquo;{query}&rdquo;</>}
          {selectedCategory && <> in {selectedCategory}</>}
        </p>

        {results.length > 0 ? (
          <div className="panel p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Product / Service</th>
                    <th>Type</th>
                    <th>HSN / SAC</th>
                    <th>Category</th>
                    <th className="text-right">GST Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, i) => (
                    <tr key={i}>
                      <td className="font-medium text-ink-strong">{item.name}</td>
                      <td>
                        <span className={`chip ${item.type === "Services" ? "chip-neutral" : "chip-good"} text-[10px]`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="font-mono text-brand font-semibold">{item.hsn || item.sac}</td>
                      <td className="text-ink-soft text-sm">{item.category}</td>
                      <td className="text-right"><RateBadge rate={item.rate} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="panel text-center py-12">
            <div className="text-3xl mb-3 opacity-40">&#x1F50D;</div>
            <p className="text-ink-soft mb-1">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-ink-muted">Try a broader search term or clear the category filter.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="panel bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)]">
            <h3 className="font-display text-lg text-ink-strong mb-2">What is HSN Code?</h3>
            <p className="text-sm text-ink-soft">HSN (Harmonized System of Nomenclature) is a 4-8 digit code used to classify goods under GST. Businesses with turnover above ₹5 crore must mention HSN codes on invoices.</p>
          </div>
          <div className="panel bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)]">
            <h3 className="font-display text-lg text-ink-strong mb-2">What is SAC Code?</h3>
            <p className="text-sm text-ink-soft">SAC (Services Accounting Code) is a classification code for services under GST. It starts with &ldquo;99&rdquo; and is used to identify the type of service being provided for tax purposes.</p>
          </div>
          <div className="panel bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)]">
            <h3 className="font-display text-lg text-ink-strong mb-2">GST Rate Slabs</h3>
            <p className="text-sm text-ink-soft">India has 5 main GST slabs: 0%, 5%, 12%, 18%, and 28%. Essential goods attract lower rates, while luxury and sin goods are taxed at 28% plus cess.</p>
          </div>
        </div>

        <div className="panel text-center mt-6 bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)]">
          <h3 className="font-display text-xl text-ink-strong mb-2">Create a GST-compliant invoice with the right HSN/SAC codes</h3>
          <p className="text-sm text-ink-soft mb-4">Use our free invoice generator with auto-calculated GST breakdowns.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/create?template=gst-compliant" className="btn btn-primary text-sm">Create GST Invoice</Link>
            <Link to="/calculator" className="btn btn-ghost text-sm">Tax Calculator</Link>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "GST Rate Finder",
            description: "Find GST rates and HSN/SAC codes for any product or service in India. Free tool with 100+ items across all sectors.",
            url: "https://invoicer.doaide.com/tools/gst-rate-finder",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
            author: { "@type": "Organization", name: "DoAide", url: "https://doaide.com" },
          }),
        }}
      />
    </div>
  );
}
