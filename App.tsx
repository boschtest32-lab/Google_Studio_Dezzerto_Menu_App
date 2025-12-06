import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, 
  ChevronLeft, 
  Plus, 
  Minus, 
  Phone, 
  Send, 
  Edit3, 
  Upload, 
  ArrowLeft,
  ShoppingBag,
  Search,
  RefreshCw,
  ImageOff
} from 'lucide-react';
import { Category, SubCategory, Product, CartItem, Order } from './types';
import { INITIAL_MENU, WHATSAPP_NUMBER } from './constants';
import { GeminiAssistant } from './components/GeminiAssistant';

// --- Constants & Styles ---

const THEME_PINK = '#EA9AB2';
const THEME_BLUE = '#A2C5EB';
const STORAGE_KEY = 'dezzerto_menu_v5'; // Bumped to v5 to force refresh and new image logic

// Style for the Header (Cafe Name & Tagline) - Keeps the Pink Look
const PINK_GRID_STYLE: React.CSSProperties = {
  backgroundColor: THEME_PINK,
  backgroundImage: `
    linear-gradient(rgba(255, 255, 255, 0.5) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 2px, transparent 2px)
  `,
  backgroundSize: '32px 32px',
  backgroundPosition: 'center top',
  zIndex: 50
};

// Style for the Main Page Body - Blue Look
const BLUE_GRID_STYLE: React.CSSProperties = {
  backgroundColor: THEME_BLUE,
  backgroundImage: `
    linear-gradient(rgba(255, 255, 255, 0.5) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 2px, transparent 2px)
  `,
  backgroundSize: '32px 32px',
  backgroundPosition: 'center top',
  backgroundAttachment: 'fixed'
};

// --- Helper Components ---

interface HeaderProps { 
  cartCount: number; 
  onCartClick: () => void; 
  adminMode: boolean; 
  onToggleAdmin: () => void;
  onHomeClick: () => void;
  onResetMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onCartClick, 
  adminMode, 
  onToggleAdmin, 
  onHomeClick,
  onResetMenu
}) => (
  <header 
    className="sticky top-0 z-50 shadow-xl transition-colors pb-6 rounded-b-[40px]" 
    style={PINK_GRID_STYLE}
  >
    <div className="max-w-md mx-auto px-4 pt-6 flex justify-between items-center bg-[#EA9AB2]/10 backdrop-blur-[1px]">
      <div className="flex flex-col cursor-pointer" onClick={onHomeClick}>
        <h1 className="text-6xl font-extrabold text-[#004080] leading-none tracking-tight font-['Playfair_Display'] lowercase drop-shadow-sm">
          dézzerto
        </h1>
        <p className="text-xl text-[#004080] font-bold tracking-wide mt-2 font-['Playfair_Display'] italic lowercase">
          the sweet side of life
        </p>
      </div>
      <div className="flex items-center gap-3">
        {adminMode && (
           <button 
             onClick={onResetMenu}
             className="p-2 text-red-600 bg-white/80 rounded-full hover:bg-white"
             title="Reset Menu Data"
           >
             <RefreshCw size={24} />
           </button>
        )}
        <button 
          onClick={onToggleAdmin}
          className={`p-2 rounded-full transition-colors ${adminMode ? 'bg-white/80 text-[#004080]' : 'text-[#004080] hover:bg-white/40'}`}
          title="Toggle Admin Mode"
        >
          <Edit3 size={24} />
        </button>
        <button 
          onClick={onCartClick} 
          className="relative p-2 text-[#004080] hover:bg-white/40 rounded-full transition-colors"
        >
          <ShoppingBag size={32} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#004080] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse border-2 border-white shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </header>
);

interface ImageEditorProps { 
  currentImage: string; 
  onImageUpdate: (newUrl: string) => void; 
}

const ImageEditor: React.FC<ImageEditorProps> = ({ 
  currentImage, 
  onImageUpdate 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpdate(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm z-20 group">
      <label className="cursor-pointer block">
        <Upload size={16} className="text-blue-600" />
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
};

interface ProductCardProps { 
  product: Product; 
  quantity: number; 
  onAdd: () => void; 
  onRemove: () => void;
  adminMode: boolean;
  onUpdateImage: (id: string, newUrl: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  quantity, 
  onAdd, 
  onRemove,
  adminMode,
  onUpdateImage
}) => {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [imgError, setImgError] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setImgSrc(product.image);
    setImgError(false);
  }, [product.image]);

  const handleImageError = () => {
    // If it's a web URL (placeholder), just fail
    if (imgSrc.startsWith('http')) {
      setImgError(true);
      return;
    }

    // Fallback logic for local images
    if (imgSrc.startsWith('images/')) {
      // If "images/foo.jpg" failed, try "foo.jpg" (root)
      const fileName = imgSrc.split('/').pop();
      if (fileName) {
        console.log(`Failed to load ${imgSrc}, trying fallback: ${fileName}`);
        setImgSrc(fileName);
      } else {
        setImgError(true);
      }
    } else {
      // If we already tried fallback or it was something else, fail
      setImgError(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#A2C5EB]/30 overflow-hidden flex flex-col h-full transform transition-all hover:scale-[1.02] hover:shadow-md">
      <div className="relative aspect-square w-full bg-gray-100 flex items-center justify-center text-center">
        {!imgError ? (
          <img 
            src={imgSrc} 
            alt={product.name} 
            className="w-full h-full object-cover" 
            onError={handleImageError}
          />
        ) : (
          <div className="p-2 flex flex-col items-center justify-center h-full w-full bg-gray-200 text-gray-500">
            <ImageOff size={24} className="mb-2 opacity-50" />
            <span className="text-[10px] font-mono break-all leading-tight">Missing:<br/>{product.image}</span>
          </div>
        )}
        
        {adminMode && (
          <ImageEditor 
            currentImage={product.image} 
            onImageUpdate={(url) => {
              setImgSrc(url);
              setImgError(false);
              onUpdateImage(product.id, url);
            }} 
          />
        )}
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-blue-900 font-bold text-sm mb-3">₹{product.price}</p>
        
        <div className="mt-auto">
          {quantity === 0 ? (
            <button 
              onClick={onAdd}
              className="w-full py-2 bg-[#A2C5EB]/20 text-blue-900 font-semibold rounded-xl text-sm hover:bg-[#A2C5EB]/40 transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={16} /> ADD
            </button>
          ) : (
            <div className="flex items-center justify-between bg-blue-900 rounded-xl px-2 py-1 text-white shadow-blue-200 shadow-lg">
              <button onClick={onRemove} className="p-1 hover:bg-blue-800 rounded-lg transition-colors"><Minus size={16} /></button>
              <span className="font-bold text-sm w-6 text-center">{quantity}</span>
              <button onClick={onAdd} className="p-1 hover:bg-blue-800 rounded-lg transition-colors"><Plus size={16} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CategoryTileProps { 
  title: string; 
  image: string; 
  onClick: () => void;
  adminMode: boolean;
  onUpdateImage: (newUrl: string) => void;
}

const CategoryTile: React.FC<CategoryTileProps> = ({ 
  title, 
  image, 
  onClick,
  adminMode,
  onUpdateImage
}) => {
  const [imgSrc, setImgSrc] = useState(image);
  const [imgError, setImgError] = useState(false);

  // Reset state when image prop changes
  useEffect(() => {
    setImgSrc(image);
    setImgError(false);
  }, [image]);

  const handleImageError = () => {
    if (imgSrc.startsWith('http')) {
      setImgError(true);
      return;
    }
    if (imgSrc.startsWith('images/')) {
      const fileName = imgSrc.split('/').pop();
      if (fileName) {
        console.log(`Failed to load ${imgSrc}, trying fallback: ${fileName}`);
        setImgSrc(fileName);
      } else {
        setImgError(true);
      }
    } else {
      setImgError(true);
    }
  };

  return (
    <div 
      className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all bg-gray-200"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
      
      {!imgError ? (
        <img 
          src={imgSrc} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 text-gray-600 p-2 text-center">
          <ImageOff size={32} className="mb-2 opacity-50" />
          <span className="text-[10px] font-mono break-all z-0">Missing:<br/>{image}</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 z-10 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white font-bold text-base truncate text-center">{title}</h3>
      </div>
      {adminMode && (
        <div onClick={(e) => e.stopPropagation()}>
          <ImageEditor 
            currentImage={image} 
            onImageUpdate={(url) => {
              setImgSrc(url);
              setImgError(false);
              onUpdateImage(url);
            }} 
          />
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

function App() {
  const [menu, setMenu] = useState<Category[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [viewStack, setViewStack] = useState<string[]>(['root']); // Simple navigation stack
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [adminMode, setAdminMode] = useState(false);

  // Persistence for menu images (simulating backend)
  useEffect(() => {
    const savedMenu = localStorage.getItem(STORAGE_KEY);
    if (savedMenu) {
      try {
        setMenu(JSON.parse(savedMenu));
      } catch (e) {
        console.error("Failed to load menu from local storage");
      }
    }
  }, []);

  const saveMenu = useCallback((newMenu: Category[]) => {
    setMenu(newMenu);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMenu));
  }, []);

  const handleResetMenu = () => {
    if (window.confirm("Are you sure you want to reset the menu to defaults? All custom images/changes will be lost.")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  // --- Navigation Logic ---
  
  const currentView = viewStack[viewStack.length - 1];

  const goBack = () => {
    if (viewStack.length > 1) {
      setViewStack(prev => prev.slice(0, -1));
    }
  };

  const navigateToCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubCategoryId(null);
    setViewStack(prev => [...prev, 'category']);
  };

  const navigateToSubCategory = (subCatId: string) => {
    setSelectedSubCategoryId(subCatId);
    setViewStack(prev => [...prev, 'subcategory']);
  };

  const goHome = () => {
    setViewStack(['root']);
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setIsCartOpen(false);
  };

  // --- Cart Logic ---

  const getItemQuantity = (id: string) => cart.find(item => item.id === id)?.quantity || 0;

  const updateQuantity = (product: Product, delta: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(item => item.id !== product.id);
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      }
      if (delta > 0) {
        return [...prev, { ...product, quantity: 1 }];
      }
      return prev;
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = () => {
    if (!mobileNumber) {
      alert("Please enter your mobile number");
      return;
    }
    
    // Construct WhatsApp Message
    let message = `*New Order for Dezzerto*\n\n`;
    message += `Customer: ${mobileNumber}\n`;
    message += `------------------------\n`;
    cart.forEach(item => {
      message += `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    message += `------------------------\n`;
    message += `*Total Amount: ₹${cartTotal}*\n`;
    message += `\nThank you for choosing the Sweet Side of Life! 🍨`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(url, '_blank');
  };

  // --- Admin Logic (Image Updates) ---

  const updateCategoryImage = (catId: string, newUrl: string) => {
    const newMenu = menu.map(c => c.id === catId ? { ...c, image: newUrl } : c);
    saveMenu(newMenu);
  };

  const updateSubCategoryImage = (catId: string, subCatId: string, newUrl: string) => {
    const newMenu = menu.map(c => {
      if (c.id === catId && c.subCategories) {
        return {
          ...c,
          subCategories: c.subCategories.map(sc => sc.id === subCatId ? { ...sc, image: newUrl } : sc)
        };
      }
      return c;
    });
    saveMenu(newMenu);
  };

  const updateProductImage = (productId: string, newUrl: string) => {
    // Deep search and update
    const newMenu = menu.map(c => {
      // Check top level products
      if (c.products) {
        const updatedProducts = c.products.map(p => p.id === productId ? { ...p, image: newUrl } : p);
        if (updatedProducts !== c.products) return { ...c, products: updatedProducts }; // If changed
        // Check if any product was actually updated, if so return new object, else continue
        const hasChanged = c.products.some(p => p.id === productId);
        if(hasChanged) return { ...c, products: updatedProducts };
      }

      // Check subcategories
      if (c.subCategories) {
        return {
          ...c,
          subCategories: c.subCategories.map(sc => ({
            ...sc,
            products: sc.products.map(p => p.id === productId ? { ...p, image: newUrl } : p)
          }))
        };
      }
      return c;
    });
    saveMenu(newMenu);
  };


  // --- Render Helpers ---

  const renderHome = () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      {menu.map(category => (
        <CategoryTile
          key={category.id}
          title={category.name}
          image={category.image}
          onClick={() => navigateToCategory(category.id)}
          adminMode={adminMode}
          onUpdateImage={(url) => updateCategoryImage(category.id, url)}
        />
      ))}
    </div>
  );

  const renderCategory = () => {
    const category = menu.find(c => c.id === selectedCategoryId);
    if (!category) return <div>Category not found</div>;

    if (category.subCategories) {
      return (
        <div className="grid grid-cols-2 gap-4 p-4">
          {category.subCategories.map(sub => (
            <CategoryTile
              key={sub.id}
              title={sub.name}
              image={sub.image}
              onClick={() => navigateToSubCategory(sub.id)}
              adminMode={adminMode}
              onUpdateImage={(url) => updateSubCategoryImage(category.id, sub.id, url)}
            />
          ))}
        </div>
      );
    }

    if (category.products) {
      return (
        <div className="grid grid-cols-2 gap-4 p-4 pb-24">
          {category.products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={getItemQuantity(product.id)}
              onAdd={() => updateQuantity(product, 1)}
              onRemove={() => updateQuantity(product, -1)}
              adminMode={adminMode}
              onUpdateImage={(id, url) => updateProductImage(id, url)}
            />
          ))}
        </div>
      );
    }
    return <div className="p-8 text-center text-gray-500">Empty Category</div>;
  };

  const renderSubCategory = () => {
    const category = menu.find(c => c.id === selectedCategoryId);
    const subCategory = category?.subCategories?.find(sc => sc.id === selectedSubCategoryId);
    
    if (!subCategory) return <div>SubCategory not found</div>;

    return (
      <div className="grid grid-cols-2 gap-4 p-4 pb-24">
        {subCategory.products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={getItemQuantity(product.id)}
            onAdd={() => updateQuantity(product, 1)}
            onRemove={() => updateQuantity(product, -1)}
            adminMode={adminMode}
            onUpdateImage={(id, url) => updateProductImage(id, url)}
          />
        ))}
      </div>
    );
  };

  // --- Cart Drawer ---

  if (isCartOpen) {
    return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between" style={BLUE_GRID_STYLE}>
          <h2 className="text-lg font-bold text-[#004080] flex items-center gap-2">
            <ShoppingBag className="text-[#004080]" />
            Your Order
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white/40 text-[#004080] rounded-full shadow-sm hover:bg-white/60">
            <ChevronLeft />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart size={64} className="opacity-20" />
              <p>Your cart is empty.</p>
              <button onClick={() => setIsCartOpen(false)} className="text-blue-600 font-semibold">Start Ordering</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-blue-600 font-bold text-sm">₹{item.price * item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#A2C5EB]/10 px-2 py-1 rounded-lg">
                  <button onClick={() => updateQuantity(item, -1)} className="text-gray-500 hover:text-blue-600"><Minus size={16} /></button>
                  <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item, 1)} className="text-gray-500 hover:text-blue-600"><Plus size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number</label>
              <div className="flex items-center bg-gray-50 rounded-xl px-3 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <Phone size={18} className="text-gray-400 mr-2" />
                <input 
                  type="tel" 
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your 10-digit number"
                  className="bg-transparent flex-1 outline-none text-gray-800 font-medium placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-4 text-gray-800">
              <span className="text-sm font-medium text-gray-500">Total Amount</span>
              <span className="text-2xl font-bold">₹{cartTotal}</span>
            </div>

            <button 
              onClick={placeOrder}
              disabled={!mobileNumber}
              className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="bg-white/20 p-1 rounded-full"><Send size={18} /></span>
              Place Order on WhatsApp
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- Main View Render ---

  let viewTitle = "";
  if (currentView === 'category') {
    viewTitle = menu.find(c => c.id === selectedCategoryId)?.name || "Category";
  } else if (currentView === 'subcategory') {
    const cat = menu.find(c => c.id === selectedCategoryId);
    viewTitle = cat?.subCategories?.find(sc => sc.id === selectedSubCategoryId)?.name || "Subcategory";
  }

  return (
    <div 
      className="min-h-screen pb-20 max-w-md mx-auto relative shadow-2xl overflow-hidden rounded-[40px] my-4"
      style={BLUE_GRID_STYLE}
    >
      <Header 
        cartCount={cartItemCount} 
        onCartClick={() => setIsCartOpen(true)} 
        adminMode={adminMode} 
        onToggleAdmin={() => setAdminMode(!adminMode)}
        onHomeClick={goHome} 
        onResetMenu={handleResetMenu}
      />
      
      {/* Breadcrumb / Back Navigation */}
      {viewStack.length > 1 && (
        <div className="sticky top-[108px] z-40 bg-[#A2C5EB]/95 backdrop-blur-sm px-4 py-2 border-b border-white/20 flex items-center gap-2 shadow-sm">
          <button onClick={goBack} className="p-1 hover:bg-white/20 rounded-full transition-colors text-white">
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-[#004080] text-lg">{viewTitle}</span>
        </div>
      )}

      {currentView === 'root' && renderHome()}
      {currentView === 'category' && renderCategory()}
      {currentView === 'subcategory' && renderSubCategory()}

      {/* Floating Action Button for Cart (Mobile Sticky) */}
      {cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4 z-40">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-blue-900 text-white p-4 rounded-2xl shadow-xl shadow-blue-200 flex justify-between items-center animate-bounce-slight"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg font-bold text-sm">{cartItemCount} Items</div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-blue-100">Total</span>
                <span className="font-bold">₹{cartTotal}</span>
              </div>
            </div>
            <div className="flex items-center font-bold gap-2">
              View Cart <ChevronLeft className="rotate-180" size={18} />
            </div>
          </button>
        </div>
      )}

      {/* Admin Mode Toast */}
      {adminMode && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold shadow-md z-50 pointer-events-none">
          Admin Mode Active
        </div>
      )}
      
      {/* Gemini AI Assistant */}
      <GeminiAssistant menuData={menu} />
    </div>
  );
}

export default App;