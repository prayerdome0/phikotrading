import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { businesses, categories, dashboardStats, documents, products, roadmap } from './lib/mockData';
import './styles.css';

const navItems = ['Home', 'Marketplace', 'Businesses', 'Wholesale', 'Solutions', 'Pricing', 'Help'];

const platformModules = [
  { title: 'Your online store', text: 'Automatic store pages, custom branding, product/service catalogues and future custom domains.', icon: '🏪' },
  { title: 'Inventory & CSV sync', text: 'Import products, map columns, validate data, sync stock and monitor errors from one place.', icon: '📦' },
  { title: 'Quotations & invoices', text: 'Create professional PDFs, collect signatures, convert quotations to invoices and generate receipts.', icon: '🧾' },
  { title: 'CRM & suppliers', text: 'Manage customers, balances, purchase history, supplier bills and purchase orders.', icon: '👥' },
  { title: 'POS & branches', text: 'Mobile-first selling, barcode scanning, stock movements, warehouses and branch controls.', icon: '📱' },
  { title: 'Seedwel AI', text: 'Ask business questions, create marketing content, summarize reports and prepare actions for approval.', icon: '🤖' },
];

const quickActions = ['Product', 'Service', 'Quotation', 'Invoice', 'Receipt', 'Customer', 'Supplier', 'Expense', 'Purchase order', 'Payment request'];

function Logo() {
  return (
    <div className="logo" aria-label="Seedwel Hub">
      <div className="logoMark">S</div>
      <div>
        <strong>Seedwel Hub</strong>
        <span>A Seedwel Investment Limited product</span>
      </div>
    </div>
  );
}

function Header({ active, setActive }) {
  return (
    <header className="siteHeader">
      <Logo />
      <nav className="desktopNav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button key={item} className={active === item ? 'active' : ''} onClick={() => setActive(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div className="headerActions">
        <button className="ghost">Login</button>
        <button className="primary small">Register</button>
      </div>
    </header>
  );
}

function Hero({ setActive }) {
  return (
    <section className="hero sectionGrid">
      <div className="heroCopy">
        <div className="eyebrow">Buy. Sell. Manage. Grow.</div>
        <h1>Everything your business needs, in one place.</h1>
        <p>
          Seedwel Hub is an AI-powered business platform where people can shop, sell, manage inventory,
          create documents, run a store and grow from one account.
        </p>
        <div className="searchBox" role="search">
          <span>🔎</span>
          <input placeholder="Search products, services, businesses..." aria-label="Search products, services, businesses" />
          <button onClick={() => setActive('Marketplace')}>Search</button>
        </div>
        <div className="heroButtons">
          <button className="primary" onClick={() => setActive('Solutions')}>Start my business</button>
          <button className="secondary" onClick={() => setActive('Marketplace')}>Explore marketplace</button>
        </div>
      </div>
      <div className="heroPanel">
        <div className="phoneFrame">
          <div className="phoneTop">
            <span>My Business</span>
            <strong>K25,400</strong>
          </div>
          <div className="miniGrid">
            {dashboardStats.map((stat) => (
              <div className={`miniStat ${stat.tone}`} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
          <div className="aiCard">
            <span>🤖 Business Insight</span>
            <p>Sales increased 18% this month. Tile adhesive is moving fast and 14 products need restocking.</p>
          </div>
          <button className="primary full">+ Create invoice</button>
        </div>
      </div>
    </section>
  );
}

function RoleStrip() {
  const roles = ['Buyer', 'Seller', 'Business owner', 'Employee', 'Supplier', 'Service provider'];
  return (
    <section className="roleStrip">
      <div>
        <span className="eyebrow">One account, multiple roles</span>
        <h2>John can be Buyer + Seller + Business Owner.</h2>
      </div>
      <div className="rolePills">
        {roles.map((role) => <span key={role}>{role}</span>)}
      </div>
    </section>
  );
}

function ModuleGrid() {
  return (
    <section className="section">
      <div className="sectionTitle">
        <span className="eyebrow">Platform modules</span>
        <h2>Not just a marketplace — a complete business operating system.</h2>
      </div>
      <div className="cards six">
        {platformModules.map((module) => (
          <article className="card" key={module.title}>
            <div className="cardIcon">{module.icon}</div>
            <h3>{module.title}</h3>
            <p>{module.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Marketplace() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = [product.name, product.seller, product.category, product.location]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory = category === 'All' || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <main className="pageShell">
      <section className="marketHero">
        <div>
          <span className="eyebrow">Marketplace</span>
          <h1>Search products, services and businesses.</h1>
          <p>Natural-language search UI is ready for AI later. Try “chair”, “Lusaka”, “wholesale”, or “building”.</p>
        </div>
        <div className="searchBox compact">
          <span>🔎</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Black shoes under K500" />
        </div>
      </section>
      <div className="filterRail">
        <button className={category === 'All' ? 'active' : ''} onClick={() => setCategory('All')}>All</button>
        {categories.slice(0, 10).map((item) => (
          <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      <section className="productGrid">
        {filtered.map((product) => <ProductCard product={product} key={product.id} />)}
      </section>
    </main>
  );
}

function ProductCard({ product }) {
  return (
    <article className="productCard">
      <div className="productImage">
        <span>{product.category === 'Professional services' ? '🧑‍💻' : '📦'}</span>
        <em>{product.badge}</em>
      </div>
      <div className="productBody">
        <h3>{product.name}</h3>
        <p>{product.seller} • {product.location}</p>
        <div className="productMeta">
          <strong>K{product.price.toLocaleString()}</strong>
          <span>★ {product.rating}</span>
        </div>
        {product.wholesalePrice && (
          <small>Wholesale: K{product.wholesalePrice} from {product.minQty}+ units</small>
        )}
        <div className="productActions">
          <button className="secondary">View</button>
          <button className="primary small">Request quote</button>
        </div>
      </div>
    </article>
  );
}

function BusinessesPage() {
  return (
    <main className="pageShell">
      <section className="sectionTitle left">
        <span className="eyebrow">Nearby businesses</span>
        <h1>Professional business profiles with trust signals.</h1>
        <p>Each business profile will include contact details, documents, products, services, reviews, maps, opening hours and verification.</p>
      </section>
      <div className="businessList">
        {businesses.map((business) => (
          <article className="businessCard" key={business.name}>
            <div className="businessAvatar">{business.name.charAt(0)}</div>
            <div>
              <h3>{business.name}</h3>
              <p>{business.type}</p>
              <span>{business.location} • ★ {business.rating} • {business.products} products</span>
              <div className="badgeRow">
                {business.badges.map((badge) => <em key={badge}>✓ {badge}</em>)}
              </div>
            </div>
            <button className={business.open ? 'primary small' : 'secondary'}>{business.open ? 'Open now' : 'Closed'}</button>
          </article>
        ))}
      </div>
    </main>
  );
}

function BusinessDashboard() {
  return (
    <main className="dashboardShell">
      <aside className="dashboardSide">
        <Logo />
        <button className="active">Overview</button>
        <button>Products</button>
        <button>Inventory</button>
        <button>Orders</button>
        <button>Documents</button>
        <button>Customers</button>
        <button>Reports</button>
        <button>AI Assistant</button>
      </aside>
      <section className="dashboardMain">
        <div className="dashboardTop">
          <div>
            <span className="eyebrow">Business owner mode</span>
            <h1>Good afternoon, ABC Hardware.</h1>
            <p>Manage your store, inventory, customers, documents and growth tools.</p>
          </div>
          <button className="primary">+ Create</button>
        </div>
        <div className="statGrid">
          {dashboardStats.map((stat) => (
            <article className={`statCard ${stat.tone}`} key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <em>{stat.trend}</em>
            </article>
          ))}
        </div>
        <div className="dashboardGrid">
          <CsvSyncCard />
          <AIAssistantCard />
          <DocumentsCard />
          <QuickActionsCard />
        </div>
      </section>
    </main>
  );
}

function CsvSyncCard() {
  return (
    <article className="panel wide">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">CSV inventory synchronization</span>
          <h2>Preview → Validate → Import</h2>
        </div>
        <button className="secondary">Upload CSV</button>
      </div>
      <div className="mappingGrid">
        {[
          ['Product Name', 'Product'], ['SKU', 'SKU'], ['Price', 'Price'], ['Stock', 'Inventory'], ['Category', 'Category'], ['Image URL', 'Image'],
        ].map(([from, to]) => (
          <div key={from}><span>{from}</span><strong>→ {to}</strong></div>
        ))}
      </div>
      <div className="syncFooter">
        <span>Last synchronization: 14:32</span>
        <span>Products updated: 438</span>
        <span>Errors: 3</span>
        <button className="primary small">Sync every 30 minutes</button>
      </div>
    </article>
  );
}

function AIAssistantCard() {
  const prompts = [
    'What were my sales yesterday?',
    'Which products are low in stock?',
    'Create a quotation for this customer.',
    'Write a WhatsApp advert for tile adhesive.',
  ];
  return (
    <article className="panel">
      <span className="eyebrow">Ask Seedwel AI</span>
      <h2>Business assistant</h2>
      <p className="aiBubble">Your sales increased 18%. Three products are approaching low stock. Do you want a reorder list?</p>
      <div className="promptList">
        {prompts.map((prompt) => <button key={prompt}>{prompt}</button>)}
      </div>
    </article>
  );
}

function DocumentsCard() {
  return (
    <article className="panel">
      <span className="eyebrow">Document center</span>
      <h2>My Documents</h2>
      <div className="docList">
        {documents.map((doc) => (
          <div key={doc.number}>
            <strong>{doc.number}</strong>
            <span>{doc.type} • {doc.customer}</span>
            <em>{doc.amount} • {doc.status}</em>
          </div>
        ))}
      </div>
    </article>
  );
}

function QuickActionsCard() {
  return (
    <article className="panel">
      <span className="eyebrow">Quick action button</span>
      <h2>+ Create</h2>
      <div className="quickGrid">
        {quickActions.map((action) => <button key={action}>{action}</button>)}
      </div>
    </article>
  );
}

function SolutionsPage() {
  return (
    <main className="pageShell">
      <section className="sectionTitle left">
        <span className="eyebrow">Business solutions</span>
        <h1>Your store, customers, inventory, documents and growth — all in one platform.</h1>
      </section>
      <ModuleGrid />
      <section className="section">
        <div className="sectionTitle"><span className="eyebrow">Development roadmap</span><h2>Built systematically, phase by phase.</h2></div>
        <div className="roadmap">
          {roadmap.map(([phase, title, description]) => (
            <article key={phase}>
              <strong>{phase}</strong>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PricingPage() {
  const plans = [
    ['Free', 'Basic marketplace/store', 'K0'],
    ['Starter', 'Inventory + quotations + invoices', 'Soon'],
    ['Business', 'Advanced business tools', 'Soon'],
    ['Professional', 'AI automation + staff + reports', 'Soon'],
  ];
  return (
    <main className="pageShell">
      <section className="sectionTitle"><span className="eyebrow">Pricing</span><h1>Start free. Upgrade as your business grows.</h1></section>
      <div className="cards pricing">
        {plans.map(([name, desc, price]) => (
          <article className="card priceCard" key={name}>
            <h3>{name}</h3><p>{desc}</p><strong>{price}</strong><button className="primary full">Choose plan</button>
          </article>
        ))}
      </div>
    </main>
  );
}

function HelpPage() {
  return (
    <main className="pageShell">
      <section className="sectionTitle left">
        <span className="eyebrow">Help center</span>
        <h1>Support, tutorials and Seedwel Business Academy.</h1>
        <p>Future content hub for how to start, sell online, manage stock, create invoices, market products and grow a business.</p>
      </section>
      <div className="cards three">
        {['Help articles', 'Video guides', 'AI support assistant'].map((item) => <article className="card" key={item}><h3>{item}</h3><p>Coming as the platform modules mature.</p></article>)}
      </div>
    </main>
  );
}

function Home({ setActive }) {
  return (
    <main>
      <Hero setActive={setActive} />
      <RoleStrip />
      <ModuleGrid />
      <section className="section splitBand">
        <div>
          <span className="eyebrow">Positioning</span>
          <h2>Your Business. Your Store. Your Customers. Your Documents. Your Inventory. Your Growth.</h2>
          <p>A seller can start with only a phone and business information, then add products, import CSV stock, generate quotations, issue invoices, record payments, create receipts and use AI insights.</p>
        </div>
        <button className="primary" onClick={() => setActive('Solutions')}>View business tools</button>
      </section>
    </main>
  );
}

function App() {
  const [active, setActive] = useState('Home');
  const renderPage = () => {
    if (active === 'Marketplace' || active === 'Wholesale') return <Marketplace />;
    if (active === 'Businesses') return <BusinessesPage />;
    if (active === 'Solutions') return <><SolutionsPage /><BusinessDashboard /></>;
    if (active === 'Pricing') return <PricingPage />;
    if (active === 'Help') return <HelpPage />;
    return <Home setActive={setActive} />;
  };

  return (
    <>
      <Header active={active} setActive={setActive} />
      {renderPage()}
      <footer className="footer">
        <Logo />
        <p>Seedwel Hub — Buy. Sell. Manage. Grow. Real logo, Supabase backend and production integrations will be added later.</p>
      </footer>
      <nav className="mobileNav" aria-label="Mobile navigation">
        {['Home', 'Marketplace', 'Solutions', 'Help'].map((item) => (
          <button key={item} className={active === item ? 'active' : ''} onClick={() => setActive(item)}>
            {item === 'Home' ? '🏠' : item === 'Marketplace' ? '🛍️' : item === 'Solutions' ? '🏢' : '❔'}
            <span>{item}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
