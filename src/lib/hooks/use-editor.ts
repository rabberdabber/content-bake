import { useState } from "react";
import { useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";

import extensions from "@/features/editor/components/extensions";
import useLocalStorage from "./use-local-storage";
import { sanitizeConfig } from "@/config/sanitize-config";
import DOMPurify from "dompurify";
import { handleCommandNavigation } from "@/features/editor/components/commands";
import { uploadImage } from "../image/utils";
import { toast } from "sonner";
import { validateSchema } from "@/lib/utils";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

const defaultContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { textAlign: "left", level: 1 },
      content: [
        {
          type: "text",
          text: "Building a CRUD API Using Django: A Step-by-Step Guide",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [{ type: "text", text: "Django, a high level" }],
    },
    {
      type: "heading",
      attrs: { textAlign: "left", level: 1 },
      content: [
        { type: "text", text: "Step 1: Setting Up the Django Project" },
      ],
    },
    { type: "paragraph", attrs: { textAlign: "left" } },
  ],
};

const apiContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "Building a CRUD API with Django",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Django, a high-level Python web framework, has been widely adopted due to its simplicity and robustness. One common application of Django is to build RESTful APIs, such as CRUD (Create, Read, Update, Delete) APIs. In this tutorial, we will walk through the steps to create a basic CRUD API using Django and Django Rest Framework.",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Step 1: Setting Up Your Django Project",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "First, ensure you have Django and Django Rest Framework installed. You can do this by running the commands:",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "```shell\npip install django\ndjango-admin startproject myproject\ncd myproject\npip install djangorestframework\n```",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "After installing the packages, open your Django project and modify the settings.py file to include your app and rest_framework in the INSTALLED_APPS list:",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "```python\nINSTALLED_APPS = [\n    ...\n    'rest_framework',\n    'myapp',\n]\n```",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Step 2: Creating a Django App",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Next, create a new Django app where your API will reside. Run the command:",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "```shell\npython manage.py startapp myapp\n```",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Step 3: Defining Your Model",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "In the models.py file of your app, define the model you want your API to CRUD. For this example, we'll create a simple Book model:",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "```python\nfrom django.db import models\n\nclass Book(models.Model):\n    title = models.CharField(max_length=100)\n    author = models.CharField(max_length=100)\n    published_date = models.DateField()\n    isbn = models.CharField(max_length=13)\n\n    def __str__(self):\n        return self.title\n```",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Step 4: Creating a Serializer",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "The next step is to create a serializer for the Book model. In serializers.py, create:",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "```python\nfrom rest_framework import serializers\nfrom .models import Book\n\nclass BookSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Book\n        fields = '__all__'\n```",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Step 5: Defining Views",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Next, define the views for your CRUD operations in views.py:",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "```python\nfrom rest_framework import generics\nfrom .models import Book\nfrom .serializers import BookSerializer\n\nclass BookListCreate(generics.ListCreateAPIView):\n    queryset = Book.objects.all()\n    serializer_class = BookSerializer\n\nclass BookDetail(generics.RetrieveUpdateDestroyAPIView):\n    queryset = Book.objects.all()\n    serializer_class = BookSerializer\n```",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Step 6: Configuring URLs",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Finally, map the views to URLs in urls.py:",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "```python\nfrom django.urls import path\nfrom .views import BookListCreate, BookDetail\n\nurlpatterns = [\n    path('books/', BookListCreate.as_view(), name='book-list-create'),\n    path('books/<int:pk>/', BookDetail.as_view(), name='book-detail'),\n]\n```",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Conclusion",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "You now have a basic CRUD API setup using Django and Django Rest Framework. This setup allows you to create, read, update, and delete Book instances. Explore more by customizing your models, serializers, and views for your specific needs.",
        },
      ],
    },
  ],
};

console.log(validateSchema(defaultContent, extensions));
console.log(validateSchema(apiContent, extensions));

const useBlockEditor = ({
  setEditorContent,
}: {
  setEditorContent?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [content, setContent] = useLocalStorage(
    "editor-content",
    JSON.stringify(apiContent)
  );
  const [image, setImage] = useState<string | File | null>(null);

  const onContentUpdate = (newContent: string) => {
    const sanitizedContent = DOMPurify.sanitize(newContent, sanitizeConfig);
    setEditorContent?.(sanitizedContent);
  };
  const editor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    onCreate: (ctx) => {
      if (ctx.editor.isEmpty) {
        ctx.editor.commands.setContent(apiContent);
        ctx.editor.commands.focus("start", { scrollIntoView: true });
      } else {
        ctx.editor.commands.setContent(content);
      }
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getJSON();
      onContentUpdate(JSON.stringify(newContent));
      setContent(JSON.stringify(newContent));
    },
    extensions: [...extensions],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert",
      },
      handleDOMEvents: {
        keydown: (_view, event) => handleCommandNavigation(event),
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          event.preventDefault();
          const [file] = Array.from(event.dataTransfer.files);
          try {
            uploadImage(file).then((imageUrl) => setImage(imageUrl));
            toast.success("Image uploaded successfully");
          } catch (error) {
            toast.error("Failed to upload image");
          }

          return true;
        }
      },
    },
  });

  window.editor = editor;

  return { editor };
};

export default useBlockEditor;
