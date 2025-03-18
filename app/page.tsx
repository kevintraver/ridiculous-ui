import type { Metadata } from "next"
import EscapingButton from "@/components/escaping-button"
import TalkingPasswordField from "@/components/talking-password"
import OvershareTooltip from "@/components/overshare-tooltip"
import SelfDestructingTextField from "@/components/self-destructing-field"
import DistractedProgressBar from "@/components/distracted-progress-bar"

export const metadata: Metadata = {
  title: "Ridiculous UI Controls",
  description: "A showcase of the most absurd UI controls ever created",
}

export default function RidiculousUIPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Ridiculous UI Controls</h1>
      <p className="text-lg text-muted-foreground mb-10 text-center max-w-2xl mx-auto">
        A collection of the most absurd, frustrating, and hilarious UI controls ever designed. They all work...
        technically.
      </p>

      <div className="grid gap-10">
        <section className="border rounded-lg p-6 bg-card">
          <h2 className="text-2xl font-bold mb-4">The Escaping Button</h2>
          <p className="mb-6 text-muted-foreground">
            This button doesn't want to be clicked and will run away from your cursor.
          </p>
          <EscapingButton />
        </section>

        <section className="border rounded-lg p-6 bg-card">
          <h2 className="text-2xl font-bold mb-4">The Talking Password Field</h2>
          <p className="mb-6 text-muted-foreground">
            A password field that helpfully announces each character you type out loud.
          </p>
          <TalkingPasswordField />
        </section>

        <section className="border rounded-lg p-6 bg-card">
          <h2 className="text-2xl font-bold mb-4">The Oversharing Tooltip</h2>
          <p className="mb-6 text-muted-foreground">
            A tooltip that gives you way more information than you'd ever need—or want.
          </p>
          <OvershareTooltip />
        </section>

        <section className="border rounded-lg p-6 bg-card">
          <h2 className="text-2xl font-bold mb-4">The Self-Destructing Text Field</h2>
          <p className="mb-6 text-muted-foreground">
            A text input that actively works against you by erasing your text as you type.
          </p>
          <SelfDestructingTextField />
        </section>

        <section className="border rounded-lg p-6 bg-card">
          <h2 className="text-2xl font-bold mb-4">The Distracted Progress Bar</h2>
          <p className="mb-6 text-muted-foreground">
            A progress bar with severe attention issues that keeps forgetting what it's supposed to be doing.
          </p>
          <DistractedProgressBar />
        </section>
      </div>
    </div>
  )
}

