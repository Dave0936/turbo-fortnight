import { PageHeader } from "@/components/landing/PageHeader";
import { Schedule } from "@/components/landing/Schedule";
import { AppBadges, CTA } from "@/components/landing/CTA";

export default function SchedulePage() {
  return (
    <>
      <PageHeader
        kicker="Weekly Timetable"
        title={"Every Day.\nEvery Discipline."}
        sub="All classes are booked online or through the Synergy app. Fully booked? Join the reserve list — it's exceptionally rare we don't get everyone in."
      />
      <Schedule />
      <section data-testid="schedule-booking-note" className="px-6 md:px-12 pb-32 md:pb-40 bg-[#EDE8DF]">
        <div className="border-t border-[#121212]/15 pt-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <h2 className="font-display font-bold uppercase tracking-tight text-3xl md:text-5xl text-[#121212]">
            Book In Seconds On The App
          </h2>
          <div>
            <p className="text-base leading-relaxed text-[#121212]/65 mb-8">
              Your Synergy account in the palm of your hand — browse the
              timetable, book classes, and manage your membership. Cancel up to
              5 hours before a class and your credit comes straight back.
            </p>
            <AppBadges dark />
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
