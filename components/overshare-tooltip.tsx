'use client'

import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Settings, Info, Bell, User, Home, Mail } from 'lucide-react'

export default function OvershareTooltip() {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null)

  const tooltips = [
    {
      id: 'settings',
      icon: <Settings className='h-5 w-5' />,
      title: 'Settings',
      content: `You're hovering over the Settings icon. This icon was designed in 2023 by a self-taught graphic designer who drew inspiration from ancient Sumerian cuneiform. It's widely considered to be the universal sign for preferences, though some argue it's more about cogs and gears, representing the endless turning of life's complexities.

The gear icon has a fascinating history dating back to the Industrial Revolution. The specific gear ratio depicted in this icon (if you look closely) is 3.14159:1, which is, of course, π:1. This was chosen to represent the irrational yet perfect nature of good software design.

Did you know that in early versions of this UI, the settings icon was actually a wrench? The change to a gear was made after extensive A/B testing showed a 0.0023% increase in user engagement with the gear icon. This resulted in approximately $42.17 in additional revenue over a six-month period, which was celebrated with a small pizza party for the design team.

The specific shade of gray used in this icon (#6B7280) was selected after a 14-hour debate among the design team. Three designers quit during this meeting, and one had to be physically restrained when someone suggested using #6C7380 instead.

When clicked, this icon will take you to a settings page with 47 different options, most of which you'll never use or understand. The most commonly used setting is buried exactly 4 clicks deep, because our analytics showed that users enjoy a good treasure hunt.

The gear has exactly 8 teeth, representing the 8 hours you'll spend trying to find that one specific setting you need. Some say if you stare at the gear long enough, you can see it slowly rotating, but that's just eye strain from looking at screens too long.

In some cultures, a gear icon is considered a symbol of good fortune. In others, it's seen as an omen that your warranty is about to expire.

The icon is rendered using SVG paths, with exactly 127 lines of code, making it one of the most over-engineered icons in our collection. The designer responsible was given a promotion and now oversees our "Simplicity in Design" initiative.

If you're still reading this tooltip, you might be interested to know that the average user hovers over this icon for 0.47 seconds before clicking or moving away. You've now spent approximately 45 seconds reading this tooltip, putting you in the 99.9th percentile of settings icon enthusiasts.

Congratulations on your dedication to understanding this icon in excruciating detail. May your settings always be exactly where you expect them to be (they won't be).`
    },
    {
      id: 'info',
      icon: <Info className='h-5 w-5' />,
      title: 'Information',
      content: `This is the Information icon. It's designed to provide you with information about things you probably already know, but in case you don't, here's an exhaustive explanation.

The concept of "information" dates back to the dawn of human consciousness, when early humans first pointed at dangerous animals to warn others. This icon carries on that proud tradition, though the dangerous animals have been replaced by terms of service agreements and cookie policies.

The letter "i" in this icon is derived from the Latin word "informatio," meaning "conception" or "idea." The dot above the "i" represents the finite nature of knowledge in an infinite universe, a subtle reminder of human mortality while you're just trying to figure out how to use a dropdown menu.

Studies show that 78% of information icons are never clicked, 21% are clicked accidentally, and only 1% are clicked by people genuinely seeking information. Of that 1%, approximately 0.3% actually read the information provided, and 0.001% find it useful.

The specific blue color used in this icon (#3B82F6) was chosen because it tested well with focus groups who described it as "trustworthy," "calming," and "definitely a color." The designer originally wanted to use #3C83F7 but was overruled after a heated 3-hour meeting that included a PowerPoint presentation with 47 slides about color psychology.

When this icon was first implemented, it was 2 pixels taller. User testing revealed that those 2 pixels were causing 0.002% of users to experience mild anxiety, so they were removed in version 2.3.4 of our design system. This change was documented in a 15,000-word release note that nobody read.

The information icon has been featured in 17 academic papers about UI/UX design, none of which reached any meaningful conclusion beyond "icons should be recognizable," which cost various universities approximately $2.3 million in research funding.

If you've read this far, you might be interested to know that this tooltip contains exactly 1,842 characters, making it longer than the United States Constitution. Unlike the Constitution, however, this tooltip has no amendments, though our legal team has reviewed it 12 times just to be safe.

Thank you for your interest in the Information icon. For more information about information, please consult your nearest library, which ironically uses the same icon but in a much more useful context.`
    },
    {
      id: 'notifications',
      icon: <Bell className='h-5 w-5' />,
      title: 'Notifications',
      content: `You're currently hovering over the Notifications bell icon. This seemingly simple icon has a complex backstory that absolutely nobody asked for, but you're getting anyway.

The bell shape is based on a specific 19th-century school bell from a small village in the Swiss Alps. The designer's great-great-grandfather was the bell-ringer at that school and always claimed the bell had the "perfect resonance." No audio recordings exist to verify this claim.

The notification bell in digital interfaces dates back to early 2000s software, though the concept of notifications goes back much further. Ancient Romans used to send notifications via messenger boys, who would stand outside your villa and yell updates until you either acknowledged them or released the hounds.

Our specific implementation of this bell icon uses exactly 237 lines of CSS, including 42 lines dedicated solely to the subtle animation that plays when new notifications arrive. This animation was motion-captured from a real bell being rung by a professional bell-ringer who was paid $4,000 for a day's work, which consisted of ringing a bell 147 times while wearing motion-capture dots.

The notification system connected to this bell has been engineered to interrupt you at the worst possible moments, especially when you're in a flow state or about to fall asleep. This is not a bug but a feature, designed to keep you in a constant state of mild anxiety and FOMO.

In user testing, we discovered that 72% of users experience a small dopamine hit when they see a notification, followed by disappointment when they discover it's just another email from a service they signed up for seven years ago and forgot about. We've optimized for that initial dopamine hit.

The bell has a small clapper inside that you can't see in the icon, but rest assured, our designers spent 3 weeks debating its exact dimensions and material properties. The final decision was to make it from virtual bronze with a density of 8.73 g/cm³, a fact that has absolutely no impact on your user experience but cost us $17,000 in design hours.

If you click this bell, you'll see a dropdown of notifications, 90% of which you'll immediately mark as "read" without actually reading. The other 10% you'll open and then forget about anyway. Our metrics show the average time between receiving a "critical" notification and acting on it is approximately 3.7 days.

The subtle gradient on the bell icon transitions from #F59E0B at the top to #D97706 at the bottom, representing the journey from excitement (when you receive a notification) to disappointment (when you read it). This symbolism was unintentional but was retroactively included in our design documentation after an intern pointed it out.

Thank you for taking the time to read about our notification bell. This tooltip contains 2,341 characters, which means you've now spent approximately 1 minute and 30 seconds learning absolutely nothing of value about a bell icon. We hope this has been as enriching for you as it was expensive for us to design.`
    },
    {
      id: 'profile',
      icon: <User className='h-5 w-5' />,
      title: 'User Profile',
      content: `You've discovered the User Profile icon! This simple silhouette represents you, the user, though it looks nothing like you and is, in fact, a generic outline that somehow became the universal symbol for "human being" in digital interfaces.

The history of the user profile icon dates back to ancient cave paintings, where early humans drew stick figures to represent themselves. Our design team has evolved this concept all the way to... still basically a stick figure, but with a circle for a head. Innovation!

The specific user icon you're looking at was designed after a heated 6-month debate about whether the shoulders should be slightly rounded or perfectly straight. The rounded shoulder faction eventually won after presenting a 120-page research document proving that rounded shoulders were 0.02% more "friendly" according to a study with a sample size of 7 people, all of whom were designers on the team.

Our user testing revealed that 43% of users initially think this icon represents a bathroom sign, 27% think it's for customer support, and 30% correctly identify it as their profile. The remaining users were too busy trying to accomplish actual tasks to care about icon semantics.

The user profile system connected to this icon contains approximately 24 settings that you'll never change from their defaults, 13 privacy options that don't actually protect your privacy, and a profile picture upload feature that will make you take at least 7 selfies before settling on one you don't completely hate.

The icon is rendered using exactly 42 vector points, a number chosen because a designer on the team was reading "The Hitchhiker's Guide to the Galaxy" during development. This Easter egg has remained undiscovered for 3 years until this very tooltip revealed it.

When clicked, this icon reveals a dropdown menu with options that could easily be placed elsewhere in the interface, but we've consolidated them here because that's just what everyone else does, and our design team has a pathological fear of breaking conventions, no matter how arbitrary.

The subtle gray color of this icon (#6B7280) was selected after rejecting 17 nearly identical shades of gray. The final decision came down to a coin flip between #6B7280 and #6C7280, a difference so imperceptible that even the designers who fought about it for weeks couldn't tell them apart in a blind test.

If you've read this far, you might be interested to know that users spend an average of 7.3 minutes per month interacting with their profile settings, yet we dedicated approximately 4,300 development hours to perfecting this system. This represents a return on investment that our finance team has described as "mathematically impossible to justify."

Thank you for your interest in the User Profile icon. We hope this unnecessarily detailed explanation has enriched your life in some small, probably imperceptible way, much like the difference between #6B7280 and #6C7280.`
    },
    {
      id: 'home',
      icon: <Home className='h-5 w-5' />,
      title: 'Home',
      content: `Ah, you've hovered over the Home icon! This simple house-shaped icon represents the concept of "home" in our digital interface, because apparently, we needed a metaphor for "the main page" and "literally a tiny house" was the best we could come up with.

The home icon has been a staple of digital interfaces since the early days of the internet, when designers realized users needed a way to return to the starting point after getting hopelessly lost in poorly organized website hierarchies. Rather than fixing the navigation, we added a house icon. Problem solved!

Our specific implementation of the home icon is based on a Colonial-style American house, which is culturally specific and potentially confusing to users from regions where homes don't look like this. We considered using different house styles for different regions but decided that would require actual cultural sensitivity and research, so we stuck with the Colonial.

The house icon contains exactly 5 vector paths: a square for the main structure, a triangle for the roof, and three smaller rectangles representing windows and a door. This level of detail was achieved after 14 design iterations, during which we briefly considered adding a chimney before realizing that would push our icon budget over by 3KB, which our optimization team deemed "catastrophic."

In user testing, we discovered that 97% of users correctly identify this icon as "home" or "main page," making it one of our most successful icons. The remaining 3% thought it represented "real estate listings" or "The Sims," which we consider close enough.

The home icon is clicked approximately 3.7 times per user session, making it our most-used navigation element. Despite this, we've placed it in a slightly different position in every section of our application, ensuring users must hunt for it like a hidden Easter egg when they inevitably get lost.

The specific shade of gray used for this icon (#6B7280) was chosen to match our overall design system, though we briefly considered making it blue (#3B82F6) to make it stand out. This led to a 3-week debate about whether the home icon deserved "special treatment," which eventually escalated to involve the CEO, who wisely decided to "just keep it gray" before walking out of the meeting.

When clicked, this icon will take you back to the main page, erasing any unsaved work and resetting any filters you've painstakingly set up. We've determined this is a "user error" rather than a design flaw, because you should have somehow known to save your work before clicking the tiny house.

The home icon has remained virtually unchanged since the 1990s, proving that sometimes the best design is the one that's too entrenched to change, regardless of whether it makes sense in a modern context. After all, how many of our users actually live in Colonial-style houses with perfectly symmetrical windows?

Thank you for taking the time to learn about our home icon. This tooltip contains approximately 2,200 characters of information about a simple house icon that you already knew how to use. We hope this has been as informative for you as it was unnecessary for us to create.`
    },
    {
      id: 'messages',
      icon: <Mail className='h-5 w-5' />,
      title: 'Messages',
      content: `You're currently hovering over the Messages icon, represented by an envelope because apparently, the concept of digital messages is best conveyed by referencing a paper-based communication method that many of our younger users have never actually used.

The envelope icon has been the universal symbol for messages since the early days of email, despite the fact that digital messages have never been placed in physical envelopes. This skeuomorphic design choice has persisted through decades of UI evolution, proving that sometimes, the most nonsensical metaphors are the ones that stick around the longest.

Our specific envelope icon was designed with exactly 7 anchor points in the vector path, representing the 7 layers of the OSI network model, a reference so obscure and unnecessary that even our development team didn't notice it until this tooltip was written. The designer responsible claims it was "intentional" but cannot explain why it matters.

The subtle angle of the envelope flap (37.5 degrees) was chosen after extensive A/B testing revealed that users were 0.003% more likely to check their messages when the flap was at this precise angle versus the originally proposed 40 degrees. This microscopic improvement cost approximately $23,000 in design and testing resources.

In user research, we discovered that 82% of users experience a small spike in anxiety when they see a new message notification on this icon. We've optimized the notification badge to maximize this anxiety by making it bright red and positioning it slightly asymmetrically, ensuring it triggers both your attention and your latent OCD tendencies.

The messaging system connected to this icon has been engineered to group your messages in the least intuitive way possible, combining chronological, algorithmic, and seemingly random sorting methods to ensure you never quite know where to find that important message you saw earlier.

When clicked, this icon reveals your message inbox, which currently contains 37 unread messages that you're saving for "when you have time," 14 messages you've read but haven't responded to yet, and 3 messages from 2019 that you've starred as "important" but will never actually address.

The envelope design subtly changes based on whether you have unread messages, though the difference is so imperceptible (the flap angle changes to 38.2 degrees) that not a single user has ever noticed it. The designer responsible spent 3 weeks implementing this feature and considers it their finest work.

If you've read this far, you might be interested to know that users spend an average of 47 minutes per day checking and responding to messages, yet report that only 12% of these messages contain information that's actually relevant or important to them. The remaining 88% are mostly automated notifications, reply-all email chains, and people asking if you saw their previous message.

Thank you for your interest in the Messages icon. We hope this unnecessarily detailed explanation has given you a new appreciation for the humble envelope icon, or at least distracted you long enough that you now have 3 new unread messages waiting for your attention.`
    }
  ]

  return (
    <div className='flex flex-wrap gap-4 justify-center'>
      <TooltipProvider>
        {tooltips.map(tooltip => (
          <Tooltip
            key={tooltip.id}
            open={openTooltip === tooltip.id}
            onOpenChange={open => setOpenTooltip(open ? tooltip.id : null)}
          >
            <TooltipTrigger asChild>
              <Button variant='outline' size='icon' className='h-10 w-10'>
                {tooltip.icon}
                <span className='sr-only'>{tooltip.title}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side='bottom'
              align='center'
              className='w-[350px] max-h-[400px] overflow-y-auto p-4 text-sm'
            >
              <div className='space-y-2'>
                <h3 className='font-bold text-lg'>{tooltip.title}</h3>
                <div className='whitespace-pre-line'>{tooltip.content}</div>
                <div className='pt-2 text-xs text-right text-muted-foreground'>
                  {tooltip.content.length} characters of unnecessary information
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      <div className='w-full mt-4 text-center text-sm text-muted-foreground'>
        Hover over any icon above to reveal its unnecessarily detailed backstory
      </div>
    </div>
  )
}
