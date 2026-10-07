"use client";

import { useState, useRef } from "react";
import { Plus, Edit2, Trash2, UploadCloud, X, FileImage, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";

type Car = {
  id: string;
  name: string;
  category: string;
  price: number;
  status: "Available" | "Rented" | "Maintenance";
  image?: string;
};

const initialCars: Car[] = [
  { id: "1", name: "Toyota Corolla", category: "Economy", price: 45, status: "Available" },
  { id: "2", name: "Mazda CX-5", category: "SUV", price: 75, status: "Rented" },
  { id: "3", name: "Kia Carnival", category: "People Mover", price: 110, status: "Available" },
  { id: "4", name: "Ford Ranger", category: "Ute", price: 90, status: "Maintenance" },
];

export default function FleetManagementPage() {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<Car, "id">>({
    name: "",
    category: "",
    price: 0,
    status: "Available",
    image: "",
  });

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleOpenCreate = () => {
    setEditingCar(null);
    setFormData({ name: "", category: "", price: 0, status: "Available", image: "" });
    setUploadProgress(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      category: car.category,
      price: car.price,
      status: car.status,
      image: car.image || "",
    });
    setUploadProgress(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      setCars(cars.filter((c) => c.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar) {
      setCars(cars.map((c) => (c.id === editingCar.id ? { ...c, ...formData } : c)));
    } else {
      const newCar: Car = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setCars([...cars, newCar]);
    }
    setIsDialogOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) {
          clearInterval(interval);
          return null;
        }
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(null);
            setFormData(prevData => ({ ...prevData, image: URL.createObjectURL(file) }));
          }, 500); // Slight delay at 100% for smooth UX
          return 100;
        }
        // Random increment between 5 and 15
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 150);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: "" }));
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your vehicles, categories, and availability.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="size-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Vehicle Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price / Day</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      {car.image ? (
                        <img src={car.image} alt={car.name} className="w-10 h-10 rounded-md object-cover border" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center border">
                          <CarIcon />
                        </div>
                      )}
                      <span>{car.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{car.category}</td>
                  <td className="px-6 py-4 font-medium">${car.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        car.status === "Available"
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : car.status === "Rented"
                          ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                          : "bg-red-50 text-red-700 ring-red-600/20"
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(car)}>
                        <Edit2 className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(car.id)}>
                        <Trash2 className="size-4 text-destructive/70 hover:text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No vehicles found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCar ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            <DialogDescription>
              {editingCar ? "Update the details of the selected vehicle." : "Fill out the form to add a new vehicle to your fleet."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="mt-4 space-y-5">
            {/* Modern Image Uploader */}
            <div className="space-y-2">
              <Label>Vehicle Image</Label>
              
              {!formData.image && uploadProgress === null && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors group"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <UploadCloud className="size-5" />
                  </div>
                  <p className="text-sm font-medium mt-2">Click to upload image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              )}

              {uploadProgress !== null && (
                <div className="border rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <FileImage className="size-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center text-sm font-medium mb-1">
                        <span>Uploading...</span>
                        <span className="text-muted-foreground">{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-150 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.image && uploadProgress === null && (
                <div className="relative border rounded-xl overflow-hidden group aspect-video">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={removeImage}
                      className="gap-2"
                    >
                      <Trash2 className="size-4" />
                      Remove Image
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="size-3" />
                    Uploaded
                  </div>
                </div>
              )}

              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Toyota Camry"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Economy">Economy</option>
                  <option value="Compact">Compact</option>
                  <option value="Mid-Size">Mid-Size</option>
                  <option value="SUV">SUV</option>
                  <option value="People Mover">People Mover</option>
                  <option value="Ute">Ute</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price Per Day ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  required
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Car["status"] })}
              >
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCar ? "Save Changes" : "Add Vehicle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple fallback icon for cars without images
function CarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
    </svg>
  );
}
