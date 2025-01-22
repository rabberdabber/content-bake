import { cn } from "@/lib/utils";
import {
  // Layout & Navigation
  Layout,
  LayoutDashboard,
  PanelLeftOpen,
  PanelLeftClose,
  Columns2,
  SplitSquareHorizontal,

  // Typography & Text Formatting
  Type,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  RemoveFormatting,

  // Headings
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,

  // Lists & Content Structure
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,

  // Actions & Operations
  Undo,
  Redo,
  Copy,
  Save,
  Upload,
  Download,
  Send,
  Trash,
  RefreshCcw,

  // UI Elements
  X as XIcon,
  XCircle,
  Plus as PlusIcon,
  Minus,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CornerDownLeft,
  CornerUpRight,
  GripVertical,

  // Editor & Content
  Code,
  Terminal,
  Pencil,
  SquarePen,
  Eye,
  MonitorPlay,
  Image as ImageIcon,
  Video,
  Link,
  MessageSquare,

  // Theme & Appearance
  SunMedium,
  Moon,
  Droplet,
  Cog,
  Settings,
  Maximize,
  StopCircle,

  // AI & Special Features
  Sparkles,
  Wand2,
  Bot,

  // Loading & Status
  Loader2,

  // Authentication
  LogOut,
  LogIn,
  User,

  // Alignment & Distribution
  AlignHorizontalDistributeStart,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,

  // Types
  LucideIcon,
  LucideProps,

  // Documentation
  FileQuestion,
  BookOpen,

  // Social Media & Branding
  Globe,

  // UI Elements
  Minimize,
  ChevronsUpDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowDownToLine,
  ArrowUpToLine,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  // Layout & Navigation
  layout: Layout,
  dashboard: LayoutDashboard,
  panelLeftOpen: PanelLeftOpen,
  panelLeftClose: PanelLeftClose,
  splitPane: Columns2,
  columns2: Columns2,
  splitSquareHorizontal: SplitSquareHorizontal,

  // Typography & Text Formatting
  type: Type,
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strikethrough: StrikethroughIcon,
  format: RemoveFormatting,

  // Headings
  heading1: Heading1,
  heading2: Heading2,
  heading3: Heading3,
  heading4: Heading4,
  heading5: Heading5,
  heading6: Heading6,

  // Lists & Content Structure
  list: List,
  listOrdered: ListOrdered,
  quote: Quote,
  table: TableIcon,

  // Actions & Operations
  undo: Undo,
  redo: Redo,
  copy: Copy,
  save: Save,
  upload: Upload,
  download: Download,
  send: Send,
  trash: Trash,
  refresh: RefreshCcw,
  plus: PlusIcon,
  // UI Elements
  x: XIcon,
  xCircle: XCircle,
  create: PlusIcon,
  minus: Minus,
  check: Check,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  chevronsUpDown: ChevronsUpDown,
  chevronRight: ChevronRight,
  arrowRight: ArrowRight,
  cornerDownLeft: CornerDownLeft,
  cornerUpRight: CornerUpRight,
  gripVertical: GripVertical,
  maximize: Maximize,
  stop: StopCircle,
  minimize: Minimize,
  edit: Pencil,

  // Editor & Content
  code: Code,
  terminal: Terminal,
  pencil: Pencil,
  post: SquarePen,
  eye: Eye,
  preview: MonitorPlay,
  image: ImageIcon,
  video: Video,
  link: Link,
  messageSquare: MessageSquare,

  // Theme & Appearance
  sun: SunMedium,
  moon: Moon,
  droplet: Droplet,
  widget: Cog,
  settings: Settings,

  // AI & Special Features
  sparkles: Sparkles,
  wand2: Wand2,
  bot: Bot,

  // Loading & Status
  loader: Loader2,

  // Authentication
  logout: LogOut,
  login: LogIn,
  user: User,

  // Alignment & Distribution
  alignHorizontalDistributeStart: AlignHorizontalDistributeStart,
  alignHorizontalDistributeCenter: AlignHorizontalDistributeCenter,
  alignHorizontalDistributeEnd: AlignHorizontalDistributeEnd,
  arrowLeftToLine: ArrowLeftToLine,
  arrowRightToLine: ArrowRightToLine,
  arrowUpToLine: ArrowUpToLine,
  arrowDownToLine: ArrowDownToLine,
  // Documentation
  fileQuestion: FileQuestion,
  bookOpen: BookOpen,

  // Social Media & Branding
  twitter: XIcon,
  globe: Globe,

  // Custom SVG Icons
  logo: (props: LucideProps) => (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", props.className)}
      {...props}
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#8B5CF6", stopOpacity: 1 }}
          />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect x="56" y="56" width="400" height="400" rx="100" fill="url(#grad)" />

      <path d="M176 146h160v220h-160z" fill="white" opacity="0.9" />
      <path
        d="M196 186h120m-120 40h120m-120 40h80"
        stroke="#8B5CF6"
        strokeWidth="16"
        strokeLinecap="round"
      />

      <g
        transform="translate(256,256) rotate(-45) translate(-256,-256)"
        filter="url(#glow)"
      >
        <rect
          x="286"
          y="146"
          width="20"
          height="140"
          rx="10"
          fill="currentColor"
        />
        <path d="M296 126l10 10-10 10-10-10z" fill="currentColor" />
        <circle cx="326" cy="156" r="4" fill="white" />
        <circle cx="346" cy="176" r="3" fill="white" />
        <circle cx="316" cy="186" r="3" fill="white" />
      </g>

      <path
        d="M356 316l40 40M366 286l50 30M376 256l60 20"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.6"
      >
        <animate
          attributeName="opacity"
          values="0.6;0.2;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  ),
  logoBackground: (props: LucideProps) => (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full opacity-10", props.className)}
      {...props}
    >
      <defs>
        <linearGradient id="grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "#3B82F6", stopOpacity: 0.2 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "#8B5CF6", stopOpacity: 0.2 }}
          />
        </linearGradient>
        <filter id="glow-bg" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect
        x="56"
        y="56"
        width="400"
        height="400"
        rx="100"
        fill="url(#grad-bg)"
      />

      <path d="M176 146h160v220h-160z" fill="white" opacity="0.1" />
      <path
        d="M196 186h120m-120 40h120m-120 40h80"
        stroke="#8B5CF6"
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.2"
      />

      <g
        transform="translate(256,256) rotate(-45) translate(-256,-256)"
        filter="url(#glow-bg)"
      >
        <rect
          x="286"
          y="146"
          width="20"
          height="140"
          rx="10"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M296 126l10 10-10 10-10-10z"
          fill="currentColor"
          opacity="0.2"
        />
        <circle cx="326" cy="156" r="4" fill="white" opacity="0.2" />
        <circle cx="346" cy="176" r="3" fill="white" opacity="0.2" />
        <circle cx="316" cy="186" r="3" fill="white" opacity="0.2" />
      </g>

      <path
        d="M356 316l40 40M366 286l50 30M376 256l60 20"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.1"
      >
        <animate
          attributeName="opacity"
          values="0.1;0.05;0.1"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  ),
  gitHub: (props: LucideProps) => (
    <svg viewBox="0 0 438.549 438.549" {...props}>
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      ></path>
    </svg>
  ),
  codePen: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CodePen"
      role="img"
      viewBox="0 0 512 512"
      className="w-6 h-6"
    >
      <rect width="512" height="512" rx="15%" fill="#111" />
      <g fill="none" stroke="#e6e6e6" strokeWidth="33" stroke-linejoin="round">
        <path d="M81 198v116l175 117 175-117V198L256 81z" />
        <path d="M81 198l175 116 175-116M256 81v117" />
        <path d="M81 314l175-116 175 116M256 431V314" />
      </g>
    </svg>
  ),
  youtube: () => (
    <svg
      fill="#FF0000"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
    >
      <title>YouTube</title>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  gif: (props: LucideProps) => (
    <svg
      width={48}
      height={48}
      viewBox="0 0 24 24"
      className={cn(
        "w-6 h-6 text-blue-600 dark:text-blue-400",
        props.className
      )}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="currentColor" opacity="0.2" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="currentColor"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: "bold",
          fontSize: "12px",
        }}
      >
        GIF
      </text>
    </svg>
  ),
  linkedin: (props: LucideProps) => (
    <svg viewBox="0 0 0.4 0.4" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.075 0.025a0.05 0.05 0 0 0 -0.05 0.05v0.25a0.05 0.05 0 0 0 0.05 0.05h0.25a0.05 0.05 0 0 0 0.05 -0.05V0.075a0.05 0.05 0 0 0 -0.05 -0.05zm0.028 0.107a0.03 0.03 0 1 0 0 -0.06 0.03 0.03 0 0 0 0 0.06m0.025 0.188V0.156h-0.05v0.164zM0.161 0.156h0.05v0.022c0.007 -0.012 0.024 -0.027 0.054 -0.027 0.036 0 0.055 0.024 0.055 0.069 0 0.002 0 0.012 0 0.012v0.088h-0.05v-0.088c0 -0.012 -0.003 -0.036 -0.029 -0.036 -0.027 0 -0.029 0.03 -0.03 0.05v0.075h-0.05z"
        fill="currentColor"
      />
    </svg>
  ),
};
