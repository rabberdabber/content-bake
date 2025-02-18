"use client";

import { useState, useEffect } from "react";
import { PostFormData, postFormSchema, TagResponse } from "@/schemas/post";
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
import { Switch } from "@/components/ui/switch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeatureImageUpload from "./feature-image-upload";
import { FeatureImageGenerator } from "./ai/feature-image-generator";
import { useSession } from "next-auth/react";
import { useEditor } from "../../context/editor-context";
import { PostsMain } from "@/features/posts/posts-main";
import { cn } from "@/lib/utils";

type PostFormProps = {
  defaultValues?: Partial<PostFormData>;
  submitButtonText?: string;
  isSubmitting?: boolean;
  onSubmit: (data: PostFormData) => Promise<void>;
};

export function PostForm({
  defaultValues,
  onSubmit,
  submitButtonText = "Publish",
  isSubmitting = false,
}: PostFormProps) {
  const { data: session } = useSession();
  const { editor } = useEditor();
  const [featuredImage, setFeaturedImage] = useState(
    defaultValues?.feature_image_url || ""
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [availableTags, setAvailableTags] = useState<TagResponse[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    defaultValues?.tags || []
  );
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

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      tags: defaultValues?.tags || [],
      excerpt: defaultValues?.excerpt || "",
      feature_image_url: defaultValues?.feature_image_url || "",
    },
  });

  useEffect(() => {
    if (featuredImage) {
      form.setValue("feature_image_url", featuredImage);
    }
  }, [featuredImage, form]);

  if (!session) {
    return <div>Not logged in</div>;
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formValues = form.getValues();

    // For regular posts
    const submitData = {
      ...formValues,
      excerpt: formValues.excerpt || "", // Ensure excerpt is provided
      feature_image_url: featuredImage,
      tags: selectedTags,
    };
    const data = submitData as PostFormData;
    await onSubmit(data);
  };

  console.log("availableTags", availableTags);
  return (
    <Form {...form}>
      <div className="space-y-4">
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter post title" {...field} required />
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
                <FormLabel>Tags</FormLabel>
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
                            {(field.value || []).length > 0
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
                              onValueChange={(value) => {
                                setTagInput(value);
                              }}
                            />
                            <CommandEmpty>
                              {tagInput && (
                                <CommandItem
                                  value={tagInput}
                                  onSelect={(currentValue) => {
                                    const currentTags = field.value || [];
                                    if (
                                      currentValue.trim() &&
                                      currentTags.length < 5
                                    ) {
                                      const newTag = currentValue.trim();
                                      if (!currentTags.includes(newTag)) {
                                        const newTags = [
                                          ...currentTags,
                                          newTag,
                                        ];
                                        field.onChange(newTags);
                                        setSelectedTags(newTags);
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
                              {(availableTags || [])
                                .filter((tag) =>
                                  tag.name
                                    .toLowerCase()
                                    .includes((tagInput || "").toLowerCase())
                                )
                                .map((tag) => (
                                  <CommandItem
                                    key={tag.id}
                                    value={tag.name}
                                    onSelect={(currentValue) => {
                                      const currentTags = field.value || [];
                                      if (currentTags.length < 5) {
                                        if (
                                          !currentTags.includes(currentValue)
                                        ) {
                                          const newTags = [
                                            ...currentTags,
                                            currentValue,
                                          ];
                                          field.onChange(newTags);
                                          setSelectedTags(newTags);
                                        }
                                        setTagInput("");
                                        setOpenTagCommand(false);
                                      }
                                    }}
                                  >
                                    <Icons.check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        (field.value || []).includes(tag.name)
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
                      {(field.value || []).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => {
                            const currentTags = field.value || [];
                            const newTags = currentTags.filter(
                              (t) => t !== tag
                            );
                            field.onChange(newTags);
                            setSelectedTags(newTags);
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
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter post excerpt"
                    className="min-h-[100px]"
                    {...field}
                    required
                    minLength={10}
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
                <FormLabel>Featured Image</FormLabel>
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
                        onImageGenerated={(url) => setFeaturedImage(url)}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="url">
                    <FormControl>
                      <Input
                        placeholder="Enter image URL"
                        {...field}
                        required
                      />
                    </FormControl>
                  </TabsContent>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Private Post</FormLabel>
              <div className="text-sm text-muted-foreground">
                Make this post private (coming soon)
              </div>
            </div>
            <FormControl>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                disabled
                aria-readonly
              />
            </FormControl>
          </FormItem>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Preview</h3>
            <div className="h-[400px] overflow-y-auto rounded-lg border">
              <div className="p-4">
                {editor?.getJSON() && (
                  <PostsMain postContent={editor.getJSON()} />
                )}
              </div>
            </div>
          </div>
          <Button className="w-full gap-2" disabled={isSubmitting || !editor}>
            {isSubmitting ? (
              <>
                <Spinner className="h-6 w-6" />
                {submitButtonText}...
              </>
            ) : (
              <>
                <Icons.send className="h-6 w-6" />
                {submitButtonText}
              </>
            )}
          </Button>
        </form>
      </div>
    </Form>
  );
}
