import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateAgentFormData } from "./schemas";

interface FormFieldsProps {
  form: UseFormReturn<CreateAgentFormData>;
}

const FormFields = ({ form }: FormFieldsProps) => {
  return (
    <>
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
          maxLength={10000}
          {...form.register("prompt")}
        />
        {form.formState.errors.prompt && (
          <p className="text-sm text-red-500">
            {form.formState.errors.prompt.message}
          </p>
        )}
      </div>
    </>
  );
};

export default FormFields;
