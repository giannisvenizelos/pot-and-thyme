"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
  Fish,
  Leaf,
  Loader2,
  Minus,
  Plus,
  Refrigerator,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
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
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type View = "recipes" | "plan" | "shop" | "fridge";
type Meal = "Πρωινά" | "Μεσημεριανά" | "Βραδινά" | "Σνακ";

type Recipe = {
  id: number;
  meal: string;
  subcategory: string | null;
  title: string;
  prep_minutes: number | null;
  cook_minutes: number | null;
  photo_url: string | null;
  servings: number | string | null;
  recipe_origin?: string;
  moderation_status?: string;
};

type Ingredient = {
  id: number;
  item: string;
  qty_min: number | null;
  qty_max: number | null;
  unit: string;
  raw: string;
  position: number;
};

type RecipeStep = { id: number; instruction: string; position: number };

type PlanItem = {
  id: string;
  household_id: string;
  plan_date: string;
  meal_slot: string;
  recipe_id: number;
  servings: number;
  title: string;
  meal: string;
};

type ShoppingItem = {
  item_key: string;
  item: string;
  unit: string;
  qty_min: number | null;
  qty_max: number | null;
  checked: boolean;
};

type Household = { id: string; name: string; invite_code: string };
type Bootstrap = { household: Household | null; plan: PlanItem[]; shopping: ShoppingItem[]; is_admin: boolean };
type FridgeMatch = Recipe & { matched_ingredients: number; missing_count: number; match_percent: number; matched: string[]; missing: string[] };

const navItems = [
  { id: "recipes" as const, label: "Συνταγές", icon: ChefHat },
  { id: "plan" as const, label: "Πλάνο", icon: ClipboardCheck },
  { id: "shop" as const, label: "Supermarket", icon: ShoppingBasket },
  { id: "fridge" as const, label: "AI Ψυγείο", icon: Refrigerator },
];

const mealTabs: Meal[] = ["Πρωινά", "Μεσημεριανά", "Βραδινά", "Σνακ"];

function normalizeMeal(meal: string): Meal {
  const value = meal.toLowerCase();
  if (value.includes("πρω")) return "Πρωινά";
  if (value.includes("βρα")) return "Βραδινά";
  if (value.includes("σνα")) return "Σνακ";
  return "Μεσημεριανά";
}

function mealSlot(meal: string) {
  const normalized = normalizeMeal(meal);
  return normalized === "Πρωινά" ? "Πρωινό" : normalized === "Βραδινά" ? "Βραδινό" : normalized === "Σνακ" ? "Σνακ" : "Μεσημεριανό";
}

function Brand({ login = false }: { login?: boolean }) {
  return (
    <div className={cn("brand", login && "brand-login")}>
      <img src="/assets/pot-thyme-logo.svg" alt="Pot & Thyme" />
      <div><strong>Pot & Thyme</strong><span>TEST</span></div>
    </div>
  );
}

function LoginScreen({ onAuthenticated }: { onAuthenticated: () => Promise<void> }) {
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    setMessage("");
    if (!email.trim() || password.length < 6) {
      setMessage("Συμπλήρωσε έγκυρο email και κωδικό τουλάχιστον 6 χαρακτήρων.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        await onAuthenticated();
      } else {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        if (data.session) await onAuthenticated();
        else setMessage("Ο λογαριασμός δημιουργήθηκε. Έλεγξε το email σου για επιβεβαίωση.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Δεν ολοκληρώθηκε η σύνδεση.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-story">
        <Brand login />
        <div><span className="kicker-light">Food planning, made lighter</span><h1>Οργάνωσε το φαγητό σου, χωρίς να οργανώνεται όλη η ζωή σου γύρω από αυτό.</h1><p>Συνταγές, κοινό πλάνο και λίστα supermarket σε ένα ήρεμο, πρακτικό μέρος.</p></div>
        <div className="login-food"><img src="/assets/lemon-chicken.svg" alt="Σπιτικό φαγητό" /><span>Απλό φαγητό. Λιγότερες αποφάσεις.</span></div>
      </section>
      <section className="login-panel"><div className="login-form">
        <span className="eyebrow">{mode === "login" ? "Καλώς ήρθες ξανά" : "Νέος λογαριασμός"}</span>
        <h2>{mode === "login" ? "Σύνδεση" : "Δημιουργία λογαριασμού"}</h2>
        <p>{mode === "login" ? "Συνδέσου στο πραγματικό σου πλάνο." : "Χρησιμοποίησε το email σου για να ξεκινήσεις."}</p>
        <label><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" /></label>
        <label><span>Κωδικός</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Τουλάχιστον 6 χαρακτήρες" onKeyDown={(e) => e.key === "Enter" && submit()} /></label>
        {message && <p className="notice">{message}</p>}
        <Button onClick={submit} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <ArrowRight />}{mode === "login" ? "Σύνδεση" : "Δημιουργία λογαριασμού"}</Button>
        <button className="switch-auth" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>{mode === "login" ? "Δημιουργία λογαριασμού" : "Έχω ήδη λογαριασμό"}</button>
      </div></section>
    </main>
  );
}

function AppSidebar({ view, setView }: { view: View; setView: (view: View) => void }) {
  return <aside className="app-sidebar"><Brand /><nav aria-label="Κύρια πλοήγηση">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={cn(view === id && "active")} onClick={() => setView(id)}><Icon size={19} /><span>{label}</span></button>)}</nav><div className="sidebar-footer"><Leaf size={17} /><span>Λιγότερη σκέψη.<br />Περισσότερος χρόνος.</span></div></aside>;
}

function Header({ view, setView, onLogout, email }: { view: View; setView: (view: View) => void; onLogout: () => void; email: string }) {
  return <header className="app-header"><div className="mobile-logo"><img src="/assets/pot-thyme-logo.svg" alt="" /><strong>{navItems.find((item) => item.id === view)?.label}</strong></div><div className="header-title"><span>Συνδεδεμένος χρήστης</span><strong>{email}</strong></div><div className="header-actions"><Button variant="outline" onClick={() => setView(view === "fridge" ? "recipes" : "fridge")}>{view === "fridge" ? <ArrowLeft /> : <Sparkles />}{view === "fridge" ? "Συνταγές" : "AI Ψυγείο"}</Button><button className="account-button"><CircleUserRound /><span>Λογαριασμός</span></button><button className="logout-button" onClick={onLogout} aria-label="Αποσύνδεση"><DoorOpen /></button></div></header>;
}

function WorkspaceBar({ household, notice, isAdmin }: { household: Household | null; notice: string; isAdmin: boolean }) {
  const [copied, setCopied] = useState(false);
  return <><section className="workspace-bar"><div className="workspace-name"><UsersRound /><span><small>Κοινό πλάνο</small><strong>{household?.name ?? "Δεν έχει δημιουργηθεί household"}</strong></span></div><div className="invite-code"><span><small>Κωδικός πρόσκλησης</small><strong>{household?.invite_code ?? "—"}</strong></span><button disabled={!household} onClick={() => { if (!household) return; navigator.clipboard.writeText(household.invite_code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}>{copied ? <Check /> : <Copy />}{copied ? "Αντιγράφηκε" : "Αντιγραφή"}</button></div><div className="approval-status"><ShieldCheck /><span><small>Ρόλος</small><strong>{isAdmin ? "Διαχειριστής" : "Μέλος"}</strong></span><ChevronDown /></div></section>{notice && <div className="notice"><Check size={17} />{notice}</div>}</>;
}

function FoodVisual({ recipe }: { recipe: Recipe }) {
  const sub = recipe.subcategory ?? "";
  const Icon = sub.includes("Ψάρ") ? Fish : sub.includes("Όσπ") || sub.includes("Λαδε") ? Leaf : UtensilsCrossed;
  const image = recipe.photo_url?.startsWith("http") || recipe.photo_url?.startsWith("/") ? recipe.photo_url : null;
  return image ? <Image className="food-visual" src={image} alt={recipe.title} width={900} height={700} unoptimized={image.startsWith("http")} /> : <div className="food-visual food-placeholder tone-sage"><Icon /></div>;
}

function RecipeCatalog({ recipes, onOpen, onAdd, loading }: { recipes: Recipe[]; onOpen: (r: Recipe) => void; onAdd: (r: Recipe) => void; loading: boolean }) {
  const [meal, setMeal] = useState<Meal>("Μεσημεριανά");
  const [query, setQuery] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const filteredByMeal = recipes.filter((r) => normalizeMeal(r.meal) === meal);
  const subcategories = [...new Set(filteredByMeal.map((r) => r.subcategory).filter(Boolean))] as string[];
  const filtered = filteredByMeal.filter((r) => (!subcategory || r.subcategory === subcategory) && r.title.toLowerCase().includes(query.toLowerCase()));
  return <section className="catalog"><div className="meal-tabs" role="tablist">{mealTabs.map((item) => <button role="tab" aria-selected={meal === item} className={cn(meal === item && "active")} key={item} onClick={() => { setMeal(item); setSubcategory(""); }}>{item}</button>)}</div><div className="catalog-tools"><label className="search-field"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Αναζήτηση" /></label><label className="select-field"><Settings2 /><select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}><option value="">Όλες οι κατηγορίες</option>{subcategories.map((s) => <option key={s}>{s}</option>)}</select></label></div><div className="content-heading"><div><span className="eyebrow">Βιβλιοθήκη Supabase</span><h1>{meal}</h1><p>{loading ? "Φόρτωση…" : `${filtered.length} συνταγές διαθέσιμες`}</p></div></div>{loading ? <div className="empty-state"><Loader2 className="animate-spin" /><h3>Φόρτωση συνταγών</h3></div> : filtered.length ? <div className="recipe-grid">{filtered.map((recipe) => <article className="recipe-card" key={recipe.id}><FoodVisual recipe={recipe} /><div className="recipe-info"><span className="recipe-tag">{recipe.subcategory || "Χωρίς υποκατηγορία"}</span><h3>{recipe.title}</h3><p><Clock3 />{(recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0)}′ συνολικά</p><div className="recipe-actions"><Button variant="outline" onClick={() => onOpen(recipe)}>Προβολή συνταγής</Button><Button onClick={() => onAdd(recipe)}><Plus /> Πλάνο</Button></div></div></article>)}</div> : <div className="empty-state"><Search /><h3>Δεν βρέθηκε συνταγή</h3><p>Δοκίμασε διαφορετική αναζήτηση ή κατηγορία.</p></div>}</section>;
}

function PlanList({ plan, onRemove, onChangeQty, full = false }: { plan: PlanItem[]; onRemove: (id: string) => void; onChangeQty: (id: string, qty: number) => void; full?: boolean }) {
  return <div className={cn("plan-list", full && "plan-list-full")}>{plan.length ? plan.map((item) => <article className="plan-item" key={item.id}><div className="plan-thumb tone-sage"><ChefHat /></div><div className="plan-copy"><strong>{item.title}</strong><span>{item.meal_slot} · {item.plan_date}</span></div><div className="qty-control"><button onClick={() => onChangeQty(item.id, Math.max(.5, Number(item.servings) - .5))}><Minus /></button><strong>{Number(item.servings)}</strong><button onClick={() => onChangeQty(item.id, Number(item.servings) + .5)}><Plus /></button></div><button className="remove-item" onClick={() => onRemove(item.id)}><X /></button></article>) : <div className="empty-small"><ClipboardCheck /><span>Δεν έχεις γεύματα ακόμη.</span></div>}</div>;
}

function ShoppingList({ items, onToggle, full = false }: { items: ShoppingItem[]; onToggle: (item: ShoppingItem) => void; full?: boolean }) {
  const visible = full ? items : items.slice(0, 8);
  return <div className={cn("shop-list", full && "shop-list-full")}>{visible.map((item) => <label key={item.item_key} className={cn(item.checked && "done")}><Checkbox checked={item.checked} onCheckedChange={() => onToggle(item)} /><span><strong>{item.item}</strong><small>{formatQty(item)}</small></span></label>)}</div>;
}

function formatQty(item: ShoppingItem) {
  const min = item.qty_min ?? 0;
  const max = item.qty_max ?? min;
  const qty = min === max ? `${min}` : `${min}–${max}`;
  return `${qty} ${item.unit}`.trim();
}

function RecipeDialog({ recipe, ingredients, steps, loading, onClose, onAdd }: { recipe: Recipe | null; ingredients: Ingredient[]; steps: RecipeStep[]; loading: boolean; onClose: () => void; onAdd: (r: Recipe, qty: number) => void }) {
  const [servings, setServings] = useState(1);
  useEffect(() => setServings(Number(recipe?.servings || 1)), [recipe?.id, recipe?.servings]);
  return <Dialog open={!!recipe} onOpenChange={(open) => !open && onClose()}><DialogContent className="recipe-dialog">{recipe && <><div className="dialog-hero"><FoodVisual recipe={recipe} /><span>{recipe.subcategory || "Συνταγή"}</span></div><div className="dialog-content"><DialogHeader><DialogTitle>{recipe.title}</DialogTitle><DialogDescription>{recipe.prep_minutes ?? 0}′ προετοιμασία · {recipe.cook_minutes ?? 0}′ μαγείρεμα</DialogDescription></DialogHeader><div className="servings"><span>Μερίδες</span><div><button onClick={() => setServings(Math.max(.5, servings - .5))}><Minus /></button><strong>{servings}</strong><button onClick={() => setServings(servings + .5)}><Plus /></button></div></div>{loading ? <div className="empty-small"><Loader2 className="animate-spin" /><span>Φόρτωση συνταγής…</span></div> : <div className="recipe-detail-columns"><section><h3>Υλικά</h3><ul className="ingredients">{ingredients.map((i) => <li key={i.id}><span>{i.item}</span><strong>{formatIngredient(i, servings, Number(recipe.servings || 1))}</strong></li>)}</ul></section><section><h3>Εκτέλεση</h3><ol>{steps.map((step, index) => <li key={step.id}><span>{index + 1}</span><p>{step.instruction}</p></li>)}</ol></section></div>}<Button className="add-plan-dialog" onClick={() => { onAdd(recipe, servings); onClose(); }}><Plus /> Στο πλάνο</Button></div></>}</DialogContent></Dialog>;
}

function formatIngredient(i: Ingredient, servings: number, base: number) {
  if (i.qty_min == null) return i.raw || i.item;
  const factor = servings / Math.max(base, .5);
  const min = Number(i.qty_min) * factor;
  const max = Number(i.qty_max ?? i.qty_min) * factor;
  const value = min === max ? trimNumber(min) : `${trimNumber(min)}–${trimNumber(max)}`;
  return `${value} ${i.unit}`.trim();
}

function trimNumber(value: number) { return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, ""); }

function FridgeView({ results, onSearch, onOpen, onAdd, busy }: { results: FridgeMatch[]; onSearch: (text: string) => void; onOpen: (r: Recipe) => void; onAdd: (r: Recipe) => void; busy: boolean }) {
  const [text, setText] = useState("");
  return <section className="fridge-view"><div className="ai-mark"><Sparkles /></div><span className="eyebrow">AI Ψυγείο</span><h1>Τι έχεις στο ψυγείο;</h1><p>Γράψε υλικά χωρισμένα με κόμμα. Η αναζήτηση γίνεται στη βάση των πραγματικών συνταγών.</p><div className="fridge-prompt"><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="π.χ. κοτόπουλο, πατάτες, γιαούρτι, λεμόνι" /><Button disabled={busy} onClick={() => text.trim().length >= 2 && onSearch(text)}>{busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Βρες τι μπορώ να μαγειρέψω</Button></div>{results.length > 0 && <div className="ai-results"><div className="ai-result-head"><h2>Προτάσεις</h2><span>{results.length} αποτελέσματα</span></div>{results.slice(0, 6).map((result) => <article className="ai-card" key={result.id}><FoodVisual recipe={result} /><div><span className="available-tag">{result.missing_count === 0 ? "Έχεις τα βασικά" : `${result.missing_count} υλικά λείπουν`}</span><span className="match-tag">{result.match_percent}% match</span><h3>{result.title}</h3><p><Clock3 />{(result.prep_minutes ?? 0) + (result.cook_minutes ?? 0)}′ συνολικά</p><div><Button variant="outline" onClick={() => onOpen(result)}>Προβολή συνταγής</Button><Button onClick={() => onAdd(result)}><Plus /> Πλάνο</Button></div></div></article>)}</div>}</section>;
}

export default function HomePage() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [view, setView] = useState<View>("recipes");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [bootstrap, setBootstrap] = useState<Bootstrap>({ household: null, plan: [], shopping: [], is_admin: false });
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [fridgeResults, setFridgeResults] = useState<FridgeMatch[]>([]);
  const [fridgeBusy, setFridgeBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const flash = useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }, []);

  const loadRecipes = useCallback(async () => {
    setRecipesLoading(true);
    const { data, error } = await supabase.from("recipes").select("id,meal,subcategory,title,prep_minutes,cook_minutes,photo_url,servings,recipe_origin,moderation_status").order("id");
    if (!error) setRecipes((data ?? []) as Recipe[]);
    else flash(`Σφάλμα συνταγών: ${error.message}`);
    setRecipesLoading(false);
  }, [supabase, flash]);

  const loadBootstrap = useCallback(async () => {
    const { data, error } = await supabase.rpc("get_app_bootstrap");
    if (error) {
      flash(`Σφάλμα πλάνου: ${error.message}`);
      return;
    }
    setBootstrap(data as Bootstrap);
  }, [supabase, flash]);

  const refreshAuth = useCallback(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);
    setAuthReady(true);
    if (currentUser) await Promise.all([loadRecipes(), loadBootstrap()]);
  }, [supabase, loadRecipes, loadBootstrap]);

  useEffect(() => {
    refreshAuth();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) Promise.all([loadRecipes(), loadBootstrap()]);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase, refreshAuth, loadRecipes, loadBootstrap]);

  const openRecipe = async (recipe: Recipe) => {
    setSelected(recipe);
    setDetailLoading(true);
    const [ingredientResult, stepResult] = await Promise.all([
      supabase.from("recipe_ingredients").select("id,item,qty_min,qty_max,unit,raw,position").eq("recipe_id", recipe.id).order("position"),
      supabase.from("recipe_steps").select("id,instruction,position").eq("recipe_id", recipe.id).order("position"),
    ]);
    setIngredients((ingredientResult.data ?? []) as Ingredient[]);
    setSteps((stepResult.data ?? []) as RecipeStep[]);
    if (ingredientResult.error || stepResult.error) flash("Δεν φορτώθηκαν όλα τα στοιχεία της συνταγής.");
    setDetailLoading(false);
  };

  const addToPlan = async (recipe: Recipe, servings = 1) => {
    if (!user || !bootstrap.household) { flash("Χρειάζεται household πριν προστεθεί γεύμα στο πλάνο."); return; }
    const { error } = await supabase.from("meal_plan").insert({
      household_id: bootstrap.household.id,
      user_id: user.id,
      plan_date: new Date().toISOString().slice(0, 10),
      meal_slot: mealSlot(recipe.meal),
      recipe_id: recipe.id,
      servings,
    });
    if (error) flash(`Δεν προστέθηκε: ${error.message}`);
    else { flash(`Η συνταγή «${recipe.title}» προστέθηκε στο πλάνο.`); await loadBootstrap(); }
  };

  const removePlan = async (id: string) => {
    const { error } = await supabase.rpc("remove_meal_plan_item", { p_id: id });
    if (error) flash(error.message); else await loadBootstrap();
  };

  const changeQty = async (id: string, servings: number) => {
    const { error } = await supabase.from("meal_plan").update({ servings }).eq("id", id);
    if (error) flash(error.message); else await loadBootstrap();
  };

  const toggleShopping = async (item: ShoppingItem) => {
    if (!user || !bootstrap.household) return;
    const { error } = await supabase.from("shopping_checks").upsert({ household_id: bootstrap.household.id, item_key: item.item_key, checked: !item.checked, updated_by: user.id, updated_at: new Date().toISOString() });
    if (error) flash(error.message); else await loadBootstrap();
  };

  const searchFridge = async (text: string) => {
    setFridgeBusy(true);
    const ingredientsInput = text.split(/[,\n]/).map((x) => x.trim().toLowerCase()).filter(Boolean).slice(0, 20);
    const { data, error } = await supabase.rpc("match_fridge_recipes", { p_ingredients: ingredientsInput, p_max_minutes: null, p_limit: 12 });
    if (error) flash(error.message); else setFridgeResults((data ?? []) as FridgeMatch[]);
    setFridgeBusy(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBootstrap({ household: null, plan: [], shopping: [], is_admin: false });
  };

  if (!authReady) return <main className="login-shell"><section className="login-panel"><div className="login-form"><Loader2 className="animate-spin" /><h2>Φόρτωση εφαρμογής…</h2></div></section></main>;
  if (!user) return <LoginScreen onAuthenticated={refreshAuth} />;

  const mainView = view === "recipes" ? <RecipeCatalog recipes={recipes} onOpen={openRecipe} onAdd={(r) => addToPlan(r)} loading={recipesLoading} />
    : view === "plan" ? <section className="standalone-view"><div className="content-heading"><div><span className="eyebrow">Πραγματικό κοινό πλάνο</span><h1>Τα γεύματά μας</h1><p>Τα δεδομένα αποθηκεύονται στο Supabase.</p></div></div><div className="large-panel"><PlanList plan={bootstrap.plan ?? []} onRemove={removePlan} onChangeQty={changeQty} full /></div></section>
    : view === "shop" ? <section className="standalone-view"><div className="content-heading"><div><span className="eyebrow">Από το πραγματικό πλάνο</span><h1>Supermarket</h1><p>Η λίστα υπολογίζεται από τα υλικά των γευμάτων σου.</p></div><div className="shop-progress"><strong>{(bootstrap.shopping ?? []).filter((x) => x.checked).length}/{(bootstrap.shopping ?? []).length}</strong><span>στο καλάθι</span></div></div><div className="large-panel"><ShoppingList items={bootstrap.shopping ?? []} onToggle={toggleShopping} full /></div></section>
    : <FridgeView results={fridgeResults} onSearch={searchFridge} onOpen={openRecipe} onAdd={(r) => addToPlan(r)} busy={fridgeBusy} />;

  return <div className="app-shell"><AppSidebar view={view} setView={setView} /><div className="app-main"><Header view={view} setView={setView} onLogout={logout} email={user.email ?? "Χρήστης"} /><div className="app-body"><WorkspaceBar household={bootstrap.household} notice={notice} isAdmin={bootstrap.is_admin} /><div className="workspace-layout"><main>{mainView}</main>{view !== "plan" && view !== "shop" && <aside className="plan-sidebar"><section><div className="side-heading"><div><span>SUPABASE</span><h2>Κοινό πλάνο</h2></div><button onClick={() => setView("plan")}>Όλο το πλάνο <ArrowRight /></button></div><PlanList plan={bootstrap.plan ?? []} onRemove={removePlan} onChangeQty={changeQty} /></section><section><div className="side-heading"><div><span>ΑΥΤΟΜΑΤΑ ΑΠΟ ΤΟ ΠΛΑΝΟ</span><h2>Supermarket</h2></div><button onClick={() => setView("shop")}>Όλη η λίστα <ArrowRight /></button></div><ShoppingList items={bootstrap.shopping ?? []} onToggle={toggleShopping} /></section></aside>}</div></div></div><nav className="mobile-nav">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={cn(view === id && "active")} onClick={() => setView(id)}><Icon /><span>{label}</span></button>)}</nav><RecipeDialog recipe={selected} ingredients={ingredients} steps={steps} loading={detailLoading} onClose={() => setSelected(null)} onAdd={addToPlan} /></div>;
}
