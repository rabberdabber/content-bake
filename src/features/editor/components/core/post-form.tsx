"use client";

import { useState, useEffect } from "react";
import {
  PostFormData,
  postFormSchema,
  postWithContentSchema,
} from "@/schemas/post";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeatureImageUpload from "./feature-image-upload";
import { FeatureImageGenerator } from "./ai/feature-image-generator";
import { publishPost } from "@/lib/actions/post";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useEditor } from "../../context/editor-context";
import useLocalStorage from "@/lib/hooks/use-local-storage";

interface PostFormProps {
  isDraft?: boolean;
  onSuccess?: () => void;
  submitLabel?: string;
}

export function PostForm({
  isDraft = false,
  onSuccess,
  submitLabel = "Publish",
}: PostFormProps) {
  const { data: session } = useSession();
  const { type, editor } = useEditor();
  const [_, setLocalStorageContent] = useLocalStorage("editor-content", "");
  const [featuredImage, setFeaturedImage] = useState("");
  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      tag: isDraft ? undefined : "",
      excerpt: isDraft ? undefined : "",
      feature_image_url: isDraft ? undefined : "",
    },
  });
  const validatePost = async (formData: FormData) => {
    try {
      const validationSchema = isDraft
        ? postFormSchema.partial({
            tag: true,
            excerpt: true,
            feature_image_url: true,
          })
        : postFormSchema;

      await validationSchema.parseAsync({
        title: formData.get("title"),
        tag: formData.get("tag"),
        excerpt: formData.get("excerpt"),
        feature_image_url: formData.get("feature_image_url"),
        is_published: Boolean(formData.get("is_published") === "true"),
        author_id: formData.get("author_id"),
      });

      const contentSchema = isDraft
        ? postWithContentSchema.partial({
            tag: true,
            excerpt: true,
            feature_image_url: true,
          })
        : postWithContentSchema;

      await contentSchema
        .omit({
          id: true,
          author_id: true,
          created_at: true,
          updated_at: true,
        })
        .parseAsync({
          ...Object.fromEntries(formData.entries()),
          is_published: Boolean(formData.get("is_published") === "true"),
          content: JSON.parse(formData.get("content") as string),
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
      }
      throw error;
    }
  };

  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (featuredImage) {
      form.setValue("feature_image_url", featuredImage);
    }
  }, [featuredImage, form]);

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);
          formData.append("content", JSON.stringify(editor?.getJSON() || ""));
          formData.append("feature_image_url", featuredImage);
          formData.append("author_id", session?.user.id as string);
          formData.append("is_published", isDraft ? "false" : "true");
          try {
            setIsPublishing(true);
            await validatePost(formData);
            const post = await publishPost(formData);
            toast.success(
              <>
                {isDraft ? "Draft" : "Post"} saved successfully!{" "}
                <Link
                  className="underline"
                  href={`/${isDraft ? "drafts" : "posts"}/${post.id}`}
                >
                  View {isDraft ? "Draft" : "Post"}
                </Link>
              </>
            );
            onSuccess?.();
            router.push(isDraft ? "/drafts" : "/posts");
          } catch (error) {
            toast.error(
              `Failed to ${isDraft ? "save draft" : "publish post"}, error: ` +
                error
            );
          } finally {
            setIsPublishing(false);
            if (type === "local") {
              setLocalStorageContent("");
            }
            editor!.commands.setContent("");
          }
        }}
      >
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
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag {!isDraft && "*"}</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter post tag"
                  {...field}
                  required={!isDraft}
                />
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
                    <Input placeholder="Enter image URL" {...field} required />
                  </FormControl>
                </TabsContent>
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full gap-2" disabled={isPublishing || !editor}>
          {isPublishing ? (
            <>
              <Spinner className="h-6 w-6" />
              {isDraft ? "Saving..." : "Publishing..."}
            </>
          ) : (
            <>
              <Icons.send className="h-6 w-6" />
              {submitLabel}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
