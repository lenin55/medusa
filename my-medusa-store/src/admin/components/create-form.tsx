// other imports...
import { 
    FocusModal,
    Heading,
    Label,
    Input,
    Button,
  } from "@medusajs/ui"
  import { 
    FormProvider,
    Controller,
  } from "react-hook-form"
  
  import { useForm } from "react-hook-form";

  import * as zod from "zod"

const schema = zod.object({
  name: zod.string(),
})

  export const CreateForm = () => {
    const form = useForm<zod.infer<typeof schema>>({
        defaultValues: {
          name: "",
        },
      })
    
      const handleSubmit = form.handleSubmit(({ name }) => {
        // TODO submit to backend
        console.log(name)
        })
  
    return (
      <FocusModal>
        <FocusModal.Trigger asChild>
          <Button>Create</Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col overflow-hidden"
            >
              <FocusModal.Header>
                <div className="flex items-center justify-end gap-x-2">
                    <FocusModal.Close asChild>
                      <Button size="small" variant="secondary">
                        Cancel
                      </Button>
                    </FocusModal.Close>
                    <Button type="submit" size="small">
                      Save
                    </Button>
                  </div>
              </FocusModal.Header>
              <FocusModal.Body>
                  <div className="flex flex-1 flex-col items-center overflow-y-auto">
                    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                      <div>
                        <Heading className="capitalize">
                          Create Item
                        </Heading>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Controller
                          control={form.control}
                          name="name"
                          render={({ field }) => {
                            return (
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-x-1">
                                  <Label size="small" weight="plus">
                                    Name
                                  </Label>
                                </div>
                                <Input {...field} />
                              </div>
                            )
                          }}
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