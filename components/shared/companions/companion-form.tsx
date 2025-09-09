"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Resolver, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjects } from "@/config/constants"
import { Textarea } from "@/components/ui/textarea"
import { createCompanion } from "@/lib/actions/companions.actions"
import { redirect } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Companion is required.",
  }),
  subject: z.string().min(1, {
    message: "Subject is required.",
  }),
  topic: z.string().min(1, {
    message: "Topic is required.",
  }),
  voice: z.string().min(1, {
    message: "Voice is required.",
  }),
  style: z.string().min(1, {
    message: "Style is required.",
  }),
  duration: z.coerce.number().min(1, {
    message: "Duration is required.",
  }),
})

const CompanionForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 15,
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const companion = await createCompanion(values)
    if (companion) {
      redirect(`/companions/${companion.id}`)
    } else {
      console.log("Failed to create a companion")
      redirect("/")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companion Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the companion name"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input capitalize">
                    <SelectValue placeholder="Select the subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Subjects</SelectLabel>
                      {subjects.map((subject) => (
                        <SelectItem
                          value={subject}
                          key={subject}
                          className="capitalize"
                        >
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What should the companion help with?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex. Derivates & Integrals"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input">
                    <SelectValue placeholder="Select the voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Voices</SelectLabel>

                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input">
                    <SelectValue placeholder="Select the style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Styles</SelectLabel>

                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated session duration in minutes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="15"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full cursor-pointer">
          Build Your Companion
        </Button>
      </form>
    </Form>
  )
}

export default CompanionForm
