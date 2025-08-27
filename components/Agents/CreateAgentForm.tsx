import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createAgentSchema, type CreateAgentFormData } from "./schemas";
import { useAgentData } from "./useAgentData";

interface CreateAgentFormProps {
  onSubmit: (values: CreateAgentFormData) => void;
}

const CreateAgentForm = ({ onSubmit }: CreateAgentFormProps) => {
  const { tags } = useAgentData();
  const form = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      title: "",
      description: "",
      prompt: "",
      tags: [],
      isPrivate: false,
    },
  });

  const selectedTags = form.watch("tags") ?? [];

  const toggleTag = (tag: string) => {
    const current = form.getValues("tags") ?? [];
    const next = current.includes(tag)
      ? current.filter((t: string) => t !== tag)
      : [...current, tag];
    form.setValue("tags", next, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter agent title"
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-500">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter agent description"
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Enter agent prompt"
          {...form.register("prompt")}
        />
        {form.formState.errors.prompt && (
          <p className="text-sm text-red-500">
            {form.formState.errors.prompt.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-2" id="tags">
          {tags.filter((t) => t !== "Recommended").map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => toggleTag(tag)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleTag(tag);
                  }
                }}
                className={
                  isSelected
                    ? "cursor-pointer select-none rounded-full"
                    : "cursor-pointer select-none rounded-full bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50"
                }
                variant={isSelected ? "default" : "outline"}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
        {form.formState.errors.tags && (
          <p className="text-sm text-red-500">
            {form.formState.errors.tags.message as string}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isPrivate"
          checked={form.watch("isPrivate")}
          onCheckedChange={(checked) => form.setValue("isPrivate", checked)}
        />
        <Label htmlFor="isPrivate">Private</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" size="sm" className="rounded-xl">
          Create Agent
        </Button>
      </div>
    </form>
  );
};

export default CreateAgentForm;
