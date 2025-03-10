import { 
  FocusModal,
  Heading,
  Label,
  Input,
  Button,
  Checkbox,
  DatePicker,
  Text,
  Textarea,
} from "@medusajs/ui"
import { 
  FormProvider,
  Controller,
} from "react-hook-form"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod"
import { useState } from "react";

const schema = zod.object({
  name: zod.string().min(1, "Name is required"),
  image_url: zod.string().min(1, "Image URL is required"),
  description: zod.string().optional(),
  is_active: zod.boolean().default(false),
  link_url: zod.string().url().optional().or(zod.literal("")),
  valid_from: zod.date().optional().nullable(),
  valid_until: zod.date().optional().nullable(),
})

interface CreateFormProps {
  onSave: (data: any) => void
  initialData?: any
  isEditing?: boolean
}

export const CreateForm = ({ onSave, initialData, isEditing = false }: CreateFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  
  const form = useForm<zod.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: "",
      image_url: "",
      description: "",
      is_active: false,
      link_url: "",
      valid_from: null,
      valid_until: null,
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    // Pass data to parent component through onSave callback
    onSave(data)
    if (!isEditing) {
      form.reset() // Reset form after submission if creating new
    }
  })
  
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImagePreview(url)
    form.setValue("image_url", url)
  }

  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>{isEditing ? "Edit" : "Create"}</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex h-full flex-col overflow-hidden"
          >
            <FocusModal.Header>
              <div className="flex items-center justify-between px-6">
                <Heading>
                  {isEditing ? "Edit Banner" : "Create Banner"}
                </Heading>
                <div className="flex items-center gap-x-2">
                  <FocusModal.Close asChild>
                    <Button size="small" variant="secondary">
                      Cancel
                    </Button>
                  </FocusModal.Close>
                  <Button type="submit" size="small">
                    Save
                  </Button>
                </div>
              </div>
            </FocusModal.Header>
            <FocusModal.Body>
              <div className="flex flex-1 flex-col overflow-y-auto">
                <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Name */}
                      <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-x-1">
                              <Label size="small" weight="plus">
                                Name *
                              </Label>
                            </div>
                            <Input {...field} />
                            {fieldState.error && (
                              <Text className="text-ui-fg-error text-xs">
                                {fieldState.error.message}
                              </Text>
                            )}
                          </div>
                        )}
                      />
                      
                      {/* Image URL */}
                      <Controller
                        control={form.control}
                        name="image_url"
                        render={({ field, fieldState }) => (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-x-1">
                              <Label size="small" weight="plus">
                                Image URL *
                              </Label>
                            </div>
                            <Input 
                              {...field} 
                              onChange={handleImageInputChange}
                            />
                            {fieldState.error && (
                              <Text className="text-ui-fg-error text-xs">
                                {fieldState.error.message}
                              </Text>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="flex flex-col space-y-2">
                        <Label size="small">Image Preview</Label>
                        <div className="border rounded-md h-40 flex items-center justify-center overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Banner preview" 
                            className="max-h-full max-w-full object-contain"
                            onError={() => setImagePreview(null)}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Description */}
                    <Controller
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <div className="flex flex-col space-y-2">
                          <Label size="small" weight="plus">
                            Description
                          </Label>
                          <Textarea {...field} rows={3} />
                        </div>
                      )}
                    />
                    
                    {/* Link URL */}
                    <Controller
                      control={form.control}
                      name="link_url"
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col space-y-2">
                          <Label size="small" weight="plus">
                            Link URL
                          </Label>
                          <Input {...field} />
                          {fieldState.error && (
                            <Text className="text-ui-fg-error text-xs">
                              {fieldState.error.message}
                            </Text>
                          )}
                        </div>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Valid From */}
                      <Controller
                        control={form.control}
                        name="valid_from"
                        render={({ field: { value, onChange } }) => (
                          <div className="flex flex-col space-y-2">
                            <Label size="small" weight="plus">
                              Valid From
                            </Label>
                            <DatePicker 
                              value={value ? new Date(value) : undefined}
                              onChange={(date) => onChange(date)}
                            />
                          </div>
                        )}
                      />
                      
                      {/* Valid Until */}
                      <Controller
                        control={form.control}
                        name="valid_until"
                        render={({ field: { value, onChange } }) => (
                          <div className="flex flex-col space-y-2">
                            <Label size="small" weight="plus">
                              Valid Until
                            </Label>
                            <DatePicker 
                              value={value ? new Date(value) : undefined}
                              onChange={(date) => onChange(date)}
                            />
                          </div>
                        )}
                      />
                    </div>
                    
                    {/* Is Active */}
                    <Controller
                      control={form.control}
                      name="is_active"
                      render={({ field: { value, onChange } }) => (
                        <div className="flex items-center gap-x-2">
                          <Checkbox
                            checked={value}
                            onCheckedChange={onChange}
                          />
                          <Label size="small" weight="plus">
                            Active
                          </Label>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </FocusModal.Body>
          </form>
        </FormProvider>
      </FocusModal.Content>
    </FocusModal>
  )
}