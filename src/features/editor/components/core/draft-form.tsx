"use client";

import { useState, useEffect } from "react";
import { DraftWithContentData, TagResponse } from "@/schemas/post";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Spinner } from "@/components/ui/spinner";
import { draftFormSchema } from "@/schemas/post";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeatureImageUpload from "./feature-image-upload";
import { FeatureImageGenerator } from "./ai/feature-image-generator";
import { cn } from "@/lib/utils";

type DraftFormProps = {
  defaultValues?: Partial<DraftWithContentData>;
  onSubmit: (data: DraftWithContentData) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
};

export function DraftForm({
  defaultValues,
  onSubmit,
  submitButtonText = "Save Draft",
  isSubmitting = false,
}: DraftFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    defaultValues?.tags || []
  );
  const [featuredImage, setFeaturedImage] = useState(
    defaultValues?.feature_image_url || ""
  );
  const [availableTags, setAvailableTags] = useState<TagResponse[]>([]);
  const [openTagCommand, setOpenTagCommand] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        const tags = await response.json();
        setAvailableTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const form = useForm<DraftWithContentData>({
    resolver: zodResolver(draftFormSchema.partial()),
    defaultValues: {
      title: defaultValues?.title || "",
      excerpt: defaultValues?.excerpt || "",
      feature_image_url: defaultValues?.feature_image_url || "",
      tags: defaultValues?.tags || [],
    },
  });

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formValues = form.getValues();
    await onSubmit({
      ...formValues,
      is_published: false,
      feature_image_url: featuredImage || undefined,
      tags: selectedTags,
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter draft title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (optional)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <DropdownMenu
                      open={openTagCommand}
                      onOpenChange={setOpenTagCommand}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <span className="text-muted-foreground">
                            {selectedTags.length > 0
                              ? "Add more tags"
                              : "Select or create tags..."}
                          </span>
                          <Icons.chevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-[200px] p-0"
                        align="start"
                        side="bottom"
                      >
                        <Command className="w-full">
                          <CommandList>
                            <CommandInput
                              placeholder="Search or create tags..."
                              value={tagInput}
                              onValueChange={setTagInput}
                            />
                            <CommandEmpty>
                              {tagInput && (
                                <CommandItem
                                  value={tagInput}
                                  onSelect={(currentValue) => {
                                    if (
                                      currentValue.trim() &&
                                      selectedTags.length < 5
                                    ) {
                                      const newTag = currentValue.trim();
                                      if (!selectedTags.includes(newTag)) {
                                        const newTags = [
                                          ...selectedTags,
                                          newTag,
                                        ];
                                        setSelectedTags(newTags);
                                        field.onChange(newTags);
                                      }
                                      setTagInput("");
                                      setOpenTagCommand(false);
                                    }
                                  }}
                                >
                                  Create tag &quot;{tagInput}&quot;
                                </CommandItem>
                              )}
                              {!tagInput && "No tags found."}
                            </CommandEmpty>
                            <CommandGroup heading="Existing Tags">
                              {availableTags
                                .filter((tag) =>
                                  tag.name
                                    .toLowerCase()
                                    .includes(tagInput.toLowerCase())
                                )
                                .map((tag) => (
                                  <CommandItem
                                    key={tag.id}
                                    value={tag.name}
                                    onSelect={(currentValue) => {
                                      if (selectedTags.length < 5) {
                                        if (
                                          !selectedTags.includes(currentValue)
                                        ) {
                                          const newTags = [
                                            ...selectedTags,
                                            currentValue,
                                          ];
                                          setSelectedTags(newTags);
                                          field.onChange(newTags);
                                        }
                                        setTagInput("");
                                        setOpenTagCommand(false);
                                      }
                                    }}
                                  >
                                    <Icons.check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedTags.includes(tag.name)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {tag.name}
                                    {tag.post_count > 0 && (
                                      <span className="ml-auto text-xs text-muted-foreground">
                                        {tag.post_count} posts
                                      </span>
                                    )}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => {
                            const newTags = selectedTags.filter(
                              (t) => t !== tag
                            );
                            setSelectedTags(newTags);
                            field.onChange(newTags);
                          }}
                        >
                          {tag}
                          <Icons.x className="ml-2 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter draft excerpt"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feature_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image (optional)</FormLabel>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="generate">Generate</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <FeatureImageUpload
                      featuredImage={featuredImage}
                      setFeaturedImage={setFeaturedImage}
                    />
                  </TabsContent>
                  <TabsContent value="generate">
                    <div className="border rounded-lg">
                      <FeatureImageGenerator
                        onImageGenerated={(url: string) =>
                          setFeaturedImage(url)
                        }
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="url">
                    <FormControl>
                      <Input
                        placeholder="Enter image URL"
                        {...field}
                        value={featuredImage}
                        onChange={(e) => {
                          field.onChange(e);
                          setFeaturedImage(e.target.value);
                        }}
                      />
                    </FormControl>
                  </TabsContent>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="h-6 w-6" />
                {submitButtonText}...
              </>
            ) : (
              <>
                <Icons.save className="h-6 w-6" />
                {submitButtonText}
              </>
            )}
          </Button>
        </form>
      </div>
    </Form>
  );
}
