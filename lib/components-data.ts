'use client'

import {
  CheckSquare,
  Calendar,
  SplitSquareVertical,
  KeyRound,
  Sliders,
  Loader,
  TextCursor,
  MessageSquare,
  BookOpen,
  Dices,
  SquareMousePointer,
  RectangleEllipsis,
  ChevronsRight,
  Keyboard,
  GalleryHorizontal,
  AlignLeft,
  SquareEqual,
  SquareDashedMousePointerIcon,
  CreditCard,
  Moon,
  AppWindow,
  BookText
} from 'lucide-react'

// Define the central category configuration
export const categoryConfig = {
  button: {
    id: 'button',
    displayName: 'button',
    icon: SquareMousePointer
  },
  dialog: {
    id: 'dialog',
    displayName: 'dialog',
    icon: AppWindow
  },
  modal: {
    id: 'modal',
    displayName: 'modal',
    icon: AppWindow
  },
  checkbox: {
    id: 'checkbox',
    displayName: 'checkbox',
    icon: CheckSquare
  },
  form: {
    id: 'form',
    displayName: 'form',
    icon: CreditCard
  },
  payment: {
    id: 'payment',
    displayName: 'payment',
    icon: CreditCard
  },
  'date-picker': {
    id: 'date-picker',
    displayName: 'date picker',
    icon: Calendar
  },
  divider: {
    id: 'divider',
    displayName: 'divider',
    icon: SplitSquareVertical
  },
  skeleton: {
    id: 'skeleton',
    displayName: 'skeleton',
    icon: AlignLeft
  },
  password: {
    id: 'password',
    displayName: 'password',
    icon: KeyRound
  },
  progress: {
    id: 'progress',
    displayName: 'progress',
    icon: RectangleEllipsis
  },
  tos: {
    id: 'tos',
    displayName: 'terms of service',
    icon: BookText
  },
  slider: {
    id: 'slider',
    displayName: 'slider',
    icon: Sliders
  },
  spinner: {
    id: 'spinner',
    displayName: 'spinner',
    icon: Loader
  },
  loading: {
    id: 'loading',
    displayName: 'loading',
    icon: Loader
  },
  'text-input': {
    id: 'text-input',
    displayName: 'text input',
    icon: TextCursor
  },
  tooltip: {
    id: 'tooltip',
    displayName: 'tooltip',
    icon: MessageSquare
  },
  autocomplete: {
    id: 'autocomplete',
    displayName: 'autocomplete',
    icon: Keyboard
  },
  pagination: {
    id: 'pagination',
    displayName: 'pagination',
    icon: BookOpen
  },
  breadcrumb: {
    id: 'breadcrumb',
    displayName: 'breadcrumb',
    icon: ChevronsRight
  },
  carousel: {
    id: 'carousel',
    displayName: 'carousel',
    icon: GalleryHorizontal
  },
  random: {
    id: 'random',
    displayName: 'random',
    icon: Dices
  },
  card: {
    id: 'card',
    displayName: 'card',
    icon: SquareEqual
  },
  alert: {
    id: 'alert',
    displayName: 'alert',
    icon: MessageSquare
  },
  'drag-and-drop': {
    id: 'drag-and-drop',
    displayName: 'drag and drop',
    icon: SquareDashedMousePointerIcon
  },
  'dark-mode': {
    id: 'darkmode',
    displayName: 'dark mode',
    icon: Moon
  }
} as const

// Generate component category type from the config
export type ComponentCategory = keyof typeof categoryConfig

// Create derived mappings for backward compatibility
export const categoryDisplayNames = Object.entries(categoryConfig).reduce(
  (acc, [key, config]) => {
    acc[key as ComponentCategory] = config.displayName
    return acc
  },
  {} as Record<ComponentCategory, string>
)

export const categoryIcons = Object.entries(categoryConfig).reduce(
  (acc, [key, config]) => {
    acc[key as ComponentCategory] = config.icon
    return acc
  },
  {} as Record<ComponentCategory, React.ElementType>
)

export type ComponentData = {
  slug: string
  name: string
  description: string
  component: () => Promise<React.ComponentType<any>> // Using any to accommodate various component types
  categories: ComponentCategory[]
  createdAt: string
  featured?: boolean
}

export const componentsData: ComponentData[] = [
  {
    slug: 'escaping-button',
    name: 'The Escaping Button',
    description:
      "This button doesn't want to be clicked and will run away from your cursor.",
    component: () =>
      import('@/components/escaping-button').then(mod => mod.default),
    categories: ['button'],
    createdAt: '2024-01-01'
  },
  {
    slug: 'talking-password',
    name: 'The Talking Password Field',
    description:
      'A password field that helpfully announces each character you type out loud.',
    component: () =>
      import('@/components/talking-password').then(mod => mod.default),
    categories: ['password'],
    createdAt: '2024-01-02'
  },
  {
    slug: 'obnoxious-tos',
    name: 'The Obnoxious Terms of Service',
    description:
      'Redefining user interaction with disruptive, real-time visibility into every action you take.',
    component: () =>
      import('@/components/obnoxious-tos').then(mod => mod.default),
    categories: ['tos'],
    createdAt: '2025-03-26'
  },
  {
    slug: 'overshare-tooltip',
    name: 'The Oversharing Tooltip',
    description:
      "A tooltip that gives you way more information than you'd ever need—or want.",
    component: () =>
      import('@/components/overshare-tooltip').then(mod => mod.default),
    categories: ['tooltip'],
    createdAt: '2024-01-03'
  },
  {
    slug: 'self-destructing-field',
    name: 'The Self-Destructing Text Field',
    description:
      'A text input that actively works against you by erasing your text as you type.',
    component: () =>
      import('@/components/self-destructing-field').then(mod => mod.default),
    categories: ['text-input'],
    createdAt: '2024-01-04'
  },
  {
    slug: 'distracted-progress-bar',
    name: 'The Distracted Progress Bar',
    description:
      "A progress bar with severe attention issues that keeps forgetting what it's supposed to be doing.",
    component: () =>
      import('@/components/distracted-progress-bar').then(mod => mod.default),
    categories: ['progress'],
    createdAt: '2024-01-05'
  },
  {
    slug: 'rebellious-slider',
    name: 'The Rebellious Slider',
    description:
      'A slider that resists your input and taunts you with messages.',
    component: () =>
      import('@/components/the-rebellious-slider').then(mod => mod.default),
    categories: ['slider'],
    createdAt: '2024-01-06'
  },
  {
    slug: 'schrodinger-checkbox',
    name: 'The Schrödinger Checkbox',
    description:
      'A checkbox that exists in a superposition of states, both checked and unchecked, until observed.',
    component: () =>
      import('@/components/schrodinger-checkbox').then(mod => mod.default),
    categories: ['checkbox'],
    createdAt: '2024-01-07'
  },
  {
    slug: 'way-too-long-breadcrumbs',
    name: 'Way Too Long Breadcrumbs',
    description: "A breadcrumb trail that's way too detailed.",
    component: () =>
      import('@/components/way-too-long-breadcrumbs').then(mod => mod.default),
    categories: ['breadcrumb'],
    createdAt: '2024-01-08'
  },
  {
    slug: 'alphabetical-autocomplete',
    name: 'Alphabetical Autocomplete',
    description: "An autocomplete field that's alphabetically sorted.",
    component: () =>
      import('@/components/alphabetical-autocomplete').then(mod => mod.default),
    categories: ['autocomplete', 'text-input'],
    createdAt: '2024-01-09'
  },
  {
    slug: 'saturn-datepicker',
    name: 'Saturn Date Picker',
    description: 'A calendar picker for Saturn.',
    component: () =>
      import('@/components/saturn-datepicker').then(mod => mod.default),
    categories: ['date-picker'],
    createdAt: '2024-01-10'
  },
  {
    slug: 'extremely-fast-carousel',
    name: 'The Extremely Fast Carousel',
    description:
      "A carousel so fast it's practically a nausea generator on a merry-go-round chassis.",
    component: () =>
      import('@/components/extremely-fast-carousel').then(mod => mod.default),
    categories: ['carousel'],
    createdAt: '2024-01-11'
  },
  {
    slug: 'dice-pagination',
    name: 'Dice Pagination',
    description: 'A pagination component that uses dice to navigate.',
    component: () =>
      import('@/components/dice-pagination').then(mod => mod.default),
    categories: ['pagination', 'random'],
    createdAt: '2024-01-12'
  },
  // Register the component in the components data file
  {
    slug: 'overburdened-modal',
    name: 'Overburdened Modal',
    description:
      'A modal that groans under the weight of its own content, sinking down the screen.',
    component: () =>
      import('@/components/overburdened-modal').then(mod => mod.default),
    categories: ['modal'],
    createdAt: '2025-03-23',
    featured: false
  },
  {
    slug: 'reverse-skeleton',
    name: 'Reverse Skeleton',
    description: 'See the form dissolve into a skeleton placeholder.',
    component: () =>
      import('@/components/reverse-skeleton').then(mod => mod.default),
    categories: ['skeleton'],
    createdAt: '2024-01-13'
  },
  {
    slug: 'blackhole-spinner',
    name: 'Black Hole Spinner',
    description:
      'A spinner that transforms into a black hole and takes your form to another dimension.',
    component: () =>
      import('@/components/blackhole-spinner').then(mod => mod.default),
    categories: ['spinner'],
    createdAt: '2024-01-14',
    featured: true
  },
  {
    slug: 'not-so-random-number-generator',
    name: 'Not So Random Number Generator',
    description:
      'A generator that starts with full randomness and decreases with each click.',
    component: () =>
      import('@/components/not-so-random-number-generator').then(
        mod => mod.default
      ),
    categories: ['random'],
    createdAt: '2024-01-15'
  },
  {
    slug: 'breathing-divider',
    name: 'Breathing Divider',
    description: 'A divider that breathes and moves.',
    component: () =>
      import('@/components/breathing-divider').then(mod => mod.default),
    categories: ['divider'],
    createdAt: '2024-01-16'
  },
  {
    slug: 'drunk-card',
    name: 'The Drunk Card',
    description:
      'A card component that wobbles and staggers like it had one too many drinks.',
    component: () => import('@/components/drunk-card').then(mod => mod.default),
    categories: ['card'],
    createdAt: '2024-03-20'
  },
  {
    slug: 'ghost-alert',
    name: 'Ghost Alert',
    description: 'A floating ghost alert that disappears after a while.',
    component: () =>
      import('@/components/ghost-alert').then(mod => mod.default),
    categories: ['alert'],
    createdAt: '2024-03-21'
  },
  {
    slug: 'scary-dark-mode',
    name: 'Scary Dark Mode',
    description: 'A dark mode that will keep you up at night.',
    component: () =>
      import('@/components/scary-dark-mode').then(mod => mod.default),
    categories: ['dark-mode'],
    createdAt: '2024-03-21'
  },
  {
    slug: 'molasses-slider',
    name: 'Molasses Slider',
    description: 'Watch the slider struggle to keep up.',
    component: () =>
      import('@/components/molasses-slider').then(mod => mod.default),
    categories: ['slider'],
    createdAt: '2024-03-22'
  },
  {
    slug: 'otp-slot-machine',
    name: 'OTP Slot Machine',
    description: 'A slot machine for filling out your One Time Passwords.',
    component: () =>
      import('@/components/otp-slot-machine').then(mod => mod.default),
    categories: ['random', 'password'],
    createdAt: '2024-03-23',
    featured: true
  },
  {
    slug: 'overly-attached-drag-item',
    name: 'Overly Attached Drag Item',
    description:
      'Drag items that cling to your cursor anywhere on the page and desperately beg not to be deleted.',
    component: () =>
      import('@/components/overly-attached-drag-item').then(mod => mod.default),
    categories: ['drag-and-drop'],
    createdAt: '2025-03-21',
    featured: true
  },
  {
    slug: 'historical-payment',
    name: 'Historical Payment Form',
    description:
      'A payment form that only accepts ancient forms of currency like shells, livestock, and spices.',
    component: () =>
      import('@/components/historical-payment').then(mod => mod.default),
    categories: ['form', 'payment'],
    createdAt: '2025-03-21',
    featured: true
  }
]

// Helper function to get unique categories
export const getUniqueCategories = (): ComponentCategory[] => {
  const categoriesSet = new Set<ComponentCategory>()

  componentsData.forEach(component => {
    component.categories.forEach(category => {
      categoriesSet.add(category)
    })
  })

  return Array.from(categoriesSet)
}
