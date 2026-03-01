import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tags, Save, Plus, Trash2, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

// Backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

type CategoryBudget = {
    name: string;
    amount: number;
};

// Default fallback categories if nothing exists
const defaultCategories = [
    "Rent & Housing",
    "Food & Dining",
    "Shopping",
    "Transport",
    "Entertainment"
];

const CategoriesPage = () => {
    const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editAmount, setEditAmount] = useState<string>("");
    const { toast } = useToast();
    const { session } = useAuth();

    useEffect(() => {
        fetchBudgets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/categories/budgets`, {
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const savedBudgets = data.category_budgets || {};

                // Convert dictionary to array
                let initialBudgets = Object.entries(savedBudgets).map(([name, amount]) => ({
                    name,
                    amount: amount as number
                }));

                // If completely empty, populate with some defaults at 0
                if (initialBudgets.length === 0) {
                    initialBudgets = defaultCategories.map(name => ({ name, amount: 0 }));
                }

                setBudgets(initialBudgets);
            }
        } catch (error) {
            console.error("Failed to fetch budgets:", error);
            toast({
                title: "Error loading budgets",
                description: "Could not connect to the server.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            // Convert array back to dictionary for the backend
            const payload: Record<string, number> = {};
            budgets.forEach(b => {
                payload[b.name] = b.amount;
            });

            const response = await fetch(`${API_BASE_URL}/categories/budgets`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast({
                    title: "Budgets Saved",
                    description: "Your manual category limits have been updated.",
                });
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Failed to save budgets:", error);
            toast({
                title: "Error saving budgets",
                description: "Please check your connection and try again.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const startEditing = (index: number, amount: number) => {
        setEditingIndex(index);
        setEditAmount(amount.toString());
    };

    const saveEditing = (index: number) => {
        const newAmount = parseFloat(editAmount) || 0;
        const newBudgets = [...budgets];
        newBudgets[index].amount = newAmount;
        setBudgets(newBudgets);
        setEditingIndex(null);
    };

    const addNewCategory = () => {
        const name = prompt("Enter new category name:");
        if (name && name.trim() !== "") {
            // Don't add duplicates
            if (budgets.some(b => b.name.toLowerCase() === name.toLowerCase())) {
                toast({ title: "Category already exists", variant: "destructive" });
                return;
            }
            setBudgets([...budgets, { name: name.trim(), amount: 0 }]);
        }
    };

    const removeCategory = (index: number) => {
        const newBudgets = [...budgets];
        newBudgets.splice(index, 1);
        setBudgets(newBudgets);
    };

    if (loading) {
        return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading specific financial insights...</div>;
    }

    const totalBudget = budgets.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">Category Budgets</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manually set spending limits for specific transaction categories.
                    </p>
                </div>
                <Button onClick={handleSaveAll} disabled={saving} className="flex items-center gap-2">
                    {saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-2 bg-card rounded-lg border border-border shadow-card overflow-hidden"
                >
                    <div className="p-4 border-b border-border bg-secondary/30 flex justify-between items-center">
                        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                            <Tags size={16} className="text-primary" /> Tracked Limits
                        </h3>
                        <Button variant="ghost" size="sm" onClick={addNewCategory} className="h-8 text-xs flex items-center gap-1">
                            <Plus size={14} /> Add Category
                        </Button>
                    </div>

                    <div className="divide-y divide-border">
                        {budgets.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No categories defined yet.
                            </div>
                        ) : (
                            budgets.map((budget, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                                    <div className="font-medium text-foreground">{budget.name}</div>

                                    <div className="flex items-center gap-4">
                                        {editingIndex === index ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">₹</span>
                                                <input
                                                    type="number"
                                                    value={editAmount}
                                                    onChange={(e) => setEditAmount(e.target.value)}
                                                    className="w-24 bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                    autoFocus
                                                    onKeyDown={(e) => e.key === 'Enter' && saveEditing(index)}
                                                />
                                                <button onClick={() => saveEditing(index)} className="p-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20">
                                                    <Check size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <span className="font-semibold text-foreground">
                                                    ₹{budget.amount.toLocaleString("en-IN")}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => startEditing(index, budget.amount)}
                                                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeCategory(index)}
                                                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="bg-card rounded-lg border border-border p-5 shadow-card">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Allocated</h3>
                        <div className="text-3xl font-display font-bold text-foreground mb-4">
                            ₹{totalBudget.toLocaleString("en-IN")}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            This is the sum of all your manual category budgets. This does not necessarily equal your total <i>Monthly Budget</i> set during onboarding.
                        </p>
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-5 border border-border">
                        <h4 className="font-display text-sm font-semibold text-foreground mb-2">How this works</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            When our AI processes your bank statements, it categorizes each transaction.
                            <br /><br />
                            If spending in a specific category exceeds the limit you define here, it will trigger an anomaly and alert you in the AI Chat.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CategoriesPage;
