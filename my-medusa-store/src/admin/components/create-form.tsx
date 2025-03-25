import { Button, FocusModal, Heading, Input, Switch, Label, Text } from "@medusajs/ui"
import { useState, useEffect, useRef } from "react"
import useCustomToast from "./useCustomToast"
import ToastDisplay from "./ToastDisplay"

interface Banner {
  id?: string
  name: string
  image_url: string
  description?: string
  is_active: boolean
  link_url?: string
  valid_from?: Date
  valid_until?: Date
}

interface CreateFormProps {
  onSave: (data: Omit<Banner, "id" | "created_at" | "updated_at">) => Promise<void>
  initialData?: Banner
  isEditing?: boolean
  autoOpen?: boolean
  modalKey?: string
}

export const CreateForm = ({ 
  onSave, 
  initialData, 
  isEditing = false, 
  autoOpen = false,
  modalKey = "default" 
}: CreateFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(autoOpen)
  const initialFocusRef = useRef<HTMLInputElement>(null)
  const { toasts, success, error: showError, dismissToast } = useCustomToast()
  const [showErrors, setShowErrors] = useState(false)
  
  const [formData, setFormData] = useState<Partial<Banner>>(
    initialData || {
      name: "",
      image_url: "",
      description: "",
      is_active: false,
      link_url: "",
      valid_from: undefined,
      valid_until: undefined,
    }
  )
  
  // Reset form data when initialData changes (when editing different banners)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])
  
  // Auto-open modal when autoOpen prop changes or when modalKey changes
  useEffect(() => {
    if (autoOpen) {
      // Force the modal to open
      setIsOpen(true)
    }
  }, [autoOpen, modalKey])
  
  const handleChange = (field: keyof Banner, value: any) => {
    if (field === "valid_from" || field === "valid_until") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value ? new Date(value) : undefined,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value,
      }));
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if mandatory fields are filled
    if (!formData.name || !formData.image_url) {
      setShowErrors(true)
      showError("Please fill in all mandatory fields.")
      return
    }
    setShowErrors(false)
    
    setIsLoading(true)
    
    try {
      await onSave(formData as any)
      
      // Only reset form if not editing (for new banners)
      if (!isEditing) {
        setFormData({
          name: "",
          image_url: "",
          description: "",
          is_active: false,
          link_url: "",
          valid_from: undefined,
          valid_until: undefined,
        })
      }
      
      // Close the modal
      setIsOpen(false)
      
      // Use our custom toast
      success(isEditing ? "Banner updated" : "Banner created")
    } catch (error) {
      showError("Error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      <ToastDisplay toasts={toasts} onDismiss={dismissToast} />
      
      {/* For create banner button - only shown when not in edit mode */}
      {!isEditing && (
        <Button 
          variant="secondary"
          onClick={() => setIsOpen(true)}
        >
          Create New Banner
        </Button>
      )}
      
      {/* Fixed modal implementation to avoid aria-hidden issues */}
      <FocusModal 
        open={isOpen} 
        onOpenChange={setIsOpen}
      >
        <FocusModal.Content>
          <FocusModal.Header>
            <FocusModal.Title>
              <Heading>{isEditing ? "Edit Banner" : "Create New Banner"}</Heading>
            </FocusModal.Title>
            <Text className="text-ui-fg-subtle">
              {isEditing ? "Edit the details of the banner." : "Fill in the details to create a new banner."}
            </Text>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center overflow-auto">
            <div className="flex w-full max-w-lg flex-col gap-y-8 p-16">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="banner_name" className="text-ui-fg-subtle">
                  Banner Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="banner_name"
                  ref={initialFocusRef}
                  placeholder="Enter banner name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  aria-invalid={showErrors && !formData.name}
                  autoFocus
                  className={showErrors && !formData.name ? "border-red-500" : ""}
                />
                {!formData.name && showErrors && (
                  <Text className="text-ui-fg-error txt-small">
                    This field is required
                  </Text>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="image_url" className="text-ui-fg-subtle">
                  Image URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="image_url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url || ""}
                  onChange={(e) => handleChange("image_url", e.target.value)}
                  aria-invalid={showErrors && !formData.image_url}
                  className={showErrors && !formData.image_url ? "border-red-500" : ""}
                />
                {!formData.image_url && showErrors && (
                  <Text className="text-ui-fg-error txt-small">
                    This field is required
                  </Text>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="description" className="text-ui-fg-subtle">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Banner description (optional)"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="link_url" className="text-ui-fg-subtle">
                  Link URL
                </Label>
                <Input
                  id="link_url"
                  placeholder="https://example.com/target-page"
                  value={formData.link_url || ""}
                  onChange={(e) => handleChange("link_url", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="valid_from" className="text-ui-fg-subtle">
                  Valid From
                </Label>
                <Input
                  id="valid_from"
                  type="date"
                  value={formData.valid_from ? formData.valid_from.toISOString().split('T')[0] : ""}
                  onChange={(e) => handleChange("valid_from", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="valid_until" className="text-ui-fg-subtle">
                  Valid Until
                </Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until ? formData.valid_until.toISOString().split('T')[0] : ""}
                  onChange={(e) => handleChange("valid_until", e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange("is_active", checked)}
                  aria-label="Active status"
                />
                <Text className="ml-2">{formData.is_active ? "Active" : "Deactivated"}</Text>
              </div>
            </div>
          </FocusModal.Body>
          <FocusModal.Footer>
            <div className="flex w-full justify-end gap-x-2">
              <Button 
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                isLoading={isLoading}
              >
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </FocusModal.Footer>
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}