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
  Square,
  SquareEqual
} from 'lucide-react'

export type ComponentCategory =
  | 'button'
  | 'checkbox'
  | 'date-picker'
  | 'divider'
  | 'skeleton'
  | 'password'
  | 'progress'
  | 'slider'
  | 'spinner'
  | 'loading'
  | 'text-input'
  | 'tooltip'
  | 'autocomplete'
  | 'pagination'
  | 'breadcrumb'
  | 'carousel'
  | 'random'
  | 'card'

// Category icon mapping
export const categoryIcons: Record<ComponentCategory, React.ElementType> = {
  button: SquareMousePointer,
  checkbox: CheckSquare,
  'date-picker': Calendar,
  divider: SplitSquareVertical,
  skeleton: AlignLeft,
  password: KeyRound,
  progress: RectangleEllipsis,
  slider: Sliders,
  spinner: Loader,
  loading: Loader,
  'text-input': TextCursor,
  tooltip: MessageSquare,
  autocomplete: Keyboard,
  pagination: BookOpen,
  breadcrumb: ChevronsRight,
  carousel: GalleryHorizontal,
  random: Dices,
  card: SquareEqual
}

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
    createdAt: '2024-01-01',
    featured: true
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
    description:
      "An autocomplete field that's alphabetically sorted, practically a Sesame Street.",
    component: () =>
      import('@/components/alphabetical-autocomplete').then(mod => mod.default),
    categories: ['autocomplete'],
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
    slug: 'random-pagination',
    name: 'Random Dice Pagination',
    description:
      'A pagination component that uses dice to navigate, basically a Vegas slot machine for your webpage.',
    component: () =>
      import('@/components/random-pagination').then(mod => mod.default),
    categories: ['pagination', 'random'],
    createdAt: '2024-01-12'
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
    createdAt: '2024-01-14'
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
