import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";

export function AddCategoryDialog() {
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const response =  await axios.post("https://medimart-nayg.onrender.com/category/addOrUpdateCategory",{name:categoryName});
    console.log("addcategory respnse ", response)
    console.log("Adding category:", categoryName);
    setCategoryName("");
    setOpen(false);
  };

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add Category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your items.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-sm font-medium">
              Category Name
            </Label>
            <Input
              id="categoryName"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
              disabled={!categoryName.trim()}
            >
              Add Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}