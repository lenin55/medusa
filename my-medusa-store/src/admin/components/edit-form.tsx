import { Button, FocusModal as OriginalFocusModal, Heading, Input, Label, Text, Toaster, toast, Switch } from "@medusajs/ui"
import { useState } from "react"

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

interface EditFormProps {
  onSave: (data: Partial<Banner>) => Promise<void>
  initialData: Banner
  isEditing?: boolean
  onClose: () => void
}

interface CustomFocusModalProps extends React.ComponentProps<typeof OriginalFocusModal> {
  onClose: () => void;
}

const FocusModal: React.FC<CustomFocusModalProps> & { Content: typeof OriginalFocusModal.Content; Header: typeof OriginalFocusModal.Header; Body: typeof OriginalFocusModal.Body; Footer: typeof OriginalFocusModal.Footer; Close: typeof OriginalFocusModal.Close; } = ({ onClose, ...props }) => {
  return <OriginalFocusModal {...props} />;
};

FocusModal.Content = OriginalFocusModal.Content;
FocusModal.Header = OriginalFocusModal.Header;
FocusModal.Body = OriginalFocusModal.Body;
FocusModal.Footer = OriginalFocusModal.Footer;
FocusModal.Close = OriginalFocusModal.Close;

export const EditForm = ({ onSave, initialData, onClose }: EditFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Banner>>(initialData)

  const handleChange = (field: keyof Banner, value: any) => {
    if (field === "valid_from" || field === "valid_until") {
      setFormData({
        ...formData,
        [field]: value ? new Date(value) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updatedFormData = {
        ...formData,
        valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : undefined,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : undefined,
      }
      await onSave(updatedFormData as any)
      toast.success("Banner updated", {
        description: "The operation was completed successfully."
      })
      onClose()
    } catch (error) {
      toast.error("Error occurred", {
        description: "Something went wrong. Please try again."
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster />
      <FocusModal open={true} onClose={onClose}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Heading>Edit Banner</Heading>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center overflow-auto">
            <div className="flex w-full max-w-lg flex-col gap-y-8 p-16">
              <div className="flex flex-col gap-y-1">
                <Text className="text-ui-fg-subtle">
                  Edit the details of the banner.
                </Text>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="banner_name" className="text-ui-fg-subtle">
                  Banner Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="banner_name"
                  placeholder="Enter banner name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
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
                  required
                />
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
                  onChange={(e) => handleChange("valid_from", e.target.value ? new Date(e.target.value) : undefined)}
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
                  onChange={(e) => handleChange("valid_until", e.target.value ? new Date(e.target.value) : undefined)}
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
              <FocusModal.Close asChild>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
              </FocusModal.Close>
              <Button onClick={handleSubmit} isLoading={isLoading}>
                Update
              </Button>
            </div>
          </FocusModal.Footer>
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}
