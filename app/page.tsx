"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChefHat,
  ChevronDown,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  Copy,
  DoorOpen,
  Download,
  FileText,
  Fish,
  KeyRound,
  Leaf,
  Minus,
  Plus,
  Refrigerator,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Trash2,
  UsersRound,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type View = "recipes" | "plan" | "shop" | "fridge";
type Meal = "Πρωινά" | "Μεσημεριανά" | "Βραδινά" | "Σνακ";

type Recipe = {
  id: number;
  meal: Meal;
  subcategory: string;
  title: string;
  prep: number;
  cook: number;
  image?: boolean;
  tone: string;
};

const recipes: Recipe[] = [
  { id: 1, meal: "Μεσημεριανά", subcategory: "Κοτόπουλο", title: "Κοτόπουλο κοκκινιστό με ρύζι", prep: 12, cook: 35, image: true, tone: "olive" },
  { id: 2, meal: "Μεσημεριανά", subcategory: "Κοτόπουλο", title: "Κοτόπουλο λεμονάτο με ρύζι", prep: 10, cook: 30, tone: "lemon" },
  { id: 3, meal: "Μεσημεριανά", subcategory: "Κοτόπουλο", title: "Κοτόπουλο με πατάτες φούρνου", prep: 15, cook: 45, tone: "terracotta" },
  { id: 4, meal: "Μεσημεριανά", subcategory: "Μοσχάρι & Κιμάς", title: "Μπιφτέκια με πατάτες φούρνου", prep: 15, cook: 40, tone: "clay" },
  { id: 5, meal: "Μεσημεριανά", subcategory: "Ψάρια", title: "Σολομός με ψητά λαχανικά", prep: 10, cook: 22, tone: "sea" },
  { id: 6, meal: "Μεσημεριανά", subcategory: "Λαδερά & Όσπρια", title: "Μπριάμ", prep: 15, cook: 45, tone: "sage" },
  { id: 7, meal: "Πρωινά", subcategory: "Γρήγορα", title: "Τοστ με γαλοπούλα και τυρί", prep: 5, cook: 5, tone: "lemon" },
  { id: 8, meal: "Πρωινά", subcategory: "Χωρίς μαγείρεμα", title: "Γιαούρτι με φρούτο και ξηρούς καρπούς", prep: 4, cook: 0, tone: "berry" },
  { id: 9, meal: "Βραδινά", subcategory: "Ελαφριά", title: "Ομελέτα με λαχανικά", prep: 8, cook: 10, tone: "sage" },
  { id: 10, meal: "Βραδινά", subcategory: "Γρήγορα", title: "Τορτίγια με κοτόπουλο και γιαούρτι", prep: 8, cook: 0, tone: "terracotta" },
  { id: 11, meal: "Σνακ", subcategory: "Για την τσάντα", title: "Μήλο με φυστικοβούτυρο", prep: 3, cook: 0, tone: "clay" },
  { id: 12, meal: "Σνακ", subcategory: "Ψυγείου", title: "Γιαούρτι με κανέλα", prep: 2, cook: 0, tone: "berry" },
];

const shopItems = [
  ["Αλάτι, πιπέρι", "—"], ["Γαλοπούλα", "2 φέτες"], ["Δάφνη", "1 τεμ."],
  ["Ελαιόλαδο", "45 ml"], ["Ζωμός", "340–370 ml"], ["Κοτόπουλο", "500 γρ."],
  ["Κρεμμύδι", "75 γρ."], ["Λεμόνι", "40 ml"], ["Μουστάρδα", "1,5 κ.γ."],
  ["Ντομάτα", "20–40 γρ."], ["Ξύλο κανέλας", "1 τεμ."], ["Πάπρικα", "0,25 κ.γ."],
  ["Πατάτες", "250 γρ."], ["Πελτές ντομάτας", "1 κ.γ."], ["Ρίγανη", "1 κ.γ."],
  ["Ρύζι μπασμάτι", "120 γρ."], ["Σκόρδο", "1,5 σκελίδες"], ["Τριμμένη ντομάτα / passata", "150 γρ."],
  ["Τυρί", "25–30 γρ."], ["Ψωμί", "70–80 γρ."],
] as const;

const navItems = [
  { id: "recipes" as const, label: "Συνταγές", icon: ChefHat },
  { id: "plan" as const, label: "Πλάνο", icon: ClipboardCheck },
  { id: "shop" as const, label: "Supermarket", icon: ShoppingBasket },
  { id: "fridge" as const, label: "AI Ψυγείο", icon: Refrigerator },
];

function Brand({ login = false }: { login?: boolean }) {
  return (
    <div className={cn("brand", login && "brand-login")}>
      <img src="/assets/pot-thyme-logo.svg" alt="Pot & Thyme" />
      <div><strong>Pot & Thyme</strong><span>TEST</span></div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <main className="login-shell">
      <section className="login-story">
        <Brand login />
        <div><span className="kicker-light">Food planning, made lighter</span><h1>Οργάνωσε το φαγητό σου, χωρίς να οργανώνεται όλη η ζωή σου γύρω από αυτό.</h1><p>Συνταγές, κοινό πλάνο και λίστα supermarket σε ένα ήρεμο, πρακτικό μέρος.</p></div>
        <div className="login-food"><img src="/assets/lemon-chicken.svg" alt="Σπιτικό φαγητό με κοτόπουλο και πατάτες" /><span>Απλό φαγητό. Λιγότερες αποφάσεις.</span></div>
      </section>
      <section className="login-panel"><div className="login-form"><span className="eyebrow">{mode === "login" ? "Καλώς ήρθες ξανά" : "Νέος λογαριασμός"}</span><h2>{mode === "login" ? "Σύνδεση" : "Δημιουργία λογαριασμού"}</h2><p>{mode === "login" ? "Συνέχισε στο κοινό σου πλάνο." : "Χρησιμοποίησε το email σου για να ξεκινήσεις."}</p><label><span>Email</span><input type="email" placeholder="name@email.com" /></label><label><span>Κωδικός</span><input type="password" placeholder="Τουλάχιστον 6 χαρακτήρες" /></label><Button onClick={onLogin}>{mode === "login" ? "Σύνδεση" : "Δημιουργία λογαριασμού"}<ArrowRight size={18} /></Button><button className="switch-auth" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Δημιουργία λογαριασμού" : "Έχω ήδη λογαριασμό"}</button><div className="legal-links"><a href="#">Όροι Χρήσης</a><span>·</span><a href="#">Πολιτική Απορρήτου</a><span>·</span><a href="#">Cookies</a></div></div></section>
    </main>
  );
}

function AppSidebar({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <aside className="app-sidebar"><Brand /><nav aria-label="Κύρια πλοήγηση">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={cn(view === id && "active")} onClick={() => setView(id)}><Icon size={19} /><span>{label}</span></button>)}</nav><div className="sidebar-footer"><Leaf size={17} /><span>Λιγότερη σκέψη.<br />Περισσότερος χρόνος.</span></div></aside>
  );
}

function Header({ view, setView, onAccount, onLogout }: { view: View; setView: (view: View) => void; onAccount: () => void; onLogout: () => void }) {
  return (
    <header className="app-header"><div className="mobile-logo"><img src="/assets/pot-thyme-logo.svg" alt="" /><strong>{navItems.find((item) => item.id === view)?.label}</strong></div><div className="header-title"><span>Κοινό πλάνο</span><strong>PoT & Thyme Test</strong></div><div className="header-actions"><Button variant="outline" onClick={() => setView(view === "fridge" ? "recipes" : "fridge")}>{view === "fridge" ? <ArrowLeft /> : <Sparkles />}{view === "fridge" ? "Συνταγές" : "AI Ψυγείο"}</Button><button className="account-button" onClick={onAccount}><CircleUserRound /><span>Λογαριασμός</span></button><button className="logout-button" onClick={onLogout} aria-label="Αποσύνδεση"><DoorOpen /></button></div></header>
  );
}

function WorkspaceBar({ notice }: { notice: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <><section className="workspace-bar"><div className="workspace-name"><UsersRound /><span><small>Κοινό πλάνο</small><strong>PoT & Thyme Test</strong></span></div><div className="invite-code"><span><small>Κωδικός πρόσκλησης</small><strong>0A3186A2</strong></span><button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }}>{copied ? <Check /> : <Copy />}{copied ? "Αντιγράφηκε" : "Αντιγραφή"}</button></div><div className="approval-status"><ShieldCheck /><span><small>Έγκριση συνταγών</small><strong>0 σε αναμονή</strong></span><ChevronDown /></div></section>{notice && <div className="notice"><Check size={17} />{notice}</div>}</>
  );
}

function FoodVisual({ recipe }: { recipe: Recipe }) {
  const Icon = recipe.subcategory === "Ψάρια" ? Fish : recipe.subcategory.includes("Όσπρια") ? Leaf : UtensilsCrossed;
  return recipe.image ? <img className="food-visual" src="/assets/lemon-chicken.svg" alt={recipe.title} /> : <div className={cn("food-visual food-placeholder", `tone-${recipe.tone}`)}><Icon /></div>;
}

function RecipeCard({ recipe, onOpen, onAdd }: { recipe: Recipe; onOpen: () => void; onAdd: () => void }) {
  return (
    <article className="recipe-card"><FoodVisual recipe={recipe} /><div className="recipe-info"><span className="recipe-tag">{recipe.subcategory}</span><h3>{recipe.title}</h3><p><Clock3 />{recipe.prep + recipe.cook}′ συνολικά</p><div className="recipe-actions"><Button variant="outline" onClick={onOpen}>Προβολή συνταγής</Button><Button onClick={onAdd}><Plus /> Πλάνο</Button></div></div></article>
  );
}

function RecipeCatalog({ onOpen, onAdd, onNew }: { onOpen: (r: Recipe) => void; onAdd: (r: Recipe) => void; onNew: () => void }) {
  const [meal, setMeal] = useState<Meal>("Μεσημεριανά");
  const [query, setQuery] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const subcategories = [...new Set(recipes.filter((r) => r.meal === meal).map((r) => r.subcategory))];
  const filtered = recipes.filter((r) => r.meal === meal && (!subcategory || r.subcategory === subcategory) && r.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="catalog"><div className="meal-tabs" role="tablist">{(["Πρωινά", "Μεσημεριανά", "Βραδινά", "Σνακ"] as Meal[]).map((item) => <button role="tab" aria-selected={meal === item} className={cn(meal === item && "active")} key={item} onClick={() => { setMeal(item); setSubcategory(""); }}>{item}</button>)}</div><div className="catalog-tools"><label className="search-field"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Αναζήτηση" /></label>{meal === "Μεσημεριανά" && <label className="select-field"><Settings2 /><select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}><option value="">Όλες οι κατηγορίες</option>{subcategories.map((s) => <option key={s}>{s}</option>)}</select></label>}</div><div className="content-heading"><div><span className="eyebrow">Βιβλιοθήκη συνταγών</span><h1>{meal}</h1><p>{filtered.length} συνταγές διαθέσιμες</p></div><Button onClick={onNew}><Plus /> Νέα συνταγή</Button></div>{filtered.length ? <div className="recipe-grid">{filtered.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} onOpen={() => onOpen(recipe)} onAdd={() => onAdd(recipe)} />)}</div> : <div className="empty-state"><Search /><h3>Δεν βρέθηκε συνταγή</h3><p>Δοκίμασε διαφορετική αναζήτηση ή κατηγορία.</p></div>}</section>
  );
}

type PlanItem = { key: number; recipe: Recipe; qty: number };

function PlanList({ plan, setPlan, full = false }: { plan: PlanItem[]; setPlan: React.Dispatch<React.SetStateAction<PlanItem[]>>; full?: boolean }) {
  const update = (key: number, delta: number) => setPlan((current) => current.map((item) => item.key === key ? { ...item, qty: Math.max(.5, item.qty + delta) } : item));
  return <div className={cn("plan-list", full && "plan-list-full")}>{plan.length ? plan.map((item) => <article className="plan-item" key={item.key}><div className={cn("plan-thumb", `tone-${item.recipe.tone}`)}>{item.recipe.image ? <img src="/assets/lemon-chicken.svg" alt="" /> : <ChefHat />}</div><div className="plan-copy"><strong>{item.recipe.title}</strong><span>{item.recipe.meal.replace("ά", "ό").replace("ά", "ό")}</span></div><div className="qty-control"><button onClick={() => update(item.key, -.5)}><Minus /></button><strong>{item.qty}</strong><button onClick={() => update(item.key, .5)}><Plus /></button></div><button className="remove-item" onClick={() => setPlan((current) => current.filter((entry) => entry.key !== item.key))}><X /></button></article>) : <div className="empty-small"><ClipboardCheck /><span>Δεν έχεις γεύματα ακόμη.</span></div>}</div>;
}

function ShoppingList({ checked, setChecked, full = false }: { checked: string[]; setChecked: React.Dispatch<React.SetStateAction<string[]>>; full?: boolean }) {
  const items = full ? shopItems : shopItems.slice(0, 8);
  return <div className={cn("shop-list", full && "shop-list-full")}>{items.map(([name, qty]) => <label key={name} className={cn(checked.includes(name) && "done")}><Checkbox checked={checked.includes(name)} onCheckedChange={() => setChecked((current) => current.includes(name) ? current.filter((x) => x !== name) : [...current, name])} /><span><strong>{name}</strong><small>{qty}</small></span></label>)}</div>;
}

function PlanSidebar({ plan, setPlan, checked, setChecked, setView }: { plan: PlanItem[]; setPlan: React.Dispatch<React.SetStateAction<PlanItem[]>>; checked: string[]; setChecked: React.Dispatch<React.SetStateAction<string[]>>; setView: (view: View) => void }) {
  return <aside className="plan-sidebar"><section><div className="side-heading"><div><span>ΣΗΜΕΡΑ</span><h2>Κοινό πλάνο</h2></div><button onClick={() => setView("plan")}>Όλο το πλάνο <ArrowRight /></button></div><PlanList plan={plan} setPlan={setPlan} /></section><section><div className="side-heading"><div><span>ΑΥΤΟΜΑΤΑ ΑΠΟ ΤΟ ΠΛΑΝΟ</span><h2>Supermarket</h2></div><button onClick={() => setView("shop")}>Όλη η λίστα <ArrowRight /></button></div><ShoppingList checked={checked} setChecked={setChecked} /></section></aside>;
}

function FullPlan({ plan, setPlan }: { plan: PlanItem[]; setPlan: React.Dispatch<React.SetStateAction<PlanItem[]>> }) {
  return <section className="standalone-view"><div className="content-heading"><div><span className="eyebrow">Κοινό πλάνο</span><h1>Τα γεύματά μας</h1><p>Άλλαξε τις μερίδες και η λίστα supermarket ενημερώνεται αυτόματα.</p></div></div><div className="large-panel"><PlanList plan={plan} setPlan={setPlan} full /></div></section>;
}

function FullShop({ checked, setChecked }: { checked: string[]; setChecked: React.Dispatch<React.SetStateAction<string[]>> }) {
  const progress = Math.round(checked.length / shopItems.length * 100);
  return <section className="standalone-view"><div className="content-heading"><div><span className="eyebrow">Από το κοινό πλάνο</span><h1>Supermarket</h1><p>Οι ποσότητες προσαρμόζονται στις μερίδες που έχεις επιλέξει.</p></div><div className="shop-progress"><strong>{checked.length}/{shopItems.length}</strong><span>στο καλάθι</span></div></div><div className="progress"><span style={{ width: `${progress}%` }} /></div><div className="large-panel"><ShoppingList checked={checked} setChecked={setChecked} full /></div></section>;
}

function FridgeView({ onOpen, onAdd }: { onOpen: (r: Recipe) => void; onAdd: (r: Recipe) => void }) {
  const [text, setText] = useState("");
  const [searched, setSearched] = useState(false);
  const result = recipes[2];
  return <section className="fridge-view"><div className="ai-mark"><Sparkles /></div><span className="eyebrow">AI Ψυγείο</span><h1>Τι έχεις στο ψυγείο;</h1><p>Γράψε ελεύθερα τι υλικά έχεις και, αν θέλεις, πόσο χρόνο διαθέτεις.</p><div className="fridge-prompt"><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="π.χ. Έχω κοτόπουλο, 2 πατάτες, λίγο γιαούρτι, ένα λεμόνι και κρεμμύδι. Θέλω κάτι μέχρι 30 λεπτά." /><Button onClick={() => text.trim().length >= 3 && setSearched(true)}><Sparkles /> Βρες τι μπορώ να μαγειρέψω</Button></div>{searched && <div className="ai-results"><div className="understood"><strong>Κατάλαβα:</strong><span>κοτόπουλο</span><span>πατάτες</span><span>γιαούρτι</span><span>λεμόνι</span><small>· AI κατανόηση</small></div><div className="ai-result-head"><h2>Προτάσεις</h2><span>9 αναζητήσεις σήμερα</span></div><article className="ai-card"><FoodVisual recipe={result} /><div><span className="available-tag">Μπορείς να τη φτιάξεις</span><span className="match-tag">94% match</span><h3>{result.title}</h3><p><Clock3 />{result.prep + result.cook}′ συνολικά</p><small>Έχεις όλα τα βασικά υλικά.</small><div><Button variant="outline" onClick={() => onOpen(result)}>Προβολή συνταγής</Button><Button onClick={() => onAdd(result)}><Plus /> Πλάνο</Button></div></div></article></div>}</section>;
}

function RecipeDialog({ recipe, onClose, onAdd }: { recipe: Recipe | null; onClose: () => void; onAdd: (r: Recipe, qty: number) => void }) {
  const [servings, setServings] = useState(1);
  const ingredients = [["Κοτόπουλο", 160, "γρ."], ["Ρύζι μπασμάτι", 60, "γρ."], ["Ελαιόλαδο", 15, "ml"], ["Κρεμμύδι", 40, "γρ."], ["Σκόρδο", .5, "σκελίδες"], ["Τριμμένη ντομάτα / passata", 150, "γρ."]] as const;
  const steps = ["Σκούπισε καλά το κοτόπουλο και αλατοπιπέρωσέ το. Ζέστανε το ελαιόλαδο σε μέτρια προς δυνατή φωτιά.", "Ρόδισε το κοτόπουλο 2–3 λεπτά από κάθε πλευρά και βγάλ’ το προσωρινά σε πιάτο.", "Σόταρε το κρεμμύδι, πρόσθεσε σκόρδο και πελτέ και ανακάτεψε για περίπου ένα λεπτό.", "Πρόσθεσε ντομάτα, δάφνη και νερό. Σιγόβρασε για 25–30 λεπτά.", "Βράσε παράλληλα το ρύζι και σέρβιρε με τη δεμένη σάλτσα."];
  return <Dialog open={!!recipe} onOpenChange={(open) => !open && onClose()}><DialogContent className="recipe-dialog">{recipe && <><div className="dialog-hero"><FoodVisual recipe={recipe} /><span>{recipe.subcategory}</span></div><div className="dialog-content"><DialogHeader><DialogTitle>{recipe.title}</DialogTitle><DialogDescription>{recipe.prep}′ προετοιμασία · {recipe.cook}′ μαγείρεμα</DialogDescription></DialogHeader><div className="servings"><span>Μερίδες</span><div><button onClick={() => setServings(Math.max(.5, servings - .5))}><Minus /></button><strong>{servings}</strong><button onClick={() => setServings(servings + .5)}><Plus /></button></div></div><div className="recipe-detail-columns"><section><h3>Υλικά</h3><ul className="ingredients">{ingredients.map(([name, amount, unit]) => <li key={name}><span>{name}</span><strong>{amount * servings} {unit}</strong></li>)}</ul></section><section><h3>Εκτέλεση</h3><ol>{steps.map((step, i) => <li key={step}><span>{i + 1}</span><p>{step}</p></li>)}</ol></section></div><Button className="add-plan-dialog" onClick={() => { onAdd(recipe, servings); onClose(); }}><Plus /> Στο πλάνο</Button></div></>}</DialogContent></Dialog>;
}

function NewRecipeDialog({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: () => void }) {
  const [ingredients, setIngredients] = useState([0]);
  const [steps, setSteps] = useState([0]);
  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}><DialogContent className="new-recipe-dialog"><DialogHeader><span className="community-tag">Κοινότητας</span><DialogTitle>Νέα συνταγή</DialogTitle><DialogDescription>Η συνταγή θα υποβληθεί για έγκριση πριν εμφανιστεί στην κοινότητα.</DialogDescription></DialogHeader><div className="form-grid"><label className="full"><span>Τίτλος</span><input /></label><label><span>Κατηγορία</span><div className="readonly-input">Μεσημεριανά</div></label><label><span>Υποκατηγορία</span><select><option>Χωρίς υποκατηγορία</option><option>Κοτόπουλο</option><option>Λαδερά & Όσπρια</option><option>Μοσχάρι & Κιμάς</option><option>Ψάρια</option></select></label><label><span>Χρόνος προετοιμασίας</span><div className="input-unit"><input type="number" /><small>λεπτά</small></div></label><label><span>Χρόνος μαγειρέματος</span><div className="input-unit"><input type="number" /><small>λεπτά</small></div></label></div><section className="form-section"><h3>Υλικά</h3><p>Βάλε τις ποσότητες των υλικών για <strong>1 μερίδα</strong>.</p>{ingredients.map((row, i) => <div className="ingredient-row" key={row}><span>{i + 1}.</span><input type="number" placeholder="Ποσότητα" /><select><option>γρ.</option><option>ml</option><option>κ.γ.</option><option>τεμ.</option><option>σκελίδες</option><option>κ.σ.</option><option>φέτες</option><option>πρέζες</option></select><input placeholder="Υλικό" /><button onClick={() => ingredients.length > 1 && setIngredients((list) => list.filter((_, index) => index !== i))}><X /></button></div>)}<Button variant="outline" onClick={() => setIngredients((list) => [...list, Date.now()])}><Plus /> Προσθήκη υλικού</Button></section><section className="form-section"><h3>Βήματα</h3>{steps.map((row, i) => <div className="step-row" key={row}><span>{i + 1}.</span><textarea placeholder={`Γράψε το βήμα ${i + 1}`} /><button onClick={() => steps.length > 1 && setSteps((list) => list.filter((_, index) => index !== i))}><X /></button></div>)}<Button variant="outline" onClick={() => setSteps((list) => [...list, Date.now()])}><Plus /> Προσθήκη βήματος</Button></section><Button className="submit-recipe" onClick={onSubmit}>Υποβολή για έγκριση <ArrowRight /></Button></DialogContent></Dialog>;
}

function AccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}><DialogContent className="account-dialog"><DialogHeader><span className="privacy-tag"><ShieldCheck />Privacy Center</span><DialogTitle>Λογαριασμός & Απόρρητο</DialogTitle><DialogDescription>demo@potandthyme.app</DialogDescription></DialogHeader><div className="account-section"><div className="account-section-title"><CircleUserRound /><div><h3>Στοιχεία λογαριασμού</h3><p>Το όνομα που εμφανίζεται στην εφαρμογή.</p></div></div><label><span>Όνομα</span><input defaultValue="Χρήστης" /></label><Button variant="outline">Αποθήκευση ονόματος</Button></div><div className="account-section"><div className="account-section-title"><KeyRound /><div><h3>Αλλαγή κωδικού</h3><p>Για ασφάλεια χρειάζεται πρώτα ο τρέχων κωδικός.</p></div></div><div className="password-grid"><label><span>Τρέχων κωδικός</span><input type="password" /></label><label><span>Νέος κωδικός</span><input type="password" /></label><label><span>Επιβεβαίωση νέου κωδικού</span><input type="password" /></label></div><Button variant="outline">Αλλαγή κωδικού</Button></div><div className="account-section account-inline"><div className="account-section-title"><Download /><div><h3>Τα δεδομένα σου</h3><p>Κατέβασε σε JSON τα δεδομένα του λογαριασμού.</p></div></div><Button variant="outline">Εξαγωγή δεδομένων</Button></div><div className="account-section account-inline"><div className="account-section-title"><FileText /><div><h3>Νομικά κείμενα</h3><p><a href="#">Όροι Χρήσης</a> · <a href="#">Πολιτική Απορρήτου</a> · <a href="#">Cookies & Τοπική Αποθήκευση</a></p></div></div></div><div className="account-section danger-section"><div className="account-section-title"><Trash2 /><div><h3>Διαγραφή λογαριασμού</h3><p>Η διαγραφή είναι μόνιμη.</p></div></div><label><span>Γράψε ΔΙΑΓΡΑΦΗ για επιβεβαίωση</span><input /></label><Button variant="outline">Διαγραφή λογαριασμού</Button></div></DialogContent></Dialog>;
}

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [view, setView] = useState<View>("recipes");
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [plan, setPlan] = useState<PlanItem[]>([
    { key: 101, recipe: recipes[6], qty: 1 }, { key: 102, recipe: recipes[0], qty: 1 },
    { key: 103, recipe: recipes[1], qty: 1 }, { key: 104, recipe: recipes[2], qty: 1 },
  ]);
  const [checked, setChecked] = useState<string[]>(["Λεμόνι", "Ρύζι μπασμάτι"]);
  const addToPlan = (recipe: Recipe, qty = 1) => { setPlan((current) => [...current, { key: Date.now(), recipe, qty }]); setNotice(`Η συνταγή «${recipe.title}» προστέθηκε στο πλάνο.`); setTimeout(() => setNotice(""), 2600); };
  const mainView = useMemo(() => { if (view === "recipes") return <RecipeCatalog onOpen={setSelected} onAdd={addToPlan} onNew={() => setNewOpen(true)} />; if (view === "plan") return <FullPlan plan={plan} setPlan={setPlan} />; if (view === "shop") return <FullShop checked={checked} setChecked={setChecked} />; return <FridgeView onOpen={setSelected} onAdd={addToPlan} />; }, [view, plan, checked]);
  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  return <div className="app-shell"><AppSidebar view={view} setView={setView} /><div className="app-main"><Header view={view} setView={setView} onAccount={() => setAccountOpen(true)} onLogout={() => setLoggedIn(false)} /><div className="app-body"><WorkspaceBar notice={notice} /><div className="workspace-layout"><main>{mainView}</main>{view !== "plan" && view !== "shop" && <PlanSidebar plan={plan} setPlan={setPlan} checked={checked} setChecked={setChecked} setView={setView} />}</div></div></div><nav className="mobile-nav">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={cn(view === id && "active")} onClick={() => setView(id)}><Icon /><span>{label}</span></button>)}</nav><RecipeDialog recipe={selected} onClose={() => setSelected(null)} onAdd={addToPlan} /><NewRecipeDialog open={newOpen} onClose={() => setNewOpen(false)} onSubmit={() => { setNewOpen(false); setNotice("Η συνταγή υποβλήθηκε για έγκριση."); setTimeout(() => setNotice(""), 2600); }} /><AccountDialog open={accountOpen} onClose={() => setAccountOpen(false)} /></div>;
}
